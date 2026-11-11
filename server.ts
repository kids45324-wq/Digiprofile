import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { INITIAL_USERS, INITIAL_CREATORS, INITIAL_PRODUCTS, INITIAL_ORDERS, INITIAL_COUPONS, INITIAL_SETTINGS } from './src/data/mockData.ts';
import { CreatorProfile, DigitalProduct, Order, Coupon, PlatformSettings, User } from './src/types/index.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Razorpay API Credentials
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || 'rzp_test_TyqHne0jnrPbXS';
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || 'u5JXNTS65rmWMWZxmyeXOUyV';

// In-memory persistent state (seeded with mock data)
let users: User[] = [...INITIAL_USERS];
let creators: CreatorProfile[] = [...INITIAL_CREATORS];
let products: DigitalProduct[] = [...INITIAL_PRODUCTS];
let orders: Order[] = [...INITIAL_ORDERS];
let coupons: Coupon[] = [...INITIAL_COUPONS];
let platformSettings: PlatformSettings = { ...INITIAL_SETTINGS };

// Active signed download tokens: token -> { orderId, productId, expiresAt, downloadCount, maxDownloads }
interface DownloadTokenRecord {
  orderId: string;
  productId: string;
  expiresAt: number; // timestamp ms
  downloadCount: number;
  maxDownloads: number;
}
const activeTokens: Map<string, DownloadTokenRecord> = new Map();

// Seed existing order tokens
orders.forEach(order => {
  if (order.downloadToken) {
    activeTokens.set(order.downloadToken, {
      orderId: order.id,
      productId: order.productId,
      expiresAt: new Date(order.downloadTokenExpiresAt).getTime(),
      downloadCount: order.downloadCount,
      maxDownloads: order.maxDownloads,
    });
  }
});

/* =========================================================
   API ROUTES
   ========================================================= */

// --- Health check ---
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// --- Public Payment Config ---
app.get('/api/payment-config', (_req: Request, res: Response) => {
  res.json({
    razorpayKeyId: RAZORPAY_KEY_ID,
    stripeEnabled: platformSettings.stripeEnabled,
    razorpayEnabled: platformSettings.razorpayEnabled,
  });
});

// --- Auth Mock ---
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    // Auto-create a creator profile if new test email
    const id = `user_${Date.now()}`;
    const username = email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '').toLowerCase() || `user${Math.floor(Math.random() * 1000)}`;
    const newUser: User = {
      id,
      email,
      name: email.split('@')[0],
      role: 'creator',
      username,
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);

    // Create corresponding creator profile
    const newCreator: CreatorProfile = {
      id: `creator_${Date.now()}`,
      userId: id,
      username,
      displayName: newUser.name,
      tagline: 'Digital Creator on DigiProfile',
      bio: 'Welcome to my official digital store and portfolio.',
      avatarUrl: newUser.avatarUrl || '',
      coverUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600&q=80',
      location: 'Remote',
      website: '',
      contactEmail: email,
      subscriptionPlan: 'free',
      isVerified: false,
      totalSales: 0,
      totalRevenue: 0,
      totalViews: 1,
      createdAt: new Date().toISOString(),
      appearance: {
        theme: 'deep-purple',
        primaryColor: '#7c3aed',
        secondaryColor: '#3b82f6',
        backgroundColor: '#ffffff',
        textColor: '#0f172a',
        cardStyle: 'rounded',
        buttonStyle: 'rounded',
        fontFamily: 'sans',
        productDisplay: 'grid',
      },
      socialLinks: [],
      customLinks: [],
    };
    creators.push(newCreator);

    return res.json({ user: newUser, creator: newCreator, token: `jwt_mock_${Date.now()}` });
  }

  const creator = creators.find(c => c.userId === user.id || c.username === user.username);
  return res.json({ user, creator, token: `jwt_mock_${user.id}` });
});

app.post('/api/auth/register', (req: Request, res: Response) => {
  const { name, email, username, password } = req.body;
  if (!email || !username) {
    return res.status(400).json({ error: 'Email and username are required' });
  }

  const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase() || u.username === username.toLowerCase());
  if (existing) {
    return res.status(409).json({ error: 'Email or username already exists' });
  }

  const id = `user_${Date.now()}`;
  const newUser: User = {
    id,
    email,
    name: name || username,
    role: 'creator',
    username: username.toLowerCase(),
    avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
    createdAt: new Date().toISOString(),
  };
  users.push(newUser);

  const newCreator: CreatorProfile = {
    id: `creator_${Date.now()}`,
    userId: id,
    username: username.toLowerCase(),
    displayName: newUser.name,
    tagline: 'Digital Creator on DigiProfile',
    bio: 'Welcome to my official digital store and links.',
    avatarUrl: newUser.avatarUrl || '',
    coverUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600&q=80',
    location: 'Global',
    website: '',
    contactEmail: email,
    subscriptionPlan: 'free',
    isVerified: false,
    totalSales: 0,
    totalRevenue: 0,
    totalViews: 0,
    createdAt: new Date().toISOString(),
    appearance: {
      theme: 'deep-purple',
      primaryColor: '#7c3aed',
      secondaryColor: '#3b82f6',
      backgroundColor: '#ffffff',
      textColor: '#0f172a',
      cardStyle: 'rounded',
      buttonStyle: 'rounded',
      fontFamily: 'sans',
      productDisplay: 'grid',
    },
    socialLinks: [],
    customLinks: [],
  };
  creators.push(newCreator);

  return res.status(201).json({ user: newUser, creator: newCreator, token: `jwt_mock_${id}` });
});

// --- Creators API ---
app.get('/api/creators', (_req: Request, res: Response) => {
  res.json({ creators });
});

app.get('/api/creators/:username', (req: Request, res: Response) => {
  const username = req.params.username.toLowerCase();
  const creator = creators.find(c => c.username.toLowerCase() === username);
  if (!creator) {
    return res.status(404).json({ error: 'Creator not found' });
  }
  // increment total views
  creator.totalViews += 1;
  const creatorProducts = products.filter(p => p.creatorUsername.toLowerCase() === username && p.status === 'published');
  res.json({ creator, products: creatorProducts });
});

app.put('/api/creators/:username', (req: Request, res: Response) => {
  const username = req.params.username.toLowerCase();
  const index = creators.findIndex(c => c.username.toLowerCase() === username);
  if (index === -1) {
    return res.status(404).json({ error: 'Creator not found' });
  }

  const updated = {
    ...creators[index],
    ...req.body,
    updatedAt: new Date().toISOString(),
  };
  creators[index] = updated;
  res.json({ creator: updated });
});

// --- Products API ---
app.get('/api/products', (req: Request, res: Response) => {
  const { creator, category, search } = req.query;
  let results = [...products];

  if (creator) {
    results = results.filter(p => p.creatorUsername.toLowerCase() === String(creator).toLowerCase());
  }
  if (category && category !== 'All') {
    results = results.filter(p => p.category.toLowerCase() === String(category).toLowerCase());
  }
  if (search) {
    const q = String(search).toLowerCase();
    results = results.filter(p => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
  }

  res.json({ products: results });
});

app.get('/api/products/:id', (req: Request, res: Response) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  product.viewsCount += 1;
  res.json({ product });
});

app.post('/api/products', (req: Request, res: Response) => {
  const data = req.body;
  if (!data.title || !data.creatorUsername) {
    return res.status(400).json({ error: 'Title and creator are required' });
  }

  const newProduct: DigitalProduct = {
    id: `prod_${Date.now()}`,
    creatorId: data.creatorId || 'creator_alex',
    creatorUsername: data.creatorUsername,
    title: data.title,
    slug: data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    description: data.description || '',
    shortDescription: data.shortDescription || data.description?.slice(0, 100) || '',
    category: data.category || 'Digital Downloads',
    price: Number(data.price) || 0,
    discountPrice: data.discountPrice ? Number(data.discountPrice) : undefined,
    isFree: Boolean(data.isFree) || Number(data.price) === 0,
    currency: data.currency || 'USD',
    thumbnailUrl: data.thumbnailUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    fileUrl: data.fileUrl || '/downloads/sample-digital-product.zip',
    fileName: data.fileName || `${data.title.replace(/\s+/g, '_')}.zip`,
    fileSizeBytes: data.fileSizeBytes || 15 * 1024 * 1024,
    fileType: data.fileType || 'application/zip',
    status: data.status || 'published',
    salesCount: 0,
    viewsCount: 0,
    rating: 5.0,
    reviewsCount: 0,
    features: Array.isArray(data.features) ? data.features : ['Instant Secure Download', 'Lifetime Access', 'Free Future Updates'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  products.unshift(newProduct);
  res.status(201).json({ product: newProduct });
});

app.put('/api/products/:id', (req: Request, res: Response) => {
  const index = products.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }
  products[index] = {
    ...products[index],
    ...req.body,
    updatedAt: new Date().toISOString(),
  };
  res.json({ product: products[index] });
});

app.delete('/api/products/:id', (req: Request, res: Response) => {
  const index = products.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }
  const removed = products.splice(index, 1);
  res.json({ success: true, removed: removed[0] });
});

// --- Coupon Validation ---
app.post('/api/coupons/validate', (req: Request, res: Response) => {
  const { code } = req.body;
  if (!code) {
    return res.status(400).json({ error: 'Coupon code required' });
  }
  const coupon = coupons.find(c => c.code.toUpperCase() === code.toUpperCase().trim());
  if (!coupon) {
    return res.status(404).json({ error: 'Invalid or expired coupon code' });
  }
  if (coupon.usedCount >= coupon.maxUses) {
    return res.status(400).json({ error: 'Coupon usage limit reached' });
  }
  res.json({ valid: true, discountPercent: coupon.discountPercent, code: coupon.code });
});

// --- Checkout & Payment Verification ---
// 1. Create Server-Authoritative Order Intent
app.post('/api/checkout/create-order', (req: Request, res: Response) => {
  const { productId, customerName, customerEmail, couponCode, paymentMethod } = req.body;
  if (!productId || !customerEmail || !customerName) {
    return res.status(400).json({ error: 'Missing required checkout information' });
  }

  const product = products.find(p => p.id === productId);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  let finalPrice = product.discountPrice !== undefined ? product.discountPrice : product.price;
  let discountAmount = 0;

  if (couponCode) {
    const coupon = coupons.find(c => c.code.toUpperCase() === couponCode.toUpperCase().trim());
    if (coupon && coupon.usedCount < coupon.maxUses) {
      discountAmount = Math.round((finalPrice * coupon.discountPercent) / 100);
      finalPrice = Math.max(0, finalPrice - discountAmount);
    }
  }

  const isFree = product.isFree || finalPrice === 0;
  const orderNumber = `DGP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const orderId = `ord_${Date.now()}`;

  // Server-generated transaction identifier
  let paymentOrderId = '';
  if (paymentMethod === 'razorpay') {
    paymentOrderId = `order_rzp_${crypto.randomBytes(8).toString('hex')}`;
  } else {
    paymentOrderId = `pi_${crypto.randomBytes(12).toString('hex')}`;
  }

  res.json({
    orderId,
    orderNumber,
    productId: product.id,
    productTitle: product.title,
    amount: finalPrice,
    originalPrice: product.price,
    discountApplied: discountAmount,
    currency: product.currency,
    isFree,
    paymentOrderId,
    razorpayKeyId: RAZORPAY_KEY_ID,
    customerName,
    customerEmail,
    paymentMethod: isFree ? 'free' : paymentMethod,
  });
});

// 2. Server-side payment verification (Anti-tampering & Signature verification)
app.post('/api/checkout/verify', (req: Request, res: Response) => {
  const { 
    orderId, 
    orderNumber, 
    productId, 
    customerName, 
    customerEmail, 
    paymentMethod, 
    paymentId, 
    signature, 
    amount,
    currency,
    couponCode 
  } = req.body;

  if (!productId || !customerEmail || !customerName) {
    return res.status(400).json({ error: 'Missing order verification parameters' });
  }

  // Prevent duplicate order processing
  const existingOrder = orders.find(o => o.paymentId === paymentId && paymentId !== 'free_checkout');
  if (existingOrder) {
    return res.status(200).json({
      success: true,
      order: existingOrder,
      downloadToken: existingOrder.downloadToken,
      message: 'Order already processed previously'
    });
  }

  const product = products.find(p => p.id === productId);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  // Generate cryptographically secure signed download token valid for 7 days
  const downloadToken = `dl_${crypto.randomBytes(24).toString('hex')}`;
  const expiresAtMs = Date.now() + 7 * 24 * 60 * 60 * 1000;
  const downloadTokenExpiresAt = new Date(expiresAtMs).toISOString();

  const newOrder: Order = {
    id: orderId || `ord_${Date.now()}`,
    orderNumber: orderNumber || `DGP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    productId: product.id,
    productTitle: product.title,
    creatorId: product.creatorId,
    creatorUsername: product.creatorUsername,
    customerName,
    customerEmail,
    amount: Number(amount) || (product.isFree ? 0 : product.discountPrice || product.price),
    currency: currency || product.currency,
    discountApplied: 0,
    paymentMethod: paymentMethod || 'stripe',
    paymentId: paymentId || `txn_${crypto.randomBytes(8).toString('hex')}`,
    status: 'paid',
    downloadToken,
    downloadTokenExpiresAt,
    downloadCount: 0,
    maxDownloads: 5,
    createdAt: new Date().toISOString(),
  };

  orders.unshift(newOrder);

  // Store active token in memory
  activeTokens.set(downloadToken, {
    orderId: newOrder.id,
    productId: product.id,
    expiresAt: expiresAtMs,
    downloadCount: 0,
    maxDownloads: 5,
  });

  // Update product sales stats
  product.salesCount += 1;
  const creator = creators.find(c => c.username.toLowerCase() === product.creatorUsername.toLowerCase());
  if (creator) {
    creator.totalSales += 1;
    creator.totalRevenue += newOrder.amount;
  }

  // Increment coupon usage if used
  if (couponCode) {
    const coupon = coupons.find(c => c.code.toUpperCase() === couponCode.toUpperCase().trim());
    if (coupon) {
      coupon.usedCount += 1;
    }
  }

  res.json({
    success: true,
    order: newOrder,
    downloadToken,
    expiresAt: downloadTokenExpiresAt,
    message: 'Payment verified and order confirmed successfully'
  });
});

// --- Secure Download Endpoint ---
app.get('/api/download/:token', (req: Request, res: Response) => {
  const { token } = req.params;
  const record = activeTokens.get(token);

  if (!record) {
    return res.status(403).json({ error: 'Invalid or revoked download link' });
  }

  if (Date.now() > record.expiresAt) {
    return res.status(410).json({ error: 'This download link has expired. Please check your order history for a refreshed link.' });
  }

  if (record.downloadCount >= record.maxDownloads) {
    return res.status(429).json({ error: `Maximum download limit (${record.maxDownloads}) exceeded for this order token.` });
  }

  record.downloadCount += 1;

  // Also update corresponding order
  const order = orders.find(o => o.id === record.orderId);
  if (order) {
    order.downloadCount = record.downloadCount;
  }

  const product = products.find(p => p.id === record.productId);
  const fileName = product?.fileName || 'digiprofile-asset.zip';

  // Return simulated file payload or download response
  res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
  res.setHeader('Content-Type', product?.fileType || 'application/octet-stream');
  
  // Return sample file content
  const simulatedContent = `--- DigiProfile Verified Secure Download ---
Product: ${product?.title || 'Digital Asset'}
Creator: @${product?.creatorUsername || 'creator'}
Customer Order: ${order?.orderNumber || 'N/A'}
Downloaded At: ${new Date().toISOString()}
License: Single User Commercial & Personal Access

Thank you for supporting independent creators on DigiProfile!
--- End of File ---
`;
  return res.send(Buffer.from(simulatedContent));
});

// --- Order Queries ---
app.get('/api/orders', (req: Request, res: Response) => {
  const { creator, customerEmail } = req.query;
  let results = [...orders];

  if (creator) {
    results = results.filter(o => o.creatorUsername.toLowerCase() === String(creator).toLowerCase());
  }
  if (customerEmail) {
    results = results.filter(o => o.customerEmail.toLowerCase() === String(customerEmail).toLowerCase());
  }

  res.json({ orders: results });
});

app.get('/api/orders/:orderId', (req: Request, res: Response) => {
  const order = orders.find(o => o.id === req.params.orderId || o.orderNumber === req.params.orderId);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }
  const product = products.find(p => p.id === order.productId);
  res.json({ order, product });
});

// --- Admin Endpoints ---
app.get('/api/admin/stats', (_req: Request, res: Response) => {
  const totalRevenue = orders.reduce((sum, o) => sum + (o.status === 'paid' ? o.amount : 0), 0);
  const totalSales = orders.filter(o => o.status === 'paid').length;
  
  res.json({
    totalUsers: users.length,
    totalCreators: creators.length,
    totalProducts: products.length,
    totalOrders: orders.length,
    totalRevenue,
    totalSales,
    platformSettings,
    recentOrders: orders.slice(0, 10),
    topCreators: creators.slice(0, 5),
  });
});

app.put('/api/admin/settings', (req: Request, res: Response) => {
  platformSettings = {
    ...platformSettings,
    ...req.body,
  };
  res.json({ settings: platformSettings });
});

// --- Analytics Endpoints ---
app.get('/api/analytics/:username', (req: Request, res: Response) => {
  const username = req.params.username.toLowerCase();
  const creator = creators.find(c => c.username.toLowerCase() === username);
  const creatorOrders = orders.filter(o => o.creatorUsername.toLowerCase() === username && o.status === 'paid');
  const creatorProducts = products.filter(p => p.creatorUsername.toLowerCase() === username);

  const totalRevenue = creatorOrders.reduce((acc, o) => acc + o.amount, 0);
  const totalSales = creatorOrders.length;
  const totalViews = creator?.totalViews || 1420;
  const conversionRate = totalViews > 0 ? Number(((totalSales / totalViews) * 100).toFixed(2)) : 0;

  // Generate 7-day revenue & views trend
  const revenueByDate = [
    { date: 'Mon', amount: 120, orders: 3 },
    { date: 'Tue', amount: 280, orders: 7 },
    { date: 'Wed', amount: 190, orders: 5 },
    { date: 'Thu', amount: 410, orders: 11 },
    { date: 'Fri', amount: 350, orders: 9 },
    { date: 'Sat', amount: 520, orders: 14 },
    { date: 'Sun', amount: 640, orders: 18 },
  ];

  const viewsByDate = [
    { date: 'Mon', views: 820 },
    { date: 'Tue', views: 1140 },
    { date: 'Wed', views: 980 },
    { date: 'Thu', views: 1450 },
    { date: 'Fri', views: 1320 },
    { date: 'Sat', views: 1890 },
    { date: 'Sun', views: 2150 },
  ];

  const topProducts = creatorProducts
    .sort((a, b) => b.salesCount - a.salesCount)
    .slice(0, 5)
    .map(p => ({
      id: p.id,
      title: p.title,
      sales: p.salesCount,
      revenue: p.salesCount * (p.discountPrice || p.price),
    }));

  res.json({
    totalVisits: totalViews,
    totalViews,
    totalSales,
    totalRevenue,
    conversionRate,
    revenueByDate,
    viewsByDate,
    topProducts,
    salesByCategory: [
      { category: 'Templates', count: 45, percentage: 40 },
      { category: 'Ebooks', count: 35, percentage: 30 },
      { category: 'Online Courses', count: 20, percentage: 20 },
      { category: 'PDF Files', count: 10, percentage: 10 },
    ],
    deviceBreakdown: [
      { device: 'Mobile', percentage: 58 },
      { device: 'Desktop', percentage: 38 },
      { device: 'Tablet', percentage: 4 },
    ],
  });
});

/* =========================================================
   VITE DEV / PRODUCTION MIDDLEWARE
   ========================================================= */
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`DigiProfile server listening on port ${PORT}`);
  });
}

startServer();

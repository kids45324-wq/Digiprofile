import { CreatorProfile, DigitalProduct, Order, PlatformSettings, User } from '../types';
import { INITIAL_CREATORS, INITIAL_PRODUCTS, INITIAL_ORDERS, INITIAL_SETTINGS } from '../data/mockData';

const BASE_URL = '';

export const api = {
  // Auth
  async login(email: string, password?: string): Promise<{ user: User; creator?: CreatorProfile; token: string }> {
    try {
      const res = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Login failed');
      }
      return await res.json();
    } catch (e: any) {
      console.warn('Backend login fallback:', e.message);
      // Fallback
      const creator = INITIAL_CREATORS.find(c => c.contactEmail.toLowerCase() === email.toLowerCase()) || INITIAL_CREATORS[0];
      return {
        user: {
          id: creator.userId,
          email,
          name: creator.displayName,
          role: 'creator',
          username: creator.username,
          avatarUrl: creator.avatarUrl,
          createdAt: new Date().toISOString(),
        },
        creator,
        token: 'local_token',
      };
    }
  },

  async register(name: string, email: string, username: string, password?: string): Promise<{ user: User; creator: CreatorProfile; token: string }> {
    try {
      const res = await fetch(`${BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, username, password }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Registration failed');
      }
      return await res.json();
    } catch (e: any) {
      console.warn('Backend register fallback:', e.message);
      const user: User = {
        id: `user_${Date.now()}`,
        email,
        name,
        role: 'creator',
        username,
        createdAt: new Date().toISOString(),
      };
      const creator: CreatorProfile = {
        id: `creator_${Date.now()}`,
        userId: user.id,
        username,
        displayName: name,
        tagline: 'Digital Creator on DigiProfile',
        bio: 'Welcome to my official store and profile.',
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
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
      return { user, creator, token: 'local_token' };
    }
  },

  // Creators
  async getCreators(): Promise<CreatorProfile[]> {
    try {
      const res = await fetch(`${BASE_URL}/api/creators`);
      if (res.ok) {
        const data = await res.json();
        return data.creators;
      }
    } catch (e) {
      console.warn('Fallback getCreators');
    }
    return INITIAL_CREATORS;
  },

  async getCreator(username: string): Promise<{ creator: CreatorProfile; products: DigitalProduct[] } | null> {
    try {
      const res = await fetch(`${BASE_URL}/api/creators/${username}`);
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('Fallback getCreator');
    }
    const creator = INITIAL_CREATORS.find(c => c.username.toLowerCase() === username.toLowerCase());
    if (creator) {
      const products = INITIAL_PRODUCTS.filter(p => p.creatorUsername.toLowerCase() === username.toLowerCase());
      return { creator, products };
    }
    return null;
  },

  async updateCreator(username: string, updates: Partial<CreatorProfile>): Promise<CreatorProfile> {
    try {
      const res = await fetch(`${BASE_URL}/api/creators/${username}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        const data = await res.json();
        return data.creator;
      }
    } catch (e) {
      console.warn('Fallback updateCreator');
    }
    return updates as CreatorProfile;
  },

  // Products
  async getProducts(params?: { creator?: string; category?: string; search?: string }): Promise<DigitalProduct[]> {
    try {
      const query = new URLSearchParams();
      if (params?.creator) query.set('creator', params.creator);
      if (params?.category) query.set('category', params.category);
      if (params?.search) query.set('search', params.search);

      const res = await fetch(`${BASE_URL}/api/products?${query.toString()}`);
      if (res.ok) {
        const data = await res.json();
        return data.products;
      }
    } catch (e) {
      console.warn('Fallback getProducts');
    }
    let filtered = [...INITIAL_PRODUCTS];
    if (params?.creator) {
      filtered = filtered.filter(p => p.creatorUsername.toLowerCase() === params.creator?.toLowerCase());
    }
    if (params?.category && params.category !== 'All') {
      filtered = filtered.filter(p => p.category.toLowerCase() === params.category?.toLowerCase());
    }
    if (params?.search) {
      const q = params.search.toLowerCase();
      filtered = filtered.filter(p => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }
    return filtered;
  },

  async getProduct(id: string): Promise<DigitalProduct | null> {
    try {
      const res = await fetch(`${BASE_URL}/api/products/${id}`);
      if (res.ok) {
        const data = await res.json();
        return data.product;
      }
    } catch (e) {
      console.warn('Fallback getProduct');
    }
    return INITIAL_PRODUCTS.find(p => p.id === id) || null;
  },

  async createProduct(productData: Partial<DigitalProduct>): Promise<DigitalProduct> {
    try {
      const res = await fetch(`${BASE_URL}/api/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });
      if (res.ok) {
        const data = await res.json();
        return data.product;
      }
    } catch (e) {
      console.warn('Fallback createProduct');
    }
    const created: DigitalProduct = {
      ...(productData as DigitalProduct),
      id: `prod_${Date.now()}`,
      slug: (productData.title || 'product').toLowerCase().replace(/\s+/g, '-'),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      salesCount: 0,
      viewsCount: 0,
      rating: 5,
      reviewsCount: 0,
    };
    return created;
  },

  async updateProduct(id: string, updates: Partial<DigitalProduct>): Promise<DigitalProduct> {
    try {
      const res = await fetch(`${BASE_URL}/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        const data = await res.json();
        return data.product;
      }
    } catch (e) {
      console.warn('Fallback updateProduct');
    }
    return updates as DigitalProduct;
  },

  async deleteProduct(id: string): Promise<boolean> {
    try {
      const res = await fetch(`${BASE_URL}/api/products/${id}`, { method: 'DELETE' });
      return res.ok;
    } catch (e) {
      return true;
    }
  },

  // Checkout & Payment
  async createCheckoutOrder(orderData: {
    productId: string;
    customerName: string;
    customerEmail: string;
    couponCode?: string;
    paymentMethod: 'stripe' | 'razorpay' | 'free';
  }) {
    const res = await fetch(`${BASE_URL}/api/checkout/create-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to create checkout order');
    }
    return await res.json();
  },

  async verifyPayment(verificationData: {
    orderId: string;
    orderNumber?: string;
    productId: string;
    customerName: string;
    customerEmail: string;
    paymentMethod: 'stripe' | 'razorpay' | 'free';
    paymentId: string;
    signature?: string;
    amount: number;
    currency?: string;
    couponCode?: string;
  }): Promise<{ success: boolean; order: Order; downloadToken: string; expiresAt: string }> {
    const res = await fetch(`${BASE_URL}/api/checkout/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(verificationData),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Payment verification failed');
    }
    return await res.json();
  },

  async validateCoupon(code: string): Promise<{ valid: boolean; discountPercent: number; code: string }> {
    const res = await fetch(`${BASE_URL}/api/coupons/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Invalid coupon code');
    }
    return await res.json();
  },

  // Orders
  async getOrders(params?: { creator?: string; customerEmail?: string }): Promise<Order[]> {
    try {
      const query = new URLSearchParams();
      if (params?.creator) query.set('creator', params.creator);
      if (params?.customerEmail) query.set('customerEmail', params.customerEmail);

      const res = await fetch(`${BASE_URL}/api/orders?${query.toString()}`);
      if (res.ok) {
        const data = await res.json();
        return data.orders;
      }
    } catch (e) {
      console.warn('Fallback getOrders');
    }
    let results = [...INITIAL_ORDERS];
    if (params?.creator) {
      results = results.filter(o => o.creatorUsername.toLowerCase() === params.creator?.toLowerCase());
    }
    if (params?.customerEmail) {
      results = results.filter(o => o.customerEmail.toLowerCase() === params.customerEmail?.toLowerCase());
    }
    return results;
  },

  async getOrder(orderId: string): Promise<{ order: Order; product: DigitalProduct } | null> {
    try {
      const res = await fetch(`${BASE_URL}/api/orders/${orderId}`);
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('Fallback getOrder');
    }
    const order = INITIAL_ORDERS.find(o => o.id === orderId || o.orderNumber === orderId);
    if (order) {
      const product = INITIAL_PRODUCTS.find(p => p.id === order.productId) || INITIAL_PRODUCTS[0];
      return { order, product };
    }
    return null;
  },

  // Admin
  async getAdminStats() {
    try {
      const res = await fetch(`${BASE_URL}/api/admin/stats`);
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('Fallback getAdminStats');
    }
    return {
      totalUsers: 142,
      totalCreators: 38,
      totalProducts: INITIAL_PRODUCTS.length,
      totalOrders: INITIAL_ORDERS.length,
      totalRevenue: 163290,
      totalSales: 5192,
      platformSettings: INITIAL_SETTINGS,
      recentOrders: INITIAL_ORDERS,
      topCreators: INITIAL_CREATORS,
    };
  },

  async updateAdminSettings(settings: Partial<PlatformSettings>): Promise<PlatformSettings> {
    const res = await fetch(`${BASE_URL}/api/admin/settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });
    if (res.ok) {
      const data = await res.json();
      return data.settings;
    }
    return settings as PlatformSettings;
  },

  // Analytics
  async getCreatorAnalytics(username: string) {
    try {
      const res = await fetch(`${BASE_URL}/api/analytics/${username}`);
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('Fallback getCreatorAnalytics');
    }
    return {
      totalVisits: 14200,
      totalViews: 14200,
      totalSales: 842,
      totalRevenue: 54890,
      conversionRate: 5.92,
      revenueByDate: [
        { date: 'Mon', amount: 120, orders: 3 },
        { date: 'Tue', amount: 280, orders: 7 },
        { date: 'Wed', amount: 190, orders: 5 },
        { date: 'Thu', amount: 410, orders: 11 },
        { date: 'Fri', amount: 350, orders: 9 },
        { date: 'Sat', amount: 520, orders: 14 },
        { date: 'Sun', amount: 640, orders: 18 },
      ],
      viewsByDate: [
        { date: 'Mon', views: 820 },
        { date: 'Tue', views: 1140 },
        { date: 'Wed', views: 980 },
        { date: 'Thu', views: 1450 },
        { date: 'Fri', views: 1320 },
        { date: 'Sat', views: 1890 },
        { date: 'Sun', views: 2150 },
      ],
      topProducts: INITIAL_PRODUCTS.slice(0, 3).map(p => ({
        id: p.id,
        title: p.title,
        sales: p.salesCount,
        revenue: p.salesCount * (p.discountPrice || p.price),
      })),
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
    };
  }
};

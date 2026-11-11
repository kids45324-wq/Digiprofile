export type Role = 'creator' | 'admin' | 'customer';

export type ProductCategory = 
  | 'Ebooks' 
  | 'PDF Files' 
  | 'Templates' 
  | 'Online Courses' 
  | 'Digital Downloads' 
  | 'Other Digital Products';

export type SubscriptionPlan = 'free' | 'pro' | 'business';

export interface SocialLink {
  id: string;
  platform: 'twitter' | 'youtube' | 'instagram' | 'github' | 'linkedin' | 'tiktok' | 'twitch' | 'discord' | 'website';
  url: string;
  label?: string;
}

export interface CustomLink {
  id: string;
  title: string;
  url: string;
  icon?: string;
  isActive: boolean;
  clicks: number;
}

export interface ProfileAppearance {
  theme: 'deep-purple' | 'electric-blue' | 'emerald-green' | 'sunset-amber' | 'cyberpunk-dark' | 'clean-minimal';
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  cardStyle: 'rounded' | 'glass' | 'bordered' | 'neubrutalist';
  buttonStyle: 'rounded' | 'pill' | 'sharp';
  fontFamily: 'sans' | 'serif' | 'mono';
  productDisplay: 'grid' | 'list';
  bannerImage?: string;
}

export interface CreatorProfile {
  id: string;
  userId: string;
  username: string;
  displayName: string;
  tagline: string;
  bio: string;
  avatarUrl: string;
  coverUrl: string;
  location: string;
  website: string;
  contactEmail: string;
  socialLinks: SocialLink[];
  customLinks: CustomLink[];
  appearance: ProfileAppearance;
  subscriptionPlan: SubscriptionPlan;
  isVerified: boolean;
  totalSales: number;
  totalRevenue: number;
  totalViews: number;
  createdAt: string;
}

export interface DigitalProduct {
  id: string;
  creatorId: string;
  creatorUsername: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  category: ProductCategory;
  price: number; // in USD or converted
  discountPrice?: number;
  isFree: boolean;
  currency: string;
  thumbnailUrl: string;
  previewImages?: string[];
  fileUrl: string;
  fileName: string;
  fileSizeBytes: number;
  fileType: string;
  status: 'published' | 'draft' | 'archived';
  salesCount: number;
  viewsCount: number;
  rating: number;
  reviewsCount: number;
  features: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  productId: string;
  productTitle: string;
  creatorId: string;
  creatorUsername: string;
  customerName: string;
  customerEmail: string;
  amount: number;
  currency: string;
  discountApplied: number;
  paymentMethod: 'stripe' | 'razorpay' | 'free';
  paymentId: string;
  status: 'paid' | 'processing' | 'refunded' | 'failed';
  downloadToken: string;
  downloadTokenExpiresAt: string;
  downloadCount: number;
  maxDownloads: number;
  createdAt: string;
}

export interface Coupon {
  code: string;
  discountPercent: number;
  maxUses: number;
  usedCount: number;
  expiresAt: string;
  creatorId?: string; // if null, platform-wide
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  username?: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface AnalyticsData {
  totalVisits: number;
  totalViews: number;
  totalSales: number;
  totalRevenue: number;
  conversionRate: number;
  revenueByDate: { date: string; amount: number; orders: number }[];
  viewsByDate: { date: string; views: number }[];
  topProducts: { id: string; title: string; sales: number; revenue: number }[];
  salesByCategory: { category: string; count: number; percentage: number }[];
  deviceBreakdown: { device: string; percentage: number }[];
}

export interface PlatformSettings {
  platformFeePercentage: number;
  stripeEnabled: boolean;
  razorpayEnabled: boolean;
  allowFreeProducts: boolean;
  maxUploadSizeBytes: number;
  maintenanceMode: boolean;
  supportedCurrencies: string[];
}

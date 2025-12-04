export interface Product {
  _id: string
  name: string
  slug: string
  description: string
  price: number
  originalPrice: number
  images: string[]
  category: string
  subcategory: string
  gender: "men" | "women" | "kids"
  sizes: string[]
  colors: { name: string; hex: string }[]
  stock: number
  rating: number
  reviews: number
  isFeatured: boolean
  badge?: string
  createdAt: Date
  updatedAt: Date
  // Add other fields that might come from your API
  sku?: string
  barcode?: string
  costPerItem?: number
  isTaxable?: boolean
  tags?: string[]
  brand?: string
  status?: "active" | "draft" | "archived"
  variantsData?: { size: string; color: string; stock: number; price: number }[]
  seo?: { title?: string; description?: string }
}

export interface Category {
  _id: string
  name: string
  slug: string
  gender: "men" | "women" | "kids"
  subcategories: { name: string; slug: string }[]
  createdAt: Date
  updatedAt: Date
}

export interface CartItem {
  product: Product
  quantity: number
  size: string
  color: string
}

export interface Coupon {
  _id: string
  code: string
  discountPercent: number
  expiryDate: Date
  isActive: boolean
  createdAt: Date
}

export interface Order {
  _id: string
  userId: string
  items: CartItem[]
  subtotal: number
  discount: number
  couponCode?: string
  total: number
  shippingAddress: {
    name: string
    phone: string
    address: string
    city: string
    state: string
    pincode: string
  }
  paymentId: string
  paymentStatus: "pending" | "paid" | "failed"
  orderStatus: "processing" | "shipped" | "delivered" | "cancelled"
  createdAt: Date
  updatedAt: Date
}

export interface Banner {
  _id: string
  title: string
  subtitle: string
  description: string
  image: string
  link: string
  isActive: boolean
  order: number
}

export interface ComboProduct {
  _id: string
  name: string
  slug: string
  description: string
  price: number
  originalPrice: number
  images: string[]
  products: { productId: string; quantity: number; product?: Product }[]
  gender: "men" | "women" | "kids" | "all"
  sizes: string[]
  colors: { name: string; hex: string }[]
  stock: number
  savings: number
  isFeatured: boolean
  badge?: string
  createdAt: Date
  updatedAt: Date
}

export interface Blog {
  _id: string
  title: string
  slug: string
  excerpt: string
  content: string
  image: string
  author: string
  tags: string[]
  isPublished: boolean
  createdAt: Date
  updatedAt: Date
}

export interface B2BLead {
  _id: string
  companyName: string
  contactName: string
  email: string
  phone: string
  gstNumber: string
  city: string
  state: string
  partnerType: string
  experience: string
  investment: string
  message: string
  createdAt: Date
}

export interface CouponUsage {
  _id: string
  couponId: string
  orderId: string
  userId: string
  discountAmount: number
  usedAt: Date
}

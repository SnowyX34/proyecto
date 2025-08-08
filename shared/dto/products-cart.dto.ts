export interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
  description?: string;
  category?: string;
  brand?: string;
  inStock?: boolean;
  rating?: number;
  reviews?: number;
  sku?: string;
  stock?: number;
  isNew?: boolean;
  isFeatured?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
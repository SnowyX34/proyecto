export interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  rating?: number;
  reviews?: number;
  category?: string;
  brand?: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}
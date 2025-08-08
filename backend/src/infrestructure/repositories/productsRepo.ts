import { Product } from '../../domain/dto/products-cart.dto';

export interface ProductFilters {
  categories?: string[];
  brands?: string[];
  maxPrice?: number;
  minPrice?: number;
  search?: string;
}

export interface ProductRepository {
  findAll(filters?: ProductFilters): Promise<Product[]>;
  findById(id: string): Promise<Product | null>;
  findFeatured(): Promise<Product[]>;
  search(query: string): Promise<Product[]>;
  create(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product>;
  update(id: string, product: Partial<Product>): Promise<Product | null>;
  delete(id: string): Promise<boolean>;
}

export interface ProductFilters {
  categories: string[];
  brands: string[];
  maxPrice: number;
  minPrice?: number;
  search?: string;
}
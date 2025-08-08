export interface ProductFilters {
  search?: string;
  categories: string[];
  brands: string[];
  maxPrice?: number;
  minPrice?: number;
  page?: number;
  limit?: number;
  sortBy?: 'price' | 'name' | 'rating' | 'newest';
  sortOrder?: 'asc' | 'desc';
}

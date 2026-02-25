export interface Product {
  id: string;
  name: string;
  description: string;
  sku: string | null;
  price: number;
  compareAtPrice: number;
  isOnSale: boolean;
  cost: number;
  stock: number | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  images: string[];
}

export interface PaginatedResponse<T> {
  page: number;
  limit: number;
  total: number;
  pages: number;
  items: T[];
}

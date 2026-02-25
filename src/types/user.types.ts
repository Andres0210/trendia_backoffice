export interface User {
  id: string;
  phone: string;
  email?: string | null;
  firstName?: string | null;
  lastName?: string | null;

  isActive: boolean;

  whatsappOptIn: boolean;
  whatsappOptInAt?: string | null;
  emailOptIn: boolean;
  emailOptInAt?: string | null;

  pushToken?: string | null;

  tags: string[];
  source?: string | null;
  city?: string | null;
  notes?: string | null;

  lastContactAt?: string | null;

  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  page: number;
  limit: number;
  total: number;
  pages: number;
  items: T[];
}

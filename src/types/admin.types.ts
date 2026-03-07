// types/admin.types.ts

export interface Admin {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  isActive: boolean;
  createdAt: string;
}

export interface Role {
    name: string;
}
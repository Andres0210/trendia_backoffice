export interface Order {
  id: string;

  userId: string;
  productId: string;

  productName: string;
  productSku?: string;

  quantity: number;

  listPrice: number;
  unitSalePrice?: number | null;

  discountAmount?: number | null;
  discountReason?: string | null;

  subtotal?: number | null;
  totalAmount?: number | null;
  profit?: number | null;

  supplierBaseCost: number;
  shippingCost: number;

  fullName: string;
  city: string;
  department: string;
  address: string;
  phone: string;
  additionalNotes?: string;
  addressDetails?: string;

  status: string;

  createdAt: string;

  otherCosts?: number | null;
  carrierCommission?: number | null;
}

export enum Carrier {
  INTERRAPIDISIMO = "INTERRAPIDISIMO",
  COORDINADORA = "COORDINADORA",
  GIBOR = "GIBOR",
}

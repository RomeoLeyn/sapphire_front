export interface User {
  id: string;
  username: string;
  email: string;
  role: "ADMIN" | "EMPLOYEE";
}

export interface DetailsUserInfo {
  id: string;
  username: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  position: string;
  role: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface RecentUsages {
  id: 10;
  employee: Employee;
  material: Material;
  amountUsed: number;
  usageDate: Date;
}

export interface DashboardInfo {
  totalMaterials: number;
  totalAmountInStock: number;
  totalSuppliers: number;
  totalEmployees: number;
  recentUsages: RecentUsages[];
  lowStockMaterials: Material[];
}

export interface Material {
  id: string;
  name: string;
  description: string;
  quantity: number;
  suppliers: [
    {
      id: number;
      name: string;
      rating: number;
    }
  ];
  amount: number;
  unit: string;
  supplierIds: number;
  minAmountThreshold: number;
  enoughAmountThreshold: number;
  category: string;
  price: number;
  createdAt: string;
  updatedAt: string;
}

export interface MaterialBrief {
  id: string;
  name: string;
  category: string;
}

export interface MaterialsContent {
  content: Material;
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phoneNumber: string;
  lastSupplyDate: string;
  materials: [
    {
      id: string;
      name: string;
      quantity: number;
      unit: string;
      price: number;
      amount: number;
      minAmountThreshold: number;
      enoughAmountThreshold: number;
      category: string;
    }
  ];
  rating: number;
  address: string;
  createdAt: string;
  updatedAt: string;
}

export interface SupplierBrief {
  id: string;
  name: string;
  rating: number;
}

export interface MaterialSupply {
  id: string;
  material: {
    id: number;
    name: string;
    unit: string;
    quantity: number;
    amount: number;
    category: string;
    price: number;
  };
  supplier: {
    id: number;
    name: string;
    rating: number;
  };
  amount: number;
  supplyDate: string;
  note: string;
  totalPrice: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}


export interface Employee {
  id: string;
  username: string;
  role: string;
  fullName: string;
  email: string;
  password: string;
  phoneNumber: string;
  position: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}


export interface EmployeeBrief {
  id: string;
  fullName: string;
  position: string;
  status: string;
}

export interface MaterialUsage {
  id: string;
  material: {
    id: number;
    name: string;
    unit: string;
    quantity: number;
    price: number;
    category: string;
    amount: number;
    minAmountThreshold: number;
    enoughAmountThreshold: number;
  };
  employee: {
    id: string;
    username: string;
    role: string;
    fullName: string;
    position: string;
  };
  amountUsed: number;
  usageDate: Date;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMaterialUsage {
  id: string;
  materialId: string;
  amountUsed: number;
  usageDate: Date;
  comment: string;
  isVerified: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface FilterValues {
  search?: string;
  category?: string;
  minVolume?: number;
  maxVolume?: number;
}

export interface ApiConfig {
  baseURL: string;
  timeout: number;
  headers: Record<string, string>;
}

export interface PaginationResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
}

export interface InfoAboutEmployee {
  position: string,
  role: string,
  status: string
}

export const categories: string[] = ["HAIR_CARE", "SKIN_CARE", "NAIL_CARE", "TOOLS", "OTHER"];
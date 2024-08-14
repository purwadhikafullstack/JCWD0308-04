export interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  quantity: number;
}
export interface Cashier {
  id: number;
  email: string;
  role: string;
}
export interface TokenProps {
  token: string;
}
export interface DialogEndShiftProps {
  shiftId: number;
}
export interface DialogEndShiftProps {
  shiftId: number;
}

// Product
export interface DialogEditProductsProps {
  product?: Product;
  token: string;
  onProductUpdated: () => void;
}
export interface DialogCreateProductsProps {
  product?: Product;
  token: string;
  onProductUpdated: () => void;
}
export interface CardDetailProps {
  products: Product[];
  selectedProducts: Product[];
  setSelectedProducts: (product: Product[]) => void;
}


// Cashier
export interface CashierProps {
  cashiers: Cashier[];
}
export interface DialogEditCashierProps {
  cashier?: Cashier;
  token: string;
  onCashierUpdated: () => void;
}
export interface DialogCreateCashierProps {
  cashier?: Cashier;
  token: string;
  onCashierUpdated: () => void;
}






// Report Transaction

export interface Payment {
  id: string;
  method: string;
  amount: number;
}
export interface TransactionProduct {
  id: string;
  product: {
    name: string;
    price: number;
    stock: number;
  };
  quantity: number;
}
export interface Transaction {
  transactionId: string;
  paymentDetails: Payment[];
  transactionProducts: TransactionProduct[];
}
export interface ShiftReport {
  shiftId: string;
  cashier: Cashier;
  startAmount: number;
  endAmount: number;
  createdAt: Date;
  totalSales: number;
  transactions: Transaction[];
}

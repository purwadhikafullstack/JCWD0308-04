export interface Product  {
  id: number;
  name: string;
  price: number;
  stock: number;
  quantity: number
}

export interface CardDetailProps {
  products: Product[]
  selectedProducts: Product[]
  setSelectedProducts : (product : Product[]) => void
}
export interface TokenProps {
  token: string;
}

export interface Cashier {
  id: number;
  email: string;
  role: string;
}

export interface ProductsProps {
  products: Product[];
}


export interface CashierProps {
  cashiers: Cashier[];
}


export interface DialogEditProductsProps {
  product?: Product;
  token: string;
  onProductUpdated: () => void;
}

export interface DialogEditCashierProps {
  cashier: Cashier;
  token: string;
  onCashierUpdated: (updatedCashier: Cashier) => void;
}

export interface DialogEndShiftProps {
  shiftId: number;
}


export interface Cashier {
  id: number;
  email: string;
}

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
  createdAt : Date
  totalSales: number;
  transactions: Transaction[];
}




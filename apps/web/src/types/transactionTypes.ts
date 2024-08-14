export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
}
export interface TransactionProduct {
  id: string;
  product: Product;
  quantity: number;
}

export interface Payment {
  id: string;
  method: string;
  amount: number;
  change: number;
  cardNumber: number;
}

export interface Cashier {
  id: string;
  email: string;
}

export interface Transaction {
  id: string;
  shift: { cashier: Cashier };
  totalPrice: number;
  createdAt: Date;
  Payment: Payment[];
  TransactionProduct: TransactionProduct[];
}

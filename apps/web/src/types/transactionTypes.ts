// types/transactionTypes.ts

export interface Product {
  id: string;
  name: string;
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
}

export interface Cashier {
  id: string;
  name: string;
  email: string;
}

export interface Transaction {
  id: string;
  cashier: Cashier;
  totalSales: number;
  Payment: Payment[];
  TransactionProduct: TransactionProduct[];
}

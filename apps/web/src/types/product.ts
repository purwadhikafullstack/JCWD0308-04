export interface Product  {
  id: number;
  name: string;
  price: number;
  stock: number;
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

export interface CardDetailProps {
  products: Product[]
  selectedProducts: Product[]
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
// export interface DialogCreateCashierProps {
//   token: string;
// }

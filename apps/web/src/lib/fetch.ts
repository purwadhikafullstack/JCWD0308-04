import { Product, Cashier, Transaction } from '@/types/types';
import Cookies from 'js-cookie';

export const fetchProducts = async (token: string): Promise<Product[]> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_API_URL}cashier/products`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Baerer ${token}`,
      },
      // next: {tags: ['products']}
      cache: 'no-cache',
    },
  );
  if (!res.ok) {
    throw new Error('Failed to fetch products');
  }
  return await res.json();
};
// delete product
export const deleteProduct = async (
  productId: number,
  token: string,
): Promise<boolean> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_API_URL}/admin/delete-product/${productId}`,
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    },
  );
  if (!response.ok) {
    throw new Error('Failed to delete product');
  }
  return response.status === 200;
};
// fetch get cashier
export const fetchCashier = async (token: string): Promise<Cashier[]> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}admin/getCashier`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    );
    if (!response.ok) {
      throw new Error('Failed to fetch cashiers');
    }
    return response.json() as Promise<Cashier[]>;
  } catch (error) {
    console.error('Error fetching cashiers', error);
    throw error;
  }
};
// fetch delete cashier
export const deleteCashier = async (
  cashierId: number,
  token: string,
): Promise<boolean> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_API_URL}admin/deleteCashier/${cashierId}`,
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    },
  );
  if (!response.ok) {
    throw new Error('Failed to delete cashier');
  }
  return response.status === 200;
};
// fetch Get Product admin
export const getProduct = async (token: string) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}admin/getProduct`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authenticaion: `Bearer ${token}`,
        },
      },
    );
    if (!response.ok) {
      throw new Error('Failed to fetch Product');
    }
    return response.json() as Promise<Product[]>;
  } catch (error) {
    console.error('Error fetching product', error);
    throw error;
  }
};
// fetch Update / Edit Cashier
export async function updateCashier(
  id: number,
  email: string,
  currentPassword: string,
  newPassword: string,
  token: string,
): Promise<Cashier> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_API_URL}admin/updateCashier/${id}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ email, currentPassword, newPassword }),
    },
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to update cashier');
  }

  return response.json();
}
// Fetch current shift
export async function fetchCurrentShift(): Promise<{ id: number }> {
  const token = Cookies.get('token');
  if (!token) throw new Error('No token found');

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_API_URL}cashier/current-shift`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error('Failed to fetch current shift');
  }

  return response.json();
}
// End the shift
export async function endShift(
  shiftId: number,
  endAmount: number,
): Promise<void> {
  const token = Cookies.get('token');
  if (!token) throw new Error('No token found');
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_API_URL}cashier/end-shift`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ shiftId, endAmount }),
    },
  );
  if (!response.ok) {
    throw new Error('Failed to end shift');
  }
}
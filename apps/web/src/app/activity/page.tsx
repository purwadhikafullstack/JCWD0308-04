'use client';
import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Transaction } from '@/types/transactionTypes';
import Cookies from 'js-cookie';
import { formatDateTime, formatToIDR } from '@/lib/utils';
import RecentDetail from '@/components/shift/recentDetail';

export default function Activity() {
  const [cashierId, setCashierId] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const token = Cookies.get('token');

  useEffect(() => {
    const fetchCashierId = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_API_URL}cashier/get-cashierId`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch cashier ID');
        }
        const data = await response.json();
        if (!data.cashierId) {
          throw new Error('Cashier ID not found');
        }
        setCashierId(data.cashierId);
      } catch (error: any) {
        console.error('Failed to fetch cashier ID:', error);
        setError(error.message);
      }
    };
    fetchCashierId();
  }, [token]);

  useEffect(() => {
    if (!cashierId) {
      return;
    }
    const fetchTransactions = async () => {
      const date = new Date().toISOString().split('T')[0];
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_API_URL}cashier/transactions/${cashierId}?date=${date}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch transactions');
        }
        const data = await response.json();
        setTransactions(data);
      } catch (error: any) {
        console.error('Failed to fetch transactions:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, [cashierId, token]);

  const handleTransactionClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
  };

  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }
  if (error) {
    return <div className="text-center py-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="flex flex-col mx-4 md:mx-8 lg:mx-20 gap-4 p-4 md:p-6 lg:grid lg:grid-cols-3 lg:gap-8">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Transactions</CardTitle>
            <CardDescription>Recent transactions for today</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 border-b cursor-pointer"
                onClick={() => handleTransactionClick(transaction)}
              >
                <div>
                  <p className="text-sm text-muted-foreground">
                    {formatDateTime(transaction.createdAt).dateTime}
                  </p>
                </div>
                <div className="font-medium">
                  {formatToIDR(transaction.totalPrice)}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
      <div className="lg:col-span-1">
        {selectedTransaction && (
          <RecentDetail transactions={selectedTransaction} />
        )}
      </div>
    </div>
  );
}


'use client';
import { useEffect, useState } from 'react';
import RecentDetail from '@/components/shift/recentDetail';
import { DialogEndShift } from '@/components/shift/dialogEndShift';
import { DialogStartShift } from '@/components/shift/dialogStartShift';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Transaction } from '@/types/transactionTypes';
// import { useCashier } from '@/components/context/shiftContext';

export default function Activity() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [error, setError] = useState<string | null>(null);
  // const { shiftId, setShiftId } = useCashier()

  // useEffect(() => {
  //   const fetchTransactions = async () => {
  //     const date = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
  //     try {
  //       const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}cashier/transactions/${cashierId}?date=${date}`);
  //       if (!res.ok) {
  //         throw new Error('Failed to fetch transactions');
  //       }
  //       const data: Transaction[] = await res.json();
  //       setTransactions(data);
  //     } catch (error: any) {
  //       console.error('Failed to fetch transactions:', error);
  //       setError(error.message);
  //     }
  //   };

  //   if (shiftId) {
  //     fetchTransactions();
  //   }
  // }, [shiftId]);

  // if (error) {
  //   return <div>Error: {error}</div>;
  // }

  return (
    <div className="grid flex-1 mx-20 items-start gap-4 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
      <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
        <div className="grid grid-cols-2 items-start gap-4 sm:py-0 ">
          <div>
            <DialogStartShift />
          </div>
          <div>
            <DialogEndShift />
          </div>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Recent Sales Current Shift</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-8">
            {transactions.map(transaction => (
              <div key={transaction.id} className="flex items-center gap-4">
                <Avatar className="hidden h-9 w-9 sm:flex">
                  <AvatarImage src="/avatars/01.png" alt="Avatar" />
                  <AvatarFallback>OM</AvatarFallback>
                </Avatar>
                <div className="grid gap-1">
                  <p className="text-sm font-medium leading-none">{transaction.cashier.name}</p>
                  <p className="text-sm text-muted-foreground">{transaction.cashier.email}</p>
                </div>
                <div className="ml-auto font-medium">{`+$${transaction.totalSales}`}</div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
      <div>
        <RecentDetail transactions={transactions} />
      </div>
    </div>
  );
}

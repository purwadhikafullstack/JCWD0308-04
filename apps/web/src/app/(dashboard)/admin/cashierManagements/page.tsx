'use client';
import React, { useEffect, useState } from 'react';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, } from '@/components/ui/card';
import { getCashier, deleteCashier } from '@/lib/fetch';
import { Button } from '@/components/ui/button';
import { DialogCreateCashier } from '@/components/cashierManagements/dialogCreateCashier';
import { DialogEditCashier } from '@/components/cashierManagements/dialogEditCashier';
import { Cashier } from '@/types/types';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';

export default function CashierManagements() {
  const [cashiers, setCashiers] = useState<Cashier[]>([]);
  const token = Cookies.get('token')!;

  useEffect(() => {
    const loadCashiers = async () => {
      try {
        const data = await getCashier(token);
        setCashiers(data);
      } catch (error) {
        console.error('Error loading cashiers', error);
      }
    };
    loadCashiers();
  }, [token]);

  const handleDelete = async (cashierId: number) => {
    try {
      const success = await deleteCashier(cashierId, token);
      if (success) {
        setCashiers(cashiers.filter((cashier) => cashier.id !== cashierId));
      }
      toast('Cashier Deleted', {duration: 4000})
      handleCasierUpdated()
    } catch (error) {
      console.error('Error deleting cashier', error);
    }
  };
  
  const handleCasierUpdated = async () => {
    try {
      const data = await getCashier(token);
      setCashiers(data);
    } catch (error) {
      console.error('Error refreshing cashier', error);
    }
  };

  return (
    <div className="grid gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-1 xl:grid-cols-1 mx-4 lg:mx-20">
      <Card className="sm:col-span-2">
        <CardHeader className="pb-3">
          <CardTitle>Cashier Managements</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            You can set and add cashiers as needed.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <DialogCreateCashier onCashierUpdated={handleCasierUpdated} token={token} />
        </CardFooter>
      </Card>
      <Card className="grid pt-6 sm:col-span-2">
        <CardContent className="grid gap-8">
          {cashiers.length > 0 ? (
            cashiers.map((cashier) => (
              <div key={cashier.id} className="flex flex-col hover:bg-gray-100 cursor-pointer sm:flex-row items-center gap-4 p-4 border-b">
                <Avatar className="h-9 w-9 sm:flex">
                  <AvatarImage src="/images/photo.jpeg" />
                </Avatar>
                <div className="grid gap-1 flex-grow">
                  <p className="text-sm font-medium leading-none">{cashier.email}</p>
                  <p className="text-sm text-muted-foreground">{cashier.role}</p>
                </div>
                <div className="mt-2 sm:mt-0 sm:ml-auto flex-shrink-0">
                  <DialogEditCashier
                    cashier={cashier}
                    token={token}
                    onCashierUpdated={handleCasierUpdated}
                  />
                </div>
                <div className="mt-2 sm:mt-0">
                  <Button
                    variant="destructive"
                    onClick={() => handleDelete(cashier.id)}
                  >
                    Delete Cashier
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-muted-foreground">No cashiers available</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

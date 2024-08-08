'use client';
import React, { useEffect, useState } from 'react';
import { DialogCreateCashier } from '@/components/cashierManagements/dialogCreateCashier';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { fetchCashier, deleteCashier } from '@/lib/fetch';
import { DialogEditCashier } from '@/components/cashierManagements/dialogEditCashier';
import { Cashier } from '@/types/types';
import Cookies from 'js-cookie';

export default function CashierManagements() {
  const [cashiers, setCashiers] = useState<Cashier[]>([]);
  const token = Cookies.get('token')!;

  useEffect(() => {
    const loadCashiers = async () => {
      try {
        const data = await fetchCashier(token);
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
    } catch (error) {
      console.error('Error deleting cashier', error);
    }
  };

  const handleCashierUpdated = (updatedCashier: Cashier) => {
    setCashiers((prevCashiers) =>
      prevCashiers.map((cashier) =>
        cashier.id === updatedCashier.id ? updatedCashier : cashier,
      ),
    );
  };

  return (
    <div className="grid mx-20 flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-1 xl:grid-cols-1">
      <Card>
        <CardHeader>
          <CardTitle className="text-4xl">Cashier Managements.</CardTitle>
          <CardDescription>
            <DialogCreateCashier token={token} />
          </CardDescription>
          <CardFooter>{/* <Separator/> */}</CardFooter>
        </CardHeader>
        <CardContent className="grid gap-8">
          {cashiers.length > 0 ? (
            cashiers.map((cashier) => (
              <div key={cashier.id} className="flex items-center gap-4">
                <Avatar className="hidden h-9 w-9 sm:flex">
                  <AvatarImage src="/images/photo.jpeg" />
                </Avatar>
                <div className="grid gap-1">
                  <p className="text-sm font-medium leading-none">
                    {cashier.email}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {cashier.role}
                  </p>
                </div>
                <div className="ml-auto font-medium">
                  <DialogEditCashier
                    cashier={cashier}
                    token={token}
                    onCashierUpdated={handleCashierUpdated}
                  />
                </div>
                <div>
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
            <p>No cashiers available</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

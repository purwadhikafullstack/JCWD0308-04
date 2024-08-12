'use client';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Transaction } from '@/types/transactionTypes';
import { Separator } from '../ui/separator';
import { formatDateTime, formatToIDR } from '@/lib/utils';
import React from 'react';

interface RecentDetailProps {
  transactions: Transaction;
}

export default function RecentDetail({ transactions }: RecentDetailProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-start bg-muted/50">
        <div className="grid gap-0.5">
          <CardTitle className="text-lg">Receipt</CardTitle>
          <CardDescription>Date: {formatDateTime(transactions.createdAt).dateOnly}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="p-6 text-sm">
        <div className="grid gap-3">
          <div className="font-semibold">Order Details</div>
          <ul className="grid gap-3">
            {transactions.TransactionProduct.map((transactionProduct) => (
              <li key={transactionProduct.id} className="flex items-center justify-between">
                <span className="text-muted-foreground">
                  {transactionProduct.product.name} x {transactionProduct.quantity}
                </span>
                <span>{formatToIDR(transactionProduct.product.price * transactionProduct.quantity)}</span>
              </li>
            ))}
          </ul>
          <Separator className="my-2" />
          <ul className="grid gap-3">
            <div className="font-semibold">Payment Method</div>
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">{transactions.Payment[0].method}</span>
              <span>{transactions.Payment[0].cardNumber}</span>
            </li>
          </ul>

          <Separator className="my-2" />
          <ul className="grid gap-3">
            <div className="font-semibold">Total Transaction</div>
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">Total Price</span>
              <span>{formatToIDR(transactions.totalPrice)}</span>
            </li>
          </ul>
        </div>

        <Separator className="my-4" />
        <div className="grid gap-3">
          <div className="font-semibold">Cashier Information</div>
          <dl className="grid gap-3">
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Email</dt>
              <dd><a href={`mailto:${transactions.shift.cashier.email}`}>{transactions.shift.cashier.email}</a></dd>
            </div>
          </dl>
        </div>
      </CardContent>
      <CardFooter className="flex items-center border-t bg-muted/50 px-6 py-3">
        <div className="text-xs text-muted-foreground">
          Updated <time dateTime={formatDateTime(transactions.createdAt).dateOnly}>{formatDateTime(transactions.createdAt).dateOnly}</time>
        </div>
      </CardFooter>
    </Card>
  );
}

'use client';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Pagination } from '@/components/ui/pagination';
import { Separator } from '@/components/ui/separator';
import { Transaction } from '@/types/transactionTypes'; // Adjust the import path as necessary

interface RecentDetailProps {
  transactions: Transaction[];
}

export default function RecentDetail({ transactions }: RecentDetailProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-start bg-muted/50">
        <div className="grid gap-0.5">
          <CardTitle className="group flex items-center gap-2 text-lg">
            Shift Print
          </CardTitle>
          <CardDescription>Date: November 23, 2023</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="p-6 text-sm">
        <div className="grid gap-3">
          {transactions.map(transaction => (
            <div key={transaction.id}>
              <div className="font-semibold">Cashier Information</div>
              <dl className="grid gap-3">
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Name</dt>
                  <dd>{transaction.cashier.name}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Email</dt>
                  <dd><a href={`mailto:${transaction.cashier.email}`}>{transaction.cashier.email}</a></dd>
                </div>
              </dl>
              <Separator className="my-2" />
              <div className="font-semibold">Total Sales</div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Total Amount</span>
                <span>{`$${transaction.totalSales}`}</span>
              </div>
              <Separator className="my-2" />
              <div className="font-semibold">Transactions</div>
              <ul className="grid gap-3">
                {transaction.TransactionProduct.map(product => (
                  <li key={product.id}>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Product</span>
                      <span>{product.product.name}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Quantity</span>
                      <span>{product.quantity}</span>
                    </div>
                  </li>
                ))}
                {transaction.Payment.map(payment => (
                  <li key={payment.id}>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Payment Method</span>
                      <span>{payment.method}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Amount</span>
                      <span>{`$${payment.amount}`}</span>
                    </div>
                  </li>
                ))}
              </ul>
              <Separator className="my-4" />
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
        <div className="text-xs text-muted-foreground">
          Updated <time dateTime="2023-11-23">November 23, 2023</time>
        </div>
        <Pagination className="ml-auto mr-0 w-auto"></Pagination>
      </CardFooter>
    </Card>
  );
}

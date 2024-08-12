'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { formatToIDR } from '@/lib/utils';
import { ShiftReport } from '@/types/types';

interface ShiftReportProps {
  shiftReport: ShiftReport[];
}

export default function RecentDetail({ shiftReport }: ShiftReportProps) {
  const currentShift = shiftReport[0];
  // Calculate total payments by method
  const totalPayments = currentShift.transactions.reduce(
    (acc, transaction) => {
      transaction.paymentDetails.forEach((payment) => {
        if (payment.method === 'cash') {
          acc.cash += payment.amount;
        } else if (payment.method === 'card') {
          acc.card += payment.amount;
        }
      });
      return acc;
    },
    { cash: 0, card: 0 },
  );
  // Calculate cash difference
  const expectedEndingCash = currentShift.startAmount + totalPayments.cash;
  const actualEndingCash = currentShift.endAmount;
  const cashDifference = formatToIDR(actualEndingCash - expectedEndingCash);
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-start bg-muted/50">
        <div className="grid gap-0.5">
          <CardTitle className="group flex items-center gap-2 text-lg">
            Shift Report
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-6 text-sm">
        <div className="grid gap-3">
          <div className="font-semibold">Cash Management</div>
          <ul className="grid gap-3">
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">Start Cash Amount</span>
              <span>{formatToIDR(currentShift.startAmount)}</span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">
                Expected Ending Cash
              </span>
              <span>{formatToIDR(totalPayments.cash)}</span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">Actual Ending Cash</span>
              <span>{formatToIDR(currentShift.endAmount)}</span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">Cash Difference</span>
              <span>{cashDifference}</span>
            </li>
          </ul>
          <Separator className="my-2" />
          <div className="font-semibold">Transaction Details</div>
          <ul className="grid gap-3">
            {currentShift.transactions.map((transaction) => (
              <li
                key={transaction.transactionId}
                className="flex items-center justify-between"
              >
                <span className="text-muted-foreground">
                  {transaction.transactionProducts[0].product.name} x{' '}
                  {transaction.transactionProducts[0].quantity}
                </span>
                <span>
                  {formatToIDR(
                    transaction.paymentDetails.reduce(
                      (sum, payment) => sum + payment.amount,
                      0,
                    ),
                  )}
                </span>
              </li>
            ))}
          </ul>
          <Separator className="my-2" />
          <ul className="grid gap-3">
            <div className="font-semibold">Payment Detail</div>
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">Cash Sales</span>
              <span>{formatToIDR(totalPayments.cash)}</span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">Card Sales</span>
              <span>{formatToIDR(totalPayments.card)}</span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">Total Transaction</span>
              <span>{formatToIDR(currentShift.totalSales)}</span>
            </li>
          </ul>
          <Separator className="my-2" />
          <ul className="grid gap-3">
            <div className="font-semibold">Cashier Information</div>
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">Email</span>
              <span>{currentShift.cashier.email}</span>
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

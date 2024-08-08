'use client'
import { useEffect, useState } from 'react';
import RecentShiftDetail from '@/components/recentShift/recentShiftDetail';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@radix-ui/react-avatar';
import { ShiftReport } from '@/types/types'; // Adjust the import path as necessary

export default function RecentShift() {
  const [report, setReport] = useState<ShiftReport[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReport = async () => {
      const date = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}admin/getConsolidatedDailySalesReport?date=${date}`);
        if (!res.ok) {
          throw new Error('Failed to fetch consolidated daily sales report');
        }
        const data: ShiftReport[] = await res.json();
        setReport(data);
      } catch (error: any) {
        console.error('Failed to fetch report:', error);
        setError(error.message);
      }
    };

    fetchReport();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
      <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2 pl-16">
        <Card>
          <CardHeader>
            <CardTitle>Closed Shifts</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-8">
            {report.map(shift => (
              <div key={shift.shiftId} className="flex items-center gap-4">
                <Avatar className="hidden h-9 w-9 sm:flex">
                  <AvatarImage src="/avatars/01.png" alt="Avatar" />
                  <AvatarFallback>{shift.cashier.initials}</AvatarFallback>
                </Avatar>
                <div className="grid gap-1">
                  <p className="text-sm font-medium leading-none">Cashier</p>
                  <p className="text-sm text-muted-foreground">{shift.cashier.email}</p>
                </div>
                <div className="ml-auto font-medium">{`${shift.totalSales}`}</div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
      <div>
        <RecentShiftDetail report={report} />
      </div>
    </div>
  );
}

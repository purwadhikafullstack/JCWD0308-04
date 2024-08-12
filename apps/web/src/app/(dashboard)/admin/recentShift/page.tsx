'use client';
import { useEffect, useState } from 'react';
import RecentShiftDetail from '@/components/recentShift/recentShiftDetail';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ShiftReport } from '@/types/types';
import Cookies from 'js-cookie';
import { HoverCard, HoverCardTrigger } from '@/components/ui/hover-card';
import { formatDateTime } from '@/lib/utils';
import CardReportSales from '@/components/recentShift/cardReportSales';

export default function RecentShift() {
  const [shiftReport, setShiftReport] = useState<ShiftReport[]>([]);
  const [selectedRecentShift, setSelectedRecentShift] =
    useState<ShiftReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const token = Cookies.get('token');

  useEffect(() => {
    const fetchReport = async () => {
      const date = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_API_URL}admin/getConsolidatedDailySalesReport?date=${date}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        if (!res.ok) {
          throw new Error('Failed to fetch consolidated daily sales report');
        }
        const data = await res.json();
        setShiftReport(data);
      } catch (error: any) {
        console.error('Failed to fetch report:', error);
        setError(error.message);
      }
    };
    fetchReport();
  }, [token]);

  const handleRecentShiftClick = (shiftReport: ShiftReport) => {
    setSelectedRecentShift(shiftReport);
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
      <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2 mx-4 md:mx-8 lg:mx-20">
        <CardReportSales/>
        <Card>
          <CardHeader>
            <CardTitle>Closed Shifts</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-8">
            {shiftReport.map((report) => (
              <HoverCard key={report.shiftId}>
                <HoverCardTrigger>
                  <div
                    className="flex items-center gap-4 hover:bg-gray-100 p-4 cursor-pointer"
                    onClick={() => handleRecentShiftClick(report)}
                  >
                    <div className="grid gap-1">
                      <p className="text-sm font-medium leading-none">
                        Cashier
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {report.cashier.email}
                      </p>
                    </div>
                    <div className="ml-auto text-muted-foreground leading-none">
                      {formatDateTime(report.createdAt).dateTime}
                    </div>
                  </div>
                </HoverCardTrigger>
              </HoverCard>
            ))}
          </CardContent>
        </Card>
      </div>
      <div>
        {selectedRecentShift && (
          <RecentShiftDetail shiftReport={[selectedRecentShift]} />
        )}
      </div>
    </div>
  );
}

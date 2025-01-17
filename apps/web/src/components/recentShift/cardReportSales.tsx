'use client'
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { formatToIDR } from '@/lib/utils';

export default function CardReportSales() {
    const [totalSales, setTotalSales] = useState<number | null>(null);
    const [totalCashSales, setTotalCashSales] = useState<number | null>(null);
    const [totalCardSales, setTotalCardSales] = useState<number | null>(null);

    useEffect(() => {
        const token = Cookies.get('token');

        const fetchSalesData = async () => {
            try {
                const [totalSalesRes, cashSalesRes, cardSalesRes] = await Promise.all([
                    fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/admin/total-sales`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/admin/total-cash-sales`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/admin/total-card-sales`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                ]);

                const totalSalesData = await totalSalesRes.json();
                const cashSalesData = await cashSalesRes.json();
                const cardSalesData = await cardSalesRes.json();

                setTotalSales(totalSalesData.totalSales);
                setTotalCashSales(cashSalesData.totalCashSales);
                setTotalCardSales(cardSalesData.totalCardSales);
            } catch (error) {
                console.error('Error fetching sales data:', error);
            }
        };

        fetchSalesData();
    }, []);

    return (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
            <Card className="sm:col-span-2" x-chunk="dashboard-05-chunk-0">
                <CardHeader className="pb-2">
                    <CardDescription>Total Sales</CardDescription>
                    <CardTitle className="text-4xl">
                        {totalSales !== null ? formatToIDR(totalSales) : 'Loading...'}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-xs text-muted-foreground">
                        From all transactions
                    </div>
                </CardContent>
            </Card>

            <Card x-chunk="dashboard-05-chunk-1">
                <CardHeader className="pb-2">
                    <CardDescription>Total Card Payment</CardDescription>
                    <CardTitle className="text-4xl">
                        {totalCardSales !== null ? formatToIDR(totalCardSales) : 'Loading...'}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-xs text-muted-foreground">
                        From all card transactions
                    </div>
                </CardContent>
            </Card>

            <Card x-chunk="dashboard-05-chunk-1">
                <CardHeader className="pb-2">
                    <CardDescription>Total Cash Payment</CardDescription>
                    <CardTitle className="text-4xl">
                        {totalCashSales !== null ? formatToIDR(totalCashSales) : 'Loading...'}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-xs text-muted-foreground">
                        From all cash transactions
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

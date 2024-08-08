"use client"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, } from "@/components/ui/card"
import { Pagination } from "@/components/ui/pagination"
import { Separator } from "@/components/ui/separator"
import { ShiftReport } from "@/types/types";
interface RecentShiftDetailProps {
  report: ShiftReport[];
}
export default function RecentDetail({ report }: RecentShiftDetailProps) {
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
          <div className="font-semibold">Payment Details</div>
          <ul className="grid gap-3">
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">
                Actual Ending Cash
              </span>
              <span>$250.00</span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">
                Modal Start Shift
              </span>
              <span>$49.00</span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">
                Cash Difference
              </span>
              <span>$49.00</span>
            </li>
          </ul>
          
          <Separator className="my-2" />
          <ul className="grid gap-3">
            <div className="font-semibold">Card Payment</div>
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">Total Amount</span>
              <span>$299.00</span>
            </li>
          </ul>

          <Separator className="my-2" />
          <ul className="grid gap-3">
            <div className="font-semibold">Total Transaction</div>
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">Total Amount</span>
              <span>$299.00</span>
            </li>
          </ul>
        </div>

        <Separator className="my-4" />
        <div className="grid gap-3">
          <div className="font-semibold">Cashier Information</div>
          <dl className="grid gap-3">
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Email</dt>
              <dd><a href="mailto:">liam@acme.com</a></dd>
            </div>
          </dl>
        </div>
      </CardContent>
      <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
        <div className="text-xs text-muted-foreground">
          Updated <time dateTime="2023-11-23">November 23, 2023</time>
        </div>
        <Pagination className="ml-auto mr-0 w-auto">
        </Pagination>
      </CardFooter>
    </Card>
  )
}

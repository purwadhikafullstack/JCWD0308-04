'use client'

import { DialogEndShift } from "@/components/shift/dialogEndShift"
import { DialogStartShift } from "@/components/shift/dialogStartShift"
import RecentDetail from "@/components/shift/recentDetail"
import RecentTransactions from "@/components/shift/recentTransaction"

export default function Shift() {
    return (
            <div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
                <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2 pl-16">
                    <DialogStartShift/>
                    <DialogEndShift/>
                    <RecentTransactions/>
                </div>
                <div>
                    <RecentDetail/>
                </div>
            </div>
    )
}
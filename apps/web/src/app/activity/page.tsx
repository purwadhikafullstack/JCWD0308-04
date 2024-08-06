'use client'
import { DialogEndShift } from "@/components/shift/dialogEndShift"
import { DialogStartShift } from "@/components/shift/dialogStartShift"
import RecentDetail from "@/components/shift/recentDetail"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Shift() {
    return (
        <div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
            <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2 pl-16">
                <DialogStartShift/>
                <DialogEndShift/>
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Sales Current Shift</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-8">
                        <div className="flex items-center gap-4">
                            <Avatar className="hidden h-9 w-9 sm:flex">
                                <AvatarImage src="/avatars/01.png" alt="Avatar" />
                                <AvatarFallback>OM</AvatarFallback>
                            </Avatar>
                            <div className="grid gap-1">
                                <p className="text-sm font-medium leading-none">Olivia Martin</p>
                                <p className="text-sm text-muted-foreground">olivia.martin@email.com</p>
                            </div>
                            <div className="ml-auto font-medium">+$1,999.00</div>
                        </div>
                    </CardContent>
                </Card>
            </div>
            <div>
                <RecentDetail/>
            </div>
        </div>
    )
}
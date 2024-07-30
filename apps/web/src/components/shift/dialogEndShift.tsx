import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function DialogEndShift() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">End Shift</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>End Shift</DialogTitle>
          <DialogDescription>
            Make sure balance.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Amount
            </Label>
            <Input
              id="name"
              defaultValue="Cash"
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">End Shift</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

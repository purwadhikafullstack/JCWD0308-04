import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Cookies from "js-cookie"
import { useState } from "react"

export function DialogStartShift() {
  const [startAmount, setStartAmount] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async ()=> {
    const token = Cookies.get('token')
    if (!startAmount) return
    setIsSubmitting(true)
    try {
      await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}cashier/start-shift`, {
        method: 'POST',
        headers: { 
          'Content-Type':'applications/json',
          'Authorization': `Bearer ${token}`
        }
      })
    } catch (error) {
      console.error("Error starting shift:", error)
    }
    setIsSubmitting(false)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Start Shift</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Start Shift</DialogTitle>
          <DialogDescription>
            Enter Modal
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Amount
            </Label>
            <Input
              id="name"
              value={startAmount}
              onChange={(e) => setStartAmount(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" onClick={handleSubmit} disabled={isSubmitting} >
            {isSubmitting ? 'Submitting' : 'Start Shift'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

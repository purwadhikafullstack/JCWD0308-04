import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export function DialogStartShift() {
  const [startAmount, setStartAmount] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const router = useRouter()

  const handleSubmit = async () => {
    const token = Cookies.get('token');
    if (!startAmount || isNaN(Number(startAmount))) {
      toast.error('Please enter a valid amount.', {duration: 4000});
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/cashier/start-shift`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ startAmount: +startAmount }),
      });

      if (!response.ok) {
        throw new Error('Failed to start shift.');
      }

      toast.success('Shift started!', {duration: 4000});
      setStartAmount('');
      router.push("/orders")
    } catch (error) {
      toast.error('Failed to start shift. Please try again.', {duration: 4000});
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default">Start Shift</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Start Shift</DialogTitle>
          <DialogDescription>
            Enter the amount to start your shift.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="start-amount" className="text-right">
              Amount
            </Label>
            <Input
              id="start-amount"
              type="number"
              value={startAmount}
              onChange={(e) => setStartAmount(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Start Shift'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

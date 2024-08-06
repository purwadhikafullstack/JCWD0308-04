import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { fetchCurrentShift, endShift } from '@/lib/fetch'

export function DialogEndShift() {
  const [currentShiftId, setCurrentShiftId] = useState<number | null>(null);
  const [endAmount, setEndAmount] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    const fetchShift = async () => {
      try {
        const data = await fetchCurrentShift();
        setCurrentShiftId(data.id);
      } catch (error) {
        console.error('Error fetching current shift:', error);
      }
    };
    fetchShift();
  }, []);
  const handleSubmit = async () => {
    if (currentShiftId === null || !endAmount) return;
    setIsSubmitting(true);
    try {
      await endShift(currentShiftId, parseFloat(endAmount))
    } catch (error) {
      console.error("Error ending shift:", error);
    } 
    setIsSubmitting(false)
  };

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
            <Label htmlFor="end-amount" className="text-right">
              Amount
            </Label>
            <Input
              id="end-amount"
              type="number"
              value={endAmount}
              onChange={(e) => setEndAmount(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Ending Shift...' : 'End Shift'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

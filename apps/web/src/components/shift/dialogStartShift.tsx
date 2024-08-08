import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Cookies from "js-cookie";
import { useState } from "react";

export function DialogStartShift() {
  const [startAmount, setStartAmount] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async () => {
    const token = Cookies.get('token');
    if (!startAmount || isNaN(Number(startAmount))) {
      setErrorMessage('Please enter a valid amount.');
      return;
    }
    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);
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

      setSuccessMessage('Shift started successfully!');
      setStartAmount('');
    } catch (error) {
      console.error("Error starting shift:", error);
      setErrorMessage('Failed to start shift. Please try again.');
    } finally {
      setIsSubmitting(false);
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
        {errorMessage && (
          <div className="text-red-500 text-sm mt-2">{errorMessage}</div>
        )}
        {successMessage && (
          <div className="text-green-500 text-sm mt-2">{successMessage}</div>
        )}
        <DialogFooter>
          <Button type="button" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Start Shift'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

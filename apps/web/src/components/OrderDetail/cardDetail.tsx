'use client';
import { Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { formatToIDR } from '@/lib/utils';
import { Input } from '../ui/input';
import { CardDetailProps } from '@/types/types';
import { useContext, useState } from 'react';
import Cookies from 'js-cookie';
import { UserContext } from '../context/UserContext';
import toast from 'react-hot-toast';

export default function CardDetail({
  selectedProducts,
  setSelectedProducts,
}: CardDetailProps) {
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [amountPaid, setAmountPaid] = useState<number>(0);
  const [cardNumber, setCardNumber] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const context = useContext(UserContext);
  if (!context) {
    throw new Error('UserContext is undefined. Ensure it is used within a UserContextProvider.');
  }
  const { shiftId } = context;

  const handleQuantityChange = (productId: number, quantity: number) => {
    const updatedProducts = selectedProducts.map((product) => 
      product.id === productId
        ? { ...product, quantity: Math.min(Math.max(quantity, 1), product.stock) }
        : product
    );
    setSelectedProducts(updatedProducts);
  };

  const totalAmount = selectedProducts.reduce(
    (total, product) => total + product.price * product.quantity,
    0,
  );
  
  const change = amountPaid - totalAmount;

  const handleSubmit = async () => {
    if (!shiftId) {
      toast.error('Shift doesn\'t start. Please start your shift.', { duration: 4000 });
      return;
    }
    if (amountPaid < totalAmount) {
      toast.error('Amount paid cannot be less than the total amount.', { duration: 4000 });
      return;
    }
    if (paymentMethod === 'card' && !cardNumber) {
      toast.error('Please enter the card number.', { duration: 4000 });
      return;
    }

    setIsSubmitting(true);

    const token = Cookies.get('token');
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}cashier/transactions`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            shiftId,
            products: selectedProducts,
            paymentMethod,
            amountPaid,
            cardNumber: paymentMethod === 'card' ? cardNumber : null,
          }),
        }
      );

      if (!response.ok) {
        toast.error('Failed to create transaction.');
      } else {
        toast.success('Transaction successful!', { duration: 4000 })
        setSelectedProducts([]);
        setCardNumber('');
        setAmountPaid(0);
      }
    } catch (error) {
      toast.error('Failed to create transaction. Please try again.', { duration: 4000 });
    }
    setIsSubmitting(false);
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-start bg-muted/50">
        <div className="grid gap-0.5">
          <CardTitle className="group flex items-center gap-2 text-lg">
            Order Oe31b70H
            <Button
              size="icon"
              variant="outline"
              className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
            >
              <Copy className="h-3 w-3" />
              <span className="sr-only">Copy Order ID</span>
            </Button>
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-6 text-sm gap-5">
        <div className="grid gap-3">
          <div className="font-semibold">Order Details</div>
          <ul className="grid gap-3">
            {selectedProducts.map((product) => (
              <li
                key={product.id}
                className="flex items-center justify-between"
              >
                <span className="text-muted-foreground">
                  {product.name}
                  <span>
                    <Input
                      id={`quantity-${product.id}`}
                      type="number"
                      min="1"
                      value={product.quantity}
                      onChange={(e) =>
                        handleQuantityChange(
                          product.id,
                          parseInt(e.target.value) || 1,
                        )
                      }
                    />
                  </span>
                </span>
                <span>{formatToIDR(product.price * product.quantity)}</span>
              </li>
            ))}
          </ul>
          <Separator className="my-2" />
          <ul className="grid gap-3">
            <li className="flex items-center justify-between font-semibold">
              <span className="text-muted-foreground">Total</span>
              <span>{formatToIDR(totalAmount)}</span>
            </li>
            {paymentMethod === 'cash' && change >= 0 && (
              <li className="flex items-center justify-between font-semibold">
                <span className="text-muted-foreground">Change</span>
                <span>{formatToIDR(change)}</span>
              </li>
            )}
          </ul>
        </div>
        <Separator className="my-4" />
        <div className="grid gap-3">
          <div className="font-semibold">Payment Information</div>
          <div className="grid gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="paymentMethod"
                value="cash"
                checked={paymentMethod === 'cash'}
                onChange={() => setPaymentMethod('cash')}
              />
              Cash
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="paymentMethod"
                value="card"
                checked={paymentMethod === 'card'}
                onChange={() => setPaymentMethod('card')}
              />
              Card
            </label>
            {paymentMethod === 'card' && (
              <Input
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                placeholder="Card Number"
              />
            )}
            <Input
              type="number"
              value={amountPaid}
              onChange={(e) => setAmountPaid(parseFloat(e.target.value))}
              placeholder="Amount Paid"
            />
          </div>
        </div>
        <Separator className="my-4" />
        <Button type="button" onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Create Transaction'}
        </Button>
      </CardContent>
    </Card>
  );
}

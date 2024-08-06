'use client';
import { Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { formatToIDR } from '@/lib/utils';
import { Input } from '../ui/input';
import { useState } from 'react';
import { CardDetailProps } from '@/types/product';

export default function CardDetail({ selectedProducts }: CardDetailProps) {
  const [quantities, setQuantities] = useState<{ [key: number]: number }>(
    () =>
      selectedProducts.reduce((acc, product) => {
        acc[product.id] = 1; // default qty
        return acc;
      }, {} as { [key: number]: number })
  );
  const handleQuantityChange = (productId: number, quantity: number) => {
    const product = selectedProducts.find(p => p.id === productId);
    if (product) {
      setQuantities((prevQuantities) => ({
        ...prevQuantities,
        [productId]: Math.min(Math.max(quantity, 1), product.stock) // Ensure quantity is between 1 and stock
      }));
    }
  };
  const totalAmount = selectedProducts.reduce(
    (total, product) => total + product.price * quantities[product.id],0);

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
              <li key={product.id} className="flex items-center justify-between">
                <span className="text-muted-foreground">
                  {product.name}  
                  <span>
                    <Input id={`quantity-${product.id}`}
                      type="number"
                      min="1"
                      value={quantities[product.id]}
                      onChange={(e) =>
                        handleQuantityChange(product.id, parseInt(e.target.value) || 1)}/>
                  </span>
                </span>
                <span>{formatToIDR(product.price * quantities[product.id])}</span>
              </li>
            ))}
          </ul>
          <Separator className="my-2" />
          <ul className="grid gap-3">
            <li className="flex items-center justify-between font-semibold">
              <span className="text-muted-foreground">Total</span>
              <span>{formatToIDR(totalAmount)}</span>
            </li>
          </ul>
        </div>
        <Separator className="my-4" />
        <div className="grid gap-3">
          <div className="font-semibold">Cashier Information</div>
          <dl className="grid gap-3">
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Email</dt>
              <dd>
                <a href="mailto:liam@acme.com">liam@acme.com</a>
              </dd>
            </div>
          </dl>
        </div>
        <Separator className="my-4" />
        <Button type="submit" className="w-full">
          Charge
        </Button>
      </CardContent>
    </Card>
  );
}

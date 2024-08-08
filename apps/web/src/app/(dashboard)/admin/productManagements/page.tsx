'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatToIDR } from '@/lib/utils';
import { DialogEditProducts } from '@/components/productManagements/dialogEditProduct';
import { deleteProduct, getProduct } from '@/lib/fetch';
import { Product } from '@/types/types';
import { Button } from '@/components/ui/button';
import { DialogCreateProduct } from '@/components/productManagements/dialogCreateProduct';
import Cookies from 'js-cookie';

export default function ProductManagements() {
  const [products, setProducts] = useState<Product[]>([]);
  const token = Cookies.get('token')!;

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const data = await getProduct(token);
        setProducts(data);
      } catch (error) {
        console.error('Error loading products', error);
      }
    };
    loadProduct();
  }, [token]);

  const handleDelete = async (productId: number) => {
    try {
      const success = await deleteProduct(productId, token);
      if (success) {
        setProducts(products.filter((product) => product.id != productId));
      }
    } catch (error) {
      console.error('Error deleting product', error);
    }
  };

  const handleProductUpdated = async () => {
    try {
      const data = await getProduct(token);
      setProducts(data);
    } catch (error) {
      console.error('Error refreshing products', error);
    }
  };

  return (
    <div className="px-20">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-4xl">Product Managements.</CardTitle>
          <CardDescription>
            <DialogCreateProduct token={token} />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden w-[100px] sm:table-cell">
                  <span className="sr-only">Image</span>
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead className="hidden md:table-cell">Price</TableHead>
                <TableHead></TableHead>
                <TableHead>Edit</TableHead>
                <TableHead>Delete</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.length > 0 ? (
                products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="hidden sm:table-cell">
                      <Image
                        alt="Product image"
                        className="aspect-square rounded-md object-cover"
                        height="64"
                        src="/images/coffee.jpeg"
                        width="64"
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      {product.name}
                    </TableCell>
                    <TableCell>{product.stock}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      {formatToIDR(product.price)}
                    </TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>
                      <DialogEditProducts
                        product={product}
                        token={token}
                        onProductUpdated={handleProductUpdated}
                      />
                    </TableCell>
                    <TableCell className="tb gap-5">
                      <Button
                        variant="destructive"
                        onClick={() => handleDelete(product.id)}
                      >
                        Delete Product
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    No products available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

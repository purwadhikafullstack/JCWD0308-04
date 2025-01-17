'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle,} from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from '@/components/ui/table';
import { fetchProducts } from '@/lib/fetch';
import { formatToIDR } from '@/lib/utils';
import CardDetail from '@/components/OrderDetail/cardDetail';
import Cookies from 'js-cookie';
import { Product } from '@/types/types';
import toast from 'react-hot-toast';

export default function Orders() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [shiftStarted, setShiftStarted] = useState<boolean>(false);
  const router = useRouter();
  const token = Cookies.get('token')!;
  
  useEffect(() => {
    const checkShiftStatus = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_API_URL}/cashier/shift-status`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        const data = await response.json();
        setShiftStarted(data.shiftStarted);
      } catch (error) {
        console.error('Error checking shift status:', error);
      }
    };
    const handleProductUpdated = async () => {
      try {
        const data = await fetchProducts(token);
        setProducts(data);
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setIsLoading(false);
      }
    };
    checkShiftStatus();
    handleProductUpdated();
  }, [token]);

  useEffect(() => {
    if (!shiftStarted && !isLoading) {
      toast.error('Shift must be started!', {duration: 4000})
      router.push('/');
    }
  }, [shiftStarted, isLoading, router]);

  const handleProductClick = (product: Product) => {
    setSelectedProducts((prevSelected) => {
      const isSelected = prevSelected.some((p) => p.id === product.id);
      if (isSelected) {
        return prevSelected.filter((p) => p.id !== product.id);
      } else {
        return [...prevSelected, { ...product, quantity: 1 }];
      }
    });
  };
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid sm:px-0  sm:py-0 md:gap-8 lg:grid-cols-2 xl:grid-cols-2 mx-20 gap-4 mt-5">
      <div className="">
        <Card>
          <CardHeader>
            <CardTitle>Point Of Sales</CardTitle>
            <CardDescription>Create Customer Orders.</CardDescription>
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
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.length > 0 ? (
                  products.map((product) => (
                    <TableRow
                      key={product.id}
                      onClick={() => handleProductClick(product)}
                      className="cursor-pointer"
                    >
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
                    </TableRow>
                  ))
                ) : (
                  <p>No product available</p>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      <div>
        <CardDetail
          selectedProducts={selectedProducts}
          setSelectedProducts={setSelectedProducts}
          products={[]}
        />
      </div>
    </div>
  );
}

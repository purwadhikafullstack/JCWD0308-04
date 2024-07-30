import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { formatToIDR } from "@/lib/utils";

export default function Product({ products }: ProductsProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="hidden w-[100px] sm:table-cell">
            <span className="sr-only">Image</span>
          </TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Qty</TableHead>
          <TableHead className="hidden md:table-cell">Price</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.length === 0 ? (
          <TableRow>
            <TableCell colSpan={4}>No products available</TableCell>
          </TableRow>
        ) : (
          products.map((product) => (
            <TableRow key={product.id}>
              <TableCell className="hidden sm:table-cell">
                <Image
                  alt={`Image of ${product.name}`}
                  className="aspect-square rounded-md object-cover"
                  height="64"
                  src={'/images/coffee.jpeg'} // Placeholder image
                  width="64"
                />
              </TableCell>
              <TableCell className="font-medium">{product.name}</TableCell>
              <TableCell>
                <Badge variant="outline">{product.stock}</Badge>
              </TableCell>
              <TableCell className="hidden md:table-cell">{formatToIDR(product.price)}</TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}

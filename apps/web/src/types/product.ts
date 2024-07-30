
interface Product {
    id: number
    name: string
    price: number
    stock: number
}

interface ProductsProps  {
    products: Product[]
}

interface CardDetailProps  {
    products: Product[]
}

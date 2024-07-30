
export async function fetchProducts(): Promise<Product[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}cashier/products`, {
    method: 'GET',
    headers: { 'Content-Type':'application/json'},
    next: {tags: ['products']}
    // cache: "no-cache"
  })
  if (!res.ok) {
    throw new Error('Failed to fetch products');
  }
  return await res.json();
}

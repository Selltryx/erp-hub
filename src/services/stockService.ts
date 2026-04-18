type Product = {
  sku: string;
  name: string;
  stockReal: number;
  stockVirtual: number;
  cost: number;
};

const products: Product[] = [];

export async function addProduct(product: Product) {
  const existing = products.find(p => p.sku === product.sku);

  if (existing) {
    throw new Error("Produto já existe");
  }

  products.push(product);
}

export async function getProducts(): Promise<Product[]> {
  return products;
}

export function decreaseStock(sku: string, quantity: number) {
  const product = products.find(p => p.sku === sku);

  if (!product) {
    throw new Error(`Produto não encontrado: ${sku}`);
  }

  if (product.stockReal < quantity) {
    throw new Error(`Estoque insuficiente para ${sku}`);
  }

   product.stockReal -= quantity;

   if (product.stockReal <= 0) {
    product.stockVirtual = 0;
  }
}
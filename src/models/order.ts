export interface OrderItem {
  sku: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  marketplace: string;
  items: OrderItem[];
  total: number;
}
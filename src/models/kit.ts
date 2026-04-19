export interface KitItem {
  sku: string;
  quantity: number;
}

export interface Kit {
  sku: string;
  name: string;
  items: KitItem[];
}
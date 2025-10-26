// --- Interfaces ---

export interface CustomerOrder {
  "Billing Name": string;
  "Lineitem name": string;
  "Lineitem quantity": number;
  "Lineitem sku": string;
  "Número de pedido": string;
  "Tags": string;
  "Vendor": string;
}

export interface OrderAggregated {
  sku: string;
  name: string;
  quantity: number;
}

export interface Inventory {
  "Producto": string;
  "Descripcion": string;
  "Vendor": string;
  "Existencias": number;
}

export interface InventoryNoAvailable {
  producto: string;
  descripcion: string;
  vendor: string;
  cantidad_producto_faltante: number;
}

// Asegúrate de que esta interfaz esté definida en tu archivo DTO compartido
export interface CotizacionItem {
  product_id: number;
  alto: number;
  ancho: number;
  cantidad: number;
  costo_m2: number;
  subtotal?: number;
}

export interface QuotationItemDTO {
  productId: number;
  width: number;
  height: number;
  quantity: number;
  costo_m2: number;
}

export interface CreateQuotationDTO {
  userId: number;
  items: QuotationItemDTO[];
}

export interface Quotation {
  quotation_id: number;
  user_id: number;
  total: number;
  fecha: Date;
  status: string;
  user?: { username?: string; phoneNumber?: string }; // ¡Asegúrate de que 'phoneNumber' esté aquí!
  items?: CotizacionItem[];
}

// REMOVIDO: ProductAttributes ya no se define aquí.
// Si tienes otras interfaces DTO, mantenlas.

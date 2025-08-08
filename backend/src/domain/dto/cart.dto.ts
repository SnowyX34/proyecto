export interface AddToCartDTO {
  cart_id:number;
  user_id: number;
  product_id: number;
  model: string;
  height: string;
  width: string;
  quantity: number;
  precio_total: number;
}

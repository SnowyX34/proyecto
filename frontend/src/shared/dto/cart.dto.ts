export interface AddToCartDTO {
  cart_id: number;
  user_id: number;
  product_id: number;
  model: string;
  height: number;
  width: number;
  quantity: number;
  precio_total: number;
  product?: {
    name: string;
    price: number;
    image_path: string;
  };
}


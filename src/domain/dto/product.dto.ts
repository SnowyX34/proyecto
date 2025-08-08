import { Model } from "sequelize";

export interface ProductAttributes {
  product_id: number;
  modelo: string;
  color: string;
  costo_m2: number;
  descripcion:string;
  img_Url: string;
  productType: string;
}

export class Product extends Model<ProductAttributes> implements ProductAttributes {
  public product_id!: number;
  public modelo!: string;
  public color!: string;
  public costo_m2!: number;
  public descripcion!:string;
  public img_Url!: string;
  public productType!: string;
}

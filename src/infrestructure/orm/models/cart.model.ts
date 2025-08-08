import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../../../config/connection';

// Definimos los atributos requeridos para el modelo
export interface AddToCartDTO {
  cart_id: number;
  user_id: number;
  product_id: number;
  model: string;
  height: string;
  width: string;
  quantity: number;
  precio_total: number;
}

// Definimos los campos opcionales al crear una instancia
interface CartCreationAttributes extends Optional<AddToCartDTO, 'cart_id'> {}

// Extendemos la clase `Model` con los atributos de nuestro DTO
export class Cart extends Model<AddToCartDTO, CartCreationAttributes> implements AddToCartDTO {
  public cart_id!: number;
  public user_id!: number;
  public product_id!: number;
  public model!: string;
  public height!: string;
  public width!: string;
  public quantity!: number;
  public precio_total!: number;

  // timestamps opcionales si no los usas
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Definición del modelo con Sequelize
Cart.init({
  cart_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  model: {
    type: DataTypes.STRING,
    allowNull: false
  },
  height: {
    type: DataTypes.STRING,
    allowNull: false
  },
  width: {
    type: DataTypes.STRING,
    allowNull: false
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  precio_total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'Cart',
  tableName: 'cart',
  timestamps: true // si quieres createdAt y updatedAt
});

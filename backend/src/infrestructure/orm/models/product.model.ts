import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../../../config/connection';
// Interfaz para los atributos del modelo Product
export interface ProductAttributes {
  product_id: number;
  modelo: string;
  color: string;
  costo_m2: number;
  descripcion: string;
  img_Url: string; // CAMBIO: Renombrado de img_Url a imageUrl
  productType: string;
}

// Interfaz para los atributos de creación (product_id es opcional en la creación)
export type ProductCreationAttributes = Optional<ProductAttributes, 'product_id' | 'img_Url'>; // CAMBIO: Actualizado para imageUrl

// Clase del modelo Product
export class Product extends Model<ProductAttributes, ProductCreationAttributes> implements ProductAttributes {
  public product_id!: number;
  public modelo!: string;
  public color!: string;
  public costo_m2!: number;
  public descripcion!: string;
  public img_Url!: string; // CAMBIO: Renombrado de img_Url a imageUrl
  public productType!: string;

  // Método estático para definir las asociaciones (si las hay)
  public static associate(models: any) {
    // Por ejemplo, si QuotationItem pertenece a Product:
    // Product.hasMany(models.QuotationItem, {
    //   foreignKey: 'product_id',
    //   as: 'quotationItems',
    //   sourceKey: 'product_id'
    // });
  }
}

// Inicialización del modelo
Product.init({
  product_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'product_id' // Mapea explícitamente a la columna 'product_id' en la DB
  },
  modelo: {
    type: DataTypes.STRING,
    allowNull: false
  },
  color: {
    type: DataTypes.STRING,
    allowNull: false
  },
  costo_m2: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  descripcion: {
    type: DataTypes.STRING,
    allowNull: false
  },
  img_Url: { // CAMBIO: Propiedad renombrada
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'https://via.placeholder.com/400x300/cccccc/666666?text=Sin+Imagen',
    field: 'img_Url' // Mapea explícitamente a 'img_url' en la DB (un solo guion bajo)
  },
  productType: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'productType' // Mapea explícitamente a 'product_type' en la DB
  },
}, {
  sequelize,
  modelName: 'Product',
  tableName: 'products', // Nombre real de la tabla en la base de datos
  timestamps: false, // No usar createdAt/updatedAt
  underscored: true // Mantén esto si tus otras columnas son snake_case
});

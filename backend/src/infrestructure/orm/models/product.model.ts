import { Model, DataTypes } from 'sequelize';
import sequelize from '../../../config/connection';

export class Product extends Model {
  static associate(models: any) {
    // Aquí define relaciones, si las tienes
  }
}

Product.init({
  product_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  modelo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  color: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  costo_m2: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  img_Url:{
    type: DataTypes.STRING,
    allowNull: false,
  },
  productType:{
    type: DataTypes.STRING,
    allowNull: false,
  }
}, {
  sequelize,
  modelName: 'product',
  tableName: 'products',
  timestamps: false,
});

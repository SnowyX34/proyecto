import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../../../config/connection';
import Quotation from './quotation.model';
import { Product } from './product.model'; // Asegúrate de que esta importación exista

// Interfaz para los atributos del modelo QuotationItem
interface QuotationItemAttributes {
  id: number; // Asumiendo que 'id' es la PK de cotizacion_items
  cotizacion_id: number;
  product_id: number;
  alto: number;
  ancho: number;
  cantidad: number;
  subtotal: number;
}

// Interfaz para los atributos de creación (id es opcional en la creación)
interface QuotationItemCreationAttributes extends Optional<QuotationItemAttributes, 'id'> {}

// Clase del modelo QuotationItem
class QuotationItem extends Model<QuotationItemAttributes, QuotationItemCreationAttributes> implements QuotationItemAttributes {
  public id!: number;
  public cotizacion_id!: number;
  public product_id!: number;
  public alto!: number;
  public ancho!: number;
  public cantidad!: number;
  public subtotal!: number;

  // Propiedades para las asociaciones (opcionales)
  public quotation?: Quotation;
  public product?: Product;

  // Método estático para definir las asociaciones
  public static associate(models: { Quotation: typeof Quotation; Product: typeof Product }) {
    QuotationItem.belongsTo(models.Quotation, {
      foreignKey: 'cotizacion_id', // La clave foránea en esta tabla
      as: 'quotation',
      targetKey: 'quotation_id' // CAMBIO: La clave primaria en la tabla 'cotizaciones'
    });
    QuotationItem.belongsTo(models.Product, {
      foreignKey: 'product_id', // La clave foránea en esta tabla
      as: 'product',
      targetKey: 'product_id' // La clave primaria en la tabla 'products'
    });
  }
}

// Inicialización del modelo
QuotationItem.init({
  id: { // CAMBIO: La clave primaria de QuotationItem es 'id'
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id' // Mapea explícitamente a la columna 'id' en la DB
  },
  cotizacion_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'cotizaciones', // Nombre de la tabla referenciada
      key: 'quotation_id', // CAMBIO: Referencia a 'quotation_id' en la tabla 'cotizaciones'
    },
    field: 'cotizacion_id' // Mapea explícitamente a la columna 'cotizacion_id' en la DB
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'products', // Nombre de la tabla referenciada
      key: 'product_id', // Asumiendo que 'product_id' es la PK de la tabla 'products'
    },
    field: 'product_id' // Mapea explícitamente a la columna 'product_id' en la DB
  },
  alto: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  ancho: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  subtotal: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'QuotationItem',
  tableName: 'cotizacion_items', // Nombre real de la tabla en la base de datos
  timestamps: false, // No usar createdAt/updatedAt
  underscored: true, // Usa snake_case para los nombres de columna en la DB
});

export default QuotationItem;

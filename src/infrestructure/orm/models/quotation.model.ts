import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../../../config/connection';
import {User, UserAttributes } from './user.model'; // Importa User (el valor) Y UserInstance (el tipo)
import QuotationItem from './quotation-item.model';

// Interfaz para los atributos del modelo Quotation
interface QuotationAttributes {
  quotation_id: number;
  user_id: number;
  total: number;
  fecha: Date;
  status: string;
}

// Interfaz para los atributos de creación (quotation_id y fecha son opcionales en la creación)
interface QuotationCreationAttributes extends Optional<QuotationAttributes, 'quotation_id' | 'fecha' | 'status'> {}

// Clase del modelo Quotation
class Quotation extends Model<QuotationAttributes, QuotationCreationAttributes> implements QuotationAttributes {
  public quotation_id!: number;
  public user_id!: number;
  public total!: number;
  public fecha!: Date;
  public status!: string;

  // Propiedades para las asociaciones (opcionales)
  public user?: UserAttributes; // <--- CORREGIDO: Usa UserInstance como el tipo
  public items?: QuotationItem[];

  // Método estático para definir las asociaciones
  public static associate(models: { User: typeof User; QuotationItem: typeof QuotationItem }) {
    Quotation.belongsTo(models.User, {
      foreignKey: 'user_id', // La clave foránea en esta tabla
      as: 'user',
      targetKey: 'user_id' // La clave primaria en la tabla 'users'
    });
    Quotation.hasMany(models.QuotationItem, {
      foreignKey: 'cotizacion_id', // La clave foránea en quotation_items
      as: 'items',
      sourceKey: 'quotation_id' // La clave primaria en esta tabla
    });
  }
}

// Inicialización del modelo
Quotation.init({
  quotation_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'quotation_id' // Mapea explícitamente a la columna 'quotation_id' en la DB
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users', // Nombre de la tabla referenciada
      key: 'user_id', // CAMBIO: Referencia a 'user_id' en la tabla 'users'
    },
    field: 'user_id' // Mapea explícitamente a la columna 'user_id' en la DB
  },
  total: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  fecha: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  status: { // Añadido el campo 'status'
    type: DataTypes.STRING,
    defaultValue: 'pendiente',
    allowNull: false,
  }
}, {
  sequelize,
  modelName: 'Quotation',
  tableName: 'cotizaciones', // Nombre real de la tabla en la base de datos
  timestamps: false, // No usar createdAt/updatedAt
  underscored: true, // Usa snake_case para los nombres de columna en la DB (ej. user_id)
});

export default Quotation;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../../../config/connection"));
// Clase del modelo QuotationItem
class QuotationItem extends sequelize_1.Model {
    // Método estático para definir las asociaciones
    static associate(models) {
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
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'id' // Mapea explícitamente a la columna 'id' en la DB
    },
    cotizacion_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'cotizaciones', // Nombre de la tabla referenciada
            key: 'quotation_id', // CAMBIO: Referencia a 'quotation_id' en la tabla 'cotizaciones'
        },
        field: 'cotizacion_id' // Mapea explícitamente a la columna 'cotizacion_id' en la DB
    },
    product_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'products', // Nombre de la tabla referenciada
            key: 'product_id', // Asumiendo que 'product_id' es la PK de la tabla 'products'
        },
        field: 'product_id' // Mapea explícitamente a la columna 'product_id' en la DB
    },
    alto: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false,
    },
    ancho: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false,
    },
    cantidad: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    subtotal: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false,
    },
}, {
    sequelize: connection_1.default,
    modelName: 'QuotationItem',
    tableName: 'cotizacion_items', // Nombre real de la tabla en la base de datos
    timestamps: false, // No usar createdAt/updatedAt
    underscored: true, // Usa snake_case para los nombres de columna en la DB
});
exports.default = QuotationItem;

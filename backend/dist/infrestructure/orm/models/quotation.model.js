"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../../../config/connection"));
// Clase del modelo Quotation
class Quotation extends sequelize_1.Model {
    // Método estático para definir las asociaciones
    static associate(models) {
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
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'quotation_id' // Mapea explícitamente a la columna 'quotation_id' en la DB
    },
    user_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users', // Nombre de la tabla referenciada
            key: 'user_id', // CAMBIO: Referencia a 'user_id' en la tabla 'users'
        },
        field: 'user_id' // Mapea explícitamente a la columna 'user_id' en la DB
    },
    total: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false,
    },
    fecha: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
    status: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: 'pendiente',
        allowNull: false,
    }
}, {
    sequelize: connection_1.default,
    modelName: 'Quotation',
    tableName: 'cotizaciones', // Nombre real de la tabla en la base de datos
    timestamps: false, // No usar createdAt/updatedAt
    underscored: true, // Usa snake_case para los nombres de columna en la DB (ej. user_id)
});
exports.default = Quotation;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../../../config/connection"));
// Clase del modelo Product
class Product extends sequelize_1.Model {
    // Método estático para definir las asociaciones (si las hay)
    static associate(models) {
        // Por ejemplo, si QuotationItem pertenece a Product:
        // Product.hasMany(models.QuotationItem, {
        //   foreignKey: 'product_id',
        //   as: 'quotationItems',
        //   sourceKey: 'product_id'
        // });
    }
}
exports.Product = Product;
// Inicialización del modelo
Product.init({
    product_id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'product_id' // Mapea explícitamente a la columna 'product_id' en la DB
    },
    modelo: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    color: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    costo_m2: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false
    },
    descripcion: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    img_Url: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        defaultValue: 'https://via.placeholder.com/400x300/cccccc/666666?text=Sin+Imagen',
        field: 'img_Url' // Mapea explícitamente a 'img_url' en la DB (un solo guion bajo)
    },
    productType: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        field: 'productType' // Mapea explícitamente a 'product_type' en la DB
    },
}, {
    sequelize: connection_1.default,
    modelName: 'Product',
    tableName: 'products', // Nombre real de la tabla en la base de datos
    timestamps: false, // No usar createdAt/updatedAt
    underscored: true // Mantén esto si tus otras columnas son snake_case
});

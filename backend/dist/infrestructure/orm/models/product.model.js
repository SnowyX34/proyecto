"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../../../config/connection"));
class Product extends sequelize_1.Model {
}
exports.Product = Product;
Product.init({
    product_id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    modelo: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    color: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    costo_m2: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false,
    },
    img_Url: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    productType: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    }
}, {
    sequelize: connection_1.default,
    modelName: 'product',
    tableName: 'products',
    timestamps: false,
});

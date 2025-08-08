"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// models/cart.model.ts
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../../../config/connection"));
const CartItem = connection_1.default.define('CartItem', {
    cart_id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    product_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    model: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true // Cambiar a true si no siempre se proporciona
    },
    height: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true // Cambiar a true para permitir valores opcionales
    },
    width: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true // Cambiar a true para permitir valores opcionales
    },
    quantity: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    },
    precio_total: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: true // Se puede calcular después
    },
    img_URL: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true // Agregar este campo que faltaba
    }
}, {
    tableName: 'cart_items',
    timestamps: true
});
exports.default = CartItem;

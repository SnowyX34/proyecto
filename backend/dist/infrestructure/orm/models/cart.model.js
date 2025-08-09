"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cart = void 0;
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../../../config/connection"));
// Extendemos la clase `Model` con los atributos de nuestro DTO
class Cart extends sequelize_1.Model {
}
exports.Cart = Cart;
// Definición del modelo con Sequelize
Cart.init({
    cart_id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
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
        allowNull: false
    },
    height: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    width: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    quantity: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    },
    precio_total: {
        type: sequelize_1.DataTypes.DECIMAL(10, 2),
        allowNull: false
    }
}, {
    sequelize: connection_1.default,
    modelName: 'Cart',
    tableName: 'cart',
    timestamps: true // si quieres createdAt y updatedAt
});

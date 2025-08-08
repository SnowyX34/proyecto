"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCartItem = exports.updateCartItem = exports.getCartByUser = exports.getCartItems = exports.addToCart = void 0;
const cart_model_1 = __importDefault(require("../../infrestructure/orm/models/cart.model"));
const addToCart = async (req, res) => {
    try {
        const { user_id, product_id, model, height, width, quantity, precio_total, } = req.body;
        // Validaciones mínimas - solo product_id y quantity son obligatorios
        if (!product_id || !quantity) {
            res.status(400).json({ message: 'product_id y quantity son obligatorios' });
            return;
        }
        // Valores por defecto
        const cartData = {
            user_id: user_id || 1, // Valor por defecto si no hay autenticación
            product_id,
            model: model || '',
            height: height || '0',
            width: width || '0',
            quantity,
            precio_total: precio_total || 0,
        };
        console.log('Datos para crear cart item:', cartData);
        const cartItem = await cart_model_1.default.create(cartData);
        console.log('Cart item creado:', cartItem);
        res.status(201).json(cartItem);
        return;
    }
    catch (error) {
        console.error('Error al agregar al carrito:', error);
        res.status(500).json({
            message: 'Error interno del servidor',
            error: process.env.NODE_ENV === 'development' ? error : undefined
        });
        return;
    }
};
exports.addToCart = addToCart;
const getCartItems = async (_req, res) => {
    try {
        console.log('Obteniendo todos los items del carrito...');
        const items = await cart_model_1.default.findAll({
            order: [['createdAt', 'DESC']] // Ordenar por más recientes primero
        });
        console.log(`Encontrados ${items.length} items en el carrito`);
        res.json(items);
    }
    catch (error) {
        console.error('Error al obtener el carrito:', error);
        res.status(500).json({ message: 'Error interno al obtener el carrito' });
    }
};
exports.getCartItems = getCartItems;
const getCartByUser = async (req, res) => {
    try {
        const { user_id } = req.params;
        console.log('Buscando carrito del usuario:', user_id);
        const items = await cart_model_1.default.findAll({
            where: { user_id },
            order: [['createdAt', 'DESC']]
        });
        console.log('Items encontrados:', items.length);
        res.status(200).json(items);
    }
    catch (error) {
        console.error('Error al obtener carrito:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};
exports.getCartByUser = getCartByUser;
const updateCartItem = async (req, res) => {
    try {
        const { id } = req.params;
        const { quantity, width, height } = req.body;
        const cartItem = await cart_model_1.default.findByPk(id);
        if (!cartItem) {
            res.status(404).json({ message: 'Item del carrito no encontrado' });
            return;
        }
        await cartItem.update({
            quantity: quantity || cartItem.get('quantity'),
            width: (width === null || width === void 0 ? void 0 : width.toString()) || cartItem.get('width'),
            height: (height === null || height === void 0 ? void 0 : height.toString()) || cartItem.get('height')
        });
        res.json(cartItem);
    }
    catch (error) {
        console.error('Error al actualizar item del carrito:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};
exports.updateCartItem = updateCartItem;
const deleteCartItem = async (req, res) => {
    try {
        const { id } = req.params;
        const cartItem = await cart_model_1.default.findByPk(id);
        if (!cartItem) {
            res.status(404).json({ message: 'Item del carrito no encontrado' });
            return;
        }
        await cartItem.destroy();
        res.json({ message: 'Item eliminado correctamente' });
    }
    catch (error) {
        console.error('Error al eliminar item del carrito:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};
exports.deleteCartItem = deleteCartItem;

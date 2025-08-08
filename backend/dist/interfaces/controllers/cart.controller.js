"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllProducts = exports.deleteCart = exports.updateCart = exports.addCart = void 0;
const cartRepoImpl_1 = require("../../infrestructure/repositories/cartRepoImpl");
const cart_model_1 = require("../../infrestructure/orm/models/cart.model");
const addCart = async (req, res) => {
    const { cart_id, user_id, product_id, model, height, width, quantity, precio_total } = req.body;
    if (!cart_id || !user_id || !product_id || !model || !height || !width || !quantity || precio_total == null) {
        res.status(400).json({ message: 'Faltan datos' });
        return;
    }
    try {
        const newCart = await cartRepoImpl_1.CartRepository.create({
            cart_id, user_id, product_id, model, height, width, quantity, precio_total
        });
        res.status(201).json({ message: 'Producto agregado', product: newCart });
        return;
    }
    catch (error) {
        console.error('Error al agregar pedido:', error);
        res.status(500).json({ message: 'Error al agregar pedido' });
        return;
    }
};
exports.addCart = addCart;
const updateCart = async (req, res) => {
    const { id } = req.params; // id del registro del carrito
    const { product_id, model, height, width, quantity, precio_total } = req.body;
    try {
        const cartItem = await cart_model_1.Cart.findByPk(id);
        if (!cartItem) {
            return res.status(404).json({ message: 'Item no encontrado en el carrito' });
        }
        const updateData = { product_id, model, height, width, quantity, precio_total };
        await cartItem.update(updateData);
        return res.json({ message: 'Carrito actualizado', cartItem });
    }
    catch (error) {
        console.error('Error al actualizar carrito:', error);
        return res.status(500).json({ message: 'Error interno' });
    }
};
exports.updateCart = updateCart;
const deleteCart = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await cart_model_1.Cart.findByPk(id);
        if (!product) {
            res.status(404).json({ message: 'Producto no encontrado' });
            return;
        }
        await product.destroy();
        res.json({ message: 'Producto eliminado' });
        return;
    }
    catch (error) {
        console.error('Error al eliminar producto:', error);
        res.status(500).json({ message: 'Error al eliminar producto' });
        return;
    }
};
exports.deleteCart = deleteCart;
const getAllProducts = async (_req, res) => {
    try {
        const products = await cart_model_1.Cart.findAll();
        res.json(products);
        return;
    }
    catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({ message: 'Error al obtener productos' });
        return;
    }
};
exports.getAllProducts = getAllProducts;

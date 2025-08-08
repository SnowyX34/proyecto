"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addToCart = void 0;
const cartRepoImpl_1 = require("../../infrestructure/repositories/cartRepoImpl");
const cartRepo = new cartRepoImpl_1.CartRepository();
const addToCart = async (req, res) => {
    const data = req.body;
    const { user_id, product_id, quantity } = data;
    try {
        await cartRepo.addToCart(user_id, product_id, quantity);
        res.json({ message: 'Producto agregado al carrito' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error en la base de datos' });
    }
};
exports.addToCart = addToCart;

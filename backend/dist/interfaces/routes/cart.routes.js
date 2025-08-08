"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
<<<<<<< HEAD
// routes/cart.routes.ts
const express_1 = require("express");
const cart_controller_1 = require("../controllers/cart.controller");
const router = (0, express_1.Router)();
// GET /api/cart - Obtener todos los items del carrito
router.get('/', cart_controller_1.getCartItems);
// GET /api/cart/user/:user_id - Obtener carrito por usuario
router.get('/user/:user_id', cart_controller_1.getCartByUser);
// POST /api/cart/add - Agregar item al carrito
router.post('/add', cart_controller_1.addToCart);
// PUT /api/cart/:id - Actualizar item del carrito
router.put('/:id', cart_controller_1.updateCartItem);
// DELETE /api/cart/:id - Eliminar item del carrito
router.delete('/:id', cart_controller_1.deleteCartItem);
=======
const express_1 = require("express");
const cart_controller_1 = require("../controllers/cart.controller");
const router = (0, express_1.Router)();
router.post('/cart', cart_controller_1.addCart);
>>>>>>> 5837d271ff19383e3e30f3ee65bcc6dcf81a5592
exports.default = router;

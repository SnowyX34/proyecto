"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cart_controller_1 = require("../../factories/controllers/cart.controller");
const router = (0, express_1.Router)();
router.post('/cotizar', cart_controller_1.addToCart);
exports.default = router;

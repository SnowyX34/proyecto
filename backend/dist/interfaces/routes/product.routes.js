"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const upload_middleware_1 = require("../middlewares/upload.middleware");
const product_controller_1 = require("../controllers/product.controller");
const authAdmin_1 = require("../middlewares/authAdmin");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
router.post('/add', auth_1.verifyToken, authAdmin_1.verifyAdmin, upload_middleware_1.upload.single('image'), product_controller_1.addProduct);
router.put('/:id', auth_1.verifyToken, authAdmin_1.verifyAdmin, upload_middleware_1.upload.single('image'), product_controller_1.updateProduct);
router.delete('/:id', auth_1.verifyToken, authAdmin_1.verifyAdmin, product_controller_1.deleteProduct);
<<<<<<< HEAD
router.get('/search', product_controller_1.searchProducts);
router.get('/', product_controller_1.getAllProducts);
=======
router.get('/', auth_1.verifyToken, authAdmin_1.verifyAdmin, product_controller_1.getAllProducts);
>>>>>>> 5837d271ff19383e3e30f3ee65bcc6dcf81a5592
exports.default = router;

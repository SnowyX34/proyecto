"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllProducts = exports.deleteProduct = exports.updateProduct = exports.addProduct = void 0;
const product_model_1 = require("../../infrestructure/orm/models/product.model");
const addProduct = async (req, res) => {
    const { modelo, color, costo_m2 } = req.body;
    const image_Url = req.file
        ? `/uploads/${req.file.filename}`
        : `/uploads/default-product.png`;
    if (!modelo || !color || costo_m2 == null) {
        res.status(400).json({ message: 'Faltan datos' });
        return;
    }
    try {
        const newProduct = await product_model_1.Product.create({
            modelo,
            color,
            costo_m2,
            img_Url: image_Url
        });
        res.status(201).json({ message: 'Producto agregado', product: newProduct });
        console.log('Image URL a guardar:', image_Url);
        return;
    }
    catch (error) {
        console.error('Error al agregar producto:', error);
        res.status(500).json({ message: 'Error al agregar producto' });
        return;
    }
};
exports.addProduct = addProduct;
const updateProduct = async (req, res) => {
    const { id } = req.params;
    const { modelo, color, costo_m2 } = req.body;
    try {
        const product = await product_model_1.Product.findByPk(id);
        if (!product) {
            res.status(404).json({ message: 'Producto no encontrado' });
            return;
        }
        // Solo actualizar la imagen si se envió una nueva
        const updateData = { modelo, color, costo_m2 };
        if (req.file) {
            updateData.img_Url = `/uploads/${req.file.filename}`;
        }
        await product.update(updateData);
        res.json({ message: 'Producto actualizado', product });
        return;
    }
    catch (error) {
        console.error('Error al actualizar producto:', error);
        res.status(500).json({ message: 'Error al actualizar producto' });
        return;
    }
};
exports.updateProduct = updateProduct;
const deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await product_model_1.Product.findByPk(id);
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
exports.deleteProduct = deleteProduct;
const getAllProducts = async (_req, res) => {
    try {
        const products = await product_model_1.Product.findAll();
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

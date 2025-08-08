"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
<<<<<<< HEAD
exports.searchProducts = exports.getAllProducts = exports.deleteProduct = exports.updateProduct = exports.addProduct = void 0;
const product_model_1 = require("../../infrestructure/orm/models/product.model");
const cloudinary_service_1 = require("../../infrestructure/services/cloudinary.service");
const sequelize_1 = require("sequelize"); // Importar Op para operadores de Sequelize
const addProduct = async (req, res) => {
    const { modelo, color, costo_m2, productType, img_Url, descripcion } = req.body;
    if (!modelo || !color || !productType || !descripcion || costo_m2 == null) {
=======
exports.getAllProducts = exports.deleteProduct = exports.updateProduct = exports.addProduct = void 0;
const product_model_1 = require("../../infrestructure/orm/models/product.model");
const addProduct = async (req, res) => {
    const { modelo, color, costo_m2, productType } = req.body;
    const image_Url = req.file
        ? `/uploads/${req.file.filename}`
        : `/uploads/default-product.png`;
    if (!modelo || !color || !productType || costo_m2 == null) {
>>>>>>> 5837d271ff19383e3e30f3ee65bcc6dcf81a5592
        res.status(400).json({ message: 'Faltan datos' });
        return;
    }
    try {
<<<<<<< HEAD
        let image_url_to_save = 'https://via.placeholder.com/400x300/cccccc/666666?text=Sin+Imagen';
        if (req.file) {
            const uploadResult = await cloudinary_service_1.CloudinaryService.uploadImage(req.file.buffer, req.file.originalname, 'products');
            image_url_to_save = uploadResult.secure_url;
            console.log('Imagen subida a Cloudinary:', image_url_to_save);
        }
        else if (img_Url) {
            image_url_to_save = img_Url;
        }
=======
>>>>>>> 5837d271ff19383e3e30f3ee65bcc6dcf81a5592
        const newProduct = await product_model_1.Product.create({
            modelo,
            color,
            costo_m2,
<<<<<<< HEAD
            img_Url: image_url_to_save,
            productType,
            descripcion
        });
        res.status(201).json({
            message: 'Producto agregado',
            product: newProduct
        });
=======
            img_Url: image_Url,
            productType
        });
        res.status(201).json({ message: 'Producto agregado', product: newProduct });
        console.log('Image URL a guardar:', image_Url);
>>>>>>> 5837d271ff19383e3e30f3ee65bcc6dcf81a5592
        return;
    }
    catch (error) {
        console.error('Error al agregar producto:', error);
<<<<<<< HEAD
        res.status(500).json({
            message: 'Error al agregar producto',
            error: error instanceof Error ? error.message : 'Error desconocido'
        });
=======
        res.status(500).json({ message: 'Error al agregar producto' });
>>>>>>> 5837d271ff19383e3e30f3ee65bcc6dcf81a5592
        return;
    }
};
exports.addProduct = addProduct;
const updateProduct = async (req, res) => {
    const { id } = req.params;
<<<<<<< HEAD
    const { modelo, color, costo_m2, productType, descripcion } = req.body;
=======
    const { modelo, color, costo_m2, productType } = req.body;
>>>>>>> 5837d271ff19383e3e30f3ee65bcc6dcf81a5592
    try {
        const product = await product_model_1.Product.findByPk(id);
        if (!product) {
            res.status(404).json({ message: 'Producto no encontrado' });
            return;
        }
<<<<<<< HEAD
        const updateData = {
            modelo,
            color,
            costo_m2,
            productType,
            descripcion
        };
        if (req.file) {
            if (product.img_Url && product.img_Url.includes('cloudinary.com')) {
                const publicId = cloudinary_service_1.CloudinaryService.extractPublicId(product.img_Url);
                if (publicId) {
                    try {
                        await cloudinary_service_1.CloudinaryService.deleteImage(publicId);
                        console.log('Imagen anterior eliminada de Cloudinary');
                    }
                    catch (error) {
                        console.warn('No se pudo eliminar la imagen anterior:', error);
                    }
                }
            }
            const uploadResult = await cloudinary_service_1.CloudinaryService.uploadImage(req.file.buffer, req.file.originalname, 'products');
            updateData.img_Url = uploadResult.secure_url;
            console.log('Nueva imagen subida a Cloudinary:', updateData.img_Url);
        }
        await product.update(updateData);
        await product.reload();
        res.json({
            message: 'Producto actualizado',
            product: product
        });
=======
        // Solo actualizar la imagen si se envió una nueva
        const updateData = { modelo, color, costo_m2, productType };
        if (req.file) {
            updateData.img_Url = `/uploads/${req.file.filename}`;
        }
        await product.update(updateData);
        res.json({ message: 'Producto actualizado', product });
>>>>>>> 5837d271ff19383e3e30f3ee65bcc6dcf81a5592
        return;
    }
    catch (error) {
        console.error('Error al actualizar producto:', error);
<<<<<<< HEAD
        res.status(500).json({
            message: 'Error al actualizar producto',
            error: error instanceof Error ? error.message : 'Error desconocido'
        });
=======
        res.status(500).json({ message: 'Error al actualizar producto' });
>>>>>>> 5837d271ff19383e3e30f3ee65bcc6dcf81a5592
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
<<<<<<< HEAD
        if (product.img_Url && product.img_Url.includes('cloudinary.com')) {
            const publicId = cloudinary_service_1.CloudinaryService.extractPublicId(product.img_Url);
            if (publicId) {
                try {
                    await cloudinary_service_1.CloudinaryService.deleteImage(publicId);
                    console.log('Imagen eliminada de Cloudinary');
                }
                catch (error) {
                    console.warn('No se pudo eliminar la imagen de Cloudinary:', error);
                }
            }
        }
=======
>>>>>>> 5837d271ff19383e3e30f3ee65bcc6dcf81a5592
        await product.destroy();
        res.json({ message: 'Producto eliminado' });
        return;
    }
    catch (error) {
        console.error('Error al eliminar producto:', error);
<<<<<<< HEAD
        res.status(500).json({
            message: 'Error al eliminar producto',
            error: error instanceof Error ? error.message : 'Error desconocido'
        });
=======
        res.status(500).json({ message: 'Error al eliminar producto' });
>>>>>>> 5837d271ff19383e3e30f3ee65bcc6dcf81a5592
        return;
    }
};
exports.deleteProduct = deleteProduct;
<<<<<<< HEAD
const getAllProducts = async (req, res) => {
    const { productType } = req.query;
    const whereClause = {};
    if (productType && typeof productType === 'string') {
        whereClause.productType = {
            [sequelize_1.Op.like]: `%${productType}%` // funciona en MySQL y es case-insensitive si el collation lo permite
        };
    }
    try {
        const products = await product_model_1.Product.findAll({
            where: whereClause,
            attributes: [
                'product_id',
                'modelo',
                'color',
                'costo_m2',
                'descripcion',
                'img_Url',
                'productType'
            ]
        });
        res.json(products);
    }
    catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({
            message: 'Error al obtener productos',
            error: error instanceof Error ? error.message : 'Error desconocido'
        });
    }
};
exports.getAllProducts = getAllProducts;
// NUEVO: Función para buscar productos por término
const searchProducts = async (req, res) => {
    const { term } = req.query; // Obtener el término de búsqueda de los query parameters
    if (!term) {
        res.status(400).json({ message: 'Se requiere un término de búsqueda' });
        return;
    }
    try {
        const products = await product_model_1.Product.findAll({
            where: {
                modelo: {
                    [sequelize_1.Op.like]: `%${term}%` // Buscar coincidencias parciales en el campo 'modelo'
                }
            },
            attributes: ['product_id', 'modelo', 'color', 'costo_m2', 'descripcion', 'img_Url', 'productType']
        });
        if (products.length === 0) {
            res.status(404).json({ message: 'No se encontraron productos con ese término' });
            return;
        }
        res.json(products);
    }
    catch (error) {
        console.error('Error al buscar productos:', error);
        res.status(500).json({
            message: 'Error al buscar productos',
            error: error instanceof Error ? error.message : 'Error desconocido'
        });
    }
};
exports.searchProducts = searchProducts;
=======
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
>>>>>>> 5837d271ff19383e3e30f3ee65bcc6dcf81a5592

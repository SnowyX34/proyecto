"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteQuotation = exports.updateQuotation = exports.getQuoteAdmin = exports.detail = exports.getQuotatoinByUser = exports.addQuotation = void 0;
const quotation_model_1 = __importDefault(require("../../infrestructure/orm/models/quotation.model"));
const quotation_item_model_1 = __importDefault(require("../../infrestructure/orm/models/quotation-item.model"));
const product_model_1 = require("../../infrestructure/orm/models/product.model");
const user_model_1 = require("../../infrestructure/orm/models/user.model");
const connection_1 = __importDefault(require("../../config/connection"));
const addQuotation = async (req, res) => {
    const { userId, items } = req.body;
    console.log('Backend: addQuotation - Datos recibidos en req.body:', JSON.stringify(req.body, null, 2));
    if (userId == null || !items || !Array.isArray(items) || items.length === 0) {
        console.error('Backend: addQuotation - Validación inicial fallida. userId:', userId, 'items:', items);
        res.status(400).json({ message: 'Datos incompletos: userId o items faltantes/vacíos' });
        return;
    }
    try {
        const newQuotationInstance = await connection_1.default.transaction(async (t) => {
            let total = 0;
            for (const item of items) {
                console.log('Backend: addQuotation - Procesando ítem:', JSON.stringify(item, null, 2));
                if (item.height == null || item.width == null || item.quantity == null || item.costo_m2 == null || item.productId == null) {
                    const missingFields = [];
                    if (item.height == null)
                        missingFields.push('height');
                    if (item.width == null)
                        missingFields.push('width');
                    if (item.quantity == null)
                        missingFields.push('quantity');
                    if (item.costo_m2 == null)
                        missingFields.push('costo_m2');
                    if (item.productId == null)
                        missingFields.push('productId');
                    console.error('Backend: addQuotation - Datos incompletos en ítem del carrito. Faltan:', missingFields.join(', '), 'Ítem:', JSON.stringify(item, null, 2));
                    throw new Error(`Datos incompletos en items: faltan ${missingFields.join(', ')}`);
                }
                const area = item.height * item.width;
                const subtotalCalculated = area * item.costo_m2 * item.quantity;
                total += subtotalCalculated;
            }
            const newQuotation = await quotation_model_1.default.create({
                user_id: userId,
                total: total,
            }, { transaction: t });
            const quotationItemsToCreate = items.map((item) => {
                const area = item.height * item.width;
                const subtotalCalculated = area * item.costo_m2 * item.quantity;
                return {
                    cotizacion_id: newQuotation.quotation_id,
                    product_id: item.productId,
                    alto: item.height,
                    ancho: item.width,
                    cantidad: item.quantity,
                    subtotal: subtotalCalculated,
                };
            });
            await quotation_item_model_1.default.bulkCreate(quotationItemsToCreate, { transaction: t });
            return newQuotation;
        });
        res.status(201).json({ message: 'Cotización creada', cotizacionId: newQuotationInstance.quotation_id });
    }
    catch (error) {
        console.error('Backend: Error al crear cotización:', error);
        res.status(500).json({ message: error.message || 'Error interno del servidor' });
    }
};
exports.addQuotation = addQuotation;
const getQuotatoinByUser = async (req, res) => {
    const userId = req.params.userId;
    try {
        const quotations = await quotation_model_1.default.findAll({
            where: { user_id: userId },
            order: [['fecha', 'DESC']],
            attributes: ['quotation_id', 'fecha', 'total'],
        });
        res.json(quotations);
    }
    catch (error) {
        console.error('Error al obtener cotizaciones por usuario:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};
exports.getQuotatoinByUser = getQuotatoinByUser;
const detail = async (req, res) => {
    var _a, _b;
    const cotizacionId = req.params.id;
    try {
        const quotation = await quotation_model_1.default.findByPk(cotizacionId, {
            include: [
                {
                    model: user_model_1.User,
                    as: 'user',
                    attributes: ['user_name', 'phone_number'],
                },
                {
                    model: quotation_item_model_1.default,
                    as: 'items',
                    include: [
                        {
                            model: product_model_1.Product,
                            as: 'product',
                            attributes: ['modelo'],
                        },
                    ],
                    attributes: ['id', 'product_id', 'alto', 'ancho', 'cantidad', 'subtotal'],
                },
            ],
        });
        console.log('Fetched quotation object in detail:', JSON.stringify(quotation, null, 2));
        if (!quotation) {
            res.status(404).json({ message: 'Cotización no encontrada' });
            return;
        }
        const formattedItems = Array.isArray(quotation.items) ? quotation.items.map((item) => {
            var _a;
            return ({
                id: item.id,
                product_id: item.product_id,
                name: (_a = item.product) === null || _a === void 0 ? void 0 : _a.modelo,
                alto: item.alto,
                ancho: item.ancho,
                cantidad: item.cantidad,
                subtotal: item.subtotal,
            });
        }) : [];
        res.json({
            cotizacion: {
                id: quotation.quotation_id,
                fecha: quotation.fecha,
                total: quotation.total,
                user_id: quotation.user_id,
                username: (_a = quotation.user) === null || _a === void 0 ? void 0 : _a.user_name,
                phoneNumber: (_b = quotation.user) === null || _b === void 0 ? void 0 : _b.phone_number,
            },
            items: formattedItems,
        });
    }
    catch (error) {
        console.error('Error al obtener detalle de cotización:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};
exports.detail = detail;
const getQuoteAdmin = async (req, res) => {
    try {
        const quotations = await quotation_model_1.default.findAll({
            include: [
                {
                    model: user_model_1.User,
                    as: 'user',
                    attributes: ['user_name', 'phone_number'], // Aseguramos que se traigan ambos
                },
            ],
            attributes: ['quotation_id', 'fecha', 'total', 'user_id', 'status'],
            order: [['fecha', 'DESC']],
        });
        const formattedQuotations = quotations.map((q) => {
            var _a, _b;
            return ({
                quotation_id: q.quotation_id,
                fecha: q.fecha,
                total: q.total,
                user_id: q.user_id,
                status: q.status,
                user: {
                    username: (_a = q.user) === null || _a === void 0 ? void 0 : _a.user_name, // Nombre de usuario
                    phoneNumber: (_b = q.user) === null || _b === void 0 ? void 0 : _b.phone_number // Número de teléfono
                },
            });
        });
        res.json(formattedQuotations);
    }
    catch (error) {
        console.error('Error al obtener todas las cotizaciones (admin):', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};
exports.getQuoteAdmin = getQuoteAdmin;
const updateQuotation = async (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;
    try {
        const quotation = await quotation_model_1.default.findByPk(id);
        if (!quotation) {
            res.status(404).json({ message: 'Cotización no encontrada' });
            return;
        }
        await connection_1.default.transaction(async (t) => {
            await quotation.update(updatedData, { transaction: t });
        });
        res.json({ message: 'Cotización actualizada', quotation });
    }
    catch (error) {
        console.error('Error al actualizar cotización:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};
exports.updateQuotation = updateQuotation;
const deleteQuotation = async (req, res) => {
    const { id } = req.params;
    try {
        await connection_1.default.transaction(async (t) => {
            // Primero eliminar los items de la cotización
            await quotation_item_model_1.default.destroy({ where: { cotizacion_id: id }, transaction: t });
            // Luego eliminar la cotización principal
            const deleted = await quotation_model_1.default.destroy({ where: { quotation_id: id }, transaction: t });
            if (deleted === 0) {
                return res.status(404).json({ message: 'Cotización no encontrada' });
            }
        });
        res.json({ message: 'Cotización eliminada' });
    }
    catch (error) {
        console.error('Error al eliminar cotización:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};
exports.deleteQuotation = deleteQuotation;

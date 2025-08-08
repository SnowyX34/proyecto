"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cotizaciones_controller_1 = require("../controllers/cotizaciones.controller");
const router = (0, express_1.Router)();
// Ruta para crear una nueva cotización (POST)
router.post('/', cotizaciones_controller_1.addQuotation);
// Ruta para obtener cotizaciones por ID de usuario (GET)
router.get('/user/:userId', cotizaciones_controller_1.getQuotatoinByUser);
// CAMBIO CRUCIAL: Mueve esta ruta ANTES de la ruta con :id
// Ruta para obtener todas las cotizaciones (para admin) (GET)
router.get('/getAdmin', cotizaciones_controller_1.getQuoteAdmin);
// Ruta para obtener el detalle de una cotización por su ID (GET)
router.get('/:id', cotizaciones_controller_1.detail);
// Ruta para actualizar una cotización (PUT)
router.put('/:id', cotizaciones_controller_1.updateQuotation);
// Ruta para eliminar una cotización (DELETE)
router.delete('/:id', cotizaciones_controller_1.deleteQuotation);
exports.default = router;

import { Router } from 'express';
import {
  addQuotation,
  getQuotatoinByUser,
  detail,
  getQuoteAdmin,
  updateQuotation,
  deleteQuotation
} from '../controllers/cotizaciones.controller';

const router = Router();

// Ruta para crear una nueva cotización (POST)
router.post('/', addQuotation);

// Ruta para obtener cotizaciones por ID de usuario (GET)
router.get('/user/:userId', getQuotatoinByUser);

// CAMBIO CRUCIAL: Mueve esta ruta ANTES de la ruta con :id
// Ruta para obtener todas las cotizaciones (para admin) (GET)
router.get('/getAdmin', getQuoteAdmin);

// Ruta para obtener el detalle de una cotización por su ID (GET)
router.get('/:id', detail);

// Ruta para actualizar una cotización (PUT)
router.put('/:id', updateQuotation);

// Ruta para eliminar una cotización (DELETE)
router.delete('/:id', deleteQuotation);

export default router;

import { Request, Response } from 'express';
import Quotation from '../../infrestructure/orm/models/quotation.model';
import QuotationItem from '../../infrestructure/orm/models/quotation-item.model';
import { Product } from '../../infrestructure/orm/models/product.model';
import { User } from '../../infrestructure/orm/models/user.model';
import sequelize from '../../config/connection';

interface IncomingQuotationItem {
  productId: number;
  height: number;
  width: number;
  quantity: number;
  costo_m2: number;
}

export const addQuotation = async (req: Request, res: Response) => {
  const { userId, items } = req.body;

  console.log('Backend: addQuotation - Datos recibidos en req.body:', JSON.stringify(req.body, null, 2));

  if (userId == null || !items || !Array.isArray(items) || items.length === 0) {
    console.error('Backend: addQuotation - Validación inicial fallida. userId:', userId, 'items:', items);
    res.status(400).json({ message: 'Datos incompletos: userId o items faltantes/vacíos' });
    return;
  }

  try {
    const newQuotationInstance: Quotation = await sequelize.transaction(async (t) => {
      let total = 0;
      for (const item of items as IncomingQuotationItem[]) {
        console.log('Backend: addQuotation - Procesando ítem:', JSON.stringify(item, null, 2));
        if (item.height == null || item.width == null || item.quantity == null || item.costo_m2 == null || item.productId == null) {
          const missingFields = [];
          if (item.height == null) missingFields.push('height');
          if (item.width == null) missingFields.push('width');
          if (item.quantity == null) missingFields.push('quantity');
          if (item.costo_m2 == null) missingFields.push('costo_m2');
          if (item.productId == null) missingFields.push('productId');

          console.error('Backend: addQuotation - Datos incompletos en ítem del carrito. Faltan:', missingFields.join(', '), 'Ítem:', JSON.stringify(item, null, 2));
          throw new Error(`Datos incompletos en items: faltan ${missingFields.join(', ')}`);
        }
        const area = item.height * item.width;
        const subtotalCalculated = area * item.costo_m2 * item.quantity;
        total += subtotalCalculated;
      }

      const newQuotation = await Quotation.create({
        user_id: userId,
        total: total,
      }, { transaction: t });

      const quotationItemsToCreate = items.map((item: IncomingQuotationItem) => {
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

      await QuotationItem.bulkCreate(quotationItemsToCreate, { transaction: t });

      return newQuotation;
    });

    res.status(201).json({ message: 'Cotización creada', cotizacionId: newQuotationInstance.quotation_id });
  } catch (error: any) {
    console.error('Backend: Error al crear cotización:', error);
    res.status(500).json({ message: error.message || 'Error interno del servidor' });
  }
};

export const getQuotatoinByUser = async (req: Request, res: Response) => {
  const userId = req.params.userId;
  try {
    const quotations = await Quotation.findAll({
      where: { user_id: userId },
      order: [['fecha', 'DESC']],
      attributes: ['quotation_id', 'fecha', 'total'],
    });
    res.json(quotations);
  } catch (error) {
    console.error('Error al obtener cotizaciones por usuario:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const detail = async (req: Request, res: Response) => {
  const cotizacionId = req.params.id;
  try {
    const quotation = await Quotation.findByPk(cotizacionId, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['user_name', 'phone_number'],
        },
        {
          model: QuotationItem,
          as: 'items',
          include: [
            {
              model: Product,
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

    const formattedItems = Array.isArray(quotation.items) ? quotation.items.map((item: any) => ({
      id: item.id,
      product_id: item.product_id,
      name: item.product?.modelo,
      alto: item.alto,
      ancho: item.ancho,
      cantidad: item.cantidad,
      subtotal: item.subtotal,
    })) : [];

    res.json({
      cotizacion: {
        id: quotation.quotation_id,
        fecha: quotation.fecha,
        total: quotation.total,
        user_id: quotation.user_id,
        username: quotation.user?.user_name,
        phoneNumber: quotation.user?.phone_number,
      },
      items: formattedItems,
    });
  } catch (error) {
    console.error('Error al obtener detalle de cotización:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const getQuoteAdmin = async (req: Request, res: Response) => {
  try {
    const quotations = await Quotation.findAll({
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['user_name', 'phone_number'], // Aseguramos que se traigan ambos
        },
      ],
      attributes: ['quotation_id', 'fecha', 'total', 'user_id', 'status'],
      order: [['fecha', 'DESC']],
    });

    const formattedQuotations = quotations.map((q: any) => ({
      quotation_id: q.quotation_id,
      fecha: q.fecha,
      total: q.total,
      user_id: q.user_id,
      status: q.status,
      user: {
        username: q.user?.user_name, // Nombre de usuario
        phoneNumber: q.user?.phone_number // Número de teléfono
      },
    }));

    res.json(formattedQuotations);
  } catch (error) {
    console.error('Error al obtener todas las cotizaciones (admin):', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const updateQuotation = async (req: Request, res: Response) => {
  const { id } = req.params;
  const updatedData = req.body;

  try {
    const quotation = await Quotation.findByPk(id);
    if (!quotation) {
      res.status(404).json({ message: 'Cotización no encontrada' });
      return;
    }

    await sequelize.transaction(async (t) => {
      await quotation.update(updatedData, { transaction: t });
    });

    res.json({ message: 'Cotización actualizada', quotation });
  } catch (error) {
    console.error('Error al actualizar cotización:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const deleteQuotation = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await sequelize.transaction(async (t) => {
      // Primero eliminar los items de la cotización
      await QuotationItem.destroy({ where: { cotizacion_id: id }, transaction: t });
      // Luego eliminar la cotización principal
      const deleted = await Quotation.destroy({ where: { quotation_id: id }, transaction: t });

      if (deleted === 0) {
        return res.status(404).json({ message: 'Cotización no encontrada' });
      }
    });

    res.json({ message: 'Cotización eliminada' });
  } catch (error) {
    console.error('Error al eliminar cotización:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

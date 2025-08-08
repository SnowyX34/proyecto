import { Request, Response } from 'express';
import { Product } from '../../infrestructure/orm/models/product.model';

export const addProduct = async (req: Request, res: Response) => {
  const { modelo, color, costo_m2, productType } = req.body;

  const image_Url = req.file
    ? `/uploads/${req.file.filename}`
    : `/uploads/default-product.png`; 

  if (!modelo || !color || !productType || costo_m2 == null) {
    res.status(400).json({ message: 'Faltan datos' });
    return;
  }

  try {
    const newProduct = await Product.create({ 
      modelo, 
      color, 
      costo_m2, 
      img_Url: image_Url,
      productType 
    });
    res.status(201).json({ message: 'Producto agregado', product: newProduct });
    console.log('Image URL a guardar:', image_Url); 
    return;
  } catch (error) {
    console.error('Error al agregar producto:', error);
    res.status(500).json({ message: 'Error al agregar producto' });
    return;
  }
  
};

export const updateProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { modelo, color, costo_m2, productType } = req.body;

  try {
    const product = await Product.findByPk(id);

    if (!product) {
      res.status(404).json({ message: 'Producto no encontrado' });
      return
    }

    // Solo actualizar la imagen si se envió una nueva
    const updateData: any = { modelo, color, costo_m2, productType };
    if (req.file) {
      updateData.img_Url = `/uploads/${req.file.filename}`;
    }

    await product.update(updateData);
    res.json({ message: 'Producto actualizado', product });
    return;
    
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    res.status(500).json({ message: 'Error al actualizar producto' });
    return;
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const product = await Product.findByPk(id);

    if (!product) {
      res.status(404).json({ message: 'Producto no encontrado' });
      return;
    }

    await product.destroy();
    res.json({ message: 'Producto eliminado' });
    return;

  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).json({ message: 'Error al eliminar producto' });
    return;
  }
};

export const getAllProducts = async (_req: Request, res: Response) => {
  try {
    const products = await Product.findAll();
    res.json(products);
    return;
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ message: 'Error al obtener productos' });
    return;
  }
};

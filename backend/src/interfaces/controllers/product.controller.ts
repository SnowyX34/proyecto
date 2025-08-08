import { Request, Response } from 'express';
import { Product, ProductAttributes } from '../../infrestructure/orm/models/product.model';
import { CloudinaryService } from '../../infrestructure/services/cloudinary.service';
import { Op } from 'sequelize'; // Importar Op para operadores de Sequelize

// Definir interfaces para los request bodies
interface AddProductBody {
  modelo: string;
  color: string;
  costo_m2: number;
  productType: string;
  descripcion?: string;
  img_Url?: string;
}

interface UpdateProductBody {
  modelo?: string;
  color?: string;
  costo_m2?: number;
  productType?: string;
  descripcion?: string;
}

export const addProduct = async (req: Request<{}, {}, AddProductBody>, res: Response) => {
  const { modelo, color, costo_m2, productType, img_Url, descripcion } = req.body;

  if (!modelo || !color || !productType || !descripcion || costo_m2 == null) {
    res.status(400).json({ message: 'Faltan datos' });
    return;
  }

  try {
    let image_url_to_save = 'https://via.placeholder.com/400x300/cccccc/666666?text=Sin+Imagen';
    if (req.file) {
      const uploadResult = await CloudinaryService.uploadImage(
        req.file.buffer,
        req.file.originalname,
        'products'
      );
      image_url_to_save = uploadResult.secure_url;
      console.log('Imagen subida a Cloudinary:', image_url_to_save);
    } else if (img_Url) {
      image_url_to_save = img_Url;
    }

    const newProduct = await Product.create({
      modelo,
      color,
      costo_m2,
      img_Url: image_url_to_save,
      productType,
      descripcion
    });

    res.status(201).json({
      message: 'Producto agregado',
      product: newProduct
    });
    return;
  } catch (error) {
    console.error('Error al agregar producto:', error);
    res.status(500).json({
      message: 'Error al agregar producto',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
    return;
  }
};

export const updateProduct = async (req: Request<{ id: string }, {}, UpdateProductBody>, res: Response) => {
  const { id } = req.params;
  const { modelo, color, costo_m2, productType, descripcion } = req.body;

  try {
    const product = await Product.findByPk(id);
    if (!product) {
      res.status(404).json({ message: 'Producto no encontrado' });
      return;
    }

    const updateData: Partial<ProductAttributes & { img_Url?: string }> = {
      modelo,
      color,
      costo_m2,
      productType,
      descripcion
    };

    if (req.file) {
      if (product.img_Url && product.img_Url.includes('cloudinary.com')) {
        const publicId = CloudinaryService.extractPublicId(product.img_Url);
        if (publicId) {
          try {
            await CloudinaryService.deleteImage(publicId);
            console.log('Imagen anterior eliminada de Cloudinary');
          } catch (error) {
            console.warn('No se pudo eliminar la imagen anterior:', error);
          }
        }
      }
      const uploadResult = await CloudinaryService.uploadImage(
        req.file.buffer,
        req.file.originalname,
        'products'
      );
      updateData.img_Url = uploadResult.secure_url;
      console.log('Nueva imagen subida a Cloudinary:', updateData.img_Url);
    }

    await product.update(updateData);
    await product.reload();

    res.json({
      message: 'Producto actualizado',
      product: product
    });
    return;
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    res.status(500).json({
      message: 'Error al actualizar producto',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
    return;
  }
};

export const deleteProduct = async (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;
  try {
    const product = await Product.findByPk(id);
    if (!product) {
      res.status(404).json({ message: 'Producto no encontrado' });
      return;
    }

    if (product.img_Url && product.img_Url.includes('cloudinary.com')) {
      const publicId = CloudinaryService.extractPublicId(product.img_Url);
      if (publicId) {
        try {
          await CloudinaryService.deleteImage(publicId);
          console.log('Imagen eliminada de Cloudinary');
        } catch (error) {
          console.warn('No se pudo eliminar la imagen de Cloudinary:', error);
        }
      }
    }

    await product.destroy();
    res.json({ message: 'Producto eliminado' });
    return;
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).json({
      message: 'Error al eliminar producto',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
    return;
  }
};

export const getAllProducts = async (req: Request, res: Response) => {
  const { productType } = req.query;
  const whereClause: any = {};

  if (productType && typeof productType === 'string') {
    whereClause.productType = {
      [Op.like]: `%${productType}%` // funciona en MySQL y es case-insensitive si el collation lo permite
    };
  }

  try {
    const products = await Product.findAll({
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
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({
      message: 'Error al obtener productos',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};



// NUEVO: Función para buscar productos por término
export const searchProducts = async (req: Request, res: Response) => {
  const { term } = req.query; // Obtener el término de búsqueda de los query parameters

  if (!term) {
    res.status(400).json({ message: 'Se requiere un término de búsqueda' });
    return;
  }

  try {
    const products = await Product.findAll({
      where: {
        modelo: {
          [Op.like]: `%${term}%` // Buscar coincidencias parciales en el campo 'modelo'
        }
      },
      attributes: ['product_id', 'modelo', 'color', 'costo_m2', 'descripcion', 'img_Url', 'productType']
    });

    if (products.length === 0) {
      res.status(404).json({ message: 'No se encontraron productos con ese término' });
      return;
    }

    res.json(products);
  } catch (error) {
    console.error('Error al buscar productos:', error);
    res.status(500).json({
      message: 'Error al buscar productos',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

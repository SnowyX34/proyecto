import { Router } from 'express';
import { upload } from '../middlewares/upload.middleware';
import { addProduct, updateProduct, deleteProduct, getAllProducts } from '../controllers/product.controller';
import { verifyAdmin } from '../middlewares/authAdmin';
import { verifyToken } from '../middlewares/auth';

const router = Router();

router.post('/add', verifyToken, verifyAdmin, upload.single('image'), addProduct);
router.put('/:id', verifyToken, verifyAdmin, upload.single('image'), updateProduct);
router.delete('/:id', verifyToken, verifyAdmin, deleteProduct);
router.get('/', verifyToken, verifyAdmin, getAllProducts);


export default router;

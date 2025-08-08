import { Router } from 'express';
import { upload } from '../middlewares/upload.middleware';
<<<<<<< HEAD
import { addProduct, updateProduct, deleteProduct, getAllProducts, searchProducts } from '../controllers/product.controller';
=======
import { addProduct, updateProduct, deleteProduct, getAllProducts } from '../controllers/product.controller';
>>>>>>> 5837d271ff19383e3e30f3ee65bcc6dcf81a5592
import { verifyAdmin } from '../middlewares/authAdmin';
import { verifyToken } from '../middlewares/auth';

const router = Router();

router.post('/add', verifyToken, verifyAdmin, upload.single('image'), addProduct);
router.put('/:id', verifyToken, verifyAdmin, upload.single('image'), updateProduct);
router.delete('/:id', verifyToken, verifyAdmin, deleteProduct);
router.get('/search', searchProducts);
router.get('/', getAllProducts);


export default router;

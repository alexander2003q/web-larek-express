import { Router } from 'express';
import { createProduct, getProducts } from '../controllers/product';
import { validateProductBody } from '../middlewares/validation';

const router = Router();

router.get('/', getProducts);
router.post('/', validateProductBody, createProduct);

export default router;

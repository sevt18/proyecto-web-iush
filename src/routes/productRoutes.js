import { Router } from "express";

import {getProducts, createProduct, updateProduct, deleteProduct, searchProducts } from "../controllers/productController.js";

const router = Router();

router.get('/products', getProducts);
router.post('/products', createProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);
router.get('/products/search', searchProducts);

export default router;
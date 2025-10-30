import { Router } from "express";

import { getProducts, searchProducts, createReview, getProductReviews } from "../controllers/visitorController.js";

const router = Router();

router.get('/products', getProducts);
router.get('/products/search', searchProducts);
router.post('/products/:productId/reviews', createReview);
router.get('/products/:productId/reviews', getProductReviews);


export default router;
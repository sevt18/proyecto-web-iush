import { Router } from "express";

import { getReviews, createReview, updateReview, deleteReview} from "../controllers/reviewController.js";

const router = Router();

router.get('/products/:productId/reviews', getReviews);
router.post('/products/:productId/reviews', createReview);
router.put('/reviews/:id', updateReview);
router.delete('/reviews/:id', deleteReview);


export default router;

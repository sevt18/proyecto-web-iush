import { Router } from "express";

import { manageInventory, manageBatches, getDistributorStats, getMovementHistory } from "../controllers/distributorController.js";

const router = Router();

router.post('/manage-inventory', manageInventory);
router.post('/manage-batches', manageBatches);
router.get('/stats', getDistributorStats);
router.get('/movement-history', getMovementHistory);



export default router;
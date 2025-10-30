import { Router } from "express";

import { getAllUsers, assignRole, manageProducts } from "../controllers/adminController.js";

const router = Router();

router.get('/users', getAllUsers);
router.post('/assign-role', assignRole);
router.post('/manage-products', manageProducts);



export default router;
import { Router } from "express";

import { registerUser, registerDistributor, login } from "../controllers/authController.js";

const router = Router();


router.post('/register', registerUser);
router.post('/register-distributor', registerDistributor);
router.post('/login', login);

export default router;
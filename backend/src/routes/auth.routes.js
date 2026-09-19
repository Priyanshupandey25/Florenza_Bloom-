import { Router } from "express";

import { getMe, login, register } from "../controllers/auth.controller.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";

const router = Router();

router.post('/register', register);

router.post('/login', login);

router.get('/get-me', authenticateUser, getMe);

export default router;
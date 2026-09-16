import { Router } from "express";

import authController from "../controllers/auth.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = Router();

router.post('/register', authController.registerUser);

router.post('/login', authController.loginUser);

router.get('/get-me', authMiddleware.authUser, authController.getMe);
module.exports = router;
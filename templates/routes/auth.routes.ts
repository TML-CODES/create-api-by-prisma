import express from 'express';
import * as controller from '../controllers/auth.controller';

const router = express.Router();

router.get("/reset-password", controller.getHtmlResetPass);
router.post("/reset-password/:resetToken", controller.resetUserPassword);

router.post("/request/reset-password", controller.sendPasswordResetEmail);
router.post("/login", controller.login);
router.post("/refresh", controller.refreshToken);
router.post("/logout", controller.logout);

export default router;
import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/send-otp', AuthController.sendOtp);
router.post('/verify-otp', AuthController.verifyOtp);
router.post('/resend-otp', AuthController.sendOtp);
router.get('/me', authenticate, AuthController.getMe);
router.post('/logout', AuthController.logout);

export default router;

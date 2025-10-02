import express from 'express';
import {
  register,
  login,
  logout,
  getMe,
  updateDetails,
  updatePassword
} from '../../controllers/authController.js';

import { authenticate } from '../../middleware/auth.js';

const router = express.Router();

// 公开路由（不需要认证）
router.post('/register', register);
router.post('/login', login);

// 保护路由（需要认证）
router.use(authenticate); // 下面的所有路由都需要认证

router.get('/me', getMe);
router.put('/updatedetails', updateDetails);
router.put('/updatepassword', updatePassword);
router.post('/logout', logout);

export default router;
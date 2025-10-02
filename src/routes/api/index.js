import express from 'express';
import userRoutes from './users.js';
import authRoutes from './auth.js';

const router = express.Router();

// API 路由配置
router.use('/users', userRoutes);
router.use('/auth', authRoutes);

// API 根路径
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API 服务运行正常',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

export default router;
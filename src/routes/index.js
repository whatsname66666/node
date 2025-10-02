import express from 'express';

const router = express.Router();

// 根路径
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Express ES6 API 服务运行正常',
    version: '1.0.0',
    documentation: '/api-docs',
    timestamp: new Date().toISOString()
  });
});

// 健康检查端点
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: '服务健康',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage()
  });
});

export default router;
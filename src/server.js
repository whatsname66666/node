import app from './app.js';
import { connectDB } from './config/database.js';
import logger from './utils/logger.js';

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    // 连接数据库
    await connectDB();
    
    // 启动服务器
    app.listen(PORT, () => {
      // logger.info(`🚀 服务器运行在端口 ${PORT}`);
      // logger.info(`📊 环境: ${process.env.NODE_ENV || 'development'}`);
      // logger.info(`🌐 地址: http://localhost:${PORT}`);
    });
  } catch (error) {
    logger.error('❌ 启动服务器失败:', error);
    process.exit(1);
  }
};

// 优雅关闭
process.on('SIGTERM', () => {
  logger.info('SIGTERM 信号收到，正在优雅关闭服务器');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT 信号收到，正在关闭服务器');
  process.exit(0);
});

startServer();
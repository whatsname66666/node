import mongoose from 'mongoose';
import logger from '../utils/logger.js';

// const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/myData';
const MONGODB_URI = 'mongodb://127.0.0.1:27017/myData';
console.log(process.env.MONGODB_URI)
export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGODB_URI);
    
    // logger.info(`✅ MongoDB 连接成功: ${conn.connection.host}`);
    
    // 连接事件监听
    mongoose.connection.on('error', (err) => {
      logger.error('MongoDB 连接错误:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB 连接断开');
    });
    
  } catch (error) {
    logger.error('❌ MongoDB 连接失败:', error);
    process.exit(1);
  }
};
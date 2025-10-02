import logger from '../utils/logger.js';

const errorHandler = (err, req, res, next) => {
  logger.error('错误信息:', err);

  let error = { ...err };
  error.message = err.message;

  // Mongoose 错误处理
  if (err.name === 'CastError') {
    const message = '资源未找到';
    error = { message, status: 404 };
  }

  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(val => val.message);
    const message = `输入数据验证失败: ${messages.join(', ')}`;
    error = { message, status: 400 };
  }

  if (err.code === 11000) {
    const message = '重复的字段值';
    error = { message, status: 400 };
  }

  res.status(error.status || 500).json({
    success: false,
    message: error.message || '服务器内部错误',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

export default errorHandler;
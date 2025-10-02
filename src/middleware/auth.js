import jwt from 'jsonwebtoken';
import User from '../models/systemUser.js';
import { sendError } from '../utils/apiResponse.js';
import logger from '../utils/logger.js';

// JWT 认证中间件
export const authenticate = async (req, res, next) => {
  try {
    let token;

    // 从 Authorization header 或 cookie 中获取 token
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies?.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return sendError(res, '访问被拒绝，未提供令牌', null, 401);
    }

    try {
      // 验证 token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // 获取用户信息（排除密码字段）
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        return sendError(res, '用户不存在', null, 401);
      }

      req.user = user;
      next();
    } catch (error) {
      logger.error('Token 验证失败:', error);
      return sendError(res, '无效的令牌', null, 401);
    }
  } catch (error) {
    logger.error('认证中间件错误:', error);
    next(error);
  }
};

// 授权中间件（基于角色）
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return sendError(res, '请先登录', null, 401);
    }

    if (!roles.includes(req.user.role)) {
      return sendError(res, '没有权限执行此操作', null, 403);
    }

    next();
  };
};

// 可选认证中间件（不强制要求登录）
export const optionalAuth = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies?.token) {
      token = req.cookies.token;
    }

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');
        req.user = user;
      } catch (error) {
        // token 无效，但不阻止请求继续
        logger.warn('可选认证 token 无效:', error.message);
      }
    }

    next();
  } catch (error) {
    logger.error('可选认证中间件错误:', error);
    next();
  }
};
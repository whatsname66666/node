import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/systemUser.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';
import logger from '../utils/logger.js';

// 生成 JWT Token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  });
};

// 发送 token 响应
const sendTokenResponse = (user, statusCode, res, message = '操作成功') => {
  const token = generateToken(user._id);

  // Cookie 选项
  const options = {
    expires: new Date(
      Date.now() + (process.env.JWT_COOKIE_EXPIRE || 30) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production'
  };

  // 发送响应
  res.status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      message,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        },
        token
      }
    });
};

// 用户注册
export const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 验证必填字段
    if (!email || !password) {
      return sendError(res, '请提供姓名、邮箱和密码');
    }

    // 检查邮箱是否已存在
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return sendError(res, '邮箱已被注册');
    }

    // 创建用户
    const user = await User.create({
      // name,
      email,
      password,
      // role: role || 'user'
    });

    logger.info(`新用户注册: ${email}`);
    sendTokenResponse(user, 201, res, '注册成功');
  } catch (error) {
    logger.error('用户注册错误:', error);
    next(error);
  }
};

// 用户登录
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 验证邮箱和密码
    if (!email || !password) {
      return sendError(res, '请提供邮箱和密码');
    }
    
    // 检查用户是否存在并验证密码
    const user = await User.findOne({ email }).select('+password');
    
    if (!user || !(await user.matchPassword(password))) {
      return sendError(res, '邮箱或密码错误', null, 401);
    }
    console.log(user,password)
    logger.info(`用户登录: ${email}`);
    sendTokenResponse(user, 200, res, '登录成功');
  } catch (error) {
    logger.error('用户登录错误:', error);
    next(error);
  }
};

// 用户登出
export const logout = (req, res) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000), // 10秒后过期
    httpOnly: true
  });

  res.status(200).json({
    success: true,
    message: '登出成功',
    data: {}
  });
};

// 获取当前用户信息
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    
    sendSuccess(res, '获取用户信息成功', {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    logger.error('获取用户信息错误:', error);
    next(error);
  }
};

// 更新用户信息
export const updateDetails = async (req, res, next) => {
  try {
    const fieldsToUpdate = {
      name: req.body.name,
      email: req.body.email
    };

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true
    });

    sendSuccess(res, '用户信息更新成功', {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    logger.error('更新用户信息错误:', error);
    next(error);
  }
};

// 更新密码
export const updatePassword = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('+password');

    // 检查当前密码
    if (!(await user.matchPassword(req.body.currentPassword))) {
      return sendError(res, '当前密码错误', null, 401);
    }

    user.password = req.body.newPassword;
    await user.save();

    sendTokenResponse(user, 200, res, '密码更新成功');
  } catch (error) {
    logger.error('更新密码错误:', error);
    next(error);
  }
};
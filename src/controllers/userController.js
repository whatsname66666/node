import User from '../models/systemUser.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';

// 获取所有用户
export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password');
    sendSuccess(res, '用户列表获取成功', users);
  } catch (error) {
    next(error);
  }
};

// 获取单个用户
export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return sendError(res, '用户未找到', null, 404);
    }
    
    sendSuccess(res, '用户获取成功', user);
  } catch (error) {
    next(error);
  }
};

// 创建用户
export const createUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    
    // 检查邮箱是否已存在
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return sendError(res, '邮箱已存在');
    }
    
    const user = new User({
      name,
      email,
      password
    });
    
    await user.save();
    
    // 不返回密码
    const userResponse = { ...user.toObject() };
    delete userResponse.password;
    
    sendSuccess(res, '用户创建成功', userResponse, 201);
  } catch (error) {
    next(error);
  }
};
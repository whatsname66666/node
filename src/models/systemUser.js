import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  // name: {
  //   type: String,
  //   required: [true, '请输入姓名'],
  //   trim: true,
  //   maxlength: [50, '姓名不能超过50个字符']
  // },
  email: {
    type: String,
    required: [true, '请输入邮箱'],
    // unique: true,
    // lowercase: true,
    // match: [
    //   /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
    //   '请输入有效的邮箱地址'
    // ]
  },
  password: {
    type: String,
    required: [true, '请输入密码'],
    minlength: [6, '密码至少6个字符'],
    select: false // 默认不返回密码字段
  },
  // role: {
  //   type: String,
  //   enum: ['user', 'admin'],
  //   default: 'user'
  // },
  // isActive: {
  //   type: Boolean,
  //   default: true
  // }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// 密码加密中间件
userSchema.pre('save', async function(next) {
  // 如果密码没有被修改，直接下一步
  if (!this.isModified('password')) {
    next();
  }

  // 加密密码
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// 实例方法：验证密码
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// 虚拟字段：用户创建时间格式化
userSchema.virtual('formattedCreatedAt').get(function() {
  if (!this.createdAt) {
    return ''; // 或者返回默认值，如 '未知时间'
  }
  return this.createdAt.toLocaleDateString('zh-CN');
});

// 静态方法：通过邮箱查找用户
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email });
};

export default mongoose.model('systemUser', userSchema,'systemUsers');
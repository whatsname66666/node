/**
 * API 响应格式化工具
 * 提供统一的成功和错误响应格式
 */

/**
 * 基础 API 响应类
 */
class ApiResponse {
  constructor(success, message, data = null, meta = null) {
    this.success = success;
    this.message = message;
    this.data = data;
    this.meta = meta;
    this.timestamp = new Date().toISOString();
  }

  /**
   * 创建成功响应
   */
  static success(message, data = null, meta = null) {
    return new ApiResponse(true, message, data, meta);
  }

  /**
   * 创建错误响应
   */
  static error(message, data = null, meta = null) {
    return new ApiResponse(false, message, data, meta);
  }

  /**
   * 转换为 JSON 对象
   */
  toJSON() {
    const response = {
      success: this.success,
      message: this.message,
      timestamp: this.timestamp
    };

    if (this.data !== null) {
      response.data = this.data;
    }

    if (this.meta !== null) {
      response.meta = this.meta;
    }

    return response;
  }
}

/**
 * 分页元数据类
 */
class PaginationMeta {
  constructor(page, pageSize, total, totalPages) {
    this.pagination = {
      page: parseInt(page),
      pageSize: parseInt(pageSize),
      total: parseInt(total),
      totalPages: parseInt(totalPages),
      hasNext: page < totalPages,
      hasPrev: page > 1
    };
  }

  toJSON() {
    return this.pagination;
  }
}

/**
 * 发送成功响应
 * @param {Object} res - Express 响应对象
 * @param {string} message - 成功消息
 * @param {any} data - 响应数据
 * @param {number} statusCode - HTTP 状态码，默认 200
 * @param {Object} meta - 元数据（如分页信息）
 */
const sendSuccess = (res, message, data = null, statusCode = 200, meta = null) => {
  const response = ApiResponse.success(message, data, meta);
  return res.status(statusCode).json(response.toJSON());
};

/**
 * 发送错误响应
 * @param {Object} res - Express 响应对象
 * @param {string} message - 错误消息
 * @param {any} data - 错误数据（可选）
 * @param {number} statusCode - HTTP 状态码，默认 400
 * @param {Object} meta - 元数据（可选）
 */
const sendError = (res, message, data = null, statusCode = 400, meta = null) => {
  const response = ApiResponse.error(message, data, meta);
  return res.status(statusCode).json(response.toJSON());
};

/**
 * 发送分页成功响应
 * @param {Object} res - Express 响应对象
 * @param {string} message - 成功消息
 * @param {Array} data - 数据数组
 * @param {number} page - 当前页码
 * @param {number} pageSize - 每页数量
 * @param {number} total - 总记录数
 * @param {number} statusCode - HTTP 状态码，默认 200
 */
const sendPaginated = (res, message, data, page, pageSize, total, statusCode = 200) => {
  const totalPages = Math.ceil(total / pageSize);
  const meta = new PaginationMeta(page, pageSize, total, totalPages);
  const response = ApiResponse.success(message, data, meta.toJSON());
  return res.status(statusCode).json(response.toJSON());
};

/**
 * 发送创建成功的响应（201状态码）
 * @param {Object} res - Express 响应对象
 * @param {string} message - 成功消息
 * @param {any} data - 创建的数据
 */
const sendCreated = (res, message, data = null) => {
  return sendSuccess(res, message, data, 201);
};

/**
 * 发送无内容的成功响应（204状态码）
 * @param {Object} res - Express 响应对象
 * @param {string} message - 成功消息
 */
const sendNoContent = (res, message = '操作成功') => {
  const response = ApiResponse.success(message);
  return res.status(204).json(response.toJSON());
};

/**
 * 发送验证错误响应
 * @param {Object} res - Express 响应对象
 * @param {string} message - 错误消息
 * @param {Array} errors - 验证错误详情
 */
const sendValidationError = (res, message = '输入数据验证失败', errors = []) => {
  return sendError(res, message, { errors }, 422);
};

/**
 * 发送未授权错误响应
 * @param {Object} res - Express 响应对象
 * @param {string} message - 错误消息
 */
const sendUnauthorized = (res, message = '未授权访问') => {
  return sendError(res, message, null, 401);
};

/**
 * 发送禁止访问错误响应
 * @param {Object} res - Express 响应对象
 * @param {string} message - 错误消息
 */
const sendForbidden = (res, message = '禁止访问') => {
  return sendError(res, message, null, 403);
};

/**
 * 发送未找到错误响应
 * @param {Object} res - Express 响应对象
 * @param {string} message - 错误消息
 */
const sendNotFound = (res, message = '资源未找到') => {
  return sendError(res, message, null, 404);
};

/**
 * 发送服务器错误响应
 * @param {Object} res - Express 响应对象
 * @param {string} message - 错误消息
 * @param {any} error - 错误对象（开发环境）
 */
const sendServerError = (res, message = '服务器内部错误', error = null) => {
  // 在生产环境中不暴露错误详情
  const errorData = process.env.NODE_ENV === 'development' && error ? { debug: error } : null;
  return sendError(res, message, errorData, 500);
};

export {
  ApiResponse,
  PaginationMeta,
  sendSuccess,
  sendError,
  sendPaginated,
  sendCreated,
  sendNoContent,
  sendValidationError,
  sendUnauthorized,
  sendForbidden,
  sendNotFound,
  sendServerError
};
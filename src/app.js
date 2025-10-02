import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import 'dotenv/config';

// 导入路由
import indexRoutes from './routes/index.js';
import apiRoutes from './routes/api/index.js';

// 导入中间件
import errorHandler from './middleware/errorHandler.js';
import { stream } from './utils/logger.js';

const app = express();

// 安全中间件
app.use(helmet());

// CORS 配置
const corsOptions = {
  origin: function (origin, callback) {
    // 允许的域名列表:cite[1]
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:5173',
      // 'https://yourproductiondomain.com' 线上域名
    ];
    
    // 如果是无来源请求（比如 Postman）或者域名在允许列表中，则允许
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // 允许发送认证信息（cookies、Authorization 头等）:cite[1]:cite[10]
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'], // 允许的 HTTP 方法:cite[1]
  allowedHeaders: [ // 允许的请求头:cite[1]:cite[10]
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin'
  ]
};
app.use(cors(corsOptions));

// 压缩响应
app.use(compression());

// Cookie 解析
app.use(cookieParser());

// 请求日志
app.use(morgan('combined', { stream }));

// 解析请求体
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// 静态文件服务
app.use(express.static('public'));

// 路由
app.use('/', indexRoutes);
app.use('/api', apiRoutes);

// 404 处理
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: '路由未找到',
    path: req.originalUrl
  });
});

// 错误处理中间件（放在最后）
app.use(errorHandler);

export default app;
import Example from '../models/example.js';
import {formatDateTime} from '../utils/utility.js'

// 获取单个用户
export const getMoviesList = async (req, res, next) => {
  try {
   // 获取分页参数，设置默认值
  const page = parseInt(req.body.page) || 1;
  const pageSize = parseInt(req.body.pageSize) || 10;

  // 计算跳过的文档数量
  const skip = (page - 1) * pageSize;
  const totalCount = await Example.countDocuments()
  Example.find({}).skip(skip).limit(pageSize).lean().exec().then(data => {
    res.json({
      success: true,
      data: data.map(item => {
        return { ...item, release_date: formatDateTime(item.release_date) }
      }),
      count: totalCount
    })
  })
  } catch (error) {
    next(error);
  }
};
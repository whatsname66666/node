import Wqmt from '../models/wqmt.js';
import { formatDateTime } from '../utils/utility.js'

// 获取单个用户
export const getMusicList = async (req, res, next) => {
  try {
    // 获取分页参数，设置默认值
    const page = parseInt(req.body.page) || 1;
    const pageSize = parseInt(req.body.pageSize) || 10;

    // 计算跳过的文档数量
    const skip = (page - 1) * pageSize;
    // 使用聚合管道来直接处理嵌套数组
    const aggregationPipeline = [
      // 展开data数组，使每个音乐项成为独立文档
      { $unwind: '$data' },
      // 跳过和限制
      { $skip: skip },
      { $limit: pageSize },
      // 替换根文档为data字段内容
      { $replaceRoot: { newRoot: '$data' } }
    ];
    // 并行执行计数和查询
    const [totalCountResult, musicData] = await Promise.all([
      // 获取总音乐数量（不是文档数量）
      Wqmt.aggregate([
        { $unwind: '$data' },
        { $count: 'total' }
      ]),
      // 获取分页后的音乐数据
      Wqmt.aggregate(aggregationPipeline)
    ]);
    const totalCount = totalCountResult[0] ? totalCountResult[0].total : 0;

    // 格式化日期字段
    const formattedData = musicData.map(item => ({
      ...item,
      publish_time: formatDateTime(item.publish_time)
    }));
    res.json({
      success: true,
      data: formattedData,
      count: totalCount,
      page,
      pageSize,
      totalPages: Math.ceil(totalCount / pageSize)
    });
    // const totalCount = await Wqmt.countDocuments()
    // Wqmt.find({}).skip(skip).limit(pageSize).lean().exec().then(data => {
    //   console.log(data)
    //       // 从所有文档的data数组中提取并合并音乐数据
    //   let allMusicData = [];
    //   data.forEach(doc => {
    //     if (doc.data && Array.isArray(doc.data)) {
    //       allMusicData = allMusicData.concat(doc.data);
    //     }
    //   });

    //   // 格式化日期字段
    //   const formattedData = allMusicData.map(item => ({
    //     ...item,
    //     // 根据你的数据，这里应该是 publish_time，不是 release_date
    //     publish_time: formatDateTime(item.publish_time)
    //   }));

    //   res.json({
    //     success: true,
    //     data:formattedData,
    //     count: totalCount
    //   })
    // })
  } catch (error) {
    next(error);
  }
};
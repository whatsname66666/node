export function formatDateTime(dateString) {
  // 创建Date对象
  const date = new Date(dateString);

  // 获取各个时间组件
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始，需要+1
  const day = String(date.getDate()).padStart(2, '0');

  // 组合成目标格式
  return `${year}-${month}-${day}`;
}
// 金额格式化：数据库以「分」存储，展示时转换为「元」。
// 例：88000 → ¥880；15800 → ¥158；1250 → ¥12.50
export function formatPrice(cents: number): string {
  const yuan = cents / 100;
  const hasFraction = cents % 100 !== 0;
  return `¥${yuan.toLocaleString("zh-CN", {
    minimumFractionDigits: hasFraction ? 2 : 0,
    maximumFractionDigits: 2,
  })}`;
}

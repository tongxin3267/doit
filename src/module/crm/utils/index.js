export function formatNumber(n) {
  const str = n.toString()
  return str[1]
    ? str
    : `0${str}`
}

// 时间格式化
export function formatTime(date) {
  const hour = date.getHours()
  const minute = date.getMinutes()

  const time = [hour, minute].map(formatNumber).join(':')

  return time
}

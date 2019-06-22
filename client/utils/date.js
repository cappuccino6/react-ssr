export const fromNow = (
  past = new Date(),
  now = new Date(),
  maxUnit = 'hour'
) => {
  past = new Date(past)
  now = new Date(now)

  // 一天内从小单位算起，更精准
  let delta = (now - past) / 1000

  if (delta < 0) {
    delta = -delta

    if (delta < 60) {
      return `${Math.ceil(delta)} 秒后`
    }

    delta = parseInt(delta / 60, 10)
    if (delta < 60) {
      return `${delta} 分钟后`
    }

    delta = parseInt(delta / 60, 10)
    if (delta < 24 || maxUnit === 'hour') {
      return `${delta} 小时后`
    }

    const nowDate = new Date(now)
    const pastDate = new Date(past)
    // 24 小时 * 60 分钟 * 60 秒 * 1000 毫秒 = 86400000
    delta = parseInt((pastDate - nowDate) / 86400000, 10)
    return `${delta} 天后`
  } else if (delta < 60) {
    return '刚刚'
  }

  delta = parseInt(delta / 60, 10)
  if (delta < 60) {
    return `${delta} 分钟前`
  }

  delta = parseInt(delta / 60, 10)
  if (delta < 24) {
    return `${delta} 小时前`
  }

  // 大于等于一天要考虑年月的特殊情况，先看年再看月
  const yearGap = now.getFullYear() - past.getFullYear()
  const monthGap = now.getMonth() - past.getMonth()
  const dayGap = now.getDate() - past.getDate()
  // see: http://stackoverflow.com/questions/315760/what-is-the-best-way-to-determine-the-number-of-days-in-a-month-with-javascript
  const daysInCurrentMonth = date =>
    new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()

  // 同年同月
  if (yearGap === 0 && monthGap === 0) {
    return `${dayGap} 天前`
  }

  // 同年相邻月/跨年相邻月
  if (
    (yearGap === 0 && monthGap === 1) ||
    (yearGap === 1 && monthGap === -11)
  ) {
    if (dayGap < 0) {
      return `${daysInCurrentMonth(past) + dayGap} 天前`
    }
    return '1 月前'
  }

  // 非相邻月
  if (yearGap < 2) {
    if (yearGap === 1 && monthGap >= 0) {
      return '1 年前'
    }
    return `${yearGap * 12 + monthGap} 月前`
  }

  return `${yearGap} 年前`
}

export const getTimeStamp = time => time ? new Date(time.replace(/-/g, '/')).getTime() : 0

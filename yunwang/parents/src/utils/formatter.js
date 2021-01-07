export function formatterTime (time) {
  let result = '-'
  let date
  if (time && time !== null) {
    date = new Date(time)
  } else {
    date = new Date()
  }
  let year = date.getFullYear()
  let month = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)
  let day = (date.getDate()) < 10 ? '0' + (date.getDate()) : (date.getDate())
  let hour = (date.getHours()) < 10 ? '0' + (date.getHours()) : (date.getHours())
  let minutes = (date.getMinutes()) < 10 ? '0' + (date.getMinutes()) : (date.getMinutes())
  result = year + '-' + month + '-' + day + ' ' + hour + ':' + minutes
  return result
}

// 格式化日期
export function timeFormatterSort (time) {
  let result = '-'
  if (time !== null) {
    let date = new Date(time)
    let year = date.getFullYear()
    let month = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)
    let day = (date.getDate()) < 10 ? '0' + (date.getDate()) : (date.getDate())
    result = year + '-' + month + '-' + day
  }
  return result
}
// 获取当天前的日期
export function getDay (num, str) {
  var today = new Date()
  var nowTime = today.getTime()
  var ms = 24 * 3600 * 1000 * num
  today.setTime(parseInt(nowTime + ms))
  var oYear = today.getFullYear()
  var oMoth = (today.getMonth() + 1).toString()
  if (oMoth.length <= 1) oMoth = '0' + oMoth
  var oDay = today.getDate().toString()
  if (oDay.length <= 1) oDay = '0' + oDay
  return oYear + str + oMoth + str + oDay
}
// 格式化日期
export function timeMonthFormatter (time) {
  let result = '-'
  if (time !== null) {
    let date = new Date(time)
    let month = date.getMonth() + 1
    result = month + '月'
  }
  return result
}

// 格式化日期
export function timeMonthDayFormatter (time) {
  let result = '-'
  if (time !== null) {
    let date = new Date(time)
    let month = date.getMonth() + 1
    let day = date.getDate()
    result = month + '月' + day + '日'
  }
  return result
}
// 格式化时间戳
export function timeFormatter (time) {
  let result = '-'
  if (time && time !== null) {
    let date = new Date(time)
    let year = date.getFullYear()
    let month = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)
    let day = (date.getDate()) < 10 ? '0' + (date.getDate()) : (date.getDate())
    let hour = (date.getHours()) < 10 ? '0' + (date.getHours()) : (date.getHours())
    let minutes = (date.getMinutes()) < 10 ? '0' + (date.getMinutes()) : (date.getMinutes())
    let seconds = (date.getSeconds()) < 10 ? '0' + (date.getSeconds()) : (date.getSeconds())
    result = year + '-' + month + '-' + day + ' ' + hour + ':' + minutes + ':' + seconds
  }
  return result
}

// 进出状态
export function inOutStatusFormatter (type) {
  if (type === null) return '--'
  if (type === 0) return '进场'
  if (type === 1) return '出场'
  if (type === 2) return '不分进出场'
}
// 格式化时间戳
export function timeHourMinFormatter (time) {
  let result = '-'
  if (time && time !== null) {
    let date = new Date(time)
    let hour = (date.getHours()) < 10 ? '0' + (date.getHours()) : (date.getHours())
    let minutes = (date.getMinutes()) < 10 ? '0' + (date.getMinutes()) : (date.getMinutes())
    result = hour + ':' + minutes
  }
  return result
}

export function timeRangeFormatter (time) {
  let result = '-'
  if (time && time !== null) {
    let date = new Date(time)
    if (date.getHours() < 6) {
      result = '凌晨'
    } else if (date.getHours() < 11) {
      result = '早上'
    } else if (date.getHours() < 14) {
      result = '中午'
    } else if (date.getHours() < 18) {
      result = '下午'
    } else if (date.getHours() < 22) {
      result = '晚上'
    } else {
      result = '深夜'
    }
  }
  return result
}

export function formatterTime2 (time) {
  let result = '-'
  let date
  if (time && time !== null) {
    date = new Date(time)
  } else {
    date = new Date()
  }
  let year = date.getFullYear()
  let month = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)
  let day = (date.getDate()) < 10 ? '0' + (date.getDate()) : (date.getDate())
  let hour = (date.getHours()) < 10 ? '0' + (date.getHours()) : (date.getHours())
  let minutes = (date.getMinutes()) < 10 ? '0' + (date.getMinutes()) : (date.getMinutes())
  let seconds = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
  result = year + '-' + month + '-' + day + ' ' + hour + ':' + minutes + ':' + seconds
  return result
}

export function timeFormatterDayEnd (time) {
  let result = '-'
  if (time !== null) {
    let date = new Date(time)
    let year = date.getFullYear()
    let month = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)
    let day = (date.getDate()) < 10 ? '0' + (date.getDate()) : (date.getDate())
    result = year + '-' + month + '-' + day + ' 23:59:59'
  }
  return result
}

// 金额格式化
export function moneyFormatter (type) {
  if (type === null || type === undefined) {
    return '-'
  } else {
    return type + '元'
  }
}

// 格式化日期(传秒)
export function timeDuration (duration) {
  let result = ''
  let day = 0
  let hour = 0
  let minutes = 0
  let seconds = 0
  if (duration != null) {
    seconds = duration
    if (seconds > 60) {
      minutes = seconds / 60
      seconds = seconds % 60
      if (minutes > 60) {
        hour = minutes / 60
        minutes = minutes % 60
        if (hour > 24) {
          day = hour / 24
          hour = hour % 24
        }
      }
    }
  }
  if (day > 0) {
    result += Math.floor(day) + '天'
  }
  if (hour > 0) {
    result += Math.floor(hour) + '小时'
  }
  if (minutes >= 0) {
    result += Math.floor(minutes) + '分钟'
  }
  if (day === 0 && seconds > 0) {
    result += Math.floor(seconds) + '秒'
  }
  if (result === '') {
    result = '-'
  }
  return result
}

// 进出场车类型
export function inOutCarFormatter (type) {
  if (type === 0) return '固定车'
  if (type === 1) return '免费车'
  if (type === 2) return '临时车'
  if (type === 3) return '特殊车'
}

// 支付场景
export function paySenceFormatter (type) {
  if (type === 0) return '预付'
  if (type === 1) return '出口直付'
  if (type === 2) return '无牌车'
  if (type === 3) return '优惠全减'
  if (type === 4) return '免费放行'
  if (type === 5) return '现金类型'
}

// 支付通道
export function payChannelFormatter (type) {
  if (type === 0) return '微信'
  if (type === 1) return '支付宝'
  if (type === 2) return '余额'
  if (type === 3) return '银联'
}

// 支付类型
export function payTypeFormatter (type) {
  if (type === 0) return '余额支付'
  if (type === 1) return '扫码枪支付'
  if (type === 2) return '出场扫码支付'
  if (type === 3) return '未知类型'
}

// 支付状态
export function payStatusFormatter (type) {
  if (type === 0) return '未支付'
  if (type === 1) return '已支付'
}

export function getQueryString (name) {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
  var r = window.location.search.substr(1).match(reg)
  if (r != null) {
    return r[2]
  }
  return ''
}

// 获取url的链接地址
export function getPicUrl (file) {
  let url = null
  if (window.createObjectURL !== undefined) {
    url = window.createObjectURL(file)
  } else if (window.URL !== undefined) {
    url = window.URL.createObjectURL(file)
  } else if (window.webkitURL !== undefined) {
    // webkit or chrome
    url = window.webkitURL.createObjectURL(file)
  }
  return url
}

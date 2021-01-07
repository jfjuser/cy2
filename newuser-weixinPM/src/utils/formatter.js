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

// 返回到小时
export function timeFormatterHour (time) {
  let result = '-'
  if (time && time !== null) {
    let date = new Date(time)
    let year = date.getFullYear()
    let month = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)
    let day = (date.getDate()) < 10 ? '0' + (date.getDate()) : (date.getDate())
    let hour = (date.getHours()) < 10 ? '0' + (date.getHours()) : (date.getHours())
    result = year + '/' + month + '/' + day + ' ' + hour + '时'
  }
  return result
}
// 返回没有年份
export function timeFormatterNoYear (time) {
  let result = '-'
  if (time && time !== null) {
    let date = new Date(time)
    let month = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)
    let day = (date.getDate()) < 10 ? '0' + (date.getDate()) : (date.getDate())
    let hour = (date.getHours()) < 10 ? '0' + (date.getHours()) : (date.getHours())
    let minutes = (date.getMinutes()) < 10 ? '0' + (date.getMinutes()) : (date.getMinutes())
    result = month + '/' + day + ' ' + hour + ':' + minutes
  }
  return result
}

export function timeFormatter1 (time) {
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
  return result.substring(5)
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
  if (minutes > 0) {
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

// 格式化时间(显示分钟数/不足一分钟按一分钟计算)
export function minFormatter (time) {
  let min = Math.ceil(time / 60 / 1000)
  return min
}

// 换成几点几分的形式
export function fontNum (time) {
  let res = time.split(':')[0] + '点' + time.split(':')[1] + '分'
  return res
}

// 格式化HH:ss返回长度大小
export function HHssFormatter (value) {
  if (value === null) return ''
  if (value) {
    let HH = Number(value.split(':')[0])
    let ss = Number(value.split(':')[1])
    return HH * 60 + ss
  }
}

// 格式化时间  ---> 数字
export function NumToHHssFormatter (value) {
  let HH = parseInt(value / 60)
  let mm = value % 60
  if (HH < '10') HH = '0' + HH
  if (mm < '10') mm = '0' + mm
  return HH + ':' + mm
}

// 格式化数字--> 时间
export function NumToTimeFormatter (value) {
  let HH = value / 60
  let mm = value % 60
  return HH + '小时' + mm + '分钟'
}

// 格式化数字--> 时间
export function timeToFormatter (str) {
  var arr = str.split('-')
  return arr[0] + '年' + arr[1] + '月'
}

export function HHssNumToTimeFormatter (value) {
  if (value === null) return ''
  let HH = Math.floor(value / 60)
  let mm = Math.floor(value % 60)
  return (HH < 10 ? '0' + HH : HH) + ':' + (mm < 10 ? '0' + mm : mm)
}

// 考勤类型
export function attendTypeFormatter (type) {
  if (type === 0) return '固定班制'
  if (type === 1) return '排班制'
  if (type === 2) return '自由时间制'
}

// 星期几的格式
export function numToChinese (value) {
  if (value === 1) return '一'
  if (value === 2) return '二'
  if (value === 3) return '三'
  if (value === 4) return '四'
  if (value === 5) return '五'
  if (value === 6) return '六'
  if (value === 7) return '天'
}

// 上班打卡
export function punchToCard (type) {
  if (type === 0) return '正常'
  if (type === -1) return '缺卡'
  if (type === -2) return '请假'
  if (type === -3) return '出差'
  if (type > 0) return '迟到' + type + '分钟'
}

// 下班打卡
export function punchComeCard (type) {
  if (type === 0) return '正常'
  if (type === -1) return '缺卡'
  if (type === -2) return '请假'
  if (type === -3) return '出差'
  if (type > 0) return '早退' + type + '分钟'
}
// 判断多少天
// UDP状态
export function udpFormatter (time) {
  let type = time - new Date().getTime() + 60 * 60 * 1000
  if (type >= 0) return '正常'
  if (type < 0) return '异常'
}

// 打卡类型
export function punchCardType (type) {
  if (type === 1) return '第一班上班卡'
  if (type === 2) return '第一班下班卡'
  if (type === 3) return '第二班上班卡'
  if (type === 4) return '第二班下班卡'
  if (type === 5) return '第三班上班卡'
  if (type === 6) return '第三班下班卡'
}

// 格式化获取日期天数和星期几
export function DayAndWeekFormatter (value) {
  if (value) {
    let year = parseInt(value.split('-')[0])
    let month = parseInt(value.split('-')[1])
    let now = new Date(year, month, 0)
    let num = now.getDate()
    const week = ['日', '一', '二', '三', '四', '五', '六']
    let data = []
    for (let i = 1; i <= num; i++) {
      data.push({
        date: i + `(${week[new Date(year, month - 1, i).getDay()]})`,
        name: 'name' + i
      })
    }
    return data
  } else {
    return []
  }
}

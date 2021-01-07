
// 金额格式化
export function moneyFormatter (type) {
  if (type === null || type === undefined) {
    return '-'
  } else {
    return type + '元'
  }
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

// 格式化日期星期
export function timeDayFormatter (time) {
  let result = '-'
  if (time !== null) {
    let date = new Date(time)
    let year = date.getFullYear()
    let month = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)
    let day = (date.getDate()) < 10 ? '0' + (date.getDate()) : (date.getDate())
    let week = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
    result = year + '-' + month + '-' + day + ' ' + week[date.getDay()]
  }
  return result
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

// 格式化时间戳
export function timeYearMonthFormatter (time) {
  let result = '-'
  if (time && time !== null) {
    let date = new Date(time)
    let year = date.getFullYear()
    let month = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)
    result = year + '-' + month
  }
  return result
}

// 格式化时间戳
export function timeYearMonthDayHourFormatter (time) {
  let result = '-'
  if (time && time !== null) {
    let date = new Date(time)
    let year = date.getFullYear()
    let month = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)
    let day = (date.getDate()) < 10 ? '0' + (date.getDate()) : (date.getDate())
    let hour = (date.getHours()) < 10 ? '0' + (date.getHours()) : (date.getHours())
    result = year + '-' + month + '-' + day + ' ' + hour + '点'
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

// 格式化HH:ss返回长度大小10:00
export function HHssFormatter (value) {
  if (value === null) return ''
  if (value) {
    let HH = Number(value.split(':')[0])
    let ss = Number(value.split(':')[1])
    return HH * 60 + ss
  }
}

// 格式化数字--> 时间
export function NumToTimeFormatter (value) {
  let HH = Math.floor(value / 60)
  let mm = value % 60
  return HH + '小时' + mm + '分钟'
}

// 格式化时间  ---> 数字
export function NumToHHssFormatter (value) {
  let HH = Math.floor(value / 60)
  let mm = value % 60
  return HH + ':' + mm
}

// 格式化获取日期天数和星期几
export function DayAndWeekFormatter (value) {
  //  if (value === 1) return '一'
  //  if (value === 2) return '二'
  //  if (value === 3) return '三'
  //  if (value === 4) return '四'
  //  if (value === 5) return '五'
  //  if (value === 6) return '六'
  //  if (value === 7) return '天'
  if (value) {
    let year = parseInt(value.split('-')[0])
    let month = parseInt(value.split('-')[1])
    let now = new Date(year, month, 0)
    let num = now.getDate()
    const week = ['日', '一', '二', '三', '四', '五', '六']
    let data = [
      {
        date: '姓名',
        name: 'userName'
      }
    ]
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

export function HHssNumToTimeFormatter (value) {
  if (value === null) return ''
  let HH = Math.floor(value / 60)
  let mm = Math.floor(value % 60)
  return (HH < 10 ? '0' + HH : HH) + ':' + (mm < 10 ? '0' + mm : mm)
}

export function isSyncFormatter (value) {
  if (value === '0') return '未同步'
  if (value === '1') return '同步成功'
  if (value === '2') return '同步中'
  if (value === '3') return '删除中'
  if (value === '4') return '修改照片或结束时间等待重新同步'
  if (value === '7') return '名字已修改，等待同步'
}

export function sexFormatter (type) {
  if (type === 1) return '男'
  if (type === 2) return '女'
}

// 数字格式化 保留两位小数
export function numberFormatter (data) {
  if (data && !isNaN(data)) {
    data = data.toFixed(2)
  }
  return data
}

export function defaultNumFormatter (data) {
  if (data) {
    return data
  } else {
    return 0
  }
}
// 相机相关
// 人脸相机类型
export function aiCameraTypeFormatter (type) {
  if (type === 129) return '华安人脸'
  if (type === 130) return '安卓人脸'
  if (type === 131) return 'X系列'
  if (type === 132) return '安卓科发人脸'
  if (type === 133) return 'X系列'
  if (type === 134) return 'Linux小门禁'
}
// 连接方式
export function networkTypeFormatter (type) {
  if (type === 0) return '网线'
  if (type === 1) return '无线'
  if (type === 11) return '4G'
  if (type === 12) return 'WIFI'
}
// 绑定状态
export function isBindFormatter (type) {
  if (type === 0) return '未绑定'
  if (type === 1) return '已绑定'
}

// 考勤类型
export function attendTypeFormatter (type) {
  if (type === 0) return '固定班制'
  if (type === 1) return '排班制'
  if (type === 2) return '自由时间制'
}

// 核销类型
export function cardTypeFormatter (type) {
  if (type === null) return '-'
  if (type === 0) return '第一次上班打卡'
  if (type === 1) return '第一次下班打卡'
  if (type === 2) return '第二次上班打卡'
  if (type === 3) return '第二次下班打卡'
  if (type === 4) return '第三次上班打卡'
  if (type === 5) return '第三次下班打卡'
}

export function authGroupTypeFormatter (type) {
  if (type === null) return '-'
  if (type === '0') return '员工'
  if (type === '1') return '访客'
}

export function compact (arr) {
  return arr.filter(Boolean)
}

// 出入口配置
export function inOutFormatter (type) {
  if (type === 0) return '入口'
  if (type === 1) return '出口'
  if (type !== 0 && type !== 1) return '--'
}

// ''转null
export function toNull (value) {
  if (value === '') {
    return null
  }
  return value
}

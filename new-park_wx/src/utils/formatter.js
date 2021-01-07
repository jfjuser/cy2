/*
*@Author: lyf
*@Date: 2018-08-28 13:37:47
 * @Last Modified by: lyf
 * @Last Modified time: 2019-11-27 17:57:25
*/

// 遍历table列是否显示
export function isShowColumnFormatter (array) {
  let btnPermissions = this.$router.history.current.meta.roles
  if (btnPermissions && btnPermissions instanceof Array && btnPermissions.length > 0) {
    const hasPermission = btnPermissions.some(role => {
      return array.includes(role)
    })
    return hasPermission
  } else {
    return false
  }
}
// 和上面的区别是，查父级路由有没有权限
export function isShowColumn2Father (array) {
  let btnPermissions = this.$route.matched[1].meta.roles
  if (btnPermissions && btnPermissions instanceof Array && btnPermissions.length > 0) {
    const hasPermission = btnPermissions.some(role => {
      return array.includes(role)
    })
    return hasPermission
  } else {
    return false
  }
}
// 优惠券规则权限
export function isTicketPer (arraySome, array) {
  let permission = array
  if (permission && permission instanceof Array && permission.length > 0) {
    const hasPermission = permission.some(role => {
      return arraySome.includes(role)
    })
    return hasPermission
  } else {
    return false
  }
}
// 同步格式化
export function isSyncFormatter (type) {
  if (type === 0) return '未同步'
  if (type === 1) return '已同步'
  if (type === 2) return '后台同步中'
  if (type === 3) return '后台删除中'
  if (type === 4) return '新增待审核'
  if (type === 5) return '修改待审核'
  if (type === 6) return '删除待审核'
}
/**
 *车场中心
 *
 * @export
 * @param {*} type
 * @returns
 */
export function positionFormatter (type) {
  if (type === 1) return '字符在整个车牌前面'
  if (type === 2) return '字符在整个车牌后面'
  if (type === 3) return '整个车牌'
}

// 黑名单车类型
export function blackCarTypeFormatter (type) {
  if (type === 0) return '挂失车'
  if (type === 1) return '通缉车'
  if (type === 2) return '其它'
}

/**
 *部门管理
 *
 * @export
 * @param {*} type
 * @returns
 */
export function eventNameFormatter (type) {
  if (type === 'CAP_IN_PLATE_TASK') return '入场车牌识别后'
  if (type === 'CAP_IN_OPEN_DOOR') return '车辆入场开闸后'
  if (type === 'IN_PUSH') return '车辆入场信息推送'
  if (type === 'CAP_OUT_PLATE_TASK') return '出场车牌识别后'
  if (type === 'CAP_OUT_OPEN_DOOR') return '车辆出场开闸后'
  if (type === 'OUT_PUSH') return '车辆出场信息推送'
}
// 部门类型
export function isParkFormatter (type) {
  if (type === 0) return '非车场'
  if (type === 1) return '车场'
}

// 部门级别
export function levelFormatter (type) {
  if (type === 1) return '平台级别'
  if (type === 2) return '代理级别'
  if (type === 3) return '车场级别'
}
// 通讯模式
export function transportTypeFormatter (type) {
  if (type === 0) return '4G模式'
  if (type === 1) return '标准通讯'
}

// 版本更新
export function versionTypeFormatter (type) {
  if (type === 0) return '平台'
  if (type === 1) return 'APP'
  if (type === 2) return '优惠券小程序'
  if (type === 3) return '人脸小程序'
}
/**
 *优惠券
 *
 * @export
 * @param {*} type
 * @returns
 */
export function typeFormatter (type) {
  if (type === 0) return '加款'
  if (type === 1) return '减款'
}
/**
 *
 *优惠券类型
 * @export
 * @param {*} type
 * @returns
 */
export function ticketTypeFormatter (type) {
  if (type === 0) return '减金额'
  if (type === 1) return '减时间'
  if (type === 2) return '全减免'
  if (type === 3) return '打折'
}
/**
 *优惠券时间类型
 *
 * @export
 * @param {*} type
 * @returns
 */
export function timeTypeFormatter (type) {
  if (type === 0) return '持续分钟数'
  if (type === 1) return '有效期'
  if (type === -2) return '持续天数'
}

// 金额格式化
export function moneyFormatter (type) {
  if (type === null || type === undefined) {
    return '-'
  } else {
    return type + '元'
  }
}

// 进出金额格式化
export function moneyInOutFormatter (type) {
  if (type === null || type === undefined) {
    return '0元'
  } else {
    if (type > 10000) {
      return Number(type / 10000).toFixed(2) + '万元'
    } else {
      return type + '元'
    }
  }
}
// 优惠券使用状态
export function isUsedFormatter (type) {
  if (type === 1) return '已使用'
  if (type === 2) return '使用中'
}

// 通道状态
export function statusFormatter (type) {
  if (type === 0) return '离线'
  if (type === 1) return '在线'
}

// 出入口配置
export function inOutFormatter (type) {
  if (type === 0) return '入口'
  if (type === 1) return '出口'
  if (type === 2) return '不区分'
  if (type !== 0 && type !== 1 && type !== 2) return '--'
}

// 配置状态
export function initFormatter (type) {
  if (type === 0) return '请配置通道'
  if (type === 1) return '正确'
}

// 绑定状态
export function isBindFormatter (type) {
  if (type === 0) return '未绑定'
  if (type === 1) return '已绑定'
}
// 连接方式
export function networkTypeFormatter (type) {
  if (type === 0) return '网线'
  if (type === 1) return '无线'
  if (type === 11) return '4G'
  if (type === 12) return 'WIFI'
}

// 图标
export function isIconFormatter (type) {
  if (type === 0) return 'fa fa-anchor'
  if (type === 1) return 'fa fa-desktop'
  if (type === 2) return 'fa fa-signal'
  if (type === 3) return 'fa fa-cloud'
  if (type === 4) return 'fa fa-sitemap'
  if (type === 5) return 'fa fa-gears'
  if (type === 6) return 'fa fa-car'
  if (type === 7) return 'fa fa-window-restore'
  if (type === 8) return 'fa fa-list-ul'
  if (type === 9) return 'fa fa-sliders'
}

// 支付方式
export function isPayFormatter (type) {
  if (type === 0) return '不使用'
  if (type === 2) return '平台支付'
  if (type === 3) return '无感支付'
  if (type === 5) return '畅盈云支付'
  if (type === 7) return 'PP停车支付'
  if (type === 8) return '农信银支付'
}

// 通讯模式
export function isTransportFormatter (type) {
  if (type === 0) return '4G方案'
  if (type === 1) return '标准方案'
}

// 免费车类型
export function isFreeCarFormatter (type) {
  if (type === 0) return '其它'
  if (type === 1) return '物业公司车辆'
  if (type === 2) return '集团公司车辆'
  if (type === 3) return '地产公司车辆'
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

export function timeFormatterDayEnd1 (time) {
  let result = '-'
  if (time !== null) {
    let date = new Date(time)
    let year = date.getFullYear()
    let month = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)
    result = year + '-' + month
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

/**
 * 远程升级
 */
// 任务类型
export function taskTypeFormatter (type) {
  if (type === 0) return '下载'
  if (type === 1) return '解包安装'
  if (type === 2) return '参数设定'
  if (type === 3) return '实时控制相机'
}

// 任务状态
export function isSuccessFormatter (type) {
  if (type === 0) return '未开始'
  if (type === 1) return '成功'
  if (type === 2) return '失败'
}

// UDP状态
export function udpFormatter (time) {
  let type = time - new Date().getTime() + 60 * 60 * 1000
  if (type >= 0) return '正常'
  if (type < 0) return '异常'
}

// 相机类型
export function cameraTypeFormatter (type) {
  if (type === 1) return 'ZSTI'
  if (type === 2) return 'QYTI'
  if (type === 3) return 'QYHS'
  if (type === 4) return 'ZSHS'
  if (type === 129) return '华安人脸识别'
}

// 人脸相机类型
export function aiCameraTypeFormatter (type) {
  if (type === 129) return '华安人脸'
  if (type === 130) return '安卓人脸'
  if (type === 131) return 'X系列'
  if (type === 132) return '安卓科发人脸'
  if (type === 133) return 'X系列'
  if (type === 134) return 'Linux小门禁'
}
export function ledTypeFormatter (type) {
  if (type === 0) return 'bx-5e1'
  if (type === 1) return '安卓电视机'
}
export function sexFormatter (type) {
  if (type === 1) return '男'
  if (type === 2) return '女'
}
// 非Android人脸
export function aiAndroidCameraTypeFormatter (type) {
  if (type === 129) return '华安人脸'
  if (type === 131) return 'X系列'
  if (type === 134) return '小门禁'
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
  if (type === 0) return '标准预付类型'
  if (type === 1) return '标准直付类型'
  if (type === 2) return '无感'
  if (type === 3) return '优惠开闸'
  if (type === 4) return '白名单、免费车、特殊车'
  if (type === 5) return 'APP预付'
  if (type === 6) return 'APP直付'
  if (type === 7) return '小程序'
  if (type === 8) return '免费开闸'
  if (type === 9) return '付款码'
  if (type === 10) return '钱包'
  if (type === 11) return '现金'
}
// 支付通道
export function payChannelFormatter (type) {
  if (type === 0) return '微信'
  if (type === 1) return '支付宝'
  if (type === 2) return '余额'
  if (type === 3) return '银联'
  if (type === 4) return '建行聚合'
  if (type === 5) return '农信银'
  if (type === 6) return '优惠'
}

// 支付类型
export function payTypeFormatter (type) {
  if (type === 0) return '余额/无感支付'
  if (type === 1) return '扫码枪支付'
  if (type === 2) return '出场扫码支付'
  if (type === 3) return '现金/其他'
}

// 支付状态
export function payStatusFormatter (type) {
  if (type === 0) return '未支付'
  if (type === 1) return '已支付'
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

// 充值规则模式
export function modeFormatter (type) {
  if (type === null) return '默认'
  if (type === '1') return '默认'
  if (type === '2') return '通用'
}

export function appTypeFormatter (type) {
  if (type === null) return '--'
  if (type === 1) return '车场app'
  if (type === 2) return '人脸app-非科发'
  if (type === 3) return '售后'
  if (type === 4) return '人脸app-科发'
}

// 信号
export function sigFormatter (type) {
  if (type === null) return '--'
  if (type <= 4) return '无信号'
  if (type > 4 && type <= 9) return '信号极差'
  if (type > 9 && type <= 15) return '信号差'
  if (type > 15 && type <= 21) return '信号较差'
  if (type > 21 && type <= 27) return '信号较好'
  if (type > 27) return '信号较优'
}

export function cameraOfflineFormatter (type) {
  if (type === null) return '-'
  if (type === 1) return '网络故障,连接中断'
  if (type === 2) return '一分钟无心跳、消息读写'
  if (type === 3) return '异常触发,连接中断'
  if (type === 4) return '未知的离线登录'
}

// 用户反馈
export function suggestionTypeFormatter (type) {
  if (type === null) return '-'
  if (type === 1) return '车场平台'
  if (type === 2) return '车场APP'
  if (type === 3) return '优惠券小程序'
  if (type === 4) return '人脸小程序'
  if (type === 5) return '售后APP'
  if (type === 6) return '人脸平台'
  if (type === 7) return '微信公众号'
}

// 反馈类别
export function suggestionSelectFormatter (type) {
  if (type === null) return '-'
  if (type === 0) return '咨询'
  if (type === 1) return '建议'
  if (type === 2) return '投诉'
}

export function compact (arr) {
  return arr.filter(Boolean)
}

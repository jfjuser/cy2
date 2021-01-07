/*
*@Author: lyf
*@Date: 2018-08-28 13:37:47
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-07-31 11:35:45
*/
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
export function ledTypeFormatter (type) {
  if (type === 0) return 'bx-5e1'
  if (type === 1) return '安卓电视机'
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

// 审核方式
export function checkFormatter (type) {
  if (type === undefined || type === null) return '--'
  if (type === 0) return '人工审核'
  if (type === 1) return '自动审核'
}

// 审核状态
export function checkStatusFormatter (type) {
  if (type === undefined || type === null) return '--'
  if (type === 0) return '审核失败'
  if (type === 1) return '审核成功'
  if (type === 2) return '审核中'
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
// 部门类型
export function isParkFormatter (type) {
  if (type === 0) return '非车场'
  if (type === 1) return '车场'
}
export function authGroupTypeFormatter (type) {
  if (type === null) return '-'
  if (type === '0') return '员工'
  if (type === '1') return '访客'
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
  if (type !== 0 && type !== 1) return '--'
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

// 是否是黑名单
export function isBlackCardFormatter (type) {
  if (type === 0) return '否'
  if (type === 1) return '是'
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
export function isStatusFormatter (type) {
  if (type === 0) return '离线'
  if (type === 1) return '在线'
}
export function closeFormatter (type) {
  if (type === 0) return '不开启'
  if (type === 1) return '开启'
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

export function typeToChinese (type) {
  if (type === 1) return '咨询'
  if (type === 2) return '建议'
  if (type === 3) return '其他'
}

export function type1ToChinese (type) {
  if (type === 0) return '咨询'
  if (type === 1) return '建议'
  if (type === 2) return '投诉'
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
  if (type === 133) return 'X系列2.0'
  if (type === 134) return 'Linux小门禁'
  if (type === 135) return '测温人脸'
  if (type === 136) return 'X系列2.8'
}
// 非Android人脸
export function aiAndroidCameraTypeFormatter (type) {
  if (type === 129) return '华安人脸'
  if (type === 131) return 'X系列'
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
  if (type === 1) return '支付'
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

// 格式化人员类型
export function personFormatter (type) {
  if (type === 0) return '非访客'
  if (type === 1) return '访客'
  if (type === 2) return '黑名单'
}

// 进出状态
export function inOutStatusFormatter (type) {
  if (type === null) return '--'
  if (type === 0) return '进场'
  if (type === 1) return '出场'
}

// 广告
export function advTypeFormatter (type) {
  if (type === null) return '--'
  if (type === 1) return '首页'
  if (type === 2) return '横幅'
}

// 横幅类型
export function contentTypeAdvFormatter (type) {
  if (type === null) return '--'
  if (type === 1) return '图片'
  if (type === 2) return '文字'
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
export function sexFormatter (type) {
  if (type === 0) return '男'
  if (type === 1) return '女'
}
export function sexFormatter1 (type) {
  if (type === 1) return '男'
  if (type === 2) return '女'
}
export function appModeFormatter (type) {
  if (type === null) return '--'
  if (type === 0) return '增量包'
  if (type === 1) return '全量包'
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

// ----- 售后
// 设备类型
export function deviceTypeFormatter (type) {
  if (type === null) return '-'
  if (type === 0) return '相机'
  if (type === 1) return '显示屏'
  if (type === 2) return '人脸'
  if (type === 3) return '道闸'
  if (type === 4) return '地感'
  if (type === 5) return '其它'
}
// 订单状态
export function statusASStatusFormatter (type) {
  if (type === null) return '-'
  if (type === 0) return '发布'
  if (type === 1) return '已接单'
  if (type === 2) return '已处理'
  if (type === 3) return '完成'
  if (type === 4) return '验收'
}

// 问题类型
export function problemFormatter (type) {
  if (type === null) return '-'
  if (type === 0) return '配置错误'
  if (type === 1) return '损坏'
  if (type === 2) return '老化'
  if (type === 3) return '其他'
}

export function statusASFormatter (type) {
  if (type === null) return '-'
  if (type === 0) return '待处理'
  if (type === 1) return '已完成'
  if (type === 2) return '已转交'
  if (type === 3) return '已取消'
}

export function sceneFormat (type) {
  if (type === null) return ''
  let t = type.split(',')
  type = ''
  for (let i = 0; i < t.length; i++) {
    if (t[i] === '1') {
      type += '站内  '
    } else if (t[i] === '2') {
      type += '邮箱  '
    } else if (t[i] === '3') {
      type += '短信  '
    } else if (t[i] === '4') {
      type += '公众号  '
    }
  }
  return type
}

export function prescriptionFormat (type) {
  if (type === null) return ''
  let t = type.split(',')
  type = ''
  for (let i = 0; i < t.length; i++) {
    if (t[i] === '1') {
      type += '立即推广  '
    } else if (t[i] === '2') {
      type += '按时推广  '
    } else if (t[i] === '3') {
      type += '登录时弹出  '
    } else if (t[i] === '4') {
      type += '红点提示  '
    }
  }
  return type
}

export function userTypeFormat (type) {
  if (type === null) return ''
  let t = type.split(',')
  type = ''
  for (let i = 0; i < t.length; i++) {
    if (t[i] === '1') {
      type += '平台  '
    } else if (t[i] === '2') {
      type += '代理  '
    } else if (t[i] === '3') {
      type += '运营  '
    } else if (t[i] === '4') {
      type += '商家  '
    } else if (t[i] === '5') {
      type += '车场用户  '
    }
  }
  return type
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

// 是否启用
export function enableFormatter (type) {
  if (type === null) return '-'
  if (type === 0) return '不启用'
  if (type === 1) return '启用'
}

// 广告投放平台
export function advTargetTypeFormatter (type) {
  if (type === null) return '-'
  if (type === 0) return '网页'
  if (type === 1) return '手机应用'
  if (type === 2) return '公众号'
  if (type === 3) return '小程序'
}

// 挂载位置
export function disLocationFormatter (type) {
  if (type === null) return '-'
  if (type === 0) return '顶部'
  if (type === 1) return '消息列表中部'
  if (type === 2) return '文章中部'
  if (type === 3) return '末尾'
  if (type === 4) return '详情页'
  if (type === 5) return '提示信息'
}

// 显示样式
export function disStyleFormatter (type) {
  if (type === null) return '-'
  if (type === 0) return '轮播'
  if (type === 1) return '背景'
  if (type === 2) return '固定框'
}

// 广告类型
export function pushAdvTypeFormatter (type) {
  if (type === null) return '-'
  if (type === 0) return '商场广告'
  if (type === 1) return '车场设备广告'
  if (type === 2) return '周边广告'
  if (type === 3) return '其他类型广告'
}

export function happenEventFormatter (type) {
  if (type === null) return '-'
  if (type === 0) return '入场推送'
  if (type === 1) return '出场推送'
  if (type === 2) return '入场及出场推送'
  if (type === 3) return '登录后'
  if (type === 4) return '其他'
}

export function pushFeeRulesFormatter (type) {
  if (type === null) return '-'
  if (type === 0) return '按条数'
  if (type === 1) return '按时间'
}

export function rechargeTypeFormatter (type) {
  if (type === null) return '-'
  if (type === 0) return '增加'
  if (type === 1) return '消耗'
}

export function relationshipFormatter (type) {
  if (type === null) return '-'
  if (type === 0) return '夫妻'
  if (type === 1) return '父子'
  if (type === 2) return '父女'
  if (type === 3) return '叔侄'
  if (type === 4) return '其他'
}

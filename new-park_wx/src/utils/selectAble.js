/*
*@Author: lyf
*@Date: 2018-08-30 13:42:49
 * @Last Modified by: lyf
 * @Last Modified time: 2019-11-19 09:45:21
*/

export const isSyncType = [
  {'valueName': '未同步', 'valueNo': 0},
  {'valueName': '已同步', 'valueNo': 1},
  {'valueName': '后台同步中', 'valueNo': 2},
  {'valueName': '后台删除中', 'valueNo': 3}
]

export const selectType = [
  {
    'valueName': '华夏4G',
    'valueNo': 1
  },
  {
    'valueName': '臻识4G',
    'valueNo': 0
  }
]

// 白名单审核
export const isSyncMonType = [
  {'valueName': '未同步', 'valueNo': 0},
  {'valueName': '已同步', 'valueNo': 1},
  {'valueName': '后台同步中', 'valueNo': 2},
  {'valueName': '后台删除中', 'valueNo': 3},
  {'valueName': '新增待审核', 'valueNo': 4},
  {'valueName': '修改待审核', 'valueNo': 5},
  {'valueName': '删除待审核', 'valueNo': 6}
]

export const isSyncMonthType = [
  {'valueName': '新增待审核', 'valueNo': 4},
  {'valueName': '修改待审核', 'valueNo': 5},
  {'valueName': '删除待审核', 'valueNo': 6}
]

export const isBindType = [
  {'valueName': '未绑定', 'valueNo': 0},
  {'valueName': '已绑定', 'valueNo': 1}
]
// 车牌输入
export const plateType = [
  { 'value': '京' },
  { 'value': '沪' },
  { 'value': '浙' },
  { 'value': '粤' },
  { 'value': '苏' },
  { 'value': '鲁' },
  { 'value': '晋' },
  { 'value': '吉' },
  { 'value': '冀' },
  { 'value': '豫' },
  { 'value': '川' },
  { 'value': '渝' },
  { 'value': '辽' },
  { 'value': '黑' },
  { 'value': '皖' },
  { 'value': '鄂' },
  { 'value': '湘' },
  { 'value': '赣' },
  { 'value': '闽' },
  { 'value': '陕' },
  { 'value': '甘' },
  { 'value': '宁' },
  { 'value': '蒙' },
  { 'value': '津' },
  { 'value': '桂' },
  { 'value': '云' },
  { 'value': '贵' },
  { 'value': '琼' },
  { 'value': '青' },
  { 'value': '新' },
  { 'value': '藏' },
  { 'value': '使' }
]
// 特殊车所处位置
export const positionType = [
  {'valueName': '字符在整个车牌前面', 'valueNo': 1},
  {'valueName': '字符在整个车牌后面', 'valueNo': 2},
  {'valueName': '整个车牌', 'valueNo': 3}
]

// 默认任务
export const eventNameType = [
  {'valueName': '入场车牌识别后', 'valueNo': 'CAP_IN_PLATE_TASK'},
  {'valueName': '车辆入场开闸后', 'valueNo': 'CAP_IN_OPEN_DOOR'},
  {'valueName': '车辆入场信息推送', 'valueNo': 'IN_PUSH'},
  {'valueName': '出场车牌识别后', 'valueNo': 'CAP_OUT_PLATE_TASK'},
  {'valueName': '车辆出场开闸后', 'valueNo': 'CAP_OUT_OPEN_DOOR'},
  {'valueName': '车辆出场信息推送', 'valueNo': 'OUT_PUSH'}
]

// 黑名单车类型
export const blackCarType = [
  {'valueName': '通缉车', 'valueNo': 1},
  {'valueName': '其它', 'valueNo': 2},
  {'valueName': '挂失车', 'valueNo': 0}
]

// 部门类型
export const isParkType = [
  {'valueName': '车场', 'valueNo': 1},
  {'valueName': '非车场', 'valueNo': 0}
]

// 通讯模式
export const isTransportType = [
  {'valueName': '4G方案', 'valueNo': 0},
  {'valueName': '标准方案', 'valueNo': 1}
]
// 是否支持固定车
export const isMonthlyCardType = [
  {'valueName': '不支持', 'valueNo': 0},
  {'valueName': '支持', 'valueNo': 1}
]
// 图片存储类型
// export const isPicStoreType = [
//   {'valueName': '随用随取', 'valueNo': 0},
//   {'valueName': '及时存取', 'valueNo': 1}
// ]

// 审核方式
export const checkType = [
  {'valueName': '人工审核', 'valueNo': 0},
  {'valueName': '自动审核', 'valueNo': 1}
]

// 固定车类型
export const monthlyCardType = [
  {'valueName': '4G模式', 'valueNo': 0},
  {'valueName': '一位多车', 'valueNo': 1}
]

// 优惠券基础规则
export const isMoreType = [
  {'valueName': '不允许', 'valueNo': 0},
  {'valueName': '允许', 'valueNo': 1}
]

export const isMoreQmType = [
  {'valueName': '不允许', 'valueNo': 0},
  {'valueName': '允许', 'valueNo': 1}
]

export const isAddType = [
  {'valueName': '叠加', 'valueNo': 1},
  {'valueName': '不叠加', 'valueNo': 0}
]

export const restAppType = [
  {'valueName': '不失效', 'valueNo': 1},
  {'valueName': '自动失效', 'valueNo': 0}
]

export const isGetTicketForOutType = [
  {'valueName': '允许', 'valueNo': 1},
  {'valueName': '不允许', 'valueNo': 0}
]

// 固定车是否过期
export const isOverDueType = [
  {'valueName': '已过期', 'valueNo': 1},
  {'valueName': '未过期', 'valueNo': 0}
]

export const ticketDeductibleTypeFor = [
  {'valueName': '以优惠券金额结算', 'valueNo': 0},
  {'valueName': '以停车费金额结算', 'valueNo': 1}
]

// 优惠券加减款类型
export const moneyType = [
  {'valueName': '减款', 'valueNo': 1},
  {'valueName': '加款', 'valueNo': 0}
]

// 优惠券类型
export const ticketType = [
  {'valueName': '减金额', 'valueNo': 0},
  {'valueName': '减时间', 'valueNo': 1},
  {'valueName': '全减免', 'valueNo': 2},
  {'valueName': '打折', 'valueNo': 3}
]

// 时间类型
export const timeType = [
  {'valueName': '持续分钟数', 'valueNo': 0},
  {'valueName': '有效期', 'valueNo': 1},
  {'valueName': '持续天数', 'valueNo': -2}
]

// 优惠券使用状态
export const isUsedType = [
  {'valueName': '使用中', 'valueNo': 1},
  {'valueName': '已使用', 'valueNo': 2}
]
// 状态
export const statusType = [
  {'valueName': '离线', 'valueNo': 0},
  {'valueName': '在线', 'valueNo': 1}
]
// 键盘MAC
export const MacType = [
  {'valueName': '0', 'valueNo': 0},
  {'valueName': '1', 'valueNo': 1},
  {'valueName': '2', 'valueNo': 2},
  {'valueName': '3', 'valueNo': 3},
  {'valueName': '4', 'valueNo': 4},
  {'valueName': '5', 'valueNo': 5},
  {'valueName': '6', 'valueNo': 6},
  {'valueName': '7', 'valueNo': 7},
  {'valueName': '8', 'valueNo': 8},
  {'valueName': '9', 'valueNo': 9},
  {'valueName': 'A', 'valueNo': 10},
  {'valueName': 'B', 'valueNo': 11},
  {'valueName': 'C', 'valueNo': 12},
  {'valueName': 'D', 'valueNo': 13},
  {'valueName': 'E', 'valueNo': 14},
  {'valueName': 'F', 'valueNo': 15}
]
// 出入口类型
export const inOutType = [
  {'valueName': '入口', 'valueNo': 0},
  {'valueName': '出口', 'valueNo': 1},
  {'valueName': '不分出入口', 'valueNo': 2}
]

// 是否是黑名单
export const blackCardType = [
  {'valueName': '否', 'valueNo': 0},
  {'valueName': '是', 'valueNo': 1}
]

// 图标判断
export const isIconType = [
  {'valueName': 'fa fa-anchor', 'valueNo': 0},
  {'valueName': 'fa fa-desktop', 'valueNo': 1},
  {'valueName': 'fa fa-signal', 'valueNo': 2},
  {'valueName': 'fa fa-cloud', 'valueNo': 3},
  {'valueName': 'fa fa-sitemap', 'valueNo': 4},
  {'valueName': 'fa fa-gears', 'valueNo': 5},
  {'valueName': 'fa fa-car', 'valueNo': 6},
  {'valueName': 'fa fa-window-restore', 'valueNo': 7},
  {'valueName': 'fa fa-list-ul', 'valueNo': 8},
  {'valueName': 'fa fa-sliders', 'valueNo': 9}
]

// 支付方式
export const isPayType = [
  {'valueName': '不使用', 'valueNo': 0},
  // 微信支付
  {'valueName': '畅盈云支付（直连微信）', 'valueNo': 5},
  {'valueName': '平台支付（泊链）', 'valueNo': 2},
  {'valueName': '建行无感支付', 'valueNo': 3},
  {'valueName': 'PP停车支付', 'valueNo': 7},
  {'valueName': '农信银支付', 'valueNo': 8},
  {'valueName': '聚合无感支付（芝麻）', 'valueNo': 9}
  // {
  //   'valueName': '黄石停车支付',
  //   'valueNo': 12
  // }
]

// 免费车类型
export const isFreeCarType = [
  {'valueName': '其它', 'valueNo': 0},
  {'valueName': '物业公司车辆', 'valueNo': 1},
  {'valueName': '集团公司车辆', 'valueNo': 2},
  {'valueName': '地产公司车辆', 'valueNo': 3}
]

/**
   * 远程升级
   */
// 相机类型
export const cameraType = [
  {'valueName': 'ZSTI', 'valueNo': 1},
  {'valueName': 'QYTI', 'valueNo': 2},
  {'valueName': 'QYHS', 'valueNo': 3},
  {'valueName': 'ZSHS', 'valueNo': 4},
  {'valueName': '华安人脸识别', 'valueNo': 129}
]

// 人脸相机类型
export const cameraAIType = [
  {'valueName': '华安人脸识别', 'valueNo': 129},
  {'valueName': 'X系列', 'valueNo': 131},
  {'valueName': '小门禁', 'valueNo': 134}
]

// 二维码类型
export const qrCodeType = [
  {'valueName': '场内预付码', 'valueNo': 1},
  {'valueName': '出口直付码', 'valueNo': 2},
  {'valueName': '无牌车入场码', 'valueNo': 3}
]

export const bluetoothCodeType = [
  {'valueName': '入场码', 'valueNo': 4},
  {'valueName': '出场码', 'valueNo': 5}
]

// 清除升级文件类型
export const fileType = [
  {'valueName': '升级相机', 'valueNo': 1},
  {'valueName': '参数设定', 'valueNo': 2},
  {'valueName': '实时控制', 'valueNo': 3},
  {'valueName': '获取文件', 'valueNo': 4}
]

export const cameraOfflineType = [
  {'valueName': '网络故障,连接中断', 'valueNo': 1},
  {'valueName': '一分钟无心跳、消息读写', 'valueNo': 2},
  {'valueName': '异常触发,连接中断', 'valueNo': 3},
  {'valueName': '未知的离线登录', 'valueNo': 4}
]

export const aiCameraType = [
  {'valueName': '华安人脸', 'valueNo': 129},
  {'valueName': '安卓人脸', 'valueNo': 130},
  {'valueName': 'X系列', 'valueNo': 131},
  {'valueName': '安卓科发人脸', 'valueNo': 132}
]

// 意见反馈
export const suggestionAIType = [
  {'valueName': '人脸小程序', 'valueNo': 4},
  {'valueName': '人脸平台', 'valueNo': 6}
]

export const suggestionType = [
  {'valueName': '车场平台', 'valueNo': 1},
  {'valueName': '车场APP', 'valueNo': 2},
  {'valueName': '优惠券小程序', 'valueNo': 3},
  {'valueName': '售后APP', 'valueNo': 5},
  {'valueName': '微信公众号', 'valueNo': 7}
]

export const suggestionSelectType = [
  {'valueName': '咨询', 'valueNo': 0},
  {'valueName': '建议', 'valueNo': 1},
  {'valueName': '投诉', 'valueNo': 2}
]

/*
*@Author: lyf
*@Date: 2018-08-30 13:42:49
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-10-22 13:36:41
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
  },
  {
    'valueName': '芊熠相机',
    'valueNo': 2
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
export const isPicStoreType = [
  {'valueName': '随用随取', 'valueNo': 0},
  {'valueName': '及时存取', 'valueNo': 1}
]

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
export const disCountData = [
  {'valueName': '是', 'valueNo': 1},
  {'valueName': '否', 'valueNo': 0}
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
  {'valueName': '聚合无感支付（芝麻）', 'valueNo': 9},
  {'valueName': '云纵支付', 'valueNo': 13},
  {'valueName': '网联客支付', 'valueNo': 14},
  {'valueName': '河南农信金燕支付', 'valueNo': 15},
  {'valueName': '工商聚合加无感支付', 'valueNo': 16}
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
  {'valueName': '小门禁', 'valueNo': 134},
  {'valueName': '测温相机', 'valueNo': 135},
  {'valueName': 'X28-T相机', 'valueNo': 136}
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

// 人员类型
export const personType = [
  {'valueName': '非访客', 'valueNo': 0},
  {'valueNume': '访客', 'valueNo': 1}
]

// 广告类型
export const advType = [
  {'valueName': '首页', 'valueNo': 1},
  {'valueName': '横幅', 'valueNo': 2}
]
// 横幅类型
export const contentTypeAdv = [
  {'valueName': '图片', 'valueNo': 1},
  {'valueName': '文字', 'valueNo': 2}
]

// App下载
export const appType = [
  {'valueName': '车场app', 'valueNo': 1},
  {'valueName': '人脸app-非科发', 'valueNo': 2},
  {'valueName': '售后', 'valueNo': 3},
  {'valueName': '人脸app-科发', 'valueNo': 4}
]

export const dateType = [
  {'valueName': '小时', 'valueNo': 1},
  {'valueName': '天', 'valueNo': 2},
  {'valueName': '月', 'valueNo': 3},
  {'valueName': '年', 'valueNo': 4}
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
  {'valueName': '安卓科发人脸', 'valueNo': 132},
  {'valueName': '小门禁相机', 'valueNo': 134},
  {'valueName': '测温人脸', 'valueNo': 135},
  {'valueName': 'X28-T相机', 'valueNo': 136}
]

// 售后
export const deviceASType = [
  {'valueName': '相机', 'valueNo': 0},
  {'valueName': '显示屏', 'valueNo': 1},
  {'valueName': '人脸', 'valueNo': 2},
  {'valueName': '道闸', 'valueNo': 3},
  {'valueName': '地感', 'valueNo': 4},
  {'valueName': '其它', 'valueNo': 5}
]

export const statusASType = [
  {'valueName': '发布', 'valueNo': 0},
  {'valueName': '已接单', 'valueNo': 1},
  {'valueName': '已处理', 'valueNo': 2},
  {'valueName': '完成', 'valueNo': 3},
  {'valueName': '验收', 'valueNo': 4}
]

export const versionType = [
  {'valueName': '平台', 'valueNo': 0},
  {'valueName': 'APP', 'valueNo': 1},
  {'valueName': '优惠券小程序', 'valueNo': 2},
  {'valueName': '人脸小程序', 'valueNo': 3}
]

export const problemType = [
  {'valueName': '配置错误', 'valueNo': 0},
  {'valueName': '损坏', 'valueNo': 1},
  {'valueName': '老化', 'valueNo': 2},
  {'valueName': '其他', 'valueNo': 3}
]

export const statusOrderASType = [
  {'valueName': '待处理', 'valueNo': 0},
  {'valueName': '已完成', 'valueNo': 1},
  {'valueName': '已转交', 'valueNo': 2},
  {'valueName': '已取消', 'valueNo': 3}
]

export const scene = [
  {'valueName': '站内', 'valueNo': 1},
  {'valueName': '邮箱', 'valueNo': 2},
  {'valueName': '短信', 'valueNo': 3},
  {'valueName': '公众号', 'valueNo': 4}
]

export const prescriptions = [
  {'valueName': '立即推广', 'valueNo': 1},
  {'valueName': '按时推广', 'valueNo': 2},
  {'valueName': '登录时弹出', 'valueNo': 3},
  {'valueName': '红点提示', 'valueNo': 4}
]

export const userTypes = [
  {'valueName': '平台', 'valueNo': 1},
  {'valueName': '代理', 'valueNo': 2},
  {'valueName': '运营', 'valueNo': 3},
  {'valueName': '商家', 'valueNo': 4},
  {'valueName': '车场用户', 'valueNo': 5}
]

export const notifyType = [
  {'valueName': '平台更新消息', 'valueNo': 1},
  {'valueName': '周报', 'valueNo': 2},
  {'valueName': '日报', 'valueNo': 3},
  {'valueName': '设备离线', 'valueNo': 4},
  {'valueName': '产品到期', 'valueNo': 5},
  {'valueName': '流量卡预警', 'valueNo': 6}
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

export const verifyStatusType = [
  {'valueName': '审核失败', 'valueNo': 0},
  {'valueName': '审核成功', 'valueNo': 1},
  {'valueName': '审核中', 'valueNo': 2}
]

export const enableType = [
  {'valueName': '不启用', 'valueNo': 0},
  {'valueName': '启用', 'valueNo': 1}
]

export const advTargetType = [
  {'valueName': '网页', 'valueNo': 0},
  {'valueName': '手机应用', 'valueNo': 1},
  {'valueName': '公众号', 'valueNo': 2},
  {'valueName': '小程序', 'valueNo': 3}
]

export const disLocationType = [
  {'valueName': '顶部', 'valueNo': 0},
  {'valueName': '消息列表中部', 'valueNo': 1},
  {'valueName': '文章中部', 'valueNo': 2},
  {'valueName': '末尾', 'valueNo': 3},
  {'valueName': '详情页', 'valueNo': 4},
  {'valueName': '提示信息', 'valueNo': 5}
]

export const disStyleType = [
  {'valueName': '轮播', 'valueNo': 0},
  {'valueName': '背景', 'valueNo': 1},
  {'valueName': '固定框', 'valueNo': 2}
]

export const pushAdvType = [
  {'valueName': '商场广告', 'valueNo': 0},
  {'valueName': '车场设备广告', 'valueNo': 1},
  {'valueName': '周边广告', 'valueNo': 2},
  {'valueName': '其他类型广告', 'valueNo': 3}
]

export const happenEventType = [
  // {'valueName': '入场推送', 'valueNo': 0},
  // {'valueName': '出场推送', 'valueNo': 1},
  {'valueName': '出入场推送', 'valueNo': 2},
  {'valueName': '登录后', 'valueNo': 3},
  {'valueName': '其他', 'valueNo': 4}
]

export const pushFeeRulesType = [
  {'valueName': '按条数', 'valueNo': 0},
  {'valueName': '按时间', 'valueNo': 1}
]

export const rechargeType = [
  {'valueName': '增加', 'valueNo': 0},
  {'valueName': '消耗', 'valueNo': 1}
]

export const identityType = [
  {'valueName': '企业', 'valueNo': 0},
  {'valueName': '个人', 'valueNo': 1}
]
export const identityType1 = [
  {'valueName': '部门月统计', 'valueNo': 0},
  {'valueName': '部门年统计', 'valueNo': 1},
  {'valueName': '相机月统计', 'valueNo': 2},
  {'valueName': '相机年统计', 'valueNo': 3},
  {'valueName': '用户月统计', 'valueNo': 4},
  {'valueName': '用户年统计', 'valueNo': 5}
]
export const identityType2 = [
  {
    'valueName': '注册人脸',
    'valueNo': 0
  },
  {
    'valueName': '获取进出记录图片',
    'valueNo': 1
  }
]
export const ledTypeSelect = [
  {
    'valueName': 'bx-5e1',
    'valueNo': 0
  },
  {
    'valueName': '安卓电视机',
    'valueNo': 1
  }
]

export const openLogType = [
  {'valueName': '开启日志(包括心跳信息)', 'valueNo': 1},
  {'valueName': '开启日志(基本信息)', 'valueNo': 2},
  {'valueName': '禁用日志', 'valueNo': 6}
]

export const eventFeeType = [
  {'valueName': '人脸每台相机基本收费', 'valueNo': 'FACE_VIP'},
  {'valueName': '下发白名单收费', 'valueNo': 'SEND_FEE'},
  {'valueName': '图片保存费用', 'valueNo': 'IMG_SAVE_FEE'},
  {'valueName': '白名单数据恢复每条费用', 'valueNo': 'RECOVERY_FEE'}
]

export const ledRunModeType = [
  {'valueName': '循环显示', 'valueNo': 0},
  {'valueName': '显示完成后静止显示最后一页数据', 'valueNo': 1},
  {'valueName': '循环显示,超过设定时间后数据仍未更新时不再显示', 'valueNo': 2},
  {'valueName': '循环显示,超过设定时间后数据仍未更新时显示日志信息', 'valueNo': 3},
  {'valueName': '循环显示,显示完最后一页后就不再显示', 'valueNo': 4}
]

// 模拟数据
var Mock = require('mockjs')
// 车场数据固定车模拟数据
export const monthlyData = Mock.mock({
  'rows|1-10': [{
    'id|+1': 10000000,
    'localId|+1': 100000000000,
    'carName': '@cname()',
    'department_name': '@cname()' + '停车场',
    'plate|1': ['粤B99988', '京A12345', '粤B22222'],
    'startTime': '@date("yyyy-MM-dd")',
    'validateTime': '@date("yyyy-MM-dd")',
    'isSync|1': [0, 1, 2, 3],
    'remarks': '@ctitle(3, 5)'
  }]
})
// 进出记录
export const inOutData = Mock.mock({
  'rows|1-10': [{
    'id|+1': 10000000
  }]
})
// 特殊车
export const specialCarData = Mock.mock({
  'rows|1-10': [{
    'id|+1': 10000000,
    'sign|1-10': '★',
    'position|1': [1, 2, 3],
    'remarks': '@ctitle(3, 5)'
  }]
})

// 黑名单
export const blackCardData = Mock.mock({
  'rows|1-10': [{
    'id|+1': 10000,
    'departmentName': '@cname()' + '停车场',
    'plate|1': ['粤B99988', '京A12345', '粤B22222'],
    'type|1': [0, 1, 2],
    'isSync|1': [0, 1, 2, 3],
    'startTime': '@date("yyyy-MM-dd")',
    'endTime': '@date("yyyy-MM-dd")',
    'remarks': '@ctitle(3, 5)'
  }]
})

// 角色管理
export const roleManageData = Mock.mock({
  'rows|1-10': [{
    'id|+1': 10000000,
    'name': '@cname()',
    'intro': '@cparagraph(2)'
  }]
})
// 用户管理
export const userManageData = Mock.mock({
  'rows|1-10': [{
    'id|+1': 10000000,
    'userName': Mock.mock('@word()'),
    'phone|1': ['13531544954', '13632250649', '15820292420', '15999905612'],
    'email': Mock.mock('@email()'),
    'userImage': Mock.Random.image('50x50', '#FF6600'),
    'sex|1': [0, 1]
  }]
})
// 默认任务
export const taskProgressData = Mock.mock({
  'rows|1-10': [{
    'id|+1': 10000000,
    'name': '@cname()',
    'eventName|1': ['CAP_IN_PLATE_TASK', 'CAP_IN_OPEN_DOOR', 'IN_PUSH', 'CAP_OUT_PLATE_TASK', 'CAP_OUT_OPEN_DOOR', 'OUT_PUSH'],
    'eventCode': '@cname()',
    'url': Mock.mock('@url'),
    'urlExtend1': Mock.mock('@url'),
    'urlExtend2': Mock.mock('@url')
  }]
})
// 部门类别
export const departmentCategoryData = Mock.mock({
  'rows|1-10': [{
    'id|+1': 10000,
    'name': '@cname()',
    'isPark|1': [0, 1],
    'remarks': '@ctitle(6, 10)'
  }]
})
// 资料审核
export const dataReviewData = Mock.mock({
  'rows|1-10': [{
    'id': Mock.mock('@id'),
    'departmentName': '@cname' + '停车场',
    'address': Mock.mock('@county(true)'),
    'lotTotal|+1': 10000,
    'isPass|1': [1, 2, 3], // 1.审核中 2.审核失败 3. 审核通过
    'isSubmit|1': [1, 2],
    'downLoadTime': '@date("yyyy-MM-dd HH:mm:ss")',
    'createTime': '@date("yyyy-MM-dd HH:mm:ss")'
  }]
})
// 下级管理
export const directSubordinate = Mock.mock({
  'rows|1-10': Mock.mock('@id'),
  'departmentName': '@cname' + '系统',
  'sysName': '@cname' + '系统',
  'unicode': /\d{7,10}/,
  'secret': Mock.mock('@guid'),
  'name': '@cname' + '系统',
  'isPass|1': [1, 2, 3],
  'phone|1': /^1[34578]\d{9}$/,
  'address': Mock.mock('@county(true)'),
  'createAt': '@date("yyyy-MM-dd HH:mm:ss")'
})

// 优惠券充值记录
export const businessChargeRecordsData = Mock.mock({
  'rows|1-10': [{
    'id|+1': 1000,
    'departmentName': '@cname()',
    'type|1': [0, 1],
    'fee|100-3000.1-2': 2000,
    'nowFee|100-3000.1-2': 2000
  }]
})

// 商家信息
export const businessInfoData = Mock.mock({
  'rows|1-10': [{
    'id|+1': 10000,
    'departmentName': '@cname()',
    'totalFee|100-2000.1-2': 2000,
    'nowFee|100-2000.1-2': 1000,
    'createAt': '@date("yyyy-MM-dd")'
  }]
})

// 优惠券规则
export const ticketRulesData = Mock.mock({
  'rows|1-10': [{
    'id|+1': 10000,
    'departmentName': '@cname()',
    'name': '@cname()',
    'type|1': [0, 1, 2, 3],
    'timeType|1': [0, 1, -2],
    'subFee|100-2000.1-2': 2000,
    'discount|0.1-2': 0.1,
    'subTime|100-500': 100,
    'durationMinute|100-2000': 2000,
    'durationDay|100-2000': 2000,
    'validateAt': '@date("yyyy-MM-dd")',
    'number|100-500': 200,
    'restNumber|100-500': 200,
    'remarks': '@ctitle(6, 10)'
  }]
})

// 优惠券记录
export const ticketRecordsData = Mock.mock({
  'rows|1-10': [{
    'id|+1': 10000,
    'departmentName': '@cname()',
    'name': '@cname()',
    'ticketCode|+1': 100000,
    'validateAt': '@date("yyyy-MM-dd")',
    'plate|1': ['粤B99988', '京A12345', '粤B22222'],
    'localId|+3': 100000,
    'isUsed|1': [1, 2],
    'diKouFee|100-2000.1-2': 2000,
    'bingDingAt': '@date("yyyy-MM-dd")',
    'useAt': '@date("yyyy-MM-dd")'
  }]
})

// 设备管理

// 通道状态
export const channelStatusData = Mock.mock({
  'rows|1-10': [{
    'id|+1': Mock.mock('@id'),
    'localName': '@cname()',
    'point|+1': 1,
    'localId|+1': 'channels_' + 1 + '_syncdata',
    'unicode': '@cname()',
    'status|1': [0, 1],
    'loginAt': '@date("yyyy-MM-dd HH:mm:ss")',
    'loginOutAt': '@date("yyyy-MM-dd HH:mm:ss")',
    'type|1': [0, 1, 2],
    'name': '@cname()',
    'mac|1': /^[A-F0-9]{2}(:[A-F0-9]{2}){5}$/,
    'init|1': [0, 1]
  }]
})

// 通道日志
export const channerLogData = Mock.mock({
  'rows|1-10': [{
    'id|+1': 10000,
    'localName': '@cname()',
    'item|1': ['离线', '登录'],
    'updateAt': '@date("yyyy-MM-dd HH:mm:ss")',
    'remarks': '@ctitle(6, 10)'
  }]
})

// 4G
// 相机MAC状态
export const macStatusData = Mock.mock({
  'rows|1-10': [{
    'id|+1': 10000,
    'departmentName': '@cname()',
    'mac|1': /^[A-F0-9]{2}(:[A-F0-9]{2}){5}$/,
    'isBind|1': [0, 1], // 0未绑定 1已绑定
    'status|1': [0, 1], // 0离线 1在线
    'loginAt': '@date("yyyy-MM-dd HH:mm:ss")'
  }]
})

// 固定车充值规则
export const monthRulesData = Mock.mock({
  'rows|1-10': [{
    'id|+1': 10000,
    'monthNumber|+1': 1,
    'monthPrice|1-1000.1-2': 100,
    'remarks': '@ctitle(6, 10)'
  }]
})

// 固定车充值记录
export const monthChargeData = Mock.mock({
  'rows|1-10': [{
    'id|+1': 2000,
    'payNo': Mock.Random.id(),
    'plate|1': ['粤B99988', '京A12345', '粤B22222'],
    'monthNumber|+1': 1,
    'monthPrice|1-1000.1-2': 100,
    'createAt': '@date("yyyy-MM-dd HH:mm:ss")'
  }]
})

// 固定车记录
export const monthRecordsData = Mock.mock({
  'rows|1-10': [{
    'id|+1': 2000,
    'localName': '@cname()',
    'plate|1': /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳]{1}$/,
    'userName': '@cname()',
    'phone|1': /^1[34578]\d{9}$/,
    'needAlarm|1': [0, 1],
    'isSync|1': [0, 1, 2, 3],
    'enableTime': '@date("yyyy-MM-dd HH:mm:ss")',
    'overdueTime': '@date("yyyy-MM-dd HH:mm:ss")',
    'createTime': '@date("yyyy-MM-dd HH:mm:ss")'
  }]
})

// json测试
export const testData = Mock.mock({
  'rows|1-30': [{
    'old|+1': {
      'id|+1': 2000,
      'localName|1': ['粤B99988', '京A12345', '粤B22222'],
      'test': '测试'
    },
    'new|+1': {
      'id|+1': 2000,
      'localName|1': ['粤B99988', '京A12345', '粤B22222'],
      'test': '测试'
    }
  }]
})

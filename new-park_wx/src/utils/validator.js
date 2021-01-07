// 验证账号
export const checkUserName = (value) => {
  return !(/^(\w){6,16}$/.test(value))
}
// 验证密码
export function checkPsd (value) {
  return !(/^(\w){6,12}$/.test(value))
}
// 验证手机号
export function checkPhone (value) {
  return !(/^1[123456789]\d{9}$/.test(value))
}
// 验证Email
export const checkEmail = (value) => {
  return !(/^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/.test(value))
}
// 验证url
export const checkUrl = (value) => {
  return !(/^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|vip|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/.test(value))
}

// 普通车牌 /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z0-9]{1}[A-Z0-9]{1}[警京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼]{0,1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学领使警港澳]{1}$/
// 新能源车牌 /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z0-9]{1}[A-Z0-9]{1}[警京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼]{0,1}(([0-9]{5}[DF]$)|([DF][A-HJ-NP-Z0-9][0-9]{4}$))/
// 验证车牌号
export const checkPlate = (value) => {
  const normalPlate = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z0-9]{1}[A-Z0-9]{1}[警京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼]{0,1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学领使警港澳]{1}$/
  const newPlate = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z0-9]{1}[A-Z0-9]{1}[警京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼]{0,1}(([0-9]{5}[DF]$)|([A-Z][A-HJ-NP-Z0-9][0-9]{4}$))/
  return !(normalPlate.test(value) || newPlate.test(value))
}

// 数字大于0
export const checkTimeToMoney = (value) => {
  if (value < 0) {
    return '请输入大于0的数字'
  } else if (typeof value === 'string' && value.indexOf('.') !== -1 && value.split('.')[1].length > 2) {
    return '最多包含两位小数'
  } else {
    return ''
  }
}

// 数字大于0 并且全部是正整数
export const checkNumber = (value) => {
  if (value < 0) {
    return '请输入大于0的数字'
  } else if (value % 1 !== 0) {
    return '请输入大于0的整数'
  } else {
    return ''
  }
}

// 数字大于0小于1 折扣率
export const checkDiscount = (value) => {
  if (value <= 0 || value >= 1) {
    return '请输入大于0小于1的数字'
  } else if (value.toString().split('.')[1].length > 2) {
    return '最多包含两位小数'
  } else {
    return ''
  }
}

// 验证MAC地址
export const checkMac = (value) => {
  const regMac = /([A-Fa-f0-9]{2}:){5}[A-Fa-f0-9]{2}/
  return !(regMac.test(value))
}
export const checkMac1 = (value) => {
  const regMac = /[A-Fa-f0-9]{12}/
  return !(regMac.test(value))
}

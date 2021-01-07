
// 验证密码
export const checkPsd = (rule, value, callback) => {
  if (!(/^(\w){6,12}$/.test(value))) {
    return callback(new Error('密码为6-12位字母，数字或者下划线'))
  } else {
    callback()
  }
}
// 验证手机号
export const checkPhone = (rule, value, callback) => {
  if (typeof (value) === 'undefined' || value === '') {
    callback()
  } else if (!(/^1[123456789]\d{9}$/.test(value))) {
    return callback(new Error('请输入正确的手机号码'))
  } else {
    callback()
  }
}
// 验证Email
export const checkEmail = (rule, value, callback) => {
  if (!(/^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/.test(value))) {
    return callback(new Error('请输入正确的邮箱地址'))
  } else {
    callback()
  }
}
// 验证url
export const checkUrl = (rule, value, callback) => {
  if (!(/^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/.test(value))) {
    return callback(new Error('请输入正确的url地址'))
  } else {
    callback()
  }
}

// 普通车牌 /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z0-9]{1}[A-Z0-9]{1}[警京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼]{0,1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学领使警港澳]{1}$/
// 新能源车牌 /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z0-9]{1}[A-Z0-9]{1}[警京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼]{0,1}(([0-9]{5}[DF]$)|([DF][A-HJ-NP-Z0-9][0-9]{4}$))/
// 验证车牌号
export const checkPlate = (rule, value, callback) => {
  const normalPlate = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z0-9]{1}[A-Z0-9]{1}[警京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼]{0,1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学领使警港澳]{1}$/
  const newPlate = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z0-9]{1}[A-Z0-9]{1}[警京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼]{0,1}(([0-9]{5}[DF]$)|([DF][A-HJ-NP-Z0-9][0-9]{4}$))/
  if (!(normalPlate.test(value) || newPlate.test(value))) {
    return callback(new Error('请输入正确的车牌号码'))
  } else {
    callback()
  }
}

// 数字大于0
export const checkTimeToMoney = (rule, value, callback) => {
  if (value < 0) {
    return callback(new Error('请输入大于0的数字'))
  } else if (typeof value === 'string' && value.indexOf('.') !== -1 && value.split('.')[1].length > 2) {
    return callback(new Error('最多包含两位小数'))
  } else {
    callback()
  }
}

// 数字大于0 并且全部是正整数
export const checkNumber = (rule, value, callback) => {
  if (value < 0) {
    return callback(new Error('请输入大于0的数字'))
  } else if (value % 1 !== 0) {
    return callback(new Error('请输入大于0的整数'))
  } else {
    callback()
  }
}

// 数字大于0 并且全部是正整数 ai人员限制
export const checkAINumber = (rule, value, callback) => {
  if (value < 0) {
    return callback(new Error('请输入大于0的数字'))
  } else if (value % 1 !== 0) {
    return callback(new Error('请输入大于0的整数'))
  } else if (value > 2147483647) {
    return callback(new Error('请输入小于1000000000的整数'))
  } else {
    callback()
  }
}

// 数字大于0小于1 折扣率
export const checkDiscount = (rule, value, callback) => {
  if (value <= 0 || value >= 1) {
    return callback(new Error('请输入大于0小于1的数字'))
  } else if (value.toString().split('.')[1].length > 2) {
    return callback(new Error('最多包含两位小数'))
  } else {
    callback()
  }
}

// 验证MAC地址
export const checkMac = (rule, value, callback) => {
  const regMac = /([A-Fa-f0-9]{2}:){5}[A-Fa-f0-9]{2}/
  if (!(regMac.test(value))) {
    return callback(new Error('请输入正确的MAC地址'))
  } else {
    callback()
  }
}

// 验证备注信息
export const checkRemarks = (rule, value, callback) => {
  if (value === '图片验证不通过,请重新上传图片') {
    return callback(new Error('请输入其它的备注信息'))
  } else {
    callback()
  }
}

// 验证账号
export const checkUserName = (rule, value, callback) => {
  if (!(/^(\w){6,16}$/.test(value))) {
    return callback(new Error('账号为6-16位'))
  } else {
    callback()
  }
}
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

// 验证MAC地址
export const checkMac = (rule, value, callback) => {
  const regMac = /([A-Fa-f0-9]{2}:){5}[A-Fa-f0-9]{2}/
  if (!(regMac.test(value))) {
    return callback(new Error('请输入正确的MAC地址'))
  } else {
    callback()
  }
}
export const checkMac1 = (rule, value, callback) => {
  const regMac = /[A-Fa-f0-9]{12}/
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

// 验证班次名称长度
export const checkAIName = (rule, value, callback) => {
  const Reg = /^[A-Za-z0-9\u4e00-\u9fa5]{1,10}$/
  if (!(Reg.test(value))) {
    return callback(new Error('班次名称只允许10个以内的汉字、英文字符、数字'))
  } else {
    callback()
  }
}

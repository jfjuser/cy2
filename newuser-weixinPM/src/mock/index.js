
const Mock = require('mockjs')
const User = require('./api/user')

Mock.mock(/getWxUserInfo/, () => {
  return User.wx
})
// 获取考勤信息
Mock.mock(/work\/v1\/workEmployee\/getAiuserMessage/, () => {
  return User.getAttendance
})
// Mock.mock(/work\/v1\/workEmployee\/getAiuserMessage/, () => {
//   return attendance
// })

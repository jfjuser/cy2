const Mock = require('mockjs')
const { steps1 } = require('./mockMsg/register')
Mock.mock(/work\/v1\/completeMessage/, () => {
  return steps1
})
// Mock.mock(/work\/v1\/workEmployee\/exitComplete/, (req) => {
//   console.log('用户请求数据：', req)

//   return {

//   }
// })

import Cookies from 'js-cookie'

const userId = 'userId'
const userObj = 'userObj'
const active = 'active'
// const TokenUserId = 'userId'
// const TokenDepartmentId = 'departmentId'
// const TokenDepName = 'depName'

// 获取userId
export function getCookieId () {
  return Cookies.get(userId)
}
// 获取obj
export function getCookieObj () {
  return Cookies.get(userObj)
}
// 获取 active
export function getActive () {
  return Cookies.get(active)
}
// 设置 active
export function setActive (num) {
  return Cookies.set(active, num)
}
// 设置ID
export function setCookieId (id) {
  return Cookies.set(userId, id)
}

// 设置obj
export function setCookieObj (obj) {
  return Cookies.set(userObj, obj)
}

// // 删除Token
// export function removeToken () {
//   return Cookies.remove(TokenKey)
// }

// // 保存系统名称
// export function getSysName () {
//   return Cookies.get(TokenSysName)
// }

// // 设置系统名称
// export function setSysName (token = '物联云平台') {
//   return Cookies.set(TokenSysName, token)
// }

// // 保存USERID
// export function getUserId () {
//   return Cookies.get(TokenUserId)
// }

// // 设置USERID
// export function setUserId (userId) {
//   return Cookies.set(TokenUserId, userId)
// }

// // 保存departmetId
// export function getDepartmentId () {
//   return Cookies.get(TokenDepartmentId)
// }

// // 设置departmetId
// export function setDepartmentId (departmentId) {
//   return Cookies.set(TokenDepartmentId, departmentId)
// }

// // 保存depName
// export function getDepName () {
//   return Cookies.get(TokenDepName)
// }

// // 设置depName
// export function setDepName (depName) {
//   return Cookies.set(TokenDepName, depName)
// }

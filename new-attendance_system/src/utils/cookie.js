import Cookies from 'js-cookie'

const TokenKey = 'AdminToken'
const TokenTime = 'loginTime'
const TokenSysName = 'SysName'
const TokenUserId = 'userId'
const TokenDepartmentId = 'departmentId'
const TokenDepName = 'depName'
// 有没欠费的标识
const TokenLoginType = 'loginType'
// 登录时的部门编号
const TokenLoginDepId = 'loginDepId'

// 获取Token
export function getToken () {
  return Cookies.get(TokenKey)
}

// 设置Token
export function setToken (token) {
  return Cookies.set(TokenKey, token)
}

// 删除Token
export function removeToken () {
  return Cookies.remove(TokenKey)
}

// 获取登录时间
export function getTokenTime () {
  return Cookies.get(TokenTime)
}

// 设置登录时间
export function setTokenTime (time) {
  return Cookies.set(TokenTime, time)
}

// 删除登录时间
export function removeTokenTime () {
  return Cookies.remove(TokenTime)
}

// 保存系统名称
export function getSysName () {
  return Cookies.get(TokenSysName)
}

// 设置系统名称
export function setSysName (token = '考勤管理系统') {
  return Cookies.set(TokenSysName, token)
}

// 保存USERID
export function getUserId () {
  return Cookies.get(TokenUserId)
}

// 设置USERID
export function setUserId (userId) {
  return Cookies.set(TokenUserId, userId)
}

// 保存departmetId
export function getDepartmentId () {
  return Cookies.get(TokenDepartmentId)
}

// 设置departmetId
export function setDepartmentId (departmentId) {
  return Cookies.set(TokenDepartmentId, departmentId)
}

// 保存depName
export function getDepName () {
  return Cookies.get(TokenDepName)
}

// 设置depName
export function setDepName (depName) {
  return Cookies.set(TokenDepName, depName)
}

// 保存depName
export function getLoginType () {
  return Cookies.get(TokenLoginType)
}

// 设置depName
export function setLoginType (loginType) {
  return Cookies.set(TokenLoginType, loginType)
}

// 保存depName
export function getLoginDepId () {
  return Cookies.get(TokenLoginDepId)
}

// 设置depName
export function setLoginDepId (loginDepId) {
  return Cookies.set(TokenLoginDepId, loginDepId)
}

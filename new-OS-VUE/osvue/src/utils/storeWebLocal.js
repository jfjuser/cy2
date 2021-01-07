/*
 * @Author: your name
 * @Date: 2020-05-14 21:54:19
 * @LastEditTime: 2020-05-18 21:39:30
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \OS_VUE\os-vue\src\utils\storeWebLocal.js
 */
/** ********
 * localStorage:{
 *  PLATFORM_TYPE = 平台类型
 *
 * }
 * session:{
 *  BASE_TOKEN = base 页面token
 * }
 *
 * **********/
// 设置 localStorage
const setLocalStorage = (key, value) => {
  return window.localStorage.setItem(key, value)
}
// 获取 localStorage
const getLocalStorage = (key) => {
  return window.localStorage.getItem(key) || ''
}
// 删除 localStorage
const removeLocalStorage = (key) => {
  return window.localStorage.removeItem(key)
}

let baseToken = parseInt(Date.now().toString() + Math.random() * 5000) // 版本 token
// 设置 session
const setSessionStorage = (key, value) => {
  if (key === 'BASE_TOKEN') return window.sessionStorage.setItem(key, baseToken)
  return window.sessionStorage.setItem(key, value)
}
// 获取 session
const getSessionStorage = (key) => {
  return window.sessionStorage.getItem(key) || ''
}
// 删除 session
const removeSessionStorage = (key) => {
  return window.sessionStorage.removeItem(key)
}

export default {
  setLocalStorage,
  getLocalStorage,
  removeLocalStorage,
  setSessionStorage,
  getSessionStorage,
  removeSessionStorage
}

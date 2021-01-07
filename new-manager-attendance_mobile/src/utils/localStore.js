/** ********  【 本地存储 】  **********/
/** ********  【 获取LocalStorage 】  **********/
const getLocalStorage = (key) => {
  let getKeys = window.localStorage.getItem(key)
  return JSON.parse(getKeys)
}
/** ********  【 设置LocalStorage 】  **********/
const setLocalStorage = (key, value) => {
  if (typeof value === 'string') {
    return window.localStorage.setItem(key, value)
  } else {
    return window.localStorage.setItem(key, JSON.stringify(value))
  }
}
/** ********  【 删除LocalStorage 】  **********/
const removeLocalStorage = (key) => {
  return window.localStorage.removeItem(key)
}

/** ********  【 导出 】  **********/
export {
  getLocalStorage,
  setLocalStorage,
  removeLocalStorage
}

/** ********  【 本地存储模块 】  **********/
const STORAGE_TYPE = 'sessionStorage' // sessionStorage . localStorage

// get 本地session数据
const getSession = (key) => {
  if (!key) throw new Error('getSession not key!')
  let getKey = window[STORAGE_TYPE].getItem(key)
  return JSON.parse(getKey)
}
// set 本地session数据
const setSession = (key, value) => {
  if (!key || value === undefined) throw new Error('setSession not key or value!')
  return window[STORAGE_TYPE].setItem(key, JSON.stringify(value))
}
// remove 本地session数据
const removeSession = (key) => {
  if (!key) throw new Error('removeSession not key!')
  return window[STORAGE_TYPE].removeItem(key)
}

export {
  getSession,
  setSession,
  removeSession
}

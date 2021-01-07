/*
在首页或自动授权页会保存一些通用信息到localStorage
*/
// 首页获取到菜单后会保存一份，用于缓存快速回显
export function getMenuInfo () {
  let menuInfo = localStorage.getItem('menuInfo')
  // console.log(menuInfo)
  if (!menuInfo) {
    menuInfo = []
    console.log('未获取到菜单信息')
  } else {
    menuInfo = JSON.parse(menuInfo)
  }
  return menuInfo
}

export function setMenuInfo (info) {
  if (!info) {
    info = []
  }
  localStorage.setItem('menuInfo', JSON.stringify(info))
}
export function setCode (code) {
  if (!code) {
    code = ''
  }
  localStorage.setItem('payCode', code)
}
export function getCode () {
  let menuInfo = localStorage.getItem('payCode')
  // console.log(menuInfo)
  if (!menuInfo) {
    menuInfo = ''
    console.log('未获取到菜单信息')
  }
  return menuInfo
}
export function getLastMenuInfo () {
  let menuInfo = localStorage.getItem('lastMenuInfo')
  // console.log(menuInfo)
  if (!menuInfo) {
    menuInfo = []
    console.log('未获取到菜单信息')
  } else {
    menuInfo = JSON.parse(menuInfo)
  }
  return menuInfo
}

export function setLastMenuInfo (info) {
  if (!info) {
    info = []
  }
  localStorage.setItem('lastMenuInfo', JSON.stringify(info))
}

// 微信用户信息(自动授权页创建)
export function getWxInfo () {
  let wxInfo = localStorage.getItem('wxInfo')
  // console.log(wxInfo)
  if (!wxInfo) {
    wxInfo = {}
    console.log('未获取到微信用户基本信息')
  } else {
    wxInfo = JSON.parse(wxInfo)
  }
  return wxInfo
}

export function setWxInfo (info) {
  if (!info) {
    info = {}
  }
  localStorage.setItem('wxInfo', JSON.stringify(info))
}

export function getDepInfo () {
  let depInfo = localStorage.getItem('depInfo')
  // console.log(faceInfo)
  if (!depInfo) {
    depInfo = {}
    console.log('未登录成功,部分功能无法使用')
  } else {
    depInfo = JSON.parse(depInfo)
  }
  return depInfo
}

export function setDepInfo (info) {
  if (!info) {
    info = {}
  }
  localStorage.setItem('depInfo', JSON.stringify(info))
}

// 人脸用户信息(自动授权页创建)
export function getFaceInfo () {
  let faceInfo = localStorage.getItem('faceInfo')
  // console.log(faceInfo)
  if (!faceInfo) {
    faceInfo = {}
    console.log('未登录成功,部分功能无法使用')
  } else {
    faceInfo = JSON.parse(faceInfo)
  }
  return faceInfo
}

export function setFaceInfo (info) {
  if (!info) {
    info = {}
  }
  localStorage.setItem('faceInfo', JSON.stringify(info))
}

export function setUserInfo (info) {
  if (!info) {
    info = {}
  }
  localStorage.setItem('userInfo', JSON.stringify(info))
}

export function getUserInfo () {
  let userInfo = localStorage.getItem('userInfo')
  return JSON.parse(userInfo)
}

export function setAppid (info) {
  if (!info) {
    info = {}
  }
  localStorage.setItem('Appid', JSON.stringify(info))
}

export function getAppid () {
  let Appid = localStorage.getItem('Appid')
  return JSON.parse(Appid)
}

/** ********  【 用户检测设备类型 】  **********/
// 用户设备类型检测器
function userDevices (agentType) {
  return navigator.userAgent.match(agentType)[0]
}

/** ********  [ IOS 检测 ]  **********/
const IOSDevice = function (iosType) {
  console.log('IOS检测： ', iosType)

  switch (userDevices(iosType)) {
    // case ''
  }
}
/** ********  [ Android 检测 ]  **********/
const AndroidDevice = function (AnroidType) {
  console.log('AnroidType 检测： ', AnroidType)
  switch (userDevices(AnroidType)) {

  }
}
/** ********  [ 导出 ]  **********/
export {
  IOSDevice,
  AndroidDevice
}

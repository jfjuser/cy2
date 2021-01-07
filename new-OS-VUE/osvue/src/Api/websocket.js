/*
*@Author: lyf
*@Date: 2018-09-13 10:04:23
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-10-09 15:26:29
*/

// production = 正式服, beta = 测试服, development = 本地开发
/** ********  【 原本api websocket 】  **********/
// const host = process.env.NODE_ENV === 'production'
//   ? 'wss://www.cytingchechang.com/ws/'
//   : process.env.NODE_ENV === 'beta'
//     ? 'wss://beta.cytingchechang.com/ws/'
//     : process.env.NODE_ENV === 'development'
//       ? 'wss://beta.cytingchechang.com/ws/'
//       : 'wss://www.cytingchechang.com/ws/'

/** ********  【 新设置api websocket 】  **********/
// let url = window.location.host
// const host = process.env.NODE_ENV !== 'development' ? 'wss://beta.cytingchechang.com/ws/' : 'ws://112.74.50.105/ws/'
// const host = process.env.NODE_ENV !== 'development' ? 'wss://beta.cytingchechang.com/ws/' : 'ws://112.74.50.105/ws/'
let beta = window.location.protocol.indexOf('s') >= 0 ? 'wss://beta.cytingchechang.com/ws/' : 'ws://47.106.35.188/ws/'
let production = window.location.protocol.indexOf('s') >= 0 ? 'wss://www.cytingchechang.com/ws/' : 'ws://112.74.50.105/ws/'
let isbeta = process.env.API_HOST.indexOf('beta.') >= 0 ? beta : production
const host = process.env.NODE_ENV === 'production'
  ? isbeta
  : process.env.NODE_ENV === 'beta'
    ? beta
    : process.env.NODE_ENV === 'development'
      ? beta
      : production
// const host = 'wss://www.cytingchechang.com/ws/'
// const host = 'wss://beta.cytingchechang.com/ws/'
// const host = 'ws://192.168.0.105:8083/ws/'
// const host = 'ws://192.168.0.196:9000/ws/'
// 车场设置下载参数
export const parkSettingWebSocket = host + 'DOWNSETTINGS'
// 动态二维码
export const qrCodeWebSocket = host + 'GETERCODE'
// 4G进出监控
export const inOutListenWebSocket = host + 'INOUTLISTEN'
// 人脸收费
export const faceFeeWebSocket = host + 'FACEFEELISTEN'
// 实时统计
export const realTimeWebSocket = host + 'AIINOUTPUSH'
// 升级相机
export const updateCameraWebSocket = host + 'CAMERAPROGRESS'

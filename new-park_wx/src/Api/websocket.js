/*
*@Author: lyf
*@Date: 2018-09-13 10:04:23
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2019-08-01 17:22:14
*/

// production = 正式服, beta = 测试服, development = 本地开发
const host = process.env.NODE_ENV === 'production'
  ? 'wss://www.cytingchechang.com/ws/'
  : process.env.NODE_ENV === 'beta'
    ? 'wss://beta.cytingchechang.com/ws/'
    : process.env.NODE_ENV === 'development'
      ? 'wss://beta.cytingchechang.com/ws/'
      : 'wss://www.cytingchechang.com/ws/'
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

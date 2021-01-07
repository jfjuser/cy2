const isOS = () => {
  var u = navigator.userAgent
  // var app = navigator.appVersion
  let client = ''
  var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1 // g
  var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) // ios终端
  if (isAndroid) {
    // 这个是安卓操作系统
    client = 'Android'
  }
  if (isIOS) {
    // 这个是ios操作系统
    client = 'iOS'
  }
  return client
}
export default isOS

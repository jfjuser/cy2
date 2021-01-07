// 关闭窗口
export function closeWindow (window) {
  var ua = window.navigator.userAgent.toLowerCase()
  // alert(ua)
  if (ua.match(/MicroMessenger/i) === 'micromessenger') {
    console.log('微信浏览器关闭页面')
    // 微信浏览器关闭页面
    // eslint-disable-next-line
    if (window.WeixinJSBridge) {
      window.WeixinJSBridge.call('closeWindow')
    }
    if (window.AlipayJSBridge) {
      window.AlipayJSBridge.call('closeWebview')
    }
  } else {
    // 其他js
    if (window.WeixinJSBridge) {
      window.WeixinJSBridge.call('closeWindow')
    }
    if (window.AlipayJSBridge) {
      window.AlipayJSBridge.call('closeWebview')
    }
    let browserName = window.navigator.appName
    // let browserVer = parseInt(navigator.appVersion)
    if (browserName === 'Microsoft Internet Explorer') {
      let ie7 = (document.all && !window.opera && window.XMLHttpRequest)
      if (ie7) {
        // This method is required to close a window without any prompt for IE7 & greater versions.
        window.open('', '_parent', '')
        window.close()
      } else {
        // This method is required to close a window without any prompt for IE6
        this.focus()
        self.opener = this
        self.close()
      }
    } else {
      // For NON-IE Browsers except Firefox which doesnt support Auto Close
      try {
        this.focus()
        self.opener = this
        self.close()
      } catch (e) {}
      try {
        window.open('', '_self', '')
        window.close()
      } catch (e) {}
    }
  }
}

import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import AMap from 'vue-amap'
// import QRcode from 'qrcodejs2'
import 'babel-polyfill'
import 'element-ui/lib/theme-chalk/index.css'
import 'font-awesome/css/font-awesome.css' // 使用font-awesome
import '@/styles/index.scss' // 全局css样式
import '@/permission' // 权限控制
import has from './directive/permission/index.js'
import './utils/filter'
import './utils/visibilitychange'
import promise from 'es6-promise'
import 'xe-utils'
import VXETable from 'vxe-table'
import 'vxe-table/lib/index.css'
import table2excel from '@/utils/table2excel.js'
// 数据可视化组件库
import dataV from '@jiaminghi/data-view'
Vue.use(VXETable)
Vue.use(dataV)
Vue.use(VXETable)
promise.polyfill()
Vue.config.productionTip = false
// 使用ElementUI
Vue.use(has)
Vue.use(ElementUI)
// Vue.use(QRcode)
// 二次确认弹窗
Vue.prototype.MessageBox = function (info) {
  return new Promise((resolve, reject) => {
    let messageHtml = ''
    info.message.forEach((item, index) => {
      let indexof = info.message.length > 1 ? (index + 1) / 1 + '.' : ' '
      messageHtml += '<span style="color: red; width: 100%;margin-bottom:10px ">' + indexof + item + ' </span>'
    })
    ElementUI.MessageBox.confirm('<div style="display: flex; align-items: center;justify-content: center;"><img src="' + require('@/assets/warning.png') + '" style="width: 80px; height: 60px;margin-right:20px"><div style="display: flex;flex: 1;align-items: center;flex-wrap: wrap;justify-content: center;padding-top:20px;box-sizing:border-box;">' + messageHtml + '</div></div>', '警告', {
      showCancelButton: true,
      dangerouslyUseHTMLString: true,
      confirmButtonText: info.firstconfirmButtonText,
      cancelButtonText: info.firstcancelButtonText
    }).then(() => {
      return ElementUI.MessageBox.confirm(info.secondmessgae, '提示', {
        confirmButtonText: info.secondconfirmButtonText,
        cancelButtonText: info.secondcancelButtonText,
        distinguishCancelAndClose: true,
        beforeClose: (action, instance, done) => {
          // console.log(action, instance)
          if (action === 'confirm' || action === 'close') {
            ElementUI.MessageBox.close()
          } else {
            done()
          }
        }
      }).then(() => {
        resolve()
      }).catch(() => {
        reject(new Error())
      })
    })
  })
}
Vue.prototype.table2excel = table2excel
AMap.initAMapApiLoader({
  key: '449c94e7df49baaf7024db409d1d32fe',
  plugin: ['AMap.PlaceSearch', 'AMap.Geolocation', 'AMap.Geocoder'],
  v: '1.4.4'
})
Vue.use(AMap)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})

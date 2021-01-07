/*
 * @Descripttion:
 * @version:
 * @Author: sueRimn
 * @Date: 2020-05-08 11:24:42
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2020-05-20 07:28:56
 */
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
// import { Toast } from 'mint-ui'
import App from './App'
import router from './router'
import { ToastPlugin, ConfirmPlugin } from 'vux'
import './plugins/vux' // 引入vux插件模块
import './style/index.less' // 引入vux插件模块
import VueScroller from 'vue-scroller'
import { Col, Row, Uploader } from 'vant'
Vue.use(VueScroller)
Vue.use(Col)
Vue.use(Row)
Vue.use(Uploader)

/** ********  【 在正式服需要注释 VConsole 】  **********/
/* eslint-disable no-new */
if (process.env.NODE_ENV === 'development' || process.env.API_HOST.indexOf('beta.') >= 0) {
  const VConsole = require('vconsole')
  new VConsole()
}
Vue.config.productionTip = false
// 默认参数
Vue.use(ToastPlugin, {position: 'bottom', time: 5000})
Vue.use(ConfirmPlugin)
Vue.use(require('vue-wechat-title'))

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})

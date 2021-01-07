// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
// import router from './router/index'
import store from './store'
import 'lib-flexible/flexible'
import request from './utils/request'
import dayjs from 'dayjs'
import './style/reset.css'
import './style/common.css'
import { Tree } from 'element-ui'
import VueTouch from 'vue-touch'
import '@/plugins/vant' // 引入 vant框架使用
import { RadioGroup, Radio, Toast } from 'vant'
const VConsole = require('vconsole')
/* eslint-disable no-new */
new VConsole()

Vue.use(Radio)
Vue.use(RadioGroup)
Vue.use(Toast)
// =========[ 开发使用 ]=======================
if (process.env.NODE_ENV === 'development') {

}

if (process.env.NODE_ENV === 'development') {
  require('./mock')// mick模拟数据信息
}
// ==================================
Vue.component(Tree.name, Tree)
Vue.use(VueTouch, {name: 'v-touch'})// 使用v-touch滑动插件

Vue.use(require('vue-wechat-title'))

Vue.prototype.$http = request
Vue.prototype.$dayjs = dayjs
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})

import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import qs from 'qs'
import 'lib-flexible'
import router from './router/index.js'
import './assets/css/common.scss'
import VueWechatTitle from "vue-wechat-title"
Vue.use(VueWechatTitle)
const VConsole = require('vconsole')
/* eslint-disable no-new */
new VConsole()
Vue.config.productionTip = false
Vue.prototype.$axios = axios

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')

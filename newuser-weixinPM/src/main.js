// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/index.js'
import './assets/css/icon.scss'
import request from './utils/request'

import './plugins/vant' // 引入vant插件模块
import { RadioGroup, Radio } from 'vant'
import Vconsole from 'vconsole'
Vue.use(Radio)
Vue.use(RadioGroup)
Vue.prototype.$http = request

// ==============================================
/* eslint-disable no-new */
new Vconsole()
if (process.env.NODE_ENV === 'development') {
  require('./mock')
}
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>'
})

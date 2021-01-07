import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'babel-polyfill'
import 'element-ui/lib/theme-chalk/index.css'
import 'font-awesome/css/font-awesome.css' // 使用font-awesome
import '@/styles/index.scss' // 全局css样式
import '@/permission' // 权限控制
import './utils/visibilitychange'
import promise from 'es6-promise'
promise.polyfill()

Vue.config.productionTip = false
// 使用ElementUI
Vue.use(ElementUI)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})

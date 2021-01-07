// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import 'lib-flexible/flexible'
import './style/reset.css'
import 'font-awesome/css/font-awesome.css' // 使用font-awesome
import '@/permission' // 权限控制
import './utils/filter'
import { has, has2father } from './directive/permission/index.js'
import { Toast, Notify } from 'vant'
import AMap from 'vue-amap'
import './utils/veeValidate'

Vue.use(has).use(has2father)
Vue.use(Notify)

AMap.initAMapApiLoader({
  key: '449c94e7df49baaf7024db409d1d32fe',
  plugin: ['AMap.PlaceSearch', 'AMap.Geolocation', 'AMap.Geocoder'],
  v: '1.4.4'
})
Vue.use(AMap)

Toast.setDefaultOptions({position: 'bottom'})
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})

// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import './font-awesome-4.7.0/css/font-awesome.css'
import '@/permission' // 权限控制
import { Tree, Select, Option, Icon, Button } from 'element-ui'

import { Dialog } from 'vant'
import VueScroller from 'vue-scroller'
Vue.use(VueScroller)
Vue.use(Dialog)

Vue.config.productionTip = false
/* eslint-disable no-new */
Vue.component(Tree.name, Tree)
Vue.component(Option.name, Option)
Vue.component(Select.name, Select)
Vue.component(Icon.name, Icon)
Vue.component(Button.name, Button)
// Vue.component(Upload.name, Upload)

new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})

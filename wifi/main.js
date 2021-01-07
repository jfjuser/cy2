import Vue from 'vue'
import App from './App'
// import { pathToBase64, base64ToPath } from './static/gsq-image-tools/image-tools/index.js'
Vue.config.productionTip = false
Vue.prototype.allUrl = App.globalData.allUrl
// Vue.prototype.pathToBase64 = pathToBase64
// Vue.prototype.base64ToPath = base64ToPath
App.mpType = 'app'
const app = new Vue({
    ...App
})
app.$mount()

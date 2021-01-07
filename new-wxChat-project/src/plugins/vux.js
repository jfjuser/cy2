import Vue from 'vue'
import {
  Cell,
  Group,
  Confirm,
  XInput,
  AlertPlugin,
  ToastPlugin,
  XButton,
  CellFormPreview,
  LoadingPlugin
} from 'vux'
/** ********  【 组件形式 】  **********/
Vue.component('cell', Cell)
Vue.component('group', Group)
Vue.component('confirm', Confirm)
Vue.component('x-input', XInput)
Vue.component('x-button', XButton)

Vue.component('cell-form-preview', CellFormPreview)
/** ********  【 插件形式 】  **********/
Vue.use(AlertPlugin)
Vue.use(LoadingPlugin)
// 默认参数
Vue.use(ToastPlugin, {position: 'center'})
Vue.use(LoadingPlugin)

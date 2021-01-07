import Vue from 'vue'
import { ValidationObserver, ValidationProvider, extend, localize } from 'vee-validate'
import zh from 'vee-validate/dist/locale/zh_CN.json'
// eslint-disable-next-line
import { required, email, integer, min_value } from 'vee-validate/dist/rules'

localize('zh', zh)

Vue.component('ValidationObserver', ValidationObserver)
Vue.component('ValidationProvider', ValidationProvider)

extend('required', {
  ...required,
  message: '{_field_}不可为空'
})
extend('email', email)
extend('integer', integer) // 整数值
extend('min_value', min_value) // 必须为数字值，并且不得小于指定的值
extend('phone', {
  validate (value) {
    return (/^1[123456789]\d{9}$/.test(value))
  },
  message: '请输入正确的手机号码'
})
extend('password', {
  validate (value) {
    return (/^(\w){6,12}$/.test(value))
  },
  message: '{_field_}为6-12位字母、数字或者下划线'
})
extend('tofixed', {
  params: ['length'],
  validate (value, { length }) {
    return !(typeof value === 'string' && value.indexOf('.') !== -1 && value.split('.')[1].length > length)
  },
  message: '{_field_}最多包含{length}位小数'
})

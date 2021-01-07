/*
*@Author: lyf
*@Date: 2018-08-11 15:04:21
 * @Last Modified by: wzs
 * @Last Modified time: 2020-05-16 19:15:42
*/
import Vue from 'vue'

// 设置指令
const has = Vue.directive('has', {
  // 获取按钮权限
  inserted (el, binding, vnode) {
    // console.log(binding)
    const { value } = binding
    let btnPermissions = vnode.context.$route.meta.roles
    // console.log(btnPermissions)
    // 如果数组存在，并且大于0
    if (btnPermissions && btnPermissions instanceof Array && btnPermissions.length > 0) {
      const hasPermission = btnPermissions.some(role => {
        // console.log(value, role, btnPermissions, value.includes(role))
        return value.includes(role)
      })
      if (!hasPermission) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    } else {
      el.parentNode && el.parentNode.removeChild(el)
    }
  }
})
export default { has }

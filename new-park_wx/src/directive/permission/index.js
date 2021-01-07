/*
*@Author: lyf
*@Date: 2018-08-11 15:04:21
 * @Last Modified by: lyf
 * @Last Modified time: 2018-09-12 22:04:49
*/
import Vue from 'vue'

// 设置指令
const has = Vue.directive('has', {
  // 获取按钮权限
  inserted (el, binding, vnode) {
    const { value } = binding
    let btnPermissions = vnode.context.$route.meta.roles
    // 如果数组存在，并且大于0
    if (btnPermissions && btnPermissions instanceof Array && btnPermissions.length > 0) {
      const hasPermission = btnPermissions.some(role => {
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
// 和上面的区别是，查父级路由有没有权限
const has2father = Vue.directive('has2father', {
  // 获取按钮权限
  inserted (el, binding, vnode) {
    const { value } = binding
    let btnPermissions = vnode.context.$route.matched[1].meta.roles
    // 如果数组存在，并且大于0
    if (btnPermissions && btnPermissions instanceof Array && btnPermissions.length > 0) {
      const hasPermission = btnPermissions.some(role => {
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
export { has, has2father }

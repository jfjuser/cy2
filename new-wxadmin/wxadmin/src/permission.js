import router from './router'
// import store from './store'
import { getToken } from '@/utils/cookie'
import { Notify } from 'vant'
// import { Message } from 'element-ui'
router.beforeEach((to, from, next) => {
  if (getToken() !== undefined) {
    next()
  } else {
    next()
    Notify('登录失效，请重新登录')
  }
})

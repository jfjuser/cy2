// 控制权限页面
import router from './router'
import Store from './store'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
// import {Message} from 'element-ui'
import {getToken} from '@/utils/cookie'
import Axios from 'axios'

const whiteList = ['/login', '/autoLogin'] // 不进行重定向

router.beforeEach((to, from, next) => {
  NProgress.start()
  // 取消上一页请求
  const CancelToken = Axios.CancelToken
  Store.state.source.cancel && Store.state.source.cancel()
  Store.state.source = CancelToken.source()

  if (getToken()) {
    if (to.path === '/login' || to.path === '/autoLogin') {
      next({path: '/'})
      NProgress.done()
    } else {
      next()
    }
  } else {
    // 判断是否跳转登录页面
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else if (whiteList.indexOf(to.path) === 2) {
      console.log('预授权登录')
      next('/autoLogin')
      NProgress.done()
    } else {
      next('/login')
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})

// 控制权限页面
import router from './router'
import store from './store'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import {Notify} from 'vant'
import {getToken} from '@/utils/cookie'
import Axios from 'axios'

router.beforeEach((to, from, next) => {
  NProgress.start()
  // 取消上一页请求
  const CancelToken = Axios.CancelToken
  store.state.source.cancel && store.state.source.cancel()
  store.state.source = CancelToken.source()

  if (getToken()) {
    if ('/login'.indexOf(to.path) !== -1) {
      next({path: '/'})
    } else {
      // 判断路由是否存在
      if (store.getters.addRouters.length === 0) {
        // 如果不存在则根据departmentId进行获取
        store.dispatch('GenerateRoutes').then(() => {
          router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
          next({ ...to, replace: true }) // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
        }).catch(() => {
          store.dispatch('WebLogOut').then((res) => {
            Notify({ type: 'danger', message: '暂未分配权限,请重新登录' })
            next({ path: '/' })
          })
        })
      } else {
        // 判断是否具有权限进入该页面
        // 如果存在
        next()
      }
    }
  } else {
    // 判断是否跳转登录页面
    if ('/login'.indexOf(to.path) !== -1) {
      next()
    } else {
      next('/login')
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})

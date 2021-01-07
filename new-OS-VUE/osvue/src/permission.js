/*
 * @Author: your name
 * @Date: 2020-05-10 00:00:24
 * @LastEditTime: 2020-05-19 08:41:38
 * @LastEditors: sueRimn
 * @Description: In User Settings Edit
 * @FilePath: \OS_VUE\os-vue\src\permission.js
 */
// 控制权限页面
import router from './router'
import store from './store'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import {Message} from 'element-ui'
import {getToken} from '@/utils/cookie'
import Axios from 'axios' // 不进行重定向

/** ********  是否是人脸云平台  **********/
let nowHost = null
nowHost = window.location.origin // 获取当前地址
let getBaseToken = store.getters.baseToken // Base 页面 token
let platformSelect = store.getters.platformSelect // 平台类型
let platformSelectBase = store.getters.platformSelectBase // 平台类型
/** ********  测试测试测试  **********/
if (process.env.NODE_ENV === 'development') {
  nowHost = nowHost + (window.location.pathname !== '/' ? window.location.pathname : '')
}
// console.log(22222222222222, platformSelectBase)

// ======================
/** ********  【 原始 】  **********/
let opTest = 'http://beta.cytingchechang.com'// op测试地址
let opFace = 'http://cyai.cytingchechang.com'// op人脸地址
let opPark = 'http://www.cytingchechang.com'// op车场地址
/** ********  【 新的 】  **********/
// let opTest = 'http://47.106.35.188'// op测试地址
// let opFace = 'http://cy.40mi.com'// op人脸地址
// let opPark = 'http://cy2.40mi.com'// op车场地址
if (nowHost === opTest && nowHost !== platformSelect.testPlatform) {
  window.location.href = platformSelect.testPlatform
} else if (nowHost === opFace && nowHost !== platformSelect.facePlatform.url) {
  window.location.href = platformSelect.facePlatform.url
} else if (nowHost === opPark && nowHost !== platformSelect.cartPlatform.url) {
  window.location.href = platformSelect.cartPlatform.url
}

/** ********  判断当前地址源是否是 n平台地址源  **********/
let isTest = nowHost === platformSelect.testPlatform || nowHost === platformSelect.testPlatform + '/'// 是否是测试服
let isFaceplatform = nowHost === platformSelect.facePlatform.url || nowHost === platformSelectBase.facePlatform.url || nowHost === platformSelect.facePlatform.url + '/' || nowHost === platformSelectBase.facePlatform.url + '/'// 是否是人脸平台
let isParkplatform = nowHost === platformSelect.cartPlatform.url || nowHost === platformSelectBase.cartPlatform.url || nowHost === platformSelect.cartPlatform.url + '/' || nowHost === platformSelectBase.cartPlatform.url + '/'// 是否是车场平台

/** ********  测试测试测试  **********/
if (process.env.NODE_ENV === 'development') {
  console.log('测试服', isTest, nowHost)
  console.log('人脸平台', isFaceplatform, nowHost)
  console.log('车场平台', isParkplatform, nowHost)
  // console.log('平台类型： ', platformSelect.testPlatform)
}
// ======================

// =====================================
const whiteList = ['/login', '/autoLogin'] // 指定
router.beforeEach((to, from, next) => {
  NProgress.start()
  // 取消上一页请求
  const CancelToken = Axios.CancelToken
  store.state.source.cancel && store.state.source.cancel()
  store.state.source = CancelToken.source()

  if (getToken()) {
    if (to.path === '/login' || to.path === '/autoLogin') {
      next({path: '/'})
      NProgress.done()
    } else {
      // 判断路由是否存在
      if (store.getters.addRouters.length === 0) {
        // 如果不存在则根据departmentId进行获取
        // console.log(store.getters.addRouters)
        store.dispatch('GenerateRoutes').then(() => {
          router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
          next({ ...to, replace: true }) // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
        }).catch((err) => {
          store.dispatch('WebLogOut').then((res) => {
            Message.error(err || '暂未分配权限,请重新登录')
            next({ path: '/' })
          })
        })
      } else {
        // 判断是否具有权限进入该页面
        // 如果存在
        if (to.path === '/base' && (!isTest || !isFaceplatform)) {
          next({
            path: '/',
            query: from.fullPath
          })
        } else {
          next()
        }
        next()
      }
    }
  } else {
    /** ********  判断当前的访问的是否是车场  **********/
    if (isParkplatform && !getBaseToken) {
      // console.log('当前是车场平台。。。', getBaseToken)
      if (to.path === '/base') {
        next()
      } else {
        if (from.path === '/base') {
          next({
            path: '/base',
            query: from.fullPath
          })
        } else {
          next({path: '/base'})
        }
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
  }
})
router.afterEach(() => {
  NProgress.done()
})

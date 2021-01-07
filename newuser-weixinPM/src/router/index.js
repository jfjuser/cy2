import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'
// import reigster from '@/components/reigster'
// import login from '@/components/login'
// const Wgcard = () => import('@/components/wgcard/index') // 设置参数
Vue.use(Router)

const router = new Router({
  routes: [
    // {
    //   path: '/',
    //   name: 'login',
    //   component: login
    // },
    // {
    //   path: '/register',
    //   name: 'reigster',
    //   component: reigster
    // },
    // {
    //   path: '/login',
    //   name: 'login',
    //   component: login
    // },
    // {
    //   path: '/tabbar',
    //   name: 'tabbar',
    //   component: () => import('@/components/tabbar.vue')
    // },
    {
      path: '/',
      // component: () => import('@/components/getCode'),
      redirect: {name: 'getCode'}
    },
    {
      path: '/getCode/',
      name: 'getCode',
      component: () => import('@/components/getCode')
    },
    {
      path: '/detailsShow/',
      name: 'detailsShow',
      component: () => import('@/components/detailsShow')
    },
    {
      path: '/statiReport/',
      name: 'statiReport',
      component: () => import('@/components/statiReport')
    },
    {
      path: '/mySet/',
      name: 'mySet',
      component: () => import('@/components/mySet')
    },
    {
      path: '/mine/',
      name: 'mine',
      component: () => import('@/components/mine')
    },
    {
      path: '/cardApply/',
      name: 'cardApply',
      component: () => import('@/components/apply/cardApply/index')
    },
    {
      path: '/leaveApply/',
      name: 'leaveApply',
      component: () => import('@/components/apply/leaveApply/leaveApply')
    },
    { path: '/businessTravelApply/',
      name: 'businessTravelApply',
      component: () => import('@/components/apply/businessTravelApply/businessTravelApply')
    },
    { path: '/workOvertimeApply/',
      name: 'workOvertimeApply',
      component: () => import('@/components/apply/workOvertimeApply/workOvertimeApply')
    },
    { path: '/goOutApply/',
      name: 'goOutApply',
      component: () => import('@/components/apply/goOutApply/goOutApply')
    },
    {
      path: '/addFace/',
      name: 'addFace',
      component: () => import('@/components/addFace')
    },
    {
      path: '/addInfo/',
      name: 'addInfo',
      component: () => import('@/components/addInfo')
    },
    {
      path: '/addAttend/',
      name: 'addAttend',
      component: () => import('@/components/addAttend')
    },
    {
      path: '/message/',
      name: 'message',
      component: () => import('@/components/message')
    },
    {
      path: '/attendance/',
      name: 'attendance',
      component: () => import('@/components/attendance/attendance.vue'),
      meta: {keepAlive: true}
    },
    {
      path: '/detailsPage/',
      name: 'detailsPage',
      component: () => import('@/components/detailsPage/detailsPage.vue')
    }
  ]
})

router.beforeEach((to, from, next) => {
  let getWxAccount = store.getters['user/wxInfo']
  // console.log('当前的微信account：', getWxAccount)
  // 检测当前有没有获取到微信信息
  if (to.name === 'getCode') {
    next()
  } else {
    if (getWxAccount) {
      next()
    } else {
      next({
        name: 'getCode'
      })
    }
  }

  next()
})

export default router

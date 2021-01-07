import Vue from 'vue'
import Router from 'vue-router'
import { ParkCenterRouterMap } from './modules/ParkCenterRouterMap'
import { PermissionRouterMap } from './modules/PermissionRouterMap'
import { InOutRouterMap } from './modules/InOutRouterMap'
import { PayManageRouterMap } from './modules/PayManageRouterMap'
import { BoxRouterMap } from './modules/BoxRouterMap'
import { DeviceManageRouterMap } from './modules/DeviceManageRouterMap'
import { TicketManageRouterMap } from './modules/TicketManageRouterMap'
// import { CameraManageRouterMap } from './modules/CameraManageRouterMap'

import HomePage from '@/views/homePage/index.vue'
import LoginCloud from '@/views/login/index.vue'
const Me = () => import('@/views/me/index')
const Menu = () => import('@/views/menu/index')
const Page401 = () => import('@/views/errPage/401')
const Page404 = () => import('@/views/errPage/404')

Vue.use(Router)

// 个人中心路由
const basicSetting = [
  {
    path: '/userInfo',
    name: 'userInfo',
    component: () => import('@/views/me/basicSetting/userInfo/index'),
    meta: { title: '个人信息', icon: 'fa fa-vcard ', noCache: true }
  },
  {
    path: '/modifyPassword',
    name: 'modifyPassword',
    component: () => import('@/views/me/basicSetting/modifyPassword/index'),
    meta: { title: '修改密码', icon: 'fa fa-key ', noCache: true }
  },
  {
    path: '/messageCenter',
    name: 'messageCenter',
    component: () => import('@/views/me/basicSetting/messageCenter/index'),
    meta: { title: '信息中心', icon: 'fa fa-bell ', noCache: true }
  },
  {
    path: '/feedback',
    name: 'feedback',
    component: () => import('@/views/me/basicSetting/feedback/index'),
    meta: { title: '我的建议', icon: 'fa fa-envelope-o', noCache: true }
  }
]

// 静态路由
export const constantRouterMap = [
  {
    path: '/login',
    component: LoginCloud,
    hidden: true
  },
  {
    path: '/404',
    component: Page404,
    hidden: true
  },
  {
    path: '/401',
    component: Page401,
    hidden: true
  },
  {
    path: '',
    component: HomePage,
    hidden: true,
    redirect: '/home/',
    children: [
      { path: 'home', component: () => import('@/views/home/index') },
      { path: 'map', component: () => import('@/views/home/cloudHome/map') },
      { path: 'statistics', component: () => import('@/views/home/parkHome/statistics') }
    ]
  },
  {
    path: '/me',
    component: HomePage,
    hidden: true,
    children: [
      { path: '', component: Me }
    ]
  },
  {
    path: '/menu',
    component: HomePage,
    hidden: true,
    children: [
      { path: '', component: Menu }
    ]
  },
  ...basicSetting
]

export const asyncRouterMap = [
  {
    path: '/permission',
    component: HomePage,
    meta: {
      title: '权限管理',
      icon: 'fa fa-lock '
    },
    children: PermissionRouterMap
  },
  // {
  //   path: '/cameraManage',
  //   component: HomePage,
  //   meta: {
  //     title: '相机管理',
  //     icon: 'fa fa-video-camera'
  //   },
  //   children: CameraManageRouterMap
  // },
  {
    path: '/inOut',
    component: HomePage,
    meta: {
      title: '进出管理',
      icon: 'fa fa-exchange '
    },
    children: InOutRouterMap
  },
  {
    path: '/parkCenter',
    component: HomePage,
    meta: {
      title: '车场数据',
      icon: 'fa fa-database'
    },
    children: ParkCenterRouterMap
  },
  {
    path: '/payManage',
    component: HomePage,
    meta: {
      title: '电子支付',
      icon: 'fa fa-paypal '
    },
    children: PayManageRouterMap
  },
  {
    path: '/ticketManage',
    component: HomePage,
    meta: {
      title: '电子优惠券',
      icon: 'fa fa-ticket '
    },
    children: TicketManageRouterMap
  },
  {
    path: '/deviceManage',
    component: HomePage,
    meta: {
      title: '设备管理',
      icon: 'fa fa-tasks '
    },
    children: DeviceManageRouterMap
  },
  {
    path: '/box',
    component: HomePage,
    meta: {
      title: '盒子模式',
      icon: 'fa fa-inbox '
    },
    children: BoxRouterMap
  }
]

export const Router404 = [
  { path: '*', redirect: '/404', hidden: true }
]

const router = new Router({
  // base: '/attendance/manager',
  mode: 'history',
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      document.body.scrollTop = 0
      return { x: 0, y: 0 }
    }
  },
  routes: constantRouterMap
})

export default router

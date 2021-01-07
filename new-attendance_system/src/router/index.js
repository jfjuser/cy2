import Vue from 'vue'
import Router from 'vue-router'
import LoginCloud from '@/views/login/index.vue'
import Page404 from '@/views/errPage/404.vue'
import Page401 from '@/views/errPage/401.vue'
import { attendRouterMap } from './modules/attendRouterMap'
import { attendCountRouterMap } from './modules/attendCountRouterMap'
import { applyForRouterMap } from './modules/applyForRouterMap'
import { cameraMaintainRouterMap } from './modules/cameraMaintainRouterMap'

import HomePage from '@/views/homePage/index.vue'

Vue.use(Router)

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
    redirect: '/home',
    children: [{
      path: 'home',
      component: () => import('@/views/home/index'),
      name: 'home',
      meta: {
        title: '首页',
        icon: 'fa fa-home',
        roles: ['seePage']
      }
    }]
  },
  {
    path: '/attend',
    component: HomePage,
    meta: {
      title: '考勤管理',
      icon: 'fa fa-briefcase'
    },
    children: attendRouterMap
  },
  {
    path: '/attendCount',
    component: HomePage,
    meta: {
      title: '考勤统计',
      icon: 'fa fa-calendar-check-o'
    },
    children: attendCountRouterMap
  },
  {
    path: '/applyFor',
    component: HomePage,
    meta: {
      title: '申请管理',
      icon: 'fa fa-american-sign-language-interpreting'
    },
    children: applyForRouterMap
  },
  {
    path: '/department',
    component: HomePage,
    meta: {
      title: '部门管理',
      icon: 'fa fa-sitemap'
    },
    children: [
      {
        path: 'department',
        name: 'department',
        component: () => import('@/views/department/index'),
        meta: { title: '部门管理', icon: 'fa fa-sitemap', noCache: true }
      }
    ]
  },
  {
    path: '/user',
    component: HomePage,
    meta: {
      title: '成员管理',
      icon: 'fa fa-user'
    },
    children: [
      {
        path: 'user',
        name: 'user',
        component: () => import('@/views/user/index'),
        meta: { title: '成员管理', icon: 'fa fa-user', noCache: true }
      }
    ]
  },
  {
    path: '/cameraMaintain',
    component: HomePage,
    meta: {
      title: '设备管理',
      icon: 'fa fa-tasks'
    },
    children: cameraMaintainRouterMap
  },
  {
    path: '/basicSetting',
    component: HomePage,
    hidden: true,
    meta: {
      title: '设置',
      icon: 'fa fa-cog '
    },
    children: [
      {
        path: 'userInfo',
        name: 'userInfo',
        component: () => import('@/views/basicSetting/userInfo/index'),
        meta: { title: '个人信息', icon: 'fa fa-vcard ', noCache: true }
      },
      {
        path: 'teamInfo',
        name: 'teamInfo',
        component: () => import('@/views/basicSetting/teamInfo/index'),
        meta: { title: '团队/公司信息', icon: 'fa fa-building', noCache: true }
      },
      {
        path: 'modifyPassword',
        name: 'modifyPassword',
        component: () => import('@/views/basicSetting/modifyPassword/index'),
        meta: { title: '修改密码', icon: 'fa fa-key ', noCache: true }
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  base: '/attendance',
  // mode: 'history',
  // 滑动滚动条
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

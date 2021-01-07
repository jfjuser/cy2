/*
*@Author: lyf
*@Date: 2018-12-27 15:15:55
 * @Last Modified by: lyf
 * @Last Modified time: 2019-07-17 11:53:44
*/
import { statistcsRouterMap } from './statistcsRouterMap.js'
// 广告模块
export const advModuleRouterMap = [
  {
    path: 'cloudAdv',
    name: 'cloudAdv',
    component: () => import('@/views/advModule/cloudAdv/index'),
    meta: {
      title: '平台广告',
      icon: 'fa fa-book',
      noCache: true
    }
  },
  {
    path: 'appAdv',
    name: 'appAdv',
    component: () => import('@/views/advModule/appAdv/index'),
    meta: {
      title: 'APP广告',
      icon: 'fa fa-volume-up',
      noCache: true
    }
  },
  {
    path: 'levelAdv',
    name: 'levelAdv',
    component: () => import('@/views/advModule/levelAdv/index'),
    meta: {
      title: '下级广告',
      icon: 'fa fa-volume-up',
      noCache: true
    }
  },
  {
    path: 'pushAdv',
    name: 'pushAdv',
    component: () => import('@/views/advModule/pushAdv/index'),
    meta: {
      title: '推送广告',
      icon: 'fa fa-sign-out',
      noCache: true
    }
  },
  {
    path: 'runningWater',
    name: 'runningWater',
    component: () => import('@/views/advModule/runningWater/index'),
    meta: {
      title: '推送流水',
      icon: 'fa fa-meetup',
      noCache: true
    }
  },
  {
    path: 'advTemp',
    name: 'advTemp',
    component: () => import('@/views/advModule/advTemp/index'),
    meta: {
      title: '广告模板',
      icon: 'fa fa-puzzle-piece',
      noCache: true
    }
  },
  {
    path: 'pushAdvTime',
    name: 'pushAdvTime',
    component: () => import('@/views/advModule/pushAdvTime/index'),
    meta: {
      title: '时间段设置',
      icon: 'fa fa-clock-o',
      noCache: true
    }
  },
  {
    path: 'pushRules',
    name: 'pushRules',
    component: () => import('@/views/advModule/pushRules/index'),
    meta: {
      title: '广告规则',
      icon: 'fa fa-tags',
      noCache: true
    }
  },
  {
    path: 'pushRecharge',
    name: 'pushRecharge',
    component: () => import('@/views/advModule/pushRecharge/index'),
    meta: {
      title: '充值记录',
      icon: 'fa fa-clone',
      noCache: true
    }
  },
  ...statistcsRouterMap
]

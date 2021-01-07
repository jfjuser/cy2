/*
*@Author: lyf
*@Date: 2019-01-16 17:19:36
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-09-07 16:59:25
*/
import { attendCountRouterMap } from './attendCountRouterMap.js'

export const attendRouterMap = [
  {
    path: 'shifts',
    name: 'shifts',
    component: () => import('@/views/faceAI/attend/shifts/index'),
    meta: {
      title: '班次管理',
      icon: 'fa fa-exchange',
      noCache: true
    }
  },
  {
    path: 'attendGroup',
    name: 'attendGroup',
    component: () => import('@/views/faceAI/attend/attendGroup/index'),
    meta: {
      title: '考勤组管理',
      icon: 'fa fa-users',
      noCache: true
    }
  },
  {
    path: 'attendanceGroupApply',
    name: 'attendanceGroupApply',
    component: () => import('@/views/faceAI/attend/attendanceGroupApply/attendanceGroupApply.vue'),
    meta: {
      title: '考勤组申请',
      icon: 'fa fa-envelope-open',
      noCache: true
    }
  },
  {
    path: 'attendMessage',
    name: 'attendMessage',
    component: () => import('@/views/faceAI/attend/attendMessage/index'),
    meta: {
      title: '加班审核',
      icon: 'fa fa-info-circle',
      noCache: true
    }
  },
  ...attendCountRouterMap
]

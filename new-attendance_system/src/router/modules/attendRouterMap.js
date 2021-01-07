/*
*@Author: lyf
*@Date: 2019-01-16 17:19:36
 * @Last Modified by: lyf
 * @Last Modified time: 2019-01-23 15:13:25
*/

export const attendRouterMap = [
  {
    path: 'shifts',
    name: 'shifts',
    component: () => import('@/views/attend/shifts/index'),
    meta: {
      title: '班次管理',
      icon: 'fa fa-exchange',
      noCache: true
    }
  },
  {
    path: 'attendGroup',
    name: 'attendGroup',
    component: () => import('@/views/attend/attendGroup/index'),
    meta: {
      title: '考勤组管理',
      icon: 'fa fa-users',
      noCache: true
    }
  }
]

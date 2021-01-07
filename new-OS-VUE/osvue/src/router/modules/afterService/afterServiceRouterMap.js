/*
*@Author: lyf
*@Date: 2018-12-18 14:03:48
 * @Last Modified by: lyf
 * @Last Modified time: 2018-12-21 10:19:09
*/

// 售后管理

export const AfterServiceRouterMap = [
  {
    path: 'personManage',
    name: 'personManage',
    component: () => import('@/views/afterService/personManage/index'),
    meta: { title: '人员管理', icon: 'fa fa-user', noCache: true }
  },
  {
    path: 'taskManage',
    name: 'taskManage',
    component: () => import('@/views/afterService/TaskManage/index'),
    meta: { title: '任务管理', icon: 'fa fa-calendar-check-o', noCache: true }
  },
  {
    path: 'solution',
    name: 'solution',
    component: () => import('@/views/afterService/Solution/index'),
    meta: { title: '解决方案', icon: 'fa fa-lightbulb-o', noCache: true }
  },
  {
    path: 'staffEvaluate',
    name: 'staffEvaluate',
    component: () => import('@/views/afterService/StaffEvaluate/index'),
    meta: { title: '物业评价', icon: 'fa fa-edit', noCache: true }
  },
  {
    path: 'orderRecords',
    name: 'orderRecords',
    component: () => import('@/views/afterService/orderRecords/index'),
    meta: { title: '接单记录', icon: 'fa fa-file-text-o', noCache: true }
  },
  {
    path: 'orderAddress',
    name: 'orderAddress',
    component: () => import('@/views/afterService/orderAddress/index'),
    meta: { title: '人员地址', icon: 'fa fa-map-marker', noCache: true }
  }
]

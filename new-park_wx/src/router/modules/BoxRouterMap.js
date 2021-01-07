/*
*@Author: lyf
*@Date: 2018-09-21 09:30:32
 * @Last Modified by: lyf
 * @Last Modified time: 2018-12-20 11:05:46
*/

// -------------- 盒子模式 ---------------\\
export const BoxRouterMap = [
  {
    path: 'monthlyCar',
    name: 'monthlyCar',
    component: () => import('@/views/park/box/monthlyCar/index'),
    meta: { title: '固定车', icon: 'fa fa-car', noCache: true }
  },
  {
    path: 'freeCar',
    name: 'freeCar',
    component: () => import('@/views/park/box/freeCar/index'),
    meta: { title: '免费车', icon: 'fa fa-cab', noCache: true }
  },
  {
    path: 'local',
    name: 'local',
    component: () => import('@/views/park/box/local/index'),
    meta: { title: '通道', icon: 'fa fa-video-camera', noCache: true }
  },
  {
    path: 'openRecord',
    name: 'openRecord',
    component: () => import('@/views/park/box/openRecord/index'),
    meta: { title: '人工开闸记录', icon: 'fa fa-file-text', noCache: true }
  },
  {
    path: 'unCheckMonthlyCar',
    name: 'unCheckMonthlyCar',
    component: () => import('@/views/park/box/unCheckMonthlyCar/index'),
    meta: { title: '未审核固定车', icon: 'fa fa-minus-square-o', noCache: true }
  }
]

/*
*@Author: lyf
*@Date: 2018-09-21 09:16:29
 * @Last Modified by: lyf
 * @Last Modified time: 2018-12-11 10:45:30
*/
// ------------------ 进出管理 -------------- \\
export const InOutRouterMap = [
  {
    path: 'in',
    name: 'in',
    component: () => import('@/views/park/inOut/in/index'),
    meta: { title: '在场记录', icon: 'fa fa-arrow-right', noCache: true }
  },
  {
    path: 'out',
    name: 'out',
    component: () => import('@/views/park/inOut/out/index'),
    meta: { title: '进出记录', icon: 'fa fa-arrow-left ', noCache: true }
  },
  {
    path: 'abnormalOut',
    name: 'abnormalOut',
    component: () => import('@/views/park/inOut/abnormalOut/index'),
    meta: { title: '异常出场', icon: 'fa fa-warning', noCache: true }
  },
  {
    path: 'inOutListen',
    name: 'inOutListen',
    component: () => import('@/views/park/inOut/listen/index'),
    meta: { title: '进出监控', icon: 'fa fa-video-camera ', noCache: true }
  }
]

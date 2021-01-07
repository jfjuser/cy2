/*
*@Author: lyf
*@Date: 2019-02-14 11:27:00
 * @Last Modified by: lyf
 * @Last Modified time: 2019-02-27 15:59:45
*/
// 考勤统计
export const attendCountRouterMap = [
  {
    path: 'dailyCount',
    name: 'dailyCount',
    component: () => import('@/views/attendCount/dailyCount/index'),
    meta: {
      title: '每日统计',
      icon: 'fa fa-pie-chart',
      noCache: true
    }
  },
  {
    path: 'monthlyCount',
    name: 'monthlyCount',
    component: () => import('@/views/attendCount/monthlyCount/index'),
    meta: {
      title: '月度统计',
      icon: 'fa fa-bar-chart',
      noCache: true
    }
  },
  {
    path: 'writeOff',
    name: 'writeOff',
    component: () => import('@/views/attendCount/writeOff/index'),
    meta: {
      title: '核销统计',
      icon: 'fa fa-file-text-o',
      noCache: true
    }
  }
]

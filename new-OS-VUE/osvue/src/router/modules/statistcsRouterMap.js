/*
*@Author: lyf
*@Date: 2018-12-27 15:15:55
 * @Last Modified by: lyf
 * @Last Modified time: 2019-02-23 11:42:23
*/

// 统计模块
export const statistcsRouterMap = [
  {
    path: 'statistAdv',
    name: 'statistAdv',
    component: () => import('@/views/statistics/adv/index'),
    meta: {
      title: '广告统计',
      icon: 'fa fa-area-chart',
      noCache: true
    }
  }
]

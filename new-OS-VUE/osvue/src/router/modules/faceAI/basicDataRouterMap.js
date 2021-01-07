/*
*@Author: lyf
*@Date: 2018-10-10 11:00:00
 * @Last Modified by: lyf
 * @Last Modified time: 2019-06-03 18:21:25
*/
// 基础数据
export const basicDataRouterMap = [
  {
    path: 'inOut',
    name: 'inOut',
    component: () => import('@/views/faceAI/basicData/inOut/index'),
    meta: {
      title: '进出记录',
      icon: 'fa fa-exchange',
      noCache: true
    }
  },
  {
    path: 'realTimeControl',
    name: 'realTimeControl',
    component: () => import('@/views/faceAI/basicData/realTimeControl/index'),
    meta: {
      title: '实时统计',
      icon: 'fa fa-street-view',
      noCache: true
    }
  }
]

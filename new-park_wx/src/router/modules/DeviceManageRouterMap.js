/*
*@Author: lyf
*@Date: 2018-09-21 09:32:49
 * @Last Modified by: lyf
 * @Last Modified time: 2018-12-11 09:03:50
*/
// ----------设备管理--------- \\
export const DeviceManageRouterMap = [
  {
    path: 'channelStatus',
    name: 'channelStatus',
    component: () => import('@/views/park/deviceManage/channelStatus/index'),
    meta: { title: '通道状态', icon: 'fa fa-th-list ', noCache: true }
  },
  // {
  //   path: 'channelLog',
  //   name: 'channelLog',
  //   component: () => import('@/views/park/deviceManage/channelLog/index'),
  //   meta: { title: '通道日志', icon: 'fa fa-file-text ', noCache: true }
  // },
  {
    path: 'offLineAnalysis',
    name: 'offLineAnalysis',
    component: () => import('@/views/park/deviceManage/offLineAnalysis/index'),
    meta: {
      title: '通道日志',
      icon: 'fa fa-file-text ',
      noCache: true
    }
  }
]

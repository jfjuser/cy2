/*
*@Author: lyf
*@Date: 2018-10-16 09:04:18
 * @Last Modified by: lyf
 * @Last Modified time: 2019-02-23 11:33:12
*/
// 远程维护
export const remoteMaintainRouterMap = [
  {
    path: 'operateRecord',
    name: 'operateRecord',
    component: () => import('@/views/faceAI/remoteUpgrade/operateRecord/index'),
    meta: { title: '操作记录', icon: 'fa fa-clock-o ', noCache: true }
  },
  {
    path: 'setParams',
    name: 'setParams',
    component: () => import('@/views/faceAI/remoteUpgrade/setParams/index'),
    meta: { title: '参数设置', icon: 'fa fa-map-signs', noCache: true }
  },
  {
    path: 'sendCommand',
    name: 'sendCommand',
    component: () => import('@/views/faceAI/remoteUpgrade/sendCommand/index'),
    meta: { title: '实时控制', icon: 'fa fa-deaf ', noCache: true }
  },
  {
    path: 'localStatus',
    name: 'localStatus',
    component: () => import('@/views/park/remoteUpgrade/localStatus/index'),
    meta: { title: '通道状态', icon: 'fa fa-road', noCache: true }
  },
  {
    path: 'cameraFile',
    name: 'cameraFile',
    component: () => import('@/views/faceAI/remoteUpgrade/cameraFile/index'),
    meta: { title: '相机文件', icon: 'fa fa-file-movie-o', noCache: true }
  },
  {
    path: 'upgradeFile',
    name: 'upgradeFile',
    component: () => import('@/views/faceAI/remoteUpgrade/upgradeFile/index'),
    meta: { title: '升级文件', icon: 'fa fa-upload', noCache: true }
  }
]

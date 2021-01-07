/*
*@Author: lyf
*@Date: 2018-09-21 08:48:39
 * @Last Modified by: lyf
 * @Last Modified time: 2019-02-23 11:24:14
*/
// 相机管理
export const CameraManageRouterMap = [
  {
    path: 'bindCamera',
    name: 'bindCamera',
    component: () => import('@/views/park/cameraManage/bindCamera/index'),
    meta: { title: '绑定相机', icon: 'fa fa-gg ', noCache: true }
  },
  {
    path: 'parkSetting',
    name: 'parkSetting',
    component: () => import('@/views/park/cameraManage/parkSetting/index'),
    meta: { title: '高级设置', icon: 'fa fa-wrench ', noCache: true }
  },
  {
    path: 'feeRules',
    name: 'feeRules',
    component: () => import('@/views/park/cameraManage/feeRules/index'),
    meta: { title: '收费规则', icon: 'fa fa-rouble ', noCache: true }
  },
  {
    path: 'setting',
    name: 'setting',
    component: () => import('@/views/park/cameraManage/setting/index'),
    meta: { title: '研发远程', icon: 'fa fa-asterisk ', noCache: true }
  },
  {
    path: 'macStatus',
    name: 'macStatus',
    component: () => import('@/views/park/cameraManage/macStatus/index'),
    meta: { title: '相机状态', icon: 'fa fa-wifi ', noCache: true }
  },
  {
    path: 'pool',
    name: 'pool',
    component: () => import('@/views/park/cameraManage/pool/index'),
    meta: { title: '流量监控', icon: 'fa fa-hourglass-end', noCache: true }
  },
  {
    path: 'cameraOffLine',
    name: 'cameraOffLine',
    component: () => import('@/views/park/cameraManage/cameraOffLine/index'),
    meta: { title: '相机离线通知', icon: 'fa fa-low-vision', noCache: true }
  },
  {
    path: 'cameraOffLineStatist',
    name: 'cameraOffLineStatist',
    component: () => import('@/views/park/cameraManage/cameraOffLineStatist/index'),
    meta: { title: '相机离线统计', icon: 'fa fa-file-powerpoint-o', noCache: true }
  }
]

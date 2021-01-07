/*
*@Author: lyf
*@Date: 2018-09-29 10:42:14
 * @Last Modified by: wzs
 * @Last Modified time: 2020-04-06 14:31:15
*/
// 相机维护
export const cameraMaintainRouterMap = [
  {
    path: 'macStatus',
    name: 'macStatus',
    component: () =>
      import('@/views/faceAI/cameraMaintain/macStatus/index'),
    meta: {
      title: '平台相机',
      icon: 'fa fa-wifi',
      noCache: true
    }
  },
  {
    path: 'orderCamera',
    name: 'orderCamera',
    component: () =>
      import('@/views/faceAI/cameraMaintain/orderCamera/index'),
    meta: {
      title: '定制相机',
      icon: 'fa fa-wifi',
      noCache: true
    }
  },
  {
    path: 'bindCamera',
    name: 'bindCamera',
    component: () => import('@/views/faceAI/cameraMaintain/bindCamera/index'),
    meta: { title: '绑定相机', icon: 'fa fa-gg', noCache: true }
  },
  {
    path: 'productTracking',
    name: 'productTracking',
    component: () => import('@/views/faceAI/cameraMaintain/productTracking/index'),
    meta: {
      title: '产品追踪',
      icon: 'fa fa-ravelry',
      noCache: true
    }
  },
  {
    path: 'cameraManage',
    name: 'cameraManage',
    component: () => import('@/views/faceAI/cameraMaintain/cameraManage/index'),
    meta: { title: '相机管理', icon: 'fa fa-camera', noCache: true }
  },
  {
    path: 'offLineAnalysis',
    name: 'offLineAnalysis',
    component: () => import('@/views/park/deviceManage/offLineAnalysis/index'),
    meta: {
      title: '通道日志',
      icon: 'fa fa-file-text ',
      noCache: true
    }
  },
  {
    path: 'upgradeLog',
    name: 'upgradeLog',
    component: () => import('@/views/faceAI/cameraMaintain/upgradeLog/index'),
    meta: {
      title: '升级日志',
      icon: 'fa fa-file-text ',
      noCache: true
    }
  },
  {
    path: 'productionTest',
    name: 'productionTest',
    component: () => import('@/views/faceAI/cameraMaintain/productionTest/index'),
    meta: {
      title: '生产部测试',
      icon: 'fa fa-file-text ',
      noCache: true
    }
  },
  {
    path: 'cameraAIParams',
    name: 'cameraAIParams',
    component: () => import('@/views/faceAI/cameraMaintain/cameraAIParams/index'),
    meta: {
      title: '人脸参数设置',
      icon: 'fa fa-file-text ',
      noCache: true
    }
  },
  {
    path: 'orderList',
    name: 'orderList',
    component: () => import('@/views/faceAI/cameraMaintain/orderList/index'),
    meta: {
      title: '命令列表',
      icon: 'fa fa-file-text ',
      noCache: true
    }
  },
  // 测温相机用户信息
  {
    path: 'cameraConnect',
    name: 'cameraConnect',
    component: () => import('@/views/faceAI/cameraMaintain/cameraConnect/index'),
    meta: { title: '关联相机', icon: 'fa fa-handshake-o', noCache: true }
  },
  {
    path: 'thenHistory',
    name: 'thenHistory',
    component: () => import('@/views/faceAI/cameraMaintain/thenHistory/index'),
    meta: { title: '比对上传记录', icon: 'fa fa-superpowers', noCache: true }
  },
  {
    path: 'temperUser',
    name: 'temperUser',
    component: () => import('@/views/faceAI/cameraMaintain/temperUser/index'),
    meta: { title: '测温用户', icon: 'fa fa-user-circle-o', noCache: true }
  }
]

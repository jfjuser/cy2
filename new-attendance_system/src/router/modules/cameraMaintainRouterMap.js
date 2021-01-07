// 相机维护
export const cameraMaintainRouterMap = [
  // {
  //   path: 'bindCamera',
  //   name: 'bindCamera',
  //   component: () => import('@/views/cameraMaintain/bindCamera/index'),
  //   meta: { title: '绑定相机', icon: 'fa fa-gg', noCache: true }
  // },
  {
    path: 'cameraManage',
    name: 'cameraManage',
    component: () => import('@/views/cameraMaintain/cameraManage/index'),
    meta: { title: '设备管理', icon: 'fa fa-tasks', noCache: true }
  }
]

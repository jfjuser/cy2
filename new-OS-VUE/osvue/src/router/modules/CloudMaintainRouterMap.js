/*
*@Author: lyf
*@Date: 2018-09-21 09:03:04
 * @Last Modified by: lyf
 * @Last Modified time: 2019-01-07 11:05:23
*/

// ---------------平台维护-------------\\
export const CloudMaintainRouterMap = [
  {
    path: 'cloudCategory',
    name: 'cloudCategory',
    component: () => import('@/views/cloudMaintain/cloudCategory/index'),
    meta: { title: '类别维护', icon: 'fa fa-th-large ' },
    children: [
      {
        path: 'level',
        name: 'level',
        component: () => import('@/views/cloudMaintain/cloudCategory/Level/index'),
        hidden: true
      },
      {
        path: 'info',
        name: 'info',
        component: () => import('@/views/cloudMaintain/cloudCategory/Info/index'),
        hidden: true
      }
    ]
  },
  {
    path: 'appUpgrade',
    name: 'appUpgrade',
    component: () => import('@/views/cloudMaintain/appUpgrade/index'),
    meta: { title: '安卓版本控制', icon: 'fa fa-info-circle ', noCache: true }
  },
  // {
  //   path: 'makerDown',
  //   name: 'makerDown',
  //   component: () => import('@/views/cloudMaintain/makerDown/index'),
  //   meta: {
  //     title: '操作文档',
  //     icon: 'fa fa-book',
  //     noCache: true
  //   }
  // },
  {
    path: 'notifyManager',
    name: 'notifyManager',
    component: () => import('@/views/cloudMaintain/notify/index'),
    meta: {
      title: '消息通知管理',
      icon: 'fa fa-book',
      noCache: true
    }
  },
  {
    path: 'userSuggestion',
    name: 'userSuggestion',
    component: () => import('@/views/cloudMaintain/userSuggestion/index'),
    meta: {
      title: '用户反馈',
      icon: 'fa fa-file-text-o',
      noCache: true
    }
  }
]

/*
*@Author: lyf
*@Date: 2018-09-21 09:11:55
 * @Last Modified by: lyf
 * @Last Modified time: 2019-12-12 16:01:49
*/

// -------------- 权限管理 ------------ \\
export const PermissionRouterMap = [
  {
    path: 'roleManage',
    name: 'roleManage',
    component: () => import('@/views/permission/roleManage/index'),
    meta: { title: '角色管理', icon: 'fa fa-user-plus ', noCache: true }
  },
  {
    path: 'userManage',
    // name: 'userManage',
    component: () => import('@/views/permission/userManage/index'),
    meta: { title: '用户管理', icon: 'fa fa-user ', noCache: true },
    children: [
      {
        path: '',
        name: 'userManage', // 放这里目的是消除路由警告
        hidden: true,
        component: () => import('@/views/permission/userManage/list'),
        meta: { title: '用户管理', noCache: true }
      },
      {
        path: 'add',
        hidden: true,
        component: () => import('@/views/permission/userManage/add'),
        meta: { title: '添加', noCache: true }
      },
      {
        path: 'editor',
        hidden: true,
        component: () => import('@/views/permission/userManage/add'),
        meta: { title: '编辑', noCache: true }
      }
    ]
  }
]

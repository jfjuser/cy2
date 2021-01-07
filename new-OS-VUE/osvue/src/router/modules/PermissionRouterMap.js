/*
*@Author: lyf
*@Date: 2018-09-21 09:11:55
 * @Last Modified by: lyf
 * @Last Modified time: 2018-09-21 09:16:03
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
    name: 'userManage',
    component: () => import('@/views/permission/userManage/index'),
    meta: { title: '用户管理', icon: 'fa fa-user ', noCache: true }
  },
  {
    // 新菜单
    path: 'userManage',
    name: 'userManage',
    component: () => import('@/views/permission/userManage/index'),
    meta: { title: '账号管理', icon: 'fa fa-user ', noCache: true }
  }
]

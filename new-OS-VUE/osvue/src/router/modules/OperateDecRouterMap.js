/*
*@Author: lyf
*@Date: 2018-11-27 18:20:55
 * @Last Modified by: lyf
 * @Last Modified time: 2018-12-20 11:25:22
*/
// --------------- 说明书 ---------\\
export const OperateDecRouterMap = [
  {
    path: 'operateDec',
    name: 'operateDec',
    component: () => import('@/views/fileLog/operateDec/index'),
    meta: { title: '说明书', icon: 'fa fa-book', noCache: true }
  },
  {
    path: 'userLog',
    name: 'userLog',
    component: () => import('@/views/fileLog/userLog/index'),
    meta: {
      title: '用户日志',
      icon: 'fa fa-file-text-o',
      noCache: true
    }
  },
  {
    path: 'versionLog',
    name: 'versionLog',
    component: () => import('@/views/fileLog/versionLog/index'),
    meta: {
      title: '版本更新日志',
      icon: 'fa fa-database',
      noCache: true
    }
  }
]

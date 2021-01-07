/*
*@Author: lyf
*@Date: 2018-09-21 09:28:31
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-06-29 09:00:30
*/
// --------- 部门管理 -----------\\
export const DepartmentRouterMap = [
  {
    path: 'directSubordinate',
    name: 'directSubordinate',
    component: () => import('@/views/department/directSubordinate/index'),
    meta: { title: '下级部门', icon: 'fa fa-cubes ', noCache: true }
  },
  {
    path: 'directSubordinate',
    name: 'directSubordinate',
    component: () => import('@/views/department/directSubordinate/index'),
    meta: {
      title: '学校管理',
      icon: 'fa fa-cubes ',
      noCache: true
    }
  },
  // 新增
  {
    path: 'departmentSearch',
    name: 'departmentSearch',
    component: () => import('@/views/department/departmentSearch/index'),
    meta: {
      title: '部门查询',
      icon: 'fa fa-cubes ',
      noCache: true
    }
  }
]

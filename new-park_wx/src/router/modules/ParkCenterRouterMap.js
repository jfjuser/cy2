/*
*@Author: lyf
*@Date: 2018-09-21 09:08:28
 * @Last Modified by: lyf
 * @Last Modified time: 2018-11-24 10:46:51
*/

// ---------------车场数据-------------\\
export const ParkCenterRouterMap = [
  {
    path: 'normalWhite',
    // name: 'normalWhite',
    component: () => import('@/views/park/parkCenter/normalWhite/index'),
    meta: { title: '普通白名单', icon: 'fa fa-mail-forward ', noCache: true },
    children: [
      {
        path: '',
        name: 'normalWhite', // 放这里目的是消除路由警告
        hidden: true,
        component: () => import('@/views/park/parkCenter/normalWhite/list'),
        meta: { title: '普通白名单', noCache: true }
      },
      {
        path: 'add',
        hidden: true,
        component: () => import('@/views/park/parkCenter/normalWhite/add'),
        meta: { title: '添加', noCache: true }
      }
    ]
  },
  {
    path: 'normalCharge',
    name: 'normalCharge',
    component: () => import('@/views/park/parkCenter/normalCharge/index'),
    meta: { title: '普通充值记录', icon: 'fa fa-line-chart ', noCache: true }
  },
  {
    path: 'topWhite',
    // name: 'topWhite',
    component: () => import('@/views/park/parkCenter/topWhite/index'),
    meta: { title: '高级白名单', icon: 'fa fa-star ', noCache: true },
    children: [
      {
        path: '',
        name: 'topWhite', // 放这里目的是消除路由警告
        hidden: true,
        component: () => import('@/views/park/parkCenter/topWhite/list'),
        meta: { title: '高级白名单', noCache: true }
      },
      {
        path: 'add',
        hidden: true,
        component: () => import('@/views/park/parkCenter/topWhite/add'),
        meta: { title: '添加', noCache: true }
      }
    ]
  },
  {
    path: 'topCharge',
    name: 'topCharge',
    component: () => import('@/views/park/parkCenter/topCharge/index'),
    meta: { title: '高级充值记录', icon: 'fa fa-bar-chart ', noCache: true }
  },
  {
    path: 'monthlyCar',
    // name: 'monthlyCar',
    component: () => import('@/views/park/parkCenter/monthlyCar/index'),
    meta: { title: '渣土白名单', icon: 'fa fa-bar-chart ', noCache: true },
    children: [
      {
        path: '',
        name: 'monthlyCar', // 放这里目的是消除路由警告
        hidden: true,
        component: () => import('@/views/park/parkCenter/monthlyCar/list'),
        meta: { title: '渣土白名单', noCache: true }
      },
      {
        path: 'add',
        hidden: true,
        component: () => import('@/views/park/parkCenter/monthlyCar/add'),
        meta: { title: '添加', noCache: true }
      }
    ]
  },
  {
    path: 'monthRule',
    name: 'monthRule',
    component: () => import('@/views/park/parkCenter/monthRule/index'),
    meta: { title: '充值规则', icon: 'fa fa-list-ul ', noCache: true }
  },
  {
    path: 'openRecord',
    name: 'openRecord',
    component: () => import('@/views/park/parkCenter/openRecord/index'),
    meta: { title: '手动开闸记录', icon: 'fa fa-handshake-o ', noCache: true }
  },
  {
    path: 'blackCard',
    // name: 'blackCard',
    component: () => import('@/views/park/parkCenter/blackCard/index'),
    meta: { title: '黑名单管理', icon: 'fa fa-ban', noCache: true },
    children: [
      {
        path: '',
        name: 'blackCard', // 放这里目的是消除路由警告
        hidden: true,
        component: () => import('@/views/park/parkCenter/blackCard/list'),
        meta: { title: '黑名单管理', noCache: true }
      },
      {
        path: 'add',
        hidden: true,
        component: () => import('@/views/park/parkCenter/blackCard/add'),
        meta: { title: '添加', noCache: true }
      },
      {
        path: 'editor',
        hidden: true,
        component: () => import('@/views/park/parkCenter/blackCard/add'),
        meta: { title: '编辑', noCache: true }
      }
    ]
  },
  {
    path: 'specialCar',
    name: 'specialCar',
    component: () => import('@/views/park/parkCenter/specialCar/index'),
    meta: { title: '特殊车管理', icon: 'fa fa-gg-circle ', noCache: true }
  },
  {
    path: 'freeCar',
    name: 'freeCar',
    component: () => import('@/views/park/parkCenter/freeCar/index'),
    meta: { title: '免费车管理', icon: 'fa fa-car', noCache: true }
  },
  {
    path: 'transfer',
    name: 'transfer',
    component: () => import('@/views/park/parkCenter/transfer/index'),
    meta: { title: '交班记录', icon: 'fa fa-superpowers', noCache: true }
  }
]

/*
*@Author: lyf
*@Date: 2018-09-21 09:36:29
 * @Last Modified by: lyf
 * @Last Modified time: 2019-02-23 11:27:43
*/
// 电子优惠券
export const TicketManageRouterMap = [
  {
    path: 'basicRule',
    name: 'basicRule',
    component: () => import('@/views/park/ticketManage/basicRule/index'),
    meta: { title: '车场规则', icon: 'fa fa-magnet ', noCache: true }
  },
  {
    path: 'businessInfo',
    // name: 'businessInfo',
    component: () => import('@/views/park/ticketManage/businessInfo/index'),
    meta: { title: '商家管理', icon: 'fa fa-commenting ', noCache: true },
    children: [
      {
        path: '',
        name: 'businessInfo', // 放这里目的是消除路由警告
        hidden: true,
        component: () => import('@/views/park/ticketManage/businessInfo/list'),
        meta: { title: '商家管理', noCache: true }
      },
      {
        path: 'add',
        hidden: true,
        component: () => import('@/views/park/ticketManage/businessInfo/add'),
        meta: { title: '添加', noCache: true }
      },
      {
        path: 'editor',
        hidden: true,
        component: () => import('@/views/park/ticketManage/businessInfo/add'),
        meta: { title: '编辑', noCache: true }
      },
      {
        path: 'addAdmin',
        hidden: true,
        component: () => import('@/views/park/ticketManage/businessInfo/addAdmin'),
        meta: { title: '商家管理员', noCache: true }
      }
    ]
  },
  {
    path: 'businessChargeRecords',
    name: 'businessChargeRecords',
    component: () => import('@/views/park/ticketManage/businessChargeRecords/index'),
    meta: { title: '商家充值记录', icon: 'fa fa-credit-card ', noCache: true }
  },
  {
    path: 'buinessTicketRecords',
    name: 'buinessTicketRecords',
    component: () => import('@/views/park/ticketManage/buinessTicketRecords/index'),
    meta: { title: '优惠券记录', icon: 'fa fa-pie-chart ', noCache: true }
  },
  {
    path: 'ticketRules',
    // name: 'ticketRules',
    component: () => import('@/views/park/ticketManage/ticketRules/index'),
    meta: { title: '优惠券规则', icon: 'fa fa-pencil-square ', noCache: true },
    children: [
      {
        path: '',
        name: 'ticketRules', // 放这里目的是消除路由警告
        hidden: true,
        component: () => import('@/views/park/ticketManage/ticketRules/list'),
        meta: { title: '优惠券规则', noCache: true }
      },
      {
        path: 'add',
        hidden: true,
        component: () => import('@/views/park/ticketManage/ticketRules/add'),
        meta: { title: '添加', noCache: true }
      },
      {
        path: 'editor',
        hidden: true,
        component: () => import('@/views/park/ticketManage/ticketRules/add'),
        meta: { title: '编辑', noCache: true }
      }
    ]
  },
  {
    path: 'chargeRecords',
    name: 'chargeRecords',
    component: () => import('@/views/park/ticketManage/chargeRecords/index'),
    meta: { title: '充值记录', icon: 'fa fa-credit-card', noCache: true }
  },
  {
    path: 'ticketRecords',
    name: 'ticketRecords',
    component: () => import('@/views/park/ticketManage/ticketRecords/index'),
    meta: { title: '优惠记录', icon: 'fa fa-sticky-note ', noCache: true }
  }
]

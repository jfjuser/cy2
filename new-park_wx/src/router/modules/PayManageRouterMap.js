/*
*@Author: lyf
*@Date: 2018-09-21 09:18:56
 * @Last Modified by: lyf
 * @Last Modified time: 2019-08-03 10:06:32
*/

// ------------------ 支付管理 -------------- \\

export const PayManageRouterMap = [
  {
    path: 'qrcode',
    name: 'qrcode',
    component: () => import('@/views/park/payManage/qrcode/index'),
    meta: { title: '二维码管理', icon: 'fa fa-qrcode', noCache: true }
  },
  {
    path: 'smallProCharge',
    // name: 'smallProCharge',
    component: () => import('@/views/park/payManage/smallProCharge/index'),
    meta: { title: '小程序收费', icon: 'fa fa-wechat', noCache: true },
    children: [
      {
        path: '',
        name: 'smallProCharge', // 放这里目的是消除路由警告
        hidden: true,
        component: () => import('@/views/park/payManage/smallProCharge/list'),
        meta: { title: '小程序收费', noCache: true }
      },
      {
        path: 'add',
        hidden: true,
        component: () => import('@/views/park/payManage/smallProCharge/add'),
        meta: { title: '添加', noCache: true }
      }
    ]
  },
  {
    path: 'bluetoothCode',
    name: 'bluetoothCode',
    component: () => import('@/views/park/payManage/bluetoothCode/index'),
    meta: { title: '蓝牙开闸', icon: 'fa fa-bluetooth-b', noCache: true }
  },
  {
    path: 'CCBPayment',
    name: 'CCBPayment',
    component: () => import('@/views/park/payManage/CCBPayment/index'),
    meta: { title: '建行无感支付', icon: 'fa fa-cc-paypal', noCache: true }
  },
  {
    path: 'RccPayment',
    name: 'RccPayment',
    component: () => import('@/views/park/payManage/RccPayment/index'),
    meta: { title: '农信银支付', icon: 'fa fa-cc-paypal', noCache: true }
  },
  {
    path: 'PnoPayment',
    name: 'PnoPayment',
    component: () => import('@/views/park/payManage/pnopay/index'),
    meta: { title: '聚合无感', icon: 'fa fa-file-text-o', noCache: true }
  },
  {
    path: 'sesamePay',
    name: 'sesamePay',
    component: () => import('@/views/park/payManage/sesamePay/index'),
    meta: {
      title: '芝麻无感支付',
      icon: 'fa fa-cubes',
      noCache: true
    }
  }
]

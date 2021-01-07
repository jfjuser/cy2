// 微信服务商支付模块
export const payModuleRouterMap = [
  {
    path: '/entry',
    name: 'entry',
    component: () => import('@/view/CYWeChatPay/directPay/entry')
    // meta: {
    //   title: '订单详情',
    //   noCache: true
    // }
  },
  {
    path: '/directPay/index.html',
    name: 'index',
    component: () => import('@/view/CYWeChatPay/directPay/index'),
    meta: {
      title: '订单详情',
      noCache: true
    }
  },
  {
    path: '/tip',
    name: 'tip',
    component: () => import('@/view/CYWeChatPay/tip'),
    meta: {
      title: '交易详情',
      noCache: true
    }
  }
]

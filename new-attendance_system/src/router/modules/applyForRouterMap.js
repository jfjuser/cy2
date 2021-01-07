// 申请管理
export const applyForRouterMap = [
  {
    path: 'punchIn',
    name: 'punchIn',
    component: () => import('@/views/applyFor/punchIn/index'),
    meta: {
      title: '补卡申请',
      icon: 'fa fa-file',
      noCache: true
    }
  }
]

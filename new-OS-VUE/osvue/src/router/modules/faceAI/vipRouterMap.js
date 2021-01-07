/*
*@Author: lyf
*@Date: 2018-10-16 09:04:18
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-10-31 09:24:42
*/
// 人脸收费
export const vipRouterMap = [
  {
    path: 'feeEvent',
    name: 'feeEvent',
    component: () => import('@/views/faceAI/vip/feeEvent/index'),
    meta: { title: '收费设置', icon: 'fa fa-ils ', noCache: true }
  },
  {
    path: 'enterpriseUserManagement',
    name: 'enterpriseUserManagement',
    component: () => import('@/views/faceAI/vip/enterpriseUserManagement/index'),
    meta: { title: '企业用户管理', icon: 'fa fa-user-o ', noCache: true }
  },
  {
    path: 'integral',
    name: 'integral',
    component: () => import('@/views/faceAI/vip/integral/index'),
    meta: { title: '积分记录', icon: 'fa fa-file-word-o ', noCache: true }
  },
  {
    path: 'integralRules',
    name: 'integralRules',
    component: () => import('@/views/faceAI/vip/integralRules/index'),
    meta: { title: '积分规则', icon: 'fa fa-rub ', noCache: true }
  },
  {
    // 新菜单
    path: 'bindWx',
    name: 'bindWx',
    component: () => import('@/views/faceAI/vip/bindWx/index'),
    meta: { title: '公众号管理', icon: 'fa fa-krw ', noCache: true }
  },
  {
    path: 'historyPush',
    name: 'historyPush',
    component: () => import('@/views/faceAI/vip/historyPush/index'),
    meta: {
      title: '推送配置',
      icon: 'fa fa-wrench ',
      noCache: true
    }
  },
  {
    path: 'trash',
    name: 'trash',
    component: () => import('@/views/faceAI/vip/trash/index'),
    meta: { title: '回收站', icon: 'fa fa-trash ', noCache: true }
  },
  {
    path: 'monthly',
    name: 'monthly',
    component: () => import('@/views/faceAI/vip/monthly/index'),
    meta: { title: '流量月统计', icon: 'fa fa-pie-chart', noCache: true }
  },
  {
    path: 'vipOrder',
    name: 'vipOrder',
    component: () => import('@/views/faceAI/vip/vipOrder/index'),
    meta: { title: '会员订单', icon: 'fa fa-sticky-note-o', noCache: true }
  },
  {
    path: 'countData',
    name: 'countData',
    component: () => import('@/views/faceAI/vip/countData/index'),
    meta: {
      title: '次数统计',
      icon: 'fa fa-line-chart',
      noCache: true
    }
  },
  {
    // 新菜单
    path: 'countData',
    name: 'countData',
    component: () => import('@/views/faceAI/vip/countData/index'),
    meta: {
      title: '下发次数统计',
      icon: 'fa fa-line-chart',
      noCache: true
    }
  },
  {
    path: 'qrcode',
    name: 'qrcode',
    component: () => import('@/views/faceAI/vip/qrcode/index'),
    meta: {
      title: '访客二维码',
      icon: 'fa fa-qrcode',
      noCache: true
    }
  }
]

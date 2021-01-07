import Vue from 'vue'
import Router from 'vue-router' // 登录授权页面
import userAdminMap from './modules/userAdminMap' // 引入账户管理路由配置模块
import notOriginCompany from './modules/notOriginCompany' // 引入外置接口模块
// 微信服务商支付模块
// import { payModuleRouterMap } from './modules/payModuleRouterMap'
// 优惠券模块
// import { ticketModuleRouterMap } from './modules/ticketModuleRouterMap'
// import HelloWorld from '@/components/HelloWorld'
const Login = () => import('@/view/faceAI/userModel/login')
const openDoorData = () => import('@/view/oneKeyOpenDoor/index')
Vue.use(Router)

export const router = [
  {
    // 配置首页默认进入 登录授权页面
    path: '/',
    name: 'login',
    component: Login
  },
  {
    // 扫码支付统一入口
    path: '/pay',
    name: 'pay',
    component: () => import('@/view/pay/index')
  },
  {
    // 一键开闸
    path: '/oneKeyOpenDoor',
    name: 'oneKeyOpenDoor',
    component: openDoorData,
    meta: {
      title: '一键开闸'
    }
  },
  {
    // 关注公众号页
    path: '/follow',
    name: 'follow',
    component: () => import('@/view/follow/index')
  },
  {
    // 广告点击跳转页
    path: '/adv',
    name: 'adv',
    component: () => import('@/view/adv/index')
  },
  {
    // 广告点击跳转页
    path: '/success',
    name: 'success',
    component: () => import('@/view/ospay/success/index'),
    meta: {
      title: '停车缴费'
    }
  },
  // 微信服务商支付 - 开始
  {
    path: '/CYWeChatPay/directPay/entry.html',
    name: 'entry',
    component: () => import('@/view/CYWeChatPay/directPay/entry')
  },
  {
    path: '/CYWeChatPay/directPay/index',
    name: 'index',
    component: () => import('@/view/CYWeChatPay/directPay/index')
  },
  //
  {
    path: '/CHWeChatPay/directPay/entry.html',
    name: 'entry',
    component: () => import('@/view/CHWeChatPay/directPay/entry')
  },
  {
    path: '/CHWeChatPay/directPay/index',
    name: 'index',
    component: () => import('@/view/CHWeChatPay/directPay/index')
  },

  //
  {
    path: '/CYWeChatPay/noPlate/entry.html',
    name: 'noPlateEntry',
    component: () => import('@/view/CYWeChatPay/noPlate/entry')
  },
  {
    path: '/CYWeChatPay/noPlate/index',
    name: 'noPlateIndex',
    component: () => import('@/view/CYWeChatPay/noPlate/index')
  },
  {
    path: '/CYWeChatPay/noPlate/tip',
    name: 'noPlateTip',
    component: () => import('@/view/CYWeChatPay/noPlate/tip')
  },
  {
    path: '/CYWeChatPay/prepay/entry.html',
    name: 'prepayEntry',
    component: () => import('@/view/CYWeChatPay/prepay/entry')
  },
  {
    path: '/CYWeChatPay/prepay/index',
    name: 'prepayIndex',
    component: () => import('@/view/CYWeChatPay/prepay/index')
  },
  {
    path: '/CYWeChatPay/tip',
    name: 'tip',
    component: () => import('@/view/CYWeChatPay/tip')
  },
  {
    // 只做支付页面, 无绑定其他业务
    path: '/CYWeChatPay/wxPay',
    name: 'wxPay',
    component: () => import('@/view/CYWeChatPay/wxPay')
  },
  // 微信服务商支付 - 结束
  // 建行支付 - 开始
  // {
  //   path: '/ccb/staticpay.html',
  //   name: 'ccbStaticpay',
  //   component: () => import('@/view/CCB/staticpay')
  // },
  // {
  //   path: '/ccb/index',
  //   name: 'ccbIndex',
  //   component: () => import('@/view/CCB/index')
  // },
  // {
  //   path: '/ccb/aggErcode',
  //   name: 'ccbAggErcode',
  //   component: () => import('@/view/CCB/aggErcode')
  // },
  // 建行支付 - 结束
  {
    path: '/t/index',
    name: 'ticketIndex',
    component: () => import('@/view/t/index')
  },
  {
    path: '/t/tip',
    name: 'ticketTip',
    component: () => import('@/view/t/tip')
  },
  {
    // 下载app
    path: '/downLoad/app',
    name: 'downLoadApp',
    component: () => import('@/view/downLoad/app/index')
  },
  // 微信公众号页面 - 开始
  {
    // 建言献策
    path: '/wx/suggest',
    name: 'suggest',
    component: () => import('@/view/wx/suggest/index'),
    meta: {
      title: '建言献策'
    }
  },
  {
    // 月卡续费
    path: '/monthCharge/index.html',
    name: 'monthCharge',
    component: () => import('@/view/monthCharge/index'),
    meta: {
      title: '月卡续费'
    }
  },
  {
    // 停车记录
    path: '/wx/inOut',
    name: 'inOut',
    component: () => import('@/view/wx/inOut/index'),
    meta: {
      title: '停车记录'
    }
  },
  {
    // 绑定车牌
    path: '/wx/bindPlate',
    name: 'bindPlate',
    component: () => import('@/view/wx/bindPlate/index'),
    meta: {
      title: '绑定车牌'
    }
  },
  {
    // 添加车牌
    path: '/wx/addPlate',
    name: 'addPlate',
    component: () => import('@/view/wx/bindPlate/addPlate'),
    meta: {
      title: '添加车牌'
    }
  },
  // 微信公众号页面 - 结束
  // 平台支付页面 - 开始
  {
    // 直付
    path: '/ospay/dp',
    name: 'directPay',
    component: () => import('@/view/ospay/dp/index'),
    meta: {
      title: '停车缴费'
    }
  },
  {
    // 直付
    path: '/ospay/dp',
    name: 'directPay',
    component: () => import('@/view/ospay/dp/index'),
    meta: {
      title: '停车缴费'
    }
  },
  {
    // 无牌车
    path: '/ospay/np',
    name: 'noPlate',
    component: () => import('@/view/ospay/np/index'),
    meta: {
      title: '入场'
    }
  },
  {
    // 预付
    path: '/ospay/pp',
    name: 'preparePay',
    component: () => import('@/view/ospay/pp/index'),
    meta: {
      title: '预付'
    }
  },
  {
    path: '/ospay/np/success',
    name: 'npsuccess',
    component: () => import('@/view/ospay/np/success'),
    meta: {
      title: '入场成功'
    }
  },
  {
    path: '/ospay/ps',
    name: 'paysuccess',
    component: () => import('@/view/ospay/ps/index'),
    meta: {
      title: '支付完成'
    }
  },
  // 平台支付页面 - 结束
  {
    // 人脸识别
    path: '/faceAI/userManage',
    name: 'userManage',
    component: () => import('@/view/faceAI/userManage/index'),
    meta: {
      title: '人脸录入'
    }
  },
  // 人脸 - 微信小程序 - 个人版网页 - 开始
  {
    path: '/faceAI/userLogin',
    name: 'faceUserLogin',
    component: () => import('@/view/faceAI/userModel/login'),
    meta: {
      title: '正在进入'
    }
  },
  {// 首页
    path: '/faceAI/userModel',
    name: 'faceUserModel',
    component: () => import('@/view/faceAI/userModel/home'),
    meta: {
      title: '物联云'
    }
  },
  // accessRecords
  {
    // 记录查询
    path: '/faceAI/search',
    name: 'faceSearch',
    component: () => import('@/view/faceAI/userModel/search/index'),
    meta: {
      title: '记录查询'
    }
  },
  {
    // 记录查询
    path: '/faceAI/inOut',
    name: 'faceSearch',
    component: () => import('@/view/accessRecords/accessRecords'),
    meta: {
      title: '进出记录'
    }
  },
  {
    // 记录查询
    path: '/faceAI/edit',
    name: 'faceEdit',
    component: () => import('@/view/Ask/index'),
    meta: {
      title: '请假申请'
    }
  },
  {
    // 记录查询
    path: '/faceAI/list',
    name: 'facelist',
    component: () => import('@/view/list/list'),
    meta: {
      title: '请假列表'
    }
  },
  {
    // 个人信息
    path: '/faceAI/myInfo',
    name: 'faceMyInfo',
    component: () => import('@/view/faceAI/userModel/myInfo/index'),
    meta: {
      title: '个人中心'
    }
  },
  {
    // 消息中心
    path: '/faceAI/msg',
    name: 'faceMsg',
    component: () => import('@/view/faceAI/userModel/msg/index'),
    meta: {
      title: '消息中心'
    }
  },
  {
    // 人脸绑定
    path: '/faceAI/bind',
    name: 'faceBind',
    component: () => import('@/view/faceAI/userModel/bind/index'),
    meta: {
      title: '人脸绑定'
    }
  },
  {
    // 签到
    path: '/faceAI/sign',
    name: 'faceSign',
    component: () => import('@/view/faceAI/userModel/sign/index'),
    meta: {
      title: '每日签到'
    }
  },
  {
    // 绑定管理
    path: '/faceAI/userModel/bind/manager',
    name: 'faceManager',
    component: () => import('@/view/faceAI/userModel/bind/manager/index'),
    meta: {
      title: '绑定管理'
    }
  },
  {
    // 资料上传
    path: '/faceAI/upload',
    name: 'faceUpload',
    component: () => import('@/view/faceAI/userModel/bind/upload'),
    meta: {
      title: '资料上传'
    }
  },
  {
    // 账户认证
    path: '/faceAI/auth',
    name: 'faceAuth',
    component: () => import('@/view/faceAI/userModel/bind/auth'),
    meta: {
      title: '账户认证'
    }
  },
  {
    // 人脸账户登录
    path: '/faceAI/userModel/bind/zhLogin',
    name: 'faceBind',
    component: () => import('@/view/faceAI/userModel/bind/zhLogin/index'),
    meta: {
      title: '账号登录'
    }
  },
  {
    // 人脸个人版账户录入人脸
    path: '/faceAI/userModel/bind/addUser',
    name: 'faceBind',
    component: () => import('@/view/faceAI/userModel/bind/addUser/index'),
    meta: {
      title: '录入人脸'
    }
  },
  {
    // 说明书
    path: '/faceAI/userModel/bind/instructionBook',
    name: 'faceBook',
    component: () => import('@/view/faceAI/userModel/bind/instructionBook/index'),
    meta: {
      title: '使用说明'
    }
  },
  {
    // 人脸个人版手机绑定
    path: '/faceAI/userModel/bind/captcha/phone',
    name: 'faceBind',
    component: () => import('@/view/faceAI/userModel/bind/captcha/phone'),
    meta: {
      title: '人脸绑定'
    }
  },
  {
    // 人脸个人版账户录入人脸历史记录
    path: '/faceAI/userModel/bind/history',
    name: 'faceBind',
    component: () => import('@/view/faceAI/userModel/bind/history/index'),
    meta: {
      title: '历史添加'
    }
  },
  {
    // 定制功能
    path: '/faceAI/menu',
    name: 'faceMenu',
    component: () => import('@/view/faceAI/userModel/menu/index'),
    meta: {
      title: '定制功能'
    }
  },
  {
    // 信息
    path: '/faceAI/mySimpleInfo',
    name: 'faceMySimpleInfo',
    component: () => import('@/view/faceAI/userModel/myInfo/info/index'),
    meta: {
      title: '个人信息'
    }
  },
  {
    // 积分
    path: '/faceAI/pointRecords',
    name: 'facePointRecords',
    component: () => import('@/view/faceAI/userModel/myInfo/point/index'),
    meta: {
      title: '积分记录'
    }
  },
  {
    // 充值
    path: '/faceAI/recharge',
    name: 'faceRecharge',
    component: () => import('@/view/faceAI/userModel/myInfo/recharge/index'),
    meta: {
      title: '充值'
    }
  },
  {
    // 人脸管理
    path: '/faceAI/faceManage',
    name: 'faceManage',
    component: () => import('@/view/faceAI/userModel/myInfo/face/index'),
    meta: {
      title: '人脸管理'
    }
  },
  // 使用账户管理模块路由
  ...userAdminMap,
  // 引入外置接口模块
  ...notOriginCompany
  // 人脸 - 微信小程序 - 个人版网页 - 结束
]

export default new Router({
  base: '/managers/',
  mode: 'history',
  // 滑动滚动条
  scrollBehavior: () => ({ y: 0 }),
  routes: router
})

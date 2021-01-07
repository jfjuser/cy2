/*
*@Author: lyf
*@Date: 2018-08-10 15:03:48
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-10-06 15:36:10
 * @Last Modified time: 2020-10-22 15:22:51
*/
import Vue from 'vue'
import Router from 'vue-router'
import LoginCloud from '@/views/login/index.vue'
import autoLoginCloud from '@/views/login/auto.vue'
import Page404 from '@/views/errPage/404.vue'
import Page401 from '@/views/errPage/401.vue'
import Advertisement from '@/views/Advertisement/index.vue'
import { CloudMaintainRouterMap } from './modules/CloudMaintainRouterMap'
import { IframeRouterMap } from './modules/IframeRouterMap'
import { ParkCenterRouterMap } from './modules/ParkCenterRouterMap'
import { PermissionRouterMap } from './modules/PermissionRouterMap'
import { InOutRouterMap } from './modules/InOutRouterMap'
import { PayManageRouterMap } from './modules/PayManageRouterMap'
import { RemoteUpgradeRouterMap } from './modules/RemoteUpgradeRouterMap'
import { DepartmentRouterMap } from './modules/DepartmentRouterMap'
import { BoxRouterMap } from './modules/BoxRouterMap'
import { DeviceManageRouterMap } from './modules/DeviceManageRouterMap'
import { FunctionOpenRouterMap } from './modules/FunctionOpenRouterMap'
import { TicketManageRouterMap } from './modules/TicketManageRouterMap'
import { CameraManageRouterMap } from './modules/CameraManageRouterMap'
import { OperateDecRouterMap } from './modules/OperateDecRouterMap'
// import { FileRouterMap } from './modules/FileRouterMap'
// import { LogRouterMap } from './modules/LogRouterMap'
// 人脸
import { cameraMaintainRouterMap } from './modules/faceAI/cameraMaintainRouterMap'
import { faceDistinguishRouterMap } from './modules/faceAI/faceDistinguishRouterMap'
import { basicDataRouterMap } from './modules/faceAI/basicDataRouterMap'
import { siteManageRouterMap } from './modules/faceAI/siteManageRouterMap'
import { remoteMaintainRouterMap } from './modules/faceAI/remoteMaintainRouterMap'
// 收费模块
import { vipRouterMap } from './modules/faceAI/vipRouterMap'
// 广告模块
import { advModuleRouterMap } from './modules/advModuleRouterMap'
// 统计模块
import { statistcsRouterMap } from './modules/statistcsRouterMap'
import { largeScreenDisplayMap } from './modules/faceAI/largeScreenDisplayMap'
import CloudPlatformDataStatisRouterMap from './modules/CloudPlatformDataStatisRouterMap' // 引入云平台数据统计，数据可视化组件路由表
import HomePage from '@/views/homePage/index.vue'
// baseSelect 选项平台
const Base = () => import('@/views/base/Index')
Vue.use(Router)

// 静态路由
export const constantRouterMap = [
  {
    path: '/base',
    name: 'base',
    component: Base,
    hidden: true
  },
  {
    path: '/autoLogin',
    component: autoLoginCloud,
    hidden: true
  },
  {
    path: '/login/:id?',
    component: LoginCloud,
    hidden: true
  },
  {
    path: '/advertisement',
    component: Advertisement,
    hidden: true
  },
  {
    path: '/404',
    component: Page404,
    hidden: true
  },
  {
    path: '/401',
    component: Page401,
    hidden: true
  },
  {
    path: '/agentHome',
    component: () => import('@/views/home/agentHome/index'),
    hidden: true
  },
  {
    path: '',
    component: HomePage,
    redirect: '/home',
    // meta: {
    //   title: '首页',
    //   icon: 'fa fa-area-chart'
    // },
    children: [{
      path: 'home',
      component: () => import('@/views/home/index'),
      name: 'home',
      meta: {
        title: '首页',
        icon: 'fa fa-area-chart',
        roles: ['seePage']
      }
    }]
  }
]

export default new Router({
  // mode: 'history',
  // 滑动滚动条
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
export const asyncRouterMap = [
  {
    path: '/vip',
    component: HomePage,
    hidden: true,
    meta: {
      title: '会员',
      icon: 'fa fa-credit-card '
    },
    children: [
      {
        path: '',
        name: 'vip',
        component: () => import('@/views/home/agentHome/index'),
        // hidden: true,
        meta: {
          title: '会员',
          icon: 'fa fa-credit-card',
          noCache: true
        }
      }
    ]
  },
  {
    path: '/largeScreenDisplay',
    component: HomePage,
    meta: {
      title: '大屏展示',
      icon: 'fa fa-cogs '
    },
    children: largeScreenDisplayMap
  },
  {
    path: '/cloudMaintain',
    component: HomePage,
    meta: {
      title: '平台维护',
      icon: 'fa fa-cogs '
    },
    children: CloudMaintainRouterMap
  },
  {
    path: '/iframe',
    component: HomePage,
    meta: {
      title: '平台监控',
      icon: 'fa fa-bar-chart'
    },
    children: IframeRouterMap
  },
  {
    path: '/cloudDataStatis',
    component: HomePage,
    meta: {
      title: '云平台数据统计',
      icon: 'fa fa-credit-card '
    },
    children: CloudPlatformDataStatisRouterMap
  },
  {
    path: '/department',
    component: HomePage,
    meta: {
      title: '部门管理',
      icon: 'fa fa-sitemap '
    },
    children: DepartmentRouterMap
  },
  {
    path: '/department',
    component: HomePage,
    meta: {
      title: '学校管理',
      icon: 'fa fa-sitemap '
    },
    children: DepartmentRouterMap
  },
  {
    path: '/permission',
    component: HomePage,
    meta: {
      title: '权限管理',
      icon: 'fa fa-lock '
    },
    children: PermissionRouterMap
  },
  {
    path: '/cameraManage',
    component: HomePage,
    meta: {
      title: '相机管理',
      icon: 'fa fa-video-camera'
    },
    children: CameraManageRouterMap
  },
  {
    path: '/inOut',
    component: HomePage,
    meta: {
      title: '进出管理',
      icon: 'fa fa-exchange '
    },
    children: InOutRouterMap
  },
  {
    path: '/parkCenter',
    component: HomePage,
    meta: {
      title: '车场数据',
      icon: 'fa fa-database'
    },
    children: ParkCenterRouterMap
  },
  {
    path: '/payManage',
    component: HomePage,
    meta: {
      title: '电子支付',
      icon: 'fa fa-paypal '
    },
    children: PayManageRouterMap
  },
  {
    path: '/ticketManage',
    component: HomePage,
    meta: {
      title: '电子优惠券',
      icon: 'fa fa-ticket '
    },
    children: TicketManageRouterMap
  },
  {
    path: '/deviceManage',
    component: HomePage,
    meta: {
      title: '设备管理',
      icon: 'fa fa-tasks '
    },
    children: DeviceManageRouterMap
  },
  {
    path: '/remoteUpgrade',
    component: HomePage,
    meta: {
      title: '远程升级',
      icon: 'fa fa-arrow-circle-o-up'
    },
    children: RemoteUpgradeRouterMap
  },
  {
    path: '/box',
    component: HomePage,
    meta: {
      title: '盒子模式',
      icon: 'fa fa-inbox '
    },
    children: BoxRouterMap
  },
  {
    path: '/functionOpen',
    component: HomePage,
    meta: {
      title: '扩展功能',
      icon: 'fa fa-suitcase'
    },
    children: FunctionOpenRouterMap
  },
  // 人脸
  {
    path: '/cameraMaintain',
    component: HomePage,
    meta: {
      title: '相机维护',
      icon: 'fa fa-video-camera'
    },
    children: cameraMaintainRouterMap
  },
  {
    path: '/siteManage',
    component: HomePage,
    meta: {
      title: '工地管理',
      icon: 'fa fa-sheqel'
    },
    children: siteManageRouterMap
  },
  {
    path: '/faceDistinguish',
    component: HomePage,
    meta: {
      title: '人脸识别',
      icon: 'fa fa-user-circle'
    },
    children: faceDistinguishRouterMap
  },
  {
    path: '/basicData',
    component: HomePage,
    meta: {
      title: '基础数据',
      icon: 'fa fa-database'
    },
    children: basicDataRouterMap
    // children: import('./modules/faceAI/basicDataRouterMap')
  },
  {
    // 新菜单
    path: '/basicData',
    component: HomePage,
    meta: {
      title: '进出记录管理',
      icon: 'fa fa-database'
    },
    children: basicDataRouterMap
    // children: import('./modules/faceAI/basicDataRouterMap')
  },
  {
    path: '/attend',
    component: HomePage,
    meta: {
      title: '考勤管理',
      icon: 'fa fa-line-chart'
    },
    children: import('./modules/faceAI/attendRouterMap')
  },
  {
    path: '/attendCount',
    component: HomePage,
    meta: {
      title: '考勤统计',
      icon: 'fa fa-calendar-check-o'
    },
    children: import('./modules/faceAI/attendCountRouterMap')
  },
  {
    path: '/remoteMaintain',
    component: HomePage,
    meta: {
      title: '远程维护',
      icon: 'fa fa-database'
    },
    children: remoteMaintainRouterMap
  },
  {
    path: '/charge',
    component: HomePage,
    meta: {
      title: '高级功能',
      icon: 'fa fa-cubes'
    },
    children: vipRouterMap
  },
  // ------- 人脸 -------- \\
  {
    path: '/fileLog',
    component: HomePage,
    meta: {
      title: '文档&日志',
      icon: 'fa fa-clipboard'
    },
    children: OperateDecRouterMap
  },
  // {
  //   path: '/file',
  //   component: HomePage,
  //   meta: {
  //     title: '文档',
  //     icon: 'fa fa-clipboard'
  //   },
  //   children: FileRouterMap
  // },
  // {
  //   path: '/log',
  //   component: HomePage,
  //   meta: {
  //     title: '日志',
  //     icon: 'fa fa-clipboard'
  //   },
  //   children: LogRouterMap
  // },
  // --------------------- 售后 ----------------- \\
  {
    path: '/afterService',
    component: HomePage,
    meta: {
      title: '售后服务',
      icon: 'fa fa-database'
    },
    children: remoteMaintainRouterMap
  },
  // 广告模块
  {
    path: '/advModule',
    component: HomePage,
    meta: {
      title: '广告模块',
      icon: 'fa fa-spinner'
    },
    children: advModuleRouterMap
  },
  // 统计模块
  {
    path: '/statistcs',
    component: HomePage,
    meta: {
      title: '统计模块',
      icon: 'fa fa-bar-chart'
    },
    children: statistcsRouterMap
  }
]
export const Router404 = [
  {
    path: '/basicSetting',
    component: HomePage,
    hidden: true,
    meta: {
      title: '设置',
      icon: 'fa fa-cog '
    },
    children: [
      {
        path: 'userInfo',
        name: 'userInfo',
        component: () => import('@/views/basicSetting/userInfo/index'),
        meta: { title: '个人信息', icon: 'fa fa-vcard ', noCache: true }
      },
      {
        path: 'modifyPassword',
        name: 'modifyPassword',
        component: () => import('@/views/basicSetting/modifyPassword/index'),
        meta: { title: '修改密码', icon: 'fa fa-key ', noCache: true }
      },
      {
        path: 'message',
        name: 'message',
        component: () => import('@/views/basicSetting/message/index'),
        meta: {
          title: '我的建议',
          icon: 'fa fa-envelope-o',
          noCache: true
        }
      },
      {
        path: 'messageCenter',
        name: 'messageCenter',
        component: () => import('@/views/basicSetting/messageCenter/index'),
        meta: { title: '信息中心', icon: 'fa fa-bell ', noCache: true }
      }
      // {
      //   path: 'test',
      //   name: 'test',
      //   component: () => import('@/views/test/index'),
      //   meta: {
      //     title: '测试',
      //     icon: 'fa fa-book',
      //     noCache: true
      //   }
      // },
      // {
      //   path: 'driver',
      //   name: 'driver',
      //   component: () => import('@/views/basicSetting/driver/index'),
      //   meta: {
      //     title: '引导页',
      //     icon: 'fa fa-key ',
      //     noCache: true
      //   }
      // }
    ]
  },
  // 必须放到底部
  { path: '*', redirect: '/404', hidden: true }
]
const originalPush = Router.prototype.push
Router.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}

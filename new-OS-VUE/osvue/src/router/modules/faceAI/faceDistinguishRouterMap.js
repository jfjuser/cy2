/*
*@Author: lyf
*@Date: 2018-09-30 08:39:06
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-11-03 16:21:56
*/
// 人脸识别
export const faceDistinguishRouterMap = [
  {
    path: 'setting',
    name: 'setting',
    component: () => import('@/views/faceAI/faceDistinguish/setting/index'),
    meta: { title: '审核设置', icon: 'fa fa-gg', noCache: true }
  },
  {
    path: 'noState',
    name: 'noState',
    component: () => import('@/views/faceAI/faceDistinguish/noState/index'),
    meta: { title: '未同步', icon: 'fa fa-wrench', noCache: true }
  },
  {
    path: 'userData',
    name: 'userData',
    component: () => import('@/views/faceAI/faceDistinguish/userData/index'),
    meta: {
      title: '账户管理',
      icon: 'fa fa-id-card-o',
      noCache: true
    }
  },
  {
    path: 'policyManagement',
    name: 'policyManagement',
    component: () => import('@/views/faceAI/faceDistinguish/policyManagement/index'),
    meta: {
      title: '策略管理',
      icon: 'fa fa-bandcamp',
      noCache: true
    }
  },
  {
    path: 'parameterSetting',
    name: 'uparameterSetting',
    component: () => import('@/views/faceAI/faceDistinguish/parameterSetting/index'),
    meta: {
      title: '参数设置',
      icon: 'fa fa-wrench',
      noCache: true
    }
  },
  {
    path: 'userData',
    // name: 'userData',
    component: () => import('@/views/faceAI/faceDistinguish/userData/index'),
    meta: {
      title: '家长管理',
      icon: 'fa fa-id-card-o',
      noCache: true
    }
  },
  {
    path: 'userManage',
    name: 'userManage',
    component: () => import('@/views/faceAI/faceDistinguish/userManage/index'),
    meta: {
      title: '用户管理',
      icon: 'fa fa-users',
      noCache: true
    }
  },
  {
    path: 'photoManage',
    name: 'photoManage',
    component: () => import('@/views/faceAI/faceDistinguish/photoManage/index'),
    meta: {
      title: '照片管理',
      icon: 'fa fa-users',
      noCache: true
    }
  },
  {
    path: 'userManage',
    name: 'userManage',
    component: () => import('@/views/faceAI/faceDistinguish/userManage/index'),
    meta: {
      title: '学生管理',
      icon: 'fa fa-users',
      noCache: true
    }
  },
  {
    path: 'blacklist',
    name: 'blacklist',
    component: () => import('@/views/faceAI/faceDistinguish/blacklist/index'),
    meta: {
      title: '黑名单',
      icon: 'fa fa-user-circle-o',
      noCache: true
    }
  },
  {
    path: 'areaManage',
    name: 'areaManage',
    component: () => import('@/views/faceAI/faceDistinguish/areaManage/index'),
    meta: {
      title: '小区模块管理',
      icon: 'fa fa-building-o',
      noCache: true
    }
  },
  {
    // 新菜单
    path: 'areaManage',
    name: 'areaManage',
    component: () => import('@/views/faceAI/faceDistinguish/areaManage/index'),
    meta: {
      title: '小区/学校管理',
      icon: 'fa fa-building-o',
      noCache: true
    }
  },
  {
    path: 'userImport',
    name: 'userImport',
    component: () => import('@/views/faceAI/faceDistinguish/userImport/index'),
    meta: {
      title: '人员批量导入',
      icon: 'fa fa-download',
      noCache: true
    }
  },
  {
    path: 'qrcode',
    name: 'qrcode',
    component: () => import('@/views/faceAI/faceDistinguish/qrcode/index'),
    meta: {
      title: '业主服务码',
      icon: 'fa fa-user-circle-o',
      noCache: true
    }
  }
]


// 土地管理
export const siteManageRouterMap = [{
  path: 'docking',
  name: 'docking',
  component: () => import('@/views/faceAI/siteManage/docking/index'),
  meta: {
    title: '对接配置',
    icon: 'fa fa-sign-in',
    noCache: true
  }
},
{
  path: 'typeOfWork',
  name: 'typeOfWork',
  component: () => import('@/views/faceAI/siteManage/typeOfWork/index'),
  meta: {
    title: '工种管理',
    icon: 'fa fa-road',
    noCache: true
  }
},
{
  path: 'platformLED',
  name: 'platformLED',
  component: () => import('@/views/faceAI/siteManage/platformLED/index'),
  meta: {
    title: '平台LED',
    icon: 'fa fa-window-restore',
    noCache: true
  }
},
{
  path: 'bindLED',
  name: 'bindLED',
  component: () => import('@/views/faceAI/siteManage/bindLED/index'),
  meta: {
    title: 'LED屏绑定',
    icon: 'fa fa-tty',
    noCache: true
  }
},
{
  path: 'manageLED',
  name: 'manageLED',
  component: () => import('@/views/faceAI/siteManage/manageLED/index'),
  meta: {
    title: 'LED屏管理',
    icon: 'fa fa-cog',
    noCache: true
  }
},
{
  path: 'channelManage',
  name: 'channelManage',
  component: () => import('@/views/faceAI/siteManage/channelManage/index'),
  meta: {
    title: '通道管理',
    icon: 'fa fa-road',
    noCache: true
  }
},
{
  path: 'generateCard',
  name: 'generateCard',
  component: () => import('@/views/faceAI/siteManage/generateCard/index'),
  meta: {
    title: '生成卡号',
    icon: 'fa fa-check-square-o',
    noCache: true
  }
}
]

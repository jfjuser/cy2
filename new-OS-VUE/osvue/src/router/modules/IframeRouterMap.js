/*
*@Author: lyf
*@Date: 2018-10-17 11:54:57
 * @Last Modified by: lyf
 * @Last Modified time: 2018-10-18 17:18:09
*/

// --------------- 第三方监控 ---------------\\
export const IframeRouterMap = [
  {
    path: 'logMonitor',
    name: 'logMonitor',
    component: () => import('@/views/iframe/index'),
    meta: {
      title: '日志监控',
      icon: 'fa fa-file-movie-o',
      noCache: true,
      url: 'http://beta.cytingchechang.com:8190'
      // url: 'http://www.cytingchechang.com:8190'
    }
  },
  {
    path: 'interface',
    name: 'interface',
    component: () =>
      import('@/views/iframe/index'),
    meta: {
      title: '接口文档',
      icon: 'fa fa-book',
      noCache: true,
      url: 'http://beta.cytingchechang.com:8188/swagger-ui.html'
      // url: 'http://www.cytingchechang.com:8188/swagger-ui.html'
    }
  },
  {
    path: 'serviceMonitor',
    name: 'serviceMonitor',
    component: () =>
      import('@/views/iframe/index'),
    meta: {
      title: '服务监控',
      icon: 'fa fa-line-chart',
      noCache: true,
      url: 'http://beta.cytingchechang.com:8189'
      // url: 'http://www.cytingchechang.com:8189'
    }
  },
  {
    path: 'dataBaseMonitor',
    name: 'dataBaseMonitor',
    component: () =>
      import('@/views/iframe/index'),
    meta: {
      title: '数据库监控',
      icon: 'fa fa-reddit-square',
      noCache: true,
      url: 'http://beta.cytingchechang.com:8089/haproxy'
      // url: 'http://www.cytingchechang.com:8089/haproxy'
    }
  },
  {
    path: 'agentMonitor',
    name: 'agentMonitor',
    component: () =>
      import('@/views/iframe/index'),
    meta: {
      title: '代理监控',
      icon: 'fa fa-pie-chart',
      noCache: true,
      url: 'http://beta.cytingchechang.com:8088/haproxy'
      // url: 'http://www.cytingchechang.com:8088/haproxy'
    }
  }
]

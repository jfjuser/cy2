// --------------- 日志 ---------\\
export const LogRouterMap = [
  {
    path: 'userLog',
    name: 'userLog',
    component: () => import('@/views/fileLog/userLog/index'),
    meta: {
      title: '用户日志',
      icon: 'fa fa-file-text-o',
      noCache: true
    }
  },
  {
    path: 'versionLog',
    name: 'versionLog',
    component: () => import('@/views/fileLog/versionLog/index'),
    meta: {
      title: '版本更新日志',
      icon: 'fa fa-database',
      noCache: true
    }
  }
]

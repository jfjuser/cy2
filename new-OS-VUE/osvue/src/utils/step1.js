const steps = [
  {
    element: '.breadcrumb-container',
    popover: {
      title: '回到首页',
      description: '点击这里回到首页',
      position: 'bottom',
      path: '/cloudMaintain/cloudCategory/level'
    }
  },
  {
    element: '.app-container>.el-row>.el-col-6',
    popover: {
      title: '级别类型',
      description: '所有的分类级别都在这里了',
      position: 'right',
      path: '/cloudMaintain/cloudCategory/level'
    }
  },
  {
    element: '.app-container>.el-row>.el-col-6 .el-card__body .normalClass:nth-child(1)',
    popover: {
      title: '级别分类',
      description: '点击该级别可选择该级别默认权限,默认角色',
      position: 'right',
      path: '/cloudMaintain/cloudCategory/level'
    }
  },
  {
    element: '.filter-container .add',
    popover: {
      title: '添加',
      description: '点击左侧级别分类就可以添加这个分类下的级别了,添加后可在下级部门中添加下级部门<a style="color:blue" href="#/department/directSubordinate">点击前往</a>',
      position: 'bottom',
      path: '/cloudMaintain/cloudCategory/level'
    }
  },
  {
    element: '.el-table__fixed-right',
    popover: {
      title: '操作',
      description: '在这里可以做一些数据操作,添加页面和功能权限',
      position: 'left',
      path: '/cloudMaintain/cloudCategory/level'
    }
  },
  {
    element: '.el-input.el-input--mini.el-input--suffix',
    popover: {
      title: '分页',
      description: '在这里可以选择每页的数据条数,但每页最多只能设置50条哦',
      position: 'top',
      path: '/cloudMaintain/cloudCategory/level'
    }
  },
  {
    element: '.breadcrumb-container',
    popover: {
      title: '回到首页',
      description: '点击这里回到首页',
      position: 'bottom',
      path: '/cloudMaintain/appUpgrade'
    }
  },
  {
    element: '.filter-container>.searchs',
    popover: {
      title: '搜索',
      description: '您可以根据类型或反馈来源搜索',
      position: 'right',
      path: '/cloudMaintain/appUpgrade'
    }
  },
  {
    element: '.filter-container .uploads',
    popover: {
      title: '上传文件',
      description: '通过这里可以上传安卓文件',
      position: 'bottom',
      path: '/cloudMaintain/appUpgrade'
    }
  },
  {
    element: '.el-table .el-table__fixed-right .dpwnload',
    popover: {
      title: '下载',
      description: '在这里可以下载安卓文件',
      position: 'left',
      path: '/cloudMaintain/appUpgrade'
    }
  },
  {
    element: '.el-input.el-input--mini.el-input--suffix',
    popover: {
      title: '分页',
      description: '在这里可以选择每页的数据条数,但每页最多只能设置50条哦',
      position: 'top',
      path: '/cloudMaintain/appUpgrade'
    }
  },
  {
    element: '.breadcrumb-container',
    popover: {
      title: '回到首页',
      description: '点击这里回到首页',
      position: 'bottom',
      path: '/cloudMaintain/notifyManager'
    }
  },
  {
    element: '.filter-container .add',
    popover: {
      title: '添加',
      description: '在这里添加通知的信息',
      position: 'bottom',
      path: '/cloudMaintain/notifyManager'
    }
  },
  {
    element: '.el-input.el-input--mini.el-input--suffix',
    popover: {
      title: '分页',
      description: '在这里可以选择每页的数据条数,但每页最多只能设置50条哦',
      position: 'top',
      path: '/cloudMaintain/notifyManager'
    }
  },
  {
    element: '.breadcrumb-container',
    popover: {
      title: '回到首页',
      description: '点击这里回到首页',
      position: 'bottom',
      path: '/cloudMaintain/userSuggestion'
    }
  },
  {
    element: '.filter-container .searchs',
    popover: {
      title: '搜索',
      description: '通过选择反馈来源或反馈类型等进行数据的查询',
      position: 'bottom',
      path: '/cloudMaintain/userSuggestion'
    }
  },
  {
    element: '.el-table .el-table__fixed-right .lookimg',
    popover: {
      title: '查看图片',
      description: '如果有查看图片按钮您就可以查看哦,没有是不能查看的哦',
      position: 'left',
      path: '/cloudMaintain/userSuggestion'
    }
  },
  {
    element: '.el-input.el-input--mini.el-input--suffix',
    popover: {
      title: '分页',
      description: '在这里可以选择每页的数据条数,但每页最多只能设置50条哦',
      position: 'top',
      path: '/cloudMaintain/userSuggestion'
    }
  },
  {
    element: '.breadcrumb-container',
    popover: {
      title: '回到首页',
      description: '点击这里回到首页',
      position: 'bottom',
      path: '/department/directSubordinate'
    }
  },
  {
    element: '.filter-container .searchs',
    popover: {
      title: '搜索',
      description: '通过选择地址或名称等进行数据的查询',
      position: 'bottom',
      path: '/department/directSubordinate'
    }
  },
  {
    element: '.filter-container .add',
    popover: {
      title: '添加',
      description: '代理级别可添加代理级别和运营级别的部门,运营级别只可添加运营级别的部门',
      position: 'bottom',
      path: '/department/directSubordinate'
    }
  },
  {
    element: '.filter-container .vipset',
    popover: {
      title: '批量会员设置',
      description: '所有选中部门添加会员',
      position: 'bottom',
      path: '/department/directSubordinate'
    }
  },
  {
    element: '.filter-container .vipvip',
    popover: {
      title: '会员优先级下发',
      description: '设置会员优先级,优先级别越高越优先',
      position: 'bottom',
      path: '/department/directSubordinate'
    }
  },
  {
    element: '.el-table .el-table__fixed-right',
    popover: {
      title: '操作',
      description: '在这里您可以做一些数据操作',
      position: 'left',
      path: '/department/directSubordinate'
    }
  },
  {
    element: '.el-input.el-input--mini.el-input--suffix',
    popover: {
      title: '分页',
      description: '在这里可以选择每页的数据条数,但每页最多只能设置50条哦',
      position: 'top',
      path: '/department/directSubordinate'
    }
  },
  {
    element: '.breadcrumb-container',
    popover: {
      title: '回到首页',
      description: '点击这里回到首页',
      position: 'bottom',
      path: '/permission/roleManage'
    }
  },
  {
    element: '.filter-container .searchs',
    popover: {
      title: '搜索',
      description: '通过角色名进行数据的查询',
      position: 'bottom',
      path: '/permission/roleManage'
    }
  },
  {
    element: '.filter-container .add',
    popover: {
      title: '添加',
      description: '添加各种角色给予不同权限',
      position: 'bottom',
      path: '/permission/roleManage'
    }
  },
  {
    element: '.el-table .el-table__fixed-right',
    popover: {
      title: '操作',
      description: '在这里您可以做一些数据操作(包括编辑分配权限查看权限等)',
      position: 'left',
      path: '/permission/roleManage'
    }
  },
  {
    element: '.el-input.el-input--mini.el-input--suffix',
    popover: {
      title: '分页',
      description: '在这里可以选择每页的数据条数,但每页最多只能设置50条哦',
      position: 'top',
      path: '/permission/roleManage'
    }
  },
  {
    element: '.breadcrumb-container',
    popover: {
      title: '回到首页',
      description: '点击这里回到首页',
      position: 'bottom',
      path: '/permission/userManage'
    }
  },
  {
    element: '.filter-container .searchs',
    popover: {
      title: '搜索',
      description: '通过账号 姓名 性别等条件进行数据的查询',
      position: 'bottom',
      path: '/permission/userManage'
    }
  },
  {
    element: '.filter-container .add',
    popover: {
      title: '添加',
      description: '添加账号可以通过账号登录',
      position: 'bottom',
      path: '/permission/userManage'
    }
  },
  {
    element: '.el-table .el-table__fixed-right',
    popover: {
      title: '操作',
      description: '在这里您可以做一些数据操作包括编辑 修改密码 分配角色(分配不同角色,拥有不同权限) 分配超管(超管即超级管理员,拥有当前部门所有的权限)等',
      position: 'left',
      path: '/permission/userManage'
    }
  },
  {
    element: '.el-input.el-input--mini.el-input--suffix',
    popover: {
      title: '分页',
      description: '在这里可以选择每页的数据条数,但每页最多只能设置50条哦',
      position: 'top',
      path: '/permission/userManage'
    }
  }
]
export default steps

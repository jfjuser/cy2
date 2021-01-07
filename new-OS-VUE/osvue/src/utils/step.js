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
      title: '级别',
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
    element: '.filter-container .add',
    popover: {
      title: '添加',
      description: '在这里添加通知的信息',
      position: 'bottom',
      path: '/cloudMaintain/notifyManager'
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
    element: '.filter-container .el-button.filter-item.el-button--primary.search',
    popover: {
      title: '搜索',
      description: '通过部门名称,相机版本,MAC,绑定状态,状态,相机类型等条件查询',
      position: 'bottom',
      path: '/cameraMaintain/macStatus'
    }
  },
  {
    element: '.filter-container .el-button.filter-item.el-button--primary.update',
    popover: {
      title: '升级相机',
      description: '通过选择的文件名称(升级包)进行升级',
      position: 'bottom',
      path: '/cameraMaintain/macStatus'
    }
  },
  {
    element: '.filter-container .el-button.filter-item.el-button--primary.controll',
    popover: {
      title: '实时控制',
      description: '选择指令进行实时控制',
      position: 'left',
      path: '/cameraMaintain/macStatus'
    }
  },
  {
    element: '.filter-container .el-button.filter-item.el-button--primary.set',
    popover: {
      title: '参数设置',
      description: '文件参数设置',
      position: 'bottom',
      path: '/cameraMaintain/macStatus'
    }
  },
  {
    element: '.filter-container .el-button.filter-item.el-button--primary.getfile',
    popover: {
      title: '获取文件',
      description: '相机文件获取',
      position: 'bottom',
      path: '/cameraMaintain/macStatus'
    }
  },
  {
    element: '.filter-container .el-button.filter-item.el-button--primary.search',
    popover: {
      title: '搜索',
      description: '通过部门名称,相机版本,MAC,绑定状态,状态,相机类型等条件查询',
      position: 'bottom',
      path: '/cameraMaintain/orderCamera'
    }
  },
  {
    element: '.filter-container .el-button.filter-item.el-button--primary.update',
    popover: {
      title: '升级相机',
      description: '通过选择的文件名称(升级包)进行升级',
      position: 'bottom',
      path: '/cameraMaintain/orderCamera'
    }
  },
  {
    element: '.filter-container .el-button.filter-item.el-button--primary.set',
    popover: {
      title: '参数设置',
      description: '文件参数设置',
      position: 'bottom',
      path: '/cameraMaintain/orderCamera'
    }
  },
  {
    element: '.app-container .line-bar',
    popover: {
      title: '出货趋势',
      description: '根据上方选择展示当前出货台数的图表显示',
      position: 'right',
      path: '/cameraMaintain/productTracking'
    }
  },
  {
    element: '.app-container .Pie',
    popover: {
      title: '出货合计',
      description: '根据上方选择展示当前出货合计所占比例的图表显示',
      position: 'left',
      path: '/cameraMaintain/productTracking'
    }
  },
  {
    element: '.app-container .Pie',
    popover: {
      title: '历史合计',
      description: '历史记录可以看到之前类型和数量',
      position: 'top',
      path: '/cameraMaintain/productTracking'
    }
  },
  {
    element: '.app-container .search',
    popover: {
      title: '搜索',
      description: '根据MAC地址,厂家MAC,日期选择等条件查询',
      position: 'top',
      path: '/cameraMaintain/productTracking'
    }
  },
  {
    element: '.app-container .add',
    popover: {
      title: '添加',
      description: '通过Mac地址,厂家Mac,类型等添加数据',
      position: 'top',
      path: '/cameraMaintain/productTracking'
    }
  },
  {
    element: '.app-container .look',
    popover: {
      title: '查看开闸记录',
      description: '点击即可查看所有通道或相机开闸记录',
      position: 'bottom',
      path: '/cameraMaintain/cameraManage'
    }
  },
  {
    element: '.app-container .el-table__fixed-right',
    popover: {
      title: '操作',
      description: '在这里你可以做一些相机操作,编辑(修改通道出入口状态),解绑(解绑相机,需二次确认并连续回车回取消操作),重启设备等操作',
      position: 'left',
      path: '/cameraMaintain/cameraManage'
    }
  },
  {
    element: '.app-container .search',
    popover: {
      title: '搜索',
      description: '根据开始结束时间,异常原因等条件进行搜索',
      position: 'left',
      path: '/cameraMaintain/offLineAnalysis'
    }
  },
  {
    element: '.el-pagination__sizes',
    popover: {
      title: '分页',
      description: '在这里可以选择每页的数据条数,但每页最多只能设置50条哦',
      position: 'top',
      path: '/cameraMaintain/offLineAnalysis'
    }
  },
  {
    element: '.app-container .search',
    popover: {
      title: '搜索',
      description: '根据Mac,绑定状态,相机类型,状态,开始结束时间等条件搜索',
      position: 'bottom',
      path: '/cameraMaintain/productionTest'
    }
  },
  {
    element: '.app-container .bind',
    popover: {
      title: '绑定相机',
      description: '先选中所有想要绑定的相机然后点击即可绑定所选相机',
      position: 'bottom',
      path: '/cameraMaintain/productionTest'
    }
  },
  {
    element: '.app-container .unbind',
    popover: {
      title: '解绑相机',
      description: '选中所有想要解绑的相机点击即可解绑选中相机',
      position: 'bottom',
      path: '/cameraMaintain/productionTest'
    }
  },
  {
    element: '.app-container .el-table__fixed-right',
    popover: {
      title: '操作',
      description: '在这里你可以做些操作,如获取图片(点击即可捕获相机拍摄图片)等操作',
      position: 'left',
      path: '/cameraMaintain/productionTest'
    }
  },
  {
    element: '.app-container .add',
    popover: {
      title: '添加',
      description: '添加相机控制命令',
      position: 'bottom',
      path: '/cameraMaintain/orderList'
    }
  },
  {
    element: '.app-container .el-table__fixed-right',
    popover: {
      title: '操作',
      description: '修改(修改相机命令或备注)',
      position: 'bottom',
      path: '/cameraMaintain/orderList'
    }
  },
  {
    element: '.app-container .search',
    popover: {
      title: '搜索',
      description: '通过姓名和日期等条件搜索',
      position: 'bottom',
      path: '/cameraMaintain/thenHistory'
    }
  },
  {
    element: '.app-container .el-table__fixed-right',
    popover: {
      title: '操作',
      description: '查看图片(查看记录图片)',
      position: 'left',
      path: '/cameraMaintain/thenHistory'
    }
  },
  {
    element: '.app-container .search',
    popover: {
      title: '搜索',
      description: '通过姓名等条件搜索',
      position: 'bottom',
      path: '/cameraMaintain/temperUser'
    }
  },
  {
    element: '.app-container .el-table__fixed-right',
    popover: {
      title: '操作',
      description: '编辑(编辑用户信息)',
      position: 'bottom',
      path: '/cameraMaintain/temperUser'
    }
  }
  // ,
  // {
  //   element: '.app-container .unbind',
  //   popover: {
  //     title: '解绑',
  //     description: '解绑相机设置参数会恢复默认设置,重新下发也会需要较长时间,需要二次确认,连续回车会被取消哦',
  //     position: 'bottom',
  //     path: '/cameraMaintain/productTracking'
  //   }
  // }
]
export default steps

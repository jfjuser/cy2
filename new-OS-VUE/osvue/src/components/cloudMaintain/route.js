let arr = {
  '/cloudMaintain/cloudCategory/level': 1010,
  '/cloudMaintain/appUpgrade': 1,
  '/cloudMaintain/notifyManager': 2,
  '/cloudMaintain/userSuggestion': 3,
  '/department/directSubordinate': 4,
  '/permission/roleManage': 5,
  '/permission/userManage': 7,
  '/home': 6
}
const steps = [
  {
    element: '.breadcrumb-container',
    popover: {
      title: '回到首页',
      description: '点击这里回到首页',
      position: 'bottom'
    }
  },
  {
    element: '.app-container>.el-row>.el-col-6',
    popover: {
      title: '级别分类',
      description: '所有的分类级别都在这里了',
      position: 'right'
    }
  },
  {
    element: '.filter-container .add',
    popover: {
      title: '添加',
      description: '点击左侧级别分类就可以添加这个分类下的级别了',
      position: 'bottom'
    }
  },
  {
    element: '.el-table .el-table__fixed-right .person',
    popover: {
      title: '研发权限',
      description: '在这里可以添加页面和功能权限',
      position: 'left'
    }
  },
  {
    element: '.el-input.el-input--mini.el-input--suffix',
    popover: {
      title: '分页',
      description: '在这里可以选择每页的数据条数,但每页最多只能设置50条哦',
      position: 'top'
    }
  }
]
const steps1 = [
  {
    element: '.breadcrumb-container',
    popover: {
      title: '回到首页',
      description: '点击这里回到首页',
      position: 'bottom'
    }
  },
  {
    element: '.filter-container>.el-select',
    popover: {
      title: '类型',
      description: '所有的类型都在这里,您可以根据类型搜索',
      position: 'right'
    }
  },
  {
    element: '.filter-container .uploads',
    popover: {
      title: '上传文件',
      description: '通过这里可以上传安卓文件',
      position: 'bottom'
    }
  },
  {
    element: '.el-table .el-table__fixed-right .dpwnload',
    popover: {
      title: '下载',
      description: '在这里可以下载安卓文件',
      position: 'left'
    }
  },
  {
    element: '.el-input.el-input--mini.el-input--suffix',
    popover: {
      title: '分页',
      description: '在这里可以选择每页的数据条数,但每页最多只能设置50条哦',
      position: 'top'
    }
  }
]
const steps2 = [
  {
    element: '.breadcrumb-container',
    popover: {
      title: '回到首页',
      description: '点击这里回到首页',
      position: 'bottom'
    }
  },
  {
    element: '.filter-container .add',
    popover: {
      title: '添加',
      description: '在这里添加通知的信息',
      position: 'bottom'
    }
  },
  {
    element: '.el-input.el-input--mini.el-input--suffix',
    popover: {
      title: '分页',
      description: '在这里可以选择每页的数据条数,但每页最多只能设置50条哦',
      position: 'top'
    }
  }
]
const steps3 = [
  {
    element: '.breadcrumb-container',
    popover: {
      title: '回到首页',
      description: '点击这里回到首页',
      position: 'bottom'
    }
  },
  {
    element: '.filter-container .searchs',
    popover: {
      title: '搜索',
      description: '通过选择反馈来源或反馈类型等进行数据的查询',
      position: 'bottom'
    }
  },
  {
    element: '.el-table .el-table__fixed-right .lookimg',
    popover: {
      title: '查看图片',
      description: '如果有查看图片按钮您就可以查看哦,没有是不能查看的哦',
      position: 'left'
    }
  },
  {
    element: '.el-input.el-input--mini.el-input--suffix',
    popover: {
      title: '分页',
      description: '在这里可以选择每页的数据条数,但每页最多只能设置50条哦',
      position: 'top'
    }
  }
]
const steps4 = [
  {
    element: '.breadcrumb-container',
    popover: {
      title: '回到首页',
      description: '点击这里回到首页',
      position: 'bottom'
    }
  },
  {
    element: '.filter-container .searchs',
    popover: {
      title: '搜索',
      description: '通过选择地址或名称等进行数据的查询',
      position: 'bottom'
    }
  },
  {
    element: '.filter-container .vipset',
    popover: {
      title: '批量会员设置',
      description: '所有选中部门添加会员',
      position: 'bottom'
    }
  },
  {
    element: '.filter-container .vipvip',
    popover: {
      title: '会员优先级下发',
      description: '设置会员优先级,优先级别越高越优先',
      position: 'bottom'
    }
  },
  {
    element: '.el-table .el-table__fixed-right',
    popover: {
      title: '操作',
      description: '在这里您可以做一些数据操作',
      position: 'left'
    }
  },
  {
    element: '.el-input.el-input--mini.el-input--suffix',
    popover: {
      title: '分页',
      description: '在这里可以选择每页的数据条数,但每页最多只能设置50条哦',
      position: 'top'
    }
  }
]
const steps5 = [
  {
    element: '.breadcrumb-container',
    popover: {
      title: '回到首页',
      description: '点击这里回到首页',
      position: 'bottom'
    }
  },
  {
    element: '.filter-container .searchs',
    popover: {
      title: '搜索',
      description: '通过角色名进行数据的查询',
      position: 'bottom'
    }
  },
  {
    element: '.filter-container .add',
    popover: {
      title: '添加',
      description: '添加各种角色给予不同权限',
      position: 'bottom'
    }
  },
  {
    element: '.el-table .el-table__fixed-right',
    popover: {
      title: '操作',
      description: '在这里您可以做一些数据操作(包括编辑分配权限查看权限等)',
      position: 'left'
    }
  },
  {
    element: '.el-input.el-input--mini.el-input--suffix',
    popover: {
      title: '分页',
      description: '在这里可以选择每页的数据条数,但每页最多只能设置50条哦',
      position: 'top'
    }
  }
]
const steps6 = [
  {
    element: '.el-tabs--top',
    popover: {
      title: '顶部导航菜单',
      description: '原来的一级菜单在这里显示啦',
      position: 'bottom'
    }
  },
  {
    element: '.el-scrollbar',
    popover: {
      title: '侧边导航菜单',
      description: '这里变成为显示对应的二级菜单',
      position: 'right'
    }
  },
  {
    element: '.breadcrumb-container',
    popover: {
      title: '回到首页',
      description: '点击这里回到首页',
      position: 'bottom'
    }
  },
  {
    element: '.avatar-container',
    popover: {
      title: '【设置】搬家了',
      description: '原来的设置在这里哦',
      position: 'left'
    }
  },
  {
    element: '.toggle-version',
    popover: {
      title: '可以快速回到原来版本',
      description: '',
      position: 'left'
    }
  },
  {
    element: '#question',
    popover: {
      title: '点击这里可以重新演示',
      description: '',
      position: 'left'
    }
  }
]
const steps7 = [
  {
    element: '.breadcrumb-container',
    popover: {
      title: '回到首页',
      description: '点击这里回到首页',
      position: 'bottom'
    }
  },
  {
    element: '.filter-container .searchs',
    popover: {
      title: '搜索',
      description: '通过账号 姓名 性别等条件进行数据的查询',
      position: 'bottom'
    }
  },
  {
    element: '.filter-container .add',
    popover: {
      title: '添加',
      description: '添加账号可以通过账号登录',
      position: 'bottom'
    }
  },
  {
    element: '.el-table .el-table__fixed-right',
    popover: {
      title: '操作',
      description: '在这里您可以做一些数据操作包括编辑 修改密码 分配角色(分配不同角色,拥有不同权限) 分配超管(超管即超级管理员,拥有当前部门所有的权限)等',
      position: 'left'
    }
  },
  {
    element: '.el-input.el-input--mini.el-input--suffix',
    popover: {
      title: '分页',
      description: '在这里可以选择每页的数据条数,但每页最多只能设置50条哦',
      position: 'top'
    }
  }
]
const checkSteps = function (params) {
  return arr[params]
}
export {
  checkSteps,
  steps,
  steps1,
  steps2,
  steps3,
  steps4,
  steps5,
  steps6,
  steps7,
  arr
}

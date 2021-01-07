/* 新版本菜单的新手引导 */
const steps = [
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

export default steps

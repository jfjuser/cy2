/* 新版本菜单的新手引导 */
const steps = [
  {
    element: '.menubox',
    popover: {
      title: '导航菜单',
      description: '',
      position: 'bottom-center'
    }
  },
  {
    element: '.department-name',
    popover: {
      title: '当前公司/团队名称',
      description: '',
      position: 'left'
    }
  },
  {
    element: '.screenfull',
    popover: {
      title: '全屏',
      description: '可以让当前网站全屏显示',
      position: 'left'
    }
  },
  {
    element: '.avatar-container',
    popover: {
      title: '设置',
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

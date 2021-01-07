// 设置适配电脑或者手机判断是哪一种,将所获取到的信息保存到cookie里面
import Cookies from 'js-cookie'

const app = {
  state: {
    // 侧边显示或者隐藏
    sidebar: {
      // 获取状态
      opened: !+Cookies.get('sidebarStatus'),
      withoutAnimation: false
    },
    // 设备绑定
    device: 'desktop',
    // 动态二级菜单
    childRoute: JSON.parse(window.sessionStorage.getItem('childRoute')) || []
  },
  mutations: {
    TOGGLE_SIDEBAR: state => {
      if (state.sidebar.opened) {
        Cookies.set('sidebarStatus', 1)
      } else {
        Cookies.set('sidebarStatus', 0)
      }
      state.sidebar.opened = !state.sidebar.opened
      state.sidebar.withoutAnimation = false
    },
    CLOSE_SIDEBAR: (state, withoutAnimation) => {
      Cookies.set('sidebarStatus', 1)
      state.sidebar.opened = false
      state.sidebar.withoutAnimation = withoutAnimation
    },
    TOGGLE_DEVICE: (state, device) => {
      state.device = device
    },
    SET_ChildRoute: (state, value) => {
      state.childRoute = value
      window.sessionStorage.setItem('childRoute', JSON.stringify(value))
    }
  },
  actions: {
    ToggleSideBar ({ commit }) {
      commit('TOGGLE_SIDEBAR')
    },
    CloseSideBar ({ commit }, { withoutAnimation }) {
      commit('CLOSE_SIDEBAR', withoutAnimation)
    },
    ToggleDevice ({ commit }, device) {
      commit('TOGGLE_DEVICE', device)
    },
    setChildRoute ({ commit }, value) {
      commit('SET_ChildRoute', value)
    }
  }
}

export default app

// 设置适配电脑或者手机判断是哪一种,将所获取到的信息保存到cookie里面
import Cookies from 'js-cookie'
import storeWebLocal from '@/utils/storeWebLocal'
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
    childRoute: JSON.parse(window.sessionStorage.getItem('childRoute')) || [],
    /** ********  人脸识别平台版本 ( 0: 车场, 1: 人脸 ) **********/
    PLATFORM_TYPE: storeWebLocal.getLocalStorage('PLATFORM_TYPE'),
    BASE_TOKEN: storeWebLocal.getSessionStorage('BASE_TOKEN')
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
    },
    /* 人脸平台版本  */
    PLATFORM_TYPE: ({ PLATFORM_TYPE }, v) => {
      PLATFORM_TYPE = v
      storeWebLocal.setLocalStorage('PLATFORM_TYPE', v)
    },
    /* BASE_TOEN 存储 */
    BASE_TOKEN: ({BASE_TOKEN}, token) => {
      BASE_TOKEN = token
      storeWebLocal.setSessionStorage('BASE_TOKEN', token)
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

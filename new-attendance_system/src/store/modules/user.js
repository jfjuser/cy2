import { getToken, setToken, removeToken, setUserId } from '@/utils/cookie'
import Storage from '@/utils/storage'

const user = {
  state: {
    token: getToken(),
    userName: Storage.get('userName'),
    phone: Storage.get('phone'),
    departmentId: Storage.get('departmentId'),
    departmentName: Storage.get('departmentName'),
    userId: Storage.get('userId'),
    departmentTypeId: Storage.get('departmentTypeId')
  },
  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    Set_UserId: (state, value) => {
      state.userId = value
      Storage.set('userId', value)
      setUserId(value)
    },
    Set_Phone: (state, value) => {
      state.phone = value
      Storage.set('phone', value)
    },
    Set_UserName: (state, value) => {
      state.userName = value
      Storage.set('userName', value)
    },
    Set_TeamId: (state, value) => {
      state.departmentId = value
      Storage.set('departmentId', value)
    },
    Set_TeamName: (state, value) => {
      state.departmentName = value
      Storage.set('departmentName', value)
    },
    Set_DepartmentTypeId: (state, value) => {
      state.departmentTypeId = value
      Storage.set('departmentTypeId', value)
    },
    LogOut: (state, value) => {
      state.departmentId = ''
      state.departmentName = ''
      state.userId = ''
      state.phone = ''
      state.userName = ''
      state.departmentTypeId = ''
      Storage.delete('departmentId')
      Storage.delete('departmentName')
      Storage.delete('userId')
      Storage.delete('phone')
      Storage.delete('userName')
      Storage.delete('departmentTypeId')
      Storage.deleteAllExpires()
    }
  },
  actions: {
    // 设置登录后的参数
    setLoginInfo ({ commit }, data) {
      return new Promise((resolve, reject) => {
        commit('SET_TOKEN', data.token)
        setToken(data.token)
        commit('Set_UserId', data.id)
        commit('Set_UserName', data.userName)
        commit('Set_TeamId', data.departmentId)
        commit('Set_TeamName', data.departmentName)
        commit('Set_Phone', data.phone)
        commit('Set_DepartmentTypeId', data.departmentTypeId)
        resolve() // 挂载
      })
    },
    // 前端退出登录
    WebLogOut ({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        commit('LogOut')
        resolve()
      })
    },
    // 设置个人信息
    setUserInfo ({ commit }, data) {
      commit('Set_Phone', data.phone)
      commit('Set_UserName', data.userName)
      commit('Set_TeamName', data.departmentName)
    },
    setTeamName ({ commit }, value) {
      commit('Set_TeamName', value)
    },
    setUserName ({ commit }, value) {
      commit('Set_UserName', value)
    },
    setPhone ({ commit }, value) {
      commit('Set_Phone', value)
    }
  }
}
export default user

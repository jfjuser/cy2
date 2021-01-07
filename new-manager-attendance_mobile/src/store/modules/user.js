import { getToken, setToken, removeToken } from '@/utils/cookie'
import { Storage, Session } from '@/utils/storage'
import {
  getLocalStorage,
  setLocalStorage,
  removeLocalStorage
} from '@/utils/localStore'

const user = {
  state: {
    token: getToken(),
    register: {
      phone: Storage.get('registerCache') ? Storage.get('registerCache').phone : null,
      pw: Storage.get('registerCache') ? Storage.get('registerCache').pw : null
    },
    equipmentInfoR: {
      mac: Storage.get('equipmentInfoR') ? Storage.get('equipmentInfoR').mac : null,
      localName: Storage.get('equipmentInfoR') ? Storage.get('equipmentInfoR').localName : null,
      type: Storage.get('equipmentInfoR') ? Storage.get('equipmentInfoR').type : null
    },
    userName: Storage.get('userName'),
    date: Storage.get('date'),
    change: Storage.get('change'),
    phone: Storage.get('phone'),
    departmentId: Storage.get('departmentId'),
    departmentName: Storage.get('departmentName'),
    userId: Storage.get('userId'),
    departmentTypeId: Storage.get('departmentTypeId'),
    registerStep: Session.get('registerSteps') || null, // 小门禁注册进程
    userAuthInfo: getLocalStorage('userAuthInfo') || {}, // 用户公司信息
    isUserLogOutType: getLocalStorage('isUserLogOutType') || 1 // 用户使用退出了登录 （ 0->未退出， 1->一退出 ），因为登录功能介入了微信登录，微信登录（后台未做出处理）所以每次都会直接成功， 现前台做出拦截处理
  },
  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_Register: (state, valueObj) => {
      state.register.phone = valueObj.phone
      state.register.pw = valueObj.pw
      Storage.set('registerCache', {
        phone: valueObj.phone,
        pw: valueObj.pw
      }, { exp: 120 * 60 })
    },
    Clear_Register: (state) => {
      Storage.delete('registerCache')
    },
    SET_Equipment_R: (state, valueObj) => {
      state.equipmentInfoR.mac = valueObj.mac
      state.equipmentInfoR.localName = valueObj.localName
      state.equipmentInfoR.type = valueObj.type
      Storage.set('equipmentInfoR', {
        mac: valueObj.mac,
        localName: valueObj.localName,
        type: valueObj.type
      }, { exp: 120 * 60 })
    },
    Clear_Equipment_R: (state) => {
      state.equipmentInfoR.mac = ''
      state.equipmentInfoR.localName = ''
      state.equipmentInfoR.type = ''
      Storage.delete('equipmentInfoR')
    },
    Set_UserId: (state, value) => {
      state.userId = value
      Storage.set('userId', value)
    },
    Set_Phone: (state, value) => {
      state.phone = value
      Storage.set('phone', value)
    },
    setDate: (state, value) => {
      state.date = value
      Storage.set('date', value)
    },
    setChange: (state, value) => {
      state.change = value
      Storage.set('change', value)
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
      Storage.delete('code')
      Storage.delete('homeShowHelp')
      Storage.deleteAllExpires()
    },
    // 设置小门禁注册进程
    SET_REGISTER_STEP: (state, value) => {
      state.registerStep = value
    },
    // 存储用户账户信息：
    SET_USER_AUTH_INFO (state, info) {
      // console.log('开始存储', state, info)
      state.userAuthInfo = info
    },
    // 存储用户是否是退出登录状态信息：
    SET_ISUSER_LOGOUT_TYPE (state, type) {
      // console.log('commit', type)
      state.isUserLogOutType = type
    }
  },
  actions: {
    // 保存注册手机号用于下一步
    setRegister ({ commit }, value) {
      commit('SET_Register', value)
    },
    // 保存注册时设备信息用于下一步
    setEquipmentR ({ commit }, value) {
      commit('SET_Equipment_R', value)
    },
    // 清除临时信息
    claerRegisterTemporary ({ commit }) {
      commit('Clear_Register')
      commit('Clear_Equipment_R')
    },
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
        setLocalStorage('isUserLogOutType', 0) // 记录用户已经登录状态
        commit('SET_ISUSER_LOGOUT_TYPE', 0)
        resolve() // 挂载
      })
    },
    // 前端退出登录
    WebLogOut ({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken('')
        commit('LogOut')
        setLocalStorage('isUserLogOutType', 1) // 记录用户已经退出登录
        removeLocalStorage('userAuthInfo')// 清除本地用户公司信息
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
    },
    // 设置小门禁注册进程
    SetRegisterStep (context, value) {
      return new Promise((resolve, reject) => {
        Session.set('registerSteps', value)
        context.commit('SET_REGISTER_STEP', value)
        resolve()
      })
    },
    // 删除小门禁注册进程
    RemoveRegisterStep (context, value) {
      return new Promise((resolve, reject) => {
        Session.remove('registerSteps')
        context.commit('SET_REGISTER_STEP', value)
        resolve()
      })
    },
    // 存储用户账户信息： 仅用于测试
    SaveUserAuthInfo (context, info) {
      return new Promise((resolve, reject) => {
        setLocalStorage('userAuthInfo', info)
        context.commit('SET_USER_AUTH_INFO', info)
        resolve()
      })
    }
  }
}
export default user

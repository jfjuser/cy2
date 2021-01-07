/** ********  【 用户信息存储仓库 】  removeSession**********/
import { getSession, setSession } from '@/utils/session' // 引入本地存储模块

// stata 状态存储仓库
const state = {
  wxInfo: getSession('wxInfo') || null,
  userId: getSession('userId') || null,
  userInfo: getSession('userInfo') || null,
  active: getSession('active') || null,
  loginState: getSession('loginState') || null,
  wxOrigin: getSession('wxOrigin') || null,
  userStatus: getSession('userStatus') || null,
  userAttendance: getSession('userAttendance') || null,
  departmentId: getSession('departmentId') || null,
  isShow: getSession('isShow') || false
}
// state计算属性
const getters = {
  wxInfo: state => state.wxInfo, // 用户微信信息
  userId: state => state.userId, // 用户id
  userInfo: state => state.userInfo, // 用户信息
  active: state => state.active, // 用户状态
  loginState: state => state.loginState, // 登录状态识别
  wxOrigin: state => state.wxOrigin, // 占存获取微信信息地址源
  userStatus: state => state.userStatus, // 记录用户状态
  userAttendance: state => state.userAttendance, // 获取考勤组信息
  departmentId: state => state.departmentId,
  isShow: state => state.isShow
}
// state提交属性
const mutations = {
  // 设置首页审批提示框是否显示
  SET_IS_SHOW (state, isShow) {
    state.isShow = isShow
  },
  // 提交部门Id
  SET_DEPARTMENTID (state, departmentId) {
    state.departmentId = departmentId
  },
  // 提交微信地址源
  SET_WX_ORIGIN (state, wxUrl) {
    state.wxOrigin = wxUrl
  },
  // 提交微信信息
  SET_WX_INFO (state, wxInfo) {
    state.wxInfo = wxInfo
  },
  // 提交用户Id
  SET_USERID (state, userId) {
    state.userId = userId
  },
  // 提交用户信息
  SET_USER_INFO (state, info) {
    state.userInfo = info
  },
  // 提交进程状态
  SET_ACTIVE (state, active) {
    state.active = active
  },
  // 提交登录状态
  SET_LOGIN_STATE (state, status) {
    state.loginState = status
  },
  // 提交记录用户状态
  SET_USER_STATUS (state, status) {
    state.userStatus = status
  },
  // 提交记录用户考勤组信息
  SET_USER_ATTENDANCE (state, attendance) {
    state.userAttendance = attendance
  }
}
// 数据异步行为操作
const actions = {
  saveIsShow (context, isShow) {
    return new Promise((resolve, reject) => {
      setSession('isShow', isShow)
      context.commit('SET_IS_SHOW', isShow)
      resolve()
    })
  },
  // 存储微信url信息
  SaveDepartmentId (context, departmentId) {
    return new Promise((resolve, reject) => {
      setSession('departmentId', departmentId)
      context.commit('SET_DEPARTMENTID', departmentId)
      resolve()
    })
  },
  SaveWxOrigin (context, wxUrl) {
    return new Promise((resolve, reject) => {
      setSession('wxOrigin', wxUrl) // 存储本地wx地址信息
      context.commit('SET_WX_ORIGIN', wxUrl) // 提交
      resolve()
    })
  },
  // 存储微信信息
  SaveWxInfo (context, wxInfo) {
    // console.log('准备存储wx', wxInfo)
    return new Promise((resolve, reject) => {
      setSession('wxInfo', wxInfo) // 存储本地wx信息
      context.commit('SET_WX_INFO', wxInfo) // 提交
      resolve()
    })
  },
  // 存储用户信息
  SaveUserInfo (context, userInfo) {
    return new Promise((resolve, reject) => {
      if (userInfo) {
        setSession('userInfo', userInfo)
        context.commit('SET_USER_INFO', userInfo)
        resolve()
      } else {
        throw new Error('SaveUserInfo not userInfo of undefined!')
      }
    })
  },
  // 存储用户Id
  SaveUserId (context, userId) {
    return new Promise((resolve, reject) => {
      setSession('userId', userId)
      context.commit('SET_USERID', userId)
      resolve()
    })
  },
  // 存储进程状态
  // 存储
  SaveActive (context, active) {
    return new Promise((resolve, reject) => {
      setSession('active', active)
      context.commit('SET_ACTIVE', active)
      resolve()
    })
  },
  // 存储登录状态
  // 存储
  SaveLoginState (context, status) {
    return new Promise((resolve, reject) => {
      setSession('loginState', status)
      context.commit('SET_LOGIN_STATE', status)
      resolve()
    })
  },
  // 存储记录用户状态
  SaveUerStatus (context, status) {
    return new Promise((resolve, reject) => {
      setSession('userStatus', status)
      context.commit('SET_USER_STATUS', status)
      resolve()
    })
  },
  // 存储用户考勤组信息
  SaveUserAttendance (context, attendance) {
    return new Promise((resolve, reject) => {
      setSession('userAttendance', attendance)
      context.commit('SET_USER_ATTENDANCE', attendance)
      resolve()
    })
  },
  // 退出公司清除数据
  LogGout (context) {
    return new Promise((resolve, reject) => {
      // 切换公司重置默认值
      let defaultInfo = {
        userName: '',
        companyName: undefined,
        phone: undefined,
        photo: '',
        addr: '',
        dutyCompanyId: undefined,
        depName: '',
        type: '0',
        beginTime: undefined,
        endTime: undefined,
        remarks: undefined
      }
      setSession('loginState', 0)
      setSession('active', 0)
      setSession('userId', null)
      setSession('userInfo', defaultInfo)
      context.commit('SET_LOGIN_STATE', 0) // 退出登录状态识别码
      context.commit('SET_ACTIVE', 0)
      context.commit('SET_USERID', null)
      context.commit('SET_USER_INFO', defaultInfo)
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}

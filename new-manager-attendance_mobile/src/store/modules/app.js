/** ********  【 处理app存储 】  **********/
import {Session} from '../../utils/storage' // 引入Session本地存储模块
/** ********  【 state 】  **********/

const state = {
  backRouterData: Session.get('backRouterData') || [],
  navTitle: Session.get('navTitle') || '',
  reqAddAttendUser: Session.get('reqAddAttendUser') || [],
  reqUserOutCompany: Session.get('reqUserOutCompany') || [],
  isHintMsg: Session.get('isHintMsg') || false,
  listExitCompany: Session.get('listExitCompany') || []
}
/** ********  【 getters 】  **********/
const getters = {
  backRouterData: state => state.backRouterData,
  navTitle: state => state.navTitle,
  reqAddAttendUser: state => state.reqAddAttendUser,
  reqUserOutCompany: state => state.reqUserOutCompany,
  isHintMsg: state => state.isHintMsg,
  listExitCompany: state => state.listExitCompany
}
/** ********  【 mutations 】  **********/
const mutations = {
  SET_ROUTER_DATA (state, data) {
    state.backRouterData = data
  },
  SET_NAV_TITLE (state, title) {
    state.navTitle = title
  },
  SET_REQ_ADD_ATTEND_USER (state, data) {
    state.reqAddAttendUser = data
  },
  SET_REQ_USEROUT_COMPANY (state, data) {
    state.reqUserOutCompany = data
  },
  SET_ISHINT_MSG (state, data) {
    state.isHintMsg = data
  },
  SET_LIST_EXIT_COMPANY (state, data) {
    state.listExitCompany = state
  }
}
/** ********  【 actions 】  **********/
const actions = {
  SaveRouterData (context, data) {
    return new Promise((resolve, reject) => {
      Session.set('backRouterData', data)
      context.commit('SET_ROUTER_DATA', data)
      resolve()
    })
  },
  SaveTitle (context, title) {
    return new Promise((resolve, reject) => {
      Session.set('navTitle', title)
      context.commit('SET_NAV_TITLE', title)
      resolve()
    })
  },
  SaveReqAddAttendUser (context, data) {
    return new Promise((resolve, reject) => {
      Session.set('reqAddAttendUser', data)
      context.commit('SET_REQ_ADD_ATTEND_USER', data)
      resolve()
    })
  },
  // 存储申请退出公司列表
  SaveListExitCompany (context, data) {
    return new Promise((resolve, reject) => {
      Session.set('listExitCompany', data)
      context.commit('SET_LIST_EXIT_COMPANY')
      resolve()
    })
  },
  SaveReqUserOutCompany (context, data) {
    return new Promise((resolve, reject) => {
      Session.set('reqUserOutCompany', data)
      context.commit('SET_REQ_USEROUT_COMPANY', data)
      resolve()
    })
  },
  SaveIsHintMsg (context, flag) {
    return new Promise((resolve, reject) => {
      Session.set('isHintMsg', flag)
      context.commit('SET_ISHINT_MSG', flag)
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

import {Storage} from '@/utils/storage'

const wx = {
  state: {
    code: Storage.get('code') ? Storage.get('code') : null,
    appId: Storage.get('appId') ? Storage.get('appId') : null,
    openId: Storage.get('openId') ? Storage.get('openId') : null
  },
  mutations: {
    SET_CODE: (state, code) => {
      state.code = code
      Storage.set('code', code)
    },
    SET_APPID: (state, appId) => {
      state.appId = appId
      Storage.set('appId', appId)
    },
    SET_OPENID: (state, openId) => {
      state.openId = openId
      Storage.set('openId', openId)
    }
  },
  actions: {
    setCode ({ commit }, value) {
      commit('SET_CODE', value)
    },
    setAppid ({ commit }, value) {
      commit('SET_APPID', value)
    },
    setOpenId ({ commit }, value) {
      commit('SET_OPENID', value)
    }
  }
}
export default wx

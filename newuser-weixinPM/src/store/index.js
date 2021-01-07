import Vue from 'vue'
import Vuex from 'vuex'
import { setCookieId, getCookieId, getActive, setCookieObj, getCookieObj } from '@/utils/cookie.js'
import user from './modules/user'
Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    user
  },
  state: {
    userId: getCookieId(),
    userObj: getCookieObj(),
    active: getActive()
  },
  getters: {},
  mutations: {
    SETID: (state, n) => {
      state.userId = n
    },
    SETALL: (state, obj) => {
      state.userObj = JSON.parse(obj)
    }
  },
  actions: {
    setId ({ commit }, id) {
      return new Promise(resolve => {
        commit('SETID', id)
        setCookieId(id)
        resolve()
      })
    },
    setAll ({ commit }, obj) {
      return new Promise(resolve => {
        commit('SETALL', obj)
        setCookieObj(obj)
        resolve()
      })
    }
  }
})

export default store

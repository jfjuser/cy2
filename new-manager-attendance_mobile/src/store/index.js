import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import user from './modules/user'
import wx from './modules/wx'
import userFaceAdmin from './modules/userFaceAdmin'
import app from './modules/app'
Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    user,
    wx,
    app,
    userFaceAdmin
  },
  getters,
  state: {
    source: {
      token: null,
      cancel: null
    },
    url: undefined
  },
  mutations: {
    SET_URL: (state, value) => {
      state.url = value
    }
  }
})

export default store

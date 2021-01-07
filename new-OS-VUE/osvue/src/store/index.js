/*
 * @Author: your name
 * @Date: 2020-05-10 00:00:24
 * @LastEditTime: 2020-05-19 08:41:58
 * @LastEditors: sueRimn
 * @Description: In User Settings Edit
 * @FilePath: \OS_VUE\os-vue\src\store\index.js
 */
import Vue from 'vue'
import 'babel-polyfill'
import Vuex from 'vuex'
import getters from './getters'
import user from './modules/user'
import app from './modules/app'
import permission from './modules/permission'

Vue.use(Vuex)

// 平台类型数据对象
let platformSelect = {}
/** ********  【 固定IP配置项 】  **********/
let platformSelectBase = {
  testPlatform: 'http://47.106.35.188', // 测试服
  facePlatform: { url: 'http://120.25.152.27', title: '人脸云平台', type: 1 },
  cartPlatform: {url: 'http://112.74.50.105', title: '车场云平台', type: 0} //
}

if (process.env.NODE_ENV === 'development') { // 开发环境
  console.log('开发环境')
  platformSelect = {
    testPlatform: 'http://127.0.0.1:9527/2', // 测试服
    facePlatform: {url: 'http://127.0.0.1:9527', title: '人脸云平台', type: 1},
    cartPlatform: {url: 'http://127.0.0.1:9527/1', title: '车场云平台', type: 0}
  }
} else { // 生产环境
  console.log('生产环境')
  platformSelect = {
    testPlatform: 'https://beta.cytingchechang.com', // 测试服
    facePlatform: { url: 'http://cyai.cytingchechang.com', title: '人脸云平台', type: 1 },
    cartPlatform: {url: 'https://www.cytingchechang.com', title: '车场云平台', type: 0}
  }
  // 新的服务器IP
  // platformSelect2 = {
  //   testPlatform: 'http://47.106.35.188', // 测试服
  //   facePlatform: { url: 'http://120.25.152.27', title: '人脸云平台', type: 1 },
  //   cartPlatform: {url: 'http://112.74.50.105', title: '车场云平台', type: 0} //
  // }
  // 新的服务器域名
  // platformSelect = {
  //   testPlatform: 'http://47.106.35.188', // 测试服
  //   facePlatform: { url: 'http://cy.40mi.com', title: '人脸云平台', type: 1 },
  //   cartPlatform: {url: 'http://cy2.40mi.com', title: '车场云平台', type: 0} //
  // }
}

const store = new Vuex.Store({
  modules: {
    app,
    user,
    permission
  },
  getters,
  state: {
    source: {
      token: null,
      cancel: null
    },
    platformSelect,
    platformSelectBase
  }
})

export default store

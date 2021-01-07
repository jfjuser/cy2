/*
*@Author: lyf
*@Date: 2018-11-06 14:00:37
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-06-23 10:52:41
*/
import { httpPost } from '@/utils/restful.js'
import { login } from '@/api/url.js'
import { getToken, setToken, removeToken, removeTokenTime, getTokenTime, setTokenTime, setSysName, getSysName, getUserId, setUserId, getDepartmentId, setDepartmentId, setLoginType, setLoginDepId } from '@/utils/cookie'
import storeWebLocal from '@/utils/storeWebLocal'

const user = {
  state: {
    token: getToken(),
    name: '',
    departmentId: getDepartmentId(),
    sysName: getSysName(),
    userId: getUserId(),
    time: getTokenTime(),
    /*
      使用版本号
      0 原始旧版
      1 新菜单版本
    */
    version: window.localStorage.getItem('version') ? Number(window.localStorage.getItem('version')) : 1
  },
  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_DEPARTMENTID: (state, departmentId) => {
      state.departmentId = departmentId
    },
    SET_SYSNAME: (state, sysName) => {
      state.sysName = sysName
    },
    SET_USERID: (state, id) => {
      state.userId = id
    },
    SET_TIME: (state, time) => {
      state.time = time
    },
    USE_Version: (state, value) => {
      state.version = value.ver
      window.localStorage.setItem('version', value.ver)
      window.localStorage.setItem('versionType', value.type)
    }
  },
  actions: {
    // 登录操作
    LoginByUserName ({ commit }, data) {
      return new Promise((resolve, reject) => {
        httpPost(login, data)
          .then(response => {
            // console.log('后台返回账户类型:', response)
            // 后台返回账户类型
            // let departmentType = response.data.departmentType.toString()
            // 如果是主动切换新旧版本,则用主动切换的版本
            if (!window.localStorage.getItem('versionType') || window.localStorage.getItem('versionType') === 'login') {
              if (response.data.creatTime) {
                let date1 = new Date(response.data.creatTime)
                let date2 = new Date(Date.parse('2019-12-01')) // 新旧版本时间界限
                // 根据时间判断,老用户用旧版本,新用户用新版本
                if (date1 < date2) {
                  commit('USE_Version', {ver: 0, type: 'login'})
                } else {
                  commit('USE_Version', {ver: 1, type: 'login'})
                }
              } else {
                commit('USE_Version', {ver: 1, type: 'login'})
              }
            }
            commit('SET_TOKEN', response.data.token)
            commit('SET_NAME', response.data.userName)
            commit('SET_DEPARTMENTID', response.data.departmentId)
            commit('SET_SYSNAME', response.data.sysName)
            commit('SET_USERID', response.data.id)
            commit('SET_TIME', response.data.time)
            setToken(response.data.token)
            setTokenTime(response.data.time)
            if (response.data.sysName !== null) {
              setSysName(response.data.sysName)
            } else {
              setSysName('物联云平台')
            }
            setUserId(response.data.id)
            setDepartmentId(response.data.departmentId)
            setLoginType(response.data.type)
            setLoginDepId(response.data.departmentId)
            resolve(response.data) // 挂载
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    // 设置登录后的参数
    setLoginInfo ({ commit }, data) {
      return new Promise((resolve, reject) => {
        commit('SET_TOKEN', data.token)
        commit('SET_NAME', data.userName)
        commit('SET_DEPARTMENTID', data.departmentId)
        commit('SET_SYSNAME', data.sysName)
        commit('SET_USERID', data.id)
        commit('SET_TIME', data.time)
        setToken(data.token)
        setTokenTime(data.time)
        if (data.sysName !== null) {
          setSysName(data.sysName)
        } else {
          setSysName('物联云平台')
        }
        setUserId(data.id)
        setDepartmentId(data.departmentId)
        resolve() // 挂载
      })
    },
    // 前端退出登录
    WebLogOut ({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        commit('SET_TIME', 0)
        removeToken()
        removeTokenTime()
        window.sessionStorage.removeItem('childRoute')

        /** ********  删除 BASE_TOKEN 回退到BASE选项页面  **********/
        storeWebLocal.removeSessionStorage('BASE_TOKEN')

        resolve()
      })
    },
    SetDepartmentId ({ commit }, id) {
      return new Promise(resolve => {
        commit('SET_DEPARTMENTID', id)
        setDepartmentId(id)
        resolve()
      })
    },
    useVersion ({ commit }, value) {
      commit('USE_Version', value)
    }
  }
}
export default user

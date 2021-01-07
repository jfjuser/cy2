/*
*@Author: lyf
*@Date: 2018-11-06 14:00:37
 * @Last Modified by: lyf
 * @Last Modified time: 2019-06-10 15:18:47
*/
import { httpPost } from '@/utils/restful.js'
import { login } from '@/api/url.js'
import { getToken, setToken, removeToken, removeTokenTime, getTokenTime, setTokenTime, setSysName, getSysName, getUserId, setUserId, getDepartmentId, setDepartmentId, setLoginType, setLoginDepId } from '@/utils/cookie'
const user = {
  state: {
    token: getToken(),
    name: '',
    departmentId: getDepartmentId(),
    sysName: getSysName(),
    userId: getUserId(),
    time: getTokenTime()
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
    }
  },
  actions: {
    // 登录操作
    LoginByUserName ({ commit }, data) {
      return new Promise((resolve, reject) => {
        httpPost(login, data)
          .then(response => {
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
        resolve()
      })
    },
    SetDepartmentId ({ commit }, id) {
      return new Promise(resolve => {
        commit('SET_DEPARTMENTID', id)
        setDepartmentId(id)
        resolve()
      })
    }
  }
}
export default user

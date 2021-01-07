// /*
// *@Author: lyf
// *@Date: 2018-11-06 14:00:37
//  * @Last Modified by: mikey.zhaopeng
//  * @Last Modified time: 2020-06-13 11:51:40
// */
// import { httpPost } from '@/utils/restful.js'
// import { login } from '@/api/url.js'
// import { getToken, setToken, removeToken, setSysName, getSysName, getUserId, setUserId, getDepartmentId, setDepartmentId } from '@/utils/cookie'

// const user = {
//   state: {
//     token: getToken(),
//     name: '',
//     departmentId: getDepartmentId(),
//     sysName: getSysName(),
//     userId: getUserId(),
//     permissionFun: []
//   },
//   mutations: {
//     SET_TOKEN: (state, token) => {
//       state.token = token
//     },
//     getFun: (state, permissionFun) => {
//       state.permissionFun = permissionFun
//     },
//     SET_NAME: (state, name) => {
//       state.name = name
//     },
//     SET_DEPARTMENTID: (state, departmentId) => {
//       state.departmentId = departmentId
//     },
//     SET_SYSNAME: (state, sysName) => {
//       state.sysName = sysName
//     },
//     SET_USERID: (state, id) => {
//       state.userId = id
//     }
//   },
//   actions: {
//     // 登录操作
//     LoginByUserName ({ commit }, data) {
//       return new Promise((resolve, reject) => {
//         httpPost(login, data)
//           .then(response => {
//             commit('SET_TOKEN', response.data.token)
//             commit('SET_NAME', response.data.userName)
//             commit('SET_DEPARTMENTID', response.data.departmentId)
//             commit('SET_SYSNAME', response.data.sysName)
//             commit('SET_USERID', response.data.id)
//             setToken(response.data.token)
//             if (response.data.sysName !== null) {
//               setSysName(response.data.sysName)
//             } else {
//               setSysName('物联云平台')
//             }
//             setUserId(response.data.id)
//             setDepartmentId(response.data.departmentId)
//             resolve() // 挂载
//           })
//           .catch(error => {
//             reject(error)
//           })
//       })
//     },
//     // 前端退出登录
//     WebLogOut ({ commit }) {
//       return new Promise(resolve => {
//         commit('SET_TOKEN', '')
//         removeToken()
//         resolve()
//       })
//     },
//     SetDepartmentId ({ commit }, id) {
//       return new Promise(resolve => {
//         commit('SET_DEPARTMENTID', id)
//         setDepartmentId(id)
//         resolve()
//       })
//     }
//   }
// }
// export default user

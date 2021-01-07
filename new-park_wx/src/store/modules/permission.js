import { asyncRouterMap, constantRouterMap, Router404 } from '@/router'

import { httpGet } from '@/utils/restful'
import { getFunction } from '@/api/url'
import { setDepName, getDepName, setLoginType } from '@/utils/cookie'
// 递归遍历
function filtAsyncRouter (asyncRouterMap, permissionList) {
  let realRouters = []
  asyncRouterMap.forEach((v, index) => {
    for (var i = 0; i < permissionList.length; i++) {
      let item = permissionList[i]
      if (item.name === v.meta.title) {
        if (item.children && item.children.length > 0) {
          v.children = filtAsyncRouter(v.children, item.children)
        }
        if (item.roles) {
          v.meta.roles = item.roles
        } else {
          v.meta.roles = []
        }
        realRouters.push(v)
        break
      }
    }
  })
  return realRouters
}

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: [],
    level: 0,
    type: 0,
    departmentTypeId: 0,
    depName: getDepName(),
    themeType: 0
  },
  mutations: {
    SET_ROUTERS: (state, addRouter) => {
      // 动态添加的路由
      state.addRouters = addRouter
      // 最终的路由
      state.routers = [...constantRouterMap, ...addRouter]
    },
    SET_LEVEL: (state, level) => {
      state.level = level
    },
    SET_TYPE: (state, type) => {
      state.type = type
    },
    SET_DEPARTMENTTYPEID: (state, departmentTypeId) => {
      state.departmentTypeId = departmentTypeId
    },
    SET_DEPNAME: (state, depName) => {
      state.depName = depName
    },
    SET_THEMETYPE: (state, themeType) => {
      state.themeType = themeType
    }
  },
  actions: {
    GenerateRoutes ({commit}) {
      return new Promise((resolve, reject) => {
        httpGet(getFunction + this.getters.departmentId)
          .then(res => {
            let addRoutes
            if (res.data === null || res.data.list === null) {
              // eslint-disable-next-line
              reject('暂未分配权限')
            } else {
              addRoutes = filtAsyncRouter(asyncRouterMap, res.data.list).concat(Router404)
              // 设置完整路由
              commit('SET_ROUTERS', addRoutes)
              // 设置平台类型
              commit('SET_TYPE', res.data.type)
              // 设置级别
              commit('SET_LEVEL', res.data.level)
              // 部门类别
              commit('SET_DEPARTMENTTYPEID', res.data.departmentTypeId)
              // 设置人脸
              commit('SET_THEMETYPE', res.data.themeType)
              setLoginType(res.data.level)
              resolve()
            }
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    // 移除路由  恢复默认
    RemoveRouters ({commit}) {
      return new Promise(resolve => {
        commit('SET_ROUTERS', [])
        resolve()
      })
    },
    // 设置部门名称
    SetDepName ({ commit }, depName) {
      return new Promise(resolve => {
        setDepName(depName)
        commit('SET_DEPNAME', depName)
        resolve()
      })
    }
  }

}
export default permission

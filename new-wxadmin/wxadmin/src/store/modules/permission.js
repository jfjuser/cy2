// import { asyncRouterMap, constantRouterMap, Router404 } from '@/router'
// import { CloudMaintainRouterMap } from '@/router/modules/CloudMaintainRouterMap.js'
// import { IframeRouterMap } from '@/router/modules/IframeRouterMap.js'
// import { ParkCenterRouterMap } from '@/router/modules/ParkCenterRouterMap.js'
// import { PermissionRouterMap } from '@/router/modules/PermissionRouterMap.js'
// import { InOutRouterMap } from '@/router/modules/InOutRouterMap.js'
// import { PayManageRouterMap } from '@/router/modules/PayManageRouterMap'
// import { RemoteUpgradeRouterMap } from '@/router/modules/RemoteUpgradeRouterMap'
// import { DepartmentRouterMap } from '@/router/modules/DepartmentRouterMap'
// import { BoxRouterMap } from '@/router/modules/BoxRouterMap'
// import { DeviceManageRouterMap } from '@/router/modules/DeviceManageRouterMap'
// import { FunctionOpenRouterMap } from '@/router/modules/FunctionOpenRouterMap'
// import { TicketManageRouterMap } from '@/router/modules/TicketManageRouterMap'
// import { CameraManageRouterMap } from '@/router/modules/CameraManageRouterMap.js'
// // 人脸
// import { cameraMaintainRouterMap } from '@/router/modules/faceAI/cameraMaintainRouterMap.js'
// import { faceDistinguishRouterMap } from '@/router/modules/faceAI/faceDistinguishRouterMap.js'
// import { basicDataRouterMap } from '@/router/modules/faceAI/basicDataRouterMap'
// import { remoteMaintainRouterMap } from '@/router/modules/faceAI/remoteMaintainRouterMap'
// // 售后服务
// import { AfterServiceRouterMap } from '@/router/modules/afterService/afterServiceRouterMap'
// // 广告统计
// import { statistcsRouterMap } from '@/router/modules/statistcsRouterMap'

// import { httpGet } from '@/utils/restful'
// import { getFunction } from '@/api/url'
// import { setDepName, getDepName } from '@/utils/cookie'
// // 递归遍历
// function filtAsyncRouter (asyncRouterMap, permissionList) {
//   let realRouters = []
//   asyncRouterMap.forEach((v, index) => {
//     for (var i = 0; i < permissionList.length; i++) {
//       let item = permissionList[i]
//       // 判断一级目录名称是否相同,解决
//       if (item.name === v.meta.title) {
//         if (item.children && item.children.length > 0) {
//           if (item.name === '平台维护') v.children = CloudMaintainRouterMap
//           if (item.name === '平台监控') v.children = IframeRouterMap
//           if (item.name === '部门管理') v.children = DepartmentRouterMap
//           if (item.name === '远程升级') v.children = RemoteUpgradeRouterMap
//           if (item.name === '相机管理') v.children = CameraManageRouterMap
//           if (item.name === '盒子模式') v.children = BoxRouterMap
//           if (item.name === '权限管理') v.children = PermissionRouterMap
//           if (item.name === '进出管理') v.children = InOutRouterMap
//           if (item.name === '电子支付') v.children = PayManageRouterMap
//           if (item.name === '电子优惠券') v.children = TicketManageRouterMap
//           if (item.name === '车场数据') v.children = ParkCenterRouterMap
//           if (item.name === '设备管理') v.children = DeviceManageRouterMap
//           if (item.name === '扩展功能') v.children = FunctionOpenRouterMap
//           // ------------------------- 人脸 ------------------------\\
//           if (item.name === '相机维护') v.children = cameraMaintainRouterMap
//           if (item.name === '人脸识别') v.children = faceDistinguishRouterMap
//           if (item.name === '基础数据') v.children = basicDataRouterMap
//           if (item.name === '远程维护') v.children = remoteMaintainRouterMap
//           // 广告
//           if (item.name === '统计模块') v.children = statistcsRouterMap
//           // 售后服务
//           if (item.name === '售后服务') v.children = AfterServiceRouterMap
//           v.children = filtAsyncRouter(v.children, item.children)
//         }
//         if (item.roles) {
//           v.meta.roles = item.roles
//         } else {
//           v.meta.roles = []
//         }
//         realRouters.push(v)
//         break
//       }
//     }
//   })
//   return realRouters
// }

// const permission = {
//   state: {
//     routers: constantRouterMap,
//     addRouters: [],
//     level: 0,
//     type: 0,
//     departmentTypeId: 0,
//     depName: getDepName(),
//     themeType: 0
//   },
//   mutations: {
//     SET_ROUTERS: (state, addRouter) => {
//       // 动态添加的路由
//       state.addRouters = addRouter
//       // 最终的路由
//       state.routers = [...constantRouterMap, ...addRouter]
//     },
//     SET_LEVEL: (state, level) => {
//       state.level = level
//     },
//     SET_TYPE: (state, type) => {
//       state.type = type
//     },
//     SET_DEPARTMENTTYPEID: (state, departmentTypeId) => {
//       state.departmentTypeId = departmentTypeId
//     },
//     SET_DEPNAME: (state, depName) => {
//       state.depName = depName
//     },
//     SET_THEMETYPE: (state, themeType) => {
//       state.themeType = themeType
//     }
//   },
//   actions: {
//     GenerateRoutes ({commit}) {
//       return new Promise((resolve, reject) => {
//         httpGet(getFunction + this.getters.departmentId)
//           .then(res => {
//             let addRoutes
//             if (res.data === null || res.data.list === null) {
//               // eslint-disable-next-line
//               reject('暂未分配权限')
//             } else {
//               addRoutes = filtAsyncRouter(asyncRouterMap, res.data.list).concat(Router404)
//               // 设置完整路由
//               commit('SET_ROUTERS', addRoutes)
//               // 设置平台类型
//               commit('SET_TYPE', res.data.type)
//               // 设置级别
//               commit('SET_LEVEL', res.data.level)
//               // 部门类别
//               commit('SET_DEPARTMENTTYPEID', res.data.departmentTypeId)
//               // 设置人脸
//               commit('SET_THEMETYPE', res.data.themeType)
//               resolve()
//             }
//           })
//           .catch(err => {
//             reject(err)
//           })
//       })
//     },
//     // 移除路由  恢复默认
//     RemoveRouters ({commit}) {
//       return new Promise(resolve => {
//         commit('SET_ROUTERS', [])
//         resolve()
//       })
//     },
//     // 设置部门名称
//     SetDepName ({ commit }, depName) {
//       return new Promise(resolve => {
//         setDepName(depName)
//         commit('SET_DEPNAME', depName)
//         resolve()
//       })
//     }
//   }

// }
// export default permission

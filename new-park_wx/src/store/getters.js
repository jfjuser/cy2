const getters = {
  userId: state => state.user.userId,
  token: state => state.user.token,
  name: state => state.user.name,
  departmentId: state => state.user.departmentId,
  sysName: state => state.user.sysName,
  device: state => state.app.device,
  sidebar: state => state.app.sidebar,
  addRouters: state => state.permission.addRouters, // 新增的路由
  routers: state => state.permission.routers, // 路由权限
  level: state => state.permission.level, // 判断当前部门的级别信息
  type: state => state.permission.type,
  departmentTypeId: state => state.permission.departmentTypeId,
  depName: state => state.permission.depName,
  themeType: state => state.permission.themeType,
  childRoute: state => state.app.childRoute,
  version: state => state.user.version // 新旧版本
}
export default getters

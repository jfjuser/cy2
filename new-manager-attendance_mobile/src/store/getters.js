const getters = {
  token: state => state.user.token,
  registerPhone: state => state.user.register.phone,
  registerPw: state => state.user.register.pw,
  registerMac: state => state.user.equipmentInfoR.mac,
  registerLocalName: state => state.user.equipmentInfoR.localName,
  registerType: state => state.user.equipmentInfoR.type,
  // 登录后的参数
  userName: state => state.user.userName,
  phone: state => state.user.phone,
  departmentId: state => state.user.departmentId, // 公司id
  departmentTypeId: state => state.user.departmentTypeId, // 公司id
  departmentName: state => state.user.departmentName, // 公司名称
  userId: state => state.user.userId, // 用户id
  // 微信
  appId: state => state.wx.appId, // 微信appId
  code: state => state.wx.code, // 微信code
  openId: state => state.wx.openId, // openId
  registerStep: state => state.user.registerStep, // 注册进程
  userAuthInfo: state => state.user.userAuthInfo, // 用户公司部门记录
  isUserLogOutType: state => state.user.isUserLogOutType// 用户是否是退出登录状态信息
}
export default getters

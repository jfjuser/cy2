const getters = {
  token: state => state.user.token,
  // 登录后的参数
  userName: state => state.user.userName,
  phone: state => state.user.phone,
  departmentId: state => state.user.departmentId, // 公司id
  departmentTypeId: state => state.user.departmentTypeId, // 公司id
  departmentName: state => state.user.departmentName, // 公司名称
  userId: state => state.user.userId // 用户id
}
export default getters

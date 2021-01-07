/*
*@Author: 李一番
* @Date: 2019-01-14 22:30:09
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-10-23 16:04:52
*/

// 接口路径
export const getPayUrl = 'v1/pay/payUrl/'
export const getOpenId = 'v1/wx/getOpenId'
export const bindPlate = 'v1/wx/follow/bind'
export const closeFollowTip = 'v1/wx/follow/close'
export const addAdvClick = 'v1/push/records/click' // 判断点击率

// 微信服务商支付
export const getUserCode = 'v1/yunPay/getUserCode' // 获取openId
export const queryFee = 'v1/yunPay/queryFee' // 查费
export const scenePay = 'v1/yunPay/scenePay' // 扫码支付
export const noPlateIn = 'v1/yunPay/noPlateIn' // 无牌车入场

// app更新
export const newApp = 'v1/app/appUpgrade/newApp'

// 月卡续费
export const getMonthInfo = 'pay/getMonthInfo' // 提交车牌号码
export const monthPay = 'pay/monthPay' // 支付

// 优惠券
export const Ticketbingding = 'v1/ticket/bingding' // 提交验证车牌
export const TicketbingdingInfo = 'v1/ticket/bingding/info' // 获取车场信息

// 银联
export const ccbStaticPay = 'v1/ccb/staticPay' // 静态码
export const ccbLogin = 'v1/login'
export const getTcpTokenList = 'v1/tcpToken/list'

export const getWxUserInfo = 'v1/wx/getWxUserInfo' // 获取微信用户信息,包括昵称等数据

// 绑定车牌
export const getUserCars = 'v1/wx/bindPlate/getUserCars'
export const deleteUserCar = 'v1/wx/bindPlate/deleteUserCar'

// 停车记录
export const getUserInOut = 'v1/wx/getUserInOut'

// 建言献策
export const suggestion = 'v1/suggestion'

// 平台银支付
export const osQueryFee = 'v1/os/fee' // 查费
export const osGetNoPlate = 'v1/os/np' // 获取临时车牌，注意每次扫无牌车入口码都要重新获取车牌，每次停车都会不一样
export const osNoPlateIn = 'v1/os/np' // 无牌车入场
export const osPay = 'v1/os/pay' // 发起支付

// 人员输入
export const faceAIIsAdd = 'v1/ai/public/aiUser/isAdd' // 判断是否可以添加
export const faceAIAdd = 'v1/ai/public/aiUser' // 添加用户
export const faceAIAddVisitor = 'v1/ai/public/aiUser/insertVisitor' // 添加访客
export const faceAICheckPhoto = 'v1/ai/public/aiUser/checkPhoto' // 校验图片
export const faceDetect = 'v1/ai/public/aiUser/faceDetect' // 新的校验图片算法
export const faceAICardNum = 'v1/ai/public/aiUser/getCardNum' // 获取随机码
export const faceAICheckType = 'v1/ai/public/checkType/info/'

// ----------------   人脸个人版   ---------------
// 登录
export const faceAILogin = 'v1/face/login'
export const updatePsw = 'v1/face/people/updatePsw' // 修改账户密码

export const getFaceInOut = 'v1/face/people/getFaceInOut' // 记录查询
export const bindFace = 'v1/face/people/bindFace' // 绑定人脸
export const checkUseBind = 'v1/face/people/checkUseBind' // 绑定人脸
export const listBindFaceInfo = 'v1/face/people/listBindFaceInfo' // 获取人员的绑定信息
export const unBindFace = 'v1/face/people/unBindFace' // 解绑人脸

export const getFaceInfo = 'v1/face/people/getFaceInfo' // 获取个人信息
export const getPointsInfo = 'v1/face/people/getPointsInfo' // 获取微信用户积分信息
export const getPointsRecord = 'v1/face/people/getPointsRecord' // 获取积分记录
export const getMenu = 'v1/face/people/getMenu' // 获取定制菜单设置
export const setMenu = 'v1/face/people/setMenu' // 设置菜单
export const registerAccount = 'v1/face/people/insertAiUserAndaAuditable' // 公众号注册账户提交审核信息
export const switchUnion = 'v1/face/union' // 获取列表和切换企业
export const searchUnion = 'v1/face/union/page/' // 搜索企业
export const switchSearchUnion = 'v1/wx/updateDepartmentIdByUserOpenId'
export const addHistory = 'v1/ai/aiUser/watch' // 查看添加历史记录
export const lookAt = 'v1/ai/aiUser/page' // 用户

// 签到
export const getSignRule = 'v1/face/people/signConfig' // 获取签到规则
export const getSignRecord = 'v1/face/people/signRecord' // 获取连续签到记录
export const signIn = 'v1/face/people/signIn' // 打卡签到

// 物业通知栏
export const getNotice = 'v1/ai/aiNotify' // 查看接口
// 积分规则
export const pagePointsRules = 'v1/face/rules'

export const zhLogin = 'v1/aiDuyCompany/login'

// 小区
export const showBuilding = 'v1/face/people/getBuldingNameByDepartment' // 回显楼栋
export const showFloor = 'v1/face/people/getFloorByBuilding' // 回显楼层
export const showRoom = 'v1/face/people/getRommByFloor' // 回显房间

export const getType = 'v1/ai/public/workerType/list/addUser'
export const findPsw = 'v1/face/people/user/findPassword' // 找回密码

/** ********  【 新增用户管理API 】  **********/
export const loginByPhone = 'v1/aiDuyCompany/loginByNameAndPhone'

// export const apiGetCameraId = 'v1/ai/aiToken/pageByDepartmentId' // 获取相机数据
export const apiGetCameraId = 'v1/ai/oa/aiLocalPermission' // 获取账号通道
export const pageByDepartmentId2 = 'v1/ai/aiApp/pageByDepartmentId'

export const openRelayRecord = 'v1/ai/oa/openRelayRecord/page' /// v1/ai/aiApp/openRelayRecord/{aiTokenId}/{departmentId}/{userId}

export const openOutLog = 'v1/ai/oa/openRelayRecord/page' /// {departmentId}/{userId}
export const page = '/work/v1/workAiInOut/tree/page' // 获取进出记录列表
export const inOutPhoto = '/work/v1/aiGetCameraFile/inOutPhoto/' // 进出记录页面点击查看图片时调用的接口

export const aiInOutRecords = '/work/v1/aiInOutRecords/export' // 导出进出记录接口
// export const listSchool = '/v1/school/listSchoolLeaveByDepartmentId'

// 请求全部请假审批人
export const listApproveUser = 'pv/v1/approveUser/listApproveUser'

// 提交请假申请
export const insert = 'pv/v1/vacation/insertVacationByStudent'
export const doApproveVacationByStudent = 'pv/v1/vacation/doApproveVacationByStudent'

// 获取是否有审批的权限
export const getPowerByParams = 'pv/v1/approveUser/getPowerByParams'

// 获取用户提交的信息
export const listVacation = 'pv/v1/vacation/listVacation'

// 同意或者驳回请假申请
export const approveVacation = 'pv/v1/vacation/approveVacation'

// 跳转到申请详情页面
export const getByVacationId = 'pv/v1/vacation/getByVacationId/'
export const getAiuserMessage = 'pv/v1/approveUser/employee/getAiuserMessage/'

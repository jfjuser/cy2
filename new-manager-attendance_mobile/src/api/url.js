/* --------- 登录注册 -------------- */
export const sendSms = 'work/v1/login' // 根据手机号获取验证码
export const isRegister = 'work/v1/checkout' // 校验手机号是否注册过
export const register = 'work/v1/loginforPhone' // 注册页面
export const submitRegister = 'work/v1/completeMessage' // 填写信息 (填完才算注册)
export const login = 'work/v1/login' // 密码登录
export const resetPassword = 'work/v1/resetPassword' // 改密
export const resetPWSendSms = 'work/v1/forgetPassword' // 改密 发送验证码
export const resetPhone = 'work/v1/updatePhone' // 改手机号
export const resetPhoneSendSms = 'work/v1/getCodeForPhone' // 改手机号的发送验证码
export const determineTheCamera = 'work/v1/determineTheCamera' // 判断相机是否可用

/* --------- 个人中心 -------------- */
export const userInfo = 'work/v1/message' // 个人信息
export const modifyTeamName = 'work/v1/department/update' // 改公司名
export const modifyName = 'work/v1/updateName' // 改名

/* --------- 成员管理 -------------- */
export const lookMember = 'work/v1/manager/WorkForCyCarUser' // 查看,删除

/* --------- 部门管理 -------------- */
export const checkAICamera = 'work/v1/manager/getChannels' // 获取所有相机
export const AIpermission = 'work/v1/manager/workForaiLocalPermission' // 查询和修改通道权限
export const workForaiDuyCompany = 'work/v1/manager/workForaiDuyCompany' // 新增,删除,改部门信息
export const getAllDepartment = 'work/v1/manager/company/page' // 获取所有的部门
export const getUser = 'work/v1/manager/WorkForOneCyCarUser' // 获取部门用户
export const addUser = 'work/v1/manager/WorkForaiUser' // 部门添加用户
export const delUser = 'work/v1/manager/aiUser' // 部门移除用户

/* --------- 申请管理 -------------- */
export const getPunchInList = 'work/v1/company/isNotCheckWriteoffApplicant' // 待审核的补单
export const auditPunchIn = 'work/v1/company/workWriteOffApplicantAdminCheck' // 审核补单
export const auditAdd2Group = 'work/v1/company/checkEmployeeAndAddToGroup' // 审核邀请到考勤组
export const getAdd2Group = 'work/v1/listWorkCheckGroupForAll' // 查看申请加入考勤组

/* ----------2020新改接口-------------- */
export const adaptNewInfo = 'work/v1/aiUser' // put 修改用户信息接口
export const applyNewAdapt = 'work/v1/aiUser/update' // put 申请修改用户信息接口
export const superUserCheck = 'work/v1/aiUser/check' // post {aiUserId}/{status} 管理员审核
export const showNewUser = 'work/v1/aiUser/check/show' // get 显示需要审核的人员
export const userAdmin = 'work/v1/aiUser/set/admin' // 设为管理员
/* --------- 相机管理 -------------- */
export const getAICamera = 'work/v1/workcamera/workaiToken/pageByDepartmentId' // 获取所有通道
export const unBindAICamera = 'work/v1/workcamera/workaiToken/unbindCamera' // 解绑相机
export const AIBindCamera = 'work/v1/workcamera/workaiToken/bindCamera' // 绑定相机
export const editAICameraName = 'work/v1/workcamera/workForaiToken/update' // 修改通道名称
export const backShowType = 'work/v1/visitor/echoCamera' // 回显wifi安全性类型
export const setType = 'work/v1/visitor/setCameratype' // 设置wifi安全性类型
export const setCameraParams = 'work/v1/visitor/bindCamera' // 相机参数生成二维码
export const setCameraParams1 = 'work/v1/visitor/bindCapitalCamera' // 相机参数生成二维码
export const cameraAIParams = 'work/v1/cameraType/forWorkStyle' // 回显相机参数
export const setAllParams = 'work/v1/camera/setting' // 相机下发参数

/* --------- 访客管理 -------------- */
export const getMac = 'work/v1/visitor/getMac' // 获取通道
export const submitVisitor = 'work/v1/visitor/lingk' // 提交访客
export const handleScan = 'work/v1/visitor/scan' // 扫码开门

/* --------- 考勤管理 -------------- */
// 班次管理
export const getAIShifts = 'work/v1/workForClasses/workShift/page' // 获取列表
export const AIShifts = 'work/v1/workForClasses/workShift' // 新增、删除、编辑和详情
export const getAIShiftsList = 'work/v1/workForClasses/workShift/list' // 获取下拉列表
// 考勤组
export const AIAttendGroup = 'work/v1/workcount/workCheckGroup' // 获取列表、新增、修改和删除
export const AIAttendGroupDetail = 'work/v1/workcount/workCheckGroup/detail' // 获取详情
export const AIDuyCompanyAndAiUser = 'work/v1/workcount/workForaiDuyCompanyAndAiUser/getTree' // 根据部门获取下级部门和用户-考勤组内使用

/* -------------------- 考勤统计 ------------------- */
export const statistical = 'work/v1/workcount/day/collect/page' // 汇总

// 每日统计
export const exportTestInfo = 'work/v1/workcount/workForworkShift/export' // 导出
export const AIDailyCount = 'work/v1/workcount/day/page' // 获取列表
export const AIDailyCount2 = '/os/v1/workRecord/page' // 获取列表
export const updateAIDailyCount = 'work/v1/workcount/workRecord' // 修改考勤
export const updateAIDailyCount2 = '/os/v1/workRecord' // 修改考勤
export const exportAIDailyCount = 'work/v1/workcount/workForworkRecord/export' // 导出报表
// 每月统计
export const AIMonthlyCount = 'work/v1/workcount/month/page' // 获取列表
export const exportAIMonthlyCount = 'work/v1/workcount/workForworkMontht/export' // 导出报表
// 核销统计
export const AIWriteOff = 'work/v1/workcount/writeOff/page' // 获取列表

/* -------------------- 其它 ------------------- */
export const sweep = 'work/v1/wx/sweep' // 获取签名
export const getOpenId = 'work/v1/getOpenId' // 获取openID

export const checkAIMemberPhoto = 'pv/v1/ai/public/aiUser/checkPhoto' // 图片校验
export const noCheckAIMemberPhoto = 'pv/v1/ai/public/aiUser/noCheckPhoto' // 跳过图片校验
export const applyAdd = 'work/v1/AddUserByAdminInvite' // 邀请员工加入考勤组的表单提交

export const createQR = 'work/v1/visitor/getWifiP' // wifi生成二维码
export const newCreateQR = 'work/v1/visitor/getWifiPNew' // 新的wifi生成二维码
export const checkMacUsed = 'work/v1/workcamera/workaiToken/checkCamera' // get mac

/** ********  【 新增wg卡号 】  **********/
// export const ApiWgcard = ''

// 注册添加多个人脸
export const ApiAddFaceUser = 'work/v1/aiUser/register'
// 照片Api
export const ApiFindPhoto = 'v1/ai/aiUser/getPhoto/'
// 删除人脸数据
export const ApiDeleteFaceData = 'v1/ai/aiUser'
// 注销管理员
export const ApiLogOffUser = 'work/v1/aiUser/logout/' // work/v1/aiUser/logout/{departmentId}/{password}

// // 返回申请人考勤组的信息 get
// export const apiBackUserAttend = 'work/v1/listWorkCheckGroupForAll' // 返回申请人考勤组的信息

// 审核 0 是不通过 1是通过 get 返回申请人退出公司信息
export const apiExitCompany = 'work/v1/listExitCompany' // work/v1/listExitCompany/{userId}/{aiUserId}/{result}

export const checkAIMemeber = 'work/v1/manager/WorkForOneCyCarUser/isCheck' // 审核用户

export const userForaiLocalPermission = 'work/v1/manager/userForaiLocalPermission'

export const updateByDepartment = 'work/v1/manager/updateByDepartment'

export const insert = 'v1/approveUser/insert' // 添加审批员

export const delApproveUser = 'v1/approveUser/delApproveUser' // 删除审批员

export const listApproveUser = '/v1/approveUser/listApproveUser' // 查询审批员

export const page = '/work/v1/workAiInOut/tree/page' // 获取进出记录列表

export const inOutPhoto = '/work/v1/aiGetCameraFile/inOutPhoto/' // 进出记录页面点击查看图片时调用的接口

export const aiInOutRecords = '/work/v1/aiInOutRecords/export' // 导出进出记录接口

export const Exception = '/work/v1/workcount/day/exception/page'

export const updateWorkRecord = '/work/v1/workcount/day/updateWorkRecord'

export const unboundCamera = '/work/v1/workcamera/workaiToken/unboundCamera' // 解绑相机

export const openRelayRecord = 'work/v1/workcamera/workaiToken/openRelay/'

export const opendoor = 'v1/ai/opendoor/'

export const insertVisitor = 'work/v1/visitor/insertVisitor'
// 获取审批信息
export const listVacation = 'v1/vacation/listVacation'

export const updatePassword = 'work/v1/password/update' // 修改密码

export const password = 'work/v1/password/' // 获取密码

export const getNewTime = '/work/v1/visitor/getNewTime' // 获取系统时间戳，防止用户更改系统时间导致错误

export const isNewVersion = 'work/v1/isNewVersion/' // 判断小门禁是否是新版本

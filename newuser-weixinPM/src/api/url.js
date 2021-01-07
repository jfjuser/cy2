// -------------------- 考勤统计 ------------------- \\
// 每日统计
export const AIDailyCount = 'work/v1/workEmployee/dailyAttendanceStatistics' // 获取列表
// export const exportAIDailyCount = 'os/v1/workRecord/export' // 导出报表
export const updateAIDailyCount = 'v1/workRecord' // 修改考勤
// 每月统计
export const AIMonthlyCount = 'work/v1/workEmployee/monthlyAttendanceStatistics' // 获取列表
// export const exportAIMonthlyCount = 'v1/workMontht/export' // 导出报表
// 核销统计
export const AIWriteOff = 'work/v1/workEmployee/monthlyVerification' // 获取列表
export const deleteAIWriteOff = 'v1/workWriteOff' // 删除

export const login = 'pv/v1/login' // 登录接口
export const unBindLogin = 'pv/v1/unBindWxLogin/' // 解绑账号与微信
export const getBaseInfo = 'work/v1/workEmployee/getAiuserMessage' // 初次进入获取的信息
export const getCodeSome = 'pv/v1/wx/getWxUserInfo' // 拿code去获取openId
export const checkAIMemberPhoto = 'pv/v1/ai/public/aiUser/checkPhoto' // 检测图片

export const noCheckAIMemberPhoto = 'pv/v1/ai/public/aiUser/noCheckPhoto' // 跳过校验检测图片
export const AIMember = 'work/v1/workEmployee/getEmployeeInfo' // 新增、修改、删除和删除所有pv/v1/ai/public/aiUser
export const checkIsAddAIMember = 'v1/ai/aiUser/isAdd' // 检测是否可以添加成员

// ****************** 普通版考勤新鲜可口的接口 ***********************////////////////////
// at开头
export const returnDep = 'work/v1/company/list' // 根据公司名称返回部门ID
export const addAttendGroup = 'work/v1/workEmployee/addEmployeeToWorkCheckGroup' // 员工申请加入考勤组
export const returnGroup = 'work/v1/listWorkCheckGroup' // 返回考勤组信息
export const applyCard = 'work/v1/workEmployee/employeeWriteOffApplicant' // 补卡申请

export const addGroupStatus = 'work/v1/workEmployee/getAddCheckGroupInfo' // 加入考勤组的情况
export const attendApply = 'work/v1/workEmployee/monthlyVerificationInfo' // 补卡返回情况

export const sweep = 'work/v1/wx/sweep' // 获取签名
export const updateInfo = 'work/v1/workEmployee/updateEmployeeInfo' // 修改个人信息

export const watchCompany = 'work/v1/company'

export const changeCompany = 'work/v1/workEmployee/switchCompany' // 切换公司

// 2020
export const applyNewAdapt = 'work/v1/aiUser/update' // put 申请修改用户信息接口

/** ********  【 新增API 】  **********/
// 韦根号
export const apiWiegandCard = 'v1/workEmployee/getEmployeeInfo'

// 访问个人考勤信息
export const apiGetUserInfo = 'work/v1/workEmployee/completeByPhone'

// 申请退出公司 员工申请退出公司 get
export const requestLogout = 'work/v1/workEmployee/exitComplete' // work/v1/workEmployee/exitComplete/{aiUserId}

// 请求全部请假审批人
export const listApproveUser = 'pv/v1/approveUser/listApproveUser'

// 提交请假申请
export const insert = 'pv/v1/vacation/insert'

// 获取是否有审批的权限
export const getPowerByParams = 'pv/v1/approveUser/getPowerByParams'

// 获取用户提交的信息
export const listVacation = 'pv/v1/vacation/listVacation'

// 同意或者驳回请假申请
export const approveVacation = 'pv/v1/vacation/approveVacation'

// 跳转到申请详情页面
export const getByVacationId = 'pv/v1/vacation/getByVacationId/'

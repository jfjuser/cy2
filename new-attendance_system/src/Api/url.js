
// ------------- 用户 ------------ \\
export const login = 'work/v1/login' // 密码登录
export const resetPassword = 'work/v1/resetPassword' // 改密
export const resetPWSendSms = 'work/v1/forgetPassword' // 改密 发送验证码

// 班次管理
export const getAIShifts = 'work/v1/workForClasses/workShift/page' // 获取列表
export const AIShifts = 'work/v1/workForClasses/workShift' // 新增、删除、编辑和详情
export const getAIShiftsList = 'work/v1/workForClasses/workShift/list' // 获取下拉列表
// 考勤组
export const AIAttendGroup = 'work/v1/workcount/workCheckGroup' // 获取列表、新增、修改和删除
export const AIAttendGroupDetail = 'work/v1/workcount/workCheckGroup/detail' // 获取详情
export const AIDuyCompanyAndAiUser = 'work/v1/workcount/workForaiDuyCompanyAndAiUser/getTree' // 根据部门获取下级部门和用户-考勤组内使用
export const AIAttendGroupShifts = 'work/v1/workcount/workForworkCycle' // 获取、新增用户排班
export const exportAIAttendGroupShifts = 'work/v1/workcount/workForworkShift/export' // 导出排班

/* -------------------- 考勤统计 ------------------- */
export const statistical = 'work/v1/workcount/day/collect/page' // 汇总
// 每日统计
export const AIDailyCount = 'work/v1/workcount/day/page' // 获取列表
export const updateAIDailyCount = 'work/v1/workcount/workRecord' // 修改考勤
export const exportAIDailyCount = 'work/v1/workcount/workForworkRecord/export' // 导出报表
// 每月统计
export const AIMonthlyCount = 'work/v1/workcount/month/page' // 获取列表
export const exportAIMonthlyCount = 'work/v1/workcount/workForworkMontht/export' // 导出报表
// 核销统计
export const AIWriteOff = 'work/v1/workcount/writeOff/page' // 获取列表

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

/* --------- 相机管理 -------------- */
export const getAICamera = 'work/v1/workcamera/workaiToken/pageByDepartmentId' // 获取所有通道
export const unBindAICamera = 'work/v1/workcamera/workaiToken/unbindCamera' // 解绑相机
export const AIBindCamera = 'work/v1/workcamera/workaiToken/bindCamera' // 绑定相机
export const editAICameraName = 'work/v1/workcamera/workForaiToken/update' // 修改通道名称
export const getAICameraFace = 'work/v1/cameraForPhoto/getCameraMessage' // 获取相机人脸信息
export const modifyAICameraFace = 'work/v1/cameraForPhoto/changeName' // 修改相机人脸信息

// -------- 相机维护 旧的--------- \\
// 相机管理
// export const getAICamera = 'v1/ai/aiToken/pageByDepartmentId' // 获取所有通道
// export const editAICameraName = 'v1/ai/aiToken/update' // 修改通道名称
export const syncState = 'v1/ai/aiLocalPermission/updateState' // 相机同步状态修改
// 生产部测试
export const getAIProductionTest = 'v1/ai/aiToken/pageByThree' // 获取列表
export const bindProdAICamera = 'v1/ai/aiToken/bindCamera/ids' // 绑定相机
export const unBindProdAICamera = 'v1/ai/aiToken/unbindCamera/ids' // 解绑相机
// ----1 华安人脸相机
// export const unBindAICamera = 'v1/ai/aiToken/unbindCamera/' // 解绑相机
export const reAIBoot = 'v1/ai/aiSetCamera/reBoot/' // 重启相机
export const setAITime = 'v1/ai/aiSetCamera/setTime/' // 校时
export const clearAIWhite = 'v1/ai/aiSetCamera/delete/' // 清空白名单
export const focusAIDown = 'v1/ai/aiSetCamera/focusDown' // 向下调焦
export const focusAIUp = 'v1/ai/aiSetCamera/focusUp' // 向上调焦
export const getAISnap = 'v1/ai/aiGetCameraFile/snapsho/' // 获取快照
export const getAIParams = 'v1/ai/aiSetCamera/getCameraParameter/' // 获取相机设置
export const setAIParams = 'v1/ai/aiSetCamera/setCamera' // 设置相机
export const getAIVer = 'v1/ai/aiSetCamera/getCamVer/' // 获取相机版本信息
export const zoomAIDown = 'v1/ai/aiSetCamera/zoomDown' // 减小倍数
export const zoomAIUp = 'v1/ai/aiSetCamera/zoomUp' // 增加倍数
export const setAIpar = 'v1/ai/aiSetCamera/setPar' // 设置单个相机参数
export const getAICameraFiles = 'v1/ai/aiGetCameraFile/' // 获取文件
export const getAIAppCameraFile = 'v1/ai/aiAppGetLog/' // 获取android文件
// ----2 安卓人脸
export const getAIAndroidParams = 'v1/ai/aiSetCamera/getAppCameraParameter/' // 获取参数值
export const setAIAndroidParams = 'v1/ai/aiSetCamera/setAppCamera' // 设置参数值
// ----3.安卓科发人脸
export const AIAndroidKFParams = 'v1/ai/aiSetCamera/getKfCameraParameter' // 获取、设定参数
// ----4.畅盈Linux人脸 X系列
export const getAILinuxParams = 'v1/ai/aiSetCamera/getCycCameraParameter/' // 获取参数值
export const setAILinuxParams = 'v1/ai/aiSetCamera/setCycCamera' // 设定参数值
// 相机状态
export const cloudAICamera = 'v1/ai/aiToken/page'
export const UpgradeAIUnbindCamera = 'v1/cameraOperation/cameraUpgradeUnbindAi' // 升级未绑定的相机
// 人脸参数设置
export const cameraAIParams = 'v1/ai/cameraType/style' // 获取、提交基础参数
export const cameraAIOneParams = 'v1/ai/camera/json' // 获取和设置单个相机的参数

export const updateCamera = 'v1/ai/aiApp/upgrade' // 升级安卓人脸的相机
export const optionsOrder = 'v1/ai/aiSetParam' // 添加修改删除命令接口
export const deviceReboot = 'v1/ai/aiApp/appRestart' // 安卓相机设备重启
export const aKeyOpened = 'v1/ai/aiApp/openRelay' // 安卓相机一键开闸
export const dataReset = 'v1/ai/aiApp/restore' // 安卓相机恢复出厂设置
// 参数设置
export const AIParamsSetting = 'v1/cameraOperation/settingParametersAi'
export const AICameraParams = 'v1/ai/aiCameraConfigIni' // 获取列表、添加和修改
export const AIcameraParamsList = 'v1/cameraOperation/setParList' // 参数设置--平台相机使用

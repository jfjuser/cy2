
// =------------------------ 车场云 ------------------ \\

// ------------- 用户 ------------ \\
export const login = 'pv/v1/login' // 登录接口
export const autoLogin = 'pv/v1/autoDecode' // 校验预授权登录接口
export const reflushToken = 'pv/v1/reflushToken' // 刷新Token
export const cloudData = 'v1/statist/yun' // 平台-代理商首页
export const statist = 'v1/statist/calculation' // 平台-代理商首页
export const dataView = 'v1/dataview/init/' // 大屏幕
export const depData = 'v1/statist/dep' // 车场首页
export const getUserInfo = 'v1/user/' // 获取用户的信息
export const updateUser = 'v1/user' // 更新用户信息
export const seeLogo = 'v1/park/logo/' // 查看Logo
export const setLogo = 'v1/park/logo' // 查看Logo
export const editPassword = 'v1/user/password' // 修改密码
export const getAdmin = 'v1/user/admin/department/' // 获取超级管理员
export const createAdmin = 'v1/user/admin' // 新增超级管理员
export const getUserName = 'v1/user/userName' // 获取账号
export const updatePassword = 'v1/user/admin/password' // 修改管理员密码
// 用户
export const getUsers = 'v1/user/department/page' // 获取列表
export const User = 'v1/user' // 修改、创建、删除和删除所有
export const UserRole = 'v1/user/role' // 获取和修改角色
// 角色
export const getRoles = 'v1/role/department/page' // 获取角色
export const createRoles = 'v1/role/department' // 新增角色
export const getFunction = 'v1/tree/function/' // 获取功能权限
// 研发权限
export const deletePermission = 'v1/permission/' // 研发删除权限
export const Permission = 'v1/permission/save' // 研发新增权限
// -------------- 部门管理 --------- \\
export const getAllDepartment = 'v1/department/list' // 获取所有的部门
export const getDep = 'v1/department/pid/page/' // 获取下级部门
export const department = 'v1/department' // 新增、删除、更改和查看部门详情
export const editDepConfig = 'v1/department/api' // 更新第三方配置信息
export const getDepTransport = 'v1/department/netType/' // 获取部门传输类型
export const DepBuiness = 'v1/department/open' // 获取和保存已经开通的业务
export const LogoUrl = 'v1/park/logo' // logo
export const getDepartmentTree = 'v1/tree/department' // 获取部门树

// -------------- 部门类别 --------- \\
export const getDepTypeById = 'v1/dtype/department/' // 根据部门ID获取部门类别
export const getSysName = 'v1/dtype' // 根据选中departmentTypeId知道平台名字
export const getDepTypeByLevel = 'v1/dtype/level/' // 根据级别获取部门类别
export const getDepTypeByLevelPage = 'v1/dtype/level/page/' // 根据级别分页获取部门类别
export const DepTypePermission = 'v1/dtype/permission/' // 获取和设置类别默认权限
export const getDepTypeCanCreate = 'v1/dtype/er/' // 获取可被创建的二级导航
export const setDepTypeCanCreate = 'v1/dtype/pid' // 设置可被创建的二级导航
export const updateDepart = 'v1/update/department' // 修改部门参数
export const checkAllTypeInfo = 'v1/dtype/agency/department' // 查看可创建的下级类型

// -------------- 角色管理 --------- \\
export const DepType = 'v1/dtype' // 添加、删除、更新和获取
// 默认角色
export const getDtypeRoles = 'v1/dtype/role/page/' // 获取默认角色
export const createDtypeRoles = 'v1/dtype/role' // 新增默认角色
export const Roles = 'v1/role' // 修改、删除角色
// 角色权限
export const RolesPermisson = 'v1/role/permission' // 获取、设置权限
export const RolesPermissonOnly = 'v1/role/permission/only' // 获取分配权限
export const lookRolesPermisson = 'v1/role/find/permission' // 获取管理权限
export const givePermissionEr = 'v1/user/super/role' // 分配超管
// 默认任务
export const getTask = 'v1/typeTask/page' // 获取默认任务
export const Task = 'v1/typeTask' // 新增、编辑和删除任务

export const templateInfo = 'v1/faceWxTemplateInfo' // 添加模板

// ------------- 操作文档 ---------- \\
export const uploadDescriptions = process.env.API_HOST + 'os/v1/park/updocs' // 上传操作文档
export const uploadWhite = process.env.API_HOST + 'os/v1/park/vorlage' // 上传白名单
export const exportWhite = 'v1/app/downUpgrade/' // 下载白名单
export const exportDescriptions = 'v1/downfile' // 下载操作文档
export const getWord = 'v1/park/operationalDocument' // 获取在线操作文档
export const saveWord = 'v1/park/operationalDocument' // 保存在线操作文档
export const getAllDocuments = 'v1/park/operationalDocument' // 获取所有的操作文档列表
export const deleteDocuments = 'v1/park/deleteDoc' // 删除文档
export const uploadDoc = process.env.API_HOST + 'os/v1/park/uploadDoc' // 上传文档
// 用户日志
export const UserLog = 'v1/user/oprationRecords' // 获取列表
// 版本更新日志
export const getVersionInfo = 'v1/updateInfo/page' // 获取
export const VersionInfo = 'v1/updateInfo' // 新增和更新
// -------------- App ------------- \\
export const getAppUpgrade = 'v1/app/appUpgrade/page' // 获取app文件列表
export const uploadAppFile = process.env.API_HOST + 'os/v1/app/upgrade' // 上传app文件包
export const deleteAppFile = 'v1/app/appUpgrade' // 删除app文件
export const exportAppFile = 'pv/v1/app/downUpgrade/' // 下载App文件
// 平台广告
export const Advs = 'v1/park/publicize' // 获取列表、删除、更新和增加
export const uploadAdvs = process.env.API_HOST + 'v1/park/publicize' // 上传
export const getAdvPic = 'v1/publicize' // 获取图片
export const getAdv = 'v1/cloud/publicize' // 首页获取广告
export const createAdvText = 'v1/park/publicizeNoImg' // 添加文字

// -------------- 盒子模式 --------- \\
// 免费车
export const getBoxFreeCar = 'v1/box/boxFreeCar/page' // 获取免费车列表
export const BoxFreeCar = 'v1/box/boxFreeCar' // 新增 和删除免费车
export const uploadBoxFreeCar = process.env.API_HOST + 'os/v1/box/boxFreeCar/import' // 上传文件
export const exportBoxFreeCar = 'v1/box/boxFreeCar/export' // 导出免费车
// 固定车
export const getBoxMonthCar = 'v1/box/boxMonthlyCar/page' // 获取固定车列表
export const BoxMonthCar = 'v1/box/boxMonthlyCar' // 删除、更新和添加固定车
export const BoxMonthCarPermission = 'v1/box/boxMonthlyCar/power' // 获取和修改通道权限
export const checkPlateNumber = 'v1/box/checkPlate' // 校验车牌号
export const uploadBoxMonthCar = process.env.API_HOST + 'os/v1/box/boxMonthlyCar/import' // 上传文件
export const exportMonthCar = 'v1/box/boxMonthlyCar/export' // 导出固定车
export const BoxMonthCarCalc = 'v1/box/boxMonthlyCar/calculate' // 计算时间和费用
export const BoxMonthCarCharge = 'v1/box/boxMonthlyCar/recharge' // 充值
export const BoxMonthCarIssue = 'v1/box/boxMonthlyCar/reimport' // 批量下发和全部下发
// 未审核固定车
export const getUnCheckMonthCar = 'v1/box/boxMonthlyCar/page/noVerify' // 获取
export const checkMonthCar = 'v1/box/boxMonthlyCar/verify' // 批量审核、一键审核
// 通道
export const getBoxAllLocal = 'v1/box/boxLocal/list' // 获取所有通道
export const getBoxLocal = 'v1/box/boxLocal/page' // 获取通道列表
// 人工开闸记录
export const getBoxOpenRecord = 'v1/box/boxOpenRecord/page/'

// -------------- 进出管理 --------------- \\
// 在场记录
export const getInTmps = 'v1/inTmps/page' // 获取列表
export const deleteInTmps = 'v1/inOut/delteOneIn' // 删除选中列表
export const deleteAllInTmps = 'v1/inOut/delteAllIn/' // 删除所有
export const settingTmpCar = 'v1/settingTmpCar' // 临时车位数
export const exportInTmps = 'v1/inOut/exportIn' // 导出在场记录
export const getImage = 'v1/inOut/getInOutImage' // 获取图片
// 进出记录
export const getInOut = 'v1/inOut/page' // 获取进出记录
export const getInOutDetail = 'v1/inOut/details' // 获取进出详情
export const exportInOut = 'v1/inOut/exportInAndOut' // 导出进出记录
export const getInOutCount = 'v1/inOut/count' // 获取进出记录统计
// 异常出场
export const getAbnormalOut = 'pv/v1/error/order' // 异常记录结算

// -------------- 车场数据 --------------- \\
// 普通白名单
export const getNormalWhite = 'v1/monthlyCard/zhenshi/page' // 获取列表
export const NormalWhite = 'v1/monthlyCard/zhenshi' // 添加、编辑和删除数据
export const deleteAllNoramlWhite = 'v1/monthlyCard/deleteAllZhenshiMonthCardCar/' // 删除所有数据
export const oneToAnotherNormalWhite = 'v1/monthlyCard/oneToAnother/zhenshi' // 从一个相机向另外一个相机导白名单
export const uploadNormalWhiteFile = process.env.API_HOST + 'os/v1/ZhenshiMonthlyCardImpo' // 上传文件
export const exportNormalWhite = 'v1/monthlyCard/export' // 导出
export const calcTime = 'v1/park/zhengshi/calculate' // 计算时间
export const NormalWhiteCharge = 'v1/park/monthlyCardRecharge' // 充值
export const NomalWhitePlateCheck = 'v1/park/zhengshi/plateExist' // 验证车牌
// 普通白名单充值记录
export const normalCharge = 'v1/monthlyCardRecharge/zhenshi/page'
export const exportNormalCharge = 'v1/monthlyCardRecharge/zhenshi' // 导出普通白名单充值记录
// 高级白名单
export const getTopWhite = 'v1/park/otmMonthCard/page' // 获取列表
export const searchUserName = 'v1/park/searchUserName' // 查询名字
export const updateTopWhiteUser = 'v1/park/otmMonthCardUser' // 更新用户信息
export const deleteTopWhite = 'v1/park/otmMonthCardCar' // 删除
export const TopWhite = 'v1/park/otmMonthCard' // 更新和添加
export const deleteAllTopWhite = 'v1/park/deleteAllOtmMonthCardCar/' // 删除所有
export const uploadTopWhite = process.env.API_HOST + 'os/v1/otmMonthlyCardImpo'
export const exportTopWhite = 'v1/otm/exportOtm' // 导出
export const oneToAnotherTopWhite = 'v1/otm/oneToAnother' // 从一个相机向另外一个相机导白名单
export const getTomWhiteChargeRecord = 'v1/park/otmMonthCardRecharge/page' // 充值记录
export const exportTopWhiteChargeRecord = 'v1/park/otmMonthCardRecharge' // 导出一位多车充值记录
// 异常记录
export const getAbnormal = 'v1/park/abnormal/page' // 获取列表
export const Abnormal = 'v1/park/abnormal' // 新增、删除和更新
// 手动开闸记录
export const getOpenRecord = 'v1/park/openGateRecord/page' // 获取列表
export const OpenRecord = 'v1/park/openGateRecord' // 添加、更新和删除
// 黑名单
export const getBlackCard = 'v1/park/blackList/page' // 获取列表
export const BlackCard = 'v1/park/blackList' // 新增、删除、更新
// 事件记录
export const getEventRecord = 'v1/park/lprEvent/page' // 获取列表
export const EventRecord = 'v1/park/lprEvent' // 更新、新增和删除
// 特殊车
export const getSpecialCar = 'v1/park/specialCar/page' // 获取列表
export const SpecialCar = 'v1/park/specialCar' // 更新、删除和新增
// 交接记录
export const getTransfer = 'v1/park/handOver/page' // 获取列表
// 免费车
export const getFreeCar = 'v1/park/freecar/page' // 获取列表
export const FreeCar = 'v1/park/freecar' // 新增、更细和删除
// 渣土白名单
export const getToolWhite = 'v1/monthlyCard/tools/page' // 获取列表
export const ToolWhite = 'v1/monthlyCard/tools' // 新增、删除、更新和删除所有
export const exportToolWhite = 'v1/monthlyCard/tools/export' // 导出
export const uploadToolWhite = process.env.API_HOST + 'os/v1/zhatuMonthlyCardImpo' // 导入文件
// 充值规则
export const getChargeRules = 'v1/rechargeRules/select' // 充值规则
export const recharge = 'v1/park/otmMonthCardRecharge' // 高级白名单充值
export const getChargeRulesPage = 'v1/rechargeRules/page/' // 充值规则列表
export const ChargeRules = 'v1/rechargeRules' // 新增、更新和删除

// ---------------- 相机管理 ------------------ \\
export const getCamera = 'v1/tcpToken/list/' // 获取所有相机
export const getOutCamera = 'v1/tcpToken/check' // 获取所有出口相机
export const getInCamera = 'v1/tcpToken/check/in' // 获取所有入口相机
export const getInOnlineCamera = 'v1/getInAndOnline/' // 获取所有在线的入口相机
export const getOfflineCamera = 'v1/tcpToken/offLine/page' // 获取离线相机列表
export const getOffLineAnalysis = 'v1/camera/cameraOffline/page' // 获取离线分析
export const getOfflineCameraStatist = 'v1/tcpToken/offLine/statist/page' // 获取离线相机统计
export const exportOfflineCameraStatist = 'v1/tcpToken/offLine/statist/export' // 导出离线相机统计
export const clearCameraSetting = 'v1/g4/deleteAll' // 清空相机所有在场车辆和所有白名单
export const bindCamera = 'v1/g4/G4MacBing' // 绑定相机
export const FeeRules = 'v1/g4/feeRules' // 收费规则
export const testFeeRules = 'v1/sms/calculation/free' // 测试平台算费
export const FeeRulesSelect = 'v1/g4/chooseFeeRules' // 选择相机收费
export const getG4Mac = 'v1/tcpToken/common/page' // Mac状态
export const unBindCarmera = 'v1/tcpToken/unbind' // 解绑相机
// 高级设置
export const settingAll = 'v1/g4/downSettingAll' // 下载设置
export const SystemSetting = 'v1/g4/systemSetting' // 系统设置
export const Led = 'v1/g4/led' // 显示屏设置
export const cameraParams = 'v1/tcpToken/camaraRole' // 相机参数设置
// 流量监控
export const getDailyFlow = 'v1/flowPool/page' // 获取列表
export const getShareInfo = 'v1/flowPool/shareInfo' // 查询流量使用情况
export const setFlowBell = 'v1/flowPool/setFlowBell' // 设置警示值
export const getFlowBell = 'v1/flowPool/getFlowBell' // 获取警示值
export const switchWeb = 'v1/flowPool/switchWeb' // 开停
export const getIdcardInfo = 'v1/flowPool/card/page' // 获取卡信息
export const getIdcardPack = 'v1/flowPool/card/package' // 获取卡的加油包 / 叠加包套餐
export const getUserOfCards = 'v1/flowPool/card/alldata' // 获取当前用户的所有卡数据
export const getAllcardData = 'v1/flowPool/card/alldata/all' // 获取当前用户所有卡数并获取卡信息
// 研发远程
export const setting = 'v1/g4/g4Setting'

// -------------- 电子支付 ----------------- \\
// 无感支付
export const CCBParams = 'v1/ccb/ccbParams' // 获取和设置
// 小程序收费
export const getSmallProCharge = 'v1/feePush/page' // 获取列表
export const SmallProChargeBindUser = 'v1/feePush/bindUser' // 绑定用户
export const SmallProChargeGetUser = 'v1/feePush/getUser/' // 获取用户
export const SmallProChargeDeleteUser = 'v1/feePush' // 删除用户
// 生成二维码
export const QRCode = 'v1/pay/payUrl'
export const bluetoothCode = 'v1/pay/bluetoothUrl'
// 农信银支付
export const rccPayParams = 'v1/rccPayParams'
// 芝麻支付
export const sesamePay = 'v1/zhima/zhimaParams' // 芝麻无感支付参数接口

// -------------- 电子优惠券 --------------- \\
// 车场规则
export const ticketParkSetting = 'v1/ticket/ticketParkSetting' // 获取和设置
// 优惠券记录 ---- 车场的权限 优惠记录
export const getShops = 'v1/ticket/allShop/' // 获取所有的商家
export const getShopNotUsedTicket = 'v1/ticket/ticketTmps' // 获取商家未使用的优惠券
export const getShopUsedTicket = 'v1/ticket/pages' // 获取商家已使用的优惠券
// 商家充值记录  --------车场的权限
export const getShopsChargeRecords = 'v1/ticket/shopRecharge/page' // 获取列表
// 商家管理
export const getBuinessInfo = 'v1/ticket/shop/page' // 获取列表
export const BuinessInfo = 'v1/ticket/shop' // 新增、更新和删除
export const getBuinessPer = 'v1/shop/power/' // 获取二维码权限
export const setBuinessPer = 'v1/shop/power/update' // 保存二维码权限
export const addSubMoney = 'v1/ticket/shopRecharge' // 加减款
// 充值记录 -----商家权限
export const getRechargeRecords = 'v1/ticket/shopRecharge/page'
// 优惠券规则
export const getTicketRules = 'v1/ticket/shopRules/page' // 获取列表
export const TicketRules = 'v1/ticket/shopRules' // 添加、删除和更新
export const getTicketRulesPer = 'v1/shop/powerlist/' // 获取商家权限
export const erCodeOne = 'v1/ticket/ercode/one/' // 生成单次码
export const staticErCode = 'v1/ticket/ercode/static/' // 生成静态码
export const moveErCode = 'v1/ticket/ercode/move/' // 生成动态码
export const plateInset = 'pv/v1/ticket/bingding' // 车牌输入

// -------------- 设备管理 ----------------- \\
// 通道日志
export const getDeviceLogs = 'v1/simLog/page/'
// 通道状态
export const getDeviceStatus = 'v1/tcpToken/page/' // 获取列表
export const updateDeviceStatus = 'v1/tcpToken/update' // 更新
export const deleteDeviceStatus = 'v1/tcpToken' // 删除
export const switchById = 'v1/tcpToken/openDoor/' // 开闸
export const reboot = 'v1/tcpToken/reBoot/' // 重启相机
export const timeUp = 'v1/tcpToken/timeUp/' // 校时相机
export const getSnapshotById = 'v1/loop/debug/getSnapshot/' // 获取相机快照
export const getRacoById = 'v1/loop/debug/getRaco/' // 获取真实线圈
export const getVirloopById = 'v1/loop/debug/getVirloop/' // 获取虚拟线圈
export const setRaco = 'v1/loop/debug/setRaco' // 设置真实线圈
export const setVirloop = 'v1/loop/debug/setVirloop' // 设置虚拟线圈
export const setVoice = 'v1/g4/sendVioce' // 设置语音
export const getSimDetail = 'v1/simCard/' // 获取卡详情
export const dispTest = 'v1/g4/sendDisp' // 显示屏测试
export const Adv = 'v1/g4/ledAdvById' // 获取和修改广告语

// -------------- 远程升级 ----------- \\
// 操作记录
export const getOperateRecord = 'v1/camera/cameraOperation/page/' // 获取列表
export const OperateRecordClear = 'v1/cameraOperation/clear' // 清除升级任务
// 参数设置
export const ParamsSetting = 'v1/cameraOperation/settingParameters'
// 实时控制
export const sendCommand = 'v1/cameraOperation/sendCommand'
export const showCameraOrder = 'v1/cameraOrder' // 命令添加回显
// 通道状态
export const getLocalStatus = 'v1/camera/cameraRecord/page/'
// 相机文件
export const getCameraFiles = 'v1/camera/cameraFile/page/' // 获取列表
export const getFilesList = 'v1/camera/aiCameraFile/pageByMac' // 获取人脸识别相机文件列表
export const CameraFile = 'v1/camera/cameraFile' // 删除和下载
export const getCameraFile = 'v1/cameraOperation/loadCameraFile' // 获取相机的升级文件
// 升级文件
export const getUpGradeFile = 'v1/camera/cameraFile/upgrade' // 获取列表
export const uploadUpGradeFile = process.env.API_HOST + 'os/v1/camera/cameraFile' // 上传文件
export const upGradeFile = 'v1/cameraOperation/cameraUpgrade' // 升级相机

// 消息通知
export const getMsgTypeCount = 'v1/notify/count' // 获取不同类型已读和未读的总数
export const pageMsgByUserId = 'v1/notify/page' // 获取用户消息列表
export const getNotifySetting = 'v1/notify/getSetting' // 获取用户消息通知设置
export const setNotifyConfig = 'v1/notify/setting' // 设置消息通知
export const getMsgDetailedInfo = 'v1/notify/msg/' // 获取消息文本详细信息
export const getNotify = 'v1/notify/send/page' // 查看发送过的消息
export const sendNotify = 'v1/notify/send' // 发送消息
export const setReadAll = 'v1/notify/setReadAll' // 标记所有为已读

// 产品追踪
export const searchPage = 'v1/ai/cam/page' // 查询
export const addCam = 'v1/ai/cam' // 添加
export const adaptCam = 'v1/ai/cam/info' // 详情修改
export const doCamTitle = 'v1/ai/cam/title' // 常用操作类型文本
export const historyCount = 'v1/ai/cam/statist/count' // 统计总数
export const statistCamLine = 'v1/ai/cam/statist/line'
export const statistCamPie = 'v1/ai/cam/statist/pie'

// 建行无感支付
export const getPageOrder = 'v1/ccb/orderTmp/count' // 统计分页记录数据
export const getPage = 'v1/ccb/orderTmp/page' // 分页查询建行入口预付支付成功但没有使用的订单
export const getPageCount = 'v1/ccb/orderTmp/count' // 分页查询建行入口预付支付成功但没有使用的订单 统计

// -------------------- 售后平台 -------------------- \\

// // ------------- 人员管理-------------\\
// export const ASUser = 'as/user' // 获取、新增和删除
// export const updateASUser = 'as/user/update' // 更新

// // ------------ 任务管理 -------------- \\
// export const getASTask = 'as/problemNoImg' // 获取分页
// export const deleteASTask = 'as/problem' // 删除
// export const ASTaskPic = 'as/problemDetail/' // 获取图片

// // ------------ 物业评价 -------------- \\
// export const getASStaffEvaluate = 'as/evaluation' // 获取列表

// // ------------ 解决方案 -------------- \\
// export const getASSolution = 'as/solution' // 获取列表
// export const getASSolutionPic = 'as/getSolutionById/' // 获取图片

// // ------------ 接单记录 -------------- \\
// export const getOrderRecords = 'as/userProblem' // 获取列表

// // ----------- 人员地址 ---------- \\
// export const getOrderAddress = 'as/userAddress' // 获取列表

// 用户反馈
export const suggestionAdd = '/pv/v1/suggestion' // 新增
export const suggestion = 'v1/suggestion' // 获取、删除
export const picSuggestion = 'v1/app/suggestion/' // 获取图片
export const uploadSugPic = process.env.API_HOST + 'os/v1/suggestionImg' // 上传图片

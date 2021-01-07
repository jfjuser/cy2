
// =------------------------ 车场云 ------------------ \\

// 超管
export const apiFindUserPhoto = 'v1/ai/showPhoto' // 获取用户图片
export const apiUpdataPhoto = 'pv/v1/sms/aiUser/updateMostPhoto' // 替换照片

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
export const reDownFa = 'v1/ai/aiUser/rePush' // 重新下发
/** ********  【 新增 api 】  **********/
export const apiUserCheckPhoto = '/v1/ai/aiUser/notCheckPhoto' // 校验图片
export const apiUserEditPhoto = '/v1/ai/aiUser/replacePhoto' // 图片修改
// end
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
export const setCountVip = 'v1/dtype/agency/allocation' // 设置会员积分
// 新增
export const ApiPriorityUpload = 'v1/dtype/agency/highest' // 优先级下发
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
export const getTasks = 'v1/departmentTask/page' // 获取默认任务
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
// 网联客
export const wanglianke = '/v1/wanglianke/wangliankeParams/' // 网联客
export const wanglianke1 = '/v1/wanglianke/wangliankeParams' // 更新或新增参数

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
// app广告
export const getAppImg = 'v1/app/advertising/page' // 获取列表
export const uploadAppImg = process.env.API_HOST + 'v1/app/advertising'
export const AppImg = 'v1/app/advertising' // 新增、删除和获取
// 下级广告
export const getLevelAdv = 'v1/subordinate/publicize' // 获取列表
// 推送广告
export const pushAdv = 'v1/push/adv' // 分页查询、新增、修改、删除、单条查询
export const enablePushAdv = 'v1/push/adv/enable' // 启用广告
export const getSimplePushAdv = 'v1/push/adv/simple' // 简要信息查询
export const verifyPushAdv = 'v1/push/adv/verify' // 审核
export const getAdvModelImage = 'v1/push/model/getImage/' // 获取广告样式示例图片
// 推送流水
export const pushWater = 'v1/push/adv/records' // 推送流水记录
// 推送广告时间段
export const pushTime = 'v1/push/time'
export const checkPushTime = 'v1/push/time/check' // 校验时间段合法
// 部门广告资源使用情况
export const getAdvUsingInfo = 'v1/push/advUsing'

// 广告规则
export const pushRules = 'v1/push/feeRules'
export const pagePushRules = 'v1/push/page/feeRules'
export const listPushFeeRules = 'v1/push/list/feeRules'

// 广告充值记录
export const pagePushAdvRecharge = 'v1/push/page/advRecharge'
export const pushRecharge = 'v1/push/recharge'
// 判断能不能使用充值按钮(自助充值或上级充下级)
export const isUseRecharge = 'v1/push/isUseRecharge'
export const loadZzRechargeRules = 'v1/push/loadZzRechargeRules'
export const advChangeWxPay = 'v1/push/advChangeWxPay' // 微信支付下单

// 消息通知
export const getMsgTypeCount = 'v1/notify/count' // 获取不同类型已读和未读的总数
export const pageMsgByUserId = 'v1/notify/page' // 获取用户消息列表
export const getNotifySetting = 'v1/notify/getSetting' // 获取用户消息通知设置
export const setNotifyConfig = 'v1/notify/setting' // 设置消息通知
export const getMsgDetailedInfo = 'v1/notify/msg/' // 获取消息文本详细信息
export const getNotify = 'v1/notify/send/page' // 查看发送过的消息
export const sendNotify = 'v1/notify/send' // 发送消息
export const setReadAll = 'v1/notify/setReadAll' // 标记所有为已读

// 专用统计模块
export const getAdvStatist = 'v1/statist/adv' // 广告统计
export const getAdvStatistPie = 'v1/statist/adv/pie' // 广告统计 - 只返回饼图

// 产品追踪
export const searchPage = 'v1/ai/cam/page' // 查询
export const addCam = 'v1/ai/cam' // 添加
export const adaptCam = 'v1/ai/cam/info' // 详情修改
export const doCamTitle = 'v1/ai/cam/title' // 常用操作类型文本
export const historyCount = 'v1/ai/cam/statist/count' // 统计总数
export const statistCamLine = 'v1/ai/cam/statist/line'
export const statistCamPie = 'v1/ai/cam/statist/pie'

// -------------------- 人脸识别平台 ---------------- \\
// --------- 平台收费 -------- \\
export const faceMonthlyFeeWxPay = 'v1/yunPay/faceMonthly'
export const facePointFeeWxPay = 'v1/yunPay/facePoint'
export const reflushLoginType = 'v1/reflushLoginType'
export const faceOrderSearch = 'v1/yunPay/faceOrderSearch' // 查询充值情况
// --------- 基础数据 -------- \\
// 进出记录
export const getAIInOut = 'v1/ai/aiInOut/page' // 获取列表
export const getAIPic = 'v1/ai/aiGetCameraFile/inOutPhoto/' // 获取图片
export const syncAIInOut = 'v1/ai/aiInOut/syncInOutRecord' // 同步进出记录
export const getAITreeInOut = 'v1/ai/aiInOut/tree/page' // 获取树列表
export const exportInout = 'v1/ai/aiInOutRecords/export' // 导出进出记录
// export const exportInout = 'v1/ai/aiInOutRecordExport/export' // 导出进出记录
// 实时统计
export const getInoutIntime = 'v1/ai/aiInOutAnalyse/page' // 获取离场在场进场次数

// -------- 相机维护 --------- \\
// 体温相机---------2020//
export const cameraCon = 'v1/ai/aiTokenTemperature/doBindCamera' // 绑定体温人脸机
export const seekRecord = 'v1/ai/aiTokenSnapshotRecord/page' // 查询比对记录
export const seekImage = 'v1/ai/aiTokenSnapshotRecord/getRecordPhoto' // 查询比对图片
// 体温用户
export const doFaceUser = 'v1/ai/aiUserTemperature' // 添加用户 post adapt -- put
export const seekAllUser = 'v1/ai/aiUserTemperature/page' // 查询所有的用户
export const seekAllCamera = 'v1/ai/aiTokenTemperature' // 查看通道
export const seekBackShow = 'v1/ai/aiTokenTemperature/getPermissionByUserIdAndDepId' // 回显通道

// 绑定相机
export const AIBindCamera = 'v1/ai/aiToken/bindCamera'
// 相机管理
export const getAICamera = 'v1/ai/aiToken/pageByDepartmentId' // 获取所有通道
export const getAICameras = 'v1/ai/aiToken/pageByDepartmentIdAndCameraType' // 获取所有通道
export const getAddTime = 'v1/workSchedule' // 添加设置时间
export const getDate = 'v1/workSchedule' // 查询数据
export const getDates = 'v1/workSchedules' // 查询数据
export const getBind = 'v1/tokenWorkScheduleRel' // 绑定相机
export const getUnbind = 'v1/unbindRel' // 解绑相机
export const editAICameraName = 'v1/ai/aiToken/update' // 修改通道名称
export const updateCameraAl = 'v1/ai/aiToken/upgrade' // 升级相机
export const syncState = 'v1/ai/aiLocalPermission/updateState' // 相机同步状态修改
export const openOutLog = 'pv/v1/ai/oa/openRelayRecord/page' // 查询开闸记录
// 生产部测试
export const getAIProductionTest = 'v1/ai/aiToken/pageByThree' // 获取列表
export const bindProdAICamera = 'v1/ai/aiToken/bindCamera/ids' // 绑定相机
export const unBindProdAICamera = 'v1/ai/aiToken/unbindCamera/ids' // 解绑相机
// ----1 华安人脸相机
export const unBindAICamera = 'v1/ai/aiToken/unbindCamera/' // 解绑相机
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

// ------- 人脸识别 ------- \\
// 人脸参数设置
export const cameraAIParams = 'v1/ai/cameraType/style' // 获取、提交基础参数
export const cameraAIOneParams = 'v1/ai/camera/json' // 获取和设置单个相机的参数
// 审核设置
export const AISetting = 'v1/ai/aiCheckSetup' // 获取和设置
export const AISettings = 'v1/ai/aiCheckSetupNew' // 获取和设置-无需权限
export const deleteAIInOutTime = 'v1/ai/cameraTable/delTimeLimitTable' // 删除时间段
export const AIInOutTime = 'v1/ai/aiInOutTime' // 获取，更新和添加列表

export const updateCamera = 'v1/ai/aiApp/upgrade' // 升级安卓人脸的相机
export const optionsOrder = 'v1/ai/aiSetParam' // 添加修改删除命令接口
export const deviceReboot = 'v1/ai/aiApp/appRestart' // 安卓相机设备重启
export const aKeyOpened = 'v1/ai/aiApp/openRelay' // 安卓相机一键开闸
export const dataReset = 'v1/ai/aiApp/restore' // 安卓相机恢复出厂设置
// 账户管理
export const checkAICamera = 'v1/ai/aiToken/check/' // 获取所有相机
export const getAccountCamera = 'v1/ai/aiDuyCompany/getDutyCompanyChannelId' // 获取账户下的通道
export const checkAILinuxCamera = 'v1/ai/aiToken/check/linux/' // 获取所有Linux相机
export const getAiDuyCompany = 'v1/ai/aiDuyCompany/page' // 获取列表
export const AiDuyCompany = 'v1/ai/aiDuyCompany' // 新增、更新、删除、删除所有和检查手机号
export const uploadAiDuyCompany = process.env.API_HOST + 'os/v1/ai/aiDuyCompany/import' // 上传文件
export const updateAIPassword = 'v1/ai/aiDuyCompany/updatePsw' // 修改密码
export const checkAllow = 'v1/ai/aiDuyCompany/checkIsLoginAndPower'
export const AIpermission = 'v1/ai/aiLocalPermission' // 查询和修改通道权限
export const AIpermissions = 'v1/ai/batch/aiLocalPermission' // 批量修改通道权限
export const departments = 'v1/ai/batch/department/aiLocalPermission' // 部门更新
export const checkTypes = 'v1/ai/aiDuyCompany/updateBatchCheckDutyCompany' // 批量审核账户
// 新增
export const ApiStudentUpload = 'v1/ai/aiUser/student/export/' // 学生数据导出
// =======================================
// 用户批量导入
export const getAIUserImport = 'v1/ai/aiUserImport/page' // 获取列表
export const updateAIUserImport = 'v1/ai/aiUserImport/update' // 修改用户信息
//  process.env.API_HOST +
export const updateAIUserImportPhoto = process.env.API_HOST + 'v1/ai/aiUserImport/photo/update' // 修改单张图片
export const AIUserImportPhoto = 'v1/ai/aiUserImport/photo/import' // 导入所有图片
export const deleteAIUserImport = 'v1/ai/aiUserImport' // 批量删除
export const AIUserImport = process.env.API_HOST + 'os/v1/ai/aiUserImport/aiImport' // 导入Excal文件
export const checkAIUserImportPhoto = 'v1/ai/aiUser/checkPhoto/photo' // 校验单张图片是否合格
export const exportAIUserImport = 'v1/ai/aiUser/export' // 导出模板
// 新增
export const ApiExportUnqualifiedList = 'v1/ai/aiUser/error/export/' // 导出不合格清单
// 小区房屋信息
export const createModel = 'v1/buildingInfo/insertRoomsTemplate' // 添加模板
export const showModel = 'v1/buildingInfo/echoTemplate' // 回显模板
export const deleteModel = 'v1/buildingInfo/deleteRoomsTemplate' // 删除模板
export const deleteAllModel = 'v1/buildingInfo/deleteAll' // 删除所有
export const saveHouseInfo = 'v1/buildingInfo/insertRoomsInfo' // 存储房间号以及模板信息到后端
export const showBuilding = 'v1/buildingInfo/getBudsNameByDepartmentId' // 回显楼栋
export const showFloor = 'v1/buildingInfo/getFloorByDepartmentIdAndBuilding' // 回显楼层
export const showRoom = 'v1/buildingInfo/getRoomByDepartmentIdAndBuildingAndFloor' // 回显房间
export const userTemplateReplaceRooms = 'v1/buildingInfo/userTemplateReplaceRooms' // 应用模板
// 黑名单
export const addBlackUser = 'v1/ai/aiUser/insertBlacklistUser' // 添加黑名单用户信息
export const addBatchBlackUser = 'v1/ai/aiUser/insertBatchBlacklistUser' // 批量添加黑名单用户
// 部门树
export const getAITreeData = 'v1/ai/aiDuyCompany/getTree' // 获取账户树和用户数据
export const getAIDuyUser = 'v1/ai/aiUser/tree/page' // 获取部门所有用户信息
export const deleteAIDuyUser = 'v1/ai/aiDuyCompany/tree' // 删除树节点
export const getAIDuyDetail = 'v1/ai/aiDuyCompany/one/' // 获取树节点详情
// - 导入失败
export const getAIErrorData = 'v1/ai/aiDutyCompanyTmp/page' // 获取列表
export const AIErrorData = 'v1/ai/aiDutyCompanyTmp' // 修改、删除和删除所有
// 成员信息
export const getAIMember = 'v1/ai/aiUser/pageByDutyCompanyId' // 获取列表
export const AIMember = 'v1/ai/aiUser' // 新增、修改、删除和删除所有
// export const uploadAImMember = process.env.API_HOST + 'os/v1/ai/aiUser/checkPhoto' // 图片上传
export const uploadAImMember = process.env.API_HOST + 'os/v1/ai/aiUser/faceDetect' // 图片上传
export const faceDetect = process.env.API_HOST + 'os/v1/ai/aiUser/faceDetect'
export const checkIsAddAIMember = 'v1/ai/aiUser/isAdd' // 检测是否可以添加成员
export const checkAIMemeber = 'v1/ai/aiUser/isCheck' // 审核用户
export const seeAIMemberPhoto = 'v1/ai/aiUser/getPhoto/' // 查看图片
export const updateMemberPhoto = 'v1/ai/aiUser/updatePhoto' // 修改图片
export const checkAIMemberPhoto = 'v1/ai/aiUser/checkPhoto' // 检测图片
export const noCheckAIMemberPhoto = 'v1/ai/aiUser/noCheckPhoto' // 跳过校验检测图片
export const getUUid = 'v1/ai/aiUser/getCardNum' // 获取一个UUID
export const deleteAIMembers = 'v1/ai/aiUser/departmentId' // 删除所有 用户管理
export const getWxQRcode = 'pv/v1/wx/getWxQRcodeByDepartId' // 获取关注二维码
// 成员管理
export const usersAIManage = 'v1/ai/aiUser/page'
export const typeCheck = 'v1/ai/aiUser/batch/update/isCheck' // 批量审核
export const getUserChannel = 'v1/ai/aiUser/getChannel' // 获取用户通道
// ---------- 远程维护 ---------- \\
// 相机文件
export const getAICameraFile = 'v1/camera/aiCameraFile/page/' // 获取列表
export const getLinuxAIFiles = 'v1/cameraOperation/loadCameraFileAi' // 获取Linux文件列表
export const getAndroidAIFiles = 'v1/ai/aiAppGetLog' // 获取Android文件列表
export const deleteAICameraFile = 'v1/camera/cameraFile' // 删除文件
export const downAIFile = 'v1/camera/cameraFile/' // 下载文件
// 升级文件
export const getAIFile = 'v1/camera/aiCameraFile/upgrade' // 获取文件 根据相机类型
export const uploadAICameraFile = process.env.API_HOST + 'os/v1/camera/cameraFile' // 上传文件
export const UpgradeAICamera = 'v1/cameraOperation/cameraUpgradeAi' // 升级相机
export const UpgradeAIHttpCamera = 'v1/aiHttpUpgrade' // 升级相机
export const outSideType = 'v1/camera/outSide' // 外部对接升级相机
// 参数设置
export const AIParamsSetting = 'v1/cameraOperation/settingParametersAi'
export const AICameraParams = 'v1/ai/aiCameraConfigIni' // 获取列表、添加和修改
export const AIcameraParamsList = 'v1/cameraOperation/setParList' // 参数设置--平台相机使用
// 实时控制
export const AIsendCommand = 'v1/cameraOperation/sendCommandAi'
export const getOrderList = 'v1/ai/aiSetParam/list' // 获取所有实时控制命令
export const AIsentCommandList = 'v1/cameraOperation/sendCommandList' // 发送控制命令给相机--平台相机使用 '
// 升级日志
export const getUpgradeLog = 'v1/camera/cameraOperation/page' // 获取列表'
// 建行无感支付
export const getPageOrder = 'v1/ccb/orderTmp/count' // 统计分页记录数据
export const getPage = 'v1/ccb/orderTmp/page' // 分页查询建行入口预付支付成功但没有使用的订单
export const getPageCount = 'v1/ccb/orderTmp/count' // 分页查询建行入口预付支付成功但没有使用的订单 统计

// --------- 考勤管理 -------------- \\
// 班次管理
export const getAIShifts = 'v1/workShift/page' // 获取列表
export const AIShifts = 'v1/workShift' // 新增、删除、编辑和详情
export const getAIShiftsList = 'v1/workShift/list' // 获取下拉列表
// 考勤组
export const AIAttendGroup = 'v1/workCheckGroup' // 获取列表、新增、修改和删除
export const AIAttendGroupDetail = 'v1/workCheckGroup/detail' // 获取详情
export const AIDuyCompanyAndAiUser = 'v1/ai/aiDuyCompanyAndAiUser/getTree' // 根据部门获取下级部门和用户-考勤组内使用
export const AIAttendGroupShifts = 'v1/workCycle' // 获取、新增用户排班
export const exportAIAttendGroupShifts = 'v1/workShift/export' // 导出排班
// -------------------- 考勤统计 ------------------- \\
// 每日统计
export const AIDailyCount = 'v1/workRecord/page' // 获取列表
export const exportAIDailyCount = 'v1/workRecord/export' // 导出报表
export const updateAIDailyCount = 'v1/workRecord' // 修改考勤
export const applyOverTime = 'v1/workMonthCount/applyOverTime' // 申请跨天加班
// 每月统计
export const AIMonthlyCount = 'v1/workMonthCount/page' // 获取列表
export const exportAIMonthlyCount = 'v1/workMontht/export' // 导出报表
export const setMonthTime = 'v1/workMonthCount/updateAttendanceDate' // 设置考勤起始时间
export const getMonthTime = 'v1/workMonthCount' // 获取起始时间
// 核销统计
export const AIWriteOff = 'v1/workWriteOff/page' // 获取列表
export const deleteAIWriteOff = 'v1/workWriteOff' // 删除
// 考勤申请信息
export const applyOverTimet = 'v1/workMonthCount/applyOverTime/check' // 审核加班 /id/status 0 审核失败  1 审核成功
// export const deleteAIWriteOff = 'v1/workWriteOff' // 删除
// --------- 高级功能 -------------- \\
// 流量统计
export const getFlow = 'v1/ai/aiDownloadCount/page' // 获取流量记录月统计
export const getCountFlow = 'v1/ai/aiDownloadFileRecord/page' // 获取流量记录次数统计
export const getPostSetting = 'v1/aiInOutPushConfig' // 获取
export const createQRcode = 'v1/ai/barCode/produceCode' // 根据内容生成二维码
// -------------------工地管理-------------------- \\
// 工地管理第三方协议需要的密钥验证等信息
export const getFullInfo = 'v1/thirdProtocolPram/get' // 根据部门id获取所有
export const delInfo = 'v1/thirdProtocolPram/delete' // 删除
export const addInfo = 'v1/thirdProtocolPram/insert' // 添加修改
export const getRemark = 'v1/thirdProtocol/get' // 根据协议获取填写备注
// LED屏
export const getMac = 'v1/ai/ledApp/makeLedBX5E1' // 生成一个默认控制卡序列号
export const validtorMac = 'v1/ai/ledApp' // 校验app是否连接或MAC是否填写错误
export const bindApp = 'v1/ai/ledApp/bindApp' // 绑定APP
// 通道管理
export const gainAllLedApp = 'v1/ai/ledApp/page' // 获取部门所有显示屏控制App
export const unbind = 'v1/ai/ledApp/unBind' // 解绑
export const backShow = 'v1/ai/ledApp/listPermission' // 获取LED APP的主控相机
export const updateParams = 'v1/ai/ledApp/update' // 修改相关参数
export const ledAppSetAdv = 'v1/ai/ledApp/setAdv' // 设置提示语
export const ledAppTurnOff = 'v1/ai/ledApp/turnOff' // 关机
export const ledAppTurnOn = 'v1/ai/ledApp/turnOn' // 开机
export const ledAppSyncWhiteList = 'v1/ai/ledApp/syncWhiteList' // 同步白名单
export const ledAppDeleteWhiteList = 'v1/ai/ledApp/deleteWhiteList' // 清空白名单
// 工地工种类型
export const delWorkType = 'v1/workerType' // 根据id删除
export const addWorker = 'v1/workerType/insert' // 添加
export const adaptWorker = 'v1/workerType/update' // 修改
export const typeManage = 'v1/workerType/list' // 工种管理回显所有工种以及勾选情况
export const addTypeUser = 'v1/workerType/list/addUser' // 用户添加选择工种
export const defaultGo = 'v1/workerType/insertDefault' // 勾选的默认工种

export const pageLedApp = 'v1/ai/ledApp/page'
export const listCheck = 'v1/ai/ledApp/listCheck'
export const ledSetting = 'v1/ai/ledSetting' // LED管理
export const fuzzySearch = 'v1/ai/ledApp/likeSelect/page' // 所有APP和控制卡平台模糊查询

// -------------------- 售后平台 -------------------- \\

// ------------- 人员管理-------------\\
export const ASUser = 'as/user' // 获取、新增和删除
export const updateASUser = 'as/user/update' // 更新

// ------------ 任务管理 -------------- \\
export const getASTask = 'as/problemNoImg' // 获取分页
export const deleteASTask = 'as/problem' // 删除
export const ASTaskPic = 'as/problemDetail/' // 获取图片

// ------------ 物业评价 -------------- \\
export const getASStaffEvaluate = 'as/evaluation' // 获取列表

// ------------ 解决方案 -------------- \\
export const getASSolution = 'as/solution' // 获取列表
export const getASSolutionPic = 'as/getSolutionById/' // 获取图片

// ------------ 接单记录 -------------- \\
export const getOrderRecords = 'as/userProblem' // 获取列表

// ----------- 人员地址 ---------- \\
export const getOrderAddress = 'as/userAddress' // 获取列表

// 用户反馈
export const suggestionAdd = '/pv/v1/suggestion' // 新增
export const suggestion = 'v1/suggestion' // 获取、删除
export const picSuggestion = 'v1/app/suggestion/' // 获取图片
export const uploadSugPic = process.env.API_HOST + 'os/v1/suggestionImg' // 上传图片

// 平台收费
export const pagePointsRules = 'v1/face/rules/page'
export const pointsRules = 'v1/face/rules'
export const pagePointsRecords = 'v1/face/pointsRecords'
export const points = 'v1/face/points'

export const getEventOpen = 'v1/face/eventOpen' // 获取收费功能有没开启的状态

// 回收站
export const pageRecoveryWhite = 'v1/recovery/white/page'
export const recoveryWhite = 'v1/recovery/white/ids'
export const pageRecoveryWhiteDetail = 'v1/recovery/white/page/ids' // 查看
export const recoveryWhiteDetail = 'v1/recovery/white/come/ids' // 恢复单个

// 公众号、小程序绑定和管理
export const wxManager = 'v1/face/wx'

// 微信自定义菜单
export const WXMemu = 'v1/faceWxMemu'

// 收费设置
export const feeEvent = 'v1/face/event'
export const pageFeeEvent = 'v1/face/page/event'

// 工作台
export const getPoint = 'v1/ai/websiteConsole/getPoint' // 获取积分
export const getRecord = 'v1/ai/websiteConsole/countByDutyCompanyAndAiUser' // 审核人数
export const getMessageIsYUN = 'v1/ai/websiteConsole/getMessageIsYUN' // 获取快报列表
export const getAuditList = 'v1/ai/websiteConsole/listByUncheckDutyCompany' // 获取待审批列表
export const getNoteList = 'v1/ai/websiteConsole/getNotePadsByDepartmentIdAndUserId' // 获取便签
export const insertNoteList = 'v1/ai/websiteConsole/insertNotepads' // 添加便签
export const updateNoteList = 'v1/ai/websiteConsole/updateNotePads' // 更新便签
export const aiNotify = 'v1/ai/aiNotify' // 获取物业通知栏

// 广告分类
export const searchAdv = 'v1/push/model'
export const checkAdv = process.env.API_HOST + 'v1/push/model'

// 考勤组申请
export const listWorkCheckGroupForAll = 'v1/listWorkCheckGroupForAll' // 获取考勤组列表
export const checkEmployeeAndAddToGroup = 'v1/company/checkEmployeeAndAddToGroup' // 审核是否通过考勤组

// 新增接口
export const whiteBlackList = 'v1/ai/aiUser/changeUserType' // 黑白名单转化
export const getUnit = 'v1/buildingInfo/getBuildingsName' // 获取该模板应用的楼栋
export const delUnit = 'v1/buildingInfo/deleteBuilding' // 删除单元
export const changeVisitor = 'v1/ai/aiUser/changeVisitorToUser' // 访客转非访客
export const getAItokens = 'v1/ai/aiDuyCompany/companyRelAiToken/' // 获取aitokens
export const getErrorPage = 'v1/ai/aiUser/getErrorPage' // 未同步
export const getStatus = 'v1/ai/aiDuyCompany/getStatus/' // 获取状态
export const rechargeRecord = '/v1/box/rechargeRecord/page' // 车场云查看固定车充值记录接口
export const getParamByDepartmentId = 'v1/param/getParamByDepartmentId/' // 根据部门Id获取参数
export const getDefaultParam = 'v1/param/getDefaultParam' // 获取默认参数
export const preservationParam = 'v1/param' // 保存修改的参数接口

// 有关查询问题图片的接口
export const getErrorPhoto = 'v1/param/getErrorPhoto/' // 获取部门所有问题图片记录
export const batchDetect = 'v1/param/batchDetect/' // 检测部门问题图片
export const getWaitTime = 'v1/param/getWaitTime/' // 获取检测部门问题图片的时间
export const isAdmin = '/v1/param/isAdmin' // 请求是否为管理员
export const getQueue = '/v1/param/getQueue/' // 检测当前部门是否在检测图片
export const faceDetectOpen = process.env.API_HOST + '/v1/openapi/faceDetectOpen'
export const business = '/v1/business/page'
export const addBusiness = '/v1/business/addBusiness'
export const delBusiness = 'v1/business'

// 策略管理
export const listStrategy = 'v1/strategy/listStrategy' // 查询
export const insertStrategy = 'v1/strategy/insert' // 新增
export const updateStrategy = 'v1/strategy/update' // 修改
export const delStrategy = 'v1/strategy/delStrategy' // 删除
export const listStrategyRule = 'v1/strategy/rule/listStrategyRule/' // 策略规则查询
export const insertRule = 'v1/strategy/rule/insert' // 策略规则新增
export const updateRule = 'v1/strategy/rule/update' // 策略规则修改
export const delStrategyRule = 'v1/strategy/rule/delStrategyRule' // 策略规则删除
export const distributionListStrategyRule = 'v1/strategy/listStrategyRule/'
export const isPush = 'v1/ai/aiUser/push/'
export const coerceUnbindCamera = 'v1/ai/aiToken/coerceUnbindCamera/' // 用来进行强制解绑

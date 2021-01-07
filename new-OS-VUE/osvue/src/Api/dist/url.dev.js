"use strict";
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteInTmps = exports.getInTmps = exports.getBoxOpenRecord = exports.getBoxLocal = exports.getBoxAllLocal = exports.checkMonthCar = exports.getUnCheckMonthCar = exports.BoxMonthCarIssue = exports.BoxMonthCarCharge = exports.BoxMonthCarCalc = exports.exportMonthCar = exports.uploadBoxMonthCar = exports.checkPlateNumber = exports.BoxMonthCarPermission = exports.BoxMonthCar = exports.getBoxMonthCar = exports.exportBoxFreeCar = exports.uploadBoxFreeCar = exports.BoxFreeCar = exports.getBoxFreeCar = exports.createAdvText = exports.getAdv = exports.getAdvPic = exports.uploadAdvs = exports.Advs = exports.exportAppFile = exports.deleteAppFile = exports.uploadAppFile = exports.getAppUpgrade = exports.VersionInfo = exports.getVersionInfo = exports.UserLog = exports.uploadDoc = exports.deleteDocuments = exports.getAllDocuments = exports.saveWord = exports.getWord = exports.exportDescriptions = exports.exportWhite = exports.uploadWhite = exports.uploadDescriptions = exports.templateInfo = exports.Task = exports.getTask = exports.givePermissionEr = exports.lookRolesPermisson = exports.RolesPermissonOnly = exports.RolesPermisson = exports.Roles = exports.createDtypeRoles = exports.getDtypeRoles = exports.DepType = exports.ApiPriorityUpload = exports.setCountVip = exports.checkAllTypeInfo = exports.updateDepart = exports.setDepTypeCanCreate = exports.getDepTypeCanCreate = exports.DepTypePermission = exports.getDepTypeByLevelPage = exports.getDepTypeByLevel = exports.getSysName = exports.getDepTypeById = exports.getDepartmentTree = exports.LogoUrl = exports.DepBuiness = exports.getDepTransport = exports.editDepConfig = exports.department = exports.getDep = exports.getAllDepartment = exports.Permission = exports.deletePermission = exports.getFunction = exports.createRoles = exports.getRoles = exports.apiUserEditPhoto = exports.apiUserCheckPhoto = exports.reDownFa = exports.UserRole = exports.User = exports.getUsers = exports.updatePassword = exports.getUserName = exports.createAdmin = exports.getAdmin = exports.editPassword = exports.setLogo = exports.seeLogo = exports.updateUser = exports.getUserInfo = exports.depData = exports.dataView = exports.statist = exports.cloudData = exports.reflushToken = exports.autoLogin = exports.login = exports.apiUpdataPhoto = exports.apiFindUserPhoto = void 0;
exports.addSubMoney = exports.setBuinessPer = exports.getBuinessPer = exports.BuinessInfo = exports.getBuinessInfo = exports.getShopsChargeRecords = exports.getShopUsedTicket = exports.getShopNotUsedTicket = exports.getShops = exports.ticketParkSetting = exports.sesamePay = exports.rccPayParams = exports.bluetoothCode = exports.QRCode = exports.SmallProChargeDeleteUser = exports.SmallProChargeGetUser = exports.SmallProChargeBindUser = exports.getSmallProCharge = exports.CCBParams = exports.setting = exports.getAllcardData = exports.getUserOfCards = exports.getIdcardPack = exports.getIdcardInfo = exports.switchWeb = exports.getFlowBell = exports.setFlowBell = exports.getShareInfo = exports.getDailyFlow = exports.cameraParams = exports.Led = exports.SystemSetting = exports.settingAll = exports.unBindCarmera = exports.getG4Mac = exports.FeeRulesSelect = exports.testFeeRules = exports.FeeRules = exports.bindCamera = exports.clearCameraSetting = exports.exportOfflineCameraStatist = exports.getOfflineCameraStatist = exports.getOffLineAnalysis = exports.getOfflineCamera = exports.getInOnlineCamera = exports.getInCamera = exports.getOutCamera = exports.getCamera = exports.ChargeRules = exports.getChargeRulesPage = exports.recharge = exports.getChargeRules = exports.uploadToolWhite = exports.exportToolWhite = exports.ToolWhite = exports.getToolWhite = exports.FreeCar = exports.getFreeCar = exports.getTransfer = exports.SpecialCar = exports.getSpecialCar = exports.EventRecord = exports.getEventRecord = exports.BlackCard = exports.getBlackCard = exports.OpenRecord = exports.getOpenRecord = exports.Abnormal = exports.getAbnormal = exports.exportTopWhiteChargeRecord = exports.getTomWhiteChargeRecord = exports.oneToAnotherTopWhite = exports.exportTopWhite = exports.uploadTopWhite = exports.deleteAllTopWhite = exports.TopWhite = exports.deleteTopWhite = exports.updateTopWhiteUser = exports.searchUserName = exports.getTopWhite = exports.exportNormalCharge = exports.normalCharge = exports.NomalWhitePlateCheck = exports.NormalWhiteCharge = exports.calcTime = exports.exportNormalWhite = exports.uploadNormalWhiteFile = exports.oneToAnotherNormalWhite = exports.deleteAllNoramlWhite = exports.NormalWhite = exports.getNormalWhite = exports.getAbnormalOut = exports.getInOutCount = exports.exportInOut = exports.getInOutDetail = exports.getInOut = exports.getImage = exports.exportInTmps = exports.settingTmpCar = exports.deleteAllInTmps = void 0;
exports.getUnbind = exports.getBind = exports.getDates = exports.getDate = exports.getAddTime = exports.getAICameras = exports.getAICamera = exports.AIBindCamera = exports.seekBackShow = exports.seekAllCamera = exports.seekAllUser = exports.doFaceUser = exports.seekImage = exports.seekRecord = exports.cameraCon = exports.getInoutIntime = exports.exportInout = exports.getAITreeInOut = exports.syncAIInOut = exports.getAIPic = exports.getAIInOut = exports.faceOrderSearch = exports.reflushLoginType = exports.facePointFeeWxPay = exports.faceMonthlyFeeWxPay = exports.statistCamPie = exports.statistCamLine = exports.historyCount = exports.doCamTitle = exports.adaptCam = exports.addCam = exports.searchPage = exports.getAdvStatistPie = exports.getAdvStatist = exports.setReadAll = exports.sendNotify = exports.getNotify = exports.getMsgDetailedInfo = exports.setNotifyConfig = exports.getNotifySetting = exports.pageMsgByUserId = exports.getMsgTypeCount = exports.advChangeWxPay = exports.loadZzRechargeRules = exports.isUseRecharge = exports.pushRecharge = exports.pagePushAdvRecharge = exports.listPushFeeRules = exports.pagePushRules = exports.pushRules = exports.getAdvUsingInfo = exports.checkPushTime = exports.pushTime = exports.pushWater = exports.getAdvModelImage = exports.verifyPushAdv = exports.getSimplePushAdv = exports.enablePushAdv = exports.pushAdv = exports.getLevelAdv = exports.AppImg = exports.uploadAppImg = exports.getAppImg = exports.upGradeFile = exports.uploadUpGradeFile = exports.getUpGradeFile = exports.getCameraFile = exports.CameraFile = exports.getFilesList = exports.getCameraFiles = exports.getLocalStatus = exports.showCameraOrder = exports.sendCommand = exports.ParamsSetting = exports.OperateRecordClear = exports.getOperateRecord = exports.Adv = exports.dispTest = exports.getSimDetail = exports.setVoice = exports.setVirloop = exports.setRaco = exports.getVirloopById = exports.getRacoById = exports.getSnapshotById = exports.timeUp = exports.reboot = exports.switchById = exports.deleteDeviceStatus = exports.updateDeviceStatus = exports.getDeviceStatus = exports.getDeviceLogs = exports.plateInset = exports.moveErCode = exports.staticErCode = exports.erCodeOne = exports.getTicketRulesPer = exports.TicketRules = exports.getTicketRules = exports.getRechargeRecords = void 0;
exports.uploadAICameraFile = exports.getAIFile = exports.downAIFile = exports.deleteAICameraFile = exports.getAndroidAIFiles = exports.getLinuxAIFiles = exports.getAICameraFile = exports.getUserChannel = exports.typeCheck = exports.usersAIManage = exports.getWxQRcode = exports.deleteAIMembers = exports.getUUid = exports.noCheckAIMemberPhoto = exports.checkAIMemberPhoto = exports.updateMemberPhoto = exports.seeAIMemberPhoto = exports.checkAIMemeber = exports.checkIsAddAIMember = exports.uploadAImMember = exports.AIMember = exports.getAIMember = exports.AIErrorData = exports.getAIErrorData = exports.getAIDuyDetail = exports.deleteAIDuyUser = exports.getAIDuyUser = exports.getAITreeData = exports.addBatchBlackUser = exports.addBlackUser = exports.userTemplateReplaceRooms = exports.showRoom = exports.showFloor = exports.showBuilding = exports.saveHouseInfo = exports.deleteAllModel = exports.deleteModel = exports.showModel = exports.createModel = exports.ApiExportUnqualifiedList = exports.exportAIUserImport = exports.checkAIUserImportPhoto = exports.AIUserImport = exports.deleteAIUserImport = exports.AIUserImportPhoto = exports.updateAIUserImportPhoto = exports.updateAIUserImport = exports.getAIUserImport = exports.ApiStudentUpload = exports.checkTypes = exports.departments = exports.AIpermissions = exports.AIpermission = exports.checkAllow = exports.updateAIPassword = exports.uploadAiDuyCompany = exports.AiDuyCompany = exports.getAiDuyCompany = exports.checkAILinuxCamera = exports.getAccountCamera = exports.checkAICamera = exports.dataReset = exports.aKeyOpened = exports.deviceReboot = exports.optionsOrder = exports.updateCamera = exports.AIInOutTime = exports.deleteAIInOutTime = exports.AISetting = exports.cameraAIOneParams = exports.cameraAIParams = exports.UpgradeAIUnbindCamera = exports.cloudAICamera = exports.setAILinuxParams = exports.getAILinuxParams = exports.AIAndroidKFParams = exports.setAIAndroidParams = exports.getAIAndroidParams = exports.getAIAppCameraFile = exports.getAICameraFiles = exports.setAIpar = exports.zoomAIUp = exports.zoomAIDown = exports.getAIVer = exports.setAIParams = exports.getAIParams = exports.getAISnap = exports.focusAIUp = exports.focusAIDown = exports.clearAIWhite = exports.setAITime = exports.reAIBoot = exports.unBindAICamera = exports.unBindProdAICamera = exports.bindProdAICamera = exports.getAIProductionTest = exports.openOutLog = exports.syncState = exports.updateCameraAl = exports.editAICameraName = void 0;
exports.whiteBlackList = exports.checkAdv = exports.searchAdv = exports.aiNotify = exports.updateNoteList = exports.insertNoteList = exports.getNoteList = exports.getAuditList = exports.getMessageIsYUN = exports.getRecord = exports.getPoint = exports.pageFeeEvent = exports.feeEvent = exports.WXMemu = exports.wxManager = exports.recoveryWhiteDetail = exports.pageRecoveryWhiteDetail = exports.recoveryWhite = exports.pageRecoveryWhite = exports.getEventOpen = exports.points = exports.pagePointsRecords = exports.pointsRules = exports.pagePointsRules = exports.uploadSugPic = exports.picSuggestion = exports.suggestion = exports.suggestionAdd = exports.getOrderAddress = exports.getOrderRecords = exports.getASSolutionPic = exports.getASSolution = exports.getASStaffEvaluate = exports.ASTaskPic = exports.deleteASTask = exports.getASTask = exports.updateASUser = exports.ASUser = exports.fuzzySearch = exports.ledSetting = exports.listCheck = exports.pageLedApp = exports.defaultGo = exports.addTypeUser = exports.typeManage = exports.adaptWorker = exports.addWorker = exports.delWorkType = exports.ledAppDeleteWhiteList = exports.ledAppSyncWhiteList = exports.ledAppTurnOn = exports.ledAppTurnOff = exports.ledAppSetAdv = exports.updateParams = exports.backShow = exports.unbind = exports.gainAllLedApp = exports.bindApp = exports.validtorMac = exports.getMac = exports.getRemark = exports.addInfo = exports.delInfo = exports.getFullInfo = exports.createQRcode = exports.getPostSetting = exports.getCountFlow = exports.getFlow = exports.applyOverTimet = exports.deleteAIWriteOff = exports.AIWriteOff = exports.getMonthTime = exports.setMonthTime = exports.exportAIMonthlyCount = exports.AIMonthlyCount = exports.applyOverTime = exports.updateAIDailyCount = exports.exportAIDailyCount = exports.AIDailyCount = exports.exportAIAttendGroupShifts = exports.AIAttendGroupShifts = exports.AIDuyCompanyAndAiUser = exports.AIAttendGroupDetail = exports.AIAttendGroup = exports.getAIShiftsList = exports.AIShifts = exports.getAIShifts = exports.getPageCount = exports.getPage = exports.getPageOrder = exports.getUpgradeLog = exports.AIsentCommandList = exports.getOrderList = exports.AIsendCommand = exports.AIcameraParamsList = exports.AICameraParams = exports.AIParamsSetting = exports.outSideType = exports.UpgradeAIHttpCamera = exports.UpgradeAICamera = void 0;
exports.getAItokens = exports.changeVisitor = exports.delUnit = exports.getUnit = void 0;
// =------------------------ 车场云 ------------------ \\
// 超管
var apiFindUserPhoto = 'v1/ai/showPhoto'; // 获取用户图片

exports.apiFindUserPhoto = apiFindUserPhoto;
var apiUpdataPhoto = 'pv/v1/sms/aiUser/updateMostPhoto'; // 替换照片
// ------------- 用户 ------------ \\

exports.apiUpdataPhoto = apiUpdataPhoto;
var login = 'pv/v1/login'; // 登录接口

exports.login = login;
var autoLogin = 'pv/v1/autoDecode'; // 校验预授权登录接口

exports.autoLogin = autoLogin;
var reflushToken = 'pv/v1/reflushToken'; // 刷新Token

exports.reflushToken = reflushToken;
var cloudData = 'v1/statist/yun'; // 平台-代理商首页

exports.cloudData = cloudData;
var statist = 'v1/statist/calculation'; // 平台-代理商首页

exports.statist = statist;
var dataView = 'v1/dataview/init/'; // 大屏幕

exports.dataView = dataView;
var depData = 'v1/statist/dep'; // 车场首页

exports.depData = depData;
var getUserInfo = 'v1/user/'; // 获取用户的信息

exports.getUserInfo = getUserInfo;
var updateUser = 'v1/user'; // 更新用户信息

exports.updateUser = updateUser;
var seeLogo = 'v1/park/logo/'; // 查看Logo

exports.seeLogo = seeLogo;
var setLogo = 'v1/park/logo'; // 查看Logo

exports.setLogo = setLogo;
var editPassword = 'v1/user/password'; // 修改密码

exports.editPassword = editPassword;
var getAdmin = 'v1/user/admin/department/'; // 获取超级管理员

exports.getAdmin = getAdmin;
var createAdmin = 'v1/user/admin'; // 新增超级管理员

exports.createAdmin = createAdmin;
var getUserName = 'v1/user/userName'; // 获取账号

exports.getUserName = getUserName;
var updatePassword = 'v1/user/admin/password'; // 修改管理员密码
// 用户

exports.updatePassword = updatePassword;
var getUsers = 'v1/user/department/page'; // 获取列表

exports.getUsers = getUsers;
var User = 'v1/user'; // 修改、创建、删除和删除所有

exports.User = User;
var UserRole = 'v1/user/role'; // 获取和修改角色

exports.UserRole = UserRole;
var reDownFa = 'v1/ai/aiUser/rePush'; // 重新下发

/** ********  【 新增 api 】  **********/

exports.reDownFa = reDownFa;
var apiUserCheckPhoto = '/v1/ai/aiUser/notCheckPhoto'; // 校验图片

exports.apiUserCheckPhoto = apiUserCheckPhoto;
var apiUserEditPhoto = '/v1/ai/aiUser/replacePhoto'; // 图片修改
// end
// 角色

exports.apiUserEditPhoto = apiUserEditPhoto;
var getRoles = 'v1/role/department/page'; // 获取角色

exports.getRoles = getRoles;
var createRoles = 'v1/role/department'; // 新增角色

exports.createRoles = createRoles;
var getFunction = 'v1/tree/function/'; // 获取功能权限
// 研发权限

exports.getFunction = getFunction;
var deletePermission = 'v1/permission/'; // 研发删除权限

exports.deletePermission = deletePermission;
var Permission = 'v1/permission/save'; // 研发新增权限
// -------------- 部门管理 --------- \\

exports.Permission = Permission;
var getAllDepartment = 'v1/department/list'; // 获取所有的部门

exports.getAllDepartment = getAllDepartment;
var getDep = 'v1/department/pid/page/'; // 获取下级部门

exports.getDep = getDep;
var department = 'v1/department'; // 新增、删除、更改和查看部门详情

exports.department = department;
var editDepConfig = 'v1/department/api'; // 更新第三方配置信息

exports.editDepConfig = editDepConfig;
var getDepTransport = 'v1/department/netType/'; // 获取部门传输类型

exports.getDepTransport = getDepTransport;
var DepBuiness = 'v1/department/open'; // 获取和保存已经开通的业务

exports.DepBuiness = DepBuiness;
var LogoUrl = 'v1/park/logo'; // logo

exports.LogoUrl = LogoUrl;
var getDepartmentTree = 'v1/tree/department'; // 获取部门树
// -------------- 部门类别 --------- \\

exports.getDepartmentTree = getDepartmentTree;
var getDepTypeById = 'v1/dtype/department/'; // 根据部门ID获取部门类别

exports.getDepTypeById = getDepTypeById;
var getSysName = 'v1/dtype'; // 根据选中departmentTypeId知道平台名字

exports.getSysName = getSysName;
var getDepTypeByLevel = 'v1/dtype/level/'; // 根据级别获取部门类别

exports.getDepTypeByLevel = getDepTypeByLevel;
var getDepTypeByLevelPage = 'v1/dtype/level/page/'; // 根据级别分页获取部门类别

exports.getDepTypeByLevelPage = getDepTypeByLevelPage;
var DepTypePermission = 'v1/dtype/permission/'; // 获取和设置类别默认权限

exports.DepTypePermission = DepTypePermission;
var getDepTypeCanCreate = 'v1/dtype/er/'; // 获取可被创建的二级导航

exports.getDepTypeCanCreate = getDepTypeCanCreate;
var setDepTypeCanCreate = 'v1/dtype/pid'; // 设置可被创建的二级导航

exports.setDepTypeCanCreate = setDepTypeCanCreate;
var updateDepart = 'v1/update/department'; // 修改部门参数

exports.updateDepart = updateDepart;
var checkAllTypeInfo = 'v1/dtype/agency/department'; // 查看可创建的下级类型

exports.checkAllTypeInfo = checkAllTypeInfo;
var setCountVip = 'v1/dtype/agency/allocation'; // 设置会员积分
// 新增

exports.setCountVip = setCountVip;
var ApiPriorityUpload = 'v1/dtype/agency/highest'; // 优先级下发
// -------------- 角色管理 --------- \\

exports.ApiPriorityUpload = ApiPriorityUpload;
var DepType = 'v1/dtype'; // 添加、删除、更新和获取
// 默认角色

exports.DepType = DepType;
var getDtypeRoles = 'v1/dtype/role/page/'; // 获取默认角色

exports.getDtypeRoles = getDtypeRoles;
var createDtypeRoles = 'v1/dtype/role'; // 新增默认角色

exports.createDtypeRoles = createDtypeRoles;
var Roles = 'v1/role'; // 修改、删除角色
// 角色权限

exports.Roles = Roles;
var RolesPermisson = 'v1/role/permission'; // 获取、设置权限

exports.RolesPermisson = RolesPermisson;
var RolesPermissonOnly = 'v1/role/permission/only'; // 获取分配权限

exports.RolesPermissonOnly = RolesPermissonOnly;
var lookRolesPermisson = 'v1/role/find/permission'; // 获取管理权限

exports.lookRolesPermisson = lookRolesPermisson;
var givePermissionEr = 'v1/user/super/role'; // 分配超管
// 默认任务

exports.givePermissionEr = givePermissionEr;
var getTask = 'v1/typeTask/page'; // 获取默认任务

exports.getTask = getTask;
var Task = 'v1/typeTask'; // 新增、编辑和删除任务

exports.Task = Task;
var templateInfo = 'v1/faceWxTemplateInfo'; // 添加模板
// ------------- 操作文档 ---------- \\

exports.templateInfo = templateInfo;
var uploadDescriptions = process.env.API_HOST + 'os/v1/park/updocs'; // 上传操作文档

exports.uploadDescriptions = uploadDescriptions;
var uploadWhite = process.env.API_HOST + 'os/v1/park/vorlage'; // 上传白名单

exports.uploadWhite = uploadWhite;
var exportWhite = 'v1/app/downUpgrade/'; // 下载白名单

exports.exportWhite = exportWhite;
var exportDescriptions = 'v1/downfile'; // 下载操作文档

exports.exportDescriptions = exportDescriptions;
var getWord = 'v1/park/operationalDocument'; // 获取在线操作文档

exports.getWord = getWord;
var saveWord = 'v1/park/operationalDocument'; // 保存在线操作文档

exports.saveWord = saveWord;
var getAllDocuments = 'v1/park/operationalDocument'; // 获取所有的操作文档列表

exports.getAllDocuments = getAllDocuments;
var deleteDocuments = 'v1/park/deleteDoc'; // 删除文档

exports.deleteDocuments = deleteDocuments;
var uploadDoc = process.env.API_HOST + 'os/v1/park/uploadDoc'; // 上传文档
// 用户日志

exports.uploadDoc = uploadDoc;
var UserLog = 'v1/user/oprationRecords'; // 获取列表
// 版本更新日志

exports.UserLog = UserLog;
var getVersionInfo = 'v1/updateInfo/page'; // 获取

exports.getVersionInfo = getVersionInfo;
var VersionInfo = 'v1/updateInfo'; // 新增和更新
// -------------- App ------------- \\

exports.VersionInfo = VersionInfo;
var getAppUpgrade = 'v1/app/appUpgrade/page'; // 获取app文件列表

exports.getAppUpgrade = getAppUpgrade;
var uploadAppFile = process.env.API_HOST + 'os/v1/app/upgrade'; // 上传app文件包

exports.uploadAppFile = uploadAppFile;
var deleteAppFile = 'v1/app/appUpgrade'; // 删除app文件

exports.deleteAppFile = deleteAppFile;
var exportAppFile = 'pv/v1/app/downUpgrade/'; // 下载App文件
// 平台广告

exports.exportAppFile = exportAppFile;
var Advs = 'v1/park/publicize'; // 获取列表、删除、更新和增加

exports.Advs = Advs;
var uploadAdvs = process.env.API_HOST + 'v1/park/publicize'; // 上传

exports.uploadAdvs = uploadAdvs;
var getAdvPic = 'v1/publicize'; // 获取图片

exports.getAdvPic = getAdvPic;
var getAdv = 'v1/cloud/publicize'; // 首页获取广告

exports.getAdv = getAdv;
var createAdvText = 'v1/park/publicizeNoImg'; // 添加文字
// -------------- 盒子模式 --------- \\
// 免费车

exports.createAdvText = createAdvText;
var getBoxFreeCar = 'v1/box/boxFreeCar/page'; // 获取免费车列表

exports.getBoxFreeCar = getBoxFreeCar;
var BoxFreeCar = 'v1/box/boxFreeCar'; // 新增 和删除免费车

exports.BoxFreeCar = BoxFreeCar;
var uploadBoxFreeCar = process.env.API_HOST + 'os/v1/box/boxFreeCar/import'; // 上传文件

exports.uploadBoxFreeCar = uploadBoxFreeCar;
var exportBoxFreeCar = 'v1/box/boxFreeCar/export'; // 导出免费车
// 固定车

exports.exportBoxFreeCar = exportBoxFreeCar;
var getBoxMonthCar = 'v1/box/boxMonthlyCar/page'; // 获取固定车列表

exports.getBoxMonthCar = getBoxMonthCar;
var BoxMonthCar = 'v1/box/boxMonthlyCar'; // 删除、更新和添加固定车

exports.BoxMonthCar = BoxMonthCar;
var BoxMonthCarPermission = 'v1/box/boxMonthlyCar/power'; // 获取和修改通道权限

exports.BoxMonthCarPermission = BoxMonthCarPermission;
var checkPlateNumber = 'v1/box/checkPlate'; // 校验车牌号

exports.checkPlateNumber = checkPlateNumber;
var uploadBoxMonthCar = process.env.API_HOST + 'os/v1/box/boxMonthlyCar/import'; // 上传文件

exports.uploadBoxMonthCar = uploadBoxMonthCar;
var exportMonthCar = 'v1/box/boxMonthlyCar/export'; // 导出固定车

exports.exportMonthCar = exportMonthCar;
var BoxMonthCarCalc = 'v1/box/boxMonthlyCar/calculate'; // 计算时间和费用

exports.BoxMonthCarCalc = BoxMonthCarCalc;
var BoxMonthCarCharge = 'v1/box/boxMonthlyCar/recharge'; // 充值

exports.BoxMonthCarCharge = BoxMonthCarCharge;
var BoxMonthCarIssue = 'v1/box/boxMonthlyCar/reimport'; // 批量下发和全部下发
// 未审核固定车

exports.BoxMonthCarIssue = BoxMonthCarIssue;
var getUnCheckMonthCar = 'v1/box/boxMonthlyCar/page/noVerify'; // 获取

exports.getUnCheckMonthCar = getUnCheckMonthCar;
var checkMonthCar = 'v1/box/boxMonthlyCar/verify'; // 批量审核、一键审核
// 通道

exports.checkMonthCar = checkMonthCar;
var getBoxAllLocal = 'v1/box/boxLocal/list'; // 获取所有通道

exports.getBoxAllLocal = getBoxAllLocal;
var getBoxLocal = 'v1/box/boxLocal/page'; // 获取通道列表
// 人工开闸记录

exports.getBoxLocal = getBoxLocal;
var getBoxOpenRecord = 'v1/box/boxOpenRecord/page/'; // -------------- 进出管理 --------------- \\
// 在场记录

exports.getBoxOpenRecord = getBoxOpenRecord;
var getInTmps = 'v1/inTmps/page'; // 获取列表

exports.getInTmps = getInTmps;
var deleteInTmps = 'v1/inOut/delteOneIn'; // 删除选中列表

exports.deleteInTmps = deleteInTmps;
var deleteAllInTmps = 'v1/inOut/delteAllIn/'; // 删除所有

exports.deleteAllInTmps = deleteAllInTmps;
var settingTmpCar = 'v1/settingTmpCar'; // 临时车位数

exports.settingTmpCar = settingTmpCar;
var exportInTmps = 'v1/inOut/exportIn'; // 导出在场记录

exports.exportInTmps = exportInTmps;
var getImage = 'v1/inOut/getInOutImage'; // 获取图片
// 进出记录

exports.getImage = getImage;
var getInOut = 'v1/inOut/page'; // 获取进出记录

exports.getInOut = getInOut;
var getInOutDetail = 'v1/inOut/details'; // 获取进出详情

exports.getInOutDetail = getInOutDetail;
var exportInOut = 'v1/inOut/exportInAndOut'; // 导出进出记录

exports.exportInOut = exportInOut;
var getInOutCount = 'v1/inOut/count'; // 获取进出记录统计
// 异常出场

exports.getInOutCount = getInOutCount;
var getAbnormalOut = 'pv/v1/error/order'; // 异常记录结算
// -------------- 车场数据 --------------- \\
// 普通白名单

exports.getAbnormalOut = getAbnormalOut;
var getNormalWhite = 'v1/monthlyCard/zhenshi/page'; // 获取列表

exports.getNormalWhite = getNormalWhite;
var NormalWhite = 'v1/monthlyCard/zhenshi'; // 添加、编辑和删除数据

exports.NormalWhite = NormalWhite;
var deleteAllNoramlWhite = 'v1/monthlyCard/deleteAllZhenshiMonthCardCar/'; // 删除所有数据

exports.deleteAllNoramlWhite = deleteAllNoramlWhite;
var oneToAnotherNormalWhite = 'v1/monthlyCard/oneToAnother/zhenshi'; // 从一个相机向另外一个相机导白名单

exports.oneToAnotherNormalWhite = oneToAnotherNormalWhite;
var uploadNormalWhiteFile = process.env.API_HOST + 'os/v1/ZhenshiMonthlyCardImpo'; // 上传文件

exports.uploadNormalWhiteFile = uploadNormalWhiteFile;
var exportNormalWhite = 'v1/monthlyCard/export'; // 导出

exports.exportNormalWhite = exportNormalWhite;
var calcTime = 'v1/park/zhengshi/calculate'; // 计算时间

exports.calcTime = calcTime;
var NormalWhiteCharge = 'v1/park/monthlyCardRecharge'; // 充值

exports.NormalWhiteCharge = NormalWhiteCharge;
var NomalWhitePlateCheck = 'v1/park/zhengshi/plateExist'; // 验证车牌
// 普通白名单充值记录

exports.NomalWhitePlateCheck = NomalWhitePlateCheck;
var normalCharge = 'v1/monthlyCardRecharge/zhenshi/page';
exports.normalCharge = normalCharge;
var exportNormalCharge = 'v1/monthlyCardRecharge/zhenshi'; // 导出普通白名单充值记录
// 高级白名单

exports.exportNormalCharge = exportNormalCharge;
var getTopWhite = 'v1/park/otmMonthCard/page'; // 获取列表

exports.getTopWhite = getTopWhite;
var searchUserName = 'v1/park/searchUserName'; // 查询名字

exports.searchUserName = searchUserName;
var updateTopWhiteUser = 'v1/park/otmMonthCardUser'; // 更新用户信息

exports.updateTopWhiteUser = updateTopWhiteUser;
var deleteTopWhite = 'v1/park/otmMonthCardCar'; // 删除

exports.deleteTopWhite = deleteTopWhite;
var TopWhite = 'v1/park/otmMonthCard'; // 更新和添加

exports.TopWhite = TopWhite;
var deleteAllTopWhite = 'v1/park/deleteAllOtmMonthCardCar/'; // 删除所有

exports.deleteAllTopWhite = deleteAllTopWhite;
var uploadTopWhite = process.env.API_HOST + 'os/v1/otmMonthlyCardImpo';
exports.uploadTopWhite = uploadTopWhite;
var exportTopWhite = 'v1/otm/exportOtm'; // 导出

exports.exportTopWhite = exportTopWhite;
var oneToAnotherTopWhite = 'v1/otm/oneToAnother'; // 从一个相机向另外一个相机导白名单

exports.oneToAnotherTopWhite = oneToAnotherTopWhite;
var getTomWhiteChargeRecord = 'v1/park/otmMonthCardRecharge/page'; // 充值记录

exports.getTomWhiteChargeRecord = getTomWhiteChargeRecord;
var exportTopWhiteChargeRecord = 'v1/park/otmMonthCardRecharge'; // 导出一位多车充值记录
// 异常记录

exports.exportTopWhiteChargeRecord = exportTopWhiteChargeRecord;
var getAbnormal = 'v1/park/abnormal/page'; // 获取列表

exports.getAbnormal = getAbnormal;
var Abnormal = 'v1/park/abnormal'; // 新增、删除和更新
// 手动开闸记录

exports.Abnormal = Abnormal;
var getOpenRecord = 'v1/park/openGateRecord/page'; // 获取列表

exports.getOpenRecord = getOpenRecord;
var OpenRecord = 'v1/park/openGateRecord'; // 添加、更新和删除
// 黑名单

exports.OpenRecord = OpenRecord;
var getBlackCard = 'v1/park/blackList/page'; // 获取列表

exports.getBlackCard = getBlackCard;
var BlackCard = 'v1/park/blackList'; // 新增、删除、更新
// 事件记录

exports.BlackCard = BlackCard;
var getEventRecord = 'v1/park/lprEvent/page'; // 获取列表

exports.getEventRecord = getEventRecord;
var EventRecord = 'v1/park/lprEvent'; // 更新、新增和删除
// 特殊车

exports.EventRecord = EventRecord;
var getSpecialCar = 'v1/park/specialCar/page'; // 获取列表

exports.getSpecialCar = getSpecialCar;
var SpecialCar = 'v1/park/specialCar'; // 更新、删除和新增
// 交接记录

exports.SpecialCar = SpecialCar;
var getTransfer = 'v1/park/handOver/page'; // 获取列表
// 免费车

exports.getTransfer = getTransfer;
var getFreeCar = 'v1/park/freecar/page'; // 获取列表

exports.getFreeCar = getFreeCar;
var FreeCar = 'v1/park/freecar'; // 新增、更细和删除
// 渣土白名单

exports.FreeCar = FreeCar;
var getToolWhite = 'v1/monthlyCard/tools/page'; // 获取列表

exports.getToolWhite = getToolWhite;
var ToolWhite = 'v1/monthlyCard/tools'; // 新增、删除、更新和删除所有

exports.ToolWhite = ToolWhite;
var exportToolWhite = 'v1/monthlyCard/tools/export'; // 导出

exports.exportToolWhite = exportToolWhite;
var uploadToolWhite = process.env.API_HOST + 'os/v1/zhatuMonthlyCardImpo'; // 导入文件
// 充值规则

exports.uploadToolWhite = uploadToolWhite;
var getChargeRules = 'v1/rechargeRules/select'; // 充值规则

exports.getChargeRules = getChargeRules;
var recharge = 'v1/park/otmMonthCardRecharge'; // 高级白名单充值

exports.recharge = recharge;
var getChargeRulesPage = 'v1/rechargeRules/page/'; // 充值规则列表

exports.getChargeRulesPage = getChargeRulesPage;
var ChargeRules = 'v1/rechargeRules'; // 新增、更新和删除
// ---------------- 相机管理 ------------------ \\

exports.ChargeRules = ChargeRules;
var getCamera = 'v1/tcpToken/list/'; // 获取所有相机

exports.getCamera = getCamera;
var getOutCamera = 'v1/tcpToken/check'; // 获取所有出口相机

exports.getOutCamera = getOutCamera;
var getInCamera = 'v1/tcpToken/check/in'; // 获取所有入口相机

exports.getInCamera = getInCamera;
var getInOnlineCamera = 'v1/getInAndOnline/'; // 获取所有在线的入口相机

exports.getInOnlineCamera = getInOnlineCamera;
var getOfflineCamera = 'v1/tcpToken/offLine/page'; // 获取离线相机列表

exports.getOfflineCamera = getOfflineCamera;
var getOffLineAnalysis = 'v1/camera/cameraOffline/page'; // 获取离线分析

exports.getOffLineAnalysis = getOffLineAnalysis;
var getOfflineCameraStatist = 'v1/tcpToken/offLine/statist/page'; // 获取离线相机统计

exports.getOfflineCameraStatist = getOfflineCameraStatist;
var exportOfflineCameraStatist = 'v1/tcpToken/offLine/statist/export'; // 导出离线相机统计

exports.exportOfflineCameraStatist = exportOfflineCameraStatist;
var clearCameraSetting = 'v1/g4/deleteAll'; // 清空相机所有在场车辆和所有白名单

exports.clearCameraSetting = clearCameraSetting;
var bindCamera = 'v1/g4/G4MacBing'; // 绑定相机

exports.bindCamera = bindCamera;
var FeeRules = 'v1/g4/feeRules'; // 收费规则

exports.FeeRules = FeeRules;
var testFeeRules = 'v1/sms/calculation/free'; // 测试平台算费

exports.testFeeRules = testFeeRules;
var FeeRulesSelect = 'v1/g4/chooseFeeRules'; // 选择相机收费

exports.FeeRulesSelect = FeeRulesSelect;
var getG4Mac = 'v1/tcpToken/common/page'; // Mac状态

exports.getG4Mac = getG4Mac;
var unBindCarmera = 'v1/tcpToken/unbind'; // 解绑相机
// 高级设置

exports.unBindCarmera = unBindCarmera;
var settingAll = 'v1/g4/downSettingAll'; // 下载设置

exports.settingAll = settingAll;
var SystemSetting = 'v1/g4/systemSetting'; // 系统设置

exports.SystemSetting = SystemSetting;
var Led = 'v1/g4/led'; // 显示屏设置

exports.Led = Led;
var cameraParams = 'v1/tcpToken/camaraRole'; // 相机参数设置
// 流量监控

exports.cameraParams = cameraParams;
var getDailyFlow = 'v1/flowPool/page'; // 获取列表

exports.getDailyFlow = getDailyFlow;
var getShareInfo = 'v1/flowPool/shareInfo'; // 查询流量使用情况

exports.getShareInfo = getShareInfo;
var setFlowBell = 'v1/flowPool/setFlowBell'; // 设置警示值

exports.setFlowBell = setFlowBell;
var getFlowBell = 'v1/flowPool/getFlowBell'; // 获取警示值

exports.getFlowBell = getFlowBell;
var switchWeb = 'v1/flowPool/switchWeb'; // 开停

exports.switchWeb = switchWeb;
var getIdcardInfo = 'v1/flowPool/card/page'; // 获取卡信息

exports.getIdcardInfo = getIdcardInfo;
var getIdcardPack = 'v1/flowPool/card/package'; // 获取卡的加油包 / 叠加包套餐

exports.getIdcardPack = getIdcardPack;
var getUserOfCards = 'v1/flowPool/card/alldata'; // 获取当前用户的所有卡数据

exports.getUserOfCards = getUserOfCards;
var getAllcardData = 'v1/flowPool/card/alldata/all'; // 获取当前用户所有卡数并获取卡信息
// 研发远程

exports.getAllcardData = getAllcardData;
var setting = 'v1/g4/g4Setting'; // -------------- 电子支付 ----------------- \\
// 无感支付

exports.setting = setting;
var CCBParams = 'v1/ccb/ccbParams'; // 获取和设置
// 小程序收费

exports.CCBParams = CCBParams;
var getSmallProCharge = 'v1/feePush/page'; // 获取列表

exports.getSmallProCharge = getSmallProCharge;
var SmallProChargeBindUser = 'v1/feePush/bindUser'; // 绑定用户

exports.SmallProChargeBindUser = SmallProChargeBindUser;
var SmallProChargeGetUser = 'v1/feePush/getUser/'; // 获取用户

exports.SmallProChargeGetUser = SmallProChargeGetUser;
var SmallProChargeDeleteUser = 'v1/feePush'; // 删除用户
// 生成二维码

exports.SmallProChargeDeleteUser = SmallProChargeDeleteUser;
var QRCode = 'v1/pay/payUrl';
exports.QRCode = QRCode;
var bluetoothCode = 'v1/pay/bluetoothUrl'; // 农信银支付

exports.bluetoothCode = bluetoothCode;
var rccPayParams = 'v1/rccPayParams'; // 芝麻支付

exports.rccPayParams = rccPayParams;
var sesamePay = 'v1/zhima/zhimaParams'; // 芝麻无感支付参数接口
// -------------- 电子优惠券 --------------- \\
// 车场规则

exports.sesamePay = sesamePay;
var ticketParkSetting = 'v1/ticket/ticketParkSetting'; // 获取和设置
// 优惠券记录 ---- 车场的权限 优惠记录

exports.ticketParkSetting = ticketParkSetting;
var getShops = 'v1/ticket/allShop/'; // 获取所有的商家

exports.getShops = getShops;
var getShopNotUsedTicket = 'v1/ticket/ticketTmps'; // 获取商家未使用的优惠券

exports.getShopNotUsedTicket = getShopNotUsedTicket;
var getShopUsedTicket = 'v1/ticket/pages'; // 获取商家已使用的优惠券
// 商家充值记录  --------车场的权限

exports.getShopUsedTicket = getShopUsedTicket;
var getShopsChargeRecords = 'v1/ticket/shopRecharge/page'; // 获取列表
// 商家管理

exports.getShopsChargeRecords = getShopsChargeRecords;
var getBuinessInfo = 'v1/ticket/shop/page'; // 获取列表

exports.getBuinessInfo = getBuinessInfo;
var BuinessInfo = 'v1/ticket/shop'; // 新增、更新和删除

exports.BuinessInfo = BuinessInfo;
var getBuinessPer = 'v1/shop/power/'; // 获取二维码权限

exports.getBuinessPer = getBuinessPer;
var setBuinessPer = 'v1/shop/power/update'; // 保存二维码权限

exports.setBuinessPer = setBuinessPer;
var addSubMoney = 'v1/ticket/shopRecharge'; // 加减款
// 充值记录 -----商家权限

exports.addSubMoney = addSubMoney;
var getRechargeRecords = 'v1/ticket/shopRecharge/page'; // 优惠券规则

exports.getRechargeRecords = getRechargeRecords;
var getTicketRules = 'v1/ticket/shopRules/page'; // 获取列表

exports.getTicketRules = getTicketRules;
var TicketRules = 'v1/ticket/shopRules'; // 添加、删除和更新

exports.TicketRules = TicketRules;
var getTicketRulesPer = 'v1/shop/powerlist/'; // 获取商家权限

exports.getTicketRulesPer = getTicketRulesPer;
var erCodeOne = 'v1/ticket/ercode/one/'; // 生成单次码

exports.erCodeOne = erCodeOne;
var staticErCode = 'v1/ticket/ercode/static/'; // 生成静态码

exports.staticErCode = staticErCode;
var moveErCode = 'v1/ticket/ercode/move/'; // 生成动态码

exports.moveErCode = moveErCode;
var plateInset = 'pv/v1/ticket/bingding'; // 车牌输入
// -------------- 设备管理 ----------------- \\
// 通道日志

exports.plateInset = plateInset;
var getDeviceLogs = 'v1/simLog/page/'; // 通道状态

exports.getDeviceLogs = getDeviceLogs;
var getDeviceStatus = 'v1/tcpToken/page/'; // 获取列表

exports.getDeviceStatus = getDeviceStatus;
var updateDeviceStatus = 'v1/tcpToken/update'; // 更新

exports.updateDeviceStatus = updateDeviceStatus;
var deleteDeviceStatus = 'v1/tcpToken'; // 删除

exports.deleteDeviceStatus = deleteDeviceStatus;
var switchById = 'v1/tcpToken/openDoor/'; // 开闸

exports.switchById = switchById;
var reboot = 'v1/tcpToken/reBoot/'; // 重启相机

exports.reboot = reboot;
var timeUp = 'v1/tcpToken/timeUp/'; // 校时相机

exports.timeUp = timeUp;
var getSnapshotById = 'v1/loop/debug/getSnapshot/'; // 获取相机快照

exports.getSnapshotById = getSnapshotById;
var getRacoById = 'v1/loop/debug/getRaco/'; // 获取真实线圈

exports.getRacoById = getRacoById;
var getVirloopById = 'v1/loop/debug/getVirloop/'; // 获取虚拟线圈

exports.getVirloopById = getVirloopById;
var setRaco = 'v1/loop/debug/setRaco'; // 设置真实线圈

exports.setRaco = setRaco;
var setVirloop = 'v1/loop/debug/setVirloop'; // 设置虚拟线圈

exports.setVirloop = setVirloop;
var setVoice = 'v1/g4/sendVioce'; // 设置语音

exports.setVoice = setVoice;
var getSimDetail = 'v1/simCard/'; // 获取卡详情

exports.getSimDetail = getSimDetail;
var dispTest = 'v1/g4/sendDisp'; // 显示屏测试

exports.dispTest = dispTest;
var Adv = 'v1/g4/ledAdvById'; // 获取和修改广告语
// -------------- 远程升级 ----------- \\
// 操作记录

exports.Adv = Adv;
var getOperateRecord = 'v1/camera/cameraOperation/page/'; // 获取列表

exports.getOperateRecord = getOperateRecord;
var OperateRecordClear = 'v1/cameraOperation/clear'; // 清除升级任务
// 参数设置

exports.OperateRecordClear = OperateRecordClear;
var ParamsSetting = 'v1/cameraOperation/settingParameters'; // 实时控制

exports.ParamsSetting = ParamsSetting;
var sendCommand = 'v1/cameraOperation/sendCommand';
exports.sendCommand = sendCommand;
var showCameraOrder = 'v1/cameraOrder'; // 命令添加回显
// 通道状态

exports.showCameraOrder = showCameraOrder;
var getLocalStatus = 'v1/camera/cameraRecord/page/'; // 相机文件

exports.getLocalStatus = getLocalStatus;
var getCameraFiles = 'v1/camera/cameraFile/page/'; // 获取列表

exports.getCameraFiles = getCameraFiles;
var getFilesList = 'v1/camera/aiCameraFile/pageByMac'; // 获取人脸识别相机文件列表

exports.getFilesList = getFilesList;
var CameraFile = 'v1/camera/cameraFile'; // 删除和下载

exports.CameraFile = CameraFile;
var getCameraFile = 'v1/cameraOperation/loadCameraFile'; // 获取相机的升级文件
// 升级文件

exports.getCameraFile = getCameraFile;
var getUpGradeFile = 'v1/camera/cameraFile/upgrade'; // 获取列表

exports.getUpGradeFile = getUpGradeFile;
var uploadUpGradeFile = process.env.API_HOST + 'os/v1/camera/cameraFile'; // 上传文件

exports.uploadUpGradeFile = uploadUpGradeFile;
var upGradeFile = 'v1/cameraOperation/cameraUpgrade'; // 升级相机
// app广告

exports.upGradeFile = upGradeFile;
var getAppImg = 'v1/app/advertising/page'; // 获取列表

exports.getAppImg = getAppImg;
var uploadAppImg = process.env.API_HOST + 'v1/app/advertising';
exports.uploadAppImg = uploadAppImg;
var AppImg = 'v1/app/advertising'; // 新增、删除和获取
// 下级广告

exports.AppImg = AppImg;
var getLevelAdv = 'v1/subordinate/publicize'; // 获取列表
// 推送广告

exports.getLevelAdv = getLevelAdv;
var pushAdv = 'v1/push/adv'; // 分页查询、新增、修改、删除、单条查询

exports.pushAdv = pushAdv;
var enablePushAdv = 'v1/push/adv/enable'; // 启用广告

exports.enablePushAdv = enablePushAdv;
var getSimplePushAdv = 'v1/push/adv/simple'; // 简要信息查询

exports.getSimplePushAdv = getSimplePushAdv;
var verifyPushAdv = 'v1/push/adv/verify'; // 审核

exports.verifyPushAdv = verifyPushAdv;
var getAdvModelImage = 'v1/push/model/getImage/'; // 获取广告样式示例图片
// 推送流水

exports.getAdvModelImage = getAdvModelImage;
var pushWater = 'v1/push/adv/records'; // 推送流水记录
// 推送广告时间段

exports.pushWater = pushWater;
var pushTime = 'v1/push/time';
exports.pushTime = pushTime;
var checkPushTime = 'v1/push/time/check'; // 校验时间段合法
// 部门广告资源使用情况

exports.checkPushTime = checkPushTime;
var getAdvUsingInfo = 'v1/push/advUsing'; // 广告规则

exports.getAdvUsingInfo = getAdvUsingInfo;
var pushRules = 'v1/push/feeRules';
exports.pushRules = pushRules;
var pagePushRules = 'v1/push/page/feeRules';
exports.pagePushRules = pagePushRules;
var listPushFeeRules = 'v1/push/list/feeRules'; // 广告充值记录

exports.listPushFeeRules = listPushFeeRules;
var pagePushAdvRecharge = 'v1/push/page/advRecharge';
exports.pagePushAdvRecharge = pagePushAdvRecharge;
var pushRecharge = 'v1/push/recharge'; // 判断能不能使用充值按钮(自助充值或上级充下级)

exports.pushRecharge = pushRecharge;
var isUseRecharge = 'v1/push/isUseRecharge';
exports.isUseRecharge = isUseRecharge;
var loadZzRechargeRules = 'v1/push/loadZzRechargeRules';
exports.loadZzRechargeRules = loadZzRechargeRules;
var advChangeWxPay = 'v1/push/advChangeWxPay'; // 微信支付下单
// 消息通知

exports.advChangeWxPay = advChangeWxPay;
var getMsgTypeCount = 'v1/notify/count'; // 获取不同类型已读和未读的总数

exports.getMsgTypeCount = getMsgTypeCount;
var pageMsgByUserId = 'v1/notify/page'; // 获取用户消息列表

exports.pageMsgByUserId = pageMsgByUserId;
var getNotifySetting = 'v1/notify/getSetting'; // 获取用户消息通知设置

exports.getNotifySetting = getNotifySetting;
var setNotifyConfig = 'v1/notify/setting'; // 设置消息通知

exports.setNotifyConfig = setNotifyConfig;
var getMsgDetailedInfo = 'v1/notify/msg/'; // 获取消息文本详细信息

exports.getMsgDetailedInfo = getMsgDetailedInfo;
var getNotify = 'v1/notify/send/page'; // 查看发送过的消息

exports.getNotify = getNotify;
var sendNotify = 'v1/notify/send'; // 发送消息

exports.sendNotify = sendNotify;
var setReadAll = 'v1/notify/setReadAll'; // 标记所有为已读
// 专用统计模块

exports.setReadAll = setReadAll;
var getAdvStatist = 'v1/statist/adv'; // 广告统计

exports.getAdvStatist = getAdvStatist;
var getAdvStatistPie = 'v1/statist/adv/pie'; // 广告统计 - 只返回饼图
// 产品追踪

exports.getAdvStatistPie = getAdvStatistPie;
var searchPage = 'v1/ai/cam/page'; // 查询

exports.searchPage = searchPage;
var addCam = 'v1/ai/cam'; // 添加

exports.addCam = addCam;
var adaptCam = 'v1/ai/cam/info'; // 详情修改

exports.adaptCam = adaptCam;
var doCamTitle = 'v1/ai/cam/title'; // 常用操作类型文本

exports.doCamTitle = doCamTitle;
var historyCount = 'v1/ai/cam/statist/count'; // 统计总数

exports.historyCount = historyCount;
var statistCamLine = 'v1/ai/cam/statist/line';
exports.statistCamLine = statistCamLine;
var statistCamPie = 'v1/ai/cam/statist/pie'; // -------------------- 人脸识别平台 ---------------- \\
// --------- 平台收费 -------- \\

exports.statistCamPie = statistCamPie;
var faceMonthlyFeeWxPay = 'v1/yunPay/faceMonthly';
exports.faceMonthlyFeeWxPay = faceMonthlyFeeWxPay;
var facePointFeeWxPay = 'v1/yunPay/facePoint';
exports.facePointFeeWxPay = facePointFeeWxPay;
var reflushLoginType = 'v1/reflushLoginType';
exports.reflushLoginType = reflushLoginType;
var faceOrderSearch = 'v1/yunPay/faceOrderSearch'; // 查询充值情况
// --------- 基础数据 -------- \\
// 进出记录

exports.faceOrderSearch = faceOrderSearch;
var getAIInOut = 'v1/ai/aiInOut/page'; // 获取列表

exports.getAIInOut = getAIInOut;
var getAIPic = 'v1/ai/aiGetCameraFile/inOutPhoto/'; // 获取图片

exports.getAIPic = getAIPic;
var syncAIInOut = 'v1/ai/aiInOut/syncInOutRecord'; // 同步进出记录

exports.syncAIInOut = syncAIInOut;
var getAITreeInOut = 'v1/ai/aiInOut/tree/page'; // 获取树列表

exports.getAITreeInOut = getAITreeInOut;
var exportInout = 'v1/ai/aiInOutRecords/export'; // 导出进出记录
// export const exportInout = 'v1/ai/aiInOutRecordExport/export' // 导出进出记录
// 实时统计

exports.exportInout = exportInout;
var getInoutIntime = 'v1/ai/aiInOutAnalyse/page'; // 获取离场在场进场次数
// -------- 相机维护 --------- \\
// 体温相机---------2020//

exports.getInoutIntime = getInoutIntime;
var cameraCon = 'v1/ai/aiTokenTemperature/doBindCamera'; // 绑定体温人脸机

exports.cameraCon = cameraCon;
var seekRecord = 'v1/ai/aiTokenSnapshotRecord/page'; // 查询比对记录

exports.seekRecord = seekRecord;
var seekImage = 'v1/ai/aiTokenSnapshotRecord/getRecordPhoto'; // 查询比对图片
// 体温用户

exports.seekImage = seekImage;
var doFaceUser = 'v1/ai/aiUserTemperature'; // 添加用户 post adapt -- put

exports.doFaceUser = doFaceUser;
var seekAllUser = 'v1/ai/aiUserTemperature/page'; // 查询所有的用户

exports.seekAllUser = seekAllUser;
var seekAllCamera = 'v1/ai/aiTokenTemperature'; // 查看通道

exports.seekAllCamera = seekAllCamera;
var seekBackShow = 'v1/ai/aiTokenTemperature/getPermissionByUserIdAndDepId'; // 回显通道
// 绑定相机

exports.seekBackShow = seekBackShow;
var AIBindCamera = 'v1/ai/aiToken/bindCamera'; // 相机管理

exports.AIBindCamera = AIBindCamera;
var getAICamera = 'v1/ai/aiToken/pageByDepartmentId'; // 获取所有通道

exports.getAICamera = getAICamera;
var getAICameras = 'v1/ai/aiToken/pageByDepartmentIdAndCameraType'; // 获取所有通道

exports.getAICameras = getAICameras;
var getAddTime = 'v1/workSchedule'; // 添加设置时间

exports.getAddTime = getAddTime;
var getDate = 'v1/workSchedule'; // 查询数据

exports.getDate = getDate;
var getDates = 'v1/workSchedules'; // 查询数据

exports.getDates = getDates;
var getBind = 'v1/tokenWorkScheduleRel'; // 绑定相机

exports.getBind = getBind;
var getUnbind = 'v1/unbindRel'; // 解绑相机

exports.getUnbind = getUnbind;
var editAICameraName = 'v1/ai/aiToken/update'; // 修改通道名称

exports.editAICameraName = editAICameraName;
var updateCameraAl = 'v1/ai/aiToken/upgrade'; // 升级相机

exports.updateCameraAl = updateCameraAl;
var syncState = 'v1/ai/aiLocalPermission/updateState'; // 相机同步状态修改

exports.syncState = syncState;
var openOutLog = 'pv/v1/ai/oa/openRelayRecord/page'; // 查询开闸记录
// 生产部测试

exports.openOutLog = openOutLog;
var getAIProductionTest = 'v1/ai/aiToken/pageByThree'; // 获取列表

exports.getAIProductionTest = getAIProductionTest;
var bindProdAICamera = 'v1/ai/aiToken/bindCamera/ids'; // 绑定相机

exports.bindProdAICamera = bindProdAICamera;
var unBindProdAICamera = 'v1/ai/aiToken/unbindCamera/ids'; // 解绑相机
// ----1 华安人脸相机

exports.unBindProdAICamera = unBindProdAICamera;
var unBindAICamera = 'v1/ai/aiToken/unbindCamera/'; // 解绑相机

exports.unBindAICamera = unBindAICamera;
var reAIBoot = 'v1/ai/aiSetCamera/reBoot/'; // 重启相机

exports.reAIBoot = reAIBoot;
var setAITime = 'v1/ai/aiSetCamera/setTime/'; // 校时

exports.setAITime = setAITime;
var clearAIWhite = 'v1/ai/aiSetCamera/delete/'; // 清空白名单

exports.clearAIWhite = clearAIWhite;
var focusAIDown = 'v1/ai/aiSetCamera/focusDown'; // 向下调焦

exports.focusAIDown = focusAIDown;
var focusAIUp = 'v1/ai/aiSetCamera/focusUp'; // 向上调焦

exports.focusAIUp = focusAIUp;
var getAISnap = 'v1/ai/aiGetCameraFile/snapsho/'; // 获取快照

exports.getAISnap = getAISnap;
var getAIParams = 'v1/ai/aiSetCamera/getCameraParameter/'; // 获取相机设置

exports.getAIParams = getAIParams;
var setAIParams = 'v1/ai/aiSetCamera/setCamera'; // 设置相机

exports.setAIParams = setAIParams;
var getAIVer = 'v1/ai/aiSetCamera/getCamVer/'; // 获取相机版本信息

exports.getAIVer = getAIVer;
var zoomAIDown = 'v1/ai/aiSetCamera/zoomDown'; // 减小倍数

exports.zoomAIDown = zoomAIDown;
var zoomAIUp = 'v1/ai/aiSetCamera/zoomUp'; // 增加倍数

exports.zoomAIUp = zoomAIUp;
var setAIpar = 'v1/ai/aiSetCamera/setPar'; // 设置单个相机参数

exports.setAIpar = setAIpar;
var getAICameraFiles = 'v1/ai/aiGetCameraFile/'; // 获取文件

exports.getAICameraFiles = getAICameraFiles;
var getAIAppCameraFile = 'v1/ai/aiAppGetLog/'; // 获取android文件
// ----2 安卓人脸

exports.getAIAppCameraFile = getAIAppCameraFile;
var getAIAndroidParams = 'v1/ai/aiSetCamera/getAppCameraParameter/'; // 获取参数值

exports.getAIAndroidParams = getAIAndroidParams;
var setAIAndroidParams = 'v1/ai/aiSetCamera/setAppCamera'; // 设置参数值
// ----3.安卓科发人脸

exports.setAIAndroidParams = setAIAndroidParams;
var AIAndroidKFParams = 'v1/ai/aiSetCamera/getKfCameraParameter'; // 获取、设定参数
// ----4.畅盈Linux人脸 X系列

exports.AIAndroidKFParams = AIAndroidKFParams;
var getAILinuxParams = 'v1/ai/aiSetCamera/getCycCameraParameter/'; // 获取参数值

exports.getAILinuxParams = getAILinuxParams;
var setAILinuxParams = 'v1/ai/aiSetCamera/setCycCamera'; // 设定参数值
// 相机状态

exports.setAILinuxParams = setAILinuxParams;
var cloudAICamera = 'v1/ai/aiToken/page';
exports.cloudAICamera = cloudAICamera;
var UpgradeAIUnbindCamera = 'v1/cameraOperation/cameraUpgradeUnbindAi'; // 升级未绑定的相机
// ------- 人脸识别 ------- \\
// 人脸参数设置

exports.UpgradeAIUnbindCamera = UpgradeAIUnbindCamera;
var cameraAIParams = 'v1/ai/cameraType/style'; // 获取、提交基础参数

exports.cameraAIParams = cameraAIParams;
var cameraAIOneParams = 'v1/ai/camera/json'; // 获取和设置单个相机的参数
// 审核设置

exports.cameraAIOneParams = cameraAIOneParams;
var AISetting = 'v1/ai/aiCheckSetup'; // 获取和设置

exports.AISetting = AISetting;
var deleteAIInOutTime = 'v1/ai/cameraTable/delTimeLimitTable'; // 删除时间段

exports.deleteAIInOutTime = deleteAIInOutTime;
var AIInOutTime = 'v1/ai/aiInOutTime'; // 获取，更新和添加列表

exports.AIInOutTime = AIInOutTime;
var updateCamera = 'v1/ai/aiApp/upgrade'; // 升级安卓人脸的相机

exports.updateCamera = updateCamera;
var optionsOrder = 'v1/ai/aiSetParam'; // 添加修改删除命令接口

exports.optionsOrder = optionsOrder;
var deviceReboot = 'v1/ai/aiApp/appRestart'; // 安卓相机设备重启

exports.deviceReboot = deviceReboot;
var aKeyOpened = 'v1/ai/aiApp/openRelay'; // 安卓相机一键开闸

exports.aKeyOpened = aKeyOpened;
var dataReset = 'v1/ai/aiApp/restore'; // 安卓相机恢复出厂设置
// 账户管理

exports.dataReset = dataReset;
var checkAICamera = 'v1/ai/aiToken/check/'; // 获取所有相机

exports.checkAICamera = checkAICamera;
var getAccountCamera = 'v1/ai/aiDuyCompany/getDutyCompanyChannelId'; // 获取账户下的通道

exports.getAccountCamera = getAccountCamera;
var checkAILinuxCamera = 'v1/ai/aiToken/check/linux/'; // 获取所有Linux相机

exports.checkAILinuxCamera = checkAILinuxCamera;
var getAiDuyCompany = 'v1/ai/aiDuyCompany/page'; // 获取列表

exports.getAiDuyCompany = getAiDuyCompany;
var AiDuyCompany = 'v1/ai/aiDuyCompany'; // 新增、更新、删除、删除所有和检查手机号

exports.AiDuyCompany = AiDuyCompany;
var uploadAiDuyCompany = process.env.API_HOST + 'os/v1/ai/aiDuyCompany/import'; // 上传文件

exports.uploadAiDuyCompany = uploadAiDuyCompany;
var updateAIPassword = 'v1/ai/aiDuyCompany/updatePsw'; // 修改密码

exports.updateAIPassword = updateAIPassword;
var checkAllow = 'v1/ai/aiDuyCompany/checkIsLoginAndPower';
exports.checkAllow = checkAllow;
var AIpermission = 'v1/ai/aiLocalPermission'; // 查询和修改通道权限

exports.AIpermission = AIpermission;
var AIpermissions = 'v1/ai/batch/aiLocalPermission'; // 批量修改通道权限

exports.AIpermissions = AIpermissions;
var departments = 'v1/ai/batch/department/aiLocalPermission'; // 部门更新

exports.departments = departments;
var checkTypes = 'v1/ai/aiDuyCompany/updateBatchCheckDutyCompany'; // 批量审核账户
// 新增

exports.checkTypes = checkTypes;
var ApiStudentUpload = 'v1/ai/aiUser/student/export/'; // 学生数据导出
// =======================================
// 用户批量导入

exports.ApiStudentUpload = ApiStudentUpload;
var getAIUserImport = 'v1/ai/aiUserImport/page'; // 获取列表

exports.getAIUserImport = getAIUserImport;
var updateAIUserImport = 'v1/ai/aiUserImport/update'; // 修改用户信息
//  process.env.API_HOST +

exports.updateAIUserImport = updateAIUserImport;
var updateAIUserImportPhoto = 'v1/ai/aiUserImport/photo/update'; // 修改单张图片

exports.updateAIUserImportPhoto = updateAIUserImportPhoto;
var AIUserImportPhoto = 'v1/ai/aiUserImport/photo/import'; // 导入所有图片

exports.AIUserImportPhoto = AIUserImportPhoto;
var deleteAIUserImport = 'v1/ai/aiUserImport'; // 批量删除

exports.deleteAIUserImport = deleteAIUserImport;
var AIUserImport = process.env.API_HOST + 'os/v1/ai/aiUserImport/aiImport'; // 导入Excal文件

exports.AIUserImport = AIUserImport;
var checkAIUserImportPhoto = 'v1/ai/aiUser/checkPhoto/photo'; // 校验单张图片是否合格

exports.checkAIUserImportPhoto = checkAIUserImportPhoto;
var exportAIUserImport = 'v1/ai/aiUser/export'; // 导出模板
// 新增

exports.exportAIUserImport = exportAIUserImport;
var ApiExportUnqualifiedList = 'v1/ai/aiUser/error/export/'; // 导出不合格清单
// 小区房屋信息

exports.ApiExportUnqualifiedList = ApiExportUnqualifiedList;
var createModel = 'v1/buildingInfo/insertRoomsTemplate'; // 添加模板

exports.createModel = createModel;
var showModel = 'v1/buildingInfo/echoTemplate'; // 回显模板

exports.showModel = showModel;
var deleteModel = 'v1/buildingInfo/deleteRoomsTemplate'; // 删除模板

exports.deleteModel = deleteModel;
var deleteAllModel = 'v1/buildingInfo/deleteAll'; // 删除所有

exports.deleteAllModel = deleteAllModel;
var saveHouseInfo = 'v1/buildingInfo/insertRoomsInfo'; // 存储房间号以及模板信息到后端

exports.saveHouseInfo = saveHouseInfo;
var showBuilding = 'v1/buildingInfo/getBudsNameByDepartmentId'; // 回显楼栋

exports.showBuilding = showBuilding;
var showFloor = 'v1/buildingInfo/getFloorByDepartmentIdAndBuilding'; // 回显楼层

exports.showFloor = showFloor;
var showRoom = 'v1/buildingInfo/getRoomByDepartmentIdAndBuildingAndFloor'; // 回显房间

exports.showRoom = showRoom;
var userTemplateReplaceRooms = 'v1/buildingInfo/userTemplateReplaceRooms'; // 应用模板
// 黑名单

exports.userTemplateReplaceRooms = userTemplateReplaceRooms;
var addBlackUser = 'v1/ai/aiUser/insertBlacklistUser'; // 添加黑名单用户信息

exports.addBlackUser = addBlackUser;
var addBatchBlackUser = 'v1/ai/aiUser/insertBatchBlacklistUser'; // 批量添加黑名单用户
// 部门树

exports.addBatchBlackUser = addBatchBlackUser;
var getAITreeData = 'v1/ai/aiDuyCompany/getTree'; // 获取账户树和用户数据

exports.getAITreeData = getAITreeData;
var getAIDuyUser = 'v1/ai/aiUser/tree/page'; // 获取部门所有用户信息

exports.getAIDuyUser = getAIDuyUser;
var deleteAIDuyUser = 'v1/ai/aiDuyCompany/tree'; // 删除树节点

exports.deleteAIDuyUser = deleteAIDuyUser;
var getAIDuyDetail = 'v1/ai/aiDuyCompany/one/'; // 获取树节点详情
// - 导入失败

exports.getAIDuyDetail = getAIDuyDetail;
var getAIErrorData = 'v1/ai/aiDutyCompanyTmp/page'; // 获取列表

exports.getAIErrorData = getAIErrorData;
var AIErrorData = 'v1/ai/aiDutyCompanyTmp'; // 修改、删除和删除所有
// 成员信息

exports.AIErrorData = AIErrorData;
var getAIMember = 'v1/ai/aiUser/pageByDutyCompanyId'; // 获取列表

exports.getAIMember = getAIMember;
var AIMember = 'v1/ai/aiUser'; // 新增、修改、删除和删除所有

exports.AIMember = AIMember;
var uploadAImMember = process.env.API_HOST + 'os/v1/ai/aiUser/checkPhoto'; // 图片上传

exports.uploadAImMember = uploadAImMember;
var checkIsAddAIMember = 'v1/ai/aiUser/isAdd'; // 检测是否可以添加成员

exports.checkIsAddAIMember = checkIsAddAIMember;
var checkAIMemeber = 'v1/ai/aiUser/isCheck'; // 审核用户

exports.checkAIMemeber = checkAIMemeber;
var seeAIMemberPhoto = 'v1/ai/aiUser/getPhoto/'; // 查看图片

exports.seeAIMemberPhoto = seeAIMemberPhoto;
var updateMemberPhoto = 'v1/ai/aiUser/updatePhoto'; // 修改图片

exports.updateMemberPhoto = updateMemberPhoto;
var checkAIMemberPhoto = 'v1/ai/aiUser/checkPhoto'; // 检测图片

exports.checkAIMemberPhoto = checkAIMemberPhoto;
var noCheckAIMemberPhoto = 'v1/ai/aiUser/noCheckPhoto'; // 跳过校验检测图片

exports.noCheckAIMemberPhoto = noCheckAIMemberPhoto;
var getUUid = 'v1/ai/aiUser/getCardNum'; // 获取一个UUID

exports.getUUid = getUUid;
var deleteAIMembers = 'v1/ai/aiUser/departmentId'; // 删除所有 用户管理

exports.deleteAIMembers = deleteAIMembers;
var getWxQRcode = 'pv/v1/wx/getWxQRcodeByDepartId'; // 获取关注二维码
// 成员管理

exports.getWxQRcode = getWxQRcode;
var usersAIManage = 'v1/ai/aiUser/page';
exports.usersAIManage = usersAIManage;
var typeCheck = 'v1/ai/aiUser/batch/update/isCheck'; // 批量审核

exports.typeCheck = typeCheck;
var getUserChannel = 'v1/ai/aiUser/getChannel'; // 获取用户通道
// ---------- 远程维护 ---------- \\
// 相机文件

exports.getUserChannel = getUserChannel;
var getAICameraFile = 'v1/camera/aiCameraFile/page/'; // 获取列表

exports.getAICameraFile = getAICameraFile;
var getLinuxAIFiles = 'v1/cameraOperation/loadCameraFileAi'; // 获取Linux文件列表

exports.getLinuxAIFiles = getLinuxAIFiles;
var getAndroidAIFiles = 'v1/ai/aiAppGetLog'; // 获取Android文件列表

exports.getAndroidAIFiles = getAndroidAIFiles;
var deleteAICameraFile = 'v1/camera/cameraFile'; // 删除文件

exports.deleteAICameraFile = deleteAICameraFile;
var downAIFile = 'v1/camera/cameraFile/'; // 下载文件
// 升级文件

exports.downAIFile = downAIFile;
var getAIFile = 'v1/camera/aiCameraFile/upgrade'; // 获取文件 根据相机类型

exports.getAIFile = getAIFile;
var uploadAICameraFile = process.env.API_HOST + 'os/v1/camera/cameraFile'; // 上传文件

exports.uploadAICameraFile = uploadAICameraFile;
var UpgradeAICamera = 'v1/cameraOperation/cameraUpgradeAi'; // 升级相机

exports.UpgradeAICamera = UpgradeAICamera;
var UpgradeAIHttpCamera = 'v1/aiHttpUpgrade'; // 升级相机

exports.UpgradeAIHttpCamera = UpgradeAIHttpCamera;
var outSideType = 'v1/camera/outSide'; // 外部对接升级相机
// 参数设置

exports.outSideType = outSideType;
var AIParamsSetting = 'v1/cameraOperation/settingParametersAi';
exports.AIParamsSetting = AIParamsSetting;
var AICameraParams = 'v1/ai/aiCameraConfigIni'; // 获取列表、添加和修改

exports.AICameraParams = AICameraParams;
var AIcameraParamsList = 'v1/cameraOperation/setParList'; // 参数设置--平台相机使用
// 实时控制

exports.AIcameraParamsList = AIcameraParamsList;
var AIsendCommand = 'v1/cameraOperation/sendCommandAi';
exports.AIsendCommand = AIsendCommand;
var getOrderList = 'v1/ai/aiSetParam/list'; // 获取所有实时控制命令

exports.getOrderList = getOrderList;
var AIsentCommandList = 'v1/cameraOperation/sendCommandList'; // 发送控制命令给相机--平台相机使用 '
// 升级日志

exports.AIsentCommandList = AIsentCommandList;
var getUpgradeLog = 'v1/camera/cameraOperation/page'; // 获取列表'
// 建行无感支付

exports.getUpgradeLog = getUpgradeLog;
var getPageOrder = 'v1/ccb/orderTmp/count'; // 统计分页记录数据

exports.getPageOrder = getPageOrder;
var getPage = 'v1/ccb/orderTmp/page'; // 分页查询建行入口预付支付成功但没有使用的订单

exports.getPage = getPage;
var getPageCount = 'v1/ccb/orderTmp/count'; // 分页查询建行入口预付支付成功但没有使用的订单 统计
// --------- 考勤管理 -------------- \\
// 班次管理

exports.getPageCount = getPageCount;
var getAIShifts = 'v1/workShift/page'; // 获取列表

exports.getAIShifts = getAIShifts;
var AIShifts = 'v1/workShift'; // 新增、删除、编辑和详情

exports.AIShifts = AIShifts;
var getAIShiftsList = 'v1/workShift/list'; // 获取下拉列表
// 考勤组

exports.getAIShiftsList = getAIShiftsList;
var AIAttendGroup = 'v1/workCheckGroup'; // 获取列表、新增、修改和删除

exports.AIAttendGroup = AIAttendGroup;
var AIAttendGroupDetail = 'v1/workCheckGroup/detail'; // 获取详情

exports.AIAttendGroupDetail = AIAttendGroupDetail;
var AIDuyCompanyAndAiUser = 'v1/ai/aiDuyCompanyAndAiUser/getTree'; // 根据部门获取下级部门和用户-考勤组内使用

exports.AIDuyCompanyAndAiUser = AIDuyCompanyAndAiUser;
var AIAttendGroupShifts = 'v1/workCycle'; // 获取、新增用户排班

exports.AIAttendGroupShifts = AIAttendGroupShifts;
var exportAIAttendGroupShifts = 'v1/workShift/export'; // 导出排班
// -------------------- 考勤统计 ------------------- \\
// 每日统计

exports.exportAIAttendGroupShifts = exportAIAttendGroupShifts;
var AIDailyCount = 'v1/workRecord/page'; // 获取列表

exports.AIDailyCount = AIDailyCount;
var exportAIDailyCount = 'v1/workRecord/export'; // 导出报表

exports.exportAIDailyCount = exportAIDailyCount;
var updateAIDailyCount = 'v1/workRecord'; // 修改考勤

exports.updateAIDailyCount = updateAIDailyCount;
var applyOverTime = 'v1/workMonthCount/applyOverTime'; // 申请跨天加班
// 每月统计

exports.applyOverTime = applyOverTime;
var AIMonthlyCount = 'v1/workMonthCount/page'; // 获取列表

exports.AIMonthlyCount = AIMonthlyCount;
var exportAIMonthlyCount = 'v1/workMontht/export'; // 导出报表

exports.exportAIMonthlyCount = exportAIMonthlyCount;
var setMonthTime = 'v1/workMonthCount/updateAttendanceDate'; // 设置考勤起始时间

exports.setMonthTime = setMonthTime;
var getMonthTime = 'v1/workMonthCount'; // 获取起始时间
// 核销统计

exports.getMonthTime = getMonthTime;
var AIWriteOff = 'v1/workWriteOff/page'; // 获取列表

exports.AIWriteOff = AIWriteOff;
var deleteAIWriteOff = 'v1/workWriteOff'; // 删除
// 考勤申请信息

exports.deleteAIWriteOff = deleteAIWriteOff;
var applyOverTimet = 'v1/workMonthCount/applyOverTime/check'; // 审核加班
// export const deleteAIWriteOff = 'v1/workWriteOff' // 删除
// --------- 高级功能 -------------- \\
// 流量统计

exports.applyOverTimet = applyOverTimet;
var getFlow = 'v1/ai/aiDownloadCount/page'; // 获取流量记录月统计

exports.getFlow = getFlow;
var getCountFlow = 'v1/ai/aiDownloadFileRecord/page'; // 获取流量记录次数统计

exports.getCountFlow = getCountFlow;
var getPostSetting = 'v1/aiInOutPushConfig'; // 获取

exports.getPostSetting = getPostSetting;
var createQRcode = 'v1/ai/barCode/produceCode'; // 根据内容生成二维码
// -------------------工地管理-------------------- \\
// 工地管理第三方协议需要的密钥验证等信息

exports.createQRcode = createQRcode;
var getFullInfo = 'v1/thirdProtocolPram/get'; // 根据部门id获取所有

exports.getFullInfo = getFullInfo;
var delInfo = 'v1/thirdProtocolPram/delete'; // 删除

exports.delInfo = delInfo;
var addInfo = 'v1/thirdProtocolPram/insert'; // 添加修改

exports.addInfo = addInfo;
var getRemark = 'v1/thirdProtocol/get'; // 根据协议获取填写备注
// LED屏

exports.getRemark = getRemark;
var getMac = 'v1/ai/ledApp/makeLedBX5E1'; // 生成一个默认控制卡序列号

exports.getMac = getMac;
var validtorMac = 'v1/ai/ledApp'; // 校验app是否连接或MAC是否填写错误

exports.validtorMac = validtorMac;
var bindApp = 'v1/ai/ledApp/bindApp'; // 绑定APP
// 通道管理

exports.bindApp = bindApp;
var gainAllLedApp = 'v1/ai/ledApp/page'; // 获取部门所有显示屏控制App

exports.gainAllLedApp = gainAllLedApp;
var unbind = 'v1/ai/ledApp/unBind'; // 解绑

exports.unbind = unbind;
var backShow = 'v1/ai/ledApp/listPermission'; // 获取LED APP的主控相机

exports.backShow = backShow;
var updateParams = 'v1/ai/ledApp/update'; // 修改相关参数

exports.updateParams = updateParams;
var ledAppSetAdv = 'v1/ai/ledApp/setAdv'; // 设置提示语

exports.ledAppSetAdv = ledAppSetAdv;
var ledAppTurnOff = 'v1/ai/ledApp/turnOff'; // 关机

exports.ledAppTurnOff = ledAppTurnOff;
var ledAppTurnOn = 'v1/ai/ledApp/turnOn'; // 开机

exports.ledAppTurnOn = ledAppTurnOn;
var ledAppSyncWhiteList = 'v1/ai/ledApp/syncWhiteList'; // 同步白名单

exports.ledAppSyncWhiteList = ledAppSyncWhiteList;
var ledAppDeleteWhiteList = 'v1/ai/ledApp/deleteWhiteList'; // 清空白名单
// 工地工种类型

exports.ledAppDeleteWhiteList = ledAppDeleteWhiteList;
var delWorkType = 'v1/workerType'; // 根据id删除

exports.delWorkType = delWorkType;
var addWorker = 'v1/workerType/insert'; // 添加

exports.addWorker = addWorker;
var adaptWorker = 'v1/workerType/update'; // 修改

exports.adaptWorker = adaptWorker;
var typeManage = 'v1/workerType/list'; // 工种管理回显所有工种以及勾选情况

exports.typeManage = typeManage;
var addTypeUser = 'v1/workerType/list/addUser'; // 用户添加选择工种

exports.addTypeUser = addTypeUser;
var defaultGo = 'v1/workerType/insertDefault'; // 勾选的默认工种

exports.defaultGo = defaultGo;
var pageLedApp = 'v1/ai/ledApp/page';
exports.pageLedApp = pageLedApp;
var listCheck = 'v1/ai/ledApp/listCheck';
exports.listCheck = listCheck;
var ledSetting = 'v1/ai/ledSetting'; // LED管理

exports.ledSetting = ledSetting;
var fuzzySearch = 'v1/ai/ledApp/likeSelect/page'; // 所有APP和控制卡平台模糊查询
// -------------------- 售后平台 -------------------- \\
// ------------- 人员管理-------------\\

exports.fuzzySearch = fuzzySearch;
var ASUser = 'as/user'; // 获取、新增和删除

exports.ASUser = ASUser;
var updateASUser = 'as/user/update'; // 更新
// ------------ 任务管理 -------------- \\

exports.updateASUser = updateASUser;
var getASTask = 'as/problemNoImg'; // 获取分页

exports.getASTask = getASTask;
var deleteASTask = 'as/problem'; // 删除

exports.deleteASTask = deleteASTask;
var ASTaskPic = 'as/problemDetail/'; // 获取图片
// ------------ 物业评价 -------------- \\

exports.ASTaskPic = ASTaskPic;
var getASStaffEvaluate = 'as/evaluation'; // 获取列表
// ------------ 解决方案 -------------- \\

exports.getASStaffEvaluate = getASStaffEvaluate;
var getASSolution = 'as/solution'; // 获取列表

exports.getASSolution = getASSolution;
var getASSolutionPic = 'as/getSolutionById/'; // 获取图片
// ------------ 接单记录 -------------- \\

exports.getASSolutionPic = getASSolutionPic;
var getOrderRecords = 'as/userProblem'; // 获取列表
// ----------- 人员地址 ---------- \\

exports.getOrderRecords = getOrderRecords;
var getOrderAddress = 'as/userAddress'; // 获取列表
// 用户反馈

exports.getOrderAddress = getOrderAddress;
var suggestionAdd = '/pv/v1/suggestion'; // 新增

exports.suggestionAdd = suggestionAdd;
var suggestion = 'v1/suggestion'; // 获取、删除

exports.suggestion = suggestion;
var picSuggestion = 'v1/app/suggestion/'; // 获取图片

exports.picSuggestion = picSuggestion;
var uploadSugPic = process.env.API_HOST + 'os/v1/suggestionImg'; // 上传图片
// 平台收费

exports.uploadSugPic = uploadSugPic;
var pagePointsRules = 'v1/face/rules/page';
exports.pagePointsRules = pagePointsRules;
var pointsRules = 'v1/face/rules';
exports.pointsRules = pointsRules;
var pagePointsRecords = 'v1/face/pointsRecords';
exports.pagePointsRecords = pagePointsRecords;
var points = 'v1/face/points';
exports.points = points;
var getEventOpen = 'v1/face/eventOpen'; // 获取收费功能有没开启的状态
// 回收站

exports.getEventOpen = getEventOpen;
var pageRecoveryWhite = 'v1/recovery/white/page';
exports.pageRecoveryWhite = pageRecoveryWhite;
var recoveryWhite = 'v1/recovery/white/ids';
exports.recoveryWhite = recoveryWhite;
var pageRecoveryWhiteDetail = 'v1/recovery/white/page/ids'; // 查看

exports.pageRecoveryWhiteDetail = pageRecoveryWhiteDetail;
var recoveryWhiteDetail = 'v1/recovery/white/come/ids'; // 恢复单个
// 公众号、小程序绑定和管理

exports.recoveryWhiteDetail = recoveryWhiteDetail;
var wxManager = 'v1/face/wx'; // 微信自定义菜单

exports.wxManager = wxManager;
var WXMemu = 'v1/faceWxMemu'; // 收费设置

exports.WXMemu = WXMemu;
var feeEvent = 'v1/face/event';
exports.feeEvent = feeEvent;
var pageFeeEvent = 'v1/face/page/event'; // 工作台

exports.pageFeeEvent = pageFeeEvent;
var getPoint = 'v1/ai/websiteConsole/getPoint'; // 获取积分

exports.getPoint = getPoint;
var getRecord = 'v1/ai/websiteConsole/countByDutyCompanyAndAiUser';
exports.getRecord = getRecord;
var getMessageIsYUN = 'v1/ai/websiteConsole/getMessageIsYUN'; // 获取快报列表

exports.getMessageIsYUN = getMessageIsYUN;
var getAuditList = 'v1/ai/websiteConsole/listByUncheckDutyCompany'; // 获取待审批列表

exports.getAuditList = getAuditList;
var getNoteList = 'v1/ai/websiteConsole/getNotePadsByDepartmentIdAndUserId'; // 获取便签

exports.getNoteList = getNoteList;
var insertNoteList = 'v1/ai/websiteConsole/insertNotepads'; // 添加便签

exports.insertNoteList = insertNoteList;
var updateNoteList = 'v1/ai/websiteConsole/updateNotePads'; // 更新便签

exports.updateNoteList = updateNoteList;
var aiNotify = 'v1/ai/aiNotify'; // 获取物业通知栏
// 广告分类

exports.aiNotify = aiNotify;
var searchAdv = 'v1/push/model';
exports.searchAdv = searchAdv;
var checkAdv = process.env.API_HOST + 'v1/push/model'; // 新增接口

exports.checkAdv = checkAdv;
var whiteBlackList = 'v1/ai/aiUser/changeUserType'; // 黑白名单转化

exports.whiteBlackList = whiteBlackList;
var getUnit = 'v1/buildingInfo/getBuildingsName'; // 获取该模板应用的楼栋

exports.getUnit = getUnit;
var delUnit = 'v1/buildingInfo/deleteBuilding'; // 删除单元

exports.delUnit = delUnit;
var changeVisitor = 'v1/ai/aiUser/changeVisitorToUser'; // 访客转非访客

exports.changeVisitor = changeVisitor;
var getAItokens = 'v1/ai/aiDuyCompany/companyRelAiToken/'; // 获取aitokens

exports.getAItokens = getAItokens;
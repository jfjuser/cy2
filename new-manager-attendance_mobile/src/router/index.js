import Vue from 'vue'
import Router from 'vue-router'
import Store from '@/store'
import Axios from 'axios'
import { Toast } from 'vant'
// import isOS from '../src/utils/isOS'
import Login from '@/views/login/login' // 登陆 页面
import Check from '@/views/login/check' // 注册管理
import Register from '@/views/login/register' // 注册
import Index from '@/views/home/index' // 首页
import ChooseTeam from '@/views/login/chooseTeam' // 选择公司
const Page404 = () => import('@/views/errPage/404') // 404 页面
const Me = () => import('@/views/me/me') // 我的 页面
const Equipment = () => import('@/views/binding/equipment') // 设备管理
const Scan = () => import('@/views/binding/scan') // 绑定设备
const CreateInfo = () => import('@/views/binding/createInfo') // 填写基本信息
const ModifyInfo = () => import('@/views/me/set/modifyInfo') // 个人信息
const ModifyPhone = () => import('@/views/me/set/modifyPhone') // 修改手机号
const ModifyPassword = () => import('@/views/me/set/modifyPassword') // 修改密码
const Forgot = () => import('@/views/login/forgot') // 重置密码
const Message = () => import('@/views/me/message') // 申请消息
const details = () => import('@/views/me/details') // 安装说明
const HelpCenter = () => import('@/views/me/helpCenter/index') // 帮助中心
const WriteOff = () => import('@/views/writeOff/index') // 核销统计
const User = () => import('@/views/user/index') // 成员管理
const Department = () => import('@/views/department/index') // Department
const DepaInfo = () => import('@/views/department/depaInfo') // 部门详情
const AddDepa = () => import('@/views/department/addDepa') // 添加部门
const AttendCount = () => import('@/views/attendCount/index') // 考勤统计
const DailyCount = () => import('@/views/attendCount/dailyCount') // 考勤统计
const MonthlyCount = () => import('@/views/attendCount/monthlyCount') // 考勤统计
const DetailCount = () => import('@/views/attendCount/detailCount') // 考勤统计
const Shifts = () => import('@/views/shifts/index') // 班次管理
const AddShifts = () => import('@/views/shifts/addShifts') // 班次管理
const AttendGroup = () => import('@/views/attendGroup/index') // 考勤组管理
const AddGroup = () => import('@/views/attendGroup/addGroup') // 考勤组管理
const AgainPunchIn = () => import('@/views/applyFor/againPunchIn') // 补卡申请
const PunchInDetail = () => import('@/views/applyFor/punchInDetail') // 补卡申请
const wxShare = () => import('@/views/attendGroup/share/wxShare') // 分享
const AddedSuccess = () => import('@/views/attendGroup/share/addedSuccess') // 智能门禁考勤
const AddFace = () => import('@/views/attendGroup/share/addFace') // 智能门禁考勤
const bindWifi = () => import('@/views/binding/bindWifi') // 设置wifi
const Visitor = () => import('@/views/visitor/index') // 访客管理
const ShareVisitor = () => import('@/views/visitor/shareVisitor/index') // 临时访客
const registerVisitor = () => import('@/views/visitor/registerVisitor/index') // 临时访客注册登记
const SetParameters = () => import('@/views/binding/setParameters') // 设置参数
const approval = () => import('@/views/approval/approval')
const modifyChannel = () => import('@/views/department/modifyChannel')
const modifyDepartment = () => import('@/views/binding/modifyDepartment')
const accessRecords = () => import('@/views/accessRecords/accessRecords')
const attendanceAbnormal = () => import('@/views/attendanceAbnormal/attendanceAbnormal')
const exceptionDetails = () => import('@/views/attendCount/exceptionDetails')
const exceptionDetailsPage = () => import('@/views/home/exceptionDetails.vue')
const ChangePassword = () => import('@/views/binding/ChangePassword.vue')
// const Wgcard = () => import('@/views/wgcard/index') // 设置参数

/** ********  【 小门禁新增扫码注册公司 】  **********/
const RegisterCompany = () => import('@/views/smallRKEAdmin/registerCompany') // 设置参数
// const SearchEquipment = () => import('@/views/smallRKEAdmin/searchEquipment') // 设置参数
/** ********  【 注册人脸 】  **********/
const FaceAI = () => import('@/views/faceAI/addUser') // 设置参数
// =================================================
Vue.use(Router)

const routes = [
  { path: '/', redirect: '/home/', meta: { title: '智能门禁考勤' } },
  { path: '/home', name: 'home', component: Index, meta: { title: '智能门禁考勤', firstLogin: true } },
  // 登录
  { path: '/login', component: Login, meta: { title: '登录', isRequireLogin: true, keepAlive: true } },
  {
    path: '/check',
    component: Check,
    meta: {
      title: '注册管理',
      isRequireLogin: true,
      keepAlive: true
    }
  },
  {
    /* eslint-disable-next-line */
    path: '/exceptionDetails', component: exceptionDetails, meta: { title: '异常详情' },
  },
  { path: '/ChangePassword', component: ChangePassword, meta: {title: '修改通道密码'} },
  { path: '/register', component: Register, meta: { title: '注册', isRequireLogin: true } },
  { path: '/approval', component: approval, meta: { title: '审批员管理', isRequireLogin: true } },
  { path: '/forgot', component: Forgot, meta: { title: '重置密码', isRequireLogin: true, keepAlive: true } },
  { path: '/chooseTeam', component: ChooseTeam, meta: { title: '选择公司', isRequireLogin: true } },
  /** ********  【 小门禁新增扫码注册公司 】  **********/
  { path: '/registerCompany/', name: 'registerCompany', component: RegisterCompany, meta: { title: '创建公司账号', companyTempId: true } },
  // { path: '/searchEquipment/', name: 'searchEquipment', component: SearchEquipment, meta: { title: '扫扫设备二维码', companyTempId: true } },
  /** ********  【 注册人脸 】  **********/
  { path: '/faceAI/', name: 'faceAI', component: FaceAI, meta: { title: '人脸录制管理' } },
  // =================================================
  // 核销统计
  { path: '/writeOff', component: WriteOff, meta: { title: '核销统计' } },
  // 查看成员
  { path: '/user', component: User, meta: { title: '成员管理' } },
  // 考勤组管理
  { path: '/attendGroup', component: AttendGroup, meta: { title: '考勤组管理' } },
  { path: '/addGroup', component: AddGroup, meta: { title: '考勤组管理' } },
  // { path: '/qrcode', component: Qrcode, meta: { title: '考勤组管理' } },
  { path: '/addedSuccess', component: AddedSuccess, meta: { title: '智能门禁考勤', isRequireLogin: true } },
  { path: '/addFace', component: AddFace, meta: { title: '智能门禁考勤', isRequireLogin: true } },
  // 班次管理
  { path: '/shifts', component: Shifts, meta: { title: '班次管理' } },
  // 进出记录查询
  { path: '/accessRecords', component: accessRecords, meta: { title: '进出记录' } },
  // 考勤异常查询
  { path: '/attendanceAbnormal', component: attendanceAbnormal, meta: { title: '设备解绑' } },
  { path: '/addShifts', component: AddShifts, meta: { title: '班次管理' } },
  // 考勤统计
  {
    /* eslint-disable-next-line */
    path: '/attendCount', component: AttendCount, redirect: '/dailyCount', meta: { title: '考勤统计' },
    children: [
      { path: '/dailyCount', component: DailyCount, meta: { title: '考勤统计', isBack: false } },
      { path: '/monthlyCount', component: MonthlyCount, meta: { title: '考勤统计', isBack: false } }
    ]
  },
  { path: '/detailCount/:type', component: DetailCount, meta: { title: '考勤统计', ischange: true } },
  // 申请管理
  { path: '/againPunchIn', component: AgainPunchIn, meta: { title: '补卡申请', keepAlive: true } }, // 补卡申请
  { path: '/punchInDetail', component: PunchInDetail, meta: { title: '补卡申请' } }, // 补卡申请详情
  // 部门管理
  { path: '/department', component: Department, meta: { title: '部门管理' } },
  { path: '/depaInfo', component: DepaInfo, meta: { title: '部门详情' } },
  { path: '/modifyChannel', component: modifyChannel, meta: { title: '修改通道' } },
  { path: '/addDepa', component: AddDepa, meta: { title: '添加部门' } },
  // 访客管理
  { path: '/visitor', component: Visitor, meta: { title: '访客管理' } },
  { path: '/shareVisitor', component: ShareVisitor, meta: { title: '临时访客', isRequireLogin: true } },
  { path: '/registerVisitor', component: registerVisitor, meta: {title: '临时访客登记', isRequireLogin: true} },
  // 个人中心
  { path: '/me', component: Me, meta: { title: '智能门禁考勤', keepAlive: true } },
  { path: '/modifyInfo', component: ModifyInfo, meta: { title: '个人信息', keepAlive: true } },
  { path: '/modifyPhone', component: ModifyPhone, meta: { title: '修改手机号', keepAlive: true } },
  { path: '/modifyPassword', component: ModifyPassword, meta: { title: '修改密码', keepAlive: true } },
  { path: '/message', component: Message, meta: { title: '申请消息' } },
  {
    path: '/details',
    component: details,
    meta: {
      title: '安装说明'
    }
  },
  { path: '/helpCenter', component: HelpCenter, meta: { title: '帮助中心', isRequireLogin: true, keepAlive: true } },
  // 绑定&设备管理
  { path: '/bindWifi', component: bindWifi, meta: { title: '设置wifi', isRequireLogin: true, keepAlive: true } },
  { path: '/setParameters', component: SetParameters, meta: { title: '设置参数' } },
  { path: '/equipment', component: Equipment, meta: { title: '设备管理' } },
  { path: '/scan', component: Scan, meta: { title: '绑定设备', isRequireLogin: true } }, // 注册时候
  { path: '/scan/:type', component: Scan, meta: { title: '添加设备' } }, // 登录后添加设备时候
  { path: '/createInfo', component: CreateInfo, meta: { title: '填写基本信息', isRequireLogin: true } },
  { path: '/modifyDepartment', component: modifyDepartment, meta: { title: '修改部门' } },

  // 首页 nav-tools-list
  // { path: '/wgcard', component: Wgcard, meta: { title: 'wg卡号管理', isRequireLogin: true } },
  // 分享
  { path: '/wxShare', component: wxShare, meta: { title: '分享' } },

  { path: '/404', component: Page404, meta: { title: '404', isRequireLogin: true } },
  { path: '*', redirect: '/404' },
  // 考勤异常页面
  { path: '/exceptionDetailsPage', component: exceptionDetailsPage, meta: {title: '考勤异常'} }
]

const router = new Router({
  base: '/attendance/manager',
  mode: 'history',
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  },
  routes
})

const RouterPush = Router.prototype.push
RouterPush.push = function (route) {
  console.log('当前要跳转的 route：', route)
}

/* ---------------------------- 处理路由拦截  -------------------------- */
let jumpLoading
let timeOutEvent
router.beforeEach((to, from, next) => {
  // 取消请求
  const CancelToken = Axios.CancelToken
  Store.state.source.cancel && Store.state.source.cancel()
  Store.state.source = CancelToken.source()
  // 跳转友好显示
  timeOutEvent = setTimeout(() => {

    // jumpLoading = Toast.loading({ message: '跳转中...', position: 'middle', duration: 0 })
  }, 400)

  if (!Store.state.url) {
    Store.commit('SET_URL', document.URL)
  }
  // isRequireLogin 是否需要判断登录权限
  let PermissionTr = ['/registerCompany/'] // 开放白名单路由
  if (!to.meta.isRequireLogin) {
    if (Store.getters.userId) {
      next()
    } else {
      if (PermissionTr.some(v => v === to.path)) { // 检测当前路由是否是白名单路由， 是则放行...
        next()
      } else {
        Toast('请先登录')
        next({ path: '/login/' })
      }
    }
  } else {
    next()
  }
})

router.afterEach(() => {
  if (timeOutEvent) clearTimeout(timeOutEvent)
  if (jumpLoading) jumpLoading.clear()
})

export default router

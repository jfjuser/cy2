import Vue from 'vue'
import Router from 'vue-router'
import Store from '@/store'
import Axios from 'axios'
import { Toast } from 'vant'
Vue.use(Router)
const routes = [
  { path: '/', redirect: '/home/', meta: { title: '智能门禁考勤' } },
  { path: '/home', name: 'home', component: resolve => require(['@/views/home/index'], resolve), meta: { title: '智能门禁考勤', firstLogin: true } },
  // 登录
  { path: '/login', component: resolve => require(['@/views/login/login'], resolve), meta: { title: '登录', isRequireLogin: true, keepAlive: true } },
  {
    path: '/check',
    component: resolve => require(['@/views/login/check'], resolve),
    meta: {
      title: '注册管理',
      isRequireLogin: true,
      keepAlive: true
    }
  },
  { path: '/register', component: resolve => require(['@/views/login/register'], resolve), meta: { title: '注册', isRequireLogin: true } },
  { path: '/forgot', component: resolve => require(['@/views/login/forgot'], resolve), meta: { title: '重置密码', isRequireLogin: true, keepAlive: true } },
  { path: '/chooseTeam', component: resolve => require(['@/views/login/chooseTeam'], resolve), meta: { title: '选择公司', isRequireLogin: true } },
  /** ********  【 小门禁新增扫码注册公司 】  **********/
  { path: '/registerCompany/', name: 'registerCompany', component: resolve => require(['@/views/smallRKEAdmin/registerCompany'], resolve), meta: { title: '创建公司账号', companyTempId: true } },
  // { path: '/searchEquipment/', name: 'searchEquipment', component: SearchEquipment, meta: { title: '扫扫设备二维码', companyTempId: true } },
  /** ********  【 注册人脸 】  **********/
  { path: '/faceAI/', name: 'faceAI', component: resolve => require(['@/views/faceAI/addUser'], resolve), meta: { title: '人脸录制管理' } },
  // =================================================
  // 核销统计
  { path: '/writeOff', component: resolve => require(['@/views/writeOff/index'], resolve), meta: { title: '核销统计' } },
  // 查看成员
  { path: '/user', component: resolve => require(['@/views/user/index'], resolve), meta: { title: '成员管理' } },
  // 考勤组管理
  { path: '/attendGroup', component: resolve => require(['@/views/attendGroup/index'], resolve), meta: { title: '考勤组管理' } },
  { path: '/addGroup', component: resolve => require(['@/views/attendGroup/addGroup'], resolve), meta: { title: '考勤组管理' } },
  // { path: '/qrcode', component: Qrcode, meta: { title: '考勤组管理' } },
  { path: '/addedSuccess', component: resolve => require(['@/views/attendGroup/share/addedSuccess'], resolve), meta: { title: '智能门禁考勤', isRequireLogin: true } },
  { path: '/addFace', component: resolve => require(['@/views/attendGroup/share/addFace'], resolve), meta: { title: '智能门禁考勤', isRequireLogin: true } },
  // 班次管理
  { path: '/shifts', component: resolve => require(['@/views/shifts/index'], resolve), meta: { title: '班次管理' } },
  { path: '/addShifts', component: resolve => require(['@/views/shifts/addShifts'], resolve), meta: { title: '班次管理' } },
  // 考勤统计
  {
    /* eslint-disable-next-line */
    path: '/attendCount', component: resolve => require(['@/views/attendCount/index'], resolve), redirect: '/dailyCount', meta: {keepAlive: true, title: '考勤统计' },
    children: [
      { path: '/dailyCount', component: resolve => require(['@/views/attendCount/dailyCount'], resolve), meta: { title: '考勤统计', keepAlive: true, isBack: false } },
      { path: '/monthlyCount', component: resolve => require(['@/views/attendCount/monthlyCount'], resolve), meta: { title: '考勤统计', keepAlive: true, isBack: false } }
    ]
  },
  { path: '/detailCount/:type', component: resolve => require(['@/views/attendCount/detailCount'], resolve), meta: { title: '考勤统计' } },
  // 申请管理
  { path: '/againPunchIn', component: resolve => require(['@/views/applyFor/againPunchIn'], resolve), meta: { title: '补卡申请', keepAlive: true } },
  // 补卡申请
  { path: '/punchInDetail', component: resolve => require(['@/views/applyFor/punchInDetail'], resolve), meta: { title: '补卡申请' } }, // 补卡申请详情
  // 部门管理
  { path: '/department', component: resolve => require(['@/views/department/index'], resolve), meta: { title: '部门管理' } },
  { path: '/depaInfo', component: resolve => require(['@/views/department/depaInfo'], resolve), meta: { title: '部门详情' } },
  { path: '/addDepa', component: resolve => require(['@/views/department/addDepa'], resolve), meta: { title: '添加部门' } },
  // 访客管理
  { path: '/visitor', component: resolve => require(['@/views/visitor/index'], resolve), meta: { title: '访客管理' } },
  { path: '/shareVisitor', component: resolve => require(['@/views/visitor/shareVisitor/index'], resolve), meta: { title: '临时访客', isRequireLogin: true } },
  // 个人中心
  { path: '/me', component: resolve => require(['@/views/me/me'], resolve), meta: { title: '智能门禁考勤', keepAlive: true } },
  { path: '/modifyInfo', component: resolve => require(['@/views/me/set/modifyInfo'], resolve), meta: { title: '个人信息', keepAlive: true } },
  { path: '/modifyPhone', component: resolve => require(['@/views/me/set/modifyPhone'], resolve), meta: { title: '修改手机号', keepAlive: true } },
  { path: '/modifyPassword', component: resolve => require(['@/views/me/set/modifyPassword'], resolve), meta: { title: '修改密码', keepAlive: true } },
  { path: '/message', component: resolve => require(['@/views/me/message'], resolve), meta: { title: '申请消息' } },
  {
    path: '/details',
    component: resolve => require(['@/views/me/details'], resolve),
    meta: {
      title: '安装说明'
    }
  },
  { path: '/helpCenter', component: resolve => require(['@/views/me/helpCenter/index'], resolve), meta: { title: '帮助中心', isRequireLogin: true, keepAlive: true } },
  // 绑定&设备管理
  { path: '/bindWifi', component: resolve => require(['@/views/binding/bindWifi'], resolve), meta: { title: '设置wifi', isRequireLogin: true, keepAlive: true } },
  { path: '/setParameters', component: resolve => require(['@/views/binding/setParameters'], resolve), meta: { title: '设置参数' } },
  { path: '/equipment', component: resolve => require(['@/views/binding/equipment'], resolve), meta: { title: '设备管理' } },
  { path: '/scan', component: resolve => require(['@/views/binding/scan'], resolve), meta: { title: '绑定设备', isRequireLogin: true } }, // 注册时候
  { path: '/scan/:type', component: resolve => require(['@/views/binding/scan'], resolve), meta: { title: '添加设备' } }, // 登录后添加设备时候
  { path: '/createInfo', component: resolve => require(['@/views/binding/createInfo'], resolve), meta: { title: '填写基本信息', isRequireLogin: true } },

  // 首页 nav-tools-list
  // { path: '/wgcard', component: Wgcard, meta: { title: 'wg卡号管理', isRequireLogin: true } },
  // 分享
  { path: '/wxShare', component: resolve => require(['@/views/errPage/404'], resolve), meta: { title: '分享' } },

  { path: '/404', component: resolve => require(['@/views/errPage/404'], resolve), meta: { title: '404', isRequireLogin: true } },
  { path: '*', redirect: '/404' }
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

import Vue from 'vue'
import Router from 'vue-router'
import login from '@/components/login'
import cameraManage from '@/components/cameraManage/cameraManage'
import searchRecord from '@/components/searchRecord/searchRecord'
import staffManage from '@/components/staffManage/staffManage'
import indexPage from '@/components/indexPage/indexPage'
import bindCamera from '@/components/bindCamera/bindCamera'
import editUser from '@/components/editUser/editUser'
import userManage from '@/components/userManage/userManage'
import addUser from '@/components/addUser/addUser'
import permissionSet from '@/components/permissionSet/permissionSet'
import QXuserMan from '@/components/QXuserMan/QXuserMan'
import addUserMan from '@/components/addUserMan/addUserMan'
import statiReport from '@/components/statiReport/statiReport'
import attendManage from '@/components/attendManage/attendManage'
import classes from '@/components/classes/classes'
import attendGroup from '@/components/attendGroup/attendGroup'
import addAttend from '@/components/addAttend/addAttend'
import feedback from '@/components/feedback/feedback'
import comSource from '@/components/comSource/comSource'
import Schedule from '@/components/Schedule/Schedule'
import mySet from '@/components/mySet/mySet'
import infomation from '@/components/infomation/infomation'
import addFace from '@/components/addFace/addFace'
import manageUser from '@/components/manageUser/manageUser'
import siteManage from '@/components/siteManage/siteManage'
import bindLED from '@/components/siteManage/bindLED'
import generateCard from '@/components/siteManage/generateCard'
import docking from '@/components/siteManage/docking'
import workTypeManage from '@/components/siteManage/workTypeManage'
import channelManage from '@/components/siteManage/channelManage'
import manageLED from '@/components/siteManage/manageLED'
import platformLED from '@/components/siteManage/platformLED'
import setting from '@/components/setting/setting'
import addTimeList from '@/components/addTimeList/addTimeList'
import blackList from '@/components/blackList'
import temUser from '@/components/temUser'
import areaManage from '@/components/areaManage/areaManage' // 小区模块管理
import cellModel from '@/components/areaManage/cellModel' // 小区模块
import addNotify from '@/components/propertyNotify/addNotify' // 新建通知
import lookNotify from '@/components/propertyNotify/lookNotify' // 新建通知
import openGateRecord from '@/components/openGateRecord/openGateRecord'
import openState from '@/components/openState/openState'

Vue.use(Router)
export const routes = [
  {
    path: '/',
    component: login,
    redirect: '/login/'
  },
  {
    path: '/openGateRecord/',
    name: 'openGateRecord',
    component: openGateRecord
  },
  {
    path: '/openState/',
    name: 'openState',
    component: openState
  },
  {
    path: '/siteManage/',
    name: 'siteManage',
    component: siteManage
  },
  {
    path: '/temUser/',
    name: 'temUser',
    component: temUser
  },
  {
    path: '/login/',
    name: 'login',
    component: login
  },
  {
    path: '/manageLED/',
    name: 'manageLED',
    component: manageLED
  },
  {
    path: '/generateCard/',
    name: 'generateCard',
    component: generateCard
  },
  {
    path: '/blackList/',
    name: 'blackList',
    component: blackList
  },
  {
    path: '/workTypeManage/',
    name: 'workTypeManage',
    component: workTypeManage
  },
  {
    path: '/bindLED/',
    name: 'bindLED',
    component: bindLED
  },
  {
    path: '/setting/',
    name: 'setting',
    component: setting
  },
  {
    path: '/addTimeList/',
    name: 'addTimeList',
    component: addTimeList
  },
  {
    path: '/channelManage/',
    name: 'channelManage',
    component: channelManage
  },
  {
    path: '/docking/',
    name: 'docking',
    component: docking
  },
  {
    path: '/indexPage/',
    name: 'indexPage',
    component: indexPage
  },
  {
    path: '/manageUser/',
    name: 'manageUser',
    component: manageUser
  },
  {
    path: '/infomation/',
    name: 'infomation',
    component: infomation
  },
  {
    path: '/addFace/',
    name: 'addFace',
    component: addFace
  },
  {
    path: '/cameraManage/',
    name: 'cameraManage',
    component: cameraManage
  },
  {
    path: '/staffManage/',
    name: 'staffManage',
    component: staffManage
  },
  {
    path: '/platformLED/',
    name: 'platformLED',
    component: platformLED
  },
  {
    path: '/searchRecord/',
    name: 'searchRecord',
    component: searchRecord
  },
  {
    path: '/bindCamera/',
    name: 'bindCamera',
    component: bindCamera
  },
  {
    path: '/editUser/',
    name: 'editUser',
    component: editUser
  },
  {
    path: '/userManage/',
    name: 'userManage',
    component: userManage
  },
  {
    path: '/addUser/',
    name: 'addUser',
    component: addUser
  },
  {
    path: '/permissionSet/',
    name: 'permissionSet',
    component: permissionSet
  },
  {
    path: '/QXuserMan/',
    name: 'QXuserMan',
    component: QXuserMan
  },
  {
    path: '/addUserMan/',
    name: 'addUserMan',
    component: addUserMan
  },
  {
    path: '/mySet/',
    name: 'mySet',
    component: mySet
  },
  {
    path: '/statiReport/',
    name: 'statiReport',
    component: statiReport
  },
  {
    path: '/attendManage/',
    name: 'attendManage',
    component: attendManage
  },
  {
    path: '/classes/',
    name: 'classes',
    component: classes
  },
  {
    path: '/attendGroup/',
    name: 'attendGroup',
    component: attendGroup
  },
  {
    path: '/addAttend/',
    name: 'addAttend',
    component: addAttend
  },
  {
    path: '/feedback/',
    name: 'feedback',
    component: feedback
  },
  {
    path: '/comSource/',
    name: 'comSource',
    component: comSource
  },
  {
    path: '/Schedule/',
    name: 'Schedule',
    component: Schedule
  },
  {
    path: '/areaManage/',
    name: 'areaManage',
    component: areaManage
  },
  {
    path: '/cellModel/',
    name: 'cellModel',
    component: cellModel
  },
  {
    path: '/addNotify/',
    name: 'addNotify',
    component: addNotify
  },
  {
    path: '/lookNotify/',
    name: 'lookNotify',
    component: lookNotify
  }
]
export default new Router({
  base: '/face/',
  mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: routes
})

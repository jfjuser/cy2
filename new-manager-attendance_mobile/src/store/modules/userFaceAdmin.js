/** ********  【 处理人脸录制存储 】  **********/
/** ********  【 引入本地存储 】  removeLocalStorage**********/
import { setLocalStorage, removeLocalStorage } from '@/utils/localStore'
/** ********  【 state 】  **********/

const state = {
  userFaceAdmin: [],
  userFaceSteps: 1, // 默认类型为 1
  userFaceUploadImg: [],
  datailsFormData: null
}
/** ********  【 getters 】  **********/
const getters = {
  userFaceAdmin: state => state.userFaceAdmin,
  userFaceSteps: state => state.userFaceSteps,
  userFaceUploadImg: state => state.userFaceUploadImg,
  datailsFormData: state => state.datailsFormData
}
/** ********  【 mutations 】  **********/
const mutations = {
  /* 设置用户添加人脸管理 */
  USER_FACE_ADMIN (state, data) {
    state.userFaceAdmin = data
    setLocalStorage('userFaceAdmin', data)
  },
  // 设置人脸录制类型
  SET_USER_FACE_STEPS (state, steps) {
    state.userFaceSteps = steps
  },
  SET_USER_FACE_UPLOADIMG ({userFaceUploadImg}, imgAr) {
  // console.log('查看准备存储的图片数据： ', userFaceUploadImg, imgAr)
    userFaceUploadImg = imgAr
  // setLocalStorage('userFaceUploadImg', imgAr)
  },
  REMOVE_USER_FACE_UPLOADIMG (state) {
  // state.userFaceUploadImg = []
    removeLocalStorage('userFaceUploadImg')
  },
  // 储存当前人脸详情数据
  SET_DATAILS_FORM_DATA (state, data) {
    state.datailsFormData = data
  }
}
/** ********  【 actions 】  **********/
const actions = {
  SetDatailsFormData ({commit}, data) {
    commit('SET_DATAILS_FORM_DATA', data)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}

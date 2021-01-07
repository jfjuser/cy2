<template>
  <div class="datails-form">
    <div class="datails-users-show">
      <div class="userTools">
        <van-button @touchstart="userClose" type="info" plain size="small">
          关闭
        </van-button>
        <van-button @touchstart="userRewrite" type="warning" plain size="small">
          {{ overlayBoxIsShow ? "重新编辑" : "取消编辑" }}
        </van-button>
      </div>
      <van-form
        v-model="datailsFormData"
        :scroll-to-error="false"
        :validate-first="false"
        :rules="datailsRules"
        @submit="reSubmit"
        :submit-on-enter="true"
        :show-error="false"
        :show-error-message="true"
        :colon="true"
      >
        <!-- 遮罩层 -->
        <!-- <div class="overlay-box" v-if="overlayBoxIsShow"></div> -->
        <!-- 跳跃相机照相 -->
        <UploadImg
          :foo.sync="photoType"
          @uploadFileImg="uploadFileImg"
          :userFaceUploadImg.sync="userFaceUploadImg"
          :isDeletable = 'ifDeletable'
        ></UploadImg>
        <div class="form-box">
          <!-- 公司名称 -->
          <!-- <van-field
            v-model="datailsFormData.addr"
            :disabled="isResetInput"
            required
            name="addr"
            label="用户地址"
            :placeholder="
              datailsFormData.addr ? datailsFormData.addr : '暂无地址...'
            "
            :rules="datailsRules.addr"
            type="text"
          /> -->
          <!-- 用户名 -->
          <van-field
            v-model="datailsFormData.userName"
            :disabled="isResetInput"
            required
            name="userName"
            label="用户名"
            placeholder="请输入用户名"
            :rules="datailsRules.userName"
            type="text"
          />
          <!-- 手机号 -->
          <van-field
            v-model="datailsFormData.phone"
            :disabled="isResetInput"
            required
            name="phoneNum"
            label="手机号码"
            placeholder="请输入手机号码"
            :rules="datailsRules.phone"
            type="number"
            maxlength="11"
          />
          <!-- 用户ID -->
          <van-field
            v-model="datailsFormData.id"
            name="id"
            label="用户ID"
            :rules="datailsRules.id"
            type="text"
            :disabled="true"
          />

          <!-- 用户下发数据 -->
          <div class="aiPower-wrap">
            <van-field
              v-model="datailsFormData.aiPower"
              name="aiPower"
              label="下发数据"
              :placeholder="
                datailsFormData.aiPower ? datailsFormData.aiPower : '暂无下发！'
              "
              :rules="datailsRules.aiPower"
              type="textarea"
              :disabled="true"
              @cancel.self.stop.prevent
              class="aiPower-box"
            >
              <template #input>
                <van-button
                  block
                  size="small"
                  type="primary"
                  @touchstart.self.stop.prevent="
                    checkAiPowerShow = !checkAiPowerShow
                  "
                  >点击查询</van-button
                >
              </template>
            </van-field>
            <van-dialog
              class="checkAiPowerShow"
              v-model="checkAiPowerShow"
              title="下发数据信息"
              :show-confirm-button="false"
              :close-on-click-overlay="true"
            >
              <div class="content" v-html="datailsFormData.aiPower"></div>
            </van-dialog>
          </div>

          <!-- 选择部门 -->
          <van-field
            v-model="datailsFormData.leader"
            :disabled="true"
            name="dutyCompanyId"
            label="部门名称"
            placeholder="请输入部门"
            :rules="datailsRules.dutyCompanyId"
            type="text"
          />
          <!-- 韦根号 -->
          <van-field
            v-model="datailsFormData.wiegandCard"
            :disabled="isResetInput"
            name="wiegandCard"
            label="韦根号"
            placeholder="请输入韦根号"
            :rules="datailsRules.wiegandCard"
            type="text"
          />

          <div class="datails-btn">
            <van-button
              :loading="datailsFormDataLoading"
              :disabled="isResetInput"
              loading-text="正在重新提交..."
              type="primary"
              native-type="submit"
              block
            >
              重新提交
            </van-button>
          </div>
        </div>
      </van-form>
    </div>
  </div>
</template>
<script>
import UploadImg from '@/components/uploadImg'
import { ApiFindPhoto, adaptNewInfo } from '@/api/url'
import {
  getLocalStorage,
  removeLocalStorage,
  setLocalStorage
} from '@/utils/localStore'
import {mapMutations} from 'vuex'
export default {
  name: 'DatailsForm',
  data () {
    let phoneRules = phone => {
      let regExp = /^[1]([3-9])[0-9]{9}$/
      console.log(regExp.test(phone))
      if (typeof Number(phone) !== 'number') {
        return false
      } else if (!regExp.test(phone)) {
        return false
      } else if (phone.length > 11) {
        return false
      } else if (phone.length < 11) {
        return false
      }
      return true
    }
    return {
      photoType: undefined,
      ifDeletable: false, // 是否展示删除按钮
      checkAiPowerShow: false, // 下发数据显示
      isResetInput: true, // 是否重写信息
      defaultObj: {
        addr: '', // 用户地址
        userName: '', // 用户名
        phone: '', // 手机号
        photoName: '', // 照片名
        photo: '', // 照片密匙
        wiegandCard: '', // 韦根号
        photoAbb: '', //
        feature: '', // 图片数据
        departmentId: this.$store.getters.departmentId || '', // 部门Id
        dutyCompanyId: '', // 部门选择
        type: '0' // 用户类型 默认为 0 （0： 用户；1：访客）
      },
      datailsFormDataLoading: false,
      overlayBoxIsShow: true,
      datailsRules: {
        addr: [{ required: true, message: '请输入公司名称' }],
        userName: [{ required: true, message: '请输入用户名' }],
        phone: [
          { required: true, message: '请输入手机号码' },
          {
            trigger: 'onBlur',
            validator: phoneRules,
            message: '请输入正确的11位手机号码'
          }
        ],
        wiegandCard: [{ required: false, message: '请输入韦根号' }],
        dutyCompanyId: [{ required: false, message: '请选择部门' }]
        // authCode: [{ required: true, message: '请输入验证码' }]
      },
      userFaceUploadImg: [], // 照片数据存储
      nextUserReSubmit: null,
      saveTempData: {
        type: 1,
        data: null
      }
    }
  },
  components: {
    UploadImg
  },
  created () {
    this.getOriginPhoto() // 获取照片
    if (this.saveTempData.type === 1) {
      this.saveTempData.data = this.$store.getters.datailsFormData
      // console.log('详情信息：', this.datailsFormData)
    }
  },
  computed: {
    datailsFormData: {
      get () {
        return this.$store.getters['userFaceAdmin/datailsFormData'] || this.defaultObj
      },
      set (data) {
        this.saveTempData.type = 2
        return this.SET_DATAILS_FORM_DATA(data)
      }
    }
  },
  methods: {
    ...mapMutations('userFaceAdmin', [
      'SET_USER_FACE_STEPS',
      'SET_DATAILS_FORM_DATA'
    ]),
    // 请求照片
    getOriginPhoto () {
      let getUserId = this.datailsFormData.id
      let departmentId = this.$store.getters.departmentId
      const config = {
        baseURL: process.env.API_HOST + 'os',
        headers: {
          // 测试服的 token
          // AdminToken: 'eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJDWUtKIiwiZXhwIjoxNTkxNjA1NTMyLCJ4LXVzZXJJZCI6Mn0.5iMGnghSCvvYKCRW3GDtkRdmKF9nGILlxMTzkojp-vQ',
          departmentId
        }
      }
      if (getUserId) {
        this.$http
          .post(ApiFindPhoto + getUserId, null, config)
          .then(res => {
            // console.log('查询数据：', res.data)
            if (res.data !== null) {
              this.$nextTick(() => {
                let getOriginBase64 = 'data:image/jpg;base64,' + res.data.file // 转成base64
                this.userFaceUploadImg = [
                  { url: getOriginBase64, isImage: true }
                ]
              })
            }
          })
          .catch(() => {
            // console.log('获取失败： ', err)
            this.$toast.fail('获取照片失败！')
          })
      }
    },
    // 取得user合格照片
    uploadFileImg (userImg) {
      console.log(userImg)
      this.nextUserReSubmit = userImg
      // console.log('需要上传的图片；', this.nextUserReSubmit)
    },
    isUserPermission () {
      let { addr, userName, phone, feature } = this.datailsFormData
      if (!feature) {
        return this.$toast.fail('请先上传照片！')
      } else if (
        addr !== '' &&
        userName !== '' &&
        phone !== '' &&
        feature !== ''
      ) {
        return true
      } else {
        return false
      }
    },
    // 用户重新编辑
    userRewrite () {
      if (this.isResetInput) {
        this.$dialog
          .confirm({
            title: '人脸信息',
            message: '是否确定修改人脸数据信息？'
          })
          .then(res => {
            this.ifDeletable = true
            this.overlayBoxIsShow = false // 关闭禁止用户修改
            this.isResetInput = false // 关闭禁止用户修改
          })
          .catch(() => {})
      } else {
        this.$dialog
          .confirm({
            title: '人脸信息',
            message: '当前正在编辑，是否取消编辑！'
          })
          .then(res => {
            this.ifDeletable = false
            this.datailsFormData = getLocalStorage('saveTempData') // 恢复原样
            this.overlayBoxIsShow = true // 关闭禁止用户修改
            this.isResetInput = true // 关闭禁止用户修改
          })
          .catch(() => {})
      }
    },
    // 用户关闭
    userClose () {
      this.datailsFormData = getLocalStorage('saveTempData') // 恢复原样
      removeLocalStorage('saveTempData') // 删除临时数据
      this.overlayBoxIsShow = true // 开启禁止用户修改
      this.isResetInput = true // 关闭禁止用户修改
      this.SET_USER_FACE_STEPS(1)
    },
    // 重新提交
    reSubmit (form) {
      this.$dialog
        .confirm({
          title: '人脸信息确定',
          message: '是否从新提交人脸信息？'
        })
        .then(() => {
          // 重新提交用户人脸数据信息
          this.datailsFormDataLoading = true
          this.$http
            .put(adaptNewInfo, Object.assign({}, this.datailsFormData, this.nextUserReSubmit, {photoType: this.photoType}))
            .then(res => {
              // console.log(res)
              setTimeout(() => {
                this.$toast.success(res.message)
                this.datailsFormDataLoading = false // 关闭loading
                this.overlayBoxIsShow = true // 开启禁止用户修改
                this.isResetInput = true // 关闭禁止用户修改
                setLocalStorage('saveTempData', this.datailsFormData) // 暂存状态
              }, 300)
            })
            .catch(err => {
              this.$toast.fail(err)
            })
        })
        .catch(() => {})
    }
  }
}
</script>
<style lang="scss" scoped>
.datails-form{
  height: 100%;
  padding-bottom:calc(1.17333rem + 1rem);
}
.datails-users-show {
  width: 100%;
  height: 100%;
  // margin-top: 1rem;
  text-align: center;
  .userTools {
    padding: 0.2rem 0.5rem;
    height: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #eeeeee;
  }
  .datails-btn {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: .5rem;
    box-sizing: border-box;
    border-top: 1px solid   #eee;
    background: #fff;
    z-index: 111;
    // margin-top: 2rem;
    // padding: 0 1rem;
    // display: flex;
    // justify-content: space-around;
    // align-items: center;
  }
  .van-form {
    position: relative;
    .overlay-box {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      opacity: 0;
      z-index: 100;
    }
  }
  .aiPower-wrap >>> {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .van-cell__title {
      justify-content: center;
      align-items: center;
      span {
        display: inline;
      }
    }
    .van-dialog__content {
      height: 35vh;
      overflow: auto;
      .content {
        text-align: left;
        font-size: 0.35rem;
        padding: 0.3rem 0.3rem;
        width: 100%;
        box-sizing: border-box;
      }
    }
  }
}
</style>

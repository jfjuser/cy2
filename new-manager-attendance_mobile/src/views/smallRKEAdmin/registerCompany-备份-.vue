<template>
  <!-- 注册公司账号 -->
  <div class="register-company">
    <!-- <h1 class="title flex-center" v-html="title">创建新的公司账户</h1> -->
    <div class="register-wrap">
      <!-- 注册进度 -->
      <div class="steps-wrap">
        <van-steps :active="stepsType" @click-step="inNextStep">
          <van-step v-for="step in stepsData" :key="step.id">{{
            step.desc
          }}</van-step>
        </van-steps>
      </div>
      <!-- 注册流程内容展示 -->
      <div class="user-info">
        <div class="register-content">
          <div v-if="stepsType === 0" class="search-equipment">
            <!-- 调用扫扫组件 -->
            <searchEquipment :inNextStep='inNextStep' />
          </div>
          <!-- 注册基本信息 -->
          <div v-if="stepsType === 1" class="base-info">
            <!-- 上传图片 -->
            <!-- <UploadImg @uploadFileImg="uploadFileImg" /> -->
            <!-- :validate-first="true" -->
            <van-form
              ref="formData"
              v-model="formData"
              :scroll-to-error="false"
              :validate-first="false"
              :rules="formRules"
              @submit="onSubmit"
              :submit-on-enter="true"
              :show-error="false"
              :show-error-message="true"
              :colon="true"
            >
              <!-- 公司名称 -->
              <van-field
                v-model.trim="formData.departmentName"
                required
                name="departmentName"
                label="公司名称"
                placeholder="请输入公司名称"
                :rules="formRules.departmentName"
                type="text"
              />
              <!-- 用户名 -->
              <van-field
                v-model.trim="formData.userName"
                required
                name="userName"
                label="用户名"
                placeholder="请输入用户名"
                :rules="formRules.userName"
                type="text"
              />
              <!-- 手机号 -->
              <van-field
                v-model.trim="formData.phone"
                required
                name="phone"
                label="手机号码"
                placeholder="请输入手机号码"
                :rules="formRules.phone"
                type="number"
                maxlength="11"
              />
              <!-- 密码 -->
              <van-field
                v-model="formData.userPassword"
                required
                name="userPassword"
                label="密码"
                placeholder="请输入密码"
                :rules="formRules.userPassword"
                type="text"
              />
              <!-- 验证码 -->
              <div class="set-authCode flex-between">
                <van-field
                  v-model.trim="formData.code"
                  required
                  name="code"
                  label="验证码"
                  placeholder="请输入验证码"
                >
                </van-field>
                <van-button :disabled="disabledSms" class="get-code" @touchstart.stop.prevent="sendSms" plain size="mini" type="info"
                  >{{getCodeSteps?'获取验证码':'重新获取验证码'}}{{disabledSms?getCodeTimeout:''}}</van-button
                >
              </div>

              <!-- 韦根号 -->
              <!-- <van-field
                v-model="formData.wiegandCard"
                name="wiegandCard"
                label="韦根号"
                placeholder="请输入韦根号"
                :rules="formRules.wiegandCard"
                type="text"
              /> -->
              <!-- 选择部门 -->
              <!-- <van-field
                v-model="formData.dutyCompanyId"
                name="dutyCompanyId"
                label="部门"
                placeholder="请输入部门"
                :rules="formRules.dutyCompanyId"
                type="text"
              /> -->

              <div class="form-btn" style="margin: 16px;">
                <!-- @touchstart="onSubmit" -->
                <van-button
                  round
                  block
                  type="info"
                  :loading="isSubmitLoading"
                  loading-text="正在提交..."
                  native-type="submit"
                >
                  提交
                </van-button>
              </div>
            </van-form>
          </div>
          <!-- 设备自动接入新账号 -->
          <!-- <div v-if="stepsType === 2" class="equipment-auto-in-new-account">
            <div class="message">
              <p class="flex-center">设备将自动重启，请耐心等待!</p>
              <p class="flex-center">重启后点击下一步。</p>
            </div>
            <div class="user-in-next flex-around">
              <van-button size="small" type="warning">退出</van-button>
              <van-button size="small" type="primary">下一步</van-button>
            </div>
          </div> -->
          <!-- 账号创建成功，管理人员照片已下发至设备 -->
          <div v-if="stepsType === 2" class="success-equipment-ok">
            <div class="img-box">
              <van-image
                width="100px"
                height="100px"
                fit="contain"
                radius="50%"
                :src="imgIcon"
              />
              <p class="flat-txt">成功</p>
              <p class="titles">客官！你可以进行设备刷脸调试。</p>
              <p class="hint-to-login">点击下方去登录！</p>
            </div>
            <van-button block type="primary" round class="fulfill-btn"
            to="/login/"

              >完成</van-button
            >
          </div>
        </div>
      </div>
      <!-- <van-button size="mini" class="toLogin-btn">切换登录页</van-button> -->
    </div>
  </div>
</template>
<script>
import imgIcon from '@/assets/images/icon/success.png'
import UploadImg from '@/components/uploadImg'
import searchEquipment from './searchEquipment'
import { checkPhone } from '@/utils/formatter'
// import { resetPWSendSms, resetPassword } from '@/api/url' checkPsd resetPassword
// ApiAddFaceUser ,
import { sendSms, isRegister, register, submitRegister } from '@/api/url'
export default {
  name: 'RegisterCompany',
  components: {
    UploadImg,
    searchEquipment
  },
  data () {
    // 手机号码验证
    let phoneRules = phone => {
      let regExp = /^[1]([3-9])[0-9]{9}$/
      // console.log(regExp.test(phone))
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
      getCodeSteps: true,
      imgIcon,
      title: '',
      stepsType: 0,
      interval: 1000, // 获取验证码的超时时间
      getCodeTimeout: 60,
      isSubmitLoading: false,
      createTimer: null,
      disabledSms: false,
      stepsData: [
        {
          id: 0,
          desc: '扫扫设备'
        },
        {
          id: 1,
          desc: '基本信息'
        },
        // {
        //   id: 2,
        //   desc: '重启设备'
        // },
        {
          id: 2,
          desc: '注册成功'
        }
      ],
      formData: {
        departmentName: '',
        userName: '',
        phone: '',
        userPassword: '',
        code: '',
        mac: '',
        localName: '',
        type: '',
        // 微信
        // code: this.$store.getters.code,
        // code: this.$route.query.code,
        appId: this.$store.getters.appId
      },
      formRules: {
        departmentName: [{ required: true, message: '请输入公司名称' }],
        userName: [{ required: true, message: '请输入用户名' }],
        phone: [
          { required: true, message: '请输入手机号码' },
          { trigger: 'onBlur', validator: phoneRules, message: '请输入正确的11位手机号码' },
          { trigger: 'onBlur', validator: this.checkPhone, message: '手机号码已被注册过，请更换手机号码！' }
        ],
        userPassword: [{ required: true, message: '请输入密码', trigger: 'onBlur' }]
      }
    }
  },
  created () {
    // this.title = this.$route.meta.title
    console.log('this.formData', this.formData, 'this.$route.query.code', this.$route.query.code)
  },
  computed: {
  },
  methods: {
    checkPhone (phone) {
      this.$http.get(isRegister + '/' + phone).then(res => {
        console.log('验证手机号成功：', res)
        return true
      }).catch(err => {
        console.log('验证手机号码失败：', err)
        return false
      })
    },
    // 发送验证码 请求
    sendSms () {
      this.formData.code = ''// 发起验证码之前清空原来的验证码
      let {phone} = this.formData
      if (phone === '') return this.$toast.fail('手机号不可为空！')
      if (checkPhone(phone)) {
        this.$toast.fail('手机号格式不正确')
        return
      }

      this.$http.post(sendSms + '/' + phone).then(res => {
        console.log('验证码发送成功。。。', res)

        this.isdisabled = true
        this.disabledSms = true
        this.$toast('发送成功')
        // 计算获取验证码的超时时间
      }).catch((err) => {
        this.disabledSms = false
        this.$toast.fail(err)
        console.log('验证码发送失败。。。', err)
      })
    },
    // 注册公司进程
    inNextStep (e) {
      this.stepsType = e
    },
    // 取得user合格照片
    uploadFileImg (userImg) {
      // console.log('需要上传的图片；', userImg)
      this.formData = Object.assign({}, this.formData, userImg)
    },
    isUserPermission () {
      let {
        departmentName,
        userName,
        phone,
        userPassword,
        code
      } = this.formData
      if (
        departmentName !== '' &&
        userName !== '' &&
        phone !== '' &&
        userPassword !== '' &&
        code !== ''
      ) {
        return true
      } else {
        return false
      }
    },
    onSubmit (e) {
      if (!this.isUserPermission()) {
        return this.$toast.fail('请填写完基本信息！')
      } else {
        let {userPassword, phone, code} = this.formData
        if (code === '') {
          this.$toast.fail('验证码不可为空！')
          return
        }

        // 验证码是否正确

        this.$http.post(register, {code, userPassword, phone}).then(res => {
          console.log('code成功结果', res)
          // return true
          clearInterval(this.createTimer)
          this.getCodeTimeout = 60
          this.isSubmitLoading = true
          // console.log('接口', ApiAddFaceUser)
          let getCameras = sessionStorage.getItem('camerasForm')
          this.formData = Object.assign({}, this.formData, JSON.parse(getCameras))
          console.log('form表单准备提交的数据信息： ', this.formData)
          console.log('检测macform数据： ', JSON.parse(getCameras))
          console.log('微信code吗：', this.$route.query.code)

          // const config = {
          //   baseURL: process.env.API_HOST
          // }
          const sendRegister = this.$toast.loading({mask: true, message: '正在提交...', position: 'middle', duration: 0})
          const url = location.origin + '/attendance/manager/registerCompany/' // createInfo
          window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + this.$store.getters.appId + '&redirect_uri=' + encodeURIComponent(url) + '&response_type=code&scope=snsapi_userinfo#wechat_redirect'
          this.formData.code = this.$route.query.code // 获取微信id
          console.log('当前地址。。。', window.location)
          console.log('当前路由地址为： ', this.$route)

          this.$http
            .post(submitRegister, this.formData)
            .then(res => {
              console.log('创建成功。。', res)
              setTimeout(() => {
                sendRegister.clear()// 清除loading状态
                this.getCodeSteps = false
                this.disabledSms = false
                this.isSubmitLoading = false
                this.inNextStep(2)
              }, 500)
            })
            .catch(err => {
              console.log('创建失败信息： ', err)
              sendRegister.clear()// 清除loading状态
              this.getCodeSteps = false
              this.disabledSms = false
              this.isSubmitLoading = false
            })
        }).catch((err) => {
          console.log('code失败结果', err)
          this.disabledSms = false
          clearInterval(this.createTimer)
          this.getCodeTimeout = 60
          return this.$toast.fail('验证码不正确！')
        })
      }
    }
  },
  watch: {
    // 设置验证码的获取超时
    disabledSms (state) {
      if (state) {
        this.createTimer = setInterval(() => {
          if (this.getCodeTimeout <= 0) {
            clearInterval(this.createTimer)
            this.getCodeTimeout = 60
            this.disabledSms = false
            this.getCodeSteps = false
          } else {
            this.getCodeTimeout--
          }
        }, this.interval)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}
.flex-left {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  height: 100%;
}
.flex-right {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
  height: 100%;
}

.flex-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.flex-around {
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.register-company >>> {
  position: relative;
  width: 100%;
  height: 100%;
  color: #666;
  .van-cell__title.van-field__label {
    display: flex;
    justify-content: flex-end;
    padding-right: 0.5rem;
  }
  .title {
    height: 1.2rem;
    background: #999;
    color: #eee;
    font-size: 0.5rem;
  }
  .register-wrap {
    padding: 0.5rem;
    .steps-wrap {
      width: 100%;
      height: auto;
    }
  }
  .form-btn {
    margin-top: 1rem !important;
  }
  .get-code {
    width: 3rem;
  }
}

.toLogin-btn {
  display: block;
  margin: auto;
  margin-top: 2rem;
  padding: 0.1rem 0.5rem;
  border: none;
  border-bottom: 1px solid #999;
  color: #666;
}
.equipment-auto-in-new-account {
  margin: auto;
  margin-top: 2rem;
  text-align: center;
  width: 100%;
  .message {
    p {
      margin-bottom: 0.3rem;
    }
  }
  .user-in-next {
    margin-top: 3rem;
  }
}
.success-equipment-ok {
  width: 100%;
  height: 100%;
  margin: auto;
  text-align: center;
  p {
    margin-bottom: 0.5rem;
    font-size: 0.4rem;
  }
  .flat-txt {
    font-size: 0.6rem;
    color: rgb(20, 236, 56);
  }
  .hint-to-login {
    color: rgb(238, 110, 59);
  }
  .fulfill-btn {
    margin-top: 1rem;
  }
}
</style>

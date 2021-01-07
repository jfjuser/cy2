<template>
  <div>
    <header class="header" :style="bgimg" v-once></header>
    <div class="form">
      <van-field
        :left-icon="phoneIcon"
        v-model.trim="form.phone"
        placeholder="手机号"
        type="number"
        maxlength="11"
        :readonly="firstPage"
        @blur.prevent="onblurForWX"
      />
      <template v-if="firstPage">
        <div v-show="isRegister">
          <van-field
            :left-icon="smsIcon"
            type="number"
            v-model="form.code"
            center
            placeholder="请输入验证码"
            @blur.prevent="onblurForWX"
          >
            <van-button
              slot="button"
              round
              type="info"
              size="small"
              @click="sendSms"
              v-show="!isdisabled1"
              :loading="loadingSms"
            >获取验证码</van-button>
            <van-button
              slot="button"
              round
              type="info"
              size="small"
              disabled
              @click="sendSms"
              v-show="isdisabled1"
            >
              <van-count-down
                ref="countDown1"
                style="color:#fff"
                :time="time"
                format="ss秒"
                :auto-start="false"
                @finish="finished"
              />
            </van-button>
          </van-field>
          <van-notice-bar
            wrapable
            :scrollable="false"
            left-icon="info-o"
          >该手机号已注册，密码为注册时的密码，您可以返回直接登录，或继续下一步绑定设备操作</van-notice-bar>
        </div>
        <div v-show="!isRegister">
          <van-field
            :left-icon="passwordIcon"
            v-model.trim="form.userPassword"
            placeholder="请输入密码"
            :type="ispw"
            :right-icon="ispw == 'password'?'closed-eye':'eye-o'"
            @click-right-icon="showPwd"
            @blur.prevent="onblurForWX"
          />
          <van-field
            :left-icon="smsIcon"
            type="number"
            v-model="form.code"
            center
            placeholder="请输入验证码"
            @blur.prevent="onblurForWX"
          >
            <van-button
              slot="button"
              round
              type="info"
              size="small"
              @click="sendSms"
              v-show="!isdisabled2"
              :loading="loadingSms"
            >获取验证码</van-button>
            <van-button
              slot="button"
              round
              type="info"
              size="small"
              disabled
              @click="sendSms"
              v-show="isdisabled2"
            >
              <van-count-down
                ref="countDown2"
                style="color:#fff"
                :time="time"
                format="ss秒"
                :auto-start="false"
                @finish="finished"
              />
            </van-button>
          </van-field>
        </div>
      </template>
      <div class="btnbox">
        <template v-if="!firstPage">
          <van-button
            type="info"
            class="btn mar-b-10"
            block
            @click="checkIsRegister"
            :loading="loadingIsRegister"
          >下一步</van-button>
          <van-button type="info" plain class="btn" block @click="goback">返回</van-button>
        </template>
        <template v-if="firstPage">
          <van-button type="info" class="btn mar-b-10" block @click="next" :loading="loadingR">下一步</van-button>
          <van-button type="info" plain class="btn" block @click="clear">返回</van-button>
        </template>
      </div>
      <div class="text-c fc-grey">
        <router-link  to="/helpCenter/" style="text-decoration:underline;">如何注册？</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { CountDown, NoticeBar } from 'vant'
import { checkPhone } from '@/utils/formatter' // , checkPsd
import { sendSms, isRegister } from '@/api/url' //  register,
import onblurMixin from '@/mixin/onblurMixin'

import phoneIcon from '@/assets/icon/phone.png'
import passwordIcon from '@/assets/icon/password.png'
import smsIcon from '@/assets/icon/email.png'
import { Storage } from '@/utils/storage'
export default {
  mixins: [onblurMixin],
  components: {
    'van-count-down': CountDown,
    'van-notice-bar': NoticeBar
  },
  data () {
    return {
      phoneIcon,
      passwordIcon,
      smsIcon,
      bgimg: {
        background: 'url(' + require('@/assets/img/login.png') + ') no-repeat top',
        backgroundSize: '100% 100%'
      },
      ispw: 'password',
      isdisabled1: false,
      isdisabled2: false,
      time: 60 * 1000,
      form: {
        phone: '',
        userPassword: '',
        code: '',
        appId: this.$store.getters.appId
      },
      loadingR: false,
      loadingSms: false,
      isRegister: false, // 是否注册
      firstPage: false, // 首次进来不显示
      loadingIsRegister: false
    }
  },
  mounted () {
    if (!Storage.get('registerShowHelp')) {
      this.$nextTick(() => {
        this.$dialog.confirm({
          closeOnPopstate: true,
          message: '首次注册请查看注册流程，已了解请忽略',
          confirmButtonText: '前往',
          cancelButtonText: '忽略'
        }).then(() => {
          this.$router.push('/helpCenter/')
        }).catch(() => {
          Storage.set('registerShowHelp', 1)
        })
      })
    }
  },
  methods: {
    //  显示密码
    showPwd () {
      if (this.ispw === 'password') {
        this.ispw = 'text'
      } else {
        this.ispw = 'password'
      }
    },
    goback () {
      history.go(-1)
      // this.$router.push('/login/')
    },
    // 发送验证码 start
    sendSms () {
      const phoneVal = this.form.phone
      if (phoneVal === '') return
      if (checkPhone(phoneVal)) {
        this.$toast.fail('手机号格式不正确')
        return
      }
      this.loadingSms = true
      this.$http.post(sendSms + '/' + phoneVal).then(res => {
        this.$toast('发送成功')
        this.loadingSms = false

        if (this.isRegister) {
          this.isdisabled1 = true
          this.$refs.countDown1.start()
        } else {
          this.isdisabled2 = true
          this.$refs.countDown2.start()
        }
      }).catch(() => { this.loadingSms = false })
    },
    finished () {
      if (isRegister) {
        this.isdisabled1 = false
        this.$refs.countDown1.reset()
      } else {
        this.isdisabled2 = false
        this.$refs.countDown2.reset()
      }
    },
    // 发送验证码 end
    clear () {
      this.form.userPassword = ''
      this.form.code = ''
      this.firstPage = false
    },
    checkIsRegister () {
      const phoneVal = this.form.phone
      if (phoneVal === '') return
      if (checkPhone(phoneVal)) {
        this.$toast.fail('手机号格式不正确')
        return
      }
      this.loadingIsRegister = true
      this.$http.get(isRegister + '/' + phoneVal).then(res => {
        this.loadingIsRegister = false
        // console.log(res)
        this.firstPage = true
        // data不为空则已注册
        if (res.data) {
          this.isRegister = true
          this.form.userPassword = res.data
        } else {
          this.isRegister = false
        }
      }).catch(() => { this.loadingIsRegister = false })
    },
    next () {
      const phoneVal = this.form.phone
      const pwVal = this.form.userPassword
      this.$store.dispatch('setRegister', { phone: phoneVal, pw: pwVal })
      const url = location.origin + '/attendance/manager/createInfo/'
      window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + this.$store.getters.appId + '&redirect_uri=' + encodeURIComponent(url) + '&response_type=code&scope=snsapi_userinfo#wechat_redirect'
      // const phoneVal = this.form.phone
      // const pwVal = this.form.userPassword
      // const smsVal = this.form.code
      // if (phoneVal === '' || pwVal === '') {
      //   return
      // }
      // if (!this.isRegister) {
      //   if (checkPsd(pwVal)) {
      //     this.$toast.fail('密码为6-12位字母、数字或者下划线')
      //     return
      //   }
      // }
      // if (smsVal === '') {
      //   this.$toast.fail('请输入验证码')
      //   return
      // }
      // this.loadingR = true
      // this.$http.post(register, this.form).then(res => {
      //   this.loadingR = false
      //   this.$store.dispatch('setRegister', {phone: phoneVal, pw: pwVal})
      //   // this.$router.push('/scan/')
      //   this.$router.push('/bindWifi/?from=register')
      // }).catch(() => { this.loadingR = false })
    }
  }
}
</script>

<style lang="scss" scoped>
.header {
  height: 150px;
}
.icon {
  width: 20px;
  height: 20px;
  object-fit: contain;
  margin-right: 15px;
}
.form {
  margin: 0 30px;
  // .inputbox {
  //     height: 50px;
  //     font-size: 15px;
  //     padding: 0 10px;
  //     input {
  //         width: 100%;
  //     }
  //     .eyeicon {
  //         padding: 15px;
  //         padding-right: 0;
  //     }
  // }
  /deep/ .van-field__left-icon .van-icon {
    font-size: 20px;
  }
  .btnbox {
    padding: 20px 10px;
    .btn {
      border-radius: 5px;
      overflow: hidden;
    }
  }
}
</style>

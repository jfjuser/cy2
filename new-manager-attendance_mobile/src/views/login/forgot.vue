<template>
    <div>
        <header class="header" :style="bgimg" v-once></header>
        <div class="form">
            <!-- <div class="inputbox border-b box-sizing flex-align-items">
                <img src="@/assets/icon/phone.png" class="icon">
                <input type="number" placeholder="手机号" v-model.trim="phoneVal" @blur.prevent="onblurForWX">
            </div>
            <div class="inputbox border-b box-sizing flex-align-items">
                <img src="@/assets/icon/password.png" class="icon">
                <input :type="ispw" placeholder="请输入新密码" v-model.trim="pwVal" @blur.prevent="onblurForWX">
                <van-icon name="closed-eye" class="eyeicon" title="隐藏" v-show="ispw == 'password'" @click="showPwd"/>
                <van-icon name="eye-o" class="eyeicon" title="显示" v-show="ispw == 'text'" @click="showPwd"/>
            </div>
            <div class="inputbox border-b box-sizing flex-align-items">
                <img src="@/assets/icon/email.png" class="icon">
                <input type="number" placeholder="请输入验证码" v-model.trim="smsVal" @blur.prevent="onblurForWX" style="width: auto;">
                <van-button round type="info" size="small" @click="sendSms" v-show="!isdisabled" :loading="loadingSms">获取验证码</van-button>
                <van-button round type="info" size="small" disabled @click="sendSms" v-show="isdisabled">
                  <van-count-down ref="countDown" style="color:#fff" :time="time" format="ss秒" :auto-start="false" @finish="finished" />
                </van-button>
            </div> -->
            <van-field :left-icon="phoneIcon" v-model.trim="phoneVal" placeholder="手机号" type="number" maxlength="11" @blur.prevent="onblurForWX" />
            <van-field :left-icon="passwordIcon" v-model.trim="pwVal" placeholder="请输入新密码" :type="ispw" :right-icon="ispw == 'password'?'closed-eye':'eye-o'" @click-right-icon="showPwd" :error-message="pwErr" @blur.prevent="onblurForWX" />
            <van-field
              :left-icon="smsIcon"
              type="number"
              v-model="smsVal"
              center
              placeholder="请输入验证码"
              @blur.prevent="onblurForWX"
            >
                <van-button slot="button" round type="info" size="small" @click="sendSms" v-show="!isdisabled" :loading="loadingSms">获取验证码</van-button>
                <van-button slot="button" round type="info" size="small" disabled @click="sendSms" v-show="isdisabled">
                    <van-count-down ref="countDown" style="color:#fff" :time="time" format="ss秒" :auto-start="false" @finish="finished" />
                </van-button>
            </van-field>
            <div class="btnbox">
                <van-button type="info" block class="btn mar-b-10" @click="reset" :loading="loading">重置</van-button>
                <van-button type="info" block plain class="btn" @click="goback">返回</van-button>
            </div>
        </div>
    </div>
</template>

<script>
import { CountDown } from 'vant'
import { checkPhone, checkPsd } from '@/utils/formatter'
import { resetPWSendSms, resetPassword } from '@/api/url'
import onblurMixin from '@/mixin/onblurMixin'
import phoneIcon from '@/assets/icon/phone.png'
import passwordIcon from '@/assets/icon/password.png'
import smsIcon from '@/assets/icon/email.png'
export default {
  mixins: [ onblurMixin ],
  components: {
    'van-count-down': CountDown
  },
  data () {
    return {
      phoneIcon,
      passwordIcon,
      smsIcon,
      bgimg: {
        background: 'url(' + require('@/assets/img/forgot-bg.png') + ') no-repeat top',
        backgroundSize: '100% 100%'
      },
      phoneVal: '',
      pwVal: '',
      smsVal: '',
      ispw: 'password',
      isdisabled: false,
      time: 60 * 1000,
      loadingSms: false,
      loading: false,
      pwErr: ''
    }
  },
  created () {
    this.isFirstEnter = true
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
      // this.$router.
      history.go(-1)
    },
    // 发送验证码 start
    sendSms () {
      const phoneVal = this.phoneVal
      if (phoneVal === '') return
      if (checkPhone(phoneVal)) {
        this.$toast.fail('手机号格式不正确')
        return
      }
      const config = {
        baseURL: process.env.API_HOST + 'pb/at'
      }
      this.loadingSms = true
      this.$http.get(resetPWSendSms + '/' + phoneVal, config).then(res => {
        this.isdisabled = true
        this.loadingSms = false
        this.$toast('发送成功')
        this.$refs.countDown.start()
      }).catch(() => { this.loadingSms = false })
    },
    finished () {
      this.isdisabled = false
      this.$refs.countDown.reset()
    },
    // 发送验证码 end
    reset () {
      const phoneVal = this.phoneVal
      const pwvalue = this.pwVal
      const sms = this.smsVal
      if (!phoneVal || pwvalue === '') {
        return
      }
      if (checkPsd(pwvalue)) {
        this.pwErr = '密码为6-12位字母、数字或者下划线'
        return
      } else {
        this.pwErr = ''
      }
      if (sms === '') {
        this.$toast.fail('请输入验证码')
        return
      }
      const config = {
        baseURL: process.env.API_HOST + 'pb/at'
      }
      const form = {
        code: sms,
        phone: phoneVal,
        userPassword: pwvalue
      }
      this.loading = true
      this.$http.put(resetPassword, form, config).then(res => {
        this.loading = false
        this.$dialog({ closeOnPopstate: true, message: '重置成功' }).then(() => {
          this.$router.push('/login/')
        })
      }).catch(() => { this.loading = false })
    }
  },
  activated () {
    if (!this.isFirstEnter) {
      this.phoneVal = ''
      this.pwVal = ''
      this.smsVal = ''
      this.ispw = 'password'
      this.loading = false
    }
    this.isFirstEnter = false
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
    object-fit:contain;
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

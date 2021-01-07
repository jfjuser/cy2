<template>
    <div class="page bgc-grey full-height">
        <div class="box box-shadow">
            <van-cell-group>
                <van-field v-model.trim="form.phone" label="手机号" type="number" maxlength="11" @blur.prevent="onblurForWX" disabled />
                <van-field v-model.trim="form.userPassword" placeholder="请输入新密码" label="新密码" :type="ispw" :right-icon="ispw == 'password'?'closed-eye':'eye-o'" @click-right-icon="showPwd" :error-message="pwErr" @blur.prevent="onblurForWX" />
                <van-field
                  type="number"
                  v-model="form.code"
                  center
                  label="验证码"
                  placeholder="请输入验证码"
                  @blur.prevent="onblurForWX"
                >
                    <van-button slot="button" round type="info" size="small" @click="sendSms" v-show="!isdisabled" :loading="loadingSms">获取验证码</van-button>
                    <van-button slot="button" round type="info" size="small" disabled @click="sendSms" v-show="isdisabled">
                        <van-count-down ref="countDown" style="color:#fff" :time="time" format="ss秒" :auto-start="false" @finish="finished" />
                    </van-button>
                </van-field>
            </van-cell-group>
        </div>
        <div class="btnbox">
            <van-button type="info" block class="btn" :loading="loading" @click="reset">完成</van-button>
        </div>
    </div>
</template>

<script>
import { CountDown } from 'vant'
import { checkPhone, checkPsd } from '@/utils/formatter'
import { resetPWSendSms, resetPassword } from '@/api/url'
import onblurMixin from '@/mixin/onblurMixin'
export default {
  mixins: [ onblurMixin ],
  components: {
    'van-count-down': CountDown
  },
  data () {
    return {
      isdisabled: false,
      time: 60 * 1000,
      loadingSms: false,
      loading: false,
      form: {
        code: '',
        // departmentId: this.$store.getters.departmentId,
        phone: this.$store.getters.phone,
        userPassword: ''
      },
      pwErr: '',
      ispw: 'password'
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
    // 发送验证码 start
    sendSms () {
      const phoneVal = this.form.phone
      if (!phoneVal) return
      if (checkPhone(phoneVal)) {
        this.$toast.fail('手机号格式不正确')
        return
      }
      this.loadingSms = true
      this.$http.get(resetPWSendSms + '/' + phoneVal).then(res => {
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
      const phoneVal = this.form.phone
      const pwvalue = this.form.userPassword
      const sms = this.form.code
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
      this.loading = true
      this.$http.put(resetPassword, this.form).then(res => {
        this.loading = false
        this.$dialog({ closeOnPopstate: true, message: '重置成功' }).then(() => {
          // this.$router.go(-1)
          history.go(-1)
        })
      }).catch(() => { this.loading = false })
    }
  },
  activated () {
    this.form.userPassword = ''
    this.form.code = ''
  }
}
</script>

<style lang="scss" scoped>
.page {
  overflow: hidden;
}
.box {
    border-radius: 10px;
    overflow: hidden;
    margin: 20px;
}
.btnbox {
    padding: 0 20px;
}
.btn {
    border-radius: 5px;
    overflow: hidden;
}
</style>

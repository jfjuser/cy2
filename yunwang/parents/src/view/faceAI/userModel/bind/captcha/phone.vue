<template>
  <div class="theme">
    <group :title="departmentName">
      <div class="box">
        <x-input class="box-input" ref="input" @on-change="handleChangePhone" title="手机号" required placeholder-align="right"  text-align="right" v-model="form.code" placeholder="请输入手机号" type='tel' mask="99999999999" :max="11" is-type="china-mobile" :show-clear="false"></x-input>
        <x-button class="box-btn" plain @click.native.prevent="checkClick" :disabled="loadingBtn">校验{{timestamp > 0 ? '(' + timestamp + ')' : ''}}</x-button>
      </div>
      <x-input v-show="showCaptcha" style="font-size:.875rem;" title="验证码" required placeholder-align="right"  text-align="right" v-model="form.captcha" placeholder="请输入短信验证码" mask="999999" :max="6" :show-clear="false"></x-input>
    </group>
    <div style="padding: 10px;">
      <x-button type="primary" @click.native.prevent="submitClick" :disabled="loadingSubmit">绑定</x-button>
    </div>
    <div class="tip">
      <p class="tip-title">绑定了有什么用?</p>
      <p class="tip-text">1.接收进出推送,家人出行回家更放心</p>
      <p class="tip-text"></p>
    </div>
  </div>
</template>
<script>
import { XInput, Group, XButton } from 'vux'
import { getDepInfo, getWxInfo } from '@/utils/userInfo.js'
import { bindFace, checkUseBind } from '@/api/url.js'
import { httpPost, httpGet } from '@/utils/restful'
export default {
  components: {
    XInput,
    Group,
    XButton
  },
  data () {
    return {
      departmentName: getDepInfo().departmentName,
      form: {
        departmentId: getDepInfo().departmentId,
        account: getWxInfo().account,
        unicode: getWxInfo().unicode,
        code: '',
        captcha: '111111',
        type: 3
      },
      showCaptcha: false,
      loadingBtn: true,
      loadingSubmit: true,
      timestamp: 0
    }
  },
  mounted () {
    if (localStorage.getItem('timestamp') != null) {
      this.timestamp = localStorage.getItem('timestamp')
      this.startTimeStamp()
    }
  },
  methods: {
    startTimeStamp () {
      var interval = setInterval(() => {
        if (this.timestamp > 0) {
          this.timestamp--
          localStorage.setItem('timestamp', this.timestamp)
        } else {
          this.handleChangePhone(this.form.code)
          clearInterval(interval)
        }
      }, 1000)
    },
    handleChangePhone (val) {
      if (val) {
        // var regex = ''
        let valid = this.$refs.input.valid
        // console.log(valid)
        if (valid) {
          // 判断获取时长
          if (this.timestamp <= 0) {
            this.loadingBtn = false
          }
        } else {
          this.loadingBtn = true
        }
      }
    },
    checkClick () {
      httpGet(checkUseBind, this.form).then((res) => {
        this.showCaptcha = true
        this.loadingSubmit = false
        this.loadingBtn = true
        this.timestamp = 10
        this.startTimeStamp()
      }).catch((err) => {
        this.showCaptcha = false
        this.loadingSubmit = true
        this.$vux.toast.text(err, 'bottom')
      })
    },
    submitClick () {
      if (!this.loadingSubmit) {
        this.loadingSubmit = true
        httpPost(bindFace, this.form).then((res) => {
          // console.log(res)
          this.$vux.toast.text('绑定成功！', 'bottom')
          this.$router.push({path: '/faceAI/userModel/'})
        }).catch((err) => {
          this.$vux.toast.text(err, 'bottom')
          this.loadingSubmit = false
        })
      }
    }
  }
}
</script>
<style lang='scss' scoped>
.theme {
  padding-top: 40%;
}
.tip {
  text-align: left;
  margin: 10% 1.5rem 0;
  color: rgb(90, 90, 90);
}
.tip-title {
  font-size: 1rem;
}
.tip-text {
  height: 2rem;
  line-height: 2rem;
  margin-left: 1rem;
  font-size: .875rem;
}
.box {
  display: flex;
  .box-input {
    font-size: .875rem;
    width: 60%;
  }
  .box-btn {
    width: 35%;
    font-size: .875rem;
  }
}
</style>

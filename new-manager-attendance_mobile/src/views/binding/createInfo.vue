<template>
  <div>
    <van-steps :active="active">
      <van-step>检测设备</van-step>
      <van-step>注册账号</van-step>
      <van-step>填写信息</van-step>
    </van-steps>
    <main class="main">
      <h2 class="title mar-b-10">填写基本信息</h2>
      <p class="fc-grey">请务必填写真实信息，方便大家与你联系</p>
      <div class="form">
        <p>姓名</p>
        <div class="inputbox border-b box-sizing flex-align-items">
          <input
            type="text"
            placeholder="请填写真实姓名"
            v-model.trim="form.userName"
            @blur.prevent="onblurForWX"
          />
        </div>
        <p class="pt">所在企业名称</p>
        <div class="inputbox border-b box-sizing flex-align-items">
          <input
            type="text"
            placeholder="请填写真实名称"
            v-model.trim="form.departmentName"
            @blur.prevent="onblurForWX"
          />
        </div>
        <van-button type="info" block class="btn" @click="handleCreate" :loading="loadingR">创建</van-button>
      </div>
    </main>
  </div>
</template>

<script>
import { Step, Steps } from 'vant'
import { submitRegister } from '@/api/url'
import onblurMixin from '@/mixin/onblurMixin'
export default {
  mixins: [onblurMixin],
  components: {
    [Step.name]: Step,
    [Steps.name]: Steps
  },
  data () {
    return {
      form: {
        departmentName: '',
        userName: '',
        phone: this.$store.getters.registerPhone,
        userPassword: this.$store.getters.registerPw,
        mac: this.$store.getters.registerMac,
        localName: this.$store.getters.registerLocalName,
        type: this.$store.getters.registerType,
        // 微信
        // code: this.$store.getters.code,
        code: this.$route.query.code,
        appId: this.$store.getters.appId
      },
      loadingR: false,
      active: 2
    }
  },
  created () {
  },
  methods: {
    handleCreate () {
      const nameVal = this.form.departmentName
      const teamVal = this.form.userName
      if (nameVal === '' || teamVal === '') {
        return
      }
      console.log(this.form)
      if (this.form.phone === null || this.form.userPassword === null) { // || this.form.mac === null || this.form.localName === null || this.form.type === null
        this.$dialog.alert({
          title: '操作超时',
          message: `未在规定时间内完成，请重新注册`
        }).then(() => {
          this.$router.push('/register/')
        })
        return
      }

      this.loadingR = true
      this.form.mac = sessionStorage.getItem('mac')
      this.$http.post(submitRegister, this.form).then(res => {
        this.loadingR = false
        this.$dialog({ message: '注册成功' }).then(() => {
          this.$router.push('/login/')
        })
        this.$store.dispatch('claerRegisterTemporary')
      }).catch(() => {
        this.loadingR = false
        this.$dialog.alert({
          message: '注册失败'
        }).then(() => {
          // code会失效,故出此下下策
          this.getCode()
        })
      })
    },
    getCode () {
      const url = location.origin + '/attendance/manager/createInfo/'
      window.location.resplace = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + this.$store.getters.appId + '&redirect_uri=' + encodeURIComponent(url) + '&response_type=code&scope=snsapi_userinfo#wechat_redirect'
    }
  }
}
</script>

<style lang="scss" scoped>
.main {
  padding: 0 30px;
}
.title {
  font-weight: normal;
  letter-spacing: 2px;
}
.form {
  margin-top: 50px;
  .pt {
    padding-top: 30px;
  }
  .inputbox {
    height: 50px;
    font-size: 16px;
    input {
      width: 100%;
    }
  }
  .btn {
    border-radius: 5px;
    overflow: hidden;
    margin-top: 30px;
  }
}
</style>

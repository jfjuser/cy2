<template>
    <div>
        <main class="main">
          <h2 class="title mar-b-10">填写基本信息</h2>
          <p class="fc-grey">请务必填写真实信息，方便大家与你联系</p>
          <div class="form">
              <p>姓名</p>
              <div class="inputbox border-b box-sizing flex-align-items">
                  <input type="text" placeholder="请填写真实姓名" v-model.trim="form.userName" @blur.prevent="onblurForWX">
              </div>
              <p class="pt">所在企业名称</p>
              <div class="inputbox border-b box-sizing flex-align-items">
                  <input type="text" placeholder="请填写真实名称" v-model.trim="form.departmentName" @blur.prevent="onblurForWX">
              </div>
              <van-button type="info" block class="btn" @click="handleCreate" :loading="loadingR">创建</van-button>
          </div>
        </main>
    </div>
</template>

<script>
import { login, submitRegister } from '@/api/url'
import { Step, Steps } from 'vant'

import onblurMixin from '@/mixin/onblurMixin'
export default {
  mixins: [ onblurMixin ],
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
      loadingR: false
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
      // console.log('注册好的数据信息。。。', this.form)
      if (process.env.NODE_ENV === 'production') {
        if (this.form.phone === null || this.form.userPassword === null) { // || this.form.mac === null || this.form.localName === null || this.form.type === null
          this.$dialog.alert({
            title: '操作超时',
            message: `未在规定时间内完成，请重新注册`
          }).then(() => {
          // this.$router.push('/register/')
            this.$store.dispatch('SetRegisterStep', 1)
          })
          return
        }
      } else {
        console.log('开发环境启动。自动登录阶段。', process.env.NODE_ENV)
        const testForm = {
          departmentName: '大虫子测试',
          userName: '大虫子测试二号',
          phone: 18476553573,
          userPassword: 123456,
          mac: '2A-52-44-44',
          localName: '第一通道',
          type: 1,
          code: 'ab197c4338c777cf18a34fa583ac66f01be9e95d',
          appId: 'wx023544aa74a35288'
        }
        this.form = testForm
      }

      this.loadingR = true
      this.form.mac = sessionStorage.getItem('mac')
      this.$http.post(submitRegister, this.form).then(res => {
        this.loadingR = false
        // 根据用户选择
        this.$nextTick(() => {
          this.$dialog.confirm({
            title: '注册成功',
            message: '是否选择当前注册的账号自动登录！',
            showCancelButton: true,
            showConfirmButton: true,
            confirmButtonText: '自动登录',
            cancelButtonText: '手动登录'
          }).then(() => {
            /** ********  【 开始自动登录 】  **********/
            const formData = {// 即将提交的用户数据
              userName: this.form.phone,
              userPassword: this.form.userPassword,
              openId: this.form.code
            }

            console.log('当前form：', formData)
            console.log('当前this.form：', this.form)

            const ToastLoading = this.$toast.loading({ mask: true, message: '正在登录...', position: 'middle' })
            this.$http.post(login, formData).then(res => {
              console.log('选择自动登录', res)
              ToastLoading.clear()
              if (res.data) {
                this.$store.dispatch('RemoveRegisterStep', null).then(() => { // 删除本地操作
                  this.$store.dispatch('claerRegisterTemporary')// 清除临时信息
                  this.$router.push('/chooseTeam/?data=' + encodeURI(JSON.stringify(res.data)))
                })
              } else {
                ToastLoading.clear()
                console.log('当前已选择自动登录但是数据not Found!', res.data)
                this.$nextTick(() => {
                  this.$dialog.confirm({
                    title: '登录失败',
                    message: '请选择手动登录...',
                    showCancelButton: false,
                    confirmButtonText: '手动登录',
                    closeOnPopstate: true
                  }).then(() => {
                    this.clearLocalData() // 清除本地数据并且去tologin
                  })
                })
              }
            }).catch((err) => {
              console.log('自动登录失败。。。', err)
              ToastLoading.clear()
              this.$nextTick(() => {
                this.$dialog.confirm({
                  title: '登录失败',
                  message: '请选择手动登录...',
                  showCancelButton: false,
                  confirmButtonText: '手动登录'
                }).then(() => {
                  this.clearLocalData() // 清除本地数据并且去tologin
                })
              })
            })
          }).catch(() => {
            this.clearLocalData() // 清除本地数据并且去tologin
          })
        })
      }).catch((err) => {
        console.log('注册失败。。。', err)

        this.loadingR = false
        this.$dialog.alert({
          title: '官方提示',
          message: err
        }).then(() => {
          // code会失效,故出此下下策
          this.getCode()
        })
      })
    },
    clearLocalData () { // 清除本地数据并且去tologin
      this.$store.dispatch('RemoveRegisterStep', null).then(() => { // 删除本地操作
        this.$store.dispatch('claerRegisterTemporary')// 清除临时信息
        this.$router.push('/login/')
      })
    },
    getCode () {
      this.$store.dispatch('SetRegisterStep', 2).then(() => {
        const url = location.origin + '/attendance/manager/registerCompany/' // registerCompany , createInfo
        window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + this.$store.getters.appId + '&redirect_uri=' + encodeURIComponent(url) + '&response_type=code&scope=snsapi_userinfo#wechat_redirect'
      })
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

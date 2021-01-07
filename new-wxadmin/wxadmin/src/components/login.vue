<template>
    <div class="contain">
      <div class="imgDiv"><img src="@/assets/login.png" width="100" height="100"></div>
    <div>
        <Field
            class="userinput"
            name="userName"
            v-model="loginForm.userName"
            required
            clearable
            autocomplete="on"
            left-icon="friends"
            placeholder="请输入用户名"
            @blur="checkName"
            :error-message="message.null"
        />
        <Field
            class="inputpassword"
            name="userPassword"
            v-model="loginForm.userPassword"
            type="password"
            left-icon="lock"
            placeholder="请输入密码"
            required
            @blur="checkPsd"
            :error-message="message.err"
        />
    </div>
        <Button size="large" :loading="loading" class="btn" @click.native.prevent="login">登录</Button>
    </div>
</template>
<script>
import { Field, Button, Cell, CellGroup } from 'vant'
import { httpPost } from '@/utils/restful' // httpGet,
import { login } from '@/api/url.js' // getWxUserInfo,
import Store from '@/store'
import $ from 'jquery'
export default {
  name: 'login',
  components: {
    Field,
    Button,
    Cell,
    CellGroup
  },
  // error-message="密码为6-12位字母，数字或者下划线"
  data () {
    return {
      loginForm: {
        userName: '',
        userPassword: '',
        type: 1
      },
      message: {
        err: '',
        null: ''
      },
      openId: '',
      params: {
        account: undefined,
        source: 5
      },
      loading: false
    }
  },
  created () {
    // 通过authCode获取openId和其他用户信息
    // 登录人脸,获取账号
    this.fetchData()
    $(document).ready(function () {
      if (window.history && window.history.pushState) {
        $(window).on('popstate', function () {
          window.history.pushState('forward', null, '#')
          window.history.forward(1)
        })
      }
      window.history.pushState('forward', null, '#') // 在IE中必须得有这两行
      window.history.forward(1)
    })
  },
  methods: {
    checkPsd () {
      if (!(/^(\w){6,12}$/.test(this.loginForm.userPassword))) {
        this.message.err = '密码为6-12位字母，数字或者下划线'
      } else {
        this.message.err = ''
      }
    },
    checkName () {
      if (this.loginForm.userName === '') {
        this.message.null = '请输入用户名'
      } else {
        this.message.null = ''
      }
    },
    fetchData () {
      // 获取openId
      // 微信用户临时身份号
      let xmp = localStorage.getItem('marks')
      if (xmp !== '123') {
        let code = this.$route.query.code
        if (code) {
          let loginParams = {
            wxCode: code,
            type: 1,
            loginType: 1,
            account: this.$route.query.account
          }
          localStorage.setItem('code', loginParams.wxCode)
          localStorage.setItem('appid', loginParams.account)
          httpPost(login, loginParams).then(res2 => {
            let wxInfo = JSON.parse(res2.data.remark)
            localStorage.setItem('wxInfo', JSON.stringify(wxInfo))
            // res2.data.remark
            if (res2.data.departmentId) {
              this.$router.replace('/indexPage/')
              localStorage.setItem('userInfo', JSON.stringify(res2.res))
              localStorage.setItem('title', this.$store.getters.sysName)
            }
          }).catch(() => {
            // this.$router.push({path: '/'})
          })
        }
      }
    },
    login () {
      this.loading = true
      let x = localStorage.getItem('code')
      this.loginForm = Object.assign(this.loginForm, {wxCode: x, loginType: 0, account: this.$route.query.account})
      console.log(this.loginForm)
      console.debug(Store)
      Store.dispatch('LoginByUserName', this.loginForm)
        .then((res) => {
          this.$router.push({path: '/indexPage/'})
          localStorage.setItem('title', this.$store.getters.sysName)
          localStorage.setItem('marks', 0)
          // localStorage.setItem('userLoginInfo', JSON.stringify(res.res))
        }).catch(() => {
          this.loading = false
          this.$router.push('/')
          // console.log(err)
        })
      console.log(process.env.AI_HOST)
    }
  }
}
// process.env.API_HOST +
</script>
<style lang="scss" scoped>
.contain{
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  // background-color: rgb(134, 163, 195)
  background: url(../assets/bind-back.jpg);
  background-size: 100%;
  // height: 100vh;
    }
    .imgDiv{
      width:100%;
      text-align:center;
      padding-top: 10%;
    }
.btn{
  margin: 20% 0 0 10%;
  width: 80%;
  border-radius: 0.6rem;
  background-color: #1E90Ff;
  border: none;
  color:#fff;
  }
  .inputpassword{
     margin-top: 5%;
     width: 80%;
     margin-left: 10%;
     font-size: 0.9rem;
     line-height: 1.8rem;
     border-radius: 0.6rem;
     opacity: 0.6;
  }
.userinput{
    margin-top: 8%;
    width: 80%;
    border-radius: 0.6rem;
    opacity: 0.6;
    font-size: 0.9rem;
    margin-left: 10%;
    line-height: 1.8rem
  }
</style>

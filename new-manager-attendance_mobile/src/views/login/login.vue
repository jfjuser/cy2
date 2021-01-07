<template>
    <div>
        <header class="header position" :style="bgimg" v-once>
          <div class="box">
            <h1>智能门禁考勤</h1>
          </div>
        </header>
        <div class="form">
            <van-field class="fieldbox" :left-icon="phoneIcon"   placeholder="请输入手机号" v-model.trim="phoneVal" type="text"  maxlength="11" @blur.prevent="onblurForWX" />
            <van-field class="fieldbox" @keyup.enter="login" :left-icon="passwordIcon" placeholder="请输入密码" v-model.trim="pwVal" :type="ispw" :right-icon="ispw == 'password'?'closed-eye':'eye-o'" @click-right-icon="showPwd" @blur.prevent="onblurForWX" />
            <div class="text-r forget fc-dark"><router-link  to="/forgot/">忘记密码？</router-link></div>
            <div class="btnbox">
                <van-button type="info" block class="btn" @click="login" :loading="loading">登录</van-button>
            </div>
        </div>
        <div class="fc-grey bottom flex-jc-between">
            <span></span>
            <router-link  to="/check/?a=123">新用户注册</router-link>
            <!-- check -->
            <!-- <router-link to="/register/">新用户注册</router-link> -->
        </div>
    </div>
</template>

<script>
import Axios from 'axios'
import { CountDown, NumberKeyboard } from 'vant'
import { checkPsd } from '@/utils/formatter'
import { login, getOpenId } from '@/api/url'
import phoneIcon from '@/assets/icon/phone.png'
import passwordIcon from '@/assets/icon/password.png'
import onblurMixin from '@/mixin/onblurMixin'
import {
  getLocalStorage
} from '@/utils/localStore'
export default {
  mixins: [ onblurMixin ],
  components: {
    'van-count-down': CountDown,
    'van-number-keyboard': NumberKeyboard
  },
  data () {
    return {
      Oorigin: '',
      show: false,
      phoneIcon,
      passwordIcon,
      bgimg: {
        background: 'url(' + require('@/assets/img/login.png') + ') no-repeat top',
        backgroundSize: '100% 100%'
      },
      phoneVal: '',
      pwVal: '',
      ispw: 'password',
      loading: false
    }
  },
  created () {
    this.isFirstEnter = true
    if (this.$route.query.account) this.$store.dispatch('setAppid', this.$route.query.account)
    this.autoLogin()
    if (process.env.NODE_ENV === 'development') {
      console.log('当前在开发环境。。。： ', process.env.NODE_ENV)
      // 开发环境。。。
      this.Oorigin = 'http://cy.40mi.com/attendance/user/?account=wx023544aa74a35288&code=011bV8Zi2l1AMD0hCSWi2vf8Zi2bV8Zt&state=#/getCode/'
    } else {
      console.log('当前在生产环境： ', process.env.NODE_ENV)
      // 生产环境...
      this.Oorigin = window.location.href // 获取当前地址进行操作。。。
    }
    this.$nextTick(() => {
      let code = ((this.Oorigin.split('?')[1] || '').split('&')[1] || '').substring(5) // 截取当前微信地址的 code码
      let account = ((this.Oorigin.split('?')[1] || '').split('&')[0] || '').substring(8) // 截取当前微信地址的 account码
      if (code) {
        console.log(code, account)
        Axios.get(`http://cy.40mi.com/pb/pv/v1/wx/getWxUserInfo?account=${account}&unicode=${code}`).then(res => {
          console.log(res)
          if (res.data.data.unicode) {
            console.log('自动登录的数据权限：', res.data.data.unicode)

            if (this.isUserLogOutType === 0) { // 检测当前账号是否可以有自动登录的权限
              this.autoLogin(res.data.data.unicode)
            }
            this.openId = res.data.data.unicode
            this.$store.dispatch('setOpenId', res.data.data.unicode)
          } else {
            this.getOpenId()
            this.$toast('微信授权失败')
          }
        }).catch(() => {
          this.getOpenId()
        })
      }
    })

    // this.getOpenId()
  },
  computed: {
    isUserLogOutType () {
      return getLocalStorage('isUserLogOutType')
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
    login () {
      const phoneVal = this.phoneVal
      const pwVal = this.pwVal
      if (phoneVal === '' || pwVal === '') {
        return
      }
      if (checkPsd(pwVal)) {
        this.$toast.fail('密码为6-12位字母、数字或者下划线')
        return
      }
      const formData = {
        userName: phoneVal,
        userPassword: pwVal,
        openId: this.openId
      }

      this.loading = true
      // console.log('手机密码登录前的的数据：', formData)

      this.$http.post(login, formData).then(res => {
        // console.log('手机密码登录返回的数据：', res.data)
        this.loading = false
        if (res.data) {
          setTimeout(() => { // 存储
            this.$store.dispatch('SaveUserAuthInfo', res.data).then(() => { // 存储用户重要信息==>测试使用
              // console.log('存储完毕！！')
              this.$router.push('/chooseTeam/?data=' + encodeURI(JSON.stringify(res.data)))
            })
          }, 101)
        } else {
          this.$toast.fail('登录失败')
        }
      }).catch(() => { this.loading = false })
    },
    autoLogin (openId) {
      // if (!this.$route.query.code || !this.$route.query.account) {
      //   return
      // }
      console.log('正在执行自动登录：', openId)

      const formData = {
        // wxCode: this.$route.query.code || null,
        account: this.$route.query.account || null,
        type: 1,
        loginType: 1,
        openId: openId
      }
      // console.log('尝试自动登录的表单数据： ', formData)

      const ToastLoading = this.$toast.loading({ mask: true, message: '尝试登录中...', position: 'middle' })
      // console.log('登录需要请求的数据', formData)
      // console.log(' this.$route.query.account', this.$route.query.account)

      this.$http.post(login, formData).then(res => {
        // console.log('尝试自动登录请求数据：', res)
        ToastLoading.clear()
        if (res.data) {
          this.$router.push('/chooseTeam/?data=' + encodeURI(JSON.stringify(res.data)))
        } else {
          // this.$toast('登录失效')
          this.$toast('请登录！')
        }
      }).catch(() => { ToastLoading.clear() })
    },
    getOpenId () {
      console.log('是否尝试自动登录。。。', this.isUserLogOutType)
      console.log('查看路由信息： ', this.$route)

      if (!this.$route.query.code || !this.$route.query.account) {
        return
      }
      this.$http.get(`${getOpenId}/${this.$route.query.code}/${this.$route.query.account}`).then(res => {
        if (res.data) {
          console.log('自动登录的数据权限：', res.data)

          if (this.isUserLogOutType === 0) { // 检测当前账号是否可以有自动登录的权限
            this.autoLogin(res.data)
          }
          this.openId = res.data
          this.$store.dispatch('setOpenId', res.data)
        } else {
          this.$toast('微信授权失败')
        }
      }).catch(() => { this.$toast('微信授权失败') })
    },
    getUserAuthInfo (userInfo) {
      this.$store.dispatch('SaveUserAuthInfo', userInfo).then(() => { // 存储用户重要信息==>测试使用
        return true
      })
    }
  },
  activated () {
    if (!this.isFirstEnter) {
      this.phoneVal = ''
      this.pwVal = ''
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
    &:after{
      content: "";
      width:100%;
      height:100%;
      position: absolute;
      left:0;
      top:0;
      background: inherit;
      filter: blur(2px);
      z-index: 2;
    }
    .box {
      width:100%;
      // height:100%;
      position: absolute;
      top: 0;
      left: 0;
      text-align: center;
      padding-top: 60px;
      z-index:3;
      color: #1989fa;
      letter-spacing: 5px;
    }
}
.form {
    margin: 0 30px;
    .btnbox {
        padding: 20px 10px;
        .btn {
            border-radius: 5px;
            overflow: hidden;
        }
    }
    .forget {
        padding-top: 5px;
    }
    .fieldbox {
      font-size: 15px;
    }
    /deep/ .van-field__left-icon .van-icon {
      font-size: 20px;
    }
}
.bottom {
    padding: 0 10px;
}
</style>

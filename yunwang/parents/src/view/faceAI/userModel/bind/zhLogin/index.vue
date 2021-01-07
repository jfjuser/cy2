<template>
    <div class="container">
      <div class="imgDiv"><img src="@/assets/icon/wx/bind/login.png" width="100" height="100"></div>
      <group>
        <x-input ref="userName" style="font-size:.875rem;" title="用户名" required placeholder-align="right"  text-align="right" v-model.trim="loginForm.userName" placeholder="请输入用户名/手机号" :show-clear="false">
          <span slot="right">
            <icon
              v-show="loginForm.userName.length > 0"
              type="clear"
              @click.native="()=>{ $refs['userName'].reset() }"></icon>
          </span>
        </x-input>
        <x-input ref="userPassword" style="font-size:.875rem;" title="密码" :max="12" required placeholder-align="right"  text-align="right" v-model="loginForm.userPassword" placeholder="请输入密码" type="password" :show-clear="false">
          <span slot="right">
            <icon
              v-show="loginForm.userPassword.length > 0"
              type="clear"
              @click.native="()=>{ $refs['userPassword'].reset() }"></icon>
          </span>
        </x-input>
      </group>
      <div style="padding: 10px;">
        <x-button type="primary" @click.native.prevent="login" :show-loading ="loading">登录</x-button>
      </div>
      <div class="btn-register" @click="handleRegister">立即认证账号</div>
        <!-- <Button size="large" :loading="loading" class="btn" @click.native.prevent="login">登录</!-->
      <div class="box-tip">
        <div class="box-tip-title">温馨提示</div>
        <div class="box-tip-text">1.家庭代表认证后,可以为整个家庭成员进行录入</div>
        <div class="box-tip-text">2.登录账号默认为手机号</div>
        <div class="box-tip-text">3.密码由后台创建或账户认证时设置</div>
      </div>
    </div>
</template>
<script>
import { getDepInfo, getWxInfo, setUserInfo } from '@/utils/userInfo.js'
import { XInput, Group, XButton, Icon } from 'vux'
import { zhLogin } from '@/api/url.js'
import { httpPost } from '@/utils/restful' // httpGet,
export default {
  name: 'login',
  components: {
    XInput,
    Group,
    XButton,
    Icon
  },
  // error-message="密码为6-12位字母，数字或者下划线"
  data () {
    return {
      loginForm: {
        account: getWxInfo().account,
        wxCode: getWxInfo().unicode,
        departmentId: getDepInfo().departmentId,
        loginType: 1,
        userName: '',
        userPassword: ''
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
  mounted () {
    this.loginForm.loginType = 1
    this.sendLogin()
  },
  methods: {
    checkPsd () {
      if (this.loginForm.userPassword === '') {
        this.$vux.toast.text('请输入密码', 'bottom')
        return false
      } if (!(/^(\w){6,12}$/.test(this.loginForm.userPassword))) {
        this.$vux.toast.text('密码为6-12位字母，数字或者下划线', 'bottom')
        return false
      } else {
        return true
      }
    },
    checkName () {
      if (this.loginForm.userName) {
        return true
      } else {
        this.$vux.toast.text('请输入用户名', 'bottom')
        return false
      }
    },
    login () {
      if (this.checkName()) {
        if (this.checkPsd()) {
          this.sendLogin()
        }
      }
    },
    sendLogin () {
      console.log('登录。。。', zhLogin, this.loginForm)

      // this.$router.replace({path: '/faceAI/userModel/bind/addUser/'})
      httpPost(zhLogin, this.loginForm).then((res) => {
        if (res.data) {
          localStorage.setItem('dutyCompanyId', res.data.id)
          setUserInfo(res.data)// 占存用户信息
          this.$vux.toast.text('登录成功！', 'bottom')
          // console.log('查询参数：', this.$route.query.redirect)
          let redirect = this.$route.query.redirect || null
          if (!redirect && !(redirect === '/oneKeyOpenDoor')) {
            this.$router.replace({path: '/faceAI/userModel/bind/addUser/', query: {id: res.data.id, depId: getDepInfo().departmentId, obj: res.data, type: 0}})
          } else {
            this.$router.replace({
              path: redirect,
              query: {id: res.data.id, depId: getDepInfo().departmentId, obj: res.data, type: 0}
            })
          }
        } else {
          this.$vux.toast.text('请重新登录', 'bottom')
        }
      }).catch((err) => {
        this.loginForm.loginType = 0
        this.$vux.toast.text(err, 'bottom')
      })
    },
    handleRegister () {
      this.$router.push({path: '/faceAI/auth/'})
    }
  }
}
// process.env.API_HOST +
</script>
<style lang="scss" scoped>
.container{
  // background: url(../assets/bind-back.jpg);
  background-size: 100%;
  text-align:left;
  height: 100vh;
}
.imgDiv{
  width:100%;
  text-align:center;
  padding-top: 20%;
}
.btn{
  margin: 20% 15%;
  width: 70%;
  height:2.5rem;
  border-radius: 0.6rem;
  background-color: #1E90Ff;
  border: none;
  color:#fff;
}
.inputpassword{
  margin-top: 10%;
  width: 60vw;
  margin-left: 20%;
  font-size: 0.9rem;
  line-height: 1.8rem;
  border-radius: 0.6rem;
}
.userinput{
  margin-top: 8%;
  width: 60vw;
  border-radius: 0.6rem;
  font-size: 0.9rem;
  margin-left: 20%;
  line-height: 2rem;
}
.btn-register{
  float: right;
  text-align: center;
  margin: .625rem .625rem 0 0;
  border: 1px solid rgb(209, 209, 209);
  border-radius: .3125rem;
  padding: .3125rem 1.25rem;
  cursor: pointer;
}
.box-tip {
  clear: both;
  margin: 0 .625rem;
  color: rgb(85, 85, 85);
}
.box-tip-title{
  padding-top: 1.25rem
}
.box-tip-text{
  font-size: .875rem;
  margin-left: 1.25rem;
  height: 1.875rem;
  line-height: 1.875rem;
}
</style>

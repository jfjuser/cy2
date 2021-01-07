<template>
    <div class="page">
        <header class="header" :style="bgimg" v-once></header>
        <div class="form">
            <van-field class="fieldbox" placeholder="请输入账号" v-model.trim="loginForm.userName" @blur.prevent="onblurForWX">
              <i class="fa fa-user fa-lg" title="账号" slot="left-icon"></i>
            </van-field>
            <van-field class="fieldbox" placeholder="请输入密码" v-model.trim="loginForm.userPassword" :type="ispw" :right-icon="ispw == 'password'?'closed-eye':'eye-o'" @click-right-icon="showPwd" @blur.prevent="onblurForWX" >
              <i class="fa fa-lock fa-lg" title="密码" slot="left-icon"></i>
            </van-field>
            <div class="btnbox">
                <van-button type="info" block class="btn" @click="submitLogin" :loading="loading">登录</van-button>
            </div>
        </div>
    </div>
</template>

<script>
import { Field, Button } from 'vant'
import { checkPsd } from '@/utils/validator'

export default {
  components: {
    'van-field': Field,
    'van-button': Button
  },
  data () {
    return {
      loginForm: {
        userName: '',
        userPassword: ''
      },
      ispw: 'password',
      loading: false,
      bgimg: {
        background: 'url(' + require('@/assets/img/login-bg.png') + ') no-repeat top',
        backgroundSize: '100% 100%'
      }
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
    submitLogin () {
      const userName = this.loginForm.userName
      const userPassword = this.loginForm.userPassword
      if (userName === '' || userPassword === '') {
        return
      }
      if (checkPsd(userPassword)) {
        this.$notify('密码为6-12位字母、数字或者下划线')
        return
      }
      this.loading = true
      // 触发store里面的事件
      this.$store.dispatch('LoginByUserName', this.loginForm).then((res) => {
        this.$store.dispatch('SetDepName', '').then(res2 => {
          this.$router.push({ path: '/' })
          this.loading = false
        }).catch(() => {
          this.loading = false
        })
      }).catch(() => {
        this.loading = false
      })
    },
    onblurForWX () {
      setTimeout(function () {
        document.body.scrollTop = 0
      }, 100)
    }
  }
}
</script>

<style lang="scss" scoped>
.page {
  background-color: #fff !important;
}
.header {
  height: 240px;
}
.form {
    position: relative;
    top: -50px;
    border-radius: 10px;
    overflow: hidden;
    margin: 0 30px;
    background-color: #fff;
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
    .fa {
      color: #909399;
    }
}
.bottom {
    padding: 0 10px;
}
</style>

<template>
  <!-- 聚合支付--登录 -->
  <div>
    <div class="login-box" style="padding-top: 10%; margin: 0 auto">
      <div class="login-logo">
        <a style="color: white; text-decoration: none"><b>聚合支付·</b>二维码显示</a>
      </div>
      <!-- /.login-logo -->
      <div class="login-box-body" style="border-radius: 10px; background: #528B8B; box-shadow: 0 0 20px #003300">
        <h3 class="login-box-msg" style="color: white">登录</h3>
        <form >
          <div class="form-group has-feedback">
            <input id="userName" type="text" name="userName" v-model="data.userName" style="padding-left: 30px" class="form-control" minlength="3"
              maxlength="16" placeholder="请输入账号"> <span class="glyphicon glyphicon-user" style="position: absolute; top: 8px; left: 10px"
              aria-hidden="true"></span>
          </div>
          <div class="form-group has-feedback">
              <input id="userPassword" type="password" name="userPassword" v-model="data.userPassword" style="padding-left: 30px" class="form-control"
              minlength="3" maxlength="16" placeholder="请输入密码"> <span class="glyphicon glyphicon-lock" style="position: absolute; top: 8px; left: 10px"
              aria-hidden="true"></span>
          </div>
          <div>
            <button type="submit" class="btn  btn-block ">登录</button>
          </div>
          <div>
            <p id="message" style="color: red;font-size: 15px;text-align: center;">{{message}}</p>
          </div>
        </form>
      </div>
    </div>

    <div style="text-align: center;display:none; color: grey; background-color: white; position: absolute; bottom: 0; width: 100%; height: 50px; line-height: 50px;">
      <a style="color: lightgrey">
        <text>备案号：粤ICP备12083272号-5</text>
      </a>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.has-feedback {
  position: relative;
}

.form-control-feedback {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 2;
  display: block;
  width: 34px;
  height: 34px;
  line-height: 34px;
  text-align: center;
  pointer-events: none;
}

body {
  background-image: url(./../../assets/ccb/login_bg.jpg) !important;
  background-size: 100% 100% !important;
  position: relative !important;
}
</style>
<script>
import { ccbLogin } from '@/api/url.js'
import { httpPost } from '@/utils/restful.js'
export default {
  data () {
    return {
      data: {
        userPassword: '',
        userName: '',
        type: 1
      },
      message: ''
    }
  },
  created () {
  },
  methods: {
    handleSubmit () {
      httpPost(ccbLogin, JSON.stringify(this.data)).then(res => {
        if (res.code === 1) {
          this.message = ''
          this.$router.push({path: '/ccb/aggErcode/', query: {i: res.data.departmentId, c: res.data.token}})
        } else {
          this.message = res.message
        }
      }).catch(() => {
        this.message = '服务器错误，请稍后再试!'
      })
    }
  }
}
</script>

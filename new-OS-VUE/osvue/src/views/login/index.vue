<template>
    <div class="login-container">
        <el-form class="login-form" ref="loginForm" :model="loginForm" :rules="loginFormRules"  autoCompete = "on" label-position="left">
          <div class="title-container">
            <!-- <h3 class="title">物联云平台</h3> -->
            <img style="width: 300px;" :src="imgUrl" alt="Logo" title="物联云平台">
          </div>
          <el-form-item prop="userName">
            <span class="icon-left">
                <i class="fa fa-user fa-lg" title="账号"></i>
            </span>
            <el-input name="userName" type="text" autoComplete="on" placeholder="请输入账号" v-model.trim="loginForm.userName"></el-input>
          </el-form-item>
          <el-form-item prop="userPassword">
            <span class="icon-left">
                <i class="fa fa-lock fa-lg" title="密码"></i>
            </span>
            <el-input @keyup.native="onkeyup" @keydown.native="onkeydown" name="userPassword" :type="passwordType" v-model.trim="loginForm.userPassword" autoComplete="on" placeholder="请输入密码" @blur="isFocusPW=false" @focus="isFocusPW=true" ></el-input>
            <span class="icon-right" style="cursor:pointer;" @click="showPwd">
                <i class="fa fa-eye-slash fa-lg" v-if="passwordType == 'password'" title="隐藏"></i>
                <i class="fa fa-eye fa-lg" v-else title="显示"></i>
            </span>
            <template v-if="isFocusPW">
              <el-tag v-show="bigChar" type="warning" :disable-transitions="true">大写锁定已打开</el-tag>
            </template>
          </el-form-item>
          <!-- 验证码 -->
          <template v-if="authCodeShow">
            <el-form-item  prop="auth_code" class="auth_code" >
              <!-- 等静态资源服务器弄好之后 在修改 -->
              <div class="code-content">
                <el-input name="auth_code" type="text" v-model.trim="loginForm.auth_code" autoComplete="on" placeholder="验证码"></el-input>
                <img src="@/assets/login/getErCode.jpg" alt="验证码" class="code-img">
              </div>
            </el-form-item>
          </template>
          <el-button type="primary" style="width:100%;margin-bottom:30px;" :loading="loading"   @click.native.prevent="submitLogin">{{loading?'正在登录...':'登录'}}</el-button>
        </el-form>
        <!-- <div style="text-align:center;position:absolute;bottom:5vh;color:white;width:100%;">
          <a href="https://www.cytingchechang.com">友情链接</a>
        </div> -->
        <div style="text-align:center;position:absolute;bottom:0;color:white;width:100%;">
          <a href="http://www.miitbeian.gov.cn">备案号：粤ICP备12083272号-5</a>
        </div>
        <el-dialog title="本系统不支持IE8及以下浏览器" :visible.sync="isIE10">
          <el-alert
            title="本系统不支持IE8及以下浏览器！"
            type="error"
            description="本系统不支持IE8以下浏览器，强烈推荐google chrome浏览器，或者使用IE8版本以上的浏览器！"
            show-icon>
          </el-alert>
      </el-dialog>
      <!-- 新添跳转链接 -->
      <ToCamera></ToCamera>
    </div>
</template>

<script>
import { checkPsd } from '@/utils/validator.js'
import Logo from '@/assets/logo.png'
import ToCamera from './components/ToCamera'
import storeWebLocal from '@/utils/storeWebLocal'
export default {
  name: 'login',
  data () {
    return {
      loginForm: {
        userName: '',
        userPassword: '',
        auth_code: ''
      },
      loginFormRules: {
        userName: [
          {required: true, trigger: 'blur', message: '请输入账号'}
        ],
        userPassword: [
          {required: true, trigger: 'blur', message: '请输入密码'},
          {validator: checkPsd, trigger: 'blur', message: '密码为6-12位字母，数字或者下划线'}
        ],
        auth_code: [
          {max: 4, min: 4, trigger: 'blur', message: '请输入正确的验证码'}
        ]
      },
      passwordType: 'password',
      loading: false,
      authCodeShow: false,
      isIE10: false,
      // getErCode: '@/assets/login/getErCode.jpg'
      fIEVersion: 11,
      imgUrl: Logo,
      bigChar: false,
      isFocusPW: false,
      shifKey: undefined
    }
  },
  components: {
    ToCamera
  },
  created () {
    /** ********  进入登录页面清除BASE_TOKEN  **********/
    storeWebLocal.removeSessionStorage('BASE_TOKEN')
  },
  mounted () {
    window.addEventListener('keydown', (event) => {
      let e = event || window.event
      //  检测回车按键
      if (e.keyCode === 13) {
        this.submitLogin()
      }
      //  检测大写锁定
      if (e.keyCode === 20) {
        if (!this.isFocusPW) {
          this.bigChar = !this.bigChar
        }
      }
    })
    this.checkIEVersion()
  },
  methods: {
    //  显示密码
    showPwd () {
      if (this.passwordType === 'password') {
        this.passwordType = 'text'
      } else {
        this.passwordType = 'password'
      }
    },
    // 检查是不是IE
    checkIEVersion () {
      //  获取浏览器的userAgent字符串
      let userAgent = navigator.userAgent
      // console.log(userAgent)
      // 判断是否为IE浏览器
      let isIE = userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1
      // 判断是否为Edge浏览器
      let isEdge = userAgent.indexOf('Edge') > -1 && !isIE
      // 判断是不是IE11
      let isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf('rv:11.0') > -1
      // 判断是不是IE10
      let IE10 = userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE 10.0') > -1
      // 判断是不是IE9
      let IE9 = userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE 9.0') > -1
      let IE8 = userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE 8.0') > -1
      if (isIE) {
        let reIE = new RegExp('MSIE (\\d+\\.\\d+);')
        reIE.test(userAgent)
        this.fIEVersion = parseFloat(RegExp['$1'])
      } else if (isEdge) {
        this.fIEVersion = 12
      } else if (isIE11) {
        this.fIEVersion = 11
      } else if (IE10) {
        this.fIEVersion = 10
      } else if (IE9) {
        this.fIEVersion = 9
      } else if (IE8) {
        this.fIEVersion = 18
      } else {
        // IE10以下浏览器
        this.fIEVersion = -1
      }
      if (this.fIEVersion > 0 && this.fIEVersion <= 8) {
        this.isIE10 = true
      }
      // console.log(this.isIE10)
    },
    // 表单提交
    submitLogin () {
      let self = this
      self.$refs.loginForm.validate((valid) => {
        if (valid) {
          self.loading = true
          let platformType = self.$store.getters.platformType
          self.loginForm.platformType = platformType
          // console.log('表单数据: ', self.loginForm)

          // 触发store里面的事件
          self.$store.dispatch('LoginByUserName', self.loginForm).then((res) => {
            /** ********  登录成功 添加 BASE_TOKEN  **********/
            storeWebLocal.setSessionStorage('BASE_TOKEN')
            self.$store.dispatch('SetDepName', '').then(res2 => {
              // 广告页面
              // self.$router.push({path: '/advertisement'})
              self.$router.push({ path: '/' })
              self.loading = false
            }).catch(() => {
              console.log('登录失败: ', this.$store.state.user)
              self.loading = false
            })
          }).catch(() => {
            self.loading = false
          })
        }
      })
    },
    // 显示大写锁定
    onkeyup (event) {
      const _that = this
      // 判断是否按键为caps lock
      if (event.keyCode === 20) {
        _that.bigChar = !_that.bigChar
        return
      }
      // 按键不是caps lock，判断每次最后输入的字母的大小写
      let e = event || window.event
      let keyvalue = e.keyCode ? e.keyCode : e.which
      let shifKey = this.shifKey
      if (typeof (_that.loginForm.userPassword) === 'undefined') return
      let userPassword = _that.loginForm.userPassword
      let strlen = userPassword.length

      if (strlen) {
        let uniCode = userPassword.charCodeAt(strlen - 1)
        if (keyvalue >= 65 && keyvalue <= 90) {
          // 是否同时按住shirt键
          if (((uniCode >= 65 && uniCode <= 90) && !shifKey) || ((uniCode >= 97 && uniCode <= 122) && shifKey)) {
            _that.bigChar = true
          } else {
            _that.bigChar = false
          }
        }
      }
    },
    onkeydown (event) {
      let e = event || window.event
      let keyvalue = e.keyCode ? e.keyCode : e.which
      let shifKey = e.shiftKey ? e.shiftKey : ((keyvalue === 16))
      this.shifKey = shifKey
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
$bg: #2d3a4b;
$light_gray:#eee;

.login-container{
  .el-input{
    display: inline-block;
    height: 50px;
    width: 100%;
    border: 1px solid #ced2d6;
    border-radius: 4px;
    input{
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 35px;
      height: 47px;
    }
  }
  .el-form-item {
    -webkit-border: 1px solid #ffffff1a;
    border: 1px solid #ffffff1a;
    border-radius: 5px;
  }
  .auth_code{
    input{
      padding: 12px 5px 12px 10px !important;
    }
    .code-content {
      display: flex;
      .code-img {
        margin-left: 20px;
      }
    }
  }
}
</style>
<style rel="stylesheet/scss" lang="scss" scoped>
  $bg:#2d3a4b;
  $dark_gray:#889aa4;
  $light_gray:#eee;

  .login-container{
    position: fixed;
    height: 100%;
    width:100%;
    background-image: url(./../../assets/bg.jpg);
    background-size: 100% 100%;
    -moz-background-size: 100% 100%;
    -webkit-background-size: 100% 100%;
    .login-form{
      position: absolute;
      z-index: 10;
      right:15%;
      top: 20%;
      width: 400px;
      padding: 35px 35px 15px 35px;
      background-color: white;
      border-radius: 6px;
      box-shadow: 0px 0px 4px #504f4f;
      .icon-left{
        position: absolute;
        top:5px;
        left:10px;
        color:#939090;
        z-index: 10;
      }
      .icon-right{
        position: absolute;
        top:5px;
        right:10px;
        color:#939090;
        z-index: 10;
      }
    }
    .title-container{
      text-align: center;
      position:relative;
      .title{
        font-size: 26px;
        font-weight: 400;
        color: #3b4348;
        margin:0px auto 40px  auto;
        text-align:center;
        font-weight:bold;
      }
      img{
        margin:0px auto 20px  auto;
      }
    }
  }
</style>

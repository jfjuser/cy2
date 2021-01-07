<template>
    <div class="login-container" :style="bgimg">
        <div class="login-img" :style="loginimg"></div>
        <div class="login-form">
          <div class="title-container">
            <h3 class="title">智能门禁考勤</h3>
          </div>
          <el-form ref="loginForm" :model="loginForm" :rules="loginFormRules"  autoCompete = "on" label-position="left" v-if="!islogin">
            <el-form-item prop="userName">
              <el-input name="userName" type="text" autoComplete="on" placeholder="请输入账号" v-model.trim="loginForm.userName">
                <i slot="prefix" class="fa fa-user login-icon" title="账号"></i>
              </el-input>
            </el-form-item>
            <el-form-item prop="userPassword">
              <el-input @keyup.native="onkeyup" @keydown.native="onkeydown" name="userPassword" :type="passwordType" v-model.trim="loginForm.userPassword" autoComplete="on" placeholder="请输入密码" @blur="isFocusPW=false" @focus="isFocusPW=true" >
                <i slot="prefix" class="fa fa-lock fa-lg login-icon" title="密码"></i>
                <template slot="suffix">
                  <span style="cursor:pointer;" @click="showPwd">
                    <i class="fa fa-eye-slash fa-lg" v-if="passwordType == 'password'" title="隐藏"></i>
                    <i class="fa fa-eye fa-lg" v-else title="显示"></i>
                  </span>
                </template>
              </el-input>
              <template v-if="isFocusPW">
                <el-tag v-show="bigChar" type="warning" :disable-transitions="true">大写锁定已打开</el-tag>
              </template>
            </el-form-item>
            <el-button type="primary" style="width:100%;" :loading="loading"  @click.native.prevent="submitLogin">登 录</el-button>
          </el-form>

          <template v-else>
            <el-alert title="请选择要进入的公司/团队" type="success" style="margin-bottom: 10px"></el-alert>
            <div class="selectbox">
              <el-select v-model="value" placeholder="请选择公司/团队" style="width:100%;">
                <el-option
                  v-for="(item, index) in options"
                  :key="index"
                  :label="item.departmentName"
                  :value="index">
                </el-option>
              </el-select>
            </div>
            <el-button type="primary" style="width:100%;margin-bottom:20px;"  @click.native.prevent="onEnter">进 入</el-button>
            <el-button style="width:100%;margin:0"  @click.native.prevent="islogin=false">返回登录</el-button>
          </template>
        </div>

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
    </div>
</template>

<script>
import { checkPsd } from '@/utils/validator.js'
import { login } from '@/api/url'
import { httpPost } from '@/utils/restful'
export default {
  name: 'login',
  data () {
    return {
      loginForm: {
        userName: '',
        userPassword: ''
      },
      loginFormRules: {
        userName: [
          {required: true, trigger: 'blur', message: '请输入账号'}
        ],
        userPassword: [
          {required: true, trigger: 'blur', message: '请输入密码'},
          {validator: checkPsd, trigger: 'blur', message: '密码为6-12位字母，数字或者下划线'}
        ]
      },
      loginimg: {
        background: 'url(' + require('@/assets/login-img.png') + ') no-repeat top',
        backgroundSize: '100% 100%'
      },
      bgimg: {
        background: 'url(' + require('@/assets/Quantum-Gradient.svg') + ') no-repeat top',
        backgroundSize: 'cover'
      },
      passwordType: 'password',
      loading: false,
      isIE10: false,
      fIEVersion: 11,
      bigChar: false,
      isFocusPW: false,
      shifKey: undefined,
      options: [],
      value: '',
      islogin: false
    }
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
      const self = this
      self.$refs.loginForm.validate((valid) => {
        if (valid) {
          self.loading = true
          httpPost(login, self.loginForm).then((res) => {
            self.loading = false
            if (res.data) {
              this.options = res.data
              self.islogin = true
            } else {
              this.$message({
                message: '登录失败',
                type: 'error',
                duration: 4 * 1000
              })
            }
          }).catch(() => {
            self.loading = false
          })
        }
      })
    },
    async onEnter () {
      let data = this.options[this.value]
      await this.$store.dispatch('setLoginInfo', data)
      this.$router.replace('/')
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
    height: 50px;
    line-height: 50px;
    width: 100%;
    border: 1px solid #ced2d6;
    border-radius: 4px;
    input{
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      height: 100%;
      border-radius: 4px;
    }
  }
  .el-form-item {
    -webkit-border: 1px solid #ffffff1a;
    border: 1px solid #ffffff1a;
    border-radius: 5px;
  }
}
</style>
<style rel="stylesheet/scss" lang="scss" scoped>
  $bg:#2d3a4b;
  $dark_gray:#889aa4;
  $light_gray:#eee;

  .login-container{
    // position: fixed;
    overflow: hidden;
    height: 100%;
    width:100%;
    // background-image: linear-gradient(#00a0fb, #0064f7);
    display: flex;
    justify-content: center;
    align-items: center;
    .login-form{
      width: 350px;
      height: 400px;
      padding: 35px 35px 15px 35px;
      background-color: white;
      // border-radius: 6px;
      box-sizing: border-box;
      // box-shadow: 0px 0px 4px #504f4f;
      border-top-right-radius: 100px;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .2);
      margin-bottom: 50px;
      .login-icon {
        font-size: 18px;
        margin-left: 5px;
      }
    }
    .login-img {
      background-color: white;
      width: 350px;
      height: 400px;
      border-bottom-left-radius: 100px;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .2);
      margin-bottom: 50px;
    }
    .title-container{
      text-align: center;
      position:relative;
      .title{
        font-size: 26px;
        color: #1989fa;
        margin:0px auto 40px  auto;
        letter-spacing: 2px;
      }
    }
    .selectbox {
      margin-bottom: 20px;
    }
  }
</style>

<template>
  <div class="app-container">
    <div class="table-main">
      <el-form ref="form" :rules="formRules" :model="form" label-width="120px">
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="form.phone" disabled></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="userPassword">
          <el-input type="password" v-model="form.userPassword"></el-input>
          <span class="text">
              6-12位字母，数字或者下划线
          </span>
        </el-form-item>
        <el-form-item label="确认新密码"  prop="rePassword">
          <el-input type="password" v-model="form.rePassword"></el-input>
        </el-form-item>
        <el-form-item label="验证码"  prop="code">
          <el-input v-model="form.code"></el-input>
          <el-button type="primary" size="small" @click="sendSms" :disabled="canClick">{{content}}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="loading" @click="onSubmit">确认修改</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { checkPsd } from '@/utils/validator.js'
import { resetPassword, userInfo, resetPWSendSms } from '@/api/url.js'
import { httpPut, httpGet } from '@/utils/restful.js'

export default {
  data () {
    //   验证两次密码是否一致
    let rePasswordValid = (rule, value, callback) => {
      if (!(/^(\w){6,12}$/.test(value))) {
        return callback(new Error('密码为6-12位字母，数字或者下划线'))
      } else if (value !== this.form.userPassword) {
        return callback(new Error('两次密码输入不一致'))
      } else {
        callback()
      }
    }
    return {
      loading: false,
      formRules: {
        userPassword: [
          {required: true, trigger: 'blur', message: '请输入新密码'},
          {validator: checkPsd, trigger: 'blur', message: '密码为6-12位字母，数字或者下划线'}
        ],
        rePassword: [
          {required: true, trigger: 'blur', message: '请再次输入密码'},
          {validator: rePasswordValid, trigger: 'blur'}
        ],
        code: [
          {required: true, trigger: 'blur', message: '请输入验证码'}
        ]
      },
      form: {
        code: '',
        phone: this.$store.getters.phone,
        userPassword: '',
        rePassword: ''
      },
      content: '获取验证码',
      totalTime: 5, // 倒计时
      canClick: false
    }
  },
  mounted () {
    this.getUserInfo()
  },
  methods: {
    getUserInfo () {
      httpGet(userInfo + '/' + this.$store.getters.userId).then(res => {
        if (res.data) {
          this.form.phone = res.data.phone
        }
      }).catch(() => {})
    },
    sendSms () {
      const phoneVal = this.form.phone
      if (!phoneVal) {
        return
      }
      httpGet(resetPWSendSms + '/' + phoneVal).then(res => {
        this.canClick = true
        this.content = this.totalTime + 's后重新发送'
        const clock = setInterval(() => {
          this.totalTime--
          this.content = this.totalTime + 's后重新发送'
          if (this.totalTime <= 0) {
            clearInterval(clock)
            this.content = '重新发送'
            this.totalTime = 90
            this.canClick = false
          }
        }, 1000)
      }).catch(() => {})
    },
    onSubmit () {
      let self = this
      self.$refs.form.validate((valid) => {
        if (valid) {
          self.loading = true
          this.form.rePassword = undefined
          httpPut(resetPassword, this.form).then(res => {
            self.loading = false
            self.$message({
              message: res.message,
              type: 'success'
            })
          }).catch(() => {
            self.loading = false
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
/* .line{
  text-align: center;
} */
.el-input{
    width: auto;
}
.text{
    color: grey;
}
</style>

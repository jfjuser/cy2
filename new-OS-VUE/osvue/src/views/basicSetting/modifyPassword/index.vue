<template>
  <div class="app-container">
    <div class="table-main">
      <el-form ref="form" :rules="formRules" :model="form" label-width="120px">
        <el-form-item label="当前密码" prop="userOldPassword">
          <el-input type="password" v-model="form.userOldPassword"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="userNewPassword">
          <el-input type="password" v-model="form.userNewPassword"></el-input>
          <span class="text">
              6-12位字母，数字或者下划线
          </span>
        </el-form-item>
        <el-form-item label="确认新密码"  prop="rePassword">
          <el-input type="password" v-model="form.rePassword"></el-input>
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
import { editPassword } from '@/api/url.js'
import { httpPost } from '@/utils/restful.js'
export default {
  data () {
    //   验证两次密码是否一致
    var rePasswordValid = (rule, value, callback) => {
      if (!(/^(\w){6,12}$/.test(value))) {
        return callback(new Error('密码为6-12位字母，数字或者下划线'))
      } else if (value !== this.form.userNewPassword) {
        return callback(new Error('两次密码输入不一致'))
      } else {
        callback()
      }
    }
    return {
      loading: false,
      form: {
        userOldPassword: '',
        userNewPassword: '',
        rePassword: ''
      },
      formRules: {
        userOldPassword: [
          {required: true, trigger: 'blur', message: '请输入原密码'},
          {validator: checkPsd, trigger: 'blur', message: '密码为6-12位字母，数字或者下划线'}
        ],
        userNewPassword: [
          {required: true, trigger: 'blur', message: '请输入新密码'},
          {validator: checkPsd, trigger: 'blur', message: '密码为6-12位字母，数字或者下划线'}
        ],
        rePassword: [
          {required: true, trigger: 'blur', message: '请再次输入密码'},
          {validator: rePasswordValid, trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    onSubmit () {
      let self = this
      self.$refs.form.validate((valid) => {
        if (valid) {
          self.loading = true
          this.form = Object.assign(this.form, {id: this.$store.getters.userId})
          httpPost(editPassword, this.form).then(res => {
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

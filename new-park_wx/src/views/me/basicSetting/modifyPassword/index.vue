<template>
    <div>
        <van-cell-group>
            <van-field
                v-model.trim="form.userOldPassword"
                label="当前密码"
                placeholder="请输入"
                type="password"
                :error-message="userOldPwErr"
            />
            <van-field
                v-model.trim="form.userNewPassword"
                label="新密码"
                placeholder="请输入"
                type="password"
                :error-message="userNewPwErr"
            />
            <van-field
                v-model.trim="form.rePassword"
                label="确认新密码"
                placeholder="请输入"
                type="password"
                :error-message="rePwErr"
            />
        </van-cell-group>
        <div class="btn-box">
            <van-button type="info" block round @click="onSubmit" :loading="loading">确认修改</van-button>
        </div>
    </div>
</template>

<script>
import { Cell, CellGroup, Field, Button, Dialog } from 'vant'
import { checkPsd } from '@/utils/validator.js'
import { editPassword } from '@/api/url.js'
import { httpPost } from '@/utils/restful.js'
export default {
  components: {
    [Button.name]: Button,
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup,
    [Field.name]: Field
  },
  data () {
    return {
      loading: false,
      form: {
        userOldPassword: '',
        userNewPassword: '',
        rePassword: ''
      },
      userOldPwErr: '',
      userNewPwErr: '',
      rePwErr: ''
    }
  },
  methods: {
    onSubmit () {
      if (this.validator()) return

      this.loading = true
      httpPost(editPassword, this.form).then(res => {
        this.loading = false
        Dialog.confirm({
          message: res.message,
          closeOnPopstate: true
        }).then(() => {
          history.go(-1)
        }).catch(() => {})
      }).catch(() => {
        this.loading = false
      })
    },
    validator () {
      const userOldPassword = this.form.userOldPassword
      const userNewPassword = this.form.userNewPassword
      const rePassword = this.form.rePassword
      if (checkPsd(userOldPassword)) {
        this.userOldPwErr = '密码为6-12位字母，数字或者下划线'
        var flag1 = true
      } else { this.userOldPwErr = ''; flag1 = false }
      if (checkPsd(userNewPassword)) {
        this.userNewPwErr = '密码为6-12位字母，数字或者下划线'
        var flag2 = true
      } else { this.userNewPwErr = ''; flag2 = false }
      if (rePassword === '') {
        this.rePwErr = '请再次确认新密码'
        var flag3 = true
      } else if (userNewPassword !== rePassword) {
        this.rePwErr = '两次密码输入不一致'
        flag3 = true
      } else { this.rePwErr = ''; flag3 = false }

      return (flag1 || flag2 || flag3)
    }
  }
}
</script>

<style lang="scss" scoped>
.btn-box {
    padding: 20px;
}
</style>

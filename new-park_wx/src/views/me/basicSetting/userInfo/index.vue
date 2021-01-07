<template>
    <div>
        <van-cell-group>
           <van-field
            v-model.trim="form.userName"
            label="用户名"
            placeholder="请输入用户名"
            error-message="不可修改。一般用于后台登录名称"
          />
          <van-cell title="性别" >
            <van-radio-group v-model="form.sex">
                <van-radio :name="0" class="mar-b-15">男</van-radio>
                <van-radio :name="1">女</van-radio>
            </van-radio-group>
          </van-cell>
          <van-field
            v-model.trim="form.phone"
            label="手机号"
            placeholder="请输入手机号"
            type="number"
            :error-message="phoneErr"
          />
          <van-field
            v-model.trim="form.email"
            label="邮箱"
            placeholder="请输入邮箱"
            :error-message="emailErr"
          />
          <van-field
            v-model.trim="form.resume"
            label="备注"
            type="textarea"
            autosize rows="1"
          />
        </van-cell-group>

        <div class="btn-box">
            <van-button type="info" block round @click="onSubmit" :loading="loading">确认修改</van-button>
        </div>
    </div>
</template>

<script>
import { Cell, CellGroup, Field, Button, RadioGroup, Radio } from 'vant'
import { checkPhone, checkEmail } from '@/utils/validator.js'
import { getUserInfo, updateUser } from '@/api/url.js'
import { httpGet, httpPut } from '@/utils/restful.js'
export default {
  components: {
    [Button.name]: Button,
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup,
    [Field.name]: Field,
    [RadioGroup.name]: RadioGroup,
    [Radio.name]: Radio
  },
  data () {
    return {
      form: {
        id: undefined,
        userName: undefined,
        sex: undefined,
        phone: undefined,
        email: undefined,
        resume: undefined
      },
      loading: false,
      emailErr: '',
      phoneErr: ''
    }
  },
  created () {
    this.getUserInfo()
  },
  methods: {
    getUserInfo () {
      const ToastLoading = this.$toast.loading({ message: '加载中...', position: 'middle', duration: 0 })
      httpGet(getUserInfo + this.$store.getters.userId).then(res => {
        ToastLoading.clear()
        this.form = Object.assign({}, res.data)
      }).catch(() => { ToastLoading.clear() })
    },
    onSubmit () {
      const phone = this.form.phone
      const email = this.form.email
      if (checkPhone(phone)) {
        this.phoneErr = '请输入正确的手机号码'
      } else { this.phoneErr = '' }
      if (checkEmail(email)) {
        this.emailErr = '请输入正确的邮箱地址'
      } else { this.emailErr = '' }
      if (checkPhone(phone) || checkEmail(email)) {
        return
      }

      this.loading = true
      httpPut(updateUser, this.form).then(res => {
        this.loading = false
        this.$notify({ type: 'success', message: res.message })
      }).catch(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.btn-box {
    padding: 20px;
}
.mar-b-15 {
    margin-bottom: 15px;
}
</style>

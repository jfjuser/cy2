<template>
    <div>
        <van-cell-group>
            <van-field
                v-model="formAdmin.userName"
                required
                clearable
                label="账号"
                disabled
                :error-message="err.userName"
                placeholder="请获取账号">
            </van-field>
            <van-field
                v-model.trim="formAdmin.userPassword"
                type="password"
                label="密码"
                placeholder="请输入密码"
                required
                :error-message="err.userPassword"
                v-if="accountType"
            />
            <van-field
                v-model.trim="formAdmin.phone"
                type="number"
                label="手机号"
                placeholder="请输入手机号"
            />
            <van-field
                v-model.trim="formAdmin.email"
                label="邮箱"
                placeholder="请输入邮箱"
            />
            <van-cell title="性别" >
                <van-radio-group v-model="formAdmin.sex">
                    <van-radio :name="0" class="mar-b-15">男</van-radio>
                    <van-radio :name="1">女</van-radio>
                </van-radio-group>
            </van-cell>
            <van-field
                v-model.trim="formAdmin.resume"
                label="备注"
                type="textarea"
                autosize rows="1"
            />
        </van-cell-group>

        <div class="btn-box">
            <van-button type="info" :loading="createAdminloading" @click="createAdminData" block round>保存</van-button>
        </div>
    </div>
</template>

<script>
import { Cell, CellGroup, Field, Button, RadioGroup, Radio } from 'vant'
import { checkPsd, checkUserName } from '@/utils/validator.js'
import { httpGet, httpPost } from '@/utils/restful'
import { getAdmin, getUserName, createAdmin } from '@/api/url'

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
      formAdmin: {
        id: undefined,
        userName: undefined,
        userPassword: undefined,
        phone: undefined,
        email: undefined,
        sex: undefined,
        resume: undefined
      },
      err: {
        userName: '',
        userPassword: ''
      },
      createAdminloading: false,
      accountType: true,
      row: {}
    }
  },
  created () {
    if (this.$route.query.data) {
      this.row = Object.assign({}, JSON.parse(this.$route.query.data))
    }
    this.handleAdmin()
  },
  methods: {
    // 刷新用户名
    handleRefreshUserName () {
      httpGet(getUserName).then(res => {
        this.formAdmin.userName = res.data
      }).catch(() => {

      })
    },
    handleAdmin () {
      const ToastLoading = this.$toast.loading({ message: '加载中...', position: 'middle', duration: 0 })
      httpGet(getAdmin + this.row.id).then(res => {
        if (res.data !== null) {
          this.formAdmin = Object.assign({}, res.data)
          this.accountType = false
        } else {
          this.formAdmin.userPassword = ''
          this.handleRefreshUserName()
          this.accountType = true
        }
        ToastLoading.clear()
      }).catch(() => { ToastLoading.clear() })
    },
    createAdminData () {
      const userName = this.formAdmin.userName
      const userPassword = this.formAdmin.userPassword
      if (userName === undefined) {
        this.err.userName = '请获取用户名'
        return
      }
      if ((userPassword === undefined || userPassword === '') && this.accountType) {
        this.err.userPassword = '请输入密码'
        return
      }
      if (checkUserName(userName)) {
        this.err.userName = '账号不可重复'
        return
      }
      if (checkPsd(userPassword) && this.accountType) {
        this.err.userPassword = '密码为6-12位字母、数字或者下划线'
        return
      }

      this.createAdminloading = true
      this.formAdmin = Object.assign(this.formAdmin, {departmentId: this.depId})
      httpPost(createAdmin, this.formAdmin).then(res => {
        this.createAdminloading = false
        this.$notify({
          message: res.message,
          type: 'success',
          duration: 4 * 1000
        })
        history.go(-1)
      }).catch(() => { this.createAdminloading = false })
    }
  }
}
</script>

<style lang="scss" scoped>
.btn-box {
    padding: 20px;
}
</style>

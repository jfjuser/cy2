<template>
  <div>
    <van-form @submit="onSubmit">
      <van-field
        v-model="password"
        type="password"
        name="密码"
        label="密码"
        placeholder="密码"
        :rules="[{ required: true, message: '请填写密码' }, { validator, message: '只能输入6-20个数字' }]"
      />
      <van-field
        v-model="determinePassword"
        type="password"
        name="确认密码"
        label="确认密码"
        placeholder="请再次输入密码"
        :rules="[{ required: true, message: '请填写密码' }, { validator: onFailed, message: '两次输入的密码不一致' }]"
      />
      <div style="margin: 16px;">
        <van-button round block type="info" native-type="submit">
          提交
        </van-button>
      </div>
    </van-form>
  </div>
</template>
<script>
import { Form, Field, Dialog } from 'vant'
import { updatePassword } from '@/api/url'
export default {
  name: '',
  components: {
    vanForm: Form,
    vanField: Field
  },
  data () {
    return {
      password: undefined,
      determinePassword: undefined
    }
  },
  methods: {
    validator (val) {
      return /^([0-9]){6,20}$/.test(val)
    },
    onFailed (val) {
      return this.password === this.determinePassword
    },
    onSubmit () {
      // this.$http.post(updatePassword, {password: this.password, tokenId: this.$route.query.id})
      //   .then(res => {
      //     if (res.code === 1) {
      //       Dialog.alert({
      //         message: '修改成功',
      //         theme: 'round-button',
      //         confirmButtonColor: '#3366FF'
      //       }).then(() => {
      //         // on close
      //       })
      //     }
      //   })
    }
  }
}
</script>
<style lang='scss' scoped>
</style>

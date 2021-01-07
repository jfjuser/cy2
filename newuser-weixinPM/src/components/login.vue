<template>
  <div class="con">
    <div class="box-style">
      <Cell title="Hello，欢迎回来！" class="cell-style"/>
      <CellGroup>
        <Field
          v-model="phone"
          center
          clearable
          left-icon="phone"
          class="input-style"
          placeholder="手机号码"
          @blur="checkPhone"
          size="large"
          :error-message="err.phone"
        >
        </Field>
      </CellGroup>
      <CellGroup>
        <Field
          v-model="password"
          center
          clearable
          left-icon="lock"
          class="input-style"
          type="password"
          :error-message="err.password"
          placeholder="请输入密码"
          @blur="checkPassword"
        >
        </Field>
      </CellGroup>
      <div style="display:flex;justify-content: center;">
        <Button class="btn-click" size="large" @click="login">登录</Button>
      </div>
      <div style="display:flex;justify-content: space-between;">
        <span @click="toRegister" style="color:#1199ee;font-size:14px;;margin:14px">验证码快速登录</span>
        <!-- <span @click="toRegister" style="color:#1199ee;font-size:14px;margin:14px">忘记密码？</span> -->
      </div>
    </div>
  </div>
</template>

<script>
import { Cell, CellGroup, Field, Button } from 'vant'
export default {
  data () {
    return {
      phone: '',
      password: '',
      err: {
        phone: '',
        password: ''
      }
    }
  },
  methods: {
    // 校验手机号格式
    checkPhone () {
      let reg = /^1[123456789]\d{9}$/
      if (!reg.test(this.phone)) {
        this.err.phone = '手机号格式输入不正确'
      } else {
        this.err.phone = ''
      }
    },
    // 校验密码格式
    checkPassword () {
      let reg = /^(\w){6,20}$/
      if (!reg.test(this.password)) {
        this.err.password = '密码为6-20位字母，数字或者下划线'
      } else {
        this.err.password = ''
      }
    },
    toRegister () {
      this.$router.replace('/register')
    },
    login () {
      // 登录
      this.$toast('假装通过了验证直接可以登录')
      this.$router.replace('/statiReport')
    }
  },
  components: {
    Cell,
    CellGroup,
    Field,
    Button
  }
}
</script>
<style lang="scss">
.con{
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url(../assets/login.png);
  background-size: 100%;
  background-repeat: no-repeat;
}
.box-style{
  width:90vw;
  box-shadow:0 0 12px #ccc;
  background-color:#fff;
  margin-top:8.5rem;
  margin-left:5vw;
  height:55vh
}
.cell-style{
  line-height:2.5rem;
  text-align:left;
  font-weight:blod;
  font-size:21px
}
.btn{
  color:#fff;
  background-color:rgb(219,219,219);
  height:30px;width:100px;
  line-height:30px;
  border-radius:15px
}
.input-style{
  color:rgb(25,86,255);
  line-height:2.2rem;
  font-size:17px;
  height:4rem;
  border-bottom:1px solid #ccc;
}
.btn-click{
  background-color: rgb(25,86,255);
  color:#fff;
  width:80vw;
  margin-top:12vw;
  border-radius:8px;
  box-shadow:0 0 12px #ccc;
}
</style>

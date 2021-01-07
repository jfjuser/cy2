<template>
  <div class="container">
    <div class="box-style">
      <Cell title="新用户注册" class="cell-style"/>
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
        <Button slot="button" @click="getCode" size=mini class="btn">获取验证码</Button>
        </Field>
      </CellGroup>
      <CellGroup>
        <Field
          v-model="code"
          center
          clearable
          left-icon="comment"
          type="number"
          class="input-style"
          :error-message="err.code"
          placeholder="请输入验证码"
          @blur="checkCode"
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
        <Button class="btn-click" size="large" @click="register">注册</Button>
      </div>
      <div style="display:flex;font-size:15px;align-items:left;margin:10px">
        <span @click="toLogin" style="color:#1199ee">返回登录</span>
      </div>
    </div>
  </div>
</template>

<script>
import { Cell, CellGroup, Field, Button } from 'vant'
export default {
  data () {
    return {
      phone: undefined,
      code: undefined,
      password: undefined,
      err: {
        phone: '',
        code: '',
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
    // 校验验证码
    checkCode () {
      let reg = /^\d{4,6}$/
      if (!reg.test(this.code)) {
        this.err.code = '验证码输入不正确'
      } else {
        this.err.code = ''
        // 请求验证输入是否正确
      }
    },
    // 获取验证码
    getCode () {
      let reg = /^1[123456789]\d{9}$/
      if (reg.test(this.phone)) {
        // 向后台获取验证码
        this.$notify('验证码已发送至手机,请注意查收')
      } else {
        this.err.phone = '手机号格式输入不正确'
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
    toLogin () {
      this.$router.replace('/login')
    },
    register () {
      // 注册
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
<style>
.container{
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url(../assets/newUser.png);
  background-size: 100%;
  background-repeat: no-repeat;
}
.box-style{
  width:90vw;
  box-shadow:0 0 12px #ccc;
  background-color:#fff;
  margin-top:7.5rem;
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
  line-height:2rem;
  height:3.5rem;
  font-size:15px
}
.btn-click{
  background-color: rgb(25,86,255);
  color:#fff;
  width:80vw;
  margin-top:10vw;
  border-radius:8px;
  box-shadow:0 0 12px #ccc;
}
</style>

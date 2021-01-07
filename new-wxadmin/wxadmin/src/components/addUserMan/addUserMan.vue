<template>
   <div>
      <NavBar
        title="添加用户"
        left-text="返回"
        left-arrow
        @click-left="onClickLeft"
      />
      <!-- <span style="font-size:1.3rem;line-height:3rem;margin-left:1rem">添加</span> -->
      <CellGroup style="margin-top:0.5rem">
          <Field
            v-model="item.userName"
            required
            clearable
            label="账号"
            disabled
            placeholder="请获取账号">
          <Button slot="button" size="small" type="info" @click="getId">获取账号</Button>
          </Field>
         <Field
            v-model="item.userPassword"
            type="password"
            label="密码"
            placeholder="请输入密码"
            required
            @blur="checkPsd"
            :error-message= 'err.psd'
          />
          <Field
            v-model="item.phone"
            label="手机号"
            placeholder="请输入手机号"
            required
            :error-message= 'err.phone'
            @blur="checkPhone"
          />
           <Field
            v-model="item.nickName"
            label="昵称"
            placeholder="请输入昵称"
            required
            :error-message= 'err.nickName'
            @blur="checknickName"
          />
          <Field
            v-model="item.email"
            label="邮箱"
            placeholder="请输入邮箱"
            required
            @blur="checkEmail"
            :error-message= 'err.email'
          />
           <Field
            label="性别"
            disabled
            required
            :border="false"
            />
          <!-- <RadioGroup v-model="radio" :v-model="sexFormatter(item.sex = radio === '0' ? '0' : '1' )" style="margin-left:2.5rem">
            <CellGroup>
              <Cell title="男" clickable @click="radio = '0'">
                <Radio name="0"/>
              </Cell>
              <Cell title="女" clickable @click="radio = '1'">
                <Radio name="1"/>
              </Cell>
            </CellGroup>
          </RadioGroup> -->
          <RadioGroup v-model="radio" :v-model="sexFormatter(item.sex = radio === '0' ? '0' : '1' )" style="margin-left:1rem;line-height:1.5rem;">
            <Radio name="0" style="margin-left:2rem;display:inline-block;">男</Radio>
            <Radio name="1" style="margin-left:4rem;display:inline-block;">女</Radio>
          </RadioGroup>
          <Field
            v-model="item.resume"
            label="备注"
          />
        </CellGroup>
        <Button style="width:80vw;margin-left:10vw;margin-top:15%;border-radius:6px" type="info" @click="saveAddUser" :isLoading="isLoading">保存</Button>
   </div>
</template>
<script>
import { NavBar, Toast, Cell, CellGroup, Field, Button, RadioGroup, Radio } from 'vant'
import { httpGet, httpPost } from '@/utils/restful'
import { getUserName, User } from '@/api/url'
import { sexFormatter } from '@/utils/formatter'
export default {
  name: 'addUserMan',
  data () {
    return {
      sexFormatter: sexFormatter,
      radio: '0',
      props: undefined,
      isLoading: false,
      err: {
        psd: '',
        phone: '',
        email: '',
        nickName: ''
      },
      item: {
        id: undefined,
        userName: undefined,
        userPassword: undefined,
        phone: undefined,
        email: undefined,
        sex: undefined,
        nickName: undefined,
        resume: undefined
      }
    }
  },
  methods: {
    onClickLeft () {
      this.$router.push('/QXuserMan/')
    },
    // 获取账号
    getId () {
      httpGet(getUserName).then(res => {
        this.item.userName = res.data
      }).catch(() => {
      })
    },
    // 验证
    checkPsd () {
      if (!(/^(\w){6,12}$/.test(this.item.userPassword))) {
        this.err.psd = '密码为6-12位字母，数字或者下划线'
      } else {
        this.err.psd = ''
      }
    },
    checknickName () {
      if (this.item.nickName === '') {
        this.err.nickName = '请输入昵称'
      } else {
        this.err.nickName = ''
      }
    },
    checkPhone () {
      if (!(/^1[123456789]\d{9}$/.test(this.item.phone))) {
        this.err.phone = '请输入正确的手机号码'
      } else {
        this.err.phone = ''
      }
    },
    checkEmail () {
      if (!(/^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/.test(this.item.email))) {
        this.err.email = '请输入正确的邮箱地址'
      } else {
        this.err.email = ''
      }
    },
    // 保存添加用户
    saveAddUser () {
      let self = this
      if (self.item.userName !== '' && self.item.userPassword !== '' && self.item.phone !== '' && self.item.email !== '') {
        self.isLoading = true
        self.item = Object.assign(self.item, {departmentId: this.$store.getters.departmentId})
        httpPost(User, this.item).then(res => {
          self.isLoading = false
          Toast({
            message: res.message,
            type: 'success',
            duration: 4 * 1000
          })
          this.$router.push('/QXuserMan/')
        }).catch(() => {
          self.isLoading = false
        })
      } else {
        Toast.fail('带*为必填选项，请填写完整！')
      }
    // self.createLoading = true
    //   this.form = Object.assign(this.form, {departmentId: this.$store.getters.departmentId})
    //   httpPost(User, this.form).then(res => {
    //     self.createLoading = false
    //     self.fetchData()
    //     self.dialogFormVisible = false
    //     this.$message({
    //       message: res.message,
    //       type: 'success',
    //       duration: 4 * 1000
    //     })
    //   }).catch(() => {
    //     self.createLoading = false
    //   })
    }
  },
  components: {
    NavBar,
    Toast,
    Field,
    Button,
    RadioGroup,
    Radio,
    Cell,
    CellGroup
  }
}
</script>
<style lang="scss" scoped>

</style>

<template>
    <div>
        <ValidationObserver slim ref="form">
          <van-cell-group>
            <ValidationProvider name="账号" rules="required" v-slot="{ errors }" slim v-if="!queryData">
              <van-field
                v-model="form.userName"
                required
                clearable
                label="账号"
                disabled
                placeholder="请获取账号"
                :error-message="errors[0]">
                    <van-button round slot="button" @click="getAccountNum" :loading="userNameLoading" size="small" type="info" >获取账号</van-button>
              </van-field>
            </ValidationProvider>
            <ValidationProvider name="密码" rules="required|password" v-slot="{ errors }" slim v-if="!queryData">
              <van-field
                v-model="form.userPassword"
                type="password"
                label="密码"
                placeholder="请输入密码"
                required
                :error-message="errors[0]"
              />
            </ValidationProvider>
            <ValidationProvider name="手机号" rules="required|phone" v-slot="{ errors }" slim>
              <van-field
                v-model="form.phone"
                label="手机号"
                placeholder="请输入手机号"
                required
                :error-message="errors[0]"
              />
            </ValidationProvider>
            <ValidationProvider name="邮箱" rules="required|email" v-slot="{ errors }" slim>
              <van-field
                v-model="form.email"
                label="邮箱"
                placeholder="请输入邮箱"
                required
                :error-message="errors[0]"
              />
            </ValidationProvider>
            <ValidationProvider name="性别" rules="required" v-slot="{ errors }" slim :customMessages="{'required':'请选择{_field_}'}">
              <van-cell title="性别" required >
                <van-radio-group v-model="form.sex">
                    <van-radio :name="0" class="mar-b-15">男</van-radio>
                    <van-radio :name="1">女</van-radio>
                </van-radio-group>
                <p class="fc-red text-c">{{errors[0]}}</p>
              </van-cell>
            </ValidationProvider>
            <van-field
              v-model="form.resume"
              label="备注"
              placeholder="请输入备注"
              type="textarea"
              autosize rows="1"
            />
          </van-cell-group>
        </ValidationObserver>

        <div class="btn-box">
            <van-button v-if="!queryData" type="info" :loading="createLoading" @click="createUser" block round>保存</van-button>
            <van-button v-if="queryData" type="info" :loading="updataLoading" @click="updataUser" block round>完成</van-button>
        </div>
    </div>
</template>

<script>
import { Cell, CellGroup, Field, Button, RadioGroup, Radio } from 'vant'
import { User, getUserName } from '@/api/url'
import { httpPost, httpPut, httpGet } from '@/utils/restful'
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
        isAdmin: undefined,
        userName: '',
        userPassword: '',
        nickName: '',
        phone: '',
        email: '',
        sex: '',
        resume: ''
      },
      createLoading: false,
      userNameLoading: false,
      updataLoading: false
    }
  },
  computed: {
    queryData () {
      return this.$route.query.data
    }
  },
  created () {
    if (this.$route.query.data) {
      this.form = Object.assign({}, JSON.parse(this.$route.query.data))
    }
  },
  methods: {
    // 创建
    createUser () {
      this.$refs.form.validate().then(success => {
        if (!success) return
        this.createLoading = true
        this.form = Object.assign(this.form, {departmentId: this.$store.getters.departmentId})
        httpPost(User, this.form).then(res => {
          setTimeout(() => { this.createLoading = false }, 300)
          this.$notify({
            message: res.message,
            duration: 3000,
            type: 'success'
          })
          history.go(-1)
        }).catch(() => {
          this.createLoading = false
        })

        this.$nextTick(() => {
          this.$refs.form.reset()
        })
      })
    },
    // 更新
    updataUser () {
      this.$refs.form.validate().then(success => {
        if (!success) return
        this.updataLoading = true
        this.form = Object.assign(this.form, {departmentId: this.$store.getters.departmentId})
        httpPut(User, this.form).then(res => {
          setTimeout(() => { this.updataLoading = false }, 300)
          this.$notify({
            message: res.message,
            duration: 3000,
            type: 'success'
          })
          history.go(-1)
        }).catch(() => {
          this.updataLoading = false
        })

        this.$nextTick(() => {
          this.$refs.form.reset()
        })
      })
    },
    // 获取账号
    getAccountNum () {
      this.userNameLoading = true
      httpGet(getUserName).then(res => {
        this.userNameLoading = false
        this.form.userName = res.data
      }).catch(() => {
        this.userNameLoading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.btn-box {
    padding: 20px;
}
</style>

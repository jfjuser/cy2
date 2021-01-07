<template>
  <div>
    <ValidationObserver slim ref="form">
      <van-cell-group>
        <ValidationProvider name="车闸编号" rules="required" v-slot="{ errors }" slim>
          <van-field
            label="车闸编号"
            v-model.trim="form.appId"
            placeholder="请输入车闸编号"
            :error-message="errors[0]"
          />
        </ValidationProvider>
        <ValidationProvider name="签名秘钥" rules="required" v-slot="{ errors }" slim>
          <van-field
            label="签名秘钥"
            type="password"
            v-model.trim="form.mchntId"
            placeholder="请输入签名秘钥"
            :error-message="errors[0]"
          />
        </ValidationProvider>
      </van-cell-group>
    </ValidationObserver>
    <div class="btn-box">
        <van-button type="info" block round @click="onSubmit" :loading="loading">保存</van-button>
    </div>
  </div>
</template>

<script>
import { Cell, CellGroup, Field, Button } from 'vant'
import { editDepConfig, department } from '@/api/url'
import { httpPost, httpGet } from '@/utils/restful'
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
        appId: '',
        appSecret: ''
      }
    }
  },
  mounted () {
    this.getParams()
  },
  methods: {
    getParams () {
      const ToastLoading = this.$toast.loading({ message: '加载中...', position: 'middle', duration: 0 })
      httpGet(department + '/' + this.$store.getters.departmentId)
        .then(res => {
          ToastLoading.clear()
          this.form = Object.assign({}, res.data)
        })
        .catch(() => { ToastLoading.clear() })
    },
    onSubmit () {
      this.$refs.form.validate().then(success => {
        if (!success) return
        this.loading = true
        this.form = Object.assign(this.form, {departmentId: this.$store.getters.departmentId})
        httpPost(editDepConfig, this.form).then(res => {
          this.$notify({
            message: res.message,
            type: 'success'
          })
          this.loading = false
        }).catch(() => {
          this.loading = false
        })

        this.$nextTick(() => {
          this.$refs.form.reset()
        })
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

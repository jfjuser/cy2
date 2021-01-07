<template>
  <div>
    <p class="bgc title">芝麻对接参数：</p>
    <ValidationObserver slim ref="form">
      <van-cell-group>
        <ValidationProvider name="车场编号" rules="required" v-slot="{ errors }" slim>
          <van-field
            label="车场编号"
            v-model.trim="form.zhiMaParkingNo"
            placeholder="请输入车场编号"
            :error-message="errors[0]"
          />
        </ValidationProvider>
        <ValidationProvider name="车场名称" rules="required" v-slot="{ errors }" slim>
          <van-field
            label="车场名称"
            v-model.trim="form.zhimaParkingName"
            placeholder="请输入车场名称"
            :error-message="errors[0]"
          />
        </ValidationProvider>
        <ValidationProvider name="秘钥" rules="required" v-slot="{ errors }" slim>
          <van-field
            label="秘钥"
            v-model.trim="form.zhimaServiceKey"
            placeholder="请输入秘钥"
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
import { sesamePay } from '@/api/url'
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
        zhiMaParkingNo: null,
        zhimaParkingName: null,
        zhimaServiceKey: null,
        zhimaServiceUrl: null,
        departmentId: this.$store.getters.departmentId
      }
    }
  },
  mounted () {
    this.getParams()
  },
  methods: {
    getParams () {
      const ToastLoading = this.$toast.loading({ message: '加载中...', position: 'middle', duration: 0 })
      httpGet(sesamePay + '/' + this.$store.getters.departmentId)
        .then(res => {
          ToastLoading.clear()
          if (res.data !== null) {
            this.form = res.data
          }
        })
        .catch(() => { ToastLoading.clear() })
    },
    onSubmit () {
      this.$refs.form.validate().then(success => {
        if (!success) return
        this.loading = true
        this.form = Object.assign(this.form, {departmentId: this.$store.getters.departmentId})
        httpPost(sesamePay, this.form).then(res => {
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
.title {
  font-size: 14px;
  padding: 10px 15px;
}
</style>

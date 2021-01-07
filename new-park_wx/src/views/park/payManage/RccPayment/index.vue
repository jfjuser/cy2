<template>
  <div>
    <ValidationObserver slim ref="form">
      <van-cell-group>
        <ValidationProvider name="商户号" rules="required" v-slot="{ errors }" slim>
          <van-field
            label="商户号"
            :maxlength="15"
            v-model.trim="form.mchntId"
            placeholder="请输入商户号(15位)"
            :error-message="errors[0]"
          />
        </ValidationProvider>
        <ValidationProvider name="机构号" rules="required" v-slot="{ errors }" slim>
          <van-field
            label="机构号"
            :maxlength="6"
            v-model.trim="form.mchntId"
            placeholder="请输入机构号(6位)"
            :error-message="errors[0]"
          />
        </ValidationProvider>
        <van-field
          label="商品名称"
          :maxlength="64"
          v-model.trim="form.commodityName"
          placeholder="请输入商品名称(默认停车缴费)"
        />
        <van-field
          label="商品备注"
          type="textarea"
          rows="1"
          autosize
          :maxlength="32"
          v-model.trim="form.bodyDesc"
          placeholder="请输入商品备注"
        />
      </van-cell-group>
    </ValidationObserver>
    <div class="btn-box">
        <van-button type="info" block round @click="onSubmit" :loading="loading">保存</van-button>
    </div>
  </div>
</template>

<script>
import { Cell, CellGroup, Field, Button } from 'vant'
import { rccPayParams } from '@/api/url'
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
        mchntId: '',
        commodityName: '停车缴费',
        orgId: '',
        bodyDesc: ''
      }
    }
  },
  mounted () {
    this.getParams()
  },
  methods: {
    getParams () {
      const ToastLoading = this.$toast.loading({ message: '加载中...', position: 'middle', duration: 0 })
      httpGet(rccPayParams + '/' + this.$store.getters.departmentId)
        .then(res => {
          ToastLoading.clear()
          this.form = Object.assign({}, res.data)
          if (!this.form.commodityName) {
            this.form.commodityName = '停车缴费'
          }
        })
        .catch(() => { ToastLoading.clear() })
    },
    onSubmit () {
      this.$refs.form.validate().then(success => {
        if (!success) return
        this.loading = true
        this.form = Object.assign(this.form, {departmentId: this.$store.getters.departmentId})
        httpPost(rccPayParams, this.form).then(res => {
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

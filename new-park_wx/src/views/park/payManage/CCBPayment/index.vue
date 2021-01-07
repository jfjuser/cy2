<template>
  <div>
    <van-cell-group>
      <label class="label">聚合支付商户编号</label>
      <van-field
        v-model.trim="form.aggMerchantId"
        placeholder="请输入"
      />
      <label class="label">聚合支付柜台号</label>
      <van-field
        v-model.trim="form.aggPosId"
        placeholder="请输入"
      />
      <label class="label">聚合支付公钥</label>
      <van-field
        type="textarea"
        rows="1"
        :autosize=" { maxHeight: 75 }"
        v-model.trim="form.aggPublicKey"
        placeholder="请输入"
      />
      <label class="label">无感支付支付商户号</label>
      <van-field
        v-model.trim="form.nsMerchantId"
        placeholder="请输入"
      />
      <label class="label">无感支付柜台号</label>
      <van-field
        v-model.trim="form.nsPosId"
        placeholder="请输入"
      />
      <label class="label">无感支付分行代码</label>
      <van-field
        v-model.trim="form.nsBranchId"
        placeholder="请输入"
      />
      <label class="label">无感支付公钥</label>
      <van-field
        type="textarea"
        rows="1"
        :autosize=" { maxHeight: 75 }"
        v-model.trim="form.nsPublicKey"
        placeholder="请输入"
      />
    </van-cell-group>
    <div class="btn-box">
        <van-button type="info" block round @click="onSubmit" :loading="loading">保存</van-button>
    </div>
  </div>
</template>

<script>
import { Cell, CellGroup, Field, Button } from 'vant'
import { CCBParams } from '@/api/url'
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
        aggMerchantId: '',
        aggPosId: '',
        aggBranchId: '',
        aggPublicKey: '',
        nsMerchantId: '',
        nsPosId: '',
        nsBranchId: '',
        nsPublicKey: ''
      }
    }
  },
  mounted () {
    this.getParams()
  },
  methods: {
    getParams () {
      const ToastLoading = this.$toast.loading({ message: '加载中...', position: 'middle', duration: 0 })
      httpGet(CCBParams + '/' + this.$store.getters.departmentId)
        .then(res => {
          ToastLoading.clear()
          this.form = Object.assign({}, res.data)
        })
        .catch(() => { ToastLoading.clear() })
    },
    onSubmit () {
      this.loading = true
      this.form = Object.assign(this.form, {departmentId: this.$store.getters.departmentId})
      httpPost(CCBParams, this.form).then(res => {
        this.$notify({
          message: res.message,
          type: 'success'
        })
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.label {
  font-size: 14px;
  padding: 0 16px;
  padding-top: 10px;
  box-sizing: border-box;
  display: block;
}
.btn-box {
    padding: 20px;
}
</style>

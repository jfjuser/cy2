<template>
  <div class="app-container">
    <div class="table-main">
      <el-form  label-width="150px">
        <el-form-item label="聚合支付商户编号" >
          <el-input v-model="form.aggMerchantId"></el-input>
        </el-form-item>
        <el-form-item label="聚合支付柜台号" >
          <el-input v-model="form.aggPosId"></el-input>
        </el-form-item>
        <el-form-item label="聚合支付分行代码">
          <el-input v-model="form.aggBranchId"></el-input>
        </el-form-item>
        <el-form-item label="聚合支付公钥">
          <el-input type="textarea" v-model="form.aggPublicKey"></el-input>
        </el-form-item>
        <el-form-item label="无感支付支付商户号">
          <el-input v-model="form.nsMerchantId"></el-input>
        </el-form-item>
        <el-form-item label="无感支付柜台号">
          <el-input v-model="form.nsPosId"></el-input>
        </el-form-item>
        <el-form-item label="无感支付分行代码">
          <el-input v-model="form.nsBranchId"></el-input>
        </el-form-item>
        <el-form-item label="无感支付公钥">
          <el-input type="textarea" v-model="form.nsPublicKey"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="loading" @click="onSubmit">保存</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { CCBParams } from '@/api/url'
import { httpPost, httpGet } from '@/utils/restful'
export default {
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
      httpGet(CCBParams + '/' + this.$store.getters.departmentId)
        .then(res => {
          this.form = Object.assign({}, res.data)
        })
        .catch(() => {})
    },
    onSubmit () {
      this.loading = true
      this.form = Object.assign(this.form, {departmentId: this.$store.getters.departmentId})
      httpPost(CCBParams, this.form).then(res => {
        this.loading = false
        this.$message({
          message: res.message,
          type: 'success'
        })
      }).catch(() => {
        this.loading = false
      })
    }
  }
}
</script>

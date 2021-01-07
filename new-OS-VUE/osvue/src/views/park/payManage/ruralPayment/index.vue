<template>
  <div class="app-container">
    <div class="table-main">
      <el-form  label-width="150px" ref="dataform" :rules="formRules" autoCompete = "on" :model="form">
        <el-form-item label="平台号" prop="appCode" style="max-width:500px">
          <el-input v-model="form.appCode"  placeholder="请输入平台号"></el-input>
        </el-form-item>
        <el-form-item label="交易机构号" prop="branchId" style="max-width:500px">
          <el-input v-model="form.branchId"  placeholder="请输入交易机构号"></el-input>
        </el-form-item>
        <el-form-item label="一级商户号" prop="merNbr" style="max-width:500px">
          <el-input v-model="form.merNbr"  placeholder="请输入一级商户号"></el-input>
        </el-form-item>
        <el-form-item label="二级商户号" prop="subMerchantId" style="max-width:500px">
          <el-input v-model="form.subMerchantId"  placeholder="请输入二级商户号"></el-input>
        </el-form-item>
        <el-form-item label="商品备注" style="max-width:500px">
          <el-input v-model="form.bodyDesc"  placeholder="请输入商品备注"></el-input>
        </el-form-item>
        <el-form-item style="max-width:500px">
          <el-button type="primary" :loading="loading" @click="onSubmit">保存</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { rccPayParams } from '@/api/url'
import { httpPost, httpGet } from '@/utils/restful'
export default {
  data () {
    return {
      loading: false,
      form: {
        appCode: '',
        branchId: '',
        merNbr: '',
        bodyDesc: '',
        subMerchantId: ''
      },
      formRules: {
        appCode: [
          {required: true, trigger: 'blur', message: '请输入平台号'}
        ],
        branchId: [
          {required: true, trigger: 'blur', message: '请输入交易机构号'}
        ],
        merNbr: [
          {required: true, trigger: 'blur', message: '请输入一级商户号'}
        ],
        subMerchantId: [
          {required: true, trigger: 'blur', message: '请输入二级商户号'}
        ]
      }
    }
  },
  mounted () {
    this.getParams()
  },
  methods: {
    getParams () {
      httpGet(rccPayParams + '/' + this.$store.getters.departmentId)
        .then(res => {
          // console.log(res.data)
          this.form = Object.assign({}, res.data)
          // this.form = {
          //   appCode: res.data.appCode,
          //   branchId: res.data.branchId,
          //   merNbr: res.data.merNbr,
          //   bodyDesc: res.data.bodyDesc,
          //   subMerchantId: res.data.subMerchantId
          // }
        })
        .catch(() => {})
    },
    onSubmit () {
      this.$refs.dataform.validate((valid) => {
        if (valid) {
          this.loading = true
          this.form = Object.assign(this.form, {departmentId: this.$store.getters.departmentId})
          httpPost(rccPayParams, this.form).then(res => {
            this.loading = false
            this.$message({
              message: res.message,
              type: 'success'
            })
          }).catch(() => {
            this.loading = false
          })
        }
      })
    }
  }
}
</script>

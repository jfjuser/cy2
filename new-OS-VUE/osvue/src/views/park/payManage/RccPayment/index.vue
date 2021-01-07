<template>
  <div class="app-container">
    <div class="table-main">
      <el-form  label-width="150px" ref="dataform" :rules="formRules" autoCompete = "on" :model="form">
        <el-form-item label="操作员id"  style="max-width:500px">
           <el-input v-model="form.operatorId" :maxlength="15" placeholder="请输入操作员id"></el-input>
        </el-form-item>
        <el-form-item label="商户号" prop="mchntId" style="max-width:500px">
          <el-input v-model="form.mchntId" :maxlength="15" placeholder="请输入商户号(15位)"></el-input>
        </el-form-item>
        <el-form-item label="支付秘钥" style="max-width:500px">
          <el-input v-model="form.signKey" :maxlength="32" placeholder="请输入支付秘钥"></el-input>
        </el-form-item>
        <el-form-item label="机构号" prop="orgId" style="max-width:500px">
          <el-input v-model="form.orgId" :maxlength="6" placeholder="请输入机构号(6位)"></el-input>
        </el-form-item>
        <el-form-item label="商品名称" style="max-width:500px">
          <el-input v-model="form.commodityName" :maxlength="64" placeholder="请输入商品名称(默认停车缴费)"></el-input>
        </el-form-item>
        <el-form-item label="商品备注" style="max-width:500px">
          <el-input v-model="form.bodyDesc" :maxlength="32" placeholder="请输入商品备注"></el-input>
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
        mchntId: '',
        commodityName: '停车缴费',
        orgId: '',
        bodyDesc: '',
        signKey: '',
        operatorId: ''
      },
      formRules: {
        mchntId: [
          {required: true, trigger: 'blur', message: '请输入商户号'}
        ],
        orgId: [
          {required: true, trigger: 'blur', message: '请输入机构号'}
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
          this.form = Object.assign({}, res.data)
          if (!this.form.commodityName) {
            this.form.commodityName = '停车缴费'
          }
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

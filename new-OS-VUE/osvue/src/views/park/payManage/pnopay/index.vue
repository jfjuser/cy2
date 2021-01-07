<template>
  <div class="app-container">
    <div class="table-main">
      <el-form  label-width="150px" ref="dataform" :rules="formRules" autoCompete = "on" :model="form">
        <el-form-item label="车闸编号" prop="appId">
          <el-input v-model="form.appId" placeholder="请输入车闸编号"></el-input>
        </el-form-item>
        <el-form-item label="签名秘钥" prop="appSecret">
          <el-input v-model="form.appSecret" type="password" placeholder="请输入签名秘钥"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="loading" @click="onSubmit">保存</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { editDepConfig, department } from '@/api/url'
import { httpPost, httpGet } from '@/utils/restful'
export default {
  data () {
    return {
      loading: false,
      form: {
        appId: '',
        appSecret: ''
      },
      formRules: {
        appId: [
          {required: true, trigger: 'blur', message: '请输入车闸编号'}
        ],
        appSecret: [
          {required: true, trigger: 'blur', message: '请输入签名秘钥'}
        ]
      }
    }
  },
  mounted () {
    this.getParams()
  },
  methods: {
    getParams () {
      httpGet(department + '/' + this.$store.getters.departmentId)
        .then(res => {
          this.form = Object.assign({}, res.data)
        })
        .catch(() => {})
    },
    onSubmit () {
      this.$refs.dataform.validate((valid) => {
        if (valid) {
          this.loading = true
          this.form = Object.assign(this.form, {departmentId: this.$store.getters.departmentId})
          httpPost(editDepConfig, this.form).then(res => {
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

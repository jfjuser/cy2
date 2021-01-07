<template>
  <div class="app-container">
    <div class="table-main">
      <p>网联客参数：</p>
      <el-form  label-width="150px" ref="dataform" :rules="formRules" autoCompete = "on" :model="form">
        <el-form-item style="max-width:500px" label="系统标识" prop="clientId">
          <el-input v-model="form.clientId" placeholder="请输入系统标识"></el-input>
        </el-form-item>
        <el-form-item style="max-width:500px" label="商户标识" prop="merchantId">
          <el-input v-model="form.merchantId" placeholder="请输入商户标识"></el-input>
        </el-form-item>
        <el-form-item style="max-width:500px" label="商户名称" prop="mchntName">
          <el-input v-model="form.mchntName" placeholder="请输入商户名称"></el-input>
        </el-form-item>
        <el-form-item style="max-width:500px" label="机构号">
          <el-input v-model="form.orgId" placeholder="请输入机构号"></el-input>
        </el-form-item>
        <el-form-item style="max-width:500px" label="订单标题">
          <el-input v-model="form.subject" placeholder="请输入订单标题"></el-input>
        </el-form-item>
        <!-- <el-form-item style="max-width:500px" label="服务地址" prop="zhimaServiceUrl">
          <el-input v-model="form.zhimaServiceUrl" placeholder="请输入服务地址"></el-input>
        </el-form-item> -->
        <el-form-item>
          <el-button type="primary" @click="storageParams">保存</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { wanglianke, wanglianke1 } from '@/api/url'
import { httpGet, httpPost } from '@/utils/restful'
export default {
  data () {
    return {
      loading: false,
      form: {
        clientId: null,
        merchantId: null,
        mchntName: null,
        orgId: null,
        subject: null,
        departmentId: this.$store.getters.departmentId
      },
      formRules: {
        clientId: [
          {required: true, trigger: 'blur', message: '不可为空'}
        ],
        merchantId: [
          {required: true, trigger: 'blur', message: '不可为空'}
        ],
        mchntName: [
          {required: true, trigger: 'blur', message: '不可为空'}
        ]
        // zhimaServiceUrl: [
        //   {required: true, trigger: 'blur', message: '不可为空'}
        // ]
      }
    }
  },
  mounted () {
    this.getParams()
  },
  methods: {
    getParams () {
      httpGet(wanglianke + this.$store.getters.departmentId)
        .then((res) => {
          if (res.data !== null) {
            this.form = res.data
          }
        }).catch(() => {})
    },
    storageParams () {
      this.$refs.dataform.validate((valid) => {
        if (valid) {
          httpPost(wanglianke1, this.form)
            .then((res) => {
              console.log(res)
              this.$message({
                type: 'success',
                duration: 3000,
                message: res.message
              })
              window.location.reload()
            }).catch(() => {})
        }
      })
    }
  }
}
</script>

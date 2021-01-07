<template>
  <div class="app-container">
    <div class="table-main">
      <p>芝麻对接参数：</p>
      <el-form  label-width="150px" ref="dataform" :rules="formRules" autoCompete = "on" :model="form">
        <el-form-item style="max-width:500px" label="车场编号" prop="zhiMaParkingNo">
          <el-input v-model="form.zhiMaParkingNo" placeholder="请输入编号"></el-input>
        </el-form-item>
        <el-form-item style="max-width:500px" label="车场名称" prop="zhimaParkingName">
          <el-input v-model="form.zhimaParkingName" placeholder="请输入车场名称"></el-input>
        </el-form-item>
        <el-form-item style="max-width:500px" label="秘钥" prop="zhimaServiceKey">
          <el-input v-model="form.zhimaServiceKey" placeholder="请输入秘钥"></el-input>
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
import { sesamePay } from '@/api/url'
import { httpGet, httpPost } from '@/utils/restful'
export default {
  data () {
    return {
      loading: false,
      form: {
        zhiMaParkingNo: null,
        zhimaParkingName: null,
        zhimaServiceKey: null,
        zhimaServiceUrl: null,
        departmentId: this.$store.getters.departmentId
      },
      formRules: {
        zhiMaParkingNo: [
          {required: true, trigger: 'blur', message: '不可为空'}
        ],
        zhimaParkingName: [
          {required: true, trigger: 'blur', message: '不可为空'}
        ],
        zhimaServiceKey: [
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
      httpGet(sesamePay + '/' + this.$store.getters.departmentId)
        .then((res) => {
          if (res.data !== null) {
            this.form = res.data
          }
        }).catch(() => {})
    },
    storageParams () {
      // let zhimaPayParamsAddOrUpdateDto = this.form
      this.$refs.dataform.validate((valid) => {
        if (valid) {
          httpPost(sesamePay, this.form)
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

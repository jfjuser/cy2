<template>
  <div class="app-container">
    <div class="table-main">
      <el-form ref="form" :rules="formRules" :model="form" label-width="120px">
        <el-form-item label="相机地址" prop="sourceIp">
          <el-input class="filter-item" v-model="form.sourceIp"></el-input>
        </el-form-item>
        <el-form-item label="通道名称"  prop="localName">
          <el-input  class="filter-item" v-model="form.localName"></el-input>
        </el-form-item>
        <!-- <p style="margin-left: 30px"><el-tag type="success">活动：现在绑定相机, 将赠送7天体验普通会员权限</el-tag></p>
        <p style="margin-left: 30px"><el-tag type="success">活动2：激活或续费普通会员可享受折扣优惠</el-tag></p>
        <p style="margin-left: 30px"><el-tag type="warning">注意：人脸平台是收费使用的, 相机超过会员有效期将可能强制断开连接</el-tag></p> -->
        <el-form-item>
          <el-button type="primary" @click="onSubmit">保存</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { inOutType } from '@/utils/selectAble.js'
// import { checkMac } from '@/utils/validator.js'
import { httpPost } from '@/utils/restful'
import { cameraCon } from '@/api/url'

export default {
  data () {
    return {
      form: {
        mac: undefined,
        localName: undefined
      },
      formRules: {
        sourceIp: [
          {required: true, trigger: 'blur', message: '请填写相机地址'}
          // {required: true, trigger: 'blur', message: '请填写MAC地址'},
          // {validator: checkMac, trigger: 'blur'},
          // {minlength: 17, maxlength: 17, trigger: 'blue', message: '请输入正确的MAC地址'}
        ],
        localName: [
          {required: true, trigger: 'blur', message: '请输入通道名称'}
        ]
      },
      inOutType: inOutType
    }
  },
  methods: {
    // // 判断mac
    // macChange (value) {
    //   if (value.length === 2) this.form.mac = this.form.mac + ':'
    //   if (value.length === 5) this.form.mac = this.form.mac + ':'
    //   if (value.length === 8) this.form.mac = this.form.mac + ':'
    //   if (value.length === 11) this.form.mac = this.form.mac + ':'
    //   if (value.length === 14) this.form.mac = this.form.mac + ':'
    //   if (value.length > 17) {
    //     this.$nextTick(() => {
    //       this.form.mac = this.form.mac.substring(0, 17)
    //     })
    //     this.$message.error('请输入正确的MAC地址')
    //   }
    // },
    // 重置表单
    resetForm () {
      this.form = {
        sourceIp: undefined,
        localName: undefined
      }
    },
    // 绑定MAC地址
    onSubmit () {
      this.$refs.form.validate(valid => {
        if (valid) {
          let loading = this.$loading({
            lock: true,
            text: '绑定中...',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          })
          this.form = Object.assign(this.form, {departmentId: Number(this.$store.getters.departmentId)})
          httpPost(cameraCon, this.form).then((res) => {
            this.resetForm()
            this.$nextTick(() => {
              this.$refs['form'].clearValidate()
            })
            loading.close()
            this.$message({
              type: 'success',
              message: res.message,
              duration: 4 * 1000
            })
          }).catch(() => {
            loading.close()
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.el-input{
    width: auto;
}
</style>

<template>
  <div class="app-container">
    <div class="table-main">
      <el-form ref="form" :rules="formRules" :model="form" label-width="120px">
        <el-form-item label="相机编号" prop="mac">
          <el-select v-model="form.mac">
            <el-option v-for="item in localList" :key="item.mac" :label="item.localName" :value="item.mac"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="文件名称" prop="filename">
          <el-input  v-model="form.filename"></el-input>
        </el-form-item>
        <el-form-item label="参数名称"  prop="key">
          <el-input  v-model="form.key"></el-input>
        </el-form-item>
        <el-form-item label="参数值"  prop="val">
          <el-input  v-model="form.val"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="submitLoading" @click="onSubmit">保存</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
// import { setting } from '@/api/g4/setting.js'
// import { getCamera } from '@/api/remoteUpgrade'
import { httpGet } from '@/utils/restful'
import { getCamera, setting } from '@/api/url'
export default {
  data () {
    return {
      submitLoading: false,
      form: {
        mac: undefined,
        filename: undefined,
        key: undefined,
        val: undefined
      },
      formRules: {
        mac: [
          {required: true, trigger: 'change', message: '请选择相机'}
        ],
        filename: [
          {required: true, trigger: 'blur', message: '请输入文件名'}
        ],
        key: [
          {required: true, trigger: 'blur', message: '请输入参数名'}
        ],
        val: [
          {required: true, trigger: 'blur', message: '请输入参数值'}
        ]
      },
      localList: []
    }
  },
  mounted () {
    this.loadAll()
  },
  methods: {
    // 获取所有的通道列表
    loadAll () {
      httpGet(getCamera + this.$store.getters.departmentId).then(res => {
        this.localList = res.data
      }).catch(() => {})
    },
    onSubmit () {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.submitLoading = true
          this.form = Object.assign(this.form, {departmentId: this.$store.getters.departmentId})
          httpGet(setting, this.form).then(res => {
            this.submitLoading = false
            this.$message.success(res.message)
          }).catch(() => {
            this.submitLoading = false
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

<template>
  <div class="app-container">
    <div class="table-main">
      <el-form :rules="formRules" ref="dataform"  :model="form" autoCompete = "on" label-position="right" label-width="120px">
        <el-form-item label="相机名称" prop="tokenIds">
          <el-select v-model = "form.tokenIds"  multiple>
            <el-option v-for="item in localList" :key="item.id"  :value = "item.id" :label="item.localName">
              <span style="float: left">{{item.localName}}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{item.mac}}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="参数名称" prop="key">
          <el-input v-model="form.key"></el-input>
        </el-form-item>
        <el-form-item label="参数值" prop="value">
          <el-input v-model="form.value"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button :loading="loading" type="primary" @click="onSubmit">确认</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { httpGet, httpPost } from '@/utils/restful'
import { getCamera, ParamsSetting } from '@/api/url'
export default {
  data () {
    return {
      form: {
        tokenIds: [],
        key: undefined,
        value: undefined
      },
      formRules: {
        tokenIds: [
          {required: true, trigger: 'change', message: '不可为空'}
        ],
        key: [
          {required: true, trigger: 'blur', message: '不可为空'}
        ],
        value: [
          {required: true, trigger: 'blur', message: '不可为空'}
        ]
      },
      loading: false,
      localList: []
    }
  },
  methods: {
    getCameraList () {
      httpGet(getCamera + this.$store.getters.departmentId).then(res => {
        if (res.data.length === 0) {
          this.$message({
            message: '请先配置通道',
            type: 'warning',
            duration: 4 * 1000
          })
        } else {
          this.localList = res.data
        }
      }).catch(() => {})
    },
    onSubmit () {
      this.$refs.dataform.validate((valid) => {
        if (valid) {
          this.loading = true
          httpPost(ParamsSetting, this.form).then(res => {
            this.loading = false
            this.$message({
              message: res.message,
              type: 'success',
              duration: 4 * 1000
            })
          }).catch(() => {
            this.loading = false
          })
        }
      })
    }
  },
  mounted () {
    this.getCameraList()
  }
}
</script>

<style lang="scss" scoped>
.line{
  text-align: center;
}
.el-input{
    width: auto;
}
</style>

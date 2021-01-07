<template>
  <div class="app-container">
    <div class="table-main">
      <el-form :rules="formRules" ref="dataform"  :model="form" autoCompete = "on" label-position="right" label-width="120px">
        <el-form-item label="类型" prop="suggestionSelect">
          <el-select v-model="form.suggestionSelect"  class="filter-item" placeholder="反馈类型">
            <el-option v-for="item in suggestionSelectType" :key="item.valueNo" :label="item.valueName" :value="item.valueNo"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="图片" required>
          <el-upload
            id="uploadImgs"
            :action="action"
            name='img'
            :limit = 3
            :on-exceed = "checkLimit"
            list-type="picture-card"
            :headers="headers"
            :before-upload="beforeUpload"
            :on-preview="handlePictureCardPreview"
            :on-success = "handleSuccess"
            :on-error = "handleError"
            :on-remove="handleRemove">
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
        </el-form-item>
        <el-form-item label="手机" prop="phone">
          <el-input v-model="form.phone"></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="suggestionContact">
          <el-input type="textarea" :rows="4" v-model="form.suggestionContact"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button :loading="loading" type="primary" @click="onSubmit">保存</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { getToken } from '@/utils/cookie.js'
import { checkPhone } from '@/utils/validator.js'
import { suggestionAdd, uploadSugPic } from '@/api/url.js'
import { httpPost } from '@/utils/restful.js'
import { suggestionSelectType } from '@/utils/selectAble.js'
export default {
  computed: {
    headers () {
      return {
        'AdminToken': getToken(),
        'departmentId': this.$store.getters.departmentId
      }
    }
  },
  data () {
    return {
      action: uploadSugPic,
      suggestionSelectType: suggestionSelectType,
      form: {
        phone: undefined,
        suggestionContact: undefined,
        suggestionSelect: undefined,
        type: 1,
        kind: 0,
        uuid: ''
      },
      formRules: {
        phone: [
          {required: true, trigger: 'blur', message: '请输入手机号码'},
          {validator: checkPhone, trigger: 'blur', message: '请输入正确的手机号码'}
        ],
        suggestionContact: [
          {required: true, trigger: 'blur', message: '请输入建议信息'}
        ],
        suggestionSelect: [
          {required: true, trigger: 'change', message: '请选择反馈类型'}
        ]
      },
      loading: false,
      dialogImageUrl: '',
      dialogVisible: false
    }
  },
  methods: {
    // 检查数量超出文件限制
    checkLimit (files, fileList) {
      this.$message.warning(`图片不能超过3个`)
    },
    beforeUpload (file) {
      if (file === null || file === 'undefined') {
        this.$message.error('请选择文件进行上传')
      }
    },
    handleRemove (file, fileList) {
      console.log(file, fileList)
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleError () {
      this.$message.error('服务器异常，请稍后再试！')
    },
    handleSuccess (res) {
      if (res.code === 1) {
        if (this.form.uuid === '') {
          this.form.uuid = res.data
        } else {
          this.form.uuid = this.form.uuid + ',' + res.data
        }
      } else {
        this.$message.error(res.message)
      }
    },
    onSubmit () {
      this.$refs.dataform.validate((valid) => {
        if (valid) {
          this.loading = true
          httpPost(suggestionAdd, this.form).then(res => {
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
  }
}
</script>

<style lang="scss" scoped>
.line{
  text-align: center;
}
.text{
    color: grey;
}
#uploadImgs .el-upload-list__item-delete{
  display: none !important;
}
</style>

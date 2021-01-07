<template>
  <div class="upload-container">
    <el-upload id="upload" class="image-uploader"
      ref="UPLOAD"
      drag
      :name="name"
      :headers="headers"
      :data="fileData"
      :limit="limit"
      :multiple="multiple"
      :action="action"
      :on-exceed = "checkLimit"
      :accept = "accept"
      :auto-upload="false"
      :on-success = "uploadSuccss"
      :on-error ="uploadError"
      :before-upload="beforeUpload"
      >
      <i class="el-icon-upload"></i>
      <!-- 将文件拖到此处，或 -->
      <div class="el-upload__text"><em>点击上传</em></div>
    </el-upload>
  </div>
</template>

<script>
import { getToken } from '@/utils/cookie.js'

export default {
  name: 'uploadfile',
  props: {
    value: String,
    name: String,
    limit: {
      default: 1,
      type: Number
    },
    multiple: {
      type: Boolean,
      default: false
    },
    accept: {
      type: String,
      default: '*'
    },
    fileData: Object,
    action: {
      type: String,
      required: true
    }
  },
  computed: {
    imageUrl () {
      return this.value
    },
    headers () {
      return {
        'AdminToken': getToken(),
        'departmentId': this.$store.getters.departmentId
      }
    }
  },
  methods: {
    // 检查数量超出文件限制
    checkLimit (files, fileList) {
      this.$message.warning(`文件不能超过${this.limit}个`)
    },
    // 上传成功
    uploadSuccss (res) {
      if (res.code === 1) {
        this.$emit('hideUploadVisible', false)
        this.$message.success(res.message)
      } else {
        this.$message.error(res.message)
      }
    },
    uploadError (err) {
      this.$message.error(JSON.parse(err.message))
    },
    beforeUpload (file) {
      if (file === null || file === undefined) {
        this.$message.error('请选择文件进行上传')
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";
.upload-container {
  width: 100%;
  position: relative;
  @include clearfix;
  .image-uploader {
    width: 80%;
    float: left;
  }
}

</style>

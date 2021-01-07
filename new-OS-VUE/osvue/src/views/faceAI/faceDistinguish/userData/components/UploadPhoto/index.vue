<template>
  <div class="upload-container">
    <el-upload
      ref="uploadPhoto"
      class="avatar-uploader"
      :action="action"
      :data="fileData"
      :headers="headers"
      :limit="limit"
      :on-exceed = "checkLimit"
      :show-file-list="false"
      :on-success="handleAvatarSuccess"
      :on-error ="uploadError"
      :before-upload="beforeAvatarUpload">
      <img v-if="imageUrl" :src="imageUrl" class="avatar">
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>
  </div>
</template>

<script>
import { getToken } from '@/utils/cookie.js'
import ImageCompressor from 'image-compressor.js'
import { checkAIMemberPhoto } from '@/api/url'
import { httpPost } from '@/utils/restful'
export default {
  name: 'uploadphoto',
  props: {
    photoType: String,
    value: String,
    name: String,
    limit: {
      default: 1,
      type: Number
    },
    fileData: Object,
    imgValue: String,
    action: {
      required: true
    }
  },
  watch: {
    imgValue: {
      handler (curVal, oldVal) {
        if (curVal !== '') {
          this.imageUrl = curVal
        } else {
          this.imageUrl = ''
        }
      },
      immediate: true
    }
  },
  created () {
    // if (this.imgValue) {
    //   this.imageUrl = this.imgValue
    // }
  },
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
      imageUrl: ''
    }
  },
  methods: {
    uploadError () {
      this.$message.error('上传失败！')
    },
    // 检查数量超出文件限制
    checkLimit (files, fileList) {
      this.$message.warning(`文件不能超过${this.limit}个`)
    },
    handleAvatarSuccess (res, file) {
      if (res.code === 1) {
        let photoType = res.data.photoName.substring(res.data.photoName.lastIndexOf('.'))
        this.$emit('update:foo', photoType)
        this.imageUrl = URL.createObjectURL(file.raw)
        this.$emit('photoNumber', res.data)
        this.$message.success(res.message)
        this.$refs['uploadPhoto'].clearFiles()
      } else {
        this.$refs['uploadPhoto'].clearFiles()
        this.$message.error(res.message)
      }
    },
    beforeAvatarUpload (file) {
      let self = this
      const photo = this.fileData.photo
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/jpg'
      const isLt10M = file.size / 1024 / 1024 < 10 && file.size / 1024 / 1024 > 0.5
      const isLT20M = file.size / 1024 / 1024 > 5
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG/JPEG 格式!')
      }
      if (isLT20M) this.$message.error('图片不能超过5M!')
      if (isLt10M) {
        // eslint-disable-next-line
        new ImageCompressor(file, {
          quality: 0.1,
          success (result) {
            const formData = new FormData()
            formData.append('photo', photo)
            formData.append('file', result, result.name)
            httpPost(checkAIMemberPhoto, formData).then(res => {
              self.imageUrl = URL.createObjectURL(file)
              self.$refs.uploadPhoto.clearFiles()
              self.$emit('photoNumber', res.data)
              self.$message.success(res.message)
            }).catch(() => {})
          },
          error () {
            self.$message.success('图片压缩失败，请重新上传')
          }
        })
      }
      return isJPG && !isLt10M && !isLT20M
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.avatar-uploader .el-upload {
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  // height: 178px;
  display: block;
}
</style>

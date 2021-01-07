<template>
  <div class="uploadImg">
    <!-- 上传图片 -->
    <van-row gutter="160" class="uploadFile flex-center">
      <van-col class="flex-center txt" span="12">{{ uploadTitle }}</van-col>
      <van-col class="flex-left" span="12">
        <van-uploader
          :multiple="false"
          :max-count="1"
          v-model="upFileImg"
          :deletable = 'isDeletable'
          image-fit="contain"
          :upload-icon="uploadingIcon || ''"
          :use-before-read="true"
          :before-read="beforeUploadRead"
          :disabled="uploadDidabled"
          :before-delete="isDeleteImg"
        >
        </van-uploader>
      </van-col>
    </van-row>
  </div>
</template>
<script>
import lrz from 'lrz'
// import { Uploader } from 'vant';
import { getPicUrl } from '@/utils/formatter'
import { checkAIMemberPhoto, noCheckAIMemberPhoto } from '@/api/url'
import uploadIcon from '@/assets/timg.jpg'
export default {
  name: 'UploadImg',
  props: {
    isDeletable: {
      type: Boolean,
      default: true
    },
    check: {
      type: String,
      default: '1'
    },
    userFaceUploadImg: {
      type: Array,
      default () {
        return []
      }
    },
    status: {
      type: Boolean,
      default: false
    },
    uploadDidabled: {
      type: Boolean,
      default: false
    },
    uploadTitle: {
      type: String,
      default: '上传人脸图片'
    },
    uploadingIcon: {
      type: String,
      default: uploadIcon
    },
    quality: {
      type: Number,
      default: 0.85
    }
  },
  data () {
    return {
      upFileImg: [],
      uploadForm: {
        photo: '',
        feature: ''
      }
    }
  },
  created () {},
  methods: {
    /** ********  【 上传前检测图片 】  **********/
    beforeUploadRead (file) {
      let photoType = file.name.substring(file.name.lastIndexOf('.'))
      this.$emit('update:foo', photoType)
      let yzcdnObj = {
        status: 'uploading',
        message: '上传中...',
        url: '',
        isImage: true
      }

      this.upFileImg = [yzcdnObj]
      // console.log('上传前数据监测', file)
      // let w = document.getElementsByTagName('img')[0].naturalWidth
      // let h = document.getElementsByTagName('img')[0].naturalHeight
      // console.log('像素宽', w)
      // console.log('像素高', h)

      let firstMax = file.size / 1024 / 1024 > 0.61
      let min = file.size / 1024 / 1024 > 0.022
      console.log(file.size / 1024 / 1024, firstMax)

      // let max = (file.size / 1024 / 1024) < 0.4
      // let isLt5M = (min && max)
      if (file) {
        let isJPG = file.type === 'image/jpeg' || file.type === 'image/jpg'
        if (!isJPG) {
          this.$toast({
            type: 'fail',
            message: '请选择JPG图片',
            duration: '3000',
            position: 'bottom'
          })
          this.upFileImg = []
        } else if (firstMax) {
          // 图片是否需要压缩 > 6100kb
          this.restrictImgSize(file)
        } else if (!min) {
          this.$toast({
            type: 'fail',
            message: '客官你的图片太小，请选择2kb以上！',
            duration: '3000',
            position: 'bottom'
          })
          this.upFileImg = []
        } else {
          // 图片大小合格
          this.restrictImgSize(file)
        }
      }
    },
    /** ********  【 压缩图片大小 】  **********/
    async restrictImgSize (file) {
      let _this = this
      // 20480 409600
      // eslint-disable-next-line
      
      //         width:600,//设置压缩后的最大宽
      // eslint-disable-next-line
      //             height:180, quality:0.6图片压缩质量取值 0 - 1，默认为0.7
      //       摘自  爱jQuery：http://www.aijquery.cn/Html/jquerychajian/194.html

      await lrz(file, {
        quality: _this.quality,
        width: 800,
        height: 800
      }).then(res => {
        return _this.successUploadImg(res.file, res.origin.name)
      })
    },
    // 设置图片名
    getFileName (fileName, length = 10) {
      return (
        Number(
          Math.random()
            .toString()
            .substr(3, length) + Date.now()
        ).toString(36) +
        '.' +
        fileName.split('.').pop()
      )
    },
    // 图片上传
    successUploadImg (fileData, fileName) {
      // let fileName = fileData.name
      let formData = new FormData()
      formData.append('file', fileData, this.getFileName(fileName))
      formData.append('photo', this.uploadForm.photo)
      const config = {
        baseURL: process.env.API_HOST
      }

      /** ********  【 验证图是否合格 】  **********/
      if (this.check === '1') {
        this.$http
          .post(checkAIMemberPhoto, formData, config)
          .then(res => {
          // console.log('验证图片成功：', res)
            this.uploadForm = Object.assign({}, this.uploadForm, res.data)
            let getImg = { url: getPicUrl(fileData), isImage: true }
            this.upFileImg = [getImg]

            /** ********  【 向外部暴露事件 】  **********/
            this.$emit('uploadFileImg', this.uploadForm)
            this.$emit('update:disable', true)
          // this.$toast.success('照片验证成功！')
          })
          .catch(err => {
            console.log('验证图片出错： ', err)
            this.upFileImg = []

          // 测试===========================
          // let getImg = { url: getPicUrl(fileData), isImage: true }
          // this.upFileImg = [getImg]
          // END=====================================
          // this.$toast.fail(err)
          })
      } else {
        this.$http
          .post(noCheckAIMemberPhoto, formData, config)
          .then(res => {
          // console.log('验证图片成功：', res)
            this.uploadForm = Object.assign({}, this.uploadForm, res.data)
            let getImg = { url: getPicUrl(fileData), isImage: true }
            this.upFileImg = [getImg]
            /** ********  【 向外部暴露事件 】  **********/
            this.$emit('uploadFileImg', this.uploadForm)
            this.$emit('update:disable', true)
          // this.$toast.success('照片验证成功！')
          })
          .catch(err => {
            console.log('验证图片出错： ', err)
            this.upFileImg = []

          // 测试===========================
          // let getImg = { url: getPicUrl(fileData), isImage: true }
          // this.upFileImg = [getImg]
          // END=====================================
          // this.$toast.fail(err)
          })
      }
    },
    //  客户删除照片
    isDeleteImg () {
      this.$dialog
        .confirm({
          title: '删除照片',
          message: '是否删除已经检测ok的照片！'
        })
        .then(() => {
          this.$emit('update:disable', false)
          this.upFileImg = []
        })
        .catch(() => {
          return false
        })
    }
  },
  watch: {
    // 监听状态 初始化
    status (state) {
      // console.log('监听是否清楚img', state)
      if (state) {
        this.upFileImg = []
        this.uploadForm = {
          photo: '',
          feature: ''
        }
      }
    },
    // 检测是否有传值，没有则使用自己的
    userFaceUploadImg (data) {
      if (
        data !== [] &&
        Object.prototype.toString.call(data) === '[object Array]'
      ) {
        this.upFileImg = data
      } else {
        this.$toast.fail('获取照片格式错误！')
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.uploadImg >>> {
  .van-row {
    border-bottom: 1px solid #dddd;
    box-sizing: border-box;
  }
  .uploadFile {
    height: 2rem;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-items: center;
    .txt {
      font-size: 0.35rem;
    }
  }
  .van-uploader {
    width: 100%;
    overflow: hidden;
  }
  .van-uploader__wrapper {
    white-space: nowrap;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-wrap: nowrap;
    height: 2rem;
    width: auto;
    overflow: auto;
    height: 2.5rem;
    width: auto;
    overflow: auto;
  }

  .van-image.van-uploader__preview-image {
    width: 1.5rem;
    height: 1.5rem;
    margin: 0;
  }
  .van-uploader__preview {
    margin: 0;
    margin-right: 0.2rem;
    display: inline-block;
  }
  .van-uploader__upload {
    width: 1.5rem;
    height: 1.5rem;
    margin: 0;
    margin-left: 0.5rem;
  }
  .van-uploader__upload-icon {
    width: 100%;
    height: 100%;
    display: block;
    border-radius: 10px;
    overflow: hidden;
    img {
      width: 100%;
      height: 100%;
      display: block;
      border-radius: 10px;
      overflow: hidden;
    }
  }
}

</style>

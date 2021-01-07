<template>
  <div class="page">
    <van-cell title="" value="" :border="false" label="注意：请勿在逆光下拍照,需将头部摆正、请勿上传模糊的或过度美颜修图的照片，且无遮挡" label-class="fc-red"/>
    <div class="text-c">
      <van-uploader :after-read="onRead" style="line-height:2.5rem;margin-top:0.5rem" accept="image/*" multiple>
          <img ref="imgf"
          id="img"
          style="width:100px;height:100px;border-radius:50%" src="@/assets/timg.jpg"/>
      </van-uploader>
    </div>
    <span style="color:red;margin-left:0.35rem">请先拍照或选图</span>
    <van-field
      v-model="form.userName"
      required
      clearable
      label="真实姓名"
      @blur="checkName"
      placeholder="请输入真实姓名"
      :error-message="validator.name"
    />
    <van-field
      v-model="form.phone"
      required
      clearable
      label="手机号"
      placeholder="请输入手机号"
      @blur="checkPhone"
      :error-message="validator.phone"
      type="number"
    />
    <van-cell required title="部门" is-link :value="depaVal" @click="showPicker = true" />
    <div class="btnbox">
        <van-button type="info" block class="btn" @click="saveUser" :loading="loading">完成</van-button>
    </div>
    <van-popup v-model="showPicker" position="bottom" safe-area-inset-bottom>
      <van-picker
        show-toolbar
        :columns="columns"
        value-key="leader"
        @cancel="showPicker = false"
        @confirm="onConfirm"
      />
    </van-popup>
    <van-dialog
      v-model="show"
      width="90%"
      message-align='center'
      confirm-button-text='重新上传'
      :close-on-click-overlay="true"
      title="校验失败，可能有以下的原因："
    >
    <div style="margin-left:1.25rem">
      <h4 style="line-height:1rem">1、图片中人脸位置过偏，未正视镜头</h4>
      <h4 style="line-height:1rem">2、图片模糊</h4>
      <h4 style="line-height:1rem">3、光照不符合（强光、逆光、暗光)</h4>
      <h4 style="line-height:1rem">4、人脸有遮挡</h4>
      <h4 style="line-height:1rem">5、图片人脸过多</h4>
      <h4 style="line-height:1rem">6、过度美颜或化妆</h4>
      <h4 style="line-height:1rem">7、表情搞怪</h4>
      <h4 style="line-height:1rem">8、人脸太大或太小（控制好拍照距离）</h4>
    </div>
    </van-dialog>
  </div>
</template>

<script>
// import { setToken } from '@/utils/cookie'
import { Uploader, Picker, Dialog } from 'vant'
import { applyAdd, checkAIMemberPhoto, getAllDepartment } from '@/api/url'
import lrz from 'lrz'
import EXIF from 'exif-js'

export default {
  name: 'addFace',
  data () {
    return {
      AdminToken: '',
      imgUrl: undefined,
      show: false,
      validator: {
        name: '',
        addr: '',
        phone: '',
        depName: '',
        companyName: ''
      },
      form: {
        companyId: this.$route.query.departmentId, // 分享页带过来的
        workCheckGroupId: this.$route.query.workCheckGroupId, // 考勤组id
        userName: '',
        phone: '',
        photo: '',
        type: '0',
        dutyCompanyId: undefined
      },
      imgName: '',
      loading: false,
      depaVal: '',
      showPicker: false,
      columns: []
    }
  },
  components: {
    'van-uploader': Uploader,
    [Picker.name]: Picker,
    [Dialog.name]: Dialog
  },
  created () {
    // 此处判断为当用户从未添加考勤组组时，给当前页面发起的请求添加AdminToken请求头
    // 避免没有token导致提示重新登录
    if (this.$route.query.tk) {
      this.$http.defaults.headers.common['AdminToken'] = this.$route.query.tk
    }
    // this.AdminToken = this.$route.query.tk
    this.fetchDepaData()
    /*
      首先要拿到分享页带过来的两个参数
      以后做表单提交时的必填字段
      （公司id ）
    */
  },
  methods: {
    getFileName (fileName, length = 10) {
      return Number(Math.random().toString().substr(3, length) + Date.now()).toString(36) + '.' + fileName.split('.').pop()
    },
    onRead (res) {
      console.log(res)
      let file = res.file
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/jpg'
      const isLt10M = file.size / 1024 / 1024 < 10 && file.size / 1024 / 1024 > 0.5
      const isLT20M = file.size / 1024 / 1024 > 5
      if (!isJPG) {
        this.$toast.fail('上传头像图片只能是JPG/JPEG格式')
      }
      if (isLT20M) this.$toast.fail('图片不能超过5M')
      if (isLt10M) {
        // eslint-disable-next-line
        lrz(file, { quality: 0.2, width: 1000 })
          .then(result => {
            const formData = new window.FormData()
            formData.append('photo', this.form.photo)
            formData.append('file', result.file, this.getFileName(result.origin.name))
            const config = {
              baseURL: process.env.API_HOST,
              AdminToken: this.AdminToken
            }
            const ToastLoading = this.$toast.loading({ message: '加载中...', position: 'middle', duration: 0 })
            this.$http.post(checkAIMemberPhoto, formData, config).then(res => {
              ToastLoading.clear()
              // if (!res.data.photo) {
              //   this.$toast.fail('图片上传失败\n请重新上传')
              //   return
              // }
              this.form.photo = res.data
              this.form = Object.assign(this.form, res.data)
              // self.$refs.uploadPhoto.clearFiles()
              this.imgName = file.name
              this.imgUrl = this.getPicUrl(file)
              // this.$refs.imgf.src = this.imgUrl
              this.changeFile(file)
              this.$toast.success('图片校验成功')
            }).catch(() => {
              ToastLoading.clear()
              // this.$toast.fail('图片检验失败\n请重新上传')
              this.show = true
            })
          })
      } else {
        let formData = new window.FormData()
        formData.append('file', file, this.getFileName(file.name))
        formData.append('photo', this.form.photo)
        const config = {
          baseURL: process.env.API_HOST,
          AdminToken: this.AdminToken
        }
        const ToastLoading = this.$toast.loading({ message: '加载中...', position: 'middle', duration: 0 })
        this.$http.post(checkAIMemberPhoto, formData, config)
          .then(res => {
            ToastLoading.clear()
            // if (!res.data.photo) {
            //   this.$toast.fail('图片上传失败\n请重新上传')
            //   return
            // }
            console.log(res)
            this.form.photo = res.data
            this.form = Object.assign(this.form, res.data)
            this.imgName = file.name
            this.imgUrl = this.getPicUrl(file)
            // this.$refs.imgf.src = this.imgUrl
            this.changeFile(file)
            this.$toast.success('图片校检成功')
          }).catch(() => {
            ToastLoading.clear()
            // this.$toast.fail('图片校检失败\n请重新上传')
            this.show = true
          })
      }
    },
    // 解决h5调用相机，某些手机端拍照，会有图片旋转的情况
    changeFile (file) {
      var render = new FileReader()
      var image = new Image()
      var Orientation = null
      EXIF.getData(file, function () {
        Orientation = EXIF.getTag(this, 'Orientation')
      })
      render.onload = function (ev) {
        image.src = ev.target.result
        image.onload = function () {
          var imgWidth = this.width
          var imgHeight = this.height
          // 控制上传图片的宽高
          if (imgWidth > imgHeight && imgWidth > 750) {
            imgWidth = 750
            imgHeight = Math.ceil(750 * this.height / this.width)
          } else if (imgWidth < imgHeight && imgHeight > 1334) {
            imgWidth = Math.ceil(1334 * this.width / this.height)
            imgHeight = 1334
          }
          var canvas = document.createElement('canvas')
          var ctx = canvas.getContext('2d')
          canvas.width = imgWidth
          canvas.height = imgHeight
          if (Orientation && Orientation !== 1) {
            switch (Orientation) {
              case 6: // 旋转90度
                canvas.width = imgHeight
                canvas.height = imgWidth
                ctx.rotate(Math.PI / 2)
                // (0,-imgHeight) 从旋转原理图那里获得的起始点
                ctx.drawImage(this, 0, -imgHeight, imgWidth, imgHeight)
                break
              case 3: // 180
                canvas.width = imgWidth
                canvas.height = imgHeight
                ctx.rotate(Math.PI)
                ctx.drawImage(this, -imgWidth, -imgHeight, imgWidth, imgHeight)
                break
              case 8: // -90
                canvas.width = imgHeight
                canvas.height = imgWidth
                ctx.rotate(-Math.PI / 2)
                ctx.drawImage(this, -imgWidth, 0, imgWidth, imgHeight)
                break
            }
          } else {
            ctx.drawImage(this, 0, 0, imgWidth, imgHeight)
          }
          document.getElementById('img').src = canvas.toDataURL('image/jpeg,image/jpg,image/png', 0.8)
        }
      }
      render.readAsDataURL(file)
    },
    getPicUrl (file) {
      let url = null
      if (window.createObjectURL !== undefined) {
        url = window.createObjectURL(file)
      } else if (window.URL !== undefined) {
        url = window.URL.createObjectURL(file)
      } else if (window.webkitURL !== undefined) {
        // webkit or chrome
        url = window.webkitURL.createObjectURL(file)
      }
      return url
    },
    checkName () {
      if (this.form.userName === '') {
        this.validator.name = '姓名不可为空'
      } else {
        this.validator.name = ''
      }
      setTimeout(function () {
        document.body.scrollTop = 0
      }, 100)
    },
    checkPhone () {
      if (!(/^1[123456789]\d{9}$/.test(this.form.phone))) {
        this.validator.phone = '请输入正确的手机号'
      } else {
        this.validator.phone = ''
      }
      setTimeout(function () {
        document.body.scrollTop = 0
      }, 100)
    },
    saveUser () {
      if (this.form.wiegandCard !== '' && this.form.userName !== '' && this.form.phone !== '') {
        if (this.form.type === '1') {
          this.form.beginTime = (this.form.beginTime + '.000Z').replace(' ', 'T')
          this.form.endTime = (this.form.endTime + '.000Z').replace(' ', 'T')
        }
        const config = {
          baseURL: process.env.API_HOST + 'pb/at',
          AdminToken: this.AdminToken
        }
        // appid openid 都是需要获取的
        this.loading = true
        this.$http.post(applyAdd, this.form, config)
          .then(res => {
            // console.log(res)
            this.loading = false
            this.$toast.success('添加成功')
            this.$router.push('/addedSuccess/')
          }).catch(() => {
            this.loading = false
          })
      } else {
        if (!this.form.dutyCompanyId) {
          this.$toast('请补充完用户信息')
        }
      }
    },
    fetchDepaData () {
      const listQuery = {
        offset: 1,
        limit: 1000,
        departmentId: this.$route.query.departmentId
      }
      const config = {
        baseURL: process.env.API_HOST + 'pb/at',
        params: listQuery,
        AdminToken: this.AdminToken
      }
      this.$http.get(getAllDepartment, config).then(res => {
        if (res.data && res.data.rows) {
          this.columns = Object.freeze(res.data.rows)
        }
      }).catch(() => {

      })
    },
    onConfirm (value, index) {
      this.form.dutyCompanyId = value.id
      this.depaVal = value.leader
      this.showPicker = false
    }
  }
}
</script>

<style lang="scss" scoped>
.page /deep/ .van-field__control:disabled {
  color:#000;
}
.uploaderbox {
  position: relative;
}
.uploaderimg {
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
}
.btnbox {
    padding: 20px 10px;
    .btn {
        border-radius: 5px;
        overflow: hidden;
    }
}
</style>

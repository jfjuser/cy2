<template>
  <div class="con-app">
    <NavBar
      title="添加用户"
      left-text="返回"
      left-arrow
      @click-left="onClickLeft"
    />
      <Cell
        title=""
        value=""
        :border="false"
        label-class="fc-red"
        label="注意：请勿在逆光下拍照,需将头部摆正、请勿上传模糊的或过度美颜修图的照片，且无遮挡"
      />
      <!-- ?imageMogr2/auto-orient -->
      <div style="text-align:center">
        <van-uploader
          :after-read="onRead"
          style="line-height:2.5rem;margin-top:0.5rem"
          accept="image/*"
          multiple
        >
          <img
            ref="imgf"
            id="img"
            style="width:100px;height:100px;border-radius:50%"
            src="@/assets/timg.jpg"
          />
        </van-uploader>
      </div>
      <div class="photoCheck">              <van-radio-group v-model="ifCheck" direction="horizontal" :disabled="ifDisabled">
  <van-radio name="1" icon-size="14px">不跳过验证</van-radio>
  <van-radio name="2" icon-size="14px">跳过验证</van-radio>
</van-radio-group>
      <span style="color:red;margin-left:0.5rem;font-size:.75rem"
        >请先选择是否验证再上传图片</span
      ></div>
    <Form @keyup.enter="saveUser" @submit.native.prevent="saveUser">
      <Field
        v-model="form.phone"
        required
        clearable
        label="手机号"
        placeholder="请输入手机号"
        @blur="checkPhone"
        maxLength="11"
        :error-message="validator.phone"
      />
      <Field
        v-model="form.companyName"
        required
        clearable
        @input="changeOne"
        label="公司"
        @blur="checkCompany"
        placeholder="请输入名称"
        :error-message="validator.companyName"
      />
      <div v-show="isVisa">
        <Cell-group>
          <Cell
            style="padding-left:6.5rem;color:#fff;background-color:#87CEFA"
            @click="queFn(item)"
            v-for="(item, index) in companyData"
            :key="index"
            :title="item.value"
          ></Cell>
        </Cell-group>
      </div>
      <Field
        v-model="form.depName"
        required
        disabled='true'
        label="部门"
        @click="focusThis"
        @blur="checkDey"
        placeholder="请选择"
        :error-message="validator.depName"
      />
      <Popup v-model="isShow" position="bottom">
        <RadioGroup v-model="cellId">
          <CellGroup>
            <Cell
              v-for="(item, index) in listDep"
              :key="index"
              :title="item.departmentName"
              clickable
              @click="clickCell(item, index)"
            >
              <Radio slot="right-icon" :name="index" />
            </Cell>
          </CellGroup>
        </RadioGroup>
      </Popup>
      <Field
        v-model="form.userName"
        required
        clearable
        label="真实姓名"
        @blur="checkName"
        placeholder="请输入真实姓名"
        :error-message="validator.name"
      />
      <Field
        v-model="form.wiegandCard"
        clearable
        label="ID编号"
        placeholder="请输入ID号"
      />
      <van-dialog
        v-model="show"
        width="90%"
        :close-on-click-overlay="true"
        message-align="center"
        confirm-button-text="重新上传"
        title="校验失败，可能有以下的原因："
      >
        <div style="margin-left:1.25rem">
          <h4>1、图片中人脸位置过偏，未正视镜头</h4>
          <h4>2、图片模糊</h4>
          <h4>3、光照不符合（强光、逆光、暗光)</h4>
          <h4>4、人脸有遮挡</h4>
          <h4>5、图片人脸过多</h4>
          <h4>6、过度美颜或化妆</h4>
          <h4>7、表情搞怪</h4>
          <h4>8、人脸太大或太小（拍摄距离）</h4>
        </div>
      </van-dialog>

      <Button
        type="info"
        style="width:70vw;margin:15vw;border-radius:8px"
        native-type="submit"
        >保存</Button
      >
    </Form>
  </div>
</template>

<script>
import {
  Form,
  Field,
  Toast,
  Cell,
  CellGroup,
  Icon,
  RadioGroup,
  Radio,
  Button,
  NavBar,
  DatetimePicker,
  Popup,
  Picker,
  Uploader,
  Dialog
} from 'vant'
import { httpPost, httpGet } from '@/utils/restful'
import {
  returnDep,
  watchCompany,
  AIMember,
  noCheckAIMemberPhoto,
  checkAIMemberPhoto,
  checkIsAddAIMember
} from '@/api/url'
import { timeFormatter } from '@/utils/formatter'
import lrz from 'lrz'
import EXIF from 'exif-js'
import { mapGetters, mapActions } from 'vuex' // 引入vuex辅助函数
// import Vconsole from 'vconsole'
export default {
  name: 'addFace',
  data () {
    return {
      ifDisabled: false, // 单选是否校验是否禁用
      ifCheck: '2', // 是否跳过校验
      isVisa: false,
      imgUrl: undefined,
      cellId: undefined,
      isShow: false,
      show: false,
      currentDate: new Date(),
      isStart: false,
      isEnd: false,
      themeType: undefined,
      timeFormatter: timeFormatter,
      typeList: [],
      memberId: undefined,
      validator: {
        name: '',
        addr: '',
        phone: '',
        depName: '',
        companyName: ''
      },
      openType: undefined,
      companyData: [],
      listDep: [], // 返回的部门集合
      imgFile: {},
      form: {
        userName: '',
        companyName: '',
        phone: '',
        photo: '',
        addr: '',
        dutyCompanyId: '',
        depName: '',
        type: '0',
        beginTime: '',
        endTime: '',
        remarks: '',
        wiegandCard: '',
        companyId: ''
      },
      imgName: ''
    }
  },
  components: {
    Form,
    Field,
    RadioGroup,
    Radio,
    Icon,
    Button,
    NavBar,
    Cell,
    DatetimePicker,
    Picker,
    Popup,
    CellGroup,
    'van-uploader': Uploader,
    [Dialog.name]: Dialog
  },
  created () {
    // var vConsole = new Vconsole()
    // console.log(vConsole)
  },
  computed: {
    ...mapGetters('user', ['userId', 'userInfo', 'active', 'wxInfo'])
  },
  methods: {
    ...mapActions('user', [
      'SaveUserId',
      'SaveUserInfo',
      'SaveActive',
      'SaveLoginState'
    ]),
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
    changeOne () {
      if (this.form.companyName !== '') {
        httpGet(watchCompany, {
          companyName: this.form.companyName
        })
          .then(res => {
            this.isVisa = true
            this.companyData = res.data
          })
          .catch(() => {})
      }
    },
    queFn (item) {
      this.form.companyName = item.value
      this.isVisa = false
    },
    clickCell (item, index) {
      this.form.depName = item.departmentName
      this.form.dutyCompanyId = item.departmentId
      this.cellId = index
      this.isShow = false
    },
    onClickLeft () {
      this.$router.replace({
        name: 'addInfo'
      })
    },
    focusThis () {
      this.isShow = true
      httpGet(returnDep + '/' + this.form.companyName)
        .then(res => {
          if (res.data === null) {
            this.$notify('该公司下暂时没有建立部门类别')
          } else {
            this.listDep = res.data.departmentInfoList
            this.form.companyId = res.data.companyId
          }
        })
        .catch(() => {})
    },
    getValue (value) {
      this.form.beginTime = timeFormatter(value)
      this.isStart = false
    },
    getEndValue (value) {
      this.form.endTime = timeFormatter(value)
      this.isEnd = false
    },
    onRead (res) {
      let file = res.file
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/jpg'
      const isLt10M =
        file.size / 1024 / 1024 < 10 && file.size / 1024 / 1024 > 0.5
      const isLT20M = file.size / 1024 / 1024 > 5
      console.log('1')
      console.log(res)
      console.log('1')
      if (!isJPG) {
        Toast.fail('上传头像图片只能是 JPG/JPEG 格式!')
      }
      if (isLT20M) Toast.fail('图片不能超过5M!')
      if (isLt10M) {
        // eslint-disable-next-line
        lrz(file, { quality: 0.2, width: 1000 }).then(result => {
          console.log('this.form', this.form)
          const formData = new window.FormData()
          formData.append('photo', this.form.photo)
          formData.append(
            'file',
            result.file,
            this.getFileName(result.origin.name)
          )
          // 不跳过校验
          if (this.ifCheck === '1') {
            httpPost(checkAIMemberPhoto, formData)
              .then(res => {
                // this.form.photo = res.data
                this.form = Object.assign(this.form, res.data)
                // self.$refs.uploadPhoto.clearFiles()
                this.imgName = file.name
                this.imgUrl = this.getPicUrl(file)
                // this.$refs.imgf.src = this.imgUrl
                // this.imageHandle(file)
                this.changeFile(file)
                Toast.success('图片校验成功')
                this.ifDisabled = true // 图片上传完成后禁用单选框
              })
              .catch(() => {
                // Toast.fail('图片检验失败，请重新上传')
                this.show = true
              })
          } else {
            httpPost(noCheckAIMemberPhoto, formData)
              .then(res => {
                // this.form.photo = res.data
                this.form = Object.assign(this.form, res.data)
                // self.$refs.uploadPhoto.clearFiles()
                this.imgName = file.name
                this.imgUrl = this.getPicUrl(file)
                // this.$refs.imgf.src = this.imgUrl
                // this.imageHandle(file)
                this.changeFile(file)
                Toast.success('图片校验成功')
                this.ifDisabled = true // 图片上传完成后禁用单选框
              })
              .catch(() => {
                // Toast.fail('图片检验失败，请重新上传')
                this.show = true
              })
          }
        })
      } else {
        let formData = new window.FormData()
        formData.append('file', file, this.getFileName(file.name))
        formData.append('photo', this.form.photo)
        // console.log('222222222222222222', this.form)
        // console.log('2222222222', checkAIMemberPhoto)
        httpPost(checkAIMemberPhoto, formData)
          .then(res => {
            // console.log('222222222222222222', res)
            // this.form.photo = res.data
            this.form = Object.assign(this.form, res.data)
            this.imgName = file.name
            this.imgUrl = this.getPicUrl(file)
            // this.$refs.imgf.src = this.imgUrl // + '?x-oss-process=image/resize,w_100/auto-orient,1'
            // this.imageHandle(file)
            this.changeFile(file)
            Toast.success('图片校检成功')
          })
          .catch(() => {
            // Toast.fail('图片校检失败，请重新上传！')
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
            imgHeight = Math.ceil((750 * this.height) / this.width)
          } else if (imgWidth < imgHeight && imgHeight > 1334) {
            imgWidth = Math.ceil((1334 * this.width) / this.height)
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
          document.getElementById('img').src = canvas.toDataURL(
            'image/jpeg,image/jpg,image/png',
            0.8
          )
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
    checkDey () {
      if (this.form.depName === '') {
        this.validator.depName = '名称不可为空'
      } else {
        this.validator.depName = ''
      }
    },
    checkCompany () {
      if (this.form.companyName === undefined) {
        this.validator.companyName = '名称不可为空'
      } else {
        this.validator.companyName = ''
      }
      // 根据部门名称请求所属部门
    },
    checkName () {
      if (this.form.userName === '') {
        this.validator.name = '姓名不可为空'
      } else {
        this.validator.name = ''
      }
    },
    checkAddr () {
      if (this.form.addr === '') {
        this.validator.addr = '地址不可为空'
      } else {
        this.validator.addr = ''
      }
    },
    checkPhone () {
      if (this.form.phone === '') {
        this.validator.phone = '手机号码不可为空！'
        return false
      } else if (!/^[1][3-9][0-9]\d{8}$/.test(this.form.phone)) {
        this.validator.phone = '请输入正确的手机号格式！'
        return false
      } else {
        this.validator.phone = ''
        return true
      }
    },
    radioChange (value) {
      const data = {
        dutyCompanyId: this.memberId,
        type: value
      }
      this.$nextTick(() => {
        httpPost(checkIsAddAIMember, data)
          .then(res => {
            if (res.code > 1) {
              Toast.success(res.message)
            }
          })
          .catch(() => {})
      })
    },
    checkFormValid () {
      let { photo, phone, userName, companyName, depName } = this.form
      if (!photo) {
        this.$toast.fail('请上传照片！')
        return false
      } else if (!this.checkPhone()) {
        this.$toast.fail('手机号码格式不对！')
        return false
      } else if (photo && phone && userName && companyName && depName) {
        return true
      } else {
        this.$toast.fail('请完善信息！')
        return false
      }
    },
    // 保存按钮
    saveUser () {
      if (this.checkFormValid()) {
        if (this.form.type === '1') {
          this.form.beginTime = (this.form.beginTime + '.000Z').replace(
            ' ',
            'T'
          )
          this.form.endTime = (this.form.endTime + '.000Z').replace(' ', 'T')
        }
        const wxInfo = this.wxInfo || {}
        this.form = Object.assign(this.form, {
          appId: wxInfo.account,
          openId: wxInfo.unicode
        })
        const ToastLoading = this.$toast.loading({
          mask: true,
          message: '正在加载...',
          duraion: 0
        })
        httpPost(AIMember, this.form)
          .then(res => {
            // console.log('添加成功', res)6y7
            /** ********  【 新配置 】  **********/
            this.SaveUserId(res.data.userId) // 存储用户ID
            this.SaveUserInfo(this.form) // 存储用户info
            this.SaveLoginState(1) // 登录状态识别码
            ToastLoading.clear() // 关闭加载器
            if (res.data && res.data.isAdd === 1) {
              Toast.success('添加成功')
              this.SaveActive(1).then(() => {
                // 添加成功，进行下一步
                this.$router.replace({ name: 'addInfo' })
              })
            } else if (res.data && res.data.isAdd === 0) {
              this.$dialog
                .confirm({
                  title: '官方提示',
                  message: '你已加入过考勤组！可以直接跳过以下步骤！',
                  confirmButtonText: '确定',
                  showCancelButton: false
                })
                .then(() => {
                  this.SaveActive(3).then(() => {
                    // 当前账户已经加入过考勤组，执行跳过
                    this.$router.replace({ name: 'addInfo' })
                  })
                })
            }
          })
          .catch(err => {
            console.log(err)
            this.$notify({
              type: 'danger',
              message: err
            })
          })
      }
    },
    onConfirmRelation (value, index) {
      this.relationVal = value.relationshipName
      this.form.relationship = value.relationshipType
      this.showRelation = false
    }
  }
}
</script>
<style scoped>
.con-app >>> .van-field__control:disabled {
  color: #000;
}
</style>
<style lang="scss" scoped>
.fc-red {
  color: red;
}
.con-app {
  //  background: rgb(238,238,238);
  min-height: 100vh;
}
.info {
  width: 200px;
  min-height: 80px;
  border: 1px solid #ccc;
  margin-top: 30px;
  text-shadow: 4px 3px 1px #333;
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
.van-popup {
  height: 50vh;
}
.photoCheck{
  display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    font-size: 0.5rem;
}
</style>

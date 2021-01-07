<template>
  <div class="con-app">
    <NavBar
      title="添加用户"
      left-text="返回"
      left-arrow
      @click-left="onClickLeft"
    />
        <Field
          v-model="form.userName"
          required
          clearable
          label="姓名"
          @blur="checkName"
          placeholder="请输入姓名"
          :error-message="validator.name"
        />
        <Field
          required
          label="性别"
          disabled
          placeholder="请选择"
          :border="false"
        />
        <RadioGroup v-model="form.sex" @change="radioChange" style="border-bottom:1px solid #ebedf0;margin-left:1rem;">
          <Radio name="1" style="display:inline-block;margin-left:10%;line-height:40px">男</Radio>
          <Radio name="2" style="display:inline-block;margin-left:10%;line-height:40px">女</Radio>
        </RadioGroup>
        <Cell @click="showRelation = true">
          <template slot="title">
            <span>账户关系</span>
            <span style="margin-left:10%;">{{relationVal}}</span>
          </template>
        </Cell>
        <Field
          v-model="form.idCard"
          :label="themeType === 1 ? '校验码' : (themeType === 2? '工号' : (themeType === 3? '学号' : (themeType === 4? '校验码' : '身份证号')))"
          :disabled="themeType === 1 || themeType === 4 ? true: false"
        />
         <Field
          v-model="form.wiegandCard"
          v-if="openType === 1"
          required
          clearable
          label="韦根卡号"
          @blur="checkCard"
          placeholder="请输入韦根卡号"
          :error-message="validator.card"
        />
         <Field
          v-model="form.accessCardId"
          label="IC卡号"
          placeholder="请输入（非必填）"
        />
        <Field
          v-model="form.phone"
          required
          clearable
          label="手机号"
          placeholder="请输入手机号"
          @blur="checkPhone"
          :error-message="validator.phone"
        />
        <!-- <Field
          v-model="form.addr"
          required
          clearable
          :label='`${themeType === 1 ? "房号" : "住址"}`'
          @blur="checkAddr"
          :error-message="validator.addr"
          placeholder="请输入用户地址"
        /> -->
        <div v-show="themeType === 5">
          <Cell title="工种"/>
            <RadioGroup v-model="form.workName">
              <Radio v-for="(option, index) in typeList" style="line-height:2rem;display:inline-block;margin-left:4rem" :key=index :name="option.id">{{option.workName}}</Radio>
            </RadioGroup>
        </div>
        <!-- <div class="uploaderbox">
          <Field label="照片" required placeholder="请选择照片" readonly v-model="imgName"/>
          <Field label="照片" @change="fn" required type="file" accept="image/*" multiple class="uploaderimg"/>
        </div> -->
        <van-uploader :after-read="onRead" id="upload" style="width:100%" accept="image/*" multiple>
          <Field label="照片" required placeholder="请选择照片" readonly v-model="imgName"/>
        </van-uploader>
        <Cell :border="false">类型</Cell>
        <RadioGroup v-model="form.type" @change="radioChange" style="border-bottom:1px solid #ebedf0;margin-left:1rem;">
          <Radio name="0" style="display:inline-block;margin-left:20%;line-height:40px">非访客</Radio>
          <Radio name="1" style="display:inline-block;margin-left:10%;line-height:40px">访客</Radio>
        </RadioGroup>
        <Field
          v-show="form.type === '1'"
          v-model="form.beginTime"
          required
          clearable
          @focus="isStart = true"
          label="开始日期"
          placeholder="开始日期不可为空"
          readonly
        />
        <Popup v-model="isStart" position="bottom" :close-on-click-overlay="false">
          <DatetimePicker
            v-model="currentDate"
            @cancel="isStart = false"
            @confirm="getValue"
            type="datetime"
          />
        </Popup>
        <Field
          v-show="form.type === '1'"
          v-model="form.endTime"
          @focus="isEnd = true"
          required
          clearable
          label="结束日期"
          placeholder="结束日期不可为空"
          readonly
        />
        <Popup v-model="isEnd" position="bottom" :close-on-click-overlay="false">
          <DatetimePicker
            v-model="currentDate"
            @cancel="isEnd = false"
            @confirm="getEndValue"
            type="datetime"
          />
        </Popup>
        <Field
          v-model="form.remarks"
          clearable
          label="备注消息"
          placeholder="请输入备注消息"
        />
        <Button type="info" style="width:70vw;margin:15vw;border-radius:12px" @click="saveUser">保存</Button>
        <Popup v-model="showRelation" position="bottom" :close-on-click-overlay="false">
          <Picker
            :columns="relationshipSelect"
            show-toolbar
            value-key="relationshipName"
            @cancel="showRelation = false"
            @confirm="onConfirmRelation"
          />
        </Popup>
  </div>
</template>

<script>
import { Field, Toast, Cell, Icon, RadioGroup, Radio, Button, NavBar, DatetimePicker, Popup, Picker, Uploader } from 'vant'
import { httpGet, httpPost } from '@/utils/restful'
import { getUUid, addTypeUser, AIMember, checkAIMemberPhoto, checkIsAddAIMember } from '@/api/url'
import { timeFormatter } from '@/utils/formatter'
import lrz from 'lrz'
export default {
  name: 'addFace',
  data () {
    return {
      imgUrl: '',
      currentDate: new Date(),
      isStart: false,
      isEnd: false,
      themeType: undefined,
      timeFormatter: timeFormatter,
      typeList: [],
      memberId: undefined,
      validator: {
        card: '',
        name: '',
        addr: '',
        phone: ''
      },
      openType: undefined,
      imgFile: {},
      form: {
        userName: '',
        phone: undefined,
        accessCardId: undefined,
        sex: '1',
        photo: '',
        workName: '',
        idCard: undefined,
        addr: '',
        type: '0',
        wiegandCard: undefined,
        beginTime: undefined,
        endTime: undefined,
        remarks: undefined,
        relationship: ''
      },
      relationshipSelect: [
        {
          relationshipType: 0,
          relationshipName: '夫妻'
        }, {
          relationshipType: 1,
          relationshipName: '父子'
        }, {
          relationshipType: 2,
          relationshipName: '父女'
        }, {
          relationshipType: 3,
          relationshipName: '叔侄'
        }, {
          relationshipType: 4,
          relationshipName: '其他'
        }
      ],
      showRelation: false,
      relationVal: '请选择',
      imgName: ''
    }
  },
  mounted () {
    this.memberId = this.$route.params.rowId
    this.form.addr = this.$route.params.addrPar
    this.openType = this.$route.params.openType
    this.addrType = this.$route.params.addrType
    this.rowId = this.memberId
    console.log(this.addrType)
    // 检测用户设备 是否是在Android 9 || 10
    if (navigator.userAgent.match(/Android ?(9|10)/i)) {
      // console.log('当前用户是在安卓 9 || 10')

      document.getElementById('upload').attr('capture', 'camera')
    }
  },
  // created () {
  //   if (navigator.userAgent.match(/Android/i)) {
  //     document.getElementById('upload').attr('capture', 'camera')
  //   }
  // },
  components: {
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
    'van-uploader': Uploader
  },
  created () {
    this.themeType = parseInt(localStorage.getItem('themeType'))
    if (this.themeType === 1 || this.themeType === 4) {
      this.getCode()
    }
    if (this.themeType === 5) this.getWorkType()
  },
  methods: {
    getFileName (fileName, length = 10) {
      return Number(Math.random().toString().substr(3, length) + Date.now()).toString(36) + '.' + fileName.split('.').pop()
    },
    onClickLeft () {
      this.$router.push({
        name: 'manageUser',
        params: {
          rowId: this.rowId
        }
      })
    },
    getWorkType () {
      httpGet(addTypeUser + '/' + this.$store.getters.departmentId)
        .then((res) => {
          this.typeList = res.data
        }).catch((err) => {
          console.log(err)
        })
    },
    getValue (value) {
      this.form.beginTime = timeFormatter(value)
      this.isStart = false
    },
    getEndValue (value) {
      this.form.endTime = timeFormatter(value)
      this.isEnd = false
    },
    // fn (f) {
    //   console.log(f)
    //   let file = f.target.files[0]
    //   // let self = this
    //   const isJPG = file.type === 'image/jpeg' || file.type === 'image/jpg'
    //   const isLt10M = file.size / 1024 / 1024 < 10 && file.size / 1024 / 1024 > 0.5
    //   const isLT20M = file.size / 1024 / 1024 > 5
    //   if (!isJPG) {
    //     Toast.fail('上传头像图片只能是 JPG/JPEG 格式!')
    //   }
    //   if (isLT20M) Toast.fail('图片不能超过5M!')
    //   if (isLt10M) {
    //     // eslint-disable-next-line
    //     lrz(file, { quality: 0.2, width: 1000 })
    //       .then(result => {
    //         const formData = new window.FormData()
    //         formData.append('photo', this.form.photo)
    //         formData.append('file', result.file, this.getFileName(result.origin.name))
    //         httpPost(checkAIMemberPhoto, formData).then(res => {
    //           this.form.photo = res.data
    //           this.form = Object.assign(this.form, res.data)
    //           console.log(res.data)
    //           // self.imageUrl = URL.createObjectURL(file)
    //           // self.$refs.uploadPhoto.clearFiles()
    //           console.log(res)
    //           this.imgName = file.name
    //           Toast.success('图片校验成功')
    //         }).catch(() => {
    //           Toast.fail('图片检验失败，请重新上传')
    //         })
    //       })
    //   } else {
    //     let formData = new window.FormData()
    //     formData.append('file', file, this.getFileName(file.name))
    //     formData.append('photo', this.form.photo)
    //     httpPost(checkAIMemberPhoto, formData)
    //       .then(res => {
    //         this.form.photo = res.data
    //         this.form = Object.assign(this.form, res.data)
    //         this.imgName = file.name
    //         Toast.success('图片校检成功')
    //       }).catch(() => {
    //         Toast.fail('图片校检失败，请重新上传！')
    //       })
    //   }
    // },
    onRead (res) {
      console.log(res)
      let file = res.file
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/jpg'
      const isLt10M = file.size / 1024 / 1024 < 10 && file.size / 1024 / 1024 > 0.5
      const isLT20M = file.size / 1024 / 1024 > 5
      if (!isJPG) {
        Toast.fail('上传头像图片只能是 JPG/JPEG 格式!')
      }
      if (isLT20M) Toast.fail('图片不能超过5M!')
      if (isLt10M) {
        // eslint-disable-next-line
        lrz(file, { quality: 0.2, width: 1000 })
          .then(result => {
            const formData = new window.FormData()
            formData.append('photo', this.form.photo)
            formData.append('file', result.file, this.getFileName(result.origin.name))
            httpPost(checkAIMemberPhoto, formData).then(res => {
              this.form.photo = res.data
              this.form = Object.assign(this.form, res.data)
              // self.$refs.uploadPhoto.clearFiles()
              this.imgName = file.name
              Toast.success('图片校验成功')
            }).catch(() => {
              Toast.fail('图片检验失败，请重新上传')
            })
          })
      } else {
        let formData = new window.FormData()
        formData.append('file', file, this.getFileName(file.name))
        formData.append('photo', this.form.photo)
        httpPost(checkAIMemberPhoto, formData)
          .then(res => {
            this.form.photo = res.data
            this.form = Object.assign(this.form, res.data)
            this.imgName = file.name
            Toast.success('图片校检成功')
          }).catch(() => {
            Toast.fail('图片校检失败，请重新上传！')
          })
      }
    },
    checkCard () {
      if (this.form.wiegandCard === '') {
        this.validator.card = '韦根卡号不可为空'
      } else {
        this.validator.card = ''
      }
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
      if (!(/^1[123456789]\d{9}$/.test(this.form.phone))) {
        this.validator.phone = '请输入正确的手机号'
      } else {
        this.validator.phone = ''
      }
    },
    radioChange (value) {
      const data = {
        dutyCompanyId: this.memberId,
        type: value
      }
      this.$nextTick(() => {
        httpPost(checkIsAddAIMember, data).then(res => {
          if (res.code > 1) {
            Toast.success(res.message)
          }
        }).catch(() => {})
      })
    },
    // 获取校验码
    getCode () {
      if (this.themeType === 1 || this.themeType === 4) {
        httpGet(getUUid, {departmentId: this.$store.getters.departmentId})
          .then(res => {
            this.form.idCard = res.data
          }).catch(() => {})
      }
    },
    saveUser () {
      if (this.form.wiegandCard !== '' && this.form.userName !== '' && this.form.phone !== '') {
        if (this.form.type === '1') {
          this.form.beginTime = (this.form.beginTime + '.000Z').replace(' ', 'T')
          this.form.endTime = (this.form.endTime + '.000Z').replace(' ', 'T')
        }
        this.form = Object.assign(this.form, {dutyCompanyId: this.memberId, departmentId: this.$store.getters.departmentId})
        console.log(this.form)
        httpPost(AIMember, this.form)
          .then(res => {
            console.log(res)
            Toast.success(res.message)
            this.$router.push('/manageUser/')
          }).catch((err) => {
            console.log(err)
          })
      } else {
        Toast('请补充完用户信息')
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
<style lang="scss" scoped>
.info{
  width: 200px;
  min-height: 80px;
  border: 1px solid #ccc;
  margin-top:30px;
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
</style>

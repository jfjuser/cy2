<template>
  <div class="page">
    <group >
      <div class="upload" style="position:relative" >
       <div style="width: 60px">上传照片</div>
          <img class="img" v-if="!imgUrl" :src="Person" />
          <img class="img" v-if="imgUrl" :src="imgUrl" />
          <UploadImg  @uploadFileImg="uploadFileImg" style="position:absolute;left:0;top:0;"  :icon="imgUrl"/>
          <!-- capture="camera"  accept="image/jpeg,image/jpg,image/png,image/gif" -->
          <!-- <input
            ref="file"
            id="file"
            class="file"
            type="file"
            name="file"
            accept="image/*"
            @change="changeFile"
          /> -->
      </div>
      <div class="msgPhoto">
                <span>1.人脸大小适中,人头占整个图片1/3-1/2之间为宜。</span>
                <span>2.正对相机。人头在正中间,人头左右，上下，均正对摄像头。</span>
                <span>3.光线均匀，禁止过暗或过曝,禁止过度化妆及使用美颜相机。</span>
                <span>4.脸部不能遮挡并确保图片清晰,正常表情，不能有搞怪动作。</span>
                <span>5.禁止在夜间及逆光下取图，人与背景光线要均匀。</span>
      </div>
    </group>
    <group class="ast">
      <x-input
        v-if="form.type === 1"
        style="font-size:.875rem;"
        title="身份证号"
        required
        placeholder-align="right"
        text-align="right"
        v-model="form.idCard"
        placeholder="请输入身份证号"
        :max="18"
        :show-clear="false"
        :is-type="checkIDcard"
      >
        <template slot="right">
          <x-button type="primary" mini @click.native="showIDcard=true">上传</x-button>
        </template>
      </x-input>
      <x-input
        style="font-size:.875rem;"
        title="姓名"
        required
        placeholder-align="right"
        text-align="right"
        v-model="form.userName"
        placeholder="请输入姓名"
        :show-clear="false"
      ></x-input>
      <x-input
        style="font-size:.875rem;"
        v-show="isPP"
        title="工种"
        @click.native="getType"
        disabled
        required
        placeholder-align="right"
        text-align="right"
        v-model="form.workType"
        placeholder="请选择"
        :show-clear="false"
      ></x-input>
      <x-input
        style="font-size:.875rem;"
        title="手机号"
        required
        placeholder-align="right"
        text-align="right"
        v-model="form.phone"
        placeholder="请输入手机号"
        type="tel"
        mask="99999999999"
        :max="11"
        is-type="china-mobile"
        :show-clear="false"
      ></x-input>
      <!-- <template v-if="form.type === 0">
          <x-input style="font-size:.875rem;" title="韦根卡号" required placeholder-align="right" text-align="right" v-model="form.wiegandCard"  placeholder="请输入韦根卡号" :show-clear="false"></x-input>
      </template>-->
      <popup position="bottom" v-show="isCat" style="height:100rem;">
        <group>
          <x-button
            style="text-align:right;font-size:16px;color:red"
            @click.native="isCat = false"
          >关闭</x-button>
          <div v-for="item in shitArr" :key="item.id">
            <x-button
              style="line-height:2.5rem;width:100vw;border:none;color:#3399ee;"
              @click.native="selectItem(item)"
            >{{item.workName}}</x-button>
          </div>
        </group>
      </popup>
      <template v-if="form.type === 1">
        <x-input
          style="font-size:.875rem;"
          title="地址"
          required
          placeholder-align="right"
          text-align="right"
          v-model="form.addr"
          placeholder="请输入地址"
          :show-clear="false"
        ></x-input>
        <x-input
          style="font-size:.875rem;"
          title="来访原因"
          placeholder-align="right"
          text-align="right"
          v-model="form.visitReasons"
          placeholder="请输入来访原因"
          :show-clear="false"
        ></x-input>
        <datetime
          style="font-size:.875rem;"
          title="开始时间"
          required
          v-model="form.beginTime"
          format="YYYY-MM-DD HH:mm:00"
        ></datetime>
        <datetime
          style="font-size:.875rem;"
          title="结束时间"
          required
          v-model="form.endTime"
          format="YYYY-MM-DD HH:mm:59"
        ></datetime>
      </template>
      <div>
        <x-textarea
          style="font-size:.875rem;"
          contenteditable="false"
          title="备注"
          v-model="form.remarks"
          text-align="right"
          placeholder="请输入备注信息"
        ></x-textarea>
      </div>
      <div style="padding: 10px;">
        <x-button
          type="primary"
          :disabled="disShow"
          @click.native="handleCreate"
          :show-loading="submitLoading"
        >保存</x-button>
      </div>
    </group>
    <div class="box-bind-manager" @click="fn">查看历史</div>
    <div v-if="ifShow" class="box-bind-manager-on" @click="userOpenDoors">一键开闸</div>
    <x-dialog v-model="showIDcard" class="dialog">
      <icon type="clear" class="close" @click.native="showIDcard = false"></icon>
      <div>上传身份证</div>
      <div class="text-left title">正面(国徽面)</div>
      <div class="uploadbox">
        <span class="add" v-if="imgUrl1==''">+</span>
        <img :src="imgUrl1" class="cardimg" v-else />
        <input
          ref="file"
          class="cardfile"
          type="file"
          name="file"
          accept="image/jpeg, image/jpg, image/png"
          @change="changeFile1"
        />
      </div>
      <div class="text-left title">反面(人像面)</div>
      <div class="uploadbox">
        <span class="add" v-if="imgUrl2==''">+</span>
        <img :src="imgUrl2" class="cardimg" v-else />
        <input
          ref="file"
          class="cardfile"
          type="file"
          name="file"
          accept="image/jpeg, image/jpg, image/png"
          @change="changeFile2"
        />
      </div>
      <div
        style="background-color: #fffbe8;color:#ed6a0c;font-size:.6rem;padding:.5rem;margin-bottom: .5rem"
        class="text-left"
      >请正确上传,以提高审核通过率</div>
      <div class="text-right">
        <x-button type="primary" mini @click.native="showIDcard=false">确定</x-button>
      </div>
    </x-dialog>
  </div>
</template>
<script>
// import { closeWindow } from '@/utils/window'
import {
  XInput,
  XTextarea,
  Group,
  XButton,
  TransferDom,
  Checker,
  CheckerItem,
  Popup,
  Datetime,
  XDialog,
  Icon
} from 'vux'
import { httpGet, httpPost } from '@/utils/restful'
import UploadImg from '@/view/faceAI/userModel/bind/addUser/uploadImg'
import lrz from 'lrz'
import {
  faceAICardNum,
  getType,
  faceAICheckPhoto,
  faceAIIsAdd,
  faceAIAdd,
  faceAIAddVisitor
} from '@/api/url.js'
// 提示问题
// import { getWxInfo, getDepInfo, getAppid } from '@/utils/userInfo.js'
// 结束
import { getDepInfo, getAppid } from '@/utils/userInfo.js'
import { getPicUrl } from '@/utils/formatter.js'
import Person from '@/assets/icon/person.jpg'

document.title = '信息录入'
export default {
  directives: {
    TransferDom
  },
  components: {
    XInput,
    XTextarea,
    Group,
    XButton,
    Checker,
    CheckerItem,
    Datetime,
    XDialog,
    Icon,
    Popup,
    UploadImg
  },
  name: '',
  data () {
    return {
      ifShow: '', // 判断一键开闸是否显示
      disShow: false,
      value: '',
      workName: '',
      shitArr: [],
      Person: Person,
      isPP: false,
      imgUrl: '',
      isCat: false,
      submitLoading: false,
      formData: {
        photo: ''
      },
      form: {
        // 提示问题
        // account: getWxInfo().account,
        // unicode: getWxInfo().unicode,
        // 结束
        idCard: '',
        addr: '',
        departmentId: Number(this.$route.query.depId),
        dutyCompanyId: this.$route.query.id, // 非访客
        cyFaceId: this.$route.query.cyFaceId, // 访客
        wxUserId: this.$route.query.wxUserId, // 访客
        phone: '',
        photo: '',
        remarks: '',
        type: '',
        userName: '',
        wiegandCard: '',
        beginTime: undefined,
        endTime: undefined,
        visitReasons: '',
        workType: ''
      },
      result: {},
      checkIDcard: function (value) {
        // let reg = new RegExp('[1-9]\\d{13,16}[a-zA-Z0-9]{1}')
        let reg = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/
        return {
          valid: reg.test(value),
          msg: '身份证格式错误'
        }
      },
      showIDcard: false,
      imgUrl1: '',
      imgUrl2: '',
      multipartFilesx: '', // 正面(国徽面)
      multipartFilesy: '', // 反面(人像面)
      isAndroid10: false
    }
  },
  created () {
    console.log('2020-08-06' + getAppid())
    if (getAppid() === 'wxd6372a2f582b4bd2') {
      this.ifShow = true
    } else {
      this.ifShow = false
    }
    if (Number(localStorage.getItem('themeType')) === 5) {
      this.isPP = true
    }
    if (this.form.addr) {
      this.form.addr = this.$route.query.obj.addr
    }
    this.form.type = Number(this.$route.query.type)
    if (this.form.type === 1) {
      this.form.beginTime = this.$route.query.et
      this.form.endTime = this.$route.query.ot
      if (localStorage.getItem('dutyCompanyId') === null) {
        this.$vux.toast.text('未登陆账户，无法录入访客信息', 'bottom')
      } else {
        this.form.dutyCompanyId = Number(localStorage.getItem('dutyCompanyId'))
      }
    } else {
      this.changeItem()
      // 判断为非访客 人数限制有没有达到最多 如果不够 申请给物业审批
    }
    this.form.wiegandCard = ''
    // this.getCode()
    // =====================================================
  },
  mounted () {
    // let file = document.getElementById('file')
    // // console.log(navigator.userAgent)
    // if (navigator.userAgent.match(/Android ?(9|10)/gim)) {
    //   // 当前用户在 Android 9 || 10 ....
    //   file.setAttribute('capture', 'camera') // 在 Android 10 || 9 添加capture属性
    //   // console.log('当前用户在 Android 9 || 10 ....', navigator.userAgent.match(/Android ?(9|10)/gim))
    // } else {
    //   // 当前用户不在 Android 9 || 10 以内....
    //   // console.log('当前用户不在 Android 9 || 10 以内....')

    //   file.removeAttribute('capture')// 删除 capture属性
    // }
    // console.log('上传文件、图片的元素属性： ', file.getAttribute('capture'))

    // 检测用户设备 类型
    this.userPlatform()
  },
  methods: {
    // 跳转开闸
    userOpenDoors () {
      this.$router.push({ path: '/oneKeyOpenDoor' })
    },
    // 检测用户设备 类型
    userPlatform () {
      // console.log('执行了检测用户设备类型。。。。')

      if (navigator.userAgent.match(/Android ?(8)/gim)) {
        console.log('当前用户设备是安卓。。8 ')
      } else if (navigator.userAgent.match(/Android ?(9)/gim)) {
        console.log('当前用户设备是安卓。。9 ')
      } else if (navigator.userAgent.match(/Android ?(10)/gim)) {
        console.log('当前用户设备是安卓。。10 ')
      }
    },
    uploadFileImg (userImg) {
      if (!userImg) {
        this.formData.photo = ''
      } else {
        this.formData = Object.assign({}, this.formData, userImg)
        this.imgUrl = this.formData.imgurl[0].url
        // console.log(this.formData)
        this.status = false
      }
    },
    selectItem (item) {
      this.form.workType = item.workName
      this.isCat = false
    },
    // 获取校验码
    getCode () {
      httpGet(faceAICardNum, { departmentId: this.$route.query.depId })
        .then(res => {
          this.form.idCard = res.data
        })
        .catch(() => {})
    },
    getType () {
      httpGet(getType + '/' + getDepInfo().departmentId)
        .then(res => {
          this.isCat = true
          if (res.data.length > 0) {
            this.shitArr = res.data
          }
        })
        .catch(() => {})
    },
    fn () {
      this.$router.push({ path: '/faceAI/userModel/bind/history/' })
    },
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
    async restrictImgSize (file, photo) {
      let _this = this
      await lrz(file, {
        quality: 0.85,
        width: 800,
        height: 800
      }).then(res => {
        // _this.$vux.toast.text(res.file, res.origin.name, file)
        // return
        // console.log(1111, res.file, 22222, res.origin.name, 333, file)
        // console.log(res.origin)
        // console.log(res)
        // console.log(res.origin.name)
        return _this.successUploadImg(res.file, res.origin.name, file, photo, res.formData)
      })
    },
    // 校验图片
    changeFile (e) {
      let self = this
      let file = document.getElementById('file').files[0]
      // console.log(file, 'file')
      if (file) {
        // 判断是不是JPG文件
        let isJPG = file.type === 'image/jpeg' || file.type === 'image/jpg'

        let isLt5M =
          file.size / 1024 / 1024 < 10 &&
          file.size / 1024 / 1024 > 0.5
        // console.log('图片大小： ', file.size)
        // 原始 file.size > 1024 * 1024 * 10
        if (file.size > 1024 * 1024 * 10) {
          self.$vux.toast.text('图片大小不能超过10M', 'bottom')
        } else if (!isJPG) {
          self.$vux.toast.text('请选择JPG图片', 'bottom')
        } else if (isLt5M) {
          self.restrictImgSize(file, self.form.photo)
          // lrz(file, { quality: 0.2, width: 1000 })
          //   .then(result => {
          //     console.log(result)
          //     let formData = new window.FormData()
          //     formData.append(
          //       'file',
          //       result.file,
          //       self.getFileName(result.origin.name)
          //     )
          //     formData.append('photo', self.form.photo)
          //     httpPost(faceAICheckPhoto, formData)
          //       .then(res => {
          //         self.$vux.toast.text(res.message, 'bottom')
          //         self.imgUrl = getPicUrl(result.file)
          //         self.form.photo = res.data.photo
          //         self.form = Object.assign(res.data, self.form)
          //       })
          //       .catch(err => {
          //         self.$vux.toast.text(err, 'bottom')
          //       })
          //   })
          //   .catch(() => {
          //     e.target.value = null
          //     console.log('删除图片数据....')
          //   })
        } else {
          self.restrictImgSize(file, self.form.photo)
          // lrz(file, { quality: 0.2, width: 1000 })
          //   .then(result => {
          //     // 成功时执行
          //     console.log(result.file, result.origin.name)
          //     let formData = new window.FormData()
          //     formData.append(
          //       'file',
          //       result.file,
          //       self.getFileName(result.origin.name)
          //     )
          //     formData.append('photo', self.form.photo)
          //     httpPost(faceAICheckPhoto, formData)
          //       .then(res => {
          //         self.$vux.toast.text(res.message, 'bottom')
          //         self.imgUrl = getPicUrl(result.file)
          //         self.form.photo = res.data.photo
          //         self.form = Object.assign(res.data, self.form)
          //       })
          //       .catch(err => {
          //         self.$vux.toast.text(err, 'bottom')
          //       })
          //   })
          //   .catch(() => {
          //     e.target.value = null
          //     console.log('删除图片数据....')
          //   })
          // let formData = new window.FormData()
          // formData.append('file', file, self.getFileName(file.name))
          // formData.append('photo', self.form.photo)
          // const config = {
          //   header: {
          //     'Content-Type': 'application/x-www-form-urlencoded'
          //   }
          // }
          // httpPost(faceAICheckPhoto, formData, config)
          //   .then(res => {
          //     self.$vux.toast.text(res.message, 'bottom')
          //     self.imgUrl = getPicUrl(file)
          //     self.form.photo = res.data.photo
          //     self.form = Object.assign(res.data, self.form)
          //   })
          //   .catch(err => {
          //     console.log('错误提示： ', err)

          //     self.$vux.toast.text(err, 'bottom')
          //   })
        }
      } else {
        self.$vux.toast.text('请选择图片', 'bottom')
      }
    },
    successUploadImg (fileData, fileName, file, photo, fileData1) {
      let self = this
      // let formData = new FormData()
      // formData.append('file', fileData, this.getFileName(fileName))
      fileData1.append('photo', photo)
      const config = {
        baseURL: process.env.API_HOST
      }
      httpPost(faceAICheckPhoto, fileData1, config)
        .then(res => {
          self.$vux.toast.text(res.message, 'bottom')
          self.imgUrl = getPicUrl(fileData)
          self.form.photo = res.data.photo
          self.form = Object.assign(res.data, self.form)
        })
        .catch(err => {
          console.log('错误提示： ', err)
          self.$vux.toast.text(err, 'bottom')
        })
    },
    changeBase (dataurl, filename) {
      // console.log(typeof dataurl)
      let arr = dataurl.split(',')
      let mime = arr[0].match(/:(.*?);/)[1]
      let bstr = atob(arr[1])
      let n = bstr.length
      let u8arr = new Uint8Array(n)
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      // return new File([u8arr], filename, { type: mime });
      return new Blob([u8arr], { type: mime })
    },
    // 检查是否还能继续添加
    changeItem () {
      if (this.$route.query.id) {
        let data = {
          dutyCompanyId: this.$route.query.id,
          type: this.form.type
        }
        httpPost(faceAIIsAdd, data)
          .then(res => {
            if (res.code === 2) {
              this.disShow = true
            } else {
              this.disShow = false
            }
            this.$vux.toast.text(res.message, 'bottom')
          })
          .catch(err => {
            this.$vux.toast.text(err, 'bottom')
          })
      }
    },
    // 保存
    handleCreate () {
      this.submitLoading = true
      // console.log(this.form.type, this.form.photo)
      // console.log(this.formData)
      // console.log(this.formData.photo)
      if (this.form.type === '' || this.formData.photo === '' || this.form.userName === '' || this.form.phone === '') {
        this.submitLoading = false
        // console.log(this.form.type, this.form.photo)
        if (this.formData.photo === '') {
          this.$vux.toast.text('请上传图片', 'bottom')
          // return
        } else {
          if (this.form.userName === '') {
            this.$vux.toast.text('请填写姓名', 'bottom')
          } else if (this.form.phone === '') {
            this.$vux.toast.text('请填写手机号', 'bottom')
          }
          // return
        }
      } else {
        // console.log(11111)
        if (this.form.type === 1) {
          if (this.formData.photo) {
            this.form.photo = this.formData.photo
          }
          let params = Object.assign({}, this.form)
          // 提示问题
          delete params.type
          delete params.workType
          delete params.wiegandCard
          // 结束
          if (
            this.form.beginTime !== undefined &&
            this.form.endTime !== undefined
          ) {
            // params.beginTime = (this.form.beginTime + '.000Z').replace(' ', 'T')
            // params.endTime = (this.form.endTime + '.000Z').replace(' ', 'T')
          } else {
            this.submitLoading = false
            this.$vux.toast.text('开始时间和结束时间不可为空', 'bottom')
          }

          let formData = new window.FormData()
          for (const k in params) {
            let value = params[k] ? params[k] : ''
            formData.append(k, value)
          }
          // formData.append('dutyCompanyId', Number(localStorage.getItem('dutyCompanyId')))
          // console.log(this.multipartFilesx === , this.multipartFilesy === '')
          if (
            this.multipartFilesx &&
            this.multipartFilesx !== undefined &&
            this.multipartFilesx !== null &&
            this.multipartFilesx !== ''
          ) {
            formData.append('multipartFilesx', this.multipartFilesx)
          }
          if (
            this.multipartFilesy &&
            this.multipartFilesy !== undefined &&
            this.multipartFilesy !== null &&
            this.multipartFilesx !== ''
          ) {
            formData.append('multipartFilesy', this.multipartFilesy)
          }
          const config = {
            header: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          }
          // formData.append('multipartFilesy', this.multipartFilesy)
          // httpPost(faceAIAddVisitor, params)
          httpPost(faceAIAddVisitor, formData, config)
            .then(res => {
              this.submitLoading = false
              this.$vux.toast.text(res.message, 'bottom')
              setTimeout(() => {
                this.$router.push({ path: '/faceAI/userModel/' })
                // this.$router.push({path: '/faceAI/userModel/bind/history'})
              }, 1000)
            })
            .catch(err => {
              this.submitLoading = false
              this.$vux.toast.text(err, 'bottom')
            })
        } else {
          // console.log(this.form)
          if (this.formData.photo) {
            this.form.photo = this.formData.photo
          } else {
            this.$vux.toast.text('请上传图片', 'bottom')
            this.form.photo = ''
          }
          httpPost(faceAIAdd, this.form)
            .then(res => {
              this.submitLoading = false
              this.$vux.toast.text('添加成功', 'bottom')
              console.log(localStorage.getItem('dutyCompanyId'))
              setTimeout(() => {
                // window.location.reload()
                this.$router.push({ path: '/faceAI/userModel/bind/history/' })
              }, 2000)
            })
            .catch(err => {
              this.submitLoading = false
              this.$vux.toast.text(err, 'bottom')
            })
        }
      }
    },
    changeFile1 (e) {
      const file = e.target.files[0]
      if (file) {
        lrz(file, { quality: 0.2, width: 1000 }).then(result => {
          this.imgUrl1 = getPicUrl(result.file)
          this.multipartFilesx = result.file
        })
      }
    },
    changeFile2 (e) {
      const file = e.target.files[0]
      if (file) {
        lrz(file, { quality: 0.2, width: 1000 }).then(result => {
          this.imgUrl2 = getPicUrl(result.file)
          this.multipartFilesy = result.file
        })
      }
    }
  }
}
</script>
<style lang='scss' scoped>
/deep/  .weui-cells{
  margin-top: 0px;
}
/deep/ .van-row{
  border:none;
}
.dp-container {
  font-size: 14px !important;
}
.page {
  height: 100%;
  min-height: 100%;
  background: #eee;
}
.weui-cells {
  margin-top: 10px !important;
}
.upload {
  background: #ffffff;
  font-size: 0.875rem !important;
  display: flex;
  justify-content: space-between;
  padding: 10px 15px;
  position: relative;
  width: 100%;
  height: 50px;
  align-items: center;
  .file {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
  }
  .img {
    position: absolute;
    right: 50px;
    top: 10px;
    width: 50px;
    height: 50px;
    border: 2px solid #eee;
    border-radius: 50%;
  }
}
.type {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
}
.item {
  border: 1px solid #ececec;
  padding: 5px 15px;
  border-radius: 5px;
}
.item-selected {
  border: 1px solid green;
}
.box-bind-manager {
  border-top: 1px solid rgb(31, 114, 28);
  border-left: 1px solid rgb(31, 114, 28);
  border-bottom: 1px solid rgb(31, 114, 28);
  border-top-left-radius: 1.25rem;
  border-bottom-left-radius: 1.25rem;
  background-color: #e8fae8;
  color: rgb(31, 114, 28);
  width: 8rem;
  font-size: 1rem;
  letter-spacing: 0.0625rem;
  padding: 0.1875rem 0;
  float: right;
  margin-top: 2rem;
}
.box-bind-manager-on{
   border-top: 1px solid rgb(31, 114, 28);
  border-right: 1px solid rgb(31, 114, 28);
  border-bottom: 1px solid rgb(31, 114, 28);
  border-top-right-radius: 1.25rem;
  border-bottom-right-radius: 1.25rem;
  background-color: #e8fae8;
  color: rgb(31, 114, 28);
  width: 8rem;
  font-size: 1rem;
  letter-spacing: 0.0625rem;
  padding: 0.1875rem 0;
  // display: block;
  float: left;
  margin-top: 2rem;
}
.dialog {
  .close {
    position: absolute;
    top: 0.3rem;
    right: 0.3rem;
  }
  .title {
    padding-bottom: 0.5rem;
    font-size: 0.875rem;
  }
  .uploadbox {
    border: 1px dashed #ccc;
    border-radius: 0.5rem;
    overflow: hidden;
    height: 8rem;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    margin-bottom: 0.5rem;
    .add {
      font-size: 2rem;
    }
    .cardimg {
      width: 100%;
      height: 100%;
    }
    .cardfile {
      position: absolute;
      width: 100%;
      height: 100%;
      opacity: 0;
    }
  }
}
</style>

<style scoped>
.msgPhoto{
  display:flex;
  flex-direction:column;
  margin-top: 10px;
  padding-left: 5px;
}
.msgPhoto span{
  margin-bottom: 10px;
}
.msgPhoto span{
  font-size: 0.8rem;
  width: 100%;
  color:red;
  text-align:left
}
.dialog >>> .weui-dialog {
  padding: 0.8rem;
}
.ast{
  margin-top: 20px;
}
.ast >>> .weui-textarea {
  -webkit-user-select: auto;
  -khtml-user-select: auto;
  -moz-user-select: auto;
  -ms-user-select: auto;
  user-select: auto;
}
.van-uploader__input-wrapper{
  width:100%;
}
</style>

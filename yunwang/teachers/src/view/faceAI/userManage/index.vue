<template>
  <div class="page">
      <group>
        <div class="upload">
          <div style="width: 50px">图片</div>
          <div>
            <img class="img" :src="imgUrl">
            <!-- capture="camera" -->
            <input ref="file" id="file" class="file" type="file" name="file" capture="camera" accept="image/*" @change="changeFile">
          </div>
        </div>
      </group>
      <group>
        <x-input style="font-size:.875rem;" v-if="form.type === 1" title="身份证号" required placeholder-align="right" text-align="right" v-model="form.idCard"  placeholder="请输入身份证号" :max="18" :show-clear="false" :is-type="checkIDcard"></x-input>
        <x-input style="font-size:.875rem;" title="姓名" required placeholder-align="right"  text-align="right" v-model="form.userName" placeholder="请输入姓名" :show-clear="false"></x-input>
        <x-input style="font-size:.875rem;" title="手机号" required placeholder-align="right"  text-align="right" v-model="form.phone" placeholder="请输入手机号" type='tel' mask="99999999999" :max="11" is-type="china-mobile" :show-clear="false"></x-input>
        <x-input style="font-size:.875rem;" title="地址" required placeholder-align="right"  text-align="right" v-model="form.addr" placeholder="请输入地址" :show-clear="false"></x-input>
        <x-input style="font-size:.875rem;" title="韦根卡号" required placeholder-align="right" text-align="right" v-model="form.wiegandCard"  placeholder="请输入韦根卡号" :show-clear="false"></x-input>
        <template v-if="form.type === 1">
          <x-input style="font-size:.875rem;" title="来访原因" placeholder-align="right" text-align="right" v-model="form.visitReasons"  placeholder="请输入来访原因" :show-clear="false"></x-input>
          <datetime style="font-size:.875rem;" title="开始时间" required v-model="form.beginTime" format="YYYY-MM-DD HH:mm:00"></datetime>
          <datetime style="font-size:.875rem;" title="结束时间" required v-model="form.endTime" format="YYYY-MM-DD HH:mm:59"></datetime>
        </template>
        <x-textarea style="font-size:.875rem;" title="备注" v-model="form.remarks"  text-align="right" placeholder="请输入备注信息"></x-textarea>
        <div style="padding: 10px;">
          <x-button type="primary" @click.native="handleCreate" :show-loading ="submitLoading">保存</x-button>
        </div>
      </group>
  </div>
</template>
<script>
import { closeWindow } from '@/utils/window'
import { XInput, XTextarea, Group, XButton, Checker, CheckerItem, Datetime } from 'vux'
import { httpGet, httpPost } from '@/utils/restful'
import lrz from 'lrz'
import { faceAICardNum, faceAICheckPhoto, faceAIIsAdd, faceAIAdd } from '@/api/url.js'
import { getPicUrl } from '@/utils/formatter.js'
import Person from '@/assets/icon/person.jpg'
document.title = '信息录入'
export default {
  components: {
    XInput,
    XTextarea,
    Group,
    XButton,
    Checker,
    CheckerItem,
    Datetime
  },
  name: '',
  data () {
    return {
      value: '',
      imgUrl: Person,
      submitLoading: false,
      form: {
        idCard: '',
        addr: '',
        dutyCompanyId: this.$route.query.id,
        phone: '',
        photo: '',
        remarks: '',
        type: undefined,
        userName: '',
        wiegandCard: '',
        beginTime: undefined,
        endTime: undefined,
        visitReasons: ''
      },
      result: {},
      checkIDcard: function (value) {
        // let reg = new RegExp('[1-9]\\d{13,16}[a-zA-Z0-9]{1}')
        let reg = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/
        return {
          valid: reg.test(value),
          msg: '身份证格式错误'
        }
      }
    }
  },
  created () {
    this.form.type = Number(this.$route.query.type)
    if (this.form.type === 1) {
      this.form.beginTime = this.$route.query.et
      this.form.endTime = this.$route.query.ot
    }
    this.form.type = 0
    // 默认 获取
    // this.form.wiegandCard = new Date().getTime()
    // this.getCode()
  },
  mounted () {
    let file = document.getElementById('file')
    console.log(navigator.userAgent)
    if (navigator.userAgent.match(/Android ?(9|10)/gim)) {
      // 当前用户在 Android 9 || 10 ....
      file.setAttribute('capture', 'camera') // 在 Android 10 || 9 添加capture属性
      // console.log('当前用户在 Android 9 || 10 ....', navigator.userAgent.match(/Android ?(9|10)/gim))
    } else {
      // 当前用户不在 Android 9 || 10 以内....
      console.log('当前用户不在 Android 9 || 10 以内....')

      file.removeAttribute('capture')// 删除 capture属性
    }
  },
  methods: {
    // 获取校验码
    getCode () {
      httpGet(faceAICardNum, {departmentId: this.$route.query.depId})
        .then(res => {
          this.form.idCard = res.data
        }).catch(() => {})
    },
    getFileName (fileName, length = 10) {
      return Number(Math.random().toString().substr(3, length) + Date.now()).toString(36) + '.' + fileName.split('.').pop()
    },
    // 校验图片
    changeFile (e) {
      let self = this
      const file = document.getElementById('file').files[0]
      if (file) {
        // 判断是不是JPG文件
        const isJPG = file.type === 'image/jpeg' || file.type === 'image/jpg'
        const isLt5M = file.size / 1024 / 1024 < 10 && file.size / 1024 / 1024 > 0.5
        if (file.size > 1024 * 1024 * 10) {
          self.$vux.toast.text('图片大小不能超过10M', 'bottom')
        } else if (!isJPG) {
          self.$vux.toast.text('请选择JPG图片', 'bottom')
        } else if (isLt5M) {
          lrz(file, { quality: 0.2, width: 1000 })
            .then(result => {
              // 成功时执行
              let formData = new window.FormData()
              formData.append('file', result.file, this.getFileName(result.origin.name))
              formData.append('photo', this.form.photo)
              httpPost(faceAICheckPhoto, formData)
                .then(res => {
                  self.$vux.toast.text(res.message, 'bottom')
                  self.imgUrl = getPicUrl(result.file)
                  self.form.photo = res.data.photo
                  self.form = Object.assign(res.data, self.form)
                }).catch(err => {
                  self.$vux.toast.text(err, 'bottom')
                })
            }).catch(() => {
              e.target.value = null
            })
        } else {
          let formData = new window.FormData()
          formData.append('file', file, this.getFileName(file.name))
          formData.append('photo', this.form.photo)
          const config = {
            header: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          }
          httpPost(faceAICheckPhoto, formData, config)
            .then(res => {
              self.$vux.toast.text(res.message, 'bottom')
              self.imgUrl = getPicUrl(file)
              self.form.photo = res.data.photo
              self.form = Object.assign(res.data, self.form)
            }).catch((err) => {
              self.$vux.toast.text(err, 'bottom')
            })
        }
      } else {
        self.$vux.toast.text('请选择图片', 'bottom')
      }
    },
    changeItem (value) {
      if (value === '') {
        this.$vux.toast.text('请选择某一类型', 'bottom')
      } else {
        let data = {
          dutyCompanyId: this.$route.query.id,
          type: value
        }
        httpPost(faceAIIsAdd, data)
          .then(() => {
            this.submitLoading = false
          }).catch((err) => {
            this.submitLoading = true
            this.$vux.toast.text(err, 'bottom')
          })
      }
    },
    // 保存
    handleCreate () {
      this.submitLoading = true
      if (this.form.type === '' || this.form.photo === '') {
        this.submitLoading = false
        this.$vux.toast.text('请填写参数', 'bottom')
      } else {
        let params = Object.assign({}, this.form)
        if (this.form.type === 1) {
          if (this.form.beginTime !== undefined && this.form.endTime !== undefined) {
            params.beginTime = (this.form.beginTime + '.000Z').replace(' ', 'T')
            params.endTime = (this.form.endTime + '.000Z').replace(' ', 'T')
          } else {
            this.submitLoading = false
            this.$vux.toast.text('开始时间和结束时间不可为空', 'bottom')
            return
          }
        }
        httpPost(faceAIAdd, params)
          .then(res => {
            this.submitLoading = false
            this.$vux.toast.text(res.message, 'bottom')
            setTimeout(() => {
              closeWindow(window)
            }, 3000)
          }).catch(err => {
            this.submitLoading = false
            this.$vux.toast.text(err, 'bottom')
          })
      }
    }
  }
}
</script>
<style lang='scss' scoped>
.dp-container{
  font-size: 14px !important;
}
.page{
  height: 100%;
  min-height: 100%;
  background: #eee;
}
.weui-cells{
  margin-top: 10px !important;
}
.upload{
  background: #ffffff;
  font-size: .875rem !important;
  display: flex;
  justify-content: space-between;
  padding: 10px 15px;
  position: relative;
  width: 100%;
  height: 50px;
  align-items: center;
  .file{
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
  .img{
    position: absolute;
    right: 50px;
    top: 10px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    border: 2px solid #eee;
  }
}
.type{
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
</style>

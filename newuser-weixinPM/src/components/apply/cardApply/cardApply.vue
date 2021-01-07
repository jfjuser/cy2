<template>
  <div class="warp-content">
    <NavBar
      title="补卡申请"
      left-text="返回"
      left-arrow
      @click-left="onClickLeft"
    />
    <div class="ast" style="margin-top:1.5rem">
      <Field  disabled required v-model="applyTime" @click="showTime" input-align="right" right-icon="arrow" label="补卡时间" placeholder="请选择时间" />
    </div>
    <Popup v-model="show" position=top>
      <DatetimePicker
        v-model="cardDate"
        @cancel="show = false"
        @confirm="gainValue"
        type="datetime"
      />
    </Popup>
    <div style="margin-top:1.5rem">
      <Field required v-model="reason" autosize type="textarea" label="补卡理由" placeholder="请输入" />
    </div>
    <div style="margin-top:1.5rem;background-color:#fff;">
      <Cell title="图片" :border="false"></Cell>
      <Uploader
        upload-text="辅助补卡理由"
        v-model="arr"
        multiple
        preview-size="120px"
        :max-count="2"
        :after-read="conso"
        style="margin-left:5rem;margin-bottom:1.5rem"
      />
    </div>
    <div>
      <Button type="info" class="btn" @click="submit" size=large>提交</Button>
    </div>
  </div>
</template>

<script>
import { applyCard } from '@/api/url'
import { httpPost } from '@/utils/restful'
import lrz from 'lrz'
// import ImageCompressor from 'image-compressor.js'
import { timeFormatter } from '@/utils/formatter.js'
import { NavBar, Button, Popup, Field, Cell, Uploader, DatetimePicker } from 'vant'
import {mapGetters, mapActions} from 'vuex' // 引入vuex辅助函数
export default {
  name: 'cardApply',
  data () {
    return {
      show: false,
      applyTime: undefined,
      cardDate: new Date(),
      reason: undefined,
      arr: [],
      departmentId: undefined,
      timeFormatter: timeFormatter,
      formData: undefined
    }
  },
  created () {
    // this.departmentId = JSON.parse(localStorage.getItem('userObj')).dutyCompanyId
    this.departmentId = this.userInfo.dutyCompanyId || ''
  },
  computed: {
    ...mapGetters('user', [
      'userId',
      'userInfo',
      'active',
      'wxInfo'
    ])
  },
  methods: {
    ...mapActions('user', ['SaveUserId', 'SaveUserInfo', 'SaveActive', 'SaveLoginState']),
    onClickLeft () {
      this.$router.replace('/attendance/')
    },
    conso (files) {
      // eslint-disable-next-line
      const file = files.file
      lrz(file, { quality: 0.2, width: 1000 })
        .then(result => {
          this.assistPhoto = new window.FormData()
          // formData.append('photo', this.assistPhoto.photo)
          this.assistPhoto.append('assistPhoto', result.file, this.getFileName(result.origin.name))
          console.log(this.assistPhoto)
        }).catch(() => {})
    },
    getFileName (fileName, length = 10) {
      return Number(Math.random().toString().substr(3, length) + Date.now()).toString(36) + '.' + fileName.split('.').pop()
    },
    showTime () {
      this.show = true
    },
    submit () {
      if (this.applyTime !== undefined && this.reason !== undefined && this.departmentId !== undefined) {
        if (this.arr.length === 0) {
          this.assistPhoto = new window.FormData()
        }
        console.log(this.assistPhoto)
        // let userId = Number(localStorage.getItem('userid'))
        let userId = this.userId

        this.assistPhoto.append('applyTime', this.applyTime)
        this.assistPhoto.append('userId', userId)
        this.assistPhoto.append('reason', this.reason)
        this.assistPhoto.append('departmentId', Number(this.departmentId))
        httpPost(applyCard, this.assistPhoto).then((res) => {
          this.$notify({
            type: 'success',
            duration: 3000,
            message: res.message
          })
          this.$router.replace('/mySet/')
        }).catch(() => {})
      } else {
        this.$notify('请填写完整申请条件！')
      }
    },
    gainValue (value) {
      this.applyTime = this.timeFormatter(value)
      this.show = false
    }
  },
  components: {
    NavBar,
    Field,
    Cell,
    Uploader,
    Button,
    DatetimePicker,
    Popup
  }
}
</script>

<style scoped>
.ast >>> .van-field__control:disabled {
  color: #000
}
</style>
<style lang="scss" scoped>
 .warp-content{
   background-color: rgb(248,248,248);
   min-height: 100vh
 }
  .btn{
    margin-top:5rem;
    width:90vw;
    font-size:18px;
    font-weight:bold;
    margin-left: 5vw;
    border-radius:4px;
  }
</style>

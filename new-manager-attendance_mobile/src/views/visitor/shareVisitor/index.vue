<template>
  <div>
    <div class="box text-c">
      <van-button round type="info" icon="scan" class="scan mar-b-10" @click="scaning"></van-button>
      <!-- <div class="fc-grey describe">
                <p>扫一扫设备屏幕下方的二维码开闸通行</p>
      </div>-->
    </div>
    <div class="info">
      <template v-if="data.type == 2">
        <van-cell title="来访有效时间：" />
        <van-cell title="开始时间" :value="data.beginTime" />
        <van-cell title="结束时间" :value="data.endTime" />
      </template>
      <template v-if="data.type == 1">
        <van-cell title="限制使用次数" :value="data.time" />
      </template>
      <van-field rows="1" label="备注：" type="textarea" readonly :value="data.remark||''" />
    </div>
    <div class="helpBox text-c">
      <p class="fc-grey">转发无效</p>
      <p class="fc-grey mar-b-10">扫一扫设备屏幕下方的二维码开闸通行</p>
      <img src="@/assets/img/visitor_guide.png" class="img contain-img" alt="帮助" />
    </div>

    <van-dialog
      v-model="showInfo"
      confirm-button-text="确定"
      title="请先填写信息"
      close-on-popstate
      :before-close="beforeClose"
    >
      <van-field
        label="姓名"
        placeholder="请输入姓名"
        v-model.trim="info.name"
        required
        :error-message="errName"
      />
      <van-field
        label="手机号"
        type="number"
        placeholder="请输入手机号"
        maxlength="11"
        v-model.trim="info.phone"
        required
        :error-message="errPhone"
      />
      <van-field label="备注" placeholder="请输入备注" v-model.trim="info.visitReasons" />
    </van-dialog>
    <van-dialog v-model="show" title="门已打开，请尽快通行" close-on-popstate class="text-c">
      <Icon size="100px" name="passed" color="#04BE02" />
    </van-dialog>
    <!-- 帮助 -->
    <!-- <van-dialog
          v-model="showHelp"
          confirm-button-text="知道了"
          close-on-popstate
          class="text-c"
          @confirm="closeHelp"
        >
          <div class="helpBox">
            <img src="@/assets/img/visitor_guide.png" class="img contain-img" alt="帮助">
            <p class="fc-grey">扫一扫设备屏幕下方的二维码开闸通行</p>
          </div>
    </van-dialog>-->
    <!-- 成功提示音 -->
    <audio id="tipMusic">
      <source src="@/assets/audio/openedTip.mp3" type="audio/mpeg" />
    </audio>
  </div>
</template>

<script>
import wx from 'weixin-js-sdk'
import { Icon } from 'vant'
import { getParam, checkPhone } from '@/utils/formatter'
import { sweep, handleScan, getOpenId } from '@/api/url'
import { Session } from '@/utils/storage'
export default {
  components: {
    Icon
  },
  data () {
    return {
      data: this.$route.query.data ? JSON.parse(decodeURI(this.$route.query.data)) : {},
      isStrict: this.$route.query.isStrict,
      isSignature: true,
      show: false,
      // showHelp: false,
      showInfo: false,
      info: {
        phone: '',
        name: '',
        visitReasons: ''
      },
      errPhone: '',
      errName: ''
    }
  },
  created () {
    if (this.$route.query.code) {
      this.getWXConfig()
      if (!Session.get('openId_temp')) {
        this.getOpenId()
      }
    } else {
      this.getCode()
    }
    console.log(this.$route.query.code, 'code')
    console.log(decodeURI(this.$route.query.data), 'data')
  },
  mounted () {
    if (this.isStrict === '1') {
      this.showInfo = true
    }
    // if (!Session.get('shareVisitorShowHelp')) {
    //   this.$nextTick(() => {
    //     this.showHelp = true
    //   })
    // }
  },
  methods: {
    // closeHelp () {
    //   Session.set('shareVisitorShowHelp', 1)
    // },
    beforeClose (action, done) {
      if (action === 'confirm') {
        if (this.info.name === '') {
          this.errName = '姓名不能为空'
          done(false)
          return
        } else { this.errName = '' }
        if (checkPhone(this.info.phone)) {
          this.errPhone = '手机号格式不正确'
          done(false)
          return
        } else { this.errPhone = '' }

        done()
      } else {
        this.errPhone = ''
        this.errName = ''
        done()
      }
    },
    // 校验扫码结果
    handleScan (mac) {
      let form = {
        id: this.data.id, // 访客链接id
        mac: mac,
        openId: Session.get('openId_temp'),
        type: this.data.type, // 选择限制方式
        time: this.data.time,
        beginTime: this.data.beginTime,
        endTime: this.data.endTime,
        visitCode: this.data.visitCode,
        remark: this.isStrict // 严格模式, 0 否 1 是
      }
      if (this.isStrict === '1') {
        form = Object.assign(form, this.info)
      }
      const config = {
        baseURL: process.env.API_HOST + 'pb/at'
      }
      const ToastLoading = this.$toast.loading({ message: '加载中...', position: 'middle', duration: 0 })
      this.$http.post(handleScan, form, config).then(res => {
        ToastLoading.clear()
        if (res.code === 1) {
          document.getElementById('tipMusic').play()
          this.show = true
        }
        if (res.code === 0) {
          this.$dialog.alert({
            closeOnPopstate: true,
            title: '操作失败',
            message: '有效时间已过期'
          }).then(() => {

          })
        }
      }).catch(() => {
        ToastLoading.clear()
      })
    },
    getWXConfig () {
      const ToastLoading = this.$toast.loading({ mask: true, message: '加载中...', position: 'middle', duration: 0 })
      let url = window.location.href.split('#')[0]
      this.$http.post(sweep, {
        appId: this.data.appId,
        url: url
      }).then((res) => {
        wx.config({
          debug: false,
          appId: res.data.appId,
          timestamp: res.data.timestamp,
          nonceStr: res.data.nonceStr,
          signature: res.data.signature,
          jsApiList: ['scanQRCode', 'hideMenuItems']
        })
        wx.ready(() => {
          ToastLoading.clear()
          console.log('js-sdk 配置成功')
          wx.hideMenuItems({
            menuList: ['menuItem:share:appMessage', 'menuItem:share:timeline', 'menuItem:share:qq', 'menuItem:share:weiboApp', 'menuItem:share:facebook', 'menuItem:share:QZone'] // 要隐藏的菜单项 分享
          })
        })
        wx.error(() => {
          ToastLoading.clear()
          console.log('js-sdk 配置失败')
        })
      }).catch(() => {
        ToastLoading.clear()
        this.$toast('微信签名失败')
        this.isSignature = false
      })
    },
    scaning () {
      const _this = this
      wx.ready(() => {
        wx.scanQRCode({
          needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果
          scanType: ['qrCode', 'barCode'], // 可以指定是二维码还是一维码
          success (res) {
            // alert('扫描结果：' + res.resultStr)
            console.log('扫描结果：', res.resultStr)
            const mac = getParam('m', res.resultStr)
            if (mac) {
              let macRes = _this.headleMac(mac.toLocaleUpperCase())
              _this.handleScan(macRes)
            } else {
              _this.$dialog.alert({
                closeOnPopstate: true,
                title: '扫码失败',
                message: '原因：未能获取到MAC地址'
              }).then(() => {
              })
            }
          }
        })
      })
      if (this.isSignature) {
        this.isscan = false
      } else {
        this.$toast('扫一扫调用失败')
      }
    },
    // 处理mac加冒号
    headleMac (value, length = 2) {
      let str = value
      let i = 0
      let arr = []
      for (let index = 0; index < str.length; index++) {
        let n = str.slice(i, i + length)
        i = i + length
        if (!n) break
        arr.push(n)
      }
      return arr.join(':')
    },
    getOpenId () {
      if (!this.$route.query.code || !this.data.appId) {
        return
      }
      this.$http.get(`${getOpenId}/${this.$route.query.code}/${this.data.appId}`).then(res => {
        if (res.data) {
          Session.set('openId_temp', res.data)
        } else {
          this.$toast('微信授权失败')
        }
      }).catch(() => { this.$toast('微信授权失败') })
    },
    getCode () {
      const url = location.href
      window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + this.data.appId + '&redirect_uri=' + encodeURIComponent(url) + '&response_type=code&scope=snsapi_userinfo#wechat_redirect'
    }
  }
}
</script>

<style lang="scss" scoped>
.box {
  padding-top: 50px;
  .scan {
    height: 150px;
    line-height: 150px;
    width: 150px;
    border-radius: 50%;
    border: none;
    overflow: hidden;
    box-shadow: 0 4px 15px 0 rgba(64, 158, 83, 0.6);
    font-size: 45px;
  }
  // .describe {
  //     margin-top: 20px;
  //     font-size: 16px;
  // }
}
.info {
  padding-right: 15px;
}
.helpBox {
  .img {
    width: 200px;
    height: 200px;
  }
}
</style>

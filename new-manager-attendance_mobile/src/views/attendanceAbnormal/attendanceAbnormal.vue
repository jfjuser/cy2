<template>
  <div>
    <div class="box text-c">
      <van-button round type="info" icon="scan" class="scan" @click="scaning"></van-button>
      <div class="fc-grey describe">
        <p>扫一扫设备上的二维码进行解绑</p>
      </div>
    </div>
  </div>
</template>
<script>
import wx from 'weixin-js-sdk'
import { sweep, unboundCamera } from '@/api/url'
import isOS from '@/utils/isOS'
import { getParam } from '@/utils/formatter'
export default {
  name: '',
  data () {
    return {
      mac: ''
    }
  },
  created () {
    this.getWXConfig()
  },
  methods: {
    getWXConfig () {
      const ToastLoading = this.$toast.loading({ mask: true, message: '加载中...', position: 'middle', duration: 0 })
      let url = window.location.href.split('#')[0]
      if (isOS() === 'iOS') {
        url = this.$store.state.url.split('#')[0]
      }
      console.log(url)
      this.$http.post(sweep, {
        appId: this.$store.getters.appId,
        url: url
      }).then((res) => {
        // console.log('微信信息： ', res.data)
        wx.config({
          debug: false, // 调试模式
          appId: res.data.appId, // 必填，公众号唯一标识符
          timestamp: res.data.timestamp, // 必填，生成签名的时间戳
          nonceStr: res.data.nonceStr, // 必填，生成签名的随机串
          signature: res.data.signature, // 必填，签名
          jsApiList: [
            // 'checkJsApi',
            'scanQRCode'
          ] // 必填，需要使用的JS接口列表
        })
        wx.ready(() => {
          ToastLoading.clear()
          console.log('js-sdk 配置成功')
        })
        wx.error((err) => {
          ToastLoading.clear()
          console.log('js-sdk 配置失败' + err)
        })
      }).catch(() => {
        ToastLoading.clear()
        this.$toast('微信签名失败')
      })
    },
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
    scaning () {
      const _this = this
      wx.ready(() => {
        console.log('111')
        wx.scanQRCode({
          needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果
          scanType: ['qrCode', 'barCode'], // 可以指定是二维码还是一维码
          success (res) {
            // alert('扫描结果：' + res.resultStr)
            console.log('扫描结果：', res.resultStr)
            const mac = getParam('m', res.resultStr)
            if (mac) {
              _this.mac = _this.headleMac(mac.toLocaleUpperCase())
              console.log('form-mac 数据', _this.mac)
              _this.$http.post(unboundCamera + '/' + _this.mac).then((res) => {
                _this.$toast({
                  type: 'success',
                  message: '解绑成功！'
                })
              })
            } else {
              // _this.$toast.fail('未能获取到MAC地址')
              _this.$dialog.confirm({
                closeOnPopstate: true,
                title: '扫码失败',
                message: '原因：未能获取到MAC地址, 请重新扫描'
              }).then(() => {
              })
            }
          }
        })
      })
    }
  }
}
</script>
<style lang='scss' scoped>

.box {
  padding-top: 100px;
}
.scan {
  height: 150px;
  line-height: 150px;
  width: 150px;
  border-radius: 50%;
  border: none;
  overflow: hidden;
  box-shadow: 0 4px 15px 0 rgba(64, 158, 255, 0.6);
  font-size: 45px;
}
.describe {
  margin-top: 30px;
  font-size: 16px;
}

</style>

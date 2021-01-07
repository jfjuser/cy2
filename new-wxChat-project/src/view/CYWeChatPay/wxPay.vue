<template>
  <!-- 只做支付页面, 无绑定其他业务 -->
  <div></div>
</template>
<style lang="scss" scoped>
</style>
<script>
import { closeWindow } from '@/utils/window.js'
import { getQueryString } from '@/utils/formatter.js'
export default {
  data () {
    return {
    }
  },
  mounted () {
    let self = this
    // 获取参数
    let payParams = getQueryString('data')
    if (payParams) {
      payParams = JSON.parse(decodeURIComponent(payParams))
      setTimeout(function () {
        self.goPay(payParams)
      }, 1000)
    } else {
      this.$vux.toast.text('识别错误，请重新下单!', 'bottom')
    }
  },
  methods: {
    goPay: function (payParams) {
      let vm = this
      if (typeof window.WeixinJSBridge === 'undefined') {
        if (document.addEventListener) {
          document.addEventListener('WeixinJSBridgeReady', vm.onBridgeReady(payParams), false)
        } else if (document.attachEvent) {
          document.attachEvent('WeixinJSBridgeReady', vm.onBridgeReady(payParams))
          document.attachEvent('onWeixinJSBridgeReady', vm.onBridgeReady(payParams))
        }
      } else {
        vm.onBridgeReady(payParams)
      }
    },
    onBridgeReady: function (data) {
      let timeStamp = '' + data.timeStamp + ''
      window.WeixinJSBridge.invoke(
        'getBrandWCPayRequest', {
          'appId': data.appId,
          'timeStamp': timeStamp,
          'nonceStr': data.nonceStr,
          'package': data.pack,
          'signType': data.signType,
          'paySign': data.paySign
        },
        function (res) {
          if (res.err_msg === 'get_brand_wcpay_request:ok') {
            // let paramsJson = JSON.stringify(Object.assign(vm.params, {payTime: vm.formatterTime(new Date())}))
            setTimeout(function () {
              closeWindow(window)
            }, 3000)
          } else {
          }
        }
      )
    }
  }
}
</script>

<template>
  <!-- 扫码直付 -->
  <div id="app" v-cloak>
    <group>
      <cell title="公告">
        <marquee>
          <marquee-item v-for="item in msgArray" :key="item">{{item}}</marquee-item>
        </marquee>
      </cell>
    </group>
    <div class="box">
      <div class="box-title">
        <div class="box-plate">{{params.plate}}</div>
        <div class="box-departmentInfo">{{params.departmentName}}</div>
      </div>
      <div class="box-content">
        <flexbox class="box-content-card">
          <flexbox-item :span="1/3" class="box-content-card-left">入场时间:</flexbox-item>
          <flexbox-item :span="2/3" class="box-content-card-right">{{params.inTime}}</flexbox-item>
        </flexbox>
        <flexbox class="box-content-card">
          <flexbox-item :span="1/3" class="box-content-card-left">查询时间:</flexbox-item>
          <flexbox-item :span="2/3" class="box-content-card-right">{{params.queryTime}}</flexbox-item>
        </flexbox>
        <flexbox class="box-content-card">
          <flexbox-item :span="1/3" class="box-content-card-left">停车时长:</flexbox-item>
          <flexbox-item :span="2/3" class="box-content-card-right">{{params.duration}}</flexbox-item>
        </flexbox>
        <flexbox class="box-content-card">
          <flexbox-item :span="1/3" class="box-content-card-left">支付金额:</flexbox-item>
          <flexbox-item :span="2/3" class="box-content-card-right"><span class="money">{{params.price == '正在查询..' ? '正在查询..' : params.price}}</span></flexbox-item>
        </flexbox>
      </div>
    </div>
    <div v-if="isShow" class="pay" :disabled="disabled" @click="goPay">{{btnText}}</div>
  </div>
</template>
<style lang="scss" scoped>
[v-cloak] {
  display: none;
}

.box {
  width: 80%;
  margin: 5% 10%;
  position: relative;
  border-radius: 1rem;
  background-color: #FFB558;
  border: 1px solid rgb(250, 193, 122);
}

.box-title {
  // background-color: #FFB558;
  border-top-left-radius: 1rem;
  border-top-right-radius: 1rem;
  padding: 30px 20px;
  color: #ffffff;
  .box-plate {
    font-size: 24px;
    letter-spacing: 3px;
  }
  .box-departmentInfo {
    margin-top: 5px;
    font-size: 14px;
  }
}

.box-content {
  background-color: #fff7ea;
  height: 180px;
  border-bottom-left-radius: 1rem;
  border-bottom-right-radius: 1rem;
  padding: 30px 0;
  .box-content-card {
    line-height: 40px;
    .box-content-card-left {
      font-weight: bold;
      text-align: right;
    }
    .box-content-card-right {
      text-align: left;
    }
  }
}

.money {
  color: #FFB558;
  font-size: 20px;
}

.pay{
  width: 50%;
  background: #FFB558;
  border-radius: 2.875rem;
  color: white;
  margin: 2rem auto;
  text-align: center;
  line-height: 2.875rem;
  height: 2.875rem;
  font-size: 20px;
  padding-left: 10px;
  letter-spacing: 10px;
}

.pay:hover{
  box-shadow: 0 0 1.875rem rgb(230, 137, 17);
}
</style>
<script>
import { Group, Cell, Marquee, MarqueeItem, Flexbox, FlexboxItem } from 'vux'
import { getUserCode, queryFee, scenePay } from '@/api/url.js'
import { httpGet, httpPost } from '@/utils/restful.js'
import { formatterTime, getQueryString } from '@/utils/formatter.js'
export default {
  components: {
    Group,
    Cell,
    Marquee,
    MarqueeItem,
    Flexbox,
    FlexboxItem
  },
  data () {
    return {
      code: undefined,
      msgArray: ['欢迎您停靠本停车场', '感谢使用'],
      params: {
        departmentName: '正在查询..',
        plate: '正在查询..',
        inTime: '正在查询..',
        queryTime: '正在查询..',
        duration: '正在查询..',
        price: '正在查询..'
      },
      isShow: false,
      disabled: false,
      btnText: '支付',
      formatterTime: formatterTime
    }
  },
  mounted () {
    this.getAppId()
  },
  methods: {
    getAppId () {
      let url = window.location.href
      if (url.indexOf('?') > -1) {
        let data = {
          authCode: getQueryString('code'),
          payType: 5
        }
        httpGet(getUserCode, data).then(res => {
          this.params.authCode = res.data
          this.getOrder()
        }).catch(() => {
        })
      }
    },
    // 获取订单
    getOrder () {
      let self = this
      let url = window.location.href
      if (url.indexOf('?') > -1) {
        let data = {
          departmentId: getQueryString('d'),
          outChannelId: getQueryString('c'),
          plate: decodeURIComponent(getQueryString('p')),
          payScene: Number(getQueryString('s')),
          payType: 5,
          authCode: this.params.authCode
        }
        httpPost(queryFee, data).then(res => {
          if (res.code === 1) {
            self.params = Object.assign(data, res.data)
            if (self.params.price === 0 || self.params.plate.length <= 6) {
              var confirm = window.confirm('当前应付金额为0元，请退出！')
              if (confirm) {
                if (window.WeixinJSBridge) window.WeixinJSBridge.invoke('closeWindow', {}, function (res) {})
              } else {
                if (window.WeixinJSBridge) window.WeixinJSBridge.invoke('closeWindow', {}, function (res) {})
              }
            } else {
              self.isShow = true
            }
          } else {
            self.isShow = false
            this.$vux.toast.text(res.message, 'bottom')
          }
        }).catch(() => {
          self.isShow = false
          this.$vux.toast.text('服务器连接失败', 'bottom')
        })
      } else {
        self.isShow = false
        this.$vux.toast.text('链接返回错误!', 'bottom')
        if (window.WeixinJSBridge) window.WeixinJSBridge.invoke('closeWindow', {}, function (res) {})
      }
    },
    // 微信支付
    goPay: function () {
      var vm = this
      if (!vm.disabled) {
        vm.btnText = '请求中...'
        vm.disabled = true
        httpPost(scenePay, this.params).then(res => {
          vm.btnText = '支付中...'
          vm.disabled = true
          let data = res.data
          if (typeof window.WeixinJSBridge === 'undefined') {
            if (document.addEventListener) {
              document.addEventListener('WeixinJSBridgeReady', vm.onBridgeReady(data), false)
            } else if (document.attachEvent) {
              document.attachEvent('WeixinJSBridgeReady', vm.onBridgeReady(data))
              document.attachEvent('onWeixinJSBridgeReady', vm.onBridgeReady(data))
            }
            // vm.disabled = false
          } else {
            vm.onBridgeReady(data)
          }
        }).catch((err) => {
          console.log(err)
          this.$vux.toast.text('服务器错误，请稍后再试!', 'bottom')
          vm.btnText = '支付'
          vm.disabled = false
        })
      }
    },
    onBridgeReady: function (data) {
      var vm = this
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
            vm.btnText = '支付成功'
            let paramsJson = JSON.stringify(Object.assign(vm.params, {payTime: vm.formatterTime(new Date())}))
            vm.$router.push({path: '/CYWeChatPay/tip/', query: {paramas: `${paramsJson}`}})
          } else {
            vm.btnText = '支付已取消'
            vm.disabled = false
          }
        }
      )
    }
  }
}
</script>

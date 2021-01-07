<template>
    <div>
        <div class="box text-c" v-if="isscan">
            <van-button round type="info" icon="scan" class="scan" @click="scaning"></van-button>
            <div class="fc-grey describe">
                <p>扫一扫设备上的二维码进行绑定</p>
            </div>
        </div>
        <template v-else>
          <div class="info">
            <div class="title">请填写设备信息</div>
            <van-cell-group>
              <van-field label="MAC地址" v-model.trim="form.mac" @blur.prevent="onblurForWX" disabled />
              <van-field placeholder="请输入通道名称" label="通道名称" v-model.trim="form.localName" @blur.prevent="onblurForWX" />
              <van-cell title="出入口状态" is-link :value="typeval" @click="showPicker = true" />
            </van-cell-group>
          </div>
          <div class="btnbox">
            <van-button block class="btn mar-b-15" @click="isscan = true" >重新扫一扫</van-button>
            <van-button type="info" block class="btn" @click="next">下一步</van-button>
          </div>
        </template>
        <van-popup v-model="showPicker" position="bottom" safe-area-inset-bottom>
          <van-picker
            show-toolbar
            :columns="columns"
            value-key="value"
            @cancel="showPicker = false"
            @confirm="onConfirm"
          />
        </van-popup>
    </div>
</template>

<script>
import wx from 'weixin-js-sdk'
import { Picker, Step, Steps } from 'vant'
import { getParam } from '@/utils/formatter'
import { sweep, checkMacUsed } from '@/api/url'
import isOS from '@/utils/isOS'
import onblurMixin from '@/mixin/onblurMixin'
export default {
  mixins: [ onblurMixin ],
  components: {
    [Picker.name]: Picker,
    [Step.name]: Step,
    [Steps.name]: Steps
  },
  data () {
    return {
      type: this.$route.params.type,
      isscan: true,
      form: {
        localName: '通道1',
        type: undefined,
        mac: ''
      },
      showPicker: false,
      columns: [
        {id: 0, value: '入口'},
        {id: 1, value: '出口'}
      ],
      typeval: '',
      addloading: false,
      isSignature: true,
      active: 1
    }
  },
  created () {
    // if (isOS() === 'iOS') {
    //   if (location.href.indexOf('#reloaded') === -1) {
    //     location.href = location.href + '#reloaded'
    //     location.reload()
    //     return
    //   }
    // }
    this.getWXConfig()
  },
  mounted () {
    if (this.$route.query.a === 123) {
      this.isscan = true
    }
    this.onConfirm(this.columns[0])
  },
  methods: {
    getWXConfig () {
      const ToastLoading = this.$toast.loading({ mask: true, message: '加载中...', position: 'middle', duration: 0 })
      let url = window.location.href.split('#')[0]
      if (isOS() === 'iOS') {
        url = this.$store.state.url.split('#')[0]
      }
      console.log('发起信息请求：', sweep, 'appid: ', this.$store.getters.appId, '地址：', url)
      // 开发环境调用微信扫码默认信息
      if (process.env.NODE_ENV === 'development') {
        console.log('开发环境。。。', process.env.NODE_ENV)
        wx.config({
          debug: true,
          appId: 'wx023544aa74a35288',
          timestamp: '1591612208',
          nonceStr: 'd8078d57182a429e880614f7ae7093b2',
          signature: 'ab197c4338c777cf18a34fa583ac66f01be9e95d',
          jsApiList: ['scanQRCode']
        })
      } else if (process.env.NODE_ENV === 'production') {
        /** ********  【 生产 】  **********/
        console.log('生产环境。。。', process.env.NODE_ENV)
        this.$http.post(sweep, {
          appId: this.$store.getters.appId,
          url: url
        }).then((res) => {
          console.log('调用微信成功信息： ', res)
          wx.config({
            debug: false,
            appId: res.data.appId,
            timestamp: res.data.timestamp,
            nonceStr: res.data.nonceStr,
            signature: res.data.signature,
            jsApiList: ['scanQRCode']
          })
          wx.ready(() => {
            ToastLoading.clear()
            console.log('js-sdk 配置成功')
          })
          wx.error(() => {
            ToastLoading.clear()
            console.log('js-sdk 配置失败')
          })
        }).catch((err) => {
          console.log('调用微信失败信息： ', err)
          ToastLoading.clear()
          this.$toast('微信签名失败')
          this.isSignature = false
          // 测试
          console.log('微信签名失败', err)
        })
      }
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
              _this.form.mac = _this.headleMac(mac.toLocaleUpperCase())
              _this.next()
            } else {
              // _this.$toast.fail('未能获取到MAC地址')
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
      // if (this.isSignature) {
      //   this.isscan = false
      // } else {
      //   this.$toast('扫一扫调用失败')
      // }
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
    onConfirm (value, index) {
      this.form.type = value.id
      this.typeval = value.value
      this.showPicker = false
    },
    next () {
      // const localName = this.form.localName
      // const type = this.form.type
      const mac = this.form.mac
      if (mac === '') {
        this.$toast.fail('MAC地址不能为空')
        return
      }
      sessionStorage.setItem('mac', mac)
      // if (localName === '') {
      //   this.$toast.fail('通道名称不能为空')
      //   return
      // }
      // if (type === undefined) {
      //   this.$toast.fail('请选择出入口状态')
      //   return
      // }
      this.$http.get(checkMacUsed + '/' + mac).then(() => {
        this.$toast('该设备还未被绑定，可前往注册管理员')
        this.$router.push('/register/')
      }).catch(() => {
        this.$toast('该设备已被绑定，您无法注册为管理员')
        this.$router.go(-1)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
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
    box-shadow: 0 4px 15px 0 rgba(64,158,255,.6);
    font-size: 45px;
}
.describe {
    margin-top: 30px;
    font-size: 16px;
}
.info {
  padding: 20px 15px;
  .mac {
    height: 30px;
    line-height: 30px;
    font-size: 16px;
  }
  .title {
    padding: 15px;
    font-size: 16px;
  }
}
.btnbox {
    padding: 0 20px;
    position: absolute;
    bottom: 10px;
    width: 100%;
    box-sizing: border-box;
    .btn {
        border-radius: 5px;
        overflow: hidden;
    }
}
</style>

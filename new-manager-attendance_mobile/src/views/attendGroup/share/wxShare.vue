<template>
    <div>
        <van-cell-group>
            <van-cell title="链接分享" is-link @click="handleShare" />
            <!-- <van-cell title="二维码分享" is-link /> -->
        </van-cell-group>

        <div class="mask" v-show="showShare" @click="showShare=false">
          <div class="text-r icon">
            <span class="text">请猛戳右上角分享！</span>
            <img src="@/assets/share-arrow.png" class="img" >
          </div>
        </div>
    </div>
</template>

<script>
import wx from 'weixin-js-sdk'
import { sweep } from '@/api/url'
import isOS from '@/utils/isOS'
import { getToken } from '@/utils/cookie.js'

export default {
  data () {
    return {
      showShare: false
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
  methods: {
    getWXConfig () {
      const ToastLoading = this.$toast.loading({ mask: true, message: '加载中...', position: 'middle', duration: 0 })
      let url = window.location.href.split('#')[0]
      if (isOS() === 'iOS') {
        url = this.$store.state.url.split('#')[0]
      }
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
            'updateAppMessageShareData',
            'onMenuShareAppMessage'
          ] // 必填，需要使用的JS接口列表
        })
        wx.ready(() => {
          ToastLoading.clear()
          console.log('js-sdk 配置成功')
          this.handleShare()
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
    /*
        在进入页面的时候 拿到公司和部门 (id) 放到分享链接的后面 带过去
        减少用户在填写表单时的信息
    */
    handleShare () {
      // console.log('开始邀请： ', this.$route)
      let TK = getToken()
      var shareData = {
        title: '邀请您加入考勤组',
        desc: '请尽快加入我们的考勤组，否则你的考勤情况将无法统计核实！',
        link: `${location.origin}/attendance/manager/addFace/?workCheckGroupId=${this.$route.query.id}&departmentId=${this.$store.getters.departmentId}&tk=${TK}`, // 可以以'?a = 1'的形式将参数带在后面 到链接页面去接收
        imgUrl: 'https://avatar.csdn.net/B/8/E/3_cai181191.jpg',
        success: (e) => {
          // console.log('分享成功： ', e)
          this.$toast.success('分享成功!')
        }
      }
      wx.ready(() => {
        wx.onMenuShareAppMessage(shareData)
      })
      this.showShare = true
    }
  }
}
</script>

<style lang="scss" scoped>
.mask {
  color: #fff;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
  background-color: rgba(0,0,0,.7);
  height: 100%;
  .text {
    font-size: 14px;
    letter-spacing: 2px;
  }
  .icon {
    padding-top: 50px;
    padding-right: 40px;
    .img {
      object-fit: contain;
      height: 100px;
    }
  }
}
</style>

<template>
  <!-- 点击广告跳转页 -->
  <div></div>
</template>
<script>
import { addAdvClick } from '@/api/url.js'
import { httpPost, getQueryString } from '@/utils/restful.js'
export default {
  data () {
    return {
    }
  },
  created () {
    let url = getQueryString('u')
    let advId = getQueryString('a')
    let userId = getQueryString('o')
    let eventId = getQueryString('e')
    let departmentId = getQueryString('d')
    let params = {
      eventId: Number(eventId),
      advId: Number(advId),
      userId: Number(userId),
      departmentId: Number(departmentId)
    }
    // this.$toast({message: params, position: 'bottom'})
    httpPost(addAdvClick, params).then(res => {
      // 直接跳转到广告页面
      if (res.code === 1) {
        window.location.href = decodeURIComponent(url)
      } else {
        this.$vux.toast.text('链接已失效,请返回', 'bottom')
        var ua = window.navigator.userAgent.toLowerCase()
        if (ua.indexOf('micromessenger') !== -1) {
          // 微信浏览器关闭页面
          // eslint-disable-next-line
          WeixinJSBridge.invoke('closeWindow', {}, function (res) {
          })
        } else {
          // 其他js
          window.close()
          // history.back()
        }
      }
    }).catch(() => {
      this.$vux.toast.text('系统错误,请返回', 'bottom')
      var ua = window.navigator.userAgent.toLowerCase()
      if (ua.indexOf('micromessenger') !== -1) {
        // 微信浏览器关闭页面
        // eslint-disable-next-line
        WeixinJSBridge.invoke('closeWindow', {}, function (res) {
        })
      } else {
        // 其他js
        window.close()
        // history.back()
      }
    })
  }
}
</script>
<style lang="scss" scoped>
  .out{
    font-size: 14px;
    .in{
      color: red;
    }
  }
</style>

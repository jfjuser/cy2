<template>
  <!-- 无牌车入场 -->
  <div></div>
</template>
<script>
export default {
  data () {
    return {
    }
  },
  created () {
    var a = window.location.href
    var host = process.env.API_HOST
    var appid = 'wx915008be9bda881b'
    var redirectUrl = encodeURIComponent(host + 'view/CYWeChatPay/noPlate/index/?' + a.split('?')[1])
    // console.log(decodeURIComponent(redirectUrl))
    // alert(222222222222222, decodeURIComponent(redirectUrl))
    var url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${redirectUrl}&response_type=code&scope=snsapi_base`
    window.location.href = url
  }
}
</script>

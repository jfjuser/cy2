<template>
  <!-- 车主扫码 -->
  <div id="error">
    <div>
      <img src="./error.png" alt>
      <div id="wrong"></div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
html,body{
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
}
body{
  display: -webkit-flex;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #eeeeee;
}
#error{
  display: -webkit-flex;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 7.25rem;
  height: 7.25rem;
  background: black;
  border-radius: 8px;
  text-align: center;
  vertical-align: center;
  padding: .625rem;
  color: #ffffff;
  -webkit-animation-name: fadeIn; /*动画名称*/
  -webkit-animation-duration: 5s; /*动画持续时间*/
  -webkit-animation-iteration-count: 1; /*动画次数*/
  -webkit-animation-delay: 0s; /*延迟时间*/
  font-size: 0.8rem;
}
@-webkit-keyframes fadeIn {
  0% {
  opacity: 0; /*初始状态 透明度为0*/
  }
  100% {
  opacity: 0.7; /*结尾状态 透明度为1*/
  }
}
img{
  width: 3.75rem;
  height: 3.75rem;
}
</style>
<script>
import { ccbStaticPay } from '@/api/url.js'
import { httpGet } from '@/utils/restful.js'
export default {
  data () {
    return {
    }
  },
  created () {
    let href = window.location.href
    // let url = '/pb/pv/v1/ccb/staticPay'
    let data
    if (href.indexOf('?') > 0) {
      data = href.split('?')[1].split('.')[0]
    }
    httpGet(ccbStaticPay + '?' + data).then(res => {
      if (res.code === 1) {
        location.href = res.data.payUrl
      } else {
        document.getElementById('wrong').innerText = res.message
      }
    }).catch(() => {
      document.getElementById('wrong').innerText = '网络异常，链接失败'
    })
  }
}
</script>

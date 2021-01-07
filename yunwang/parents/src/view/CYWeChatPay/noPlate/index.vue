<template>
  <div id="app" class="container">
    <!-- <div class="park-name">车场名称</div> -->
    <div class="pass-in" @click="init">我要入场</div>
    <div class="instruction">
      <h3>使用说明</h3>
      <p>1、该功能仅适用于临牌、无牌或无法识别车牌的车辆</p>
      <p>2. 停车结束请在出口处扫专用二维码出场</p>
      <p>3. 两次扫码务必使用相同的方式，否则将无法缴费离场</p>
    </div>
  </div>
</template>
<style lang="scss" scoped>
body, html{
  margin: 0;
  padding: 0;
}

.container{
  padding: .625rem
}

.park-name{
  text-align: center;
  margin: 1.875rem 0.875rem;
  border-radius: 1.3125rem;
  border: .0625rem solid lightgrey;
  height: 2.375rem;
  line-height: 2.375rem;
  color: grey;
}

.pass-in{
  width: 10.75rem;
  height: 10.75rem;
  background: rgb(115, 216, 89);
  border-radius: 50%;
  margin: 1.875rem auto;
  opacity: 0.7;
  line-height: 10.75rem;
  text-align: center;
  color: #f7f0f0;
  box-shadow: 0 0 3.875rem rgb(173, 207, 163);
}

h3{
  /* text-align: center; */
  color: grey;
}
p{
  font-size: .875rem;
  color: grey;
  text-align: left;
}
</style>
<script>
import { noPlateIn, getUserCode } from '@/api/url.js'
import { httpGet, httpPost } from '@/utils/restful.js'
export default {
  data () {
    return {
    }
  },
  created () {
  },
  methods: {
    init () {
      let url = window.location.href
      if (url.indexOf('?') !== -1) {
        var a = url.split('?')[1]
        let data = {
          departmentId: Number(a.split('&')[0].split('=')[1]),
          channelId: a.split('&')[1].split('=')[1],
          authCode: a.split('&')[3].split('=')[1],
          payType: 5
        }
        httpGet(getUserCode, data).then(res => {
          // 这个是openId, 无牌车入场要用到
          data.authCode = res.data
          httpPost(noPlateIn, data).then(res => {
            this.$router.push({path: '/CYWeChatPay/noPlate/tip/'})
          }).catch(() => {
          })
        }).catch(() => {
        })
      }
    }
  }
}
</script>

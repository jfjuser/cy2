<template>
  <!-- 支付跳转页 -->
  <div>
    <div v-if="!loading" style="display: flex;flex-wrap: wrap;justify-content: center;align-items: center;flex-direction: column;width: 100%;">
      <icon type="waiting" style="font-size:80px;margin:100px 0 20px"></icon>
      <span>{{text1}}</span>
    </div>
    <div v-if="loading" style="display: flex;flex-wrap: wrap;justify-content: center;align-items: center;flex-direction: column;width: 100%;">
      <icon type="warn" style="font-size:80px;margin:100px 0 20px"></icon>
      <span>{{text}}</span>
    </div>
  </div>
</template>
<script>
import { Icon } from 'vux'
import { getPayUrl, getOpenId, bindPlate } from '@/api/url.js'
import { httpGet, httpPost } from '@/utils/restful.js'
import { getQueryString } from '@/utils/formatter.js'
import { setCode } from '@/utils/userInfo.js'
export default {
  data () {
    return {
      getQueryString: getQueryString,
      loading: false,
      text: '二维码暂时不能使用',
      text1: '正在加载中,请稍后'
    }
  },
  components: {
    Icon
  },
  created () {
    let url = window.location.href
    // console.log('请求地址查看： ', url)

    let keyWord = url.split('=')[1]
    // 微信用户临时身份号
    let code = this.getQueryString('code')
    // 支付二维码编号
    let c = this.getQueryString('c')
    // console.log('code码检测', code, 'c码', c)
    if (code) {
      // 是拿了openId重定向(第二次进入)的页面
      setCode(code)
      let param = {
        code: code,
        c: Number(c)
      }
      httpGet(getOpenId, param).then(res => {
        // console.log('getOpenId 1 ', res)
        console.log(res, param)
        if (!res || !res.data) {
          this.loading = true
        }
        if (!res.data.appId || !res.data.openId) {
          if (res.data.payUrl) {
            this.isOldHost(res.data.payUrl).then(res3 => {
              console.log('查看检测微信返回数据：', res3)
              // 新的修改
              window.location.href = res3
            }).catch(() => {
              this.loading = true
            })
          } else {
            this.loading = true
          }
        }
        httpPost(bindPlate, res.data).then(res2 => {
          console.log('bindPlate 2 ', res2)
          if (!res2 || !res2.data) {
            this.loading = true
          }
          if (res2.data.noNeedFollow) {
            // 已经关注过了，这是您的另一个车牌
            // console.log('查看数据： ', res2)

            /** ********  【 原始地址 】  **********/
            // window.location.href = res.data.payUrl
            this.isOldHost(res.data.payUrl).then(res3 => {
              console.log('查看检测微信返回数据：', res3)
              // 新的修改
              window.location.href = res3
            }).catch(() => {
              this.loading = true
            })
          } else {
            // 临时绑定成功,待关注提交
            this.$router.push({path: '/follow/', query: {info: res.data}})
          }
        }).catch(() => {
          this.loading = true
        })
      }).catch(() => {
        this.loading = true
      })
    } else {
      if (!keyWord) {
        this.loading = true
      }
      httpGet(getPayUrl + keyWord).then(res => {
        // console.log('测试测试111', res)
        if (!res || !res.data) {
          this.loading = true
        }
        if (res.data && res.data.url) {
          // 判断要不要去跳转关注页面
          // let data = res.data
          let data = res.data

          // var ua = window.navigator.userAgent.toLowerCase()
          // if (ua.match(/MicroMessenger/i) == 'micromessenger') {
          //   if (data.info && data.info.follow !== true && data.info.appId && data.info.appId.length > 0) {
          //     // 先请求微信去拿openId,再跳转到关注页面
          //     let appid = data.info.appId
          //     let redirectUrl = encodeURIComponent(process.env.API_HOST + 'view/pay/?' + url.split('?')[1])
          //     let followUrl = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${redirectUrl}&response_type=code&scope=snsapi_base`
          //     window.location.href = followUrl
          //   } else {
          //     // 直接跳转到支付页面
          //     window.location.href = data.url
          //   }
          // } else {
          //   // 直接跳转到支付页面
          // window.location.href = data.url
          // }
          // 暂时不走关注直接跳转到支付页面
          // data.url = data.url.replace(/^https:\/\/beta\.cytingchechang\.com/, 'http://47.106.35.188')
          // let getToOrigin = this.isOldHost(data.url)
          this.isOldHost(data.url).then(res3 => {
            console.log('pc端检测返回数据信息： ', res3)
            /** ******** 【 原始 】  **********/
            window.location.href = res3
          }).catch(() => {
            this.loading = true
          })
        } else {
          this.loading = true
        }
      }).catch((err) => {
        // console.log('测试测试222', err)

        // 显示文字
        this.text = err
        this.loading = true
      })
    }
  },
  methods: {
    isOldHost (url) {
      return new Promise((resolve, reject) => {
        let parkHost = /^http[s]?:\/\/www\.cytingchechang\.com/
        let testHost = /^http[s]?:\/\/beta\.cytingchechang\.com/
        let parkIp = /^http:\/\/112\.74\.50\.105/
        let CparkHost = 'http://cy2.40mi.com'
        // let CtestHost = 'http://47.106.35.188'
        let CtestHost = 'https://beta.cytingchechang.com'
        let getHost = null
        if (parkHost.test(url)) {
          getHost = url.replace(parkHost, CparkHost)
        } else if (testHost.test(url)) {
          getHost = url.replace(testHost, CtestHost)
        } else if (parkIp.test(url)) {
          getHost = url.replace(parkIp, CparkHost)
        } else {
          getHost = url
        }
        console.log('输出：', getHost)
        // http://47.106.35.188
        return resolve(getHost)
      })
    }
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

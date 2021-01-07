<template>
  <!-- 微信授权登录,无样式页面,仅做逻辑跳转 -->
  <div></div>
</template>
<script>
import { httpPost } from '@/utils/restful'
import { faceAILogin } from '@/api/url.js'
import { setWxInfo, setDepInfo, setFaceInfo } from '@/utils/userInfo.js'
// import { httpPost } from '@/utils/restful'
// import { faceAILogin } from '@/api/url.js'
// import { setWxInfo, setDepInfo, setFaceInfo, setMenuInfo } from '@/utils/userInfo.js'
export default {
  components: {
  },
  data () {
    return {
      openId: '',
      params: {
        account: undefined,
        source: 5
      }
    }
  },
  created () {
    // 通过authCode获取openId和其他用户信息
    // 登录人脸,获取账号
    this.fetchData()
  },
  methods: {
    // 获取列表
    fetchData () {
      // 获取openId
      // 微信用户临时身份号
      let code = this.$route.query.code
      this.params.account = this.$route.query.account
      if (!code) {
        let res = '{"code":1,"message":"成功","data":{"depInfo":{"departmentId":1615,"departmentName":"研发开发测试"},"faceInfo":{"faceUserId":4950,"m1":1,"m2":4,"m3":7,"m4":6,"m5":3,"m6":0,"m7":0},"wxInfo":{"account":"wx915008be9bda881b","unicode":"o5bzNv3vT0bIu52kJ9d6Vy3-MtmQ","userName":null,"nickName":"白米饭","phone":null,"email":null,"sex":1,"province":"广东","city":"广州","country":"中国","headImgUrl":"http://thirdwx.qlogo.cn/mmopen/vi_32/c5v338gW5ibhUxO0VnCWF1yzyZWAMJWzgsqiakvtgqrR1XfZDIib5TJCriaPVeibsia6vEyCT4vQBjUfClB5FqpaG29Q/132"},"token":null}}'
        res = JSON.parse(res)
        setWxInfo(res.data.wxInfo)
        setDepInfo(res.data.depInfo)
        setFaceInfo(res.data.faceInfo)
        this.$router.push({path: '/faceAI/userModel/'})
        let temp = Object.assign(this.params, {unicode: code})
        httpPost(faceAILogin, temp).then(res => {
          setWxInfo(res.data.wxInfo)
          setDepInfo(res.data.depInfo)
          setFaceInfo(res.data.faceInfo)
          this.$router.push({path: '/faceAI/userModel/'})
        }).catch(() => {
          this.$router.push({path: '/faceAI/userModel/'})
        })
      // if (code) {
      //   let temp = Object.assign(this.params, {unicode: code})
      //   httpPost(faceAILogin, temp).then(res => {
      //     setWxInfo(res.data.wxInfo)
      //     setDepInfo(res.data.depInfo)
      //     setFaceInfo(res.data.faceInfo)
      //     if (!res.data.wxInfo) {
      //       setMenuInfo({})
      //     }
      //     this.$router.replace({path: '/faceAI/userModel/'})
      //   }).catch(() => {
      //     setWxInfo({})
      //     setDepInfo({})
      //     setFaceInfo({})
      //     setMenuInfo({})
      //     this.$router.replace({path: '/faceAI/userModel/'})
      //     this.$vux.toast.text('微信授权失败', 'bottom')
      //   })
      } else {
        // 未登录
        this.$vux.toast.text('未授权登录,请退出重试', 'bottom')
      }
    }
  }
}
</script>
<style lang='scss' scoped>
</style>

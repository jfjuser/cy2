<template>
  <!-- 微信授权登录,无样式页面,仅做逻辑跳转 -->
  <div></div>
</template>
<script>
import { httpPost } from '@/utils/restful'
import { faceAILogin } from '@/api/url.js'
import { setWxInfo, setDepInfo, setFaceInfo, setMenuInfo, setAppid } from '@/utils/userInfo.js'
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
      // console.log('当前地址： ', window.location.href)

      // 获取openId
      // 微信用户临时身份号
      let code = this.$route.query.code
      this.params.account = this.$route.query.account
      setAppid(this.$route.query.account)
      console.log('chen appid' + this.$route.query.account)
      console.log('正在验证开发环境: .... ', process.env.NODE_ENV)
      // 开发环境 / 生产环境 配置
      // if (process.env.NODE_ENV === 'development')
      if (process.env.NODE_ENV === 'development') {
        console.log('当前环境在=> 开发环境...')
        let res = '{"code":1,"message":"成功","data":{"depInfo":{"departmentId":1615,"departmentName":"研发开发测试"},"faceInfo":{"faceUserId":4950,"m1":1,"m2":4,"m3":7,"m4":6,"m5":3,"m6":0,"m7":0},"wxInfo":{"account":"wx915008be9bda881b","unicode":"o5bzNv3vT0bIu52kJ9d6Vy3-MtmQ","userName":null,"nickName":"白米饭","phone":null,"email":null,"sex":1,"province":"广东","city":"广州","country":"中国","headImgUrl":"http://thirdwx.qlogo.cn/mmopen/vi_32/c5v338gW5ibhUxO0VnCWF1yzyZWAMJWzgsqiakvtgqrR1XfZDIib5TJCriaPVeibsia6vEyCT4vQBjUfClB5FqpaG29Q/132"},"token":null}}'

        res = JSON.parse(res)
        setWxInfo(res.data.wxInfo)
        setDepInfo(res.data.depInfo)
        setFaceInfo(res.data.faceInfo)
        // this.$router.push({path: '/faceAI/userModel/bind/zhLogin'})
        this.$router.push({path: '/faceAI/userModel/'})
        // console.log(res.data.wxInfo.unicode)
        // let temp = Object.assign(this.params, {unicode: res.data.wxInfo.unicode})
        let temp = Object.assign(this.params, {unicode: res.unicode})
        httpPost(faceAILogin, temp).then(res => {
          // console.log('开发环境登录： ', res)
          setWxInfo(res.data.wxInfo)
          setDepInfo(res.data.depInfo)
          setFaceInfo(res.data.faceInfo)

          // this.$router.push({path: '/faceAI/userModel/bind/zhLogin'})
          this.$router.push({path: '/faceAI/userModel/'})
        }).catch((err) => {
          console.log('开发环境下获取失败：', err)
          this.$vux.toast.text('未授权登录,请退出重试', 'bottom')
        })
        // if (!code) {
        // } else {
        // // 未登录
        //   this.$vux.toast.text('未授权登录,请退出重试', 'bottom')
        // }
      } else {
        console.log('当前环境在=> 生产环境...')
        if (code) {
          console.info('获取到code')
          let temp = Object.assign(this.params, {unicode: code})
          httpPost(faceAILogin, temp).then(res => {
            setWxInfo(res.data.wxInfo)
            setDepInfo(res.data.depInfo)
            setFaceInfo(res.data.faceInfo)
            if (!res.data.wxInfo) {
              setMenuInfo({})
            }
            // console.log('querys: ', this.$route.query)
            //
            // 不确定是否是这段导致无法顺利登入，
            if (this.$route.query.state === 'opendoor') { // 检测是否是要去开闸
              if (window.location.replace) {
                this.$router.replace({path: '/oneKeyOpenDoor?' + this.$route.query.state})
              } else {
                this.$router.push({path: '/oneKeyOpenDoor?' + this.$route.query.state})
              }
              return
            }
            // this.$router.replace({path: '/view/faceAI/userModel/bind/zhLogin'})
            this.$router.replace({path: '/faceAI/userModel/'})
          }).catch(() => {
            setWxInfo({})
            setDepInfo({})
            setFaceInfo({})
            setMenuInfo({})
            this.$router.replace({path: '/faceAI/userModel/bind/zhLogin'})
            // this.$router.replace({path: '/faceAI/userModel/'})
            this.$vux.toast.text('微信授权失败', 'bottom')
          })
        } else {
        // 未登录
          this.$vux.toast.text('未授权登录,请退出重试', 'bottom')
        }
      }
    }
  }
}
</script>
<style lang='scss' scoped>
</style>

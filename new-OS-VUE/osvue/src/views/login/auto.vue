<template>
  <div>
  </div>
</template>
<script>
import { httpPost } from '@/utils/restful'
import { autoLogin } from '@/api/url.js'
export default {
  created () {
    let code = this.$route.query.code
    let time = this.$route.query.time
    let self = this
    if (code && time) {
      let params = {
        code: code,
        time: time
      }
      httpPost(autoLogin, params).then(res => {
        // 判断移动还是PC浏览器
        // 跳转页面
        // 触发store里面的事件
        self.$store.dispatch('setLoginInfo', res.data).then((res) => {
          self.$router.push({ path: '/' })
        }).catch(() => {
          self.goLogin()
        })
      }).catch(() => {
        self.goLogin()
      })
    } else {
      self.goLogin()
    }
  },
  methods: {
    goLogin () {
      this.$message.error('未授权,请重新登录')
      this.$router.push({ path: '/login' })
    }
  }
}
</script>
<style lang='scss' scoped>
</style>

<template>
  <div>
      <div class="tabSetDiv">
          <div>
            <img src="@/assets/icon/icon_people_1.png" v-if="wxInfo.openid == ''" width="50" style="margin:4rem 0 0 2rem;position:relative"/>
            <img :src=wxInfo.headimgurl width="50" v-if="wxInfo.openid !== ''" style="margin:4rem 0 0 2rem;position:relative"/>
            <span style="color:#fff;position:absolute;top:5rem;left:6rem" v-if="wxInfo.openid !== ''">{{wxInfo.nickname}}</span>
            <span v-if="wxInfo.openid == ''" style="color:#fff;position:absolute;top:5rem;left:6rem">YOUR_ID</span>
            <!-- <span><img src="@/assets/set(2).png" width="25" style="position:absolute;top:2.6rem;left:85%"/></span> -->
            <span v-if="wxInfo.openid !== ''" style="color:#fff;position:absolute;top:8rem;left:2rem;font-size:0.9rem">{{wxInfo.country + ' ' + wxInfo.city}}</span>
            <CellGroup style="margin-top:15vh">
              <Cell title="意见反馈" is-link @click="feedback"></Cell>
              <!-- <Cell title="企业资源" is-link @click="comSource"></Cell> -->
              <Cell title="退出登录" is-link @click="logout"></Cell>
            </CellGroup>
          </div>
       </div>
        <van-tabbar v-model="active">
            <van-tabbar-item icon="home-o" @click="indexPage">主页</van-tabbar-item>
            <van-tabbar-item icon="comment" @click="checkMessage">消息</van-tabbar-item>
            <van-tabbar-item icon="manager-o">我的</van-tabbar-item>
        </van-tabbar>
  </div>
</template>
<script>
import { Cell, CellGroup, Dialog, Tabbar, TabbarItem } from 'vant'
import { httpPost } from '@/utils/restful'
import { unBindLogin } from '@/api/url'
export default {
  name: 'mySet',
  data () {
    return {
      active: 2,
      wxInfo: {
        city: '',
        country: '',
        headimgurl: '',
        language: '',
        nickname: '',
        province: '',
        openid: '',
        sex: '', // 1为男
        privilege: []
      }
    }
  },
  components: {
    Cell,
    CellGroup,
    'van-tabbar': Tabbar,
    'van-tabbar-item': TabbarItem
  },
  created () {
    let x = JSON.parse(localStorage.getItem('wxInfo'))
    if (x !== null) {
      this.wxInfo = x
    }
    console.log('微信data： ', this.wxInfo)
  },
  methods: {
    feedback () {
      this.$router.push('/feedback/')
    },
    comSource () {
      this.$router.push('/comSource/')
    },
    checkMessage () {
      this.$router.push('/infomation/')
    },
    indexPage () {
      this.$router.push('/indexPage/')
    },
    logout () {
      Dialog.confirm({
        title: '提示',
        message: '确认要退出登录状态？'
      })
        .then(() => {
          httpPost(unBindLogin + '/' + this.$store.getters.userId).then((res) => {
            this.$store.dispatch('WebLogOut').then(() => {
              // this.$router.push('/login/')
              var host = process.env.API_HOST
              var appid = localStorage.getItem('appid')
              var redirectUrl = encodeURIComponent(host + 'face' + '/')
              localStorage.setItem('marks', 123)
              localStorage.setItem('title', '')
              var url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${redirectUrl}&response_type=code&scope=snsapi_base`
              window.location.href = url
              // location.reload() // 为了重新实例化vue-router对象 避免bug
            })
          })
          // var a = window.location.href
          // this.$router.push('/')
        }).catch(() => {})
    }
  }
}
</script>
<style lang="scss" scoped>
.tabSetDiv{
  background: url(../../assets/myPage.png);
  background-size: 100%;
  height: 100vh;
  width:100vw;
  background-repeat: no-repeat
}
</style>

<template>
    <div class="page bgc-grey full-height box-sizing  " :style="bgimg">
        <header class="header bgc box-sizing box-shadow mar-b-20">
            <van-image class="full-img head" width="60" height="60" round>
                <template v-if="!imgUrl" v-slot:loading><van-icon name="manager-o" style="" size="30" /></template>
                <template v-else v-slot:loading><img :src="imgUrl"/></template>
            </van-image>
            <p class="text-c mar-b-10">{{userName}}</p>
            <p class="text-c">{{departmentName}}</p>
        </header>
        <section class="setbox mar-b-20 box-shadow">
            <van-cell-group>
                <van-cell title="个人信息" is-link  to="/modifyInfo/" />
                <van-cell title="修改手机号" is-link   :value="phone" to="/modifyPhone/" />
                <van-cell title="修改密码" is-link  to="/modifyPassword/" />
                <van-cell title="新注册一个公司"  is-link to="/register/" />
            </van-cell-group>
        </section>
        <section class="setbox mar-b-20 box-shadow">
            <van-cell-group>
                <van-cell title="申请消息" is-link  to="/message/" label="可查看申请消息" />
                <van-cell title="帮助中心" is-link  to="/helpCenter/" />
                <!-- <van-cell title="安装说明" is-link to="/details/" /> -->
            </van-cell-group>
        </section>
        <!-- //margin-bottom:50px -->
        <section style="" class="setbox mar-b-20 box-shadow">
          <van-button type="danger" block style="btn" @click="logout">退出登录</van-button>
        </section>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { userInfo } from '@/api/url'
import getImg from '@/assets/images/img/manager.png' // 默认头像
export default {
  data () {
    return {
      imgUrl: getImg,
      bgimg: {
        background: 'url(' + require('@/assets/img/me-bg.png') + ') no-repeat top',
        backgroundSize: '100% 20%'
      }
    }
  },
  computed: {
    ...mapGetters([
      'userName',
      'phone',
      'departmentName'
    ])
  },
  created () {
    // this.getUserInfo()
    // this.imgUrl = JSON.parse(localStorage.getItem('wxInfo')).headImgUrl
    // console.log(JSON.parse(localStorage.getItem('wxInfo')))

  },
  methods: {
    logout () {
      this.$dialog.confirm({
        title: '提示',
        message: '确定退出当前登录状态？'
      }).then(() => {
        this.$store.dispatch('WebLogOut')
        this.$router.push('/login/')
      }).catch(() => {})
    },
    getUserInfo () {
      this.$http.get(userInfo + '/' + this.$store.getters.userId).then(res => {
        if (res.data) {
          this.$store.dispatch('setUserInfo', res.data)
        }
      }).catch(() => {})
    }
  },
  activated () {
    this.getUserInfo()
  }
}
</script>

<style lang="scss" scoped>

.page {
    padding: 0 20px;
    padding-top: 80px;
    min-height: 100%;
    width: 100%;
    padding-bottom: calc(1.33333rem + 1px);
    overflow: auto;
    .mar-b-20 {
        margin-bottom: 20px;
    }
}
.full-img >>> {
  border-radius: 50%;
  overflow: hidden;
  img{
    width: 100%;
    height: 100%;
    border-radius: 50%;
    overflow: hidden;
    display: block;
  }
  .van-image__loading{
    border-radius: 50%;
    padding: .2rem;
    box-sizing: border-box;
    background: #ffff;
  }
}
.header {
    height: 100px;
    border-radius: 10px;
    position: relative;
    padding-top: 45px;
    .head {
        position: absolute;
        left: 50%;
        top: -25px;
        transform: translateX(-50%);
        border: 2px solid #eee;
    }
}
.setbox {
    border-radius: 10px;
    overflow: hidden;
}
.btn {
    border-radius: 5px;
    overflow: hidden;
}
</style>

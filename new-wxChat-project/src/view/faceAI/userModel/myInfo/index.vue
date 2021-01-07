<template>
  <div class="face-theme">
    <div v-html="wxInfo.nickName" class="info-name mybox">
      <!-- {{wxInfo.nickName}} -->
    </div>
    <div class="info-img"><img :src="wxInfo.headImgUrl"/></div>
    <div class="info-list mybox">
      <flexbox class="info-point">
        <flexbox-item class="info-point-box info-point-line">
          <div class="info-point-num">{{pointInfo.totalPoints ? pointInfo.totalPoints : 0}}</div>
          <div class="info-point-text">总积分</div>
        </flexbox-item>
        <flexbox-item class="info-point-box">
          <div class="info-point-num">{{pointInfo.restPoints ? pointInfo.restPoints : 0}}</div>
          <div class="info-point-text">剩余</div>
        </flexbox-item>
      </flexbox>
      <div class="info-list-ul">
        <div class="info-list-li" @click="handleClickFun(1)">
          <img src="@/assets/icon/wx/user/icon-details.png"/>
          <span class="info-list-li-text">个人信息</span>
        </div>
        <div class="info-list-li" @click="handleClickFun(2)">
          <img src="@/assets/icon/wx/user/icon-resources.png"/>
          <span class="info-list-li-text">积分记录</span>
        </div>
        <div class="info-list-li" @click="handleClickFun(3)">
          <img src="@/assets/icon/wx/user/icon-point.png"/>
          <span class="info-list-li-text">&#x3000;充&#x3000;值</span>
        </div>
        <!-- <div class="info-list-li" @click="handleClickFun(4)">
          <img src="@/assets/icon/wx/user/icon-face-menager.png"/>
          <span class="info-list-li-text">人脸管理</span>
        </div> -->
        <div class="info-list-li" @click="handleClickFun(5)">
          <img src="@/assets/icon/wx/user/icon_dispose.png"/>
          <span class="info-list-li-text">意见反馈</span>
        </div>
      </div>
    </div>
    <tabbar class="menu-body">
      <tabbar-item class="menu-text" link="/faceAI/userModel/">
        <img class="menu-icon" slot="icon" src="@/assets/icon/wx/menu-home.png">
        <span slot="label">首页</span>
      </tabbar-item>
      <tabbar-item class="menu-text" link="/faceAI/myInfo/" :selected="true">
        <img class="menu-icon" slot="icon" src="@/assets/icon/wx/menu-user.png">
        <span slot="label">个人中心</span>
      </tabbar-item>
    </tabbar>
  </div>
</template>
<script>
import { getWxInfo } from '@/utils/userInfo.js'
import { Tabbar, TabbarItem, Flexbox, FlexboxItem } from 'vux'
import { httpGet } from '@/utils/restful'
import { getPointsInfo } from '@/api/url.js'
export default {
  components: {
    Tabbar,
    TabbarItem,
    Flexbox,
    FlexboxItem
  },
  data () {
    return {
      wxInfo: {},
      pointInfo: {}
    }
  },
  created () {
    this.wxInfo = getWxInfo()
    if (this.wxInfo === undefined) {
      // 跳去登录
      window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx915008be9bda881b&redirect_uri=https%3A%2F%2Fbeta.cytingchechang.com%2Fview%2FfaceAI%2FuserLogin%2F%3Faccount%3Dwx915008be9bda881b&response_type=code&scope=snsapi_base'
    }
    this.loadPointsInfo()
  },
  methods: {
    loadPointsInfo () {
      let params = {
        account: this.wxInfo.account,
        unicode: this.wxInfo.unicode
      }
      httpGet(getPointsInfo, params).then(res => {
        this.pointInfo = res.data
      }).catch(() => {
        // this.$vux.toast.text('加载积分失败', 'bottom')
      })
    },
    handleClickFun (id) {
      switch (id) {
        case 1:
          this.$router.push({path: '/faceAI/mySimpleInfo/'})
          break
        case 2:
          this.$router.push({path: '/faceAI/pointRecords/'})
          break
        case 3:
          this.$router.push({path: '/faceAI/recharge/'})
          break
        case 4:
          this.$router.push({path: '/faceAI/faceManage/'})
          break
        case 5:
          this.$router.push({path: '/wx/suggest/'})
          break
      }
    }
  }
}
</script>
<style lang='scss' scoped>
.info-name {
  position: fixed;
  bottom: 78%;
  left: 6%;
  height: 3%;
  max-width: 30%;
}
.info-img {
  position: fixed;
  bottom: 70%;
  right: 6%;
  height: 5rem;
  width: 5rem;
  background-color: #fff;
  border: .0625rem solid rgb(243, 146, 36);
  border-radius: 50%;
  z-index: 10001;
  img {
    padding: 5px;
    border-radius: 50%;
    height: 4.375rem;
    width: 4.375rem;
  }
}
.info-list {
  position: fixed;
  bottom: 15%;
  left: 6%;
  width: 75%;
  height: 60%;
  .info-point {
    text-align: center;
    width: 80%;
    padding: .9375rem 0;
    .info-point-num {
      color: rgb(243, 146, 36);
    }
    .info-point-text {
      padding: .625rem 0 0;
      font-size: 12px;
    }
    .info-point-line {
      border-right: 1px dashed rgb(243, 146, 36);
    }
  }
  .info-list-ul {
    padding: 0 0 1.875rem;
    margin: 0 auto;
    width: 80%;
    .info-list-li {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 5%;
      padding-bottom: .250rem;
      border-bottom: 1px solid #40D1E7;
      cursor: pointer;
      .info-list-li-text {
        letter-spacing: .625rem;
        width: 100%;
        margin-left: 30%;
        height: 28px;
      }
      img {
        height: 2.5rem;
      }
    }
  }
}
.menu-icon {
  width: 32px;
  height: 32px;
  margin: 0 -10px;
}
.menu-text {
  text-decoration: none !important;
  text-align: center;
}
</style>

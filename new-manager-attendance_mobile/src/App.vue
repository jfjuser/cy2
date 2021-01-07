<template>
  <div id="app" ref="idealist">
    <!-- SwipeLeft -->
    <!-- <keep-alive include="SwipeLeft"><SwipeLeft></SwipeLeft></keep-alive> -->
    <!-- <keep-alive include="SwiperTouch">

    </keep-alive>   v-if="!isIos"-->
    <!-- <div><SwiperTouch></SwiperTouch></div> -->

    <keep-alive :max="10">
      <router-view
        v-if="$route.meta.keepAlive"
        v-wechat-title="$route.meta.title"
      />
    </keep-alive>
    <router-view
      v-if="!$route.meta.keepAlive"
      v-wechat-title="$route.meta.title"
    />

 <!-- 使用消息提示组件 -->
    <HintMsg v-if="isHome" />

    <van-tabbar
      @change="pageTabChange"
      v-model="active"
      safe-area-inset-bottom
      v-if="navshow"
      route
    >
      <van-tabbar-item name="home" icon="wap-home-o" to="/home/"
        >首页</van-tabbar-item
      >
      <van-tabbar-item
        name="search"
        icon="add"
        class="add fc-blue"
        to="/equipment/"
        :data-step="homeSteps.cameraManage.step"
        :data-intro="homeSteps.cameraManage.intro"
        :data-position="homeSteps.cameraManage.position"
        :data-disable-interaction="true"
      >
        <span class="fc-grey">设备管理</span>
      </van-tabbar-item>

      <!-- 新增 个人中心 组列表  icon="user-o"-->
      <van-tabbar-item class="me-dropdown-menus">
        <div class="me-dropdown-menus-item">
          <van-dropdown-menu direction="up" :overlay="true">
            <!-- v-model="value" -->
            <van-dropdown-item
              title="个人中心"
              :options="option"
              z-index="10000"
              @open="openToLink"
              @close="closeToLink"
              @change="onEventDropdownItem"
            />
          </van-dropdown-menu>
        </div>
      </van-tabbar-item>

      <!-- 默认 -->
      <!-- <van-tabbar-item name="friends" icon="user-o" to="/me/">我的</van-tabbar-item> -->
    </van-tabbar>
  </div>
</template>

<script>
import { Tabbar, TabbarItem } from 'vant'
import { homeSteps } from '@/utils/intro'
import isOS from '../src/utils/isOS'
import SwipeLeft from '@/components/SwipeLeft'
import SwiperTouch from './components/SwiperTouch'
import HintMsg from '@/components/HintMsg'
export default {
  name: 'App',
  components: {
    'van-tabbar': Tabbar,
    'van-tabbar-item': TabbarItem,
    SwipeLeft,
    SwiperTouch,
    HintMsg
  },
  data () {
    return {
      isHome: false,
      active: 'home',
      homeSteps,
      option: [
        // registerCompany searchEquipment
        {
          text: '审批员管理',
          value: 3,
          icon: 'user-o',
          to: { path: '/approval/' }
        },
        // {
        //   text: '注册公司',
        //   value: 2,
        //   icon: 'newspaper-o',
        //   to: { path: '/registerCompany/' }
        // },
        {
          text: '人脸录制管理',
          value: 1,
          icon: 'friends-o',
          to: { path: '/faceAI/' }
        },
        { text: '我的', value: 0, icon: 'user-o', to: { path: '/me/' } }
      ],
      value: 1,
      oldFromLink: null,
      isShowOpenLink: false,
      clientH: '',
      isIos: false
    }
  },
  created () {
    if (isOS() === 'iOS') {
      // 处理Ios兼容
      this.isIos = true
    } else {
      this.isIos = false
    }

    // 检测是否是首页
    if (this.$route.path === '/home/') {
      this.isHome = true
    } else {
      this.isHome = false
    }
  },
  mounted () {
    if (isOS() === 'iOS') {
      // 处理Ios兼容
      this.clientH = document.documentElement.clientHeight
      this.getEquipmentHeight()
    }
  },
  computed: {
    navshow () {
      const url = this.$route.path
      const urlarr = ['/me/', '/home/']
      if (urlarr.includes(url)) return true
      return false
    }
  },
  methods: {
    onEventDropdownItem (e) {
      if (this.isShowOpenLink) {
        let windowRulName = window.location.pathname
        let isHas = this.option.some(item => item.value === e && item.to)
        let toLinks
        if (isHas) {
          toLinks = this.option.filter(item => item.value === e)[0].to
          let regExp = new RegExp(`${toLinks.path}`, 'gim')
          if (!regExp.test(windowRulName)) {
            this.$router.push(toLinks)
          }
        }
      }
    },
    openToLink () {
      this.isShowOpenLink = true
    },
    closeToLink () {
      this.isShowOpenLink = false
    },
    pageTabChange (eve) {
      // if (eve !== 2) this.value = false
    },
    getEquipmentHeight () {
      // console.log('当前的： ', this.clientH)
      document.body.style.height = document.documentElement.clientHeight + 100 + 'px !important'
      setTimeout(() => {
        let lastHeight = document.documentElement.clientHeight
        // console.log('之后的： ', lastHeight)
        if (this.clientH !== lastHeight) {
          document.body.style.height = lastHeight
        }
      }, 2000)
    }
  }
}
</script>

<style>
html,
body {
  /* height: 100%;
  width: 100%;
  overflow: auto !important; */
}
#app {
  height: 100%;
  width: 100%;
  overflow: auto !important;
  /* padding-bottom: 50px; */
}
.van-tabbar {
  border-top: 1px solid #eee;
}
.back-swipeleft {
  height: 100%;
  width: 100%;
}
.menu-container {
  height: 100%;
  width: 100%;
  background: #000 !important;
  position: relative;
  z-index: 11111111111;
}
.baseBox {
  min-height: 100%;
  overflow: auto;
  padding-bottom: calc(1.17333rem + 1rem + 1px);
}
</style>

<style lang="scss" scoped>
.add {
  /deep/ .van-tabbar-item__icon {
    font-size: 30px;
    margin-bottom: 2px;
  }
}

.me-dropdown-menus.van-tabbar-item >>> {
  display: flex;
  justify-content: center !important;
  align-items: center !important;
  width: 100%;
  height: 100%;
  flex-direction: row;
  text-align: center;
  line-height: auto;

  .van-tabbar-item__icon {
    // flex: 1;
    // display: flex;
    // justify-content: flex-end !important;
    // align-items: center !important;
    width: 0;
    height: 0;
  }
  .van-tabbar-item__text {
    flex: 1;
    display: flex;
    justify-content: flex-start !important;
    align-items: center !important;
    // margin-bottom: 0.13333rem;
    .me-dropdown-menus-item {
      background: transparent;
      height: 100%;
      width: 100%;
      .van-ellipsis {
        font-size: 0.3rem;
      }
      .van-dropdown-menu__bar {
        box-shadow: none;
      }
    }
  }
  .van-popup--bottom {
    width: 50%;
    left: 50% !important;
    z-index: 1111111;
  }
}
</style>

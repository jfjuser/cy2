<template>
  <div class="app-wrapper" :class="classObj">
    <!-- 判断显示隐藏 -->
    <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside"></div>
    <Sidebar class="sidebar-container"></Sidebar>
    <div class="main-container">
      <NavMenu v-if="isNewVersion"/>
      <!-- 导航 -->
      <Navbar></Navbar>
      <app-main></app-main>
      <div class="toggle-version" v-if="type === 1">
        <el-button size="mini" @click="toggleVersion(0)" v-if="version===1"><div style="margin-bottom: 5px;">返回</div>旧版</el-button>
        <el-button type="primary" size="mini" @click="toggleVersion(1)" v-if="version===0"><div style="margin-bottom: 5px;">试用</div>新版</el-button>
      </div>
    </div>
    <el-dialog
        title="网页引导"
        :visible.sync="showGuide"
        :show-close="false"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        width="25%">
        <div>欢迎使用云平台。</div>
        <span slot="footer" class="dialog-footer">
            <el-button type="info" @click="handleIgnore" :disabled="disabledTip">不再提醒{{timeNum === 0 ? '' : `（${timeNum}）`}}</el-button>
            <guide-button ><el-button @click="dialogVisibleGuide = false">下一步</el-button></guide-button>
        </span>
      </el-dialog>
  </div>
</template>
<script>

import { Navbar, Sidebar, AppMain, NavMenu } from './components'
import ResizeMixin from './mixin/ResizeHandler'
import GuideButton from '@/components/cloudMaintain'
// import { arr } from '@/components/cloudMaintain/route'
export default {
  name: 'home',
  components: {
    Navbar,
    Sidebar,
    AppMain,
    NavMenu,
    GuideButton
  },
  data () {
    return {
      dialogVisibleGuide: true,
      timeNum: 3,
      disabledTip: true
    }
  },
  watch: {
    // $route (to, from) {
    //   if (to.name !== from.name && arr[to.path]) {
    //     window.localStorage.setItem('firstShowGuideN', '')
    //     this.dialogVisibleGuide = true
    //   }
    // }
  },
  mixins: [ ResizeMixin ],
  computed: {
    sidebar () {
      return this.$store.state.app.sidebar
    },
    device () {
      return this.$store.state.app.device
    },
    showGuide () {
      // 是否不再提醒 && 是否人脸平台 && 是否新版本 && 是否显示
      if (!window.localStorage.getItem('firstShowGuideN') && this.$store.getters.type === 1 && this.dialogVisibleGuide) {
        this.countdown()
        // 显示新版本帮助
        return true
      } else {
        return false
      }
    },
    classObj () {
      return {
        hideSidebar: !this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    },
    type () {
      return this.$store.getters.type
    },
    version () {
      return this.$store.getters.version
    },
    isNewVersion () {
      return this.type === 1 && this.version === 1
    }
  },
  created () {
    // console.log(this.$route)
    // if (!arr[this.$route.path]) {
    //   window.localStorage.setItem('firstShowGuideN', '')
    //   this.dialogVisibleGuide = false
    // } else {
    //   window.localStorage.setItem('firstShowGuideN', '')
    //   this.dialogVisibleGuide = true
    // }
  },
  methods: {
    // "不再提醒"倒计时
    countdown () {
      if (!this.disabledTip) return
      const timer = window.setInterval(() => {
        this.timeNum--
        if (this.timeNum <= 0) {
          window.clearInterval(timer)
          this.disabledTip = false
        }
      }, 1000)
    },
    // 设置不再提醒
    handleIgnore () {
      window.localStorage.setItem('firstShowGuideN', 1)
      console.log(this.$route)
      this.dialogVisibleGuide = false
    },
    handleClickOutside () {
      this.$store.dispatch('CloseSideBar', { withoutAnimation: false })
    },
    toggleVersion (ver) {
      this.$store.dispatch('useVersion', {ver, type: 'toggle'})
      this.$nextTick(() => {
        window.scrollTo(0, 0)
        if (ver === 1) {
          // 新版本跳首页
          this.$router.push('/home')
        }
      })
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/mixin.scss";
  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;
  }
  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }
  .toggle-version {
    position: fixed;
    right: 0;
    bottom: 80px;
    z-index: 2000;
  }
</style>

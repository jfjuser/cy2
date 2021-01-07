<template>
  <div>
    <template v-if="title">
      <van-nav-bar :title="title" left-text="返回" left-arrow fixed @click-left="onClickLeft"></van-nav-bar>
      <div class="top-height" ></div>
    </template>

    <router-view/>

    <template v-if="tabShow">
      <div class="bottom-height" ></div>
      <van-tabbar safe-area-inset-bottom route>
        <van-tabbar-item icon="wap-home-o" to="/home/">首页</van-tabbar-item>
        <van-tabbar-item icon="apps-o" to="/menu/">功能菜单</van-tabbar-item>
        <van-tabbar-item icon="user-o" to="/me/">我的</van-tabbar-item>
      </van-tabbar>
    </template>
    <backtop v-else></backtop>
  </div>
</template>

<script>
import { Tabbar, TabbarItem, NavBar } from 'vant'
import backtop from '@/components/backtop'
export default {
  name: 'home',
  components: {
    'van-tabbar': Tabbar,
    'van-tabbar-item': TabbarItem,
    [NavBar.name]: NavBar,
    backtop
  },
  data () {
    return {

    }
  },
  computed: {
    tabShow () {
      const url = this.$route.path
      const urlarr = ['/me/', '/home/', '/home', '/menu/']
      if (urlarr.includes(url)) return true
      return false
    },
    title () {
      return this.$route.meta.title
    }
  },
  methods: {
    onClickLeft () {
      history.go(-1)
    }
  }
}
</script>

<style lang="scss" scoped>
.top-height {
  height: 46px;
  // padding-top: 46px;
}
.bottom-height {
    height: 50px;
}
</style>

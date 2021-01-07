<template>
  <div id="app" v-cloak>
  <keep-alive>
    <router-view v-if="$route.meta.keepAlive"></router-view>
</keep-alive>
  <transition name="fade">
<router-view v-if="!$route.meta.keepAlive"></router-view>
  </transition>

    <div v-if="isDev" class="qrcode-wrap">
      <!-- <van-button type="info" @click="qrcodeShow = !qrcodeShow" class="qrcode-button">在线真机测试</van-button> -->
      <transition name="van-slide-left">
        <TestQrcode v-show="qrcodeShow" class="qrcodes" :value="qrcode.value" :size="qrcode.size"></TestQrcode>
      </transition>
    </div>
  </div>
</template>

<script>
import TestQrcode from 'qrcode.vue'
export default {
  name: 'App',
  data () {
    return {
      qrcodeShow: false,
      isDev: false,
      qrcode: {
        value: window.location.origin,
        size: 200

      }
    }
  },
  components: {
    TestQrcode
  },
  created () {
    if (process.env.NODE_ENV === 'development') {
      this.isDev = true
    }
  }
}
</script>

<style>
html,
body {
  width: 100%;
  height: 100%;
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  width: 100%;
  height: 100%;
  /* text-align: center; */
  /* color: #2c3e50; */
  /* margin-top: 60px; */
  overflow: auto !important;
}
</style>
<style scoped>
.qrcodes {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.qrcode-button {
  position: absolute;
  right: 0;
  bottom: 100px;
}
[v-cloak] {
 display: none;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter/* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;

}
.fade-leave-to{
    opacity: 0;
    display:none
}
</style>

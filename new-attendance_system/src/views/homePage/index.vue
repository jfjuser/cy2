<template>
  <div class="app-wrapper">
    <div class="main-container">
      <!-- 导航 -->
      <Navbar></Navbar>
      <NavMenu></NavMenu>
      <app-main></app-main>
    </div>
  </div>
</template>

<script>
import { Navbar, AppMain, NavMenu } from './components'

export default {
  name: 'home',
  components: {
    Navbar,
    AppMain,
    NavMenu
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
  .main-container {
    min-height: 100%;
    background-color: #eeeeee;
  }
</style>

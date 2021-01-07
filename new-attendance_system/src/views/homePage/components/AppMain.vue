<template>
  <section class="app-main">
    <template v-if="$route.meta.title !== '首页'">
      <el-page-header :content="$route.meta.title" class="page-header" @back="goBack"/>
    </template>
    <transition name="fade" mode="out-in">
      <router-view></router-view>
    </transition>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  methods: {
    goBack () {
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped>
.page-header {
  padding: 20px;
  padding-bottom: 0;
}
</style>

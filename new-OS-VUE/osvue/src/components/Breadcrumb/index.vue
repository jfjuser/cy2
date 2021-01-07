<template>
  <el-breadcrumb class="app-breadcrumb" separator="/">
    <transition-group name="breadcrumb">
      <template v-for="(item,index)  in levelList">
        <el-breadcrumb-item :key="item.path" v-if="item.meta.title">
          <span v-if="item.redirect==='noredirect' || index==levelList.length-1" class="no-redirect">{{item.meta.title}}</span>
          <span v-else-if="!item.name">{{item.meta.title}}</span>
          <router-link v-else :to="item.redirect || item.path">{{item.meta.title}}</router-link>
        </el-breadcrumb-item>
      </template>
    </transition-group>
  </el-breadcrumb>
</template>

<script>
export default {
  created () {
    this.getBreadcrumb()
  },
  data () {
    return {
      levelList: null
    }
  },
  watch: {
    $route () {
      this.getBreadcrumb()
    }
  },
  methods: {
    getBreadcrumb () {
      let matched = this.$route.matched.filter(item => item.meta && item.meta.title)
      const first = matched[0]
      // 判断是否为首页
      if (!this.isHome(first)) {
        matched = [{path: '/home', name: 'home', meta: { title: '首页' }}].concat(matched)
      }
      this.levelList = matched.filter(item => item.meta && item.meta.title && item.meta.breadcrumb !== false)
    },
    isHome (route) {
      const name = route && route.name
      if (!name) {
        return false
      }
      return name.trim().toLocaleLowerCase() === 'home'.toLocaleLowerCase()
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .app-breadcrumb.el-breadcrumb {
    display: inline-block;
    font-size: 14px;
    line-height: 50px;
    margin-left: 10px;
    .no-redirect {
      color: #97a8be;
      cursor: text;
    }
  }
</style>

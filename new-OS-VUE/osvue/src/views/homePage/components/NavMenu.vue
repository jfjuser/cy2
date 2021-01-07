<template>
    <el-tabs v-model="activeName" @tab-click="handleClick">
        <template  v-for="(item, index) in routes">
            <template v-if="item.children && item.children[0] && item.children[0].name === 'home'">
              <!-- 是否显示首页 -->
                <el-tab-pane name="home" :key="index">
                    <span slot="label"><i :class="item.children[0].meta.icon"></i> {{item.children[0].meta.title}}</span>
                </el-tab-pane>
            </template>
            <template v-else>
              <el-tab-pane :name="item.meta.title" :key="index" v-if="!item.hidden">
                  <span slot="label"><i :class="item.meta.icon"></i> {{item.meta.title}}</span>
              </el-tab-pane>
            </template>
        </template>
    </el-tabs>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      activeName: 'home',
      isWatchRoute: true
    }
  },
  computed: {
    ...mapGetters([
      'routers'
    ]),
    routes () {
      return this.routers.filter(item => {
        return (item.children && item.children[0] && item.children[0].name === 'home') || (item.meta && item.meta.title && item.children[0])
      })
    }
  },
  watch: {
    $route () {
      if (!this.isWatchRoute) {
        return
      }
      // console.log(this.$route, 'watch')
      if (this.$route.name === 'home') {
        this.activeName = this.$route.name
        this.defaultHome()
      } else {
        this.activeName = this.$route.matched[0].meta.title
        this.changeChildren(this.activeName)
      }
    }
  },
  mounted () {
    // console.log(this.$route, 'mounted')
    if (this.$route.name === 'home') {
      this.activeName = this.$route.name
      this.defaultHome()
    } else {
      this.$nextTick(() => { this.activeName = this.$route.matched[0].meta.title })
      this.changeChildren(this.$route.matched[0].meta.title)
    }
  },
  methods: {
    handleClick (tab, event) {
      this.isWatchRoute = false
      // console.log(tab, 'tab')
      let route
      if (tab.name === 'home') {
        route = this.routes[0]
      } else {
        for (const v of this.routes) {
          if (v.meta && tab.name === v.meta.title) {
            route = v
          }
        }
      }
      let children = route.children
      for (const v of children) {
        v.fathPath = route.path
      }
      this.$store.dispatch('setChildRoute', children)
      if (children.length !== 0) {
        this.$router.push(children[0].fathPath + '/' + children[0].path)
        // 等路由跳完
        setTimeout(() => {
          this.$nextTick(() => { this.isWatchRoute = true })
        }, 300)
      }
    },
    defaultHome () {
      let children = this.routes[0].children
      for (const v of children) {
        v.fathPath = this.routes[0].path
      }
      this.$store.dispatch('setChildRoute', children)
    },
    changeChildren (activeName) {
      let route
      for (const v of this.routes) {
        if (v.meta && activeName === v.meta.title) {
          route = v
        }
      }
      let children = route.children
      for (const v of children) {
        v.fathPath = route.path
      }
      this.$store.dispatch('setChildRoute', children)
    }
  }
}
</script>

<style lang="scss" scoped>
.el-tabs {
    background-color: #fff;
    padding-left: 15px;
    /deep/ .el-tabs__header {
        margin: 0;
    }
    /deep/ .el-tabs__item {
      height: 50px;
      line-height: 50px;
      font-size: 15px;
    }
    /deep/ .el-tabs__active-bar {
      height: 0;
    }
    /deep/ .el-tabs__nav-next, /deep/ .el-tabs__nav-prev {
      font-size: 20px;
      background-color: rgba(0, 0, 0, .2);
      color: #fff;
      height: 50px;
    }
    // /deep/ .el-tabs__item.is-top:nth-child(2) {
    //     // margin-left: 15px;
    //     // padding-left: 15px;
    // }
}
</style>

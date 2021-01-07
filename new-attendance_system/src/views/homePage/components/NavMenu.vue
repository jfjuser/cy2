<template>
    <el-menu
     class="menubox"
     mode="horizontal"
     :default-active="$route.path"
     active-text-color="#409EFF"
     router
     unique-opened >
      <template v-for="(item,index) in routers" v-bind="index">
        <template v-if="!item.hidden && item.children">
          <!-- 判断是不是只有一个下级 -->
          <el-menu-item :index="item.path+'/'+item.children[0].path" v-if="hasOneShowingChildren(item.children) && !item.children[0].children && !item.alwaysShow" :key="item.children[0].name">
              <span v-if="item.children[0].meta && item.children[0].meta.icon" class="svg-icon" :class="item.children[0].meta.icon"></span>
              <span v-if="item.children[0].meta && item.children[0].meta.title">{{item.children[0].meta.title}}</span>
          </el-menu-item>
          <!-- 有多个下级 -->
          <el-submenu v-else :index="item.name||item.path" :key="item.name">
            <!-- 显示大类部分 -->
            <template slot="title">
              <span v-if="item.meta && item.meta.icon" class="svg-icon" :class="item.meta.icon"></span>
              <span v-if="item.meta && item.meta.title" slot="title">{{item.meta.title}}</span>
            </template>
            <!-- 下级children显示部分 -->
            <template v-for="child in item.children">
              <el-menu-item :index="item.path+'/'+child.path" :key="child.name" v-if="!child.hidden">
                <span v-if="item.children[0].meta && item.children[0].meta.icon" class="svg-icon" :class="child.meta.icon"></span>
                <span v-if="child.meta && child.meta.title">{{child.meta.title}}</span>
              </el-menu-item>
            </template>
          </el-submenu>
        </template>
      </template>
    </el-menu>
</template>

<script>
import { constantRouterMap } from '@/router'
export default {
  computed: {
    routers () {
      return constantRouterMap
    }
  },
  methods: {
    hasOneShowingChildren (children) {
      const showingChildren = children.filter(item => {
        return !item.hidden
      })
      if (showingChildren.length === 1) {
        return true
      }
      return false
    }
  }
}
</script>

<style lang="scss" scoped>
.svg-icon{
    width: 1.2em;
    height: 1em;
    box-sizing: border-box;
    /* color: #bfcbd9; */
    overflow: hidden;
}
.menubox {
  /deep/ .el-submenu__title {
    font-size: 15px
  }
  /deep/ .el-menu-item {
    font-size: 15px
  }
}
</style>

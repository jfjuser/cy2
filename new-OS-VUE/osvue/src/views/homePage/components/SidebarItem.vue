<template>
    <div class="menu-wrapper">
      <!-- 显示且有下级 -->
      <div v-for="(item,index) in routes" v-bind:key="index">
        <template v-if="!item.hidden && item.children" >
            <!-- 判断是不是只有一个下级 -->
            <router-link v-if="hasOneShowingChildren(item.children) && !item.children[0].children && !item.alwaysShow" :to="item.path+'/'+item.children[0].path"
                :key="item.children[0].name">
                <el-menu-item :index="item.path+'/'+item.children[0].path" :class="{'submenu-title-noDropdown':!isNest}">
                  <i v-if="item.children[0].meta && item.children[0].meta.icon" class="svg-icon"  :class="item.children[0].meta.icon"></i>
                  <span v-if="item.children[0].meta && item.children[0].meta.title" slot="title"> {{item.children[0].meta.title}}</span>
                </el-menu-item>
            </router-link>
            <!-- 有多个下级 -->
            <el-submenu v-else :index="item.name||item.path" :key="item.name">
              <!-- 显示大类部分 -->
                <template slot="title">
                  <i v-if="item.meta && item.meta.icon" class="svg-icon" :class="item.meta.icon" ></i>
                  <span v-if="item.meta && item.meta.title" slot="title">{{item.meta.title}}</span>
                </template>
                <!-- 下级children显示部分 -->
                <template v-for="child in item.children" v-show="!child.hidden">
                  <sidebar-item :is-nest="true" class="nest-menu" v-if="child.children&&child.children.length>0 && !child.children[0].hidden" :routes="[child]" :key="child.path"></sidebar-item>
                  <router-link v-else :to="item.path+'/'+child.path" :key="child.name">
                      <el-menu-item :index="item.path+'/'+child.path">
                        <i v-if="item.children[0].meta&&item.children[0].meta.icon" class="svg-icon" :class="child.meta.icon" ></i>
                        <span v-if="child.meta&&child.meta.title" slot="title">{{child.meta.title}}</span>
                      </el-menu-item>
                  </router-link>
                </template>
            </el-submenu>
        </template>
        </div>
    </div>
</template>
<script>
export default {
  name: 'SidebarItem',
  props: {
    routes: {
      type: Array
    },
    isNest: {
      type: Boolean,
      default: false
    }
  },
  created () {
    // console.log('查看当前路由： ', this.routes)
  },
  methods: {
    hasOneShowingChildren (children) {
      // console.log(children)
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
.svg-icon {
  width: 1.2em;
  height: 1em;
  vertical-align: -0.15em;
  color: #bfcbd9;
  overflow: hidden;
}
</style>

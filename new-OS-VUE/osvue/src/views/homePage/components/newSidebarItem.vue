<template>
    <!-- <div class="menu-wrapper"> -->
      <transition-group name="el-zoom-in-top" tag="div" class="menu-wrapper">
        <template v-for="child in routes">
            <router-link :to="child.fathPath+'/'+child.path" :key="child.name" v-if="!child.hidden">
                <el-menu-item :index="child.fathPath+'/'+child.path" :class="{'submenu-title-noDropdown':!isNest}">
                    <i class="svg-icon" :class="child.meta.icon" ></i>
                    <span v-if="child.meta&&child.meta.title" slot="title">{{child.meta.title}}</span>
                </el-menu-item>
            </router-link>
        </template>
    <!-- </div> -->
    </transition-group>
</template>

<script>
export default {
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
    // console.log('routes', this.routes)
  }
}
</script>

<style lang="scss" scoped>
  .svg-icon{
    width: 1.2em;
    height: 1em;
    vertical-align: -0.15em;
    color: #bfcbd9;
    overflow: hidden;
  }
</style>

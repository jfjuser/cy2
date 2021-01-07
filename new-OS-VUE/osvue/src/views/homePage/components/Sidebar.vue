<template>
    <el-scrollbar wrapClass="scrollbar-wrapper">
        <logo :isCollapse="isCollapse"></logo>
        <el-menu
          mode="vertical"
          :show-timeout="200"
          :default-active="$route.path"
          :collapse="isCollapse"
          :unique-opened = 'true'
          background-color="#304156"
          text-color="#bfcbd9"
          active-text-color="#409EFF"
        >
          <new-sidebar-item :routes="childRoute" v-if="isNewVersion" />
          <sidebar-item :routes="routes" v-else></sidebar-item>
        </el-menu>
    </el-scrollbar>
</template>
<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'
import NewSidebarItem from './newSidebarItem'
import Logo from './logo'
export default {
  components: {
    SidebarItem,
    Logo,
    NewSidebarItem
  },
  created () {
    // console.log('查看当前路由111： ', this.childRoute)
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'routers',
      'type',
      'version'
    ]),
    routes () {
      return this.routers
    },
    childRoute () {
      return this.$store.getters.childRoute
    },
    isCollapse () {
      return !this.sidebar.opened
    },
    isNewVersion () {
      return this.type === 1 && this.version === 1
    }
  }
}
</script>

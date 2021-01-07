<template>
    <div class="bgc">
        <template v-for="(item, index) in routes">
            <!-- 一级菜单 -->
            <van-cell :title="item.meta.title" center title-class="menu-title" :key="index">
              <i :class="item.meta.icon" class="menu-icon" title="图标" slot="icon"></i>
            </van-cell>
            <!-- 二级菜单 -->
            <van-grid clickable :border="false" :key="index">
                <template v-for="(child) in item.children" >
                    <van-grid-item icon="photo-o" :text="child.meta.title" :to="item.path+'/'+child.path + '/'" :key="child.name">
                      <!-- 颜色随机吧 -->
                      <i :class="child.meta.icon" class="submenu-icon" title="图标" slot="icon" :style="{color: colors[Math.floor((Math.random()*16))]}"></i>
                    </van-grid-item>
                </template>
            </van-grid>
        </template>
    </div>
</template>

<script>
import { Grid, GridItem, Cell } from 'vant'
import { mapGetters } from 'vuex'
export default {
  components: {
    [Grid.name]: Grid,
    [GridItem.name]: GridItem,
    [Cell.name]: Cell
  },
  computed: {
    ...mapGetters([
      'routers'
    ]),
    routes () {
      return this.routers.filter(item => {
        return !item.hidden && (item.children && item.children.length !== 0)
      })
    }
  },
  data () {
    return {
      colors: ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50', '#8bc34a', '#ffeb3b', '#ffc107', '#ff9800', '#ff5722', '#795548']
    }
  }
}
</script>

<style lang="scss" scoped>
.menu-title {
  font-size: 15px;
  color: #696969;
  font-weight: bold;
}
.menu-icon {
  // color: #bfcbd9;
  color: #808080;
  width: 25px;
  font-size: 18px;
}
.submenu-icon {
  color: #bfcbd9;
  font-size: 20px;
  margin-bottom: 10px;
}
</style>

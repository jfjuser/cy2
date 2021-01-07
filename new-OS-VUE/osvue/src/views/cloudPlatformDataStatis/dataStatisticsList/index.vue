<template>
  <div id="tabs">
     <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane v-for="(tab,index) in tabBarData" :key="index" :label="tab.title" :name="tab.name" >
        <!--  slot="search-element" -->
        <div v-if="isSearchElement"><Search /></div>
        <!-- 动态视口组件 -->
       <component :is="tabComponent"></component>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
// const Search = () => import('./components/searchBox')
import Search from './components/searchBox'
const Carea = () => import('./area/index')
const Cfund = () => import('./fund/index')
const Csales = () => import('./sales/index')
const Cschool = () => import('./school/index')
const Cwarehouse = () => import('./warehouse/index')
export default {
  name: '',
  data () {
    return {
      activeName: 'area',
      tabComponent: '',
      isSearchElement: true,
      tabBarData: [
        {title: '地区', name: 'area'},
        {title: '学校', name: 'school'},
        {title: '销量统计', name: 'sales'},
        {title: '仓库流量', name: 'warehouse'},
        {title: '基金统计', name: 'fund'}
      ]
    }
  },
  components: {
    Carea,
    Cfund,
    Csales,
    Cschool,
    Cwarehouse,
    Search
  },
  created () {
    // this.tabComponent = area
  },
  mounted () {
    console.log(this.tabComponent)

    this.tabComponent = Carea // 默认挂载 地区组件
  },
  methods: {
    handleClick (tab) {
      // console.log('用户点击了：', tab.name, fund)
      switch (tab.name) {
        case 'area':
          this.tabComponent = Carea
          break
        case 'school':
          this.tabComponent = Cschool
          break
        case 'sales':
          this.tabComponent = Csales
          break
        case 'warehouse':
          this.tabComponent = Cwarehouse
          break
        case 'fund':
          this.tabComponent = Cfund
          break
        default :
          this.tabComponent = Carea
          break
      }
      // this.tabComponent = tab.name
      // let toPath = this.tabBarData[tab.index].to
      // this.$router.push(toPath)
    }
  }
}
</script>
<style lang='scss' scoped>
#tabs  {
   padding: 10px 20px;

}
</style>

<template>
  <div class="page">
    <van-tabs v-model="activeName" color="#409eff">
      <van-tab title="已统计" name="first">
        <have-statistical></have-statistical>
      </van-tab>
      <van-tab title="未统计电子订单" name="second" v-if = "isShowColumnFormatter(['临时订单'])">
        <no-statistical></no-statistical>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import { Tab, Tabs } from 'vant'
import { isShowColumnFormatter } from '@/utils/formatter.js'
import haveStatistical from './components/haveStatistical'
import noStatistical from './components/noStatistical'

export default {
  components: {
    [Tab.name]: Tab,
    [Tabs.name]: Tabs,
    haveStatistical,
    noStatistical
  },
  data () {
    return {
      isShowColumnFormatter,
      activeName: 'first'
    }
  }
}
</script>

<style lang="scss" scoped>
.page /deep/ .van-tabs__nav--line .van-tabs__line {
  z-index: 0;

}
</style>

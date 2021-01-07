<template>
  <div class="page">
    <van-tabs v-model="type" color="#409eff">
      <van-tab title="已使用" name="used">
        <isUsed></isUsed>
      </van-tab>
      <van-tab title="未使用" name="notUsed">
        <notUsed></notUsed>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import { Tab, Tabs } from 'vant'
import isUsed from './isUsed/index'
import notUsed from './notUsed/index'
export default {
  components: {
    [Tab.name]: Tab,
    [Tabs.name]: Tabs,
    isUsed,
    notUsed
  },
  data () {
    return {
      type: 'used'
    }
  }
}
</script>

<style lang="scss" scoped>
.page /deep/ .van-tabs__nav--line .van-tabs__line {
  z-index: 0;

}
</style>

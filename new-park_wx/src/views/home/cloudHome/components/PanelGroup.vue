<template>
    <van-grid :border="false" :column-num="2" :gutter="10" class="grid">
        <van-grid-item>
            <div class="num mar-b-10">{{data.inNums | informatter}}</div>
            <p>进场数</p>
        </van-grid-item>
        <van-grid-item>
            <div class="num mar-b-10">{{data.parkNum}}</div>
            <p>车场总数</p>
        </van-grid-item>
        <van-grid-item>
            <div class="num mar-b-10">{{data.totalFee | totalformatter}}</div>
            <p>交易量</p>
        </van-grid-item>
        <van-grid-item>
            <div class="num mar-b-10">{{data.cameraNum}}</div>
            <p>设备总数</p>
        </van-grid-item>
    </van-grid>
</template>

<script>
import { Grid, GridItem } from 'vant'
export default {
  name: 'PanelGroup',
  components: {
    [Grid.name]: Grid,
    [GridItem.name]: GridItem
  },
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  filters: {
    informatter: function (value) {
      const suffix = value > 10000 ? (value > 100000000 ? '亿' : '万') : ''
      const endVal = value > 10000 ? (value > 100000000 ? value / 100000000 : value / 10000) : value
      return endVal.toFixed(value > 10000 ? 2 : 0) + suffix
    },
    totalformatter: function (value) {
      const suffix = value > 10000 ? (value > 100000000 ? '亿元' : '万元') : '元'
      const endVal = value > 10000 ? (value > 100000000 ? value / 100000000 : value / 10000) : value
      return endVal.toFixed(2) + suffix
    }
  }
}
</script>

<style lang="scss" scoped>
.mar-b-10 {
  margin-bottom: 10px;
}
.grid {
  margin: 15px 0;
  color: #fff;
  .num {
      font-size: 18px;
  }
  /deep/ .van-grid-item:nth-of-type(1) .van-grid-item__content {
    background-color:#40c9c6;
  }
  /deep/ .van-grid-item:nth-of-type(2) .van-grid-item__content {
    background-color:#36a3f7;
  }
  /deep/ .van-grid-item:nth-of-type(3) .van-grid-item__content {
    background-color:#f4516c;
  }
  /deep/ .van-grid-item:nth-of-type(4) .van-grid-item__content {
    background-color:#34bfa3;
  }
}
</style>

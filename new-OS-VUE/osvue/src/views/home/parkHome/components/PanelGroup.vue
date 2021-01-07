<template>
  <el-row class="panel-group" :gutter="40">
    <el-col :xs="24" :sm="12" :lg="6" class="card-panel-col">
      <div class='card-panel' >
        <div class="card-panel-icon-wrapper icon-people">
            <i class="fa fa-compress card-panel-icon"></i>
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">进场数</div>
          <count-to class="card-panel-num" :decimals="data.inNums > 10000 ? 2 : 0" :startVal="0" :suffix="data.inNums > 10000 ? (data.inNums > 100000000 ? '亿' : '万') : ' '"  :endVal="data.inNums > 10000 ? (data.inNums > 100000000 ? data.inNums / 100000000 : data.inNums / 10000) : data.inNums" :duration="3600"></count-to>
        </div>
      </div>
    </el-col>
    <el-col :xs="24" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-message">
          <i class="fa fa-expand card-panel-icon"></i>
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">出场数</div>
          <count-to class="card-panel-num" :decimals="data.outNums > 10000 ? 2 : 0" :startVal="0" :suffix="data.outNums > 10000 ? (data.outNums > 100000000 ? '亿' : '万') : ' '" :endVal="data.outNums > 10000 ? (data.outNums > 100000000 ? data.outNums / 100000000 : data.outNums / 10000) : data.outNums" :duration="3600"></count-to>
        </div>
      </div>
    </el-col>
    <el-col :xs="24" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" >
        <div class="card-panel-icon-wrapper icon-money">
           <i class="fa fa-cny card-panel-icon"></i>
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">交易量</div>
          <count-to class="card-panel-num" :suffix="data.totalFee > 10000 ? (data.totalFee > 100000000 ? '亿元' : '万元') : '元'" :startVal="0"  :endVal="data.totalFee > 10000 ? (data.totalFee > 100000000 ? data.totalFee / 100000000 : data.totalFee / 10000) : data.totalFee" :decimals="2" :duration="3600"></count-to>
        </div>
      </div>
    </el-col>
    <el-col :xs="24" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" >
        <div class="card-panel-icon-wrapper icon-shoppingCard">
           <i class="fa fa-car card-panel-icon" style="font-size:40px"></i>
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">白名单</div>
          <count-to class="card-panel-num" :startVal="0" :endVal="data.activeUser" :duration="3600"></count-to>
        </div>
      </div>
    </el-col>
  </el-row>
</template>
<script>
import CountTo from 'vue-count-to'
export default {
  name: 'PanelGroup',
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  components: {
    CountTo
  }
}
</script>
<style lang="scss" scoped>
.panel-group {
  margin-top: 18px;
  .card-panel-col{
    margin-bottom: 32px;
  }
  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
    border-color: rgba(0, 0, 0, .05);
    border-radius: 8px;
    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }
      .icon-people {
         background: #40c9c6;
      }
      .icon-message {
        background: #36a3f7;
      }
      .icon-money {
        background: #f4516c;
      }
      .icon-shoppingCard {
        background: #34bfa3
      }
    }
    .icon-people {
      color: #40c9c6;
    }
    .icon-message {
      color: #36a3f7;
    }
    .icon-money {
      color: #f4516c;
    }
    .icon-shoppingCard {
      color: #34bfa3
    }
    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }
    .card-panel-icon {
      float: left;
      font-size: 48px;
      width: 48px;
      text-align: center;
    }
    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;
      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }
      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}
</style>

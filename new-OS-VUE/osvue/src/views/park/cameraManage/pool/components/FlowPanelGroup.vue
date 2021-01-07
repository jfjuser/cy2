<template>
  <el-row class="panel-group" :gutter="40">
    <el-col :xs="24" :sm="12" :lg="12" class="card-panel-col">
      <div class='card-panel' >
        <div class="card-panel-top">
            <div class="card-panel-title">700M套餐流量共享池(小)</div>
            <div class="card-panel-text">
              剩余:<count-to class="card-panel-num" :startVal="0" :endVal="shareInfo[0].restFlow / 1024 > 0 ? shareInfo[0].restFlow / 1024 : shareInfo[0].restFlow" :decimals="2" :duration="3600"></count-to>{{shareInfo[0].restFlow / 1024 > 0 ? 'G' : 'Mb'}}
            </div>
            <div class="card-panel-text">
              已用:<count-to class="card-panel-num" :startVal="0" :endVal="shareInfo[0].usedFlow / 1024 > 0 ? shareInfo[0].usedFlow / 1024 : shareInfo[0].usedFlow" :decimals="2" :duration="3600"></count-to>{{shareInfo[0].usedFlow / 1024 > 0 ? 'G' : 'Mb'}}&#x3000;
            </div>
        </div>
        <div class="card-panel-progress">
          <el-progress :percentage="zb[0]" :stroke-width='strokeWidth' :text-inside="true"></el-progress>
        </div>
      </div>
    </el-col>
    <el-col :xs="24" :sm="12" :lg="12" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-top">
            <div class="card-panel-title">1G套餐流量共享池(大)</div>
            <div class="card-panel-text">
              剩余:<count-to class="card-panel-num" :startVal="0" :endVal="shareInfo[1].restFlow / 1024 > 0 ? shareInfo[1].restFlow / 1024 : shareInfo[1].restFlow" :decimals="2" :duration="3600"></count-to>{{shareInfo[1].restFlow / 1024 > 0 ? 'G' : 'Mb'}}
            </div>
            <div class="card-panel-text">
              已用:<count-to class="card-panel-num" :startVal="0" :endVal="shareInfo[1].usedFlow / 1024 > 0 ? shareInfo[1].usedFlow / 1024 : shareInfo[1].usedFlow" :decimals="2" :duration="3600"></count-to>{{shareInfo[1].usedFlow / 1024 > 0 ? 'G' : 'Mb'}}&#x3000;
            </div>
        </div>
        <div class="card-panel-progress">
          <el-progress :percentage="zb[1]" :stroke-width='strokeWidth' :text-inside="true"></el-progress>
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
      type: Array,
      required: true
    }
  },
  watch: {
    data (curVal, oldVal) {
      for (let i = 0; i < curVal.length; i++) {
        const element = curVal[i]
        let zb = 0
        if (element.totalFlow > 0) {
          zb = (element.usedFlow / element.totalFlow) * 100
        }
        this.zb[i] = Number(zb.toFixed(2))
      }
      this.shareInfo = curVal
    }
  },
  data () {
    return {
      strokeWidth: 24,
      zb: [0, 0],
      shareInfo: [
        {extpkgUsedFlow: 0, totalFlow: 0, restFlow: 0, usedFlow: 0, title: ''},
        {extpkgUsedFlow: 0, totalFlow: 0, restFlow: 0, usedFlow: 0, title: ''}
      ]
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
    .card-panel-top {
      float: left;
      margin: 14px 14px 0 14px;
      width: 100%;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }
    .card-panel-progress {
      margin: 0 14px 0 14px;
    }
    .card-panel-icon {
      float: left;
      font-size: 48px;
      width: 48px;
      text-align: center;
    }
    .card-panel-title {
      float: left;
      font-weight: bold;
      line-height: 18px;
      color: rgba(0, 0, 0, 0.45);
      font-size: 16px;
      margin-bottom: 6px;
    }
    .card-panel-text {
      float: right;
      line-height: 18px;
      color: rgba(0, 0, 0, 0.45);
      font-size: 16px;
      margin: 0 14px 6px 14px;
    }
    .card-panel-num {
      font-size: 20px;
    }
  }
}
</style>

<template>
  <div>
    <tab :line-width="1" custom-bar-width="80%">
      <tab-item selected @on-item-click="handleFilter()">全部</tab-item>
      <tab-item @on-item-click="handleFilter(0)">获取</tab-item>
      <tab-item @on-item-click="handleFilter(1)">使用</tab-item>
    </tab>
    <div v-for="item in list" :key="item.id">
      <flexbox class="point-ul" v-if="item.tipTime !== undefined">
        <flexbox-item class="point-ul-month">{{item.tipTime}}</flexbox-item>
        <flexbox-item class="point-ul-info">获取：<span>{{item.tipGet}}</span>&#x3000;使用：{{item.tipUse}}</flexbox-item>
      </flexbox>
      <div class="point-li">
        <span class="point-li-eventName">{{item.eventName}}</span>
        <span class="point-li-eventAt">{{timeHourMinFormatter(item.eventAt)}}</span>
        <span class="point-li-points">{{item.type === 0 ? '+' : '-'}}{{item.points}}</span>
      </div>
    </div>
    <div v-if="list.length==0" style="padding: 1rem 0">没有更多了</div>
  </div>
</template>
<script>
import { httpGet } from '@/utils/restful'
import { getPointsRecord } from '@/api/url.js'
import { getWxInfo, getDepInfo } from '@/utils/userInfo.js'
import { timeHourMinFormatter, formatterTime2, timeMonthDayFormatter } from '@/utils/formatter.js'
import { Tab, TabItem, Flexbox, FlexboxItem } from 'vux'
export default {
  components: {
    Tab,
    TabItem,
    Flexbox,
    FlexboxItem
  },
  data () {
    return {
      defParams: {},
      list: [],
      timeHourMinFormatter: timeHourMinFormatter
    }
  },
  created () {
    this.defParams = {
      departmentId: getDepInfo().departmentId,
      account: getWxInfo().account,
      unicode: getWxInfo().unicode,
      type: undefined,
      endTime: formatterTime2()
    }
    this.handleFilter()
  },
  methods: {
    handleFilter (type) {
      this.defParams.type = type
      httpGet(getPointsRecord, this.defParams).then(res => {
        this.list = res.data
        if (this.list && this.list.length > 0) {
          // 处理分析的数据
          let tipTime
          let tipGet = 0
          let tipUse = 0
          let index = 0
          for (let i = 0; i < this.list.length; i++) {
            let temp = this.list[i]
            if (temp.points) {
              if (temp.type === 0) {
                // 获取
                tipGet += temp.points
              } else {
                // 使用
                tipUse += temp.points
              }
            }
            if (i + 1 <= this.list.length || timeMonthDayFormatter(temp.eventAt) !== timeMonthDayFormatter(this.list[i + 1].eventAt)) {
              tipTime = timeMonthDayFormatter(temp.eventAt)
              this.list[index] = Object.assign(this.list[index], {tipTime: tipTime, tipGet: tipGet, tipUse: tipUse})
              index = i + 1
              tipGet = 0
              tipUse = 0
            }
          }
        }
      }).catch(() => {
        this.$vux.toast.text('加载失败', 'bottom')
      })
    }
  }
}
</script>
<style lang='scss' scoped>
.point-ul {
  background-color: #ececec;
  padding: .625rem 1.25rem;
  border-bottom: 1px solid #d4d4d4;
  .point-ul-month {
    font-weight: 600;
  }
  .point-ul-info {
    text-align: center;
    font-size: .875rem;
    span {
      color: rgb(241, 143, 50);
    }
  }
}
.point-li {
  position: relative;
  padding: .9375rem 1.875rem;
  background-color: white;
  border-bottom: 1px solid #d4d4d4;
  .point-li-eventName {
    display: flex;
    font-weight: bold;
    letter-spacing: .125rem
  }
  .point-li-eventAt {
    display: flex;
    color: #7e7e7e;
    margin-top: .3125rem;
    font-size: .75rem;
  }
  .point-li-points {
    position: absolute;
    top: 40%;
    right: 5%;
    font-weight: bold;
    letter-spacing: .0625rem
  }
}
</style>

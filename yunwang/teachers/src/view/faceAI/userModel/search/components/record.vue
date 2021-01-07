<template>
  <div class="box">
    <div v-for="info in list" :key="info.id">
      <p class="box-title" v-if="info.type">{{info.type === 0 ? '在校' : '离校'}}</p>
      <p class="box-title" v-else>未到校</p>
      <div class="box-body">
        <div class="box-time" v-if="info.inOutTime">
          <div class="box-time-range">{{timeRangeFormatter(info.inOutTime)}}</div>
          <div>{{timeMonthDayFormatter(info.inOutTime)}}</div>
          <div>{{timeHourMinFormatter(info.inOutTime)}}</div>
        </div>
        <div class="box-main">
          <div><img class="box-icon" src="@/assets/icon/wx/recordBox/icon-atUser.png"/><span>{{info.userName}}</span></div>
          <div><img class="box-icon" v-if="info.localName" src="@/assets/icon/wx/recordBox/icon-GPS.png"/><span>{{info.localName}}</span></div>
          <div><img class="box-icon" src="@/assets/icon/wx/recordBox/icon-compile.png"/><span>{{info.remarks != null ? info.remarks : ''}}</span></div>
          <div v-show="false">
            <img class="box-image" src="https://hbimg.b0.upaiyun.com/ee3abbd913491954a974489a4e27b4b53f38bf18f5be-S6LLTR_fw658"/>
          </div>
        </div>
      </div>
      <p class="box-adv"></p>
    </div>
  </div>
</template>
<script>
import { timeRangeFormatter, timeMonthDayFormatter, timeHourMinFormatter } from '@/utils/formatter.js'
export default {
  name: 'RecordBox',
  props: {
    list: Array
  },
  watch: {
  },
  data () {
    return {
      timeRangeFormatter: timeRangeFormatter,
      timeMonthDayFormatter: timeMonthDayFormatter,
      timeHourMinFormatter: timeHourMinFormatter
    }
  },
  created () {
  },
  methods: {
  }
}
</script>
<style lang='scss' scoped>
.box {
  margin: .625rem 3%;
  width: 94%;
  height: 100%;
  min-height: 12.5rem;
  border: .0625rem solid #aaaaaa;
  border-radius: 1rem;
}
.box-title {
  width: 82%;
  border-bottom: .0625rem solid #aaaaaa;
  text-align: left;
  padding: .625rem 1.875rem;
  font-size: 1.125rem;
  font-weight: 600;
  color: #40D1E7;
  letter-spacing: .3125rem;
}
.box-body {
  display: flex;
  padding: .125rem .625rem;
  .box-time {
    display: flex;
    flex-direction: column;
    width: 5.625rem;
    text-align: center;
    .box-time-range {
      border: .125rem solid #81e3f5;
      border-radius: 50%;
      width: 4rem;
      height: 4rem;
      line-height: 4rem;
      margin: .625rem;
    }
  }
  .box-main {
    display: flex;
    flex-direction: column;
    text-align: left;
    padding: .625rem 1.25rem;
    line-height: 2rem;
    .box-icon {
      width: 1.5rem;
      height: 1.5rem;
      vertical-align: middle;
      margin-right: .625rem;
    }
    .box-image {
      width: 100%;
    }
  }
}
.box-adv {
  width: 82%;
  margin-top: .625rem;
  border-top: .0625rem solid #aaaaaa;
  border-radius: .825rem;
  text-align: left;
  padding: .625rem 1.875rem;
  background-color: #f0f0f0;
}
</style>

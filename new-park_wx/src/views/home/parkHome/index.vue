<template>
    <div>
      <van-dropdown-menu>
        <van-dropdown-item :options="option" v-model="date" @change="onChangeDate" />
        <van-dropdown-item title="时间查询" ref="timeFilter">
          <van-cell title="开始日期" is-link :label="listQuery.beginTime" @click="showbeginTime=true" />
          <van-cell title="结束日期" is-link :label="listQuery.endTime" @click="showendTime=true" />
          <van-button block type="info" @click="onSearch">搜索</van-button>
          <van-popup v-model="showbeginTime" position="bottom" :close-on-click-overlay="false" safe-area-inset-bottom>
              <van-datetime-picker
              v-model="currentDate1"
              type="date"
              :max-date="maxDate"
              show-toolbar
              @cancel="showbeginTime=false"
              @confirm="handleBeginTime"
              />
          </van-popup>
          <van-popup v-model="showendTime" position="bottom" :close-on-click-overlay="false" safe-area-inset-bottom>
              <van-datetime-picker
              v-model="currentDate2"
              type="date"
              :max-date="maxDate"
              show-toolbar
              @cancel="showendTime=false"
              @confirm="handleEndTime"
              />
          </van-popup>
        </van-dropdown-item>
      </van-dropdown-menu>

      <PanelGroup :data="data.statistDepHeaderGroup"></PanelGroup>

      <section class="map-box">
        <van-button block type="info" :to="`/statistics/?time=${JSON.stringify([this.listQuery.beginTime, this.listQuery.endTime])}`">查看文字统计</van-button>
      </section>

      <section class="chart-box">
        <LineBar class="bgc pie" :data="data.countDataDto[0]"></LineBar>
        <Pie class="bgc pie" :data="data.statistPicDto[0]"></Pie>
      </section>
      <section class="chart-box">
        <LineBar class="bgc pie" :data="data.countDataDto[1]"></LineBar>
        <Pie class="bgc pie" :data="data.statistPicDto[1]"></Pie>
      </section>
    </div>
</template>

<script>
import PanelGroup from './components/PanelGroup'
import Pie from '@/components/Echarts/Pie'
import LineBar from '@/components/Echarts/LineBar'
import { DropdownMenu, DropdownItem, Button, Cell, DatetimePicker, Popup } from 'vant'
import { timeFormatterSort } from '@/utils/formatter.js'
import { depData } from '@/api/url'
import { httpGet } from '@/utils/restful.js'
export default {
  name: 'park-home',
  components: {
    PanelGroup,
    [DropdownMenu.name]: DropdownMenu,
    [DropdownItem.name]: DropdownItem,
    [Button.name]: Button,
    [Cell.name]: Cell,
    [DatetimePicker.name]: DatetimePicker,
    [Popup.name]: Popup,
    Pie,
    LineBar
  },
  data () {
    return {
      data: {
        statistDepHeaderGroup: {
          inNums: 0,
          outNums: 0,
          totalFee: 0,
          activeUser: 0
        },
        countDataDto: {},
        statistPicDto: {},
        statistDepFeeGroup: {},
        statistDepOutFeeGroup: []
      },
      listQuery: {
        beginTime: undefined,
        endTime: undefined
      },
      date: 1,
      option: [
        { text: '今日', value: 0 },
        { text: '昨日', value: 1 },
        { text: '本周', value: 2 },
        { text: '上周', value: 3 },
        { text: '本月', value: 4 },
        { text: '上月', value: 5 }
      ],
      showbeginTime: false,
      showendTime: false,
      maxDate: new Date(),
      currentDate1: new Date(),
      currentDate2: new Date()
    }
  },
  mounted () {
    this.handleYesterday()
  },
  methods: {
    handleFilter () {
      const ToastLoading = this.$toast.loading({ message: '加载中...', position: 'middle', duration: 0 })
      this.listQuery = Object.assign(this.listQuery, {departmentId: this.$store.getters.departmentId})
      httpGet(depData, this.listQuery)
        .then(res => {
          ToastLoading.clear()
          if (res.data !== null) {
            this.data = res.data
            window.sessionStorage.setItem('textStatistics', JSON.stringify(res.data.statistDepOutFeeGroup))
          }
        }).catch(() => { ToastLoading.clear() })
    },
    onChangeDate (value) {
      // console.log(value)
      if (value === 0) this.handleToday()
      if (value === 1) this.handleYesterday()
      if (value === 2) this.handleWeek()
      if (value === 3) this.handleLastWeek()
      if (value === 4) this.handleMonth()
      if (value === 5) this.handleLastMonth()
    },
    // 今天
    handleToday () {
      this.listQuery.beginTime = timeFormatterSort(new Date()) + ' 00:00:00'
      this.listQuery.endTime = timeFormatterSort(new Date()) + ' 23:59:59'
      this.handleFilter()
    },
    // 昨天
    handleYesterday () {
      this.listQuery.beginTime = timeFormatterSort(new Date() - 3600 * 1000 * 24) + ' 00:00:00'
      this.listQuery.endTime = timeFormatterSort(new Date() - 3600 * 1000 * 24) + ' 23:59:59'
      this.handleFilter()
    },
    // 本周
    handleWeek () {
      let date = new Date()
      let weekday = date.getDay() || 7 // 获取星期几,getDay()返回值是 0（周日） 到 6（周六） 之间的一个整数。0||7为7，即weekday的值为1-7
      date.setDate(date.getDate() - weekday + 1) // 往前算（weekday-1）天，年份、月份会自动变化
      this.listQuery.beginTime = timeFormatterSort(date) + ' 00:00:00'
      this.listQuery.endTime = timeFormatterSort(new Date()) + ' 23:59:59'
      this.handleFilter()
    },
    // 上周
    handleLastWeek () {
      let date = new Date()
      let weekday = date.getDay() || 7 // 获取星期几,getDay()返回值是 0（周日） 到 6（周六） 之间的一个整数。0||7为7，即weekday的值为1-7
      date.setDate(date.getDate() - weekday - 6) // 往前算（weekday-1）天，年份、月份会自动变化
      this.listQuery.beginTime = timeFormatterSort(date) + ' 00:00:00'
      this.listQuery.endTime = timeFormatterSort(3600 * 1000 * 24 * 6 + date.getTime()) + ' 23:59:59'
      this.handleFilter()
    },
    // 本月
    handleMonth () {
      this.listQuery.beginTime = timeFormatterSort(new Date(new Date().setDate(1))) + ' 00:00:00'
      this.listQuery.endTime = timeFormatterSort(new Date()) + ' 23:59:59'
      this.handleFilter()
    },
    // 上月
    handleLastMonth () {
      this.listQuery.beginTime = timeFormatterSort(new Date(new Date().setMonth(new Date().getMonth() - 1)).setDate(1)) + ' 00:00:00'
      this.listQuery.endTime = timeFormatterSort(new Date(new Date().setDate(0))) + ' 23:59:59'
      this.handleFilter()
    },
    onSearch () {
      const beginTime = this.listQuery.beginTime
      const endTime = this.listQuery.endTime
      if (new Date(beginTime).getFullYear() === new Date(endTime).getFullYear() && new Date(beginTime).getMonth() === new Date(endTime).getMonth()) {
        this.handleFilter()
        this.$refs.timeFilter.toggle()
      } else {
        this.$toast.fail('请填写一个月内的时间段进行搜索')
      }
    },
    handleBeginTime (val) {
      this.listQuery.beginTime = timeFormatterSort(val) + ' 00:00:00'
      this.showbeginTime = false
    },
    handleEndTime (val) {
      this.listQuery.endTime = timeFormatterSort(val) + ' 23:59:59'
      this.showendTime = false
    }
  }
}
</script>

<style lang="scss" scoped>
.chart-box {
  .pie {
    height: 400px;
  }
}
.map-box {
  padding: 10px;
  padding-top: 0;
}
</style>

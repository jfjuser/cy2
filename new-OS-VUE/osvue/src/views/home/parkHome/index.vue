<template>
  <div class="app-container">
    <div id="form" :class="{fixed: flag}">
      <el-form :inline="true"  label-position="right" label-width="120px" >
        <el-form-item label="时间查询">
          <el-date-picker
            class="filter-item"
            v-model="time"
            type="datetimerange"
            style="padding:0 15px;"
            value-format = "yyyy-MM-dd HH:mm:ss"
            :default-time="['00:00:00', '23:59:59']"
            range-separator="至"
            start-placeholder="开始日期"
            @change="changeTime"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button :disabled="filterDisabled" type="primary" @click="handleFilter" icon="el-icon-search">搜索</el-button>
          <el-button type="primary" @click="handleToday" :class="active==1?'btn-opacity':''">今日</el-button>
          <el-button type="primary" @click="handleYesterday" :class="active==2?'btn-opacity':''">昨日</el-button>
          <el-button type="primary" @click="handleWeek" :class="active==3?'btn-opacity':''">本周</el-button>
          <el-button type="primary" @click="handleLastWeek" :class="active==4?'btn-opacity':''">上周</el-button>
          <el-button type="primary" @click="handleMonth" :class="active==5?'btn-opacity':''">本月</el-button>
          <el-button type="primary" @click="handleLastMonth" :class="active==6?'btn-opacity':''">上月</el-button>
        </el-form-item>
      </el-form>
    </div>
    <PanelGroup :data="data.statistDepHeaderGroup"></PanelGroup>
    <el-row :gutter="20">
      <el-col :xs="24" :sm="24" :lg="16" style="margin-bottom: 20px;">
        <LineBar style="background:white;height: 400px;border-radius:8px;" :data = "data.countDataDto[0]"></LineBar>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8" style="margin-bottom: 20px;">
        <Pie style="background:white;height: 400px;border-radius:8px;" :data = "data.statistPicDto[0]"></Pie>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :xs="24" :sm="24" :lg="16" style="margin-bottom: 20px;">
        <LineBar style="background:white;height: 400px;border-radius:8px;" :data = "data.countDataDto[1]"></LineBar>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8" style="margin-bottom: 20px;">
        <Pie style="background:white;height: 400px;border-radius:8px;" :data = "data.statistPicDto[1]"></Pie>
      </el-col>
    </el-row>
    <div class="table-main">
      <el-table
        stripe
        style="width: 100%"
        max-height="600"
        :data="data.statistDepOutFeeGroup"
        v-loading.body="listLoading"
        element-loading-text="加载中..."
        :default-sort = "{prop: 'channelName', order: 'descending'}"
        border fit highlight-current-row>
        <el-table-column label="通道" sortable align="center" prop="channelName"></el-table-column>
        <el-table-column label="分段时间" sortable align="center" prop="date">
          <template slot-scope="scope">
            {{time != null && time.length == 2 && (new Date(time[1]).getTime() - new Date(time[0]).getTime()) > 86400000 ? timeFormatterSort(scope.row.date) : timeFormatter(scope.row.date)}}
          </template>
        </el-table-column>
        <el-table-column label="出场数" sortable align="center" prop="outNums"></el-table-column>
        <el-table-column label="现金支付" sortable align="center" prop="cashFee">
          <template slot-scope="scope">
            {{moneyFormatter(scope.row.cashFee)}}
          </template>
        </el-table-column>
        <el-table-column label="余额(电子)" sortable align="center" prop="epayWallet">
          <template slot-scope="scope">
            {{moneyFormatter(scope.row.epayWallet)}}
          </template>
        </el-table-column>
        <el-table-column label="付款码(电子)" sortable align="center" prop="epaySweep">
          <template slot-scope="scope">
            {{moneyFormatter(scope.row.epaySweep)}}
          </template>
        </el-table-column>
        <el-table-column label="出场扫码(电子)" sortable align="center" prop="epayScan">
          <template slot-scope="scope">
            {{moneyFormatter(scope.row.epayScan)}}
          </template>
        </el-table-column>
        <el-table-column label="其他电子支付" sortable align="center" prop="epayOther">
          <template slot-scope="scope">
            {{moneyFormatter(scope.row.epayOther)}}
          </template>
        </el-table-column>
        <el-table-column label="电子支付总和" sortable align="center" prop="epayFee">
          <template slot-scope="scope">
            {{moneyFormatter(scope.row.epayFee)}}
          </template>
        </el-table-column>
        <el-table-column label="总和"  align="center">
          <template slot-scope="scope">
            {{moneyFormatter((scope.row.epayFee + scope.row.cashFee).toFixed(2))}}
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import PanelGroup from './components/PanelGroup'
import LineBar from '@/components/Echarts/LineBar'
import Pie from '@/components/Echarts/Pie'
import { httpGet } from '@/utils/restful'
import { depData } from '@/api/url'
import { timeFormatter, timeFormatterSort, moneyFormatter } from '@/utils/formatter.js'
export default {
  components: {
    PanelGroup,
    LineBar,
    Pie
  },
  name: 'park-home',
  data () {
    return {
      flag: false,
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
      timeFormatter: timeFormatter,
      timeFormatterSort: timeFormatterSort,
      moneyFormatter: moneyFormatter,
      progressWidth: 60,
      filterDisabled: false,
      listQuery: {
        beginTime: undefined,
        endTime: undefined
      },
      time: [],
      listLoading: true,
      active: 0
    }
  },
  mounted () {
    this.handleYesterday()
    this.fixedTop()
  },
  methods: {
    fixedTop () {
      let form = document.getElementById('form')
      window.onscroll = () => {
        let scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop
        if (scrollTop > form.offsetTop) {
          this.flag = true
        } else {
          this.flag = false
        }
      }
    },
    // 监听搜索的时间
    changeTime (value) {
      if (value === null) {
        this.filterDisabled = true
      } else if (new Date(value[0]).getFullYear() === new Date(value[1]).getFullYear() && new Date(value[0]).getMonth() === new Date(value[1]).getMonth()) {
        this.listQuery.beginTime = value[0]
        this.listQuery.endTime = value[1]
        this.filterDisabled = false
      } else if (new Date(value[0]).getFullYear() && new Date(value[1]).getFullYear() && new Date(value[0]).getMonth() && new Date(value[1]).getMonth()) {
        this.listQuery.beginTime = value[0]
        this.listQuery.endTime = value[1]
        this.filterDisabled = false
      } else {
        this.filterDisabled = true
        this.time = [this.listQuery.beginTime, this.listQuery.endTime]
        // this.$message.error('请填写一个月内的时间段进行搜索')
        this.$message.error('请重新搜索')
      }
    },
    handleFilter () {
      this.listLoading = true
      this.listQuery = Object.assign(this.listQuery, {departmentId: this.$store.getters.departmentId})
      httpGet(depData, this.listQuery)
        .then(res => {
          if (res.data !== null) {
            this.data = res.data
          }
          this.listLoading = false
        }).catch(() => {
          this.listLoading = false
        })
    },
    // 今天
    handleToday () {
      this.active = 1
      this.listQuery.beginTime = timeFormatterSort(new Date()) + ' 00:00:00'
      this.listQuery.endTime = timeFormatterSort(new Date()) + ' 23:59:59'
      this.time = [this.listQuery.beginTime, this.listQuery.endTime]
      this.handleFilter()
    },
    // 昨天
    handleYesterday () {
      this.active = 2
      this.listQuery.beginTime = timeFormatterSort(new Date() - 3600 * 1000 * 24) + ' 00:00:00'
      this.listQuery.endTime = timeFormatterSort(new Date() - 3600 * 1000 * 24) + ' 23:59:59'
      this.time = [this.listQuery.beginTime, this.listQuery.endTime]
      this.handleFilter()
    },
    // 本周
    handleWeek () {
      this.active = 3
      let date = new Date()
      let weekday = date.getDay() || 7 // 获取星期几,getDay()返回值是 0（周日） 到 6（周六） 之间的一个整数。0||7为7，即weekday的值为1-7
      date.setDate(date.getDate() - weekday + 1) // 往前算（weekday-1）天，年份、月份会自动变化
      this.listQuery.beginTime = timeFormatterSort(date) + ' 00:00:00'
      this.listQuery.endTime = timeFormatterSort(new Date()) + ' 23:59:59'
      this.time = [this.listQuery.beginTime, this.listQuery.endTime]
      this.handleFilter()
    },
    // 上周
    handleLastWeek () {
      this.active = 4
      let date = new Date()
      let weekday = date.getDay() || 7 // 获取星期几,getDay()返回值是 0（周日） 到 6（周六） 之间的一个整数。0||7为7，即weekday的值为1-7
      date.setDate(date.getDate() - weekday - 6) // 往前算（weekday-1）天，年份、月份会自动变化
      this.listQuery.beginTime = timeFormatterSort(date) + ' 00:00:00'
      this.listQuery.endTime = timeFormatterSort(3600 * 1000 * 24 * 6 + date.getTime()) + ' 23:59:59'
      this.time = [this.listQuery.beginTime, this.listQuery.endTime]
      this.handleFilter()
    },
    // 本月
    handleMonth () {
      this.active = 5
      this.listQuery.beginTime = timeFormatterSort(new Date(new Date().setDate(1))) + ' 00:00:00'
      this.listQuery.endTime = timeFormatterSort(new Date()) + ' 23:59:59'
      this.time = [this.listQuery.beginTime, this.listQuery.endTime]
      this.handleFilter()
    },
    // 上月
    handleLastMonth () {
      this.active = 6
      this.listQuery.beginTime = timeFormatterSort(new Date(new Date().setMonth(new Date().getMonth() - 1)).setDate(1)) + ' 00:00:00'
      this.listQuery.endTime = timeFormatterSort(new Date(new Date().setDate(0))) + ' 23:59:59'
      this.time = [this.listQuery.beginTime, this.listQuery.endTime]
      this.handleFilter()
    }
  }
}
</script>
<style lang="scss" scoped>
  .btn-opacity {
    opacity: .7
  }
  .el-form {
    // padding: 10px 0;
    padding-top: 10px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
    .el-form-item {
      margin-bottom: 10px;
      .filter-item{
        padding: 3px 10px !important;
        width: 100% !important;
      }
      .el-button {
        margin-left: 5px;
      }
    }
  }
  .stat-box-chil {
    font-size: 12px;
    border-radius: 8px;
    text-align: center;
    padding: 5px 15px;
    background: white;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
    margin-bottom: 12px;
  }
  @media screen and (max-width: 1024px) {
    .el-form .el-form-item .el-button{
      margin-left: 2px;
    }
  }
  .fixed {
    position: fixed;
    top: 0;
    z-index: 1900;
    width: 90%;
    padding-right: 20px;
  }
</style>

<template>
  <div class="app-container">
    <div id="form" v-bind:class="{fixed: flag}">
      <el-form  :inline="true"  label-position="right" label-width="80px" >
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
          <!-- <el-button type="primary" @click="handleToday" :class="active==1?'btn-opacity':''">今日</el-button> -->
          <el-button type="primary" @click="handleYesterday" :class="active==2?'btn-opacity':''">昨日</el-button>
          <el-button type="primary" @click="handleWeek" :class="active==3?'btn-opacity':''">本周</el-button>
          <el-button type="primary" @click="handleLastWeek" :class="active==4?'btn-opacity':''">上周</el-button>
          <el-button type="primary" @click="handleMonth" :class="active==5?'btn-opacity':''">本月</el-button>
          <el-button type="primary" @click="handleLastMonth" :class="active==6?'btn-opacity':''">上月</el-button>
          <el-button type="primary" v-if="data.yun" @click="handleStatist" >手动执行统计任务</el-button>
          <el-button type="primary" v-if="show" @click="handleView">大屏幕</el-button>
        </el-form-item>
      </el-form>
    </div>
    <PanelGroup :data="data.statistYunHeaderGroup"></PanelGroup>
    <el-row :gutter="20" >
      <el-col :xs="24" :sm="24" :lg="16" style="margin-bottom: 20px;">
        <NewMap style="background:white;height: 820px;border-radius:8px; margin-bottom: 20px;" :data = "data.departmentInfoList"></NewMap>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8" >
        <Pie style="background:white;height: 400px;border-radius:8px; margin-bottom: 20px;" :data = "data.feePicDto"></Pie>
        <Pie style="background:white;height: 400px;border-radius:8px; margin-bottom: 20px;" :data = "data.devicePicDto"></Pie>
      </el-col>
    </el-row>
    <!-- <el-row :gutter="20">
      <el-col :xs="24" :sm="24" :lg="16" >
        <LineBar style="background:white;height: 400px;border-radius:8px;" ></LineBar>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8" style="margin-bottom: 20px;">
        <Category style="background:white;height: 400px;border-radius:8px;" :data = "data.departmentInfoList"></Category>
      </el-col> -->
    <!-- </el-row> -->
  </div>
</template>
<script>
import PanelGroup from './components/PanelGroup'
import NewMap from './components/NewMap'
import LineBar from '@/components/Echarts/LineBar'
import Pie from '@/components/Echarts/Pie'
import Category from '@/components/Echarts/Category'
import { timeFormatterSort, moneyFormatter } from '@/utils/formatter.js'
import { cloudData, statist, dataView } from '@/api/url'
import { httpGet, httpPost } from '@/utils/restful.js'
export default {
  components: {
    PanelGroup,
    NewMap,
    LineBar,
    Pie,
    Category
  },
  name: 'park-home',
  data () {
    return {
      data: {
        statistYunHeaderGroup: {
          inNums: 0,
          parkNum: 0,
          totalFee: 0,
          cameraNum: 0
        },
        countDataDto: {},
        feePicDto: {},
        devicePicDto: {},
        statistDepFeeGroup: {},
        departmentInfoList: [],
        yun: false
      },
      moneyFormatter: moneyFormatter,
      progressWidth: 60,
      filterDisabled: false,
      listQuery: {
        beginTime: undefined,
        endTime: undefined
      },
      time: [],
      flag: false,
      show: false,
      active: 0
    }
  },
  mounted () {
    this.handleYesterday()
    this.fixedTop()
    this.departmentId = Number(this.$store.getters.departmentId)
    this.show = true
    // this.show = false
    // if (this.departmentId === 792 || this.departmentId === 1) {
    //   this.show = true
    // }
  },
  methods: {
    // 大屏幕
    handleView () {
      httpPost(dataView + this.$store.getters.departmentId)
        .then(res => {
          // window.open(process.env.API_HOST.replace('/api/', '') + '/bigdata/index.html?code=' + res.data)
          if (this.departmentId === 792) {
            window.location.href = 'http://www.hczky.com/bigdata/index.html?code=' + res.data
          } else {
            window.location.href = process.env.API_HOST.replace('/api/', '') + '/bigdata/index.html?code=' + res.data
          }
        }).catch(() => {})
    },
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
      this.listQuery = Object.assign(this.listQuery, {departmentId: this.$store.getters.departmentId})
      httpGet(cloudData, this.listQuery)
        .then(res => {
          if (res.data !== null) {
            this.data = res.data
          }
        }).catch(() => {})
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
    },
    // 手动执行统计
    handleStatist () {
      this.$confirm('确认提交吗？\n(统计时间过长(1分钟/1天数据左右),请耐心等候,避免重复操作)\n重新计算范围' + this.listQuery.beginTime + '至' + this.listQuery.endTime, '提示', {}).then(() => {
        this.listQuery = Object.assign(this.listQuery, {departmentId: this.$store.getters.departmentId})
        httpGet(statist, this.listQuery).then(res => {
          this.$message({
            message: res.message,
            type: 'success',
            duration: 4 * 1000
          })
        }).catch(() => {})
      }).catch(() => {
        this.deleteLoading = false
      })
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

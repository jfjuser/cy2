<template>
  <div class="app-container">
    <el-row :gutter="40" class="box-tip">
      <el-col :xs="24" :sm="24" :lg="6" class="box-overview">
        <div class="box-title">账号概览</div>
        <div class='box-card'>
          <div class="box">
            <div class="overview-title"><i class="fa fa-credit-card"></i><span>账户余额</span></div>
            <div class="oberview-money">
               <div class="left" style="color: #5689F2">￥{{data.header.price.toFixed(2)}}元</div>
              <el-button class="filter-item right" type="primary" v-has="['充值']"  @click="handleChanger"><i class="fa fa-rmb"></i>充值</el-button>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="18" class="box-status">
        <div class="box-title">广告状态</div>
        <div class='box-card'>
          <el-row class="box" :gutter="24">
            <el-col :span="6">
              <div class="box-card-info box1">
                <div class="box-card-info-img"><i class="fa fa-file"></i></div>
                <div class="box-card-info-title">待审核</div>
                <div class="box-card-info-num">{{data.header.toBeAudited}}</div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="box-card-info box2">
                <div class="box-card-info-img"><i class="fa fa-film"></i></div>
                <div class="box-card-info-title">待投放</div>
                <div class="box-card-info-num">{{data.header.toBePutIn}}</div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="box-card-info box3">
                <div class="box-card-info-img"><i class="fa fa-tasks"></i></div>
                <div class="box-card-info-title">投放中</div>
                <div class="box-card-info-num">{{data.header.putIn}}</div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="box-card-info box4">
                <div class="box-card-info-img"><i class="fa fa-warning"></i></div>
                <div class="box-card-info-title">已过期</div>
                <div class="box-card-info-num">{{data.header.expired}}</div>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>
    <div class="box-progress">
      <div class="box-title">
        <span>投放数据</span>
        <el-button-group class="box-title-button-group">
          <el-button :type="index === 1 ? 'primary' : ''" size="small" @click="handleToday">今天</el-button>
          <el-button :type="index === 2 ? 'primary' : ''" size="small" @click="handleYesterday">昨天</el-button>
          <el-button :type="index === 3 ? 'primary' : ''" size="small" @click="handleWeek">本周</el-button>
          <el-button :type="index === 4 ? 'primary' : ''" size="small" @click="handleLastWeek">上周</el-button>
          <el-button :type="index === 5 ? 'primary' : ''" size="small" @click="handleMonth">本月</el-button>
          <el-button :type="index === 6 ? 'primary' : ''" size="small" @click="handleLastMonth">上月</el-button>
        </el-button-group>
        <el-select clearable v-model="listQuery.advId" style="width: 150px;float:right;margin-right: 10px;"  class="filter-item" placeholder="广告" size="small" @change="changeAdv">
          <el-option v-for="item in advList" :key="item.id" :label="item.advTitle" :value="item.id"></el-option>
        </el-select>
      </div>
      <p></p>
      <div class='box-card'>
        <div class="box">
          <span class="box-card-progress-tip">注:外圈为当前广告占总的百分比或平均百分比,圈内值为当前广告的数值</span>
          <el-row>
            <el-col :span="4">
              <div class="right-line box-card-progress">
                <el-progress class="box-card-progress-el" type="circle" :percentage="data.sumProgress!= null && data.sumProgress.pushTimes != undefined ? (data.sumProgress.pushTimes > 0 ? (data.progress.pushTimes / data.sumProgress.pushTimes) * 100 : 0) : 100" :show-text="false" color="#9B4D9A"></el-progress>
                <span class="box-card-progress-center">{{data.progress.pushTimes}}</span>
                <span class="box-card-progress-text">推送次数</span>
              </div>
            </el-col>
            <el-col :span="4">
              <div class="right-line box-card-progress">
                <el-progress class="box-card-progress-el" type="circle" :percentage="data.sumProgress!= null && data.sumProgress.clickTimes != undefined ? (data.sumProgress.clickTimes > 0 ? (data.progress.clickTimes / data.sumProgress.clickTimes) * 100 : 0) : 100" :show-text="false" color="#5689F2"></el-progress>
                <span class="box-card-progress-center">{{data.progress.clickTimes}}</span>
                <span class="box-card-progress-text">点击量</span>
              </div>
            </el-col>
            <el-col :span="4">
              <div class="right-line box-card-progress">
                <el-progress class="box-card-progress-el" type="circle" :percentage="data.sumProgress!= null && data.sumProgress.clickRate != undefined ? (data.sumProgress.clickRate > 0 ? (data.progress.clickRate / data.sumProgress.clickRate) * 100 : 0) : 100" :show-text="false" color="#18CED8"></el-progress>
                <span class="box-card-progress-center">{{data.progress.clickRate}}%</span>
                <span class="box-card-progress-text">展现率</span>
              </div>
            </el-col>
            <el-col :span="4">
              <div class="right-line box-card-progress">
                <el-progress class="box-card-progress-el" type="circle" :percentage="data.sumProgress!= null && data.sumProgress.cpm != undefined ? (data.sumProgress.cpm > 0 ? (data.progress.cpm / data.sumProgress.cpm) * 100 : 0) : 100" :show-text="false" color="#FDB400"></el-progress>
                <span class="box-card-progress-center">{{data.progress.cpm}}</span>
                <span class="box-card-progress-text">每显示千次费用(CPM)</span>
              </div>
            </el-col>
            <el-col :span="4">
              <div class="right-line box-card-progress">
                <el-progress class="box-card-progress-el" type="circle" :percentage="data.sumProgress!= null && data.sumProgress.cpc != undefined ? (data.sumProgress.cpc > 0 ? (data.progress.cpc / data.sumProgress.cpc) * 100 : 0) : 100" :show-text="false" color="#35AD3A"></el-progress>
                <span class="box-card-progress-center">{{data.progress.cpc}}</span>
                <span class="box-card-progress-text">每点击一次费用(CPC)</span>
              </div>
            </el-col>
            <el-col :span="4">
              <div class="box-card-progress">
                <el-progress class="box-card-progress-el" type="circle" :percentage="data.sumProgress!= null && data.sumProgress.fee != undefined ? (data.sumProgress.fee > 0 ? (data.progress.fee / data.sumProgress.fee) * 100 : 0) : 100" :show-text="false" color="#F73925"></el-progress>
                <span class="box-card-progress-center">{{data.progress.fee}}</span>
                <span class="box-card-progress-text">消费金额</span>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
    <el-row :gutter="20" class="box-line">
      <el-col :xs="24" :sm="24" :lg="14">
        <div class="box-card">
          <LineBar :data = "data.line" class="box-line-right1"></LineBar>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="10">
        <div class="box-card">
          <el-tabs id="box-line-right2" v-model="activeName" @tab-click="handleClick">
            <el-button-group class="box-line-right2-btn">
              <el-button class="filter-item right" :type="listQuery.picPushOrClick ? 'primary' : ''" size="small" @click="handlePushTimes">推送数</el-button>
              <el-button class="filter-item right" :type="!listQuery.picPushOrClick ? 'primary' : ''" size="small" @click="handleClickTimes">点击数</el-button>
            </el-button-group>
            <el-tab-pane label="目标类型" name="first">
            </el-tab-pane>
            <el-tab-pane label="广告类型" name="second">
            </el-tab-pane>
            <el-tab-pane label="显示样式" name="third">
            </el-tab-pane>
            <el-tab-pane label="挂载位置" name="fourth">
            </el-tab-pane>
            <Pie class="box-pie" :data = "data.pie"></Pie>
          </el-tabs>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { httpGet } from '@/utils/restful.js'
import { getAdvStatist, getAdvStatistPie, getSimplePushAdv } from '@/api/url.js'
import { timeFormatterSort } from '@/utils/formatter.js'
import Pie from '@/components/Echarts/Pie'
import LineBar from '@/components/Echarts/LineBar'
export default {
  components: {
    LineBar,
    Pie
  },
  data () {
    return {
      data: {
        header: {
          price: 0.00,
          toBeAudited: 0,
          toBePutIn: 0,
          putIn: 0,
          expired: 0
        },
        progress: {
          pushTimes: 0,
          clickTimes: 0,
          clickRate: 0,
          cpm: 0,
          cpc: 0,
          fee: 0
        },
        line: {
          title: '',
          colors: [],
          xAxis: [],
          series: [{name: '', data: []}, {name: '', data: []}]
        },
        pie: {
          title: '',
          colors: [],
          list: []
        }
      },
      listQuery: {
        departmentId: this.$store.getters.departmentId,
        beginTime: undefined,
        endTime: undefined,
        advId: null,
        picType: 1,
        picPushOrClick: true
      },
      advList: [{id: null, advTitle: '全部'}],
      timeFormatterSort: timeFormatterSort,
      activeName: 'first',
      index: 5
    }
  },
  created () {
    this.getSimplePushAdv()
    this.handleMonth()
  },
  methods: {
    getSimplePushAdv () {
      httpGet(getSimplePushAdv, {departmentId: this.$store.getters.departmentId, isEnable: 1}).then(res => {
        if (res.data) {
          this.advList = res.data
          this.advList.unshift({id: null, advTitle: '全部'})
        }
      }).catch(() => {
      })
    },
    changeAdv () {
      this.handleFilter()
    },
    // 获取统计数据
    handleFilter () {
      let params = Object.assign(this.listQuery, {departmentId: this.$store.getters.departmentId})
      httpGet(getAdvStatist, params).then(res => {
        if (res.data) {
          this.data = res.data
          this.data.line.unit = '次'
          this.$forceUpdate()
        }
      }).catch(() => {
      })
    },
    handlePieFilter () {
      let params = Object.assign(this.listQuery, {departmentId: this.$store.getters.departmentId})
      httpGet(getAdvStatistPie, params).then(res => {
        if (res.data) {
          this.data.pie = res.data
          this.$forceUpdate()
        }
      }).catch(() => {
      })
    },
    // 今天
    handleToday () {
      this.index = 1
      this.listQuery.beginTime = timeFormatterSort(new Date()) + ' 00:00:00'
      this.listQuery.endTime = timeFormatterSort(new Date()) + ' 23:59:59'
      this.time = [this.listQuery.beginTime, this.listQuery.endTime]
      this.handleFilter()
    },
    // 昨天
    handleYesterday () {
      this.index = 2
      this.listQuery.beginTime = timeFormatterSort(new Date() - 3600 * 1000 * 24) + ' 00:00:00'
      this.listQuery.endTime = timeFormatterSort(new Date() - 3600 * 1000 * 24) + ' 23:59:59'
      // this.time = [this.listQuery.beginTime, this.listQuery.endTime]
      this.handleFilter()
    },
    // 本周
    handleWeek () {
      this.index = 3
      let date = new Date()
      let weekday = date.getDay() || 7 // 获取星期几,getDay()返回值是 0（周日） 到 6（周六） 之间的一个整数。0||7为7，即weekday的值为1-7
      date.setDate(date.getDate() - weekday + 1) // 往前算（weekday-1）天，年份、月份会自动变化
      this.listQuery.beginTime = timeFormatterSort(date) + ' 00:00:00'
      this.listQuery.endTime = timeFormatterSort(new Date()) + ' 23:59:59'
      // this.time = [this.listQuery.beginTime, this.listQuery.endTime]
      this.handleFilter()
    },
    // 上周
    handleLastWeek () {
      this.index = 4
      let date = new Date()
      let weekday = date.getDay() || 7 // 获取星期几,getDay()返回值是 0（周日） 到 6（周六） 之间的一个整数。0||7为7，即weekday的值为1-7
      date.setDate(date.getDate() - weekday - 6) // 往前算（weekday-1）天，年份、月份会自动变化
      this.listQuery.beginTime = timeFormatterSort(date) + ' 00:00:00'
      this.listQuery.endTime = timeFormatterSort(3600 * 1000 * 24 * 6 + date.getTime()) + ' 23:59:59'
      // this.time = [this.listQuery.beginTime, this.listQuery.endTime]
      this.handleFilter()
    },
    // 本月
    handleMonth () {
      this.index = 5
      this.listQuery.beginTime = timeFormatterSort(new Date(new Date().setDate(1))) + ' 00:00:00'
      this.listQuery.endTime = timeFormatterSort(new Date()) + ' 23:59:59'
      // this.time = [this.listQuery.beginTime, this.listQuery.endTime]
      this.handleFilter()
    },
    // 上月
    handleLastMonth () {
      this.index = 6
      this.listQuery.beginTime = timeFormatterSort(new Date(new Date().setMonth(new Date().getMonth() - 1)).setDate(1)) + ' 00:00:00'
      this.listQuery.endTime = timeFormatterSort(new Date(new Date().setDate(0))) + ' 23:59:59'
      this.time = [this.listQuery.beginTime, this.listQuery.endTime]
      this.handleFilter()
    },
    handleChanger () {
      this.$message({
        message: '暂不支持预留余额',
        type: 'warning'
      })
    },
    handleClick (tab, event) {
      // console.log(tab, event)
      this.listQuery.picType = Number(tab.index) + 1
      this.handlePieFilter()
    },
    handlePushTimes () {
      this.listQuery.picPushOrClick = true
      this.handlePieFilter()
    },
    handleClickTimes () {
      this.listQuery.picPushOrClick = false
      this.handlePieFilter()
    }
  }
}
</script>
<style lang="scss" scoped>
.box-title {
  margin-left: 10px;
  border-left: 3px solid rgb(30, 90, 218);
  padding-left: 10px;
  font-weight: bold;
  font-size: 16px;
}
.box-card {
  margin: 10px;
  cursor: pointer;
  font-size: 12px;
  position: relative;
  overflow: hidden;
  color: #666;
  background: #fff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
  border-color: rgba(0, 0, 0, .05);
  border-radius: 8px;
}
.box-tip {
  .box-overview {
    .box {
      width: 100%;
      height: 150px;
      padding: 25px 30px;
      font-size: 20px;
      font-weight: 400;
      .overview-title {
        width: 100%;
        padding-bottom: 15px;
        border-bottom: 1px dashed rgb(168, 168, 168);
        span {
          margin-left: 7px;
        }
      }
      .oberview-money {
        padding-top: 15px;
        .left {
          float: left;
          width: 60%;
          text-align: left;
          font-size: 26px;
          font-weight: bold
        }
        .right {
          float: right;
        }
      }
    }
  }
  .box-status {
    .box {
      width: 100%;
      height: 150px;
      padding: 30px;
      .box-card-info {
        padding: 15px;
        height: 100px;
        border-radius: 8px;
        font-size: 18px;
        color: rgb(104, 104, 104);
        font-weight: bold;
        letter-spacing: 2px;
        .box-card-info-img {
          width: 40%;
          height: 60px;
          float: left;
          i {
            font-size: 40px;
            padding: 10px;
          }
        }
        .box-card-info-title {
          text-align: center;
          width: 60%;
          float: left;
        }
        .box-card-info-num {
          text-align: right;
          font-size: 26px;
          width: 60%;
          float: left;
        }
      }
      .box1 {
        background: linear-gradient(to right,rgb(255, 208, 165), rgb(246, 163, 255));
      }
      .box2 {
        background: linear-gradient(to right,rgb(159, 255, 231), rgb(229, 255, 168));
      }
      .box3 {
        background: linear-gradient(to right,#aacfff, #fdb5ff);
      }
      .box4 {
        background: linear-gradient(to right,rgb(255, 166, 166), rgb(255, 212, 146));
      }
    }
  }
}
.box-progress {
  margin-top: 10px;
  .box-title-button-group {
    margin-left: 15px;
  }
  .box {
    width: 100%;
    height: 210px;
    position: relative;
    .box-card-progress-tip {
      position: absolute;
      left: 10px;
      top: 5px;
      color: red;
    }
    .box-card-progress {
      margin: 30px 0 20px;
      padding: 0 30px;
      display:flex;
      flex-direction:column;
      position: relative;
      .box-card-progress-el {
        align-self:center;
      }
      .box-card-progress-center {
        position: absolute;
        top: 50px;
        width: 100%;
        padding: 0 60px 0 0;
        text-align: center;
        font-size: 22px;
      }
      .box-card-progress-text {
        text-align: center;
        margin-top: 10px;
        font-size: 18px;
      }
    }
    .right-line {
      border-right: 1px dashed rgb(192, 192, 192);;
    }
  }
}
.box-line {
  .box-card {
    margin: 10px 10px 0;
  }
  .box-line-left {
    height: 370px;
    padding: 10px;
  }
  .box-line-right1 {
    height: 370px;
  }
  #box-line-right2 {
    height: 370px;
    padding: 10px 30px;
    position: relative;
    .box-line-right2-btn {
      z-index: 10000;
      position: absolute;
      right: 2%;
      bottom: 20%;
    }
    .box-pie {
      height: 350px;
      margin-top: -35px;
      z-index: 1000 !important;
    }
  }
}
</style>

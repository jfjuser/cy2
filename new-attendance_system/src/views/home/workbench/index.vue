<template>
  <div class="app-container">
    <header class="header">
      <p>
        <span class="title" v-if="userName">{{userName}}，</span>欢迎您！现在只需关注我们的公众号，即可免费使用手机考勤。
        <el-popover placement="right-start" trigger="hover">
          <el-image fit="fill" style="height:150px;width:150px;" :src="qrcode"></el-image>
          <div class="text-center">扫码关注</div>
          <i slot="reference" class="el-icon-mobile-phone pointer" style="color: #909399;"></i>
        </el-popover>
      </p>
      <div style="color: #606266;">{{dateFormatter}}</div>
    </header>
    <section class="statistical">
      <div class="title">
        考勤汇总
        <el-tag :effect="tagtype == 1 ? 'dark' : 'plain'" @click.native="ontag(1)" class="pointer" style="margin-left: 15px;">昨日</el-tag>
        <el-tag :effect="tagtype == 2 ? 'dark' : 'plain'" @click.native="ontag(2)" class="pointer">上月</el-tag>
      </div>
      <el-row>
        <el-col :span="5"><div class="grid-content"><span class="yellow"><count-to class="num" :endVal="(beginNoPunchCard-0) + (endNoPunchCard-0)" :duration="1500"></count-to></span><span>缺卡</span></div></el-col>
        <el-col :span="1"><div class="line"><el-divider direction="vertical"></el-divider></div></el-col>
        <el-col :span="5"><div class="grid-content"><span class="warning"><count-to class="num" :endVal="lateNum" :duration="1500"></count-to></span><span>迟到</span></div></el-col>
        <el-col :span="1"><div class="line"><el-divider direction="vertical"></el-divider></div></el-col>
        <el-col :span="5"><div class="grid-content"><span class="danger"><count-to class="num" :endVal="leaveEarlyNum" :duration="1500"></count-to></span><span>早退</span></div></el-col>
        <el-col :span="1"><div class="line"><el-divider direction="vertical"></el-divider></div></el-col>
        <!-- <el-col :span="6"><div class="grid-content"><span class="num blue"><count-to :endVal="attendance" :duration="1500"></count-to>%</span><span>出勤率</span></div></el-col> -->
        <el-col :span="6"><div class="grid-content"><span class="grey"><count-to class="num" :endVal="absenteeismDay" :duration="1500"></count-to></span><span>旷工</span></div></el-col>
      </el-row>
    </section>

    <section>
      <el-row :gutter="20">
        <el-col :span="18">
          <div class="tablebox">
            <div>
              <span class="title">考勤记录</span>
              <el-tooltip effect="dark" content="只显示最近3天的50条记录" placement="right">
                <i class="el-icon-info pointer" style="color: #606266;"></i>
              </el-tooltip>
            </div>
            <div class="table">
              <el-table :data="tableData" style="width: 100%;" height="430px" v-loading.body="listLoading" element-loading-text="加载中..." empty-text="近期没有考勤记录">
                <el-table-column prop="userName" label="姓名" fixed></el-table-column>
                <el-table-column prop="workDay" label="日期" sortable width="100">
                  <template slot-scope="scope">
                    {{timeFormatterSort(scope.row.workDay)}}
                  </template>
                </el-table-column>
                <el-table-column prop="firstBeginTime" label="上班1打卡时间">
                  <template slot-scope="scope">
                    {{timeHourMinFormatter(scope.row.firstBeginTime)}}
                  </template>
                </el-table-column>
                <el-table-column prop="firstBeginResult" label="上班1打卡结果">
                  <template slot-scope="scope">
                    {{formatterResult(scope.row.firstBeginResult, true)}}
                  </template>
                </el-table-column>
                <el-table-column prop="firstEndTime" label="下班1打卡时间">
                  <template slot-scope="scope">
                    {{timeHourMinFormatter(scope.row.firstEndTime)}}
                  </template>
                </el-table-column>
                <el-table-column prop="firstEndResult" label="下班1打卡结果">
                  <template slot-scope="scope">
                    {{formatterResult(scope.row.firstEndResult, false)}}
                  </template>
                </el-table-column>
                <el-table-column prop="secondBeginTime" label="上班2打卡时间">
                  <template slot-scope="scope">
                    {{timeHourMinFormatter(scope.row.secondBeginTime)}}
                  </template>
                </el-table-column>
                <el-table-column prop="secondBeginResult" label="上班2打卡结果">
                  <template slot-scope="scope">
                    {{formatterResult(scope.row.secondBeginResult, true)}}
                  </template>
                </el-table-column>
                <el-table-column prop="secondEndTime" label="下班2打卡时间">
                  <template slot-scope="scope">
                    {{timeHourMinFormatter(scope.row.secondEndTime)}}
                  </template>
                </el-table-column>
                <el-table-column prop="secondEndResult" label="下班2打卡结果">
                  <template slot-scope="scope">
                    {{formatterResult(scope.row.secondEndResult, false)}}
                  </template>
                </el-table-column>
                <el-table-column prop="thirdBeginTime" label="上班3打卡时间">
                  <template slot-scope="scope">
                    {{timeHourMinFormatter(scope.row.thirdBeginTime)}}
                  </template>
                </el-table-column>
                <el-table-column prop="thirdBeginResult" label="上班3打卡结果">
                  <template slot-scope="scope">
                    {{formatterResult(scope.row.thirdBeginResult, true)}}
                  </template>
                </el-table-column>
                <el-table-column prop="thirdEndTime" label="下班3打卡时间">
                  <template slot-scope="scope">
                    {{timeHourMinFormatter(scope.row.thirdEndTime)}}
                  </template>
                </el-table-column>
                <el-table-column prop="thirdEndResult" label="下班3打卡结果">
                  <template slot-scope="scope">
                    {{formatterResult(scope.row.thirdEndResult, false)}}
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </el-col>
        <!-- 轮播图 -->
        <el-col :span="6">
          <el-carousel trigger="click" class="swiper">
            <el-carousel-item v-for="(item, i) in imgList" :key="i">
              <el-image :src="item.img" fit="fill" style="height:100%"></el-image>
            </el-carousel-item>
          </el-carousel>
        </el-col>
      </el-row>
    </section>
    <el-dialog
      title="帮助引导"
      :visible.sync="dialogVisibleGuide"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="22%">
      <div>
        {{homeText}}
      </div>
      <span slot="footer" class="dialog-footer">
        <guide-button><el-button @click="closeHelp">下一步</el-button></guide-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import CountTo from 'vue-count-to'
import GuideButton from '@/components/GuideButton'
import { timeHourMinFormatter, timeDayFormatter, timeFormatterSort } from '@/utils/formatter.js'
import { statistical, AIDailyCount } from '@/api/url'
import { httpGet } from '@/utils/restful'
import qrcode from '@/assets/qrcode.png'
import adv2 from '@/assets/ad/home-adv2.jpg'
import { homeText } from '@/utils/helptext'
import Storage from '@/utils/storage'
export default {
  components: {
    CountTo,
    GuideButton
  },
  data () {
    return {
      qrcode,
      homeText,
      timeHourMinFormatter: timeHourMinFormatter,
      timeDayFormatter: timeDayFormatter,
      timeFormatterSort,
      tagtype: 1,
      statisticalQuery: {
        departmentId: this.$store.getters.departmentId,
        beginTime: timeFormatterSort(new Date() - 3600 * 1000 * 24) + ' 00:00:00',
        endTime: timeFormatterSort(new Date() - 3600 * 1000 * 24) + ' 23:59:59'
      },
      beginNoPunchCard: 0,
      endNoPunchCard: 0,
      lateNum: 0,
      leaveEarlyNum: 0,
      absenteeismDay: 0,
      attendance: 0,
      tableData: [],
      listQuery: {
        offset: 1,
        limit: 50,
        endTime: timeFormatterSort(new Date()) + ' 23:59:59',
        beginTime: timeFormatterSort(new Date() - 3600 * 1000 * 48) + ' 00:00:00',
        userName: undefined
      },
      listLoading: true,
      imgList: [
        {img: adv2},
        {img: adv2}
      ],
      userName: this.$store.getters.userName,
      dateNow: Date.now(),
      setIntervalId: undefined,
      dialogVisibleGuide: false
    }
  },
  computed: {
    dateFormatter () {
      let timeDayFormatterArr = timeDayFormatter(this.dateNow).split(' ')
      return `${timeDayFormatterArr[0]} ${timeHourMinFormatter(this.dateNow)} ${timeDayFormatterArr[1]}`
    }
  },
  created () {
    this.updateTime()
    this.getStatistical(this.statisticalQuery)
    this.fetchData()
  },
  mounted () {
    if (!Storage.get('homeShowHelp')) {
      this.$nextTick(() => {
        this.dialogVisibleGuide = true
      })
    }
  },
  methods: {
    closeHelp () {
      this.dialogVisibleGuide = false
      Storage.set('homeShowHelp', 1)
    },
    // 格式化打卡结果
    formatterResult (value, flag) {
      if (value !== null) {
        if (value === 0) {
          return '正常'
        } else if (value === -1) {
          return '缺卡'
        } else {
          if (flag) {
            return '迟到' + value + '分钟'
          } else {
            return '早退' + value + '分钟'
          }
        }
      } else {
        return '-'
      }
    },
    updateTime () {
      this.setIntervalId = setInterval(() => { this.dateNow = Date.now() }, 1000)
    },
    getMonthDays (year, month) {
      var thisDate = new Date(year, month, 0) // 当天数为0 js自动处理为上一月的最后一天
      return thisDate.getDate()
    },
    ontag (type) {
      this.tagtype = type
      if (type === 1) {
        const statisticalQuery = {
          departmentId: this.$store.getters.departmentId,
          beginTime: timeFormatterSort(new Date() - 3600 * 1000 * 24) + ' 00:00:00',
          endTime: timeFormatterSort(new Date() - 3600 * 1000 * 24) + ' 23:59:59'
        }
        this.getStatistical(statisticalQuery)
      }
      if (type === 2) {
        let timeList = timeFormatterSort(new Date(new Date().setMonth(new Date().getMonth() - 1))).split('-')
        let year = timeList[0]
        let month = timeList[1]
        let day = this.getMonthDays(year, month)
        const statisticalQuery = {
          departmentId: this.$store.getters.departmentId,
          beginTime: year + '-' + month + '-01' + ' 00:00:00',
          endTime: year + '-' + month + '-' + day + ' 23:59:59'
        }
        this.getStatistical(statisticalQuery)
      }
    },
    // 汇总
    getStatistical (statisticalQuery) {
      httpGet(statistical, statisticalQuery).then(res => {
        if (res.data) {
          this.beginNoPunchCard = res.data.beginNoPunchCard || 0
          this.endNoPunchCard = res.data.endNoPunchCard || 0
          this.lateNum = res.data.lateNum || 0
          this.leaveEarlyNum = res.data.leaveEarlyNum || 0
          this.absenteeismDay = res.data.absenteeismDay || 0
        } else {
          this.beginNoPunchCard = 0
          this.endNoPunchCard = 0
          this.lateNum = 0
          this.leaveEarlyNum = 0
          this.absenteeismDay = 0
        }
      }).catch(() => {})
    },
    // 获取数据
    fetchData () {
      let self = this
      this.listQuery = Object.assign(this.listQuery, {
        departmentId: this.$store.getters.departmentId,
        userId: this.$store.getters.userId
      })
      httpGet(AIDailyCount, this.listQuery).then(res => {
        if (res.data === null) {
          self.tableData = []
          self.total = 0
          self.listLoading = false
        } else {
          self.tableData = res.data.rows
          self.total = res.data.total
          self.listLoading = false
        }
      }).catch(() => {
        self.listLoading = false
      })
    }
  },
  beforeDestroy () {
    if (this.setIntervalId) {
      clearTimeout(this.setIntervalId)
    }
  }
}
</script>

<style lang="scss" scoped>
.header {
  margin-bottom: 20px;
}
.blue {
  color: #409EFF
}
.yellow {
  color: #FFCC00
}
.warning {
  color: #E6A23C
}
.danger {
  color: #F56C6C
}
.grey {
  color: #909399;
}
.title {
  font-size: 18px;
}
.statistical {
  background-color: #fff;
  margin-bottom: 20px;
  border-radius: 5px;
  overflow: hidden;
  .title {
    padding: 20px;
    padding-bottom: 0;
  }
  .el-col {
    .grid-content {
      min-height: 140px;
      color: #606266;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      > span:nth-of-type(1) {
        margin-bottom: 15px;
      }
      .num {
        font-weight: bold;
        font-size: 40px;
      }
    }
    .line {
      min-height: 130px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 95px;
    }
  }
}
.tablebox {
  .title {
    line-height: 50px;
  }
  .table {
    background-color: #fff;
    padding: 0 15px;
    border-radius: 5px;
  }
}
.swiper {
  padding-top: 50px;
  /deep/ .el-carousel__container {
    height: 430px;
  }
}
</style>

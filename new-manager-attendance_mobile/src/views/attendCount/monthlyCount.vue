<template>
    <div class="bgc-grey">
      <!-- <rightTopBtn @click.native="exportInfo">导出</rightTopBtn> -->
        <form action="/"><van-search placeholder="请输入姓名" v-model="listQuery.userName" @search="onSearch" /></form>
        <van-cell-group>
            <van-cell title="选择日期" is-link :value="time" @click="showTime = true" />
        </van-cell-group>
        <section>
            <p class="title">汇总</p>
            <van-grid class="summary">
                <van-grid-item>
                    <div class="num mar-b-10 yellow">{{(beginNoPunchCard-0) + (endNoPunchCard-0)}}</div>
                    <p class="fc-grey">缺卡</p>
                </van-grid-item>
                <van-grid-item>
                    <div class="num mar-b-10 warning">{{lateNum}}</div>
                    <p class="fc-grey">迟到</p>
                </van-grid-item>
                <van-grid-item>
                    <div class="num mar-b-10 danger">{{leaveEarlyNum}}</div>
                    <p class="fc-grey">早退</p>
                </van-grid-item>
                <!-- <van-grid-item>
                    <div class="num mar-b-10 blue">{{attendance}}%</div>
                    <p class="fc-grey">出勤率</p>
                </van-grid-item> -->
                <van-grid-item>
                    <div class="num mar-b-10 fc-grey">{{absenteeismDay}}</div>
                    <p class="fc-grey">旷工</p>
                </van-grid-item>
            </van-grid>
        </section>
        <section>
            <van-list
            v-model="listLoading"
            :finished="finished"
            finished-text="无更多数据"
            :error.sync="error"
            error-text="请求失败，点击重新加载"
            @load="fetchData"
            >
                <div class="panel" v-for="(item, index) in listData" :key="index">
                    <van-cell :title="item.userName" is-link center @click="godetail(item)">
                        出勤天数: <span class="fc-blue">{{item.commuteDay||0}}</span>
                    </van-cell>
                    <van-grid>
                        <van-grid-item>
                            <div class="num mar-b-10 fc-blue">{{item.lateNum||0}}</div>
                            <p class="fc-grey">迟到次数</p>
                        </van-grid-item>
                        <van-grid-item>
                            <div class="num mar-b-10 fc-blue">{{item.leaveEarlyNum||0}}</div>
                            <p class="fc-grey">早退次数</p>
                        </van-grid-item>
                        <van-grid-item>
                            <div class="num mar-b-10 fc-blue">{{item.beginNoPunchCard||0}}</div>
                            <p class="fc-grey">上班缺卡次数</p>
                        </van-grid-item>
                        <van-grid-item>
                            <div class="num mar-b-10 fc-blue">{{item.endNoPunchCard||0}}</div>
                            <p class="fc-grey">下班缺卡次数</p>
                        </van-grid-item>
                    </van-grid>
                </div>
            </van-list>
        </section>
        <van-popup v-model="showTime" position="bottom" :close-on-click-overlay="false" safe-area-inset-bottom>
            <van-datetime-picker
            v-model="currentDate1"
            type="year-month"
            :max-date="maxDate"
            show-toolbar
            @cancel="showTime=false"
            @confirm="handleConfirm"
            />
        </van-popup>
    </div>
</template>

<script>
import { Grid, GridItem, DatetimePicker, Search, Dialog } from 'vant'
import { checkDataArr, toNull } from '@/utils/formatter'
import { AIMonthlyCount, statistical, exportAIMonthlyCount } from '@/api/url'
import rightTopBtn from '@/mixin/rightTopBtn'
import { httpExport } from '@/utils/restful'
export default {
  components: {
    'van-grid': Grid,
    rightTopBtn,
    'van-grid-item': GridItem,
    [DatetimePicker.name]: DatetimePicker,
    'van-search': Search
  },
  beforeRouteEnter (to, from, next) {
    if (from.path.indexOf('/detailCount') > -1) {
      to.meta.isBack = true
    }
    next()
  },
  data () {
    return {
      time: this.$dayjs().format('YYYY-MM'),
      showTime: false,
      maxDate: new Date(),
      currentDate1: new Date(),
      listData: [
        // {userName: '小明', id: 1, commuteDay: 22, lateNum: 0, leaveEarlyNum: 0, beginNoPunchCard: 10, endNoPunchCard: 10}
      ],
      listQuery: {
        userName: '',
        offset: 1,
        limit: 10,
        time: this.$dayjs().format('YYYY-MM') + '-01',
        // departmentId: this.$store.getters.departmentId,
        departmentId: this.$store.getters.departmentId,
        userId: this.$store.getters.userId
      },
      finished: false,
      listLoading: false,
      error: false,
      statisticalQuery: {
        departmentId: this.$store.getters.departmentId,
        beginTime: '',
        endTime: ''
      },
      exportForm: {
        number: 0
      },
      beginNoPunchCard: 0,
      endNoPunchCard: 0,
      lateNum: 0,
      leaveEarlyNum: 0,
      attendance: 0,
      absenteeismDay: 0 // 旷工
    }
  },
  computed: {
    isData () {
      return checkDataArr(this.listData)
    }
  },
  created () {
    this.isFirstEnter = true
    let timeList = this.$dayjs().format('YYYY-MM-DD').split('-')
    let year = timeList[0]
    let month = timeList[1]
    let day = this.getMonthDays(year, month)
    this.statisticalQuery.beginTime = year + '-' + month + '-01' + ' 00:00:00'
    this.statisticalQuery.endTime = year + '-' + month + '-' + day + ' 23:59:59'
    this.getStatistical()
  },
  methods: {
    // 获取月份天数
    getMonthDays (year, month) {
      var thisDate = new Date(year, month, 0) // 当天数为0 js自动处理为上一月的最后一天
      return thisDate.getDate()
    },
    handleConfirm (val) {
      let timeList = this.$dayjs(val).format('YYYY-MM-DD').split('-')
      let year = timeList[0]
      let month = timeList[1]
      let day = this.getMonthDays(year, month)

      this.listData = []
      this.listQuery.offset = 1
      this.time = this.$dayjs(val).format('YYYY-MM')
      this.listQuery.time = this.$dayjs(val).format('YYYY-MM') + '-01'
      this.statisticalQuery.beginTime = year + '-' + month + '-01' + ' 00:00:00'
      this.statisticalQuery.endTime = year + '-' + month + '-' + day + ' 23:59:59'
      this.showTime = false
      this.fetchData()
      this.getStatistical()
    },
    exportInfo () {
      Dialog.confirm({
        title: '提示',
        message: '确定要导出月度考勤记录吗'
      }).then(() => {
        let data = Object.assign({
          departmentId: this.$store.getters.departmentId
        }, this.exportForm)
        data = Object.assign(data, this.listQuery)
        httpExport(exportAIMonthlyCount, data).then((res) => {
          this.$toast.faill('敬请期待！')
          // this.dialogExportVisible = false
          // setTimeout(() => { this.exportLoading = false }, 300)
        }).catch(() => {
          // this.exportLoading = false
        })
      }).catch(() => {})
    },
    godetail (data) {
      this.listQuery.id = data.id
      this.$router.push('/detailCount/monthly/?data=' + encodeURI(JSON.stringify(this.listQuery)))
    },
    fetchData () {
      this.listQuery.userName = toNull(this.listQuery.userName)
      this.$http.get(AIMonthlyCount, {params: this.listQuery}).then(res => {
        this.listQuery.offset = this.listQuery.offset + 1
        this.error = false
        if (res.data && res.data.rows) {
          this.listData = Object.freeze(this.listData.concat(res.data.rows))
          this.listLoading = false
          if (res.data.rows.length < this.listQuery.limit) {
            this.finished = true
          }
        } else {
          this.listLoading = false
          this.finished = true
        }
      }).catch(() => {
        this.listLoading = false
        this.error = true
      })
    },
    onSearch () {
      this.listQuery.offset = 1
      this.listData = []
      this.fetchData()
    },
    // 汇总
    getStatistical () {
      const ToastLoading = this.$toast.loading({ message: '加载中...', position: 'middle' })
      this.$http.get(statistical, {params: this.statisticalQuery}).then(res => {
        ToastLoading.clear()
        if (res.data) {
          this.beginNoPunchCard = res.data.beginNoPunchCard || 0
          this.endNoPunchCard = res.data.endNoPunchCard || 0
          this.lateNum = res.data.lateNum || 0
          this.leaveEarlyNum = res.data.leaveEarlyNum || 0
          this.absenteeismDay = res.data.absenteeismDay || 0
          if (res.data.headCount) {
            this.attendance = ((res.data.commuteDay || 0) / (res.data.headCount || 0) * 100).toFixed(1)
          } else {
            this.attendance = 0
          }
        } else {
          this.beginNoPunchCard = 0
          this.endNoPunchCard = 0
          this.lateNum = 0
          this.leaveEarlyNum = 0
          this.attendance = 0
          this.absenteeismDay = 0
        }
      }).catch(() => { ToastLoading.clear() })
    }
  },
  activated () {
    if (!this.isFirstEnter) {
      if (!this.$route.meta.isBack) {
        this.listLoading = false
        this.error = false
        this.listQuery.offset = 1
        this.listQuery.userName = ''
        this.listQuery.time = this.$dayjs().format('YYYY-MM') + '-01'
        this.time = this.$dayjs().format('YYYY-MM')
        this.currentDate1 = new Date()
        this.listData = []
        this.finished = false
        // this.fetchData()
        this.statisticalQuery.time = this.$dayjs().format('YYYY-MM-DD')
        this.getStatistical()
      }
    }
    this.$route.meta.isBack = false
    this.isFirstEnter = false
  }
}
</script>

<style lang="scss" scoped>
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
.num {
    font-size: 14px;
}
.title {
    padding: 5px 15px;
}
.summary {
    margin-bottom: 15px;
}
.panel {
    margin-top: 15px;
}
</style>

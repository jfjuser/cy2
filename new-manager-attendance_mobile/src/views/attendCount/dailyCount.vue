<template>
    <div class="bgc-grey">
      <!-- <rightTopBtn @click.native="exportInfo1">导出</rightTopBtn> -->
      <van-loading type="spinner" color="#1989fa" class="detailsLoading" v-if="toDetailsLoading" size="24px" vertical>加载中...</van-loading>
        <form action="/"><van-search placeholder="请输入姓名" v-model="listQuery.userName" @search="onSearch" /></form>
        <van-cell-group>
            <van-cell title="选择日期" is-link :value="time" @click="showTime = true" />
        </van-cell-group>
        <section>
            <p class="title">汇总</p>
            <van-grid class="summary">
                <van-grid-item @click="toExceptionDetails(1)">
                    <div class="num mar-b-10 yellow">{{(beginNoPunchCard-0) + (endNoPunchCard-0)}}</div>
                    <p class="fc-grey">缺卡</p>
                </van-grid-item>
                <van-grid-item @click="toExceptionDetails(2)">
                    <div class="num mar-b-10 warning">{{lateNum}}</div>
                    <p class="fc-grey">迟到</p>
                </van-grid-item>
                <van-grid-item @click="toExceptionDetails(3)">
                    <div class="num mar-b-10 danger">{{leaveEarlyNum}}</div>
                    <p class="fc-grey">早退</p>
                </van-grid-item>
                <!-- <van-grid-item>
                    <div class="num mar-b-10 blue">{{attendance}}%</div>
                    <p class="fc-grey">出勤率</p>
                </van-grid-item> -->
                <van-grid-item @click="toExceptionDetails(4)">
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
                        出勤天数: <span class="fc-blue">{{item.commuteDay}}</span>
                    </van-cell>
                    <van-grid>
                        <van-grid-item >
                            <div class="num mar-b-10 fc-blue">{{item.lateNum}}</div>
                            <p class="fc-grey">迟到次数</p>
                        </van-grid-item>
                        <van-grid-item>
                            <div class="num mar-b-10 fc-blue">{{item.leaveEarlyNum}}</div>
                            <p class="fc-grey">早退次数</p>
                        </van-grid-item>
                        <van-grid-item>
                            <div class="num mar-b-10 fc-blue">{{item.beginNoPunchCard}}</div>
                            <p class="fc-grey">上班缺卡次数</p>
                        </van-grid-item>
                        <van-grid-item>
                            <div class="num mar-b-10 fc-blue">{{item.endNoPunchCard}}</div>
                            <p class="fc-grey">下班缺卡次数</p>
                        </van-grid-item>
                    </van-grid>
                </div>
            </van-list>
        </section>
        <van-popup round v-model="showExceptionDetails" @touchmove.stop.prevent="moveHandle">
    <van-cell-group round style="width:80vw;height:80vh">
      <van-nav-bar
  :title="type"
  left-text="返回"
  left-arrow
  @click-left="onClickLeft"
/>
      <!-- <van-cell value="详情" is-link> -->
       <van-cell v-for="item in listDetailsData" :key="item.id">
     <!-- 使用 title 插槽来自定义标题 -->
        <template #title>
          <span class="custom-title">{{item.userName}}</span>
        </template>
      </van-cell>
    </van-cell-group>
    </van-popup>
        <van-popup v-model="showTime" position="bottom" :close-on-click-overlay="false" safe-area-inset-bottom>
            <van-datetime-picker
            v-model="currentDate1"
            type="date"
            :max-date="maxDate"
            show-toolbar
            @cancel="showTime=false"
            @confirm="handleConfirm"
            />
        </van-popup>
    </div>
</template>

<script>
import { Grid, GridItem, DatetimePicker, Search, Dialog, Loading, Popup, NavBar, Cell, CellGroup } from 'vant'
import { checkDataArr, toNull, timeFormatterSort } from '@/utils/formatter'
import rightTopBtn from '@/mixin/rightTopBtn'
// import { httpExport } from '@/utils/restful'
import { AIDailyCount, exportTestInfo, statistical, updateWorkRecord, Exception } from '@/api/url' // , exportAIDailyCount
export default {
  name: 'dailyCount',
  components: {
    NavBar,
    'van-grid': Grid,
    rightTopBtn,
    'van-grid-item': GridItem,
    [DatetimePicker.name]: DatetimePicker,
    'van-search': Search,
    vanLoading: Loading,
    vanPopup: Popup,
    vanCell: Cell,
    vanCellGroup: CellGroup
  },
  beforeRouteEnter (to, from, next) {
    if (from.path.indexOf('/detailCount') || from.path.indexOf('/exceptionDetails') > -1) {
      to.meta.isBack = true
    }
    next()
  },
  data () {
    return {
      status: {boolean: {1: '缺卡', 2: '迟到', 3: '早退', 4: '旷工'}}, // 审核状态
      type: '',
      listDetailsData: [],
      showExceptionDetails: false, // 是否展示弹出窗口
      toDetailsLoading: false,
      time: this.$dayjs().format('YYYY-MM-DD'),
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
        beginTime: this.$dayjs().format('YYYY-MM-DD') + ' 00:00:00',
        endTime: this.$dayjs().format('YYYY-MM-DD') + ' 23:59:59',
        departmentId: this.$store.getters.departmentId,
        userId: this.$store.getters.userId
      },
      finished: false,
      listLoading: false,
      error: false,
      statisticalQuery: {
        departmentId: this.$store.getters.departmentId,
        beginTime: this.$dayjs().format('YYYY-MM-DD') + ' 00:00:00',
        endTime: this.$dayjs().format('YYYY-MM-DD') + ' 23:59:59'
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
    this.getStatistical()
  },
  methods: {
    moveHandle () {},
    // 详情弹窗点击返回时
    onClickLeft () {
      this.showExceptionDetails = false
    },
    // 跳转到考勤异常页面
    async toExceptionDetails (type) {
      let chooseDate = timeFormatterSort(this.currentDate1)
      this.toDetailsLoading = true
      let departmentId = this.$store.getters.departmentId
      await this.$http.get(updateWorkRecord, {params: {
        beginTime: chooseDate + ' 00:00:00',
        endTime: chooseDate + ' 23:59:59',
        departmentId: departmentId,
        type: type
      }})
      await this.$http.get(Exception, {params: {
        beginTime: chooseDate + ' 00:00:00',
        endTime: chooseDate + ' 23:59:59',
        departmentId: departmentId,
        type: type
      }}).then(res => {
        let list = []
        res.data.rows.forEach(ele => {
          if (ele !== null) {
            list.push(ele)
          }
        })
        this.listDetailsData = list
        this.type = this.status.boolean[Number(type)]
      })
      this.toDetailsLoading = false
      this.showExceptionDetails = true
      // this.$router.push({path: '/exceptionDetails/', query: {date: chooseDate, type: type}})
    },
    handleConfirm (val) {
      this.time = this.$dayjs(val).format('YYYY-MM-DD')
      this.listData = []
      this.listQuery.offset = 1
      this.listQuery.beginTime = this.$dayjs(val).format('YYYY-MM-DD') + ' 00:00:00'
      this.listQuery.endTime = this.$dayjs(val).format('YYYY-MM-DD') + ' 23:59:59'
      this.statisticalQuery.beginTime = this.$dayjs(val).format('YYYY-MM-DD') + ' 00:00:00'
      this.statisticalQuery.endTime = this.$dayjs(val).format('YYYY-MM-DD') + ' 23:59:59'
      this.showTime = false
      this.fetchData()
      this.getStatistical()
    },
    exportInfo1 () {
      this.$http.get(exportTestInfo, {params: {
        year: '2020',
        month: '02',
        groupId: 139
      }}).then((res) => {
        console.log(res)
      }).catch(() => {})
    },
    exportInfo () {
      Dialog.confirm({
        title: '提示',
        message: '确定要导出日度考勤记录吗'
      }).then(() => {
        let data = Object.assign({
          departmentId: this.$store.getters.departmentId
        }, this.exportForm)
        this.listQuery.userName = toNull(this.listQuery.userName)
        this.listQuery.offset = 1
        data = Object.assign(data, this.listQuery)
        data.userId = undefined
        this.$http.get(AIDailyCount, {params: data}).then(res => {
          console.log(res)
          const jsonData = res.data.rows
          let str = `姓名,部门,日期,上班打卡时间(1),打卡结果(1),下班打卡时间(1),打卡结果(1),上班打卡时间(2),打卡结果(2),下班打卡时间(2),打卡结果(2),上班打卡时间(3),打卡结果(3),下班打卡时间(3),打卡结果(3),加班时长(min),打卡时间,出勤天数,出勤班次,休息天数,工作时长(min),迟到次数,迟到时长(min),严重迟到次数,严重迟到时长(min),旷工迟到天数,早退次数,早退时长(min),上班缺卡次数,下班缺卡次数,旷工天数\n`
          for (let i = 0; i < jsonData.length; i++) {
            for (let item in jsonData[i]) {
              console.log(item)
              if (item === 'id' || item === 'departmentId' || item === 'type' || item === 'aiUserId' || item === 'workShiftId') {
              } else {
                if (item === 'workDay') jsonData[i][item] = this.timeFormatterSort(jsonData[i][item])
                if (item === 'firstBeginTime' || item === 'firstEndTime' || item === 'secondBeginTime' || item === 'secondEndTime' || item === 'thirdBeginTime' || item === 'thirdEndTime' || item === 'overTime') jsonData[i][item] = this.timeHourMinFormatter(jsonData[i][item])
                if (item === 'firstBeginResult' || item === 'firstEndResult' || item === 'secondBeginResult' || item === 'secondEndResult' || item === 'thirdBeginResult' || item === 'thirdEndResult') jsonData[i][item] = this.formatterResult(jsonData[i][item])
                if (jsonData[i][item] === null) jsonData[i][item] = '' // 如果结果为null 则显示 空格
                str += `${jsonData[i][item] + '\t'},`
              }
            }
            str += '\n'
          }
          let url = 'data:text/csv;charset=utf-8,\ufeff' + encodeURIComponent(str)
          let link = document.createElement('a')
          link.href = url
          link.download = 'daySheet.csv' // 导出excel的名字
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        }).catch(() => {})
        // httpExport(exportAIDailyCount, data).then((res) => {
        //   this.$toast.faill('敬请期待！')
        //   alert(123)
        //   // this.dialogExportVisible = false
        //   // setTimeout(() => { this.exportLoading = false }, 300)
        // }).catch(() => {
        //   // this.exportLoading = false
        // })
      }).catch(() => {})
    },
    godetail (data) {
      this.listQuery.id = data.id
      this.$router.push('/detailCount/daily/?data=' + encodeURI(JSON.stringify(this.listQuery)))
    },
    fetchData () {
      this.listQuery.userName = toNull(this.listQuery.userName)
      this.$http.get(AIDailyCount, {params: this.listQuery}).then(res => {
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
      this.listQuery.offset = 1
      this.listLoading = false
      this.error = false
      if (!this.$route.meta.isBack) {
        this.listQuery.userName = ''
        this.listQuery.beginTime = this.$dayjs().format('YYYY-MM-DD') + ' 00:00:00'
        this.listQuery.endTime = this.$dayjs().format('YYYY-MM-DD') + ' 23:59:59'
        this.time = this.$dayjs().format('YYYY-MM-DD')
        this.currentDate1 = new Date()
        this.listData = []
        this.finished = false
        // this.fetchData()
        this.getStatistical()
      } else {
        this.listData = []
        this.finished = false
        this.getStatistical()
      }
    }
    this.$route.meta.isBack = false
    this.isFirstEnter = false
    console.log(this.isFirstEnter)
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
.detailsLoading{
position: fixed;
top: 20%;;
left:0px;
right:0px;
bottom:0px;
margin: auto;
z-index: 99999;
}
</style>

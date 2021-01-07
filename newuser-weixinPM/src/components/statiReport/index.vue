<template>
  <div class="asdd">
    <Tabs color="#fff" @click="onClick">
      <Tab title="每日">
        <daycut @timeDot="timeDot"></daycut>
          <div style="width:100vw;" v-show="!hasData">
            <Cell :border=false title="总计工作时长" :value="userAttend.workMin"></Cell>
            <Tag mark style="margin:0.5rem 0 0 4vw" type="primary">一</Tag>
            <div class="card1 sty" span="24">
              <Cell :border="false" title="上班打卡时间" :value="timeFormatter(userAttend.firstBeginTime)"></Cell>
              <Cell :border="false" title="打卡结果" :value="punchToCard(userAttend.firstBeginResult)"></Cell>
              <Cell  :border="false" title="下班打卡时间" :value="timeFormatter(userAttend.firstEndTime)"></Cell>
              <Cell  :border="false" title="打卡结果" :value="punchComeCard(userAttend.firstEndResult)"></Cell>
            </div>
            <Tag v-show="userAttend.secondBeginTime === undefined && userAttend.secondEndTime === undefined" mark style="margin:0.5rem 0 0 4vw" type="primary">二</Tag>
            <div v-show="userAttend.secondBeginTime === undefined && userAttend.secondEndTime === undefined" class="card1 sty" span="24">
              <Cell :border="false" title="上班打卡时间" :value="timeFormatter(userAttend.secondBeginTime)"></Cell>
                <Cell :border="false" title="打卡结果" :value="punchToCard(userAttend.secondBeginResult)"></Cell>
                <Cell :border="false" title="下班打卡时间" :value="timeFormatter(userAttend.secondEndTime)"></Cell>
                <Cell :border="false" title="打卡结果" :value="punchComeCard(userAttend.secondEndResult)"></Cell>
            </div>
            <Tag v-show="userAttend.thirdBeginTime === undefined && userAttend.thirdEndTime === undefined" mark style="margin:0.5rem 0 0 4vw" type="primary">三</Tag>
            <div v-show="userAttend.thirdBeginTime === undefined && userAttend.thirdEndTime === undefined" style="margin-bottom:4.5rem" class="card1 sty" span="24">
              <Cell :border="false" title="上班打卡时间" :value="timeFormatter(userAttend.thirdBeginTime)"></Cell>
              <Cell :border="false" title="打卡结果" :value="punchToCard(userAttend.thirdBeginResult)"></Cell>
              <Cell  :border="false" title="下班打卡时间" :value="timeFormatter(userAttend.thirdEndTime)"></Cell>
              <Cell :border="false"  title="打卡结果" :value="punchComeCard(userAttend.thirdEndResult)"></Cell>
            </div>
          </div>
          <div v-show="hasData">
            <div class="card sty" style="text-align:center" span="24">暂无数据</div>
          </div>
        </Tab>
      <Tab style="background-color:rgb(244,244,244)" title="月度异常">
        <Field
          left-icon="todo-list-o"
          v-model="listQuery.time"
          @focus="isMonth = true"
          readonly
          />
        <Popup v-model="isMonth" position=top style="width:90vw;margin-left:5vw;height:42vh">
          <DatetimePicker
            v-model="currentDate"
            type="year-month"
            :formatter=formatter
            @confirm="saveValue"
            @cancel="isMonth = false"
            style="dateTable"
          />
        </Popup>
        <div style="text-align:right;background-color:#fff">
           <Button @click="onSearch" type="info" icon="search" size="small">查询</Button>
        </div>
        <div v-show="!noData" style="width:100vw;margin:0.5rem 0 3rem 0;">
          <div v-for="(item, index) in monthData" :key=index>
            <CellGroup :border=false style="margin-top: 1rem;margin-bottom:1rem">
              <Cell :border="false" title="异常日期" :value="timeFormatterSort(item.workDay)"></Cell>
              <Cell :border="false" title="上班打卡时间" :value="timeFormatter(item.firstBeginTime)"></Cell>
              <Cell :border="false" title="打卡结果" :value="punchToCard(item.firstBeginResult)"></Cell>
              <Cell  :border="false" title="下班打卡时间" :value="timeFormatter(item.firstEndTime)"></Cell>
              <Cell  :border="false" title="打卡结果" :value="punchComeCard(item.firstEndResult)"></Cell>
            </CellGroup>
          </div>
        </div>
        <div v-show="noData">
          <div class="card" span="24" style="line-height:8rem;text-align:center;">暂无数据</div>
        </div>
       <!-- <Tag plain type="primary">提示：该统计只可查看每月度异常考勤情况</Tag> -->
        </Tab>
      <Tab title="核销记录" style="background-color:rgb(238,238,238);" >
         <Field
          label="开始时间"
          v-model="listQuery.beginTime"
          placeholder="请选择"
          @focus="isDate = true"
          visible-item-count="count"
          readonly
          />
        <Field
          label="结束时间"
          v-model="listQuery.endTime"
          placeholder="请选择"
          @focus="isEnd = true"
          readonly
          />
          <Popup v-model="isDate" position=top style="width:90vw;margin-left:5vw;height:42vh">
            <DatetimePicker
              v-model="currentDate"
              type="date"
              :formatter=formatter
              @confirm="saveValue1"
              @cancel="isDate = false"
              style="dateTable"
            />
        </Popup>
        <Popup v-model="isEnd" position=top style="width:90vw;margin-left:5vw;height:42vh">
        <div class="asd">
          <DatetimePicker
            v-model="currentDate"
            type="date"
            :formatter=formatter
            @confirm="getValue"
            @cancel="isEnd = false"
          />
        </div>
        </Popup>
          <div style="text-align:right;padding-right:0.5rem;background-color:#fff">
           <Button @click="onSearch1" type="info" icon="search" size="small">查询</Button>
        </div>
          <div v-show="!isNotData" style="width:100vw;margin-top:1rem">
            <div v-for="item in userList" :key=item.id>
              <CellGroup style="margin-bottom: 1rem;">
                <Cell title="姓名" :value="item.userName"></Cell>
                <Cell title="考勤时间" :value="timeFormatterSort(item.workDay)"></Cell>
                <Cell title="类型" :value="punchCardType(item.type)"></Cell>
                <Cell title="详情" :value="item.workModify"></Cell>
                <Cell title="操作时间" :value="timeFormatter(item.updateAt)"></Cell>
                <!-- <span style="display:block;line-height:2.5rem;color:red;margin-left:86%;" @click="del(item)">删除</span> -->
              </CellGroup>
            </div>
          </div>
          <div v-show="isNotData">
            <div class="card" span="24" style="line-height:8rem;text-align:center;">暂无核销记录</div>
          </div>
        </Tab>
    </Tabs>
    <tabbar :param=0></tabbar>
  </div>
</template>
<script>
import tabbar from '@/components/tabbar.vue'
import daycut from '@/components/dayCut/index.vue'
import { timeFormatterSort, timeFormatter, punchCardType, punchToCard, punchComeCard } from '@/utils/formatter.js'
import { httpGet } from '@/utils/restful'
import { AIDailyCount, AIMonthlyCount, AIWriteOff } from '@/api/url'
import { Tag, Tab, CellGroup, Cell, Tabs, DatetimePicker, Field, Popup, Button } from 'vant'
import { mapGetters } from 'vuex' // 引入vuex辅助函数
export default {
  name: 'statiReport',
  data () {
    return {
      time: [],
      isMonth: false,
      value: '',
      hasData: true,
      noData: true,
      timeFormatter: timeFormatter,
      timeFormatterSort: timeFormatterSort,
      punchToCard: punchToCard,
      punchComeCard: punchComeCard,
      punchCardType: punchCardType,
      userList: undefined,
      userData: undefined,
      monthData: [],
      total: undefined,
      count: 3,
      date: '2019-01',
      isNotData: true,
      userAttend: {
        firstBeginResult: 0,
        firstBeginTime: undefined,
        firstEndResult: 0,
        firstEndTime: undefined,
        secondBeginResult: 0,
        secondBeginTime: undefined,
        secondEndResult: 0,
        secondEndTime: undefined,
        thirdBeginResult: 0,
        thirdBeginTime: undefined,
        thirdEndResult: 0,
        thirdEndTime: undefined,
        workDay: ''
      },
      listQuery: {
        beginTime: undefined,
        endTime: undefined,
        time: undefined
      },
      isEnd: false,
      isDate: false,
      startTime: undefined,
      endTime: undefined,
      isShow: false,
      isLoading: false,
      currentDate: new Date(),
      minDate: new Date(),
      showMore: false,
      moreItem: {},
      dialogAttendVisible: false,
      attendanceTime: undefined,
      lateNum: '',
      earlyNum: '',
      isDateAttend: false,
      touchstart: undefined
    }
  },
  props: {
    daycut
  },
  components: {
    Tag,
    daycut,
    tabbar,
    Tab,
    Tabs,
    DatetimePicker,
    Field,
    Popup,
    Button,
    Cell,
    CellGroup
  },
  computed: {
    ...mapGetters('user', [
      'userId',
      'active'
    ])
  },
  created () {
    this.listQuery.beginTime = timeFormatterSort(new Date(new Date().setDate(1)))
    this.listQuery.endTime = timeFormatterSort(new Date())
    this.time = [this.listQuery.beginTime, this.listQuery.endTime]
    this.attendanceTime = timeFormatterSort(new Date())
  },
  mounted () {
    // console.log(this.active)
    if (this.active !== 3) {
      this.$dialog.confirm({
        title: '官方提示',
        message: '暂未加入考勤组，请加入考勤组！'
      }).then(() => {
        this.$router.replace({name: 'addInfo'})
      }).catch(() => {})
    }

    this.fetchData() // 执行获取数据 每日
  },
  methods: {
    timeDot (time) {
      this.attendanceTime = time
      this.fetchData()
    },
    formatter (type, value) {
      if (type === 'year') {
        return value + '年'
      } else if (type === 'month') {
        return value + '月'
      }
      return value
    },
    // 获取数据 每日
    fetchData () {
      console.log(this.attendanceTime)
      let parobj = {
        // userId: Number(localStorage.getItem('userid')),
        // userId: 17524,
        userId: this.userId,
        attendanceTime: this.attendanceTime
        // userId: 356,
        // attendanceTime: '2019-08-15'
      }
      console.log('开始请求数据： ', parobj)

      httpGet(AIDailyCount, parobj).then(res => {
        console.log('获取到的每日考勤信息：', res)

        if (res.data === null) {
          self.userAttend = {}
          self.hasData = true
        } else {
          self.userAttend = res.data
          self.hasData = false
        }
      }).catch(() => {
      })
      return false
    },
    // 获取数据 没月
    fetchDataMonth () {
      let self = this
      let monthlyAttendanceStatisticsInfoDto = {
        beginTime: this.listQuery.beginTime,
        endTime: this.listQuery.endTime,
        // userId: Number(localStorage.getItem('userid'))
        userId: this.userId
        // userId: 2459
      }
      httpGet(AIMonthlyCount, monthlyAttendanceStatisticsInfoDto).then(res => {
        console.log('获取数据 每月', res)

        if (res.data === null) {
          self.monthData = []
          self.noData = true
        } else {
          self.monthData = res.data
          self.noData = false
        }
        console.log(res)
      }).catch(() => {
      })
      return false
      // this.listQuery.time = this.listQuery.time.substring(0, 7)
    },
    // 获取数据 核销记录
    fetchDataCancel () {
      let self = this
      // this.listQuery = Object.assign(this.listQuery, {userId: Number(localStorage.getItem('userid'))}) // 2459
      this.listQuery = Object.assign(this.listQuery, {userId: this.userId}) // 2459
      httpGet(AIWriteOff, this.listQuery).then(res => {
        console.log('获取数据 核销记录', res)

        if (res.data === null) {
          self.userList = []
          self.isNotData = true
        } else {
          self.userList = res.data
          self.isNotData = false
        }
        console.log(res)
      }).catch(() => {
      })
      return false
    },
    // 确定选择时间
    saveValue (value) {
      this.listQuery.beginTime = this.tanslate(value)
      this.listQuery.time = this.tanslate(value).substring(0, 7)
      this.isDate = false
      this.isMonth = false
    },
    saveValue1 (value) {
      this.listQuery.beginTime = this.tanslate(value)
      this.listQuery.time = this.tanslate(value).substring(0, 7)
      this.isDate = false
      this.isMonth = false
    },
    getValue (value) {
      this.listQuery.endTime = this.tanslate(value)
      this.isEnd = false
      this.isMonth = false
    },
    tanslate (d) {
      const newDate = d.getFullYear() + '-' + ((d.getMonth() + 1) < 10 ? '0' + (d.getMonth() + 1) : (d.getMonth() + 1)) + '-' + (d.getDate() < 10 ? '0' + d.getDate() : d.getDate()) + ' ' + (d.getHours() < 10 ? '0' + d.getHours() : d.getHours()) + ':' + (d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes()) + ':' + (d.getSeconds() < 10 ? '0' + d.getSeconds() : d.getSeconds())
      return newDate
    },
    onSearch () {
      var arr = this.listQuery.time.split('-')
      var lastDay = new Date(arr[0], arr[1], 0)
      var day = lastDay.getDate()
      console.log(day)
      if (this.listQuery.time.split('-').length > 2) {
        console.log(this.listQuery.time)
        this.listQuery.beginTime = this.listQuery.time
        this.listQuery.endTime = this.listQuery.time.substring(0, 8) + day
      } else {
        this.listQuery.beginTime = this.listQuery.time + '-' + '01'
        this.listQuery.endTime = this.listQuery.time + '-' + day
      }
      this.listQuery.offset = 1
      this.fetchDataMonth()
    },
    onSearch1 () {
      this.listQuery.offset = 1
      this.fetchDataCancel()
    },
    onClick (index, title) {
      if (title === '每日') {
        this.listQuery.beginTime = timeFormatterSort(new Date(new Date().setDate(1))) + ' 00:00:00'
        this.listQuery.endTime = timeFormatterSort(new Date()) + ' 23:59:59'
        this.fetchData()
      }
      if (title === '月度异常') {
        this.listQuery.time = timeFormatterSort(new Date(new Date().setDate(1)))
        this.fetchDataMonth()
      }
      if (title === '核销记录') {
        this.listQuery.beginTime = timeFormatterSort(new Date(new Date().setDate(1))) + ' 00:00:00'
        this.listQuery.endTime = timeFormatterSort(new Date()) + ' 23:59:59'
        this.fetchDataCancel()
      }
    }
  }

}
</script>
<style scoped>
.asdd >>> .van-tabs__nav {
  background-color:rgb(33,124,255);
  /* line-height:2.5rem; */
}
.asd >>> .van-pagination__item--disabled, .van-pagination__item--disabled:active {
  color:rgb(14,105,254)
}
.asdd >>> .van-pagination__page-desc{
  /* background-color: #fff */
}
.van-nav-bar{
  background-color: rgb(33,124,255);
}
.asdd >>> .van-tab span{
 color: #fff
}
.van-nav-bar__arrow+.van-nav-bar__text{
  color:#fff;
}
.van-icon{
  color:#fff;
}
.van-tabs--card{
  padding-top: 0
}
.van-nav-bar__title{
  color:#fff;
}
.asdd >>> .van-ellipsis{
  /* color:#000; */
}
</style>
<style lang="scss" scoped>
.col{
  text-align: center;
  border: 1px solid #ccc;
  line-height: 2rem;
}
.sty{
  line-height:8rem;
  margin-top:0.5rem;
  // display:flex;
  // justify-content: space-around;
}
.card{
  width:92vw;
  border-radius:8px;
  box-shadow:0 0 12px #ccc;
  margin-left:4vw;
  position:absolute;
  top:12rem;
  height:8rem;
  color:red;
  background:#fff
}
.card1{
  width:92vw;
  margin-left:4vw;
  border-radius:8px;
  box-shadow:0 0 12px #ccc;
  height:11rem;
  color:red;
  margin-bottom: 1rem;
  background:#fff
}
.morebox {
  background-color: #fff;
  width: 100%;
  height: 100%;
  overflow: scroll;
  .righttext {
    color: #409EFF
  }
}
.radioInput {
  width: 30%;
  padding: 0;
  padding-left: .5rem
}
</style>

<template>
  <div style="background-color:rgb(238,238,238);min-height:100vh">
    <NavBar
      title="考勤统计"
      left-text="返回"
      left-arrow
      @click-left="onClickLeft"
      />
    <Tabs type="card" color="#1E90FF" @click="onClick">
      <Tab title="每日统计">
        <Field
          label="开始时间"
          v-model="listQuery.beginTime"
          placeholder="请选择"
          @focus="showDate"
          visible-item-count="count"
          readonly
          />
        <Field
          label="结束时间"
          v-model="listQuery.endTime"
          placeholder="请选择"
          @focus="pushEnd"
          readonly
          />
          <div style="overflow: hidden;">
            <el-select placeholder="打卡状态" v-model='listQuery.type' style="display: block;width:50%;float: left;">
              <el-option v-for="item in option4" :key="item.value" :label="item.text" :value="item.value"></el-option>
            </el-select>
            <Field
        class="searchInput" style="display: block;width:50%;height:40px;float: left;"
        v-model="listQuery.departmentName"
                placeholder="请输入部门名"
              />
          </div>
          <Popup v-model="isDate" style="width:80vw;height:45vh">
            <DatetimePicker
              v-model="currentDate"
              type="date"
              :formatter=formatter
              @confirm="saveValue"
              @cancel="bye"
              style="dateTable"
            />
        </Popup>
        <Popup v-model="isEnd" style="width:80vw;height:45vh">
          <DatetimePicker
            v-model="currentDate"
            type="date"
            :formatter=formatter
            @confirm="getValue"
            @cancel="bye"
          />
        </Popup>
         <Search
            v-model="listQuery.userName"
            placeholder="姓名"
            show-action
            @search="onSearch"
          >
            <Button slot="action" @click="onSearch" type="info" size="small">搜索</Button>
          </Search>
          <Popup v-model="showMore" position="right" :overlay="false" class="morebox">
            <div style="padding:.5rem;text-align:right;"><Button type="default" size="small" @click="close">返回</Button></div>
            <CellGroup @touchstart="ontouchstart" @touchend="ontouchend">
              <Cell title="姓名" :value="moreItem.userName"></Cell>
              <Cell title="部门" :value="moreItem.departmentName"></Cell>
              <Cell title="日期" :value="timeFormatter(moreItem.workDay)"></Cell>
              <Cell title="上班打卡时间(1)" :value="timeFormatter(moreItem.firstBeginTime)"></Cell>
              <Cell title="打卡结果" value-class="righttext">
                <span @click="cellclick(moreItem, 'firstBeginResult')">{{punchToCard(moreItem.firstBeginResult)}}</span>
              </Cell>
              <Cell title="下班打卡时间(1)" :value="timeFormatter(moreItem.firstEndTime)"></Cell>
              <Cell title="打卡结果" :value="punchComeCard(moreItem.firstEndResult)" value-class="righttext">
                <span @click="cellclick(moreItem, 'firstEndResult')">{{punchComeCard(moreItem.firstEndResult)}}</span>
              </Cell>
              <Cell title="上班打卡时间(2)" :value="timeFormatter(moreItem.secondBeginTime)"></Cell>
              <Cell title="打卡结果" :value="punchToCard(moreItem.secondBeginResult)" value-class="righttext">
                <span @click="cellclick(moreItem, 'secondBeginResult')">{{punchToCard(moreItem.secondBeginResult)}}</span>
              </Cell>
              <Cell title="下班打卡时间(2)" :value="timeFormatter(moreItem.secondEndTime)"></Cell>
              <Cell title="打卡结果" :value="punchComeCard(moreItem.secondEndResult)" value-class="righttext">
                <span @click="cellclick(moreItem, 'secondEndResult')">{{punchComeCard(moreItem.secondEndResult)}}</span>
              </Cell>
              <Cell title="上班打卡时间(3)" :value="timeFormatter(moreItem.thirdBeginTime)"></Cell>
              <Cell title="打卡结果" :value="punchToCard(moreItem.thirdBeginResult)" value-class="righttext">
                  <span @click="cellclick(moreItem, 'thirdBeginResult')">{{punchToCard(moreItem.thirdBeginResult)}}</span>
              </Cell>
              <Cell title="下班打卡时间(3)" :value="timeFormatter(moreItem.thirdEndTime)"></Cell>
              <Cell title="打卡结果" :value="punchComeCard(moreItem.thirdEndResult)" value-class="righttext">
                <span @click="cellclick(moreItem, 'thirdEndResult')">{{punchComeCard(moreItem.thirdEndResult)}}</span>
              </Cell>
              <Cell title="加班时长(min)" :value="moreItem.overTimeCount" v-if="moreItem.overTimeCount"></Cell>
              <Cell title="加班时长(min)" value="--" v-if="!moreItem.overTimeCount"></Cell>
              <Cell title="加班申请情况" :value="moreItem.remark" v-if="moreItem.remark"></Cell>
              <Cell title="加班申请情况" value="--" v-if="!moreItem.remark"></Cell>
              <Cell title="出勤天数" :value="moreItem.commuteDay"></Cell>
              <Cell title="出勤班次" :value="moreItem.workShiftName"></Cell>
              <Cell title="休息天数" :value="moreItem.restDay"></Cell>
              <Cell title="工作时长(min)" :value="moreItem.workMin"></Cell>
              <Cell title="迟到次数" :value="moreItem.lateNum"></Cell>
              <Cell title="迟到时长(min)" :value="moreItem.lateMin"></Cell>
              <Cell title="严重迟到次数" :value="moreItem.seriouslyLateNum"></Cell>
              <Cell title="严重迟到时长(min)" :value="moreItem.seriouslyLateMin"></Cell>
              <Cell title="旷工迟到天数" :value="moreItem.absenteeismLateDay"></Cell>
              <Cell title="早退次数" :value="moreItem.leaveEarlyNum"></Cell>
              <Cell title="早退时长(min)" :value="moreItem.leaveEarlyMin"></Cell>
              <Cell title="上班缺卡次数" :value="moreItem.beginNoPunchCard"></Cell>
              <Cell title="下班缺卡次数" :value="moreItem.endNoPunchCard"></Cell>
              <Cell title="旷工天数" :value="moreItem.absenteeismDay"></Cell>
            </CellGroup>
          </Popup>
          <van-dialog
            v-model="dialogAttendVisible"
            title="修改打卡结果"
            show-cancel-button
            confirmButtonText="保存"
            @confirm="updateData"
            >
            <RadioGroup v-model="updateAttend.updateType" style="padding-left:.5rem;" @change="contentChange" v-if="updateAttend.type === 1">
              <Radio name="0" style="margin-bottom:.8rem">正常</Radio>
              <Radio name="1" style="margin-bottom:.8rem">
                <div style="display:flex">
                  迟到<Field placeholder="请输入" type="number" v-model="lateNum" class="radioInput" />分钟
                </div>
              </Radio>
              <Radio name="2" style="margin-bottom:.8rem">
                <div style="display:flex">
                  早退<Field placeholder="请输入" type="number" v-model="earlyNum" class="radioInput" />分钟
                </div>
              </Radio>
              <Radio name="3" style="margin-bottom:.8rem">缺卡</Radio>
              <Radio name="4" style="margin-bottom:.8rem">请假</Radio>
              <Radio name="5" style="margin-bottom:.8rem">出差</Radio>
            </RadioGroup>
            <Field
              label="选择日期时间"
              placeholder="请选择"
              @focus="isDateAttend=true"
              :value="updateAttend.punchCardTime?timeFormatter(updateAttend.punchCardTime):''"
              readonly
              v-if="updateAttend.type === 0"
              />
            <Popup v-model="isDateAttend" position="bottom" get-container=".morebox">
              <DatetimePicker
                type="datetime"
                @confirm="saveValueAttend"
                @cancel="isDateAttend=false"
              />
            </Popup>
          </van-dialog>
          <PullRefresh v-model="isLoading" @refresh="onRefresh">
            <div style="width:100vw;">
              <div v-for="item in userData" :key=item.id>
                <CellGroup style="margin-bottom: 1rem;">
                  <Cell title="姓名" :value="item.userName"></Cell>
                  <Cell title="部门" :value="item.departmentName"></Cell>
                  <Cell title="日期" :value="timeFormatter(item.workDay)"></Cell>
                  <!-- <Cell title="上班打卡时间(1)" :value="item.firstBeginTime"></Cell>
                  <Cell title="打卡结果" :value="punchToCard(item.firstBeginResult)"></Cell>
                  <Cell title="下班打卡时间(1)" :value="item.firstEndTime"></Cell>
                  <Cell title="打卡结果" :value="punchComeCard(item.firstEndResult)"></Cell>
                  <Cell title="上班打卡时间(2)" :value="item.secondBeginTime"></Cell>
                  <Cell title="打卡结果" :value="punchToCard(item.secondBeginResult)"></Cell>
                  <Cell title="下班打卡时间(2)" :value="item.secondEndTime"></Cell>
                  <Cell title="打卡结果" :value="punchComeCard(item.secondEndResult)"></Cell>
                  <Cell title="上班打卡时间(3)" :value="item.thirdBeginTime"></Cell>
                  <Cell title="打卡结果" :value="punchToCard(item.thirdBeginResult)"></Cell>
                  <Cell title="下班打卡时间(3)" :value="item.thirdEndTime"></Cell>
                  <Cell title="打卡结果" :value="punchComeCard(item.thirdEndResult)"></Cell> -->
                  <!-- <Cell title="出勤天数" :value="item.commuteDay"></Cell> -->
                  <!-- <Cell title="出勤班次" :value="item.workShiftName"></Cell> -->
                  <!-- <Cell title="休息天数" :value="item.restDay"></Cell> -->
                  <!-- <Cell title="工作时长(min)" :value="item.workMin"></Cell> -->
                  <Cell title="迟到次数" :value="item.lateNum"></Cell>
                  <!-- <Cell title="迟到时长(min)" :value="item.lateMin"></Cell> -->
                  <!-- <Cell title="严重迟到次数" :value="item.seriouslyLateNum"></Cell> -->
                  <!-- <Cell title="严重迟到时长(min)" :value="item.seriouslyLateMin"></Cell> -->
                  <Cell title="早退次数" :value="item.leaveEarlyNum"></Cell>
                  <!-- <Cell title="早退时长(min)" :value="item.leaveEarlyMin"></Cell> -->
                  <Cell title="上班缺卡次数" :value="item.beginNoPunchCard"></Cell>
                  <Cell title="下班缺卡次数" :value="item.endNoPunchCard"></Cell>
                  <Cell title="旷工天数" :value="item.absenteeismDay"></Cell>
                  <span style="display:block;line-height:2.5rem;color:rgb(14,105,254);margin-left:86%;" @click="handleMore(item)">更多</span>
                </CellGroup>
              </div>
            </div>
          </PullRefresh>
           <van-row v-show="hasData">
            <van-col span="24" class="card" style="letter-spacing:3px;line-height:7rem;text-align:center;">暂无数据</van-col>
          </van-row>
            <div class="asd" v-show="!hasData" style="margin:1.5rem 0 0rem 0">
              <Pagination
                v-model="listQuery.offset"
                :page-count="Math.ceil(total/10)"
                :total-items = 'total'
                mode="simple"
                @change="seePage"
              >
              </Pagination>
          </div>
        </Tab>
      <Tab title="月度统计">
        <Field
          left-icon="todo-list-o"
          :value="listQuery.time.slice(0,7)"
          @focus="selectDate"
          readonly
          />
        <Field
          label="部门"
          v-model="listQuery.departmentName"
          placeholder="请输入"
          />
          <Search
            v-model="listQuery.userName"
            placeholder="姓名"
            show-action
            @search="onSearch"
          >
            <Button slot="action" @click="onSearch" type="info" size="small">搜索</Button>
          </Search>
          <div style="text-align:right">
            <Button @click.native="(isSet = true) && (asd = defaultDate)" type="info" style="margin:0.25rem;border-radius:0.3rem">设置考勤默认起始日期</Button>
          </div>
          <van-dialog v-model="isSet" @confirm="setQue" title="设置日期" show-cancel-button>
            <Field label="日期" v-model="asd" required placeholder="请输入1-31号之间的数字"/>
          </van-dialog>
          <Popup v-model="isDate" style="width:80vw;height:45vh">
            <DatetimePicker
              v-model="currentDate"
              type="year-month"
              :formatter=formatter
              @confirm="saveValue"
              @cancel="bye"
              style="dateTable"
            />
          </Popup>
          <PullRefresh v-model="isLoading" @refresh="onRefresh">
          <div style="width:90vw;margin:0.5rem 0 0 5vw;">
            <div v-for="item in monthData" :key=item.id>
              <CellGroup style="border:1px solid #ccc;margin-top: 1.5rem;">
                <Cell title="姓名" :value="item.userName"></Cell>
                <Cell title="部门" :value="item.departmentName"></Cell>
                <Cell title="日期" :value="timeFormatter(item.workDay)"></Cell>
                <Cell title="出勤天数" :value="item.commuteDay"></Cell>
                <Cell title="休息天数" :value="item.restDay"></Cell>
                <Cell title="工作时长(min)" :value="item.workMin"></Cell>
                <Cell title="迟到次数" :value="item.lateNum"></Cell>
                <Cell title="迟到时长(min)" :value="item.lateMin"></Cell>
                <Cell title="严重迟到次数" :value="item.seriouslyLateNum"></Cell>
                <Cell title="严重迟到时长(min)" :value="item.seriouslyLateMin"></Cell>
                <Cell title="旷工迟到天数" :value="item.absenteeismLateDay"></Cell>
                <Cell title="早退次数" :value="item.leaveEarlyNum"></Cell>
                <Cell title="加班时长(min)" :value="item.overTimeCount" v-if="item.overTimeCount"></Cell>
                <Cell title="加班时长(min)" value="--" v-if="!item.overTimeCount"></Cell>
                <Cell title="早退时长(min)" :value="item.leaveEarlyMin"></Cell>
                <Cell title="上班缺卡次数" :value="item.beginNoPunchCard"></Cell>
                <Cell title="下班缺卡次数" :value="item.endNoPunchCard"></Cell>
                <Cell title="旷工天数" :value="item.absenteeismDay"></Cell>
              </CellGroup>
            </div>
          </div>
          </PullRefresh>
          <van-row v-show="noData">
            <van-col span="24" class="card" style="letter-spacing:3px;line-height:7rem;text-align:center;">暂无数据</van-col>
          </van-row>
          <div v-show="!noData" class="asd" style="margin:1.5rem 0 1rem 0">
              <Pagination
                v-model="listQuery.offset"
                :page-count="Math.ceil(total/10)"
                :total-items = 'total'
                mode="simple"
                @change="seePage"
              >
              </Pagination>
          </div>
      </Tab>
      <Tab title="核销统计">
         <Field
          label="开始时间"
          v-model="listQuery.beginTime"
          placeholder="请选择"
          @focus="showDate"
          visible-item-count="count"
          readonly
          />
        <Field
          label="结束时间"
          v-model="listQuery.endTime"
          placeholder="请选择"
          @focus="pushEnd"
          readonly
          />
          <Popup v-model="isDate" style="width:80vw;height:45vh">
            <DatetimePicker
              v-model="currentDate"
              type="date"
              :formatter=formatter
              @confirm="saveValue"
              @cancel="bye"
              style="dateTable"
            />
        </Popup>
        <Popup v-model="isEnd" style="width:80vw;height:45vh">
        <div class="asd">
          <DatetimePicker
            v-model="currentDate"
            type="date"
            :formatter=formatter
            @confirm="getValue"
            @cancel="bye"
          />
        </div>
        </Popup>
         <Search
            v-model="listQuery.userName"
            placeholder="姓名"
            show-action
            @search="onSearch"
          >
            <Button slot="action" @click="onSearch" type="info" size="small">搜索</Button>
          </Search>
          <div style="width:100vw;margin:0.5rem 0 0 0vw;">
            <div v-for="item in userList" :key=item.id>
              <CellGroup style="margin-top: 1.2rem;">
                <Cell title="姓名" :value="item.userName"></Cell>
                <Cell title="考勤时间" :value="timeFormatterSort(item.workDay)"></Cell>
                <Cell title="类型" :value="punchCardType(item.type)"></Cell>
                <Cell title="详情" :value="item.workModify"></Cell>
                <Cell title="操作时间" :value="timeFormatter(item.updateAt)"></Cell>
                <!-- <span style="display:block;line-height:2.5rem;color:red;margin-left:86%;" @click="del(item)">删除</span> -->
              </CellGroup>
            </div>
          </div>
          <van-row v-show="isNotData">
            <van-col span="24" class="card" style="line-height:7rem;letter-spacing:3px;text-align:center;">暂无数据</van-col>
          </van-row>
           <div class="asd" v-show="!isNotData" style="margin:1.5rem 0 0rem 0">
              <Pagination
                v-model="listQuery.offset"
                :page-count="Math.ceil(total/10)"
                :total-items = 'total'
                mode="simple"
                @change="seePage"
              >
              </Pagination>
          </div>
      </Tab>
    </Tabs>
  </div>
</template>
<script>
import { timeFormatterSort, timeFormatter, punchCardType, punchToCard, punchComeCard } from '@/utils/formatter.js'
import { httpGet, httpDelete, httpPut } from '@/utils/restful'
import { AIDailyCount, getMonthTime, setMonthTime, AIMonthlyCount, AIWriteOff, deleteAIWriteOff, updateAIDailyCount } from '@/api/url'
import { NavBar, Dialog, PullRefresh, Pagination, Row, Col, Search, Collapse, CollapseItem, Tab, CellGroup, Cell, Tabs, DatetimePicker, Field, Popup, Button, Radio, RadioGroup, Toast } from 'vant'
export default {
  name: 'statiReport',
  data () {
    return {
      time: [],
      value: '',
      isSet: false,
      asd: 1,
      hasData: false,
      noData: false,
      defaultDate: 1,
      timeFormatter: timeFormatter,
      timeFormatterSort: timeFormatterSort,
      punchToCard: punchToCard,
      punchComeCard: punchComeCard,
      punchCardType: punchCardType,
      userList: undefined,
      userData: undefined,
      monthData: undefined,
      total: undefined,
      count: 3,
      date: '2019-01',
      isNotData: false,
      listQuery: {
        offset: 1,
        limit: 10,
        beginTime: undefined,
        endTime: undefined,
        userName: undefined,
        time: undefined,
        type: undefined,
        departmentName: undefined
      },
      option4: [
        { text: '正常', value: 0 },
        { text: '异常', value: 1 },
        { text: '全部数据', value: 2 }
      ],
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
      updateAttend: {
        departmentId: this.$store.getters.departmentId,
        id: undefined,
        modify: undefined,
        content: undefined,
        updateType: 0
      },
      lateNum: '',
      earlyNum: '',
      isDateAttend: false,
      touchstart: undefined
    }
  },
  components: {
    NavBar,
    Tab,
    'van-row': Row,
    'van-col': Col,
    Tabs,
    Search,
    DatetimePicker,
    Field,
    Popup,
    Button,
    Cell,
    CellGroup,
    Collapse,
    CollapseItem,
    PullRefresh,
    Pagination,
    Radio,
    RadioGroup
  },
  methods: {
    ontouchstart (e) {
      this.touchstart = e.changedTouches[0].pageX
    },
    // 设置考勤默认起始时间
    setQue () {
      this.defaultDate = this.asd
      let departmentId = Number(this.$store.getters.departmentId)
      let attendanceDate = Number(this.defaultDate)
      httpPut(setMonthTime + '/' + attendanceDate + '/' + departmentId).then((res) => {
        Toast.success('设置成功')
        let stime = this.defaultDate > 9 ? this.defaultDate : '0' + this.defaultDate
        this.listQuery.time = this.listQuery.time.split('-')[0] + '-' + this.listQuery.time.split('-')[1] + '-' + stime
      }).catch(() => {})
    },
    ontouchend (e) {
      let touchend = e.changedTouches[0].pageX
      if (this.touchstart < touchend) if (touchend - this.touchstart >= 100) this.close()
    },
    close () {
      this.showMore = false
      this.moreItem = {}
    },
    handleMore (item) {
      this.moreItem = item
      this.showMore = true
    },
    onRefresh () {
      setTimeout(() => {
        this.listQuery = {
          offset: 1,
          limit: 10,
          beginTime: timeFormatterSort(new Date(new Date().setDate(1))) + ' 00:00:00',
          endTime: timeFormatterSort(new Date()) + ' 23:59:59',
          time: timeFormatterSort(new Date(new Date().setDate(1))),
          userName: undefined
        }
        this.time = [this.listQuery.beginTime, this.listQuery.endTime]
        this.fetchData()
        this.$toast('刷新成功')
        this.isLoading = false
      }, 500)
    },
    // 删除
    del (item) {
      console.log(item)
      Dialog.confirm({
        title: '提示',
        message: '确定要删除？'})
        .then(() => {
          httpDelete(deleteAIWriteOff, {ids: this.selectArrayId}).then(res => {
            this.fetchDataCancel()
            this.$message({
              type: 'success',
              message: res.message,
              duration: 4 * 1000
            })
          }).catch(() => {
          })
        }).catch(() => {})
    },
    formatter (type, value) {
      if (type === 'year') {
        return value + '年'
      } else if (type === 'month') {
        return value + '月'
      }
      return value
    },
    showDate () {
      if (this.isEnd === true) {
        this.isEnd = false
        this.isDate = true
      } else {
        this.isDate = true
      }
    },
    seePage (val) {
      this.listQuery.offset = val
      this.fetchData()
    },
    pushEnd () {
      if (this.isDate === true) {
        this.isDate = false
        this.isEnd = true
      } else {
        this.isEnd = true
      }
    },
    selectDate () {
      this.isDate = true
    },
    // 获取数据 每日
    fetchData () {
      let self = this
      // this.listQuery.time = undefined
      this.listQuery = Object.assign(this.listQuery, {departmentId: this.$store.getters.departmentId})
      httpGet(AIDailyCount, this.listQuery).then(res => {
        if (res.data.total === 0) {
          self.userData = []
          self.total = 0
          self.hasData = true
        } else {
          self.userData = res.data.rows
          self.total = res.data.total
          if ('id' in this.moreItem) {
            for (const v of res.data.rows) {
              if (v.id === this.moreItem.id) {
                this.moreItem = v
              }
            }
          }
        }
        console.log(res)
        // this.numberList = []
        // for (let i = 0; i <= this.total / 1000; i++) {
        //   this.numberList.push({
        //     id: i,
        //     name: `从${i * 1000}到${(i + 1) * 1000}条`
        //   })
        // }
      }).catch(() => {
      })
    },
    // 获取数据 没月
    fetchDataMonth () {
      let self = this
      this.listQuery = Object.assign(this.listQuery, {departmentId: this.$store.getters.departmentId})
      httpGet(AIMonthlyCount, this.listQuery).then(res => {
        if (res.data.total === 0) {
          self.monthData = []
          self.total = 0
          self.noData = true
        } else {
          self.monthData = res.data.rows
          self.total = res.data.total
        }
        console.log(res)
        // this.numberList = []
        // for (let i = 0; i <= this.total / 1000; i++) {
        //   this.numberList.push({
        //     id: i,
        //     name: `从${i * 1000}到${(i + 1) * 1000}条`
        //   })
        // }
      }).catch(() => {
      })
      // this.listQuery.time = this.listQuery.time.substring(0, 7)
    },
    // 获取数据 核销记录
    fetchDataCancel () {
      let self = this
      this.listQuery = Object.assign(this.listQuery, {departmentId: this.$store.getters.departmentId})
      httpGet(AIWriteOff, this.listQuery).then(res => {
        if (res.data.total === 0) {
          self.userList = []
          self.total = 0
          self.isNotData = true
        } else {
          self.userList = res.data.rows
          self.total = res.data.total
          self.isNotData = false
        }
        console.log(res)
        // this.numberList = []
        // for (let i = 0; i <= this.total / 1000; i++) {
        //   this.numberList.push({
        //     id: i,
        //     name: `从${i * 1000}到${(i + 1) * 1000}条`
        //   })
        // }
      }).catch(() => {
      })
    },
    // 取消
    bye () {
      this.isDate = false
      this.isEnd = false
    },
    // 确定选择时间
    saveValue (value) {
      this.listQuery.beginTime = this.tanslate(value)
      this.listQuery.time = this.tanslate(value).substring(0, 7) + '-' + this.defaultDate
      this.isDate = false
    },
    getValue (value) {
      this.listQuery.endTime = this.tanslate(value)
      this.isEnd = false
    },
    tanslate (d) {
      const newDate = d.getFullYear() + '-' + ((d.getMonth() + 1) < 10 ? '0' + (d.getMonth() + 1) : (d.getMonth() + 1)) + '-' + (d.getDate() < 10 ? '0' + d.getDate() : d.getDate()) + ' ' + (d.getHours() < 10 ? '0' + d.getHours() : d.getHours()) + ':' + (d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes()) + ':' + (d.getSeconds() < 10 ? '0' + d.getSeconds() : d.getSeconds())
      return newDate
    },
    onClickLeft () {
      this.$router.push('/indexPage/')
    },
    onSearch () {
      this.listQuery.offset = 1
      this.fetchData()
    },
    onClick (index, title) {
      this.listQuery.type = undefined
      this.listQuery.departmentName = undefined
      this.listQuery.userName = undefined
      if (title === '每日统计') {
        this.listQuery.beginTime = timeFormatterSort(new Date(new Date().setDate(1))) + ' 00:00:00'
        this.listQuery.endTime = timeFormatterSort(new Date()) + ' 23:59:59'
        this.fetchData()
      }
      if (title === '月度统计') {
        httpGet(getMonthTime + '/' + this.$store.getters.departmentId).then((res) => {
          console.log(res)
          if (res.data.attendanceDate !== 0 && res.data.attendanceDate !== null) {
            this.defaultDate = res.data.attendanceDate
            this.asd = this.defaultDate
            let stime = this.defaultDate >= 10 ? this.defaultDate : '0' + this.defaultDate
            this.listQuery.time = this.listQuery.time.split('-')[0] + '-' + this.listQuery.time.split('-')[1] + '-' + stime
          } else {
            this.listQuery.time = timeFormatterSort(new Date(new Date().setDate(1)))
            // console.log(this.listQuery.time, new Date().setDate(1))
          }
        }).catch(() => {})
        this.fetchDataMonth()
      }
      if (title === '核销统计') {
        this.listQuery.beginTime = timeFormatterSort(new Date(new Date().setDate(1))) + ' 00:00:00'
        this.listQuery.endTime = timeFormatterSort(new Date()) + ' 23:59:59'
        this.fetchDataCancel()
      }
    },
    contentChange (value) {
      value = Number(value)
      if (value === 0 || value === 3) {
        this.lateNum = ''
        this.earlyNum = ''
      } else if (value === 1) {
        this.earlyNum = ''
      } else if (value === 2) {
        this.lateNum = ''
      }
    },
    saveValueAttend (value) {
      this.updateAttend.punchCardTime = value
      this.isDateAttend = false
    },
    cellclick (row, property) {
      // console.log(property)
      this.updateAttend.id = row.id
      this.updateAttend.modify = property
      this.content = undefined
      this.lateNum = undefined
      this.earlyNum = undefined
      this.updateAttend.aiUserId = row.aiUserId
      this.updateAttend.workDay = row.workDay
      this.updateAttend.workShiftId = row.workShiftId
      // 判断有没班次,没有直接填时间,没有填原因
      if (row.workShiftId) {
        this.updateAttend.type = 1
      } else {
        this.updateAttend.type = 0
      }
      this.dialogAttendVisible = true
    },
    updateData () {
      if (this.updateAttend.type === 1) {
        if (this.updateAttend.updateType === undefined) {
          Toast.fail('请先选择修改结果')
          return
        }
        if (Number(this.updateAttend.updateType) === 0) {
          this.lateNum = undefined
          this.earlyNum = undefined
        }
        if (Number(this.updateAttend.updateType) === 1) {
          this.earlyNum = undefined
          this.updateAttend.min = Number(this.lateNum)
        }
        if (Number(this.updateAttend.updateType) === 2) {
          this.lateNum = undefined
          this.updateAttend.min = Number(this.earlyNum)
        }
        if (Number(this.updateAttend.updateType) === 3) {
          this.lateNum = undefined
          this.earlyNum = undefined
        }
      }
      httpPut(updateAIDailyCount, this.updateAttend)
        .then(res => {
          this.fetchData()
          Toast.success(res.message)
        }).catch(() => {
          // this.updateLoading = false
        })
    }
  },
  created () {
    // 开始时间
    this.listQuery.beginTime = timeFormatterSort(new Date(new Date().setDate(1))) + ' 00:00:00'
    // 结束时间
    this.listQuery.endTime = timeFormatterSort(new Date()) + ' 23:59:59'
    this.listQuery.time = timeFormatterSort(new Date(new Date().setDate(1)))
    this.time = [this.listQuery.beginTime, this.listQuery.endTime]
  },
  mounted () {
    this.fetchData()
  }
}
</script>
<style scoped>
.asd >>> .van-pagination__item--disabled, .van-pagination__item--disabled:active {
  color:rgb(14,105,254)
}
</style>
<style lang="scss" scoped>
.card{
  width:92vw;
  border-radius:8px;
  box-shadow:0 0 12px #ccc;
  margin-left:4vw;
  // position:absolute;
  // top:4rem;
  margin-top:5rem;
  height:7rem;
  background:#fff
}
.col{
  text-align: center;
  border: 1px solid #ccc;
  line-height: 2rem;
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

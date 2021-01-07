<template>
    <div class="bgc-grey full-height">
      <!-- 日统计 -->
      <template v-if="routeType == 'daily'">
        <van-cell-group class="mar-b-15">
            <van-cell title="姓名" :value="data.userName"></van-cell>
            <van-cell title="部门" :value="data.departmentName"></van-cell>
            <van-cell title="日期" :value="data.workDay?timeFormatterSort(data.workDay):''"></van-cell>
        </van-cell-group>
        <van-collapse v-model="activeNames" class="collapsebox" >
          <van-collapse-item title="上班(1)" name="1">
            <van-cell title="打卡时间" :value="timeHourMinFormatter(data.firstBeginTime)"></van-cell>
            <van-cell title="打卡结果">
              <span @click="showdialogAttend('firstBeginResult')">修改 <span class="fc-blue">{{formatterResult(data.firstBeginResult, true)}}</span></span>
            </van-cell>
          </van-collapse-item>
          <van-collapse-item title="下班(1)" name="2">
            <van-cell title="打卡时间" :value="timeHourMinFormatter(data.firstEndTime)"></van-cell>
            <van-cell title="打卡结果">
              <span @click="showdialogAttend('firstEndResult')">修改 <span class="fc-blue">{{formatterResult(data.firstEndResult, false)}}</span></span>
            </van-cell>
          </van-collapse-item>
          <van-collapse-item title="上班(2)" name="3">
            <van-cell title="打卡时间" :value="timeHourMinFormatter(data.secondEndTime)"></van-cell>
            <van-cell title="打卡结果">
              <span @click="showdialogAttend('secondBeginResult')">修改 <span class="fc-blue">{{formatterResult(data.secondBeginResult, true)}}</span></span>
            </van-cell>
          </van-collapse-item>
          <van-collapse-item title="下班(2)" name="4">
            <van-cell title="打卡时间" :value="timeHourMinFormatter(data.secondEndTime)"></van-cell>
            <van-cell title="打卡结果">
              <span @click="showdialogAttend('secondEndResult')">修改 <span class="fc-blue">{{formatterResult(data.secondEndResult, false)}}</span></span>
            </van-cell>
          </van-collapse-item>
          <van-collapse-item title="上班(3)" name="5">
            <van-cell title="打卡时间" :value="timeHourMinFormatter(data.thirdBeginTime)"></van-cell>
            <van-cell title="打卡结果">
              <span @click="showdialogAttend('thirdBeginResult')">修改 <span class="fc-blue">{{formatterResult(data.thirdBeginResult, true)}}</span></span>
            </van-cell>
          </van-collapse-item>
          <van-collapse-item title="下班(3)" name="6">
            <van-cell title="打卡时间" :value="timeHourMinFormatter(data.thirdEndTime)"></van-cell>
            <van-cell title="打卡结果">
              <span @click="showdialogAttend('thirdEndResult')">修改 <span class="fc-blue">{{formatterResult(data.thirdEndResult, false)}}</span></span>
            </van-cell>
          </van-collapse-item>
          <!-- <van-collapse-item title="加班" name="7">
            <van-cell title="打卡时间" :value="timeHourMinFormatter(data.overTime)"></van-cell>
            <van-cell title="加班时长(min)">
              <span @click="showOverTime = true">修改 <span class="fc-blue">{{data.overTimeCount || 0}}</span></span>
            </van-cell>
          </van-collapse-item> -->
        </van-collapse>
        <van-cell title="更多" center class="bgc-grey" :border="false">
            <van-switch v-model="showMore1" size="20px" />
        </van-cell>
        <van-cell-group v-if="showMore1" class="bgc-grey">
              <van-cell title="出勤天数" :value="data.commuteDay"></van-cell>
              <van-cell title="出勤班次" :value="data.workShiftName"></van-cell>
              <van-cell title="休息天数" :value="data.restDay"></van-cell>
              <van-cell title="工作时长(min)" :value="data.workMin" class="mar-b-15" :border="false"></van-cell>
              <van-cell title="迟到次数" :value="data.lateNum"></van-cell>
              <van-cell title="迟到时长(min)" :value="data.lateMin"></van-cell>
              <van-cell title="严重迟到次数" :value="data.seriouslyLateNum"></van-cell>
              <van-cell title="严重迟到时长(min)" :value="data.seriouslyLateMin"></van-cell>
              <van-cell title="早退次数" :value="data.leaveEarlyNum"></van-cell>
              <van-cell title="早退时长(min)" :value="data.leaveEarlyMin" class="mar-b-15" :border="false"></van-cell>
              <van-cell title="上班缺卡次数" :value="data.beginNoPunchCard"></van-cell>
              <van-cell title="下班缺卡次数" :value="data.endNoPunchCard"></van-cell>
              <van-cell title="旷工天数" :value="data.absenteeismDay"></van-cell>
        </van-cell-group>
        <van-dialog v-model="dialogAttendVisible" :before-close="beforeClose" title="修改打卡结果" show-cancel-button close-on-popstate confirmButtonText="保存" class="border" >
            <van-radio-group v-model="updateAttend.updateType" class="radio-group" v-if="updateAttend.type === 1" >
              <van-radio :name="0">正常</van-radio>
              <van-radio :name="1">
                <div class="flex-align-items">
                  迟到<van-field placeholder="请输入" type="number" class="radioInput" v-model.trim="lateNum" />分钟
                </div>
              </van-radio>
              <van-radio :name="2">
                <div class="flex-align-items">
                  早退<van-field placeholder="请输入" type="number" class="radioInput" v-model.trim="earlyNum" />分钟
                </div>
              </van-radio>
              <van-radio :name="3">缺卡</van-radio>
              <!-- <van-radio :name="4">请假</van-radio>
              <van-radio :name="5">出差</van-radio> -->
            </van-radio-group>
            <van-cell title="选择日期" is-link :value="updateAttend.punchCardTime" @click="isDateAttend = true" v-if="updateAttend.type === 0" />
            <van-popup v-model="isDateAttend" position="bottom" get-container="body" safe-area-inset-bottom>
              <van-datetime-picker
                type="datetime"
                :max-date="maxDate"
                show-toolbar
                @cancel="isDateAttend=false"
                @confirm="handleConfirm"
                />
            </van-popup>
        </van-dialog>
        <!-- <van-dialog
        v-model="showOverTime"
        title="修改加班时长"
        show-cancel-button
        close-on-popstate
        :before-close="closeOverTimeCount"
        >
            <van-field v-model.trim="overTimeCountVal" type="number" placeholder="请输入加班时长(分钟)" :error-message="overTimeCountErr" />
        </van-dialog> -->
      </template>
      <!-- 月统计 -->
      <template v-if="routeType == 'monthly'">
        <van-cell-group class="bgc-grey">
            <van-cell title="姓名" :value="data.userName"></van-cell>
            <van-cell title="部门" :value="data.departmentName"></van-cell>
            <van-cell title="日期" :value="timeFormatterSort(data.workDay)" class="mar-b-15" :border="false"></van-cell>
            <van-cell title="出勤天数" :value="data.commuteDay"></van-cell>
            <van-cell title="休息天数" :value="data.restDay"></van-cell>
            <van-cell title="迟到次数" :value="data.lateNum"></van-cell>
            <van-cell title="早退次数" :value="data.leaveEarlyNum" class="mar-b-15" :border="false"></van-cell>
            <van-cell title="上班缺卡次数" :value="data.beginNoPunchCard"></van-cell>
            <van-cell title="下班缺卡次数" :value="data.endNoPunchCard"></van-cell>
            <van-cell title="旷工天数" :value="data.absenteeismDay"></van-cell>
            <van-cell title="更多" center class="bgc-grey" :border="false">
                <van-switch v-model="showMore2" size="20px" />
            </van-cell>
            <template v-if="showMore2">
              <van-cell title="工作时长(min)" :value="data.workMin"></van-cell>
              <van-cell title="迟到时长(min)" :value="data.lateMin"></van-cell>
              <van-cell title="严重迟到次数" :value="data.seriouslyLateNum"></van-cell>
              <van-cell title="严重迟到时长(min)" :value="data.seriouslyLateMin"></van-cell>
              <van-cell title="早退时长(min)" :value="data.leaveEarlyMin"></van-cell>
            </template>
        </van-cell-group>
      </template>
    </div>
</template>

<script>
import { timeFormatter, timeHourMinFormatter, timeFormatterSort } from '@/utils/formatter.js'
import { Collapse, CollapseItem, RadioGroup, Radio, Switch, Stepper, DatetimePicker } from 'vant'
import { updateAIDailyCount, AIDailyCount, AIMonthlyCount } from '@/api/url'
// import { mapGetters } from 'vuex'
export default {
  components: {
    'van-collapse': Collapse,
    'van-collapse-item': CollapseItem,
    'van-radio-group': RadioGroup,
    'van-radio': Radio,
    'van-switch': Switch,
    'van-stepper': Stepper,
    [DatetimePicker.name]: DatetimePicker
  },
  computed: {
    // data () {
    //   // console.log(this.$store.state)
    //   return this.$store.state.user.date
    // },
    data () {
      var obj = {}
      this.listData.forEach((item, index) => {
        if (item.id / 1 === this.uid / 1) {
          obj = item
        }
      })
      return obj
    }
  },
  data () {
    return {
      routeType: this.$route.params.type,
      uid: JSON.parse(decodeURI(this.$route.query.data))['id'],
      listQuery: JSON.parse(decodeURI(this.$route.query.data)) || {},
      timeFormatter,
      timeHourMinFormatter,
      timeFormatterSort,
      activeNames: [],
      listData: [
        // {userName: '小明', id: 1, commuteDay: 22, lateNum: 0, leaveEarlyNum: 0, beginNoPunchCard: 10, endNoPunchCard: 10}
      ],
      flag: false,
      dialogAttendVisible: false,
      updateAttend: {
        departmentId: this.$store.getters.departmentId,
        updateType: undefined
      },
      lateNum: undefined,
      earlyNum: undefined,
      maxDate: new Date(),
      isDateAttend: false,
      showMore1: false,
      showMore2: false,
      // 加班
      showOverTime: false,
      overTimeCountVal: '',
      overTimeCountErr: ''
    }
  },
  // props: ['data', 'routeType'],
  created () {
    this.$toast.loading({
      position: 'center',
      message: '加载中...',
      forbidClick: true,
      duration: 0
    })
    this.fetchData()
  },
  methods: {
    fetchData () {
      this.listQuery.offset = 1
      var url = ''
      if (this.routeType === 'daily') {
        url = AIDailyCount
      } else {
        url = AIMonthlyCount
      }
      this.$http.get(url, {params: this.listQuery}).then(res => {
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
        this.$toast.clear()
      }).catch(() => {
        this.listLoading = false
        this.error = true
        this.$toast.clear()
      })
    },
    // 格式化打卡结果
    formatterResult (value, flag) {
      if (value !== null) {
        if (value === 0) {
          return '正常'
        } else if (value === -1) {
          return '缺卡'
        // } else if (value === -2) {
        //   return '请假'
        // } else if (value === -3) {
        //   return '出差'
        } else {
          if (flag) {
            return '迟到' + (value || '-') + '分钟'
          } else {
            return '早退' + (value || '-') + '分钟'
          }
        }
      } else {
        return '-'
      }
    },
    handleConfirm (val) {
      console.log(this.updateAttend)
      this.updateAttend.punchCardTime = timeFormatter(val)
      this.isDateAttend = false
    },
    showdialogAttend (property) {
      this.updateAttend.modify = property
      this.updateAttend.id = this.data.id
      this.updateAttend.aiUserId = this.data.aiUserId
      this.updateAttend.workDay = this.data.workDay
      this.updateAttend.workShiftId = this.data.workShiftId
      this.lateNum = undefined
      this.earlyNum = undefined
      // 判断有没班次,没有直接填时间,有填原因
      if (this.data.workShiftId) {
        this.updateAttend.type = 1
      } else {
        this.updateAttend.type = 0
      }
      this.dialogAttendVisible = true
    },
    // 修改
    beforeClose (action, done) {
      if (action === 'confirm') {
        if (this.updateAttend.type === 1) {
          if (this.updateAttend.updateType === undefined) {
            this.$toast.fail('请先选择修改结果')
            done(false)
            return
            // 迟到
          } else if (this.updateAttend.updateType === 0) {
            this.lateNum = undefined
            this.earlyNum = undefined
          } else if (this.updateAttend.updateType === 1) {
            this.earlyNum = undefined
            this.updateAttend.min = Number(this.lateNum)
          } else if (this.updateAttend.updateType === 2) {
            this.lateNum = undefined
            this.updateAttend.min = Number(this.earlyNum)
          } else if (this.updateAttend.updateType === 3) {
            this.lateNum = undefined
            this.earlyNum = undefined
          }
          this.updateData(done)
        }
      } else {
        done()
      }
    },
    updateData (done) {
      // console.log(this.updateAttend)
      this.$http.put(updateAIDailyCount, this.updateAttend)
        .then(res => {
          done()
          this.fetchData()
          this.$toast.success({duration: 3500, forbidClick: true, position: 'center', message: res.message})
          // this.$router.replace('/detailCount/daily/?id=' + this.id + '&listQuery=' + encodeURI(JSON.stringify(this.listQuery)))
        }).catch(() => {
          done(false)
        })
    },
    // 加班
    closeOverTimeCount (action, done) {
      if (action === 'confirm') {
        if (this.overTimeCountVal === '') {
          this.overTimeCountErr = '不能为空'
          done(false)
          return
        }
        this.setTimeLong(done)
      } else {
        this.overTimeCountErr = ''
        done()
      }
    },
    setTimeLong (done) {
      this.overTimeCountErr = ''
      // const formData = {
      //   ...this.data,
      //   overTimeCount: this.overTimeCountVal
      // }
    }
  }
}
</script>

<style lang="scss" scoped>
.radio-group {
  padding-left: 15px;
  padding-bottom: 15px;
  .radioInput {
    width: 80px;
  }
}
</style>

<template>
    <div class="bgc-grey full-height class-admin">
        <div class="box">
            <van-field label="班次名称" placeholder="最多10个字符(中英文或数字)" class="mar-b-15" v-model.trim="form.name" />

            <section class="set bgc">
                <van-cell title="设置该班次一天内上下班次数" :border="false"></van-cell>
                <van-tabs type="card" color="#409EFF" v-model="form.workNum" @change="onchangeTags">
                    <van-tab title="一天一次上下班" :name="1"></van-tab>
                    <van-tab title="一天两次上下班" :name="2"></van-tab>
                    <van-tab title="一天三次上下班" :name="3"></van-tab>
                </van-tabs>
                <van-cell title="打卡时段设置" center :border="false">
                    <van-switch v-model="form.openPunchCardTime" size="20px" />
                </van-cell>
                <!-- <van-cell title="加班规则设置" center :border="false">
                    <van-switch v-model="form.openOverTime" size="20px" />
                </van-cell>
                <van-notice-bar @click="isWatch = true" text="加班规则说明，点击查看" color="#1989fa" background="#ecf9ff"/>
                <van-popup v-model="isWatch" position="left">
                  <van-cell title="以审批时间计算加班" value="加班必须审批，加班时长以审批单为准"/>
                  <van-cell title="审批后，以打卡时间计算加班" value="加班必须审批，以打卡为准，但不能超过审批单时长。从最后一次下班后30分钟开始计算加班，最小加班时长30分钟"/>
                  <van-cell title="以打卡时间计算加班" value="加班无须审批，根据打卡时间计算加班时长，从最后一次下班后30分钟开始计算加班，最小加班时长30分钟"/>
                </van-popup>
                <template v-if="form.openOverTime">
                  <van-radio-group v-model="form.overTimeRule">
                    <van-cell-group>
                      <van-cell title="以审批时间计算加班" clickable @click="radio = 1">
                        <van-radio slot="right-icon" :name="1" />
                      </van-cell>
                      <van-cell title="审批后，以打卡时间计算加班" clickable @click="radio = 2">
                        <van-radio slot="right-icon" :name="2" />
                      </van-cell>
                      <van-cell title="以打卡时间计算加班" clickable @click="radio = 3">
                        <van-radio slot="right-icon" :name="3" />
                      </van-cell>
                    </van-cell-group>
                  </van-radio-group>
                </template> -->
                <template>
                    <van-cell title="第一次" :border="false" class="bgc-grey"></van-cell>
                    <van-cell title="上班" is-link :value="firstBeginTime" @click="showfirstGo = true"></van-cell>
                    <van-cell title="时段设置" :label="`${form.firstBeginMin||0}分钟前开始打卡`" v-show="form.openPunchCardTime">
                        <van-stepper   disable-input :min="0" step="10" v-model="form.firstBeginMin" />
                    </van-cell>
                    <van-cell title="下班" is-link :value="firstEndTime" @click="showfirstCome = true" :label="firstEnd?'次日':''"></van-cell>
                    <van-cell title="时段设置" :label="`${form.firstEndMin||0}分钟后结束打卡`" v-show="form.openPunchCardTime">
                        <van-stepper disable-input :min="0" step="10" v-model="form.firstEndMin" />
                    </van-cell>
                </template>
                <template v-if="form.workNum == 2 || form.workNum == 3">
                    <van-cell title="第二次" :border="false" class="bgc-grey"></van-cell>
                    <van-cell title="上班" is-link :value="secondBeginTime" @click="showsecondGo = true" :label="secondStart?'次日':''"></van-cell>
                    <van-cell title="时段设置" :label="`${form.secondBeginMin||0}分钟前开始打卡`" v-show="form.openPunchCardTime">
                        <van-stepper disable-input :min="0" step="10" v-model="form.secondBeginMin" />
                    </van-cell>
                    <van-cell title="下班" is-link :value="secondEndTime" @click="showsecondCome = true" :label="secondEnd?'次日':''"></van-cell>
                    <van-cell title="时段设置" :label="`${form.secondEndMin||0}分钟后结束打卡`" v-show="form.openPunchCardTime">
                        <van-stepper disable-input :min="0" step="10" v-model="form.secondEndMin" />
                    </van-cell>
                </template>
                <template v-if="form.workNum == 3">
                    <van-cell title="第三次" :border="false" class="bgc-grey"></van-cell>
                    <van-cell title="上班" is-link :value="thirdBeginTime" @click="showthirdGo = true" :label="thirdStart?'次日':''"></van-cell>
                    <van-cell title="时段设置" :label="`${form.thirdBeginMin||0}分钟前开始打卡`" v-show="form.openPunchCardTime">
                        <van-stepper disable-input :min="0" step="10" v-model="form.thirdBeginMin" />
                    </van-cell>
                    <van-cell title="下班" is-link :value="thirdEndTime" @click="showthirdCome = true" :label="thirdEnd?'次日':''"></van-cell>
                    <van-cell title="时段设置" :label="`${form.thirdEndMin||0}分钟后结束打卡`" v-show="form.openPunchCardTime">
                        <van-stepper disable-input :min="0" step="10" v-model="form.thirdEndMin" />
                    </van-cell>
                </template>
                <van-cell title="休息时间" center :border="false" v-show="form.workNum == 1">
                    <van-switch v-model="form.openRestTime" size="20px" @change="openRestTimeChange" />
                </van-cell>
                <template v-if="form.openRestTime && form.workNum==1">
                    <transition name="van-fade"><van-cell title="休息开始" is-link :value="restTimeStart" @click="showRTS = true"></van-cell></transition>
                    <transition name="van-fade"><van-cell title="休息结束" is-link :value="restTimeEnd" @click="showRTE = true"></van-cell></transition>
                </template>
                <van-notice-bar wrapable :scrollable="false" class="notice">
                    合计工作时长{{time}}（考勤统计工作时长及请假出差外出统计，会以此时间为准）
                </van-notice-bar>
            </section>

            <van-cell title="更多设置" :border="false" class="bgc-grey"></van-cell>
            <van-cell title="下班不用打卡" label="开启后,下班不打卡也不会记作异常" center class="mar-b-15">
                <van-switch v-model="form.offDutyFreeCheck" size="20px" />
            </van-cell>

            <section class="bgc late-set">
                <van-cell title="迟到旷工设置" :border="false"></van-cell>
                <div class="item flex-align-items flex-jc-around">
                    允许迟到分钟数
                    <van-stepper disable-input :min="-1" v-model="form.permitLateMinutes" />
                    <van-tag>-1表示不开启</van-tag>
                </div>
                <div class="item flex-align-items flex-jc-around">
                    严重迟到分钟数
                    <van-stepper disable-input :min="-1" v-model="form.seriousLateMinutes" />
                    <van-tag>-1表示不开启</van-tag>
                </div>
                <div class="item flex-align-items flex-jc-around">
                    旷工迟到分钟数
                    <van-stepper disable-input :min="-1" v-model="form.absentTime" />
                    <van-tag>-1表示不开启</van-tag>
                </div>
            </section>
        </div>

        <div class="btnbox">
            <van-button type="info" block class="btn" :loading="updateLoading" v-if="form.id" @click="updateData">保存</van-button>
            <van-button type="info" block class="btn" @click="createData" :loading="createLoading" v-else>添加</van-button>
        </div>
        <!-- 休息时间 -->
        <van-popup v-model="showRTS" position="bottom" safe-area-inset-bottom>
            <van-datetime-picker
            v-model="restTimeStart"
            type="time"
            :show-toolbar="false"
            />
        </van-popup>
        <van-popup v-model="showRTE" position="bottom" safe-area-inset-bottom>
            <van-datetime-picker
            v-model="restTimeEnd"
            type="time"
            :show-toolbar="false"
            />
        </van-popup>
        <!-- 设置该班次一天内上下班次数 -->
        <van-popup v-model="showfirstGo" position="bottom" safe-area-inset-bottom>
            <van-datetime-picker
            v-model="firstBeginTime"
            type="time"
            :show-toolbar="false"
            />
        </van-popup>
        <van-popup v-model="showfirstCome" position="bottom" safe-area-inset-bottom>
            <van-datetime-picker
            v-model="firstEndTime"
            type="time"
            :show-toolbar="false"
            />
        </van-popup>
        <van-popup v-model="showsecondGo" position="bottom" safe-area-inset-bottom>
            <van-datetime-picker
            v-model="secondBeginTime"
            type="time"
            :show-toolbar="false"
            />
        </van-popup>
        <van-popup v-model="showsecondCome" position="bottom" safe-area-inset-bottom>
            <van-datetime-picker
            v-model="secondEndTime"
            type="time"
            :show-toolbar="false"
            />
        </van-popup>
        <van-popup v-model="showthirdGo" position="bottom" safe-area-inset-bottom>
            <van-datetime-picker
            v-model="thirdStart"
            type="time"
            :show-toolbar="false"
            />
        </van-popup>
        <van-popup v-model="showthirdCome" position="bottom" safe-area-inset-bottom>
            <van-datetime-picker
            v-model="thirdEndTime"
            type="time"
            :show-toolbar="false"
            />
        </van-popup>
    </div>
</template>

<script>
import { Stepper, Tag, Radio, RadioGroup, Tab, Tabs, Switch, NoticeBar, DatetimePicker } from 'vant'
import { HHssFormatter, NumToTimeFormatter, NumToHHssFormatter, checkName } from '@/utils/formatter.js'
import { AIShifts } from '@/api/url'
export default {
  components: {
    'van-stepper': Stepper,
    'van-tag': Tag,
    'van-tabs': Tabs,
    'van-tab': Tab,
    'van-switch': Switch,
    'van-notice-bar': NoticeBar,
    'van-radio': Radio,
    'van-radio-group': RadioGroup,
    [DatetimePicker.name]: DatetimePicker
  },
  data () {
    return {
      createLoading: false,
      // isWatch: false,
      updateLoading: false,
      //   设置该班次一天内上下班次数
      time: '9小时0分钟',
      firstBeginTime: '09:00',
      firstEndTime: '18:00',
      secondBeginTime: '14:00',
      secondEndTime: '18:00',
      thirdBeginTime: '14:00',
      thirdEndTime: '18:00',
      // 次日
      firstEnd: false,
      secondStart: false,
      secondEnd: false,
      thirdStart: false,
      thirdEnd: false,
      showRTS: false,
      showRTE: false,
      showfirstGo: false,
      showfirstCome: false,
      showsecondGo: false,
      showsecondCome: false,
      showthirdGo: false,
      showthirdCome: false,
      //   休息时间
      checkedRest: false,
      restTimeStart: '12:00',
      restTimeEnd: '13:00',
      form: {
        departmentId: this.$store.getters.departmentId,
        id: this.$route.query.id,
        name: '',
        workNum: 1,
        // openOverTime: false, // 加班打开设置
        openPunchCardTime: false, // 打卡时段设置
        firstBeginTime: 540,
        firstBeginMin: 0,
        firstEndTime: 720,
        firstEndMin: 0,
        secondBeginTime: 840,
        secondBeginMin: 0,
        secondEndTime: 1080,
        secondEndMin: 0,
        thirdBeginTime: 840,
        thirdBeginMin: 0,
        thirdEndTime: 1080,
        thirdEndMin: 0,
        // overTimeRule: 1,
        //   休息时间
        openRestTime: false,
        restTimeStart: 720,
        restTimeEnd: 780,
        // 下班不用打卡
        offDutyFreeCheck: false,
        // 迟到旷工设置
        permitLateMinutes: -1,
        seriousLateMinutes: -1,
        absentTime: -1
      }
    }
  },
  watch: {
    restTimeStart () {
      this.openRestTimeChange(true)
    },
    restTimeEnd () {
      this.openRestTimeChange(true)
    },
    firstBeginTime (value) {
      this.firstBeginTimeChange(value)
    },
    firstEndTime (value) {
      this.firstEndTimeChange(value)
    }
  },
  created () {
    if (this.$route.query.id) {
      console.log('this.$route.query.id。。。', this.$route.query.id)

      this.getUpdate()
    }
  },
  methods: {
    getUpdate () {
      const ToastLoading = this.$toast.loading({ mask: true, message: '加载中...', position: 'middle', duration: 0 })
      console.log('ToastLoading', ToastLoading)

      this.$http.get(AIShifts + '/' + this.$route.query.id)
        .then(res => {
          ToastLoading.clear()
          if (res.data.firstBeginTime !== null) this.firstBeginTime = NumToHHssFormatter(res.data.firstBeginTime)
          if (res.data.firstEndTime !== null) this.firstEndTime = NumToHHssFormatter(res.data.firstEndTime)
          if (res.data.secondBeginTime !== null) this.secondBeginTime = NumToHHssFormatter(res.data.secondBeginTime)
          if (res.data.secondEndTime !== null) this.secondEndTime = NumToHHssFormatter(res.data.secondEndTime)
          if (res.data.thirdBeginTime !== null) this.thirdBeginTime = NumToHHssFormatter(res.data.thirdBeginTime)
          if (res.data.thirdEndTime !== null) this.thirdEndTime = NumToHHssFormatter(res.data.thirdEndTime)
          if (res.data.restTimeStart !== null) this.restTimeStart = NumToHHssFormatter(res.data.restTimeStart)
          if (res.data.restTimeEnd !== null) this.restTimeEnd = NumToHHssFormatter(res.data.restTimeEnd)
          this.form = Object.assign({}, res.data)
        }).catch((err) => {
          console.log('错误信息： ', err)

          ToastLoading.clear()
        })
    },
    // data提取
    formData () {
      let data = {
        departmentId: this.$store.getters.departmentId,
        name: this.form.name,
        openPunchCardTime: this.form.openPunchCardTime,
        workNum: this.form.workNum,
        offDutyFreeCheck: this.form.offDutyFreeCheck,
        permitLateMinutes: this.form.permitLateMinutes,
        seriousLateMinutes: this.form.seriousLateMinutes,
        absentTime: this.form.absentTime
      }
      if (this.form.openPunchCardTime) {
        // 开启时段
        if (this.form.workNum === 1) {
          data = Object.assign({
            firstBeginMin: this.form.firstBeginMin,
            firstEndMin: this.form.firstEndMin,
            firstBeginTime: HHssFormatter(this.firstBeginTime),
            firstEndTime: HHssFormatter(this.firstEndTime),
            secondBeginTime: undefined,
            secondEndTime: undefined,
            thirdBeginTime: undefined,
            thirdEndTime: undefined,
            secondBeginMin: undefined,
            secondEndMin: undefined,
            thirdBeginMin: undefined,
            thirdEndMin: undefined
          }, data)
        } else if (this.form.workNum === 2) {
          data = Object.assign({
            firstBeginTime: HHssFormatter(this.firstBeginTime),
            firstEndTime: HHssFormatter(this.firstEndTime),
            secondBeginTime: HHssFormatter(this.secondBeginTime),
            secondEndTime: HHssFormatter(this.secondEndTime),
            thirdBeginTime: undefined,
            thirdEndTime: undefined,
            firstBeginMin: this.form.firstBeginMin,
            firstEndMin: this.form.firstEndMin,
            secondBeginMin: this.form.secondBeginMin,
            secondEndMin: this.form.secondEndMin,
            thirdBeginMin: undefined,
            thirdEndMin: undefined
          }, data)
        } else {
          data = Object.assign({
            firstBeginTime: HHssFormatter(this.firstBeginTime),
            firstEndTime: HHssFormatter(this.firstEndTime),
            secondBeginTime: HHssFormatter(this.secondBeginTime),
            secondEndTime: HHssFormatter(this.secondEndTime),
            thirdBeginTime: HHssFormatter(this.thirdBeginTime),
            thirdEndTime: HHssFormatter(this.thirdEndTime),
            firstBeginMin: this.form.firstBeginMin,
            firstEndMin: this.form.firstEndMin,
            secondBeginMin: this.form.secondBeginMin,
            secondEndMin: this.form.secondEndMin,
            thirdBeginMin: this.form.thirdBeginMin,
            thirdEndMin: this.form.thirdEndMin
          }, data)
        }
      } else {
        data = Object.assign({
          firstBeginMin: undefined,
          firstEndMin: undefined,
          secondBeginMin: undefined,
          secondEndMin: undefined,
          thirdBeginMin: undefined,
          thirdEndMin: undefined
        }, data)
        if (this.form.workNum === 1) {
          data = Object.assign({
            firstBeginTime: HHssFormatter(this.firstBeginTime),
            firstEndTime: HHssFormatter(this.firstEndTime),
            secondBeginTime: undefined,
            secondEndTime: undefined,
            thirdBeginTime: undefined,
            thirdEndTime: undefined
          }, data)
        } else if (this.form.workNum === 2) {
          data = Object.assign({
            firstBeginTime: HHssFormatter(this.firstBeginTime),
            firstEndTime: HHssFormatter(this.firstEndTime),
            secondBeginTime: HHssFormatter(this.secondBeginTime),
            secondEndTime: HHssFormatter(this.secondEndTime),
            thirdBeginTime: undefined,
            thirdEndTime: undefined
          }, data)
        } else {
          data = Object.assign({
            firstBeginTime: HHssFormatter(this.firstBeginTime),
            firstEndTime: HHssFormatter(this.firstEndTime),
            secondBeginTime: HHssFormatter(this.secondBeginTime),
            secondEndTime: HHssFormatter(this.secondEndTime),
            thirdBeginTime: HHssFormatter(this.thirdBeginTime),
            thirdEndTime: HHssFormatter(this.thirdEndTime)
          }, data)
        }
      }
      if (this.form.openRestTime) {
        data = Object.assign({
          openRestTime: this.form.openRestTime,
          restTimeStart: HHssFormatter(this.restTimeStart),
          restTimeEnd: HHssFormatter(this.restTimeEnd)
        }, data)
      } else {
        data = Object.assign({
          openRestTime: this.form.openRestTime,
          restTimeStart: undefined,
          restTimeEnd: undefined
        }, data)
      }
      return data
    },
    // 新增
    createData () {
      if (this.form.name === '') {
        this.$toast.fail('班次名称不能为空')
        return
      }
      if (checkName(this.form.name)) {
        this.$toast.fail('班次名称\n最多10个字符\n(中英文或数字)')
        return
      }
      // 判断人性化是否开启
      if (this.form.permitLateMinutes > this.form.seriousLateMinutes) {
        this.$toast.fail('严重迟到分钟数应大于允许迟到分钟数')
        return
      }
      if (this.form.absentTime < this.form.seriousLateMinutes) {
        this.$toast.fail('旷工迟到分钟数应大于严重迟到分钟数')
        return
      }
      let data = this.formData()
      // console.log(data, 'createData')
      this.createLoading = true
      this.$http.post(AIShifts, data).then((res) => {
        this.createLoading = false
        this.$dialog.alert({
          closeOnPopstate: true,
          message: '添加成功'
        }).then(() => {
          history.go(-1)
        })
      }).catch(() => {
        this.createLoading = false
      })
    },
    // 修改
    updateData () {
      if (this.form.name === '') {
        this.$toast.fail('班次名称不能为空')
        return
      }
      if (checkName(this.form.name)) {
        this.$toast.fail('班次名称\n最多10个字符\n(中英文或数字)')
        return
      }
      // 判断人性化是否开启
      if (this.form.permitLateMinutes > this.form.seriousLateMinutes) {
        this.$toast.fail('严重迟到分钟数应大于允许迟到分钟数')
        return
      }
      if (this.form.absentTime < this.form.seriousLateMinutes) {
        this.$toast.fail('旷工迟到分钟数应大于严重迟到分钟数')
        return
      }
      let data = this.formData()
      data.id = this.$route.query.id
      // console.log(data, 'updateData')
      this.updateLoading = true
      this.$http.put(AIShifts, data).then((res) => {
        this.updateLoading = false
        this.$dialog({ closeOnPopstate: true, message: res.message }).then(() => {
          // this.$router.
          history.go(-1)
        })
      }).catch(() => {
        this.updateLoading = false
      })
    },
    // 上班次数
    onchangeTags (name, title) {
      if (name === 1) {
        this.firstBeginTime = '09:00'
        this.firstEndTime = '18:00'
        this.time = '9小时0分钟'
      }
      if (name === 2) {
        this.firstBeginTime = '09:00'
        this.firstEndTime = '12:00'
        this.secondBeginTime = '14:00'
        this.secondEndTime = '18:00'
        this.time = '7小时0分钟'
        this.form.openRestTime = false
      }
      if (name === 3) {
        this.firstBeginTime = '09:00'
        this.firstEndTime = '11:00'
        this.secondBeginTime = '12:00'
        this.secondEndTime = '15:00'
        this.thirdBeginTime = '16:00'
        this.thirdEndTime = '18:00'
        this.time = '7小时0分钟'
        this.form.openRestTime = false
      }
    },
    // 判断休息时间段
    openRestTimeChange (value) {
      if (value) {
        // 正常情况下 没有次日的情况
        const start = HHssFormatter(this.restTimeStart) - HHssFormatter(this.firstBeginTime)
        const end = HHssFormatter(this.firstEndTime) - HHssFormatter(this.restTimeEnd)
        if (start > 0 && end > 0 && !this.firstEnd) {
          // 获取工作时长
          let time = (HHssFormatter(this.firstEndTime) - HHssFormatter(this.firstBeginTime)) - (HHssFormatter(this.restTimeEnd) - HHssFormatter(this.restTimeStart))
          this.time = NumToTimeFormatter(time)
          // 判断是次日  休息时间大于开始时间  结束时间大于休息结束时间
        } else if (start > 0 && end > 0 && this.firstEnd) {
          // 获取工作时长
          let time = start + end
          this.time = NumToTimeFormatter(time)
          // 次日 休息时间大于开始时间 结束时间小于休息结束时间
        } else if ((start < 0 && end > 0 && this.firstEnd) || (start > 0 && end < 0 && this.firstEnd)) {
          let time = 1440 + start + end
          this.time = NumToTimeFormatter(time)
        } else {
          this.$toast.fail('休息时间\n应在工作时间之内，\n请注意设置休息时间段')
        }
      }
    },
    // 第一次时间
    firstBeginTimeChange (value) {
      const flag = HHssFormatter(this.firstEndTime) - HHssFormatter(value)
      // 判断是否具有休息时间
      if (this.form.openRestTime) {
        this.openRestTimeChange(true)
      }
      if (value === this.firstEndTime) {
        this.$toast.fail('两个时间点不能设置为同一时间')
        this.firstBeginTime = '09:00'
      } else if (flag > 0) {
        this.firstEnd = false
        this.secondStart = false
        this.secondEnd = false
        this.thirdStart = false
        this.thirdEnd = false
      } else {
        this.firstEnd = true
        this.secondStart = true
        this.secondEnd = true
        this.thirdStart = true
        this.thirdEnd = true
      }
    },
    firstEndTimeChange (value) {
      const flag = HHssFormatter(value) - HHssFormatter(this.firstBeginTime)
      // 判断是否具有休息时间
      if (this.form.openRestTime) {
        this.openRestTimeChange(true)
      }
      if (value === this.firstBeginTime || value === this.secondBeginTime) {
        this.$toast.fail('两个时间点不能设置为同一时间')
        if (this.form.workNum === 1) {
          this.firstEndTime = '18:00'
        } else if (this.form.workNum === 2) {
          this.firstEndTime = '12:00'
        } else {
          this.firstEndTime = '11:00'
        }
      } else if (flag < 0) {
        this.firstEnd = true
        this.secondStart = true
        this.secondEnd = true
        this.thirdStart = true
        this.thirdEnd = true
      } else if (flag > 0 && HHssFormatter(value) - HHssFormatter(this.secondBeginTime) > 0) {
        this.firstEnd = false
        this.secondStart = true
        this.secondEnd = true
        this.thirdStart = true
        this.thirdEnd = true
      } else {
        this.firstEnd = false
        this.secondStart = false
        this.secondEnd = false
        this.thirdStart = false
        this.thirdEnd = false
      }
    },
    // 第二次时间
    secondBeginTimeChange (value) {
      if (this.firstEnd) {
        if (HHssFormatter(value) - HHssFormatter(this.firstBeginTime) >= 0) {
          this.$toast.fail('请设置的时间在24小时时间段之内')
        } else {
          this.secondStart = true
          this.secondEnd = true
          this.thirdStart = true
          this.thirdEnd = true
        }
      } else if (value === this.firstEndTime || value === this.secondEndTime) {
        this.$toast.fail('两个时间点不能设置同一时间')
        this.secondBeginTime = '14:00'
      } else if (HHssFormatter(value) - HHssFormatter(this.firstBeginTime) < 0) {
        this.secondStart = true
        this.secondEnd = true
        this.thirdStart = true
        this.thirdEnd = true
      } else if (HHssFormatter(value) - HHssFormatter(this.firstEndTime) > 0 && HHssFormatter(value) - HHssFormatter(this.secondEndTime) > 0) {
        this.secondStart = false
        this.secondEnd = true
        this.thirdStart = true
        this.thirdEnd = true
      } else if (HHssFormatter(value) - HHssFormatter(this.firstBeginTime) > 0 && HHssFormatter(value) - HHssFormatter(this.firstEndTime) < 0) {
        this.$toast.fail('请按时间顺序设置时间点')
        this.secondEndTime = '18:00'
        this.secondStart = false
        this.secondEnd = false
        this.thirdStart = false
        this.thirdEnd = false
      } else {
        this.secondStart = false
        this.secondEnd = false
        this.thirdStart = false
        this.thirdEnd = false
      }
    },
    secondEndTimeChange (value) {
      if (this.secondStart) {
        if (HHssFormatter(value) - HHssFormatter(this.firstBeginTime) >= 0) {
          this.$toast.fail('请设置的时间在24小时时间段之内')
        } else {
          this.secondEnd = true
          this.thirdStart = true
          this.thirdEnd = true
        }
      } else if (value === this.secondBeginTime || value === this.thirdBeginTime) {
        this.$toast.fail('两个时间点不能设置同一时间')
        this.secondEndTime = '18:00'
      } else if (value === this.firstBeginTime) {
        this.$toast.fail('请按时间顺序设置时间点')
        this.secondEndTime = '18:00'
      } else if (HHssFormatter(value) - HHssFormatter(this.secondBeginTime) > 0 && HHssFormatter(value) - HHssFormatter(this.thirdBeginTime) > 0) {
        this.secondEnd = false
        this.thirdStart = true
        this.thirdEnd = true
      } else if (HHssFormatter(value) - HHssFormatter(this.secondBeginTime) < 0 && HHssFormatter(this.firstBeginTime) - HHssFormatter(value) < 0) {
        this.$toast.fail('请按时间顺序设置时间点')
        this.secondEndTime = '18:00'
      } else if (HHssFormatter(value) - HHssFormatter(this.secondBeginTime) < 0 && HHssFormatter(this.firstBeginTime) - HHssFormatter(value) > 0) {
        this.secondEnd = true
        this.thirdStart = true
        this.thirdEnd = true
      } else {
        this.secondEnd = false
        this.thirdStart = false
        this.thirdEnd = false
      }
    },
    // 第三段时间
    thirdBeginTimeChange (value) {
      if (this.secondEnd) {
        if (HHssFormatter(value) - HHssFormatter(this.firstBeginTime) >= 0) {
          this.$toast.fail('请设置的时间在24小时时间段之内')
        } else {
          this.thirdStart = true
          this.thirdEnd = true
        }
      } else if (value === this.secondEndTime || value === this.thirdEndTime) {
        this.$toast.fail('两个时间点不能设置同一时间')
        this.thirdBeginTime = '16:00'
      } else if (value === this.firstBeginTime) {
        this.$toast.fail('请按时间顺序设置时间点')
        this.thirdBeginTime = '16:00'
      } else if (HHssFormatter(value) - HHssFormatter(this.secondEndTime) < 0 && HHssFormatter(this.firstBeginTime) - HHssFormatter(value) < 0) {
        this.$message.error('请按时间顺序设置时间点')
        this.thirdBeginTime = '16:00'
      } else if (HHssFormatter(value) - HHssFormatter(this.secondEndTime) < 0 && HHssFormatter(this.firstBeginTime) - HHssFormatter(value) > 0) {
        this.thirdStart = true
        this.thirdEnd = true
      } else {
        this.thirdStart = false
        this.thirdEnd = false
      }
    },
    thirdEndTimeChange (value) {
      if (this.thirdStart) {
        if (HHssFormatter(value) - HHssFormatter(this.firstBeginTime) >= 0) {
          this.$message.error('请设置的时间在24小时时间段之内')
        } else {
          this.thirdEnd = true
        }
      } else if (value === this.thirdBeginTime) {
        this.$message.error('两个时间点不能设置同一时间')
        this.thirdEndTime = '18:00'
      } else if (value === this.firstBeginTime) {
        this.$message.error('请按时间顺序设置时间点')
        this.thirdEndTime = '18:00'
      } else if (HHssFormatter(value) - HHssFormatter(this.thirdBeginTime) < 0 && HHssFormatter(this.firstBeginTime) - HHssFormatter(value) < 0) {
        this.$message.error('请按时间顺序设置时间点')
        this.thirdEndTime = '18:00'
      } else if (HHssFormatter(value) - HHssFormatter(this.thirdBeginTime) < 0 && HHssFormatter(this.firstBeginTime) - HHssFormatter(value) > 0) {
        this.thirdEnd = true
      } else {
        this.thirdEnd = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
/* 选择时间 当前选中的样式 */
.box{
  min-height: 100%;
  overflow: auto;
  padding-bottom: calc(1.17333rem + 1rem + 1px) ;
}
.class-admin{
  height: 100%;
  padding-bottom: calc(1.17333rem + 1rem);
}
.class-admin >>> .van-picker-column__item.van-picker-column__item--selected{
  background: #666 !important;
  color: #FFF !important;
}
.van-tag--default{
  background: rgb(212, 234, 238);
  color: rgb(218, 64, 64);
}
.box {
    font-size: 14px;
}
.notice {
    font-size: 12px;
}
.set {
    /deep/ .van-tabs--card {
        padding-top: 0;
    }
}
.late-set {
    .item {
        height: 40px;
    }
}
.btnbox {
    // padding: 15px;
    position: fixed;
    width: 100%;
    left: 0;
    bottom: 0;
    padding: .5rem;
    background: #fff;
    border-top: 1px solid #f1f1f1;
    box-sizing: border-box;
    .btn {
        border-radius: 5px;
        overflow: hidden;
    }
}
</style>

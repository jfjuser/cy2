<template>
  <div class="ssdd">
    <div>
      <NavBar
        :title="message.title"
        left-text="返回"
        left-arrow
        @click-left="onClickLeft"
      />
      <div style="">
        <Field
          v-model="addform.name"
          label="班次名称"
          required
          placeholder="最多10个字符(中英文或数字)"
          :error-message='message.err'
          style="line-height:1.2rem"
          @blur="checkName"
        />
        <Field disabled required label="上下班次数" style="line-height:1.2rem"/>
        <RadioGroup v-model="workNum" style="font-size:0.9rem;line-height:2rem">
          <CellGroup>
            <Cell title="一天一次上下班" clickable @click="oneSelect">
              <Radio name="1" slot="right-icon"></Radio>
            </Cell>
            <Cell title="一天两次上下班" clickable @click="twoSelect">
              <Radio name="2" slot="right-icon"></Radio>
            </Cell>
            <Cell title="一天三次上下班" clickable @click="threeSelect">
              <Radio name="3" slot="right-icon"></Radio>
            </Cell>
          </CellGroup>
          <Checkbox v-model="isAdd" checked-color="#1e90ff" style="margin:0.75rem;line-height:2rem">加班时间设置</Checkbox>
        </RadioGroup>
        <RadioGroup v-if="isAdd === true" style="margin-left:2.5rem;font-size:0.85rem" v-model="addRadio">
          <Radio style="margin-bottom:0.55rem;" checked-color="#07c160" :name="1">以审批时间计算加班</Radio>
          <Radio style="margin-bottom:0.55rem;" checked-color="#07c160" :name="2">审批后，以打卡时间计算加班</Radio>
          <Radio style="margin-bottom:0.55rem;" checked-color="#07c160" :name="3">以打卡时间计算加班</Radio>
        </RadioGroup>
        <Tag v-if="isAdd === true" @click.native="showDet" mark type="success" style="margin-left:2.5rem">加班详情</Tag>
        <Checkbox v-model="checked" checked-color="#1e90ff" style="margin:0.75rem;line-height:2rem">打卡时段设置</Checkbox>
        <Popup v-model="isWatch" position="left">
          <Cell title="以审批时间计算加班" value="加班必须审批，加班时长以审批单为准"/>
          <Cell title="审批后，以打卡时间计算加班" value="加班必须审批，以打卡为准，但不能超过审批单时长。从最后一次下班后30分钟开始计算加班，最小加班时长30分钟"/>
          <Cell title="以打卡时间计算加班" value="加班无须审批，根据打卡时间计算加班时长，从最后一次下班后30分钟开始计算加班，最小加班时长30分钟"/>

        </Popup>
        <div>
          <span class="countStyle">第一次</span>
          <div style="display:inline-block" >
          <Field label="上班:" v-model="goWorkTime.firstGo" class="inputStyle" @focus="firstGo" readonly>
            <Icon slot="left-icon" name="underway"></Icon>
          </Field>
            <Popup v-model="isFirstWork" position="bottom" :close-on-click-overlay="false">
              <DatetimePicker
                v-model="currentDate"
                type="time"
                :min-hour="minHour"
                :max-hour="maxHour"
                @confirm="confirmSelect"
                @cancel="cancelShow"
              />
            </Popup>
            </div>
            <div style="display:inline-block;margin-left:1rem;" v-show="checked===true">
              <el-select v-model="firstBefore">
                <el-option v-for="item in arr" :key=item :value=item>
                </el-option>
              </el-select>
              <span style="font-size:0.85rem;color:red">分钟前开始打卡</span>
            </div>
            <div style="display:inline-block">
              <Field label="下班:" v-model="goWorkTime.firstCome" class="inputStyle" @focus="firstCome" readonly>
                <Icon slot="left-icon" name="underway"></Icon>
              </Field>
              <Popup v-model="isFirstWork1" position="bottom" :close-on-click-overlay="false">
                <DatetimePicker
                  v-model="currentDate"
                  type="time"
                  :min-hour="minHour"
                  :max-hour="maxHour"
                  @confirm="confirmSelect1"
                  @cancel="cancelShow1"
                />
              </Popup>
              </div>
              <div style="display:inline-block;margin-left:1rem;" v-show="checked===true">
               <el-select v-model="firstAfter">
                <el-option v-for="item in arr" :key=item :value=item>
                </el-option>
              </el-select>
              <span style="font-size:0.85rem;color:red">分钟后结束打卡</span>
            </div>
          </div>
          <div v-show="workNum === '2' || workNum === '3'">
            <span class="countStyle">第二次</span>
            <div style="display:inline-block" >
            <Field label="上班:" v-model="goWorkTime.secondGo" class="inputStyle" @focus="secondGo" readonly>
              <Icon slot="left-icon" name="underway"></Icon>
            </Field>
            <Popup v-model="isSecondWork" position="bottom" :close-on-click-overlay="false">
              <DatetimePicker
                  v-model="currentDate"
                  type="time"
                  :min-hour="minHour"
                  :max-hour="maxHour"
                  @confirm="confirmSelectGo"
                  @cancel="cancelShowGo"
                />
            </Popup>
            </div>
            <div style="display:inline-block;margin-left:1rem;" v-show="checked===true">
              <el-select v-model="secondBefore">
                <el-option v-for="item in arr" :key=item :value=item>
                </el-option>
              </el-select>
            <span style="font-size:0.85rem;color:red">分钟前开始打卡</span>
            </div>
            <div style="display:inline-block">
            <Field label="下班:" v-model="goWorkTime.secondCome" class="inputStyle" @focus="secondCome" readonly>
              <Icon slot="left-icon" name="underway"></Icon>
            </Field>
            <Popup v-model="isSecondWork1" position="bottom" :close-on-click-overlay="false">
              <DatetimePicker
                  v-model="currentDate"
                  type="time"
                  :min-hour="minHour"
                  :max-hour="maxHour"
                  @confirm="confirmSelectCome"
                  @cancel="cancelShowCome"
                />
            </Popup>
            </div>
            <div style="display:inline-block;margin-left:1rem;" v-show="checked===true">
            <el-select v-model="secondAfter">
                <el-option v-for="item in arr" :key=item :value=item>
                </el-option>
              </el-select>
            <span style="font-size:0.85rem;color:red">分钟后结束打卡</span>
            </div>
          </div>
          <div v-show="workNum === '3'">
            <span class="countStyle">第三次</span>
            <div style="display:inline-block" >
            <Field label="上班:" v-model="goWorkTime.thirdGo" class="inputStyle" @focus="showThirdTime" readonly>
              <Icon slot="left-icon" name="underway"></Icon>
            </Field>
            <Popup v-model="isThirdWork" position="bottom" :close-on-click-overlay="false">
              <DatetimePicker
                  v-model="currentDate"
                  type="time"
                  :min-hour="minHour"
                  :max-hour="maxHour"
                  @confirm="getValue3Go"
                  @cancel="cancel3Go"
                />
            </Popup>
            </div>
            <div style="display:inline-block;margin-left:1rem;" v-show="checked===true">
            <el-select v-model="thirdBefore">
                <el-option v-for="item in arr" :key=item :value=item>
                </el-option>
              </el-select>
            <span style="font-size:0.85rem;color:red">分钟前开始打卡</span>
            </div>
            <div style="display:inline-block">
            <Field label="下班:" v-model="goWorkTime.thirdCome" class="inputStyle" @focus="focus3Come" readonly>
              <Icon slot="left-icon" name="underway"></Icon>
            </Field>
            <Popup v-model="isThirdWork1" position="bottom" :close-on-click-overlay="false">
              <DatetimePicker
                  v-model="currentDate"
                  type="time"
                  :min-hour="minHour"
                  :max-hour="maxHour"
                  @confirm="getValue3Come"
                  @cancel="cancel3Come"
                />
            </Popup>
            </div>
            <div style="display:inline-block;margin-left:1rem;" v-show="checked===true">
            <el-select v-model="thirdAfter">
                <el-option v-for="item in arr" :key=item :value=item>
                </el-option>
              </el-select>
            <span style="font-size:0.85rem;color:red">分钟后结束打卡</span>
            </div>
          </div>
          <div v-show="workNum === '1'">
          <Checkbox v-model="checkedRest" style="margin-left:1rem;line-height:1.5rem" @change="restShot(value)">休息时间</Checkbox>
           <div v-if="checkedRest" style="display:inline-block">
           <Field label="休息开始:" style="width:96vw;margin-top:1rem;margin-left:2vw;border-radius:0.5rem" v-model="restTimeStart" @focus="startRest" readonly>
              <Icon slot="left-icon" name="underway"></Icon>
            </Field>
            <Popup v-model="isRest" position="bottom" :close-on-click-overlay="false">
              <DatetimePicker
                  v-model="currentDate"
                  type="time"
                  :min-hour="minHour"
                  :max-hour="maxHour"
                  @confirm="getValueRest"
                  @cancel="cancelRest"
                />
            </Popup>
            </div>
            <div v-if="checkedRest" style="display:inline-block;margin-bottom:0.5rem;margin-top:1rem">
              <Field label="休息结束:" style="width:96vw;margin-left:2vw;border-radius:0.5rem" v-model="restTimeEnd" @focus="endRest" readonly>
              <Icon slot="left-icon" name="underway"></Icon>
            </Field>
            <Popup v-model="isRest1" position="bottom" :close-on-click-overlay="false">
              <DatetimePicker
                  v-model="currentDate"
                  type="time"
                  :min-hour="minHour"
                  :max-hour="maxHour"
                  @confirm="getValueRest1"
                  @cancel="cancelRest1"
                />
            </Popup>
            </div>
            </div><br>
            <span style="font-size:0.85rem;color:#3399cc;margin-left:1rem">合计工作时长{{hours()}}小时{{mins()}}分钟（考勤统计工作时长及请假出差外出统计，会以此时间为准）</span>
            <Checkbox v-model="notPunch" style="margin:1rem 0 0 1rem;line-height:1.5rem;font-size:0.85rem">下班不用打卡</Checkbox>
            <span style="margin-left:2.8rem;font-size:0.8rem;color:#000">开启后,下班不打卡也不会记作异常</span>
            <span style="display:block;margin-left:1rem;line-height:3rem;margin-top:0.5rem;font-size:1.1rem;color:#3377aa">迟到旷工设置</span>
            <div style="margin-left:0.5rem">
              <span class="lineSpan">允许迟到分钟数<Stepper v-model="count" :min="-1" class="count"/>-1表示不开启</span>
              <span class="lineSpan">严重迟到分钟数<Stepper v-model="count1" :min="-1" class="count"/>-1表示不开启</span>
              <span class="lineSpan">旷工迟到分钟数<Stepper v-model="count2" :min="-1" class="count"/>-1表示不开启</span>
            </div>
            <div style="text-align:center">
              <Button class="btnSave" v-show="getData !== undefined" type="info" size="large" :isLoading='updataLoading' @click="updata">修改</Button>
            <Button class="btnSave" v-show="getData === undefined" type="info" @click="saveContent" size="large" :isLoading="loadingIcon">保存</Button>
            </div>
      </div>
      </div>
  </div>
</template>
<script>
import { NavBar, Tag, Stepper, DatetimePicker, RadioGroup, Toast, Radio, Icon, Checkbox, Button, Cell, CellGroup, Field, Popup } from 'vant'
import { HHssFormatter, NumToTimeFormatter, NumToHHssFormatter } from '@/utils/formatter.js'
import { httpPost, httpGet, httpPut } from '@/utils/restful'
import { AIShifts } from '@/api/url'
export default {
  name: 'classes',
  data () {
    return {
      arr: [10, 20, 30, 40, 50, 60],
      isWatch: false,
      firstBefore: undefined,
      firstAfter: undefined,
      isAdd: false,
      addRadio: 1,
      secondBefore: undefined,
      secondAfter: undefined,
      thirdBefore: undefined,
      thirdAfter: undefined,
      value: undefined,
      checked: false,
      checkedRest: false,
      notPunch: false,
      isRest: false,
      isRest1: false,
      hour: '',
      min: '',
      count: -1,
      count1: -1,
      count2: -1,
      loadingIcon: false,
      updataLoading: false,
      currentDate: '09:00',
      isFirstWork: false,
      isFirstWork1: false,
      isSecondWork: false,
      isSecondWork1: false,
      isThirdWork: false,
      isThirdWork1: false,
      restTimeStart: '12:00',
      restTimeEnd: '13:00',
      getData: undefined,
      goWorkTime: {
        firstGo: '09:00',
        firstCome: '18:00',
        secondGo: '14:00',
        secondCome: '18:00',
        thirdGo: '16:00',
        thirdCome: '18:00'
      },
      minHour: 0,
      maxHour: 23,
      workNum: '1',
      addform: {
        name: undefined
      },
      message: {
        err: '',
        title: '新增班次'
      }
    }
  },
  components: {
    NavBar,
    Tag,
    CellGroup,
    Icon,
    Stepper,
    Button,
    Checkbox,
    Cell,
    Field,
    RadioGroup,
    DatetimePicker,
    Radio,
    Popup
  },
  created () {
    if (this.$route.params.dataObj) {
      this.getData = this.$route.params.dataObj
      this.addform.name = this.getData.name
      this.message.title = '编辑班次'
      httpGet(AIShifts + '/' + this.getData.id)
        .then(res => {
          console.log(res)
          if (res.data.firstBeginTime !== null) this.goWorkTime.firstGo = NumToHHssFormatter(res.data.firstBeginTime)
          if (res.data.firstEndTime !== null) {
            this.goWorkTime.firstCome = NumToHHssFormatter(res.data.firstEndTime)
            this.workNum = '1'
          }
          if (res.data.secondBeginTime !== null) this.goWorkTime.secondGo = NumToHHssFormatter(res.data.secondBeginTime)
          if (res.data.secondEndTime !== null) {
            this.goWorkTime.secondCome = NumToHHssFormatter(res.data.secondEndTime)
            this.workNum = '2'
          }
          if (res.data.thirdBeginTime !== null) this.goWorkTime.thirdGo = NumToHHssFormatter(res.data.thirdBeginTime)
          if (res.data.thirdEndTime !== null) {
            this.goWorkTime.thirdCome = NumToHHssFormatter(res.data.thirdEndTime)
            this.workNum = '3'
          }
          if (res.data.restTimeStart !== null) this.restTimeStart = NumToHHssFormatter(res.data.restTimeStart)
          if (res.data.restTimeEnd !== null) this.restTimeEnd = NumToHHssFormatter(res.data.restTimeEnd)
        })
    }
  },
  methods: {
    onClickLeft () {
      this.$router.push('/attendManage/')
    },
    showDet () {
      this.isWatch = true
    },
    // 第一次上班聚焦时间选择
    firstGo () {
      this.isFirstWork = true
    },
    secondGo () {
      this.isSecondWork = true
    },
    showThirdTime () {
      this.isThirdWork = true
    },
    firstCome () {
      this.isFirstWork1 = true
    },
    secondCome () {
      this.isSecondWork1 = true
    },
    focus3Come () {
      this.isThirdWork1 = true
    },
    startRest () {
      this.isRest = true
    },
    endRest () {
      this.isRest1 = true
    },
    // 验证名称
    checkName () {
      const Reg = /^[A-Za-z0-9\u4e00-\u9fa5]{1,10}$/
      if (!(Reg.test(this.addform.name))) {
        this.message.err = '班次名称只允许10个以内的汉字、英文字符、数字'
      }
    },
    // 取消点击
    cancelRest1 () {
      this.isRest1 = false
    },
    cancelRest () {
      this.isRest = false
    },
    cancelShow () {
      this.isFirstWork = false
    },
    cancelShow1 () {
      this.isFirstWork1 = false
    },
    cancelShowGo () {
      this.isSecondWork = false
    },
    cancelShowCome () {
      this.isSecondWork1 = false
    },
    cancel3Go () {
      this.isThirdWork = false
    },
    cancel3Come () {
      this.isThirdWork1 = false
    },
    // 点击确定
    confirmSelect (value) {
      this.goWorkTime.firstGo = value
      this.isFirstWork = false
    },
    confirmSelect1 (value) {
      this.goWorkTime.firstCome = value
      this.isFirstWork1 = false
    },
    confirmSelectGo (value) {
      this.goWorkTime.secondGo = value
      this.isSecondWork = false
    },
    confirmSelectCome (value) {
      this.goWorkTime.secondCome = value
      this.isSecondWork1 = false
    },
    getValue3Go (value) {
      this.goWorkTime.thirdGo = value
      this.isThirdWork = false
    },
    getValue3Come (value) {
      this.goWorkTime.thirdCome = value
      this.isThirdWork1 = false
    },
    getValueRest (value) {
      this.restTimeStart = value
      this.isRest = false
    },
    getValueRest1 (value) {
      this.restTimeEnd = value
      this.isRest1 = false
    },
    // 计算时间
    hours () {
      if (this.workNum === '1' && !this.checkedRest) {
        let timeHour = NumToHHssFormatter(HHssFormatter(this.goWorkTime.firstCome) - HHssFormatter(this.goWorkTime.firstGo))
        let arr = timeHour.split(':')
        return parseInt(arr[0])
      }
      if (this.workNum === '1' && this.checkedRest) {
        let timeHour = NumToHHssFormatter(HHssFormatter(this.goWorkTime.firstCome) - HHssFormatter(this.goWorkTime.firstGo) + HHssFormatter(this.restTimeEnd) - HHssFormatter(this.restTimeStart))
        let arr = timeHour.split(':')
        return parseInt(arr[0])
      }
      if (this.workNum === '2') {
        let timeHour = NumToHHssFormatter(HHssFormatter(this.goWorkTime.firstCome) - HHssFormatter(this.goWorkTime.firstGo) + HHssFormatter(this.goWorkTime.secondCome) - HHssFormatter(this.goWorkTime.secondGo))
        let arr = timeHour.split(':')
        return parseInt(arr[0])
      }
      if (this.workNum === '3') {
        let timeHour = NumToHHssFormatter(HHssFormatter(this.goWorkTime.firstCome) - HHssFormatter(this.goWorkTime.firstGo) + HHssFormatter(this.goWorkTime.secondCome) - HHssFormatter(this.goWorkTime.secondGo) + HHssFormatter(this.goWorkTime.thirdCome) - HHssFormatter(this.goWorkTime.thirdGo))
        let arr = timeHour.split(':')
        return parseInt(arr[0])
      }
    },
    mins () {
      if (this.workNum === '1' && !this.checkedRest) {
        let timeHour = NumToHHssFormatter(HHssFormatter(this.goWorkTime.firstCome) - HHssFormatter(this.goWorkTime.firstGo))
        let arr = timeHour.split(':')
        return arr[1]
      }
      if (this.workNum === '2') {
        let timeHour = NumToHHssFormatter(HHssFormatter(this.goWorkTime.firstCome) - HHssFormatter(this.goWorkTime.firstGo) + HHssFormatter(this.goWorkTime.secondCome) - HHssFormatter(this.goWorkTime.secondGo))
        let arr = timeHour.split(':')
        return arr[1]
      }
      if (this.workNum === '3') {
        let timeHour = NumToHHssFormatter(HHssFormatter(this.goWorkTime.firstCome) - HHssFormatter(this.goWorkTime.firstGo) + HHssFormatter(this.goWorkTime.secondCome) - HHssFormatter(this.goWorkTime.secondGo) + HHssFormatter(this.goWorkTime.thirdCome) - HHssFormatter(this.goWorkTime.thirdGo))
        let arr = timeHour.split(':')
        return arr[1]
      }
      if (this.workNum === '1' && this.checkedRest) {
        let timeHour = NumToHHssFormatter(HHssFormatter(this.goWorkTime.firstCome) - HHssFormatter(this.goWorkTime.firstGo) + HHssFormatter(this.restTimeEnd) - HHssFormatter(this.restTimeStart))
        let arr = timeHour.split(':')
        return arr[0]
      }
    },
    // 休息时间
    restShot (value) {
      if (value) {
        this.restFlag()
      }
    },
    restFlag () {
      // 正常情况下 没有次日的情况
      let start = HHssFormatter(this.restTimeStart) - HHssFormatter(this.firstGo)
      let end = HHssFormatter(this.firstCome) - HHssFormatter(this.restTimeEnd)
      if (start > 0 && end > 0 && !this.checked) {
        // 获取工作时长
        let time = (HHssFormatter(this.firstCome) - HHssFormatter(this.firstGo)) - (HHssFormatter(this.restTimeEnd) - HHssFormatter(this.restTimeStart))
        this.time = NumToTimeFormatter(time)
        // 判断是次日  休息时间大于开始时间  结束时间大于休息结束时间
      } else if (start > 0 && end > 0 && this.checked) {
        // 获取工作时长
        let time = start + end
        this.time = NumToTimeFormatter(time)
        // 次日 休息时间大于开始时间 结束时间小于休息结束时间
      } else if ((start < 0 && end > 0 && this.checked) || (start > 0 && end < 0 && this.checked)) {
        let time = 1440 + start + end
        this.time = NumToTimeFormatter(time)
      } else {
        Toast('休息时间应在工作时间之内,请注意设置休息时间段')
      }
    },
    // 一天上班改变默认时间
    oneSelect () {
      this.workNum = '1'
      this.goWorkTime.firstCome = '18:00'
    },
    twoSelect () {
      this.workNum = '2'
      this.goWorkTime.firstCome = '12:00'
      this.goWorkTime.secondGo = '14:00'
      this.goWorkTime.secondCome = '18:00'
    },
    threeSelect () {
      this.workNum = '3'
      this.goWorkTime.firstCome = '11:00'
      this.goWorkTime.secondGo = '12:00'
      this.goWorkTime.secondCome = '15:00'
    },
    // 保存新增班次
    saveContent () {
      this.loadingIcon = true
      let data = {
        departmentId: this.$store.getters.departmentId,
        name: this.addform.name,
        openPunchCardTime: this.checked,
        workNum: this.workNum,
        offDutyFreeCheck: this.notPunch,
        permitLateMinutes: this.count,
        seriousLateMinutes: this.count1,
        absentTime: this.count2,
        overTimeRule: this.addRadio,
        openOverTime: this.isAdd
      }
      if (this.checked) {
        if (this.workNum === '1') {
          data = Object.assign({
            firstBeginMin: this.goWorkTime.firstGo,
            firstEndMin: this.goWorkTime.firstCome,
            firstBeginTime: HHssFormatter(this.goWorkTime.firstGo),
            firstEndTime: HHssFormatter(this.goWorkTime.firstCome),
            secondBeginTime: undefined,
            secondEndTime: undefined,
            thirdBeginTime: undefined,
            thirdEndTime: undefined,
            secondBeginMin: undefined,
            secondEndMin: undefined,
            thirdBeginMin: undefined,
            thirdEndMin: undefined
          }, data)
        } else if (this.workNum === '2') {
          data = Object.assign({
            firstBeginTime: HHssFormatter(this.goWorkTime.firstGo),
            firstEndTime: HHssFormatter(this.goWorkTime.firstCome),
            secondBeginTime: HHssFormatter(this.goWorkTime.secondGo),
            secondEndTime: HHssFormatter(this.goWorkTime.secondCome),
            thirdBeginTime: undefined,
            thirdEndTime: undefined,
            firstBeginMin: this.goWorkTime.firstGo,
            firstEndMin: this.goWorkTime.firstCome,
            secondBeginMin: this.goWorkTime.secondGo,
            secondEndMin: this.goWorkTime.secondCome,
            thirdBeginMin: undefined,
            thirdEndMin: undefined
          }, data)
        } else {
          data = Object.assign({
            firstBeginTime: HHssFormatter(this.goWorkTime.firstGo),
            firstEndTime: HHssFormatter(this.goWorkTime.firstCome),
            secondBeginTime: HHssFormatter(this.goWorkTime.secondGo),
            secondEndTime: HHssFormatter(this.goWorkTime.secondCome),
            thirdBeginTime: HHssFormatter(this.goWorkTime.thirdCome),
            thirdEndTime: HHssFormatter(this.goWorkTime.thirdCome),
            firstBeginMin: this.goWorkTime.firstGo,
            firstEndMin: this.goWorkTime.firstCome,
            secondBeginMin: this.goWorkTime.secondGo,
            secondEndMin: this.goWorkTime.secondCome,
            thirdBeginMin: this.goWorkTime.thirdGo,
            thirdEndMin: this.goWorkTime.thirdCome
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
        if (this.workNum === '1') {
          data = Object.assign({
            firstBeginTime: HHssFormatter(this.goWorkTime.firstGo),
            firstEndTime: HHssFormatter(this.goWorkTime.firstCome),
            secondBeginTime: undefined,
            secondEndTime: undefined,
            thirdBeginTime: undefined,
            thirdEndTime: undefined
          }, data)
        } else if (this.workNum === '2') {
          data = Object.assign({
            firstBeginTime: HHssFormatter(this.goWorkTime.firstGo),
            firstEndTime: HHssFormatter(this.goWorkTime.firstCome),
            secondBeginTime: HHssFormatter(this.goWorkTime.secondGo),
            secondEndTime: HHssFormatter(this.goWorkTime.secondCome),
            thirdBeginTime: undefined,
            thirdEndTime: undefined
          }, data)
        } else {
          data = Object.assign({
            firstBeginTime: HHssFormatter(this.goWorkTime.firstGo),
            firstEndTime: HHssFormatter(this.goWorkTime.firstCome),
            secondBeginTime: HHssFormatter(this.goWorkTime.secondGo),
            secondEndTime: HHssFormatter(this.goWorkTime.secondCome),
            thirdBeginTime: HHssFormatter(this.goWorkTime.thirdGo),
            thirdEndTime: HHssFormatter(this.goWorkTime.thordCome)
          }, data)
        }
      }
      if (this.checkedRest) {
        data = Object.assign({
          openRestTime: this.checkedRest,
          restTimeStart: HHssFormatter(this.restTimeStart),
          restTimeEnd: HHssFormatter(this.restTimeEnd)
        }, data)
      } else {
        data = Object.assign({
          openRestTime: this.checkedRest,
          restTimeStart: undefined,
          restTimeEnd: undefined
        }, data)
      }
      // 判断人性化是否开启
      if (this.count > this.count1) {
        Toast('严重迟到分钟数应大于允许迟到分钟数')
      } else if (this.count2 < this.count1) {
        Toast('旷工迟到分钟数应大于严重迟到分钟数')
      } else {
        httpPost(AIShifts, data).then((res) => {
          this.loadingIcon = false
          // this.fetchData()
          // this.dialogFormVisible = false
          Toast({
            message: res.message,
            type: 'success',
            duration: 4 * 1000
          })
          this.$router.push('attendManage')
          console.log(res)
        }).catch(() => {
          this.loadingIcon = false
        })
      }
    },
    // 更新编辑班次
    updata () {
      this.updataLoading = true
      let data = {
        id: this.getData.id,
        departmentId: this.$store.getters.departmentId,
        name: this.addform.name,
        openPunchCardTime: this.checked,
        workNum: this.workNum,
        offDutyFreeCheck: this.notPunch,
        permitLateMinutes: this.count,
        seriousLateMinutes: this.count1,
        absentTime: this.count2,
        overTimeRule: this.addRadio,
        openOverTime: this.isAdd
      }
      if (this.checked) {
        if (this.workNum === '1') {
          data = Object.assign({
            firstBeginMin: this.goWorkTime.firstGo,
            firstEndMin: this.goWorkTime.firstCome,
            firstBeginTime: HHssFormatter(this.goWorkTime.firstGo),
            firstEndTime: HHssFormatter(this.goWorkTime.firstCome),
            secondBeginTime: undefined,
            secondEndTime: undefined,
            thirdBeginTime: undefined,
            thirdEndTime: undefined,
            secondBeginMin: undefined,
            secondEndMin: undefined,
            thirdBeginMin: undefined,
            thirdEndMin: undefined
          }, data)
        } else if (this.workNum === '2') {
          data = Object.assign({
            firstBeginTime: HHssFormatter(this.goWorkTime.firstGo),
            firstEndTime: HHssFormatter(this.goWorkTime.firstCome),
            secondBeginTime: HHssFormatter(this.goWorkTime.secondGo),
            secondEndTime: HHssFormatter(this.goWorkTime.secondCome),
            thirdBeginTime: undefined,
            thirdEndTime: undefined,
            firstBeginMin: this.goWorkTime.firstGo,
            firstEndMin: this.goWorkTime.firstCome,
            secondBeginMin: this.goWorkTime.secondGo,
            secondEndMin: this.goWorkTime.secondCome,
            thirdBeginMin: undefined,
            thirdEndMin: undefined
          }, data)
        } else {
          data = Object.assign({
            firstBeginTime: HHssFormatter(this.goWorkTime.firstGo),
            firstEndTime: HHssFormatter(this.goWorkTime.firstCome),
            secondBeginTime: HHssFormatter(this.goWorkTime.secondGo),
            secondEndTime: HHssFormatter(this.goWorkTime.secondCome),
            thirdBeginTime: HHssFormatter(this.goWorkTime.thirdCome),
            thirdEndTime: HHssFormatter(this.goWorkTime.thirdCome),
            firstBeginMin: this.goWorkTime.firstGo,
            firstEndMin: this.goWorkTime.firstCome,
            secondBeginMin: this.goWorkTime.secondGo,
            secondEndMin: this.goWorkTime.secondCome,
            thirdBeginMin: this.goWorkTime.thirdGo,
            thirdEndMin: this.goWorkTime.thirdCome
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
        if (this.workNum === '1') {
          data = Object.assign({
            firstBeginTime: HHssFormatter(this.goWorkTime.firstGo),
            firstEndTime: HHssFormatter(this.goWorkTime.firstCome),
            secondBeginTime: undefined,
            secondEndTime: undefined,
            thirdBeginTime: undefined,
            thirdEndTime: undefined
          }, data)
        } else if (this.workNum === '2') {
          data = Object.assign({
            firstBeginTime: HHssFormatter(this.goWorkTime.firstGo),
            firstEndTime: HHssFormatter(this.goWorkTime.firstCome),
            secondBeginTime: HHssFormatter(this.goWorkTime.secondGo),
            secondEndTime: HHssFormatter(this.goWorkTime.secondCome),
            thirdBeginTime: undefined,
            thirdEndTime: undefined
          }, data)
        } else {
          data = Object.assign({
            firstBeginTime: HHssFormatter(this.goWorkTime.firstGo),
            firstEndTime: HHssFormatter(this.goWorkTime.firstCome),
            secondBeginTime: HHssFormatter(this.goWorkTime.secondGo),
            secondEndTime: HHssFormatter(this.goWorkTime.secondCome),
            thirdBeginTime: HHssFormatter(this.goWorkTime.thirdGo),
            thirdEndTime: HHssFormatter(this.goWorkTime.thordCome)
          }, data)
        }
      }
      if (this.checkedRest) {
        data = Object.assign({
          openRestTime: this.checkedRest,
          restTimeStart: HHssFormatter(this.restTimeStart),
          restTimeEnd: HHssFormatter(this.restTimeEnd)
        }, data)
      } else {
        data = Object.assign({
          openRestTime: this.checkedRest,
          restTimeStart: undefined,
          restTimeEnd: undefined
        }, data)
      }
      // 判断人性化是否开启
      if (this.count > this.count1) {
        Toast('严重迟到分钟数应大于允许迟到分钟数')
      } else if (this.count2 < this.count1) {
        Toast('旷工迟到分钟数应大于严重迟到分钟数')
      } else {
        httpPut(AIShifts, data).then((res) => {
          this.updataLoading = false
          Toast({
            message: res.message,
            type: 'success',
            duration: 4 * 1000
          })
          this.$router.push('/attendManage/')
          console.log(res)
        }).catch(() => {
          this.updataLoading = false
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.ssdd{
  min-height:100vh;
  // background-color: rgb(134,163,195);
  // background-color: rgb(245,245,245)
}
.countStyle{
  display:block;
  margin-left:1rem;
  font-size:1rem;
  margin-top:0.5rem;
  color:#585858;
}
.inputStyle{
  width:40vw;
  margin:1rem;
  border-radius:5px;
}
.select{
   outline: none;
   width:3rem;
   height:1.6rem;
   border: 1px solid #000
}
option{
  background-color: #fff;
  border: 1px solid #000;
}
.btnSave{
  width:70vw;
  height: 2.7rem;
  line-height: 2.7rem;
  margin-top: 2.5rem;
  margin-bottom:1.5rem;
  border-radius: 0.4rem;
}
.count{
  display: inline;
  margin: 0 1.5rem 0 1.5rem;
}
.lineSpan{
  display: inline-block;
  margin-left: 0.5rem;
  color:#555555;
  line-height: 2rem;
  font-size: 0.95rem
}
.timePicker{
  position: absolute;
  z-index:2;
  left:20%;
  top:60%;
  width: 40vw;
  border:1px solid #ccc;
}
</style>

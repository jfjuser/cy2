<template>
  <div class="containert">
    <NavBar
      title="添加考勤"
      left-text="返回"
      left-arrow
      @click-left="onClickLeft"
      />
    <Field
      label="考勤组名称"
      v-model="form.name"
      placeholder="请输入考勤组名称"
      :error-message="errorInfo"
      @blur="checkName"
    />
    <span style="font-size:0.9rem;line-height:2rem;margin-left:1rem">考勤类型</span>
    <RadioGroup v-model="form.radio">
      <Radio name="0" class="radioStyle">固定班制</Radio>
      <Radio name="1" class="radioStyle">排班制</Radio>
      <Radio name="2" class="radioStyle">自由时间制</Radio>
    </RadioGroup>
     <Field
      label="参与考勤人员"
      disabled
    >
      <Button slot="button" size="small" v-if="isBtn" @click="selectPerson">请选择</Button>
      <Button slot="button" type="info" size="small" v-for="(item, index) in form.btnArr"  @click="selectPerson" :key=index>{{item.name}}</Button>
    </Field>
    <div v-show="form.radio === '0'">
      <Field
        label="工作日班次"
        v-model="form.changeTimeCount"
        style="line-height:1.5rem"
      >
      <Button slot="button" size="small" @click="showTimeCount">更换班次</Button>
      </Field>
      <CheckboxGroup v-model="form.arrayCheck">
        <van-row>
          <van-col span="3" class="indexPage">选项</van-col>
          <van-col span="5" class="indexPage">工作日</van-col>
          <van-col span="11" class="indexPage">班次时间段</van-col>
          <van-col span="5" class="indexPage">操作</van-col>
        </van-row>
        <van-row v-for="(item, index) in 7" :key=index>
          <van-col span="3" class="indexPage"><Checkbox :name=item></Checkbox></van-col>
          <van-col span="5" class="indexPage">星期{{numToChinese(item)}}</van-col>
          <van-col span="11" class="indexPage"><span ref='refCount'>休息</span></van-col>
          <van-col span="5" class="indexPage"><span style="color:#1E90ff" @click="addCount(item)">修改班次</span></van-col>
        </van-row>
      </CheckboxGroup>
    </div>
    <div v-show="form.radio === '1'">
      <Field
        label="考勤班次"
        placeholder="选择班次"
        @focus="selectAttendClasses"
        v-model="form.attendWorkTimeAt"
        readonly
      />
      <Field
        label="排班周期"
        placeholder="请设置排班周期"
        v-model="form.weekendsDate"
        @focus="setCycle"
        readonly
      />
    </div>
    <div v-show="form.radio === '2'">
      <span style="font-size:0.9rem;margin-left:1rem;line-height:2rem">设置工作日</span>
      <CheckboxGroup v-model="form.selectArr">
        <Checkbox :name='1' class="checkboxStyle">周一</Checkbox>
        <Checkbox :name='2' class="checkboxStyle">周二</Checkbox>
        <Checkbox :name='3' class="checkboxStyle">周三</Checkbox>
        <Checkbox :name='4' class="checkboxStyle">周四</Checkbox>
        <Checkbox :name='5' class="checkboxStyle">周五</Checkbox>
        <Checkbox :name='6' class="checkboxStyle">周六</Checkbox>
        <Checkbox :name='7' class="checkboxStyle">周日</Checkbox>
      </CheckboxGroup>
      <Field
        label="考勤开始时间"
        v-model="form.beginTime"
        placeholder="任意时间点"
        style="line-height:2rem;"
        @focus="selectTime"
        :readonly="true"
      />
      <Popup v-model="isShow" position="bottom" id="asd" :close-on-click-overlay="false">
        <DatetimePicker
        v-model="currentTime"
        @cancel="closeTime"
        @confirm="getValue"
        type="time"
        />
      </Popup>
    </div>
    <Button type="info" size="large" @click="submitAttend" :isLoading="createLoading"
    style="margin:2rem 0 3rem 0;height:2.5rem;line-height:1rem;width:70vw;margin-left:15%;border-radius:0.7rem">保存</Button>
    <!-- 选择部门与人员 -->
      <Popup v-model="isWatchUser" style="width:85vw;min-height:30vh;border-radius:0.7rem">
        <Cell title="选择部门与人员" style="font-size:1rem">
          <Icon slot="right-icon" name="cross" class="custom-icon" @click="cancelSelect" />
        </Cell>
        <CheckboxGroup v-model="array">
          <Checkbox
            style="line-height:2rem;font-size:1rem;margin:0.6rem"
            v-for="(item, index) in list"
            :key=index
            :name="item"
          >
            {{ item.name }}
          </Checkbox>
        </CheckboxGroup>
        <div style="line-height:6rem">
          <Button size="small" style="margin-left:45%;font-size:1rem" @click="cancelSelect">取消</Button>
          <Button type="info" @click="savePerson" style="margin-left:7%;font-size:1rem" size="small">保存</Button>
          </div>
      </Popup>
    <!-- 更换班次 -->
      <Popup v-model="changeCount" style="width:85vw;min-height:30vh;border-radius:0.7rem">
        <div>
          <Cell title="选择班次" style="font-size:1rem">
            <Icon slot="right-icon" name="cross" class="custom-icon" @click="closeAdd"/>
          </Cell>
          <!-- <van-row>
            <van-col span="4" class="indexPage">选项</van-col>
            <van-col span="7" class="indexPage">名称</van-col>
            <van-col span="13" class="indexPage">考勤时间</van-col>
          </van-row>
          <RadioGroup v-model="saveCount">
          <van-row v-for="(item, index) in attendFixedInfo" :key=index>
            <van-col span="4" class="indexPage"><Radio :name=item></Radio></van-col>
            <van-col span="7" class="indexPage">{{item.name}}</van-col>
            <van-col span="13" class="indexPage">{{item.workTimeAt}}</van-col>
          </van-row>
          </RadioGroup> -->
          <RadioGroup v-model="saveCount">
            <CellGroup v-for="(item, index) in attendFixedInfo" :key=index>
              <Cell center clickable @click="saveCount = item" value-class="cellright">
                <template slot="title">
                  <div class="flex-b"><span>名称</span><span>{{item.name}}</span></div>
                  <div class="flex-b"><span>考勤时间</span><span>{{item.workTimeAt}}</span></div>
                </template>
                <Radio :name="item"></Radio>
              </Cell>
            </CellGroup>
          </RadioGroup>
          <div style="line-height:3.5rem">
            <Button size="small" style="width:55vw;margin-top:3rem;border-radius:7px;margin-left:15vw;line-height:1rem;height:2.5rem;" @click="closeAdd">取消</Button>
            <Button type="info" style="width:55vw;margin-left:15vw;border-radius:7px;line-height:1rem;height:2.5rem;" size="small" @click="saveFixedAdd">确定</Button>
          </div>
        </div>
      </Popup>
    <!-- 修改班次 -->
      <Popup v-model="changeCount1" style="width:85vw;min-height:30vh;border-radius:0.7rem">
        <div>
          <Cell title="选择班次" style="font-size:1rem">
            <Icon slot="right-icon" name="cross" class="custom-icon" @click="closeAdd1"/>
          </Cell>
          <!-- <van-row>
            <van-col span="4" class="indexPage">选项</van-col>
            <van-col span="7" class="indexPage">名称</van-col>
            <van-col span="13" class="indexPage">考勤时间</van-col>
          </van-row>
          <RadioGroup v-model="saveCount1">
          <van-row v-for="(item, index) in attendFixedInfo1" :key=index>
            <van-col span="4" class="indexPage"><Radio :name=item></Radio></van-col>
            <van-col span="7" class="indexPage">{{item.name}}</van-col>
            <van-col span="13" class="indexPage">{{item.workTimeAt}}</van-col>
          </van-row>
          </RadioGroup> -->
          <RadioGroup v-model="saveCount1">
            <CellGroup v-for="(item, index) in attendFixedInfo1" :key=index>
              <Cell center clickable @click="saveCount1 = item" value-class="cellright">
                <template slot="title">
                  <div class="flex-b"><span>名称</span><span>{{item.name}}</span></div>
                  <div class="flex-b"><span>考勤时间</span><span>{{item.workTimeAt}}</span></div>
                </template>
                <Radio :name="item"></Radio>
              </Cell>
            </CellGroup>
          </RadioGroup>
          <div style="line-height:4rem">
            <Button size="small" style="width:55vw;margin-top:3rem;margin-left:15vw;line-height:1rem;height:2.5rem;" @click="closeAdd1">取消</Button>
            <Button type="info" style="width:55vw;margin-left:15vw;line-height:1rem;height:2.5rem;" size="small" @click="saveFixedAdd1">确定</Button>
          </div>
        </div>
      </Popup>
    <!-- 排班制-考勤班次 -->
      <Popup v-model="changeCount2" style="width:85vw;min-height:35vh;border-radius:0.7rem">
        <div>
          <Cell title="选择班次" style="font-size:1rem">
            <Icon slot="right-icon" name="cross" class="custom-icon" @click="closeAdd2"/>
          </Cell>
          <!-- <van-row>
            <van-col span="4" class="indexPage">选项</van-col>
            <van-col span="7" class="indexPage">名称</van-col>
            <van-col span="13" class="indexPage">考勤时间</van-col>
          </van-row>
          <RadioGroup v-model="saveCount2">
          <van-row v-for="(item, index) in attendFixedInfo2" :key=index>
            <van-col span="4" class="indexPage"><Radio :name=item></Radio></van-col>
            <van-col span="7" class="indexPage">{{item.name}}</van-col>
            <van-col span="13" class="indexPage">{{item.workTimeAt}}</van-col>
          </van-row>
          </RadioGroup> -->
          <RadioGroup v-model="saveCount2">
            <CellGroup v-for="(item, index) in attendFixedInfo2" :key=index>
              <Cell center clickable @click="saveCount2 = item" value-class="cellright">
                <template slot="title">
                  <div class="flex-b"><span>名称</span><span>{{item.name}}</span></div>
                  <div class="flex-b"><span>考勤时间</span><span>{{item.workTimeAt}}</span></div>
                </template>
                <Radio :name="item"></Radio>
              </Cell>
            </CellGroup>
          </RadioGroup>
          <div style="line-height:4rem">
            <Button size="small" style="width:55vw;margin-top:3rem;margin-left:15vw;line-height:1rem;height:2.5rem;" @click="closeAdd2">取消</Button>
            <Button type="info" style="width:55vw;margin-left:15vw;line-height:1rem;height:2.5rem;" size="small" @click="saveFixedAdd2">确定</Button>
          </div>
        </div>
      </Popup>
    <!-- 排班制 - 排班周期 -->
      <Popup v-model="isCycle" style="width:85vw;min-height:60vh;border-radius:0.7rem">
        <div>
          <Cell title="排班周期" style="font-size:1.2rem;line-height:2.5rem">
            <Icon slot="right-icon" name="cross" class="custom-icon" @click="cancelCycle" />
          </Cell>
          <Field
            label="周期名称"
            v-model="form.cycleName"
            style="font-size:0.85rem;color:#000"
            placeholder="请输入"
          />
          <div style="line-height:3rem;font-size:0.85rem;margin-left:1rem;display:inline-block">
            <span>每个周期天数</span>
            <Stepper v-model="form.valueCount" style="display:inline-block;margin-left:1rem"/>
          </div><br>
          <span style="line-height:2.5rem;font-size:0.85rem;margin-left:1rem">以2天为周期进行循环，最大周期天数为31天</span>
          <div v-for="item in form.valueCount" :key=item>
            <Field
              placeholder="29"
            >
              <label slot="label">第{{item-1}}天</label>
            </Field>
        </div>
          <div style="margin-top:3rem">
            <Button size="large"
            style="margin-left:12.5vw;width:60vw;font-size:1rem;
            height:2.5rem;line-height:1.2rem;"
            @click="cancelCycle">取消</Button>
            <Button size="large" type="info"
            style="margin-left:12.5vw;width:60vw;font-size:1rem;
            height:2.5rem;line-height:1.2rem;margin-top:1.5rem"
            @click="confirmCycle">确定</Button>
          </div>
        </div>
      </Popup>
  </div>
</template>
<script>
import { attendTypeFormatter, numToChinese, fontNum } from '@/utils/formatter'
import { httpGet, httpPost } from '@/utils/restful'
import { AIDuyCompanyAndAiUser, getAIShiftsList, AIAttendGroup } from '@/api/url'
import { NavBar, Toast, Stepper, DatetimePicker, Field, Cell, Icon, Popup, RadioGroup, Button, Row, Col, Radio, CheckboxGroup, Checkbox, CellGroup } from 'vant'
export default {
  name: 'addAttend',
  data () {
    return {
      isBtn: true,
      isWatchUser: false,
      fontNum: fontNum,
      changeCount: false,
      isShow: false,
      isCycle: false,
      // 三个尾数添1,2的都是控制选择考勤班次的
      changeCount1: false,
      changeCount2: false,
      createLoading: false,
      result: undefined,
      // 三个尾数添1,2的都是控制选择考勤班次的
      attendFixedInfo: undefined,
      attendFixedInfo1: undefined,
      attendFixedInfo2: undefined,
      saveCount: '',
      saveCount1: '',
      saveCount2: '',
      errorInfo: '',
      currentTime: '12:00',
      array: [],
      list: [],
      form: {
        name: '',
        radio: '0',
        type: 0,
        valueCount: 1,
        cycleName: '',
        selectArr: [],
        btnArr: [],
        userNameArr: [],
        changeTimeCount: undefined,
        arrayCheck: [],
        attendWorkTimeAt: '',
        weekendsDate: undefined,
        beginTime: '00:00',
        // aiUserBeans: {
        //   aiUsers: [],
        //   noAiUsers: []
        // },
        fixedSchedulingBean: {
          mondayShiftId: -1,
          tuesdayShiftId: -1,
          wednesdayShiftId: -1,
          thursdayShiftId: -1,
          fridayShiftId: -1,
          saturdayShiftId: -1,
          sundayShiftId: -1,
          skipHolidays: false
        },
        dynamicSchedulingBean: {
          id: undefined,
          workShiftIds: '',
          cycleName: '',
          cycleDays: 2,
          schedulingCycles: ''
        },
        freeSchedulingBean: {
          monday: false,
          tuesday: false,
          wednesday: false,
          thursday: false,
          friday: false,
          saturday: false,
          sunday: false,
          beginTime: 0
        }
      },
      attendTypeFormatter: attendTypeFormatter,
      numToChinese: numToChinese
    }
  },
  components: {
    NavBar,
    Field,
    RadioGroup,
    Button,
    'van-row': Row,
    'van-col': Col,
    Radio,
    CheckboxGroup,
    DatetimePicker,
    Checkbox,
    Cell,
    Icon,
    Popup,
    Stepper,
    CellGroup
  },
  methods: {
    onClickLeft () {
      this.$router.push('/attendGroup/')
    },
    closeAdd () {
      this.changeCount = false
    },
    closeTime () {
      this.isShow = false
    },
    closeAdd1 () {
      this.changeCount1 = false
    },
    closeAdd2 () {
      this.changeCount2 = false
    },
    cancelCycle () {
      this.isCycle = false
    },
    setCycle () {
      this.isCycle = true
    },
    selectTime () {
      this.isShow = true
    },
    getValue (value) {
      this.form.beginTime = fontNum(value)
      this.isShow = false
    },
    confirmCycle () {
      if (this.form.cycleName === '') {
        Toast('周期名称不可为空')
      } else {
        this.isCycle = false
        this.form.weekendsDate = this.form.cycleName + ' ' + this.form.valueCount
      }
    },
    checkName () {
      if (this.form.name === '') {
        this.errorInfo = '不可为空'
      } else {
        this.errorInfo = ''
      }
    },
    addCount (item) {
      this.num = ''
      this.num = item - 1
      this.changeCount1 = true
      httpGet(getAIShiftsList, {
        departmentId: this.$store.getters.departmentId
      }).then(res => {
        this.attendFixedInfo1 = res.data
      })
        .catch(() => {})
    },
    // 排班制 - 选择考勤班次
    selectAttendClasses () {
      this.changeCount2 = true
      httpGet(getAIShiftsList, {
        departmentId: this.$store.getters.departmentId
      }).then(res => {
        this.attendFixedInfo2 = res.data
      })
        .catch(() => {})
    },
    saveFixedAdd () {
      this.form.changeTimeCount = this.saveCount.workTimeAt
      this.changeCount = false
    },
    saveFixedAdd1 () {
      this.$refs.refCount[this.num].innerHTML = this.saveCount1.workTimeAt
      this.changeCount1 = false
    },
    saveFixedAdd2 () {
      this.form.attendWorkTimeAt = this.saveCount2.workTimeAt
      this.changeCount2 = false
    },
    showTimeCount () {
      this.changeCount = true
      httpGet(getAIShiftsList, {
        departmentId: this.$store.getters.departmentId
      }).then(res => {
        this.attendFixedInfo = res.data
      })
        .catch(() => {})
    },
    selectPerson () {
      this.isWatchUser = true
      this.form.btnArr = []
      this.array = []
      httpGet(AIDuyCompanyAndAiUser, {
        departmentId: this.$store.getters.departmentId
      }).then(res => {
        console.log(res)
        this.list = res.data.levelDate
      }).catch(() => {})
    },
    cancelSelect () {
      this.isWatchUser = false
    },
    // 保存选择部门以及人员
    savePerson () {
      for (let i = 0; i < this.array.length; i++) {
        this.form.btnArr.push(this.array[i])
        this.form.userNameArr.push(this.array[i].name)
      }
      if (this.array.length > 0) {
        this.isBtn = false
      }
      this.isWatchUser = false
    },
    submitAttend () {
      if (this.form.name === '') {
        Toast('请填写考勤组名称')
      } else if (this.form.btnArr.length === 0) {
        Toast('请选择参与考勤人员')
      } else {
        if (this.form.btnArr && this.form.btnArr.length > 0) {
          this.createLoading = true
          this.form.type = this.form.radio
          this.form = Object.assign(this.form, {departmentId: this.$store.getters.departmentId})
          httpPost(AIAttendGroup, this.form).then((res) => {
            this.createLoading = false
            Toast({
              message: res.message,
              type: 'success',
              duration: 4 * 1000
            })
            this.$router.push('/attendGroup/')
          }).catch(() => {
            this.createLoading = false
          })
        }
      }
    }
  }
}
</script>
<style scoped>
#asd >>> .van-pagination__item--disabled, .van-pagination__item--disabled:active {
  color:rgb(14,105,254)
}
</style>
<style lang="scss" scoped>
.containert{
  width: 100vw;
  height: auto
}
.indexPage{
  text-align:center;
  font-size: 0.9rem;
  border-bottom:1px solid #ebedf0;
  height: 3rem;
  padding-top: 0.6rem;
}
.radioStyle{
  display:inline-block;
  margin-left:1rem;
  line-height:2rem
}
.checkboxStyle{
  display:inline-block;
  margin-left:1rem;
  line-height:2rem
}
.flex-b {
  display: flex;
  justify-content: space-between;
}
.cellright {
  flex: none;
  padding-left: .5rem;
}
</style>

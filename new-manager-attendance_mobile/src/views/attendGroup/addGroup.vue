<template>
    <div class="bgc-grey full-height group-wrap">
        <div>
            <van-field label="考勤组名称" placeholder="请输入名称" v-model.trim="form.name" />
            <van-cell title="参与考勤人员" is-link class="mar-b-15" @click="innerPersonVisible=true"></van-cell>
            <van-cell title="考勤类型" :value="typeVal" class="mar-b-15" v-if="form.id"></van-cell>
            <van-cell title="考勤类型" is-link :value="typeVal" @click="showType = true" class="mar-b-15" v-else></van-cell>
            <template v-if="form.type == 0">
              <van-cell title="考勤时间" is-link @click="showAttendTime = true" ></van-cell>
            </template>
            <template v-if="form.type == 1">
              <van-cell title="考勤班次" is-link @click="showShifts = true" :value="shiftsVal" label="用于排班周期"></van-cell>
              <van-cell title="排班周期" is-link @click="handleShowCycle" ></van-cell>
            </template>
            <template v-if="form.type == 2">
              <van-cell title="设置工作日" is-link @click="showWorkday = true"></van-cell>
              <van-cell title="每天几点开始新一天的考勤" is-link :value="firstBeginTime" @click="showNewTime = true" center></van-cell>
            </template>
        </div>

        <div class="btnbox">
            <van-button type="info" block class="btn" v-if="form.id" @click="updateData" :loading="updateLoading">保存</van-button>
            <van-button type="info" block class="btn" @click="createData" :loading="createLoading" v-else>保存</van-button>
        </div>

        <van-popup v-model="showType" position="bottom" safe-area-inset-bottom>
          <div class="popup-type bgc-grey">
            <van-radio-group v-model="form.type">
              <van-cell-group class="bgc-grey">
                <van-cell :title="item.title" @click="handleRadioType(item.name, item.title)" class="mar-b-10" v-for="(item, index) in radioTypeData" :key="index">
                  <van-radio slot="right-icon" :name="item.name" />
                  <template slot="label">
                    <p>说明：{{item.text1}}</p>
                    <p>适用：{{item.text2}}</p>
                  </template>
                </van-cell>
              </van-cell-group>
            </van-radio-group>
          </div>
        </van-popup>
        <!-- 考勤时间 -->
        <van-popup v-model="showAttendTime" position="right" class="attendtime-box bgc-grey">
          <!-- 原始 :value="attendTime.quickVal?attendTime.quickVal:'请选择'" -->
          <van-cell title="快捷设置全部班次" is-link @click="setShiftsRadio('quick')" class="fc-grey bgc-grey quick" :value="attendTime.quickVal?attendTime.quickVal:'请选择'" ></van-cell>
          <van-cell title="星期一"></van-cell>
          <van-cell title="班次(考勤时段)" is-link class="mar-b-10" @click="setShiftsRadio('Mon')" :value="attendTime.Mon" ></van-cell>
          <van-cell title="星期二" ></van-cell>
          <van-cell title="班次(考勤时段)" is-link @click="setShiftsRadio('Tues')" :value="attendTime.Tues" class="mar-b-10" ></van-cell>
          <van-cell title="星期三" ></van-cell>
          <van-cell title="班次(考勤时段)" is-link @click="setShiftsRadio('Wed')" :value="attendTime.Wed" class="mar-b-10" ></van-cell>
          <van-cell title="星期四" ></van-cell>
          <van-cell title="班次(考勤时段)" is-link @click="setShiftsRadio('Thur')" :value="attendTime.Thur" class="mar-b-10" ></van-cell>
          <van-cell title="星期五" ></van-cell>
          <van-cell title="班次(考勤时段)" is-link @click="setShiftsRadio('Fri')" :value="attendTime.Fri" class="mar-b-10" ></van-cell>
          <van-cell title="星期六" ></van-cell>
          <van-cell title="班次(考勤时段)" is-link @click="setShiftsRadio('Sat')" :value="attendTime.Sat" class="mar-b-10" ></van-cell>
          <van-cell title="星期日" ></van-cell>
          <van-cell title="班次(考勤时段)" is-link @click="setShiftsRadio('Sun')" :value="attendTime.Sun" ></van-cell>
          <div class="btnbox ">
              <van-button type="info" block class="btn" @click="handleAttendTime">确定</van-button>
          </div>
        </van-popup>
        <!-- 选择考勤班次 复选 -->
        <van-popup v-model="showShifts" position="bottom" safe-area-inset-bottom>
          <div class="shifts-type bgc-grey">
            <p class="fc-grey text-c" v-if="shiftsData.length==0">请先创建考勤班次</p>
            <van-checkbox-group v-model="checkboxShifts" @change="handleCheckboxShifts">
              <van-cell-group class="bgc-grey">
                <van-cell v-for="(item, index) in shiftsData" :key="index" :class="shiftsData.length==index+1?'':'mar-b-10'" @click="toggleShifts(index)">
                  <p>班次名称：{{item.name}}</p>
                  <p>考勤时间：{{item.workTimeAt}}</p>
                  <van-checkbox ref="checkboxesShifts" slot="right-icon" :name="item.id" shape="square" />
                </van-cell>
              </van-cell-group>
            </van-checkbox-group>
          </div>
        </van-popup>
        <!-- 选择考勤班次 单选 -->
        <van-popup v-model="showShiftsRadio" position="bottom" safe-area-inset-bottom>
          <div class="shifts-type bgc-grey">
            <!-- computedAttendTime.getCurrents -->
            <p class="fc-grey text-c" v-if="shiftsData.length==0">请先创建考勤班次</p>
            <!-- v-model="radioShifts" -->
            <van-radio-group v-model="radioShifts">
              <van-cell-group class="bgc-grey">
                <van-cell v-for="(item, index) in shiftsData" :key="index" :class="shiftsData.length==index+1?'':'mar-b-10'" @click="handleRadioShifts(item.id)">
                  <p>班次名称：{{item.name}}</p>
                  <p>考勤时间：{{item.workTimeAt}}</p>
                  <van-radio slot="right-icon" ref="radios"   :name="item.id">
                      <!-- <template  slot="icon" :slot-scope="item.checked">
                       <img class="img-icon" :src="item.checked ? checkedIcon : uncheckedIcon" />
                    </template> -->
                  </van-radio>
                </van-cell>
              </van-cell-group>
            </van-radio-group>
          </div>
          <!-- 新增 -->
            <div class="btnbox new-add">
              <van-button type="info" block @click="userConfirmData()" class="btn user-confirm-btn">确定</van-button>
            </div>
        </van-popup>
        <!-- 选择考勤班次 排班周期 -->
        <van-popup v-model="showShiftsCycle" position="bottom" safe-area-inset-bottom>
          <div class="shifts-type bgc-grey">
            <p class="fc-grey text-c" v-if="resCheckboxShifts.length==0">请先选择考勤班次</p>
            <van-radio-group v-model="radioShiftsCycle" v-else>
              <van-cell-group class="bgc-grey">
                <van-cell v-for="(item, index) in resCheckboxShifts" :key="index" :class="resCheckboxShifts.length==index+1?'':'mar-b-10'" @click="handleShiftsCycle(item.id)">
                  <p>班次名称：{{item.name}}</p>
                  <p>考勤时间：{{item.workTimeAt}}</p>
                  <van-radio slot="right-icon" :name="item.id" />
                </van-cell>
              </van-cell-group>
            </van-radio-group>
          </div>
        </van-popup>
        <!-- 排班周期 -->
        <van-popup v-model="showCycle" position="right" class="cyclebox">
            <div class="quick fc-grey">
              适用于规律性排班，如：<span class="fc-blue">做一休一</span>、<span class="fc-blue">三班制</span>、<span class="fc-blue">两班轮换</span>
            </div>
            <van-field label="周期名称" placeholder="请输入名称" class="mar-b-15" v-model.trim="form.dynamicSchedulingBean.cycleName"/>
            <van-cell title="每个周期天数" class="mar-b-15" >
              <van-stepper v-model="form.dynamicSchedulingBean.cycleDays" integer @change="changeCycleDay" />
            </van-cell>
            <template v-for="(item, index) in cyclesModel" >
              <van-cell :title="`第${index+1}天`" is-link @click="setShiftsCycle(index)" :key="index" :value="item.value" ></van-cell>
            </template>
            <div class="btnbox">
                <van-button type="info" block class="btn" @click="handleConfirmCycle">确定</van-button>
            </div>
        </van-popup>
        <!-- 设置工作日 -->
        <van-popup v-model="showWorkday" position="bottom" class="workdaybox" safe-area-inset-bottom>
            <van-checkbox class="item" v-model="form.freeSchedulingBean.monday">周一</van-checkbox>
            <van-checkbox class="item" v-model="form.freeSchedulingBean.tuesday">周二</van-checkbox>
            <van-checkbox class="item" v-model="form.freeSchedulingBean.wednesday">周三</van-checkbox>
            <van-checkbox class="item" v-model="form.freeSchedulingBean.thursday">周四</van-checkbox>
            <van-checkbox class="item" v-model="form.freeSchedulingBean.friday">周五</van-checkbox>
            <van-checkbox class="item" v-model="form.freeSchedulingBean.saturday">周六</van-checkbox>
            <van-checkbox class="item" v-model="form.freeSchedulingBean.sunday">周日</van-checkbox>
        </van-popup>
        <!-- 每天几点开始新一天的考勤 -->
        <van-popup v-model="showNewTime" position="bottom" safe-area-inset-bottom>
            <van-datetime-picker
            v-model="firstBeginTime"
            type="time"
            :show-toolbar="false"
            />
        </van-popup>
        <!-- 参与考勤人员 -->
        <van-popup v-model="innerPersonVisible" class="personbox">
          <van-cell title="选择部门与人员" :border="false" ></van-cell>
          <div class="treebox">
            <el-tree
            ref="tree"
            :data="treeData"
            :props="defaultProps"
            show-checkbox
            node-key="id"
            accordion
            :default-checked-keys="defaultCheckedKeys"
            :default-expanded-keys="defaultExpandedKeys"
            :load="loadNode" lazy>
              <template slot-scope="{ node }">
                {{node.label}}
              </template>
            </el-tree>
          </div>
          <div class="btnbox">
              <van-button type="info" block class="btn" @click="savePerson">确定</van-button>
          </div>
        </van-popup>

    </div>
</template>

<script>
import { CheckboxGroup, Stepper, RadioGroup, Radio, Checkbox, DatetimePicker } from 'vant'
import { HHssFormatter, NumToHHssFormatter } from '@/utils/formatter.js'
import { AIDuyCompanyAndAiUser, AIAttendGroupDetail, AIAttendGroup, getAIShiftsList } from '@/api/url'
import { Session } from '@/utils/storage'

import checkedIcon from '@/assets/icon/checked.png'
import uncheckedIcon from '@/assets/icon/unchecked.png'
// 引入本地存储
import {getLocalStorage, setLocalStorage} from '@/utils/localStore'

export default {
  components: {
    'van-checkbox-group': CheckboxGroup,
    'van-checkbox': Checkbox,
    'van-stepper': Stepper,
    'van-radio-group': RadioGroup,
    'van-radio': Radio,
    [DatetimePicker.name]: DatetimePicker
  },
  data () {
    return {
      checkedIcon,
      uncheckedIcon,
      createLoading: false,
      updateLoading: false,
      showType: false,
      typeVal: '固定班制',
      radioTypeData: [
        {
          name: 0,
          title: '固定班制',
          text1: '所有人按照相同的时间打卡',
          text2: '办公室等'
        }, {
          name: 1,
          title: '排班制',
          text1: '不同人员根据各自排班打卡',
          text2: '工厂、门店等'
        }, {
          name: 2,
          title: '自由时间制',
          text1: '上下班时间不固定，可随时打卡',
          text2: '销售、计时工等'
        }
      ],
      // 参与考勤人员
      innerPersonVisible: false,
      // 树
      checkedId: 0,
      treeData: [
        // {id: 455, name: 'zz', dcCode: '1615-', account: false, dutyCompanyId: null, checkType: null}
      ],
      defaultCheckedKeys: [],
      defaultExpandedKeys: [],
      defaultProps: {
        children: 'childrens',
        label: 'name',
        isLeaf: 'account'
      },
      // 考勤班次 从本地中获取
      shiftsData: [],
      // 自由时间制
      showWorkday: false,
      firstBeginTime: '00:00',
      showNewTime: false,
      // 排班制
      showShifts: false,
      checkboxShifts: [],
      shiftsVal: '',
      showCycle: false,
      cyclesModel: [],
      TypeShiftsCycle: '',
      radioShiftsCycle: '',
      resCheckboxShifts: [],
      cycleName: '',
      // 固定班制
      radioShifts: '',
      showShiftsRadio: false,
      showAttendTime: false,
      TypeShiftsRadio: '',
      showShiftsCycle: false,
      attendTime: {
        quickVal: undefined,
        Mon: undefined,
        Tues: undefined,
        Wed: undefined,
        Thur: undefined,
        Fri: undefined,
        Sat: undefined,
        Sun: undefined
      },
      form: {
        id: this.$route.query.id,
        name: '',
        type: 0,
        // 人员
        aiUserBeans: {
          aiUsers: [],
          noAiUsers: []
        },
        // 固定班制
        fixedSchedulingBean: {
          mondayShiftId: undefined,
          tuesdayShiftId: undefined,
          wednesdayShiftId: undefined,
          thursdayShiftId: undefined,
          fridayShiftId: undefined,
          saturdayShiftId: undefined,
          sundayShiftId: undefined
          // skipHolidays: false
        },
        // 排班制
        dynamicSchedulingBean: {
          id: undefined,
          workShiftIds: '',
          cycleName: '',
          cycleDays: 2,
          schedulingCycles: ''
        },
        // 自由时间制
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
      saveUserAttendanceAdmin: getLocalStorage('saveUserAttendanceAdmin')
    }
  },
  async created () {
    await this.getWorkShiftList()
    if (this.$route.query.id) {
      await this.getUpdate()
    }
  },
  methods: {
    /** ********  【 请求用户班次数据 】  **********/
    getWorkShiftList () {
      let _this = this
      this.$http.get(getAIShiftsList, {params: {departmentId: this.$store.getters.departmentId}}).then(res => {
        if (res.data) {
          _this.shiftsData = res.data
          // console.log('班次。。。 ', res.data)
          _this.removeLocal(_this.shiftsData)
          if (!Session.get('isShiftList')) {
            if (res.data.length <= 1) {
              this.$nextTick(() => {
                this.$dialog.confirm({
                  closeOnPopstate: true,
                  message: '您还未添加班次，建议先添加班次',
                  confirmButtonText: '前往'
                  // cancelButtonText: '返回'
                }).then(() => {
                  this.$router.push('/shifts/')
                }).catch(() => { Session.set('isShiftList', 1) })
              })
            }
          }
        }
      }).catch((err) => {
        console.log('考勤班次请求超时。。。', err)
      })
    },
    getUpdate () {
      const ToastLoading = this.$toast.loading({ mask: true, message: '加载中...', position: 'middle', duration: 0 })
      const query = {
        departmentId: this.$store.getters.departmentId,
        workCheckGroupId: this.$route.query.id
      }
      this.$http.get(AIAttendGroupDetail, {params: query}).then(res => {
        ToastLoading.clear()
        // 有些对象返回null导致报错,
        if (!res.data.aiUserBeans) res.data.aiUserBeans = {}
        if (!res.data.fixedSchedulingBean) res.data.fixedSchedulingBean = {}
        if (!res.data.dynamicSchedulingBean) res.data.dynamicSchedulingBean = {}
        if (!res.data.freeSchedulingBean) res.data.freeSchedulingBean = {}
        this.form = Object.assign({}, res.data)
        // 考勤类型赋值
        for (const v of this.radioTypeData) {
          if (v.name === res.data.type) {
            this.typeVal = v.title
          }
        }
        if (res.data.type === 0) {
          // this.shiftsData
          for (const v of this.shiftsData) {
            if (v.id === res.data.fixedSchedulingBean.mondayShiftId) this.attendTime.Mon = v.name
            if (v.id === res.data.fixedSchedulingBean.tuesdayShiftId) this.attendTime.Tues = v.name
            if (v.id === res.data.fixedSchedulingBean.wednesdayShiftId) this.attendTime.Wed = v.name
            if (v.id === res.data.fixedSchedulingBean.thursdayShiftId) this.attendTime.Thur = v.name
            if (v.id === res.data.fixedSchedulingBean.fridayShiftId) this.attendTime.Fri = v.name
            if (v.id === res.data.fixedSchedulingBean.saturdayShiftId) this.attendTime.Sat = v.name
            if (v.id === res.data.fixedSchedulingBean.sundayShiftId) this.attendTime.Sun = v.name
          }
        }
        if (res.data.type === 1) {
          const workShiftIds = JSON.parse(res.data.dynamicSchedulingBean.workShiftIds)
          this.checkboxShifts = workShiftIds
          this.handleCheckboxShifts(workShiftIds)

          const schedulingCycles = JSON.parse(res.data.dynamicSchedulingBean.schedulingCycles)
          for (const v of schedulingCycles) {
            // this.shiftsData
            for (const v2 of this.shiftsData) {
              if (v === v2.id) {
                this.cyclesModel.push({
                  id: v,
                  value: v2.name
                })
              }
            }
          }
        }
        if (res.data.type === 2) {
          this.firstBeginTime = NumToHHssFormatter(res.data.freeSchedulingBean.beginTime)
        }
      }).catch(() => { ToastLoading.clear() })
    },
    createData () {
      if (this.form.name === '') {
        this.$toast.fail('考勤组名称不能为空')
        return
      }
      this.form.freeSchedulingBean.beginTime = HHssFormatter(this.firstBeginTime)
      this.form.dynamicSchedulingBean.workShiftIds = JSON.stringify(this.checkboxShifts)
      this.form.departmentId = this.$store.getters.departmentId
      // console.log(this.form, 'createData')
      this.createLoading = true
      this.$http.post(AIAttendGroup, this.form).then(res => {
        this.createLoading = false
        this.$dialog.alert({
          closeOnPopstate: true,
          message: '添加成功'
        }).then(() => {
          history.go(-1)
        })
      }).catch(() => { this.createLoading = false })
    },
    updateData () {
      if (this.form.name === '') {
        this.$toast.fail('考勤组名称不能为空')
        return
      }
      this.form.freeSchedulingBean.beginTime = HHssFormatter(this.firstBeginTime)
      this.form.dynamicSchedulingBean.workShiftIds = JSON.stringify(this.checkboxShifts)
      // console.log(this.form, 'updateData')
      this.updateLoading = true
      this.$http.post(AIAttendGroup, this.form).then(res => {
        this.updateLoading = false
        this.$dialog({ closeOnPopstate: true, message: res.message }).then(() => { history.go(-1) })
      }).catch(() => { this.updateLoading = false })
    },
    handleRadioType (radioType, title) {
      this.form.type = radioType
      this.typeVal = title
      this.showType = false
    },
    toggleShifts (index) {
      this.$refs.checkboxesShifts[index].toggle()
    },
    // 设置班次 单选
    setShiftsRadio (type) {
      this.radioShifts = ''
      this.TypeShiftsRadio = type
      this.showShiftsRadio = true
    },
    handleRadioShifts (value) {
      this.radioShifts = value

      // 根据type动态赋值
      const type = this.TypeShiftsRadio
      let val
      for (const v of this.shiftsData) {
        if (v.id === value) val = v.name
      }
      // console.log('sssssss', this.form)
      if (type === 'Mon') {
        this.attendTime.Mon = val
        this.form.fixedSchedulingBean.mondayShiftId = value
      }
      if (type === 'Tues') {
        this.attendTime.Tues = val
        this.form.fixedSchedulingBean.tuesdayShiftId = value
      }
      if (type === 'Wed') {
        this.attendTime.Wed = val
        this.form.fixedSchedulingBean.wednesdayShiftId = value
      }
      if (type === 'Thur') {
        this.attendTime.Thur = val
        this.form.fixedSchedulingBean.thursdayShiftId = value
      }
      if (type === 'Fri') {
        this.attendTime.Fri = val
        this.form.fixedSchedulingBean.fridayShiftId = value
      }
      if (type === 'Sat') {
        this.attendTime.Sat = val
        this.form.fixedSchedulingBean.saturdayShiftId = value
      }
      if (type === 'Sun') {
        this.attendTime.Sun = val
        this.form.fixedSchedulingBean.sundayShiftId = value
      }
      if (type === 'quick') {
        this.attendTime.quickVal = val
        this.attendTime.Mon = val
        this.attendTime.Tues = val
        this.attendTime.Wed = val
        this.attendTime.Thur = val
        this.attendTime.Fri = val
        this.attendTime.Sat = val
        this.attendTime.Sun = val
        this.form.fixedSchedulingBean.mondayShiftId = value
        this.form.fixedSchedulingBean.tuesdayShiftId = value
        this.form.fixedSchedulingBean.wednesdayShiftId = value
        this.form.fixedSchedulingBean.thursdayShiftId = value
        this.form.fixedSchedulingBean.fridayShiftId = value
        this.form.fixedSchedulingBean.saturdayShiftId = value
        this.form.fixedSchedulingBean.sundayShiftId = value
      }
      // 原始
      // this.showShiftsRadio = false
    },
    handleAttendTime () {
      this.showAttendTime = false
    },
    // 设置班次 多选
    handleCheckboxShifts (value) {
      let arr = []
      for (const v of value) {
        for (const v2 of this.shiftsData) {
          if (v === v2.id) {
            arr.push(v2)
          }
        }
      }
      this.resCheckboxShifts = arr
    },
    // 排班周期
    handleShowCycle () {
      this.changeCycleDay()
      this.showCycle = true
    },
    handleConfirmCycle () {
      let array = []
      for (const v of this.cyclesModel) {
        array.push(v.id)
      }
      this.form.dynamicSchedulingBean.schedulingCycles = JSON.stringify(array)
      if (this.form.dynamicSchedulingBean.cycleName === '') {
        this.$toast.fail('请输入周期名称')
        return
      }
      this.showCycle = false
    },
    changeCycleDay (val) {
      const days = this.form.dynamicSchedulingBean.cycleDays
      const oldarr = this.cyclesModel
      let newarr = []
      for (let i = 0; i < days; i++) {
        if (oldarr.length > i) {
          newarr.push(oldarr[i])
        } else {
          newarr.push({
            id: null,
            value: ''
          })
        }
      }
      this.cyclesModel = newarr
    },
    setShiftsCycle (i) {
      this.radioShiftsCycle = ''
      this.TypeShiftsCycle = i
      this.showShiftsCycle = true
    },
    handleShiftsCycle (id) {
      this.radioShiftsCycle = id
      // 根据index动态赋值
      const index = this.TypeShiftsCycle
      let val = ''
      for (const v of this.resCheckboxShifts) {
        if (v.id === id) val = v.name
      }
      this.cyclesModel.splice(index, 1, {id, value: val})
      this.showShiftsCycle = false
    },
    // 树
    loadNode (node, resolve) {
      if (node.level === 0) {
        const query = {
          departmentId: this.$store.getters.departmentId,
          workCheckGroupId: this.form.id
        }
        this.$http.get(AIDuyCompanyAndAiUser, {params: query}).then(res => {
          this.checkedId = res.data.levelDate[0].dcCode + res.data.levelDate[0].id + '-'
          this.defaultCheckedKeys = []
          for (let i = 0; i < res.data.levelDate.length; i++) {
            if (res.data.levelDate[i].checkType === 0) {
              this.defaultCheckedKeys.push(res.data.levelDate[i].id)
            } else if (res.data.levelDate[i].checkType === 1) {
              // this.defaultCheckedKeys.push(res.data.levelDate[i].id)
              this.defaultExpandedKeys.push(res.data.levelDate[i].id)
              // this.$refs.tree.setHalfCheckedNodes(res.data.levelDate[i].id)
            }
          }
          // this.defaultCheckedKeys = res.data.selectDate !== null ? res.data.selectDate : []
          setTimeout(() => {
            resolve(res.data.levelDate)
          }, 500)
        }).catch(() => {})
      } else {
        const query = {
          dcCode: node.data.dcCode + node.data.id + '-',
          departmentId: this.$store.getters.departmentId,
          workCheckGroupId: this.form.id
        }
        this.$http.get(AIDuyCompanyAndAiUser, {params: query}).then(res => {
          if (res.data !== null) {
            for (let i = 0; i < res.data.levelDate.length; i++) {
              if (res.data.levelDate[i].checkType === 0) {
                this.defaultCheckedKeys.push(res.data.levelDate[i].id)
              }
            }
            // this.defaultCheckedKeys.push(res.data.selectDate !== null ? res.data.selectDate : [])
            if (node.data.id === parseInt(this.$store.getters.departmentId)) {
              res.data.push({
                dcCode: '-0',
                id: '',
                name: '未分配部门用户'
              })
              setTimeout(() => {
                resolve(res.data.levelDate)
              }, 500)
            } else {
              setTimeout(() => {
                resolve(res.data.levelDate)
              }, 500)
            }
          } else {
            resolve([])
          }
        }).catch(() => {})
      }
    },
    savePerson () {
      let array = []
      let checkedNodes = this.$refs.tree.getCheckedNodes()
      let halfCheckedNodes = this.$refs.tree.getHalfCheckedNodes()
      this.checkedNodes = checkedNodes
      // 全选
      for (let i = 0; i < checkedNodes.length; i++) {
        checkedNodes[i].checkType = 0
        array.push(checkedNodes[i])
      }
      // 半选
      for (let i = 0; i < halfCheckedNodes.length; i++) {
        halfCheckedNodes[i].checkType = 1
        array.push(halfCheckedNodes[i])
      }
      this.form.aiUserBeans = {}
      this.form.aiUserBeans.aiUsers = array
      this.innerPersonVisible = false
    },
    /** ********  [ 用户确定并且 实现本地存储 ]  **********/
    userConfirmData () {
      // console.log('用户已经确定。。1。')
      // 获取新对象
      let newObj = {[this.TypeShiftsRadio]: this.radioShifts}
      // 本地合并新对象
      this.saveUserAttendanceAdmin = Object.assign({}, this.saveUserAttendanceAdmin, newObj)
      // 存储用户考勤管理列表
      setLocalStorage('saveUserAttendanceAdmin', this.saveUserAttendanceAdmin)
      // 存储用户考勤时间管理数据
      setLocalStorage('saveUserAttendTime', this.attendTime)

      this.showShiftsRadio = false
    },
    // 检测请求数据是否与本地匹配，不匹配进行删除
    removeLocal (data) {
      let newObj = {} // 用于存储新的数据
      let getSaveUserAttendTime = getLocalStorage('saveUserAttendTime')
      for (const key in getSaveUserAttendTime) {
        if (getSaveUserAttendTime.hasOwnProperty(key)) {
          data.map(item => {
            if (getSaveUserAttendTime[key] === item.name) {
              newObj[key] = item.name
            }
          })
        }
      }
      // 把新的数据存储在本地
      setLocalStorage('saveUserAttendTime', newObj)
    }
  },
  beforeRouteLeave (to, from, next) {
    if (this.showCycle || this.showAttendTime) {
      this.showCycle = false
      this.showAttendTime = false
      next(false)
    } else {
      next()
    }
  },
  watch: {
    /** ********  【 监听单选框显示隐藏 】  **********/
    showShiftsRadio (state) {
      if (state) {
        // 判断本地属性是否含有匹配当前的属性
        if (this.saveUserAttendanceAdmin[this.TypeShiftsRadio]) {
          this.radioShifts = this.saveUserAttendanceAdmin[this.TypeShiftsRadio]
        }
      } else {
        // 隐藏后将属性制空
        this.radioShifts = ''
      }
    },
    /** ********  【 监听考勤时间列表显示隐藏 】  **********/
    showAttendTime (state) {
      if (state) {
        // 获取本地考勤时间表数据
        let getSaveAttendTime = getLocalStorage('saveUserAttendTime')
        // 判断是否含有属性与当前属性匹配
        if (getSaveAttendTime && (getSaveAttendTime.length !== 0 && getSaveAttendTime !== {})) {
          this.attendTime = getSaveAttendTime
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>

.workdaybox {
  padding-left: 15px;
  .item {
    height: 40px;
    line-height: 40px;
  }
}
.attendtime-box {
  width: 100%;
  min-height: 100vh;
  // .quick {
  //   padding-top: 35px;
  // }
}
.popup-type {
  padding: 15px;
}
.shifts-type {
  padding: 15px;
}
.cyclebox {
  width: 100%;
  min-height: 100vh;
  background-color: #f6f6f6;
  .quick {
    // padding: 35px 15px 10px;
    padding: 15px;
  }
}
.personbox {
  width: 80%;
  font-size: 14px;
  box-sizing: border-box;
  top: 30%;
  .treebox {
    max-height: 250px;
    overflow: auto;
    // padding: 15px;
  }
  /deep/ .el-tree-node__content,
  /deep/ .el-tree-node__children {
    padding-bottom: 10px;
  }
}

.btnbox {
  padding: 15px;
  width: 100%;
  box-sizing: border-box;
  background: #fff;
    .btn {
        border-radius: 5px;
        overflow: hidden;
    }
}

.btnbox.new-add{
  position: fixed;
  left: 0;
  bottom: 0;
  transition: 0.35s all;
}
.van-radio-group {
  padding-bottom: 1.17333rem + 0.8rem;
  width: 100%;
  height: 200%;
}
</style>

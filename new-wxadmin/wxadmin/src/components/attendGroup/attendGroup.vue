<template>
  <div class="groupbox">
    <NavBar
      title="考勤组管理"
      left-text="返回"
      right-text="添加"
      left-arrow
      @click-left="onClickLeft"
      @click-right="onClickRight"
      />
      <van-tabs v-model="active" @click="clickTab">
        <van-tab title="班次管理"></van-tab>
        <van-tab title="考勤组管理"></van-tab>
      </van-tabs>
       <div>
        <!-- <van-row>
          <van-col span="6" class="listCss">名称</van-col>
          <van-col span="6" class="listCss">人数</van-col>
          <van-col span="6" class="listCss">类型</van-col>
          <van-col span="6" class="listCss">操作</van-col>
        </van-row>
        <PullRefresh v-model="isLoading" @refresh="onRefresh">
        <van-row v-for="(item, index) in tableData" :key=index>
          <van-col span="6" class="indexPage">{{item.name}}</van-col>
          <van-col span="6" class="indexPage">{{item.userNum + '人'}}</van-col>
          <van-col span="6" class="indexPage">{{attendTypeFormatter(item.type)}}</van-col>
          <van-col span="6" class="indexPage"><Button type="info" plain size="small" @click="edit(item)">编辑</Button></van-col>
        </van-row>
        <van-row v-show="isHasData">
          <van-col span="24" class="notData">暂无数据</van-col>
        </van-row>
        </PullRefresh> -->
        <PullRefresh v-model="isLoading" @refresh="onRefresh">
          <div v-show="tableData.length>0" style="width:100vw;margin:0.5rem 0 0 0vw;min-height:60vh">
            <div v-for="(item, index) in tableData" :key="index">
              <CellGroup style="margin-bottom: 1rem;">
                <Cell title="名称" :value="item.name"/>
                <Cell title="人数" :value="item.userNum+'人'"/>
                <Cell title="类型" :value="attendTypeFormatter(item.type)"/>
                <span style="display:block;line-height:2.5rem;color:#1E90FF;margin-left:86%;" @click="edit(item)">编辑</span>
              </CellGroup>
            </div>
          </div>
        </PullRefresh>
        <div style="width:100%;height:22rem;margin-top:2rem;text-align:center" v-if="total == ''">
            <img src='@/assets/noData (2).png' style="max-width: 300px;max-height: 300px;"/>
          </div>
        <div id="asd" v-show="tableData.length>0">
          <Pagination
            v-model="listQuery.offset"
            :page-count="Math.ceil(total/10)"
            :total-items = 'total'
            mode="simple"
            @change="seePage"
          >
          </Pagination>
        </div>
        <Popup v-model="show" position="bottom">
          <Button size="large" v-if="share.includes('编辑')" @click="editContent">编辑</Button>
          <Button size="large" v-if="share.includes('删除')" @click="delAttend">删除</Button>
          <Button size="large" v-if="share.includes('编辑排班') && isShow" @click="arrange">编辑排班</Button>
          <Button size="large" @click="closeWindows">取消</Button>
        </Popup>
        <!-- 固定班制编辑 -->
          <Popup v-model="isFixed" style="width:94vw;height:90vh;border:1px solid #ccc" :close-on-click-overlay="false">
            <div>
              <Cell title="编辑" style="line-height:1rem">
                <Icon slot="right-icon" name="cross" class="custom-icon" @click="closeFixed"/>
              </Cell>
              <Field
                label="考勤组名称"
                v-model="form.name"
                style="line-height:1rem"
                placeholder="请输入"
              />
              <Field
                label="参与考勤人员"
                ref="user"
                style="line-height:1rem"
                @focus="selectFixedPerson"
              >
              <Button slot="button" size="mini" v-if="isBtn1" style="border:none;margin-right:7.5rem" @click="selectFixedPerson">请选择</Button>
              <Button slot="button" @click="selectFixedPerson" type="info" size="small" v-for="(item, index) in resultArr" :key=index>{{item.name}}</Button>
              </Field>
               <!-- 固定班制 选择部门与人员 -->
              <Popup v-model="isFixedUser" style="width:88vw;height:74vh;" get-container=".groupbox">
                <Cell title="选择部门与人员" style="font-size:1rem">
                  <Icon slot="right-icon" name="cross" class="custom-icon" @click="cancelFixedEdit"/>
                </Cell>
                <CheckboxGroup v-model="resultArr">
                  <Checkbox
                    style="line-height:2rem;font-size:1rem;margin:1rem"
                    v-for="(item, index) in listUser"
                    :key=index
                    :name="item"
                  >
                  {{ item.name }}
                </Checkbox>
                </CheckboxGroup>
                <div style="line-height:4rem;display:flex;justify-content:space-around;padding-bottom:1rem">
                  <Button size="small" style="font-size:1rem" @click="cancelFixedEdit">取消</Button>
                  <Button type="info" style="font-size:1rem" size="small" @click="saveFixedUser">保存</Button>
                </div>
              </Popup>
               <div v-show="diff === 2">
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
                />
                <DatetimePicker
                  v-show="isShow1"
                  v-model="currentTime"
                  @cancel="closeTime"
                  @confirm="getValue"
                  type="time"
                  style="width:60vw;margin-left:20vw"
                />
              </div>
              <div v-show="diff === 0">
                <Field
                  label="工作日班次"
                  placeholder="更换班次"
                  v-model="attendFixedWorkTimeAt"
                  @click="selectFixedCount"
                  style="margin-bottom:0.;line-height:1rem"
                />
                <CheckboxGroup v-model="arrayCheck">
                  <van-row>
                    <van-col span="4" class="listCss">选项</van-col>
                    <van-col span="5" class="listCss">工作日</van-col>
                    <van-col span="10" class="listCss">班次时间段</van-col>
                    <van-col span="5" class="listCss">操作</van-col>
                  </van-row>
                  <van-row v-for="(item, index) in 7" :key=index>
                    <van-col span="4" class="listCss1"><Checkbox :name=item></Checkbox></van-col>
                    <van-col span="5" class="listCss1">星期{{numToChinese(item)}}</van-col>
                    <van-col span="10" class="listCss1"><span ref='refCount'>休息</span></van-col>
                    <van-col span="5" class="listCss1"><span style="color:#1E90ff" @click="addCount(item)">修改班次</span></van-col>
                  </van-row>
                </CheckboxGroup>
              </div>
              <!-- 修改班次 -->
               <Popup v-model="amendFixedCount" style="width:73vw;height:75vh;" get-container=".groupbox">
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
                    <div style="line-height:4rem">
                      <Button size="small" style="width:60vw;margin-top:2rem;margin-left:7.5vw;line-height:1rem;height:2.5rem;" @click="closeAdd">取消</Button>
                      <Button type="info" style="width:60vw;margin-left:7.5vw;line-height:1rem;height:2.5rem;" size="small" @click="saveFixedAdd">确定</Button>
                    </div>
                  </div>
                </Popup>
              <div>
                  <Button class="adapt" style="margin-top:1.5rem" @click="closeFixed">取消</Button>
                  <Button type="info" class="adapt" :isLoading="saveLoading" @click="loadContent">保存</Button>
                </div>
              <!-- 固定班次 -->
                <Popup v-model="attendFixedCount" style="width:88vw;max-height:25rem;" position=top get-container=".groupbox">
                  <div>
                    <Cell title="选择班次" style="font-size:1rem">
                      <Icon slot="right-icon" name="cross" class="custom-icon" @click="cancelFixedCount" />
                    </Cell>
                    <!-- <van-row>
                      <van-col span="4" class="indexPage">选项</van-col>
                      <van-col span="7" class="indexPage">名称</van-col>
                      <van-col span="13" class="indexPage">考勤时间</van-col>
                    </van-row>
                    <RadioGroup  v-model="classCount">
                    <van-row v-for="(item, index) in attendFixedInfo" :key=index>
                      <van-col span="4" class="indexPage"><Radio :name=item></Radio></van-col>
                      <van-col span="7" class="indexPage">{{item.name}}</van-col>
                      <van-col span="13" class="indexPage">{{item.workTimeAt}}</van-col>
                    </van-row>
                    </RadioGroup> -->
                    <RadioGroup v-model="classCount" style="margin-bottom:3rem;">
                      <CellGroup v-for="(item, index) in attendFixedInfo" :key=index>
                        <Cell center clickable @click="classCount = item" value-class="cellright">
                          <template slot="title">
                            <div class="flex-b"><span>名称</span><span>{{item.name}}</span></div>
                            <div class="flex-b"><span>考勤时间</span><span>{{item.workTimeAt}}</span></div>
                          </template>
                          <Radio :name="item"></Radio>
                        </Cell>
                      </CellGroup>
                    </RadioGroup>
                    <div style="margin-bottom:1rem">
                      <Button class="btn12" @click="cancelFixedCount">取消</Button>
                      <Button type="info" class="btn12" style="margin-top:1rem" @click="saveFixedAttend">确定</Button>
                    </div>
                  </div>
                </Popup>
            </div>
          </Popup>
        <!-- 排班制编辑 -->
        <Popup v-model="isArrange" style="width:94vw;max-height:78vh;border:1px solid #ccc" :close-on-click-overlay="false">
          <Cell title="编辑">
            <Icon slot="right-icon" name="cross" class="custom-icon" @click="cancelEdit"/>
          </Cell>
          <Field
          label="考勤组名称"
          v-model="form.name"
          placeholder="请输入"
          />
          <Field
            label="参与考勤人员"
            ref="usered"
            @focus="selectPerson"
            >
            <Button slot="button" size="small" v-if="isBtn" style="border:none;margin-right:7.5rem" @click="selectPerson">请选择</Button>
            <Button slot="button" @click="selectPerson" type="info" size="small" v-for="(item, index) in result" :key=index>{{item.name}}</Button>
          </Field>
          <!-- 选择部门与人员 -->
          <Popup v-model="isWatchUser" style="width:88vw;height:28rem;" position=top get-container=".groupbox">
            <Cell title="选择部门与人员" style="font-size:1rem">
              <Icon slot="right-icon" name="cross" class="custom-icon" @click="cancelSelect" />
            </Cell>
            <CheckboxGroup v-model="result">
              <Checkbox
                style="line-height:2rem;font-size:1rem;margin:0.6rem"
                v-for="(item, index) in list"
                :key=index
                :name="item"
              >
               {{ item.name }}
             </Checkbox>
            </CheckboxGroup>
            <div style="line-height:5rem;display:flex;justify-content:space-around;">
              <Button size="small" style="font-size:1rem" @click="cancelSelect">取消</Button>
              <Button type="info" @click="savePerson" style="font-size:1rem" size="small">保存</Button>
             </div>
          </Popup>
          <Field
            label="考勤班次"
            placeholder="选择班次"
            v-model="attendWorkTimeAt"
            @click="selectCount"
            />
          <Popup v-model="attendCount" style="width:88vw;max-height:28rem;" position=top get-container=".groupbox">
            <div>
              <Cell title="选择班次" style="font-size:1rem">
                <Icon slot="right-icon" name="cross" class="custom-icon" @click="cancelSelectCount" />
              </Cell>
              <!-- <van-row>
                <van-col span="4" class="indexPage">选项</van-col>
                <van-col span="7" class="indexPage">名称</van-col>
                <van-col span="13" class="indexPage">考勤时间</van-col>
              </van-row>
              <CheckboxGroup  v-model="rules">
              <van-row v-for="(item, index) in attendInfo" :key=index>
                <van-col span="4" class="indexPage"><Checkbox :name=item></Checkbox></van-col>
                <van-col span="7" class="indexPage">{{item.name}}</van-col>
                <van-col span="13" class="indexPage">{{item.workTimeAt}}</van-col>
              </van-row>
              </CheckboxGroup> -->
              <RadioGroup v-model="rules">
                <CellGroup v-for="(item, index) in attendInfo" :key=index>
                  <Cell center clickable @click="rules = item" value-class="cellright">
                    <template slot="title">
                      <div class="flex-b"><span>名称</span><span>{{item.name}}</span></div>
                      <div class="flex-b"><span>考勤时间</span><span>{{item.workTimeAt}}</span></div>
                    </template>
                    <Radio :name="item"></Radio>
                  </Cell>
                </CellGroup>
              </RadioGroup>
              <div style="line-height:6rem">
                <Button size="small" style="margin-left:25%;font-size:1rem" @click="cancelSelectCount">取消</Button>
                <Button type="info" style="margin-left:10%;font-size:1rem" size="small" @click="saveAttend">确定</Button>
              </div>
            </div>
          </Popup>
          <Field
            label="排班周期"
            placeholder="请设置排班周期"
            @click="arrangeCycle"
          />
          <Popup v-model="isCycle" style="width:82vw;height:26rem;" position=top get-container=".groupbox">
            <div>
              <Cell title="排班周期" style="font-size:1.2rem;line-height:2.5rem">
                <Icon slot="right-icon" name="cross" class="custom-icon" @click="cancelCycle" />
              </Cell>
              <Field
                label="周期名称"
                style="font-size:0.85rem;color:#000"
                />
                <span style="line-height:3rem;font-size:0.85rem;margin-left:1rem">每个周期天数</span>
                <Stepper v-model="valueCount" style="margin-left:1rem;line-height:2rem"/>
                <span style="line-height:2.5rem;font-size:0.85rem;margin-left:1rem">以2天为周期进行循环，最大周期天数为31天</span>
                <div v-for="item in valueCount" :key=item>
                  <Field
                  placeholder="29"
                >
                <label slot="label">第{{item-1}}天</label>
                  </Field>
                </div>
                <div style="line-height:6rem">
                <Button size="small" style="margin-left:45%;line-height:2rem; font-size:1rem" @click="cancelCycle">取消</Button>
                <Button type="info" style="margin-left:5%;font-size:1rem" size="small" @click="confirmCycle">确定</Button>
              </div>
            </div>
          </Popup>
          <div style="line-height:10rem">
          <Button size="small" style="margin-left:45%" @click="cancelEdit">取消</Button>
          <Button size="small" type="info" style="margin-left:5%" :isLoading="achievedLoading" @click="editAchieved">修改</Button>
          </div>
        </Popup>
      </div>
  </div>
</template>
<script>
import { NavBar, Toast, Pagination, DatetimePicker, Button, Field, Row, RadioGroup, Radio, Stepper, Col, Icon, CheckboxGroup, Checkbox, Popup, Cell, PullRefresh, Dialog, CellGroup, Tab, Tabs } from 'vant'
import { httpGet, httpPut, httpDelete } from '@/utils/restful'
import { AIAttendGroup, AIDuyCompanyAndAiUser, getAIShiftsList, AIAttendGroupDetail } from '@/api/url'
import { attendTypeFormatter, numToChinese, fontNum } from '@/utils/formatter'
export default {
  name: 'attendGroup',
  data () {
    return {
      isLoading: false,
      isWatchUser: false,
      attendCount: false,
      attendFixedCount: false,
      isCycle: false,
      saveLoading: false,
      isBtn: true,
      isBtn1: true,
      isFixedUser: false,
      isFixed: false,
      currentTime: '12:00',
      diff: undefined,
      achievedLoading: false,
      amendFixedCount: false,
      freeEdit: false,
      greatId: undefined,
      ids: [],
      valueCount: 1,
      total: 0,
      attendWorkTimeAt: '',
      attendFixedWorkTimeAt: '',
      rules: [],
      classCount: '',
      saveCount: '',
      arrayCheck: [],
      form: {
        id: undefined,
        name: undefined,
        type: 0,
        selectArr: undefined,
        beginTime: '00:00',
        aiUserBeans: {
          aiUsers: [],
          noAiUsers: []
        },
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
      attendInfo: undefined,
      attendFixedInfo: undefined,
      result: undefined,
      resultArr: undefined,
      tableData: [],
      list: [],
      listUser: [],
      share: [],
      isHasData: false,
      isArrange: false,
      show: false,
      isShow: false,
      isShow1: false,
      standByData: undefined,
      attendTypeFormatter: attendTypeFormatter,
      numToChinese: numToChinese,
      listQuery: {
        limit: 10,
        offset: 1
      },
      active: 1
    }
  },
  methods: {
    onClickLeft () {
      this.$router.push('/indexPage/')
    },
    onClickRight () {
      this.$router.push('/addAttend/')
    },
    filterArr () {
      // this.$store.getters.permissionFun
      JSON.parse(window.sessionStorage.getItem('list')).map(item => {
        if (item.name === '考勤管理') {
          item.children.map(it => {
            if (it.name === '考勤组管理') {
              this.share = it.roles
            }
          })
        }
      })
    },
    selectTime () {
      this.isShow1 = true
    },
    closeTime () {
      this.isShow1 = false
    },
    closeWindows () {
      this.show = false
    },
    getValue (value) {
      this.form.beginTime = fontNum(value)
      this.isShow1 = false
    },
    cancelEdit () {
      this.isArrange = false
      this.show = false
    },
    cancelCycle () {
      this.isCycle = false
    },
    closeFixed () {
      this.isFixed = false
      this.show = false
    },
    cancelFixedEdit () {
      this.isFixedUser = false
    },
    closeAdd () {
      this.amendFixedCount = false
    },
    seePage (val) {
      this.listQuery.offset = val
      this.fetchData()
    },
    // 删除某项
    delAttend () {
      Dialog.confirm({message: '确认删除吗？', title: '提示'})
        .then(() => {
          httpDelete(AIAttendGroup, {ids: this.ids})
            .then(res => {
              this.fetchData()
              Toast({
                type: 'success',
                message: res.message,
                duration: 4 * 1000
              })
              this.show = false
            }).catch(() => {
            })
        }).catch(() => {})
    },
    // 点击修改班次
    addCount (item) {
      this.num = ''
      this.num = item - 1
      this.amendFixedCount = true
      httpGet(getAIShiftsList, {
        departmentId: this.$store.getters.departmentId
      }).then(res => {
        this.attendFixedInfo = res.data
      })
        .catch(() => {})
    },
    // 固定班制编辑完成
    loadContent () {
      if (this.resultArr === undefined || this.resultArr.length === 0) {
        Toast('请选择参与考勤人员')
      } else {
        console.log(this.resultArr)
        this.saveLoading = true
        const updateFormData = Object.assign({}, this.form)
        httpPut(AIAttendGroup, updateFormData).then(res => {
          this.saveLoading = true
          this.fetchData()
          this.isFixed = false
          this.show = false
          Toast({
            message: res.message,
            type: 'success',
            duration: 4 * 1000
          })
        }).catch(() => {
          this.saveLoading = false
        })
      }
      console.log(this.arrayCheck)
    },
    selectFixedPerson () {
      this.resultArr = []
      this.isFixedUser = true
      httpGet(AIDuyCompanyAndAiUser, {
        departmentId: this.$store.getters.departmentId
      }).then(res => {
        console.log(res)
        this.listUser = res.data.levelDate
      }).catch(() => {})
    },
    // 选择考勤的人员
    selectPerson () {
      this.result = []
      this.isWatchUser = true
      httpGet(AIDuyCompanyAndAiUser, {
        departmentId: this.$store.getters.departmentId
      }).then(res => {
        console.log(res)
        this.list = res.data.levelDate
      }).catch(() => {})
    },
    // 周期排班选择
    arrangeCycle () {
      this.isCycle = true
    },
    // 确定周期选择
    confirmCycle () {
      this.isCycle = false
    },
    // 选择固定班制班次
    selectFixedCount () {
      this.attendFixedCount = true
      this.classCount = []
      this.attendFixedWorkTimeAt = ''
      httpGet(getAIShiftsList, {
        departmentId: this.$store.getters.departmentId
      }).then(res => {
        this.attendFixedInfo = res.data
      })
        .catch(() => {})
    },
    // 选择班次
    selectCount () {
      this.attendCount = true
      this.rules = []
      this.attendWorkTimeAt = ''
      httpGet(getAIShiftsList, {
        departmentId: this.$store.getters.departmentId
      }).then(res => {
        console.log(res)
        this.attendInfo = res.data
      })
        .catch(() => {})
    },
    cancelSelectCount () {
      this.attendCount = false
    },
    cancelFixedCount () {
      this.attendFixedCount = false
    },
    // 弹窗编辑
    edit (item) {
      this.greatId = item.id
      this.ids = [item.id]
      this.diff = item.type
      if (item.type === 1) {
        this.isShow = true
      }
      if (item.type === 0) {
        this.isShow = false
      }
      if (item.type === 2) {
        this.isShow = false
      }
      this.show = true
      this.standByData = item
    },
    // 编辑排班
    arrange () {
      // this.$toast('暂不可进行排班操作')
      // this.show = false
      this.$router.push({name: 'Schedule', params: {id: this.greatId}})
    },
    // 取消选择考勤人员
    cancelSelect () {
      this.isWatchUser = false
    },
    // 保存考勤班次
    saveAttend () {
      this.attendCount = false
      console.log(this.rules)
      for (let i = 0; i < this.rules.length; i++) {
        this.attendWorkTimeAt = this.attendWorkTimeAt + ' ' + (this.rules[i].workTimeAt)
      }
    },
    // 保存固定班制考勤班次
    saveFixedAttend () {
      this.attendFixedCount = false
      this.attendFixedWorkTimeAt = this.classCount.workTimeAt
    },
    saveFixedAdd () {
      this.amendFixedCount = false
      this.$refs.refCount[this.num].innerHTML = this.saveCount.workTimeAt
    },
    saveFixed (item) {
      this.attendFixedCount = false
      console.log(this.classCount.workTimeAt)
      this.$refs.showTime[item] = this.classCount.workTimeAt
    },
    // 操作下的编辑
    editContent () {
      // 排班制
      httpGet(AIAttendGroupDetail, {
        departmentId: this.$store.getters.departmentId,
        workCheckGroupId: this.standByData.id
      }).then((res) => {
        this.form = Object.assign(this.form, res.data)
      })
        .catch(() => {})
      if (this.standByData.type === 1) {
        this.isArrange = true
      } else {
        // 固定班制
        this.isFixed = true
      }
    },
    // 修改完成
    editAchieved () {
      this.achievedLoading = true
      if (this.result === [] || this.result === undefined) {
        Toast.fail('请选择参与考勤人员')
      } else {
        const updateFormData = Object.assign({}, this.form)
        httpPut(AIAttendGroup, updateFormData).then(res => {
          this.achievedLoading = false
          this.isArrange = false
          this.show = false
          this.fetchData()
          Toast({
            message: res.message,
            type: 'success',
            duration: 4 * 1000
          })
          console.log(res)
        }).catch(() => {
          this.achievedLoading = false
        })
      }
    },
    // 保存选择部门以及人员
    savePerson () {
      let array = []
      for (let i = 0; i < this.result.length; i++) {
        array.push(this.result[i])
      }
      if (this.result.length > 0) {
        this.isBtn = false
      }
      this.isWatchUser = false
      console.log(array)
    },
    // 保存固定班制人员选择
    saveFixedUser () {
      let listUser = []
      for (let i = 0; i < this.resultArr.length; i++) {
        listUser.push(this.resultArr[i])
      }
      if (this.resultArr.length > 0) {
        this.isBtn1 = false
      }
      this.isFixedUser = false
    },
    onRefresh () {
      setTimeout(() => {
        this.listQuery = {
          name: undefined,
          limit: 10,
          offset: 1
        }
        this.fetchData()
        this.$toast('刷新成功')
        this.isLoading = false
      }, 500)
    },
    // 获取数据
    fetchData () {
      this.listQuery = Object.assign(this.listQuery, {departmentId: this.$store.getters.departmentId})
      httpGet(AIAttendGroup, this.listQuery).then(res => {
        if (res.data.rows && res.data.rows.length === 0) {
          this.tableData = []
          this.isHasData = true
          this.total = 0
        } else {
          this.tableData = res.data.rows
          this.total = res.data.total
          this.isHasData = false
        }
        console.log(res)
      }).catch(() => {
      })
    },
    clickTab (index, title) {
      if (index === 0) {
        this.$router.push('/attendManage/')
      }
    }
  },
  components: {
    NavBar,
    Button,
    Field,
    RadioGroup,
    Radio,
    Pagination,
    'van-row': Row,
    'van-col': Col,
    Popup,
    Icon,
    PullRefresh,
    Cell,
    CheckboxGroup,
    Checkbox,
    Stepper,
    DatetimePicker,
    CellGroup,
    'van-tabs': Tabs,
    'van-tab': Tab
  },
  created () {
    this.fetchData()
    this.filterArr()
  }
}
</script>
<style lang="scss" scoped>
.groupbox{
  min-height: 100vh;
  font-size:0.75rem;
  background-color: rgb(238,238,238);
}
.btn12{
  width: 60vw;
  margin-left: 14vw;
  border-radius:0.5rem;
}
.adapt{
  width:70vw;
  margin-left: 12vw;
  margin-top: 0.5rem;
  border-radius:0.8rem;
}
.listCss{
  text-align:center;
  border-bottom:1px solid #ebedf0;
  height: 2rem;
  padding-top: 0.4rem;
}
.indexPage{
  text-align:center;
  border:1px solid #ccc;
  height: 3rem;
  padding-top: 0.6rem;
}
.listCss1{
  text-align:center;
  border-bottom:1px solid #ebedf0;
  height: 2.5rem;
  padding-top: 0.4rem
}
.notData{
  text-align: center;
  line-height: 6rem;
  font-size: 1.1rem;
  letter-spacing: 0.1rem;
  border:1px solid #ccc;
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

<style scoped>
.groupbox >>> .van-tabs__line {
  background-color: #1989fa
}
#asd >>> .van-pagination__item--disabled, .van-pagination__item--disabled:active {
  color:rgb(14,105,254)
}
</style>

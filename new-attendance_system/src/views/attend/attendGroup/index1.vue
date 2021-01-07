<template>
  <div class="app-container">
    <div class="table-main">
      <!-- 操作 -->
      <div class="filter-container">
        <el-button class="filter-item" type="primary" @click="handleRefresh"  icon="el-icon-refresh">刷新</el-button>
        <el-button class="filter-item" type="primary" @click="handleCreate"  icon="el-icon-edit">添加</el-button>
        <el-button class="filter-item" type="danger" :loading = "deleteLoading" @click="handleDelete" :disabled="disabled" icon="el-icon-close">删除</el-button>
      </div>
      <el-table :header-cell-style="{background:'#f3f4f6'}" style="width: 100%" max-height="600" :data="tableData" v-loading.body="listLoading" @selection-change="handleSelectionChange" element-loading-text="加载中..." border fit highlight-current-row>
        <el-table-column type="selection" width="40" fixed="left" ></el-table-column>
        <el-table-column label="名称" align="center" prop="name"></el-table-column>
        <el-table-column label="人数" align="center" prop="userNum">
          <template slot-scope="scope">
           {{scope.row.userNum + '人'}}
          </template>
        </el-table-column>
        <el-table-column label="类型" align="center" prop="type">
          <template slot-scope="scope">
            {{attendTypeFormatter(scope.row.type)}}
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" align="center" class-name="small-padding fixed-width" width="300">
          <template slot-scope="scope">
            <el-button  type="primary" @click="handleUpdate(scope.row)" size="mini">编辑</el-button>
            <el-button :disabled="scope.row.type !== 1"  type="primary" @click="handleSchedule(scope.row)" size="mini">编辑排班</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination background  :page-sizes="[10,20,30, 50]" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.offset " :page-size="listQuery.limit" :total="total" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
      </div>
      <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="900px">
        <el-form :rules="formRules" ref="dataform" size="small" :model="form">
          <el-form-item prop="name">
            <span>考勤组名称&#x3000;</span>
            <el-input style="width: auto;"  v-model="form.name" placeholder="请输入考勤组名称"></el-input>
          </el-form-item>
          <el-form-item v-if="dialogStatus=='create'">
            <span>考勤类型&#x3000;</span>
            <el-radio-group v-model="form.type">
              <el-radio-button :label="0">固定班制</el-radio-button>
              <el-radio-button :label="1">排班制</el-radio-button>
              <el-radio-button :label="2">自由时间制</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            <span>参与考勤人员&#x3000;</span>
            <el-button v-if="checkedNodes.length === 0" @click="showTree(true)">请选择</el-button>
            <span v-else @click="showTree(true)">
              <el-button v-for="(item, index) in checkedNodes" :key="index" type="primary">{{item.name}}</el-button>
            </span>
          </el-form-item>
          <!-- <el-form-item>
            <span>无需考勤人员&#x3000;</span>
            <el-button @click="showTree(false)">请选择</el-button>
          </el-form-item> -->
          <!-- <el-form-item>
            <span>考勤组负责人&#x3000;</span>
            <el-button>请选择</el-button>
          </el-form-item> -->
          <div v-if="form.type === 0">
            <el-form-item>
              <div class="work-day">
                <span>工作日设置&#x3000;</span>
                <div>
                  <span>快捷设置班次:&nbsp;{{workDayInfo}}</span>
                  <el-button type="text" @click="getWorkShift(0)"> 更改班次</el-button>
                  <div style="width:600px;">
                    <el-table ref="multipleTable" @select="selectEvent" @select-all = "selectAll" @selection-change="handleSelectionChangeTime" :header-cell-style="{background:'#f3f4f6', height: '20px', padding: '8px 0'}" style="width: 100%;font-size: 14px;" :data="workDayData" border :row-style="{height: '20px'}" :cell-style="{padding: '5px'}">
                      <el-table-column type="selection" width="60"></el-table-column>
                      <el-table-column label="工作日" prop="name"></el-table-column>
                      <el-table-column label="班次时间段" prop="workTimeAt"></el-table-column>
                      <el-table-column label="操作"  class-name="small-padding fixed-width" width="120">
                        <template slot-scope="scope">
                          <el-button  type="text" @click="getWorkShift(scope.row)" size="mini">修改班次</el-button>
                        </template>
                      </el-table-column>
                    </el-table>
                  </div>
                  <!-- <el-checkbox :v-model="form.fixedSchedulingBean?'1':'0'">法定节假日自动排休</el-checkbox> -->
                </div>
              </div>
            </el-form-item>
            <!-- <el-form-item>
              <span>特殊日期&#x3000;</span>
              <el-button size="mini">添加</el-button>
            </el-form-item>
            <el-form-item>
              <span>加班规则&#x3000;</span>
              默认加班规则
            </el-form-item> -->
          </div>
          <div v-if="form.type === 1">
            <el-form-item>
              <span>考勤班次&#x3000;</span>
              <el-button size="mini" @click="getWorkShift(0)">选择班次</el-button>
              <!-- <el-checkbox v-model="autoShift">法定节假日自动排休<span>减轻管理员排班负担，同时支持事后排班</span></el-checkbox> -->
            </el-form-item>
            <el-form-item>
              <span>排班周期&#x3000;</span>
              <el-button size="mini" @click="setWorkCycle">请设置排班周期</el-button>
            </el-form-item>
          </div>
          <div v-if="form.type === 2">
            <el-form-item>
              <span>设置工作日&#x3000;</span>
              <!-- <el-checkbox-group> -->
                <el-checkbox label="周一" v-model="form.freeSchedulingBean.monday"></el-checkbox>
                <el-checkbox label="周二" v-model="form.freeSchedulingBean.tuesday"></el-checkbox>
                <el-checkbox label="周三" v-model="form.freeSchedulingBean.wednesday"></el-checkbox>
                <el-checkbox label="周四" v-model="form.freeSchedulingBean.thursday"></el-checkbox>
                <el-checkbox label="周五" v-model="form.freeSchedulingBean.friday"></el-checkbox>
                <el-checkbox label="周六" v-model="form.freeSchedulingBean.saturday"></el-checkbox>
                <el-checkbox label="周日" v-model="form.freeSchedulingBean.sunday"></el-checkbox>
              <!-- </el-checkbox-group> -->
            </el-form-item>
            <el-form-item>
              <span>考勤开始时间&#x3000;</span>
              每天几点开始新一天的考勤
              <el-time-picker
              :default-value = "['00:00']"
              value-format = "HH:mm"
              format = "HH 点 mm 分"
              v-model="firstBeginTime"
              @change="firstBeginTimeChange"
              placeholder="任意时间点"/>
            </el-form-item>
          </div>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button :loading = "createLoading" v-if="dialogStatus=='create'" type="primary" @click="createData">保存</el-button>
          <el-button :loading = "updateLoading" v-else type="primary" @click="updateData">修改</el-button>
        </div>
        <el-dialog width="30%" title="选择班次" :visible.sync="innerVisible" append-to-body>
          <el-table :header-cell-style="{background:'#f3f4f6', height: '20px', padding: '8px 0'}"  style="width: 100%; font-size: 10px" max-height="600" :data="workDayArr" border fit highlight-current-row>
            <el-table-column fixed="left" label="名称">
              <template slot-scope="scope">
               <el-radio v-model="workDay" :label="scope.row.id" :value="scope.row.id">{{scope.row.name}}</el-radio>
              </template>
            </el-table-column>
            <el-table-column label="考勤时间" prop="workTimeAt"></el-table-column>
          </el-table>
          <div slot="footer" class="dialog-footer">
            <el-button size="mini" @click="innerVisible = false">取消</el-button>
            <el-button size="mini" type="primary" @click="workCreate">确定</el-button>
          </div>
        </el-dialog>
        <el-dialog width="30%" title="选择班次" :visible.sync="innerVisible2" append-to-body>
          <el-table ref="multipleTable2" @selection-change="handleSelectionChangeInner" :header-cell-style="{background:'#f3f4f6', height: '20px', padding: '8px 0'}"  style="width: 100%; font-size: 10px" max-height="600" :data="workDayArr" border fit highlight-current-row>
            <el-table-column type="selection" width="60"></el-table-column>
            <el-table-column label="名称" prop="name"></el-table-column>
            <el-table-column label="考勤时间" prop="workTimeAt"></el-table-column>
          </el-table>
          <div slot="footer" class="dialog-footer">
            <el-button size="mini" @click="innerVisible2 = false">取消</el-button>
            <el-button size="mini" type="primary" @click="workCreate2">确定</el-button>
          </div>
        </el-dialog>
        <el-dialog width="30%" title="选择部门与人员" :visible.sync="innerPersonVisible" append-to-body>
          <el-tree
            v-if="innerPersonVisible"
            :data="treeData"
            show-checkbox
            :props="defaultProps"
            :render-after-expand="false"
            node-key="id"
            accordion
            :check-on-click-node="true"
            :default-checked-keys="defaultCheckedKeys"
            :default-expanded-keys="defaultExpandedKeys"
            ref="tree"
            :load="loadNode" lazy>
            <span slot-scope="{ node }">
              <span >{{node.label}}</span>
            </span>
          </el-tree>
          <div slot="footer" class="dialog-footer">
            <el-button @click="innerPersonVisible = false">取消</el-button>
            <el-button type="primary" @click="savePerson">保存</el-button>
          </div>
        </el-dialog>
        <el-dialog width="30%" title="排班周期" :visible.sync="cycleVisible" append-to-body>
          <el-form>
            <el-form-item label="周期名称" prop="cycleName">
              <el-input v-model="form.dynamicSchedulingBean.cycleName" style="width:60%"></el-input>
            </el-form-item>
            <el-form-item label="每个周期天数" prop="cycleDays">
              <el-input-number :min="1" controls-position="right" style="width:120px;margin-right:10px" @change="changeCycleDay" v-model="form.dynamicSchedulingBean.cycleDays" placeholder="请输入每个周期天数"></el-input-number>以2天为周期进行循环，最大周期天数为31天
            </el-form-item>
            <el-form-item  v-for="(cycle, index) in cyclesModel" :key="index" :label="`第` + (index + 1) + `天`">
              <el-select class="filter-item" placeholder="请选择" v-model="cycle.value">
                <el-option v-for="item in cyclesArray" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button size="mini" @click="cycleVisible = false">取消</el-button>
            <el-button size="mini" type="primary" @click="createCycle">确定</el-button>
          </div>
        </el-dialog>
      </el-dialog>
      <!-- 排班 -->
      <el-dialog title="排班" :visible.sync="ScheduleVisible" width="80%">
        <Schedule :id="rowId"></Schedule>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { attendTypeFormatter, HHssFormatter, NumToHHssFormatter } from '@/utils/formatter.js'
import { httpGet, httpDelete, httpPost, httpPut } from '@/utils/restful'
import { AIAttendGroup, getAIShiftsList, AIDuyCompanyAndAiUser, AIAttendGroupDetail } from '@/api/url'
import Schedule from './components/Schedule'
import { attendGroupText } from '@/utils/helptext'
import Storage from '@/utils/storage'
export default {
  components: {
    Schedule
  },
  data () {
    return {
      attendTypeFormatter: attendTypeFormatter,
      list: null,
      listLoading: true,
      createLoading: false,
      deleteLoading: false,
      updateLoading: false,
      listQuery: {
        offset: 1,
        limit: 10
      },
      tableData: [],
      dialogFormVisible: false,
      innerVisible: false,
      innerVisible2: false,
      innerPersonVisible: false,
      ScheduleVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '添加'
      },
      total: null,
      selectArrayId: [],
      disabled: true,
      workDay: '休息',
      workDayArr: [],
      workDayData: [
        {name: '星期一', key: 'mondayShiftId', value: -1, workTimeAt: '休息', id: 1},
        {name: '星期二', key: 'tuesdayShiftId', value: -1, workTimeAt: '休息', id: 2},
        {name: '星期三', key: 'wednesdayShiftId', value: -1, workTimeAt: '休息', id: 3},
        {name: '星期四', key: 'thursdayShiftId', value: -1, workTimeAt: '休息', id: 4},
        {name: '星期五', key: 'fridayShiftId', value: -1, workTimeAt: '休息', id: 5},
        {name: '星期六', key: 'saturdayShiftId', value: -1, workTimeAt: '休息', id: 6},
        {name: '星期日', key: 'sundayShiftId', value: -1, workTimeAt: '休息', id: 7}
      ],
      workId: undefined, // 声明变量判断是总的更改 还是 一星期中星期几的更改
      workDayObj: {},
      workDayInfo: '休息',
      form: {
        id: undefined,
        name: undefined,
        type: 0,
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
      firstBeginTime: '00:00',
      formRules: {
        name: [
          {required: true, trigger: 'blur', message: '不可为空'}
        ]
      },
      value1: [1, 5],
      // 树
      checkedId: 0,
      treeData: [],
      defaultCheckedKeys: [],
      defaultExpandedKeys: [],
      defaultProps: {
        children: 'childrens',
        label: 'name',
        isLeaf: 'account'
      },
      autoShift: false,
      checkDayList: [],
      cycleVisible: false,
      schedulingCycles: [], // 只存id
      cyclesArray: [],
      cyclesModel: [],
      workShiftarray: [],
      rowId: undefined,
      checkedNodes: []
    }
  },
  created () {
    this.getWorkShiftList()
    this.fetchData()
  },
  mounted () {
    if (!Storage.get('attendGroupShowHelp')) {
      this.$nextTick(() => {
        this.$alert(attendGroupText, '帮助说明', {
          confirmButtonText: '知道了，不再提醒',
          // showClose: false,
          center: true,
          roundButton: true,
          callback: action => {
            if (action === 'confirm') {
              Storage.set('attendGroupShowHelp', 1)
            }
          }
        })
      })
    }
  },
  methods: {
    // 排班
    handleSchedule (row) {
      this.rowId = row.id
      this.ScheduleVisible = true
    },
    fetchData () {
      this.listQuery = Object.assign(this.listQuery, {departmentId: this.$store.getters.departmentId})
      httpGet(AIAttendGroup, this.listQuery).then(res => {
        if (res.data === null || res.data.rows === null) {
          this.tableData = []
          this.total = 0
        } else {
          this.tableData = res.data.rows
          this.total = res.data.total
        }
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    handleSizeChange (val) {
      this.listQuery.limit = val
      this.fetchData()
    },
    handleCurrentChange (val) {
      this.listQuery.offset = val
      this.fetchData()
    },
    // 重置form表单
    resetForm () {
      this.form = {
        id: undefined,
        name: undefined,
        type: 0,
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
      }
    },
    getWorkShiftList () {
      httpGet(getAIShiftsList, {
        departmentId: this.$store.getters.departmentId
      }).then(res => {
        this.workDayArr = res.data
        this.workDay = '休息'
      }).catch(() => {})
    },
    // ------ 班次设置 ----------- \\
    getWorkShift (id) {
      let self = this
      if (this.form.type === 0) {
        if (id === 0) {
          this.workId = id
        } else {
          this.workId = id.id
        }
        this.workDay = id.value
        this.innerVisible = true
      } else if (this.form.type === 1) {
        let temp = this.form.dynamicSchedulingBean.workShiftIds
        if (temp && temp !== '') {
          temp = JSON.parse(temp)
          for (let i = 0; i < this.workDayArr.length; i++) {
            for (let k = 0; k < temp.length; k++) {
              if (this.workDayArr[i].id === temp[k]) {
                // 因为表格没出现，所以要设置延时，时间实情况可以添加缩短
                setTimeout(() => {
                  self.$refs.multipleTable2.toggleRowSelection(self.$refs.multipleTable2.data[i], true)
                }, 500)
                break
              }
            }
          }
        }
        this.innerVisible2 = true
      }
    },
    // 设置排班
    workCreate () {
      // 判断是否选择了某一班次
      if (this.workDay !== '休息') {
        // 整体设置排班
        if (this.workId === 0) {
          this.getWorkShiftRow()
          this.workDayInfo = '班次' + this.workDayObj.name + ':' + this.workDayObj.workTimeAt
          // 整体设置星期班次
          for (let i = 0; i < this.workDayData.length; i++) {
            this.workDayData[i].value = this.workDay
            this.workDayData[i].workTimeAt = this.workDayInfo
          }
          this.toggleSelection(this.workDayData)
        } else {
          // 设置星期几的排班
          let data = {}
          this.workDayArr.forEach(obj => {
            if (obj.id === this.workDay) {
              data = obj
            }
          })
          this.workDayData[this.workId - 1].value = this.workDay
          this.workDayData[this.workId - 1].workTimeAt = '班次' + data.name + ':' + data.workTimeAt
        }
        this.innerVisible = false
      } else {
        this.$message.error('请先选择某一班次')
      }
    },
    workCreate2 () {
      if (this.workShiftarray && this.workShiftarray.length > 0) {
        this.innerVisible2 = false
      } else {
        this.$message.error('请先选择某一班次')
      }
    },
    toggleSelection (rows) {
      rows.forEach(row => {
        this.$refs.multipleTable.toggleRowSelection(row)
      })
    },
    // 获取当前选中的班次
    getWorkShiftRow () {
      this.workDayArr.forEach(obj => {
        if (this.workDay === obj.id) {
          this.workDayObj = obj
        }
      })
    },
    selectAll (value) {
      if (value.length === 0) {
        if (this.workDayInfo === '休息') {
          this.$refs.multipleTable.clearSelection()
        }
        this.$nextTick(() => {
          this.workDayData = [
            {name: '星期一', key: 'mondayShiftId', value: -1, workTimeAt: '休息', id: 1},
            {name: '星期二', key: 'tuesdayShiftId', value: -1, workTimeAt: '休息', id: 2},
            {name: '星期三', key: 'wednesdayShiftId', value: -1, workTimeAt: '休息', id: 3},
            {name: '星期四', key: 'thursdayShiftId', value: -1, workTimeAt: '休息', id: 4},
            {name: '星期五', key: 'fridayShiftId', value: -1, workTimeAt: '休息', id: 5},
            {name: '星期六', key: 'saturdayShiftId', value: -1, workTimeAt: '休息', id: 6},
            {name: '星期日', key: 'sundayShiftId', value: -1, workTimeAt: '休息', id: 7}
          ]
        })
      } else {
        // 一键设置
        for (let i = 0; i < this.workDayData.length; i++) {
          this.workDayData[i].value = this.workDay
          this.workDayData[i].workTimeAt = this.workDayInfo
        }
      }
    },
    handleSelectionChangeTime (value) {
      if (value.length === 0) {
        this.workDayData = [
          {name: '星期一', key: 'mondayShiftId', value: -1, workTimeAt: '休息', id: 1},
          {name: '星期二', key: 'tuesdayShiftId', value: -1, workTimeAt: '休息', id: 2},
          {name: '星期三', key: 'wednesdayShiftId', value: -1, workTimeAt: '休息', id: 3},
          {name: '星期四', key: 'thursdayShiftId', value: -1, workTimeAt: '休息', id: 4},
          {name: '星期五', key: 'fridayShiftId', value: -1, workTimeAt: '休息', id: 5},
          {name: '星期六', key: 'saturdayShiftId', value: -1, workTimeAt: '休息', id: 6},
          {name: '星期日', key: 'sundayShiftId', value: -1, workTimeAt: '休息', id: 7}
        ]
      } else if (value.length > 0) {
        let obj = {}
        for (let i = 0; i < value.length; i++) {
          Object.assign(obj, {
            [value[i].key]: value[i].value
          })
        }
        this.form.fixedSchedulingBean = obj
      }
    },
    selectEvent (selection, row) {
      if (row.value === -1 && this.workDayInfo === '休息') {
        this.toggleSelection([row])
      } else {
        if (JSON.stringify(selection).indexOf(JSON.stringify(row)) < 0 || this.workDayObj.name === undefined) {
          this.workDayData[row.id - 1].value = -1
          this.workDayData[row.id - 1].workTimeAt = '休息'
        } else {
          this.workDayData[row.id - 1].value = this.workDay
          this.workDayData[row.id - 1].workTimeAt = '班次' + this.workDayObj.name + ':' + this.workDayObj.workTimeAt
        }
      }
    },
    // -------------------------------- \\
    handleCreate () {
      let self = this
      self.dialogStatus = 'create'
      self.dialogFormVisible = true
      self.firstBeginTime = '00:00'
      self.workDayInfo = '休息'
      self.checkedNodes = []
      self.workDayData = [
        {name: '星期一', key: 'mondayShiftId', value: -1, workTimeAt: '休息', id: 1},
        {name: '星期二', key: 'tuesdayShiftId', value: -1, workTimeAt: '休息', id: 2},
        {name: '星期三', key: 'wednesdayShiftId', value: -1, workTimeAt: '休息', id: 3},
        {name: '星期四', key: 'thursdayShiftId', value: -1, workTimeAt: '休息', id: 4},
        {name: '星期五', key: 'fridayShiftId', value: -1, workTimeAt: '休息', id: 5},
        {name: '星期六', key: 'saturdayShiftId', value: -1, workTimeAt: '休息', id: 6},
        {name: '星期日', key: 'sundayShiftId', value: -1, workTimeAt: '休息', id: 7}
      ]
      self.$nextTick(() => {
        if (self.$refs.tree) {
          self.$refs.tree.setCheckedNodes([])
        }
        self.$refs['dataform'].resetFields()
        self.resetForm()
      })
    },
    handleUpdate (row) {
      let self = this
      httpGet(AIAttendGroupDetail, {
        departmentId: self.$store.getters.departmentId,
        workCheckGroupId: row.id
      }).then((res) => {
        self.form.aiUserBeans = null
        if (self.$refs.tree) {
          self.$refs.tree.setCheckedNodes([])
        }
        self.form = Object.assign({}, res.data)
        // 有些对象返回null导致报错,
        if (!self.form.aiUserBeans) {
          self.form.aiUserBeans = {}
        }
        if (!self.form.fixedSchedulingBean) {
          self.form.fixedSchedulingBean = {}
        }
        if (!self.form.dynamicSchedulingBean) {
          self.form.dynamicSchedulingBean = {}
        }
        if (!self.form.freeSchedulingBean) {
          self.form.freeSchedulingBean = {}
        }
        self.firstBeginTime = NumToHHssFormatter(self.form.freeSchedulingBean.beginTime)
        self.dialogStatus = 'update'
        this.checkedNodes = []
        self.dialogFormVisible = true
        self.$nextTick(() => {
          self.$refs.dataform.clearValidate()
          this.workDayData = [
            {name: '星期一', key: 'mondayShiftId', value: -1, workTimeAt: '休息', id: 1},
            {name: '星期二', key: 'tuesdayShiftId', value: -1, workTimeAt: '休息', id: 2},
            {name: '星期三', key: 'wednesdayShiftId', value: -1, workTimeAt: '休息', id: 3},
            {name: '星期四', key: 'thursdayShiftId', value: -1, workTimeAt: '休息', id: 4},
            {name: '星期五', key: 'fridayShiftId', value: -1, workTimeAt: '休息', id: 5},
            {name: '星期六', key: 'saturdayShiftId', value: -1, workTimeAt: '休息', id: 6},
            {name: '星期日', key: 'sundayShiftId', value: -1, workTimeAt: '休息', id: 7}
          ]
          let temp = self.form.fixedSchedulingBean
          for (let k = 0; k < this.workDayArr.length; k++) {
            if (temp.mondayShiftId === this.workDayArr[k].id) {
              this.workDayData[0].value = this.workDayArr[k].id
              this.workDayData[0].workTimeAt = this.workDayArr[k].name + ':' + this.workDayArr[k].workTimeAt
            }
            if (temp.tuesdayShiftId === this.workDayArr[k].id) {
              this.workDayData[1].value = this.workDayArr[k].id
              this.workDayData[1].workTimeAt = this.workDayArr[k].name + ':' + this.workDayArr[k].workTimeAt
            }
            if (temp.wednesdayShiftId === this.workDayArr[k].id) {
              this.workDayData[2].value = this.workDayArr[k].id
              this.workDayData[2].workTimeAt = this.workDayArr[k].name + ':' + this.workDayArr[k].workTimeAt
            }
            if (temp.thursdayShiftId === this.workDayArr[k].id) {
              this.workDayData[3].value = this.workDayArr[k].id
              this.workDayData[3].workTimeAt = this.workDayArr[k].name + ':' + this.workDayArr[k].workTimeAt
            }
            if (temp.fridayShiftId === this.workDayArr[k].id) {
              this.workDayData[4].value = this.workDayArr[k].id
              this.workDayData[4].workTimeAt = this.workDayArr[k].name + ':' + this.workDayArr[k].workTimeAt
            }
            if (temp.saturdayShiftId === this.workDayArr[k].id) {
              this.workDayData[5].value = this.workDayArr[k].id
              this.workDayData[5].workTimeAt = this.workDayArr[k].name + ':' + this.workDayArr[k].workTimeAt
            }
            if (temp.sundayShiftId === this.workDayArr[k].id) {
              this.workDayData[6].value = this.workDayArr[k].id
              this.workDayData[6].workTimeAt = this.workDayArr[k].name + ':' + this.workDayArr[k].workTimeAt
            }
          }
          // console.log(this.workDayData)
        })
      }).catch(() => {})
    },
    // 搜索
    handleFilter () {
      this.listQuery.offset = 1
      this.fetchData()
    },
    changeShiftId (f) {
      if (this.form.type === 0) {
        for (let i = 0; i < this.workDayData.length; i++) {
          f.fixedSchedulingBean[this.workDayData[i].key] = this.workDayData[i].value
          // console.log(f.fixedSchedulingBean[this.workDayData[i].key])
        }
      }
      return f
    },
    // 新增
    createData () {
      this.$refs.dataform.validate((valid) => {
        if (valid) {
          if (this.form.aiUserBeans.aiUsers && this.form.aiUserBeans.aiUsers.length > 0) {
            this.createLoading = true
            this.form = Object.assign(this.form, {departmentId: this.$store.getters.departmentId})
            // 因为没勾选工作日设置的东西不会自动到form中,这里要手动设置
            this.form = this.changeShiftId(this.form)
            httpPost(AIAttendGroup, this.form).then((res) => {
              this.fetchData()
              this.dialogFormVisible = false
              setTimeout(() => { this.createLoading = false }, 300)
              this.$message({
                message: res.message,
                type: 'success',
                duration: 4 * 1000
              })
            }).catch(() => {
              this.createLoading = false
            })
          } else {
            this.$message.error('请选择参与考勤人员')
          }
        }
      })
    },
    // 修改
    updateData () {
      let self = this
      self.$refs.dataform.validate((valid) => {
        if (valid) {
          // if (this.form.aiUserBeans.aiUsers && this.form.aiUserBeans.aiUsers.length > 0) {
          self.updateLoading = true
          const updateFormData = Object.assign({}, self.form)
          // 因为没勾选工作日设置的东西不会自动到form中,这里要手动设置
          this.form = this.changeShiftId(this.form)
          httpPut(AIAttendGroup, updateFormData).then(res => {
            self.updateLoading = false
            self.fetchData()
            self.dialogFormVisible = false
            self.$message({
              message: res.message,
              type: 'success',
              duration: 4 * 1000
            })
          }).catch(() => {
            self.updateLoading = false
          })
        } else {
          this.$message.error('请选择参与考勤人员')
        }
        // }
      })
    },
    // 删除选中
    handleDelete () {
      this.$confirm('确认提交吗？', '提示', {})
        .then(() => {
          this.deleteLoading = true
          httpDelete(AIAttendGroup, {ids: this.selectArrayId}).then(res => {
            this.deleteLoading = false
            this.fetchData()
            this.$message({
              type: 'success',
              message: res.message,
              duration: 4 * 1000
            })
          }).catch(() => {
            this.deleteLoading = false
          })
        }).catch(() => {})
    },
    // 选中
    handleSelectionChange (val) {
      this.selectArrayId = []
      val.map(item => {
        this.selectArrayId.push(item.id)
      })
      if (this.selectArrayId.length !== 0) {
        this.disabled = false
      } else {
        this.disabled = true
      }
    },
    handleSelectionChangeInner (val) {
      this.cyclesArray = []
      this.workShiftarray = []
      val.map(item => {
        this.cyclesArray.push({
          id: Number(item.id),
          name: item.name
        })
        this.workShiftarray.push(item.id)
      })
      this.form.dynamicSchedulingBean.workShiftIds = JSON.stringify(this.workShiftarray)
    },
    // 刷新
    handleRefresh () {
      this.listQuery = {
        limit: 10,
        offset: 1
      }
      this.fetchData()
    },
    showTree (flag) {
      if (this.checkedNodes.length > 0) {
        this.$nextTick(() => {
          // console.log(this.$refs)
          // this.$refs.tree.setCheckedNodes(this.checkedNodes)
        })
      }
      this.defaultExpandedKeys = []
      this.innerPersonVisible = true
      // httpGet(AIDuyCompanyAndAiUser, {
      //   dcCode: id ? + node.data.id + '-'
      //   departmentId: this.$store.getters.departmentId
      // }).then(res =>
      //   this.treeData = res.data.levelDate
      //   this.defaultCheckedKeys = res.data.selectDate
      // }).catch(() => {})
    },
    loadNode (node, resolve) {
      if (node.level === 0) {
        httpGet(AIDuyCompanyAndAiUser, {
          departmentId: this.$store.getters.departmentId,
          workCheckGroupId: this.form.id
        }).then(res => {
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
        httpGet(AIDuyCompanyAndAiUser, {
          dcCode: node.data.dcCode + node.data.id + '-',
          departmentId: this.$store.getters.departmentId,
          workCheckGroupId: this.form.id
        }).then(res => {
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
    setWorkCycle () {
      this.changeCycleDay()
      this.cycleVisible = true
    },
    changeCycleDay () {
      let self = this
      this.cyclesModel = []
      // 如果没加载列表，但是班次选了，手动加载
      let workIds = this.form.dynamicSchedulingBean.workShiftIds
      if (workIds && workIds !== '') {
        workIds = JSON.parse(workIds)
        if (this.cyclesArray.length !== workIds.length) {
          httpGet(getAIShiftsList, {
            departmentId: this.$store.getters.departmentId
          }).then(res => {
            self.cyclesArray = []
            for (let i = 0; i < res.data.length; i++) {
              for (let k = 0; k < workIds.length; k++) {
                if (res.data[i].id === workIds[k]) {
                  self.cyclesArray.push({
                    id: res.data[i].id,
                    name: res.data[i].name
                  })
                  break
                }
              }
            }
          }).catch(() => {})
        }
      }
      // 如果有填，设置默认值
      let array = []
      if (this.form.dynamicSchedulingBean.schedulingCycles && this.form.dynamicSchedulingBean.schedulingCycles.length > 0) {
        array = JSON.parse(this.form.dynamicSchedulingBean.schedulingCycles)
      }
      for (let i = 0; i < this.form.dynamicSchedulingBean.cycleDays; i++) {
        let id
        if (array.length > i) {
          id = array[i]
        }
        this.cyclesModel.push({
          value: id,
          key: Date.now()
        })
      }
    },
    createCycle () {
      let array = []
      for (let i = 0; i < this.cyclesModel.length; i++) {
        array.push(this.cyclesModel[i].value)
      }
      this.form.dynamicSchedulingBean.schedulingCycles = JSON.stringify(array)
      this.cycleVisible = false
    },
    // 第一次时间
    firstBeginTimeChange (value) {
      this.form.freeSchedulingBean.beginTime = HHssFormatter(value)
    }
  }
}
</script>
<style lang="scss" scoped>
  .work-day{
    display: flex;
  }
</style>

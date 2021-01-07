<template>
  <div class="app-container">
    <div class="table-main">
      <!-- 操作 -->
      <div class="filter-container">
        <el-input clearable style="width: 150px;" v-model="listQuery.name" class="filter-item" placeholder="班次名称"></el-input>
        <el-button class="filter-item" type="primary" @click="handleSearch"  icon="el-icon-search">搜索</el-button>
        <el-button class="filter-item" type="primary" @click="handleRefresh"  icon="el-icon-refresh">刷新</el-button>
        <el-button class="filter-item" type="primary" v-has="['添加']" @click="handleCreate"  icon="el-icon-edit">添加</el-button>
        <el-button class="filter-item" type="primary" @click="handleh"  icon="el-icon-download" v-has="['导出']" >导出</el-button>
        <el-button class="filter-item" type="danger" v-has="['删除']" :loading = "deleteLoading" @click="handleDelete" :disabled="disabled" icon="el-icon-close">删除所选</el-button>
      </div>
      <el-table stripe style="width: 100%" max-height="600" :data="tableData" v-loading.body="listLoading" @selection-change="handleSelectionChange" element-loading-text="加载中..." border fit highlight-current-row>
        <el-table-column type="selection" width="40" fixed="left" v-if = "isShowColumnFormatter(['删除'])" ></el-table-column>
        <el-table-column label="班次名称" align="center" prop="name"></el-table-column>
        <el-table-column label="考勤时间" align="center" prop="workTimeAt"></el-table-column>
        <el-table-column fixed="right" v-if = "isShowColumnFormatter(['编辑'])"  label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button type="primary" @click="handleUpdate(scope.row)" size="mini">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination background  :page-sizes="[10,20,30, 50]" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.offset " :page-size="listQuery.limit" :total="total" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
      </div>
      <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="900px">
        <el-form :rules="formRules" ref="dataform" :model="form" size="small">
          <el-form-item prop="name">
            <span>班次名称&#x3000;</span>
            <el-input style="width: auto;" v-model="form.name"  placeholder="最多10个字符(中英文或数字)"></el-input>
          </el-form-item>
          <el-form-item>
            <span>一天内上下班的次数&#x3000;</span>
            <el-radio-group v-model="form.workNum" @change="workNumChange">
              <el-radio-button :label="1">一天一次上下班</el-radio-button>
              <el-radio-button :label="2">一天两次上下班</el-radio-button>
              <el-radio-button :label="3">一天三次上下班</el-radio-button>
            </el-radio-group>
            <el-checkbox @change="openPushCardChange" v-model="form.openPunchCardTime">打卡时段设置</el-checkbox>
            <el-checkbox @click="changeOne" v-model="form.openOverTime">加班规则设置</el-checkbox>
          </el-form-item>
          <el-form-item v-if="form.openOverTime">
          <el-tag  type="danger">三十分钟后才算加班  跨天加班需要提交申请</el-tag>
            <!-- <el-radio-group v-model="form.overTimeRule">
              <el-radio :label="1">以审批时间计算加班</el-radio><el-button style="border:none;color:#3399ee;margin-left:0.5rem" @click.native="(dialogVisible = true) && (num = 1)">详情</el-button>
              <el-radio style="margin-left:1.5rem" :label="2">审批后，以打卡时间计算加班</el-radio><el-button style="border:none;color:#3399ee;margin-left:0.5rem" @click.native="(dialogVisible = true) && (num = 2)">详情</el-button>
              <el-radio  style="margin-left:1.5rem" :label='3'>以打卡时间计算加班</el-radio><el-button style="border:none;color:#3399ee;margin-left:0.5rem" @click.native="(dialogVisible = true) && (num = 3)">详情</el-button>
            </el-radio-group> -->
          </el-form-item>
          <!-- 加班设置 -->
          <el-dialog
            :modal="false"
            title="详情"
            :visible.sync="dialogVisible"
            width="30%"
            >
            <div v-if="num === 1">
              <div>加班必须审批，加班时长以审批单为准</div>
              <!-- <div> 休息日：加班必须审批，加班时长以审批单为准</div>
              <div> 节假日：加班必须审批，加班时长以审批单为准</div> -->
            </div>
            <div v-if="num === 2">
              <div>加班必须审批，以打卡为准，但不能超过审批单时长。从最后一次下班后30分钟开始计算加班，最小加班时长30分钟</div><br>
              <!-- <div>休息日：加班必须审批，以打卡为准，但不能超过审批单时长。最小加班时长30分钟</div><br>
              <div>节假日：加班必须审批，以打卡为准，但不能超过审批单时长。最小加班时长30分钟</div> -->
            </div>
            <div v-if="num === 3">
              <div>加班无须审批，根据打卡时间计算加班时长，从最后一次下班后30分钟开始计算加班，最小加班时长30分钟</div><br>
              <!-- <div>休息日：加班无须审批，根据打卡时间计算加班时长，最小加班时长30分钟</div><br>
              <div>节假日：加班无须审批，根据打卡时间计算加班时长，最小加班时长30分钟</div> -->
            </div>
            <span slot="footer" class="dialog-footer">
              <!-- <el-button @click="dialogVisible = false">取 消</el-button> -->
              <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
            </span>
          </el-dialog>
          <el-form-item>
            <el-row :span="24">
              <el-col :span="2">
                第一次
              </el-col>
              <el-col :span="11">
                <span>上班: </span>
                <el-time-picker
                  style="width: 100px;"
                  :clearable="false"
                  v-model="firstBeginTime"
                  format="HH:mm"
                  value-format = "HH:mm"
                  @change="firstBeginTimeChange"
                >
                </el-time-picker>
                <span v-if="form.openPunchCardTime">
                  <el-select v-model="form.firstBeginMin" @change="firstBeginMinChange" style="width: 75px;">
                    <el-option
                      v-for="item in firstBeginOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                  <span>分钟前开始打卡</span>
                </span>
              </el-col>
              <el-col :span="11">
                <span>下班: </span>
                <el-time-picker
                  style="width: 100px;"
                  :clearable="false"
                  v-model="firstEndTime"
                  format="HH:mm"
                  value-format = "HH:mm"
                  @change="firstEndTimeChange"
                >
                </el-time-picker>
                <el-tag v-if="firstEnd" type="danger">次日</el-tag>
                <span v-if="form.openPunchCardTime">
                  <el-select v-model="form.firstEndMin" @change="firstEndMinChange"  style="width: 75px;">
                    <el-option
                      v-for="item in firstEndOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                  <span>分钟后结束打卡</span>
                </span>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item v-if="form.workNum === 2 || form.workNum === 3">
            <el-row :span="24">
              <el-col :span="2">
                第二次
              </el-col>
              <el-col :span="11">
                <span>上班: </span>
                <el-time-picker
                  style="width: 100px;"
                  :clearable="false"
                  v-model="secondBeginTime"
                  format="HH:mm"
                  value-format = "HH:mm"
                  @change="secondBeginTimeChange"
                >
                </el-time-picker>
                <el-tag v-if="secondStart" type="danger">次日</el-tag>
                <span v-if="form.openPunchCardTime">
                  <el-select v-model="form.secondBeginMin" @change="secondBeginMinChange" style="width: 75px;">
                    <el-option
                      v-for="item in secondBeginOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                  <span>分钟前开始打卡</span>
                </span>
              </el-col>
              <el-col :span="11">
                <span>下班: </span>
                <el-time-picker
                  style="width: 100px;"
                  :clearable="false"
                  v-model="secondEndTime"
                  format="HH:mm"
                  value-format = "HH:mm"
                  @change="secondEndTimeChange"
                >
                </el-time-picker>
                <el-tag v-if="secondEnd"  type="danger">次日</el-tag>
                <span v-if="form.openPunchCardTime">
                  <el-select v-model="form.secondEndMin" @change="secondEndMinChange" style="width: 75px;">
                    <el-option
                      v-for="item in secondEndOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                  <span>分钟后结束打卡</span>
                </span>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item v-if="form.workNum === 3">
            <el-row :span="24">
              <el-col :span="2">
                第三次
              </el-col>
              <el-col :span="11">
                <span>上班: </span>
                <el-time-picker
                  style="width: 100px;"
                  :clearable="false"
                  v-model="thirdBeginTime"
                  format="HH:mm"
                  value-format = "HH:mm"
                  @change="thirdBeginTimeChange"
                >
                </el-time-picker>
                <el-tag v-if="thirdStart" type="danger">次日</el-tag>
                <span v-if="form.openPunchCardTime">
                  <el-select v-model="form.thirdBeginMin" @change="thirdBeginMinChange" style="width: 75px;">
                    <el-option
                      v-for="item in thirdBeginOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                  <span>分钟前开始打卡</span>
                </span>
              </el-col>
              <el-col :span="11">
                <span>下班: </span>
                <el-time-picker
                  style="width: 100px;"
                  :clearable="false"
                  v-model="thirdEndTime"
                  format="HH:mm"
                  value-format = "HH:mm"
                  @change="thirdEndTimeChange"
                >
                </el-time-picker>
                <el-tag v-if="thirdEnd" type="danger">次日</el-tag>
                <span v-if="form.openPunchCardTime">
                  <el-select v-model="form.thirdEndMin"  @change="thirdEndMinChange"  style="width: 75px;">
                    <el-option
                      v-for="item in thirdEndOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                  <span>分钟后结束打卡</span>
                </span>
              </el-col>
            </el-row>
          </el-form-item>
          <!-- 休息时间 -->
          <el-form-item v-if="form.workNum === 1">
            <el-row :span="24">
              <el-col :span="4">
                <el-checkbox v-model="form.openRestTime" @change="openRestTimeChange">休息时间</el-checkbox>
              </el-col>
              <el-col v-if="form.openRestTime" :span="10">
                <span>休息开始: </span>
                <el-time-picker
                  style="width: 100px;"
                  :clearable="false"
                  v-model="restTimeStart"
                  format="HH:mm"
                  value-format = "HH:mm"
                >
                </el-time-picker>
              </el-col>
              <el-col v-if="form.openRestTime" :span="10">
                <span>休息结束: </span>
                <el-time-picker
                  style="width: 100px;"
                  :clearable="false"
                  v-model="restTimeEnd"
                  format="HH:mm"
                  value-format = "HH:mm"
                >
                </el-time-picker>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item>
            <span>合计工作时长{{time}}（考勤统计工作时长及请假出差外出统计，会以此时间为准）</span>
          </el-form-item>
          <el-form-item>
            <el-checkbox v-model="form.offDutyFreeCheck">下班不用打卡（开启后，下班不打卡也不会记作异常）</el-checkbox>
          </el-form-item>
          <el-form-item>
            迟到旷工设置
          </el-form-item>
          <el-form-item>
            <span>允许迟到分钟数</span>
            <el-input-number v-model="form.permitLateMinutes" controls-position="right"  :min="-1" :step="1"></el-input-number>
            <span>-1表示不开启</span>
          </el-form-item>
          <el-form-item>
            <span>严重迟到分钟数</span>
            <el-input-number v-model="form.seriousLateMinutes" controls-position="right"  :min="-1" :step="1"></el-input-number>
            <span>-1表示不开启</span>
          </el-form-item>
          <el-form-item>
            <span>旷工迟到分钟数</span>
            <el-input-number v-model="form.absentTime" controls-position="right" :min="-1" :step="1"></el-input-number>
            <span>-1表示不开启</span>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button :loading = "createLoading" v-if="dialogStatus=='create'" type="primary" @click="createData">保存</el-button>
          <el-button :loading = "updateLoading" v-else type="primary" @click="updateData">修改</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { timeFormatter, isShowColumnFormatter, HHssFormatter, NumToTimeFormatter, NumToHHssFormatter } from '@/utils/formatter.js'
import { httpGet, httpDelete, httpPost, httpPut } from '@/utils/restful'
import { getAIShifts, AIShifts } from '@/api/url'
import { checkAIName } from '@/utils/validator'
export default {
  data () {
    return {
      isOver: false,
      dialogVisible: false,
      num: 0,
      isShowColumnFormatter: isShowColumnFormatter,
      list: null,
      listLoading: true,
      createLoading: false,
      deleteLoading: false,
      updateLoading: false,
      timeFormatter: timeFormatter,
      listQuery: {
        name: undefined,
        offset: 1,
        limit: 10
      },
      tableData: [],
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑班次',
        create: '新增班次'
      },
      total: null,
      selectArrayId: [],
      disabled: true,
      firstBeginTime: '09:00',
      firstEndTime: '18:00',
      secondBeginTime: '14:00',
      secondEndTime: '18:00',
      thirdBeginTime: '14:00',
      thirdEndTime: '18:00',
      restTimeStart: '12:00',
      restTimeEnd: '13:00',
      time: '9小时0分钟',
      options: [
        {value: 0, label: '--'}
      ],
      firstBeginOptions: [
        {value: 0, label: '--'}
      ],
      firstEndOptions: [
        {value: 0, label: '--'}
      ],
      secondBeginOptions: [
        {value: 0, label: '--'}
      ],
      secondEndOptions: [
        {value: 0, label: '--'}
      ],
      thirdBeginOptions: [
        {value: 0, label: '--'}
      ],
      thirdEndOptions: [
        {value: 0, label: '--'}
      ],
      firstEnd: false,
      secondStart: false,
      secondEnd: false,
      thirdStart: false,
      thirdEnd: false,
      form: {
        id: undefined,
        name: undefined,
        workNum: 1,
        openPunchCardTime: false,
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
        openRestTime: false,
        restTimeStart: 720,
        restTimeEnd: 780,
        offDutyFreeCheck: false,
        permitLateMinutes: -1,
        seriousLateMinutes: -1,
        absentTime: -1,
        overTimeRule: 1,
        openOverTime: false
      },
      formRules: {
        name: [
          {required: true, trigger: 'blur', message: '不可为空'},
          {validator: checkAIName, trigger: 'blur'}
        ]
      },
      jsonData: [
        {
          title: '班次名称',
          key: 'name',
          type: 'text'
        },
        {
          title: '考勤时间',
          key: 'workTimeAt',
          type: 'text'
        }
        // ,
        // {
        //   title: 'Pic',
        //   key: 'pic',
        //   type: 'image',
        //   width: 80,
        //   height: 50
        // }
      ]
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    handleh () {
      let obj = JSON.parse(JSON.stringify(this.tableData))
      // obj.forEach((item, index) => {
      //   item.workDay = this.timeFormatterSort(item.workDay)
      // })
      this.table2excel(this.jsonData, obj, 'excel.xlsx')
    },
    changeOne () {
      if (this.form.openOverTim === false) {
        this.form.openOverTime = true
      } else {
        this.form.openOverTime = false
      }
    },
    fetchData () {
      this.listQuery = Object.assign(this.listQuery, {departmentId: this.$store.getters.departmentId})
      httpGet(getAIShifts, this.listQuery).then(res => {
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
    // 格式化数值
    formatterVal (val) {
      if (val > 720) val = 720
      let data = []
      for (let i = 1; i <= (val / 10); i++) {
        data.push({
          'value': i * 10,
          'label': i * 10
        })
      }
      return data
    },
    openPushOne () {
      // this.form.firstBeginMin = 0
      // this.form.firstEndMin = 0
      let flag = HHssFormatter(this.firstEndTime) - HHssFormatter(this.firstBeginTime)
      let val
      if (flag > 0) { val = 1440 - flag } else { val = Math.abs(flag) }
      this.firstBeginOptions = [...this.options, ...this.formatterVal(val)]
      this.firstEndOptions = this.firstBeginOptions
    },
    openPushTwo () {
      // this.form.firstBeginMin = 0
      // this.form.firstEndMin = 0
      // this.form.secondBeginMin = 0
      // this.form.secondEndMin = 0
      // 先判断第一个和第四个
      let flag1 = HHssFormatter(this.secondEndTime) - HHssFormatter(this.firstBeginTime)
      let flag2 = HHssFormatter(this.secondBeginTime) - HHssFormatter(this.firstEndTime)
      let val1, val2
      if (flag1 > 0) { val1 = 1440 - flag1 } else { val1 = Math.abs(flag1) }
      if (flag2 > 0) { val2 = flag2 } else { val2 = Math.abs(flag2) }
      this.firstBeginOptions = [...this.options, ...this.formatterVal(val1)]
      this.secondEndOptions = this.firstBeginOptions
      this.firstEndOptions = [...this.options, ...this.formatterVal(val2)]
      this.secondBeginOptions = this.firstEndOptions
    },
    openPushThree () {
      // this.form.firstBeginMin = 0
      // this.form.firstEndMin = 0
      // this.form.secondBeginMin = 0
      // this.form.secondEndMin = 0
      // this.form.thirdBeginMin = 0
      // this.form.thirdEndMin = 0
      // 先判断第一个和第四个
      let flag1 = HHssFormatter(this.thirdEndTime) - HHssFormatter(this.firstBeginTime)
      let flag2 = HHssFormatter(this.secondBeginTime) - HHssFormatter(this.firstEndTime)
      let flag3 = HHssFormatter(this.thirdBeginTime) - HHssFormatter(this.secondEndTime)
      let val1, val2, val3
      if (flag1 > 0) { val1 = 1440 - flag1 } else { val1 = Math.abs(flag1) }
      if (flag2 > 0) { val2 = flag2 } else { val2 = Math.abs(flag2) }
      if (flag3 > 0) { val3 = flag3 } else { val3 = Math.abs(flag3) }
      this.firstBeginOptions = [...this.options, ...this.formatterVal(val1)]
      this.thirdEndOptions = this.firstBeginOptions
      this.firstEndOptions = [...this.options, ...this.formatterVal(val2)]
      this.secondBeginOptions = this.firstEndOptions
      this.secondEndOptions = [...this.options, ...this.formatterVal(val3)]
      this.thirdBeginOptions = this.secondEndOptions
    },
    // 上班次数
    workNumChange (value) {
      this.firstEnd = false
      this.secondStart = false
      this.secondEnd = false
      this.thirdStart = false
      this.thirdEnd = false
      if (value === 1) {
        this.firstEndTime = '18:00'
        this.time = '9小时0分钟'
        // 判断是否开启打开时段设置
        if (this.form.openPunchCardTime) {
          this.openPushOne()
        }
      } else if (value === 2) {
        this.firstEndTime = '12:00'
        this.secondBeginTime = '14:00'
        this.secondEndTime = '18:00'
        this.time = '7小时0分钟'
        this.form.openRestTime = false
        if (this.form.openPunchCardTime) {
          this.openPushTwo()
        }
      } else if (value === 3) {
        this.form.openRestTime = false
        this.firstEndTime = '11:00'
        this.secondBeginTime = '12:00'
        this.secondEndTime = '15:00'
        this.thirdBeginTime = '16:00'
        this.thirdEndTime = '18:00'
        this.time = '7小时0分钟'
        if (this.form.openPunchCardTime) {
          this.openPushThree()
        }
      }
    },
    // 监听是否打开打开时间段
    openPushCardChange (value) {
      if (value) {
        if (this.form.workNum === 1) {
          this.openPushOne()
          // 两次上下班
        } else if (this.form.workNum === 2) {
          this.openPushTwo()
        } else {
          this.openPushThree()
        }
      }
    },
    restFlag () {
      // 正常情况下 没有次日的情况
      let start = HHssFormatter(this.restTimeStart) - HHssFormatter(this.firstBeginTime)
      let end = HHssFormatter(this.firstEndTime) - HHssFormatter(this.restTimeEnd)
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
        this.$message.error('休息时间应在工作时间之内,请注意设置休息时间段')
      }
    },
    // 判断休息时间段
    openRestTimeChange (value) {
      if (value) {
        this.restFlag()
      }
    },
    // 第一次时间
    firstBeginTimeChange (value) {
      let flag = HHssFormatter(this.firstEndTime) - HHssFormatter(value)
      // 判断是否开启打卡时段设置
      if (this.form.openPunchCardTime) {
        // 判断一天几次上下班
        if (this.form.workNum === 1) {
          this.openPushOne()
        } else if (this.form.workNum === 2) {
          this.openPushTwo()
        } else {
          this.openPushThree()
        }
      }
      // 判断是否具有休息时间
      if (this.form.openRestTime) {
        this.restFlag()
      }
      if (value === this.firstEndTime) {
        this.$message.error('两个时间点不能设置为同一时间')
        this.firstBeginTime = '09:00'
      } else if (flag > 0) {
        this.firstEnd = false
        this.secondStart = false
        this.secondEnd = false
        this.thirdStart = false
        this.thirdEnd = false
        if (this.form.openPunchCardTime) {
          let val = 1440 - flag
          this.firstBeginOptions = [...this.options, ...this.formatterVal(val)]
          this.firstEndOptions = this.firstBeginOptions
        }
      } else {
        this.firstEnd = true
        this.secondStart = true
        this.secondEnd = true
        this.thirdStart = true
        this.thirdEnd = true
        let val = Math.abs(flag)
        this.firstEndOptions = [...this.options, ...this.formatterVal(val)]
      }
    },
    firstEndTimeChange (value) {
      // 先判断是否打卡
      if (this.form.openPunchCardTime) {
        // 判断一天几次上下班
        if (this.form.workNum === 1) {
          this.openPushOne()
        } else if (this.form.workNum === 2) {
          this.openPushTwo()
        } else {
          this.openPushThree()
        }
      }
      // 判断是否具有休息时间
      if (this.form.openRestTime) {
        this.restFlag()
      }
      if (value === this.firstBeginTime) {
        this.$message.error('两个时间点不能设置为同一时间')
        if (this.form.workNum === 1) {
          this.firstEndTime = '18:00'
        } else if (this.form.workNum === 2) {
          this.firstEndTime = '12:00'
        } else {
          this.firstEndTime = '11:00'
        }
      } else if (HHssFormatter(value) - HHssFormatter(this.firstBeginTime) < 0) {
        this.firstEnd = true
        this.secondStart = true
        this.secondEnd = true
        this.thirdStart = true
        this.thirdEnd = true
      } else if (HHssFormatter(value) - HHssFormatter(this.firstBeginTime) > 0 && HHssFormatter(value) - HHssFormatter(this.secondBeginTime) > 0) {
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
      if (this.form.openPunchCardTime) {
        // 判断一天几次上下班
        if (this.form.workNum === 1) {
          this.openPushOne()
        } else if (this.form.workNum === 2) {
          this.openPushTwo()
        } else {
          this.openPushThree()
        }
      }
      if (this.firstEnd) {
        if (HHssFormatter(value) - HHssFormatter(this.firstBeginTime) >= 0) {
          this.$message.error('请设置的时间在24小时时间段之内')
        } else {
          this.secondStart = true
          this.secondEnd = true
          this.thirdStart = true
          this.thirdEnd = true
        }
      } else if (value === this.firstEndTime || value === this.secondEndTime) {
        this.$message.error('两个时间点不能设置同一时间')
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
        this.$message.error('请按时间顺序设置时间点')
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
      if (this.form.openPunchCardTime) {
        // 判断一天几次上下班
        if (this.form.workNum === 1) {
          this.openPushOne()
        } else if (this.form.workNum === 2) {
          this.openPushTwo()
        } else {
          this.openPushThree()
        }
      }
      if (this.secondStart) {
        if (HHssFormatter(value) - HHssFormatter(this.firstBeginTime) >= 0) {
          this.$message.error('请设置的时间在24小时时间段之内')
        } else {
          this.secondEnd = true
          this.thirdStart = true
          this.thirdEnd = true
        }
      } else if (value === this.secondBeginTime || value === this.thirdBeginTime) {
        this.$message.error('两个时间点不能设置同一时间')
        this.secondEndTime = '18:00'
      } else if (value === this.firstBeginTime) {
        this.$message.error('请按时间顺序设置时间点')
        this.secondEndTime = '18:00'
      } else if (HHssFormatter(value) - HHssFormatter(this.secondBeginTime) > 0 && HHssFormatter(value) - HHssFormatter(this.thirdBeginTime) > 0) {
        this.secondEnd = false
        this.thirdStart = true
        this.thirdEnd = true
      } else if (HHssFormatter(value) - HHssFormatter(this.secondBeginTime) < 0 && HHssFormatter(this.firstBeginTime) - HHssFormatter(value) < 0) {
        this.$message.error('请按时间顺序设置时间点')
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
      if (this.form.openPunchCardTime) {
        // 判断一天几次上下班
        if (this.form.workNum === 1) {
          this.openPushOne()
        } else if (this.form.workNum === 2) {
          this.openPushTwo()
        } else {
          this.openPushThree()
        }
      }
      if (this.secondEnd) {
        if (HHssFormatter(value) - HHssFormatter(this.firstBeginTime) >= 0) {
          this.$message.error('请设置的时间在24小时时间段之内')
        } else {
          this.thirdStart = true
          this.thirdEnd = true
        }
      } else if (value === this.secondEndTime || value === this.thirdEndTime) {
        this.$message.error('两个时间点不能设置同一时间')
        this.thirdBeginTime = '16:00'
      } else if (value === this.firstBeginTime) {
        this.$message.error('请按时间顺序设置时间点')
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
      if (this.form.openPunchCardTime) {
        // 判断一天几次上下班
        if (this.form.workNum === 1) {
          this.openPushOne()
        } else if (this.form.workNum === 2) {
          this.openPushTwo()
        } else {
          this.openPushThree()
        }
      }
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
    },
    // 监听打开时间
    firstBeginMinChange (value) {
      if (this.form.workNum === 1) {
        let flag = HHssFormatter(this.firstEndTime) - HHssFormatter(this.firstBeginTime)
        let val
        if (flag > 0) { val = 1440 - flag - value } else { val = Math.abs(flag) - value }
        this.firstEndOptions = [...this.options, ...this.formatterVal(val)]
      } else if (this.form.workNum === 2) {
        let flag = HHssFormatter(this.secondEndTime) - HHssFormatter(this.firstBeginTime)
        let val
        if (flag > 0) { val = 1440 - flag - value } else { val = Math.abs(flag) - value }
        this.secondEndOptions = [...this.options, ...this.formatterVal(val)]
      } else {
        let flag = HHssFormatter(this.thirdEndTime) - HHssFormatter(this.firstBeginTime)
        let val
        if (flag > 0) { val = 1440 - flag - value } else { val = Math.abs(flag) - value }
        this.thirdEndOptions = [...this.options, ...this.formatterVal(val)]
      }
    },
    firstEndMinChange (value) {
      if (this.form.workNum === 1) {
        let flag = HHssFormatter(this.firstEndTime) - HHssFormatter(this.firstBeginTime)
        let val
        if (flag > 0) { val = 1440 - flag - value } else { val = Math.abs(flag) - value }
        this.firstBeginOptions = [...this.options, ...this.formatterVal(val)]
      } else {
        let flag = HHssFormatter(this.secondBeginTime) - HHssFormatter(this.firstEndTime)
        let val
        if (flag > 0) { val = flag - value } else { val = 1440 - Math.abs(flag) - value }
        this.secondBeginOptions = [...this.options, ...this.formatterVal(val)]
      }
    },
    secondBeginMinChange (value) {
      let flag = HHssFormatter(this.secondBeginTime) - HHssFormatter(this.firstEndTime)
      let val
      if (flag > 0) { val = flag - value } else { val = 1440 - Math.abs(flag) - value }
      this.firstEndOptions = [...this.options, ...this.formatterVal(val)]
    },
    secondEndMinChange (value) {
      if (this.form.workNum === 2) {
        let flag = HHssFormatter(this.secondEndTime) - HHssFormatter(this.firstBeginTime)
        // console.log(flag)
        let val
        if (flag > 0) { val = 1440 - flag - value } else { val = Math.abs(flag) - value }
        this.firstBeginOptions = [...this.options, ...this.formatterVal(val)]
      } else {
        let flag = HHssFormatter(this.thirdBeginTime) - HHssFormatter(this.secondEndTime)
        let val
        if (flag > 0) { val = flag - value } else { val = 1440 - Math.abs(flag) - value }
        this.thirdBeginOptions = [...this.options, ...this.formatterVal(val)]
      }
    },
    thirdBeginMinChange (value) {
      let flag = HHssFormatter(this.thirdBeginTime) - HHssFormatter(this.secondEndTime)
      let val
      if (flag > 0) { val = flag - value } else { val = 1440 - Math.abs(flag) - value }
      this.secondEndOptions = [...this.options, ...this.formatterVal(val)]
    },
    thirdEndMinChange (value) {
      let flag = HHssFormatter(this.thirdEndTime) - HHssFormatter(this.firstBeginTime)
      let val
      if (flag > 0) { val = 1440 - flag - value } else { val = Math.abs(flag) - value }
      this.firstBeginOptions = [...this.options, ...this.formatterVal(val)]
    },
    // 重置form表单
    resetForm () {
      this.form = {
        id: undefined,
        name: undefined,
        workNum: 1,
        openPunchCardTime: false,
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
        openRestTime: false,
        restTimeStart: 720,
        restTimeEnd: 780,
        offDutyFreeCheck: false,
        permitLateMinutes: -1,
        seriousLateMinutes: -1,
        absentTime: -1,
        overTimeRule: 1,
        openOverTime: false
      }
    },
    handleCreate () {
      let self = this
      self.resetForm()
      self.dialogStatus = 'create'
      self.dialogFormVisible = true
      self.$nextTick(() => {
        self.$refs['dataform'].resetFields()
      })
    },
    handleUpdate (row) {
      httpGet(AIShifts + '/' + row.id)
        .then(res => {
          if (res.data.firstBeginTime !== null) this.firstBeginTime = NumToHHssFormatter(res.data.firstBeginTime)
          if (res.data.firstEndTime !== null) this.firstEndTime = NumToHHssFormatter(res.data.firstEndTime)
          if (res.data.secondBeginTime !== null) this.secondBeginTime = NumToHHssFormatter(res.data.secondBeginTime)
          if (res.data.secondEndTime !== null) this.secondEndTime = NumToHHssFormatter(res.data.secondEndTime)
          if (res.data.thirdBeginTime !== null) this.thirdBeginTime = NumToHHssFormatter(res.data.thirdBeginTime)
          if (res.data.thirdEndTime !== null) this.thirdEndTime = NumToHHssFormatter(res.data.thirdEndTime)
          if (res.data.restTimeStart !== null) this.restTimeStart = NumToHHssFormatter(res.data.restTimeStart)
          if (res.data.restTimeEnd !== null) this.restTimeEnd = NumToHHssFormatter(res.data.restTimeEnd)
          this.form = Object.assign({}, res.data)
          this.dialogStatus = 'update'
          this.dialogFormVisible = true
          this.$nextTick(() => {
            this.$refs.dataform.clearValidate()
          })
        }).catch(() => {})
    },
    // 搜索
    handleFilter () {
      this.listQuery.offset = 1
      this.fetchData()
    },
    // 新增
    createData () {
      this.$refs.dataform.validate((valid) => {
        if (valid) {
          this.createLoading = true
          let data = {
            overTimeRule: this.form.overTimeRule,
            openOverTime: this.form.openOverTime,
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
          // 判断人性化是否开启
          if (this.form.permitLateMinutes > this.form.seriousLateMinutes) {
            this.$message.error('严重迟到分钟数应大于允许迟到分钟数')
            this.createLoading = false
          } else if (this.form.absentTime < this.form.seriousLateMinutes) {
            this.$message.error('旷工迟到分钟数应大于严重迟到分钟数')
            this.createLoading = false
          } else {
            httpPost(AIShifts, data).then((res) => {
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
          }
        }
      })
    },
    // 修改
    updateData () {
      this.$refs.dataform.validate((valid) => {
        if (valid) {
          this.updateLoading = true
          let data = {
            id: this.form.id,
            overTimeRule: this.form.overTimeRule,
            openOverTime: this.form.openOverTime,
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
          // 判断人性化是否开启
          if (this.form.permitLateMinutes > this.form.seriousLateMinutes) {
            this.$message.error('严重迟到分钟数应大于允许迟到分钟数')
            this.updateLoading = false
          } else if (this.form.absentTime < this.form.seriousLateMinutes) {
            this.$message.error('旷工迟到分钟数应大于严重迟到分钟数')
            this.updateLoading = false
          } else {
            httpPut(AIShifts, data).then(res => {
              this.fetchData()
              this.dialogFormVisible = false
              setTimeout(() => { this.updateLoading = false }, 300)
              this.$message({
                message: res.message,
                type: 'success',
                duration: 4 * 1000
              })
            }).catch(() => {
              this.updateLoading = false
            })
          }
        }
      })
    },
    // 删除选中
    handleDelete () {
      this.$confirm('确认提交吗？', '提示', {})
        .then(() => {
          this.deleteLoading = true
          httpDelete(AIShifts, {ids: this.selectArrayId}).then(res => {
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
    // 刷新
    handleRefresh () {
      this.listQuery = {
        name: undefined,
        limit: 10,
        offset: 1
      }
      this.fetchData()
    },
    handleSearch () {
      this.listQuery.offset = 1
      this.fetchData()
    }
  }
}
</script>

<style lang="scss" scoped>
</style>

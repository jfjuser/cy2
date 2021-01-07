<template>
  <div class="app-container">
    <div class="table-main">
      <!-- 操作 -->
      <div class="filter-container">
        <el-input v-model="listQuery.userName" style="width: 100px;" :clearable="false" placeholder="姓名"></el-input>
        <el-date-picker
          v-model="time"
          :clearable="false"
          type="datetimerange"
          style="padding:0 15px;"
          value-format = "yyyy-MM-dd HH:mm:ss"
          :default-time="['00:00:00', '23:59:59']"
          range-separator="至"
          start-placeholder="开始日期"
          @change="changeTime"
          end-placeholder="结束日期">
        </el-date-picker>
        <el-button :disabled="filterDisabled" type="primary" @click="handleFilter" icon="el-icon-search">搜索</el-button>
        <el-button type="primary" @click="handleExport" icon="el-icon-download">导出</el-button>
        <el-button type="primary" @click="handleRefresh" icon="el-icon-refresh">刷新</el-button>
      </div>
      <div class="filter-container">
        <span class="filter-item">选择显示的列：</span>
        <el-checkbox class="filter-item" v-model="iscolumn.work1">上下班1</el-checkbox>
        <el-checkbox class="filter-item" v-model="iscolumn.work2">上下班2</el-checkbox>
        <el-checkbox class="filter-item" v-model="iscolumn.work3">上下班3</el-checkbox>
         <el-checkbox class="filter-item" v-model="iscolumn.overTime">加班</el-checkbox>
        <el-checkbox class="filter-item" v-model="iscolumn.commuteDay">出勤天数</el-checkbox>
        <el-checkbox class="filter-item" v-model="iscolumn.workShiftName">出勤班次</el-checkbox>
        <el-checkbox class="filter-item" v-model="iscolumn.restDay">休息天数</el-checkbox>
        <el-checkbox class="filter-item" v-model="iscolumn.workMin">工作时长(分钟)</el-checkbox>
        <el-checkbox class="filter-item" v-model="iscolumn.lateNum">迟到次数</el-checkbox>
        <el-checkbox class="filter-item" v-model="iscolumn.lateMin">迟到时长(分钟)</el-checkbox>
        <el-checkbox class="filter-item" v-model="iscolumn.seriouslyLateNum">严重迟到次数</el-checkbox>
        <el-checkbox class="filter-item" v-model="iscolumn.seriouslyLateMin">严重迟到时长(分钟)</el-checkbox>
        <el-checkbox class="filter-item" v-model="iscolumn.absenteeismLateDay">旷工迟到天数</el-checkbox>
        <el-checkbox class="filter-item" v-model="iscolumn.leaveEarlyNum">早退次数</el-checkbox>
        <el-checkbox class="filter-item" v-model="iscolumn.leaveEarlyMin">早退时长(分钟)</el-checkbox>
        <el-checkbox class="filter-item" v-model="iscolumn.beginNoPunchCard">上班缺卡次数</el-checkbox>
        <el-checkbox class="filter-item" v-model="iscolumn.endNoPunchCard">下班缺卡次数</el-checkbox>
        <el-checkbox class="filter-item" v-model="iscolumn.absenteeismDay">旷工天数</el-checkbox>
      </div>
      <el-table style="width: 100%" size="mini" @cell-click="cellClick" max-height="600" :data="tableData" v-loading.body="listLoading" element-loading-text="加载中..." border fit highlight-current-row>
        <el-table-column fixed="left" label="姓名" align="center" prop="userName"></el-table-column>
        <el-table-column label="部门" align="center" prop="departmentName"></el-table-column>
        <el-table-column label="日期" align="center">
          <template slot-scope="scope">
            {{timeFormatterSort(scope.row.workDay)}}
          </template>
        </el-table-column>
        <el-table-column label="上班1" align="center" v-if="iscolumn.work1">
          <el-table-column label="打卡时间" align="center" prop="firstBeginTime">
            <template slot-scope="scope">
              {{timeHourMinFormatter(scope.row.firstBeginTime)}}
            </template>
          </el-table-column>
          <el-table-column label="打卡结果" align="center" prop="firstBeginResult">
            <template slot-scope="scope">
              <el-button v-if="checkResult(scope.row.firstBeginResult)" type="text">{{formatterResult(scope.row.firstBeginResult, true)}}</el-button>
              <span v-else type="text">{{scope.row.firstBeginResult}}</span>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="下班1" align="center" v-if="iscolumn.work1">
          <el-table-column label="打卡时间" align="center" prop="firstEndTime">
            <template slot-scope="scope">
              {{timeHourMinFormatter(scope.row.firstEndTime)}}
            </template>
          </el-table-column>
          <el-table-column label="打卡结果" align="center" prop="firstEndResult">
            <template slot-scope="scope">
              <el-button v-if="checkResult(scope.row.firstEndResult)" type="text">{{formatterResult(scope.row.firstEndResult, false)}}</el-button>
              <span v-else type="text">{{scope.row.firstEndResult}}</span>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="上班2" align="center" v-if="iscolumn.work2">
          <el-table-column label="打卡时间" align="center" prop="secondBeginTime">
            <template slot-scope="scope">
              {{timeHourMinFormatter(scope.row.secondBeginTime)}}
            </template>
          </el-table-column>
          <el-table-column label="打卡结果" align="center" prop="secondBeginResult">
            <template slot-scope="scope">
              <el-button v-if="checkResult(scope.row.secondBeginResult)" type="text">{{formatterResult(scope.row.secondBeginResult, true)}}</el-button>
              <span v-else type="text">{{scope.row.secondBeginResult}}</span>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="下班2" align="center" v-if="iscolumn.work2">
          <el-table-column label="打卡时间" align="center" prop="secondEndTime">
            <template slot-scope="scope">
              {{timeHourMinFormatter(scope.row.secondEndTime)}}
            </template>
          </el-table-column>
          <el-table-column label="打卡结果" align="center" prop="secondEndResult">
            <template slot-scope="scope">
              <el-button v-if="checkResult(scope.row.secondEndResult)" type="text">{{formatterResult(scope.row.secondEndResult, false)}}</el-button>
              <span v-else type="text">{{scope.row.secondEndResult}}</span>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="上班3" align="center" v-if="iscolumn.work3">
          <el-table-column label="打卡时间" align="center" prop="thirdBeginTime">
            <template slot-scope="scope">
              {{timeHourMinFormatter(scope.row.thirdBeginTime)}}
            </template>
          </el-table-column>
          <el-table-column label="打卡结果" align="center" prop="thirdBeginResult">
            <template slot-scope="scope">
              <el-button v-if="checkResult(scope.row.thirdBeginResult)" type="text">{{formatterResult(scope.row.thirdBeginResult, true)}}</el-button>
              <span v-else type="text">{{scope.row.thirdBeginResult}}</span>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="下班3" align="center" v-if="iscolumn.work3">
          <el-table-column label="打卡时间" align="center" prop="thirdEndTime">
            <template slot-scope="scope">
              {{timeHourMinFormatter(scope.row.thirdEndTime)}}
            </template>
          </el-table-column>
          <el-table-column label="打卡结果" align="center" prop="thirdEndResult">
            <template slot-scope="scope">
              <el-button v-if="checkResult(scope.row.thirdEndResult)" type="text">{{formatterResult(scope.row.thirdEndResult, false)}}</el-button>
              <span v-else type="text">{{scope.row.thirdEndResult}}</span>
            </template>
          </el-table-column>
        </el-table-column>
         <el-table-column label="加班" align="center" v-if="iscolumn.overTime">
          <el-table-column label="加班时长(min)" align="center" prop="overTimeCount">
            <template slot-scope="scope">
              {{scope.row.overTimeCount}}
            </template>
          </el-table-column>
          <el-table-column label="打卡时间" align="center" prop="overTime">
            <template slot-scope="scope">
              {{timeHourMinFormatter(scope.row.overTime)}}
            </template>
          </el-table-column>
          <el-table-column label="设置时长" align="center">
            <template slot-scope="scope">
              <el-button type="text" size="mini" @click="setTimeLong(scope.row)">设置</el-button>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="出勤天数" align="center" prop="commuteDay" v-if="iscolumn.commuteDay"></el-table-column>
        <el-table-column label="出勤班次" align="center" prop="workShiftName" v-if="iscolumn.workShiftName"></el-table-column>
        <el-table-column label="休息天数" align="center" prop="restDay" v-if="iscolumn.restDay"></el-table-column>
        <el-table-column label="工作时长(分钟)" align="center" prop="workMin" v-if="iscolumn.workMin"></el-table-column>
        <el-table-column label="迟到次数" align="center" prop="lateNum" v-if="iscolumn.lateNum"></el-table-column>
        <el-table-column label="迟到时长(分钟)" align="center" prop="lateMin" v-if="iscolumn.lateMin"></el-table-column>
        <el-table-column label="严重迟到次数" align="center" prop="seriouslyLateNum" v-if="iscolumn.seriouslyLateNum"></el-table-column>
        <el-table-column label="严重迟到时长(分钟)" align="center" prop="seriouslyLateMin" v-if="iscolumn.seriouslyLateMin"></el-table-column>
        <el-table-column label="旷工迟到天数" align="center" prop="absenteeismLateDay" v-if="iscolumn.absenteeismLateDay"></el-table-column>
        <el-table-column label="早退次数" align="center" prop="leaveEarlyNum" v-if="iscolumn.leaveEarlyNum"></el-table-column>
        <el-table-column label="早退时长(分钟)" align="center" prop="leaveEarlyMin" v-if="iscolumn.leaveEarlyMin"></el-table-column>
        <el-table-column label="上班缺卡次数" align="center" prop="beginNoPunchCard" v-if="iscolumn.beginNoPunchCard"></el-table-column>
        <el-table-column label="下班缺卡次数" align="center" prop="endNoPunchCard" v-if="iscolumn.endNoPunchCard"></el-table-column>
        <el-table-column label="旷工天数" align="center" prop="absenteeismDay" v-if="iscolumn.absenteeismDay"></el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination background  :page-sizes="[10,20,30, 50]" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.offset " :page-size="listQuery.limit" :total="total" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
      </div>
       <el-dialog title="加班时间" :visible.sync="timeDialogVisible" width="30%">
          <el-input class="filter-item" v-model="overTimeCount" :clearable="false" placeholder="请输入加班时长(分钟)"></el-input>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="saveUpdate">确定</el-button>
          </div>
      </el-dialog>
      <el-dialog title="导出" :visible.sync="dialogExportVisible" width="30%">
        <el-form ref="exportForm" :model="exportForm" :rules="exportRules" autoCompete = "on" label-position="right" label-width="150px" >
          <el-form-item label="条数" prop="number">
            <el-select v-model="exportForm.number"  style="width:80%;">
              <el-option v-for="item in numberList" clearable :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogExportVisible = false">取消</el-button>
          <el-button type="primary" :loading="exportLoading" @click="exportData">保存</el-button>
        </div>
      </el-dialog>
      <el-dialog title="修改打卡结果" :visible.sync = "dialogAttendVisible" width="20%">
        <el-radio-group v-model="updateAttend.updateType" @change="contentChange" v-if="updateAttend.type === 1">
          <div><el-radio :label="0">正常</el-radio></div>
          <div style="margin-top: 10px;"><el-radio :label="1">迟到 <el-input v-model="lateNum" type="number" size="mini" style="width:80px;" :min="1"></el-input>分钟</el-radio></div>
          <div style="margin-top: 10px;"><el-radio :label="2">早退 <el-input v-model="earlyNum" type="number" size="mini" style="width:80px;" :min="1"></el-input>分钟</el-radio></div>
          <div style="margin-top: 10px;"><el-radio :label="3">缺卡</el-radio></div>
        </el-radio-group>
        <div v-if="updateAttend.type === 0">
          <p>请选择日期和时间</p>
          <p>
            <el-date-picker
              v-model="updateAttend.punchCardTime"
              type="datetime"
              placeholder="选择日期时间">
            </el-date-picker>
          </p>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogAttendVisible = false">取消</el-button>
          <el-button type="primary" @click="updateData">保存</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { timeFormatter, timeFormatterSort, timeHourMinFormatter } from '@/utils/formatter.js'
import { AIDailyCount, exportAIDailyCount, updateAIDailyCount } from '@/api/url'
import { httpGet, httpExport, httpPut } from '@/utils/restful'
import { dailyCountText } from '@/utils/helptext'
import Storage from '@/utils/storage'
export default {
  data () {
    return {
      time: [],
      filterDisabled: false,
      dialogExportVisible: false,
      timeDialogVisible: false, // 设置加班时长
      list: null,
      listLoading: true,
      updateLoading: false,
      timeFormatter: timeFormatter,
      timeFormatterSort: timeFormatterSort,
      dialogVisible: false,
      timeHourMinFormatter: timeHourMinFormatter,
      listQuery: {
        offset: 1,
        limit: 10,
        beginTime: undefined,
        endTime: undefined,
        userName: undefined
      },
      tableData: [],
      overTimeCount: undefined,
      total: null,
      numberList: [],
      exportLoading: false,
      exportForm: {
        number: 0
      },
      exportRules: {
        number: [
          {required: true, trigger: 'change', message: '不可为空'}
        ]
      },
      // 修改考勤
      dialogAttendVisible: false,
      updateAttend: {
        departmentId: this.$store.getters.departmentId,
        id: undefined,
        modify: undefined,
        content: undefined
      },
      lateNum: undefined,
      earlyNum: undefined,
      content: undefined,
      iscolumn: {
        work1: true,
        work2: true,
        work3: true,
        commuteDay: true,
        workShiftName: true,
        overTime: true,
        restDay: true,
        workMin: true,
        lateNum: true,
        lateMin: true,
        seriouslyLateNum: true,
        seriouslyLateMin: true,
        absenteeismLateDay: true,
        leaveEarlyNum: true,
        leaveEarlyMin: true,
        beginNoPunchCard: true,
        endNoPunchCard: true,
        absenteeismDay: true
      }
    }
  },
  created () {
    // 开始时间
    this.listQuery.beginTime = timeFormatterSort(new Date(new Date().setDate(1))) + ' 00:00:00'
    // 结束时间
    this.listQuery.endTime = timeFormatterSort(new Date()) + ' 23:59:59'
    this.time = [this.listQuery.beginTime, this.listQuery.endTime]
  },
  mounted () {
    this.fetchData()
    if (!Storage.get('dailyCountShowHelp')) {
      this.$nextTick(() => {
        this.$alert(dailyCountText, '帮助说明', {
          confirmButtonText: '知道了，不再提醒',
          // showClose: false,
          center: true,
          roundButton: true,
          callback: action => {
            if (action === 'confirm') {
              Storage.set('dailyCountShowHelp', 1)
            }
          }
        })
      })
    }
  },
  methods: {
    // 格式化打卡结果
    formatterResult (value, flag) {
      if (value !== null) {
        if (value === 0) {
          return '正常'
        } else if (value === -1) {
          return '缺卡'
        } else {
          if (flag) {
            return '迟到' + value + '分钟'
          } else {
            return '早退' + value + '分钟'
          }
        }
      } else {
        return '-'
      }
    },
    saveUpdate () {
      let obj = Object.assign(this.par, {
        overTimeCount: Number(this.overTimeCount)
      })
      httpPut(updateAIDailyCount, obj).then((res) => {
        this.$message({
          message: res.message,
          type: 'success',
          duration: 3000
        })
      }).catch(() => {})
      this.timeDialogVisible = false
    },
    // 设置加班时长
    setTimeLong (param) {
      this.par = param
      this.timeDialogVisible = true
    },
    checkResult (value) {
      return value !== null
    },
    // 监听搜索的时间
    changeTime (value) {
      if (value === null) {
        this.filterDisabled = true
      } else if (new Date(value[0]).getFullYear() === new Date(value[1]).getFullYear() && new Date(value[0]).getMonth() === new Date(value[1]).getMonth()) {
        this.listQuery.beginTime = value[0]
        this.listQuery.endTime = value[1]
        this.filterDisabled = false
      } else {
        this.filterDisabled = true
        this.time = [this.listQuery.beginTime, this.listQuery.endTime]
        this.$message.error('请填写一个月内的时间段进行搜索')
      }
    },
    // 刷新
    handleRefresh () {
      this.listQuery = {
        offset: 1,
        limit: 10,
        beginTime: timeFormatterSort(new Date(new Date().setDate(1))) + ' 00:00:00',
        endTime: timeFormatterSort(new Date()) + ' 23:59:59',
        userName: undefined
      }
      this.filterDisabled = false
      this.time = [this.listQuery.beginTime, this.listQuery.endTime]
      this.fetchData()
    },
    // 获取数据
    fetchData () {
      let self = this
      this.listQuery = Object.assign(this.listQuery, {
        departmentId: this.$store.getters.departmentId,
        userId: this.$store.getters.userId
      })
      httpGet(AIDailyCount, this.listQuery).then(res => {
        if (res.data === null) {
          self.tableData = []
          self.total = 0
          self.listLoading = false
        } else {
          self.tableData = res.data.rows
          self.total = res.data.total
          self.listLoading = false
        }
        this.numberList = []
        for (let i = 0; i <= this.total / 1000; i++) {
          this.numberList.push({
            id: i,
            name: `从${i * 1000}到${(i + 1) * 1000}条`
          })
        }
      }).catch(() => {
        self.listLoading = false
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
    // 搜索
    handleFilter () {
      this.listQuery.offset = 1
      this.fetchData()
    },
    // // 导出
    // handleExport () {
    //   this.dialogExportVisible = true
    //   this.$nextTick(() => {
    //     this.$refs['exportForm'].resetFields()
    //   })
    // },
    // 导出
    handleExport () {
      var obj = JSON.parse(JSON.stringify(this.listQuery))
      obj.offset = -1
      obj.limit = -1
      // let self = this
      obj = Object.assign(obj, {departmentId: this.$store.getters.departmentId})
      httpGet(AIDailyCount, obj).then(res => {
        // self.dialogExportVisible = true
        console.log(res.data.rows)
        const jsonData = res.data.rows
        let str = `姓名,部门,日期,上班打卡时间(1),打卡结果(1),下班打卡时间(1),打卡结果(1),上班打卡时间(2),打卡结果(2),下班打卡时间(2),打卡结果(2),上班打卡时间(3),打卡结果(3),下班打卡时间(3),打卡结果(3),加班时长(min),打卡时间,出勤天数,出勤班次,休息天数,工作时长(min),迟到次数,迟到时长(min),严重迟到次数,严重迟到时长(min),旷工迟到天数,早退次数,早退时长(min),上班缺卡次数,下班缺卡次数,旷工天数\n`
        for (let i = 0; i < jsonData.length; i++) {
          for (let item in jsonData[i]) {
            console.log(item)
            if (item === 'id' || item === 'departmentId' || item === 'type' || item === 'aiUserId' || item === 'workShiftId') {
            } else {
              if (item === 'workDay') jsonData[i][item] = this.timeFormatterSort(jsonData[i][item])
              if (item === 'firstBeginTime' || item === 'firstEndTime' || item === 'secondBeginTime' || item === 'secondEndTime' || item === 'thirdBeginTime' || item === 'thirdEndTime' || item === 'overTime') jsonData[i][item] = this.timeHourMinFormatter(jsonData[i][item])
              if (item === 'firstBeginResult' || item === 'firstEndResult' || item === 'secondBeginResult' || item === 'secondEndResult' || item === 'thirdBeginResult' || item === 'thirdEndResult') jsonData[i][item] = this.formatterResult(jsonData[i][item])
              if (jsonData[i][item] === null) jsonData[i][item] = '' // 如果结果为null 则显示 空格
              str += `${jsonData[i][item] + '\t'},`
            }
          }
          str += '\n'
        }
        let url = 'data:text/csv;charset=utf-8,\ufeff' + encodeURIComponent(str)
        let link = document.createElement('a')
        link.href = url
        link.download = 'daySheet.csv' // 导出excel的名字
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }).catch(() => {})
      // this.$nextTick(() => {
      //   this.$refs['exportForm'].resetFields()
      // })
    },
    exportData () {
      this.$refs.exportForm.validate((valid) => {
        if (valid) {
          this.exportLoading = true
          let data = Object.assign({
            departmentId: this.$store.getters.departmentId
          }, this.exportForm)
          data = Object.assign(data, this.listQuery)
          httpExport(exportAIDailyCount, data).then((res) => {
            this.dialogExportVisible = false
            setTimeout(() => { this.exportLoading = false }, 300)
          }).catch(() => {
            this.exportLoading = false
          })
        }
      })
    },
    // 修改打开结果
    cellClick (row, column) {
      if (
        (column['property'] === 'firstBeginResult' && this.checkResult(row.firstBeginResult)) ||
        (column['property'] === 'firstEndResult' && this.checkResult(row.firstEndResult)) ||
        (column['property'] === 'secondBeginResult' && this.checkResult(row.secondBeginResult)) ||
        (column['property'] === 'secondEndResult' && this.checkResult(row.secondEndResult)) ||
        (column['property'] === 'thirdBeginResult' && this.checkResult(row.thirdBeginResult)) ||
        (column['property'] === 'thirdEndResult' && this.checkResult(row.thirdEndResult))
      ) {
        this.updateAttend.id = row.id
        this.updateAttend.modify = column.property
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
      } else {
        return false
      }
    },
    contentChange (value) {
      if (value === 0 || value === 3) {
        this.lateNum = undefined
        this.earlyNum = undefined
      } else if (value === 1) {
        this.earlyNum = undefined
      } else if (value === 2) {
        this.lateNum = undefined
      }
    },
    // 修改
    updateData () {
      this.updateLoading = true
      if (this.updateAttend.type === 1) {
        if (this.updateAttend.updateType === undefined) {
          this.$message.error('请先选择修改结果')
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
      }
      httpPut(updateAIDailyCount, this.updateAttend)
        .then(res => {
          this.fetchData()
          this.dialogAttendVisible = false
          setTimeout(() => { this.updateLoading = false }, 300)
          this.$message.success(res.message)
        }).catch(() => {
          this.updateLoading = false
        })
    }
  }
}
</script>
<style lang="scss" scoped>
  .text{
    font-size: 14px;
    padding: 5px;
  }
  .table-expand {
    font-size: 0;
    label {
      width: 90px;
      color: #99a9bf;
    }
    .el-form-item {
      margin-right: 0;
      margin-bottom: 0;
      width: 50%;
    }
  }
</style>

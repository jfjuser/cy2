<template>
  <div class="app-container">
    <div class="table-main">
      <!-- 操作 -->
      <div class="filter-container">
        <el-input class="filter-item" v-model="listQuery.userName" style="width: 150px;" :clearable="false" placeholder="姓名"></el-input>
        <el-input class="filter-item" v-model="listQuery.departmentName" style="width: 100px;" :clearable="false" :placeholder="themeType === 3 ? '班级' :'部门名'"></el-input>
         <el-date-picker
            :clearable="false"
            class="filter-item"
            v-model="listQuery.time"
            type="date"
             @change="changeTime"
            placeholder="起始时间">
          </el-date-picker>
        <el-button class="filter-item" :disabled="filterDisabled" type="primary" @click="handleFilter" icon="el-icon-search">搜索</el-button>
        <el-button class="filter-item" type="primary" v-has="['导出']"  @click="handleExport" icon="el-icon-download">导出</el-button>
        <el-button class="filter-item" type="primary" @click="handleRefresh" icon="el-icon-refresh">刷新</el-button>
        <el-button class="filter-item" type="primary" @click="isClick = true" icon="el-icon-edit">设置考勤默认起始时间</el-button>
      <el-tag type="success">月统计的起点，如果填的是15号，那么月统计则是搜索月份15号到次月14号</el-tag>
      </div>
      <el-dialog title="设置时间" :visible.sync="isClick">
        <el-form  autoCompete = "on" label-position="right" label-width="150px" >
          <el-form-item label="起始日期" required>
            <el-input required v-model="showTime" placeholder="请填写起始日期" min="1" max="31" type="number"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="isClick = false">取消</el-button>
          <el-button type="primary" @click="queTime">保存</el-button>
        </div>
      </el-dialog>
      <el-table stripe style="width: 100%" size="mini" max-height="600" :data="tableData" v-loading.body="listLoading" element-loading-text="加载中..." border fit highlight-current-row>
        <el-table-column fixed="left" label="姓名" align="center" prop="userName"></el-table-column>
        <el-table-column v-if="!(isShowColumnFormatter(['有为学校']))" label="部门" align="center" prop="departmentName"></el-table-column>
        <el-table-column v-if="isShowColumnFormatter(['有为学校'])" label="学校" align="center" prop="departmentName"></el-table-column>
        <el-table-column v-if="isShowColumnFormatter(['有为学校'])" label="班级" align="center" prop="departmentName"></el-table-column>
        <el-table-column label="日期" align="center">
          <template slot-scope="scope">
            {{timeFormatterSort(scope.row.workDay)}}
          </template>
        </el-table-column>
        <el-table-column label="出勤天数" align="center" prop="commuteDay"></el-table-column>
        <el-table-column label="休息天数" align="center" prop="restDay"></el-table-column>
        <el-table-column label="工作时长" align="center" prop="workMin">
          <template slot-scope="scope">
            {{timeDuration(scope.row.workMin * 60)}}
          </template>
        </el-table-column>
        <el-table-column label="迟到次数" align="center" prop="lateNum"></el-table-column>
        <el-table-column label="迟到时长(分钟)" align="center" prop="lateMin"></el-table-column>
        <el-table-column label="严重迟到次数" align="center" prop="seriouslyLateNum"></el-table-column>
        <el-table-column label="严重迟到时长(分钟)" align="center" prop="seriouslyLateMin"></el-table-column>
        <el-table-column label="旷工迟到天数" align="center" prop="absenteeismLateDay"></el-table-column>
        <el-table-column label="早退次数" align="center" prop="leaveEarlyNum"></el-table-column>
        <el-table-column label="加班时长(分钟)" align="center" prop="overTimeCount"></el-table-column>
        <el-table-column label="早退时长(分钟)" align="center" prop="leaveEarlyMin"></el-table-column>
        <el-table-column label="上班缺卡次数" align="center" prop="beginNoPunchCard"></el-table-column>
        <el-table-column label="下班缺卡次数" align="center" prop="endNoPunchCard"></el-table-column>
        <el-table-column label="旷工天数" align="center" prop="absenteeismDay"></el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination background  :page-sizes="[10,20,30, 50]" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.offset " :page-size="listQuery.limit" :total="total" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
      </div>
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
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { timeFormatter, timeFormatterDayEnd1, isShowColumnFormatter, timeYearMonthFormatter, timeFormatterSort, timeDuration, timeHourMinFormatter } from '@/utils/formatter.js'
import { AIMonthlyCount, setMonthTime, getMonthTime, exportAIMonthlyCount } from '@/api/url'
import { httpGet, httpPut, httpExport } from '@/utils/restful'

export default {
  data () {
    return {
      time: [],
      isClick: false,
      isShowColumnFormatter: isShowColumnFormatter,
      filterDisabled: false,
      dialogExportVisible: false,
      list: null,
      listLoading: true,
      updateLoading: false,
      timeFormatter: timeFormatter,
      timeDuration: timeDuration,
      dialogVisible: false,
      showTime: 1,
      timeFormatterDayEnd1: timeFormatterDayEnd1,
      timeFormatterSort: timeFormatterSort,
      timeYearMonthFormatter: timeYearMonthFormatter,
      timeHourMinFormatter: timeHourMinFormatter,
      listQuery: {
        offset: 1,
        limit: 10,
        time: timeFormatterDayEnd1(new Date(new Date())) + '-' + '01',
        departmentName: undefined,
        // endTime: undefined,
        userName: undefined
      },
      tableData: [],
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
      }
    }
  },
  computed: {
    ...mapGetters([
      'themeType'
    ])
  },
  created () {
    httpGet(getMonthTime + '/' + this.$store.getters.departmentId).then((res) => {
      console.log(res)
      if (res.data.attendanceDate !== 0) {
        this.showTime = res.data.attendanceDate
        if (this.showTime !== null) {
          let time = this.showTime >= 10 ? this.showTime : '0' + this.showTime
          this.listQuery.time = timeFormatterDayEnd1(new Date(new Date())) + '-' + time
        }
      } else {
        this.listQuery.time = timeFormatterDayEnd1(new Date(new Date())) + '-' + '01'
      }
    }).catch(() => {})
    // 开始时间
    //  let time = this.showTime >= 10 ? this.showTime : '0' + this.showTime
    // this.listQuery.time = this.listQuery.time.split('-')[0] + '-' + this.listQuery.time.split('-')[1] + '-' + time
    // if (localStorage.getItem('department') === this.$store.getters.departmentId) {
    //   this.listQuery.time = localStorage.getItem('time')
    // } else {
    //   this.listQuery.time = timeFormatterSort(new Date(new Date().setDate(1)))
    // }
  },
  mounted () {
    this.fetchData()
  },
  methods: {
    // 监听搜索的时间
    changeTime (value) {
      this.listQuery.time = timeFormatterSort(value)
      localStorage.setItem('time', this.listQuery.time)
      localStorage.setItem('department', this.$store.getters.departmentId)
      // this.listQuery.time = timeFormatterSort(new Date(new Date(value).setDate(1)))
    },
    // 刷新
    handleRefresh () {
      this.listQuery = {
        offset: 1,
        limit: 10,
        time: this.listQuery.time,
        userName: undefined
      }
      this.filterDisabled = false
      this.fetchData()
    },
    // 设置考勤起始时间
    queTime () {
      let departmentId = Number(this.$store.getters.departmentId)
      let attendanceDate = Number(this.showTime)
      httpPut(setMonthTime + '/' + attendanceDate + '/' + departmentId).then((res) => {
        this.$message.success('设置成功')
        this.isClick = false
        let time = this.showTime >= 10 ? this.showTime : '0' + this.showTime
        // this.listQuery.time = timeFormatterDayEnd1(new Date(new Date())) + '-' + time
        this.listQuery.time = this.listQuery.time.split('-')[0] + '-' + this.listQuery.time.split('-')[1] + '-' + time
      }).catch(() => {})
    },
    // 获取数据
    fetchData () {
      let self = this
      this.listQuery = Object.assign(this.listQuery, {departmentId: this.$store.getters.departmentId})
      httpGet(AIMonthlyCount, this.listQuery).then(res => {
        if (res.data === null) {
          self.tableData = []
          self.total = 0
          self.listLoading = false
        } else {
          self.tableData = res.data.rows
          if (self.isShowColumnFormatter(['有为学校']) === true) {
            self.tableData.map((item) => {
              item.school = self.$store.getters.depName
            })
          }
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
      httpGet(AIMonthlyCount, obj).then(res => {
        // self.dialogExportVisible = true
        console.log(res.data.rows)
        const jsonData = res.data.rows
        let str = `姓名,部门,日期,出勤天数,休息天数,工作时长(min),迟到次数,迟到时长 (min),严重迟到次数,严重迟到时长(min),旷工迟到天数,早退次数,加班时长(min),早退时长(min),上班缺卡次数,下班缺卡次数,旷工天数\n`
        for (let i = 0; i < jsonData.length; i++) {
          for (let item in jsonData[i]) {
            console.log(item)
            if (item === 'id' || item === 'departmentId' || item === 'aiUserId') {
            } else {
              if (item === 'workDay') jsonData[i][item] = this.timeFormatterSort(jsonData[i][item])
              if (item === 'workMin') jsonData[i][item] = this.timeDuration(jsonData[i][item] * 60)
              if (jsonData[i][item] === null) jsonData[i][item] = '' // 如果结果为null 则显示 空格
              str += `${jsonData[i][item] + '\t'},`
            }
          }
          str += '\n'
        }
        let url = 'data:text/csv;charset=utf-8,\ufeff' + encodeURIComponent(str)
        let link = document.createElement('a')
        link.href = url
        link.download = 'monthlySheet.csv' // 导出excel的名字
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
          httpExport(exportAIMonthlyCount, data).then((res) => {
            this.dialogExportVisible = false
            setTimeout(() => { this.exportLoading = false }, 300)
          }).catch(() => {
            this.exportLoading = false
          })
        }
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

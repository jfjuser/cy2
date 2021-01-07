<template>
  <div class="app-container">
    <div class="table-main">
      <!-- 操作 -->
      <div class="filter-container">
        <el-input v-model="listQuery.userName" style="width: 150px;" :clearable="false" placeholder="姓名"></el-input>
         <el-date-picker
            :clearable="false"
            v-model="listQuery.time"
            type="month"
             @change="changeTime"
            placeholder="选择月">
          </el-date-picker>
        <el-button :disabled="filterDisabled" type="primary" @click="handleFilter" icon="el-icon-search">搜索</el-button>
        <el-button type="primary" @click="handleExport" icon="el-icon-download">导出</el-button>
        <el-button type="primary" @click="handleRefresh" icon="el-icon-refresh">刷新</el-button>
      </div>
      <div class="filter-container">
        <span class="filter-item">选择显示的列：</span>
        <el-checkbox class="filter-item" v-model="iscolumn.lateNum">迟到次数</el-checkbox>
        <el-checkbox class="filter-item" v-model="iscolumn.lateMin">迟到时长(分钟)</el-checkbox>
        <el-checkbox class="filter-item" v-model="iscolumn.seriouslyLateNum">严重迟到次数</el-checkbox>
        <el-checkbox class="filter-item" v-model="iscolumn.seriouslyLateMin">严重迟到时长(分钟)</el-checkbox>
        <el-checkbox class="filter-item" v-model="iscolumn.absenteeismLateDay">旷工迟到天数</el-checkbox>
        <el-checkbox class="filter-item" v-model="iscolumn.leaveEarlyNum">早退次数</el-checkbox>
        <el-checkbox class="filter-item" v-model="iscolumn.overTimeCount">加班时长</el-checkbox>
        <el-checkbox class="filter-item" v-model="iscolumn.leaveEarlyMin">早退时长(分钟)</el-checkbox>
        <el-checkbox class="filter-item" v-model="iscolumn.beginNoPunchCard">上班缺卡次数</el-checkbox>
        <el-checkbox class="filter-item" v-model="iscolumn.endNoPunchCard">下班缺卡次数</el-checkbox>
        <el-checkbox class="filter-item" v-model="iscolumn.absenteeismDay">旷工天数</el-checkbox>
      </div>
      <el-table style="width: 100%" size="mini" max-height="600" :data="tableData" v-loading.body="listLoading" element-loading-text="加载中..." border fit highlight-current-row>
        <el-table-column fixed="left" label="姓名" align="center" prop="userName"></el-table-column>
        <el-table-column label="部门" align="center" prop="departmentName"></el-table-column>
        <el-table-column label="日期" align="center">
          <template slot-scope="scope">
            {{timeYearMonthFormatter(scope.row.workDay)}}
          </template>
        </el-table-column>
        <el-table-column label="出勤天数" align="center" prop="commuteDay"></el-table-column>
        <el-table-column label="休息天数" align="center" prop="restDay"></el-table-column>
        <el-table-column label="工作时长" align="center" prop="workMin">
          <template slot-scope="scope">
            {{timeDuration(scope.row.workMin * 60)}}
          </template>
        </el-table-column>
        <el-table-column label="迟到次数" align="center" prop="lateNum" v-if="iscolumn.lateNum"></el-table-column>
        <el-table-column label="迟到时长(分钟)" align="center" prop="lateMin" v-if="iscolumn.lateMin"></el-table-column>
        <el-table-column label="严重迟到次数" align="center" prop="seriouslyLateNum" v-if="iscolumn.seriouslyLateNum"></el-table-column>
        <el-table-column label="严重迟到时长(分钟)" align="center" prop="seriouslyLateMin" v-if="iscolumn.seriouslyLateMin"></el-table-column>
        <el-table-column label="旷工迟到天数" align="center" prop="absenteeismLateDay" v-if="iscolumn.absenteeismLateDay"></el-table-column>
        <el-table-column label="早退次数" align="center" prop="leaveEarlyNum" v-if="iscolumn.leaveEarlyNum"></el-table-column>
        <el-table-column label="加班时长(分钟)" align="center" prop="overTimeCount" v-if="iscolumn.overTimeCount"></el-table-column>
        <el-table-column label="早退时长(分钟)" align="center" prop="leaveEarlyMin" v-if="iscolumn.leaveEarlyMin"></el-table-column>
        <el-table-column label="上班缺卡次数" align="center" prop="beginNoPunchCard" v-if="iscolumn.beginNoPunchCard"></el-table-column>
        <el-table-column label="下班缺卡次数" align="center" prop="endNoPunchCard" v-if="iscolumn.endNoPunchCard"></el-table-column>
        <el-table-column label="旷工天数" align="center" prop="absenteeismDay" v-if="iscolumn.absenteeismDay"></el-table-column>
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
import { timeFormatter, timeYearMonthFormatter, timeFormatterSort, timeDuration, timeHourMinFormatter } from '@/utils/formatter.js'
import { AIMonthlyCount, exportAIMonthlyCount } from '@/api/url'
import { httpGet, httpExport } from '@/utils/restful'
import { monthlyCountText } from '@/utils/helptext'
import Storage from '@/utils/storage'
export default {
  data () {
    return {
      time: [],
      filterDisabled: false,
      dialogExportVisible: false,
      list: null,
      listLoading: true,
      updateLoading: false,
      timeFormatter: timeFormatter,
      timeDuration: timeDuration,
      dialogVisible: false,
      timeYearMonthFormatter: timeYearMonthFormatter,
      timeHourMinFormatter: timeHourMinFormatter,
      listQuery: {
        offset: 1,
        limit: 10,
        time: undefined,
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
      },
      iscolumn: {
        lateNum: true,
        lateMin: true,
        seriouslyLateNum: true,
        seriouslyLateMin: true,
        absenteeismLateDay: true,
        overTimeCount: true,
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
    this.listQuery.time = timeFormatterSort(new Date(new Date().setDate(1)))
  },
  mounted () {
    this.fetchData()
    if (!Storage.get('monthlyCountShowHelp')) {
      this.$nextTick(() => {
        this.$alert(monthlyCountText, '帮助说明', {
          confirmButtonText: '知道了，不再提醒',
          // showClose: false,
          center: true,
          roundButton: true,
          callback: action => {
            if (action === 'confirm') {
              Storage.set('monthlyCountShowHelp', 1)
            }
          }
        })
      })
    }
  },
  methods: {
    // 监听搜索的时间
    changeTime (value) {
      this.listQuery.time = timeFormatterSort(new Date(new Date(value).setDate(1)))
    },
    // 刷新
    handleRefresh () {
      this.listQuery = {
        offset: 1,
        limit: 10,
        time: timeFormatterSort(new Date(new Date().setDate(1))),
        userName: undefined
      }
      this.filterDisabled = false
      this.fetchData()
    },
    // 获取数据
    fetchData () {
      let self = this
      this.listQuery = Object.assign(this.listQuery, {
        departmentId: this.$store.getters.departmentId,
        userId: this.$store.getters.userId
      })
      httpGet(AIMonthlyCount, this.listQuery).then(res => {
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
      httpGet(AIMonthlyCount, obj).then(res => {
        // self.dialogExportVisible = true
        console.log(res.data.rows)
        const jsonData = res.data.rows
        let str = `姓名,部门,日期,出勤天数,休息天数,工作时长(min),迟到次数,迟到时长 (min),严重迟到次数,严重迟到时长(min),旷工迟到天数,早退次数,加班时长(min),早退时长(min),上班缺卡次数,下班缺卡次数,旷工天数\n`
        for (let i = 0; i < jsonData.length; i++) {
          for (let item in jsonData[i]) {
            console.log(item)
          //   if (item === 'id' || item === 'departmentId' || item === 'aiUserId') {
          //   } else {
          //     if (item === 'workDay') jsonData[i][item] = this.timeFormatterSort(jsonData[i][item])
          //     if (item === 'workMin') jsonData[i][item] = this.timeDuration(jsonData[i][item] * 60)
          //     if (jsonData[i][item] === null) jsonData[i][item] = '' // 如果结果为null 则显示 空格
          //     str += `${jsonData[i][item] + '\t'},`
          //   }
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

<template>
  <div >
    <div class="table-main">
      <div class="filter-container">
        <span class="filter-item">班次说明：</span>
        <el-tag class="filter-item" v-for="(item, index) in workShift" :key="index" :type="buttonType[index]" size="mini">{{item.name}}</el-tag>
        <span class="filter-item">排班周期：</span>
        <el-tag class="filter-item" size="mini" :type="buttonType[0]">{{workSchedulingName}}</el-tag>
        <el-date-picker class="filter-item" size="mini" @change="changeDate" v-model="listQuery.workDate" format="yyyy 年 MM 月" value-format="yyyy-MM" type="month" :editable="false" :clearable="false" placeholder="选择月"></el-date-picker>
        <el-button class="filter-item" @click="createData" :loading="createLoading" type="primary" size="mini">保存</el-button>
        <el-button class="filter-item" @click="exportData" :loading="exportLoading" type="primary" size="mini">导出</el-button>
      </div>
      <!-- 合计的时候使用 show-summary :summary-method = "getSummaries"   -->
      <el-table  @cell-click="cellClick" :header-cell-style="{background:'#f3f4f6'}" style="width: 100%;" size="mini" max-height="600" :data="tableData" v-loading.body="listLoading" element-loading-text="加载中..." border fit highlight-current-row>
        <el-table-column v-for="(item, index) in list" :key="index" :fixed="item.name === 'userName'" :label="item.date" align="center" :prop="item.name">
          <template slot-scope="scope">
            <span v-if="item.name !== 'userName'">{{workShiftFormatter(scope.row[item.name])}}</span>
            <span v-else>{{scope.row.userName}}</span>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog size="mini" title="排班" append-to-body :visible.sync="dialogVisible" width="300px">
        <el-tabs v-model="type" type="border-card">
          <el-tab-pane label="按天排班" name="first">
            <div v-for="(item, index) in workShift" :key="index" style="text-align: center;margin-bottom: 10px;">
              <el-button style="width: 80%;" @click="itemDayClick(item)" :type="buttonType[index]" size="mini">{{item.name}}</el-button>
            </div>
          </el-tab-pane>
          <el-tab-pane label="按周期排班" name="second">
            <div style="text-align: center;margin-bottom: 10px;">
              <el-button style="width: 80%;" :type="buttonType[0]" @click="weekClick()" size="mini">{{workSchedulingName}}</el-button>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-dialog>
    </div>
  </div>
</template>
<script>
/**
* 排班
*/
import { DayAndWeekFormatter } from '@/utils/formatter.js'
import { AIAttendGroupShifts, exportAIAttendGroupShifts } from '@/api/url'
import { httpGet, httpPost, httpExport } from '@/utils/restful'
export default {
  name: 'Schedule',
  props: {
    id: {
      type: Number,
      required: true
    }
  },
  watch: {
    id (curVal) {
      this.listQuery.workCheckGroupId = curVal
      this.fetchData()
    }
  },
  data () {
    return {
      dialogVisible: false,
      createLoading: false,
      exportLoading: false,
      listQuery: {
        workDate: new Date().getFullYear() + '-' + ((new Date().getMonth() + 1) > 10 ? (new Date().getMonth() + 1) : '0' + (new Date().getMonth() + 1)),
        workCheckGroupId: this.id
      },
      buttonType: ['primary', 'success', 'warning', 'danger', 'info'],
      tableData: [],
      listLoading: true,
      list: [],
      workShift: [],
      workSchedulingName: '',
      schedulingCycles: undefined,
      // 排班
      type: 'first',
      row: {},
      column: {}
    }
  },
  methods: {
    // 修改日期
    changeDate (value) {
      this.list = DayAndWeekFormatter(value)
      this.fetchData()
      this.$forceUpdate()
    },
    // 格式化表格数据
    workShiftFormatter (value) {
      if (value === null || value === undefined) {
        return ''
      } else {
        let data = {}
        if (this.workShift) {
          this.workShift.forEach(item => {
            if (item.id === value) {
              data = item
            }
          })
          return data.name
        } else {
          return ''
        }
      }
    },
    // 获取数据
    fetchData () {
      httpGet(AIAttendGroupShifts, this.listQuery)
        .then(res => {
          console.log(res.data, 'res.data.workShiftIdAndNameDtos')
          this.tableData = []
          this.workShift = res.data.workShiftIdAndNameDtos
          this.schedulingCycles = res.data.schedulingCycles
          this.workSchedulingName = res.data.workSchedulingName
          let infoDto = res.data.workCycleRecordDetailInfoDtos
          for (let i = 0; i < infoDto.length; i++) {
            // 获取到人
            const data = infoDto[i]
            // 遍历排班记录
            const info = {
              aiUserId: data.aiUserId,
              userName: data.userName
            }
            for (let j = 0; j < data.workCycleRecordDateInfoDtos.length; j++) {
              const works = data.workCycleRecordDateInfoDtos[j]
              let day = new Date(works.workDate).getDate()
              Object.assign(info, {
                ['name' + day]: works.workShiftId
              })
            }
            this.tableData.push(info)
          }
          this.listLoading = false
        }).catch(() => { this.listLoading = false })
    },
    // 点击单元格
    cellClick (row, column) {
      let day = new Date(this.listQuery.workDate + '-' + (parseInt(column['property'].replace(/[^0-9]/ig, '')) > 10 ? parseInt(column['property'].replace(/[^0-9]/ig, '')) : '0' + parseInt(column['property'].replace(/[^0-9]/ig, '')))).getTime()
      let now = new Date().getTime()
      // console.log(day)
      // console.log(now)
      if (now > day) {
        this.$message.error('无法修改已过排班！')
      } else {
        this.row = row
        this.column = column
        this.dialogVisible = true
      }
    },
    // 按天排班
    itemDayClick (item) {
      this.$set(this.row, this.column['property'], item.id)
      this.dialogVisible = false
    },
    // 按周期排班
    weekClick () {
      let arr = JSON.parse(this.schedulingCycles)
      this.$confirm('是否确定按此周期进行排班？', '提示', {})
        .then(() => {
          this.dialogVisible = false
          let now = parseInt(this.column['property'].replace(/[^0-9]/ig, ''))
          let num = this.calcTime(this.listQuery.workDate)
          // console.log(now, num)
          for (let i = 0; i <= (num - now); i++) {
            this.$set(this.row, 'name' + (now + i), arr[i % arr.length])
          }
        }).catch(() => {})
    },
    // 计算时间
    calcTime (time) {
      let year = parseInt(time.split('-')[0])
      let month = parseInt(time.split('-')[1])
      let now = new Date(year, month, 0)
      return now.getDate()
    },
    // 合计的时候使用 计算
    getSummaries () {
      // console.log('ss')
      // const { columns, data } = param
      // console.log(columns)
      // console.log(data)
    },
    // 保存
    createData () {
      this.createLoading = true
      let workCycleRecordInsertDto = []
      for (let i = 0; i < this.tableData.length; i++) {
        const element = this.tableData[i]
        let workCycleRecordDateDtos = []
        for (let [key, value] of Object.entries(element)) {
          if (key.indexOf('name') === 0) {
            let now = parseInt(key.replace(/[^0-9]/ig, '')) >= 10 ? parseInt(key.replace(/[^0-9]/ig, '')) : '0' + parseInt(key.replace(/[^0-9]/ig, ''))
            workCycleRecordDateDtos.push({
              workDate: this.listQuery.workDate + '-' + now,
              workShiftId: value
            })
          }
        }
        workCycleRecordInsertDto.push({
          aiUserId: element.aiUserId,
          workCycleRecordDateInfoDtos: workCycleRecordDateDtos
        })
      }
      let data = {
        workCheckGroupId: this.listQuery.workCheckGroupId,
        workCycleRecordInsertDto: workCycleRecordInsertDto
      }
      httpPost(AIAttendGroupShifts, data)
        .then(res => {
          this.createLoading = false
          this.$message.success(res.message)
        }).catch(() => {
          this.createLoading = false
        })
    },
    // 导出排班
    exportData () {
      this.$confirm('确认导出当前选中月的排班表？', '提示', {})
        .then(() => {
          this.exportLoading = true
          let data = {
            year: this.listQuery.workDate.split('-')[0],
            month: this.listQuery.workDate.split('-')[1],
            groupId: this.listQuery.workCheckGroupId
          }
          httpExport(exportAIAttendGroupShifts, data)
            .then(() => {
              this.exportLoading = false
            }).catch(() => {
              this.exportLoading = false
            })
        }).catch(() => {})
    }
  },
  mounted () {
    this.fetchData()
  },
  created () {
    this.listQuery.workCheckGroupId = this.id
    // 获取当前表头
    this.list = DayAndWeekFormatter(this.listQuery.workDate)
  }
}
</script>

<template>
  <div class="app-container">
    <div class="table-main">
      <!-- 操作 -->
      <div class="filter-container">
        <el-input class="filter-item" v-model="listQuery.userName" style="width: 150px;" :clearable="false" placeholder="姓名"></el-input>
        <el-date-picker
          class="filter-item"
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
        <el-button class="filter-item" :disabled="filterDisabled" type="primary" @click="handleFilter" icon="el-icon-search">搜索</el-button>
        <el-button class="filter-item" type="primary" @click="handleRefresh" icon="el-icon-refresh">刷新</el-button>
        <!-- <el-button class="filter-item" type="danger" :loading = "deleteLoading" @click="handleDelete" :disabled="disabled" icon="el-icon-close">删除所选</el-button> -->
      </div>
      <el-table style="width: 100%" max-height="600" :data="tableData"  @selection-change="handleSelectionChange" v-loading.body="listLoading" element-loading-text="加载中..." border fit highlight-current-row>
        <!-- <el-table-column type="selection" width="40" fixed="left" ></el-table-column> -->
        <el-table-column label="姓名" align="center" prop="userName"></el-table-column>
        <el-table-column label="考勤时间" align="center" prop="workDay">
          <template slot-scope="scope">
            {{timeFormatterSort(scope.row.workDay)}}
          </template>
        </el-table-column>
        <el-table-column label="类型" align="center" prop="type">
          <template slot-scope="scope">
            {{cardTypeFormatter(scope.row.type)}}
          </template>
        </el-table-column>
        <el-table-column label="详情" align="center" prop="workModify"></el-table-column>
        <el-table-column label="操作时间" align="center" prop="updateAt">
          <template slot-scope="scope">
            {{timeFormatter(scope.row.updateAt)}}
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination background  :page-sizes="[10,20,30, 50]" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.offset " :page-size="listQuery.limit" :total="total" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { timeFormatter, timeFormatterSort, cardTypeFormatter } from '@/utils/formatter.js'
import { AIWriteOff } from '@/api/url'
import { httpGet } from '@/utils/restful'
import { writeOffText } from '@/utils/helptext'
import Storage from '@/utils/storage'
export default {
  data () {
    return {
      time: [],
      filterDisabled: false,
      dialogExportVisible: false,
      deleteLoading: false,
      disabled: true,
      selectArrayId: [],
      list: null,
      listLoading: true,
      timeFormatter: timeFormatter,
      timeFormatterSort: timeFormatterSort,
      cardTypeFormatter: cardTypeFormatter,
      listQuery: {
        offset: 1,
        limit: 10,
        beginTime: undefined,
        endTime: undefined,
        userName: undefined
      },
      tableData: [],
      total: null
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
    if (!Storage.get('writeOffShowHelp')) {
      this.$nextTick(() => {
        this.$alert(writeOffText, '帮助说明', {
          confirmButtonText: '知道了，不再提醒',
          // showClose: false,
          center: true,
          roundButton: true,
          callback: action => {
            if (action === 'confirm') {
              Storage.set('writeOffShowHelp', 1)
            }
          }
        })
      })
    }
  },
  methods: {
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
        id: this.$store.getters.userId
      })
      httpGet(AIWriteOff, this.listQuery).then(res => {
        if (res.data === null) {
          self.tableData = []
          self.total = 0
          self.listLoading = false
        } else {
          self.tableData = res.data.rows
          self.total = res.data.total
          self.listLoading = false
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
    }
    // 删除选中
    // handleDelete () {
    //   this.$confirm('确认提交吗？', '提示', {})
    //     .then(() => {
    //       this.deleteLoading = true
    //       httpDelete(deleteAIWriteOff, {ids: this.selectArrayId}).then(res => {
    //         this.deleteLoading = false
    //         this.fetchData()
    //         this.$message({
    //           type: 'success',
    //           message: res.message,
    //           duration: 4 * 1000
    //         })
    //       }).catch(() => {
    //         this.deleteLoading = false
    //       })
    //     }).catch(() => {})
    // }
  }
}
</script>

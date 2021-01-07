<template>
  <div class="app-container">
    <div class="table-main">
      <div class="filter-container">
        <el-input  class="filter-item" style="width:150px;" v-model="listQuery.departmentName" clearable placeholder="部门名称"></el-input>
        <el-input  class="filter-item" style="width:150px;" v-model="listQuery.localName" clearable placeholder="通道名称"></el-input>
        <el-input  class="filter-item" style="width:150px;" v-model="listQuery.mac" clearable placeholder="MAC地址"></el-input>
        <el-input  class="filter-item" style="width:100px;" type="number" v-model="listQuery.minIndex" :min="0" placeholder="最小掉线次数"></el-input>
        <el-date-picker
          class="filter-item"
          v-model="time"
          type="datetimerange"
          style="padding:0 15px;"
          value-format = "yyyy-MM-dd HH:mm:ss"
          :default-time="['00:00:00', '23:59:59']"
          range-separator="至"
          start-placeholder="开始日期"
          @change="changeTime"
          end-placeholder="结束日期">
        </el-date-picker>
        <el-select class="filter-item" style="width:100px;" v-model="listQuery.transportType" placeholder="通讯模式">
          <el-option v-for="item of isTransportType" :key="item.valueNo" :label="item.valueName" :value="item.valueNo"></el-option>
        </el-select>
        <el-select class="filter-item" style="width:80px;" v-model="listQuery.group" placeholder="分区时间">
          <el-option v-for="item of dateType" :key="item.valueNo" :label="item.valueName" :value="item.valueNo"></el-option>
        </el-select>
        <el-select class="filter-item" style="width:150px;" v-model="listQuery.type" placeholder="异常原因">
          <el-option v-for="item of cameraOfflineType" :key="item.valueNo" :label="item.valueName" :value="item.valueNo"></el-option>
        </el-select>
        <el-button class="filter-item" type="primary"   @click="handleFilter" icon="el-icon-search">搜索</el-button>
        <el-button class="filter-item" type="primary"   @click="handleRefresh" icon="el-icon-refresh">刷新</el-button>
        <el-button class="filter-item" type="primary" v-has="['导出']"  @click="handleExport" icon="el-icon-download">导出</el-button>
      </div>
      <el-table stripe :header-cell-style="{background:'#f3f4f6'}" style="width: 100%"   max-height="600" :data="tableData" v-loading.body="listLoading"  element-loading-text="加载中..." border fit highlight-current-row>
        <el-table-column label="部门名称" align="center" prop="departmentName"></el-table-column>
        <el-table-column label="代理商名称" align="center" prop="parentName"></el-table-column>
        <el-table-column label="通道名称" align="center" prop="localName"></el-table-column>
        <el-table-column label="MAC地址" align="center" prop="mac"></el-table-column>
        <el-table-column label="掉线次数" align="center" prop="index"></el-table-column>
        <el-table-column label="离线总时长" align="center" prop="sumOffLineTime">
          <template slot-scope="scope">
            {{timeDuration(scope.row.sumOffLineTime)}}
          </template>
        </el-table-column>
        <el-table-column label="分区时间" align="center" prop="time"></el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination background  :page-sizes="[10,20,30,50]" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.offset " :page-size="listQuery.limit" :total="total" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { dateType, cameraOfflineType, isTransportType } from '@/utils/selectAble.js'
import { timeFormatter, timeFormatterSort, timeDuration } from '@/utils/formatter.js'
// import { getOfflineCamera } from '@/api/remoteUpgrade'
import { httpGet, httpExport } from '@/utils/restful'
import { getOfflineCameraStatist, exportOfflineCameraStatist } from '@/api/url'
export default {
  data () {
    return {
      listLoading: true,
      listQuery: {
        offset: 1,
        limit: 10,
        departmentName: undefined,
        localName: undefined,
        mac: undefined,
        minIndex: undefined,
        transportType: undefined,
        group: 3,
        type: undefined,
        startTime: timeFormatterSort(new Date(new Date().setDate(1))) + ' 00:00:00',
        endTime: timeFormatterSort(new Date()) + ' 23:59:59'
      },
      timeFormatter: timeFormatter,
      timeFormatterSort: timeFormatterSort,
      timeDuration: timeDuration,
      dateType: dateType,
      cameraOfflineType: cameraOfflineType,
      isTransportType: isTransportType,
      dialogExportVisible: false,
      filterDisabled: false,
      tableData: [],
      total: null,
      time: []
    }
  },
  created () {
    this.time = [this.listQuery.startTime, this.listQuery.endTime]
    this.fetchData()
  },
  methods: {
    handleRefresh () {
      this.listQuery = {
        offset: 1,
        limit: 10,
        departmentName: undefined,
        localName: undefined,
        mac: undefined,
        minIndex: undefined,
        transportType: undefined,
        group: 3,
        type: undefined,
        startTime: timeFormatterSort(new Date(new Date().setDate(1))) + ' 00:00:00',
        endTime: timeFormatterSort(new Date()) + ' 23:59:59'
      }
      this.filterDisabled = false
      this.time = [this.listQuery.startTime, this.listQuery.endTime]
      this.fetchData()
    },
    // 导出
    handleExport () {
      httpExport(exportOfflineCameraStatist, this.listQuery).then(() => {
      }).catch(() => {
        this.$message.error('导出失败')
      })
    },
    fetchData () {
      this.listLoading = true
      this.listQuery = Object.assign(this.listQuery, {departmentId: this.$store.getters.departmentId})
      httpGet(getOfflineCameraStatist, this.listQuery).then(res => {
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
    // 监听搜索的时间
    changeTime (value) {
      if (value === null) {
        this.filterDisabled = true
      } else if (new Date(value[0]).getFullYear() === new Date(value[1]).getFullYear() && new Date(value[0]).getMonth() === new Date(value[1]).getMonth()) {
        this.listQuery.startTime = value[0]
        this.listQuery.endTime = value[1]
        this.filterDisabled = false
      } else if (new Date(value[0]).getFullYear() && new Date(value[1]).getFullYear() && new Date(value[0]).getMonth() && new Date(value[1]).getMonth()) {
        this.listQuery.beginTime = value[0]
        this.listQuery.endTime = value[1]
        this.filterDisabled = false
      } else {
        this.filterDisabled = true
        this.time = [this.listQuery.startTime, this.listQuery.endTime]
        // this.$message.error('请填写一个月内的时间段进行搜索')
        this.$message.error('请重新搜索')
      }
    },
    // 搜索
    handleFilter () {
      this.listQuery.offset = 1
      this.fetchData()
    },
    handleSizeChange (val) {
      this.listQuery.limit = val
      this.fetchData()
    },
    handleCurrentChange (val) {
      this.listQuery.offset = val
      this.fetchData()
    }
  }
}
</script>

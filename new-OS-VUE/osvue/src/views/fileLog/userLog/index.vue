<template>
  <div class="app-container">
    <div class="table-main">
      <div class="filter-container">
        <el-select clearable v-model="listQuery.type"  class="filter-item" style="width:120px" placeholder="类型">
          <el-option v-for="(item, index) in typeArr" :key="index" :label="item.typeName" :value="item.id">
            {{ item.typeName }}
          </el-option>
        </el-select>
        <el-input  class="filter-item" style="width:150px;" v-model="listQuery.userName" placeholder="账号名"></el-input>
        <el-date-picker
          clearable
          v-model="time"
          @change="changeTime"
          class="filter-item"
          type="datetimerange"
          style="padding:0 15px;width:380px"
          value-format = "yyyy-MM-dd HH:mm:ss"
          :default-time="['00:00:00', '23:59:59']"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
        <el-button class="filter-item" type="primary" :disabled="filterDisabled"  @click="handleFilter" icon="el-icon-search">搜索</el-button>
        <el-button class="filter-item" type="primary"   @click="handleRefresh" icon="el-icon-refresh">刷新</el-button>
        <el-button class="filter-item" type="primary" @click="handleh"  icon="el-icon-download" v-has="['导出']" >导出</el-button>
      </div>
      <el-table stripe :header-cell-style="{background:'#f3f4f6'}" style="width: 100%"   max-height="600" :data="tableData" v-loading.body="listLoading"  element-loading-text="加载中..." border fit highlight-current-row>
        <el-table-column label="用户名" align="center" prop="userName"></el-table-column>
        <el-table-column label="重要数据(注意保密!)" align="center" v-if = "isShowColumnFormatter(['重要数据'])" prop="operation"></el-table-column>
        <el-table-column label="功能" align="center" prop="resume"></el-table-column>
        <el-table-column label="操作" align="center" prop="type">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.type === 1">查询</el-tag>
            <el-tag v-if="scope.row.type === 2" type="success">添加</el-tag>
            <el-tag v-if="scope.row.type === 3" type="info">修改</el-tag>
            <el-tag v-if="scope.row.type === 4" type="danger">删除</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作时间" align="center" prop="createAt">
          <template slot-scope="scope">
            {{timeFormatter(scope.row.createAt)}}
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination background  :page-sizes="[10,20,30,50]" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.offset " :page-size="listQuery.limit" :total="total" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { isShowColumnFormatter, timeFormatter, timeFormatterSort } from '@/utils/formatter.js'
import { httpGet } from '@/utils/restful'
import { UserLog } from '@/api/url'
export default {
  data () {
    return {
      listLoading: true,
      timeFormatterSort: timeFormatterSort,
      isShowColumnFormatter: isShowColumnFormatter,
      filterDisabled: false,
      listQuery: {
        offset: 1,
        limit: 10,
        type: undefined,
        departmentId: this.$store.getters.departmentId,
        beginTime: undefined,
        endTime: undefined,
        userName: undefined
      },
      timeFormatter: timeFormatter,
      tableData: [],
      total: null,
      localList: [],
      time: [],
      typeArr: [
        {
          id: 1,
          typeName: '查询'
        },
        {
          id: 2,
          typeName: '新增'
        },
        {
          id: 3,
          typeName: '修改'
        },
        {
          id: 4,
          typeName: '删除'
        }
      ],
      jsonData: [
        {
          title: '用户名',
          key: 'userName',
          type: 'text'
        },
        {
          title: '重要数据(注意保密!)',
          key: 'operation',
          type: 'text'
        },
        {
          title: '功能',
          key: 'resume',
          type: 'text'
        },
        {
          title: '操作时间',
          key: 'createAt',
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
      // this.isShowColumnFormatter(['重要数据'])
      let obj = JSON.parse(JSON.stringify(this.tableData))
      let obj1 = JSON.parse(JSON.stringify(this.jsonData))
      obj1.splice(1, 1)
      this.jsonData = this.isShowColumnFormatter(['重要数据']) ? this.jsonData : obj1
      obj.forEach((item, index) => {
        item.createAt = this.timeFormatter(item.createAt)
      })
      this.table2excel(this.jsonData, obj, 'excel.xlsx')
    },
    // 监听搜索的时间
    changeTime (value) {
      if (value === null) {
        this.filterDisabled = true
      } else if (new Date(value[0]).getFullYear() === new Date(value[1]).getFullYear() && new Date(value[0]).getMonth() === new Date(value[1]).getMonth()) {
        this.listQuery.beginTime = value[0]
        this.listQuery.endTime = value[1]
        this.filterDisabled = false
      } else if (new Date(value[0]).getFullYear() && new Date(value[1]).getFullYear() && new Date(value[0]).getMonth() && new Date(value[1]).getMonth()) {
        this.listQuery.beginTime = value[0]
        this.listQuery.endTime = value[1]
        this.filterDisabled = false
      } else {
        this.filterDisabled = true
        this.time = [this.listQuery.beginTime, this.listQuery.endTime]
        // this.$message.error('请填写一个月内的时间段进行搜索')
        this.$message.error('请重新搜索')
      }
    },
    handleRefresh () {
      this.listQuery = {
        offset: 1,
        limit: 10,
        departmentId: this.$store.getters.departmentId,
        offlineInterval: undefined,
        beginTime: undefined,
        endTime: undefined,
        mac: undefined
      }
      this.time = []
      this.fetchData()
    },
    fetchData () {
      this.listQuery.beginTime = timeFormatterSort(new Date(new Date().setDate(1))) + ' 00:00:00'
      this.listQuery.endTime = timeFormatterSort(new Date()) + ' 23:59:59'
      this.time = [this.listQuery.beginTime, this.listQuery.endTime]
      this.listLoading = true
      httpGet(UserLog, this.listQuery).then(res => {
        if (res.data === null || res.data.rows === null) {
          this.tableData = []
          this.total = 0
        } else {
          this.tableData = res.data.rows
          this.total = res.data.total
        }
        this.listLoading = false
        this.loadAll()
      }).catch(() => {
        this.listLoading = false
      })
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

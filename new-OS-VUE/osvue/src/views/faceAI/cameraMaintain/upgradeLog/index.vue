<template>
  <div class="app-container">
    <div class="table-main">
      <!-- 操作 -->
      <div class="filter-container">
        <el-button class="filter-item" type="primary" @click="fetchData" icon="el-icon-refresh">刷新</el-button>
        <el-button class="filter-item" type="primary" @click="handleh"  icon="el-icon-download" v-has="['导出']" >导出</el-button>
      </div>
      <el-table stripe :header-cell-style="{background:'#f3f4f6'}" style="width: 100%" max-height="600" :data="tableData" v-loading.body="listLoading"  element-loading-text="加载中..." border fit highlight-current-row>
        <el-table-column label="相机MAC" align="center" prop="mac"></el-table-column>
        <el-table-column label="任务类型" align="center" prop="type">
          <template slot-scope="scope">
            {{taskTypeFormatter(scope.row.type)}}
          </template>
        </el-table-column>
        <el-table-column label="任务状态" align="center" prop="isSuccess">
          <template slot-scope="scope">
            {{isSuccessFormatter(scope.row.isSuccess)}}
          </template>
        </el-table-column>
        <el-table-column label="任务时间" align="center" prop="taskAt">
          <template slot-scope="scope">
            {{timeFormatter(scope.row.taskAt)}}
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
import { taskTypeFormatter, isSuccessFormatter, timeFormatter } from '@/utils/formatter.js'
import { getUpgradeLog } from '@/api/url'
import { httpGet } from '@/utils/restful'
export default {
  data () {
    return {
      list: null,
      listLoading: true,
      listQuery: {
        offset: 1,
        limit: 10
      },
      tableData: [],
      taskTypeFormatter: taskTypeFormatter,
      isSuccessFormatter: isSuccessFormatter,
      timeFormatter: timeFormatter,
      total: null,
      jsonData: [
        {
          title: '相机MAC',
          key: 'mac',
          type: 'text'
        },
        {
          title: '任务类型',
          key: 'type',
          type: 'text'
        },
        {
          title: '任务状态',
          key: 'isSuccess',
          type: 'text'
        },
        {
          title: '任务时间',
          key: 'taskAt',
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
      obj.forEach((item, index) => {
        item.type = this.taskTypeFormatter(item.type)
        item.isSuccess = this.isSuccessFormatter(item.isSuccess)
        item.taskAt = this.timeFormatter(item.taskAt)
        // item.sex = this.sexFormatter(item.sex)
        // item.sex = this.sexFormatter(item.sex)
        // item.sex = this.sexFormatter(item.sex)
      })
      this.table2excel(this.jsonData, obj, 'excel.xlsx')
    },
    fetchData () {
      httpGet(getUpgradeLog, this.listQuery).then(res => {
        if (res.data === null || res.data.row === null) {
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
    }
  }
}
</script>

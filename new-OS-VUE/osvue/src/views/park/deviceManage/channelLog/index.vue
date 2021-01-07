<template>
  <div class="app-container">
    <div class="table-main">
      <div class="filter-container">
        <el-button class="filter-item" type="primary"   @click="fetchData" icon="el-icon-refresh">刷新</el-button>
        <el-button class="filter-item" type="primary" @click="handleh"  icon="el-icon-download" v-has="['导出']" >导出</el-button>
      </div>
      <el-table stripe :header-cell-style="{background:'#f3f4f6'}" style="width: 100%"   max-height="600" :data="tableData" v-loading.body="listLoading"  element-loading-text="加载中..." border fit highlight-current-row>
        <el-table-column label="通道名称" align="center" prop="localName"></el-table-column>
        <el-table-column label="类型" align="center" prop="item"></el-table-column>
        <el-table-column label="时间" align="center" prop="createAt">
          <template slot-scope="scope">
            {{timeFormatter(scope.row.createAt)}}
          </template>
        </el-table-column>
        <el-table-column label="详情" align="center" prop="remarks"></el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination background  :page-sizes="[10,20,30,50]" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.offset " :page-size="listQuery.limit" :total="total" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { timeFormatter } from '@/utils/formatter.js'
import { getDeviceLogs } from '@/api/url'
import { httpGet } from '@/utils/restful'
export default {
  data () {
    return {
      listLoading: true,
      listQuery: {
        offset: 1,
        limit: 10,
        type: undefined
      },
      timeFormatter: timeFormatter,
      tableData: [],
      total: null,
      jsonData: [
        {
          title: '通道名称',
          key: 'localName',
          type: 'text'
        },
        {
          title: '类型',
          key: 'item',
          type: 'text'
        },
        {
          title: '时间',
          key: 'createAt',
          type: 'text'
        },
        {
          title: '详情',
          key: 'remarks',
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
  mounted () {
    this.fetchData()
  },
  methods: {
    handleh () {
      let obj = JSON.parse(JSON.stringify(this.tableData))
      obj.forEach((item, index) => {
        item.createAt = this.timeFormatter(item.createAt)
      })
      this.table2excel(this.jsonData, obj, 'excel.xlsx')
    },
    fetchData () {
      this.listLoading = true
      this.listQuery = Object.assign(this.listQuery, {id: this.$store.getters.departmentId})
      httpGet(getDeviceLogs + this.$store.getters.departmentId, this.listQuery).then(res => {
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
    }
  }
}
</script>

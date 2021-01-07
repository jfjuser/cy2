<template>
  <div class="app-container">
    <div class="table-main">
      <!-- 操作 -->
      <div class="filter-container">
        <el-button class="filter-item" type="primary"  @click="handleRefresh" icon="el-icon-refresh">刷新</el-button>
        <el-button class="filter-item" type="primary" @click="handleh"  icon="el-icon-download" v-has="['导出']" >导出</el-button>
      </div>
      <el-table stripe :header-cell-style="{background:'#f3f4f6'}" style="width: 100%" max-height="600" :data="tableData" v-loading.body="listLoading"  element-loading-text="加载中..." border fit highlight-current-row>
        <el-table-column label="通道编号" align="center" prop="localId"></el-table-column>
        <el-table-column label="通道名称" align="center" prop="localName"></el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination background  :page-sizes="[10,20,30, 50]" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.offset " :page-size="listQuery.limit" :total="total" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { getBoxLocal } from '@/api/url'
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
      total: null,
      jsonData: [
        {
          title: '通道编号',
          key: 'localId',
          type: 'text'
        },
        {
          title: '通道名称',
          key: 'localName',
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
      this.table2excel(this.jsonData, obj, 'excel.xlsx')
    },
    fetchData () {
      let self = this
      httpGet(getBoxLocal + '/' + this.$store.getters.departmentId, self.listQuery).then(res => {
        if (res.data === null || res.data.rows === null) {
          self.tableData = []
          self.total = 0
        } else {
          self.tableData = res.data.rows
          self.total = res.data.total
        }
        self.listLoading = false
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
    // 重置搜索条件
    handleRefresh () {
      this.listQuery = {
        offset: 1,
        limit: 10
      }
      this.fetchData()
    }
  }
}
</script>

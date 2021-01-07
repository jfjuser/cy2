<template>
  <div class="app-container">
    <div class="table-main">
      <!-- 操作 -->
      <div class="filter-container">
        <el-button class="filter-item" type="primary"  @click="fetchData" icon="el-icon-refresh">刷新</el-button>
        <el-button class="filter-item" type="primary" @click="handleh"  icon="el-icon-download" v-has="['导出']" >导出</el-button>
      </div>
      <el-table stripe :header-cell-style="{background:'#f3f4f6'}" style="width: 100%" max-height="600" :data="tableData" v-loading.body="listLoading"  element-loading-text="加载中..." border fit highlight-current-row>
        <el-table-column label="操作员编号" align="center" prop="operatorId"></el-table-column>
        <el-table-column label="操作员名称" align="center" prop="operatorName"></el-table-column>
        <el-table-column label="通道名称" align="center" prop="localName"></el-table-column>
        <el-table-column label="开闸原因" align="center" prop="remark"></el-table-column>
        <el-table-column label="开闸时间" align="center" prop="createTime">
          <template slot-scope="scope">
            {{timeFormatter(scope.row.createTime)}}
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
import { timeFormatter } from '@/utils/formatter.js'
// import { getOpenRecord } from '@/api/box/index.js'
import { getBoxOpenRecord } from '@/api/url'
import { httpGet } from '@/utils/restful'
export default {
  data () {
    return {
      list: null,
      listLoading: true,
      timeFormatter: timeFormatter,
      listQuery: {
        offset: 1,
        limit: 10
      },
      tableData: [],
      total: null,
      jsonData: [
        {
          title: '操作员编号',
          key: 'operatorId',
          type: 'text'
        },
        {
          title: '操作员名称',
          key: 'operatorName',
          type: 'text'
        },
        {
          title: '通道名称',
          key: 'localName',
          type: 'text'
        },
        {
          title: '开闸原因',
          key: 'remark',
          type: 'text'
        },
        {
          title: '开闸时间',
          key: 'createTime',
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
        item.createTime = this.timeFormatter(item.createTime)
      })
      this.table2excel(this.jsonData, obj, 'excel.xlsx')
    },
    fetchData () {
      httpGet(getBoxOpenRecord + this.$store.getters.departmentId, this.listQuery).then(res => {
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

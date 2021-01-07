<template>
  <div class="app-container">
    <div class="table-main">
      <!-- 操作 -->
      <div class="filter-container">
        <el-button class="filter-item" type="primary" @click="fetchData" icon="el-icon-refresh">刷新</el-button>
        <el-button class="filter-item" type="primary" @click="handleh"  icon="el-icon-download" v-has="['导出']" >导出</el-button>
      </div>
      <el-table stripe :header-cell-style="{background:'#f3f4f6'}" style="width: 100%" max-height="600" :data="tableData" v-loading.body="listLoading"  element-loading-text="加载中..." border fit highlight-current-row>
        <el-table-column label="相机名称" align="center" prop="localName"></el-table-column>
        <el-table-column label="相机MAC" align="center" prop="mac"></el-table-column>
        <el-table-column label="备注" align="center" prop="remarks"></el-table-column>
        <el-table-column label="最近在线时间" align="center" prop="timeAt">
          <template slot-scope="scope">
            {{timeFormatter(scope.row.timeAt)}}
          </template>
        </el-table-column>
        <el-table-column label="UDP状态" align="center" prop="timeAt">
          <template slot-scope="scope">
            {{udpFormatter(scope.row.timeAt)}}
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
import { udpFormatter, timeFormatter } from '@/utils/formatter.js'
import { getLocalStatus } from '@/api/url'
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
      udpFormatter: udpFormatter,
      timeFormatter: timeFormatter,
      total: null,
      jsonData: [
        {
          title: '相机名称',
          key: 'localName',
          type: 'text'
        },
        {
          title: '相机MAC',
          key: 'mac',
          type: 'text'
        },
        {
          title: '备注',
          key: 'remarks',
          type: 'text'
        },
        {
          title: '最近在线时间',
          key: 'timeAt',
          type: 'text'
        },
        {
          title: 'UDP状态',
          key: 'timeAt2',
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
        item.timeAt2 = this.udpFormatter(item.timeAt)
        item.timeAt = this.timeFormatter(item.timeAt)
      })
      this.table2excel(this.jsonData, obj, 'excel.xlsx')
    },
    fetchData () {
      httpGet(getLocalStatus + this.$store.getters.departmentId, this.listQuery).then(res => {
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

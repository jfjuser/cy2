<template>
  <div class="app-container">
    <div class="table-main">
      <div class="filter-container">
        <el-input  class="filter-item" style="width:150px;" v-model="listQuery.departmentName" clearable placeholder="部门名称"></el-input>
        <el-input  class="filter-item" style="width:150px;" v-model="listQuery.localName" clearable placeholder="通道名称"></el-input>
        <el-input  class="filter-item" style="width:150px;" v-model="listQuery.mac" clearable placeholder="MAC地址"></el-input>
        <el-button class="filter-item" type="primary"   @click="handleFilter" icon="el-icon-search">搜索</el-button>
        <el-button class="filter-item" type="primary"   @click="handleRefresh" icon="el-icon-refresh">刷新</el-button>
        <el-button class="filter-item" type="primary" @click="handleh"  icon="el-icon-download" v-has="['导出']" >导出</el-button>
      </div>
      <el-table stripe :header-cell-style="{background:'#f3f4f6'}" style="width: 100%"   max-height="600" :data="tableData" v-loading.body="listLoading"  element-loading-text="加载中..." border fit highlight-current-row>
        <el-table-column label="部门名称" align="center" prop="departmentName"></el-table-column>
        <el-table-column label="代理商名称" align="center" prop="parentName"></el-table-column>
        <el-table-column label="通道名称" align="center" prop="localName"></el-table-column>
        <el-table-column label="MAC地址" align="center" prop="mac"></el-table-column>
        <el-table-column label="离线时间" align="center" prop="loginOutAt">
          <template slot-scope="scope">
            {{timeFormatter(scope.row.loginOutAt)}}
          </template>
        </el-table-column>
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
// import { getOfflineCamera } from '@/api/remoteUpgrade'
import { httpGet } from '@/utils/restful'
import { getOfflineCamera } from '@/api/url'
export default {
  data () {
    return {
      listLoading: true,
      listQuery: {
        offset: 1,
        limit: 10,
        departmentName: undefined,
        localName: undefined,
        mac: undefined
      },
      timeFormatter: timeFormatter,
      tableData: [],
      total: null,
      jsonData: [
        {
          title: '部门名称',
          key: 'departmentName',
          type: 'text'
        },
        {
          title: '代理商名称',
          key: 'parentName',
          type: 'text'
        },
        {
          title: '通道名称',
          key: 'localName',
          type: 'text'
        },
        {
          title: 'MAC地址',
          key: 'mac',
          type: 'text'
        },
        {
          title: '离线时间',
          key: 'loginOutAt',
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
        item.loginOutAt = this.timeFormatter(item.loginOutAt)
      })
      this.table2excel(this.jsonData, obj, 'excel.xlsx')
    },
    handleRefresh () {
      this.listQuery = {
        offset: 1,
        limit: 10,
        departmentName: undefined,
        localName: undefined,
        mac: undefined
      }
      this.fetchData()
    },
    fetchData () {
      this.listLoading = true
      this.listQuery = Object.assign(this.listQuery, {departmentId: this.$store.getters.departmentId})
      httpGet(getOfflineCamera, this.listQuery).then(res => {
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

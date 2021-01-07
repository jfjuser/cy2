<template>
  <div class="app-container">
    <div class="table-main">
      <!-- 操作 -->
      <div class="filter-container">
        <el-input clearable style="width: 200px;" v-model="listQuery.userName" class="filter-item" placeholder="姓名"></el-input>
        <el-select clearable style="width: 200px;" v-model="listQuery.isDefault" class="filter-item" placeholder="是否默认">
          <el-option value="0" label="否">否</el-option>
          <el-option value="1" label="是">是</el-option>
        </el-select>
        <el-button class="filter-item" type="primary"   @click="handleFilter" icon="el-icon-search">搜索</el-button>
        <el-button class="filter-item" type="primary"   @click="handleRefresh" icon="el-icon-refresh">刷新</el-button>
        <el-button class="filter-item" type="primary" @click="handleh"  icon="el-icon-download" v-has="['导出']" >导出</el-button>
      </div>
      <el-table stripe :header-cell-style="{background:'#f3f4f6'}" style="width: 100%" max-height="600" :data="tableData" v-loading.body="listLoading" element-loading-text="加载中..." border fit highlight-current-row>
        <el-table-column label="姓名" align="center" prop="userName">
          <template slot-scope="scope">
            <span v-if="scope.row.userName">{{scope.row.userName}}</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column label="地址" align="center" prop="addr"></el-table-column>
        <el-table-column label="范围" align="center" prop="distance">
          <template slot-scope="scope">
            {{scope.row.distance + 'KM'}}
          </template>
        </el-table-column>
        <el-table-column label="是否默认" align="center" prop="isDefault">
          <template slot-scope="scope">
            <span v-if="scope.row.isDefault == 0">否</span>
            <span v-else-if="scope.row.isDefault == 1">是</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center" prop="createAt">
          <template slot-scope="scope">
            {{timeFormatter(scope.row.createAt)}}
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
import { timeFormatter, statusASFormatter } from '@/utils/formatter.js'
import { httpGet } from '@/utils/restful'
import { getOrderAddress } from '@/api/url'
import { statusOrderASType } from '@/utils/selectAble'
export default {
  data () {
    return {
      timeFormatter: timeFormatter,
      statusASFormatter: statusASFormatter,
      statusOrderASType: statusOrderASType,
      list: null,
      listLoading: true,
      listQuery: {
        offset: 1,
        limit: 10,
        userName: undefined,
        isDefault: undefined
      },
      tableData: [],
      total: null,
      jsonData: [
        {
          title: '姓名',
          key: 'userName',
          type: 'text'
        },
        {
          title: '地址',
          key: 'addr',
          type: 'text'
        },
        {
          title: '范围',
          key: 'distance',
          type: 'text'
        },
        {
          title: '是否默认',
          key: 'isDefault',
          type: 'text'
        },
        {
          title: '创建时间',
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
      let obj = JSON.parse(JSON.stringify(this.tableData))
      obj.forEach((item, index) => {
        item.userName = item.userName ? item.userName : '--'
        item.distance = item.distance + 'KM'
        item.isDefault = parseInt(item.isDefault) === 0 ? '否' : (parseInt(item.isDefault) === 1 ? '是' : '--')
        item.createAt = this.timeFormatter(item.createAt)
      })
      this.table2excel(this.jsonData, obj, 'excel.xlsx')
    },
    handleRefresh () {
      this.listQuery = {
        offset: 1,
        limit: 10,
        userName: undefined,
        isDefault: undefined
      }
      this.fetchData()
    },
    fetchData () {
      httpGet(getOrderAddress, this.listQuery).then(res => {
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
    },
    // 搜索
    handleFilter () {
      this.listQuery.offset = 1
      this.fetchData()
    }
  }
}
</script>

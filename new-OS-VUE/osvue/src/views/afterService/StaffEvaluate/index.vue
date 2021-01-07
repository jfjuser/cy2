<template>
  <div class="app-container">
    <div class="table-main">
      <!-- 操作 -->
      <div class="filter-container">
        <el-input clearable style="width: 200px;" v-model="listQuery.problemId" class="filter-item" placeholder="订单号"></el-input>
        <el-button class="filter-item" type="primary"   @click="handleFilter" icon="el-icon-search">搜索</el-button>
        <el-button class="filter-item" type="primary"   @click="handleRefresh" icon="el-icon-refresh">刷新</el-button>
        <el-button class="filter-item" type="primary" @click="handleh"  icon="el-icon-download" v-has="['导出']" >导出</el-button>
      </div>
      <el-table stripe :header-cell-style="{background:'#f3f4f6'}" style="width: 100%" max-height="600" :data="tableData" v-loading.body="listLoading" element-loading-text="加载中..." border fit highlight-current-row>
        <el-table-column label="订单号" align="center" prop="problemId"></el-table-column>
        <el-table-column label="完成度" align="center" prop="completeStar">
          <template slot-scope="scope">
            <el-rate
              v-model="scope.row.completeStar"
              disabled
              >
            </el-rate>
          </template>
        </el-table-column>
        <el-table-column label="服务态度" align="center" prop="serviceStar">
          <template slot-scope="scope">
            <el-rate
              v-model="scope.row.serviceStar"
              disabled
              >
            </el-rate>
          </template>
        </el-table-column>
        <el-table-column label="处理速度" align="center" prop="speedStar">
          <template slot-scope="scope">
            <el-rate
              v-model="scope.row.speedStar"
              disabled
              >
            </el-rate>
          </template>
        </el-table-column>
        <el-table-column label="评价信息" align="center" prop="evaluation"></el-table-column>
        <el-table-column label="评价时间" align="center" prop="createAt">
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
import { timeFormatter } from '@/utils/formatter.js'
import { httpGet } from '@/utils/restful'
import { getASStaffEvaluate } from '@/api/url'
export default {
  data () {
    return {
      timeFormatter: timeFormatter,
      list: null,
      listLoading: true,
      listQuery: {
        offset: 1,
        limit: 10,
        problemId: undefined
      },
      tableData: [],
      total: null,
      jsonData: [
        {
          title: '订单号',
          key: 'problemId',
          type: 'text'
        },
        {
          title: '完成度',
          key: 'completeStar',
          type: 'text'
        },
        {
          title: '服务态度',
          key: 'serviceStar',
          type: 'text'
        },
        {
          title: '处理速度',
          key: 'speedStar',
          type: 'text'
        },
        {
          title: '评价信息',
          key: 'evaluation',
          type: 'text'
        },
        {
          title: '评价时间',
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
        // item.type = this.problemFormatter(item.type)
        item.createAt = this.timeFormatter(item.createAt)
      })
      this.table2excel(this.jsonData, obj, 'excel.xlsx')
    },
    handleRefresh () {
      this.listQuery = {
        offset: 1,
        limit: 10,
        problemId: undefined
      }
      this.fetchData()
    },
    fetchData () {
      httpGet(getASStaffEvaluate, this.listQuery).then(res => {
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

<template>
  <div class="app-container">
    <div class="table-main">
      <!-- 操作 -->
      <div class="filter-container">
        <el-select clearable v-model="listQuery.type"  class="filter-item" placeholder="类型">
          <el-option v-for="item in moneyType" :key="item.valueNo" :label="item.valueName" :value="item.valueNo"></el-option>
        </el-select>
        <el-button class="filter-item" type="primary"   @click="handleFilter" icon="el-icon-search">搜索</el-button>
        <el-button class="filter-item" type="primary"   @click="handleRefresh" icon="el-icon-refresh">刷新</el-button>
        <el-button class="filter-item" type="primary" @click="handleh"  icon="el-icon-download" v-has="['导出']" >导出</el-button>
      </div>
      <el-table stripe :header-cell-style="{background:'#f3f4f6'}" style="width: 100%"   max-height="600" :data="tableData" v-loading.body="listLoading"  element-loading-text="加载中..." border fit highlight-current-row>
        <el-table-column label="类型" align="center" prop="type">
            <template slot-scope="scope">
                {{typeFormatter(scope.row.type)}}
            </template>
        </el-table-column>
        <el-table-column label="加款减款金额" align="center" prop="fee">
          <template slot-scope="scope">
            {{moneyFormatter(scope.row.fee)}}
          </template>
        </el-table-column>
        <el-table-column label="余额" align="center" prop="nowFee">
          <template slot-scope="scope">
            {{moneyFormatter(scope.row.nowFee)}}
          </template>
        </el-table-column>
        <el-table-column label="充值时间" align="center" prop="rechargeAt">
          <template slot-scope="scope">
            {{timeFormatter(scope.row.rechargeAt)}}
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
import { typeFormatter, moneyFormatter, timeFormatter } from '@/utils/formatter.js'
import { moneyType } from '@/utils/selectAble.js'
import { httpGet } from '@/utils/restful'
import { getRechargeRecords } from '@/api/url'
export default {
  data () {
    return {
      list: null,
      listLoading: true,
      listQuery: {
        offset: 1,
        limit: 10,
        type: undefined
      },
      tableData: [],
      total: null,
      moneyType: moneyType,
      typeFormatter: typeFormatter,
      moneyFormatter: moneyFormatter,
      timeFormatter: timeFormatter,
      jsonData: [
        {
          title: '类型',
          key: 'type',
          type: 'text'
        },
        {
          title: '加款减款金额',
          key: 'fee',
          type: 'text'
        },
        {
          title: '余额',
          key: 'nowFee',
          type: 'text'
        },
        {
          title: '充值时间',
          key: 'rechargeAt',
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
        item.type = this.typeFormatter(item.type)
        item.fee = this.moneyFormatter(item.fee)
        item.nowFee = this.moneyFormatter(item.nowFee)
        item.rechargeAt = this.timeFormatter(item.rechargeAt)
      })
      this.table2excel(this.jsonData, obj, 'excel.xlsx')
    },
    // 刷新
    handleRefresh () {
      this.listQuery = {
        offset: 1,
        limit: 10,
        type: undefined
      }
      this.fetchData()
    },
    fetchData () {
      this.listQuery = Object.assign(this.listQuery, {shopId: this.$store.getters.departmentId})
      httpGet(getRechargeRecords, this.listQuery).then(res => {
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

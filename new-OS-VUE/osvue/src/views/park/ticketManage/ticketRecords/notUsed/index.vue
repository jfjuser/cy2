<template>
<div>
  <div class="filter-container">
    <el-autocomplete clearable class="filter-item" style="width: 150px;" v-model="listQuery.plate" :fetch-suggestions="querySearch" placeholder="车牌号"></el-autocomplete>
    <el-input clearable class="filter-item" style="width: 150px;"  v-model="listQuery.ticketCode"  placeholder="订单号"></el-input>
    <el-date-picker
      class="filter-item"
      v-model="time"
      type="datetimerange"
      style="padding:0 15px;"
      value-format = "yyyy-MM-dd HH:mm:ss"
      :default-time="['00:00:00', '23:59:59']"
      range-separator="至"
      start-placeholder="开始日期"
      @change="changeTime"
      end-placeholder="结束日期">
    </el-date-picker>
    <el-button class="filter-item" type="primary"   @click="handleFilter" icon="el-icon-search">搜索</el-button>
    <el-button class="filter-item" type="primary"   @click="handRefresh" icon="el-icon-refresh">刷新</el-button>
    <el-button class="filter-item" type="primary" @click="handleh"  icon="el-icon-download" v-has="['导出']" >导出</el-button>
  </div>
  <el-table stripe :header-cell-style="{background:'#f3f4f6'}" style="width: 100%"   max-height="600" :data="tableData" v-loading.body="listLoading"  element-loading-text="加载中..." border fit highlight-current-row>
    <el-table-column label="优惠券编号" align="center" prop="ticketCode"></el-table-column>
    <el-table-column label="优惠券名称" align="center" prop="ruleName"></el-table-column>
    <!-- <el-table-column label="订单编号" align="center" prop="localId"></el-table-column> -->
    <el-table-column label="车牌号码" align="center" prop="plate"></el-table-column>
    <el-table-column label="绑定时间" align="center" prop="bingdingAt">
      <template slot-scope="scope">
        {{timeFormatter(scope.row.bingdingAt)}}
      </template>
    </el-table-column>
    <el-table-column label="有效期" align="center" prop="validateAt">
      <template slot-scope="scope">
        {{timeFormatter(scope.row.validateAt)}}
      </template>
    </el-table-column>
    <el-table-column label="备注信息" align="center" prop="comment">
    </el-table-column>
  </el-table>
  <!-- 分页 -->
  <div class="pagination-container">
    <el-pagination background  :page-sizes="[10,20,30, 50]" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.offset " :page-size="listQuery.limit" :total="total" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
  </div>
</div>
</template>
<script>
import { timeFormatterSort, timeFormatter, moneyFormatter } from '@/utils/formatter.js'
import { plateType } from '@/utils/selectAble.js'
import { httpGet } from '@/utils/restful'
import { getShopNotUsedTicket } from '@/api/url'
export default {
  name: 'is-used',
  data () {
    return {
      list: null,
      time: [],
      filterDisabled: false,
      listLoading: true,
      listQuery: {
        offset: 1,
        limit: 10,
        plate: undefined,
        ticketCode: undefined,
        beginTime: undefined,
        endTime: undefined
      },
      tableData: [],
      total: null,
      timeFormatterSort: timeFormatterSort,
      timeFormatter: timeFormatter,
      moneyFormatter: moneyFormatter,
      plateType: plateType,
      jsonData: [
        {
          title: '优惠券编号',
          key: 'ticketCode',
          type: 'text'
        },
        {
          title: '优惠券名称',
          key: 'ruleName',
          type: 'text'
        },
        {
          title: '车牌号码',
          key: 'plate',
          type: 'text'
        },
        {
          title: '绑定时间',
          key: 'bingdingAt',
          type: 'text'
        },
        {
          title: '有效日期',
          key: 'validateAt',
          type: 'text'
        },
        {
          title: '备注信息',
          key: 'comment',
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
        // item.dikouFee = this.moneyFormatter(item.dikouFee)
        item.bingdingAt = this.timeFormatter(item.bingdingAt)
        item.validateAt = this.timeFormatter(item.validateAt)
        // item.taskAt = this.timeFormatter(item.taskAt)
      })
      this.table2excel(this.jsonData, obj, 'excel.xlsx')
    },
    // 监听搜索的时间
    changeTime (value) {
      if (value === null) {
        this.filterDisabled = true
      } else {
        this.listQuery.beginTime = value[0]
        this.listQuery.endTime = value[1]
        this.filterDisabled = false
      }
    },
    // 刷新
    handRefresh () {
      this.listQuery = {
        offset: 1,
        limit: 10,
        plate: undefined,
        ticketCode: undefined,
        beginTime: undefined,
        endTime: undefined
      }
      this.time = []
      this.fetchData()
    },
    fetchData () {
      this.listQuery = Object.assign(this.listQuery, {shopId: this.$store.getters.departmentId})
      httpGet(getShopNotUsedTicket, this.listQuery).then(res => {
        if (res.data === null || res.data.rows === []) {
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
    querySearch (queryString, cb) {
      let plate = this.plateType
      let results = queryString ? plate.filter(this.createFilter(queryString)) : plate
      cb(results)
    },
    createFilter (queryString) {
      return (plate) => {
        return (plate.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    // 搜索
    handleFilter () {
      this.listQuery.offset = 1
      this.fetchData()
    }
  }
}
</script>

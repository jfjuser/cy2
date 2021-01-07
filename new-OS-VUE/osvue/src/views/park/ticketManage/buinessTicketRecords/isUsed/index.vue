<template>
<div>
  <div class="filter-container">
    <el-select class="filter-item" style="width: 150px;"  v-model="listQuery.shopId"  placeholder="商户号">
      <el-option v-for="item in shopType" :key="item.id" :label="item.shopName" :value="item.id"></el-option>
    </el-select>
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
    <el-button class="filter-item" type="primary"  :disabled="filterDisabled" @click="handleFilter" icon="el-icon-search">搜索</el-button>
    <el-button class="filter-item" type="primary"   @click="handRefresh" icon="el-icon-refresh">刷新</el-button>
    <el-button class="filter-item" type="primary" @click="handleh"  icon="el-icon-download" v-has="['导出']" >导出</el-button>
  </div>
  <el-table stripe :header-cell-style="{background:'#f3f4f6'}" style="width: 100%"   max-height="600" :data="tableData" v-loading.body="listLoading"  element-loading-text="加载中..." border fit highlight-current-row>
    <el-table-column label="优惠券编号" align="center" prop="ticketCode"></el-table-column>
    <el-table-column label="优惠券名称" align="center" prop="ruleName"></el-table-column>
    <el-table-column label="订单编号" align="center" prop="localId"></el-table-column>
    <el-table-column label="车牌号码" align="center" prop="plate"></el-table-column>
    <el-table-column label="已抵扣金额" align="center" prop="dikouFee">
      <template slot-scope="scope">
        {{moneyFormatter(scope.row.dikouFee)}}
      </template>
    </el-table-column>
    <el-table-column label="绑定时间" align="center" prop="bingdingAt">
      <template slot-scope="scope">
        {{timeFormatter(scope.row.bingdingAt)}}
      </template>
    </el-table-column>
    <el-table-column label="使用时间" align="center" prop="useAt">
      <template slot-scope="scope">
        {{timeFormatter(scope.row.useAt)}}
      </template>
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
import { getShops, getShopUsedTicket } from '@/api/url'
import { httpGet } from '@/utils/restful'
export default {
  name: 'is-used',
  data () {
    return {
      list: null,
      time: [],
      filterDisabled: false,
      listLoading: true,
      shopType: [],
      listQuery: {
        offset: 1,
        limit: 10,
        plate: undefined,
        shopId: undefined,
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
          title: '订单编号',
          key: 'localId',
          type: 'text'
        },
        {
          title: '车牌号码',
          key: 'plate',
          type: 'text'
        },
        {
          title: '已抵扣金额',
          key: 'dikouFee',
          type: 'text'
        },
        {
          title: '绑定时间',
          key: 'bingdingAt',
          type: 'text'
        },
        {
          title: '使用时间',
          key: 'useAt',
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
    this.getAllShops()
  },
  methods: {
    handleh () {
      let obj = JSON.parse(JSON.stringify(this.tableData))
      obj.forEach((item, index) => {
        item.dikouFee = this.moneyFormatter(item.dikouFee)
        item.bingdingAt = this.timeFormatter(item.bingdingAt)
        item.useAt = this.timeFormatter(item.useAt)
        // item.taskAt = this.timeFormatter(item.taskAt)
      })
      this.table2excel(this.jsonData, obj, 'excel.xlsx')
    },
    // 监听搜索的时间
    changeTime (value) {
      if (value === null) {
        this.filterDisabled = true
      } else if (new Date(value[0]).getFullYear() === new Date(value[1]).getFullYear() && new Date(value[0]).getMonth() === new Date(value[1]).getMonth()) {
        this.listQuery.beginTime = value[0]
        this.listQuery.endTime = value[1]
        this.filterDisabled = false
      } else if (new Date(value[0]).getFullYear() && new Date(value[1]).getFullYear() && new Date(value[0]).getMonth() && new Date(value[1]).getMonth()) {
        this.listQuery.beginTime = value[0]
        this.listQuery.endTime = value[1]
        this.filterDisabled = false
      } else {
        this.filterDisabled = true
        this.time = [this.listQuery.beginTime, this.listQuery.endTime]
        // this.$message.error('请填写一个月内的时间段进行搜索')
        this.$message.error('请重新搜索')
      }
    },
    // 刷新
    handRefresh () {
      if (this.shopType.length === 0) {
        this.$message.error('暂无商铺刷新无效')
        this.listLoading = false
      } else {
        this.listQuery = {
          offset: 1,
          limit: 10,
          plate: undefined,
          ticketCode: undefined,
          shopId: this.shopType[0].id,
          beginTime: timeFormatterSort(new Date(new Date().setDate(1))) + ' 00:00:00',
          endTime: timeFormatterSort(new Date()) + ' 23:59:59'
        }
        this.time = [this.listQuery.beginTime, this.listQuery.endTime]
        this.fetchData()
      }
    },
    // 获取所有的商户
    getAllShops () {
      httpGet(getShops + this.$store.getters.departmentId)
        .then(res => {
          if (res.data === null || res.data.length === 0) {
            this.$message.error('暂无商户，无法进行查看')
            this.listLoading = false
            this.filterDisabled = true
          } else {
            // 开始时间
            this.listQuery.beginTime = timeFormatterSort(new Date(new Date().setDate(1))) + ' 00:00:00'
            // 结束时间
            this.listQuery.endTime = timeFormatterSort(new Date()) + ' 23:59:59'
            this.time = [this.listQuery.beginTime, this.listQuery.endTime]
            this.shopType = res.data
            this.listQuery.shopId = res.data[0].id
            this.fetchData()
            this.filterDisabled = false
          }
        }).catch(() => {})
    },
    fetchData () {
      this.listQuery = Object.assign(this.listQuery, {departmentId: this.$store.getters.departmentId})
      httpGet(getShopUsedTicket, this.listQuery).then(res => {
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

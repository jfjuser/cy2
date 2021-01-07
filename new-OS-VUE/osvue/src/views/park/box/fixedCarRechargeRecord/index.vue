<template>
  <div class="app-container">
     <div class="table-main">
        <!-- 操作 -->
        <div class="filter-container">
        <el-input clearable style="width: 150px;" class="filter-item" v-model.trim="listQuery.name" placeholder="请输入车主姓名"></el-input>
        <el-input clearable style="width: 150px;" class="filter-item" v-model.trim="listQuery.plate" placeholder="请输入车牌"></el-input>
       <div class="filter-item">
        <el-date-picker
          v-model="rechargeTime"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
        </div>
        <el-button class="filter-item" @click="serach" type="primary"  icon="el-icon-search">搜索</el-button>
        <div class="filter-item">
          <span style="font-size:2rem;margin-left:50px">总金额:</span>
          <span style="color:red;font-size:2rem">￥</span>
          <span style="font-size:2rem;font-weight:bold">
            <count-to class="num" :endVal="totalAmount" :duration="1500" decimals="2"></count-to>
          </span></div>
        </div>
        <!-- 表格 -->
          <el-table
            element-loading-text="加载中..."
            border
            fit
            highlight-current-row
            v-loading.body="listLoading"
            :header-cell-style="{background:'#f3f4f6'}"
            style="width: 100%"
            :data="tableData"
            stripe>
            <el-table-column
              prop="name"
              label="车主姓名"
              width="180">
            </el-table-column>
            <el-table-column
              prop="plate"
              label="车牌号码"
              width="180">
            </el-table-column>
            <el-table-column
              prop="phone"
              label="电话">
            </el-table-column>
                        <el-table-column
              prop="remarks"
              label="规则名称">
            </el-table-column>
                        <el-table-column
              prop="monthNumber"
              label="包月次数">
            </el-table-column>
                        <el-table-column
              prop="totalFee"
              label="充值总金额">
            </el-table-column>
            <el-table-column
              label="充值时间">
              <template slot-scope="scope">
                {{timeFormatter(scope.row.createAt)}}
              </template>
            </el-table-column>
                        <el-table-column
              prop="remark"
              label="订单备注信息">
            </el-table-column>
          </el-table>
        <!-- 分页 -->
        <div class="pagination-container">
          <el-pagination background
          :page-sizes="[10,20,30, 50]"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="listQuery.offset "
          :page-size="listQuery.limit"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          >
          </el-pagination>
        </div>
      </div>
  </div>
</template>

<script>
import CountTo from 'vue-count-to'
import { timeFormatterSort, timeFormatter } from '@/utils/formatter.js'
import { rechargeRecord } from '@/api/url'

import { httpGet } from '@/utils/restful'
export default {
  components: {
    CountTo
  },
  data () {
    return {
      timeFormatter,
      timeFormatterSort,
      total: undefined,
      totalAmount: 0, // 总金额
      listLoading: false, // 渲染数据时加载动画
      tableData: [], // 表格数据
      rechargeTime: 0, // 选择充值时间
      listQuery: {
        offset: 1,
        limit: 10,
        departmentId: this.$store.getters.departmentId,
        name: undefined,
        plate: undefined,
        beginTime: undefined,
        endTime: undefined
      }
    }
  },
  watch: {
    rechargeTime (newValue, oldValue) {
      if (newValue !== null) {
        this.listQuery.beginTime = timeFormatterSort(newValue[0]) + ' 00:00:00'
        this.listQuery.endTime = timeFormatterSort(newValue[1]) + ' 23:59:59'
      } else {
        this.listQuery.beginTime = ''
        this.listQuery.endTime = ''
      }
    }
  },
  created () {
    this.getData()
    this.getTotalMoney()
  },
  methods: {
    serach () {
      this.listQuery.offset = 1
      this.getData()
      this.getTotalMoney()
    },
    handleCurrentChange (val) {
      this.listQuery.offset = val
      this.getData()
    },
    handleSizeChange (val) {
      this.listQuery.limit = val
      this.listQuery.offset = 1
      this.getData()
    },
    getData () {
      this.listLoading = true
      httpGet(rechargeRecord, this.listQuery).then((res) => {
        this.listLoading = false
        this.tableData = res.data.boxRechargeRecordDtos.rows
        this.total = res.data.boxRechargeRecordDtos.total
      })
    },
    getTotalMoney () {
      let list = JSON.parse(JSON.stringify(this.listQuery))
      list.limit = -1
      list.offset = -1
      httpGet(rechargeRecord, list).then((res) => {
        this.totalAmount = res.data.total
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.el-table--striped .el-table__body tr.el-table__row--striped td { background:rgb(228, 228, 228)}
</style>

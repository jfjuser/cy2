<template>
  <div class="app-container">
    <div class="table-main">
      <div class="filter-container">
        <el-input  class="filter-item" style="width:150px;" v-model="listQuery.localId" placeholder="订单号"></el-input>
        <el-input  class="filter-item" style="width:150px;" v-model="listQuery.plate" placeholder="车牌号"></el-input>
        <el-date-picker
          clearable
          v-model="time"
          @change="changeTime"
          class="filter-item"
          type="datetimerange"
          style="padding:0 15px;width:380px"
          value-format = "yyyy-MM-dd HH:mm:ss"
          :default-time="['00:00:00', '23:59:59']"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
        <el-button class="filter-item" type="primary"   @click="handleFilter" icon="el-icon-search">搜索</el-button>
        <el-button class="filter-item" type="primary" @click="handleh"  icon="el-icon-download" v-has="['导出']" >导出</el-button>
        <el-button class="filter-item" type="primary"   @click="handleRefresh" icon="el-icon-refresh">刷新</el-button>
        <span class="filter-item" style="color:red;font-size: 14px;">备注：异常出场是指车主扫出口直付码支付完后未开闸的情况</span>
      </div>
      <el-table stripe :header-cell-style="{background:'#f3f4f6'}" style="width: 100%"   max-height="600" :data="tableData" v-loading.body="listLoading"  element-loading-text="加载中..." border fit highlight-current-row>
        <el-table-column label="订单号" align="center" prop="localId"></el-table-column>
        <!-- <el-table-column label="流水号" align="center" prop="payNo"></el-table-column> -->
        <el-table-column label="车牌" align="center" prop="plate"></el-table-column>
        <el-table-column label="直付金额" align="center" prop="electronicPrepay">
          <template slot-scope="scope">
            {{moneyInOutFormatter(scope.row.electronicPrepay)}}
          </template>
        </el-table-column>
        <el-table-column label="车主优惠" align="center" prop="ticketPay">
          <template slot-scope="scope">
            {{moneyInOutFormatter(scope.row.ticketPay)}}
          </template>
        </el-table-column>
        <el-table-column label="商家优惠" align="center" prop="ticketPayReal" >
          <template slot-scope="scope">
            {{moneyInOutFormatter(scope.row.ticketPayReal)}}
          </template>
        </el-table-column>
        <el-table-column label="停车时长" align="center" prop="duration" ></el-table-column>
        <el-table-column label="进场时间" align="center"  width="160">
          <template slot-scope="scope">
            {{timeFormatter(scope.row.inTime)}}
          </template>
        </el-table-column>
        <el-table-column label="出场时间" align="center"  width="160">
          <template slot-scope="scope">
            {{timeFormatter(scope.row.outTime)}}
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination background  :page-sizes="[10,20,30,50]" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.offset " :page-size="listQuery.limit" :total="total" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { moneyInOutFormatter, timeFormatter } from '@/utils/formatter.js'
import { httpGet } from '@/utils/restful'
import { getAbnormalOut } from '@/api/url'
export default {
  data () {
    return {
      listLoading: true,
      listQuery: {
        offset: 1,
        limit: 10,
        departmentId: this.$store.getters.departmentId,
        beginTime: undefined,
        endTime: undefined,
        localId: undefined,
        plate: undefined
      },
      timeFormatter: timeFormatter,
      moneyInOutFormatter: moneyInOutFormatter,
      tableData: [],
      total: null,
      localList: [],
      time: [],
      jsonData: [
        {
          title: '订单号',
          key: 'localId',
          type: 'text'
        },
        {
          title: '车牌',
          key: 'plate',
          type: 'text'
        },
        {
          title: '直付金额',
          key: 'electronicPrepay',
          type: 'text'
        },
        {
          title: '车主优惠',
          key: 'ticketPay',
          type: 'text'
        },
        {
          title: '商家优惠',
          key: 'ticketPayReal',
          type: 'text'
        },
        {
          title: '停车时长',
          key: 'duration',
          type: 'text'
        },
        {
          title: '进场时间',
          key: 'inTime',
          type: 'text'
        },
        {
          title: '出场时间',
          key: 'outTime',
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
        // item.loginOutAt = this.timeFormatter(item.loginOutAt)
        item.electronicPrepay = this.moneyInOutFormatter(item.electronicPrepay)
        item.ticketPay = this.moneyInOutFormatter(item.ticketPay)
        item.ticketPayReal = this.moneyInOutFormatter(item.ticketPayReal)
        item.inTime = this.timeFormatter(item.inTime)
        item.outTime = this.timeFormatter(item.outTime)
      })
      this.table2excel(this.jsonData, obj, 'excel.xlsx')
    },
    // 监听搜索的时间
    changeTime (value) {
      if (value === null) {
        this.listQuery.beginTime = undefined
        this.listQuery.endTime = undefined
      } else {
        this.listQuery.beginTime = value[0]
        this.listQuery.endTime = value[1]
      }
    },
    handleRefresh () {
      this.listQuery = {
        offset: 1,
        limit: 10,
        departmentId: this.$store.getters.departmentId,
        beginTime: undefined,
        endTime: undefined,
        localId: undefined,
        plate: undefined
      }
      this.time = []
      this.fetchData()
    },
    fetchData () {
      this.listLoading = true
      httpGet(getAbnormalOut, this.listQuery).then(res => {
        if (res.data === null || res.data.rows === null) {
          this.tableData = []
          this.total = 0
        } else {
          this.tableData = res.data.rows
          this.total = res.data.total
        }
        this.listLoading = false
        this.loadAll()
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
<style lang="scss" scoped>
.app-container{
  height: 100%;
  overflow: auto;
  margin: 0;
  overflow-y: scroll;
}
</style>

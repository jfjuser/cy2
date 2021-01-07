<template>
  <div class="app-container">
    <div class="table-main">
      <!-- 操作 -->
      <div class="filter-container">
        <el-input  class="filter-item" style="width:150px;" v-model="listQuery.payNo" clearable placeholder="订单编号"></el-input>
        <el-autocomplete clearable class="filter-item" style="width: 150px;" v-model="listQuery.plate" :fetch-suggestions="querySearch" placeholder="车牌号"></el-autocomplete>
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
        <el-button class="filter-item" type="primary"   @click="handleRefresh" icon="el-icon-refresh">刷新</el-button>
        <el-button class="filter-item" type="primary"  v-has="['导出']" @click="handleExport" icon="el-icon-download">导出</el-button>
      </div>
      <el-table stripe :header-cell-style="{background:'#f3f4f6'}" style="width: 100%" max-height="600" :data="tableData" v-loading.body="listLoading"  element-loading-text="加载中..." border fit highlight-current-row>
        <el-table-column label="订单编号" align="center" prop="payNo"></el-table-column>
        <el-table-column label="车牌" align="center" prop="plate"></el-table-column>
        <el-table-column label="开通月数" align="center" prop="monthNumber"></el-table-column>
        <el-table-column label="应收(充值规则)" align="center" prop="totalFee">
          <template slot-scope="scope">
            {{moneyFormatter(scope.row.totalFee)}}
          </template>
        </el-table-column>
        <el-table-column label="实收" align="center" prop="totalFee">
          <template slot-scope="scope">
            {{moneyFormatter(scope.row.totalFee)}}
          </template>
        </el-table-column>
        <el-table-column label="基于实收换算成每月金额" align="center" prop="monthPrice">
          <template slot-scope="scope">
            {{moneyFormatter((scope.row.totalFee / ((scope.row.monthNumber != null && scope.row.monthNumber > 0) ? scope.row.monthNumber : 1)).toFixed(2))}}
          </template>
        </el-table-column>
        <el-table-column label="充值时间" align="center">
          <template slot-scope="scope">
            {{timeFormatter(scope.row.createAt)}}
          </template>
        </el-table-column>
        <el-table-column label="备注信息" align="center" prop="remark">
        </el-table-column>
        <el-table-column label="操作人" align="center" prop="creatorName"></el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination background  :page-sizes="[10,20,30, 50]" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.offset " :page-size="listQuery.limit" :total="total" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
      </div>
      <el-dialog title="导出" :visible.sync="dialogExportVisible" width="30%">
        <el-form ref="exportForm" :model="exportForm" :rules="exportRules" autoCompete = "on" label-position="right" label-width="150px" >
          <el-form-item label="条数" prop="number">
            <el-select v-model="exportForm.number"  style="width:80%;">
              <el-option v-for="item in numberList" clearable :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogExportVisible = false">取消</el-button>
          <el-button type="primary" :loading="exportLoading" @click="exportData">保存</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { plateType } from '@/utils/selectAble.js'
import { moneyFormatter, timeFormatter } from '@/utils/formatter.js'
import { httpGet, httpExport } from '@/utils/restful'
import { normalCharge, exportNormalCharge } from '@/api/url'
export default {
  data () {
    return {
      list: null,
      time: [],
      listLoading: true,
      listQuery: {
        offset: 1,
        limit: 10,
        payNo: undefined,
        plate: undefined,
        beginTime: undefined,
        endTime: undefined
      },
      tableData: [],
      total: null,
      plateType: plateType,
      moneyFormatter: moneyFormatter,
      timeFormatter: timeFormatter,
      exportLoading: false,
      dialogExportVisible: false,
      numberList: [],
      exportForm: {
        number: 0
      },
      exportRules: {
        number: [
          {required: true, trigger: 'change', message: '不可为空'}
        ]
      }
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
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
    fetchData () {
      let self = this
      self.listLoading = true
      this.listQuery = Object.assign(this.listQuery, {departmentId: this.$store.getters.departmentId})
      httpGet(normalCharge, this.listQuery).then(res => {
        if (res.data === null || res.data.rows === null) {
          this.tableData = []
          this.total = 0
        } else {
          this.tableData = res.data.rows
          this.total = res.data.total
        }
        this.numberList = []
        for (let i = 0; i <= this.total / 1000; i++) {
          this.numberList.push({
            id: i,
            name: `从${i * 1000}到${(i + 1) * 1000}条`
          })
        }
        self.listLoading = false
      }).catch(() => {
        self.listLoading = false
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
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter (queryString) {
      return (plate) => {
        return (plate.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    // 重置搜索字段
    resetListQuery () {
      this.listQuery = {
        offset: 1,
        limit: 10,
        payNo: undefined,
        plate: undefined,
        beginTime: undefined,
        endTime: undefined
      }
      this.time = []
    },
    // 刷新
    handleRefresh () {
      this.resetListQuery()
      this.fetchData()
    },
    // 搜索
    handleFilter () {
      this.listQuery.offset = 1
      this.fetchData()
    },
    // 导出
    handleExport () {
      this.dialogExportVisible = true
      this.$nextTick(() => {
        this.$refs['exportForm'].resetFields()
      })
    },
    exportData () {
      this.$refs.exportForm.validate((valid) => {
        if (valid) {
          this.exportLoading = true
          let data = Object.assign({
            departmentId: this.$store.getters.departmentId
          }, this.exportForm)
          data = Object.assign(data, this.listQuery)
          httpExport(exportNormalCharge, data).then((res) => {
            this.dialogExportVisible = false
            setTimeout(() => { this.exportLoading = false }, 300)
          }).catch(() => {
            this.exportLoading = false
          })
        }
      })
    }
  }
}
</script>

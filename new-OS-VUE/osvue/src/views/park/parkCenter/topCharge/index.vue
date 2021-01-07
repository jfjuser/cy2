<template>
  <div class="app-container">
    <div class="table-main">
      <!-- 操作 -->
      <div class="filter-container">
        <el-input clearable style="width: 150px;" v-model="listQuery.userName" class="filter-item" placeholder="车主姓名"></el-input>
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
    <el-table stripe :header-cell-style="{background:'#f3f4f6'}" style="width: 100%" max-height="600" :data="tableData" v-loading.body="listLoading" element-loading-text="加载中..." border fit highlight-current-row>
          <el-table-column label="订单编号" align="center" prop="payNo"></el-table-column>
          <el-table-column label="车主姓名" align="center" prop="userName"></el-table-column>
          <el-table-column label="车位数" align="center" prop="carTal"></el-table-column>
          <el-table-column label="包月个数" align="center" prop="monthNumber"></el-table-column>
          <el-table-column label="总金额" align="center" prop="totalFee">
            <template slot-scope="scope">
              {{moneyFormatter(scope.row.totalFee)}}
            </template>
          </el-table-column>
          <el-table-column label="充值时间" align="center" prop="createAt">
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
import { timeFormatter, moneyFormatter } from '@/utils/formatter.js'
import { httpGet, httpExport } from '@/utils/restful'
import { getTomWhiteChargeRecord, exportTopWhiteChargeRecord } from '@/api/url'
export default {
  data () {
    return {
      time: [],
      listLoading: true,
      timeFormatter: timeFormatter,
      moneyFormatter: moneyFormatter,
      listQuery: {
        offset: 1,
        limit: 10,
        userName: undefined,
        beginTime: undefined,
        endTime: undefined
      },
      tableData: [],
      total: null,
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
    // 刷新
    handleRefresh () {
      this.listQuery = {
        offset: 1,
        limit: 10,
        userName: undefined,
        beginTime: undefined,
        endTime: undefined
      }
      this.fetchData()
    },
    // 获取
    fetchData () {
      this.listQuery = Object.assign(this.listQuery, {departmentId: this.$store.getters.departmentId})
      httpGet(getTomWhiteChargeRecord, this.listQuery).then(res => {
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
          httpExport(exportTopWhiteChargeRecord, data).then((res) => {
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

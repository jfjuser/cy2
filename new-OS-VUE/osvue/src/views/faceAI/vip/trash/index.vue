<template>
  <div class="app-container">
    <div class="table-main">
      <!-- 操作 -->
      <div class="filter-container">
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
        <el-button class="filter-item" type="primary" :disabled="filterDisabled" @click="handleFilter" icon="el-icon-search">搜索</el-button>
        <el-button class="filter-item" type="primary" @click="fetchData" icon="el-icon-refresh">刷新</el-button>
        <el-button class="filter-item" type="primary" @click="getOut" icon="el-icon-download">导出</el-button>
        <el-button class="filter-item" type="primary" :loading = "selectLoading" @click="handleRecovery" :disabled="disabled" icon="el-icon-repeat" v-has="['恢复']">批量恢复</el-button>
        <!-- <Import :tableColumn="showData" ></Import> -->
        <!-- <EImport :tableColumn="showData" :tableData2="tableData11" :ename="ename"></EImport> -->
      </div>
      <el-table stripe :header-cell-style="{background:'#f3f4f6'}" style="width: 100%" max-height="600" :data="tableData" v-loading.body="listLoading"  @selection-change="handleSelectionChange"  element-loading-text="加载中..." border fit highlight-current-row>
        <el-table-column type="selection" width="40" fixed="left" ></el-table-column>
        <el-table-column label="类型" align="center" prop="type">
          <template slot-scope="scope">
            {{trashFormatter(scope.row.type)}}
          </template>
        </el-table-column>
        <el-table-column label="删除条数" align="center" prop="delTotal"></el-table-column>
        <el-table-column label="操作人" align="center" prop="operator"></el-table-column>
        <el-table-column label="备注" align="center" prop="remark"></el-table-column>
        <el-table-column label="删除时间" align="center" prop="delAt">
          <template slot-scope="scope">
            {{timeFormatter(scope.row.delAt)}}
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" v-if = "isShowColumnFormatter(['恢复'])" align="center" class-name="small-padding fixed-width" width="150">
          <template slot-scope="scope">
            <el-button type="primary" v-has="['恢复']" @click.native="recovery(scope.row)" size="mini">恢复</el-button>
            <el-button type="success" size="mini" @click.native="fetchDetailData(scope.row)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination background  :page-sizes="[10,20,30, 50]" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.offset " :page-size="listQuery.limit" :total="total" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
      </div>
      <el-dialog title="充值" :visible.sync="dialogFormVisible" width ="40%">
      </el-dialog>
    </div>
    <!-- 查看 -->
    <div class="table-main lookbox" v-show="lookTableVisible">
      <div class="filter-container">
        <i class="el-icon-close close" @click="onclose"></i>
        <el-button class="filter-item" type="primary" @click.native="fetchDetailData(false)" icon="el-icon-refresh">刷新</el-button>
        <el-button class="filter-item" type="primary" :loading="selectLoading1" @click="handleRecoveryDetail" :disabled="disabled1" icon="el-icon-repeat" v-has="['恢复']">批量恢复</el-button>
        <el-alert
          title="可自由选择批量恢复"
          type="success">
        </el-alert>
      </div>
      <DetailTable :data="tableData1" :detailRow="detailRow" v-loading.body="detailLoading" @recoveryOne="recoveryOne" @selection-change="handleSelectionChange1"/>
      <div class="pagination-container">
        <el-pagination background  :page-sizes="[10,20,30,50]" @size-change="handleSizeChangeDetail" @current-change="handleCurrentChangeDetail" :current-page="detailQuery.offset " :page-size="detailQuery.limit" :total="total1" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import { isShowColumnFormatter, timeFormatter, timeFormatters, timeFormatterSort, trashFormatters, trashFormatter } from '@/utils/formatter.js'
import { pageRecoveryWhite, recoveryWhite, pageRecoveryWhiteDetail, recoveryWhiteDetail } from '@/api/url.js'
import { httpGet, httpPut } from '@/utils/restful.js'
import DetailTable from './components/detailTable'
// import Import from '@/components/xlsx/imports'
// import EImport from '@/components/xlsx/exports1'
export default {
  components: {
    DetailTable
    // ,
    // EImport
  },
  data () {
    return {
      list: null,
      ename: '',
      listLoading: true,
      createLoading: false,
      selectLoading: false,
      filterDisabled: false,
      disabled: true,
      listQuery: {
        offset: 1,
        limit: 10,
        departmentId: this.$store.getters.departmentId,
        beginTime: undefined,
        endTime: undefined
      },
      tableData: [],
      isShowColumnFormatter: isShowColumnFormatter,
      timeFormatter: timeFormatter,
      timeFormatters: timeFormatters,
      timeFormatterSort: timeFormatterSort,
      trashFormatter: trashFormatter,
      trashFormatters: trashFormatters,
      total: null,
      form: {
        departmentId: this.$store.getters.departmentId,
        ids: []
      },
      dialogFormVisible: false,
      time: [],
      lookTableVisible: false,
      tableData1: [],
      detailLoading: false,
      detailQuery: {
        offset: 1,
        limit: 10
      },
      total1: null,
      detailRow: {},
      selectLoading1: false,
      disabled1: true,
      showData: [
        {
          field: 'type', title: '类型'
        },
        {
          field: 'delTotal', title: '删除条数'
        },
        {
          field: 'operator', title: '操作人'
        },
        {
          field: 'remark', title: '备注'
        },
        {
          field: 'delAt', title: '删除时间'
        }
      ]
    }
  },
  computed: {
    tableData11 () {
      let table = JSON.parse(JSON.stringify(this.tableData))
      // console.log(this.tableData, table)
      // this.tableData.forEach((item, index) => {
      //   table.push(item)
      // })
      table.forEach((item1, index1) => {
        item1.type = this.trashFormatter(item1.type)
        item1.delAt = this.timeFormatter(item1.delAt)
      })
      return table
    }
  },
  created () {
    // 开始时间
    this.listQuery.beginTime = timeFormatterSort(new Date(new Date().setDate(1))) + ' 00:00:00'
    // 结束时间
    this.listQuery.endTime = timeFormatterSort(new Date()) + ' 23:59:59'
    this.time = [this.listQuery.beginTime, this.listQuery.endTime]
    this.fetchData()
  },
  methods: {
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
    // 获取列表
    fetchData () {
      this.listLoading = true
      httpGet(pageRecoveryWhite, this.listQuery).then(res => {
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
    // 查看详情
    fetchDetailData (row) {
      this.detailLoading = true
      if (row) this.detailRow = row
      this.lookTableVisible = true
      httpGet(pageRecoveryWhiteDetail + '/' + this.detailRow.id, this.detailQuery).then(res => {
        if (res.data === null || res.data.rows === null) {
          this.tableData1 = []
          this.total1 = 0
        } else {
          this.tableData1 = res.data.rows
          this.total1 = res.data.total || 0
        }
        this.detailLoading = false
      }).catch(() => {
        this.tableData1 = []
        this.total1 = 0
        this.detailLoading = false
      })
    },
    handleSizeChangeDetail (val) {
      this.detailQuery.limit = val
      this.fetchDetailData()
    },
    handleCurrentChangeDetail (val) {
      this.detailQuery.offset = val
      this.fetchDetailData()
    },
    // 选中
    handleSelectionChange (val) {
      this.selectArrayId = []
      val.map(item => {
        this.selectArrayId.push(item.id)
      })
      if (this.selectArrayId.length !== 0) {
        this.disabled = false
      } else {
        this.disabled = true
      }
    },
    // 搜索
    handleFilter () {
      this.listQuery.offset = 1
      this.fetchData()
    },
    handleRecovery () {
      this.selectLoading = true
      httpPut(recoveryWhite, {departmentId: this.$store.getters.departmentId, ids: this.selectArrayId}).then(res => {
        this.selectLoading = false
        this.fetchData()
      }).catch(() => {
        this.selectLoading = false
      })
    },
    recovery (item) {
      this.lookTableVisible = false
      this.$confirm('确认恢复全部吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.createLoading = true
        let param = {
          departmentId: this.$store.getters.departmentId,
          ids: [item.id]
        }
        httpPut(recoveryWhite, param).then((res) => {
          this.fetchData()
          this.dialogFormVisible = false
          setTimeout(() => { this.createLoading = false }, 300)
          this.$message({
            message: res.message,
            type: 'success',
            duration: 4 * 1000
          })
        }).catch(() => {
          this.createLoading = false
        })
      }).catch(() => {})
    },
    handleRecoveryDetail () {
      this.selectLoading = true
      httpPut(recoveryWhiteDetail, {departmentId: this.$store.getters.departmentId, ids: this.selectArrayId1}).then(res => {
        this.selectLoading1 = false
        this.fetchData()
        this.fetchDetailData()
      }).catch(() => {
        this.selectLoading1 = false
      })
    },
    // 选中
    handleSelectionChange1 (val) {
      this.selectArrayId1 = []
      val.map(item => {
        this.selectArrayId1.push(item.id)
      })
      if (this.selectArrayId1.length !== 0) {
        this.disabled1 = false
      } else {
        this.disabled1 = true
      }
    },
    recoveryOne (row) {
      this.$confirm('确认恢复吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.createLoading = true
        let param = {
          departmentId: this.$store.getters.departmentId,
          ids: [row.id]
        }
        httpPut(recoveryWhiteDetail, param).then((res) => {
          this.fetchData()
          this.fetchDetailData()
          setTimeout(() => { this.createLoading = false }, 300)
          this.$message({
            message: res.message,
            type: 'success',
            duration: 4 * 1000
          })
        }).catch(() => {
          this.createLoading = false
        })
      }).catch(() => {})
    },
    getOut () {
      var obj = JSON.parse(JSON.stringify(this.listQuery))
      obj.offset = -1
      obj.limit = -1
      // let self = this
      obj = Object.assign(obj, {
        departmentId: this.$store.getters.departmentId
      })
      httpGet(pageRecoveryWhite, this.listQuery).then(res => {
        // self.dialogExportVisible = true
        // console.log(res.data.rows)
        let jsonData1 = res.data.rows
        let jsonData = []
        jsonData1.forEach((item, index) => {
          jsonData.unshift({
            type: item.type,
            delTotal: item.delTotal,
            operator: item.operator,
            remark: item.remark,
            delAt: item.delAt
          })
        })
        // console.log(jsonData)
        let str = `\0类型\0\0\0\0,\0删除条数\0,\0操作人\0,\0备注\0,\0删除时间\0\0\0\0\n`
        for (let i = 0; i < jsonData.length; i++) {
          for (let item in jsonData[i]) {
            // console.log(item)
            if (
              item === 'id'
            ) {
            } else {
              if (item === 'type') { jsonData[i][item] = this.trashFormatter(jsonData[i][item]) }
              if (item === 'delTotal') { jsonData[i][item] = jsonData[i][item] }
              if (item === 'operator') { jsonData[i][item] = jsonData[i][item] }
              if (item === 'remark') { jsonData[i][item] = jsonData[i][item] }
              if (item === 'delAt') { jsonData[i][item] = this.timeFormatter(jsonData[i][item]) }
              if (jsonData[i][item] === null) jsonData[i][item] = '' // 如果结果为null 则显示 空格
              str += `${jsonData[i][item] + '\t'},`
            }
          }
          str += '\n'
        }
        let url =
          'data:text/csv;charset=utf-8,\ufeff' + encodeURIComponent(str)
        let link = document.createElement('a')
        link.href = url
        link.download = 'recycle.csv' // 导出excel的名字
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      })
        .catch(() => {})
      // this.$nextTick(() => {
      //   this.$refs['exportForm'].resetFields()
      // })
    },
    onclose () {
      this.lookTableVisible = false
      this.detailRow = {}
      this.detailLoading = false
      this.detailQuery.offset = 1
    },
    // 重置form表单
    resetForm () {
      this.form = {
        unionId: undefined,
        departmentId: this.$store.getters.departmentId,
        type: '0',
        facePointsRulesId: undefined
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.lookbox {
  margin-top: 20px;
  position: relative;
  .close {
    position: absolute;
    top: 8px;
    right: 10px;
    &:hover {
      color: #409EFF;
      cursor: pointer;
    }
  }
}
</style>

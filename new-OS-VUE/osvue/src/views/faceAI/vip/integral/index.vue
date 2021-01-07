<template>
  <div class="app-container">
    <div class="table-main">
      <!-- 操作 -->
      <div class="filter-container">
        <el-select clearable v-model="listQuery.utype" style="width: 150px;"  class="filter-item" placeholder="类型">
          <el-option v-for="item in identityType" :key="item.valueNo" :label="item.valueName" :value="item.valueNo"></el-option>
        </el-select>
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
        <el-button class="filter-item" type="primary" @click="handleh"  icon="el-icon-download" v-has="['导出']" >导出</el-button>
        <el-button class="filter-item" type="primary" v-has="['充值']"  @click="handleChange"  icon="el-icon-edit">充值</el-button>
      </div>
      <el-table stripe :header-cell-style="{background:'#f3f4f6'}" style="width: 100%" max-height="600" :data="tableData" v-loading.body="listLoading"  @selection-change="handleSelectionChange"  element-loading-text="加载中..." border fit highlight-current-row>
        <el-table-column label="功能名称" align="center" prop="eventName"></el-table-column>
        <el-table-column label="改变积分" align="center" prop="points">
          <template slot-scope="scope">
            {{scope.row.type === 0 ? '+' + scope.row.points : '-' + scope.row.points}}
          </template>
        </el-table-column>
        <el-table-column label="记录类型" align="center" prop="type">
          <template slot-scope="scope">
            {{rechargeTypeFormatter(scope.row.type)}}
          </template>
        </el-table-column>
        <el-table-column label="类型" align="center" prop="utype">
          <template slot-scope="scope">
            {{identityFormatter(scope.row.utype)}}
          </template>
        </el-table-column>
        <el-table-column label="触发时间" align="center" prop="eventAt">
          <template slot-scope="scope">
            {{timeYearMonthDayHourFormatter(scope.row.eventAt)}}
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination background  :page-sizes="[10,20,30, 50]" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.offset " :page-size="listQuery.limit" :total="total" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
      </div>
      <el-dialog title="充值" :visible.sync="dialogFormVisible" width ="40%">
        <el-form :rules="formRules" ref="dataform" :model="form" autoCompete = "on" label-position="right" label-width="150px" >
          <!-- <el-form-item label="类型" prop="type">
            <el-radio v-model="form.type" label="0" border>企业</el-radio>
            <el-radio v-model="form.type" label="1" border>个人</el-radio>
          </el-form-item> -->
          <el-form-item label="充值规则" prop="facePointsRulesId">
            <el-select v-model="form.facePointsRulesId"  class="filter-item" >
              <el-option v-for="item in ruleList" :key="item.id" :label="item.name" :value="item.id"> </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button :loading = "createLoading" type="primary" @click="createChange">保存</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { identityType } from '@/utils/selectAble.js'
import { isShowColumnFormatter, timeFormatterSort, timeYearMonthDayHourFormatter, identityFormatter, rechargeTypeFormatter } from '@/utils/formatter.js'
import { pagePointsRecords, points, pointsRules } from '@/api/url.js'
import { httpGet, httpPost } from '@/utils/restful.js'
export default {
  data () {
    return {
      list: null,
      listLoading: true,
      createLoading: false,
      filterDisabled: false,
      listQuery: {
        offset: 1,
        limit: 10,
        unionId: Number(this.$store.getters.departmentId),
        utype: 0,
        beginTime: undefined,
        endTime: undefined
      },
      tableData: [],
      identityType: identityType,
      timeFormatterSort: timeFormatterSort,
      timeYearMonthDayHourFormatter: timeYearMonthDayHourFormatter,
      identityFormatter: identityFormatter,
      rechargeTypeFormatter: rechargeTypeFormatter,
      isShowColumnFormatter: isShowColumnFormatter,
      total: null,
      ruleList: [],
      form: {
        unionId: undefined,
        departmentId: this.$store.getters.departmentId,
        type: '0',
        facePointsRulesId: undefined
      },
      formRules: {
        facePointsRulesId: [
          {required: true, trigger: 'change', message: '请选择充值规则'}
        ]
      },
      disabled: true,
      dialogFormVisible: false,
      time: [],
      jsonData: [
        {
          title: '功能名称',
          key: 'eventName',
          type: 'text'
        },
        {
          title: '改变积分',
          key: 'points',
          type: 'text'
        },
        {
          title: '记录类型',
          key: 'type',
          type: 'text'
        },
        {
          title: '类型',
          key: 'utype',
          type: 'text'
        },
        {
          title: '触发时间',
          key: 'eventAt',
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
    // 开始时间
    this.listQuery.beginTime = timeFormatterSort(new Date(new Date().setDate(1))) + ' 00:00:00'
    // 结束时间
    this.listQuery.endTime = timeFormatterSort(new Date()) + ' 23:59:59'
    this.time = [this.listQuery.beginTime, this.listQuery.endTime]
    this.fetchData()
  },
  methods: {
    handleh () {
      let obj = JSON.parse(JSON.stringify(this.tableData))
      obj.forEach((item, index) => {
        item.points = item.type === 0 ? '+' + item.points : '-' + item.points
        item.type = this.rechargeTypeFormatter(item.type)
        item.utype = this.identityFormatter(item.utype)
        item.eventAt = this.timeYearMonthDayHourFormatter(item.eventAt)
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
    // 获取列表
    fetchData () {
      this.listLoading = true
      httpGet(pagePointsRecords, this.listQuery).then(res => {
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
    createChange () {
      this.$refs.dataform.validate((valid) => {
        if (valid) {
          this.createLoading = true
          let param = this.form
          // string转num
          param.type = Number(param.type)
          httpPost(points, param).then((res) => {
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
        }
      })
    },
    loadRules () {
      httpGet('pv/' + pointsRules, {type: 0}).then(res => {
        this.ruleList = res.data
      }).catch(() => {})
    },
    // 充值
    handleChange () {
      this.dialogFormVisible = true
      // 加载充值规则
      this.loadRules()
      this.$nextTick(() => {
        this.$refs['dataform'].clearValidate()
        this.$refs.dataform.resetFields()
      })
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

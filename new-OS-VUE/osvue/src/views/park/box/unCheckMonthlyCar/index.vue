<template>
  <div class="app-container">
     <div class="table-main">
        <!-- 操作 -->
        <div class="filter-container">
          <el-input clearable style="width: 150px;" v-model="listQuery.name" class="filter-item" placeholder="车主姓名"></el-input>
          <el-autocomplete clearable class="filter-item" style="width: 150px;" v-model="listQuery.plate" :fetch-suggestions="querySearch" placeholder="车牌号"></el-autocomplete>
          <el-select clearable v-model="listQuery.isSync"  class="filter-item" placeholder="同步状态">
            <el-option v-for="item in isSyncMonthType" :key="item.valueNo" :label="item.valueName" :value="item.valueNo"></el-option>
          </el-select>
          <el-button class="filter-item" type="primary"   @click="handleFilter" icon="el-icon-search">搜索</el-button>
          <el-button class="filter-item" type="primary"   @click="handleRefresh" icon="el-icon-refresh">刷新</el-button>
          <el-button class="filter-item" type="primary" @click="handleh"  icon="el-icon-download" v-has="['导出']" >导出</el-button>
          <el-button class="filter-item" type="primary"  v-has="['批量审核']" :loading = "checkLoading" @click="handleCheck" :disabled="disabled" >
            <i class="fa fa-check"></i>
            批量审核</el-button>
          <el-button class="filter-item" type="danger"  v-has="['审核所有']" :loading = "checkAllLoading" @click="handleAllCheck">
            <i class="fa fa-check-square-o"></i>
            一键审核</el-button>
            <span class="filter-item" style="font-size: 14px; color:red;">备注： 红色标注为修改前的数据</span>
        </div>
        <el-table stripe :header-cell-style="{background:'#f3f4f6'}" style="width: 100%" max-height="600" :data="tableData" v-loading.body="listLoading" @selection-change="handleSelectionChange" element-loading-text="加载中..." border fit highlight-current-row>
          <el-table-column type="selection" width="40" fixed="left"></el-table-column>
          <el-table-column label="车主姓名" align="center" prop="name">
            <template slot-scope="scope">
              <span>{{newFormatter(scope.row.name)}}</span>
              <span style="color:red;">{{oldFormatter(scope.row.name)}}</span>
            </template>
          </el-table-column>
          <el-table-column label="车牌号码" align="center" prop="plate">
            <template slot-scope="scope">
              <span>{{newFormatter(scope.row.plate)}}</span>
              <span style="color:red;">{{oldFormatter(scope.row.plate)}}</span>
            </template>
          </el-table-column>
          <el-table-column label="联系方式" align="center" prop="phone">
            <template slot-scope="scope">
              <span>{{newFormatter(scope.row.phone)}}</span>
              <span style="color:red;">{{oldFormatter(scope.row.phone)}}</span>
            </template>
          </el-table-column>
          <el-table-column label="车位信息" align="center" prop="carcw">
            <template slot-scope="scope">
              <span>{{newFormatter(scope.row.carcw)}}</span>
              <span style="color:red;">{{oldFormatter(scope.row.carcw)}}</span>
            </template>
          </el-table-column>
          <el-table-column label="同步状态" align="center" prop="isSync">
            <template slot-scope="scope">
              {{ isSyncFormatter(isSynForm(scope.row.isSync)) }}
            </template>
          </el-table-column>
          <el-table-column label="开始时间" align="center" prop="beginTime">
            <template slot-scope="scope">
              <span>{{ timeFormatter(timeNewForm(scope.row.beginTime)) }}</span>
              <span style="color:red;">{{ timeOldForm(scope.row.beginTime) ? '(' + timeFormatter(timeOldForm(scope.row.beginTime)) + ')': '' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="结束时间" align="center" prop="endTime">
            <template slot-scope="scope">
              <span>{{ timeFormatter(timeNewForm(scope.row.endTime)) }}</span>
              <span style="color:red;">{{ timeOldForm(scope.row.endTime) ? '(' + timeFormatter(timeOldForm(scope.row.endTime)) + ')' : '' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="备注信息" align="center" prop="reason">
            <template slot-scope="scope">
               <span>{{newFormatter(scope.row.reason)}}</span>
              <span style="color:red;">{{oldFormatter(scope.row.reason)}}</span>
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
import { isSyncFormatter, timeFormatter, isShowColumnFormatter } from '@/utils/formatter.js'
import { isSyncMonthType, plateType } from '@/utils/selectAble.js'
import { getUnCheckMonthCar, checkMonthCar } from '@/api/url'
import { httpGet, httpPost } from '@/utils/restful.js'
import UploadFile from '@/components/UploadFile'
export default {
  components: {
    UploadFile
  },
  data () {
    return {
      list: null,
      listLoading: true,
      createLoading: false,
      checkLoading: false,
      checkAllLoading: false,
      listQuery: {
        offset: 1,
        limit: 10,
        name: undefined,
        plate: undefined,
        isSync: undefined
      },
      tableData: [],
      isSyncFormatter: isSyncFormatter,
      isShowColumnFormatter: isShowColumnFormatter,
      timeFormatter: timeFormatter,
      isSyncMonthType: isSyncMonthType,
      plateType: plateType,
      total: null,
      selectArrayId: [],
      disabled: true,
      jsonData: [
        {
          title: '车主姓名',
          key: 'name',
          type: 'text'
        },
        {
          title: '车牌号码',
          key: 'plate',
          type: 'text'
        },
        {
          title: '联系方式',
          key: 'phone',
          type: 'text'
        },
        {
          title: '车位信息',
          key: 'carcw',
          type: 'text'
        },
        {
          title: '同步状态',
          key: 'isSync',
          type: 'text'
        },
        {
          title: '开始时间',
          key: 'beginTime',
          type: 'text'
        },
        {
          title: '结束时间',
          key: 'endTime',
          type: 'text'
        },
        {
          title: '备注信息',
          key: 'reason',
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
        item.name = '新数据: ' + this.newFormatter(item.name) + '   旧数据: ' + this.oldFormatter(item.name)
        item.plate = '新数据: ' + this.newFormatter(item.plate) + '   旧数据: ' + this.oldFormatter(item.plate)
        item.phone = '新数据: ' + this.newFormatter(item.phone) + '   旧数据: ' + this.oldFormatter(item.phone)
        item.carcw = '新数据: ' + this.newFormatter(item.carcw) + '   旧数据: ' + this.oldFormatter(item.carcw)
        item.beginTime = '新数据: ' + this.timeFormatter(this.timeNewForm(item.beginTime)) + '   旧数据: ' + this.timeOldForm(item.beginTime) ? '(' + this.timeFormatter(this.timeOldForm(item.beginTime)) + ')' : ''
        item.endTime = '新数据: ' + this.timeFormatter(this.timeNewForm(item.endTime)) + '   旧数据: ' + this.timeOldForm(item.endTime) ? '(' + this.timeFormatter(this.timeOldForm(item.endTime)) + ')' : ''
        item.isSync = this.isSyncFormatter(this.isSynForm(item.isSync))
        item.reason = '新数据: ' + this.newFormatter(item.reason) + '   旧数据: ' + this.oldFormatter(item.reason)
      })
      this.table2excel(this.jsonData, obj, 'excel.xlsx')
    },
    timeNewForm (value) {
      let val
      if (typeof value === 'number') {
        val = value
      } else {
        val = Number(value.split('||')[0])
      }
      return val
    },
    timeOldForm (value) {
      let val
      if (typeof value === 'number') {
        val = undefined
      } else {
        val = Number(value.split('||')[1])
      }
      return val
    },
    isSynForm (value) {
      if (typeof value === 'number') {
        return value
      } else {
        return Number(value.split('||')[0])
      }
    },
    isSynOldForm (value) {
      if (typeof value === 'number') {
        return ''
      } else {
        return Number(value.split('||')[1])
      }
    },
    newFormatter (value) {
      if (value === null) return ''
      let val
      if (value.indexOf('||') > -1) {
        val = value.split('||')[0]
      } else if (value !== null) {
        val = value
      } else {
        val = ''
      }
      return val
    },
    oldFormatter (value) {
      if (value === null) return ''
      let val
      if (value.indexOf('||') > -1 && value.split('||')[1] !== ' ') {
        val = '(' + value.split('||')[1] + ')'
      } else {
        val = ''
      }
      return val
    },
    // 格式化时间
    chooseTimeRange (time) {
      if (time !== null) {
        this.form.beginTime = time[0]
        this.form.endTime = time[1]
      }
    },
    fetchData () {
      this.listQuery = Object.assign(this.listQuery, {departmentId: this.$store.getters.departmentId})
      httpGet(getUnCheckMonthCar, this.listQuery).then(res => {
        if (res.data === null || res.data.rows === null) {
          this.tableData = []
          this.total = 0
        } else {
          this.total = res.data.total
          let data = []
          for (const item of res.data.rows) {
            // 如果没有老数据
            if (item.oldInfo === null) {
              data.push(item.newInfo)
            } else {
              // 对修改数据的处理
              let keys = Object.keys(item.newInfo)
              let row = {}
              for (let i = 0; i < keys.length; i++) {
                const key = keys[i]
                if (item.newInfo[key] === null) {
                  item.newInfo[key] = ''
                }
                if (item.oldInfo[key] === null) {
                  item.oldInfo[key] = ''
                }
                if (item.newInfo[key] === item.oldInfo[key]) {
                  Object.assign(row, {[key]: item.oldInfo[key]})
                } else {
                  Object.assign(row, {[key]: item.newInfo[key] + ' || ' + item.oldInfo[key]})
                }
              }
              data.push(row)
            }
          }
          console.log(data)
          this.tableData = data
        }
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    objectSpanMethod ({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        if (rowIndex % 2 === 0) {
          return {
            rowspan: 2,
            colspan: 1
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }
    },
    handleSizeChange (val) {
      this.listQuery.limit = val
      this.fetchData()
    },
    handleCurrentChange (val) {
      this.listQuery.offset = val
      this.fetchData()
    },
    // 重置搜索条件
    handleRefresh () {
      this.listQuery = {
        offset: 1,
        limit: 10,
        name: undefined,
        plate: undefined,
        isSync: undefined
      }
      this.fetchData()
    },
    // 搜索
    handleFilter () {
      this.listQuery.offset = 1
      this.fetchData()
    },
    // 车牌
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
    // 审核选中
    handleCheck () {
      this.$confirm('确认审核通过所选中的数据吗？', '提示', {})
        .then(() => {
          this.checkLoading = true
          httpPost(checkMonthCar, {ids: this.selectArrayId}).then(res => {
            this.checkLoading = false
            this.fetchData()
            this.$message({
              type: 'success',
              message: res.message,
              duration: 4 * 1000
            })
          }).catch(() => {
            this.checkLoading = false
          })
        }).catch(() => {})
    },
    // 选中
    handleSelectionChange (val) {
      this.selectArrayId = []
      val.map(item => {
        let val = this.timeNewForm(item.id)
        this.selectArrayId.push(val)
      })
      if (this.selectArrayId.length !== 0) {
        this.disabled = false
      } else {
        this.disabled = true
      }
    },
    // 审核所有
    handleAllCheck () {
      this.$confirm('确认审核通过所有数据吗？', '提示', {})
        .then(() => {
          this.checkAllLoading = true
          httpPost(checkMonthCar + '/' + this.$store.getters.departmentId).then(res => {
            this.checkAllLoading = false
            this.fetchData()
            this.$message({
              type: 'success',
              message: res.message,
              duration: 4 * 1000
            })
          }).catch(() => {
            this.checkAllLoading = false
          })
        }).catch(() => {})
    }
  }
}
</script>

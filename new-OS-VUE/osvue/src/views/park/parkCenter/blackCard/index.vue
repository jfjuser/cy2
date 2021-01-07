<template>
  <div class="app-container">
    <div class="table-main">
      <!-- 操作 -->
      <div class="filter-container">
        <el-autocomplete clearable class="filter-item" style="width: 150px;" v-model="listQuery.plate" :fetch-suggestions="querySearch" placeholder="车牌号"></el-autocomplete>
        <el-select clearable v-model="listQuery.type"  class="filter-item" placeholder="车类型">
          <el-option v-for="item in blackCarType" :key="item.valueNo" :label="item.valueName" :value="item.valueNo"></el-option>
        </el-select>
        <el-select clearable v-model="listQuery.isSync"  class="filter-item" placeholder="同步状态">
          <el-option v-for="item in isSyncType" :key="item.valueNo" :label="item.valueName" :value="item.valueNo"></el-option>
        </el-select>
        <el-button class="filter-item" type="primary"   @click="handleFilter" icon="el-icon-search">搜索</el-button>
        <el-button class="filter-item" type="primary"  v-has="['新增']" @click="handleCreate"  icon="el-icon-edit">添加</el-button>
        <el-button class="filter-item" type="primary" @click="handleh"  icon="el-icon-download" v-has="['导出']" >导出</el-button>
        <el-button class="filter-item" type="danger"  v-has="['删除']" @click="handleDelete" :disabled="disabled" icon="el-icon-close">删除所选</el-button>
        <el-button class="filter-item" type="primary"   @click="handleRefresh"  icon="el-icon-refresh">刷新</el-button>
      </div>
      <el-table stripe :header-cell-style="{background:'#f3f4f6'}" style="width: 100%" max-height="600" :data="tableData" v-loading.body="listLoading" @selection-change="handleSelectionChange" element-loading-text="加载中..." border fit highlight-current-row>
        <el-table-column type="selection" width="40" fixed="left" v-if = "isShowColumnFormatter(['删除'])"></el-table-column>
        <el-table-column label="部门名称" align="center" prop="departmentName"></el-table-column>
        <el-table-column label="车牌号码" align="center" prop="plate"></el-table-column>
        <el-table-column label="车类型" align="center" prop="type">
          <template slot-scope="scope">
            {{ blackCarTypeFormatter(scope.row.type) }}
          </template>
        </el-table-column>
        <el-table-column label="同步状态" align="center" prop="isSync">
          <template slot-scope="scope">
              {{ isSyncFormatter(scope.row.isSync) }}
          </template>
        </el-table-column>
        <el-table-column label="开始时间" align="center" prop="startTime">
          <template slot-scope="scope">
            {{timeFormatter(scope.row.startTime)}}
          </template>
        </el-table-column>
        <el-table-column label="结束时间" align="center" prop="endTime">
          <template slot-scope="scope">
            {{timeFormatter(scope.row.endTime)}}
          </template>
        </el-table-column>
        <el-table-column label="备注信息" align="center" prop="remarks"></el-table-column>
        <el-table-column fixed="right" label="操作" v-if = "isShowColumnFormatter(['编辑'])" align="center" class-name="small-padding fixed-width" width="150">
          <template slot-scope="scope">
            <el-button v-has="['编辑']"  type="primary" @click.native.prevent="handleUpdate(scope.row)" size="mini">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination background  :page-sizes="[10,20,30, 50]" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.offset " :page-size="listQuery.limit" :total="total" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
      </div>
      <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width= "40%">
        <el-form :rules="formRules" ref="dataform" :model="form" autoCompete = "on" label-position="right" label-width="100px" >
          <el-form-item label="车牌号" prop="plate">
            <el-autocomplete style="width:100%" v-model="form.plate" :fetch-suggestions="querySearch" placeholder="车牌号"></el-autocomplete>
          </el-form-item>
          <el-form-item label="车类型" prop="type">
            <el-select  v-model="form.type"  placeholder="请选择车类型" style="width:100%">
              <el-option v-for="item in blackCarType" :key="item.valueNo" :label="item.valueName" :value="item.valueNo"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="日期" required>
            <el-date-picker
              v-model="time"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="chooseTimeRange"
              >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="备注信息">
            <el-input type="textarea" v-model="form.remarks"  placeholder="请输入备注信息"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">保存</el-button>
          <el-button v-else type="primary" @click="updateData">修改</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { plateType, blackCarType, isSyncType } from '@/utils/selectAble.js'
import { blackCarTypeFormatter, isSyncFormatter, timeFormatter, isShowColumnFormatter } from '@/utils/formatter.js'
import { checkPlate } from '@/utils/validator.js'
import { httpGet, httpPost, httpDelete, httpPut } from '@/utils/restful'
import { getBlackCard, BlackCard } from '@/api/url'
export default {
  data () {
    return {
      isShowColumnFormatter: isShowColumnFormatter,
      list: null,
      listLoading: true,
      listQuery: {
        offset: 1,
        limit: 10,
        plate: undefined,
        type: undefined,
        isSync: undefined,
        time: undefined
      },
      tableData: [],
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '添加'
      },
      total: null,
      selectArrayId: [],
      disabled: true,
      isSyncType: isSyncType,
      plateType: plateType,
      blackCarType: blackCarType,
      blackCarTypeFormatter: blackCarTypeFormatter,
      isSyncFormatter: isSyncFormatter,
      timeFormatter: timeFormatter,
      form: {
        id: undefined,
        plate: '',
        type: '',
        startTime: '',
        endTime: '',
        remarks: ''
      },
      time: [],
      formRules: {
        type: [
          {required: true, trigger: 'change', message: '请选择车类型'}
        ],
        plate: [
          {required: true, trigger: 'blur', message: '请输入车牌号码'},
          {validator: checkPlate, trigger: 'blur'}
        ],
        startTime: [
          {required: true, trigger: 'change', message: '请选择开始时间'}
        ],
        endTime: [
          {required: true, trigger: 'change', message: '请选择结束时间'}
        ]
      },
      jsonData: [
        {
          title: '部门名称',
          key: 'departmentName',
          type: 'text'
        },
        {
          title: '车牌号码',
          key: 'plate',
          type: 'text'
        },
        {
          title: '车类型',
          key: 'type',
          type: 'text'
        },
        {
          title: '同步状态',
          key: 'isSync',
          type: 'text'
        },
        {
          title: '开始时间',
          key: 'startTime',
          type: 'text'
        },
        {
          title: '结束时间',
          key: 'endTime',
          type: 'text'
        },
        {
          title: '备注信息',
          key: 'remarks',
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
        item.type = this.blackCarTypeFormatter(item.type)
        item.isSync = this.isSyncFormatter(item.isSync)
        item.startTime = this.timeFormatter(item.startTime)
        item.endTime = this.timeFormatter(item.endTime)
      })
      this.table2excel(this.jsonData, obj, 'excel.xlsx')
    },
    chooseTimeRange (time) {
      if (time === null) {
        this.$message({
          type: 'warning',
          message: '请选择日期'
        })
      } else {
        this.form.startTime = time[0]
        this.form.endTime = time[1]
      }
    },
    fetchData () {
      this.listQuery = Object.assign(this.listQuery, {departmentId: this.$store.getters.departmentId})
      httpGet(getBlackCard, this.listQuery).then(res => {
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
    // 重置form表单
    resetForm () {
      this.form = {
        id: undefined,
        plate: '',
        type: '',
        startTime: '',
        endTime: '',
        remarks: ''
      }
    },
    handleCreate () {
      let self = this
      self.time = []
      self.dialogStatus = 'create'
      self.dialogFormVisible = true
      // 延迟调用
      self.$nextTick(() => {
        self.$refs['dataform'].resetFields()
        self.resetForm()
      })
    },
    handleUpdate (row) {
      this.form = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.time = [this.form.startTime, this.form.endTime]
        this.$refs.dataform.clearValidate()
      })
    },
    // 搜索
    handleFilter () {
      this.listQuery.offset = 1
      this.fetchData()
    },
    // 新增
    createData () {
      this.$refs.dataform.validate((valid) => {
        if (valid) {
          this.createLoading = true
          this.form = Object.assign(this.form, {departmentId: this.$store.getters.departmentId})
          httpPost(BlackCard, this.form).then((res) => {
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
    // 修改
    updateData () {
      this.$refs.dataform.validate((valid) => {
        if (valid) {
          this.updateLoading = true
          const updateFormData = Object.assign({}, this.form)
          httpPut(BlackCard, updateFormData).then(res => {
            this.fetchData()
            this.dialogFormVisible = false
            setTimeout(() => { this.updateLoading = false }, 300)
            this.$message({
              message: res.message,
              type: 'success',
              duration: 4 * 1000
            })
          }).catch(() => {
            this.updateLoading = false
          })
        }
      })
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
    // 删除选中
    handleDelete () {
      this.$confirm('确认提交吗？', '提示', {})
        .then(() => {
          this.deleteLoading = true
          httpDelete(BlackCard, {
            ids: this.selectArrayId,
            departmentId: this.$store.getters.departmentId
          }).then(res => {
            this.deleteLoading = false
            this.fetchData()
            this.$message({
              type: 'success',
              message: res.message,
              duration: 4 * 1000
            })
          }).catch(() => {
            this.deleteLoading = false
          })
        }).catch(() => {})
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
    // 重置搜索按钮
    resetListQuery () {
      this.listQuery = {
        offset: 1,
        limit: 10,
        plate: undefined,
        type: undefined,
        isSync: undefined,
        time: undefined
      }
    },
    handleRefresh () {
      this.resetListQuery()
      this.fetchData()
    }
  }
}
</script>

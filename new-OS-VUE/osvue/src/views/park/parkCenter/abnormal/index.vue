<template>
  <div class="app-container">
    <div class="table-main">
      <!-- 操作 -->
      <div class="filter-container">
        <el-button class="filter-item" type="primary"  v-has="['新增']" @click="handleCreate"  icon="el-icon-edit">添加</el-button>
        <el-button class="filter-item" type="primary"    @click="handleRefresh"  icon="el-icon-refresh">刷新</el-button>
        <el-button class="filter-item" type="primary" @click="handleh"  icon="el-icon-download" v-has="['导出']" >导出</el-button>
        <el-button class="filter-item" type="danger"  v-has="['删除']" :loading = "deleteLoading" @click="handleDelete" :disabled="disabled" icon="el-icon-close">删除所选</el-button>
      </div>
      <el-table stripe :header-cell-style="{background:'#f3f4f6'}" style="width: 100%" max-height="600" :data="tableData" v-loading.body="listLoading" @selection-change="handleSelectionChange" element-loading-text="加载中..." border fit highlight-current-row>
        <el-table-column type="selection" width="40" fixed="left" v-if = "isShowColumnFormatter(['删除'])" ></el-table-column>
        <el-table-column label="本地编号" align="center" prop="localId"></el-table-column>
        <el-table-column label="所属车场" align="center" prop="departmentName"></el-table-column>
        <el-table-column label="操作员编号" align="center" prop="uin"></el-table-column>
        <el-table-column label="异常原因" align="center" prop="abnormalReason"></el-table-column>
        <el-table-column label="异常产生时间" align="center" prop="abnormalTime">
          <template slot-scope="scope">
            {{timeFormatter(scope.row.abnormalTime)}}
          </template>
        </el-table-column>
        <el-table-column fixed="right" v-if = "isShowColumnFormatter(['编辑'])"  label="操作" align="center" class-name="small-padding fixed-width" width="120">
          <template slot-scope="scope">
            <el-button v-has="['编辑']"  type="primary" @click="handleUpdate(scope.row)" size="mini">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination background  :page-sizes="[10,20,30, 50]" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.offset " :page-size="listQuery.limit" :total="total" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
      </div>
      <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
        <el-form :rules="formRules" ref="dataform" :model="form" autoCompete = "on" label-position="right" label-width="150px" >
          <el-form-item label="事件说明" prop="abnormalReason">
            <el-input type="textarea"  v-model="form.abnormalReason"  placeholder="请输入事件说明">
            </el-input>
          </el-form-item>
          <el-form-item label="异常产生时间" required>
            <el-date-picker
              v-model="form.abnormalTime"
              type="datetime"
              placeholder="异常产生时间">
            </el-date-picker>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button :loading = "createLoading" v-if="dialogStatus=='create'" type="primary" @click="createData">保存</el-button>
          <el-button :loading = "updateLoading" v-else type="primary" @click="updateData">修改</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { timeFormatter, isShowColumnFormatter } from '@/utils/formatter.js'
import { httpGet, httpDelete, httpPost, httpPut } from '@/utils/restful'
import { getAbnormal, Abnormal } from '@/api/url'
export default {
  data () {
    return {
      isShowColumnFormatter: isShowColumnFormatter,
      list: null,
      listLoading: true,
      createLoading: false,
      deleteLoading: false,
      updateLoading: false,
      timeFormatter: timeFormatter,
      listQuery: {
        offset: 1,
        limit: 10
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
      form: {
        id: undefined,
        abnormalReason: undefined,
        abnormalTime: undefined
      },
      formRules: {
        abnormalReason: [
          {required: true, trigger: 'blur', message: '不可为空'}
        ]
      },
      jsonData: [
        {
          title: '本地编号',
          key: 'localId',
          type: 'text'
        },
        {
          title: '所属车场',
          key: 'departmentName',
          type: 'text'
        },
        {
          title: '操作员编号',
          key: 'uin',
          type: 'text'
        },
        {
          title: '异常原因',
          key: 'abnormalReason',
          type: 'text'
        },
        {
          title: '异常产生时间',
          key: 'abnormalTime',
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
        item.abnormalTime = this.timeFormatter(item.abnormalTime)
      })
      this.table2excel(this.jsonData, obj, 'excel.xlsx')
    },
    fetchData () {
      this.listQuery = Object.assign(this.listQuery, {departmentId: this.$store.getters.departmentId})
      httpGet(getAbnormal, this.listQuery).then(res => {
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
        abnormalReason: undefined,
        abnormalTime: undefined
      }
    },
    handleCreate () {
      let self = this
      self.dialogStatus = 'create'
      self.dialogFormVisible = true
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
          httpPost(Abnormal, this.form).then((res) => {
            this.createLoading = false
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
          httpPut(Abnormal, updateFormData).then(res => {
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
    // 删除选中
    handleDelete () {
      this.$confirm('确认提交吗？', '提示', {})
        .then(() => {
          this.deleteLoading = true
          httpDelete(Abnormal, {ids: this.selectArrayId}).then(res => {
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
    // 刷新
    handleRefresh () {
      this.listQuery = {
        limit: 10,
        offset: 1
      }
      this.fetchData()
    }
  }
}
</script>

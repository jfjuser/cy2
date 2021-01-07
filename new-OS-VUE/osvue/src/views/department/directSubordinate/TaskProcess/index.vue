<template>
  <div>
    <!-- 操作 -->
    <div class="filter-container">
      <el-button class="filter-item" type="primary"   @click="handleRefresh"  icon="el-icon-refresh">刷新</el-button>
      <el-button class="filter-item" type="primary"   @click="handleCreate"  icon="el-icon-edit">添加</el-button>
      <el-button class="filter-item" type="primary" @click="handleh"  icon="el-icon-download" v-has="['导出']" >导出</el-button>
      <el-button class="filter-item" type="danger"  :loading="deleteLoading" @click="handleDelete" :disabled="disabled" icon="el-icon-close">删除所选</el-button>
    </div>
    <el-table stripe :header-cell-style="{background:'#f3f4f6'}" style="width: 100%" max-height="600" :data="tableData" v-loading.body="listLoading" @selection-change="handleSelectionChange" element-loading-text="加载中..." border fit highlight-current-row>
      <el-table-column type="selection" width="40" fixed="left" ></el-table-column>
      <el-table-column label="事件名" align="center" prop="eventName"></el-table-column>
      <el-table-column label="反射名" align="center" prop="eventCode"></el-table-column>
      <el-table-column label="地址" align="center" prop="url"></el-table-column>
      <el-table-column label="扩展地址1" align="center" prop="urlExtend1"></el-table-column>
      <el-table-column label="扩展地址2" align="center" prop="urlExtend2"></el-table-column>
      <el-table-column label="备注信息" align="center" prop="remarks"></el-table-column>
      <el-table-column fixed="right" label="操作" align="center" class-name="small-padding fixed-width" width="120">
        <template slot-scope="scope">
          <el-button type="primary" @click.native.prevent="handleUpdate(scope.row)" size="mini">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination background  :page-sizes="[5,10,20,30, 50]" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.offset " :page-size="listQuery.limit" :total="total" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
    </div>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible"  >
      <el-form :rules="formRules" ref="dataform" :model="form" autoCompete = "on" label-position="right" label-width="150px" >
        <el-form-item label="事件名称" prop="eventName">
          <el-input v-model="form.eventName" placeholder="请输入事件名称"></el-input>
        </el-form-item>
        <el-form-item label="事件反射名" prop="eventCode">
          <el-input  v-model="form.eventCode"  clearable placeholder="请输入事件反射名"></el-input>
        </el-form-item>
        <el-form-item label="地址" prop="url">
          <el-input    v-model="form.url"  clearable placeholder="请输入地址"></el-input>
        </el-form-item>
        <el-form-item label="扩展地址1" >
          <el-input  v-model="form.urlExtend1"  clearable placeholder="请输入扩展地址1"></el-input>
        </el-form-item>
        <el-form-item label="扩展地址2">
          <el-input   v-model="form.urlExtend2"  clearable placeholder="请输入扩展地址2"></el-input>
        </el-form-item>
        <el-form-item label="备注信息">
          <el-input type="textarea"   v-model="form.remarks"  clearable placeholder="请输入备注信息"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button :loading="createLoading" v-if="dialogStatus=='create'" type="primary" @click="createData">保存</el-button>
        <el-button :loading="updateLoading" v-else type="primary" @click="updateData">修改</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { checkUrl } from '@/utils/validator.js'
import { getTasks, Task } from '@/api/url'
import { httpGet, httpPost, httpPut, httpDelete } from '@/utils/restful'
export default {
  name: 'TaskProcess',
  props: ['id', 'level'],
  data () {
    return {
      list: null,
      listLoading: true,
      createLoading: false,
      deleteLoading: false,
      updateLoading: false,
      roleLoading: false,
      listQuery: {
        offset: 1,
        limit: 5
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
        eventName: undefined,
        eventCode: undefined,
        url: undefined,
        urlExtend1: undefined,
        urlExtend2: undefined,
        remarks: undefined
      },
      formRules: {
        eventName: [
          {required: true, trigger: 'blur', message: '请输入任务类型'}
        ],
        eventCode: [
          {required: true, trigger: 'blur', message: '请输入事件反射名'}
        ],
        url: [
          {required: true, trigger: 'blur', message: '请输入地址'},
          {validator: checkUrl, trigger: 'blur'}
        ],
        urlExtend1: [
          {validator: checkUrl, trigger: 'blur'}
        ],
        urlExtend2: [
          {validator: checkUrl, trigger: 'blur'}
        ]
      },
      jsonData: [
        {
          title: '事件名',
          key: 'eventName',
          type: 'text'
        },
        {
          title: '反射名',
          key: 'eventCode',
          type: 'text'
        },
        {
          title: '地址',
          key: 'url',
          type: 'text'
        },
        {
          title: '扩展地址1',
          key: 'urlExtend1',
          type: 'text'
        },
        {
          title: '扩展地址2',
          key: 'urlExtend2',
          type: 'text'
        },
        {
          title: '备注信息',
          key: 'remarks',
          type: 'text'
        }
        // ,
        // {
        //   title: '备注信息',
        //   key: 'pic',
        //   type: 'image',
        //   width: 80,
        //   height: 50
        // }
      ]
    }
  },
  watch: {
    id (curVal, oldVal) {
      this.curId = curVal
      this.handleFilter()
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    handleh () {
      let obj = JSON.parse(JSON.stringify(this.tableData))
      this.table2excel(this.jsonData, obj, 'excel.xlsx')
    },
    handleRefresh () {
      this.listQuery = {
        offset: 1,
        limit: 5
      }
      this.fetchData()
    },
    fetchData () {
      let self = this
      self.listQuery = Object.assign(this.listQuery, { departmentId: this.id })
      httpGet(getTasks, self.listQuery).then(res => {
        if (res.data === null || res.data.rows === null) {
          self.tableData = []
          self.total = 0
        } else {
          self.tableData = res.data.rows
          self.total = res.data.total
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
    // 重置form表单
    resetForm () {
      this.form = {
        id: undefined,
        eventName: undefined,
        eventCode: undefined,
        url: undefined,
        urlExtend1: undefined,
        urlExtend2: undefined,
        remarks: undefined
      }
    },
    handleCreate () {
      let self = this
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
          this.form = Object.assign(this.form, { departmentId: this.id })
          httpPost(Task, this.form).then((res) => {
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
          httpPut(Task, updateFormData).then(res => {
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
          httpDelete(Task, {ids: this.selectArrayId}).then(res => {
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
      if (this.selectArrayId.length > 0) {
        this.disabled = false
      } else {
        this.disabled = true
      }
    }
  }
}
</script>

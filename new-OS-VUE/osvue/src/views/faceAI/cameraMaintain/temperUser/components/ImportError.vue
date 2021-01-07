<template>
  <div>
    <!-- 操作 -->
      <div class="filter-container">
        <el-button class="filter-item" type="primary" @click="handleRefresh" icon="el-icon-refresh">刷新</el-button>
        <el-button class="filter-item" type="primary" @click="handleh"  icon="el-icon-download" v-has="['导出']" >导出</el-button>
        <el-button class="filter-item" type="danger" :loading = "deleteLoading" @click="handleDelete" :disabled="disabled" icon="el-icon-close">删除所选</el-button>
        <el-button class="filter-item" type="danger" plain :loading = "deleteAllLoading" @click="handleAllDelete"  icon="el-icon-delete">删除所有</el-button>
      </div>
      <el-table stripe :header-cell-style="{background:'#f3f4f6'}" style="width: 100%" max-height="600" :data="tableData" v-loading.body="listLoading"  @selection-change="handleSelectionChange"  element-loading-text="加载中..." border fit highlight-current-row>
        <el-table-column type="selection" width="40" fixed="left"></el-table-column>
        <el-table-column label="姓名" align="center" prop="leader"></el-table-column>
        <el-table-column label="手机号" align="center" prop="phone"></el-table-column>
        <el-table-column label="备注信息" align="center" prop="remark"></el-table-column>
        <el-table-column fixed="right" label="操作" align="center" class-name="small-padding fixed-width" width="300">
          <template slot-scope="scope">
            <el-button type="primary" @click.native.prevent="handleUpdate(scope.row)" size="mini">修改</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog title="编辑" :visible.sync = "dialogFormVisible" width="30%">
        <el-form :rules="formRules" ref="dataform" :model="form" autoComplete="on" label-position="right" label-width="150px">
          <el-form-item label="姓名" prop="leader">
            <el-input v-model="form.leader" placeholder="请输入姓名"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="phone">
            <el-input type="tel" v-model="form.phone" @blur="phoneCheck" placeholder="请输入手机号"></el-input>
          </el-form-item>
          <el-form-item label="备注信息">
            <el-input type="textarea"  v-model="form.remark" placeholder="请输入备注信息"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button :loading="updateLoading" type="primary" @click="updateData">保存</el-button>
        </div>
      </el-dialog>
  </div>
</template>
<script>
import { checkPhone } from '@/utils/validator.js'
import { httpGet, httpDelete, httpPut } from '@/utils/restful'
import { getAIErrorData, AIErrorData, AiDuyCompany } from '@/api/url'
export default {
  name: 'import-error',
  data () {
    return {
      disabled: true,
      list: null,
      listLoading: true,
      updateLoading: false,
      deleteLoading: false,
      deleteAllLoading: false,
      dialogFormVisible: false,
      listQuery: {
        offset: 1,
        limit: 5
      },
      tableData: [],
      total: null,
      selectArrayId: [],
      form: {
        id: undefined,
        leader: undefined,
        phone: undefined,
        remark: undefined
      },
      formRules: {
        leader: [
          {required: true, trigger: 'blur', message: '不可为空'}
        ],
        phone: [
          {required: true, trigger: 'blur', message: '不可为空'},
          {validator: checkPhone, trigger: 'blur'}
        ]
      },
      jsonData: [
        {
          title: '姓名',
          key: 'leader',
          type: 'text'
        },
        {
          title: '手机号',
          key: 'phone',
          type: 'text'
        },
        {
          title: '备注信息',
          key: 'remark',
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
  mounted () {
    this.fetchData()
  },
  methods: {
    handleh () {
      let obj = JSON.parse(JSON.stringify(this.tableData))
      this.table2excel(this.jsonData, obj, 'excel.xlsx')
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
    // 删除所有
    handleAllDelete () {
      this.$confirm('确认删除所有的记录吗？', '提示', {})
        .then(() => {
          this.deleteAllLoading = true
          httpDelete(AIErrorData + '/' + this.$store.getters.departmentId).then(res => {
            this.deleteAllLoading = false
            this.fetchData()
            this.$message({
              type: 'success',
              message: res.message,
              duration: 4 * 1000
            })
          }).catch(() => {
            this.deleteAllLoading = false
          })
        }).catch(() => {})
    },
    // 删除选中
    handleDelete () {
      this.$confirm('确认删除所选中的记录吗？', '提示', {})
        .then(() => {
          this.deleteLoading = true
          httpDelete(AIErrorData, {ids: this.selectArrayId}).then(res => {
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
    // 检查手机号是否重复
    phoneCheck () {
      httpGet(AiDuyCompany + '/' + this.form.phone)
        .then(res => {}).catch(() => {})
    },
    fetchData () {
      this.listQuery = Object.assign(this.listQuery, {departmentId: this.$store.getters.departmentId})
      httpGet(getAIErrorData, this.listQuery).then(res => {
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
    // 刷新
    handleRefresh () {
      this.listQuery = {
        offset: 1,
        limit: 5
      }
      this.fetchData()
    },
    // 编辑
    handleUpdate (row) {
      this.form = Object.assign({}, row)
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataform'].clearValidate()
      })
    },
    updateData () {
      this.$refs.dataform.validate((valid) => {
        if (valid) {
          this.updateLoading = true
          const updateFormData = Object.assign({}, this.form)
          httpPut(AIErrorData, updateFormData)
            .then(res => {
              this.fetchData()
              this.dialogFormVisible = false
              setTimeout(() => { this.updateLoading = false }, 300)
              this.$message.success(res.message)
            }).catch(() => {
              this.updateLoading = false
            })
        }
      })
    }
  }
}
</script>

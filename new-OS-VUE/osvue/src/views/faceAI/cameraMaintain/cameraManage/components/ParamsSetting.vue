<template>
  <div>
    <div >
      <!-- 操作 -->
      <div class="filter-container">
        <el-button class="filter-item" type="primary" @click="fetchData" icon="el-icon-refresh">刷新</el-button>
        <el-button class="filter-item" type="primary" @click="handleData" icon="el-icon-edit">新增</el-button>
        <el-button class="filter-item" type="primary" @click="handleh"  icon="el-icon-download" v-has="['导出']" >导出</el-button>
        <el-button class="filter-item" type="danger" :loading = "deleteLoading" @click="handleDelete" :disabled="disabled" icon="el-icon-close">删除所选</el-button>
      </div>
       <el-table stripe :header-cell-style="{background:'#f3f4f6'}" style="width: 100%" max-height="600" :data="tableData" @selection-change="handleSelectionChange" v-loading.body="listLoading" element-loading-text="加载中..." border fit highlight-current-row>
        <el-table-column type="selection" width="40" fixed="left" ></el-table-column>
        <el-table-column label="文件名称" align="center" prop="fileName"></el-table-column>
        <el-table-column label="参数名称" align="center" prop="key"></el-table-column>
        <el-table-column label="参数值" align="center" prop="value"></el-table-column>
        <el-table-column label="备注信息" align="center" prop="remarks"></el-table-column>
        <el-table-column fixed="right" label="操作" align="center" class-name="small-padding fixed-width" width="120">
          <template slot-scope="scope">
            <el-button type="primary" @click="handleUpdata(scope.row)" size="mini">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination background  :page-sizes="[10,20,30, 50]" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.offset " :page-size="listQuery.limit" :total="total" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
      </div>
      <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="30%" :append-to-body="true">
        <el-form :rules="formRules" ref="dataform"  :model="form" autoCompete = "on" label-position="right" label-width="120px">
          <el-form-item label="文件名称" prop="fileName">
            <el-input v-model="form.fileName"></el-input>
          </el-form-item>
          <el-form-item label="参数名称" prop="key">
            <el-input v-model="form.key"></el-input>
          </el-form-item>
          <el-form-item label="参数值" prop="value">
            <el-input v-model="form.value"></el-input>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="form.remarks"></el-input>
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
import { AICameraParams } from '@/api/url'
import { httpGet, httpPost, httpPut, httpDelete } from '@/utils/restful'
export default {
  props: ['aiTokenId'],
  data () {
    return {
      list: null,
      listLoading: true,
      createLoading: false,
      updateLoading: false,
      deleteLoading: false,
      dialogFormVisible: false,
      listQuery: {
        offset: 1,
        limit: 10,
        aiTokenId: this.aiTokenId
      },
      tableData: [],
      disabled: true,
      selectArrayId: [],
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '添加'
      },
      total: null,
      form: {
        aiTokenId: this.aiTokenId,
        fileName: undefined,
        key: undefined,
        value: undefined,
        remarks: undefined
      },
      formRules: {
        fileName: [
          {required: true, trigger: 'blur', message: '不可为空'}
        ],
        key: [
          {required: true, trigger: 'blur', message: '不可为空'}
        ],
        value: [
          {required: true, trigger: 'blur', message: '不可为空'}
        ]
      },
      jsonData: [
        {
          title: '文件名称',
          key: 'fileName',
          type: 'text'
        },
        {
          title: '参数名称',
          key: 'key',
          type: 'text'
        },
        {
          title: '参数值',
          key: 'value',
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
    aiTokenId (curVal) {
      this.listQuery.aiTokenId = curVal
      this.form.aiTokenId = curVal
      this.aiTokenId = curVal
      this.fetchData()
    }
  },
  methods: {
    handleh () {
      let obj = JSON.parse(JSON.stringify(this.tableData))
      this.table2excel(this.jsonData, obj, 'excel.xlsx')
    },
    fetchData () {
      httpGet(AICameraParams, this.listQuery).then(res => {
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
    resetForm () {
      this.form = {
        aiTokenId: this.aiTokenId,
        fileName: undefined,
        key: undefined,
        value: undefined,
        remarks: undefined
      }
    },
    handleData () {
      this.dialogFormVisible = true
      this.dialogStatus = 'create'
      this.$nextTick(() => {
        this.$refs['dataform'].resetFields()
        this.resetForm()
      })
    },
    handleUpdata (row) {
      this.form = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs.dataform.clearValidate()
      })
    },
    createData () {
      this.$refs.dataform.validate((valid) => {
        if (valid) {
          this.createLoading = true
          this.$confirm('是否确认新增，新增完成之后将会下发相机?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            httpPost(AICameraParams, this.form).then(res => {
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
          })
            .catch(() => {})
        }
      })
    },
    updateData () {
      this.$refs.dataform.validate((valid) => {
        if (valid) {
          this.updateLoading = true
          this.$confirm('是否确认编辑,编辑完成之后将会下发相机?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.form = Object.assign(this.form, {aiTokenId: this.aiTokenId})
            const updateFormData = Object.assign({}, this.form)
            httpPut(AICameraParams, updateFormData).then(res => {
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
          })
            .catch(() => {})
        }
      })
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
    // 删除选中
    handleDelete () {
      this.$confirm('确认删除所选中的记录吗？', '提示', {})
        .then(() => {
          this.deleteLoading = true
          httpDelete(AICameraParams, {ids: this.selectArrayId}).then(res => {
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
    }
  },
  mounted () {
    this.fetchData()
  }
}
</script>

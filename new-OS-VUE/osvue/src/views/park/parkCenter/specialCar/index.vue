<template>
  <div class="app-container">
    <div class="table-main">
      <!-- 操作 -->
      <div class="filter-container">
        <el-input clearable style="width: 150px;" v-model="listQuery.sign" class="filter-item" placeholder="标识符"></el-input>
        <el-select clearable v-model="listQuery.position"  class="filter-item" placeholder="位置信息">
          <el-option v-for="item in positionType" :key="item.valueNo" :label="item.valueName" :value="item.valueNo"></el-option>
        </el-select>
        <el-button class="filter-item" type="primary"   @click="handleFilter" icon="el-icon-search">搜索</el-button>
        <el-button class="filter-item" type="primary"  v-has="['新增']" @click="handleCreate"  icon="el-icon-edit">添加</el-button>
        <el-button class="filter-item" type="primary"   @click="handleRefresh"  icon="el-icon-refresh">刷新</el-button>
        <el-button class="filter-item" type="primary" @click="handleh"  icon="el-icon-download" v-has="['导出']" >导出</el-button>
        <el-button class="filter-item" type="danger" v-has="['删除']" :loading = "deleteLoading" @click="handleDelete" :disabled="disabled" icon="el-icon-close">删除所选</el-button>
      </div>
      <el-table stripe :header-cell-style="{background:'#f3f4f6'}" style="width: 100%" max-height="600" :data="tableData" v-loading.body="listLoading" @selection-change="handleSelectionChange" element-loading-text="加载中..." border fit highlight-current-row>
        <el-table-column type="selection" v-if = "isShowColumnFormatter(['删除'])" width="40" fixed="left" ></el-table-column>
        <el-table-column label="标识符" align="center" prop="sign"></el-table-column>
        <el-table-column label="所处位置" align="center" prop="position">
          <template slot-scope="scope">
            <el-button  type="danger" size="mini">{{ positionFormatter(scope.row.position) }}</el-button>
          </template>
        </el-table-column>
        <el-table-column label="备注信息" align="center" prop="remark"></el-table-column>
        <el-table-column fixed="right" label="操作"  v-if = "isShowColumnFormatter(['编辑'])"  align="center" class-name="small-padding fixed-width" width="120">
          <template slot-scope="scope">
            <el-button  v-has="['编辑']" type="primary" @click="handleUpdate(scope.row)" size="mini">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination background  :page-sizes="[10,20,30, 50]" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.offset " :page-size="listQuery.limit" :total="total" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
      </div>
      <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
        <el-form :rules="formRules" ref="dataform" :model="form" autoCompete = "on" label-position="right" label-width="150px" >
          <el-form-item label="标识符" prop="sign">
            <el-input v-model="form.sign"  clearable placeholder="请输入标识符"></el-input>
          </el-form-item>
          <el-form-item label="位置信息" prop="position">
            <el-select clearable v-model="form.position"  placeholder="位置信息">
              <el-option v-for="item in positionType" :key="item.valueNo" :label="item.valueName" :value="item.valueNo"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="备注信息" prop="remark">
            <el-input type="textarea"  v-model="form.remark" clearable placeholder="请输入备注信息"></el-input>
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
import { positionFormatter, isShowColumnFormatter } from '@/utils/formatter.js'
import { positionType } from '@/utils/selectAble.js'
import { httpGet, httpPost, httpPut, httpDelete } from '@/utils/restful'
import { getSpecialCar, SpecialCar } from '@/api/url'
export default {
  data () {
    return {
      isShowColumnFormatter: isShowColumnFormatter,
      list: null,
      listLoading: true,
      createLoading: false,
      deleteLoading: false,
      updateLoading: false,
      listQuery: {
        offset: 1,
        limit: 10,
        sign: undefined,
        position: undefined
      },
      tableData: [],
      positionFormatter: positionFormatter,
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '添加'
      },
      positionType: positionType,
      total: null,
      selectArrayId: [],
      disabled: true,
      form: {
        id: undefined,
        sign: '',
        position: '',
        remark: ''
      },
      formRules: {
        sign: [
          {required: true, trigger: 'blur', message: '请输入标识符'}
        ],
        position: [
          {required: true, trigger: 'blur', message: '请选择位置'}
        ]
      },
      jsonData: [
        {
          title: '标识符',
          key: 'sign',
          type: 'text'
        },
        {
          title: '所处位置',
          key: 'position',
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
  created () {
    this.fetchData()
  },
  methods: {
    handleh () {
      let obj = JSON.parse(JSON.stringify(this.tableData))
      obj.forEach((item, index) => {
        item.position = this.positionFormatter(item.position)
      })
      this.table2excel(this.jsonData, obj, 'excel.xlsx')
    },
    fetchData () {
      this.listQuery = Object.assign(this.listQuery, {departmentId: this.$store.getters.departmentId})
      httpGet(getSpecialCar, this.listQuery).then(res => {
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
        sign: '',
        position: '',
        remark: ''
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
          this.createLoading = true
          this.form = Object.assign(this.form, {departmentId: this.$store.getters.departmentId})
          httpPost(SpecialCar, this.form).then((res) => {
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
          httpPut(SpecialCar, updateFormData).then(res => {
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
          httpDelete(SpecialCar, {ids: this.selectArrayId}).then(res => {
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
        offset: 1,
        limit: 10,
        sign: undefined,
        position: undefined
      }
      this.fetchData()
    }
  }
}
</script>

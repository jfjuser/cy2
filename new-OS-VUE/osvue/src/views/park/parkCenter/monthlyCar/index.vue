<template>
  <div class="app-container">
     <div class="table-main">
        <!-- 操作 -->
        <div class="filter-container">
          <el-input clearable style="width: 150px;" v-model="listQuery.carName" class="filter-item" placeholder="姓名"></el-input>
          <el-autocomplete clearable class="filter-item" style="width: 150px;" v-model="listQuery.plate" :fetch-suggestions="querySearch" placeholder="车牌号"></el-autocomplete>
          <el-select clearable v-model="listQuery.isSync"  class="filter-item" placeholder="同步状态">
            <el-option v-for="item in isSyncType" :key="item.valueNo" :label="item.valueName" :value="item.valueNo"></el-option>
          </el-select>
          <el-select clearable v-model="listQuery.isOverDue"  class="filter-item" placeholder="是否过期">
            <el-option v-for="item in isOverDueType" :key="item.valueNo" :label="item.valueName" :value="item.valueNo"></el-option>
          </el-select>
          <el-button class="filter-item" type="primary"  @click="handleFilter" icon="el-icon-search">搜索</el-button>
          <el-button class="filter-item" type="primary"  @click="handleRefresh" icon="el-icon-refresh">刷新</el-button>
          <el-button class="filter-item" type="primary"  v-has="['添加']" @click="handleCreate"  icon="el-icon-edit">添加</el-button>
          <el-button class="filter-item" type="primary"  v-has="['导出']" @click="handleExport" icon="el-icon-download">导出</el-button>
          <el-button class="filter-item" type="primary"  v-has="['导入']" @click="handleImport" icon="el-icon-upload2">导入</el-button>
          <el-button class="filter-item" type="danger"  v-has="['删除']" :loading = "deleteLoading" @click="handleDelete" :disabled="disabled" icon="el-icon-close">删除所选</el-button>
          <el-button class="filter-item" type="danger" plain v-has="['删除所有']" @click="handleDeleteAll" icon="el-icon-delete">删除所有</el-button>
        </div>
        <el-table stripe :header-cell-style="{background:'#f3f4f6'}" style="width: 100%" max-height="600" :data="tableData" v-loading.body="listLoading" @selection-change="handleSelectionChange" element-loading-text="加载中..." border fit highlight-current-row>
          <el-table-column type="selection" width="40" fixed="left" v-if = "isShowColumnFormatter(['删除'])"></el-table-column>
          <el-table-column label="车场名称" align="center" prop="departmentName"></el-table-column>
          <el-table-column label="本地编号" align="center" prop="localId"></el-table-column>
          <el-table-column label="车主姓名" align="center" prop="carName"></el-table-column>
          <el-table-column label="车牌号码" align="center" prop="plate"></el-table-column>
          <el-table-column label="联系方式" align="center" prop="carPhone">
            <template slot-scope="scope">
              <template v-if="isShowColumnFormatter(['隐藏手机号'])">{{scope.row.carPhone | hiddenPhone}}</template>
              <template v-else>{{scope.row.carPhone}}</template>
            </template>
          </el-table-column>
          <el-table-column label="同步状态" align="center" prop="isSync">
            <template slot-scope="scope">
              <el-button v-if="scope.row.isSync === 0" type="danger" size="mini">{{ isSyncFormatter(scope.row.isSync) }}</el-button>
              <el-button v-if="scope.row.isSync === 1" type="success" size="mini">{{ isSyncFormatter(scope.row.isSync) }}</el-button>
              <el-button v-if="scope.row.isSync === 2 || scope.row.isSync === 3" type="default" size="mini">{{ isSyncFormatter(scope.row.isSync) }}</el-button>
            </template>
          </el-table-column>
          <el-table-column label="开始时间" align="center">
            <template slot-scope="scope">
              {{timeFormatter(scope.row.startTime)}}
            </template>
          </el-table-column>
          <el-table-column label="有效期至" align="center">
            <template slot-scope="scope">
              {{timeFormatter(scope.row.validateAt)}}
            </template>
          </el-table-column>
          <el-table-column label="备注信息" align="center" prop="remarks"></el-table-column>
          <el-table-column fixed="right" label="操作" align="center" class-name="small-padding fixed-width" width="120" v-if = "isShowColumnFormatter(['编辑'])">
            <template slot-scope="scope">
              <el-button type="primary" @click="handleUpdate(scope.row)" size="mini">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <div class="pagination-container">
          <el-pagination background  :page-sizes="[10,20,30, 50]" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.offset " :page-size="listQuery.limit" :total="total" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
        </div>
        <el-dialog title="添加" :visible.sync="dialogFormVisible">
          <el-form :rules="formRules" ref="dataform" :model="form" autoCompete = "on" label-position="right" label-width="150px" >
            <el-form-item label="车主姓名" prop="carName">
              <el-input v-model="form.carName"  clearable placeholder="请输入姓名"></el-input>
            </el-form-item>
            <el-form-item label="联系方式" prop="carPhone">
              <el-input v-model="form.carPhone" clearable placeholder="请输入联系方式"></el-input>
            </el-form-item>
            <el-form-item label="车牌号码" prop="plate">
              <el-autocomplete clearable  v-model="form.plate" :fetch-suggestions="querySearch" placeholder="车牌号码"></el-autocomplete>
            </el-form-item>
            <el-form-item label="有效日期" prop="validateAt">
              <el-date-picker clearable v-model="form.validateAt"  type="date" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd" placeholder="有效期">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="备注信息" prop="remarks">
              <el-input type="textarea"  v-model="form.remarks" clearable placeholder="请输入备注信息"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取消</el-button>
            <el-button :loading = "createLoading" type="primary" @click="createData">保存</el-button>
          </div>
        </el-dialog>
        <el-dialog title="编辑" :visible.sync="dialogUserFormVisible">
          <el-form :rules="formRules" ref="dataform" :model="form" autoCompete = "on" label-position="right" label-width="150px" >
            <el-form-item label="车主姓名" prop="carName">
              <el-input v-model="form.carName"  clearable placeholder="请输入姓名"></el-input>
            </el-form-item>
            <el-form-item label="联系方式" prop="carPhone">
              <el-input v-model="form.carPhone" clearable placeholder="请输入联系方式"></el-input>
            </el-form-item>
            <el-form-item label="备注信息" prop="remarks">
              <el-input type="textarea"  v-model="form.remarks" clearable placeholder="请输入备注信息"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogUserFormVisible = false">取消</el-button>
            <el-button :loading = "updateLoading" type="primary" @click="updateData">保存</el-button>
          </div>
        </el-dialog>
        <el-dialog title="导入" :visible.sync="dialogImportVisible" width="30%">
          <el-form ref="uploadData" :model="upload" autoCompete = "on" label-position="right" label-width="150px" >
            <el-form-item label="文件名称" required >
              <upload-file ref="upload" :name="'file'"  @hideUploadVisible = "hideUploadVisible" :fileData="upload" :action="action" :accept="accept"></upload-file>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogImportVisible = false">取消</el-button>
            <el-button type="primary" @click="importData">保存</el-button>
          </div>
        </el-dialog>
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
import { isSyncFormatter, timeFormatter, isShowColumnFormatter } from '@/utils/formatter.js'
import { isSyncType, plateType, isOverDueType } from '@/utils/selectAble.js'
import { getToolWhite, ToolWhite, exportToolWhite, uploadToolWhite } from '@/api/url'
import { httpGet, httpPost, httpPut, httpDelete, httpExport } from '@/utils/restful'
import { checkPhone } from '@/utils/validator.js'
import UploadFile from '@/components/UploadFile'

export default {
  components: {
    UploadFile
  },
  data () {
    return {
      accept: '.xls,.xlsx',
      action: uploadToolWhite,
      list: null,
      listLoading: true,
      createLoading: false,
      deleteLoading: false,
      updateLoading: false,
      exportLoading: false,
      listQuery: {
        offset: 1,
        limit: 10,
        carName: undefined,
        plate: undefined,
        isSync: undefined,
        startTime: undefined,
        validateAt: undefined,
        isOverDue: undefined
      },
      upload: {
        departmentId: this.$store.getters.departmentId
      },
      tableData: [],
      isSyncFormatter: isSyncFormatter,
      timeFormatter: timeFormatter,
      isShowColumnFormatter: isShowColumnFormatter,
      dialogFormVisible: false,
      dialogUserFormVisible: false,
      dialogExportVisible: false,
      dialogImportVisible: false,
      textMap: {
        update: '编辑',
        create: '添加'
      },
      isSyncType: isSyncType,
      plateType: plateType,
      isOverDueType: isOverDueType,
      total: null,
      selectArrayId: [],
      disabled: true,
      form: {
        id: undefined,
        carName: '',
        plate: '',
        carPhone: '',
        validateAt: '',
        remarks: ''
      },
      formRules: {
        carName: [
          {required: true, trigger: 'blur', message: '请输入车主姓名'}
        ],
        plate: [
          {required: true, trigger: 'blur', message: '请输入车牌号码'}
        ],
        carPhone: [
          {required: true, trigger: 'blur', message: '请输入联系方式'},
          {validator: checkPhone, trigger: 'blur', message: '请输入正确的手机号'}
        ],
        validateAt: [
          {required: true, trigger: 'blur', message: '请输入结束时间'}
        ]
      },
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
  mounted () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      this.listQuery = Object.assign(this.listQuery, {departmentId: this.$store.getters.departmentId})
      httpGet(getToolWhite, this.listQuery).then(res => {
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
    // 重置form表单
    resetForm () {
      this.form = {
        id: undefined,
        carName: undefined,
        plate: undefined,
        carPhone: undefined,
        validateAt: undefined,
        remarks: undefined
      }
    },
    handleCreate () {
      let self = this
      self.dialogFormVisible = true
      // 延迟调用
      self.$nextTick(() => {
        self.$refs['dataform'].resetFields()
        self.resetForm()
      })
    },
    handleUpdate (row) {
      this.form = Object.assign({}, row)
      this.dialogUserFormVisible = true
      this.$nextTick(() => {
        this.$refs.dataform.clearValidate()
      })
    },
    // 重置搜索字段
    resetListQuery () {
      this.listQuery = {
        offset: 1,
        limit: 10,
        carName: undefined,
        plate: undefined,
        isSync: undefined,
        startTime: undefined,
        validateAt: undefined,
        isOverDue: undefined
      }
    },
    // 刷新
    handleRefresh () {
      this.resetListQuery()
      this.fetchData()
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
          httpPost(ToolWhite, this.form).then((res) => {
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
          httpPut(ToolWhite, updateFormData).then(res => {
            this.fetchData()
            this.dialogUserFormVisible = false
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
    // 删除选中
    handleDelete () {
      this.$confirm('确认提交吗？', '提示', {})
        .then(() => {
          this.deleteLoading = true
          httpDelete(ToolWhite, {ids: this.selectArrayId}).then(res => {
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
    handleDeleteAll () {
      this.$confirm('确认提交吗？', '提示', {})
        .then(() => {
          this.deleteLoading = true
          httpDelete(ToolWhite + '/' + this.$store.getters.departmentId).then(res => {
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
    // 导出
    handleExport () {
      this.exportForm.localIds = undefined
      this.dialogExportVisible = true
      this.loadLocals()
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
          httpExport(exportToolWhite, data).then((res) => {
            this.dialogExportVisible = false
            setTimeout(() => { this.exportLoading = false }, 300)
          }).catch(() => {
            this.exportLoading = false
          })
        }
      })
    },
    // 隐藏文件上传框
    hideUploadVisible () {
      this.dialogImportVisible = false
      this.fetchData()
    },
    importData () {
      this.upload = Object.assign(this.upload, {departmentId: this.$store.getters.departmentId})
      this.$nextTick(() => {
        this.$refs.upload.$refs.UPLOAD.submit()
      })
    },
    // 导入
    handleImport () {
      this.upload = {}
      this.dialogImportVisible = true
      this.$nextTick(() => {
        this.$refs.uploadData.clearValidate()
        this.$refs.upload.$refs.UPLOAD.clearFiles()
      })
    }
  }
}
</script>

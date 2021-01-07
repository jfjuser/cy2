<template>
  <div class="app-container">
     <div class="table-main">
        <!-- 操作 -->
        <div class="filter-container">
          <el-input clearable style="width: 150px;" v-model="listQuery.operatorName" class="filter-item" placeholder="操作员"></el-input>
          <el-autocomplete clearable class="filter-item" style="width: 150px;" v-model="listQuery.plate" :fetch-suggestions="querySearch" placeholder="车牌号"></el-autocomplete>
          <el-select clearable v-model="listQuery.isSync"  class="filter-item" placeholder="同步状态">
            <el-option v-for="item in isSyncType" :key="item.valueNo" :label="item.valueName" :value="item.valueNo"></el-option>
          </el-select>
          <el-button class="filter-item" type="primary"   @click="handleFilter" icon="el-icon-search">搜索</el-button>
          <el-button class="filter-item" type="primary"  v-has="['添加']" @click="handleCreate"  icon="el-icon-edit">添加</el-button>
          <el-button class="filter-item" type="primary" v-has="['导出']"   @click="handleExport" icon="el-icon-download">导出</el-button>
          <el-button class="filter-item" type="primary"  v-has="['导入']"   @click="handleImport" icon="el-icon-upload2">导入</el-button>
          <el-button class="filter-item" type="primary"  v-has="['删除']" :loading = "deleteLoading" @click="handleDelete" :disabled="disabled" icon="el-icon-close">删除所选</el-button>
          <el-button class="filter-item" type="danger"   @click="handleRefresh" icon="el-icon-refresh">刷新</el-button>
          <el-button class="filter-item" type="danger" plain v-has="['删除所有']" :loading = "deleteAllLoading" @click="handleAllDelete" icon="el-icon-delete">删除所有</el-button>
        </div>
        <el-table stripe :header-cell-style="{background:'#f3f4f6'}" style="width: 100%" max-height="600" :data="tableData" v-loading.body="listLoading" @selection-change="handleSelectionChange" element-loading-text="加载中..." border fit highlight-current-row>
          <el-table-column type="selection" width="40" fixed="left" v-if="isShowColumnFormatter(['删除'])" ></el-table-column>
          <el-table-column label="车牌号码" align="center" prop="plate"></el-table-column>
          <el-table-column label="同步状态" align="center" prop="isSync">
            <template slot-scope="scope">
              <el-button v-if="scope.row.isSync === 0" type="danger" size="mini">{{ isSyncFormatter(scope.row.isSync) }}</el-button>
              <el-button v-if="scope.row.isSync === 1" type="success" size="mini">{{ isSyncFormatter(scope.row.isSync) }}</el-button>
              <el-button v-if="scope.row.isSync === 2 || scope.row.isSync === 3" type="default" size="mini">{{ isSyncFormatter(scope.row.isSync) }}</el-button>
            </template>
          </el-table-column>
          <el-table-column label="开始时间" align="center" prop="beginTime">
            <template slot-scope="scope">
                {{timeFormatter(scope.row.beginTime)}}
            </template>
          </el-table-column>
          <el-table-column label="结束时间" align="center" prop="endTime">
            <template slot-scope="scope">
                {{timeFormatter(scope.row.endTime)}}
            </template>
          </el-table-column>
          <el-table-column label="操作员" align="center" prop="operatorName"></el-table-column>
        </el-table>
        <!-- 分页 -->
        <div class="pagination-container">
          <el-pagination background  :page-sizes="[10,20,30, 50]" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.offset " :page-size="listQuery.limit" :total="total" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
        </div>
        <el-dialog title="添加" :visible.sync="dialogFormVisible" width="35%">
          <el-form :rules="formRules" ref="dataform" :model="form" autoCompete = "on" label-position="right" label-width="100px" >
            <el-form-item label="车牌号码" prop="plate">
              <el-autocomplete style="width:250px"  v-model="form.plate" :fetch-suggestions="querySearch" placeholder="车牌号码"></el-autocomplete>
            </el-form-item>
            <el-form-item label="时段设置" required>
              <el-date-picker
                v-model="time"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :default-time="['00:00:00', '23:59:59']"
                @change="chooseTimeRange">
              </el-date-picker>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取消</el-button>
            <el-button :loading = "createLoading" type="primary" @click="createData">保存</el-button>
          </div>
        </el-dialog>
        <el-dialog title="导入" :visible.sync="dialogImportVisible" width="30%">
          <el-form autoCompete = "on" label-position="right" label-width="150px" >
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
import { isSyncType, plateType } from '@/utils/selectAble.js'
import { checkPlate } from '@/utils/validator.js'
import { getBoxFreeCar, BoxFreeCar, uploadBoxFreeCar, exportBoxFreeCar } from '@/api/url'
import { httpGet, httpDelete, httpPost, httpExport } from '@/utils/restful.js'
import UploadFile from '@/components/UploadFile'
export default {
  components: {
    UploadFile
  },
  data () {
    return {
      accept: '.xls,.xlsx',
      action: uploadBoxFreeCar,
      upload: {
        departmentId: this.$store.getters.departmentId
      },
      list: null,
      listLoading: true,
      createLoading: false,
      deleteLoading: false,
      deleteAllLoading: false,
      listQuery: {
        offset: 1,
        limit: 10,
        operatorName: undefined,
        plate: undefined,
        isSync: undefined
      },
      tableData: [],
      isSyncFormatter: isSyncFormatter,
      isShowColumnFormatter: isShowColumnFormatter,
      timeFormatter: timeFormatter,
      dialogFormVisible: false,
      dialogImportVisible: false,
      isSyncType: isSyncType,
      plateType: plateType,
      total: null,
      selectArrayId: [],
      disabled: true,
      form: {
        id: undefined,
        plate: undefined,
        beginTime: undefined,
        endTime: undefined
      },
      time: [],
      formRules: {
        plate: [
          {required: true, trigger: 'blur', message: '车牌号码不可为空'},
          {validator: checkPlate, trigger: 'blur'}
        ],
        time: [
          {type: 'array', required: true, trigger: 'blur', message: '时间不可为空'}
        ]
      },
      dialogExportVisible: false,
      numberList: [],
      exportLoading: false,
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
  created () {
    this.fetchData()
  },
  methods: {
    // 格式化时间
    chooseTimeRange (time) {
      if (time !== null) {
        this.form.beginTime = time[0]
        this.form.endTime = time[1]
      }
    },
    fetchData () {
      this.listQuery = Object.assign(this.listQuery, {departmentId: this.$store.getters.departmentId})
      httpGet(getBoxFreeCar, this.listQuery).then(res => {
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
        plate: undefined,
        validateTime: undefined,
        remarks: undefined
      }
      this.time = []
    },
    // 重置搜索条件
    handleRefresh () {
      this.listQuery = {
        offset: 1,
        limit: 10,
        operatorName: undefined,
        plate: undefined,
        isSync: undefined
      }
      this.fetchData()
    },
    handleCreate () {
      let self = this
      self.dialogFormVisible = true
      // 延迟调用
      self.$nextTick(() => {
        self.resetForm()
        self.$refs['dataform'].resetFields()
        self.time = []
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
          httpPost(BoxFreeCar, this.form).then((res) => {
            this.handleRefresh()
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
          httpDelete(BoxFreeCar, {ids: this.selectArrayId}).then(res => {
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
      this.dialogExportVisible = true
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
          httpExport(exportBoxFreeCar, data).then((res) => {
            this.dialogExportVisible = false
            setTimeout(() => { this.exportLoading = false }, 300)
          }).catch(() => {
            this.exportLoading = false
          })
        }
      })
    },
    // 导入
    handleImport () {
      this.dialogImportVisible = true
      this.$nextTick(() => {
        this.$refs.upload.$refs.UPLOAD.clearFiles()
      })
    },
    importData () {
      this.upload = Object.assign(this.upload, {departmentId: this.$store.getters.departmentId})
      this.$nextTick(() => {
        this.$refs.upload.$refs.UPLOAD.submit()
      })
    },
    // 隐藏文件上传框
    hideUploadVisible () {
      this.dialogImportVisible = false
      this.fetchData()
    },
    // 删除所有
    handleAllDelete () {
      this.$confirm('确认删除所有数据吗？', '提示', {})
        .then(() => {
          this.deleteAllLoading = true
          httpDelete(BoxFreeCar + '/' + this.$store.getters.departmentId).then(res => {
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
    }
  }
}
</script>

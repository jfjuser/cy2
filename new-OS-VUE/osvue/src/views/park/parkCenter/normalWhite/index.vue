<template>
  <div class="app-container">
    <div class="table-main">
      <!-- 操作 -->
      <div class="filter-container">
        <el-input placeholder="请输入姓名" class="filter-item" style="width: 150px;" v-model="listQuery.userName" clearable></el-input>
        <el-autocomplete clearable class="filter-item" style="width: 150px;" v-model="listQuery.plate" :fetch-suggestions="querySearch" placeholder="请输入车牌"></el-autocomplete>
        <el-select clearable v-model="listQuery.isOverDue" style="width: 150px;"  class="filter-item" placeholder="是否过期">
          <el-option v-for="item in isOverDueType" :key="item.valueNo" :label="item.valueName" :value="item.valueNo"></el-option>
        </el-select>
        <el-select clearable v-model="listQuery.isSync" style="width: 150px;"  class="filter-item" placeholder="同步状态">
          <el-option v-for="item in isSyncType" :key="item.valueNo" :label="item.valueName" :value="item.valueNo"></el-option>
        </el-select>
        <el-select clearable v-model="listQuery.mac" style="width: 150px;"  class="filter-item" placeholder="通道名称">
          <el-option v-for="item in localList" clearable :key="item.mac" :label="item.localName" :value="item.mac"></el-option>
        </el-select>
        <el-button class="filter-item" type="primary"   @click="handleFilter" icon="el-icon-search">搜索</el-button>
        <el-button class="filter-item" type="primary"   @click="handleRefresh" icon="el-icon-refresh">刷新</el-button>
        <el-button class="filter-item" type="primary" v-has="['新增']"  @click="handleCreate"  icon="el-icon-edit">添加</el-button>
        <el-button class="filter-item" type="primary" v-has="['白名单导入']" @click="handleImport" icon="el-icon-upload2">导入</el-button>
        <el-button class="filter-item" type="danger" v-has="['删除']"  :loading = "deleteLoading" @click="handleDelete" :disabled="disabled" icon="el-icon-close">删除所选</el-button>
        <el-button class="filter-item" type="danger" plain v-has="['删除所有']"  :loading = "deleteAllLoading" @click="handleDeleteAll" icon="el-icon-delete">删除所有</el-button>
        <el-button class="filter-item" type="primary" v-has="['导出']"  @click="handleExport" icon="el-icon-download">导出</el-button>
        <el-button class="filter-item" type="primary" v-has="['充值']"  @click="handleChanger">
          <i class="fa fa-rmb"></i>
          充值
        </el-button>
        <el-button class="filter-item" type="primary" v-has="['重新导入']"   @click="handleReImport">
          <i class="fa fa-recycle"></i>
          重新导入
        </el-button>
        <el-button class="filter-item" type="primary"  @click="downLoad" :loading="exportLoading1" icon="el-icon-download">下载模板</el-button>
      </div>
      <el-table stripe :header-cell-style="{background:'#f3f4f6'}" style="width: 100%" max-height="600" :data="tableData" v-loading.body="listLoading" @selection-change="handleSelectionChange" element-loading-text="加载中..." border fit highlight-current-row>
        <el-table-column type="selection" width="40" fixed="left" v-if = "isShowColumnFormatter(['删除'])"></el-table-column>
        <el-table-column label="车主姓名" align="center" prop="userName"></el-table-column>
        <el-table-column label="通道名称" align="center" prop="deviceName"></el-table-column>
        <el-table-column label="车牌号码" align="center" prop="plate"></el-table-column>
        <el-table-column label="联系方式" align="center" prop="userPhone">
          <template slot-scope="scope">
            <template v-if="isShowColumnFormatter(['隐藏手机号'])">{{scope.row.userPhone | hiddenPhone}}</template>
            <template v-else>{{scope.row.userPhone}}</template>
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
            {{timeFormatter(scope.row.enableTime)}}
          </template>
        </el-table-column>
        <el-table-column label="结束时间" align="center" >
          <template slot-scope="scope">
            {{timeFormatter(scope.row.overdueTime)}}
          </template>
        </el-table-column>
        <el-table-column label="备注信息" align="center" prop="reason"></el-table-column>
        <el-table-column fixed="right" label="操作" align="center" class-name="small-padding fixed-width" width="150" v-if = "isShowColumnFormatter(['编辑'])">
          <template slot-scope="scope">
            <el-button v-has="['编辑']" type="primary" @click.native.prevent="handleUpdate(scope.row)" size="mini">修改</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination background  :page-sizes="[10,20,30, 50]" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.offset " :page-size="listQuery.limit" :total="total" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
      </div>
      <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="600px" :close-on-click-modal="false">
        <el-form :rules="formRules" ref="dataform" :model="form" autoCompete = "on" label-position="right" label-width="150px" >
          <el-form-item label="车主姓名" prop="userName">
            <el-input v-model="form.userName"  placeholder="请输入姓名" class="input-width"></el-input>
          </el-form-item>
          <el-form-item label="通道名称" prop="mac">
            <el-select v-model="form.mac" multiple  class="input-width">
              <el-option v-for="item in localList" clearable :key="item.mac" :label="item.localName" :value="item.mac"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="车牌号码" prop="plate">
            <el-autocomplete  v-model="form.plate" :fetch-suggestions="querySearch" placeholder="车牌号码" :maxlength="8" class="input-width" @blur = "checkPlate"></el-autocomplete>
          </el-form-item>
          <el-form-item label="联系方式" prop="userPhone">
            <el-input v-model="form.userPhone" placeholder="请输入联系方式" :maxlength="11" class="input-width"></el-input>
          </el-form-item>
          <el-form-item label="充值规则" prop="ruleId">
            <el-select v-model="form.ruleId" placeholder="请选择" @change="ruleChange" class="input-width">
              <el-option v-for="item in ruleList" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="有效日期" required >
            <el-date-picker
              v-model="date"
              type="datetimerange"
              :default-time="['00:00:00', '23:59:59']"
              @change = "changeDate"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              class="input-width"
            >
            </el-date-picker>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button :loading = "createLoading" v-if="dialogStatus=='create'" type="primary" @click="createData">保存</el-button>
        </div>
      </el-dialog>
      <el-dialog title="编辑" :visible.sync="dialogUserFormVisible" width="600px" :close-on-click-modal="false">
        <el-form :rules="formRules" ref="dataform" :model="form" autoCompete = "on" label-position="right" label-width="150px">
          <el-form-item label="车主姓名" prop="userName">
            <el-input v-model="form.userName" placeholder="请输入姓名" class="input-width"></el-input>
          </el-form-item>
          <el-form-item label="联系方式" prop="userPhone">
            <el-input v-model="form.userPhone" placeholder="请输入联系方式" :maxlength="11" class="input-width"></el-input>
          </el-form-item>
          <p style="color:red;font-size:14px;text-align:center">
            注意：为防止车场存在同名车主，同一个车主联系方式应该一致
          </p>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogUserFormVisible = false">取消</el-button>
          <el-button :loading = "updateLoading" type="primary" @click="updateData">保存</el-button>
        </div>
      </el-dialog>
      <el-dialog title="导入" :visible.sync="dialogImportVisible" width="30%">
        <el-form ref="uploadData" :model="upload" :rules="uploadRules" autoCompete = "on" label-position="right" label-width="150px" >
          <el-form-item label="通道名称" prop="mac">
            <el-select v-model="upload.macs" multiple style="width:80%;">
              <el-option v-for="item in localList" clearable :key="item.mac" :label="item.localName" :value="item.mac"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="文件名称" required >
            <upload-file ref="upload" :name="'file'"  @hideUploadVisible = "hideUploadVisible" :fileData="upload" :action="action" :accept="accept"></upload-file>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogImportVisible = false">取消</el-button>
          <el-button type="primary" @click="importData">保存</el-button>
        </div>
      </el-dialog>
      <el-dialog title="充值" :visible.sync="dialogChangeVisible" width="600px" :close-on-click-modal="false">
        <el-form ref="changeform" :model="changeform" :rules="changeformRules" autoCompete = "on" label-position="right" label-width="150px" >
          <el-form-item label="车牌号码" prop="plate">
            <el-autocomplete v-model="changeform.plate" :fetch-suggestions="querySearch" placeholder="请先输入需充值车牌号码" @change="calcTime()" class="input-width" :maxlength="10"></el-autocomplete>
          </el-form-item>
          <el-form-item label="充值规则" prop="ruleId">
            <el-select v-model="changeform.ruleId" class="input-width filter-item" @change="calcTime()">
              <el-option v-for="item in ruleList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="包月次数" prop="index">
            <el-input type="number" v-model="changeform.index" placeholder="请输入包月次数" @change="calcTime()" min="1" max="99" class="input-width">
              <template slot="append">次</template>
            </el-input>
          </el-form-item>
          <p style="color:red;font-size:14px;text-align:center">
            结束时间 = 规则定义月数 * 次数 (可在下方手动修改)
          </p>
          <el-form-item label="结束时间" prop="overdueTime">
            <el-date-picker  class="input-width"
              v-model="changeform.overdueTime"
              type="datetime"
              :default-time="['23:59:59']"
              placeholder="结束日期"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="充值金额" prop="totalFee">
            <el-input type="number" v-model="changeform.totalFee"  min="0" step="0.01" class="input-width">
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
          <p style="color:red;font-size:14px;text-align:center">
            注: 输入车牌和选择好规则后, 结束时间和充值金额会自动计算
          </p>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogChangeVisible = false">取消</el-button>
          <el-button type="primary" :loading="isPay" @click="createChange">保存</el-button>
        </div>
      </el-dialog>
      <el-dialog title="重新导入" :visible.sync="dialogReImportVisible" width="30%">
        <el-form ref="reImportForm" :model="reImportForm" :rules="reImportFormRules" autoCompete = "on" label-position="right" label-width="150px" >
          <el-form-item label="选择从此相机" prop="oldMac">
            <el-select v-model="reImportForm.oldMac"  style="width:80%;">
              <el-option v-for="item in localList" clearable :key="item.mac" :label="item.localName" :value="item.mac"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="同步到该相机" prop="newMac">
            <el-select v-model="reImportForm.newMac" style="width:80%;">
              <el-option v-for="item in localList" clearable :key="item.mac" :label="item.localName" :value="item.mac"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogReImportVisible = false">取消</el-button>
          <el-button type="primary" :loading="reImportLoading" @click="reImportData">保存</el-button>
        </div>
      </el-dialog>
      <el-dialog title="导出" :visible.sync="dialogExportVisible" width="30%">
        <el-form ref="exportForm" :model="exportForm" :rules="exportRules" autoCompete = "on" label-position="right" label-width="150px" >
          <!-- <el-form-item label="通道名称" prop="mac">
            <el-select v-model="exportForm.mac"  style="width:80%;">
              <el-option v-for="item in localList" clearable :key="item.mac" :label="item.localName" :value="item.mac"></el-option>
            </el-select>
          </el-form-item> -->
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
<style lang="scss" scoped>
.input-width {
  width: 18.75rem;
}
</style>
<script>
import { isSyncFormatter, timeFormatter, timeFormatterSort, isShowColumnFormatter, timeFormatterDayEnd } from '@/utils/formatter.js'
import { plateType, isOverDueType, isSyncType } from '@/utils/selectAble.js'
import { httpGet, httpPost, httpDelete, httpPut, httpExport } from '@/utils/restful'
import { NomalWhitePlateCheck, getCamera, getChargeRules, getNormalWhite, NormalWhite, deleteAllNoramlWhite, oneToAnotherNormalWhite, uploadNormalWhiteFile, exportNormalWhite, NormalWhiteCharge } from '@/api/url'
import { checkPhone, checkPlate, checkNumber } from '@/utils/validator.js'
import UploadFile from '@/components/UploadFile'
export default {
  components: {
    UploadFile
  },
  data () {
    return {
      isPay: false,
      accept: '.xls,.xlsx',
      action: uploadNormalWhiteFile,
      upload: {
        departmentId: this.$store.getters.departmentId,
        macs: []
      },
      uploadRules: {
        macs: [
          {required: true, trigger: 'change', message: '通道名称不可为空'}
        ]
      },
      fileLimit: 1,
      date: [],
      list: null,
      listLoading: true,
      createLoading: false,
      deleteLoading: false,
      updateLoading: false,
      deleteAllLoading: false,
      exportLoading: false,
      listQuery: {
        offset: 1,
        limit: 10,
        plate: undefined,
        isSync: undefined,
        userName: undefined,
        isOverDue: undefined,
        mac: undefined
      },
      tableData: [],
      ruleList: [],
      localList: [],
      isSyncFormatter: isSyncFormatter,
      timeFormatter: timeFormatter,
      isShowColumnFormatter: isShowColumnFormatter,
      dialogFormVisible: false,
      dialogImportVisible: false,
      dialogUserFormVisible: false,
      dialogChangeVisible: false,
      dialogExportVisible: false,
      exportLoading1: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '添加'
      },
      plateType: plateType,
      isOverDueType: isOverDueType,
      isSyncType: isSyncType,
      total: null,
      selectArrayId: [],
      disabled: true,
      form: {
        id: undefined,
        mac: [],
        userName: undefined,
        plate: undefined,
        userPhone: undefined,
        ruleId: undefined,
        enableTime: undefined,
        overdueTime: undefined,
        reason: undefined
      },
      numberList: [],
      exportForm: {
        mac: undefined,
        number: 0
      },
      exportRules: {
        mac: [
          {required: true, trigger: 'change', message: '通道名称不可为空'}
        ],
        number: [
          {required: true, trigger: 'change', message: '不可为空'}
        ]
      },
      formRules: {
        mac: [
          {required: true, trigger: 'change', message: '通道名称不可为空'}
        ],
        userName: [
          {required: true, trigger: 'blur', message: '请输入车主姓名'}
        ],
        plate: [
          {required: true, trigger: 'blur', message: '请输入车牌号码'},
          {validator: checkPlate, trigger: 'blur'}
        ],
        userPhone: [
          {validator: checkPhone, trigger: 'blur'}
        ],
        ruleId: [
          {required: true, trigger: 'change', message: '请选择充值规则'}
        ]
      },
      dialogReImportVisible: false,
      reImportForm: {
        newMac: undefined,
        oldMac: undefined
      },
      reImportFormRules: {
        newMac: [
          {required: true, trigger: 'change', message: '通道名称不可为空'}
        ],
        oldMac: [
          {required: true, trigger: 'change', message: '通道名称不可为空'}
        ]
      },
      reImportLoading: false,
      changeform: {
        plate: undefined,
        ruleId: undefined,
        index: 1,
        overdueTime: timeFormatterDayEnd(new Date()),
        totalFee: undefined,
        remark: undefined
      },
      changeformRules: {
        plate: [
          {required: true, trigger: 'blur', message: '请输入车牌号码'},
          {validator: checkPlate, trigger: 'blur'}
        ],
        ruleId: [
          {required: true, trigger: 'change', message: '请选择充值规则'}
        ],
        monthNumber: [
          {required: true, trigger: 'blur', message: '请输包月次数'},
          {validator: checkNumber, trigger: 'blur'}
        ],
        overdueTime: [
          {required: true, trigger: 'change', message: '请选择结束日期'}
        ],
        totalFee: [
          {required: true, trigger: 'blur', message: '请输包月金额'}
        ]
      }
    }
  },
  created () {
    this.fetchData()
    this.loadLocals()
  },
  methods: {
    // 监听日期
    changeDate (value) {
      if (value === null) {
        this.$message.error('日期不可为空')
      } else if (this.form.ruleId === undefined) {
        this.date = []
        this.$message.error('请先选择充值规则')
      } else {
        this.form.enableTime = value[0]
        this.form.overdueTime = value[1]
      }
    },
    // 获取数据
    fetchData () {
      this.listLoading = true
      this.listQuery = Object.assign(this.listQuery, {departmentId: this.$store.getters.departmentId})
      httpGet(getNormalWhite, this.listQuery).then(res => {
        if (res.data === null || res.data.rows === null) {
          this.total = 0
          this.tableData = []
        } else {
          this.tableData = res.data.rows
          this.total = res.data.total
        }
        this.numberList = []
        for (let i = 0; i <= this.total / 5000; i++) {
          this.numberList.push({
            id: i,
            name: `从${i * 5000}到${(i + 1) * 5000}条`
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
        mac: [],
        userName: undefined,
        plate: undefined,
        userPhone: undefined,
        ruleId: undefined,
        enableTime: undefined,
        overdueTime: undefined,
        reason: undefined
      }
      this.date = []
    },
    loadRules () {
      httpGet(getChargeRules + '/' + this.$store.getters.departmentId).then(res => {
        this.ruleList = res.data
      }).catch(() => {})
    },
    loadLocals () {
      httpGet(getCamera + this.$store.getters.departmentId).then(res => {
        this.localList = res.data
      }).catch(() => {})
    },
    handleCreate () {
      let self = this
      self.dialogStatus = 'create'
      self.dialogFormVisible = true
      // 加载充值规则
      this.loadRules()
      // 加载通道信息
      this.loadLocals()
      self.$nextTick(() => {
        self.$refs['dataform'].resetFields()
        self.$refs.dataform.clearValidate()
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
        plate: undefined,
        isSync: undefined,
        userName: undefined,
        isOverDue: undefined,
        mac: undefined
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
          httpPost(NormalWhite, this.form).then((res) => {
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
    // 编辑用户
    updateData () {
      this.$refs.dataform.validate((valid) => {
        if (valid) {
          this.updateLoading = true
          const updateFormData = Object.assign({}, this.form)
          httpPut(NormalWhite, updateFormData).then(res => {
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
      this.$confirm('确认删除吗？', '提示', {})
        .then(() => {
          this.deleteLoading = true
          httpDelete(NormalWhite, {ids: this.selectArrayId})
            .then(res => {
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
    // 充值
    handleChanger () {
      let self = this
      self.dialogChangeVisible = true
      // 加载充值规则
      this.loadRules()
      // 延迟调用
      self.$nextTick(() => {
        self.$refs['changeform'].clearValidate()
        self.$refs.changeform.resetFields()
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
    // 导入
    handleImport () {
      this.upload = {
        macs: []
      }
      this.loadLocals()
      this.dialogImportVisible = true
      this.$nextTick(() => {
        this.$refs.uploadData.clearValidate()
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
    // --------------------------删除所有-------------------------\\
    handleDeleteAll () {
      this.$confirm('确认删除所有高级白名单吗？', '提示', {})
        .then(() => {
          this.deleteAllLoading = true
          httpDelete(deleteAllNoramlWhite + this.$store.getters.departmentId)
            .then(res => {
              this.deleteAllLoading = false
              this.fetchData()
              this.$message.success(res.message)
            }).catch(() => {
              this.deleteAllLoading = false
            })
        }).catch(() => {})
    },
    // 重新导入
    handleReImport () {
      this.loadLocals()
      this.dialogReImportVisible = true
      this.$nextTick(() => {
        this.$refs['reImportForm'].resetFields()
      })
    },
    reImportData () {
      this.$refs.reImportForm.validate((valid) => {
        if (valid) {
          this.reImportLoading = true
          this.reImportForm = Object.assign(this.reImportForm, {departmentId: this.$store.getters.departmentId})
          httpPost(oneToAnotherNormalWhite, this.reImportForm).then((res) => {
            this.dialogReImportVisible = false
            setTimeout(() => { this.reImportLoading = false }, 300)
            this.$message({
              message: res.message,
              type: 'success',
              duration: 4 * 1000
            })
          }).catch(() => {
            this.reImportLoading = false
          })
        }
      })
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
    downLoad () {
      this.$confirm('确认下载导入文档模板吗？', '提示', {})
        .then(() => {
          this.exportLoading1 = true
          let data = Object.assign({
            departmentId: this.$store.getters.departmentId
          }, this.exportForm)
          data = Object.assign(data, this.listQuery)
          httpExport(exportNormalWhite, data).then((res) => {
            setTimeout(() => { this.exportLoading1 = false }, 300)
          }).catch(() => {
            this.exportLoading1 = false
          })
        }).catch(() => {})
    },
    exportData () {
      this.$refs.exportForm.validate((valid) => {
        if (valid) {
          this.exportLoading = true
          let data = Object.assign({
            departmentId: this.$store.getters.departmentId
          }, this.exportForm)
          data = Object.assign(data, this.listQuery)
          httpExport(exportNormalWhite, data).then((res) => {
            this.dialogExportVisible = false
            setTimeout(() => { this.exportLoading = false }, 300)
          }).catch(() => {
            this.exportLoading = false
          })
        }
      })
    },
    // 计算时间
    calcTime () {
      if (this.changeform.plate && this.changeform.ruleId) {
        if (this.changeform.plate.length === 7 || this.changeform.plate.length === 8) {
          let sendData = {
            departmentId: this.$store.getters.departmentId,
            plate: this.changeform.plate
          }
          console.log(sendData)
          httpGet(NormalWhite, sendData).then((res) => {
            if (res.data) {
              // 根据id获取充值规则
              let rule = this.getRule(this.changeform.ruleId)
              if (rule) {
                let month = rule.monthNumber * this.changeform.index
                let tempTime
                let tempOverTime = new Date(res.data.overdueTime)
                let totalTime = new Date()
                if (tempOverTime.getTime() < totalTime.getTime()) {
                  // 已过期
                  tempTime = totalTime
                } else {
                  tempTime = tempOverTime
                }
                // 增加月数
                tempTime.setMonth(tempTime.getMonth() + month)
                this.changeform.overdueTime = tempTime.getTime()
                this.changeform.totalFee = (rule.monthPrice * this.changeform.index).toFixed(2)
              }
            }
          }).catch(() => {})
        } else {
          this.$message.warning('车牌号码不对')
        }
      }
      return ''
    },
    getRule (ruleId) {
      if (this.ruleList) {
        for (let i = 0; i < this.ruleList.length; i++) {
          if (this.ruleList[i].value === ruleId) {
            return this.ruleList[i]
          }
        }
      }
      return null
    },
    createChange () {
      this.$refs.changeform.validate((valid) => {
        if (valid) {
          this.isPay = true
          const changeformData = Object.assign(this.changeform, {departmentId: this.$store.getters.departmentId})
          changeformData.overdueTime = new Date(changeformData.overdueTime).getTime()
          httpPost(NormalWhiteCharge, changeformData).then((res) => {
            this.dialogChangeVisible = false
            setTimeout(() => { this.isPay = false }, 300)
            this.fetchData()
            this.$message({
              message: res.message,
              type: 'success',
              duration: 4 * 1000
            })
          }).catch(() => {
            this.isPay = false
          })
        }
      })
    },
    // 添加时间格式化
    ruleChange (value) {
      let obj = {}
      this.ruleList.forEach(item => {
        if (value === item.value) {
          obj = item
        }
      })
      this.form.enableTime = new Date().getTime()
      let year = timeFormatterSort(this.form.enableTime).split('-')[0]
      let day = timeFormatterSort(this.form.enableTime).split('-')[2]
      let month = Number(timeFormatterSort(this.form.enableTime).split('-')[1]) + obj.monthNumber
      if (month > 12) {
        let num = parseInt(month / 12)
        year = Number(year) + num
        month = month % 12
      }
      this.form.overdueTime = new Date(year + '-' + month + '-' + day + ' 23:59:59').getTime()
      this.date = [this.form.enableTime, this.form.overdueTime]
    },
    checkPlate () {
      if (this.form.plate !== undefined && this.form.plate.length > 1) {
        let data = {
          departmentId: this.$store.getters.departmentId,
          plate: this.form.plate
        }
        httpGet(NomalWhitePlateCheck, data)
          .then(() => {})
          .catch(() => {})
      }
    }
  }
}
</script>

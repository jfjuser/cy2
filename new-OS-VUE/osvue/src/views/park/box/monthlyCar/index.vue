<template>
  <div class="app-container">
     <div class="table-main">
        <!-- 操作 -->
        <div class="filter-container">
          <el-input clearable style="width: 150px;" v-model="listQuery.name"  class="filter-item" placeholder="车主姓名"></el-input>
          <el-autocomplete clearable class="filter-item" style="width: 150px;" v-model="listQuery.plate" :fetch-suggestions="querySearch" placeholder="车牌号"></el-autocomplete>
          <!-- 标准 -->
          <el-select v-if="!isShowColumnFormatter(['白名单审核'])" clearable v-model="listQuery.isSync" style="width: 150px;" class="filter-item" placeholder="同步状态">
            <el-option v-for="item in isSyncType" :key="item.valueNo" :label="item.valueName" :value="item.valueNo"></el-option>
          </el-select>
          <!-- 白名单审核非标 -->
          <el-select v-if="isShowColumnFormatter(['白名单审核'])" clearable v-model="listQuery.isSync" style="width: 150px;" class="filter-item" placeholder="同步状态">
            <el-option v-for="item in isSyncMonType" :key="item.valueNo" :label="item.valueName" :value="item.valueNo"></el-option>
          </el-select>
          <el-button class="filter-item" type="primary"  @click="handleFilter" icon="el-icon-search">搜索</el-button>
          <el-button class="filter-item" type="primary"  @click="handleRefresh" icon="el-icon-refresh">刷新</el-button>
          <el-button class="filter-item" type="primary"  v-has="['添加']"  @click="handleCreate"  icon="el-icon-edit">添加</el-button>
          <el-button class="filter-item" type="primary"  @click="handleExport" icon="el-icon-download">导出</el-button>
          <el-button class="filter-item" type="primary"  v-has="['导入']"  @click="handleImport" icon="el-icon-upload2">导入</el-button>
          <el-button class="filter-item" type="danger"  v-has="['删除']"  :loading = "deleteLoading" @click="handleDelete" :disabled="disabled" icon="el-icon-close">删除所选</el-button>
          <el-button class="filter-item" type="danger" plain v-has="['删除所有']" :loading = "deleteAllLoading" @click="handleAllDelete" icon="el-icon-delete">删除所有</el-button>
          <el-button class="filter-item" type="primary"  v-has="['充值']"  @click="handleChange"><i class="fa fa-rmb"> 充值</i></el-button>
          <el-button class="filter-item" type="primary"  v-has="['批量下发']" :loading = "issueLoading" @click="handleIssue" :disabled="disabled"><i class="fa fa-download"> 批量下发</i> </el-button>
          <el-button class="filter-item" type="primary"  v-has="['全部下发']" :loading = "issueAllLoading" @click="handleAllIssue"><i class="fa fa-arrow-circle-o-down"> 全部下发</i></el-button>
        </div>
        <el-table stripe :header-cell-style="{background:'#f3f4f6'}" style="width: 100%" max-height="600" :data="tableData" v-loading.body="listLoading" @selection-change="handleSelectionChange" element-loading-text="加载中..." border fit highlight-current-row>
          <el-table-column type="selection" width="40" fixed="left" v-if="isShowColumnFormatter(['删除'])"></el-table-column>
          <el-table-column label="车主姓名" align="center" prop="name"></el-table-column>
          <el-table-column label="车牌号码" align="center" prop="plate"></el-table-column>
          <el-table-column label="联系方式" align="center" prop="phone">
            <template slot-scope="scope">
              <template v-if="isShowColumnFormatter(['隐藏手机号'])">{{scope.row.phone | hiddenPhone}}</template>
              <template v-else>{{scope.row.phone}}</template>
            </template>
          </el-table-column>
          <el-table-column label="车位信息" align="center" prop="carcw"></el-table-column>
          <el-table-column label="同步状态" align="center" prop="isSync">
            <template slot-scope="scope">
              {{ isSyncFormatter(scope.row.isSync) }}
              <!-- <el-button v-if="scope.row.isSync === 0" type="danger" size="mini">{{ isSyncFormatter(scope.row.isSync) }}</el-button>
              <el-button v-if="scope.row.isSync === 1" type="success" size="mini">{{ isSyncFormatter(scope.row.isSync) }}</el-button>
              <el-button v-if="scope.row.isSync === 2 || scope.row.isSync === 3 || scope.row.isSync === 4 || scope.row.isSync === 5 || scope.row.isSync === 6" type="default" size="mini">{{ isSyncFormatter(scope.row.isSync) }}</el-button> -->
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
          <el-table-column label="备注信息" align="center" prop="reason"></el-table-column>
          <el-table-column fixed="right" label="操作" v-if="isShowColumnFormatter(['编辑', '通道权限'])" align="center" class-name="small-padding fixed-width" width="200">
            <template slot-scope="scope">
              <el-button type="primary" v-has="['编辑']" @click="handleUpdate(scope.row)" size="mini">编辑</el-button>
              <el-button type="primary" v-has="['通道权限']" @click="handlePermission(scope.row)" size="mini">通道权限</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <div class="pagination-container">
          <el-pagination background  :page-sizes="[10,20,30, 50]" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.offset " :page-size="listQuery.limit" :total="total" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
        </div>
        <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="600px" :close-on-click-modal="false">
          <el-form :rules="formRules" ref="dataform" :model="form" autoCompete = "on" label-position="right" label-width="150px" >
            <el-form-item label="车主姓名" prop="name">
              <el-input v-model="form.name" clearable placeholder="请输入姓名" class="input-width"></el-input>
            </el-form-item>
            <el-form-item v-if="dialogStatus === 'create'" label="通道权限">
              <el-select v-model="form.localId" multiple>
                <el-option v-for="item in localList" clearable :key="item.localId" :label="item.localName" :value="item.localId"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item v-if="dialogStatus === 'create' || isShowColumnFormatter(['更改车牌'])" label="车牌号码" prop="plate">
              <el-autocomplete   v-model="form.plate" clearable :fetch-suggestions="querySearch" placeholder="车牌号码" @blur="checkPlateNumber" :maxlength="8" class="input-width"></el-autocomplete>
            </el-form-item>
            <el-form-item label="联系方式" prop="phone">
              <el-input v-model="form.phone" clearable placeholder="请输入联系方式" :maxlength="11" class="input-width"></el-input>
            </el-form-item>
            <el-form-item label="车位信息">
              <el-input v-model="form.carcw" clearable placeholder="请输入车位信息" class="input-width"></el-input>
            </el-form-item>
            <div v-if="dialogStatus=='create'">
              <el-form-item label="充值规则" required>
                <el-select v-model="form.monthChargeRulesId" placeholder="请选择" style="width:18.75rem;" @change="ruleChange" required class="input-width">
                  <el-option v-for="item in ruleList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </div>
            <el-form-item v-if="dialogStatus === 'create'" label="开始日期" required>
              <el-date-picker type="datetime"  v-model="form.beginTime"  default-time="00:00:00" placeholder="开始日期不可为空" @change="StartTimeChange" class="input-width">
              </el-date-picker>
            </el-form-item>
            <el-form-item v-if="dialogStatus === 'create'" label="结束日期" required>
              <el-date-picker type="datetime"  v-model="form.endTime"  default-time="23:59:59" placeholder="结束日期不可为空" class="input-width">
              </el-date-picker>
            </el-form-item>
            <el-form-item v-if="dialogStatus === 'create'" label="备注" prop="reason">
              <el-input type="textarea" v-model="form.reason" :rows="3" placeholder="请输入备注信息" class="input-width"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取消</el-button>
            <el-button :loading = "createLoading" v-if="dialogStatus=='create'" type="primary" @click="createData">保存</el-button>
            <el-button :loading = "updateLoading" v-else type="primary" @click="updateData">修改</el-button>
          </div>
        </el-dialog>
        <!-- 权限 -->
        <el-dialog title="通道权限" :visible.sync="dialogPermissionVisible" width="40%">
            <template>
              <el-checkbox-group v-model="checked" >
                <el-checkbox v-for="item in localList"  :label="item.localId" :key="item.localId">{{item.localName}}</el-checkbox>
              </el-checkbox-group>
            </template>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogPermissionVisible = false">取消</el-button>
            <el-button  type="primary" @click="permData">保存</el-button>
          </div>
        </el-dialog>
        <el-dialog title="导入" :visible.sync="dialogImportVisible"  label-position="right" label-width="150px" width="30%">
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
        <el-dialog title="充值" :visible.sync="dialogChangeVisible" width="600px" :close-on-click-modal="false">
          <el-form ref="changeform" :model="changeform" :rules="changeformRules" autoCompete = "on" label-position="right" label-width="150px" >
            <el-form-item label="车牌号码" prop="plate">
              <el-autocomplete v-model="changeform.plate" disabled :fetch-suggestions="querySearch" placeholder="车牌号码" :maxlength="8" class="input-width"></el-autocomplete>
            </el-form-item>
            <el-form-item label="充值规则" prop="ruleId">
              <el-select v-model="changeform.ruleId"  class="filter-item" >
                <el-option v-for="item in ruleList" :key="item.value"  :label="item.label" :value="item.value"> </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="包月次数" prop="index">
              <el-input type="number" v-model="changeform.index"  placeholder="请输入包月次数" @blur="calcTime" class="input-width">
                <template slot="append">次</template>
              </el-input>
            </el-form-item>
            <el-form-item label="结束时间" prop="endTime">
              <el-date-picker
                v-model="changeform.endTime"
                type="datetime"
                :default-time="['23:59:59']"
                placeholder="结束日期"
                class="input-width"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item label="包月金额" prop="totalFee">
              <el-input type="number" v-model="changeform.totalFee" step="0.01" class="input-width">
                <template slot="append">元</template>
              </el-input>
            </el-form-item>
            <el-form-item label="备注" prop="reason">
              <el-input type="textarea" v-model="changeform.reason" :rows="3" placeholder="请输入备注信息" class="input-width"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogChangeVisible = false">取消</el-button>
            <el-button type="primary" :disabled="isVisible" @click="createChange">保存</el-button>
          </div>
        </el-dialog>
      </div>
  </div>
</template>

<script>
import { isSyncFormatter, timeFormatterSort, timeFormatter, isShowColumnFormatter, timeFormatterDayEnd } from '@/utils/formatter.js'
import { isSyncType, plateType, isSyncMonType } from '@/utils/selectAble.js'
import { BoxMonthCarIssue, getBoxMonthCar, BoxMonthCar, BoxMonthCarPermission, BoxMonthCarCharge, BoxMonthCarCalc, checkPlateNumber, uploadBoxMonthCar, exportMonthCar, getBoxAllLocal, getChargeRules } from '@/api/url'
import { httpGet, httpDelete, httpPost, httpPut, httpExport } from '@/utils/restful'
import { checkPhone, checkNumber, checkPlate } from '@/utils/validator.js'
import UploadFile from '@/components/UploadFile'
export default {
  components: {
    UploadFile
  },
  data () {
    return {
      isVisible: false,
      accept: '.xls,.xlsx',
      action: uploadBoxMonthCar,
      upload: {
        departmentId: this.$store.getters.departmentId
      },
      list: null,
      listLoading: true,
      createLoading: false,
      deleteLoading: false,
      updateLoading: false,
      deleteAllLoading: false,
      issueLoading: false,
      issueAllLoading: false,
      value1: '',
      listQuery: {
        offset: 1,
        limit: 10,
        name: undefined,
        plate: undefined,
        isSync: undefined,
        localId: undefined
      },
      tableData: [],
      isSyncFormatter: isSyncFormatter,
      isShowColumnFormatter: isShowColumnFormatter,
      timeFormatter: timeFormatter,
      dialogFormVisible: false,
      dialogPermissionVisible: false,
      dialogImportVisible: false,
      dialogChangeVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '添加'
      },
      isSyncType: isSyncType,
      isSyncMonType: isSyncMonType,
      plateType: plateType,
      total: null,
      selectArrayId: [],
      disabled: true,
      ruleList: [],
      form: {
        id: undefined,
        name: undefined,
        localId: [],
        plate: undefined,
        phone: undefined,
        carcw: undefined,
        monthChargeRulesId: undefined,
        beginTime: undefined,
        endTime: undefined,
        reason: undefined
      },
      formRules: {
        name: [
          {required: true, trigger: 'blur', message: '请输入车主姓名'}
        ],
        localId: [
          {type: 'array', required: true, trigger: 'change', message: '权限不可为空'}
        ],
        plate: [
          {required: true, trigger: 'blur', message: '请输入车牌号码'},
          {validator: checkPlate, trigger: 'blur'}
        ],
        phone: [
          {required: true, trigger: 'blur', message: '请输入联系方式'},
          {validator: checkPhone, trigger: 'blur', message: '请输入正确的手机号'}
        ]
      },
      localList: [],
      checked: [],
      rowId: 0,
      numberList: [],
      exportForm: {
        number: 0
      },
      exportRules: {
        number: [
          {required: true, trigger: 'change', message: '不可为空'}
        ]
      },
      dialogExportVisible: false,
      exportLoading: false,
      changeform: {
        plate: undefined,
        ruleId: undefined,
        index: undefined,
        endTime: timeFormatterDayEnd(new Date()),
        totalFee: undefined,
        reason: undefined
      },
      changeformRules: {
        plate: [
          {required: true, trigger: 'blur', message: '请输入车牌号码'},
          {validator: checkPlate, trigger: 'blur'}
        ],
        ruleId: [
          {required: true, trigger: 'change', message: '请选择充值规则'}
        ],
        index: [
          {required: true, trigger: 'blur', message: '请输包月次数'},
          {validator: checkNumber, trigger: 'blur'}
        ],
        endTime: [
          {required: true, trigger: 'change', message: '请选择结束日期'}
        ],
        totalFee: [
          {required: true, trigger: 'blur', message: '请输包月金额'}
        ]
      }
    }
  },
  mounted () {
    this.fetchData()
  },
  methods: {
    // 添加时间格式化
    ruleChange (value) {
      let obj = {}
      this.ruleList.forEach(item => {
        if (this.form.monthChargeRulesId === item.value) {
          obj = item
        }
      })
      // console.log(obj)
      this.form.beginTime = new Date().getTime()
      let year = timeFormatterSort(this.form.beginTime).split('-')[0]
      let day = timeFormatterSort(this.form.beginTime).split('-')[2]
      let month = Number(timeFormatterSort(this.form.beginTime).split('-')[1]) + obj.monthNumber
      if (month > 12) {
        let num = parseInt(month / 12)
        year = Number(year) + num
        month = month % 12
      }
      this.form.endTime = new Date(year + '-' + month + '-' + day + ' 23:59:59').getTime()
      // console.log(this.form.endTime)
      // this.date = [this.form.enableTime, this.form.endTime]
    },
    // 获取所有的通道
    getAllLocal () {
      httpGet(getBoxAllLocal + '/' + this.$store.getters.departmentId).then((res) => {
        this.localList = res.data
      }).catch(() => {})
    },
    loadRules () {
      httpGet(getChargeRules + '/' + this.$store.getters.departmentId).then(res => {
        this.ruleList = res.data
      }).catch(() => {})
    },
    // 车牌校验
    checkPlateNumber () {
      if (this.form.data !== undefined) {
        const data = {
          departmentId: this.$store.getters.departmentId,
          plate: this.form.plate
        }
        httpPost(checkPlateNumber, data)
          .then(res => {}).catch(() => {})
      }
    },
    // 日期
    StartTimeChange (value) {
      if (this.form.monthChargeRulesId === undefined) {
        this.form.beginTime = undefined
        this.$message.warning('充值规则不可为空')
      } else {
        let obj = {}
        obj = this.ruleList.find(item => {
          return item.value === this.form.monthChargeRulesId
        })
        this.form.endTime = new Date(this.form.beginTime).getTime() + 3600 * 1000 * 24 * 30 * (obj.index)
      }
    },
    // 获取数据
    fetchData () {
      this.listQuery = Object.assign(this.listQuery, {departmentId: this.$store.getters.departmentId})
      httpGet(getBoxMonthCar, this.listQuery).then(res => {
        if (res.data === null || res.data.rows === null) {
          this.tableData = []
          this.total = 0
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
        name: undefined,
        localId: [],
        plate: undefined,
        phone: undefined,
        carcw: undefined,
        monthChargeRulesId: undefined,
        beginTime: '',
        endTime: '',
        reason: undefined
      }
    },
    handleCreate () {
      let self = this
      self.dialogStatus = 'create'
      self.dialogFormVisible = true
      // 延迟调用
      self.$nextTick(() => {
        self.resetForm()
        self.$refs['dataform'].resetFields()
      })
      this.loadRules()
      this.getAllLocal()
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
          httpPost(BoxMonthCar, this.form).then((res) => {
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
          const updateFormData = Object.assign({}, this.form)
          httpPut(BoxMonthCar, updateFormData).then(res => {
            this.fetchData()
            this.dialogFormVisible = false
            setTimeout(() => { this.updateLoading = false }, 300)
            this.$message({
              message: res.message,
              type: 'success',
              duration: 4 * 1000
            })
            this.updateLoading = false
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
          httpDelete(BoxMonthCar, {ids: this.selectArrayId}).then(res => {
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
      this.itemObj = val
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
    // 权限
    handlePermission (row) {
      let data = {
        departmentId: this.$store.getters.departmentId,
        id: row.id
      }
      this.rowId = row.id
      httpGet(BoxMonthCarPermission, data).then(res => {
        if (res.data.local.length === 0) {
          this.$message.error('暂未配置通道，请先配置通道')
        } else {
          this.localList = res.data.local
          this.checked = res.data.checked
          this.dialogPermissionVisible = true
        }
      }).catch(() => {})
    },
    // 保存权限
    permData () {
      if (this.checked.length === 0) {
        this.$message.error('请选择通道')
      } else {
        let data = {
          id: this.rowId,
          localIds: this.checked
        }
        httpPut(BoxMonthCarPermission, data).then(res => {
          this.dialogPermissionVisible = false
          this.$message({
            message: res.message,
            type: 'success',
            duration: 4 * 1000
          })
        }).catch(() => {})
      }
    },
    // 导出
    handleExport () {
      this.exportForm.localIds = undefined
      this.dialogExportVisible = true
      this.getAllLocal()
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
          httpExport(exportMonthCar, data).then((res) => {
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
    // 刷新
    handleRefresh () {
      this.listQuery = {
        offset: 1,
        limit: 10,
        name: undefined,
        plate: undefined,
        isSync: undefined,
        localId: undefined
      }
      this.fetchData()
    },
    // 删除所有
    handleAllDelete () {
      this.$confirm('确认删除所有数据吗？', '提示', {})
        .then(() => {
          this.deleteAllLoading = true
          httpDelete(BoxMonthCar + '/' + this.$store.getters.departmentId).then(res => {
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
    // 充值
    handleChange () {
      console.log(this.itemObj)
      if (this.selectArrayId.length === 1) {
        this.dialogChangeVisible = true
        // 加载充值规则
        this.loadRules()
        this.$nextTick(() => {
          this.$refs['changeform'].clearValidate()
          this.$refs.changeform.resetFields()
          this.changeform = Object.assign(this.changeform, JSON.parse(JSON.stringify(this.itemObj[0])))
        })
      } else {
        this.$message({
          type: 'warning',
          duration: 3000,
          message: '选择一个标记进行充值！'
        })
      }
    },
    // 计算时间
    calcTime () {
      if (this.changeform.plate === undefined || this.changeform.ruleId === undefined) {
        this.$message.error('车牌号码或者充值规则不可为空')
      } else {
        let data = {
          departmentId: this.$store.getters.departmentId,
          plate: this.changeform.plate,
          ruleId: this.changeform.ruleId,
          index: this.changeform.index
        }
        httpGet(BoxMonthCarCalc, data)
          .then(res => {
            this.changeform.endTime = res.data.endTime
            this.changeform.totalFee = res.data.totalFee
            let obj = {}
            this.ruleList.forEach(item => {
              if (this.changeform.ruleId === item.value) {
                obj = item
              }
            })
            this.changeform.totalFee = obj.monthPrice * this.changeform.index
            this.changeform.reason = res.data.reason
          }).catch(() => {})
      }
    },
    createChange () {
      this.$refs.changeform.validate((valid) => {
        if (valid) {
          this.isVisible = true
          const changeformData = Object.assign(this.changeform, {departmentId: this.$store.getters.departmentId})
          httpPost(BoxMonthCarCharge, changeformData).then((res) => {
            this.dialogChangeVisible = false
            setTimeout(() => { this.isVisible = false }, 300)
            this.fetchData()
            this.$message({
              message: res.message,
              type: 'success',
              duration: 4 * 1000
            })
          }).catch(() => {
            this.isVisible = false
          })
        }
      })
    },
    // 批量下发
    handleIssue () {
      this.$confirm('确认下发所选中的数据给设备吗？', '提示', {})
        .then(() => {
          this.issueLoading = true
          httpPut(BoxMonthCarIssue, {ids: this.selectArrayId}).then(res => {
            this.issueLoading = false
            this.fetchData()
            this.$message({
              type: 'success',
              message: res.message,
              duration: 4 * 1000
            })
          }).catch(() => {
            this.issueLoading = false
          })
        }).catch(() => {})
    },
    // 下发所有
    handleAllIssue () {
      this.$confirm('确认下发所有数据给设备吗？', '提示', {})
        .then(() => {
          this.issueAllLoading = true
          httpPut(BoxMonthCarIssue + '/' + this.$store.getters.departmentId).then(res => {
            this.issueAllLoading = false
            this.fetchData()
            this.$message({
              type: 'success',
              message: res.message,
              duration: 4 * 1000
            })
          }).catch(() => {
            this.issueAllLoading = false
          })
        }).catch(() => {})
    }
  }
}
</script>
<style lang="scss" scoped>
  .el-select{
    width: 18.75rem;
  }
  .input-width {
    width: 18.75rem;
  }
</style>

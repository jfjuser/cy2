<template>
  <div class="app-container">
    <div class="table-main">
      <!-- 操作 -->
      <div class="filter-container">
        <el-input placeholder="请输入姓名" class="filter-item" style="width: 150px;" v-model="listQuery.userName" :fetch-suggestions="querySearch" clearable></el-input>
        <el-autocomplete clearable class="filter-item" style="width: 150px;" v-model="listQuery.plate" :fetch-suggestions="querySearch" placeholder="请输入车牌"></el-autocomplete>
        <el-select clearable v-model="listQuery.isOverDue" style="width: 150px;"  class="filter-item" placeholder="是否过期">
          <el-option v-for="item in isOverDueType" :key="item.valueNo" :label="item.valueName" :value="item.valueNo"></el-option>
        </el-select>
         <el-select clearable v-model="listQuery.isSync" style="width: 150px;"  class="filter-item" placeholder="同步状态">
          <el-option v-for="item in isSyncType" :key="item.valueNo" :label="item.valueName" :value="item.valueNo"></el-option>
        </el-select>
        <el-select clearable v-model="listQuery.localId" style="width: 150px;" class="filter-item" placeholder="通道名称">
          <el-option v-for="item in localList" clearable :key="item.localId" :label="item.localName" :value="item.localId"></el-option>
        </el-select>
        <el-button class="filter-item" type="primary"   @click="handleFilter" icon="el-icon-search">搜索</el-button>
        <el-button class="filter-item" type="primary"   @click="handleRefresh" icon="el-icon-refresh">刷新</el-button>
        <el-button class="filter-item" type="primary" v-has="['添加']"  @click="handleCreate"  icon="el-icon-edit">添加</el-button>
        <el-button class="filter-item" type="primary" v-has="['导出']"  @click="handleExport" icon="el-icon-download">导出</el-button>
        <el-button class="filter-item" type="primary" v-has="['导入']" @click="handleImport" icon="el-icon-upload2">导入</el-button>
        <el-button class="filter-item" type="danger" v-has="['删除']"  :loading = "deleteLoading" @click="handleDelete" :disabled="disabled" icon="el-icon-close">删除所选</el-button>
        <el-button class="filter-item" type="danger" plain v-has="['删除所有']"  :loading = "deleteAllLoading" @click="handleDeleteAll" icon="el-icon-delete">删除所有</el-button>
        <el-button class="filter-item" type="primary" v-has="['充值']"  @click="handleChanger">
          <i class="fa fa-rmb"></i>
          充值
        </el-button>
        <el-button class="filter-item" type="primary" v-has="['重新导入']"   @click="handleReImport">
          <i class="fa fa-recycle"></i>
          重新导入
        </el-button>
      </div>
      <el-table stripe :header-cell-style="{background:'#f3f4f6'}" style="width: 100%" max-height="600" :data="tableData" v-loading.body="listLoading" @selection-change="handleSelectionChange" element-loading-text="加载中..." border fit highlight-current-row>
        <el-table-column type="selection" width="40" fixed="left" v-if = "isShowColumnFormatter(['删除'])" ></el-table-column>
        <el-table-column label="车主姓名" align="center" prop="userName"></el-table-column>
        <el-table-column label="通道名称" align="center" prop="localName"></el-table-column>
        <el-table-column label="车牌号码" align="center" prop="plate"></el-table-column>
        <el-table-column label="车位数" align="center" prop="carTal"></el-table-column>
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
        <el-table-column label="时段一" align="center">
          <template slot-scope="scope">
            {{scope.row.time1}} - {{scope.row.time2}}
          </template>
        </el-table-column>
        <el-table-column label="时段二" align="center">
          <template slot-scope="scope">
            {{scope.row.time3}} - {{scope.row.time4}}
          </template>
        </el-table-column>
        <el-table-column label="开始时间" align="center">
          <template slot-scope="scope">
            {{timeFormatter(scope.row.startTime)}}
          </template>
        </el-table-column>
        <el-table-column label="结束时间" align="center">
          <template slot-scope="scope">
            {{timeFormatter(scope.row.endTime)}}
          </template>
        </el-table-column>
        <el-table-column label="备注信息" align="center" prop="reason"></el-table-column>
        <el-table-column fixed="right" label="操作" align="center" class-name="small-padding fixed-width" width="300" v-if = "isShowColumnFormatter(['编辑'])">
          <template slot-scope="scope">
            <el-button v-has="['编辑']" type="primary" @click.native.prevent="handleUpdate(scope.row)" size="mini">修改</el-button>
            <el-button v-has="['编辑']" type="primary" @click.native.prevent="handleEdit(scope.row)" size="mini">编辑车辆</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination background  :page-sizes="[10,20,30, 50]" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.offset " :page-size="listQuery.limit" :total="total" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
      </div>
      <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
        <el-form :rules="formRules" ref="dataform" :model="form" autoCompete = "on" label-position="right" label-width="150px" >
          <el-form-item label="车主姓名" prop="userName">
            <el-input v-model="form.userName" style="width:18.75rem;" @change="handleChangeUserName" placeholder="请输入姓名"></el-input>
            <span style="color:red;">提示：不可填写含有中文符号的姓名</span>
          </el-form-item>
          <el-form-item label="通道名称" prop="localIdArr">
            <el-select v-model="form.localIdArr" multiple style="width:18.75rem;">
              <el-option v-for="item in localList" clearable :key="item.localId" :label="item.localName" :value="item.localId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="车牌号码" prop="plate">
            <el-autocomplete style="width:18.75rem;"  v-model="form.plate" :fetch-suggestions="querySearch" :maxlength="8" placeholder="车牌号码"></el-autocomplete>
          </el-form-item>
          <el-form-item label="总车位数" prop="carTal">
            <el-input type="number" v-model="form.carTal"  style="width:18.75rem;" placeholder="请输入总车位数">
              <template slot="append">位</template>
            </el-input>
            <span style="color: red;">备注：购买车位数</span>
          </el-form-item>
          <el-form-item label="联系方式" prop="userPhone">
            <el-input v-model="form.userPhone" style="width:18.75rem;" :maxlength="11" placeholder="请输入联系方式"></el-input>
            <span style="color: red;">注意：为防止车场存在同名车主，同一个车主联系方式应该一致</span>
          </el-form-item>
          <el-form-item label="时段一" required >
            <el-time-picker
              style="width:18.75rem;"
              is-range
              v-model="time1"
              @change="changeTime1"
              range-separator="至"
              :default-value ="['00:00', '00:00']"
              value-format = "HH:mm"
              format="HH 点 mm 分"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              placeholder="选择时间范围">
            </el-time-picker>
          </el-form-item>
          <el-form-item label="时段二" required >
            <el-time-picker
              style="width:18.75rem;"
              is-range
              v-model="time2"
              @change="changeTime2"
              :default-value ="['00:00', '00:00']"
              value-format = "HH:mm"
              format="HH 点 mm 分"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              placeholder="选择时间范围">
            </el-time-picker>
          </el-form-item>
          <el-form-item label="充值规则" required>
            <el-select v-model="form.ruleId" placeholder="请选择" style="width:18.75rem;" required @change="ruleChange">
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
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="备注">
            <el-input style="width:18.75rem;" v-model="form.reason" placeholder="输入备注"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button :loading = "createLoading" v-if="dialogStatus=='create'" type="primary" @click="createData">保存</el-button>
        </div>
      </el-dialog>
      <el-dialog title="编辑" :visible.sync="dialogUserFormVisible">
        <el-form :rules="formRules" ref="dataform" :model="form" autoCompete = "on" label-position="right" label-width="150px" >
          <el-form-item label="车主姓名" prop="userName">
            <el-input v-model="form.userName" class="input-width"  placeholder="请输入姓名"></el-input>
          <span style="color:red;">提示：不可填写含有中文符号的姓名</span>
          </el-form-item>
          <el-form-item label="总车位数" prop="carTal">
            <el-input type="number" v-model="form.carTal"  class="input-width" placeholder="请输入总车位数">
              <template slot="append">位</template>
            </el-input>
            <span style="color: red;">备注：购买车位数</span>
          </el-form-item>
          <el-form-item label="联系方式" prop="userPhone">
            <el-input v-model="form.userPhone" class="input-width" :maxlength="11" placeholder="请输入联系方式"></el-input>
            <span style="color: red;">注意：为防止车场存在同名车主，同一个车主联系方式应该一致</span>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogUserFormVisible = false">取消</el-button>
          <el-button :loading = "updateLoading" type="primary" @click="updateData">保存</el-button>
        </div>
      </el-dialog>
      <el-dialog title="编辑车辆" :visible.sync="dialogCarFormVisible">
        <el-form :rules="formRules" ref="dataform" :model="form" autoCompete = "on" label-position="right" label-width="150px" >
          <el-form-item label="车牌号码" prop="plate">
            <el-autocomplete class="input-width"  v-model="form.plate" :fetch-suggestions="querySearch" :maxlength="8" placeholder="车牌号码"></el-autocomplete>
          </el-form-item>
          <el-form-item label="时段一" required >
            <el-time-picker
              class="input-width"
              is-range
              v-model="time1"
              @change="changeTime1"
              :default-value ="['00:00', '00:00']"
              value-format = "HH:mm"
              format="HH 点 mm 分"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              placeholder="选择时间范围">
            </el-time-picker>
          </el-form-item>
          <el-form-item label="时段二" required >
            <el-time-picker
              class="input-width"
              is-range
              v-model="time2"
              @change="changeTime2"
              :default-value ="['00:00', '00:00']"
              value-format = "HH:mm"
              format="HH 点 mm 分"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              placeholder="选择时间范围">
            </el-time-picker>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogCarFormVisible = false">取消</el-button>
          <el-button :loading = "updateLoading" type="primary" @click="updateCarData">保存</el-button>
        </div>
      </el-dialog>
      <el-dialog title="导入" :visible.sync="dialogImportVisible" width="30%">
        <el-form ref="uploadData" :model="upload" :rules="uploadRules" autoCompete = "on" label-position="right" label-width="150px" >
          <el-form-item label="通道名称" prop="localIds">
            <el-select v-model="upload.localIds" multiple style="width:80%;">
              <el-option v-for="item in localList" clearable :key="item.localId" :label="item.localName" :value="item.localId"></el-option>
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
      <el-dialog title="导出" :visible.sync="dialogExportVisible" width="30%">
        <el-form ref="exportForm" :model="exportForm" :rules="exportRules" autoCompete = "on" label-position="right" label-width="150px" >
          <!-- <el-form-item label="通道名称" prop="localId">
            <el-select v-model="exportForm.localId"  style="width:80%;">
              <el-option v-for="item in localList" clearable :key="item.localId" :label="item.localName" :value="item.localId"></el-option>
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
      <el-dialog title="重新导入" :visible.sync="dialogReImportVisible" width="30%">
        <el-form ref="reImportForm" :model="reImportForm" :rules="reImportFormRules" autoCompete = "on" label-position="right" label-width="150px" >
          <el-form-item label="选择从此相机" prop="oldLocalId">
            <el-select v-model="reImportForm.oldLocalId"  style="width:80%;">
              <el-option v-for="item in localList" clearable :key="item.localId" :label="item.localName" :value="item.localId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="同步到该相机" prop="newLocalId">
            <el-select v-model="reImportForm.newLocalId" multiple  style="width:80%;">
              <el-option v-for="item in localList" clearable :key="item.localId" :label="item.localName" :value="item.localId"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogReImportVisible = false">取消</el-button>
          <el-button type="primary" :loading="reImportLoading" @click="reImportData">保存</el-button>
        </div>
      </el-dialog>
      <el-dialog title="充值" :visible.sync="dialogChangeVisible" :close-on-click-modal="false">
        <el-form ref="changeform" :model="form" autoCompete = "on" label-position="right" label-width="150px" >
          <el-form-item label="车主姓名" prop="userName">
            <el-input v-model="form.userName" class="input-width" @change="handleChangeUserName" placeholder="请输入姓名"></el-input>
          </el-form-item>
          <el-form-item label="联系方式" prop="userPhone">
            <el-input v-model="form.userPhone" class="input-width" :maxlength="11" placeholder="请输入联系方式"></el-input>
            <span style="color: red;">注意：为防止车场存在同名车主，同一个车主联系方式应该一致</span>
          </el-form-item>
          <el-form-item label="包月次数" prop="index">
            <el-input type="number" v-model="form.index" class="input-width" placeholder="请输入包月次数" @change="ruleChange">
              <template slot="append">次</template>
            </el-input>
          </el-form-item>
          <el-form-item label="总车位数" prop="carTal">
            <el-input type="number" v-model="form.carTal" disabled class="input-width" placeholder="请输入总车位数">
              <template slot="append">位</template>
            </el-input>
          </el-form-item>
          <el-form-item label="充值规则" prop="ruleId">
            <el-select v-model="form.ruleId"  class="filter-item input-width" @change="ruleChange">
              <el-option v-for="item in ruleList" :key="item.value"  :label="item.label" :value="item.value"> </el-option>
            </el-select>
            <span style="color: red;">结束时间 = 规则定义月数 * 次数 (可在下方手动修改)</span>
          </el-form-item>
          <el-form-item label="结束时间" prop="endTime">
            <el-date-picker  class="input-width"
              v-model="form.endTime"
              type="datetime"
              :default-time="['23:59:59']"
              placeholder="结束日期"
            >
            </el-date-picker>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogChangeVisible = false">取消</el-button>
          <el-button type="primary" :loading="isTop" @click="createChange">保存</el-button>
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
import { isSyncFormatter, timeFormatter, timeFormatterSort, timeFormatterDayEnd, isShowColumnFormatter } from '@/utils/formatter.js'
import { plateType, isOverDueType, isSyncType } from '@/utils/selectAble.js'
import { checkPhone, checkPlate, checkNumber } from '@/utils/validator.js'
import { getCamera, getChargeRules, getTopWhite, searchUserName, updateTopWhiteUser, deleteTopWhite, TopWhite, deleteAllTopWhite, uploadTopWhite, exportTopWhite, oneToAnotherTopWhite, recharge } from '@/api/url'
import { httpGet, httpPost, httpPut, httpDelete, httpExport } from '@/utils/restful'
import UploadFile from '@/components/UploadFile'
export default {
  components: {
    UploadFile
  },
  data () {
    return {
      isTop: false,
      accept: '.xls,.xlsx',
      action: uploadTopWhite,
      isSyncType: isSyncType,
      upload: {
        departmentId: this.$store.getters.departmentId,
        localIds: []
      },
      uploadRules: {
        localIds: [
          {required: true, trigger: 'change', message: '通道名称不可为空'}
        ]
      },
      fileLimit: 1,
      time1: [new Date(2016, 9, 10, 0, 0), new Date(2016, 9, 10, 0, 0)],
      time2: [new Date(2016, 9, 10, 0, 0), new Date(2016, 9, 10, 0, 0)],
      date: [],
      list: null,
      listLoading: true,
      reImportLoading: false,
      exportLoading: false,
      createLoading: false,
      deleteLoading: false,
      updateLoading: false,
      deleteAllLoading: false,
      listQuery: {
        offset: 1,
        limit: 10,
        userName: undefined,
        plate: undefined,
        isSync: undefined,
        time: undefined,
        isOverDue: undefined,
        localId: undefined
      },
      tableData: [],
      ruleList: [],
      localList: [],
      isOverDueType: isOverDueType,
      isSyncFormatter: isSyncFormatter,
      timeFormatter: timeFormatter,
      timeFormatterSort: timeFormatterSort,
      isShowColumnFormatter: isShowColumnFormatter,
      dialogFormVisible: false,
      dialogImportVisible: false,
      dialogUserFormVisible: false,
      dialogCarFormVisible: false,
      dialogChangeVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '添加'
      },
      plateType: plateType,
      total: null,
      selectArrayId: [],
      disabled: true,
      form: {
        id: undefined,
        localIdArr: [],
        userName: undefined,
        plate: undefined,
        userPhone: undefined,
        carTal: undefined,
        time1: '00:00',
        time2: '00:00',
        time3: '00:00',
        time4: '00:00',
        index: 1,
        ruleId: undefined,
        startTime: undefined,
        endTime: timeFormatterDayEnd(new Date()),
        reason: undefined
      },
      formRules: {
        localIdArr: [
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
          {required: true, trigger: 'blur', message: '请输入联系方式'},
          {validator: checkPhone, trigger: 'blur'}
        ],
        carTal: [
          {required: true, trigger: 'blur', message: '请输入总车位数'},
          {validator: checkNumber, trigger: 'blur'}
        ]
      },
      numberList: [],
      exportForm: {
        localId: undefined,
        number: 0
      },
      exportRules: {
        localId: [
          {required: true, trigger: 'change', message: '通道名称不可为空'}
        ],
        number: [
          {required: true, trigger: 'change', message: '不可为空'}
        ]
      },
      dialogExportVisible: false,
      dialogReImportVisible: false,
      reImportForm: {
        newLocalId: [],
        oldLocalId: undefined
      },
      reImportFormRules: {
        newLocalId: [
          {required: true, trigger: 'change', message: '通道名称不可为空'}
        ],
        oldLocalId: [
          {required: true, trigger: 'change', message: '通道名称不可为空'}
        ]
      }
    }
  },
  created () {
    this.fetchData()
    this.loadLocals()
  },
  methods: {
    // 监听时段一
    changeTime1 (value) {
      if (value === null) {
        this.$message.error('时段不可为空')
      } else {
        this.form.time1 = value[0]
        this.form.time2 = value[1]
      }
    },
    // 监听时段二
    changeTime2 (value) {
      if (value === null) {
        this.$message.error('时段不可为空')
      } else {
        this.form.time3 = value[0]
        this.form.time4 = value[1]
      }
    },
    // 监听日期
    changeDate (value) {
      if (value === null) {
        this.$message.error('日期不可为空')
      } else if (this.form.ruleId === undefined) {
        this.$message.error('充值规则不可为空')
      } else {
        this.form.startTime = value[0]
        this.form.endTime = value[1]
        this.date = [value[0], value[1]]
      }
    },
    // 添加时间格式化
    ruleChange () {
      let obj = {}
      this.ruleList.forEach(item => {
        if (Number(this.form.ruleId) === item.value) {
          obj = item
        }
      })
      this.form.startTime = new Date().getTime()
      let year = timeFormatterSort(this.form.startTime).split('-')[0]
      let day = timeFormatterSort(this.form.startTime).split('-')[2]
      let month = Number(timeFormatterSort(this.form.startTime).split('-')[1]) + obj.monthNumber * (this.form.index ? this.form.index : 1)
      if (month > 12) {
        let num = parseInt(month / 12)
        year = Number(year) + num
        month = month % 12
      }
      this.form.endTime = new Date(year + '-' + month + '-' + day + ' 23:59:59').getTime()
      this.date = [this.form.startTime, this.form.endTime]
    },
    // 获取数据
    fetchData () {
      this.listLoading = true
      this.listQuery = Object.assign(this.listQuery, {departmentId: this.$store.getters.departmentId})
      httpGet(getTopWhite, this.listQuery).then(res => {
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
        localIdArr: [],
        userName: undefined,
        plate: undefined,
        userPhone: undefined,
        carTal: undefined,
        time1: '00:00',
        time2: '00:00',
        time3: '00:00',
        time4: '00:00',
        index: 1,
        ruleId: undefined,
        startTime: undefined,
        endTime: undefined,
        reason: undefined
      }
      this.time1 = [new Date(2016, 9, 10, 0, 0), new Date(2016, 9, 10, 0, 0)]
      this.time2 = [new Date(2016, 9, 10, 0, 0), new Date(2016, 9, 10, 0, 0)]
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
      }).catch(() => {
      })
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
    handleEdit (row) {
      this.form = Object.assign({}, row)
      this.time1 = [row.time1, row.time2]
      this.time2 = [row.time3, row.time4]
      this.dialogStatus = 'update'
      this.dialogCarFormVisible = true
      this.$nextTick(() => {
        this.$refs.dataform.clearValidate()
      })
    },
    // 重置搜索字段
    resetListQuery () {
      this.listQuery = {
        offset: 1,
        limit: 10,
        userName: undefined,
        plate: undefined,
        isSync: undefined,
        time: undefined,
        isOverDue: undefined,
        localId: undefined
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
          httpPost(TopWhite, this.form).then((res) => {
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
          httpPut(updateTopWhiteUser, updateFormData).then(res => {
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
    updateCarData () {
      this.$refs.dataform.validate((valid) => {
        if (valid) {
          this.updateLoading = true
          const updateFormData = Object.assign({}, this.form)
          httpPut(TopWhite, updateFormData).then(res => {
            this.fetchData()
            this.dialogCarFormVisible = false
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
    createChange () {
      this.$refs.changeform.validate((valid) => {
        if (valid) {
          this.isTop = true
          const changeformData = Object.assign(this.form, {departmentId: this.$store.getters.departmentId})
          httpPost(recharge, changeformData).then((res) => {
            this.dialogChangeVisible = false
            setTimeout(() => { this.isTop = false }, 300)
            this.fetchData()
            this.$message({
              message: res.message,
              type: 'success',
              duration: 4 * 1000
            })
          }).catch(() => {
            this.isTop = false
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
          httpDelete(deleteTopWhite, {ids: this.selectArrayId})
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
      })
    },
    handleChangeUserName (value) {
      // 延迟调用
      this.$nextTick(() => {
        let search = {
          userName: value,
          departmentId: this.$store.getters.departmentId
        }
        httpGet(searchUserName, search).then((res) => {
          if (res.data != null) {
            this.date = [new Date(res.data.startTime), new Date(res.data.endTime)]
            this.form = Object.assign(this.form, res.data)
          }
        }).catch(() => {})
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
    // 导出
    handleExport () {
      this.exportForm.localId = undefined
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
          httpExport(exportTopWhite, data).then((res) => {
            this.dialogExportVisible = false
            setTimeout(() => { this.exportLoading = false }, 300)
          }).catch(() => {
            this.exportLoading = false
          })
        }
      })
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
          httpPut(oneToAnotherTopWhite, this.reImportForm).then((res) => {
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
    // 导入
    handleImport () {
      this.upload = {
        localIds: []
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
          httpDelete(deleteAllTopWhite + this.$store.getters.departmentId)
            .then(res => {
              this.deleteAllLoading = false
              this.fetchData()
              this.$message.success(res.message)
            }).catch(() => {
              this.deleteAllLoading = false
            })
        }).catch(() => {})
    }
  }
}
</script>

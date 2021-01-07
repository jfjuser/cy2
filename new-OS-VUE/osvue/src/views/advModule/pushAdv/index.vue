<template>
  <div class="app-container">
    <div class="table-main">
      <!-- 操作 -->
      <div class="filter-container">
        <el-input v-model="listQuery.type" style="width: 150px;"  class="filter-item" placeholder="请输入目标类型"></el-input>
        <!-- <el-select clearable v-model="listQuery.type" style="width: 150px;"  class="filter-item" placeholder="目标类型">
          <el-option v-for="item in advTargetType" :key="item.valueNo" :label="item.valueName" :value="item.valueNo"></el-option>
        </el-select> -->
        <el-select clearable v-model="listQuery.enable" style="width: 150px;"  class="filter-item" placeholder="是否启用">
          <el-option v-for="item in enableType" :key="item.valueNo" :label="item.valueName" :value="item.valueNo"></el-option>
        </el-select>
        <el-select clearable v-model="listQuery.verifyStatus" style="width: 150px;"  class="filter-item" placeholder="审核状态">
          <el-option v-for="item in verifyStatusType" :key="item.valueNo" :label="item.valueName" :value="item.valueNo"></el-option>
        </el-select>
        <el-button class="filter-item" type="primary" @click="handleFilter" icon="el-icon-search">搜索</el-button>
        <el-button class="filter-item" type="primary" @click="fetchData" icon="el-icon-refresh">刷新</el-button>
        <el-button class="filter-item" type="primary" @click="handleh"  icon="el-icon-download" v-has="['导出']" >导出</el-button>
        <el-button class="filter-item" type="primary" v-has="['新增']"  @click="handleCreate"  icon="el-icon-edit">添加</el-button>
        <el-button class="filter-item" type="danger" v-has="['删除']" :loading = "deleteLoading" @click="handleDelete" :disabled="disabled" icon="el-icon-close">删除所选</el-button>
      </div>
      <el-table stripe :header-cell-style="{background:'#f3f4f6'}" style="width: 100%" max-height="600" :data="tableData" v-loading.body="listLoading"  @selection-change="handleSelectionChange"  element-loading-text="加载中..." border fit highlight-current-row>
        <el-table-column v-if = "isShowColumnFormatter(['删除'])" type="selection" width="40" fixed="left" ></el-table-column>
        <el-table-column label="目标类型" align="center" prop="type">
          <!-- <template slot-scope="scope">
            {{advTargetTypeFormatter(scope.row.type)}}
          </template> -->
        </el-table-column>
        <el-table-column label="挂载位置" align="center" prop="disLocation">
          <!-- <template slot-scope="scope">
            {{disLocationFormatter(scope.row.disLocation)}}
          </template> -->
        </el-table-column>
        <el-table-column label="显示样式" align="center" prop="disStyle">
          <template slot-scope="scope">
            {{disStyleFormatter(scope.row.disStyle)}}
          </template>
        </el-table-column>
        <el-table-column label="广告类型" align="center" prop="advType">
          <!-- <template slot-scope="scope">
            {{pushAdvTypeFormatter(scope.row.advType)}}
          </template> -->
        </el-table-column>
        <el-table-column label="广告标题" align="center" prop="advTitle"></el-table-column>
        <el-table-column label="简要信息" align="center" prop="advSimpleInfo"></el-table-column>
        <el-table-column label="备注" align="center" prop="advResume"></el-table-column>
        <el-table-column label="触发事件" align="center" prop="happenEvent">
          <template slot-scope="scope">
            {{happenEventFormatter(scope.row.happenEvent)}}
          </template>
        </el-table-column>
        <el-table-column label="推送次数" align="center" prop="pushTimes"></el-table-column>
        <el-table-column label="点击次数" align="center" prop="clickTimes"></el-table-column>
        <el-table-column label="有效期开始时间" align="center" prop="pushBegin">
          <template slot-scope="scope">
            {{timeFormatter(scope.row.pushBegin)}}
          </template>
        </el-table-column>
        <el-table-column label="有效期结束时间" align="center" prop="pushEnd">
          <template slot-scope="scope">
            {{timeFormatter(scope.row.pushEnd)}}
          </template>
        </el-table-column>
        <el-table-column label="是否启用" align="center" prop="isEnable">
          <template slot-scope="scope">
            {{enableFormatter(scope.row.isEnable)}}
          </template>
        </el-table-column>
        <el-table-column label="审核状态" align="center" prop="verifyStatus">
          <template slot-scope="scope">
            {{checkStatusFormatter(scope.row.verifyStatus)}}
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" v-if = "isShowColumnFormatter(['查看', '编辑', '启用', '审核'])" align="center" class-name="small-padding fixed-width" width="300">
          <template slot-scope="scope">
            <el-button type="primary" v-has="['查看']" @click="handleDetail(scope.row)" size="mini">详情</el-button>
            <el-button type="primary" v-has="['编辑']" @click.native.prevent="handleUpdate(scope.row)" size="mini">编辑</el-button>
            <el-button type="primary" v-has="['启用']" @click.native.prevent="handleEnable(scope.row)" size="mini">启用</el-button>
            <el-button type="primary" v-has="['审核']" @click.native.prevent="handleVerify(scope.row)" size="mini">审核</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination background  :page-sizes="[10,20,30, 50]" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.offset " :page-size="listQuery.limit" :total="total" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
      </div>
      <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width ="800px">
        <el-form :rules="formRules" ref="dataform" :model="form" autoCompete = "on" label-position="right" label-width="150px" >
          <!-- <el-form-item label="目标类型" prop="type">
            <el-select v-model="form.type" class="filter-item" @change="changeType">
              <el-option v-for="item in advTargetType" :key="item.valueNo" :label="item.valueName" :value="item.valueNo"> </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="挂载位置" prop="disLocation" v-if="isSelectDis">
            <el-select v-model="form.disLocation" class="filter-item" >
              <el-option v-for="item in disLocationType" :key="item.valueNo" :label="item.valueName" :value="item.valueNo"> </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="显示样式" prop="disStyle" v-if="isSelectDis">
            <el-select v-model="form.disStyle" class="filter-item" >
              <el-option v-for="item in disStyleType" :key="item.valueNo" :label="item.valueName" :value="item.valueNo"> </el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item label="广告模板" prop="disStyle">
            <el-select v-model="form.modelId" class="filter-item" @change="handleImage">
              <el-option v-for="(item, index) in advArr" :key="index" :label="`${item.type} - ${item.disLocation} - ${disStyleFormatter(item.disStyle)} - ${item.advType}`" :value="item.id"> </el-option>
            </el-select>
          </el-form-item>
          <div class="box-slimg" v-show="picUrl !== null">
            <img :src="picUrl"/>
            <div>示例</div>
          </div>
          <!-- <el-form-item label="广告类型" prop="advType">
            <el-select v-model="form.advType" class="filter-item" >
              <el-option v-for="item in pushAdvType" :key="item.valueNo" :label="item.valueName" :value="item.valueNo"> </el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item label="广告跳转路径" prop="advRealUrl">
            <el-input v-model="form.advRealUrl" style="width:18.75rem;" placeholder="请填写广告点击后跳转的地址"></el-input>
          </el-form-item>
          <el-form-item label="广告标题" prop="advTitle">
            <el-input v-model="form.advTitle" style="width:18.75rem;" placeholder="请输入广告标题"></el-input>
          </el-form-item>
          <el-form-item label="广告简要信息" prop="advSimpleInfo">
            <el-input v-model="form.advSimpleInfo" style="width:18.75rem;" placeholder="请输入广告简要信息"></el-input>
          </el-form-item>
          <el-form-item label="广告备注" prop="advResume">
            <el-input v-model="form.advResume" style="width:18.75rem;" placeholder="请输入广告备注"></el-input>
          </el-form-item>
          <!-- <el-form-item label="触发事件" prop="happenEvent" v-if="isSelectDis">
            <el-select v-model="form.happenEvent" class="filter-item" >
              <el-option v-for="item in happenEventType" :key="item.valueNo" :label="item.valueName" :value="item.valueNo"> </el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item label="有效日期" required >
            <el-date-picker v-model="date" type="datetimerange" :default-time="['00:00:00', '23:59:59']" @change = "changeDate" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
          <!-- <el-form-item label="是否开启定点推送" prop="isPointPush">
            <el-radio v-model="form.isPointPush" :label="1"  border>是</el-radio>
            <el-radio v-model="form.isPointPush" :label="0"  border>否</el-radio>
          </el-form-item> -->
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false, picUrl=null">取消</el-button>
          <el-button :loading = "createLoading" v-if="dialogStatus=='create'" type="primary" @click="createData">保存</el-button>
          <el-button :loading = "updateLoading" v-else type="primary" @click="updateData">修改</el-button>
        </div>
      </el-dialog>
      <el-dialog title="详情" :visible.sync="dialogVisible">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-card class="box-card">
              <div slot="header" style="font-size: 16px;">
                使用情况
              </div>
              <el-row  class="text">
                <el-col :span="6">推送次数</el-col>
                <el-col :span="18">{{defaultNumFormatter(form.pushTimes)}}</el-col>
              </el-row>
              <el-row  class="text">
                <el-col :span="6">点击次数</el-col>
                <el-col :span="18">{{defaultNumFormatter(form.clickTimes)}}</el-col>
              </el-row>
              <el-row  class="text">
                <el-col :span="6">展现率</el-col>
                <el-col :span="18">{{zhanxianlv(form.pushTimes, form.clickTimes)}}</el-col>
              </el-row>
            </el-card>
            <el-card class="box-card" style="margin-top:20px;">
              <div slot="header" style="font-size: 16px;">
                审核情况
              </div>
              <el-row class="text">
                <el-col :span="6">审核状态</el-col>
                <el-col :span="18">{{checkStatusFormatter(form.verifyStatus)}}</el-col>
              </el-row>
              <el-row class="text">
                <el-col :span="6">审核备注</el-col>
                <el-col :span="18">{{form.verifyFailReason}}</el-col>
              </el-row>
              <el-row class="text">
                <el-col :span="6">是否启用</el-col>
                <el-col :span="18">{{enableFormatter(form.isEnable)}}</el-col>
              </el-row>
              <el-row class="text">
                <el-col :span="6">开始时间</el-col>
                <el-col :span="18">{{timeFormatter(form.pushBegin)}}</el-col>
              </el-row>
              <el-row class="text">
                <el-col :span="6">结束时间</el-col>
                <el-col :span="18">{{timeFormatter(form.pushEnd)}}</el-col>
              </el-row>
            </el-card>
          </el-col>
          <el-col :span="12">
            <el-card class="box-card">
              <div slot="header" style="font-size: 16px;">
                广告样式
              </div>
              <el-row  class="text">
                <el-col :span="6">目标类型</el-col>
                <el-col :span="18">{{advTargetTypeFormatter(form.type)}}</el-col>
              </el-row>
              <el-row  class="text">
                <el-col :span="6">挂载位置</el-col>
                <el-col :span="18">{{disLocationFormatter(form.disLocation)}}</el-col>
              </el-row>
              <el-row  class="text">
                <el-col :span="6">显示样式</el-col>
                <el-col :span="18">{{disStyleFormatter(form.disStyle)}}</el-col>
              </el-row>
              <el-row  class="text">
                <el-col :span="6">广告类型</el-col>
                <el-col :span="18">{{pushAdvTypeFormatter(form.advType)}}</el-col>
              </el-row>
              <el-row  class="text">
                <el-col :span="6">广告跳转路径</el-col>
                <el-col :span="18" class="newline">{{form.advRealUrl}}</el-col>
              </el-row>
              <el-row  class="text">
                <el-col :span="6">广告标题</el-col>
                <el-col :span="18">{{form.advTitle}}</el-col>
              </el-row>
              <el-row  class="text">
                <el-col :span="6">广告简要信息</el-col>
                <el-col :span="18">{{form.advSimpleInfo}}</el-col>
              </el-row>
              <el-row  class="text">
                <el-col :span="6">广告备注</el-col>
                <el-col :span="18">{{form.advResume}}</el-col>
              </el-row>
              <el-row  class="text">
                <el-col :span="6">触发事件</el-col>
                <el-col :span="18">{{happenEventFormatter(form.happenEvent)}}</el-col>
              </el-row>
            </el-card>
          </el-col>
        </el-row>
      </el-dialog>
      <el-dialog title="审核" :visible.sync="dialogVerifyVisible" width ="40%">
        <el-form ref="verifyForm" :model="form" autoCompete = "on" label-position="right" label-width="150px" >
          <el-form-item label="是否通过" prop="verifyStatus">
            <el-radio v-model="form.verifyStatus" :label="1"  border>通过</el-radio>
            <el-radio v-model="form.verifyStatus" :label="0"  border>不通过</el-radio>
          </el-form-item>
          <el-form-item label="备注" prop="verifyFailReason">
            <el-input v-model="form.verifyFailReason" style="width:18.75rem;" placeholder="请输入备注"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogVerifyVisible = false">取消</el-button>
          <el-button :loading = "verifyLoading" type="primary" @click="verify">保存</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { verifyStatusType, enableType, advTargetType, disLocationType, disStyleType, pushAdvType, happenEventType } from '@/utils/selectAble.js'
import { isShowColumnFormatter, timeFormatter, numberFormatter, defaultNumFormatter, checkStatusFormatter, enableFormatter, advTargetTypeFormatter, disLocationFormatter, disStyleFormatter, pushAdvTypeFormatter, happenEventFormatter } from '@/utils/formatter.js'
import { pushAdv, enablePushAdv, verifyPushAdv, searchAdv, getAdvModelImage } from '@/api/url.js'
import { httpGet, httpPost, httpPut, httpDelete } from '@/utils/restful.js'
import { checkUrl } from '@/utils/validator.js'
export default {
  data () {
    return {
      list: null,
      listLoading: true,
      createLoading: false,
      updateLoading: false,
      verifyLoading: false,
      deleteLoading: false,
      listQuery: {
        offset: 1,
        limit: 10,
        departmentId: this.$store.getters.departmentId,
        type: undefined,
        enable: undefined,
        verifyStatus: undefined
      },
      tableData: [],
      tableData1: [],
      isShowColumnFormatter: isShowColumnFormatter,
      timeFormatter: timeFormatter,
      numberFormatter: numberFormatter,
      defaultNumFormatter: defaultNumFormatter,
      checkStatusFormatter: checkStatusFormatter,
      enableFormatter: enableFormatter,
      advTargetTypeFormatter: advTargetTypeFormatter,
      disLocationFormatter: disLocationFormatter,
      disStyleFormatter: disStyleFormatter,
      pushAdvTypeFormatter: pushAdvTypeFormatter,
      happenEventFormatter: happenEventFormatter,
      verifyStatusType: verifyStatusType,
      enableType: enableType,
      advTargetType: advTargetType,
      disLocationType: disLocationType,
      disStyleType: disStyleType,
      pushAdvType: pushAdvType,
      happenEventType: happenEventType,
      total: null,
      disabled: true,
      dialogVisible: false,
      dialogVerifyVisible: false,
      dialogFormVisible: false,
      selectArrayId: [],
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '添加'
      },
      form: {
        id: undefined,
        modelId: 170,
        departmentId: this.$store.getters.departmentId,
        type: undefined,
        // disLocation: undefined,
        // disStyle: undefined,
        advCloudUrl: undefined,
        // advType: undefined,
        advRealUrl: undefined,
        advTitle: '',
        advSimpleInfo: '',
        advResume: '',
        // happenEvent: 4,
        pushBegin: undefined,
        pushEnd: undefined,
        pointIds: undefined,
        isPointPush: 0
      },
      isSelectDis: false,
      formRules: {
        advTitle: [
          {required: true, trigger: 'blur', message: '请获取用户名'}
        ],
        advRealUrl: [
          {required: true, trigger: 'blur', message: '请填写广告详情地址'},
          {validator: checkUrl, trigger: 'blur'}
        ]
        // happenEvent: [
        //   {required: true, trigger: 'change', message: '请选择广告触发事件'}
        // ]
      },
      date: [],
      advArr: [],
      picUrl: null,
      jsonData: [
        {
          title: '目标类型',
          key: 'type',
          type: 'text'
        },
        {
          title: '挂载位置',
          key: 'disLocation',
          type: 'text'
        },
        {
          title: '显示样式',
          key: 'disStyle',
          type: 'text'
        },
        {
          title: '广告类型',
          key: 'advType',
          type: 'text'
        },
        {
          title: '广告标题',
          key: 'advTitle',
          type: 'text'
        },
        {
          title: '简要信息',
          key: 'advSimpleInfo',
          type: 'text'
        },
        {
          title: '备注',
          key: 'advResume',
          type: 'text'
        },
        {
          title: '触发事件',
          key: 'happenEvent',
          type: 'text'
        },
        {
          title: '推送次数',
          key: 'pushTimes',
          type: 'text'
        },
        {
          title: '点击次数',
          key: 'clickTimes',
          type: 'text'
        },
        {
          title: '有效开始时间',
          key: 'pushBegin',
          type: 'text'
        },
        {
          title: '有效结束时间',
          key: 'pushEnd',
          type: 'text'
        },
        {
          title: '是否启用',
          key: 'isEnable',
          type: 'text'
        },
        {
          title: '审核状态',
          key: 'verifyStatus',
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
    this.getData()
  },
  methods: {
    handleh () {
      let obj = JSON.parse(JSON.stringify(this.tableData))
      obj.forEach((item, index) => {
        item.type = this.advTargetTypeFormatter(item.type)
        item.disLocation = this.disLocationFormatter(item.disLocation)
        item.disStyle = this.disStyleFormatter(item.disStyle)
        item.happenEvent = this.happenEventFormatter(item.happenEvent)
        item.advType = this.pushAdvTypeFormatter(item.advType)
        item.pushBegin = this.timeFormatter(item.pushBegin)
        item.pushEnd = this.timeFormatter(item.pushEnd)
        item.isEnable = this.enableFormatter(item.isEnable)
        item.verifyStatus = this.checkStatusFormatter(item.verifyStatus)
      })
      // console.log(this.jsonData, obj)
      this.table2excel(this.jsonData, obj, 'excel.xlsx')
    },
    changeType () {
      if (this.form.type === undefined) {
        this.isSelectDis = false
        this.form.disLocation = undefined
        this.form.disStyle = undefined
        this.form.happenEvent = 4
        this.$message.warning('请先目标类型')
      } else if (this.form.type === 2) {
        this.form.disLocation = 1
        this.form.disStyle = 2
        this.form.happenEvent = 2
        this.isSelectDis = true
      } else {
        this.$message.warning('暂只支持公众号类型')
        this.isSelectDis = true
      }
    },
    // 获取列表
    fetchData () {
      this.listLoading = true
      httpGet(pushAdv, this.listQuery).then(res => {
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
    // 监听日期
    changeDate (value) {
      if (value === null) {
        this.$message.error('日期不可为空')
      } else {
        this.form.pushBegin = value[0]
        this.form.pushEnd = value[1]
      }
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
    // 搜索
    handleFilter () {
      this.listQuery.offset = 1
      this.fetchData()
    },
    createData () {
      this.$refs.dataform.validate((valid) => {
        if (valid) {
          this.createLoading = true
          this.form = Object.assign(this.form, {departmentId: this.$store.getters.departmentId})
          httpPost(pushAdv, this.form).then((res) => {
            this.picUrl = null
            this.date = []
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
    updateData () {
      this.$refs.dataform.validate((valid) => {
        if (valid) {
          this.updateLoading = true
          const updateFormData = Object.assign({}, this.form)

          httpPut(pushAdv, {...updateFormData, pushBegin: this.date[0], pushEnd: this.date[1]}).then(res => {
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
    handleCreate () {
      let self = this
      self.dialogStatus = 'create'
      self.dialogFormVisible = true
      // 延迟调用
      self.$nextTick(() => {
        self.$refs['dataform'].resetFields()
        self.resetForm()
      })
      this.getData()
    },
    // 获取广告模板
    getData () {
      httpGet(searchAdv, this.listQuery).then((res) => {
        if (res.data.rows === null) {
          this.advArr = []
        } else {
          this.advArr = res.data.rows
        }
      }).catch((err) => {
        this.$message.error(err)
      })
    },
    handleImage (id) {
      httpGet(getAdvModelImage + id).then((res) => {
        if (res.data.length > 100) {
          // 是图片
          this.picUrl = 'data:image/jpeg;base64,' + res.data
        } else {
          this.picUrl = null
        }
      }).catch((err) => {
        this.$message.error(err)
      })
    },
    handleUpdate (row) {
      this.form = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.date = [new Date(this.form.pushBegin), new Date(this.form.pushEnd)]
      this.$nextTick(() => {
        this.$refs.dataform.clearValidate()
      })
      this.getData()
    },
    // 重置form表单
    resetForm () {
      this.form = {
        id: undefined,
        departmentId: this.$store.getters.departmentId,
        type: undefined,
        disLocation: undefined,
        disStyle: undefined,
        advCloudUrl: undefined,
        advType: undefined,
        advRealUrl: undefined,
        advTitle: '',
        advSimpleInfo: '',
        advResume: '',
        happenEvent: undefined,
        pushBegin: undefined,
        pushEnd: undefined,
        pointIds: undefined,
        isPointPush: 0
      }
    },
    handleDelete () {
      this.$confirm('确定要删除吗？', '提示', {})
        .then(() => {
          this.deleteLoading = true
          httpDelete(pushAdv, {ids: this.selectArrayId}).then(res => {
            this.deleteLoading = false
            this.fetchData()
          }).catch(() => {
            this.deleteLoading = false
          })
        })
    },
    handleDetail (row) {
      httpGet(pushAdv + '/' + row.id).then(res => {
        this.form = res.data
        this.dialogVisible = true
      }).catch(() => {})
    },
    zhanxianlv (pushTimes, clickTimes) {
      let result = '0%'
      if (!clickTimes) {
        clickTimes = 1
      }
      if (pushTimes) {
        result = numberFormatter(pushTimes / clickTimes) + '%'
      }
      return result
    },
    // 启用
    handleEnable (row) {
      let self = this
      this.$confirm('确定要启用吗？', '提示', {}).then(() => {
        let params = {
          id: row.id,
          isEnable: 1
        }
        httpPut(enablePushAdv, params).then(res => {
          self.fetchData()
          this.$message({
            message: res.message,
            type: 'success',
            duration: 4 * 1000
          })
        }).catch(() => {
        })
      }).catch(() => {})
    },
    handleVerify (row) {
      this.form = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogVerifyVisible = true
      // this.$nextTick(() => {
      //   this.$refs.verifyFrom.clearValidate()
      // })
    },
    verify () {
      let self = this
      httpPut(verifyPushAdv, this.form).then(res => {
        self.verifyLoading = false
        this.dialogVerifyVisible = false
        self.fetchData()
        self.$message({
          message: res.message,
          type: 'success',
          duration: 4 * 1000
        })
      }).catch(() => {
        self.verifyLoading = false
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  .text{
    font-size: 14px;
    padding: 5px;
  }
  .box-slimg {
    position: absolute;
    top: 80px;
    right: 20px;
    img {
      width: 300px;
    }
    div {
      width: 300px;
      text-align: center;
    }
  }
  .newline {
    word-wrap: break-word;
    word-break: break-all;
  }
</style>

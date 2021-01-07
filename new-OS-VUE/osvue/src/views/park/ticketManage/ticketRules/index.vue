<template>
  <div class="app-container">
    <div class="table-main">
      <!-- 操作 -->
      <div class="filter-container">
        <el-input clearable class="filter-item" v-model="listQuery.name"  placeholder="优惠券名称"></el-input>
        <el-select clearable v-model="listQuery.type"  class="filter-item" placeholder="类型">
          <el-option v-for="item in ticketType" :key="item.valueNo" :label="item.valueName" :value="item.valueNo"></el-option>
        </el-select>
        <el-button class="filter-item" type="primary"   @click="handleFilter" icon="el-icon-search">搜索</el-button>
        <el-button class="filter-item" type="primary"  v-has="['新增']" @click="handleCreate"  icon="el-icon-edit">添加</el-button>
        <el-button class="filter-item" type="primary"   @click="handleRefresh"  icon="el-icon-refresh">刷新</el-button>
        <el-button class="filter-item" type="primary" @click="handleh"  icon="el-icon-download" v-has="['导出']" >导出</el-button>
        <el-button class="filter-item" type="danger"  v-has="['删除']" :loading = "deleteLoading" @click="handleDelete" :disabled="disabled" icon="el-icon-close">删除所选</el-button>
      </div>
      <el-table stripe :header-cell-style="{background:'#f3f4f6'}" style="width: 100%" max-height="600" :data="tableData" v-loading.body="listLoading" @selection-change="handleSelectionChange" element-loading-text="加载中..." border fit highlight-current-row>
        <el-table-column type="selection" width="40" fixed="left" v-if="isShowColumnFormatter(['删除'])" ></el-table-column>
        <el-table-column label="优惠券名称" align="center" prop="name"></el-table-column>
        <el-table-column label="优惠券类型" align="center" prop="type">
          <template slot-scope="scope">
            {{ ticketTypeFormatter(scope.row.type) }}
          </template>
        </el-table-column>
        <el-table-column label="减免金额" align="center" prop="subFee">
          <template slot-scope="scope">
            {{ moneyFormatter(scope.row.subFee) }}
          </template>
        </el-table-column>
        <!-- <el-table-column label="最大抵扣金额" align="center" prop="maxDiscountMoney">
          <template slot-scope="scope">
            {{ moneyFormatter(scope.row.maxDiscountMoney) }}
          </template>
        </el-table-column> -->
        <el-table-column label="折扣率" align="center" prop="discount"></el-table-column>
        <el-table-column label="减免时长" align="center" prop="subTime"></el-table-column>
        <el-table-column label="总券数" align="center" prop="number">
          <template slot-scope="scope">
            {{ scope.row.number === 9999 ? '不限' : scope.row.number}}
          </template>
        </el-table-column>
        <el-table-column label="剩余券数" align="center" prop="restNumber">
          <template slot-scope="scope">
            {{ scope.row.restNumber === 9999 ? '不限' : scope.row.restNumber}}
          </template>
        </el-table-column>
        <el-table-column label="备注信息" align="center" prop="consume"></el-table-column>
        <el-table-column fixed="right" label="操作" align="center" v-if="isShowColumnFormatter(['编辑']) || isTicketPer(['静态二维码', '动态二维码', '单次扫', '车牌输入'], permission)" class-name="small-padding fixed-width" width="500">
          <template slot-scope="scope">
            <el-button type="primary" v-has="['编辑']" @click="handleUpdate(scope.row)" size="mini">编辑</el-button>
            <el-button type="primary" v-if="isTicketPer(['车牌输入'], permission)" @click="handlePlate(scope.row)" size="mini">车牌输入</el-button>
            <el-button type="primary" v-if="isTicketPer(['静态二维码'], permission)" @click="erCodeStatic(scope.row)" size="mini">静态码</el-button>
            <el-button type="primary" v-if="isTicketPer(['动态二维码'], permission)" @click="erCodeMove(scope.row)" size="mini">动态码</el-button>
            <el-button type="primary"  v-if="isTicketPer(['单次扫'], permission)"  @click="erCodeOne(scope.row)" size="mini">单次扫</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination background  :page-sizes="[10,20,30, 50]" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.offset " :page-size="listQuery.limit" :total="total" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
      </div>
      <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
        <el-form :rules="formRules" ref="dataform" :model="form" autoCompete = "on" label-position="right" label-width="150px" >
          <el-form-item label="优惠券名称" prop="name">
            <el-input class="filter-item" v-model="form.name"  placeholder="请输入优惠券名称"></el-input>
          </el-form-item>
          <el-form-item label="优惠券数量" prop="number">
            <el-input type="number" min="1" class="filter-item" v-model="form.number"  placeholder="请输入优惠券数量"></el-input>
            <span class="text">
                备注：9999表示不限量
              </span>
          </el-form-item>
          <div v-if="dialogStatus ==='create'">
            <el-form-item label="优惠券类型" prop="type">
              <el-select  class="filter-item" v-model="form.type"  placeholder="请选择">
                <el-option v-for="item in ticketType" :key="item.valueNo" :label="item.valueName" :value="item.valueNo"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="折扣率" prop="discount" v-if="form.type === 3">
              <el-input class="filter-item" v-model="form.discount"   placeholder="请输入折扣率" step="any"></el-input>
            </el-form-item>
            <el-form-item label="减免金额(元)" prop="subFee" v-if="form.type === 0">
              <el-input class="filter-item" v-model="form.subFee"   placeholder="请输入减免金额(元)" step="0.01"></el-input>
            </el-form-item>
            <!-- <el-form-item label="最大抵扣金额(元)" prop="maxDiscountMoney" v-if="form.type === 2 || form.type === 3">
              <el-input class="filter-item" v-model="form.maxDiscountMoney"   placeholder="请输入最大抵扣金额(元)" step="0.01"></el-input>
            </el-form-item> -->
            <el-form-item label="减免时间(分)" prop="subTime" v-if="form.type === 1">
              <el-input class="filter-item" v-model="form.subTime"   placeholder="请输入减免时间(分)"></el-input>
            </el-form-item>
            <el-form-item label="时间类型" prop="timeType" >
              <el-select class="filter-item"  v-model="form.timeType"  placeholder="请选择">
                <el-option v-for="item in timeType" :key="item.valueNo" :label="item.valueName" :value="item.valueNo"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="持续时间(分)" prop="durationMinute" v-if="form.timeType === 0">
              <el-input class="filter-item" v-model="form.durationMinute"  placeholder="请输入持续时间(分)"></el-input>
              <span class="text">
                从领券的时间开始计算持续时间内有效
              </span>
            </el-form-item>
            <el-form-item label="有效时间" prop="validateAt" v-if="form.timeType === 1">
              <el-date-picker class="filter-item" v-model="form.validateAt"  type="datetime" placeholder="选择日期"></el-date-picker>
              <span class="text">
                优惠券截至时间
              </span>
            </el-form-item>
            <el-form-item label="持续天数" prop="durationDay" v-if="form.timeType === -2">
              <el-input class="filter-item" v-model="form.durationDay"  placeholder="请输入持续天数"></el-input>
              <span class="text">
                从车主领券之日开始计算(领券当日也算1日)
              </span>
            </el-form-item>
          </div>
          <el-form-item label="备注信息">
            <el-input class="filter-item" type="textarea"  v-model="form.consume"  placeholder="请输入备注信息"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button :loading = "createLoading" v-if="dialogStatus ==='create'" type="primary" @click="createData">保存</el-button>
          <el-button :loading = "updateLoading" v-else type="primary" @click="updateData">修改</el-button>
        </div>
      </el-dialog>
      <!-- 扫码提示信息 -->
      <el-dialog title="车牌输入"  :visible.sync="dialogPlateVisible">
        <el-form label-position="right" label-width="80px" >
          <el-form-item label="车牌号码">
            <el-autocomplete v-model="plate" :fetch-suggestions="querySearch" placeholder="车牌号码"></el-autocomplete>
          </el-form-item>
          <el-form-item label="备注信息">
            <el-input v-model="comment" type="text" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="bindPlate">绑定</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
      <el-dialog title="二维码"  :visible.sync="dialogQRVisible">
        <div style="margin-top: 20px;" id="qrcode" ref="qrcode"></div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
// import { ticketRulesData } from '@/Mock'
import QRcode from 'qrcodejs2'
import { isTicketPer, ticketTypeFormatter, timeTypeFormatter, moneyFormatter, isShowColumnFormatter } from '@/utils/formatter.js'
import { ticketType, timeType, plateType } from '@/utils/selectAble.js'
import { checkNumber, checkTimeToMoney, checkDiscount } from '@/utils/validator.js'
import { qrCodeWebSocket } from '@/api/websocket.js'
import { httpGet, httpDelete, httpPost, httpPut } from '@/utils/restful'
import { getTicketRules, TicketRules, getTicketRulesPer, erCodeOne, staticErCode, moveErCode, plateInset } from '@/api/url'
export default {
  data () {
    return {
      listLoading: true,
      createLoading: false,
      deleteLoading: false,
      updateLoading: false,
      listQuery: {
        offset: 1,
        limit: 10,
        name: undefined,
        type: undefined,
        timeType: undefined
      },
      tableData: [],
      plate: '',
      comment: undefined,
      plateType: plateType,
      ticketTypeFormatter: ticketTypeFormatter,
      timeTypeFormatter: timeTypeFormatter,
      isShowColumnFormatter: isShowColumnFormatter,
      isTicketPer: isTicketPer,
      moneyFormatter: moneyFormatter,
      ticketType: ticketType,
      timeType: timeType,
      dialogFormVisible: false,
      dialogQRVisible: false,
      dialogPlateVisible: false,
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
        name: undefined,
        number: undefined,
        type: undefined,
        discount: undefined,
        subFee: undefined,
        subTime: undefined,
        timeType: undefined,
        durationMinute: undefined,
        validateAt: undefined,
        durationDay: undefined,
        consume: undefined
        // maxDiscountMoney: undefined
      },
      formRules: {
        name: [
          {required: true, trigger: 'blur', message: '优惠券名称不可为空'}
        ],
        type: [
          {required: true, trigger: 'change', message: '请选择'}
        ],
        number: [
          {required: true, trigger: 'blur', message: '不可为空'},
          {validator: checkNumber, trigger: 'blur'}
        ],
        discount: [
          {required: true, trigger: 'blur', message: '折扣率不可为空'},
          {validator: checkDiscount, trigger: 'blur'}
        ],
        subFee: [
          {required: true, trigger: 'blur', message: '减免金额不可为空'},
          {validator: checkTimeToMoney, trigger: 'blur'}
        ],
        subTime: [
          {required: true, trigger: 'blur', message: '减免时间不可为空'},
          {validator: checkNumber, trigger: 'blur'}
        ],
        timeType: [
          {required: true, trigger: 'blur', message: '请选择'}
        ],
        // maxDiscountMoney: [
        //   {required: true, trigger: 'blur', message: '最大抵扣金额不可为空'}
        // ],
        durationMinute: [
          {required: true, trigger: 'blur', message: '持续时间不可为空'},
          {validator: checkNumber, trigger: 'blur'}
        ],
        validateAt: [
          {required: true, trigger: 'change', message: '请选择'}
        ],
        durationDay: [
          {required: true, trigger: 'blur', message: '持续天数不可为空'},
          {validator: checkNumber, trigger: 'blur'}
        ],
        consume: [
          {required: true, trigger: 'blur', message: '备注信息不可为空'}
        ]
      },
      rowId: 0,
      activeName: 'second',
      codeUrl: '',
      ws: null,
      formNumber: {
        number: undefined,
        restNumber: undefined
      },
      permission: [],
      jsonData: [
        {
          title: '优惠券名称',
          key: 'name',
          type: 'text'
        },
        {
          title: '优惠券类型',
          key: 'type',
          type: 'text'
        },
        {
          title: '减免金额',
          key: 'subFee',
          type: 'text'
        },
        {
          title: '折扣率',
          key: 'discount',
          type: 'text'
        },
        {
          title: '减免时长',
          key: 'subTime',
          type: 'text'
        },
        {
          title: '总券数',
          key: 'number',
          type: 'text'
        },
        {
          title: '剩余券数',
          key: 'restNumber',
          type: 'text'
        },
        {
          title: '备注信息',
          key: 'consume',
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
    this.getPermission()
  },
  methods: {
    handleh () {
      let obj = JSON.parse(JSON.stringify(this.tableData))
      obj.forEach((item, index) => {
        item.type = this.ticketTypeFormatter(item.type)
        item.subFee = this.moneyFormatter(item.subFee)
        item.number = parseInt(item.number) === 9999 ? '不限' : item.number
        item.restNumber = parseInt(item.restNumber) === 9999 ? '不限' : item.restNumber
        // item.type = this.ticketTypeFormatter(item.type)
        // item.type = this.ticketTypeFormatter(item.type)
        // item.type = this.ticketTypeFormatter(item.type)
      })
      this.table2excel(this.jsonData, obj, 'excel.xlsx')
    },
    getPermission () {
      httpGet(getTicketRulesPer + this.$store.getters.departmentId)
        .then(res => {
          // console.log('接受数据。。。', res)

          this.permission = res.data
          this.fetchData()
          // this.websocket()
        }).catch(() => {})
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
    // 刷新
    handleRefresh () {
      this.listQuery = {
        offset: 1,
        limit: 10,
        name: undefined,
        type: undefined,
        timeType: undefined
      }
      this.fetchData()
    },
    fetchData () {
      this.listQuery = Object.assign(this.listQuery, {shopId: this.$store.getters.departmentId})
      httpGet(getTicketRules, this.listQuery).then(res => {
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
        name: undefined,
        type: undefined,
        number: undefined,
        discount: undefined,
        subFee: undefined,
        subTime: undefined,
        timeType: undefined,
        durationMinute: undefined,
        validateAt: undefined,
        durationDay: undefined,
        consume: undefined
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
      this.resetForm()
      this.form = {
        id: row.id,
        name: row.name,
        consume: row.consume,
        number: row.number
      }
      this.formNumber = {
        number: row.number,
        restNumber: row.restNumber
      }
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
          this.form = Object.assign(this.form, {shopId: this.$store.getters.departmentId})
          httpPost(TicketRules, this.form).then((res) => {
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
      if (this.form.number < this.formNumber.number - this.formNumber.restNumber) {
        this.$message.error('优惠券数量必大于当前数量减去剩余数量的差值')
      } else {
        this.$refs.dataform.validate((valid) => {
          if (valid) {
            this.updateLoading = true
            const updateFormData = Object.assign({}, this.form)
            httpPut(TicketRules, updateFormData).then(res => {
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
      }
    },
    // 删除选中
    handleDelete () {
      this.$confirm('确认提交吗？', '提示', {})
        .then(() => {
          this.deleteLoading = true
          httpDelete(TicketRules, {ids: this.selectArrayId}).then(res => {
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
    // 车牌输入
    handlePlate (row) {
      this.rowId = row.id
      this.plate = ''
      this.dialogPlateVisible = true
    },
    bindPlate () {
      const normalPlate = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳]{1}$/
      const newPlate = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}(([0-9]{5}[DF]$)|([DF][A-HJ-NP-Z0-9][0-9]{4}$))/
      if (this.plate === '') {
        this.$message.error('车牌不可为空')
      } else if (!(normalPlate.test(this.plate) || newPlate.test(this.plate))) {
        this.$message.warning('请输入正确的车牌号')
      } else {
        let data = {
          type: 'INPUT',
          code: this.rowId,
          plate: this.plate,
          comment: this.comment
        }
        httpPost(plateInset, data)
          .then(res => {
            this.dialogPlateVisible = false
            this.$message.success(res.message)
          }).catch(() => {})
      }
    },
    isOldHost (url) {
      /** ********  【 检查后端返回接口地址是否是原来的 】  **********/
      let parkHost = /^http[s]?:\/\/www\.cytingchechang\.com/
      let testHost = /^http[s]?:\/\/beta\.cytingchechang\.com/
      let parkIp = /^http:\/\/112\.74\.50\.105/
      let CparkHost = 'https://www.cytingchechang.com'
      let CtestHost = 'http://47.106.35.188'
      let getHost = null
      if (parkHost.test(url)) {
        getHost = url.replace(parkHost, CparkHost)
      } else if (testHost.test(url)) {
        getHost = url.replace(testHost, CtestHost)
      } else if (parkIp.test(url)) {
        getHost = url.replace(parkIp, CparkHost)
      } else {
        getHost = url
      }
      return getHost
    },
    // 生成静态二维码
    erCodeStatic (row) {
      httpGet(staticErCode + row.id)
        .then(res => {
          // console.log('查看验证码信息；', res, '接口', staticErCode)

          if (res.data === null || res.data.ercode === null) {
            this.$message.warning('暂无二维码')
          } else {
            this.dialogQRVisible = true
            this.$nextTick(() => {
              let QrCodeHTML = this.$refs.qrcode
              QrCodeHTML.innerHTML = ' '
              this.createQrCode()

              // 新修改
              this.codeUrl = this.isOldHost(res.data.ercode)
              console.log('新修改生成静态二维码。。', this.codeUrl)

              // 原来的
              // this.codeUrl = res.data.ercode
              this.createCode.clear()
              this.createCode.makeCode(this.codeUrl)
            })
          }
        }).catch(() => {})
    },
    // 生成二维码
    createQrCode () {
      this.createCode = new QRcode('qrcode', {
        text: this.codeUrl,
        width: 300,
        height: 300
      })
    },
    // 生成单次码
    erCodeOne (row) {
      httpGet(erCodeOne + row.id)
        .then(res => {
          if (res.data === null || res.data.ercode === null) {
            this.$message.warning('暂无二维码')
          } else {
            this.dialogQRVisible = true
            this.$nextTick(() => {
              let QrCodeHTML = this.$refs.qrcode
              QrCodeHTML.innerHTML = ' '
              this.createQrCode()
              // 新修改
              this.codeUrl = this.isOldHost(res.data.ercode)
              // 原来
              // this.codeUrl = res.data.ercode
              console.log(' 新修改生成单次码', this.codeUrl)
              this.createCode.clear()
              this.createCode.makeCode(this.codeUrl)
            })
          }
        }).catch(() => {})
    },
    // -------------------------websocket -------------------------- \\
    websocket () {
      // 检查浏var ws;览器是否支持WebSocket
      if (window.WebSocket) {
        if (this.ws !== null) {
          this.ws.close()
        }
        let time = new Date().getTime()
        this.ws = new WebSocket(qrCodeWebSocket + this.rowId + '-' + time)
        // console.log('优惠券websocket', qrCodeWebSocket)

        // 连接websocket
        this.ws.onopen = this.initWebSocket(time)
        this.ws.onmessage = this.onmessageWebSocket
        // 链接失败
        this.ws.onerror = this.onerrorWebSocket
      } else {
        this.$message({
          message: '您的浏览器暂时不支持实时下载结果展示，可尝试换浏览器!',
          type: 'error',
          duration: 4 * 1000
        })
      }
    },
    initWebSocket (time) {
      setTimeout(() => {
        // console.log('请求websocket：', moveErCode + this.rowId + '/' + time)

        httpGet(moveErCode + this.rowId + '/' + time)
          .then(res => {
            this.dialogQRVisible = true
            this.$nextTick(() => {
              let QrCodeHTML = this.$refs.qrcode
              QrCodeHTML.innerHTML = ' '
              this.createQrCode()
            })
          }).catch((err) => {
            console.log('websocket链接错误：', err)
          })
      }, 1000)
    },
    // 接收消息
    onmessageWebSocket (evt) {
      let data = JSON.parse(evt.data)
      // console.log('websocket: ', data)

      // this.codeUrl = data.ercode
      this.codeUrl = this.isOldHost(data.ercode) // 新配置
      this.createCode.clear()
      this.createCode.makeCode(this.codeUrl)
    },
    // 链接失败
    onerrorWebSocket (e) {
      // console.log('websocket链接失败：', e)

      this.$message({
        message: '无法实时显示下载信息！',
        type: 'error',
        duration: 4 * 1000
      })
    },
    // 生成动态码
    erCodeMove (row) {
      this.rowId = row.id
      this.websocket()
    }
  },
  destroyed () {
    if (this.ws !== null) {
      this.ws.close()
    }
  }
}
</script>
<style lang="scss" scoped>
.el-input{
    width: auto;
}
.text{
    color: #e93434;
}
</style>

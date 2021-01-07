<template>
  <div class="app-container">
    <!-- 操作 -->
    <el-tabs type="border-card" v-model="activeName">
      <el-tab-pane label="已统计" name="first">
        <div class="filter-container">
          <el-input v-model = "listQuery.localId" class="filter-item" clearable style="width:200px" placeholder="订单号"></el-input>
          <el-input v-model = "listQuery.roadIdIn" class="filter-item" clearable style="width:200px" placeholder="入场通道"></el-input>
          <el-input v-model = "listQuery.roadIdOut" class="filter-item" clearable style="width:200px" placeholder="出场通道"></el-input>
          <el-select class="filter-item" v-model="listQuery.carType" placeholder="请选择车辆类型">
            <el-option
              v-for="item in carTypeList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-autocomplete clearable class="filter-item" style="width: 200px;" v-model="listQuery.plate" :fetch-suggestions="querySearch" placeholder="车牌号"></el-autocomplete>
          <el-date-picker
            class="filter-item"
            v-model="time"
            type="datetimerange"
            style="padding:0 15px;"
            value-format = "yyyy-MM-dd HH:mm:ss"
            :default-time="['00:00:00', '23:59:59']"
            range-separator="至"
            start-placeholder="开始日期"
            @change="changeTime"
            end-placeholder="结束日期">
          </el-date-picker>
          <el-button class="filter-item" :disabled="filterDisabled" type="primary" @click="handleFilter" icon="el-icon-search">搜索</el-button>
          <el-button class="filter-item" type="primary" v-has="['导出']"  @click="handleExport" icon="el-icon-download">导出</el-button>
          <el-button class="filter-item" type="primary" @click="handleRefresh" icon="el-icon-refresh">刷新</el-button>
        </div>
        <el-table :header-cell-style="{background:'#f3f4f6'}" style="width: 100%" :summary-method="getSummaries" show-summary max-height="600" :data="tableData" v-loading.body="listLoading" element-loading-text="加载中..." border fit highlight-current-row stripe>
        <el-table-column label="订单编号" align="center" prop="localId" width="180" v-if = "!isShowColumnFormatter(['屏蔽金额字段'])"></el-table-column>
        <el-table-column label="应收金额" align="center" prop="receiveFee" width="100" v-if = "!isShowColumnFormatter(['屏蔽金额字段'])">
          <template slot-scope="scope">
            {{moneyInOutFormatter(scope.row.receiveFee)}}
          </template>
        </el-table-column>
        <el-table-column label="实收金额" align="center" prop="realFee" width="100" v-if = "!isShowColumnFormatter(['屏蔽金额字段'])">
          <template slot-scope="scope">
            {{moneyInOutFormatter(scope.row.realFee)}}
          </template>
        </el-table-column>
        <el-table-column label="现金金额" align="center" prop="cashPay" width="100" v-if = "!isShowColumnFormatter(['屏蔽金额字段'])">
          <template slot-scope="scope">
            {{moneyInOutFormatter(scope.row.cashPay)}}
          </template>
        </el-table-column>
        <el-table-column label="车主优惠" align="center" prop="ticketPay" width="100" v-if = "!isShowColumnFormatter(['屏蔽金额字段'])">
          <template slot-scope="scope">
            {{moneyInOutFormatter(scope.row.ticketPay)}}
          </template>
        </el-table-column>
        <el-table-column label="商家优惠" align="center" prop="ticketPayReal" width="100" v-if = "!isShowColumnFormatter(['屏蔽金额字段'])">
          <template slot-scope="scope">
            {{moneyInOutFormatter(scope.row.ticketPayReal)}}
          </template>
        </el-table-column>
        <el-table-column label="本地优惠" align="center" prop="nativeTicket" width="" v-if = "!isShowColumnFormatter(['屏蔽金额字段'])">
          <template slot-scope="scope">
            {{moneyInOutFormatter(scope.row.nativeTicket)}}
          </template>
        </el-table-column>
        <el-table-column label="电子支付" align="center" width="100" prop="electronicPrepay" v-if = "!isShowColumnFormatter(['屏蔽金额字段'])">
          <template slot-scope="scope">
            {{moneyInOutFormatter(scope.row.electronicPrepay)}}
          </template>
        </el-table-column>
        <el-table-column label="车牌号码" align="center" prop="plateOut" width="100"></el-table-column>
        <el-table-column label="入场通道" align="center" prop="roadIdIn" width="100">
          <template slot-scope="scope">
            <span v-if="scope.row.roadIdIn">{{scope.row.roadIdIn}}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column label="出场通道" align="center" prop="roadIdOut" width="100">
          <template slot-scope="scope">
            <span v-if="scope.row.roadIdOut">{{scope.row.roadIdOut}}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column label="车主姓名" align="center" prop="carOwner" width="100">
          <template slot-scope="scope">
            <span v-if="scope.row.carOwner">{{scope.row.carOwner}}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column label="车辆类型" align="center" prop="carType" width="100">
          <template slot-scope="scope">
            {{inOutCarFormatter(scope.row.carType)}}
          </template>
        </el-table-column>
        <el-table-column label="停车时长" align="center" prop="ioTime" width="100"></el-table-column>
        <el-table-column label="入场图片" align="center" prop="picIn" width="100">
          <template slot-scope="scope">
            <el-button v-if="scope.row.picIn" type="primary" @click.native.prevent="handleImage(scope.row, 0)" size="mini">获取图片</el-button>
          </template>
        </el-table-column>
        <el-table-column label="出场图片" align="center" prop="picOut"  width="100">
          <template slot-scope="scope">
            <el-button v-if="scope.row.picOut" type="primary" @click.native.prevent="handleImage(scope.row, 1)" size="mini">获取图片</el-button>
          </template>
        </el-table-column>
        <el-table-column label="进场时间" align="center" prop="ioTimeIn" width="160">
          <template slot-scope="scope">
            {{timeFormatter(scope.row.ioTimeIn)}}
          </template>
        </el-table-column>
        <el-table-column label="出场时间" align="center" prop="ioTimeOut" width="160">
          <template slot-scope="scope">
            {{timeFormatter(scope.row.ioTimeOut)}}
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作"  align="center" class-name="small-padding fixed-width" width="150"  v-if = "isShowColumnFormatter(['详情'])">
          <template slot-scope="scope">
            <el-button type="primary"  @click.native.prevent="handleDetail(scope.row)" size="mini">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="pagination-container">
      <el-pagination background  :page-sizes="[10,20,30, 50]" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.offset " :page-size="listQuery.limit" :total="total" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
      </div>
      <div v-if = "!isShowColumnFormatter(['屏蔽金额字段'])">
        <el-tag style="font-size:15px;margin:20px 10px" type="success">实收 = 现金 + 电子</el-tag>
        <el-tag style="font-size:15px;margin:20px 10px" type="info">优惠 = 车主优惠 + 本地优惠</el-tag>
        <el-tag style="font-size:15px;margin:20px 10px" type="danger">应收 ＝ 实收 ＋ 优惠</el-tag>
      </div>
      </el-tab-pane>
      <el-tab-pane label="未统计电子订单" name="second" v-if = "isShowColumnFormatter(['临时订单'])">
        <div class="filter-container">
          <el-date-picker
            class="filter-item"
            v-model="time"
            type="datetimerange"
            style="padding:0 15px;"
            value-format = "yyyy-MM-dd HH:mm:ss"
            :default-time="['00:00:00', '23:59:59']"
            range-separator="至"
            start-placeholder="开始日期"
            @change="changeTime1"
            end-placeholder="结束日期">
          </el-date-picker>
          <el-button class="filter-item" :disabled="filterDisabled1" type="primary" @click="handleFilter1" icon="el-icon-search">搜索</el-button>
          <el-button class="filter-item" type="primary" @click="handleRefresh1" icon="el-icon-refresh">刷新</el-button>
        </div>
        <el-tag style="margin-bottom: 10px">温馨提示：此处订单在非人为干涉的情况下,会在支付成功自动开闸放行后进行自动结算,视网络状况,直付订单可能会短暂停留,通常只会显示预付订单</el-tag>
        <el-tag style="margin-bottom: 10px">温馨提示2：出场后才付的钱不会自动统计</el-tag>
        <el-table :header-cell-style="{background:'#f3f4f6'}" style="width: 100%" :summary-method="getSummariesOrder" show-summary max-height="600" :data="paramsData" v-loading.body="listOrderLoading" element-loading-text="加载中..." border fit highlight-current-row>
          <el-table-column label="订单编号" align="center" prop="localId"></el-table-column>
          <el-table-column label="支付订单号" align="center" prop="payNo"></el-table-column>
          <el-table-column label="车牌号码" align="center" prop="plate"></el-table-column>
          <el-table-column label="应收金额" align="center" prop="receiveFee" width="100">
            <template slot-scope="scope">
              {{moneyInOutFormatter(scope.row.receiveFee)}}
            </template>
          </el-table-column>
          <el-table-column label="实收金额" align="center" prop="realFee" width="100">
            <template slot-scope="scope">
              {{moneyInOutFormatter(scope.row.realFee)}}
            </template>
          </el-table-column>
          <el-table-column label="车主优惠" align="center" prop="ticketPay" width="100">
            <template slot-scope="scope">
              {{moneyInOutFormatter(scope.row.ticketPay)}}
            </template>
          </el-table-column>
          <el-table-column label="商家优惠" align="center" prop="ticketPayReal" width="100">
            <template slot-scope="scope">
              {{moneyInOutFormatter(scope.row.ticketPayReal)}}
            </template>
          </el-table-column>
          <el-table-column label="电子支付" align="center" prop="electronicPrepay" width="100">
            <template slot-scope="scope">
              {{moneyInOutFormatter(scope.row.electronicPrepay)}}
            </template>
          </el-table-column>
          <el-table-column  prop="paySence" align="center" label="支付场景">
            <template slot-scope="scope">
              {{paySenceFormatter(scope.row.paySence)}}
            </template>
          </el-table-column>
          <!-- <el-table-column  prop="payType" align="center" label="支付类型">
            <template slot-scope="scope">
              {{payTypeFormatter(scope.row.payType)}}
            </template>
          </el-table-column> -->
          <el-table-column  prop="payTime" align="center" label="支付时间">
            <template slot-scope="scope">
              {{timeFormatter(scope.row.payTime)}}
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination-container">
          <el-pagination
          background
          :page-sizes="[10,20,30, 50]"
          @size-change="handleSizeChangeOrder"
          @current-change="handleCurrentChangeOrder"
          :current-page="dataForm.offset "
          :page-size="dataForm.limit"
          :total="total1"
          layout="total, sizes, prev, pager, next, jumper"></el-pagination>
        </div>
      </el-tab-pane>
    </el-tabs>
    <!-- 订单详情 -->
    <el-dialog title="详情" :visible.sync="dialogVisible">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-card class="box-card">
            <div slot="header" style="font-size: 16px;">
              订单详情
            </div>
            <!-- 详情 -->
            <el-row  class="text">
              <el-col :span="6">订单编号</el-col>
              <el-col :span="18">{{order.localId}}</el-col>
            </el-row>
            <el-row  class="text">
              <el-col :span="6">应收金额</el-col>
              <el-col :span="6">{{order.receiveFee}}元</el-col>
              <el-col :span="6">实收金额</el-col>
              <el-col :span="6">{{order.realFee}}元</el-col>
            </el-row>
            <el-row  class="text">
              <el-col :span="6">电子支付</el-col>
              <el-col :span="6">{{order.electronicPrepay}}元</el-col>
              <el-col :span="6">现金金额</el-col>
              <el-col :span="6">{{order.cashPay}}元</el-col>
            </el-row>
            <el-row class="text">
              <el-col :span="6">车主优惠</el-col>
              <el-col :span="6">{{order.ticketPay}}元</el-col>
              <el-col :span="6">商家优惠</el-col>
              <el-col :span="6">{{order.ticketPayReal}}元</el-col>
            </el-row>
            <el-row  class="text">
              <el-col :span="6">本地优惠</el-col>
              <el-col :span="6">{{order.nativeTicket}}元</el-col>
              <el-col :span="6">支付次数</el-col>
              <el-col :span="6">{{order.payTimes === null ? 0 : order.payTimes}}次</el-col>
            </el-row>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card class="box-card">
            <div slot="header" style="font-size: 16px;">
              进出详情
            </div>
            <!-- 详情 -->
            <el-row  class="text">
              <el-col :span="6">订单编号</el-col>
              <el-col :span="18">{{inOutDetail.localId}}</el-col>
            </el-row>
            <el-row  class="text">
              <el-col :span="6">车牌号</el-col>
              <el-col :span="6">{{inOutDetail.plateIn}}</el-col>
              <el-col :span="6">车类型</el-col>
              <el-col :span="6">{{inOutCarFormatter(inOutDetail.carType)}}</el-col>
            </el-row>
            <el-row  class="text">
              <el-col :span="6">入场通道</el-col>
              <el-col :span="18">{{inOutDetail.roadIdIn}}</el-col>
            </el-row>
            <el-row  class="text">
              <el-col :span="6">出场通道</el-col>
              <el-col :span="18">{{inOutDetail.roadIdOut}}</el-col>
            </el-row>
            <el-row  class="text">
              <el-col :span="6">入场时间</el-col>
              <el-col :span="18">{{timeFormatter(inOutDetail.ioTimeIn)}}</el-col>
            </el-row>
            <el-row  class="text">
              <el-col :span="6">出场时间</el-col>
              <el-col :span="18">{{timeFormatter(inOutDetail.ioTimeOut)}}</el-col>
            </el-row>
              <el-row class="text">
              <el-col :span="6">入场收费员</el-col>
              <el-col :span="6">{{inOutDetail.uinIn}}</el-col>
              <el-col :span="6">出场收费员</el-col>
              <el-col :span="6">{{inOutDetail.uinOut}}</el-col>
            </el-row>
          </el-card>
        </el-col>
      </el-row>
      <el-row :gutter="20" style="margin-top:20px;">
        <el-card class="box-card">
          <div slot="header" style="font-size: 16px;">
            出入场详情列表
          </div>
          <!-- 详情 -->
          <div>
            <el-table :header-cell-style="{background:'#f3f4f6'}" :data="tableDetailDatas" style="width: 100%">
              <el-table-column type="expand">
                <template slot-scope="props">
                  <el-form label-position="left" inline class="table-expand">
                    <el-form-item label="支付场景">
                      <span>{{ paySenceFormatter(props.row.paySence) }}</span>
                    </el-form-item>
                    <el-form-item label="支付类型">
                      <span>{{ payTypeFormatter(props.row.payType) }}</span>
                    </el-form-item>
                    <el-form-item label="电子支付">
                      <span>{{ moneyInOutFormatter(props.row.electronicPrepay) }}</span>
                    </el-form-item>
                    <el-form-item label="现金金额">
                      <span>{{ moneyInOutFormatter(props.row.cashPay) }}</span>
                    </el-form-item>
                    <el-form-item label="车主优惠">
                      <span>{{ moneyInOutFormatter(props.row.ticketPay) }}</span>
                    </el-form-item>
                    <el-form-item label="商家优惠">
                      <span>{{ moneyInOutFormatter(props.row.ticketPayReal) }}</span>
                    </el-form-item>
                      <el-form-item label="本地优惠">
                      <span>{{ moneyInOutFormatter(props.row.nativeTicket) }}</span>
                    </el-form-item>
                  </el-form>
                </template>
              </el-table-column>
              <el-table-column  prop="receiveFee" label="应收金额">
                <template slot-scope="scope">
                  {{moneyInOutFormatter(scope.row.receiveFee)}}
                </template>
              </el-table-column>
              <el-table-column  prop="realFee" label="实收金额">
                <template slot-scope="scope">
                  {{moneyInOutFormatter(scope.row.realFee)}}
                </template>
              </el-table-column>
              <el-table-column  prop="status" label="状态">
                <template slot-scope="scope">
                  {{payStatusFormatter(scope.row.status)}}
                </template>
              </el-table-column>
              <el-table-column  prop="payTime" label="支付时间">
                <template slot-scope="scope">
                  {{timeFormatter(scope.row.payTime)}}
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-card>
      </el-row>
    </el-dialog>
    <el-dialog :visible.sync="dialogFormImage" width="800px" :close-on-click-modal="false">
        <div  style="height:400px;background-size:100% 100%;display: flex;justify-content: center;align-items: center;" :style= "{backgroundImage: 'url(' + picUrl + ')'}">
          <canvas  id="line"></canvas>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormImage = false">返回</el-button>
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
</template>

<script>
import { isShowColumnFormatter, inOutCarFormatter, timeFormatter, moneyInOutFormatter, moneyFormatter, timeFormatterSort, payStatusFormatter, payTypeFormatter, payChannelFormatter, paySenceFormatter } from '@/utils/formatter.js'
import { plateType } from '@/utils/selectAble.js'
import { getInOutCount, getPage, getInOut, getInOutDetail, exportInOut, getImage, getPageCount } from '@/api/url' // , getPageOrder,
import { httpGet, httpExport } from '@/utils/restful'

export default {
  data () {
    return {
      carType: '', // 选择器选择的车辆类型
      carTypeList: [
        {
          value: '',
          label: '请选择'
        },
        {
          value: 0,
          label: '固定车'
        }, {
          value: 1,
          label: '免费车'
        }, {
          value: 2,
          label: '临时车'
        }, {
          value: 3,
          label: '特殊车'
        }
      ], //
      time: [],
      time1: [],
      activeName: 'first',
      filterDisabled: false,
      filterDisabled1: false,
      dialogExportVisible: false,
      list: null,
      listLoading: true,
      listOrderLoading: true,
      timeFormatter: timeFormatter,
      dialogVisible: false,
      dialogFormImage: false,
      moneyInOutFormatter: moneyInOutFormatter,
      moneyFormatter: moneyFormatter,
      isShowColumnFormatter: isShowColumnFormatter,
      payStatusFormatter: payStatusFormatter,
      payTypeFormatter: payTypeFormatter,
      payChannelFormatter: payChannelFormatter,
      paySenceFormatter: paySenceFormatter,
      dataForm: {
        offset: 1,
        limit: 10,
        beginTime: undefined,
        endTime: undefined
      },
      total1: null,
      listQuery: {
        offset: 1,
        limit: 10,
        localId: undefined,
        beginTime: undefined,
        endTime: undefined,
        roadIdIn: undefined,
        roadIdOut: undefined,
        carType: undefined
      },
      tableData: [],
      paramsData: [],
      inOutCarFormatter: inOutCarFormatter,
      plateType: plateType,
      total: null,
      // 详情
      order: {},
      inOutDetail: {},
      tableDetailDatas: [],
      fullLoading: undefined,
      picUrl: '',
      numberList: [],
      exportLoading: false,
      exportForm: {
        number: 0
      },
      exportRules: {
        number: [
          {required: true, trigger: 'change', message: '不可为空'}
        ]
      },
      count: {
        sumReceiveFee: '-',
        sumRealFee: '-',
        sumCashPay: '-',
        sumTicketPay: '-',
        sumTicketPayReal: '-',
        sumNativeTicket: '-',
        sumElectronicPrepay: '-'
      },
      countOrder: {
        sumRealFee: '-',
        sumReceiveFee: '-',
        sumTicketPay: '-',
        sumTicketPayReal: '-',
        sumElectronicPrepay: '-'
      }
    }
  },
  created () {
    // 开始时间
    this.listQuery.beginTime = timeFormatterSort(new Date(new Date().setDate(1))) + ' 00:00:00'
    // 结束时间
    this.listQuery.endTime = timeFormatterSort(new Date()) + ' 23:59:59'
    this.time = [this.listQuery.beginTime, this.listQuery.endTime]
    // 开始时间
    this.dataForm.beginTime = timeFormatterSort(new Date(new Date().setDate(1))) + ' 00:00:00'
    // 结束时间
    this.dataForm.endTime = timeFormatterSort(new Date()) + ' 23:59:59'
    // this.time = [this.listQuery.beginTime, this.listQuery.endTime]
  },
  mounted () {
    this.fetchData()
    this.getData()
  },
  methods: {
    // 获取统计记录 count
    getInOutCountOrder () {
      this.dataForm = Object.assign(this.dataForm, {departmentId: this.$store.getters.departmentId})
      httpGet(getPageCount, this.dataForm)
        .then(res => {
          // console.log(res)
          this.countOrder = {
            sumRealFee: this.moneyFormatter(res.data.realFee),
            sumReceiveFee: this.moneyFormatter(res.data.receiveFee),
            sumTicketPay: this.moneyFormatter(res.data.ticketPay),
            sumTicketPayReal: this.moneyFormatter(res.data.ticketPayReal),
            sumElectronicPrepay: this.moneyFormatter(res.data.electronicPrepay)
          }
        }).catch(() => {})
    },
    getInOutCount () {
      this.listQuery = Object.assign(this.listQuery, {departmentId: this.$store.getters.departmentId})
      httpGet(getInOutCount, this.listQuery)
        .then(res => {
          // console.log(res)
          this.count = {
            sumReceiveFee: this.moneyFormatter(res.data.sumReceiveFee),
            sumRealFee: this.moneyFormatter(res.data.sumRealFee),
            sumElectronicPrepay: this.moneyFormatter(res.data.sumElectronicPrepay),
            sumCashPay: this.moneyFormatter(res.data.sumCashPay),
            sumTicketPay: this.moneyFormatter(res.data.sumTicketPay),
            sumTicketPayReal: this.moneyFormatter(res.data.sumTicketPayReal),
            sumNativeTicket: this.moneyFormatter(res.data.sumNativeTicket)
          }
        }).catch(() => {})
    },
    getData () {
      if (this.isShowColumnFormatter(['临时订单'])) {
        let self = this
        this.dataForm = Object.assign(this.dataForm, {departmentId: this.$store.getters.departmentId})
        httpGet(getPage, this.dataForm)
          .then((res) => {
            if (res.data === null) {
              self.paramsData = []
              self.total1 = 0
              self.listOrderLoading = false
            } else {
              self.paramsData = res.data.rows
              self.total1 = res.data.total
              self.listOrderLoading = false
            }
            if (this.dataForm.offset === 1) {
              this.getInOutCountOrder()
            }
          }).catch(() => {
            self.listLoading = false
          })
      }
    },
    handleSizeChangeOrder (val) {
      this.dataForm.limit = val
      this.getData()
    },
    handleCurrentChangeOrder (val) {
      this.dataForm.offset = val
      this.getData()
    },
    // 合计
    getSummariesOrder (param) {
      const {columns} = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '总计'
        }
        // 应收金额
        if (index === 3 && column.label === '应收金额') {
          sums[index] = this.countOrder.sumReceiveFee
        }
        // 实收金额
        if (index === 4 && column.label === '实收金额') {
          sums[index] = this.countOrder.sumRealFee
        }
        // 车主优惠
        if (index === 5 && column.label === '车主优惠') {
          sums[index] = this.countOrder.sumTicketPay
        }
        // 商家优惠
        if (index === 6 && column.label === '商家优惠') {
          sums[index] = this.countOrder.sumTicketPayReal
        }
        // 电子支付
        if (index === 7 && column.label === '电子支付') {
          sums[index] = this.countOrder.sumElectronicPrepay
        }
      })
      return sums
    },
    // 合计
    getSummaries (param) {
      const {columns} = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '总计'
        }
        // 应收金额
        if (index === 1 && column.label === '应收金额') {
          sums[index] = this.count.sumReceiveFee
        }
        // 实收金额
        if (index === 2 && column.label === '实收金额') {
          sums[index] = this.count.sumRealFee
        }
        // 现金金额
        if (index === 3 && column.label === '现金金额') {
          sums[index] = this.count.sumCashPay
        }
        // 车主优惠
        if (index === 4 && column.label === '车主优惠') {
          sums[index] = this.count.sumTicketPay
        }
        // 商家优惠
        if (index === 5 && column.label === '商家优惠') {
          sums[index] = this.count.sumTicketPayReal
        }
        // 本地优惠
        if (index === 6 && column.label === '本地优惠') {
          sums[index] = this.count.sumNativeTicket
        }
        // 电子支付
        if (index === 7 && column.label === '电子支付') {
          sums[index] = this.count.sumElectronicPrepay
        }
      })
      return sums
    },
    // 监听搜索的时间
    changeTime (value) {
      if (value === null) {
        this.filterDisabled = true
      } else if (new Date(value[0]).getFullYear() === new Date(value[1]).getFullYear() && new Date(value[0]).getMonth() === new Date(value[1]).getMonth()) {
        this.listQuery.beginTime = value[0]
        this.listQuery.endTime = value[1]
        this.filterDisabled = false
      } else if (new Date(value[0]).getFullYear() && new Date(value[1]).getFullYear() && new Date(value[0]).getMonth() && new Date(value[1]).getMonth()) {
        this.listQuery.beginTime = value[0]
        this.listQuery.endTime = value[1]
        this.filterDisabled = false
      } else {
        this.filterDisabled = true
        this.time = [this.listQuery.beginTime, this.listQuery.endTime]
        // this.$message.error('请填写一个月内的时间段进行搜索')
        this.$message.error('请重新搜索')
      }
    },
    // 监听搜索的时间
    changeTime1 (value) {
      if (value === null) {
        this.filterDisabled1 = true
      } else if (new Date(value[0]).getFullYear() === new Date(value[1]).getFullYear() && new Date(value[0]).getMonth() === new Date(value[1]).getMonth()) {
        this.dataForm.beginTime = value[0]
        this.dataForm.endTime = value[1]
        this.filterDisabled1 = false
      } else if (new Date(value[0]).getFullYear() && new Date(value[1]).getFullYear() && new Date(value[0]).getMonth() && new Date(value[1]).getMonth()) {
        this.listQuery.beginTime = value[0]
        this.listQuery.endTime = value[1]
        this.filterDisabled = false
      } else {
        this.filterDisabled1 = true
        this.time1 = [this.dataForm.beginTime, this.dataForm.endTime]
        // this.$message.error('请填写一个月内的时间段进行搜索')
        this.$message.error('请重新搜索')
      }
    },
    // 刷新
    handleRefresh () {
      this.listQuery = {
        offset: 1,
        limit: 10,
        beginTime: timeFormatterSort(new Date(new Date().setDate(1))) + ' 00:00:00',
        endTime: timeFormatterSort(new Date()) + ' 23:59:59',
        localId: undefined,
        roadIdIn: undefined,
        roadIdOut: undefined
      }
      this.filterDisabled = false
      this.time = [this.listQuery.beginTime, this.listQuery.endTime]
      this.fetchData()
    },
    // 刷新
    handleRefresh1 () {
      this.dataForm = {
        offset: 1,
        limit: 10,
        beginTime: timeFormatterSort(new Date(new Date().setDate(1))) + ' 00:00:00',
        endTime: timeFormatterSort(new Date()) + ' 23:59:59'
      }
      this.filterDisabled1 = false
      this.time1 = [this.listQuery.beginTime, this.listQuery.endTime]
      this.getData()
    },
    // 获取数据
    fetchData () {
      let self = this
      this.listQuery = Object.assign(this.listQuery, {departmentId: this.$store.getters.departmentId})
      for (const v in this.listQuery) {
        if (this.listQuery[v] === '') this.listQuery[v] = undefined
      }
      httpGet(getInOut, this.listQuery).then(res => {
        if (res.data === null) {
          self.tableData = []
          self.total = 0
          self.listLoading = false
        } else {
          self.tableData = res.data.rows
          self.total = res.data.total
          self.listLoading = false
        }
        this.numberList = []
        for (let i = 0; i <= this.total / 5000; i++) {
          this.numberList.push({
            id: i,
            name: `从${i * 5000}到${(i + 1) * 5000}条`
          })
        }
        if (this.listQuery.offset === 1) {
          this.getInOutCount()
        }
      }).catch(() => {
        self.listLoading = false
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
    // 搜索
    handleFilter () {
      this.listQuery.offset = 1
      this.fetchData()
    },
    // 搜索
    handleFilter1 () {
      this.dataForm.offset = 1
      this.getData()
    },
    // 车牌号选择
    querySearch (queryString, cb) {
      let plate = this.plateType
      let results = queryString ? plate.filter(this.createFilter(queryString)) : plate
      cb(results)
    },
    createFilter (queryString) {
      return (plate) => {
        return (plate.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    handleDetail (row) {
      let data = {
        id: row.id,
        partitionAt: this.timeFormatter(row.partitionAt)
      }
      httpGet(getInOutDetail, data).then(res => {
        this.order = Object.assign({}, res.data.orderMergerDetail)
        this.inOutDetail = Object.assign({}, res.data.inOutDetail)
        res.data.orderDetailList === null ? this.tableDetailDatas = [] : this.tableDetailDatas = res.data.orderDetailList
        this.dialogVisible = true
      }).catch(() => {})
    },
    handleImage (row, type) {
      let data = {
        id: row.id,
        type: type,
        partitionAt: this.timeFormatter(row.partitionAt)
      }
      this.fullLoading = this.$loading({
        lock: true,
        text: '加载中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      httpGet(getImage, data).then(res => {
        if (res.data === null) {
          this.$message.error('获取失败')
        } else {
          this.picUrl = 'data:image/jpeg;base64,' + res.data
          this.dialogFormImage = true
        }
        this.fullLoading.close()
      }).catch(() => {
        this.fullLoading.close()
      })
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
          httpExport(exportInOut, data).then((res) => {
            this.dialogExportVisible = false
            setTimeout(() => { this.exportLoading = false }, 300)
            this.$message({
              message: res.message,
              type: 'success',
              duration: 4 * 1000
            })
          }).catch(() => {
            this.exportLoading = false
          })
        }
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
  .table-expand {
    font-size: 0;
    label {
      width: 90px;
      color: #99a9bf;
    }
    .el-form-item {
      margin-right: 0;
      margin-bottom: 0;
      width: 50%;
    }
  }
</style>

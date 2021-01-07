<template>
  <div class="app-container">
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
      <el-tab-pane label="移动流量卡" name="1">
        <PanelGroup :data="shareInfo"></PanelGroup>
        <div class="table-main">
          <div class="filter-container">
            <el-input  class="filter-item" style="width:150px;" v-model="listQuery.departmentName" clearable placeholder="部门名称"></el-input>
            <el-input  class="filter-item" style="width:150px;" v-model="listQuery.msisdn" clearable placeholder="卡号"></el-input>
            <el-input  class="filter-item" style="width:150px;" v-model="listQuery.iccid" clearable placeholder="识别码"></el-input>
            <el-input  class="filter-item" style="width:150px;" type="number" v-model="listQuery.restFlow" clearable placeholder="剩余流量不足"></el-input>
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
            <el-button class="filter-item" type="primary" @click="handleFilter" icon="el-icon-search">搜索</el-button>
            <el-button class="filter-item" type="primary" @click="handleRefresh" icon="el-icon-refresh">刷新</el-button>
            <el-button class="filter-item" type="primary" @click="handleBell(true)" icon="el-icon-bell">设置警示线</el-button>
            <el-button class="filter-item" type="primary" @click="handleh"  icon="el-icon-download" v-has="['导出']" >导出</el-button>
          </div>
          <el-table stripe :header-cell-style="{background:'#f3f4f6'}" style="width:100%" max-height="600" :data="tableData" v-loading.body="listLoading" :row-class-name="tableRowClassName" element-loading-text="加载中..." border fit highlight-current-row>
            <el-table-column label="部门名称" align="center" prop="departmentName"></el-table-column>
            <el-table-column label="卡号" align="center" prop="msisdn"></el-table-column>
            <el-table-column label="集成电路卡识别码" align="center" prop="iccid"></el-table-column>
            <el-table-column label="最后一次流量发生时间" align="center" prop="apnLastFlowTime">
              <template slot-scope="scope">
                {{timeFormatter(scope.row.apnLastFlowTime)}}
              </template>
            </el-table-column>
            <el-table-column label="到期时间" align="center" prop="pkgEfftDate">
              <template slot-scope="scope">
                {{timeFormatterSortAndText(scope.row.pkgEfftDate)}}
              </template>
            </el-table-column>
            <el-table-column label="套餐名称" align="center" prop="pkgName"></el-table-column>
            <el-table-column label="套餐总流量(Mb)" align="center" prop="pkgTotalFlow"></el-table-column>
            <el-table-column label="套餐剩余流量(Mb)" align="center" prop="pkgRestFlow">
              <template slot-scope="scope">
                {{numberFormatter(scope.row.pkgTotalFlow - scope.row.pkgUsedFlow - scope.row.apnUsedFlow)}}
              </template>
            </el-table-column>
            <el-table-column label="套餐已使用流量(Mb)" align="center" prop="pkgUsedFlow">
              <template slot-scope="scope">
                {{numberFormatter(scope.row.pkgUsedFlow + scope.row.apnUsedFlow)}}
              </template>
            </el-table-column>
            <el-table-column label="更新时间" align="center" prop="updateAt">
              <template slot-scope="scope">
                {{timeFormatter(scope.row.updateAt)}}
              </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作"  align="center" class-name="small-padding fixed-width" width="120">
              <template slot-scope="scope">
                <el-button v-if="scope.row.optType == 2" type="primary" @click="clickWebFun(scope.row, 1)" size="mini">停用网络功能</el-button>
                <el-button v-if="scope.row.optType == 1" type="primary" @click="clickWebFun(scope.row, 2)" size="mini">开启网络功能</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页 -->
          <div class="pagination-container">
            <el-pagination background  :page-sizes="[10,20,30,50]" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.offset " :page-size="listQuery.limit" :total="total" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
          </div>
          <el-dialog title="设置警示线" :visible.sync="dialogBellVisible">
            <el-form ref="bellForm" :rules="formRules" :model="bell" label-width="120px">
              <el-form-item label="到期时间"  prop="value">
                <el-tag type="warning">提醒线(天)</el-tag>
                <el-slider v-model="bell.warningDate" :min="0" :max="120" show-input></el-slider>
                <el-tag type="danger">警告线(天)</el-tag>
                <el-slider v-model="bell.dangerDate" :min="0" :max="120" show-input></el-slider>
              </el-form-item>
              <el-form-item label="剩余流量"  prop="value">
                <div class="block">
                  <el-tag type="warning">提醒线(Mb)</el-tag>
                  <el-slider v-model="bell.warningFlow" :min="-500" :max="500" :step="10" show-input></el-slider>
                  <el-tag type="danger">警告线(Mb)</el-tag>
                  <el-slider v-model="bell.dangerFlow" :min="-500" :max="500" :step="10" show-input></el-slider>
                </div>
              </el-form-item>
              <el-form-item label="场景" prop="scene" >
                <el-checkbox-group v-model="bell.scene" size="small">
                  <el-checkbox-button v-for="item in scene" :label="item.valueNo" :key="item.valueNo" border>{{item.valueName}}</el-checkbox-button>
                </el-checkbox-group>
              </el-form-item>
              <el-form-item label="时效" prop="prescription" >
                <el-checkbox-group v-model="bell.prescription" size="small">
                  <el-checkbox-button v-for="item in prescriptions" :label="item.valueNo" :key="item.valueNo" border>{{item.valueName}}</el-checkbox-button>
                </el-checkbox-group>
              </el-form-item>
              <el-form-item label="消息用户类型" prop="userType" >
                <el-checkbox-group v-model="bell.userType" size="small">
                  <el-checkbox-button v-for="item in userTypes" :label="item.valueNo" :key="item.valueNo" border>{{item.valueName}}</el-checkbox-button>
                </el-checkbox-group>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" :loading="submitLoading" @click="onSubmit">保存</el-button>
              </el-form-item>
            </el-form>
          </el-dialog>
        </div>
      </el-tab-pane>
      <el-tab-pane label="物联卡" name="2">
        <!-- <el-button class="filter-item" type="primary" :loading = "watchLoading" @click="getInfo" :disabled="disabled" icon="el-icon-seach">获取卡信息</el-button> -->
        <el-button class="filter-item" type="primary" @click="handleh1"  icon="el-icon-download"  style="margin-bottom:20px;" v-has="['导出']">导出</el-button>
         <el-table :header-cell-style="{background:'#f3f4f6'}" style="width: 100%" @selection-change="handleSelectionChange"  max-height="600" :data="idcardData" v-loading.body="listLoading" :row-class-name="tableRowClassName" element-loading-text="加载中..." border fit highlight-current-row>
            <!-- <el-table-column type="selection" width="40" fixed="left" ></el-table-column> -->
            <el-table-column label="卡序列号" align="center" prop="imsi"></el-table-column>
            <el-table-column label="卡号" align="center" prop="msisdn"></el-table-column>
            <el-table-column label="集成电路卡识别码" align="center" prop="iccid"></el-table-column>
             <el-table-column label="套餐" align="center" prop="custom_package_name"></el-table-column>
            <!-- <el-table-column label="卡序列号" align="center" prop="imsi"></el-table-column>
            <el-table-column label="卡号" align="center" prop="msisdn"></el-table-column>
            <el-table-column label="集成电路卡识别码" align="center" prop="iccid"></el-table-column> -->
            <el-table-column label="卡当前状态"  align="center" prop="flag">
              <template slot-scope="scope">
                {{filtersSelect(scope.row.flag)}}
              </template>
            </el-table-column>
            <el-table-column label="最大可用量" align="center" prop="max_usable"></el-table-column>
            <el-table-column label="月使用"  align="center" prop="monthly_already_usage"></el-table-column>
            <el-table-column label="月可用"  align="center" prop="monthly_can_usage"></el-table-column>
            <!-- <el-table-column label="套餐id"  align="center" prop="package_id"></el-table-column> -->
            <el-table-column label="剩可用周期"  align="center" prop="period_number"></el-table-column>
            <el-table-column label="当前周期开始"  align="center" prop="start_useing_time">
              <template slot-scope="scope">
                {{timeFormatter(scope.row.start_useing_time)}}
              </template>
            </el-table-column>
            <el-table-column label="记费开始"  align="center" prop="init_useing_time">
              <template slot-scope="scope">
                {{timeFormatter(scope.row.init_useing_time)}}
              </template>
            </el-table-column>
            <el-table-column label="卡到期"  align="center" prop="down_time">
              <template slot-scope="scope">
                {{timeFormatter(scope.row.down_time)}}
              </template>
            </el-table-column>
            <el-table-column label="备注" align="center" prop="note">
            </el-table-column>
            <el-table-column fixed="right" label="操作"  align="center" class-name="small-padding fixed-width" width="120">
              <template slot-scope="scope">
                <el-button type="primary" @click="getMeal(scope.row)" size="mini">获取套餐</el-button>
              </template>
            </el-table-column>
         </el-table>
         <el-dialog title="详细信息" :visible.sync="isDialog" width="70%">
           <el-table :header-cell-style="{background:'#f3f4f6'}" style="width: 100%" max-height="600" :data="detailsInfo" :row-class-name="tableRowClassName" element-loading-text="加载中..." border fit highlight-current-row>
            <el-table-column label="套餐" align="center" prop="custom_package_name"></el-table-column>
            <el-table-column label="卡序列号" align="center" prop="imsi"></el-table-column>
            <el-table-column label="卡号" align="center" prop="msisdn"></el-table-column>
            <el-table-column label="集成电路卡识别码" align="center" prop="iccid"></el-table-column>
            <el-table-column label="卡当前状态"  align="center" prop="flag">
              <template slot-scope="scope">
                {{filtersSelect(scope.row.flag)}}
              </template>
            </el-table-column>
            <el-table-column label="最大可用量" align="center" prop="max_usable"></el-table-column>
            <el-table-column label="月使用"  align="center" prop="monthly_already_usage"></el-table-column>
            <el-table-column label="月可用"  align="center" prop="monthly_can_usage"></el-table-column>
            <!-- <el-table-column label="套餐id"  align="center" prop="package_id"></el-table-column> -->
            <el-table-column label="剩可用周期"  align="center" prop="period_number"></el-table-column>
             <el-table-column label="记费开始"  align="center" prop="init_useing_time">
              <template slot-scope="scope">
                {{timeFormatter(scope.row.init_useing_time)}}
              </template>
            </el-table-column>
            <el-table-column label="卡到期时间"  align="center" prop="down_time">
              <template slot-scope="scope">
                {{timeFormatter(scope.row.down_time)}}
              </template>
            </el-table-column>
            <!-- <el-table-column label="开始时间"  align="center" prop="start_useing_time">
              <template slot-scope="scope">
                {{timeFormatter(scope.row.start_useing_time)}}
              </template>
            </el-table-column> -->
          </el-table>
        </el-dialog>
        <el-dialog title="套餐" :visible.sync="isMeal" width="60%">
          <el-table :header-cell-style="{background:'#f3f4f6'}" style="width:100%" max-height="600" :data="mealGroup" :row-class-name="tableRowClassName" element-loading-text="加载中..." border fit highlight-current-row>
            <el-table-column label="套餐名称" align="center" prop="package_name"></el-table-column>
            <el-table-column label="套餐价格" align="center" prop="renewals_price"></el-table-column>
            <el-table-column label="最小下单数" align="center" prop="minimum_period"></el-table-column>
          </el-table>
        </el-dialog>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import PanelGroup from './components/FlowPanelGroup'
import { timeFormatter, timeFormatterSort, numberFormatter } from '@/utils/formatter.js'
import { getDailyFlow, getAllcardData, getShareInfo, setFlowBell, getFlowBell, switchWeb, getIdcardInfo, getIdcardPack } from '@/api/url' // , getUserOfCards
import { scene, prescriptions, userTypes } from '@/utils/selectAble.js'
import { httpGet, httpPost } from '@/utils/restful'
export default {
  components: {
    PanelGroup
  },
  data () {
    return {
      listLoading: true,
      disabled: true,
      isMeal: false,
      isDialog: false,
      watchLoading: false,
      mealGroup: [],
      selectArrayId: [],
      activeName: '1',
      detailsInfo: [],
      listQuery: {
        offset: 1,
        limit: 10,
        departmentName: undefined,
        msisdn: undefined,
        iccid: undefined,
        restFlow: undefined,
        beginTime: undefined,
        endTime: undefined
      },
      timeFormatter: timeFormatter,
      timeFormatterSort: timeFormatterSort,
      numberFormatter: numberFormatter,
      tableData: [],
      idcardData: [],
      total: null,
      shareInfo: [],
      time: [],
      dialogBellVisible: false,
      submitLoading: false,
      switchLoading: false,
      bell: {
        departmentId: this.$store.getters.departmentId,
        dangerDate: 30,
        warningDate: 90,
        dangerFlow: 100,
        warningFlow: 300,
        scene: [1],
        prescription: [4],
        userType: [1]
      },
      scene: scene,
      prescriptions: prescriptions,
      userTypes: userTypes.slice(0, 3),
      formRules: {
        scene: [
          {required: true, trigger: 'blur', message: '不可为空'}
        ],
        prescription: [
          {required: true, trigger: 'blur', message: '不可为空'}
        ],
        userType: [
          {required: true, trigger: 'blur', message: '不可为空'}
        ]
      },
      jsonData: [
        {
          title: '部门名称',
          key: 'departmentName',
          type: 'text'
        },
        {
          title: '卡号',
          key: 'msisdn',
          type: 'text'
        },
        {
          title: '集成电路卡识别码',
          key: 'iccid',
          type: 'text'
        },
        {
          title: '最后一次流量发生时间',
          key: 'apnLastFlowTime',
          type: 'text'
        },
        {
          title: '到期时间',
          key: 'pkgEfftDate',
          type: 'text'
        },
        {
          title: '套餐名称',
          key: 'pkgName',
          type: 'text'
        },
        {
          title: '套餐总流量(Mb)',
          key: 'pkgTotalFlow',
          type: 'text'
        },
        {
          title: '套餐剩余流量(Mb)',
          key: 'pkgRestFlow',
          type: 'text'
        },
        {
          title: '套餐已使用流量(Mb)',
          key: 'pkgUsedFlow',
          type: 'text'
        },
        {
          title: '更新时间',
          key: 'updateAt',
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
      ],
      jsonData1: [
        {
          title: '卡序列号',
          key: 'imsi',
          type: 'text'
        },
        {
          title: '卡号',
          key: 'msisdn',
          type: 'text'
        },
        {
          title: '集成电路卡识别码',
          key: 'iccid',
          type: 'text'
        },
        {
          title: '套餐',
          key: 'custom_package_name',
          type: 'text'
        },
        {
          title: '卡当前状态',
          key: 'flag',
          type: 'text'
        },
        {
          title: '最大可用量',
          key: 'max_usable',
          type: 'text'
        },
        {
          title: '月使用',
          key: 'monthly_already_usage',
          type: 'text'
        },
        {
          title: '月可用',
          key: 'monthly_can_usage',
          type: 'text'
        },
        {
          title: '剩可用周期',
          key: 'period_number',
          type: 'text'
        },
        {
          title: '当前周期开始',
          key: 'start_useing_time',
          type: 'text'
        },
        {
          title: '记费开始',
          key: 'init_useing_time',
          type: 'text'
        },
        {
          title: '卡到期',
          key: 'down_time',
          type: 'text'
        },
        {
          title: '备注',
          key: 'note',
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
    this.listQuery.beginTime = timeFormatterSort(new Date(new Date().setDate(1))) + ' 00:00:00'
    this.listQuery.endTime = timeFormatterSort(new Date()) + ' 23:59:59'
    this.time = [this.listQuery.beginTime, this.listQuery.endTime]
    this.fetchData()
    this.handleBell(false)
    this.getCardInfo()
  },
  methods: {
    handleh () {
      let obj = JSON.parse(JSON.stringify(this.tableData))
      obj.forEach((item, index) => {
        item.apnLastFlowTime = this.timeFormatter(item.apnLastFlowTime)
        item.pkgEfftDate = this.timeFormatterSortAndText(item.pkgEfftDate)
        item.pkgRestFlow = this.numberFormatter(item.pkgTotalFlow - item.pkgUsedFlow - item.apnUsedFlow)
        item.pkgUsedFlow = this.numberFormatter(item.pkgUsedFlow + item.apnUsedFlow)
        item.updateAt = this.timeFormatter(item.updateAt)
      })
      this.table2excel(this.jsonData, obj, 'excel.xlsx')
    },
    handleh1 () {
      let obj = JSON.parse(JSON.stringify(this.idcardData))
      obj.forEach((item, index) => {
        item.flag = this.filtersSelect(item.flag)
        item.start_useing_time = this.timeFormatter(item.start_useing_time)
        item.init_useing_time = this.timeFormatter(item.init_useing_time)
        item.down_time = this.timeFormatter(item.down_time)
      })
      this.table2excel(this.jsonData1, obj, 'excel.xlsx')
    },
    filtersSelect (type) {
      if (type === 9) return '正常'
      if (type === 2) return '沉默期'
      if (type === 8) return '待激活'
      if (type === 4) return '停机'
      if (type === 5) return '断网'
      if (type === 99) return '已删除'
    },
    // 获取当前用户所有卡数据
    getCardInfo () {
      // httpPost(getUserOfCards)
      httpPost(getAllcardData)
        .then((res) => {
          console.log(res)
          this.idcardData = res.data.data.cards
        }).catch(() => {})
    },
    // 选中
    handleSelectionChange (val) {
      this.selectArrayId = []
      val.map(item => {
        this.selectArrayId.push(item.msisdn)
      })
      if (this.selectArrayId.length !== 0) {
        this.disabled = false
      } else {
        this.disabled = true
      }
    },
    // 获取卡信息
    getInfo () {
      this.isDialog = true
      let zhiyuCardinfoDto = {
        msisdns: this.selectArrayId
      }
      httpPost(getIdcardInfo, zhiyuCardinfoDto)
        .then((res) => {
          this.detailsInfo = res.data.data.cards
        }).catch(() => {})
    },
    // 获取套餐
    getMeal (item) {
      let zhiyuCardPackDto = {
        msisdn: item.msisdn
      }
      httpPost(getIdcardPack, zhiyuCardPackDto).then((res) => {
        console.log(res)
        this.mealGroup = res.data.package_info
        this.isMeal = true
      }).catch(() => {})
    },
    handleClick (tab, event) {
      if (tab.name === '2') {
        // this.getCardInfo()
      }
    },
    tableRowClassName ({row, rowIndex}) {
      let temp = row.pkgEfftDate
      let jgday = -1
      let index = 0
      while (jgday < 0) {
        temp = temp + 1000 * 60 * 60 * 24 * 365
        jgday = (temp - new Date().getTime()) / 1000 / 60 / 60 / 24
        if (index > 10) {
          break
        } else {
          index = index + 1
        }
      }
      if ((row.pkgTotalFlow - row.pkgUsedFlow - row.apnUsedFlow) < this.bell.dangerFlow || jgday < this.bell.dangerDate) {
        return 'danger-row'
      } else if ((row.pkgTotalFlow - row.pkgUsedFlow - row.apnUsedFlow) < this.bell.warningFlow || jgday < this.bell.warningDate) {
        return 'warning-row'
      }
      return ''
    },
    // 监听搜索的时间
    changeTime (value) {
      if (value !== null) {
        this.listQuery.beginTime = value[0]
        this.listQuery.endTime = value[1]
      }
    },
    // 格式化日期
    timeFormatterSortAndText (time) {
      let result = '-'
      if (time !== null) {
        let date = new Date(time)
        // let year = date.getFullYear()
        let month = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)
        let day = (date.getDate()) < 10 ? '0' + (date.getDate()) : (date.getDate())
        result = '每年' + month + '-' + day
      }
      return result
    },
    handleBell (isOpenDialog) {
      httpGet(getFlowBell + '/' + this.$store.getters.departmentId).then(res => {
        if (res.code === 1) {
          if (res.data) {
            this.bell = res.data
          }
          if (isOpenDialog) {
            this.dialogBellVisible = true
          }
        }
      }).catch(() => {
      })
    },
    handleRefresh () {
      this.listQuery = {
        offset: 1,
        limit: 10,
        msisdn: undefined,
        iccid: undefined,
        restFlow: undefined,
        beginTime: timeFormatterSort(new Date(new Date().setDate(1))) + ' 00:00:00',
        endTime: timeFormatterSort(new Date()) + ' 23:59:59'
      }
      this.time = [this.listQuery.beginTime, this.listQuery.endTime]
      this.fetchData()
    },
    fetchData () {
      this.listLoading = true
      httpGet(getDailyFlow, this.listQuery).then(res => {
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
      // 查询现有的流量套餐共享模式流量使用情况
      httpGet(getShareInfo, this.listQuery).then(res => {
        this.shareInfo = res.data
      }).catch(() => {
      })
    },
    // 搜索
    handleFilter () {
      this.listQuery.offset = 1
      this.fetchData()
    },
    handleSizeChange (val) {
      this.listQuery.limit = val
      this.fetchData()
    },
    handleCurrentChange (val) {
      this.listQuery.offset = val
      this.fetchData()
    },
    onSubmit () {
      this.submitLoading = true
      httpPost(setFlowBell, this.bell)
        .then(res => {
          this.dialogBellVisible = false
          setTimeout(() => { this.submitLoading = false }, 300)
          this.$message.success(res.message)
        }).catch(() => {
          this.submitLoading = false
        })
    },
    clickWebFun (row, optType) {
      this.$confirm('确定要' + (optType === 2 ? '开启' : '停用') + '该卡的上网功能吗？', '提示', {})
        .then(() => {
          this.switchLoading = true
          httpPost(switchWeb, {msisdn: row.msisdn, optType: optType}).then(res => {
            this.switchLoading = false
            this.fetchData()
          }).catch(() => {
            this.switchLoading = false
          })
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}

.el-table .danger-row {
  background: hsla(0,87%,69%,.2);
}
</style>

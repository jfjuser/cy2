<template>
  <div class="app-container">
    <div class="table-main">
      <!-- 操作 -->
      <div class="filter-container">
        <el-select clearable v-model="listQuery.type" style="width: 150px;"  class="filter-item" placeholder="类型">
          <el-option v-for="item in pushFeeRulesType" :key="item.valueNo" :label="item.valueName" :value="item.valueNo"></el-option>
        </el-select>
        <el-select clearable v-model="listQuery.rechargeType" style="width: 150px;"  class="filter-item" placeholder="记录类型">
          <el-option v-for="item in rechargeType" :key="item.valueNo" :label="item.valueName" :value="item.valueNo"></el-option>
        </el-select>
        <el-button class="filter-item" type="primary" @click="handleFilter" icon="el-icon-search">搜索</el-button>
        <el-button class="filter-item" type="primary" @click="handleRefresh" icon="el-icon-refresh">刷新</el-button>
        <el-button class="filter-item" type="primary" @click="handleh"  icon="el-icon-download" v-has="['导出']" >导出</el-button>
        <el-button class="filter-item" type="primary" v-has="['充值']" v-if="isRecharge"  @click="handleChanger">
          <i class="fa fa-rmb"></i>
          充值
        </el-button>
      </div>
      <el-table stripe :header-cell-style="{background:'#f3f4f6'}" style="width: 100%" max-height="600" :data="tableData" v-loading.body="listLoading" element-loading-text="加载中..." border fit highlight-current-row>
        <el-table-column label="付费金额" align="center" prop="price">
          <template slot-scope="scope">
            {{moneyInOutFormatter(scope.row.price)}}
          </template>
        </el-table-column>
        <el-table-column label="类型" align="center" prop="type">
          <template slot-scope="scope">
            {{pushFeeRulesFormatter(scope.row.type)}}
          </template>
        </el-table-column>
        <el-table-column label="条数" align="center" prop="maxNum">
          <template slot-scope="scope">
            {{scope.row.type === 0 ? scope.row.maxNum : '-'}}
          </template>
        </el-table-column>
        <el-table-column label="天数" align="center" prop="days">
          <template slot-scope="scope">
            {{scope.row.type === 1 ? scope.row.days : '-'}}
          </template>
        </el-table-column>
        <el-table-column label="规则名称" align="center" prop="ruleName"></el-table-column>
        <el-table-column label="记录类型" align="center" prop="rechargeType">
          <template slot-scope="scope">
            {{rechargeTypeFormatter(scope.row.rechargeType)}}
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center" prop="createAt">
          <template slot-scope="scope">
            {{timeFormatter(scope.row.createAt)}}
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination background  :page-sizes="[10,20,30, 50]" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.offset " :page-size="listQuery.limit" :total="total" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
      </div>
      <el-dialog title="充值" :visible.sync="dialogChangeVisible">
        <el-form ref="changeform" :model="form" autoCompete = "on" label-position="right" label-width="150px" >
          <el-form-item label="充值规则" prop="ruleId">
            <el-select v-model="form.ruleId"  class="filter-item" @change="changeRuleId">
              <el-option v-for="item in ruleList" :key="item.id"  :label="item.name" :value="item.id"> </el-option>
            </el-select>
          </el-form-item>
          <div v-if="disabled === true">
            <el-card class="box-card">
              <el-row  class="text">
                <el-col :span="8">类型</el-col>
                <el-col :span="16">{{pushFeeRulesFormatter(info.type)}}</el-col>
              </el-row>
              <el-row  class="text">
                <el-col :span="8">付费金额</el-col>
                <el-col :span="16">{{moneyInOutFormatter(info.price)}}</el-col>
              </el-row>
              <el-row  class="text">
                <el-col :span="8">最大条数</el-col>
                <el-col :span="16">{{info.maxNum}}</el-col>
              </el-row>
              <el-row  class="text">
                <el-col :span="8">天数</el-col>
                <el-col :span="16">{{info.days}}</el-col>
              </el-row>
              <el-row  class="text">
                <el-col :span="8">备注</el-col>
                <el-col :span="16">{{info.resume}}</el-col>
              </el-row>
            </el-card>
          </div>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogChangeVisible = false">取消</el-button>
          <el-button :loading = "changeLoading" type="primary" @click="createChange">保存</el-button>
        </div>
      </el-dialog>
      <el-dialog title="充值" :visible.sync="dialogWxChangeVisible" width="800px">
        <el-row :gutter="40">
          <el-col class="box-change" v-for="item in yunRules" :key="item.id" :span="12">
            <div class="box-change-title">{{item.name}}</div>
            <div class="box-change-content">
              <div class="box-change-remark">{{item.resume}}</div>
              <div class="box-change-money">￥<span class="box-change-money-text">{{item.price}}元</span></div>
              <div class="box-change-money-ticket"><span class="box-change-money-ticket-text">￥{{item.price * 2}}</span><span class="box-change-money-ticket-tip">优惠</span></div>
              <ul>
                <li>可发布<span class="box-change-bule">所有</span>支持的广告类型</li>
                <li>无限制广告创建数量,资源统一使用</li>
                <li v-if="item.maxNum > 0">{{item.maxNum}}次推送数</li>
                <li v-if="item.days > 0">{{item.days}}天无限制推送次数</li>
              </ul>
              <div class="box-change-pay" @click="handlePay(item.id)">支付</div>
            </div>
          </el-col>
        </el-row>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogWxChangeVisible = false">返回</el-button>
        </div>
      </el-dialog>
    </div>
    <el-dialog title="扫一扫支付,10分钟内有效" :visible.sync="dialogWxPayVisible" width="500px">
      <div class="box-code">
        <div class="box-qrcode"><div id="qrcode" ref="qrcode"></div></div>
        <img class="img-weixin" src="@/assets/img_weixin_pay.png"/>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogWxPayVisible = false">返回</el-button>
      </div>
    </el-dialog>
    <PanelGroup :data="using"></PanelGroup>
  </div>
</template>
<script>
import QRCode from 'qrcodejs2'
import PanelGroup from './components/PanelGroup'
import { pushFeeRulesType, rechargeType } from '@/utils/selectAble.js'
import { timeFormatter, moneyInOutFormatter, pushFeeRulesFormatter, rechargeTypeFormatter } from '@/utils/formatter.js'
import { pagePushAdvRecharge, pushRecharge, listPushFeeRules, getAdvUsingInfo, isUseRecharge, loadZzRechargeRules, advChangeWxPay } from '@/api/url.js'
import { httpGet, httpPost } from '@/utils/restful.js'
export default {
  components: {
    PanelGroup
  },
  data () {
    return {
      isRecharge: false,
      isWxRecharge: false,
      yunRules: [],
      list: null,
      listLoading: true,
      changeLoading: false,
      listQuery: {
        offset: 1,
        limit: 10,
        departmentId: this.$store.getters.departmentId,
        type: undefined,
        rechargeType: undefined
      },
      using: {
        price: 0,
        maxNum: 0,
        restNum: 0,
        maxDays: 0,
        restDays: 0
      },
      advList: [],
      tableData: [],
      pushFeeRulesType: pushFeeRulesType,
      rechargeType: rechargeType,
      timeFormatter: timeFormatter,
      moneyInOutFormatter: moneyInOutFormatter,
      pushFeeRulesFormatter: pushFeeRulesFormatter,
      rechargeTypeFormatter: rechargeTypeFormatter,
      total: null,
      ruleList: [],
      form: {
        departmentId: this.$store.getters.departmentId,
        ruleId: undefined
      },
      info: {
        type: undefined,
        price: undefined,
        maxNum: undefined,
        days: undefined,
        resume: ''
      },
      formRules: {},
      disabled: false,
      dialogChangeVisible: false,
      dialogWxChangeVisible: false,
      dialogWxPayVisible: false,
      qrCode: undefined,
      codeUrl: ' ',
      jsonData: [
        {
          title: '付费金额',
          key: 'price',
          type: 'text'
        },
        {
          title: '类型',
          key: 'type',
          type: 'text'
        },
        {
          title: '条数',
          key: 'maxNum',
          type: 'text'
        },
        {
          title: '天数',
          key: 'days',
          type: 'text'
        },
        {
          title: '规则名称',
          key: 'ruleName',
          type: 'text'
        },
        {
          title: '记录类型',
          key: 'rechargeType',
          type: 'text'
        },
        {
          title: '创建时间',
          key: 'createAt',
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
    this.loadIsUseRecharge()
    this.getAdvUsingInfo()
    this.fetchData()
  },
  methods: {
    handleh () {
      let obj = JSON.parse(JSON.stringify(this.tableData))
      obj.forEach((item, index) => {
        // item.advTitle = this.advTargetTypeFormatter(item.type)
        item.price = this.moneyInOutFormatter(item.price)
        item.maxNum = parseInt(item.type) === 0 ? item.maxNum : '-'
        item.days = parseInt(item.type) === 1 ? item.days : '-'
        item.type = this.pushFeeRulesFormatter(item.type)
        item.rechargeType = this.rechargeTypeFormatter(item.rechargeType)
        item.createAt = this.timeFormatter(item.createAt)
        // item.resume = this.happenEventFormatter(item.happenEvent)
      })
      this.table2excel(this.jsonData, obj, 'excel.xlsx')
    },
    // 判断是否可以自助充值
    loadIsUseRecharge () {
      let self = this
      httpGet(isUseRecharge + '/' + this.$store.getters.departmentId).then(res => {
        // 是否显示充值按钮
        self.isRecharge = res.data.recharge
        // 是否启用微信支付自助充值
        self.isWxRecharge = res.data.wxRecharge
      }).catch(() => {
      })
    },
    // 获取列表
    fetchData () {
      this.listLoading = true
      httpGet(pagePushAdvRecharge, this.listQuery).then(res => {
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
    handleRefresh () {
      this.listQuery = {
        offset: 1,
        limit: 10,
        departmentId: this.$store.getters.departmentId,
        type: undefined,
        rechargeType: undefined
      }
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
    // 搜索
    handleFilter () {
      this.listQuery.offset = 1
      this.fetchData()
    },
    createChange () {
      this.$refs.changeform.validate((valid) => {
        if (valid) {
          this.changeLoading = true
          this.form = Object.assign(this.form, {departmentId: this.$store.getters.departmentId})
          httpPost(pushRecharge, this.form).then((res) => {
            this.fetchData()
            this.getAdvUsingInfo()
            this.dialogChangeVisible = false
            setTimeout(() => { this.changeLoading = false }, 300)
            this.$message({
              message: res.message,
              type: 'success',
              duration: 4 * 1000
            })
          }).catch(() => {
            this.changeLoading = false
          })
        }
      })
    },
    getAdvUsingInfo () {
      httpGet(getAdvUsingInfo + '/' + this.$store.getters.departmentId).then(res => {
        if (res.data !== null) {
          this.using = res.data
        }
      }).catch(() => {})
    },
    loadRules () {
      httpGet(listPushFeeRules, this.listQuery).then(res => {
        this.ruleList = res.data
      }).catch(() => {})
    },
    changeRuleId () {
      this.disabled = false
      for (let i = 0; i < this.ruleList.length; i++) {
        if (this.ruleList[i].id === this.form.ruleId) {
          this.info = Object.assign({}, this.ruleList[i])
          this.disabled = true
        }
      }
    },
    // 充值
    handleChanger () {
      let self = this
      // 如果有加载自助支付的充值规则则打开另外一个
      if (self.isWxRecharge) {
        // 加载充值规则
        httpGet(loadZzRechargeRules).then(res => {
          self.yunRules = res.data
          if (self.yunRules && self.yunRules.length > 0) {
            self.dialogWxChangeVisible = true
          } else {
            this.$message.warning('加载资源失败,没有找到可用的充值规则,请刷新页面重试')
          }
        }).catch(() => {
        })
      } else {
        self.dialogChangeVisible = true
        // 加载充值规则
        this.loadRules()
        // 延迟调用
        self.$nextTick(() => {
          self.$refs['changeform'].clearValidate()
          this.resetForm()
        })
      }
    },
    handlePay (ruleId) {
      // 生成微信支付二维码
      this.dialogWxPayVisible = true
      // 延迟调用
      this.$nextTick(() => {
        let params = {
          ruleId: ruleId,
          departmentId: this.$store.getters.departmentId
        }
        httpPost(advChangeWxPay, params).then(res => {
          let QrCodeHTML = this.$refs.qrcode
          QrCodeHTML.innerHTML = ' '
          this.createQrCode()
          this.codeUrl = res.data
          this.createCode.clear()
          this.createCode.makeCode(this.codeUrl)
        }).catch(() => {})
      })
    },
    // 生成二维码
    createQrCode () {
      this.createCode = new QRCode('qrcode', {
        text: this.codeUrl,
        width: 260,
        height: 260
      })
    },
    // 重置form表单
    resetForm () {
      this.form = {
        departmentId: this.$store.getters.departmentId,
        ruleId: undefined
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.box-card {
  width: 50%;
  margin-left: 10%;
}
.box-change {
  margin-bottom: 20px;
}
.box-change-title {
  background: #0066CC;
  height: 54px;
  line-height: 54px;
  color: #fff;
  border-radius: 6px 6px 0 0;
  font-size: 20px;
  text-align: center;
}
.box-change-content {
  background: #1A8CFF;
  text-align: center;
  color: #fff;
  border-radius: 0 0 6px 6px;
  font-size: 16px;
  line-height: 2;
  padding-bottom: 10px;
  .box-change-money {
    .box-change-money-text {
      margin-top: 5px;
      font-size: 24px;
    }
  }
  .box-change-money-ticket {
    .box-change-money-ticket-text {
      // float: left;
      font-size: 20px;
      text-decoration: line-through black;
      padding: 0 5px;
    }
    .box-change-money-ticket-tip {
      // float: left;
      line-height: 40px;
      margin-left: 10px;
      border-radius: 4px;
      font-size: 14px;
      padding: 4px 8px;
      vertical-align: top;
      background: #ed4343;
    }
  }
  ul {
    padding: 0 10%;
    text-align: left;
    li {
      list-style: none;
      background: url(./../../../assets/icon/icon_success.png) no-repeat left;
      background-size: 26px 26px;
      padding-left: 40px;
    }
  }
  .box-change-pay {
    padding: 5px 20px;
    text-align: center;
    border: 2px solid #f0f0f0;
    margin: 0 auto;
    width: 30%;
    border-radius: 4px;
    cursor: pointer;
  }
}
.box-code {
  background: url('./../../../assets/img_weixin_pay_back.png') no-repeat 5px 5px;
  background-size: 100% 100%;
  width: 440px;
  height: 480px;
  position: relative;
}
.box-qrcode {
  position: absolute;
  left: 90px;
  top: 65px;
}
.img-weixin {
  position: absolute;
  left: 120px;
  top: 370px;
  width: 220px;
}
</style>

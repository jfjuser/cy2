<template>
    <div class="app-container">
        <el-tabs type="border-card" v-model="sceneType">
          <el-tab-pane :label="faceName" name='5'>
            <div class="filter-container" >
                <el-select v-model="listQuery.status" placeholder="请选择" @change="handleChangeStatus" class="filter-item">
                    <el-option
                    v-for="item in optionsStatus"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
                <el-button class="filter-item" type="primary" @click="handleRefresh" icon="el-icon-refresh">刷新</el-button>
                <el-button class="filter-item" type="primary" @click="handleh"  icon="el-icon-download" v-has="['导出']" >导出</el-button>
            </div>
            <el-table stripe :header-cell-style="{background:'#f3f4f6'}" style="width: 100%" max-height="600" :data="tableData" v-loading.body="listLoading"  element-loading-text="加载中..." border fit highlight-current-row>
                <el-table-column label="部门名" align="center" prop="departmentName"></el-table-column>
                <el-table-column label="充值相机" align="center" prop="macs" width="160">
                    <template slot-scope="scope">
                        <template v-for="(item, i) in scope.row.macs">
                            <el-tag size="mini" style="margin-bottom: 10px" :key="i">{{item}}</el-tag>
                        </template>
                    </template>
                </el-table-column>
                <el-table-column label="平台订单号" align="center" prop="outTradeNo"></el-table-column>
                <el-table-column label="支付方式" align="center" prop="source">
                    <template slot-scope="scope">
                        {{scope.row.source==5?'微信':'微信'}}
                    </template>
                </el-table-column>
                <el-table-column label="场景" align="center" prop="sceneType">
                    <template slot-scope="scope">
                        {{sceneTypeFormatter(scope.row.sceneType)}}
                    </template>
                </el-table-column>
                <el-table-column label="微信订单号" align="center" prop="tradeNo"></el-table-column>
                <el-table-column label="提示标题" align="center" prop="title"></el-table-column>
                <el-table-column label="支付金额" align="center" prop="money"></el-table-column>
                <el-table-column label="支付时间" align="center" prop="payTime">
                    <template slot-scope="scope">
                        {{timeFormatter(scope.row.payTime)}}
                    </template>
                </el-table-column>
                <el-table-column label="支付银行" align="center" prop="bankType"></el-table-column>
                <el-table-column label="支付状态" align="center" prop="status">
                    <template slot-scope="scope">
                        {{payStatusFormatter(scope.row.status)}}
                    </template>
                </el-table-column>
                <el-table-column label="积分名" align="center" prop="pointName"></el-table-column>
                <el-table-column label="积分" align="center" prop="points"></el-table-column>
            </el-table>
            <div class="pagination-container">
                <el-pagination background  :page-sizes="[10,20,30, 50]" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.offset " :page-size="listQuery.limit" :total="total" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
            </div>
          </el-tab-pane>

          <el-tab-pane :label="adName" name='4'>
            <div class="filter-container" >
                <el-select v-model="listQuery1.status" placeholder="请选择" @change="handleChangeStatus" class="filter-item">
                    <el-option
                    v-for="item in optionsStatus"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
                <el-button class="filter-item" type="primary" @click="handleRefresh" icon="el-icon-refresh">刷新</el-button>
                <el-button class="filter-item" type="primary" @click="handleh1"  icon="el-icon-download" v-has="['导出']" >导出</el-button>
            </div>
            <el-table :header-cell-style="{background:'#f3f4f6'}" style="width: 100%" max-height="600" :data="tableData1" v-loading.body="listLoading"  element-loading-text="加载中..." border fit highlight-current-row>
                <el-table-column label="部门名" align="center" prop="departmentName"></el-table-column>
                <el-table-column label="充值相机" align="center" prop="macs">
                    <template slot-scope="scope">
                        <template v-for="(item, i) in scope.row.macs">
                            <el-tag size="mini" style="margin-bottom: 10px" :key="i">{{item}}</el-tag>
                        </template>
                    </template>
                </el-table-column>
                <el-table-column label="平台订单号" align="center" prop="outTradeNo"></el-table-column>
                <el-table-column label="支付方式" align="center" prop="source">
                    <template slot-scope="scope">
                        {{scope.row.source==5?'微信':'微信'}}
                    </template>
                </el-table-column>
                <el-table-column label="场景" align="center" prop="sceneType">
                    <template slot-scope="scope">
                        {{sceneTypeFormatter(scope.row.sceneType)}}
                    </template>
                </el-table-column>
                <el-table-column label="微信订单号" align="center" prop="tradeNo"></el-table-column>
                <el-table-column label="提示标题" align="center" prop="title"></el-table-column>
                <el-table-column label="支付金额" align="center" prop="money"></el-table-column>
                <el-table-column label="支付时间" align="center" prop="payTime">
                    <template slot-scope="scope">
                        {{timeFormatter(scope.row.payTime)}}
                    </template>
                </el-table-column>
                <el-table-column label="支付银行" align="center" prop="bankType"></el-table-column>
                <el-table-column label="支付状态" align="center" prop="status">
                    <template slot-scope="scope">
                        {{payStatusFormatter(scope.row.status)}}
                    </template>
                </el-table-column>
                <el-table-column label="积分名" align="center" prop="pointName"></el-table-column>
                <el-table-column label="积分" align="center" prop="points"></el-table-column>
            </el-table>
            <div class="pagination-container">
                <el-pagination background  :page-sizes="[10,20,30, 50]" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery1.offset " :page-size="listQuery1.limit" :total="total1" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
            </div>
          </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import { faceOrderSearch } from '@/api/url.js'
import { httpGet } from '@/utils/restful.js'
import { timeFormatter, sceneTypeFormatter, payStatusFormatter } from '@/utils/formatter.js'
export default {
  data () {
    return {
      tableData: [],
      listLoading: false,
      total: 0,
      listQuery: {
        offset: 1,
        limit: 10,
        status: 1,
        sceneType: 5
      },
      timeFormatter: timeFormatter,
      sceneTypeFormatter: sceneTypeFormatter,
      payStatusFormatter: payStatusFormatter,
      // options: [{
      //   value: 4,
      //   label: sceneTypeFormatter(4)
      // }, {
      //   value: 5,
      //   label: sceneTypeFormatter(5)
      // }],
      optionsStatus: [{
        value: 0,
        label: payStatusFormatter(0)
      }, {
        value: 1,
        label: payStatusFormatter(1)
      }],
      faceName: sceneTypeFormatter(5),
      adName: sceneTypeFormatter(4),
      tableData1: [],
      total1: 0,
      listQuery1: {
        offset: 1,
        limit: 10,
        status: 1,
        sceneType: 4
      },
      sceneType: '5',
      jsonData: [
        {
          title: '部门名',
          key: 'departmentName',
          type: 'text'
        },
        {
          title: '充值相机',
          key: 'macs',
          type: 'text'
        },
        {
          title: '平台订单号',
          key: 'outTradeNo',
          type: 'text'
        },
        {
          title: '支付方式',
          key: 'source',
          type: 'text'
        },
        {
          title: '场景',
          key: 'sceneType',
          type: 'text'
        },
        {
          title: '微信订单号',
          key: 'tradeNo',
          type: 'text'
        },
        {
          title: '提示标题',
          key: 'title',
          type: 'text'
        },
        {
          title: '支付金额',
          key: 'money',
          type: 'text'
        },
        {
          title: '支付时间',
          key: 'payTime',
          type: 'text'
        },
        {
          title: '支付银行',
          key: 'bankType',
          type: 'text'
        },
        {
          title: '支付状态',
          key: 'status',
          type: 'text'
        },
        {
          title: '积分名',
          key: 'pointName',
          type: 'text'
        },
        {
          title: '积分',
          key: 'points',
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
    this.faceData()
  },
  mounted () {
    this.adData()
  },
  methods: {
    handleh () {
      let obj = JSON.parse(JSON.stringify(this.tableData))
      obj.forEach((item, index) => {
        item.source = parseInt(item.source) === 5 ? '微信' : '微信'
        item.sceneType = this.sceneTypeFormatter(item.sceneType)
        item.payTime = this.timeFormatter(item.payTime)
        item.status = this.payStatusFormatter(item.status)
        if (item.macs) {
          let str = ''
          item.macs.forEach((item, index) => {
            str += (item + '')
          })
          item.macs = str
        }
      })
      this.table2excel(this.jsonData, obj, 'excel.xlsx')
    },
    handleh1 () {
      let obj = JSON.parse(JSON.stringify(this.tableData1))
      obj.forEach((item, index) => {
        item.source = parseInt(item.source) === 5 ? '微信' : '微信'
        item.sceneType = this.sceneTypeFormatter(item.sceneType)
        item.payTime = this.timeFormatter(item.payTime)
        item.status = this.payStatusFormatter(item.status)
        if (item.macs) {
          let str = ''
          item.macs.forEach((item, index) => {
            str += (item + '')
          })
          item.macs = str
        }
      })
      this.table2excel(this.jsonData, obj, 'excel.xlsx')
    },
    fetchData () {
      if (this.sceneType === '5') this.faceData()
      if (this.sceneType === '4') this.adData()
    },
    faceData () {
      this.listLoading = true
      httpGet(faceOrderSearch, this.listQuery).then(res => {
        if (res.data === null || res.data.rows === null) {
          this.tableData = []
          this.total = 0
        } else {
          for (const v of res.data.rows) {
            if (v.macs.length !== 0) {
              v.macs = v.macs.split(',')
            }
          }
          this.tableData = res.data.rows
          this.total = res.data.total
        }
        this.listLoading = false
      }).catch(() => { this.listLoading = false })
    },
    adData () {
      this.listLoading = true
      httpGet(faceOrderSearch, this.listQuery1).then(res => {
        if (res.data === null || res.data.rows === null) {
          this.tableData1 = []
          this.total1 = 0
        } else {
          for (const v of res.data.rows) {
            if (v.macs.length !== 0) {
              v.macs = v.macs.split(',')
            }
          }
          this.tableData1 = res.data.rows
          this.total1 = res.data.total
        }
        this.listLoading = false
      }).catch(() => { this.listLoading = false })
    },
    handleSizeChange (val) {
      this.listQuery.limit = val
      this.fetchData()
    },
    handleCurrentChange (val) {
      this.listQuery.offset = val
      this.fetchData()
    },
    handleChangeStatus () {
      this.listQuery.offset = 1
      this.fetchData()
    },
    handleRefresh () {
      this.listQuery.offset = 1
      this.fetchData()
    }
  }
}
</script>

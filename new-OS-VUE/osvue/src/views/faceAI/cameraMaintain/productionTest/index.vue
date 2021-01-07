<template>
  <div class="app-container">
    <div class="table-main">
      <!-- 操作 -->
      <div class="filter-container">
        <el-input  class="filter-item" style="width:150px;" v-model="listQuery.mac" clearable placeholder="MAC"></el-input>
        <el-select clearable style="width:150px;" v-model="listQuery.isBind"  class="filter-item" placeholder="绑定状态">
          <el-option v-for="item in isBindType" :key="item.valueNo" :label="item.valueName" :value="item.valueNo"></el-option>
        </el-select>
        <el-select clearable style="width:150px;" v-model="listQuery.cameraType"  class="filter-item" placeholder="相机类型">
          <el-option v-for="item in aiCameraType" :key="item.valueNo" :label="item.valueName" :value="item.valueNo"></el-option>
        </el-select>
        <el-select clearable style="width:150px;" v-model="listQuery.status"  class="filter-item" placeholder="状态">
          <el-option v-for="item in statusType" :key="item.valueNo" :label="item.valueName" :value="item.valueNo"></el-option>
        </el-select>
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
        <el-button class="filter-item search" type="primary" @click="handleFilter" icon="el-icon-search">搜索</el-button>
        <el-button class="filter-item" type="primary" @click="handleRefresh" icon="el-icon-refresh">刷新</el-button>
        <el-button class="filter-item" type="primary" @click="handleh"  icon="el-icon-download" v-has="['导出']" >导出</el-button>
        <el-button class="filter-item bind" type="primary" @click="handleBind" :disabled="disabled" :loading="bindLoading">
          <i class="fa fa-jsfiddle"></i>
          绑定相机</el-button>
        <el-button class="filter-item unbind" type="warning" :loading="unBindLoading" :disabled="disabled" @click.native.prevent="handleRemoveBind">
          <i class="fa fa-stumbleupon-circle"></i>
          解除绑定</el-button>
      </div>
      <el-table stripe :header-cell-style="{background:'#f3f4f6'}" style="width: 100%" max-height="600" :data="tableData"  @selection-change="handleSelectionChange" v-loading.body="listLoading"  element-loading-text="加载中..." border fit highlight-current-row>
        <el-table-column type="selection" width="40" fixed="left" ></el-table-column>
        <el-table-column label="通道名称" align="center" prop="localName"></el-table-column>
        <el-table-column label="MAC" align="center" prop="mac"></el-table-column>
        <el-table-column label="相机类型" align="center" prop="cameraType">
          <template slot-scope="scope">
            {{aiCameraTypeFormatter(scope.row.cameraType)}}
          </template>
        </el-table-column>
        <el-table-column label="相机版本" align="center" prop="tcpVersion"></el-table-column>
        <el-table-column label="绑定状态" align="center" prop="isBind">
          <template slot-scope="scope">
            {{ isBindFormatter(scope.row.isBind) }}
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center" prop="status">
          <template slot-scope="scope">
            <el-button size="mini" type="danger" v-if="scope.row.status === 0">离线</el-button>
            <span v-if="scope.row.status === 1">在线</span>
          </template>
        </el-table-column>
        <el-table-column label="最近登录时间" align="center" prop="loginAt">
          <template slot-scope="scope">
              {{ timeFormatter(scope.row.loginAt) }}
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" align="center" class-name="small-padding fixed-width" width="250">
          <template slot-scope="scope">
              <el-button type="primary" @click="getPicture(scope.row)" size="mini" class="getfile">获取图片</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination background  :page-sizes="[10,20,30, 50]" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.offset " :page-size="listQuery.limit" :total="total" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
      </div>
      <el-dialog title="获取图片" :visible.sync="innerVisible" width="30%">
        <img :src="picSrc" alt="图片">
      </el-dialog>
    </div>
    <el-button type="info" round class="cancel-btn" @click.native="cancelGetImg" v-show="isCancelBtn">取消获取</el-button>
  </div>
</template>

<script>
import { statusType, isBindType, aiCameraType } from '@/utils/selectAble.js'
import { isBindFormatter, timeFormatter, aiCameraTypeFormatter } from '@/utils/formatter.js'
import { httpGet, httpPut, httpPost } from '@/utils/restful'
import { getAIProductionTest, bindProdAICamera, unBindProdAICamera, getAISnap } from '@/api/url'
import Axios from 'axios'
export default {
  data () {
    return {
      time: [],
      list: null,
      bindLoading: false,
      unBindLoading: false,
      listLoading: true,
      innerVisible: false,
      disabled: true,
      listQuery: {
        offset: 1,
        limit: 10,
        cameraType: undefined,
        mac: undefined,
        status: undefined,
        isBind: undefined,
        beginTime: undefined,
        endTime: undefined
      },
      tableData: [],
      selectArrayId: [],
      total: null,
      statusType: statusType,
      isBindType: isBindType,
      isBindFormatter: isBindFormatter,
      aiCameraType: aiCameraType,
      timeFormatter: timeFormatter,
      aiCameraTypeFormatter: aiCameraTypeFormatter,
      picSrc: '',
      isCancelBtn: false,
      jsonData: [
        {
          title: '通道名称',
          key: 'localName',
          type: 'text'
        },
        {
          title: 'MAC',
          key: 'mac',
          type: 'text'
        },
        {
          title: '相机类型',
          key: 'cameraType',
          type: 'text'
        },
        {
          title: '相机版本',
          key: 'tcpVersion',
          type: 'text'
        },
        {
          title: '绑定状态',
          key: 'isBind',
          type: 'text'
        },
        {
          title: '状态',
          key: 'status',
          type: 'text'
        },
        {
          title: '最近登录时间',
          key: 'loginAt',
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
  },
  methods: {
    handleh () {
      let obj = JSON.parse(JSON.stringify(this.tableData))
      obj.forEach((item, index) => {
        item.cameraType = this.aiCameraTypeFormatter(item.cameraType)
        item.isBind = this.isBindFormatter(item.isBind)
        // item.remark = item.status / 1 === 0 ? item.remark : ''
        item.status = parseInt(item.status) === 0 ? '离线' : '在线'
        // item.timeAt = this.timeFormatter(item.timeAt)
        item.loginAt = this.timeFormatter(item.loginAt)
      })
      this.table2excel(this.jsonData, obj, 'excel.xlsx')
    },
    // 监听搜索的时间
    changeTime (value) {
      if (value === null) {
        this.listQuery.beginTime = undefined
        this.listQuery.endTime = undefined
      } else {
        this.listQuery.beginTime = value[0]
        this.listQuery.endTime = value[1]
      }
    },
    // 刷新
    handleRefresh () {
      this.listQuery = {
        offset: 1,
        limit: 10,
        cameraType: undefined,
        mac: undefined,
        status: undefined,
        isBind: undefined,
        beginTime: undefined,
        endTime: undefined
      }
      this.time = []
      this.fetchData()
    },
    fetchData () {
      let self = this
      httpGet(getAIProductionTest, this.listQuery).then(res => {
        if (res.data === null) {
          self.tableData = []
          self.total = 0
          self.listLoading = false
        } else {
          self.tableData = res.data.rows
          self.total = res.data.total
          self.listLoading = false
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
    handleRemoveBind () {
      this.$confirm('是否对该相机进行解绑？', '解绑相机', {
        confirmButtonText: '确定解绑',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(res => {
        this.unBindLoading = false
        httpPut(unBindProdAICamera, {ids: this.selectArrayId}).then(res => {
          this.unBindLoading = false
          this.fetchData()
          this.$message({
            type: 'success',
            message: res.message,
            duration: 4 * 1000
          })
        }).catch(() => {
          this.unBindLoading = false
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
    handleBind () {
      this.$confirm('确认提交吗？', '提示', {})
        .then(() => {
          this.bindLoading = true
          httpPut(bindProdAICamera, {ids: this.selectArrayId}).then(res => {
            this.bindLoading = false
            this.fetchData()
            this.$message({
              type: 'success',
              message: res.message,
              duration: 4 * 1000
            })
          }).catch(() => {
            this.bindLoading = false
          })
        }).catch(() => {})
    },
    getPicture (row) {
      const loading = this.$loading({
        lock: true,
        text: '获取中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      let showBtnTime = setTimeout(() => { this.isCancelBtn = true }, 1000)
      httpPost(getAISnap + row.id)
        .then(res => {
          clearTimeout(showBtnTime)
          this.picSrc = 'data:image/jpg;base64,' + res.data
          loading.close()
          if (this.isCancelBtn) this.isCancelBtn = false
          this.innerVisible = true
        }).catch(() => {
          clearTimeout(showBtnTime)
          loading.close()
          if (this.isCancelBtn) this.isCancelBtn = false
        })
    },
    cancelGetImg () {
      const CancelToken = Axios.CancelToken
      this.$store.state.source.cancel && this.$store.state.source.cancel()
      this.$store.state.source = CancelToken.source()
    }
  }
}
</script>
<style lang="scss" scoped>
  img {
    width: 100%;
  }
  .cancel-btn {
    position: fixed;
    bottom: 30%;
    left: 50%;
    transform: translateX(-50%);
    z-index: 10000;
  }
</style>

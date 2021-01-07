<template>
  <div class="app-container">
    <div class="table-main">
      <!-- 操作 -->
      <div class="filter-container">
        <el-input v-model="listQuery.localName" class="filter-item" clearable style="width:200px" placeholder="请输入通道名称"></el-input>
        <el-input v-model = "listQuery.userName" class="filter-item" clearable style="width:200px" placeholder="姓名"></el-input>
         <el-select clearable v-model="listQuery.aiUserId"  class="filter-item" placeholder="用户类别">
          <el-option v-for="item in ledTypeSelect" :key="item.valueNo" :label="item.valueName" :value="item.valueNo"></el-option>
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
        <el-button class="filter-item" :disabled="filterDisabled" type="primary" @click="handleFilter" icon="el-icon-search">搜索</el-button>
        <el-button class="filter-item" type="primary" @click="handleRefresh" icon="el-icon-refresh">刷新</el-button>
        <el-button class="filter-item" type="primary" v-has="['同步脱机记录']" @click="handleSync" icon="el-icon-upload">同步脱机记录</el-button>
        <el-button class="filter-item" @click="openDialog" plain type="warning">导出</el-button>
      </div>
      <!-- <el-dialog title="导出" :visible.sync="isSearch" width="30%" :close-on-click-modal="false">

      </el-dialog> -->
      <el-table stripe :header-cell-style="{background:'#f3f4f6'}" style="width: 100%" max-height="600" :data="tableData" v-loading.body="listLoading" element-loading-text="加载中..." border fit highlight-current-row>
        <el-table-column label="姓名" align="center" prop="userName"></el-table-column>
        <el-table-column label="手机号" align="center" prop="phone">
          <template slot-scope="scope">
            <template v-if="isShowColumnFormatter(['隐藏手机号'])">{{scope.row.phone | hiddenPhone}}</template>
            <template v-else>{{scope.row.phone}}</template>
          </template>
        </el-table-column>
        <el-table-column label="体温值" align="center" prop="tempurature">
          <template slot-scope="scope">
            <span v-if="scope.row.tempurature < 37.3">{{scope.row.tempurature}}</span>
            <span v-else style="color:red">{{scope.row.tempurature}}</span>
          </template>
        </el-table-column>
        <el-table-column label="通道名称" align="center" prop="localName"></el-table-column>
        <el-table-column label="地址" align="center" prop="addr"></el-table-column>
        <el-table-column label="进出状态" align="center" prop="type" >
          <template slot-scope="scope">
            {{inOutStatusFormatter(scope.row.type)}}
          </template>
        </el-table-column>
        <el-table-column label="是否在岗/校" align="center" prop="type" >
          <template slot-scope="scope">
            {{isInOutStatusFormatter(scope.row.type)}}
          </template>
        </el-table-column>
        <el-table-column label="进出时间" align="center" prop="inOutTime">
          <template slot-scope="scope">
            {{timeFormatter(scope.row.inOutTime)}}
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" align="center" class-name="small-padding fixed-width" width="150" v-if = "isShowColumnFormatter(['查看图片'])">
          <template slot-scope="scope">
            <el-button type="primary"  @click.native.prevent="handleImage(scope.row)" size="mini">查看图片</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination background  :page-sizes="[10,20,30, 50]" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.offset " :page-size="listQuery.limit" :total="total" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
      </div>
      <el-dialog title="图片" :visible.sync="dialogFormImage" width="30%" :close-on-click-modal="false">
        <div >
          <img :src="picUrl" style="width: 100%"/>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormImage = false">返回</el-button>
        </div>
      </el-dialog>
      <!-- 同步脱机记录 -->
      <el-dialog title="同步脱机记录" :visible.sync="syncVisible" width="30%">
        <el-form>
          <el-form-item label="相机选择">
            <el-select v-model="ids" multiple style="width:80%;">
              <el-option v-for="item in localList" clearable :key="item.id" :label="item.localName" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="syncVisible = false">取消</el-button>
          <el-button :loading="syncLoading" type="primary" @click="syncData">保存</el-button>
        </div>
      </el-dialog>
    </div>
    <el-button type="info" round class="cancel-btn" @click.native="cancelGetImg" v-show="isCancelBtn">取消获取</el-button>
  </div>
</template>

<script>
import { inOutStatusFormatter, isShowColumnFormatter, timeFormatter, timeFormatterSort, isInOutStatusFormatter } from '@/utils/formatter.js'
import { httpGet, httpPut, httpExport, httpPost } from '@/utils/restful'
import { getAIInOut, exportInout, getAIPic, checkAILinuxCamera, syncAIInOut } from '@/api/url'
import Axios from 'axios'
export default {
  data () {
    return {
      time: [],
      filterDisabled: false,
      list: null,
      isSearch: false,
      listLoading: true,
      syncLoading: false,
      timeFormatter: timeFormatter,
      isShowColumnFormatter: isShowColumnFormatter,
      dialogVisible: false,
      dialogFormImage: false,
      syncVisible: false,
      isInOutStatusFormatter: isInOutStatusFormatter,
      inOutStatusFormatter: inOutStatusFormatter,
      listQuery: {
        offset: 1,
        limit: 10,
        aiUserId: 1,
        beginTime: undefined,
        endTime: undefined,
        userName: undefined
      },
      tableData: [],
      total: null,
      localList: [],
      ledTypeSelect: [
        {
          'valueName': '普通用户',
          'valueNo': 1
        },
        {
          'valueName': '陌生用户',
          'valueNo': -1
        },
        {
          'valueName': '黑名单',
          'valueNo': -2
        }
      ],
      // 详情
      fullLoading: undefined,
      picUrl: '',
      ids: [],
      isCancelBtn: false
    }
  },
  created () {
    // 开始时间
    this.listQuery.beginTime = timeFormatterSort(new Date(new Date().setDate(1))) + ' 00:00:00'
    // 结束时间
    this.listQuery.endTime = timeFormatterSort(new Date()) + ' 23:59:59'
    this.time = [this.listQuery.beginTime, this.listQuery.endTime]
  },
  mounted () {
    this.fetchData()
  },
  methods: {
    // 获取所有的通道列表
    getCameraList () {
      httpGet(checkAILinuxCamera + this.$store.getters.departmentId).then(res => {
        this.localList = res.data
      }).catch(() => {})
    },
    openDialog () {
      // this.isSearch = true
      httpExport(exportInout, this.listQuery).then((res) => {
        if (res.type === 'application/json') {
          this.$message({
            message: '请选择七天以内的范围导出',
            type: 'warning'
          })
        }
      }).catch(() => {})
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
    // 刷新
    handleRefresh () {
      this.listQuery = {
        offset: 1,
        limit: 10,
        beginTime: timeFormatterSort(new Date(new Date().setDate(1))) + ' 00:00:00',
        endTime: timeFormatterSort(new Date()) + ' 23:59:59',
        userName: undefined,
        aiUserId: 1
      }
      this.time = [this.listQuery.beginTime, this.listQuery.endTime]
      this.fetchData()
    },
    // 获取数据
    fetchData () {
      let self = this
      this.listQuery = Object.assign(this.listQuery, {departmentId: this.$store.getters.departmentId})
      httpGet(getAIInOut, this.listQuery).then(res => {
        if (res.data === null) {
          self.tableData = []
          self.total = 0
        } else {
          self.tableData = res.data.rows
          self.total = res.data.total
        }
        self.listLoading = false
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
    handleImage (row) {
      this.fullLoading = this.$loading({
        lock: true,
        text: '加载中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      let partitionAt = row.inOutTime
      let showBtnTime = setTimeout(() => { this.isCancelBtn = true }, 1000)
      httpPut(getAIPic + row.id + '/' + partitionAt).then(res => {
        clearTimeout(showBtnTime)
        // this.picUrl = res.data
        // 修改base64
        if (row.cameraType / 1 !== 135) {
          this.picUrl = 'data:image/jpeg;base64,' + res.data
        } else {
          this.picUrl = res.data
        }
        if (this.isCancelBtn) this.isCancelBtn = false
        this.dialogFormImage = true
        this.fullLoading.close()
      }).catch(() => {
        clearTimeout(showBtnTime)
        this.fullLoading.close()
        if (this.isCancelBtn) this.isCancelBtn = false
      })
    },
    cancelGetImg () {
      const CancelToken = Axios.CancelToken
      this.$store.state.source.cancel && this.$store.state.source.cancel()
      this.$store.state.source = CancelToken.source()
    },
    handleSync () {
      this.ids = []
      this.getCameraList()
      this.syncVisible = true
    },
    syncData () {
      if (this.ids.length > 0) {
        this.syncLoading = true
        httpPost(syncAIInOut, { ids: this.ids })
          .then(res => {
            this.fetchData()
            this.syncVisible = false
            setTimeout(() => { this.syncLoading = false }, 300)
            this.$message.success(res.message)
          }).catch(() => {
            this.syncLoading = false
          })
      } else {
        this.$message.warning('相机不可为空')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.cancel-btn {
  position: fixed;
  bottom: 30%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10000;
}
</style>

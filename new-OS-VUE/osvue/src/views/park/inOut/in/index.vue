<template>
  <div class="app-container">
    <div class="table-main">
      <!-- 操作 -->
      <div class="filter-container">
        <el-input v-model = "listQuery.localId" class="filter-item" clearable style="width:200px" placeholder="订单号"></el-input>
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
        <el-button class="filter-item" type="primary"   @click="handleFilter" icon="el-icon-search">搜索</el-button>
        <el-button class="filter-item" type="primary"  v-has="['导出']"  @click="handleExport" icon="el-icon-download">导出</el-button>
        <el-button class="filter-item" type="danger"  v-has="['删除']"   @click="handleDelete" :disabled="disabled" icon="el-icon-close">删除所选</el-button>
        <el-button class="filter-item" type="danger" plain v-has="['删除所有']"  @click="handleDeleteAll" icon="el-icon-delete">删除所有</el-button>
        <el-button class="filter-item" type="primary"  v-has="['临时车位数']" @click="handleTemData" >
          <i  class="fa fa-database"></i>
          临时车位数
        </el-button>
        <el-button class="filter-item" type="primary" @click="handleRefresh" icon="el-icon-refresh">刷新</el-button>
      </div>
      <el-table stripe :header-cell-style="{background:'#f3f4f6'}" style="width: 100%" max-height="600" :data="tableData" v-loading.body="listLoading" @selection-change="handleSelectionChange" element-loading-text="加载中..." border fit highlight-current-row>
        <el-table-column type="selection" width="40" v-if = "isShowColumnFormatter(['删除'])" fixed="left" ></el-table-column>
        <el-table-column label="订单编号" align="center" prop="localId" v-if = "!isShowColumnFormatter(['屏蔽金额字段'])"></el-table-column>
        <el-table-column label="车牌号码" align="center" prop="plateIn"></el-table-column>
        <el-table-column label="通道" align="center" prop="roadIdIn"></el-table-column>
        <el-table-column label="操作员" align="center" prop="uinIn"></el-table-column>
        <el-table-column label="预付金额" align="center" prop="prepayFee" v-if = "!isShowColumnFormatter(['屏蔽金额字段'])"></el-table-column>
        <el-table-column label="预付时间" align="center" prop="prepayAt" v-if = "!isShowColumnFormatter(['屏蔽金额字段'])">
          <template slot-scope="scope">
            {{timeFormatter(scope.row.prepayAt)}}
          </template>
        </el-table-column>
        <el-table-column label="车辆类型" align="center" prop="carType">
          <template slot-scope="scope">
            {{inOutCarFormatter(scope.row.carType)}}
          </template>
        </el-table-column>
        <el-table-column label="入场图片" align="center" prop="picIn" width="160">
          <template slot-scope="scope">
            <el-button v-if="scope.row.picIn" type="primary" @click.native.prevent="handleImage(scope.row, 0)" size="mini">获取图片</el-button>
          </template>
        </el-table-column>
        <el-table-column label="进场时间" align="center" prop="ioTimeIn">
          <template slot-scope="scope">
            {{timeFormatter(scope.row.ioTimeIn)}}
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination background  :page-sizes="[10,20,30, 50]" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.offset " :page-size="listQuery.limit" :total="total" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
      </div>
      <el-dialog  :visible.sync="dialogFormImage" width="800px" :close-on-click-modal="false">
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
      <el-dialog title="临时车位数" :visible.sync="dialogTemDataVisible">
        <el-form ref="temDataForm" :rules="temDataFormRules" :model="temDataForm" label-width="120px">
          <el-form-item label="相机名称" prop="macs">
            <el-select v-model="temDataForm.macs" multiple>
              <el-option v-for="item in localList" :key="item.mac" :label="item.localName" :value="item.mac"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="临时车位数"  prop="value">
            <el-input type="number"  v-model="temDataForm.value"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :loading="submitLoading" @click="onSubmit">保存</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { inOutCarFormatter, timeFormatter, isShowColumnFormatter } from '@/utils/formatter.js'
import { plateType } from '@/utils/selectAble.js'
import { getInOnlineCamera, exportInTmps, getImage, getInTmps, deleteInTmps, deleteAllInTmps, settingTmpCar } from '@/api/url'
import { httpGet, httpDelete, httpExport, httpPut } from '@/utils/restful'
export default {
  data () {
    return {
      isShowColumnFormatter: isShowColumnFormatter,
      time: [],
      list: null,
      listLoading: true,
      deleteLoading: false,
      deleteAllLoading: false,
      dialogFormImage: false,
      timeFormatter: timeFormatter,
      listQuery: {
        offset: 1,
        limit: 10,
        beginTime: undefined,
        endTime: undefined,
        localId: undefined
      },
      tableData: [],
      inOutCarFormatter: inOutCarFormatter,
      plateType: plateType,
      total: null,
      selectArrayId: [],
      disabled: true,
      fullLoading: undefined,
      picUrl: '',
      dialogExportVisible: false,
      dialogTemDataVisible: false,
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
      submitLoading: false,
      temDataForm: {
        macs: [],
        value: undefined
      },
      temDataFormRules: {
        macs: [
          {required: true, trigger: 'change', message: '请选择相机'}
        ],
        value: [
          {required: true, trigger: 'blur', message: '请输入参数值'}
        ]
      },
      localList: []
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
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
        beginTime: undefined,
        endTime: undefined,
        localId: undefined
      }
      this.time = []
      this.fetchData()
    },
    // 获取数据
    fetchData () {
      let self = this
      this.listQuery = Object.assign(this.listQuery, {departmentId: this.$store.getters.departmentId})
      httpGet(getInTmps, this.listQuery).then(res => {
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
    // 车牌号选择
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
      this.$confirm('确认删除所选中的数据吗？', '提示', {})
        .then(() => {
          this.deleteLoading = true
          httpDelete(deleteInTmps, {
            ids: this.selectArrayId,
            departmentId: this.$store.getters.departmentId
          }).then(res => {
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
    handleDeleteAll () {
      this.$confirm('确认删除所有记录吗？', '提示', {})
        .then(() => {
          this.deleteAllLoading = true
          httpDelete(deleteAllInTmps + this.$store.getters.departmentId).then(res => {
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
    handleImage (row, type) {
      let data = {
        id: row.id,
        type: type,
        partitionAt: null
      }
      this.fullLoading = this.$loading({
        lock: true,
        text: '加载中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      httpGet(getImage, data).then(res => {
        if (res.data !== null) {
          this.picUrl = 'data:image/jpeg;base64,' + res.data
          this.dialogFormImage = true
        } else {
          this.$message.error('暂无图片')
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
          httpExport(exportInTmps, data).then((res) => {
            this.dialogExportVisible = false
            setTimeout(() => { this.exportLoading = false }, 300)
          }).catch(() => {
            this.exportLoading = false
          })
        }
      })
    },
    // 获取所有的通道列表
    loadAll () {
      httpGet(getInOnlineCamera + this.$store.getters.departmentId).then(res => {
        this.localList = res.data
      }).catch(() => {})
    },
    // 临时车位数
    handleTemData () {
      this.loadAll()
      this.dialogTemDataVisible = true
      this.$nextTick(() => {
        this.$refs.temDataForm.clearValidate()
        this.$refs['temDataForm'].resetFields()
      })
    },
    onSubmit () {
      this.$refs.temDataForm.validate((valid) => {
        this.submitLoading = true
        this.temDataForm = Object.assign(this.temDataForm, {departmentId: this.$store.getters.departmentId})
        httpPut(settingTmpCar, this.temDataForm)
          .then(res => {
            this.dialogTemDataVisible = false
            setTimeout(() => { this.submitLoading = false }, 300)
            this.$message({
              message: res.message,
              type: 'success',
              duration: 4 * 1000
            })
          }).catch(() => {
            this.submitLoading = false
          })
      })
    }
  }
}
</script>

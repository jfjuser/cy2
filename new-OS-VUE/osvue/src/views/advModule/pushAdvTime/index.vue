<template>
  <div class="app-container">
    <div class="table-main">
      <!-- 操作 -->
      <div class="filter-container">
        <el-input placeholder="请输入广告名称" class="filter-item" style="width: 150px;" v-model="listQuery.advTitle" clearable></el-input>
        <el-button class="filter-item" type="primary" @click="handleFilter" icon="el-icon-search">搜索</el-button>
        <el-button class="filter-item" type="primary" @click="fetchData" icon="el-icon-refresh">刷新</el-button>
        <el-button class="filter-item" type="primary" @click="handleh"  icon="el-icon-download" v-has="['导出']" >导出</el-button>
        <el-button class="filter-item" type="primary" v-has="['新增']"  @click="handleCreate"  icon="el-icon-edit">添加</el-button>
        <el-button class="filter-item" type="danger" v-has="['删除所选']" :loading = "deleteLoading" @click="handleDelete" :disabled="disabled" icon="el-icon-close">删除所选</el-button>
        <el-switch v-model="showtable" :active-text="`${showtable?'隐藏':'显示'}表格`" style="margin-left: 10px;"></el-switch>
        <el-switch v-model="showplan" :active-text="`${showplan?'隐藏':'显示'}视图`" style="margin-left: 10px;"></el-switch>
      </div>
      <transition name="el-fade-in-linear">
      <el-table stripe :header-cell-style="{background:'#f3f4f6'}" style="width: 100%" max-height="600" :data="tableData" v-loading.body="listLoading"  @selection-change="handleSelectionChange"  element-loading-text="加载中..." border fit highlight-current-row v-show="showtable">
        <el-table-column v-if = "isShowColumnFormatter(['删除所选'])" type="selection" width="40" fixed="left" ></el-table-column>
        <el-table-column label="广告名称" align="center" prop="advTitle"></el-table-column>
        <el-table-column label="时间段开始" align="center" prop="pushBegin">
          <template slot-scope="scope">
            {{HHssNumToTimeFormatter(scope.row.pushBegin)}}
          </template>
        </el-table-column>
        <el-table-column label="时间段结束" align="center" prop="pushEnd">
          <template slot-scope="scope">
            {{HHssNumToTimeFormatter(scope.row.pushEnd)}}
          </template>
        </el-table-column>
        <el-table-column label="备注" align="center" prop="resume"></el-table-column>
        <el-table-column fixed="right" label="操作" v-if = "isShowColumnFormatter(['编辑'])" align="center" class-name="small-padding fixed-width" width="100">
          <template slot-scope="scope">
            <el-button type="primary" v-has="['编辑']" @click.native.prevent="handleUpdate(scope.row)" size="mini">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      </transition>
      <template v-if="tableData.length!=0">
        <transition name="el-fade-in-linear">
        <ADBar :data="tableData" v-loading="listLoading" v-show="showplan"></ADBar>
        </transition>
      </template>
      <!-- 分页 -->
      <!-- <div class="pagination-container">
        <el-pagination background  :page-sizes="[10,20,30, 50]" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.offset " :page-size="listQuery.limit" :total="total" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
      </div> -->
      <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width ="40%">
        <el-form :rules="formRules" ref="dataform" :model="form" autoCompete = "on" label-position="right" label-width="150px" >
          <el-form-item label="绑定广告" prop="advId">
            <el-select v-model="form.advId" class="filter-item" >
              <el-option v-for="item in advList" :key="item.id" :label="item.advTitle" :value="item.id"> </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="时间段" required >
            <el-time-picker
              style="width:18.75rem;"
              is-range
              :clearable="false"
              v-model="time"
              @change="changeTime"
              range-separator="至"
              :default-value ="['00:00', '00:00']"
              value-format = "HH:mm"
              format="HH 点 mm 分"
              start-placeholder="开始时间段"
              end-placeholder="结束时间段">
            </el-time-picker>
          </el-form-item>
          <el-form-item label="备注" prop="resume">
            <el-input v-model="form.resume" style="width:18.75rem;" placeholder="请输入备注"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button :loading = "createLoading" v-if="dialogStatus=='create'" type="primary" @click="createData">保存</el-button>
          <el-button :loading = "updateLoading" v-else type="primary" @click="updateData">修改</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { timeFormatter, HHssFormatter, HHssNumToTimeFormatter, isShowColumnFormatter } from '@/utils/formatter.js'
import { pushTime, checkPushTime, getSimplePushAdv } from '@/api/url.js'
import { httpGet, httpPost, httpPut, httpDelete } from '@/utils/restful.js'
import ADBar from './components/ADBar'
export default {
  components: {
    ADBar
  },
  data () {
    return {
      list: null,
      listLoading: true,
      createLoading: false,
      updateLoading: false,
      deleteLoading: false,
      listQuery: {
        // offset: 1,
        // limit: 10,
        departmentId: this.$store.getters.departmentId,
        advTitle: undefined
      },
      advList: [],
      tableData: [],
      timeFormatter: timeFormatter,
      HHssFormatter: HHssFormatter,
      HHssNumToTimeFormatter: HHssNumToTimeFormatter,
      isShowColumnFormatter: isShowColumnFormatter,
      total: null,
      selectArrayId: [],
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '添加'
      },
      form: {
        advId: undefined,
        departmentId: this.$store.getters.departmentId,
        pushBegin: 0,
        pushEnd: 1439,
        resume: undefined
      },
      formRules: {},
      time: [new Date(2016, 9, 10, 0, 0), new Date(2016, 9, 10, 23, 59)],
      disabled: true,
      dialogFormVisible: false,
      showtable: true,
      showplan: true,
      jsonData: [
        {
          title: '广告名称',
          key: 'advTitle',
          type: 'text'
        },
        {
          title: '时间段开始',
          key: 'pushBegin',
          type: 'text'
        },
        {
          title: '时间段结束',
          key: 'pushEnd',
          type: 'text'
        },
        {
          title: '备注',
          key: 'resume',
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
        // item.advTitle = this.advTargetTypeFormatter(item.type)
        item.pushBegin = this.HHssNumToTimeFormatter(item.pushBegin)
        item.pushEnd = this.HHssNumToTimeFormatter(item.pushEnd)
        // item.resume = this.happenEventFormatter(item.happenEvent)
      })
      this.table2excel(this.jsonData, obj, 'excel.xlsx')
    },
    // 获取列表
    fetchData () {
      for (const k in this.listQuery) {
        if (this.listQuery[k] === '') this.listQuery[k] = undefined
      }
      this.listLoading = true
      httpGet(pushTime, this.listQuery).then(res => {
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
    // 监听时段一
    changeTime (value) {
      if (value === null) {
        this.$message.error('时段不可为空')
      } else {
        this.form.pushBegin = HHssFormatter(value[0])
        this.form.pushEnd = HHssFormatter(value[1])
        this.checkTime()
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
    getAdvList () {
      let self = this
      let params = {
        departmentId: this.$store.getters.departmentId,
        isEnable: 0,
        verifyStatus: 1
      }
      httpGet(getSimplePushAdv, params).then(res => {
        self.advList = res.data
      }).catch(() => {
      })
    },
    checkTime () {
      if (this.form.advId) {
        httpGet(checkPushTime, this.form).then(res => {
          this.$message({
            message: res.message,
            type: 'success',
            duration: 4 * 1000
          })
        }).catch(() => {
        })
      } else {
        this.$message.error('请先选择或创建广告')
      }
    },
    createData () {
      this.$refs.dataform.validate((valid) => {
        if (valid) {
          this.createLoading = true
          this.form = Object.assign(this.form, {departmentId: this.$store.getters.departmentId})
          httpPost(pushTime, this.form).then((res) => {
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
          httpPut(pushTime, updateFormData).then(res => {
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
      // 加载广告
      this.getAdvList()
      // 延迟调用
      self.$nextTick(() => {
        self.$refs['dataform'].resetFields()
        self.resetForm()
      })
    },
    handleUpdate (row) {
      this.form = Object.assign({}, row)
      // this.form.pushBegin = this.HHssNumToTimeFormatter(row.pushBegin)
      // this.form.pushEnd = this.HHssNumToTimeFormatter(row.pushEnd)
      this.time = [new Date(2016, 9, 10, Math.floor(row.pushBegin / 60), Math.floor(row.pushBegin % 60)), new Date(2016, 9, 10, Math.floor(row.pushEnd / 60), Math.floor(row.pushEnd % 60))]
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      // 加载广告
      this.getAdvList()
      this.$nextTick(() => {
        this.$refs.dataform.clearValidate()
      })
    },
    // 重置form表单
    resetForm () {
      this.form = {
        advId: undefined,
        departmentId: this.$store.getters.departmentId,
        pushBegin: 0,
        pushEnd: 1439,
        resume: undefined
      }
    },
    handleDelete () {
      this.$confirm('确定要删除吗？', '提示', {})
        .then(() => {
          this.deleteLoading = true
          httpDelete(pushTime, {ids: this.selectArrayId}).then(res => {
            this.deleteLoading = false
            this.fetchData()
          }).catch(() => {
            this.deleteLoading = false
          })
        })
    }
  }
}
</script>

<template>
  <div class="app-container">
    <div class="table-main">
      <!-- 操作 -->
      <div class="filter-container">
        <el-button class="filter-item" type="primary" @click="fetchData" icon="el-icon-refresh">刷新</el-button>
        <el-button class="filter-item" type="primary" @click="handleh"  icon="el-icon-download" v-has="['导出']" >导出</el-button>
        <el-button class="filter-item" type="primary" :loading="clearLoading" @click="handleClear" icon="el-icon-delete">清除任务</el-button>
      </div>
      <el-table stripe :header-cell-style="{background:'#f3f4f6'}" style="width: 100%" max-height="600" :data="tableData" v-loading.body="listLoading"  element-loading-text="加载中..." border fit highlight-current-row>
        <el-table-column label="相机名称" align="center" prop="localName"></el-table-column>
        <el-table-column label="任务类型" align="center" prop="type">
          <template slot-scope="scope">
            {{taskTypeFormatter(scope.row.type)}}
          </template>
        </el-table-column>
        <el-table-column label="任务状态" align="center" prop="isSuccess">
          <template slot-scope="scope">
            {{isSuccessFormatter(scope.row.isSuccess)}}
          </template>
        </el-table-column>
        <el-table-column label="任务时间" align="center" prop="taskAt">
          <template slot-scope="scope">
            {{timeFormatter(scope.row.taskAt)}}
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination background  :page-sizes="[10,20,30, 50]" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.offset " :page-size="listQuery.limit" :total="total" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
      </div>
      <!-- 清除任务 -->
      <el-dialog  title="清除任务" :visible.sync="dialogFileVisible" width="30%">
        <el-form :rules="formRules" ref="form" :model="form" autoComplete="on" label-position="right" label-width="150px">
          <el-form-item label="相机MAC" prop="mac">
            <el-select v-model = "form.mac" style="width:80%" multiple>
              <el-option v-for="item in localList" :key="item.mac"  :value = "item.mac" :label="item.localName">
                <span style="float: left">{{item.localName}}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{item.mac}}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="类型" prop="type">
            <el-select v-model = "form.type"  style="width:80%">
              <el-option v-for="item in fileType" :key="item.valueNo"  :value = "item.valueNo" :label="item.valueName">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button :loading="loading" type="primary" @click="onSubmit">确认</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { fileType } from '@/utils/selectAble.js'
import { taskTypeFormatter, isSuccessFormatter, timeFormatter } from '@/utils/formatter.js'
import { getCamera, getOperateRecord, OperateRecordClear } from '@/api/url'
import { httpGet, httpPost } from '@/utils/restful'
export default {
  data () {
    return {
      list: null,
      loading: false,
      listLoading: true,
      clearLoading: false,
      listQuery: {
        offset: 1,
        limit: 10
      },
      tableData: [],
      fileType: fileType,
      taskTypeFormatter: taskTypeFormatter,
      isSuccessFormatter: isSuccessFormatter,
      timeFormatter: timeFormatter,
      total: null,
      dialogFileVisible: false,
      localList: [],
      form: {
        type: undefined,
        mac: undefined
      },
      formRules: {
        mac: [
          {required: true, trigger: 'change', message: '必填'}
        ],
        type: [
          {required: true, trigger: 'change', message: '必填'}
        ]
      },
      jsonData: [
        {
          title: '相机名称',
          key: 'localName',
          type: 'text'
        },
        {
          title: '任务类型',
          key: 'type',
          type: 'text'
        },
        {
          title: '任务状态',
          key: 'isSuccess',
          type: 'text'
        },
        {
          title: '任务时间',
          key: 'taskAt',
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
        item.type = this.taskTypeFormatter(item.type)
        item.isSuccess = this.isSuccessFormatter(item.isSuccess)
        item.taskAt = this.timeFormatter(item.taskAt)
      })
      this.table2excel(this.jsonData, obj, 'excel.xlsx')
    },
    fetchData () {
      this.listQuery = Object.assign(this.listQuery, {id: this.$store.getters.departmentId})
      httpGet(getOperateRecord + this.$store.getters.departmentId, this.listQuery).then(res => {
        if (res.data === null || res.data.row === null) {
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
    // -------------清除任务---------- \\
    handleClear () {
      this.clearLoading = true
      httpGet(getCamera + this.$store.getters.departmentId)
        .then(res => {
          if (res.data === null) {
            this.$message.error('请先绑定相机')
          } else {
            this.localList = res.data
            this.dialogFileVisible = true
            this.form = {
              type: undefined,
              mac: undefined
            }
            this.$nextTick(() => {
              this.$refs['form'].resetFields()
            })
          }
          this.clearLoading = false
        }).catch(() => {
          this.clearLoading = false
        })
    },
    onSubmit () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.loading = true
          this.form = Object.assign(this.form, {departmentId: this.$store.getters.departmentId})
          httpPost(OperateRecordClear, this.form)
            .then(res => {
              this.dialogFileVisible = false
              setTimeout(() => { this.Loading = false }, 300)
              this.$message.success(res.message)
            }).catch(() => {
              this.loading = false
            })
        }
      })
    }
  }
}
</script>

<template>
  <div class="app-container">
    <div class="table-main">
      <!-- 操作 -->
      <div class="filter-container">
        <el-select clearable v-model="listQuery.type" style="width: 150px;"  class="filter-item" placeholder="类型">
          <el-option v-for="item in advTargetType" :key="item.valueNo" :label="item.valueName" :value="item.valueNo"></el-option>
        </el-select>
        <el-select clearable v-model="listQuery.enable" style="width: 150px;"  class="filter-item" placeholder="是否启用">
          <el-option v-for="item in enableType" :key="item.valueNo" :label="item.valueName" :value="item.valueNo"></el-option>
        </el-select>
        <el-button class="filter-item" type="primary" @click="handleFilter" icon="el-icon-search">搜索</el-button>
        <el-button class="filter-item" type="primary" @click="fetchData" icon="el-icon-refresh">刷新</el-button>
        <el-button class="filter-item" type="primary" @click="handleh"  icon="el-icon-download" v-has="['导出']" >导出</el-button>
        <el-button class="filter-item" type="primary" v-has="['新增']"  @click="handleCreate"  icon="el-icon-edit">添加</el-button>
        <el-button class="filter-item" type="danger" v-has="['删除所选']" :loading = "deleteLoading" @click="handleDelete" :disabled="disabled" icon="el-icon-close">删除所选</el-button>
      </div>
      <el-table stripe :header-cell-style="{background:'#f3f4f6'}" style="width: 100%" max-height="600" :data="tableData" v-loading.body="listLoading"  @selection-change="handleSelectionChange"  element-loading-text="加载中..." border fit highlight-current-row>
        <el-table-column v-if = "isShowColumnFormatter(['删除所选'])" type="selection" width="40" fixed="left" ></el-table-column>
        <el-table-column label="规则名称" align="center" prop="name"></el-table-column>
        <el-table-column label="类型" align="center" prop="type">
          <template slot-scope="scope">
            {{pushFeeRulesFormatter(scope.row.type)}}
          </template>
        </el-table-column>
        <el-table-column label="付费金额" align="center" prop="price">
          <template slot-scope="scope">
            {{moneyInOutFormatter(scope.row.price)}}
          </template>
        </el-table-column>
        <el-table-column label="最大条数" align="center" prop="maxNum">
          <template slot-scope="scope">
            {{scope.row.type === 0 ? scope.row.maxNum : '-'}}
          </template>
        </el-table-column>
        <el-table-column label="有效天数" align="center" prop="days">
          <template slot-scope="scope">
            {{scope.row.type === 1 ? scope.row.days : '-'}}
          </template>
        </el-table-column>
        <el-table-column label="是否启用" align="center" prop="enable">
          <template slot-scope="scope">
            {{enableFormatter(scope.row.enable)}}
          </template>
        </el-table-column>
        <el-table-column label="备注" align="center" prop="resume"></el-table-column>
        <el-table-column label="更新时间" align="center" prop="updateAt">
          <template slot-scope="scope">
            {{timeFormatter(scope.row.updateAt)}}
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" v-if = "isShowColumnFormatter(['编辑'])" align="center" class-name="small-padding fixed-width" width="100">
          <template slot-scope="scope">
            <el-button type="primary" v-has="['编辑']" @click.native.prevent="handleUpdate(scope.row)" size="mini">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination background  :page-sizes="[10,20,30, 50]" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.offset " :page-size="listQuery.limit" :total="total" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
      </div>
      <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width ="40%">
        <el-form :rules="formRules" ref="dataform" :model="form" autoCompete = "on" label-position="right" label-width="150px" >
          <el-form-item label="规则名称" prop="name">
            <el-input v-model="form.name" style="width:18.75rem;" placeholder="请输入规则名称"></el-input>
          </el-form-item>
          <el-form-item v-if="dialogStatus=='create'" label="类型" prop="type">
            <el-radio v-model="form.type" label="0" border>按条数</el-radio>
            <el-radio v-model="form.type" label="1" border>按时间</el-radio>
          </el-form-item>
          <el-form-item v-if="dialogStatus=='create'" label="付费金额(元)" prop="price">
            <el-input-number v-model="form.price" :step="0.01" :min="0" placeholder="请输入付费金额(元)"></el-input-number>
          </el-form-item>
          <el-form-item v-if="dialogStatus=='create' && form.type == 0" label="最大条数" prop="maxNum" >
            <el-input-number v-model="form.maxNum" :min="1" ></el-input-number>
          </el-form-item>
          <el-form-item v-if="dialogStatus=='create' && form.type == 1" label="有效天数" prop="days" >
            <el-input-number v-model="form.days" :min="1" ></el-input-number>
          </el-form-item>
          <el-form-item label="是否启用" prop="enable">
            <el-radio v-model="form.enable" label="0" border>否</el-radio>
            <el-radio v-model="form.enable" label="1" border>是</el-radio>
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
import { enableType, advTargetType } from '@/utils/selectAble.js'
import { timeFormatter, pushFeeRulesFormatter, moneyInOutFormatter, enableFormatter, isShowColumnFormatter } from '@/utils/formatter.js'
import { pushRules, pagePushRules } from '@/api/url.js'
import { httpGet, httpPost, httpPut, httpDelete } from '@/utils/restful.js'
export default {
  data () {
    return {
      list: null,
      listLoading: true,
      createLoading: false,
      updateLoading: false,
      deleteLoading: false,
      listQuery: {
        offset: 1,
        limit: 10,
        departmentId: this.$store.getters.departmentId,
        type: undefined,
        enable: undefined
      },
      tableData: [],
      enableType: enableType,
      advTargetType: advTargetType,
      timeFormatter: timeFormatter,
      pushFeeRulesFormatter: pushFeeRulesFormatter,
      moneyInOutFormatter: moneyInOutFormatter,
      enableFormatter: enableFormatter,
      isShowColumnFormatter: isShowColumnFormatter,
      total: null,
      selectArrayId: [],
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '添加'
      },
      form: {
        name: undefined,
        departmentId: this.$store.getters.departmentId,
        type: '0',
        price: 0,
        minNum: 1,
        maxNum: 1000,
        days: 1,
        enable: '1',
        resume: undefined
      },
      formRules: {
        name: [
          {required: true, trigger: 'blur', message: '请填写规则名称'}
        ]
      },
      disabled: true,
      dialogFormVisible: false,
      jsonData: [
        {
          title: '规则名称',
          key: 'name',
          type: 'text'
        },
        {
          title: '类型',
          key: 'type',
          type: 'text'
        },
        {
          title: '付费金额',
          key: 'price',
          type: 'text'
        },
        {
          title: '最大条数',
          key: 'maxNum',
          type: 'text'
        },
        {
          title: '有效天数',
          key: 'days',
          type: 'text'
        },
        {
          title: '是否启用',
          key: 'enable',
          type: 'text'
        },
        {
          title: '备注',
          key: 'resume',
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
        item.price = this.moneyInOutFormatter(item.price)
        item.maxNum = item.type === 0 ? item.maxNum : '-'
        item.days = item.type === 1 ? item.days : '-'
        item.enable = this.enableFormatter(item.enable)
        item.updateAt = this.timeFormatter(item.updateAt)
        item.type = this.pushFeeRulesFormatter(item.type)
        // item.resume = this.happenEventFormatter(item.happenEvent)
      })
      this.table2excel(this.jsonData, obj, 'excel.xlsx')
    },
    // 获取列表
    fetchData () {
      this.listLoading = true
      httpGet(pagePushRules, this.listQuery).then(res => {
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
    createData () {
      this.$refs.dataform.validate((valid) => {
        if (valid) {
          this.createLoading = true
          let param = this.form
          // string转num
          param.type = Number(param.type)
          param.enable = Number(param.enable)
          if (param.type === 0) {
            param.days = 0
          } else if (param.type === 1) {
            param.maxNum = 0
          }
          httpPost(pushRules, param).then((res) => {
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
          let param = this.form
          // string转num
          param.type = Number(param.type)
          param.enable = Number(param.enable)
          if (param.type === 0) {
            param.days = 0
          } else if (param.type === 1) {
            param.maxNum = 0
          }
          httpPut(pushRules, param).then(res => {
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
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      // 延迟调用
      this.$nextTick(() => {
        this.$refs['dataform'].resetFields()
        this.resetForm()
      })
    },
    handleUpdate (row) {
      this.form = Object.assign({}, row)
      // num转string
      this.form.type = String(this.form.type)
      this.form.enable = String(this.form.enable)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs.dataform.clearValidate()
      })
    },
    // 重置form表单
    resetForm () {
      this.form = {
        name: undefined,
        departmentId: this.$store.getters.departmentId,
        type: '0',
        price: 0,
        minNum: 1,
        maxNum: 1000,
        days: 1,
        enable: '1',
        resume: undefined
      }
    },
    handleDelete () {
      this.$confirm('确定要删除吗？', '提示', {})
        .then(() => {
          this.deleteLoading = true
          httpDelete(pushRules, {ids: this.selectArrayId}).then(res => {
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

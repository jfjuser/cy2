<template>
  <div class="app-container">
    <div class="table-main">
      <!-- 操作 -->
      <div class="filter-container">
        <el-select clearable v-model="listQuery.type" style="width: 150px;"  class="filter-item" placeholder="类型">
          <el-option v-for="item in identityType" :key="item.valueNo" :label="item.valueName" :value="item.valueNo"></el-option>
        </el-select>
        <el-button class="filter-item" type="primary" @click="handleFilter" icon="el-icon-search">搜索</el-button>
        <el-button class="filter-item" type="primary" @click="fetchData" icon="el-icon-refresh">刷新</el-button>
        <el-button class="filter-item" type="primary" @click="handleh"  icon="el-icon-download" v-has="['导出']" >导出</el-button>
        <el-button class="filter-item" type="primary" v-has="['新增']"  @click="handleCreate"  icon="el-icon-edit">添加</el-button>
        <el-button class="filter-item" type="danger" :loading = "deleteLoading" @click="handleDelete" :disabled="disabled" icon="el-icon-close">删除所选</el-button>
      </div>
      <el-table stripe :header-cell-style="{background:'#f3f4f6'}" style="width: 100%" max-height="600" :data="tableData" v-loading.body="listLoading"  @selection-change="handleSelectionChange"  element-loading-text="加载中..." border fit highlight-current-row>
        <el-table-column type="selection" width="40" fixed="left" ></el-table-column>
        <el-table-column label="名称" align="center" prop="name"></el-table-column>
        <el-table-column label="价格" align="center" prop="price">
          <template slot-scope="scope">
            {{moneyFormatter(scope.row.price)}}
          </template>
        </el-table-column>
        <el-table-column label="积分" align="center" prop="points"></el-table-column>
        <el-table-column label="类型" align="center" prop="type">
          <template slot-scope="scope">
            {{identityFormatter(scope.row.type)}}
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
          <el-form-item label="类型" prop="type">
            <el-radio v-model="form.type" label="0" border>企业</el-radio>
            <el-radio v-model="form.type" label="1" border>个人</el-radio>
          </el-form-item>
          <el-form-item label="付费金额(元)" prop="price">
            <el-input-number v-model="form.price" :step="0.01" :min="0" :max="20000" placeholder="请输入付费金额(元)"></el-input-number><span style="color: red; margin-left: 10px">限额两万,有意见去跟银行谈</span>
          </el-form-item>
          <el-form-item label="积分" prop="points" >
            <el-input-number v-model="form.points" :min="1" ></el-input-number>
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
import { identityType } from '@/utils/selectAble.js'
import { isShowColumnFormatter, timeFormatter, identityFormatter, moneyFormatter } from '@/utils/formatter.js'
import { pagePointsRules, pointsRules } from '@/api/url.js'
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
        type: undefined
      },
      tableData: [],
      identityType: identityType,
      timeFormatter: timeFormatter,
      identityFormatter: identityFormatter,
      moneyFormatter: moneyFormatter,
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
        points: 0,
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
          title: '名称',
          key: 'name',
          type: 'text'
        },
        {
          title: '价格',
          key: 'price',
          type: 'text'
        },
        {
          title: '积分',
          key: 'points',
          type: 'text'
        },
        {
          title: '类型',
          key: 'type',
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
        item.price = this.moneyFormatter(item.price)
        item.type = this.identityFormatter(item.type)
        item.updateAt = this.timeFormatter(item.updateAt)
      })
      this.table2excel(this.jsonData, obj, 'excel.xlsx')
    },
    // 获取列表
    fetchData () {
      this.listLoading = true
      httpGet(pagePointsRules, this.listQuery).then(res => {
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
          httpPost(pointsRules, param).then((res) => {
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
          httpPut(pointsRules, param).then(res => {
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
        points: 0,
        resume: undefined
      }
    },
    handleDelete () {
      this.$confirm('确定要删除吗？', '提示', {})
        .then(() => {
          this.deleteLoading = true
          httpDelete(pointsRules, {ids: this.selectArrayId}).then(res => {
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

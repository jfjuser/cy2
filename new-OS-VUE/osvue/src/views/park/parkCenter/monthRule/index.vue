<template>
  <div class="app-container">
    <div class="table-main">
      <!-- 操作 -->
      <div class="filter-container">
        <el-button class="filter-item" type="primary" @click="fetchData"  icon="el-icon-refresh">刷新</el-button>
        <el-button class="filter-item" type="primary" v-has="['新增']"  @click="handleCreate"  icon="el-icon-edit">添加</el-button>
        <el-button class="filter-item" type="primary" @click="handleh"  icon="el-icon-download" v-has="['导出']" >导出</el-button>
        <el-button class="filter-item" type="danger" v-has="['删除']"  @click="handleDelete" :disabled="disabled" icon="el-icon-close">删除所选</el-button>
      </div>
      <el-table stripe :header-cell-style="{background:'#f3f4f6'}" style="width: 100%" max-height="600"  @selection-change="handleSelectionChange"  :data="tableData" v-loading.body="listLoading"  element-loading-text="加载中..." border fit highlight-current-row>
        <el-table-column type="selection" width="40" fixed="left" ></el-table-column>
        <el-table-column label="包月个数" align="center" prop="monthNumber"></el-table-column>
        <el-table-column label="包月金额" align="center" prop="monthPrice">
          <template slot-scope="scope">
            {{moneyFormatter(scope.row.monthPrice)}}
          </template>
        </el-table-column>
        <el-table-column label="模式" align="center" prop="modes">
          <template slot-scope="scope">
            {{modeFormatter(scope.row.modes)}}
          </template>
        </el-table-column>
        <el-table-column label="备注信息" align="center" prop="remarks"></el-table-column>
        <el-table-column fixed="right" label="操作" align="center" class-name="small-padding fixed-width" width="150" v-if = "isShowColumnFormatter(['编辑'])">
          <template slot-scope="scope">
              <el-button type="primary" v-has="['编辑']" @click.native.prevent="handleUpdate(scope.row)" size="mini">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination background  :page-sizes="[10,20,30, 50]" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.offset " :page-size="listQuery.limit" :total="total" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
      </div>
      <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
        <el-form ref="dataform" :model="form" :rules="formRules"  autoCompete = "on" label-position="right" label-width="150px" >
          <el-form-item label="包月个数" prop="monthNumber" >
            <el-input-number v-model="form.monthNumber"  :min="1" ></el-input-number>
          </el-form-item>
          <el-form-item label="总收费(元)" prop="monthPrice">
            <el-input-number  v-model="form.monthPrice" :step="0.01" :min="0" placeholder="请输入总收费(元)"></el-input-number>
          </el-form-item>
          <el-form-item label="模式" prop="modes">
            <el-radio v-model="form.modes" label="1" border>默认(区分特殊缴费金额)</el-radio>
            <el-radio v-model="form.modes" label="2" border>通用(车主可选通用模式的任意规则进行自助充值!)</el-radio>
          </el-form-item>
          <!-- 说明 -->
          <div style="color:red;font-size:14px;">
              <p style="text-indent: 54px">说明：a.默认 -> 车主自助充值时只能选择最近一次充值所用充值规则</p>
              <p style="text-indent: 158px">如: 区分大小车、业主/外部车辆、地上/地下停车等同一月数有部分车辆收费不同</p>
              <p style="text-indent: 96px">b.通用 -> 车主自助充值时都可以选择该规则，不区分车类型</p>
              <p style="text-indent: 158px">0元(免费)及需要特殊判断区分缴费金额请使用默认模式</p>
              <p style="text-indent: 96px">c.充值功能仅限已开通固定车的车牌使用</p>
          </div>
          <el-form-item label="备注信息" prop="remarks">
            <el-input type="textarea" v-model="form.remarks" placeholder="请输入备注信息"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button v-if="dialogStatus=='create'" type="primary" :loading="createLoading" @click="createData">保存</el-button>
          <el-button v-else type="primary" :loading="updateLoading" @click="updateData">修改</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getChargeRulesPage, ChargeRules } from '@/api/url'
import { httpGet, httpPut, httpPost, httpDelete } from '@/utils/restful'
import { statusType } from '@/utils/selectAble.js'
import { moneyFormatter, isShowColumnFormatter, modeFormatter } from '@/utils/formatter.js'
export default {
  data () {
    return {
      list: null,
      listLoading: true,
      updateLoading: false,
      createLoading: false,
      listQuery: {
        offset: 1,
        limit: 10
      },
      tableData: [],
      total: null,
      statusType: statusType,
      moneyFormatter: moneyFormatter,
      isShowColumnFormatter: isShowColumnFormatter,
      modeFormatter: modeFormatter,
      selectArrayId: [],
      dialogFormVisible: false,
      dialogStatus: '',
      disabled: true,
      textMap: {
        update: '编辑',
        create: '添加'
      },
      form: {
        id: undefined,
        monthNumber: 0,
        monthPrice: 0,
        modes: '1',
        remarks: undefined
      },
      formRules: {
        monthNumber: [
          {required: true, trigger: 'blur', message: '不可为空'}
        ],
        monthPrice: [
          {required: true, trigger: 'blur', message: '不可为空'}
        ],
        remarks: [
          {required: true, trigger: 'blur', message: '不可为空'}
        ]
      },
      jsonData: [
        {
          title: '包月个数',
          key: 'monthNumber',
          type: 'text'
        },
        {
          title: '包月金额',
          key: 'monthPrice',
          type: 'text'
        },
        {
          title: '模式',
          key: 'modes',
          type: 'text'
        },
        {
          title: '备注信息',
          key: 'remarks',
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
        item.monthPrice = this.moneyFormatter(item.monthPrice)
        item.modes = this.modeFormatter(item.modes)
      })
      this.table2excel(this.jsonData, obj, 'excel.xlsx')
    },
    fetchData () {
      this.listLoading = true
      httpGet(getChargeRulesPage + this.$store.getters.departmentId, this.listQuery).then(res => {
        if (res.data === null || res.data.rows === null) {
          this.tableData = []
          this.total = 0
        } else {
          this.tableData = res.data.rows
          this.total = res.data.total
        }
        this.listLoading = false
      }).catch(() => {})
    },
    handleSizeChange (val) {
      this.listQuery.limit = val
      this.fetchData()
    },
    handleCurrentChange (val) {
      this.listQuery.offset = val
      this.fetchData()
    },
    // 重置form表单
    resetForm () {
      this.form = {
        id: undefined,
        monthNumber: 0,
        monthPrice: undefined,
        modes: '1',
        remarks: undefined
      }
    },
    handleCreate () {
      let self = this
      self.dialogStatus = 'create'
      self.dialogFormVisible = true
      // 延迟调用
      self.$nextTick(() => {
        self.$refs['dataform'].resetFields()
        self.resetForm()
      })
    },
    handleUpdate (row) {
      this.form = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs.dataform.clearValidate()
      })
    },
    // 新增
    createData () {
      this.$refs.dataform.validate((valid) => {
        if (valid) {
          if (this.form.modes !== '2' || this.form.monthPrice > 0) {
            this.createLoading = true
            this.form = Object.assign(this.form, {departmentId: this.$store.getters.departmentId})
            httpPost(ChargeRules, this.form).then((res) => {
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
          } else {
            this.$message.warning('通用模式不可以设置为免费')
          }
        }
      })
    },
    // 修改
    updateData () {
      this.$refs.dataform.validate((valid) => {
        if (valid) {
          this.updateLoading = true
          this.form = Object.assign(this.form, {departmentId: this.$store.getters.departmentId})
          httpPut(ChargeRules, this.form).then(res => {
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
    // 删除选中
    handleDelete () {
      this.$confirm('确认提交吗？', '提示', {})
        .then(() => {
          this.deleteLoading = true
          httpDelete(ChargeRules, {ids: this.selectArrayId}).then(res => {
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
    }
  }
}
</script>

 <style lang="scss" scoped>
  .demo-table-expand {
    font-size: 0;
    label {
      width: 90px;
      color: #99a9bf;
    }
    .el-form-item {
      margin-right: 0;
      margin-bottom: 0;
      width: 50%;
    }
  }
</style>

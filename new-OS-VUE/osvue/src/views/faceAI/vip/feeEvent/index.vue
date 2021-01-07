<template>
  <div class="app-container">
    <div class="table-main">
      <!-- 操作 -->
      <div class="filter-container">
        <el-button class="filter-item" type="primary" v-has="['新增']"  @click="handleCreate"  icon="el-icon-edit">添加</el-button>
        <el-button class="filter-item" type="primary" @click="handleh"  icon="el-icon-download" v-has="['导出']" >导出</el-button>
        <el-button class="filter-item" type="danger" :loading = "deleteLoading" @click="handleDelete" :disabled="disabled" icon="el-icon-close">删除所选</el-button>
      </div>
      <el-table stripe :header-cell-style="{background:'#f3f4f6'}" style="width: 100%" max-height="600" :data="tableData" v-loading.body="listLoading"  @selection-change="handleSelectionChange"  element-loading-text="加载中..." border fit highlight-current-row>
        <el-table-column type="selection" width="40" fixed="left" ></el-table-column>
        <el-table-column label="功能标识" align="center" prop="eventUnicode">
          <template slot-scope="scope">
            {{eventFeeTypeFormatter(scope.row.eventUnicode)}}
          </template>
        </el-table-column>
        <el-table-column label="提示内容" align="center" prop="eventName"></el-table-column>
        <el-table-column label="需要积分" align="center" prop="points"></el-table-column>
        <el-table-column label="开启积分" align="center" prop="openPoint"></el-table-column>
        <el-table-column label="最小剩余积分" align="center" prop="minPoint"></el-table-column>
        <el-table-column label="状态" align="center" prop="status">
          <template slot-scope="scope">
            {{enableFormatter(scope.row.status)}}
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" v-if = "isShowColumnFormatter(['编辑'])" align="center" class-name="small-padding fixed-width" width="100">
          <template slot-scope="scope">
            <el-button type="primary" v-has="['编辑']" @click.native.prevent="handleUpdate(scope.row)" size="mini">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width ="40%">
        <el-form :rules="formRules" ref="dataform" :model="form" autoCompete = "on" label-position="right" label-width="150px" >
          <el-form-item label="功能标识" prop="eventUnicode">
            <el-select v-model="form.eventUnicode"  class="filter-item" >
              <el-option v-for="item in eventFeeType" :key="item.valueNo" :label="item.valueName" :value="item.valueNo"> </el-option>
            </el-select>
            <el-input v-model="form.eventUnicode" style="width:18.75rem;" maxlength="20" placeholder="请输入功能标识,不可乱填,建议取选择框的值"></el-input>
          </el-form-item>
          <el-form-item label="提示内容" prop="eventName">
            <el-input v-model="form.eventName" style="width:18.75rem;" maxlength="128" placeholder="请输入提示内容"></el-input>
          </el-form-item>
          <el-form-item label="折扣率" prop="discount">
            <el-input-number v-model="form.discount" :min="0.01" :max="1" :step="0.01" :precision="2"></el-input-number><span style="color:red;font-size:14px;margin-left:20px">{{(form.discount * 10).toFixed(1)}}折</span>
          </el-form-item>
          <el-form-item label="需要积分" prop="points">
            <el-input-number v-model="form.points" :min="1" :max="1000000000" :precision="0"></el-input-number>
            <div style="color:red;font-size:14px;">
              原价: <span style="text-decoration: line-through red;margin-right:20px">{{Math.floor(form.points / form.discount)}}积分({{(form.points / 1000 / form.discount).toFixed(2)}}元)</span>  应收: {{form.points}}积分({{(form.points / 1000).toFixed(2)}}元)
            </div>
          </el-form-item>
          <el-form-item label="开启积分" prop="openPoint">
            <el-input-number v-model="form.openPoint" :min="0" :max="1000000000" :precision="0"></el-input-number><span style="color:red;font-size:14px;margin-left:20px">需预存 ≈ {{(form.openPoint / 1000).toFixed(2)}}元</span>
          </el-form-item>
          <el-form-item label="最小剩余积分" prop="minPoint">
            <el-input-number v-model="form.minPoint" :min="-10000" :max="1000000000" :precision="0"></el-input-number><span style="color:red;font-size:14px;margin-left:20px">≈  {{(form.minPoint / 1000).toFixed(2)}}元</span>
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-radio v-model="form.status" label="0" border disabled>不启用</el-radio>
            <el-radio v-model="form.status" label="1" border>启用</el-radio>
          </el-form-item>
          <!-- 说明 -->
          <div style="color:red;font-size:14px;">
            <p style="text-indent: 54px">说明：1. 1000积分 ≈ 1元</p>
            <p style="text-indent: 96px">2. 平台默认显示会加上折扣价,实际支付金额和设置的一样</p>
            <p style="text-indent: 96px">3. 支付要下单只支持最小0.01元!!!(小于10积分要注意,说的就是相机每月收费)</p>
            <p style="text-indent: 96px">4. 最小剩余积分应小于等于开启需要预存积分, 不够会关闭这个功能</p>
          </div>
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
import { isShowColumnFormatter, enableFormatter, eventFeeTypeFormatter } from '@/utils/formatter.js'
import { feeEvent, pageFeeEvent } from '@/api/url.js'
import { httpGet, httpPost, httpPut, httpDelete } from '@/utils/restful.js'
import { eventFeeType } from '@/utils/selectAble.js'
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
        limit: 10
      },
      tableData: [],
      isShowColumnFormatter: isShowColumnFormatter,
      enableFormatter: enableFormatter,
      eventFeeTypeFormatter: eventFeeTypeFormatter,
      eventFeeType: eventFeeType,
      total: null,
      selectArrayId: [],
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '添加'
      },
      form: {
        eventUnicode: undefined,
        eventName: undefined,
        points: 10,
        discount: 0.50,
        openPoint: 100000, // 100元
        minPoint: -1000,
        status: '1'
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
          title: '功能标识',
          key: 'eventUnicode',
          type: 'text'
        },
        {
          title: '提示内容',
          key: 'eventName',
          type: 'text'
        },
        {
          title: '需要积分',
          key: 'points',
          type: 'text'
        },
        {
          title: '开启积分',
          key: 'openPoint',
          type: 'text'
        },
        {
          title: '最小剩余积分',
          key: 'minPoint',
          type: 'text'
        },
        {
          title: '状态',
          key: 'status',
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
        item.eventUnicode = this.eventFeeTypeFormatter(item.eventUnicode)
        item.status = this.enableFormatter(item.status)
      })
      this.table2excel(this.jsonData, obj, 'excel.xlsx')
    },
    // 获取列表
    fetchData () {
      this.listLoading = true
      httpGet(pageFeeEvent, this.listQuery).then(res => {
        if (res.data === null) {
          this.tableData = []
        } else {
          this.tableData = res.data
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
    createData () {
      this.$refs.dataform.validate((valid) => {
        if (valid) {
          this.createLoading = true
          let param = this.form
          // string转num
          param.type = Number(param.type)
          httpPost(feeEvent, param).then((res) => {
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
          param.status = Number(param.status)
          httpPut(feeEvent, param).then(res => {
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
      this.form.status = String(this.form.status)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs.dataform.clearValidate()
      })
    },
    // 重置form表单
    resetForm () {
      this.form = {
        eventUnicode: undefined,
        eventName: undefined,
        points: 10,
        discount: 0.50,
        openPoint: 100000, // 100元
        minPoint: -1000,
        status: '1'
      }
    },
    handleDelete () {
      this.$confirm('确定要删除吗？', '提示', {})
        .then(() => {
          this.deleteLoading = true
          httpDelete(feeEvent, {ids: this.selectArrayId}).then(res => {
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

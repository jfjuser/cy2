<template>
  <div class="app-container">
    <div class="table-main">
      <div class="filter-container">
        <el-button class="filter-item add" type="primary" icon="el-icon-edit" @click="dialogFormVisible = true">添加</el-button>
        <el-button class="filter-item" type="primary" @click="handleh"  icon="el-icon-download" v-has="['导出']" >导出</el-button>
        <el-button class="filter-item" type="danger" :loading="deleteLoading"
        :disabled="disabled" icon="el-icon-close" @click="delOrder">删除所选</el-button>
      </div>
      <!-- 添加命令 -->
      <el-dialog title="添加命令" :visible.sync="dialogFormVisible">
          <el-form :rules="formRules" ref="dataform" :model="form" autoCompete = "on" label-position="right" label-width="120px" >
            <el-form-item label="命令" prop="value">
              <el-input v-model="form.value"  clearable placeholder="请输入命令"></el-input>
            </el-form-item>
            <el-form-item label="备注信息" >
              <el-input type="textarea" v-model="form.remake" clearable placeholder="请输入备注信息"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取消</el-button>
            <el-button :loading = "updataLoading" type="primary" @click="addOrder">添加</el-button>
          </div>
        </el-dialog>
        <!-- 修改命令 -->
        <el-dialog title="修改命令" :visible.sync="assignVisible">
          <el-form :rules="formRules" ref="dataform" :model="form1" autoCompete = "on" label-position="right" label-width="120px" >
            <el-form-item label="命令" prop="value">
              <el-input v-model="form1.value"  clearable></el-input>
            </el-form-item>
            <el-form-item label="备注信息" >
              <el-input type="textarea" v-model="form1.remake" clearable placeholder="请输入备注信息"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="assignVisible = false">取消</el-button>
            <el-button :loading = "assignLoading" type="primary" @click="assignOrder">修改</el-button>
          </div>
        </el-dialog>
      <el-table stripe :header-cell-style="{background:'#f3f4f6'}" style="width: 100%" max-height="600" :data="tableData" @selection-change="handleSelectionChange" border fit highlight-current-row>
        <el-table-column type="selection" width="40" fixed="left" ></el-table-column>
        <el-table-column label="命令" align="center" prop="value"></el-table-column>
        <el-table-column label="备注信息" align="center" prop="remake"></el-table-column>
        <el-table-column fixed="right" label="操作" align="center" class-name="small-padding fixed-width" width="300">
          <template slot-scope="scope">
            <!-- 0表示否 1代表是默认 -->
            <el-button :disabled="scope.row.isDefault === 1" type="primary" class="changes" size="mini" @click="assign(scope.row)">修改</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import { getOrderList, optionsOrder } from '@/api/url'
import { httpGet, httpPost, httpDelete, httpPut } from '@/utils/restful'
export default {
  data () {
    return {
      tableData: [],
      deleteLoading: false,
      disabled: true,
      dialogFormVisible: false,
      updataLoading: false,
      assignVisible: false,
      assignLoading: false,
      selectArrayId: [],
      form: {
        id: undefined,
        value: undefined,
        remake: undefined
      },
      form1: {
        id: undefined,
        value: undefined,
        remake: undefined
      },
      formRules: {
        value: [
          {required: true, trigger: 'blur', message: '不可为空'}
        ],
        remake: [
          {required: true, trigger: 'blur', message: '不可为空'}
        ]
      },
      jsonData: [
        {
          title: '命令',
          key: 'value',
          type: 'text'
        },
        {
          title: '备注信息',
          key: 'remake',
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
      this.table2excel(this.jsonData, obj, 'excel.xlsx')
    },
    fetchData () {
      httpGet(getOrderList).then((res) => {
        this.tableData = res
      })
    },
    assignOrder () {
      console.log(this.form1)
      this.$refs.dataform.validate((valid) => {
        if (valid) {
          httpPut(optionsOrder, this.form1).then((res) => {
            console.log(res)
            this.$message.success(res.message)
            this.assignVisible = false
            this.fetchData()
          })
        }
      })
    },
    assign (item) {
      this.assignVisible = true
      const abb = JSON.stringify(item)
      this.form1 = JSON.parse(abb)
      // this.form1.value = item.value
      // this.form1.remake = item.remake
    },
    addOrder () {
      this.$refs.dataform.validate((valid) => {
        if (valid) {
          httpPost(optionsOrder, this.form).then((res) => {
            console.log(res)
            this.$message.success(res.message)
            this.dialogFormVisible = false
            this.fetchData()
          })
        }
      })
    },
    delOrder () {
      this.$confirm('确认删除吗？', '提示', {})
        .then(() => {
          httpDelete(optionsOrder, {ids: this.selectArrayId}).then(res => {
            this.$message({
              type: 'success',
              message: res.message,
              duration: 4 * 1000
            })
            this.fetchData()
          }).catch(() => {})
        }).catch(() => {})
    },
    // 选中
    handleSelectionChange (val) {
      this.selectArrayId = []
      val.map(item => {
        this.selectArrayId.push(item.id)
      })
      console.log(this.selectArrayId)
      if (this.selectArrayId.length !== 0) {
        this.disabled = false
      } else {
        this.disabled = true
      }
    }
  }
}
</script>
<style lang="scss" scoped>

</style>

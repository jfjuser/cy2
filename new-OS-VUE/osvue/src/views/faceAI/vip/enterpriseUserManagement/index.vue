<template>
  <div class="app-container">
    <div class="table-main" style="margin-top: 20px;">
      <div class="filter-container">
        <el-input
          style="width: 150px;"
          class="filter-item"
          placeholder="请输入姓名"
          v-model="queryData.businessName"
          clearable>
        </el-input>
        <el-input
          style="width: 150px;"
          class="filter-item"
          placeholder="请输入手机号码"
          v-model="queryData.phone"
          clearable>
        </el-input>
        <el-button class="filter-item" type="primary" @click="search"    icon="el-icon-edit">搜索</el-button>
        <el-button class="filter-item" type="primary" @click="dialogVisible = true"  icon="el-icon-download"  >新建企业用户</el-button>
      </div>
      <el-table
        :data="tableData"
        style="width: 100%">
        <el-table-column
          prop="businessName"
          label="企业名称"
          min-width="25%">
        </el-table-column>
        <el-table-column
          prop="phone"
          label="手机号"
          min-width="25%">
        </el-table-column>
        <el-table-column
          prop="unicode"
          label="unicode"
          min-width="25%">
        </el-table-column>
        <el-table-column label="操作" align="center" prop="endTime" min-width="25%">
          <template slot-scope="scope">
            <el-button @click="deleteIndividualUser(scope.row)" type="primary">删除用户</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        style="margin-top:20px"
        @current-change="currentChange"
        background
        layout="prev, pager, next"
        :page-size="pageSize"
        :total="total">
      </el-pagination>
      <el-dialog
        title="新建企业用户"
        :visible.sync="dialogVisible"
        width="30%">
        <el-form :rules="rules" ref="form" :model="form" label-width="80px">
          <el-form-item label="公司名称">
            <el-input v-model="form.businessName"></el-input>
          </el-form-item>
          <el-form-item label="手机号码" prop="phone">
            <el-input v-model="form.phone"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="newEnterprise()">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import {httpGet, httpPost, httpDelete} from '@/utils/restful'
import { business, addBusiness, delBusiness } from '@/api/url'
import {checkPhone} from '@/utils/validator'
export default {
  data () {
    return {
      pageSize: 5,
      form: {
        phone: undefined,
        businessName: undefined
      },
      dialogVisible: false,
      tableData: [],
      total: undefined,
      queryData: {
        offset: 1,
        limit: 5,
        phone: undefined,
        businessName: undefined
      },
      rules: {
        phone: [
          {required: true, trigger: 'blur', message: '请输入手机号码'},
          {validator: checkPhone, trigger: 'blur', message: '请输入正确的手机号码'}
        ]
      }
    }
  },
  created () {
    this.getData()
  },
  methods: {
    search () {
      this.queryData.offset = 1
      this.getData()
    },
    getData () {
      httpGet(business, this.queryData).then(res => {
        this.tableData = res.data.rows
        this.total = res.data.total
      })
    },
    deleteIndividualUser (row) {
      let self = this
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        httpDelete(delBusiness + '?id=' + row.id).then(res => {
          if (res.code === 1) {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            self.getData()
          } else {
            this.$message({
              message: '删除失败',
              type: 'error'
            })
          }
        }
        ).catch(err => {
          console.log(err)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    currentChange (val) {
      this.queryData.offset = val
      this.getData()
    },
    newEnterprise () {
      let self = this
      this.$refs.form.validate((valid) => {
        console.log(valid)
        if (valid) {
          httpPost(addBusiness, self.form).then(res => {
            self.getData()
            self.dialogVisible = false
            this.$message({
              message: res.message,
              type: 'success',
              duration: 4 * 1000
            })
          }).catch(() => {
            self.dialogVisible = false
          })
        }
      })
    }
  }
}
</script>

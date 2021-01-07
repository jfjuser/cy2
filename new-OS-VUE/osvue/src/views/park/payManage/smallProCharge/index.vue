<template>
  <div class="app-container">
     <div class="table-main">
        <!-- 操作 -->
        <div class="filter-container">
          <el-button class="filter-item" type="primary"   @click="handleFilter" icon="el-icon-refresh">刷新</el-button>
          <el-button class="filter-item" type="primary"  v-has="['用户绑定']" @click="handleCreate"  icon="el-icon-edit">用户绑定</el-button>
          <el-button class="filter-item" type="primary" @click="handleh"  icon="el-icon-download" v-has="['导出']" >导出</el-button>
          <el-button class="filter-item" type="danger"  v-has="['删除']" :loading = "deleteLoading" @click="handleDelete" :disabled="disabled" icon="el-icon-close">删除所选</el-button>
        </div>
        <el-table stripe :header-cell-style="{background:'#f3f4f6'}" style="width: 100%" max-height="600" :data="tableData" v-loading.body="listLoading" @selection-change="handleSelectionChange" element-loading-text="加载中..." border fit highlight-current-row>
          <el-table-column type="selection" width="40" fixed="left" v-if="isShowColumnFormatter(['删除'])" ></el-table-column>
          <el-table-column label="通道名称" align="center" prop="localName"></el-table-column>
          <el-table-column label="用户名称" align="center" prop="userName"></el-table-column>
        </el-table>
        <!-- 分页 -->
        <div class="pagination-container">
          <el-pagination background  :page-sizes="[10,20,30, 50]" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.offset " :page-size="listQuery.limit" :total="total" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
        </div>
        <el-dialog title="添加" :visible.sync="dialogFormVisible" width="30%">
          <el-form :rules="formRules" ref="dataform" :model="form" autoCompete = "on" label-position="right" label-width="100px" >
            <el-form-item label="相机MAC" prop="macArr">
              <el-select v-model = "form.macArr" multiple >
                <el-option v-for="item in localList" :key="item.mac"  :value = "item.mac" :label="item.localName">
                  <span style="float: left">{{item.localName}}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{item.mac}}</span>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="用户"  prop="userId">
              <el-select v-model = "form.userId">
                <el-option v-for="item in userList" :key="item.id"  :value = "item.id" :label="item.userName"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取消</el-button>
            <el-button :loading = "createLoading" type="primary" @click="createData">保存</el-button>
          </div>
        </el-dialog>
      </div>
  </div>
</template>

<script>
// import { monthlyData } from '@/Mock'
import { isShowColumnFormatter } from '@/utils/formatter.js'
import { getSmallProCharge, getOutCamera, SmallProChargeBindUser, SmallProChargeGetUser, SmallProChargeDeleteUser } from '@/api/url'
import { httpGet, httpPost, httpDelete } from '@/utils/restful'
export default {
  data () {
    return {
      list: null,
      listLoading: true,
      createLoading: false,
      deleteLoading: false,
      listQuery: {
        offset: 1,
        limit: 10
      },
      tableData: [],
      dialogFormVisible: false,
      isShowColumnFormatter: isShowColumnFormatter,
      total: null,
      selectArrayId: [],
      disabled: true,
      localList: [],
      userList: [],
      form: {
        id: undefined,
        userId: undefined,
        macArr: []
      },
      time: [],
      formRules: {
        userId: [
          {required: true, trigger: 'blur', message: '不可为空'}
        ],
        macArr: [
          {required: true, trigger: 'blur', message: '不可为空'}
        ]
      },
      jsonData: [
        {
          title: '通道名称',
          key: 'localName',
          type: 'text'
        },
        {
          title: '用户名称',
          key: 'userName',
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
    this.getCameraList()
    this.getUser()
  },
  methods: {
    handleh () {
      let obj = JSON.parse(JSON.stringify(this.tableData))
      this.table2excel(this.jsonData, obj, 'excel.xlsx')
    },
    // 获取用户
    getUser () {
      httpGet(SmallProChargeGetUser + this.$store.getters.departmentId)
        .then(res => {
          this.userList = res.data
        }).catch(() => {})
    },
    // 获取相机
    getCameraList () {
      httpGet(getOutCamera + '/' + this.$store.getters.departmentId).then(res => {
        if (res.data.length === 0) {
          this.$message({
            message: '请先配置出口通道',
            type: 'warning',
            duration: 4 * 1000
          })
        } else {
          this.localList = res.data
        }
      }).catch(() => {})
    },
    fetchData () {
      this.listQuery = Object.assign(this.listQuery, {departmentId: this.$store.getters.departmentId})
      httpGet(getSmallProCharge, this.listQuery).then(res => {
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
    // 重置form表单
    resetForm () {
      this.form = {
        id: undefined,
        userId: undefined,
        macArr: []
      }
    },
    // 重置搜索条件
    handleRefresh () {
      this.listQuery = {
        offset: 1,
        limit: 10
      }
      this.fetchData()
    },
    handleCreate () {
      this.dialogFormVisible = true
      // 延迟调用
      this.$nextTick(() => {
        this.$refs['dataform'].resetFields()
        this.resetForm()
      })
    },
    // 搜索
    handleFilter () {
      this.listQuery.offset = 1
      this.fetchData()
    },
    // 新增
    createData () {
      this.$refs.dataform.validate((valid) => {
        if (valid) {
          this.createLoading = true
          this.form = Object.assign(this.form, {departmentId: this.$store.getters.departmentId})
          httpPost(SmallProChargeBindUser, this.form).then((res) => {
            this.handleRefresh()
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
    // 删除选中
    handleDelete () {
      this.$confirm('确认提交吗？', '提示', {})
        .then(() => {
          this.deleteLoading = true
          httpDelete(SmallProChargeDeleteUser, {ids: this.selectArrayId}).then(res => {
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
    }
  }
}
</script>

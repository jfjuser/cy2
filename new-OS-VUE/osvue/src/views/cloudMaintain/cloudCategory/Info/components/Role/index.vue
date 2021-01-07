<template>
  <div>
    <!-- 操作 -->
    <div class="filter-container">
      <el-button class="filter-item" type="primary"   @click="handleRefresh"  icon="el-icon-refresh">刷新</el-button>
      <el-button class="filter-item" type="primary"   @click="handleCreate"  icon="el-icon-edit">添加</el-button>
      <el-button class="filter-item" type="primary" @click="handleh"  icon="el-icon-download" v-has="['导出']" >导出</el-button>
      <el-button class="filter-item" type="danger"  :loading="deleteLoading" @click="handleDelete" :disabled="disabled" icon="el-icon-close">删除所选</el-button>
    </div>
    <el-table stripe :header-cell-style="{background:'#f3f4f6'}" style="width: 100%" max-height="600" :data="tableData" v-loading.body="listLoading" @selection-change="handleSelectionChange" element-loading-text="加载中..." border fit highlight-current-row>
      <el-table-column type="selection" width="40" fixed="left" ></el-table-column>
      <el-table-column label="角色名" align="center" prop="name"></el-table-column>
      <el-table-column label="描述信息" align="center" prop="resume"></el-table-column>
      <el-table-column fixed="right" label="操作" align="center" class-name="small-padding fixed-width" width="300">
        <template slot-scope="scope">
          <el-button type="primary" @click.native.prevent="handleUpdate(scope.row)" size="mini">编辑</el-button>
          <el-button type="success" @click.native.prevent="handleRole(scope.row)" size="mini">分配权限</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination background  :page-sizes="[5,10,20,30, 50]" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.offset " :page-size="listQuery.limit" :total="total" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
    </div>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :rules="formRules" ref="dataform" :model="form" autoCompete = "on" label-position="right" label-width="150px" >
        <el-form-item label="角色名" prop="name">
          <el-input v-model="form.name"  clearable placeholder="请输入角色名"></el-input>
        </el-form-item>
        <el-form-item label="描述信息" >
          <el-input type="textarea" v-model="form.resume" clearable placeholder="请输入描述信息"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button :loading="createLoading" v-if="dialogStatus=='create'" type="primary" @click="createData">保存</el-button>
        <el-button :loading="updateLoading" v-else type="primary" @click="updateData">修改</el-button>
      </div>
    </el-dialog>
    <!-- 权限 -->
    <el-dialog
      title="分配权限"
      :visible.sync="dialogVisible"
      width="30%"
      >
      <el-tree
        :data="treeData"
        show-checkbox
        node-key="id"
        accordion
        ref="tree"
        highlight-current
        :default-checked-keys="defaultCheckedKeys"
        :props="defaultProps">
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button :loading= "roleLoading" type="primary" @click="submitRoles">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { getDtypeRoles, createDtypeRoles, Roles, RolesPermisson } from '@/api/url'
import { httpGet, httpPost, httpPut, httpDelete } from '@/utils/restful'
export default {
  name: 'role',
  props: ['id', 'level'],
  data () {
    return {
      list: null,
      listLoading: true,
      createLoading: false,
      deleteLoading: false,
      updateLoading: false,
      roleLoading: false,
      listQuery: {
        offset: 1,
        limit: 5
      },
      tableData: [],
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '添加'
      },
      total: null,
      selectArrayId: [],
      disabled: true,
      form: {
        id: undefined,
        name: '',
        resume: ''
      },
      formRules: {
        name: [
          {required: true, trigger: 'blur', message: '请输入角色名'}
        ]
      },
      // 分配默认权限
      dialogVisible: false,
      treeData: [],
      defaultCheckedKeys: [],
      defaultProps: {
        children: 'childrens',
        label: 'name'
      },
      roleId: 0,
      curId: 0,
      jsonData: [
        {
          title: '角色名',
          key: 'name',
          type: 'text'
        },
        {
          title: '描述信息',
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
  watch: {
    id (curVal, oldVal) {
      this.curId = curVal
      this.handleFilter()
    }
  },
  mounted () {
    if (!this.level) this.fetchData()
  },
  methods: {
    handleh () {
      let obj = JSON.parse(JSON.stringify(this.tableData))
      this.table2excel(this.jsonData, obj, 'excel.xlsx')
    },
    handleRefresh () {
      this.listQuery = {
        offset: 1,
        limit: 5
      }
      this.fetchData()
    },
    fetchData () {
      httpGet(getDtypeRoles + this.id, this.listQuery).then(res => {
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
        name: '',
        resume: ''
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
    // 搜索
    handleFilter () {
      this.listQuery.offset = 1
      this.fetchData()
    },
    // 新增
    createData () {
      this.$refs.dataform.validate((valid) => {
        if (valid) {
          this.form = Object.assign(this.form, { connId: this.id })
          httpPost(createDtypeRoles, this.form).then((res) => {
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
    // 修改
    updateData () {
      this.$refs.dataform.validate((valid) => {
        if (valid) {
          this.updateLoading = true
          const updateFormData = Object.assign({}, this.form)
          httpPut(Roles, updateFormData).then(res => {
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
    // 删除选中
    // handleDelete () {
    //   this.$confirm('确认删除该角色吗？', '提示', {
    //     type: 'warning'
    //   })
    //     .then(() => {
    //       this.deleteLoading = true
    //       httpDelete(Roles, {ids: this.selectArrayId}).then(res => {
    //         this.deleteLoading = false
    //         this.fetchData()
    //         this.$message({
    //           type: 'success',
    //           message: res.message,
    //           duration: 4 * 1000
    //         })
    //       }).catch(() => {
    //         this.deleteLoading = false
    //       })
    //     }).catch(() => {})
    // },
    handleDelete () {
      const h = this.$createElement
      let message = ['删除后所有账号将不能分配所选角色,已分配所选角色账户不影响正常使用']
      let info = {
        h,
        message,
        firstconfirmButtonText: '确定',
        firstcancelButtonText: '取消',
        secondmessgae: '您已了解删除后果，确定还要继续删除吗',
        secondconfirmButtonText: '我再想想',
        secondcancelButtonText: '确定删除'
      }
      this.MessageBox(info).then(() => {
        this.deleteLoading = false
      }).catch(() => {
        this.deleteLoading = true
        // document.onkeydown = undefined
        httpDelete(Roles, {ids: this.selectArrayId}).then(res => {
          this.deleteLoading = false
          this.fetchData()
          this.$message({
            type: 'success',
            message: res.message,
            duration: 4 * 1000
          })
        }).catch(() => {
          this.deleteLoading = false
          // document.onkeydown = undefined
        })
      })
    },
    // 选中
    handleSelectionChange (val) {
      this.selectArrayId = []
      val.map(item => {
        this.selectArrayId.push(item.id)
      })
      if (this.selectArrayId.length > 0) {
        this.disabled = false
      } else {
        this.disabled = true
      }
    },
    // 获取权限
    handleRole (item) {
      this.roleId = item.id
      httpGet(RolesPermisson + '/' + item.id).then(res => {
        this.treeData = res.data.info
        this.defaultCheckedKeys = res.data.ids
        this.dialogVisible = true
      }).catch(() => {})
    },
    submitRoles () {
      this.roleLoading = true
      let data = {
        id: this.roleId,
        ids: [...this.$refs.tree.getCheckedKeys(), ...this.$refs.tree.getHalfCheckedKeys()]
      }
      httpPost(RolesPermisson, data).then(res => {
        this.roleLoading = false
        this.dialogVisible = false
        this.$message({
          message: res.message,
          type: 'success',
          duration: 4 * 1000
        })
      }).catch(() => {
        this.roleLoading = false
      })
    }
  }
}
</script>

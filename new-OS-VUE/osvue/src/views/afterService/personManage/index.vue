<template>
  <div class="app-container">
    <div class="table-main">
      <!-- 操作 -->
      <div class="filter-container">
        <el-input clearable style="width: 200px;" v-model="listQuery.userName" class="filter-item" placeholder="账号"></el-input>
        <el-select clearable style="width: 200px;" v-model="listQuery.utype" class="filter-item" placeholder="用户类型">
          <el-option value="1" label="发单人">发单人</el-option>
          <el-option value="2" label="接单人">接单人</el-option>
        </el-select>
        <el-select clearable style="width: 200px;" v-model="listQuery.status" class="filter-item" placeholder="状态">
          <el-option value="0" label="无效">无效</el-option>
          <el-option value="1" label="有效">有效</el-option>
        </el-select>
        <el-button class="filter-item" type="primary"   @click="handleFilter" icon="el-icon-search">搜索</el-button>
        <el-button class="filter-item" type="primary"   @click="handleRefresh" icon="el-icon-refresh">刷新</el-button>
        <el-button class="filter-item" type="primary" v-has="['新增']"  @click="handleCreate"  icon="el-icon-edit">添加</el-button>
        <el-button class="filter-item" type="primary" @click="handleh"  icon="el-icon-download" v-has="['导出']" >导出</el-button>
        <el-button class="filter-item" type="danger" v-has="['删除']" :loading = "deleteLoading"   @click="handleDelete" :disabled="disabled" icon="el-icon-close">删除所选</el-button>
      </div>
      <el-table stripe :header-cell-style="{background:'#f3f4f6'}" style="width: 100%" max-height="600" :data="tableData" v-loading.body="listLoading" @selection-change="handleSelectionChange" element-loading-text="加载中..." border fit highlight-current-row>
        <el-table-column type="selection" width="40"  v-if = "isShowColumnFormatter(['删除'])" fixed="left" ></el-table-column>
        <el-table-column label="账号" align="center" prop="userName"></el-table-column>
        <el-table-column label="手机号" align="center" prop="phone"></el-table-column>
        <el-table-column label="用户类型" align="center" prop="utype">
          <template slot-scope="scope">
            <span v-if="scope.row.utype == 1">发单人</span>
            <span v-if="scope.row.utype == 2">接单人</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center" prop="status">
          <template slot-scope="scope">
            <span v-if="scope.row.status == 0">无效</span>
            <span v-if="scope.row.status == 1">有效</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center" prop="createAt">
          <template slot-scope="scope">
            {{timeFormatter(scope.row.createAt)}}
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" v-if = "isShowColumnFormatter(['编辑', '分配角色', '修改密码'])" align="center" class-name="small-padding fixed-width" width="300">
          <template slot-scope="scope">
            <el-button type="primary" v-has="['编辑']" @click.native.prevent="handleUpdate(scope.row)" size="mini">编辑</el-button>
            <el-button type="success" v-has="['分配角色']" @click.native.prevent="handleRole(scope.row)" size="mini">分配角色</el-button>
            <el-button type="primary" v-has="['修改密码']" @click="handlePassword(scope.row)" size="mini">修改密码</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination background  :page-sizes="[10,20,30, 50]" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.offset " :page-size="listQuery.limit" :total="total" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
      </div>
      <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width ="30%">
        <el-form :rules="formRules" ref="dataform" :model="form" autoCompete = "on" label-position="right" label-width="100px" >
          <template v-if="dialogStatus ==='create' ">
            <el-form-item label="账号" prop="userName">
              <el-input  style="width: auto;"  v-model="form.userName" placeholder="请获取账号"></el-input>
              <el-button type="primary" icon="el-icon-refresh" :loading="userNameLoading" @click="handleRefreshUserName">获取账号</el-button>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input  type="password"  style="width: auto;" v-model="form.password"   placeholder="请输入密码"></el-input>
            </el-form-item>
          </template>
          <el-form-item label="手机号" prop="phone">
            <el-input  v-model="form.phone" style="width: auto;"  placeholder="请输入手机号"></el-input>
          </el-form-item>
          <el-form-item label="用户类型" prop="utype">
            <el-radio v-model="form.utype" :label="1"  border>发单人</el-radio>
            <el-radio v-model="form.utype" :label="2"  border>接单人</el-radio>
          </el-form-item>
          <el-form-item label="用户类型" prop="status" v-if="dialogStatus !=='create' ">
            <el-radio v-model="form.status" :label="0"  border>无效</el-radio>
            <el-radio v-model="form.status" :label="1"  border>有效</el-radio>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button :loading = "createLoading" v-if="dialogStatus=='create'" type="primary" @click="createData">保存</el-button>
          <el-button :loading = "updateLoading" v-else type="primary" @click="updateData">修改</el-button>
        </div>
      </el-dialog>
      <!-- 角色 -->
      <el-dialog
        title="分配角色"
        :visible.sync="dialogRoleVisible"
        width="30%"
        >
        <template>
          <el-radio-group v-model="checked" >
            <el-radio v-for="item in roleList"  :label="item.id" :key="item.id">{{item.name}}</el-radio>
          </el-radio-group>
        </template>
        <span slot="footer" class="dialog-footer" >
          <el-button @click="dialogRoleVisible = false">取 消</el-button>
          <el-button :loading = "roleLoading" type="primary" @click="submitRoles">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { checkUserName, checkPsd, checkPhone } from '@/utils/validator.js'
import { isShowColumnFormatter, timeFormatter } from '@/utils/formatter.js'
import { httpGet, httpPost, httpPut, httpDelete } from '@/utils/restful'
import { ASUser, updateASUser, UserRole, getUserName, updatePassword } from '@/api/url'
export default {
  data () {
    return {
      isShowColumnFormatter: isShowColumnFormatter,
      timeFormatter: timeFormatter,
      list: null,
      listLoading: true,
      createLoading: false,
      updateLoading: false,
      deleteLoading: false,
      userNameLoading: false,
      roleLoading: false,
      listQuery: {
        offset: 1,
        limit: 10,
        userName: undefined,
        utype: undefined,
        status: undefined
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
        userName: undefined,
        password: undefined,
        phone: undefined,
        utype: 1,
        dtype: 0
      },
      formRules: {
        userName: [
          {required: true, trigger: 'blur', message: '请获取用户名'},
          {validator: checkUserName, trigger: 'blur'}
        ],
        password: [
          {required: true, trigger: 'blur', message: '请输入密码'},
          {validator: checkPsd, trigger: 'blur', message: '密码为6-12位字母，数字或者下划线'}
        ],
        phone: [
          {required: true, trigger: 'blur', message: '请输入手机号'},
          {validator: checkPhone, trigger: 'blur', message: '请输入11位的手机号码'}
        ],
        utype: [
          {required: true, trigger: 'blur', message: '请选择用户类型'}
        ]
      },
      dialogRoleVisible: false,
      roleId: 0,
      userId: 0,
      checked: undefined,
      roleList: [],
      jsonData: [
        {
          title: '账号',
          key: 'userName',
          type: 'text'
        },
        {
          title: '手机号',
          key: 'phone',
          type: 'text'
        },
        {
          title: '用户类型',
          key: 'utype',
          type: 'text'
        },
        {
          title: '状态',
          key: 'status',
          type: 'text'
        },
        {
          title: '创建时间',
          key: 'createAt',
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
        item.utype = parseInt(item.utype) === 1 ? '发单人' : (parseInt(item.utype) === 2 ? '接单人' : '')
        item.status = parseInt(item.status) === 0 ? '无效' : (parseInt(item.utype) === 1 ? '有效' : '')
        // item.userToName = item.userToName ? item.userToName : '--'
        item.createAt = this.timeFormatter(item.createAt)
      })
      this.table2excel(this.jsonData, obj, 'excel.xlsx')
    },
    handleRefresh () {
      this.listQuery = {
        offset: 1,
        limit: 10,
        userName: undefined,
        status: undefined,
        utype: undefined
      }
      this.fetchData()
    },
    fetchData () {
      this.listQuery = Object.assign(this.listQuery, {departmentId: this.$store.getters.departmentId})
      httpGet(ASUser, this.listQuery).then(res => {
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
        userName: undefined,
        password: undefined,
        phone: undefined,
        utype: 1,
        dtype: 0
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
    // 刷新用户名
    handleRefreshUserName () {
      this.userNameLoading = true
      httpGet(getUserName).then(res => {
        this.userNameLoading = false
        this.form.userName = res.data
      }).catch(() => {
        this.userNameLoading = false
      })
    },
    // 搜索
    handleFilter () {
      this.listQuery.offset = 1
      this.fetchData()
    },
    // 新增
    createData () {
      let self = this
      this.$refs.dataform.validate((valid) => {
        if (valid) {
          self.createLoading = true
          this.form = Object.assign(this.form, {departmentId: this.$store.getters.departmentId})
          httpPost(ASUser, this.form).then(res => {
            self.fetchData()
            self.dialogFormVisible = false
            setTimeout(() => { this.createLoading = false }, 300)
            this.$message({
              message: res.message,
              type: 'success',
              duration: 4 * 1000
            })
          }).catch(() => {
            self.createLoading = false
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
          httpPut(updateASUser, updateFormData).then(res => {
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
    handleDelete () {
      this.$confirm('确认提交吗？', '提示', {})
        .then(() => {
          this.deleteLoading = true
          httpDelete(ASUser, {ids: this.selectArrayId}).then(res => {
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
    },
    handleRole (row) {
      this.userId = row.id
      httpGet(UserRole + '/' + row.id).then((res) => {
        if (res.data.roleInfo.length === 0) {
          this.$message({
            type: 'warning',
            message: '暂无角色，请先添加角色',
            duration: 4 * 1000
          })
        } else {
          this.checked = res.data.roleId
          this.roleList = res.data.roleInfo
          this.dialogRoleVisible = true
        }
      }).catch(() => {})
    },
    submitRoles () {
      if (this.checked === undefined) {
        this.$message.error('请先选择角色在进行提交！')
      } else {
        this.roleLoading = true
        let data = {
          roleId: this.checked,
          userId: this.userId
        }
        httpPost(UserRole, data).then(res => {
          this.roleLoading = false
          this.dialogRoleVisible = false
          this.$message({
            type: 'success',
            message: res.message,
            duration: 4 * 1000
          })
        }).catch(() => {
          this.roleLoading = false
        })
      }
    },
    // 修改密码
    handlePassword (row) {
      this.$prompt('密码修改', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^(\w){6,12}$/,
        inputErrorMessage: '请输入正确的密码'
      }).then(({ value }) => {
        const data = {
          id: row.id,
          password: value
        }
        httpPost(updatePassword, data)
          .then(res => {
            this.$message.success(res.message)
          }).catch(() => {})
      }).catch(() => {})
    }
  }
}
</script>

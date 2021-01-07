<template>
  <div class="app-container">
    <div class="table-main">
      <!-- 操作 -->
      <div class="filter-container">
        <el-input clearable style="width: 200px;" v-model="listQuery.userName" class="filter-item" placeholder="账号"></el-input>
        <el-input clearable style="width: 200px;" v-model="listQuery.nickName" class="filter-item" placeholder="姓名"></el-input>
        <el-select clearable style="width: 200px;" v-model="listQuery.sex" class="filter-item" placeholder="性别">
          <el-option value="0" label="男">男</el-option>
          <el-option value="1" label="女">女</el-option>
        </el-select>
        <!-- <el-input clearable style="width: 200px;" v-model="listQuery.phone" class="filter-item" placeholder="手机号"></el-input> -->
        <el-button class="filter-item searchs" type="primary" :loading = "listLoading"  @click="handleFilter" icon="el-icon-search">搜索</el-button>
        <el-button class="filter-item" type="primary"   @click="handleRefresh" icon="el-icon-refresh">刷新</el-button>
        <el-button class="filter-item" type="primary" @click="handleh"  icon="el-icon-download" v-has="['导出']" >导出</el-button>
        <el-button class="filter-item add" type="primary" v-has="['新增']"  @click="handleCreate"  icon="el-icon-edit">添加</el-button>
        <el-button class="filter-item" type="danger" v-has="['删除']" :loading = "deleteLoading"   @click="handleDelete" :disabled="disabled" icon="el-icon-close">删除所选</el-button>
      </div>
      <el-table stripe :header-cell-style="{background:'#f3f4f6'}" style="width: 100%" max-height="600" :data="tableData" v-loading.body="listLoading" @selection-change="handleSelectionChange" element-loading-text="加载中..." border fit highlight-current-row>
        <el-table-column type="selection" width="40"  v-if = "isShowColumnFormatter(['删除'])" fixed="left" ></el-table-column>
        <el-table-column label="账号" align="center" prop="userName"></el-table-column>
        <el-table-column :label="themeType === 3 ? '姓名' : '昵称'" align="center" prop="nickName"></el-table-column>
        <el-table-column label="手机号" align="center" prop="phone">
          <template slot-scope="scope">
            <template v-if="isShowColumnFormatter(['隐藏手机号'])">{{scope.row.phone | hiddenPhone}}</template>
            <template v-else>{{scope.row.phone}}</template>
          </template>
        </el-table-column>
        <el-table-column label="邮箱" align="center" prop="email"></el-table-column>
        <el-table-column label="是否超管" align="center" prop="isAdmin">
          <template slot-scope="scope">
            <span v-if="scope.row.isAdmin === null || scope.row.isAdmin === 0">否</span>
            <span v-if="scope.row.isAdmin === 1">是</span>
          </template>
        </el-table-column>
        <el-table-column label="性别" align="center" prop="sex">
          <template slot-scope="scope">
            <span v-if="scope.row.sex == 0">男</span>
            <span v-if="scope.row.sex == 1">女</span>
          </template>
        </el-table-column>
        <el-table-column label="备注信息" align="center" prop="resume"></el-table-column>
        <el-table-column fixed="right" label="操作" v-if = "isShowColumnFormatter(['编辑', '分配角色', '修改密码', '分配超管'])" align="center" class-name="small-padding fixed-width" width="300">
          <template slot-scope="scope">
            <el-button type="primary" v-has="['编辑']" @click.native.prevent="handleUpdate(scope.row)" size="mini">编辑</el-button>
            <el-button type="primary" v-has="['修改密码']" @click="handlePassword(scope.row)" style="margin-bottom:1rem" size="mini">修改密码</el-button>
            <el-button type="success" v-has="['分配角色']" v-if="scope.row.isAdmin === 0" @click.native.prevent="handleRole(scope.row)" size="mini">分配角色</el-button>
            <el-button type="success" v-has="['分配超管']" @click="sharePermission(scope.row)" size="mini">分配超管</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination background  :page-sizes="[10,20,30, 50]" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.offset " :page-size="listQuery.limit" :total="total" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
      </div>
      <el-dialog title="分配超管" :visible.sync="dialogDiv" width = "500px">
        <el-form>
          <el-radio-group v-model="form.isAdmin">
            <el-radio :label=0>非超管</el-radio>
            <el-radio :label=1>超管</el-radio>
          </el-radio-group>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.prevent="dialogDiv = false">取消</el-button>
          <el-button type="primary" @click.prevent="queConfirm">确定</el-button>
        </div>
      </el-dialog>
      <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width ="500px">
        <el-form :rules="formRules" ref="dataform" :model="form" autoCompete = "on" label-position="right" label-width="120px" >
          <template v-if="dialogStatus =='create' ">
            <el-form-item label="账号" prop="userName">
              <el-input  style="width: auto;"  v-model="form.userName" placeholder="请获取账号"></el-input>
              <el-button type="primary" icon="el-icon-refresh" :loading="userNameLoading" @click="handleRefreshUserName" size="small" round>获取账号</el-button>
            </el-form-item>
            <el-form-item label="密码" prop="userPassword">
              <el-input  type="password"  style="width: auto;" v-model="form.userPassword"   placeholder="请输入密码"></el-input>
            </el-form-item>
          </template>
          <el-form-item label="昵称" prop="nickName">
            <el-input  v-model="form.nickName" style="width: auto;"  placeholder="请输入昵称"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="phone">
            <el-input  v-model="form.phone" style="width: auto;"  placeholder="请输入手机号" maxlength="11"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input type="email"  v-model="form.email" style="width: auto;"   placeholder="请输入邮箱"></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="sex">
            <el-radio v-model="form.sex" :label="0"  border>男</el-radio>
            <el-radio v-model="form.sex" :label="1"  border>女</el-radio>
          </el-form-item>
          <el-form-item label="备注" prop="resume">
            <el-input type="textarea"  v-model="form.resume" style="width: auto;" ></el-input>
          </el-form-item>
          <el-tag type="warning" v-if="dialogStatus=='create'">提示：添加成功后需要先分配角色才有权限</el-tag>
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
            <el-radio v-for="item in roleList"  style="line-height:20px;margin-left:1rem;margin-bottom:1.5rem;width:120px" :label="item.id" :key="item.id">{{item.name}}</el-radio>
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
import { mapGetters } from 'vuex'
import { checkPsd, checkUserName, checkPhone, checkEmail } from '@/utils/validator.js'
import { isShowColumnFormatter } from '@/utils/formatter.js'
import { httpGet, httpPost, httpPut, httpDelete } from '@/utils/restful'
import { getUsers, User, givePermissionEr, UserRole, getUserName, updatePassword } from '@/api/url'
export default {
  data () {
    return {
      isShowColumnFormatter: isShowColumnFormatter,
      list: null,
      listLoading: true,
      createLoading: false,
      updateLoading: false,
      deleteLoading: false,
      userNameLoading: false,
      roleLoading: false,
      dialogDiv: false,
      rowId: undefined,
      listQuery: {
        offset: 1,
        limit: 10,
        userName: undefined,
        sex: undefined,
        phone: undefined
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
        isAdmin: undefined,
        userName: '',
        userPassword: '',
        nickName: '',
        phone: '',
        email: '',
        sex: '',
        resume: ''
      },
      formRules: {
        userName: [
          {required: true, trigger: 'blur', message: '请获取账号'},
          {validator: checkUserName, trigger: 'blur', message: '账号为6-12位字母，数字或者下划线'}
        ],
        userPassword: [
          {required: true, trigger: 'blur', message: '请输入密码'},
          {validator: checkPsd, trigger: 'blur', message: '密码为6-12位字母，数字或者下划线'}
        ],
        nickName: [
          {required: true, trigger: 'blur', message: '请输入昵称'}
        ],
        phone: [
          {required: true, trigger: 'blur', message: '请输入手机号'},
          {validator: checkPhone, trigger: 'blur', message: '请输入11位的手机号码'}
        ],
        email: [
          {required: true, trigger: 'blur', message: '请输入邮箱'},
          {validator: checkEmail, trigger: 'blur', message: '请输入正确的邮箱'}
        ],
        sex: [
          {required: true, trigger: 'blur', message: '请选择性别'}
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
          title: '昵称',
          key: 'nickName',
          type: 'text'
        },
        {
          title: '手机号',
          key: 'phone',
          type: 'text'
        },
        {
          title: '邮箱',
          key: 'email',
          type: 'text'
        },
        {
          title: '是否超管',
          key: 'isAdmin',
          type: 'text'
        },
        {
          title: '性别',
          key: 'sex',
          type: 'text'
        },
        {
          title: '备注信息',
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
  computed: {
    ...mapGetters([
      'themeType'
    ])
  },
  created () {
    this.fetchData()
  },
  methods: {
    handleh () {
      this.jsonData[1]['title'] = parseInt(this.themeType) === 3 ? '姓名' : '昵称'
      let obj = JSON.parse(JSON.stringify(this.tableData))
      obj.forEach((item, index) => {
        item.phone = this.isShowColumnFormatter(['隐藏手机号']) ? this.func(item.phone) : item.phone
        item.sex = parseInt(item.sex) === 1 ? '男' : '女'
        item.isAdmin = item.isAdmin === null || item.isAdmin === 0 ? '否' : '是'
      })
      this.table2excel(this.jsonData, obj, 'excel.xlsx')
    },
    func (value) {
      if (value) {
        return value.replace(/^(\d{3})\d{4}(\d{4})$/, '$1****$2')
      } else {
        return ''
      }
    },
    handleRefresh () {
      this.listQuery = {
        offset: 1,
        limit: 10,
        userName: undefined,
        sex: undefined
      }
      this.fetchData()
    },
    fetchData () {
      this.listLoading = true
      this.listQuery = Object.assign(this.listQuery, {departmentId: this.$store.getters.departmentId})
      httpGet(getUsers, this.listQuery).then(res => {
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
        userName: '',
        userPassword: '',
        nickName: '',
        phone: '',
        email: '',
        sex: '',
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
    // 分配超管
    sharePermission  (row) {
      this.rowId = row.id
      this.form.isAdmin = row.isAdmin
      this.dialogDiv = true
    },
    queConfirm () {
      let data = {
        id: this.rowId,
        isAdmin: this.form.isAdmin
      }
      httpPost(givePermissionEr, data).then((res) => {
        this.$message({
          message: res.message,
          type: 'success',
          duration: 3000
        })
        this.dialogDiv = false
        console.log(res)
      }).catch(() => {})
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
          httpPost(User, this.form).then(res => {
            self.fetchData()
            self.dialogFormVisible = false
            setTimeout(() => { self.createLoading = false }, 300)
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
          httpPut(User, updateFormData).then(res => {
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
    //   this.$confirm('确认提交吗？', '提示', {})
    //     .then(() => {
    //       this.deleteLoading = true
    //       httpDelete(User, {ids: this.selectArrayId}).then(res => {
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
      let message = ['删除后所选账户将不能正常登录']
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
        httpDelete(User, {ids: this.selectArrayId}).then(res => {
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
          userPassword: value
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

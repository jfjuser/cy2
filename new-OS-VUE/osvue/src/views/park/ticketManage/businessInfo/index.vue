<template>
  <div class="app-container">
    <div class="table-main">
      <div class="filter-container">
          <el-input clearable style="width: 150px;" v-model="listQuery.shopName" class="filter-item" placeholder="商家名称"></el-input>
          <el-button class="filter-item" type="primary"   @click="handleFilter" icon="el-icon-search">搜索</el-button>
          <el-button class="filter-item" type="primary"  v-has="['新增']"  @click="handleCreate"  icon="el-icon-edit">添加</el-button>
          <el-button class="filter-item" type="primary" @click="handleh"  icon="el-icon-download" v-has="['导出']" >导出</el-button>
          <el-button class="filter-item" type="danger"  v-has="['删除']" :loading = "deleteLoading" @click="handleDelete" :disabled="disabled" icon="el-icon-close">删除所选</el-button>
          <el-button class="filter-item" type="primary"   @click="handleRefresh" icon="el-icon-refresh">刷新</el-button>
        </div>
      <el-table stripe :header-cell-style="{background:'#f3f4f6'}" style="width: 100%"   max-height="600" :data="tableData" v-loading.body="listLoading"  @selection-change="handleSelectionChange"   element-loading-text="加载中..." border fit highlight-current-row>
        <el-table-column type="selection" width="40" fixed="left" v-if="isShowColumnFormatter(['删除'])" ></el-table-column>
        <el-table-column label="商家名称" align="center" prop="shopName"></el-table-column>
        <el-table-column label="系统名称" align="center" prop="sysName"></el-table-column>
        <el-table-column label="手机号" align="center" prop="phone">
          <template slot-scope="scope">
            <template v-if="isShowColumnFormatter(['隐藏手机号'])">{{scope.row.phone | hiddenPhone}}</template>
            <template v-else>{{scope.row.phone}}</template>
          </template>
        </el-table-column>
        <el-table-column label="总金额" align="center" prop="totalFee">
          <template slot-scope="scope">
              {{moneyFormatter(scope.row.totalFee) }}
          </template>
        </el-table-column>
        <el-table-column label="余额" align="center" prop="nowFee">
          <template slot-scope="scope">
              {{moneyFormatter(scope.row.nowFee)}}
          </template>
        </el-table-column>
        <el-table-column label="商家地址" align="center" prop="address"></el-table-column>
        <el-table-column label="创建时间" align="center" prop="createAt">
            <template slot-scope="scope">
              {{timeFormatter(scope.row.createAt)}}
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" align="center" v-if="isShowColumnFormatter(['编辑', '加减款', '管理员', '修改密码', '二维码管理'])" class-name="small-padding fixed-width" width="450">
          <template slot-scope="scope">
            <!-- v-has="['二维码管理']" -->
            <el-button type="primary" v-has="['编辑']" @click="handleUpdate(scope.row)" size="mini">编辑</el-button>
            <el-button type="primary" v-has="['加减款']" @click="handleAddSub(scope.row)" size="mini">加减款</el-button>
            <el-button type="primary" v-has="['管理员']" @click="handleAdmin(scope.row)" size="mini">管理员</el-button>
            <el-button type="primary" v-has="['修改密码']"  @click="handlePassword(scope.row)" size="mini">修改密码</el-button>
            <el-button type="primary"   @click="handleQrCode(scope.row)" size="mini">二维码权限</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination background  :page-sizes="[10,20,30, 50]" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.offset " :page-size="listQuery.limit" :total="total" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
      </div>
      <!-- 添加 编辑 -->
      <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="40%">
        <el-form :rules="formRules" ref="dataform" :model="form" autoCompete = "on" label-position="right" label-width="150px" >
          <el-form-item label="商户名称" prop="shopName">
            <el-input v-model="form.shopName" placeholder="请输入商户名称"></el-input>
          </el-form-item>
          <el-form-item label="系统名称" prop="sysName">
            <el-input v-model="form.sysName" placeholder="请输入系统名称"></el-input>
          </el-form-item>
          <el-form-item label="联系方式" prop="phone">
            <el-input v-model="form.phone" clearable placeholder="请输入联系方式"></el-input>
          </el-form-item>
          <el-form-item label="详细地址" prop="address">
            <el-input v-model="form.address" clearable placeholder="请输入详细地址"></el-input>
          </el-form-item>
          <el-form-item label="备注信息">
            <el-input type="textarea"  v-model="form.resume"  placeholder="请输入备注信息"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button :loading = "createLoading" v-if="dialogStatus=='create'" type="primary" @click="createData">保存</el-button>
          <el-button :loading = "updateLoading" v-else type="primary" @click="updateData">修改</el-button>
        </div>
      </el-dialog>
      <!-- 加减款 -->
      <el-dialog title="加减款设置" :visible.sync="dialogAddSubVisible" width="30%">
        <el-form :rules="formAddRules" ref="dataFormAdd" :model="formAdd" autoComplete="on" label-postiton="right" label-width="150px">
          <el-form-item label="当前余额(元)" >
              <el-input type="number" :disabled="true" v-model="fee"></el-input>
          </el-form-item>
          <el-form-item label="类型" prop="type">
            <el-select v-model="formAdd.type"  placeholder="类型">
              <el-option v-for="item in moneyType" :key="item.valueNo" :label="item.valueName" :value="item.valueNo"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="金额(元)" prop="fee">
            <el-input type="number" step=0.01 v-model="formAdd.fee" placeholder="请输入金额"></el-input>
          </el-form-item>
        </el-form>
         <div slot="footer" class="dialog-footer">
            <el-button @click="dialogAddSubVisible = false">取消</el-button>
            <el-button :loading="createAddLoading" type="primary" @click="createAddData">保存</el-button>
          </div>
      </el-dialog>
      <!-- 管理员 -->
      <el-dialog title="商家管理员" :visible.sync="dialogAdminVisible">
        <el-form :rules="adminRules" ref="dataAdmin" :model="formAdmin" autoCompete = "on" label-position="right" label-width="150px" >
          <el-form-item label="账号" prop="userName">
            <el-input  style="width: auto;"  v-model="formAdmin.userName"  disabled placeholder="账号"></el-input>
            <!-- <el-button v-if="accountType" type="primary" icon="el-icon-refresh" :loading="userNameLoading" @click="handleRefreshUserName">获取账号</el-button> -->
          </el-form-item>
          <el-form-item v-if="accountType" label="密码" prop="userPassword">
            <el-input  type="password"  style="width: auto;" v-model="formAdmin.userPassword"   placeholder="请输入密码"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="phone">
            <el-input  v-model="formAdmin.phone" style="width: auto;"  placeholder="请输入手机号"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input type="email"  v-model="formAdmin.email" style="width: auto;"   placeholder="请输入邮箱"></el-input>
          </el-form-item>
          <el-form-item label="性别">
            <el-radio v-model="formAdmin.sex" :label="0"  border>男</el-radio>
            <el-radio v-model="formAdmin.sex" :label="1"  border>女</el-radio>
          </el-form-item>
          <el-form-item label="备注" >
            <el-input type="textarea"  v-model="formAdmin.resume" style="width: auto;" ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogAdminVisible = false">取消</el-button>
            <el-button :loading = "createAdminloading"  type="primary" @click="createAdminData">保存</el-button>
        </div>
      </el-dialog>
      <!-- 权限 -->
      <el-dialog title="二维码权限" :visible.sync="dialogPermissionVisible" width="40%">
          <template>
            <el-checkbox-group v-model="checked" >
              <el-checkbox v-for="item in qrCodeList"  :label="item.id" :key="item.id">{{item.name}}</el-checkbox>
            </el-checkbox-group>
          </template>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogPermissionVisible = false">取消</el-button>
          <el-button  type="primary" @click="permData">保存</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { typeFormatter, moneyFormatter, timeFormatter, isShowColumnFormatter } from '@/utils/formatter.js'
import { moneyType } from '@/utils/selectAble.js'
import { checkUserName, checkPsd, checkPhone, checkEmail } from '@/utils/validator.js'
import { httpGet, httpPost, httpDelete, httpPut } from '@/utils/restful'
import { getBuinessInfo, BuinessInfo, getBuinessPer, setBuinessPer, addSubMoney, getAdmin, createAdmin, getUserName, updatePassword } from '@/api/url'
export default {
  data () {
    // 验证输入金额
    var checkFee = (rule, value, callback) => {
      if (value < 0) {
        return callback(new Error('请输入大于0的数字'))
        // 判断是不是浮点数
      } else if (value % 1 !== 0 && value.toString().split('.')[1].length > 2) {
        return callback(new Error('最多包含两位小数'))
      } else if (this.formAdd.type === 1 && value > this.fee) {
        return callback(new Error('减款金额需要小于当前余额'))
      } else {
        callback()
      }
    }
    return {
      list: null,
      listLoading: true,
      createAddLoading: false,
      createLoading: false,
      deleteLoading: false,
      updateLoading: false,
      userNameLoading: false,
      createAdminloading: false,
      accountType: true,
      disabled: true,
      selectArrayId: [],
      listQuery: {
        offset: 1,
        limit: 10,
        shopName: undefined
      },
      tableData: [],
      total: null,
      moneyType: moneyType,
      dialogFormVisible: false,
      dialogPermissionVisible: false,
      dialogAddSubVisible: false,
      typeFormatter: typeFormatter,
      moneyFormatter: moneyFormatter,
      isShowColumnFormatter: isShowColumnFormatter,
      timeFormatter: timeFormatter,
      checkPhone: checkPhone,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '添加'
      },
      formAdd: {
        shopId: undefined,
        type: undefined,
        fee: 0
      },
      form: {
        id: undefined,
        address: undefined,
        phone: undefined,
        resume: undefined,
        shopName: undefined,
        sysName: undefined
      },
      formRules: {
        shopName: [
          {required: true, trigger: 'blur', message: '商户名称不可为空'}
        ],
        sysName: [
          {required: true, trigger: 'blur', message: '系统名称不可为空'},
          {maxlength: 8, minlength: 2, message: '请输入2-8位的字符'}
        ],
        phone: [
          {required: true, trigger: 'blur', message: '手机号不可为空'},
          {validator: checkPhone, trigger: 'blur'}
        ],
        address: [
          {required: true, trigger: 'blur', message: '地址不可为空'}
        ]
      },
      formAddRules: {
        type: [
          {required: true, trigger: 'change', message: '请选择类型'}
        ],
        fee: [
          {required: true, trigger: 'blur', message: '金额不可为空'},
          {validator: checkFee, trigger: 'blur'}
        ]
      },
      fee: 0,
      depId: 0,
      dialogAdminVisible: false,
      formAdmin: {
        id: undefined,
        userName: undefined,
        userPassword: undefined,
        phone: undefined,
        email: undefined,
        sex: undefined,
        resume: undefined
      },
      adminRules: {
        userName: [
          {required: true, trigger: 'blur', message: '请获取用户名'},
          {validator: checkUserName, trigger: 'blur'}
        ],
        userPassword: [
          {required: true, trigger: 'blur', message: '请输入密码'},
          {validator: checkPsd, trigger: 'blur', message: '密码为6-12位字母，数字或者下划线'}
        ],
        phone: [
          {validator: checkPhone, trigger: 'blur', message: '请输入11位的手机号码'}
        ],
        email: [
          {validator: checkEmail, trigger: 'blur', message: '请输入正确的邮箱'}
        ]
      },
      checked: [],
      qrCodeList: [],
      rowId: undefined,
      jsonData: [
        {
          title: '商家名称',
          key: 'shopName',
          type: 'text'
        },
        {
          title: '系统名称',
          key: 'sysName',
          type: 'text'
        },
        {
          title: '手机号',
          key: 'phone',
          type: 'text'
        },
        {
          title: '总金额',
          key: 'totalFee',
          type: 'text'
        },
        {
          title: '余额',
          key: 'nowFee',
          type: 'text'
        },
        {
          title: '商家地址',
          key: 'address',
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
        item.phone = this.isShowColumnFormatter(['隐藏手机号']) ? this.func(item.phone) : item.phone
        item.totalFee = this.moneyFormatter(item.totalFee)
        item.nowFee = this.moneyFormatter(item.nowFee)
        item.createAt = this.timeFormatter(item.createAt)
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
    fetchData () {
      this.listQuery = Object.assign(this.listQuery, {departmentId: this.$store.getters.departmentId})
      httpGet(getBuinessInfo, this.listQuery).then(res => {
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
    resetFormAdd () {
      this.formAdd = {
        id: undefined,
        type: undefined,
        fee: undefined
      }
    },
    resetForm () {
      this.form = {
        id: undefined,
        address: undefined,
        phone: undefined,
        resume: undefined,
        shopName: undefined,
        sysName: undefined
      }
    },
    // 管理员
    resetAdminForm () {
      this.formAdmin = {
        id: undefined,
        userName: undefined,
        userPassword: undefined,
        phone: undefined,
        email: undefined,
        sex: undefined,
        resume: undefined
      }
    },
    // 刷新用户名
    handleRefreshUserName () {
      this.userNameLoading = true
      httpGet(getUserName).then(res => {
        this.userNameLoading = false
        this.formAdmin.userName = res.data
      }).catch(() => {
        this.userNameLoading = false
      })
    },
    handleAdmin (row) {
      this.resetAdminForm()
      this.depId = row.id
      httpGet(getAdmin + row.id).then(res => {
        if (res.data !== null) {
          this.formAdmin = Object.assign({}, res.data)
          this.accountType = false
        } else {
          this.resetAdminForm()
          this.formAdmin.userPassword = ''
          this.handleRefreshUserName()
          this.accountType = true
        }
        this.dialogAdminVisible = true
      }).catch(() => {})
    },
    // 保存管理员
    createAdminData () {
      this.createAdminloading = false
      this.formAdmin = Object.assign(this.formAdmin, {departmentId: this.depId})
      httpPost(createAdmin, this.formAdmin).then(res => {
        this.dialogAdminVisible = false
        this.$message({
          message: res.message,
          type: 'success',
          duration: 4 * 1000
        })
      }).catch(() => {})
    },
    handleFilter () {
      this.listQuery.offset = 1
      this.fetchData()
    },
    // 添加
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
          this.createLoading = true
          this.form = Object.assign(this.form, {departmentId: this.$store.getters.departmentId})
          httpPost(BuinessInfo, this.form).then((res) => {
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
          httpPut(BuinessInfo, updateFormData).then(res => {
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
    // 加减款
    handleAddSub (row) {
      this.resetFormAdd()
      this.fee = row.nowFee
      this.formAdd.shopId = row.id
      this.dialogAddSubVisible = true
      // 延迟调用
      this.$nextTick(() => {
        this.$refs.dataFormAdd.clearValidate()
      })
    },
    // 加减款提交
    createAddData () {
      this.$refs.dataFormAdd.validate((valid) => {
        if (valid) {
          this.createAddLoading = true
          this.formAdd.fee = Number(this.formAdd.fee)
          httpPost(addSubMoney, this.formAdd).then((res) => {
            this.fetchData()
            this.dialogAddSubVisible = false
            setTimeout(() => { this.createAddLoading = false }, 300)
            this.$message({
              message: res.message,
              type: 'success',
              duration: 4 * 1000
            })
          }).catch(() => {
            this.createAddLoading = false
          })
        }
      })
    },
    // 刷新
    handleRefresh () {
      this.listQuery = {
        shopName: undefined,
        offset: 1,
        limit: 10
      }
      this.fetchData()
    },
    // 删除选中
    handleDelete () {
      this.$confirm('确认提交吗？', '提示', {})
        .then(() => {
          this.deleteLoading = true
          httpDelete(BuinessInfo, {ids: this.selectArrayId}).then(res => {
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
    // 修改密码
    handlePassword (row) {
      this.$prompt('密码修改', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^(\w){6,12}$/,
        inputErrorMessage: '请输入正确的密码'
      }).then(({ value }) => {
        const data = {
          departmentId: row.id,
          userPassword: value
        }
        httpPost(updatePassword, data)
          .then(res => {
            this.$message.success(res.message)
          }).catch(() => {})
      }).catch(() => {})
    },
    // 二维码权限
    handleQrCode (row) {
      this.rowId = row.id
      this.checked = []
      httpGet(getBuinessPer + row.id)
        .then(res => {
          this.qrCodeList = res.data.info
          this.checked = res.data.ids
          this.dialogPermissionVisible = true
        }).catch(() => {})
    },
    permData () {
      console.log(this.checked)
      let data = {
        ids: this.checked,
        shopDepartmentId: this.rowId
      }
      httpPost(setBuinessPer, data)
        .then(res => {
          this.dialogPermissionVisible = false
          this.$message.success(res.message)
        }).catch(() => {})
    }
  }
}
</script>

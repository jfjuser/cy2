<template>
    <div class="app-container">
        <div class="table-main">
            <div class="filter-container">
                <el-input clearable style="width: 200px;" v-model="listQuery.leader" class="filter-item" placeholder="部门"></el-input>
                <el-button class="filter-item" type="primary" @click="handleFilter" icon="el-icon-search">搜索</el-button>
                <el-button class="filter-item" type="primary" @click="handleRefresh"  icon="el-icon-refresh">刷新</el-button>
                <el-button class="filter-item" type="primary" @click="handleCreate"  icon="el-icon-edit">添加</el-button>
                <el-button class="filter-item" type="danger"  @click="handleDelete" :loading = "deleteLoading" :disabled="disabled" icon="el-icon-close">删除</el-button>
            </div>
            <el-table :header-cell-style="{background:'#f3f4f6'}" style="width: 100%" max-height="600" :data="tableData" v-loading.body="listLoading" @row-dblclick="getMembers" @selection-change="handleSelectionChange" element-loading-text="加载中..." border fit highlight-current-row class="table1">
                <el-table-column type="selection" width="40" fixed="left" ></el-table-column>
                <el-table-column label="部门名称" align="center" prop="leader"></el-table-column>
                <el-table-column fixed="right" label="操作" align="center" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                    <el-button type="primary" @click="handleUpdate(scope.row)" size="mini">编辑</el-button>
                    <el-button type="primary" @click.native.prevent="handlePassRole(scope.row)" size="mini">通道权限</el-button>
                </template>
                </el-table-column>
            </el-table>
            <!-- 分页 -->
            <div class="pagination-container">
                <el-pagination background  :page-sizes="[10,20,30, 50]" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.offset " :page-size="listQuery.limit" :total="total" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
            </div>
            <!-- 成员信息 -->
            <template v-if="memberId">
                <Member :memberId = "memberId" :leaderName="leaderName"></Member>
            </template>
        </div>

        <!-- 通道权限 -->
        <el-dialog title="通道权限" :visible.sync="dialogPermissionVisible" width="40%">
        <template>
            <el-checkbox-group v-model="checked" >
            <el-checkbox v-for="item in localList"  :label="item.localId" :key="item.localId">{{item.localName}}</el-checkbox>
            </el-checkbox-group>
        </template>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogPermissionVisible = false">取消</el-button>
            <el-button  type="primary" @click="permData">保存</el-button>
        </div>
        </el-dialog>
        <!-- 新增或者修改 -->
        <el-dialog :title="textMap[dialogStatus]" :visible.sync = "dialogFormVisible">
            <el-form :rules="formRules" ref="dataform" :model="form" autoComplete="on" label-position="right" label-width="150px">
                <el-form-item label="部门名称" prop="leader" >
                    <el-input v-model="form.leader" placeholder="请输入"></el-input>
                </el-form-item>
                <template v-if="dialogStatus === 'create'">
                    <el-form-item label="通道名称" prop="aiTokenIds">
                    <el-select v-model="form.aiTokenIds" multiple >
                        <el-option v-for="item in localList" :key="item.id" :label="item.localName" :value="item.id"></el-option>
                    </el-select>
                    </el-form-item>
                </template>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取消</el-button>
                <el-button :loading="createLoading" type="primary" v-if="dialogStatus === 'create'" @click="createData">保存</el-button>
                <el-button :loading="updateLoading" type="primary" v-if="dialogStatus === 'update'" @click="updateData">保存</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { getAllDepartment, delUser, AIpermission, checkAICamera, workForaiDuyCompany } from '@/api/url'
import { httpGet, httpDelete, httpPut, httpPost } from '@/utils/restful'
import { toNull } from '@/utils/formatter'
import { departmentText } from '@/utils/helptext'
import Storage from '@/utils/storage'
import Member from './components/member.vue'
export default {
  components: {
    Member
  },
  data () {
    return {
      deleteLoading: false,
      disabled: true,
      selectArrayId: [],
      list: null,
      listLoading: true,
      listQuery: {
        leader: '',
        offset: 1,
        limit: 10,
        departmentId: this.$store.getters.departmentId
      },
      tableData: [],
      total: null,
      dialogPermissionVisible: false,
      checked: [],
      localList: [],
      dialogFormVisible: false,
      form: {
        leader: undefined,
        aiTokenIds: []
      },
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '添加'
      },
      createLoading: false,
      updateLoading: false,
      formRules: {
        aiTokenIds: [
          {required: true, trigger: 'change', message: '不可为空'}
        ],
        leader: [
          {required: true, trigger: 'blur', message: '不可为空'}
        ]
      },
      memberId: undefined,
      leaderName: ''
    }
  },
  mounted () {
    this.fetchData()
    if (!Storage.get('departmentShowHelp')) {
      this.$nextTick(() => {
        this.$alert(departmentText, '帮助说明', {
          confirmButtonText: '知道了，不再提醒',
          // showClose: false,
          center: true,
          roundButton: true,
          callback: action => {
            if (action === 'confirm') {
              Storage.set('departmentShowHelp', 1)
            }
          }
        })
      })
    }
  },
  methods: {
    // 获取成员
    getMembers (row, column, cell, event) {
      this.memberId = row.id
      this.leaderName = row.leader
    },
    // 刷新
    handleRefresh () {
      this.listQuery = {
        leader: '',
        offset: 1,
        limit: 10,
        departmentId: this.$store.getters.departmentId
      }
      this.fetchData()
    },
    // 获取数据
    fetchData () {
      let self = this
      httpGet(getAllDepartment, this.listQuery).then(res => {
        if (res.data === null) {
          self.tableData = []
          self.total = 0
          self.listLoading = false
        } else {
          self.tableData = res.data.rows
          self.total = res.data.total
          self.listLoading = false
        }
      }).catch(() => {
        self.listLoading = false
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
    // 搜索
    handleFilter () {
      this.listQuery.leader = toNull(this.listQuery.leader)
      this.listQuery.offset = 1
      this.fetchData()
    },
    handleCreate () {
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.getCameraList()
      this.$nextTick(() => {
        this.$refs['dataform'].resetFields()
        this.resetForm()
      })
    },
    handleUpdate (row) {
      this.form = Object.assign({}, {leader: row.leader, id: row.id})
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataform'].clearValidate()
      })
    },
    // 新增
    createData () {
      this.$refs.dataform.validate((valid) => {
        if (valid) {
          this.createLoading = true
          this.form = Object.assign(this.form, {departmentId: this.$store.getters.departmentId})
          httpPost(workForaiDuyCompany, this.form)
            .then(res => {
              this.fetchData()
              this.dialogFormVisible = false
              setTimeout(() => { this.createLoading = false }, 300)
              this.$message.success(res.message)
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
          const updateFormData = Object.assign({}, this.form)
          httpPut(workForaiDuyCompany, updateFormData)
            .then(res => {
              this.fetchData()
              this.dialogFormVisible = false
              setTimeout(() => { this.updateLoading = false }, 300)
              this.$message.success(res.message)
            }).catch(() => {
              this.updateLoading = false
            })
        }
      })
    },
    // 获取所有的通道列表
    getCameraList () {
      httpGet(checkAICamera + '/' + this.$store.getters.departmentId).then(res => {
        if (res.data.length === 0) {
          this.$message({
            message: '请先配置通道',
            type: 'warning',
            duration: 4 * 1000
          })
        } else {
          this.localList = res.data
        }
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
    // 删除选中
    handleDelete () {
      this.$confirm('确认删除所选中的记录吗？', '提示', {})
        .then(() => {
          this.deleteLoading = true
          httpDelete(delUser, {ids: this.selectArrayId, departmentId: this.$store.getters.departmentId}).then(res => {
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
    // 通道权限
    handlePassRole (row) {
      let data = {
        departmentId: this.$store.getters.departmentId,
        aiDutyCompanyId: row.id
      }
      this.rowId = row.id
      httpGet(AIpermission, data).then(res => {
        if (res.data.local.length === 0) {
          this.$message.error('暂未配置通道，请先配置通道')
        } else {
          this.localList = res.data.local
          this.checked = res.data.checked
          this.dialogPermissionVisible = true
        }
      }).catch(() => {})
    },
    // 保存权限
    permData () {
    //   console.log(this.checked)
      if (this.checked.length === 0) {
        this.$message.error('请选择通道')
      } else {
        let data = {
          aiDutyCompanyId: this.rowId,
          aiTokenIds: this.checked
        }
        httpPut(AIpermission, data).then(res => {
          this.dialogPermissionVisible = false
          this.$message({
            message: res.message,
            type: 'success',
            duration: 4 * 1000
          })
        }).catch(() => {})
      }
    },
    // 重置表单
    resetForm () {
      this.form = {
        leader: undefined,
        aiTokenIds: []
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.table-main /deep/ .el-table.table1 {
  tr {
    &.hover-row {
      > td:last-of-type::after {
        content: "双击可查看成员";
        display: inline-block;
        line-height: 20px;
        font-size: 12px;
        background-color: #eee;
        color: #909399;
        z-index: 1000;
        padding: 0 2px;
        position: absolute;
        bottom: 0;
        right: 0;
      }
    }
  }
}
</style>

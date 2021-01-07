<template>
    <div>
        <h4>当前查看部门: <el-tag v-if="leaderName">{{leaderName}}</el-tag></h4>
        <div class="filter-container">
            <el-button class="filter-item" type="primary" @click="handleRefresh"  icon="el-icon-refresh">刷新</el-button>
            <el-button class="filter-item" type="primary" @click="handleAdd" icon="el-icon-edit">添加</el-button>
            <el-button class="filter-item" type="danger"  @click="handleDelete" :loading = "deleteLoading" :disabled="disabled" icon="el-icon-close">删除</el-button>
        </div>
        <el-table :header-cell-style="{background:'#f3f4f6'}" style="width: 100%" max-height="600" :data="tableData" v-loading.body="listLoading" @selection-change="handleSelectionChange" element-loading-text="加载中..." border fit highlight-current-row>
            <el-table-column type="selection" width="40" fixed="left" ></el-table-column>
            <el-table-column label="姓名" align="center" prop="userName"></el-table-column>
            <el-table-column label="手机号" align="center" prop="phone"></el-table-column>
        </el-table>
        <!-- 分页 -->
        <div class="pagination-container">
            <el-pagination background  :page-sizes="[10,20,30, 50]" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.offset " :page-size="listQuery.limit" :total="total" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
        </div>

        <el-dialog title="添加成员" :visible.sync="dialogFormVisible" width="40%">
          <div class="selectbox">
            <el-select v-model="userValue" placeholder="请选择" >
              <el-option
                v-for="(item, index) in options"
                :key="index"
                :label="item.userName"
                :value="item.id">
              </el-option>
            </el-select>
          </div>
          <div slot="footer" class="dialog-footer">
              <el-button @click="dialogFormVisible = false">取消</el-button>
              <el-button  type="primary" @click="handleSave" :loading="adduserLoading">保存</el-button>
          </div>
        </el-dialog>
    </div>
</template>

<script>
import { getUser, delUser, lookMember, addUser } from '@/api/url'
import { httpPost, httpDelete } from '@/utils/restful'
import { toNull } from '@/utils/formatter'
export default {
  data () {
    return {
      deleteLoading: false,
      disabled: true,
      selectArrayId: [],
      list: null,
      listLoading: true,
      listQuery: {
        aiDutyCompanyId: undefined,
        departmentId: this.$store.getters.departmentId,
        sign: 1,
        userName: null,
        offset: 1,
        limit: 10
      },
      tableData: [],
      total: null,
      dialogFormVisible: false,
      userValue: '',
      options: [],
      lookMemberlistQuery: {
        offset: 1,
        limit: 10,
        departmentId: this.$store.getters.departmentId,
        sign: 1
      },
      adduserLoading: false
    }
  },
  props: {
    memberId: {
      type: Number,
      required: true
    },
    leaderName: {
      type: String
    }
  },
  name: 'member',
  watch: {
    memberId (curVal, oldVal) {
      this.listQuery.aiDutyCompanyId = curVal
      this.fetchData()
    }
  },
  mounted () {
    this.fetchData()
  },
  methods: {
    // 刷新
    handleRefresh () {
      this.listQuery = {
        offset: 1,
        limit: 10,
        userName: undefined,
        departmentId: this.$store.getters.departmentId,
        sign: 1
      }
      this.fetchData()
    },
    // 获取数据
    fetchData () {
      let self = this
      this.listQuery.aiDutyCompanyId = this.memberId
      httpPost(getUser, this.listQuery).then(res => {
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
      this.listQuery.userName = toNull(this.listQuery.userName)
      this.listQuery.offset = 1
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
    // 删除选中
    handleDelete () {
      this.$confirm('确认提交吗？', '提示', {})
        .then(() => {
          const formData = {
            aiUserId: this.selectArrayId
          }
          this.deleteLoading = true
          httpDelete(delUser, formData).then(res => {
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
    handleAdd () {
      this.dialogFormVisible = true
      httpPost(`${lookMember}?offset=${this.lookMemberlistQuery.offset}&limit=${this.lookMemberlistQuery.limit}`, this.lookMemberlistQuery).then(res => {
        if (res.data === null) {
          this.options = []
        } else {
          this.options = res.data.rows
        }
        this.filterUser()
      }).catch(() => {})
    },
    filterUser () {
      if (this.tableData.length === 0) return
      if (this.options.length === 0) return
      for (let [i, v] of this.options.entries()) {
        for (const v2 of this.tableData) {
          if (v.id === v2.id) {
            this.options.splice(i, 1)
          }
        }
      }
    },
    handleSave () {
      const formData = {
        departmentId: this.$store.getters.departmentId,
        dutyCompanyId: this.memberId,
        aiUserId: this.userValue
      }
      this.adduserLoading = true
      httpPost(addUser, formData).then((res) => {
        this.dialogFormVisible = false
        setTimeout(() => { this.adduserLoading = false }, 300)
        this.fetchData()
        this.$message({
          type: 'success',
          message: res.message,
          duration: 4 * 1000
        })
      }).catch(() => {
        this.adduserLoading = false
      })
    }
  }
}
</script>

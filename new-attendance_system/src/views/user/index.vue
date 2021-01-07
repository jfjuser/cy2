<template>
    <div class="app-container">
        <div class="table-main">
            <div class="filter-container">
                <el-input clearable style="width: 200px;" v-model="listQuery.userName" class="filter-item" placeholder="名称"></el-input>
                <el-button class="filter-item" type="primary" @click="handleFilter" icon="el-icon-search">搜索</el-button>
                <el-button class="filter-item" type="primary" @click="handleRefresh"  icon="el-icon-refresh">刷新</el-button>
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
        </div>
    </div>
</template>

<script>
import { lookMember } from '@/api/url'
import { httpPost, httpDelete } from '@/utils/restful'
import { toNull } from '@/utils/formatter'
import { userText } from '@/utils/helptext'
import Storage from '@/utils/storage'
export default {
  data () {
    return {
      deleteLoading: false,
      disabled: true,
      selectArrayId: [],
      list: null,
      listLoading: true,
      listQuery: {
        userName: undefined,
        offset: 1,
        limit: 10,
        departmentId: this.$store.getters.departmentId,
        sign: 1
      },
      tableData: [],
      total: null
    }
  },
  mounted () {
    this.fetchData()
    if (!Storage.get('userShowHelp')) {
      this.$nextTick(() => {
        this.$alert(userText, '帮助说明', {
          confirmButtonText: '知道了，不再提醒',
          // showClose: false,
          center: true,
          roundButton: true,
          callback: action => {
            if (action === 'confirm') {
              Storage.set('userShowHelp', 1)
            }
          }
        })
      })
    }
  },
  methods: {
    // 刷新
    handleRefresh () {
      this.listQuery = {
        offset: 1,
        limit: 10,
        userName: undefined,
        departmentId: this.$store.getters.departmentId
      }
      this.fetchData()
    },
    // 获取数据
    fetchData () {
      let self = this
      httpPost(`${lookMember}?offset=${this.listQuery.offset}&limit=${this.listQuery.limit}`, this.listQuery).then(res => {
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
          this.deleteLoading = true
          httpDelete(lookMember, {ids: this.selectArrayId, departmentId: this.$store.getters.departmentId}).then(res => {
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
    }
  }
}
</script>

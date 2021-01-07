<template>
  <div class="app-container">
    <div class="table-main">
      <!-- 操作 -->
      <div class="filter-container">
        <el-input  class="filter-item" style="width:150px;" v-model="listQuery.departmentName" clearable placeholder="部门名称"></el-input>
        <el-input  class="filter-item" style="width:150px;" v-model="listQuery.mac" clearable placeholder="MAC"></el-input>
        <el-select clearable v-model="listQuery.ledType"  class="filter-item" placeholder="LED类型">
          <el-option v-for="item in ledTypeSelect" :key="item.valueNo" :label="item.valueName" :value="item.valueNo"></el-option>
        </el-select>
        <el-select clearable v-model="listQuery.isBind"  class="filter-item" placeholder="绑定状态">
          <el-option v-for="item in isBindType" :key="item.valueNo" :label="item.valueName" :value="item.valueNo"></el-option>
        </el-select>
        <el-select clearable v-model="listQuery.status"  class="filter-item" placeholder="状态">
          <el-option v-for="item in statusType" :key="item.valueNo" :label="item.valueName" :value="item.valueNo"></el-option>
        </el-select>
        <el-button class="filter-item" type="primary" @click="handleFilter" icon="el-icon-search">搜索</el-button>
        <el-button class="filter-item" type="primary" @click="handleh"  icon="el-icon-download" v-has="['导出']" >导出</el-button>
        <el-button class="filter-item" type="primary" @click="handleRefresh" icon="el-icon-refresh">刷新</el-button>
        <!-- <el-button class="filter-item" type="danger" :loading = "deleteLoading" @click="handleDelete" :disabled="disabled" icon="el-icon-close">删除所选</el-button>
        <el-button class="filter-item" type="danger" plain :loading = "deleteAllLoading" @click="handleAllDelete"  icon="el-icon-delete">删除所有</el-button> -->
      </div>
      <el-table stripe :header-cell-style="{background:'#f3f4f6'}" style="width: 100%" max-height="600" :data="tableData"  @selection-change="handleSelectionChange" v-loading.body="listLoading"  element-loading-text="加载中..." border fit highlight-current-row>
        <el-table-column type="selection" width="40" fixed="left" ></el-table-column>
        <el-table-column label="部门名称" align="center" prop="departmentName"></el-table-column>
        <el-table-column label="通道名称" align="center" prop="localName"></el-table-column>
        <el-table-column label="唯一标识符" align="center" prop="mac"></el-table-column>
        <el-table-column label="LED类型" align="center" prop="ledType">
          <template slot-scope="scope">
            {{ledTypeFormatter(scope.row.ledType)}}
          </template>
        </el-table-column>
        <el-table-column label="绑定状态" align="center" prop="isBind">
          <template slot-scope="scope">
            {{ isBindFormatter(scope.row.isBind) }}
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center" prop="status">
          <template slot-scope="scope">
            <el-button size="mini" type="danger" v-if="scope.row.status === 0">离线</el-button>
            <span v-if="scope.row.status === 1">在线</span>
          </template>
        </el-table-column>
        <el-table-column label="最近登录时间" align="center" prop="loginAt">
          <template slot-scope="scope">
              {{ timeFormatter(scope.row.loginAt) }}
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination background  :page-sizes="[10,20,30, 50]" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.offset " :page-size="listQuery.limit" :total="total" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import { statusType, isBindType, ledTypeSelect } from '@/utils/selectAble.js'
import { isBindFormatter, timeFormatter, ledTypeFormatter } from '@/utils/formatter'
import { fuzzySearch, AIMember, deleteAIMembers } from '@/api/url'
import { httpGet, httpDelete } from '@/utils/restful'
export default {
  data () {
    return {
      isBindFormatter: isBindFormatter,
      timeFormatter: timeFormatter,
      ledTypeFormatter: ledTypeFormatter,
      statusType: statusType,
      isBindType: isBindType,
      ledTypeSelect: ledTypeSelect,
      deleteAllLoading: false,
      deleteLoading: false,
      disabled: true,
      listQuery: {
        departmentName: undefined,
        ledType: undefined,
        mac: undefined,
        isBind: undefined,
        status: undefined,
        offset: 1,
        limit: 10
      },
      tableData: [],
      selectArrayId: [],
      listLoading: false,
      total: undefined,
      jsonData: [
        {
          title: '部门名称',
          key: 'departmentName',
          type: 'text'
        },
        {
          title: '通道名称',
          key: 'localName',
          type: 'text'
        },
        {
          title: '唯一标识符',
          key: 'mac',
          type: 'text'
        },
        {
          title: 'LED类型',
          key: 'ledType',
          type: 'text'
        },
        {
          title: '绑定状态',
          key: 'isBind',
          type: 'text'
        },
        {
          title: '状态',
          key: 'status',
          type: 'text'
        },
        {
          title: '最近登录时间',
          key: 'loginAt',
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
  mounted () {
    this.fetchData()
  },
  methods: {
    handleh () {
      let obj = JSON.parse(JSON.stringify(this.tableData))
      obj.forEach((item, index) => {
        item.ledType = this.ledTypeFormatter(item.ledType)
        item.isBind = this.isBindFormatter(item.isBind)
        item.loginAt = this.timeFormatter(item.loginAt)
        item.status = parseInt(item.status) === 0 ? '离线' : '在线'
      })
      this.table2excel(this.jsonData, obj, 'excel.xlsx')
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
      this.listQuery.offset = 1
      this.fetchData()
    },
    // 刷新
    handleRefresh () {
      this.listQuery = {
        offset: 1,
        limit: 10,
        mac: undefined,
        departmentName: undefined,
        status: undefined,
        ledType: undefined,
        isBind: undefined
      }
      this.fetchData()
    },
    fetchData () {
      this.listLoading = true
      let self = this
      httpGet(fuzzySearch, this.listQuery).then(res => {
        if (res.data.rows === null) {
          self.tableData = []
          self.total = 0
          self.listLoading = false
        } else {
          self.tableData = res.data.rows
          self.total = res.data.total
          self.listLoading = false
        }
        console.log(self.tableData)
      }).catch(() => {
        self.listLoading = false
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
    // 删除选中
    handleDelete () {
      this.$confirm('确认删除吗？', '提示', {})
        .then(() => {
          this.deleteLoading = true
          httpDelete(AIMember, {ids: this.selectArrayId}).then(res => {
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
    // 删除所有
    handleAllDelete () {
      this.$confirm('确认删除所有吗？', '提示', {})
        .then(() => {
          this.deleteAllLoading = true
          httpDelete(deleteAIMembers + '/' + this.$store.getters.departmentId).then(res => {
            this.deleteAllLoading = false
            this.fetchData()
            this.$message({
              type: 'success',
              message: res.message,
              duration: 4 * 1000
            })
          }).catch(() => {
            this.deleteAllLoading = false
          })
        }).catch(() => {})
    }
  }
}
</script>

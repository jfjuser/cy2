<template>
  <div class="app-container">
    <div class="table-main">
      <!-- 操作 -->
      <div class="filter-container">
        <el-input  class="filter-item" style="width:150px;" v-model="listQuery.mac" clearable placeholder="请输入MAC"></el-input>
        <el-select clearable v-model="listQuery.status"  class="filter-item" placeholder="状态">
          <el-option v-for="item in statusType" :key="item.valueNo" :label="item.valueName" :value="item.valueNo"></el-option>
        </el-select>
        <el-button class="filter-item" type="primary"   @click="handleFilter" icon="el-icon-search">搜索</el-button>
        <el-button class="filter-item" type="primary"   @click="handleRefresh" icon="el-icon-refresh">刷新</el-button>
        <el-button class="filter-item" type="primary" @click="handleh"  icon="el-icon-download" v-has="['导出']" >导出</el-button>
      </div>
      <el-table stripe :header-cell-style="{background:'#f3f4f6'}" style="width: 100%" max-height="600" :data="tableData" v-loading.body="listLoading"  element-loading-text="加载中..." border fit highlight-current-row>
        <el-table-column label="部门名称" align="center" prop="departmentName"></el-table-column>
        <el-table-column label="通道名称" align="center" prop="localName"></el-table-column>
        <el-table-column label="MAC" align="center" prop="mac"></el-table-column>
        <el-table-column label="绑定状态" align="center" prop="isBing">
          <template slot-scope="scope">
            {{ isBindFormatter(scope.row.isBing) }}
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
        <el-table-column fixed="right" label="操作" v-if="isShowColumnFormatter(['解除绑定'])" align="center" class-name="small-padding fixed-width" width="150">
          <template slot-scope="scope">
              <div v-if="scope.row.isBing === 0">--</div>
              <div v-else><el-button type="warning" @click.native.prevent="handleRemoveBind(scope.row)" size="mini">解除绑定</el-button></div>
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
import { statusType } from '@/utils/selectAble.js'
import { isBindFormatter, timeFormatter, isShowColumnFormatter } from '@/utils/formatter.js'
import { getG4Mac, unBindCarmera } from '@/api/url'
import { httpGet } from '@/utils/restful'
export default {
  data () {
    return {
      list: null,
      listLoading: true,
      listQuery: {
        offset: 1,
        limit: 10,
        mac: undefined,
        status: undefined
      },
      tableData: [],
      total: null,
      statusType: statusType,
      isBindFormatter: isBindFormatter,
      timeFormatter: timeFormatter,
      isShowColumnFormatter: isShowColumnFormatter,
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
          title: 'MAC',
          key: 'mac',
          type: 'text'
        },
        {
          title: '绑定状态',
          key: 'isBing',
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
  created () {
    this.fetchData()
  },
  methods: {
    handleh () {
      let obj = JSON.parse(JSON.stringify(this.tableData))
      obj.forEach((item, index) => {
        item.isBing = this.isBindFormatter(item.isBing)
        item.status = parseInt(item.status) === 0 ? '离线' : (parseInt(item.status) === 1 ? '在线' : '')
        item.loginAt = this.timeFormatter(item.loginAt)
      })
      this.table2excel(this.jsonData, obj, 'excel.xlsx')
    },
    // 刷新
    handleRefresh () {
      this.listQuery = {
        offset: 1,
        limit: 10,
        mac: undefined,
        status: undefined
      }
      this.fetchData()
    },
    fetchData () {
      let self = this
      httpGet(getG4Mac, this.listQuery).then(res => {
        if (res.data === null) {
          self.tableData = []
          self.total = 0
        } else {
          self.tableData = res.data.rows
          self.total = res.data.total
        }
        self.listLoading = false
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
      this.listQuery.offset = 1
      this.fetchData()
    },
    handleRemoveBind (row) {
      this.$confirm('是否对该相机进行解绑？', '解绑相机', {
        confirmButtonText: '确定解绑',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(res => {
        httpGet(unBindCarmera + '/' + row.id)
          .then(res => {
            this.fetchData()
            this.$message({
              type: 'success',
              message: res.message,
              duration: 4 * 1000
            })
          }).catch(() => {})
      }).catch(() => {})
    }
  }
}
</script>

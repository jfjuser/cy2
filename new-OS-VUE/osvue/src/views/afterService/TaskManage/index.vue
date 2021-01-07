<template>
  <div class="app-container">
    <div class="table-main">
      <!-- 操作 -->
      <div class="filter-container">
        <el-input clearable style="width: 200px;" v-model="listQuery.userName" class="filter-item" placeholder="账号"></el-input>
        <el-select clearable v-model="listQuery.type"  class="filter-item" placeholder="设备类型">
          <el-option v-for="item in deviceASType" :key="item.valueNo" :label="item.valueName" :value="item.valueNo"></el-option>
        </el-select>
        <el-select clearable v-model="listQuery.status"  class="filter-item" placeholder="订单状态">
          <el-option v-for="item in statusASType" :key="item.valueNo" :label="item.valueName" :value="item.valueNo"></el-option>
        </el-select>
        <el-button class="filter-item" type="primary"   @click="handleFilter" icon="el-icon-search">搜索</el-button>
        <el-button class="filter-item" type="primary"   @click="handleRefresh" icon="el-icon-refresh">刷新</el-button>
        <el-button class="filter-item" type="primary" @click="handleh"  icon="el-icon-download" v-has="['导出']" >导出</el-button>
        <el-button class="filter-item" type="danger" v-has="['删除']" :loading = "deleteLoading"   @click="handleDelete" :disabled="disabled" icon="el-icon-close">删除所选</el-button>
      </div>
      <el-table stripe :header-cell-style="{background:'#f3f4f6'}" style="width: 100%" max-height="600" :data="tableData" v-loading.body="listLoading" @selection-change="handleSelectionChange" element-loading-text="加载中..." border fit highlight-current-row>
        <el-table-column type="selection" width="40"  v-if = "isShowColumnFormatter(['删除'])" fixed="left" ></el-table-column>
        <el-table-column label="发单人" align="center" prop="userName"></el-table-column>
        <el-table-column label="设备类型" align="center" prop="type">
          <template slot-scope="scope">
            {{deviceTypeFormatter(scope.row.type)}}
          </template>
        </el-table-column>
        <el-table-column label="联系方式" align="center" prop="phone"></el-table-column>
        <el-table-column label="状态" align="center" prop="status">
          <template slot-scope="scope">
            {{statusASStatusFormatter(scope.row.status)}}
          </template>
        </el-table-column>
        <el-table-column label="紧急程度" align="center" prop="urgent">
          <template slot-scope="scope">
            <el-rate
              v-model="scope.row.urgent"
              disabled
              >
            </el-rate>
          </template>
        </el-table-column>
        <el-table-column label="发单时间" align="center" prop="releaseAt">
          <template slot-scope="scope">
            {{timeFormatter(scope.row.releaseAt)}}
          </template>
        </el-table-column>
        <el-table-column label="问题描述" align="center" prop="problem"></el-table-column>
        <el-table-column label="发单地址" align="center" prop="addr"></el-table-column>
        <el-table-column label="备注信息" align="center" prop="remark"></el-table-column>
        <el-table-column fixed="right" label="操作" align="center" class-name="small-padding fixed-width" >
          <template slot-scope="scope">
            <el-button type="primary"  @click.native.prevent="handlePic(scope.row)" size="mini">查看图片</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination background  :page-sizes="[10,20,30, 50]" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.offset " :page-size="listQuery.limit" :total="total" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
      </div>
      <el-dialog title="图片" :visible.sync="dialogImgVisible">
        <div>
          <img style="width:40%; height: 200px;padding:5px;" v-for="(img, index) in imgs" :key='index' :src="img" alt="图片">
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { isShowColumnFormatter, timeFormatter, deviceTypeFormatter, statusASStatusFormatter } from '@/utils/formatter.js'
import { deviceASType, statusASType } from '@/utils/selectAble'
import { httpGet, httpDelete } from '@/utils/restful'
import { getASTask, deleteASTask, ASTaskPic } from '@/api/url'
export default {
  data () {
    return {
      isShowColumnFormatter: isShowColumnFormatter,
      timeFormatter: timeFormatter,
      deviceTypeFormatter: deviceTypeFormatter,
      statusASStatusFormatter: statusASStatusFormatter,
      deviceASType: deviceASType,
      statusASType: statusASType,
      dialogImgVisible: false,
      list: null,
      listLoading: true,
      deleteLoading: false,
      listQuery: {
        offset: 1,
        limit: 10,
        userName: undefined,
        type: undefined,
        status: undefined
      },
      tableData: [],
      total: null,
      selectArrayId: [],
      disabled: true,
      imgs: [],
      jsonData: [
        {
          title: '发单人',
          key: 'userName',
          type: 'text'
        },
        {
          title: '设备类型',
          key: 'type',
          type: 'text'
        },
        {
          title: '联系方式',
          key: 'phone',
          type: 'text'
        },
        {
          title: '状态',
          key: 'status',
          type: 'text'
        },
        {
          title: '紧急程度',
          key: 'urgent',
          type: 'text'
        },
        {
          title: '发单时间',
          key: 'releaseAt',
          type: 'text'
        },
        {
          title: '问题描述',
          key: 'problem',
          type: 'text'
        },
        {
          title: '发单地址',
          key: 'addr',
          type: 'text'
        },
        {
          title: '备注信息',
          key: 'remark',
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
        item.type = this.deviceTypeFormatter(item.type)
        item.status = this.statusASStatusFormatter(item.status)
        item.releaseAt = this.timeFormatter(item.releaseAt)
      })
      this.table2excel(this.jsonData, obj, 'excel.xlsx')
    },
    handleRefresh () {
      this.listQuery = {
        offset: 1,
        limit: 10,
        userName: undefined,
        status: undefined,
        type: undefined
      }
      this.fetchData()
    },
    fetchData () {
      this.listQuery = Object.assign(this.listQuery, {departmentId: this.$store.getters.departmentId})
      httpGet(getASTask, this.listQuery).then(res => {
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
    // 搜索
    handleFilter () {
      this.listQuery.offset = 1
      this.fetchData()
    },
    // 删除选中
    handleDelete () {
      this.$confirm('确认提交吗？', '提示', {})
        .then(() => {
          this.deleteLoading = true
          httpDelete(deleteASTask, {ids: this.selectArrayId}).then(res => {
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
    handlePic (row) {
      const loading = this.$loading({
        lock: true,
        text: '加载中....',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      httpGet(ASTaskPic + row.id)
        .then(res => {
          loading.close()
          if (res.data !== null && res.data.length > 0) {
            this.imgs = []
            for (const item of res.data) {
              this.imgs.push(item)
              // 修改base64
              this.imgs.push(item)
            }
            this.dialogImgVisible = true
          } else {
            this.$message.warning('暂无图片')
          }
        }).catch(() => {
          loading.close()
        })
    }
  }
}
</script>

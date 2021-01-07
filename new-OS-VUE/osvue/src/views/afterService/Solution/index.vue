<template>
  <div class="app-container">
    <div class="table-main">
      <!-- 操作 -->
      <div class="filter-container">
        <el-input clearable style="width: 200px;" v-model="listQuery.problemId" class="filter-item" placeholder="订单号"></el-input>
        <el-select clearable v-model="listQuery.type"  class="filter-item" placeholder="问题类型">
          <el-option v-for="item in problemType" :key="item.valueNo" :label="item.valueName" :value="item.valueNo"></el-option>
        </el-select>
        <el-button class="filter-item" type="primary"   @click="handleFilter" icon="el-icon-search">搜索</el-button>
        <el-button class="filter-item" type="primary"   @click="handleRefresh" icon="el-icon-refresh">刷新</el-button>
        <el-button class="filter-item" type="primary" @click="handleh"  icon="el-icon-download" v-has="['导出']" >导出</el-button>
      </div>
      <el-table stripe :header-cell-style="{background:'#f3f4f6'}" style="width: 100%" max-height="600" :data="tableData" v-loading.body="listLoading" element-loading-text="加载中..." border fit highlight-current-row>
        <el-table-column label="订单号" align="center" prop="problemId"></el-table-column>
        <el-table-column label="难度等级" align="center" prop="difficult">
          <template slot-scope="scope">
            <el-rate
              v-model="scope.row.difficult"
              disabled
              >
            </el-rate>
          </template>
        </el-table-column>
        <el-table-column label="问题类型" align="center" prop="type">
          <template slot-scope="scope">
            {{problemFormatter(scope.row.type)}}
          </template>
        </el-table-column>
        <el-table-column label="解决方法" align="center" prop="solution"></el-table-column>
        <el-table-column label="备注信息" align="center" prop="remarks"></el-table-column>
        <el-table-column label="完成时间" align="center" prop="createAt">
          <template slot-scope="scope">
            {{timeFormatter(scope.row.createAt)}}
          </template>
        </el-table-column>
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
import { timeFormatter, problemFormatter } from '@/utils/formatter.js'
import { problemType } from '@/utils/selectAble.js'
import { httpGet } from '@/utils/restful'
import { getASSolution, getASSolutionPic } from '@/api/url'
export default {
  data () {
    return {
      timeFormatter: timeFormatter,
      problemFormatter: problemFormatter,
      problemType: problemType,
      dialogImgVisible: false,
      list: null,
      listLoading: true,
      listQuery: {
        offset: 1,
        limit: 10,
        problemId: undefined,
        type: undefined
      },
      tableData: [],
      total: null,
      imgs: [],
      jsonData: [
        {
          title: '订单号',
          key: 'problemId',
          type: 'text'
        },
        {
          title: '难度等级',
          key: 'difficult',
          type: 'text'
        },
        {
          title: '问题类型',
          key: 'type',
          type: 'text'
        },
        {
          title: '解决方法',
          key: 'solution',
          type: 'text'
        },
        {
          title: '备注信息',
          key: 'remarks',
          type: 'text'
        },
        {
          title: '完成时间',
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
        item.type = this.problemFormatter(item.type)
        item.createAt = this.timeFormatter(item.createAt)
      })
      this.table2excel(this.jsonData, obj, 'excel.xlsx')
    },
    handleRefresh () {
      this.listQuery = {
        offset: 1,
        limit: 10,
        problemId: undefined,
        type: undefined
      }
      this.fetchData()
    },
    fetchData () {
      httpGet(getASSolution, this.listQuery).then(res => {
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
    handlePic (row) {
      const loading = this.$loading({
        lock: true,
        text: '加载中....',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      httpGet(getASSolutionPic + row.id)
        .then(res => {
          loading.close()
          if (res.data !== null && res.data.length > 0) {
            this.imgs = []
            for (const item of res.data) {
              // 修改base64
              this.imgs.push(item)
              // this.imgs.push(item)
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

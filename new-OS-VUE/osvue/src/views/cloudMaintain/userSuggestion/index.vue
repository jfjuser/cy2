<template>
  <div class="app-container">
    <div class="table-main">
      <!-- 操作 -->
      <div class="filter-container">
        <el-select clearable v-model="listQuery.type"  class="filter-item" placeholder="反馈来源">
          <el-option v-for="item in suggestionOriginType" :key="item.valueNo" :label="item.valueName" :value="item.valueNo"></el-option>
        </el-select>
        <el-select clearable v-model="listQuery.suggestionSelect"  class="filter-item" placeholder="反馈类型">
          <el-option v-for="item in suggestionSelectType" :key="item.valueNo" :label="item.valueName" :value="item.valueNo"></el-option>
        </el-select>
        <el-button class="filter-item searchs" type="primary" @click="handleFilter" icon="el-icon-search">搜索</el-button>
        <el-button class="filter-item" type="primary" @click="handleRefresh" icon="el-icon-refresh">刷新</el-button>
        <el-button class="filter-item" type="primary" @click="handleh"  icon="el-icon-download" v-has="['导出']" >导出</el-button>
        <el-button class="filter-item" type="danger" :loading = "deleteLoading" @click="handleDelete" :disabled="disabled" icon="el-icon-close">删除所选</el-button>
      </div>
      <el-table stripe :header-cell-style="{background:'#f3f4f6'}" style="width: 100%" max-height="600" :data="tableData" v-loading.body="listLoading"  @selection-change="handleSelectionChange"  element-loading-text="加载中..." border fit highlight-current-row>
        <el-table-column type="selection" width="40" fixed="left" ></el-table-column>
        <el-table-column label="反馈来源" align="center" prop="type">
          <template slot-scope="scope">
            {{suggestionTypeFormatter(scope.row.type)}}
          </template>
        </el-table-column>
        <el-table-column label="反馈类型" align="center" prop="suggestionSelect">
          <template slot-scope="scope">
            {{suggestionSelectFormatter(scope.row.suggestionSelect)}}
          </template>
        </el-table-column>
        <el-table-column label="反馈者手机号" align="center" prop="phone"></el-table-column>
        <el-table-column label="反馈内容" align="center" prop="suggestionContact"></el-table-column>
        <el-table-column label="创建时间" align="center" prop="createAt">
          <template slot-scope="scope">
            {{timeFormatter(scope.row.createAt)}}
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作"  align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <span v-if="!scope.row.uuid">--</span>
            <el-button v-else type="primary lookimg" @click="handlePic(scope.row)" size="mini">查看图片</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination background  :page-sizes="[10,20,30, 50]" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.offset " :page-size="listQuery.limit" :total="total" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
      </div>
      <el-dialog title="图片" :visible.sync="dialogPicVisible">
        <el-row :span="24">
          <el-col :span="12" style="padding: 10px">
            <!-- // 修改base64 -->
            <img style="width: 100%;" v-for="(item, index) in imgArr" :key="index" :src="item" alt="图片" v-show="index % 2 == 0">
          </el-col>
          <el-col :span="12" style="padding: 10px">
            <img style="width: 100%;" v-for="(item, index) in imgArr" :key="index" :src="item" alt="图片" v-show="index % 2 == 1">
          </el-col>
        </el-row>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { suggestionAIType, suggestionType, suggestionSelectType } from '@/utils/selectAble.js'
import { timeFormatter, suggestionTypeFormatter, suggestionSelectFormatter } from '@/utils/formatter.js'
import { suggestion, picSuggestion } from '@/api/url.js'
import { httpGet, httpDelete } from '@/utils/restful.js'
export default {
  computed: {
    ...mapGetters([
      'type',
      'departmentId'
    ])
  },
  data () {
    return {
      suggestionAIType,
      suggestionType,
      suggestionSelectType,
      suggestionSelectFormatter,
      suggestionTypeFormatter,
      suggestionOriginType: [],
      list: null,
      listLoading: true,
      deleteLoading: false,
      listQuery: {
        offset: 1,
        limit: 10,
        type: undefined,
        suggestionSelect: undefined
      },
      tableData: [],
      timeFormatter: timeFormatter,
      total: null,
      disabled: true,
      dialogPicVisible: false,
      selectArrayId: [],
      srcPic: '',
      imgArr: [],
      jsonData: [
        {
          title: '反馈来源',
          key: 'type',
          type: 'text'
        },
        {
          title: '反馈类型',
          key: 'suggestionSelect',
          type: 'text'
        },
        {
          title: '反馈手机号',
          key: 'phone',
          type: 'text'
        },
        {
          title: '反馈内容',
          key: 'suggestionContact',
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
    // 车场
    if (this.type === 0) this.suggestionOriginType = suggestionType
    if (this.type === 1) this.suggestionOriginType = suggestionAIType
  },
  mounted () {
    this.fetchData()
  },
  methods: {
    handleh () {
      let obj = JSON.parse(JSON.stringify(this.tableData))
      obj.forEach((item, index) => {
        // item.advTitle = this.advTargetTypeFormatter(item.type)
        item.type = this.suggestionTypeFormatter(item.type)
        item.suggestionSelect = this.suggestionSelectFormatter(item.suggestionSelect)
        // item.userType = this.userTypeFormat(item.userType)
        item.createAt = this.timeFormatter(item.createAt)
        // item.resume = this.happenEventFormatter(item.happenEvent)
      })
      this.table2excel(this.jsonData, obj, 'excel.xlsx')
    },
    // 获取列表
    fetchData () {
      this.listLoading = true
      Object.assign(this.listQuery, {
        departmentId: this.departmentId,
        kind: this.type
      })
      httpGet(suggestion, this.listQuery).then(res => {
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
    // 刷新
    handleRefresh () {
      this.listQuery = {
        offset: 1,
        limit: 10,
        type: undefined,
        suggestionSelect: undefined
      }
      this.fetchData()
    },
    // 搜索
    handleFilter () {
      this.listQuery.offset = 1
      this.fetchData()
    },
    handleSizeChange (val) {
      this.listQuery.limit = val
      this.fetchData()
    },
    handleCurrentChange (val) {
      this.listQuery.offset = val
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
    handleDelete () {
      this.$confirm('确定要删除吗？', '提示', {})
        .then(() => {
          this.deleteLoading = true
          httpDelete(suggestion, {ids: this.selectArrayId}).then(res => {
            this.deleteLoading = false
            this.fetchData()
          }).catch(() => {
            this.deleteLoading = false
          })
        })
    },
    handlePic (row) {
      let loading = this.$loading({
        lock: true,
        text: '绑定中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      httpGet(picSuggestion + row.id)
        .then(res => {
          loading.close()
          if (res.data !== null) {
            this.imgArr = res.data
            this.dialogPicVisible = true
          }
        }).catch(() => {
          loading.close()
        })
    }
  }
}
</script>

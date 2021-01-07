<template>
    <div class="app-container">
    <div class="table-main">
      <!-- 操作 -->
      <div class="filter-container">
        <el-input  class="filter-item" style="width:150px;" v-model="listQuery.advTitle" clearable placeholder="广告名"></el-input>
        <el-select clearable v-model="listQuery.happenEvent" @focus="selectOne" style="width: 150px;"  class="filter-item" placeholder="触发事件">
          <el-option v-for="item in happenEventType" :key="item.valueNo" :label="item.valueName" :value="item.valueNo"></el-option>
        </el-select>
          <el-date-picker
            v-model="listQuery.createAt"
            class="filter-item"
            align="right"
            type="datetime"
            placeholder="创建时间">
          </el-date-picker>
          <el-date-picker
            v-model="listQuery.updateAt"
            class="filter-item"
            type="datetime"
            placeholder="更新时间">
          </el-date-picker>
        <el-button class="filter-item" style="margin-left:10px" type="primary" :disabled="filterDisabled" @click="seach" icon="el-icon-search">搜索</el-button>
        <el-button class="filter-item" type="primary" @click="fetchData" icon="el-icon-refresh">刷新</el-button>
        <el-button class="filter-item" type="primary" @click="handleh"  icon="el-icon-download" v-has="['导出']" >导出</el-button>
      </div>
      <el-table stripe :header-cell-style="{background:'#f3f4f6'}" style="width: 100%" max-height="600" :data="tableData" v-loading.body="listLoading" element-loading-text="加载中..." border fit highlight-current-row>
        <el-table-column label="广告名称" align="center" prop="advTitle"></el-table-column>
        <el-table-column label="触发事件" align="center" prop="happenEvent">
          <template slot-scope="scope">
            {{happenFormatter(scope.row.happenEvent)}}
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center" prop="createAt">
          <template slot-scope="scope">
            {{timeFormatter(scope.row.createAt)}}
          </template>
        </el-table-column>
        <el-table-column label="推送数据" align="center" prop="pushData"></el-table-column>
        <el-table-column label="推送时间" align="center" prop="pushAt">
          <template slot-scope="scope">
            {{timeFormatter(scope.row.pushAt)}}
          </template>
        </el-table-column>
        <el-table-column label="更新时间" align="center" prop="updateAt">
          <template slot-scope="scope">
            {{timeFormatter(scope.row.updateAt)}}
          </template>
        </el-table-column>
        <el-table-column label="备注" align="center" prop="resume"></el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination background  :page-sizes="[10,20,30, 50]" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.offset " :page-size="listQuery.limit" :total="total" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { pushWater } from '@/api/url'
import { httpGet } from '@/utils/restful'
import { timeFormatter, timeFormatterSort, happenFormatter } from '@/utils/formatter'
export default {
  data () {
    return {
      timeFormatter: timeFormatter,
      timeFormatterSort: timeFormatterSort,
      happenFormatter: happenFormatter,
      filterDisabled: false,
      listLoading: false,
      happenEventType: [
        {
          valueNo: 0,
          valueName: '推送广告'
        },
        {
          valueNo: 1,
          valueName: '点击广告'
        }
      ],
      listQuery: {
        offset: 1,
        limit: 10,
        advTitle: undefined,
        happenEvent: undefined,
        beginTime: '',
        endTime: ''
      },
      total: 0,
      tableData: [],
      jsonData: [
        {
          title: '广告名称',
          key: 'advTitle',
          type: 'text'
        },
        {
          title: '触发事件',
          key: 'happenEvent',
          type: 'text'
        },
        {
          title: '创建时间',
          key: 'createAt',
          type: 'text'
        },
        {
          title: '推送数据',
          key: 'pushData',
          type: 'text'
        },
        {
          title: '推送时间',
          key: 'pushAt',
          type: 'text'
        },
        {
          title: '更新时间',
          key: 'updateAt',
          type: 'text'
        },
        {
          title: '备注',
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
  created () {
    this.listQuery.beginTime = timeFormatterSort(new Date(new Date().setDate(1))) + ' 00:00:00'
    // 结束时间
    this.listQuery.endTime = timeFormatterSort(new Date()) + ' 23:59:59'
    this.fetchData()
  },
  methods: {
    handleh () {
      let obj = JSON.parse(JSON.stringify(this.tableData))
      obj.forEach((item, index) => {
        // item.advTitle = this.advTargetTypeFormatter(item.type)
        item.happenEvent = this.happenFormatter(item.happenEvent)
        item.createAt = this.timeFormatter(item.createAt)
        item.pushAt = this.timeFormatter(item.pushAt)
        item.updateAt = this.timeFormatter(item.updateAt)
        // item.pushEnd = this.HHssNumToTimeFormatter(item.pushEnd)
        // item.resume = this.happenEventFormatter(item.happenEvent)
      })
      this.table2excel(this.jsonData, obj, 'excel.xlsx')
    },
    fetchData () {
      httpGet(pushWater, Object.assign(this.listQuery, {departmentId: this.$store.getters.departmentId}))
        .then((res) => {
          if (res.data.rows !== null) {
            this.tableData = res.data.rows
            this.total = res.data.total
          } else {
            this.tableData = []
            this.total = 0
          }
        })
    },
    seach () {
      this.listQuery.offset = 1
      this.fetchData()
    },
    handleCurrentChange (val) {
      this.listQuery.offset = val
      this.fetchData()
    },
    handleSizeChange (val) {
      this.listQuery.limit = val
      this.fetchData()
    },
    selectOne (val) {
      console.log(val)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>

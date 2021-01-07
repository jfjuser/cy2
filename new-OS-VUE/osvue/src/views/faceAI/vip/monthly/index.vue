<template>
  <div class="app-container">
    <div class="table-main">
      <!-- 操作 -->
      <div class="filter-container">
        <el-input  class="filter-item" style="width:150px;" v-model="listQuery.aiUserName" clearable placeholder="用户名"></el-input>
        <!-- <el-input  class="filter-item" style="width:150px;" v-model="listQuery.aiTokenId" clearable placeholder="相机ID"></el-input> -->
        <el-select clearable v-model="listQuery.aiTokenId" @focus="selectCamera" style="width: 150px;"  class="filter-item" placeholder="相机ID">
          <el-option v-for="item in resData" :key="item.id" :label="item.localName" :value="item.id"></el-option>
        </el-select>
          <el-date-picker
            v-model="listQuery.countYear"
            class="filter-item"
            align="right"
            style="width:180px;"
            type="year"
            format="yyyy"
            value-format="yyyy"
            placeholder="选择年">
          </el-date-picker>
          <el-date-picker
            v-model="listQuery.countMonth"
            class="filter-item"
            style="width:180px;"
            value-format="MM"
            type="month"
            format="MM"
            placeholder="选择月">
          </el-date-picker>
        <el-select clearable v-model="listQuery.countType" style="width: 180px;"  class="filter-item" placeholder="统计类型">
          <el-option v-for="item in identityType1" :key="item.valueNo" :label="item.valueName" :value="item.valueNo"></el-option>
        </el-select>
        <el-select clearable v-model="listQuery.downloadType" style="width: 180px;"  class="filter-item" placeholder="下载类型">
          <el-option v-for="item in identityType2" :key="item.valueNo" :label="item.valueName" :value="item.valueNo"></el-option>
        </el-select>
        <el-button class="filter-item" style="margin-left:10px" type="primary" :disabled="filterDisabled" @click="seach" icon="el-icon-search">搜索</el-button>
        <el-button class="filter-item" type="primary" @click="fetchData" icon="el-icon-refresh">刷新</el-button>
         <el-button class="filter-item" type="primary" @click="handleh"  icon="el-icon-download" v-has="['导出']" >导出</el-button>
      </div>
      <el-table stripe :header-cell-style="{background:'#f3f4f6'}" style="width: 100%" max-height="600" :data="tableData" v-loading.body="listLoading" element-loading-text="加载中..." border fit highlight-current-row>
        <el-table-column label="用户名称" align="center" prop="aiUserName"></el-table-column>
        <el-table-column label="相机名称" align="center" prop="aiTokenName"></el-table-column>
        <el-table-column label="文件大小" align="center" prop="fileSize"></el-table-column>
        <el-table-column label="操作次数" align="center" prop="downloadNum"></el-table-column>
        <el-table-column label="统计类型" align="center" prop="countType">
          <template slot-scope="scope">
            {{identityType3(scope.row.countType)}}
          </template>
        </el-table-column>
        <el-table-column label="下载类型" align="center" prop="downloadType">
          <template slot-scope="scope">
            {{identityType4(scope.row.downloadType)}}
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
import { identityType1, identityType2 } from '@/utils/selectAble.js'
import { identityType3, identityType4 } from '@/utils/formatter.js'
import { getCamera, getFlow } from '@/api/url'
import { httpGet } from '@/utils/restful'
export default {
  data () {
    return {
      total: 0,
      tableData: [],
      resData: [],
      listLoading: false,
      filterDisabled: false,
      listQuery: {
        offset: 1,
        limit: 10,
        aiTokenId: undefined,
        aiUserName: undefined,
        countType: undefined,
        downloadType: undefined,
        countYear: undefined,
        countMonth: undefined
      },
      identityType1: identityType1,
      identityType2: identityType2,
      identityType3: identityType3,
      identityType4: identityType4,
      jsonData: [
        {
          title: '用户名称',
          key: 'aiUserName',
          type: 'text'
        },
        {
          title: '相机名称',
          key: 'aiTokenName',
          type: 'text'
        },
        {
          title: '文件大小',
          key: 'fileSize',
          type: 'text'
        },
        {
          title: '操作次数',
          key: 'downloadNum',
          type: 'text'
        },
        {
          title: '统计类型',
          key: 'countType',
          type: 'text'
        },
        {
          title: '下载类型',
          key: 'downloadType',
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
        // item.price = this.moneyFormatter(item.price)
        item.countType = this.identityType3(item.countType)
        item.downloadType = this.identityType4(item.downloadType)
      })
      this.table2excel(this.jsonData, obj, 'excel.xlsx')
    },
    handleCurrentChange (val) {
      this.listQuery.offset = val
      this.fetchData()
    },
    handleSizeChange (val) {
      this.listQuery.limit = val
      this.fetchData()
    },
    fetchData () {
      this.listQuery = Object.assign(this.listQuery, {departmentId: this.$store.getters.departmentId})
      httpGet(getFlow, this.listQuery).then((res) => {
        if ((res.data.rows !== null) && (res.data.rows.length !== 0)) {
          this.tableData = res.data.rows
        }
        this.total = res.data.total
        console.log(res)
      }).catch((err) => {
        console.log(err)
      })
    },
    // 获取相机的下拉框
    selectCamera () {
      httpGet(getCamera + this.$store.getters.departmentId).then((res) => {
        if (res.data.length !== 0) {
          this.resData = res.data
        }
        console.log(res)
      }).catch((err) => {
        console.log(err)
      })
    },
    // 按需求进行搜索
    seach () {
      this.fetchData()
    }
  }
}
</script>

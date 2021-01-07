<template>
  <div class="app-container">
    <div class="table-main">
      <div class="filter-container">
          <!-- 学校模式中的特例 -------------------- 需做权限 -->
          <el-input v-has="['有为学校']"  class="filter-item" style="width:150px;" v-model="listQuery.localName" placeholder="请输入通道名称"></el-input>
        <el-select v-if="!(isShowColumnFormatter(['有为学校']))" class="filter-item" style="width:150px;" v-model="listQuery.mac" placeholder="请选择">
          <el-option v-for="item in localList" :key="item.mac" :label="item.localName" :value="item.mac"></el-option>
        </el-select>
        <el-input v-if="!(isShowColumnFormatter(['有为学校']))"  class="filter-item" style="width:150px;" type="number" v-model="listQuery.offlineInterval" placeholder="离线时长(秒)"></el-input>
        <el-date-picker
          clearable
          v-model="time"
          @change="changeTime"
          class="filter-item"
          type="datetimerange"
          style="padding:0 15px;width:380px"
          value-format = "yyyy-MM-dd HH:mm:ss"
          :default-time="['00:00:00', '23:59:59']"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
        <el-select class="filter-item" style="width:200px;" v-model="listQuery.type" placeholder="异常原因">
          <el-option v-for="item of cameraOfflineType" :key="item.valueNo" :label="item.valueName" :value="item.valueNo"></el-option>
        </el-select>
        <el-button class="filter-item search" type="primary"   @click="handleFilter" icon="el-icon-search">搜索</el-button>
        <el-button class="filter-item" type="primary"   @click="handleRefresh" icon="el-icon-refresh">刷新</el-button>
        <el-button class="filter-item" type="primary" @click="handleh"  icon="el-icon-download" v-has="['导出']" >导出</el-button>
      </div>
      <el-table stripe :header-cell-style="{background:'#f3f4f6'}" style="width: 100%"   max-height="600" :data="tableData" v-loading.body="listLoading"  element-loading-text="加载中..." border fit highlight-current-row>
        <el-table-column label="通道名称" align="center" prop="localName"></el-table-column>
        <el-table-column v-if="isShowColumnFormatter(['有为学校'])" label="学校" align="center" prop="school"></el-table-column>
        <el-table-column label="离线时间" align="center" prop="offlineTime">
          <template slot-scope="scope">
            {{timeFormatter(scope.row.offlineTime)}}
          </template>
        </el-table-column>
        <el-table-column label="登录时间" align="center" prop="loginTime">
          <template slot-scope="scope">
            {{timeFormatter(scope.row.loginTime)}}
          </template>
        </el-table-column>
        <el-table-column label="离线时长" align="center" prop="offlineInterval">
          <template slot-scope="scope">
            {{timeDuration(scope.row.offlineInterval)}}
          </template>
        </el-table-column>
        <el-table-column label="备注信息" align="center" prop="type">
          <template slot-scope="scope">
            {{cameraOfflineFormatter(scope.row.type)}}
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination background  :page-sizes="[10,20,30,50]" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.offset " :page-size="listQuery.limit" :total="total" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { cameraOfflineType } from '@/utils/selectAble.js'
import { timeFormatter, timeDuration, isShowColumnFormatter, cameraOfflineFormatter } from '@/utils/formatter.js'
import { httpGet } from '@/utils/restful'
import { getCamera, getOffLineAnalysis } from '@/api/url'
export default {
  data () {
    return {
      listLoading: true,
      isShowColumnFormatter: isShowColumnFormatter,
      listQuery: {
        offset: 1,
        limit: 10,
        departmentId: this.$store.getters.departmentId,
        beginTime: undefined,
        endTime: undefined,
        offlineInterval: undefined,
        mac: undefined,
        type: undefined
      },
      cameraOfflineType: cameraOfflineType,
      timeFormatter: timeFormatter,
      timeDuration: timeDuration,
      cameraOfflineFormatter: cameraOfflineFormatter,
      tableData: [],
      total: null,
      localList: [],
      time: [],
      jsonData: [
        {
          title: '通道名称',
          key: 'localName',
          type: 'text'
        },
        {
          title: '学校',
          key: 'school',
          type: 'text'
        },
        {
          title: '离线时间',
          key: 'offlineTime',
          type: 'text'
        },
        {
          title: '登录时间',
          key: 'loginTime',
          type: 'text'
        },
        {
          title: '离线时长',
          key: 'offlineInterval',
          type: 'text'
        },
        {
          title: '备注信息',
          key: 'type',
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
      if (!this.isShowColumnFormatter(['有为学校'])) {
        this.jsonData.splice(1, 1)
      }
      let obj = JSON.parse(JSON.stringify(this.tableData))
      obj.forEach((item, index) => {
        // item.loginOutAt = this.timeFormatter(item.loginOutAt)
        item.offlineTime = this.timeFormatter(item.offlineTime)
        item.loginTime = this.timeFormatter(item.loginTime)
        item.offlineInterval = this.timeDuration(item.offlineInterval)
        item.type = this.cameraOfflineFormatter(item.type)
      })
      this.table2excel(this.jsonData, obj, 'excel.xlsx')
    },
    // 监听搜索的时间
    changeTime (value) {
      if (value === null) {
        this.listQuery.beginTime = undefined
        this.listQuery.endTime = undefined
      } else {
        this.listQuery.beginTime = value[0]
        this.listQuery.endTime = value[1]
      }
    },
    // 获取所有的通道列表
    loadAll () {
      httpGet(getCamera + this.$store.getters.departmentId).then(res => {
        this.localList = res.data
      }).catch(() => {})
    },
    handleRefresh () {
      this.listQuery = {
        offset: 1,
        limit: 10,
        departmentId: this.$store.getters.departmentId,
        offlineInterval: undefined,
        beginTime: undefined,
        endTime: undefined,
        mac: undefined,
        type: undefined
      }
      this.time = []
      this.fetchData()
    },
    fetchData () {
      this.listLoading = true
      httpGet(getOffLineAnalysis, this.listQuery).then(res => {
        if (res.data === null || res.data.rows === null) {
          this.tableData = []
          this.total = 0
        } else {
          this.tableData = res.data.rows
          if (this.isShowColumnFormatter(['有为学校']) === true) {
            this.tableData.map((item) => {
              item.school = this.$store.getters.depName
            })
          }
          this.total = res.data.total
        }
        this.listLoading = false
        this.loadAll()
      }).catch(() => {
        this.listLoading = false
      })
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
    }
  }
}
</script>

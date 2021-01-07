<template>
  <div class="noState">
    <div style="width:100%;padding:20px 20px 0;box-sizing:border-box">
      <el-button class="filter-item" type="primary" @click="handleh"  icon="el-icon-download" v-has="['导出']" >导出</el-button>
      </div>
      <el-card class="box-card" style="margin-top:20px">
    <el-table stripe :header-cell-style="{background:'#f3f4f6'}" style="width: 100%" max-height="600" :data="tableData"   element-loading-text="加载中..." >
        <el-table-column width="150" label="姓名" align="center" prop="userName"></el-table-column>
        <el-table-column width="150" label="手机号" align="center" prop="phone">
          <template slot-scope="scope">
            <template v-if="isShowColumnFormatter(['隐藏手机号'])">{{scope.row.phone | hiddenPhone}}</template>
            <template v-else>{{scope.row.phone}}</template>
          </template>
        </el-table-column>
        <!-- <el-table-column label="地址" align="center" prop="addr"></el-table-column> -->
        <el-table-column width="150"  label="IC卡号" align="center" prop="accessCardId"></el-table-column>
        <el-table-column width="150" label="韦根卡号" align="center" prop="wiegandCard"></el-table-column>
        <el-table-column width="150" label="房号地址" align="center">
          <template slot-scope="scope">
            <!-- 判断  floorNum & roomNum 有则显示 , 没有则显示 ==> addr -->
            <span v-if="scope.row.addr !== null">{{scope.row.addr}}</span>
            <span v-else-if="scope.row.floorNum !== null && scope.row.floorNum !== ''">{{scope.row.floorNum  + scope.row.roomNum}}</span>
          </template>
        </el-table-column>
        <el-table-column width="150" label="类型" align="center" prop="type">
          <template slot-scope="scope">
            <span v-if="scope.row.type === 0">非访客</span>
            <span v-if="scope.row.type === 1">访客</span>
            <span v-if="scope.row.type === 2">黑名单</span>
          </template>
        </el-table-column>
        <el-table-column width="150" label="审核状态" align="center" prop="isCheck">
          <template slot-scope="scope">
            {{checkStatusFormatter(scope.row.isCheck)}}
          </template>
        </el-table-column>
        <el-table-column width="150" label="同步信息" align="center" prop="aiPower"></el-table-column>
        <el-table-column width="150" label="有效日期" align="center" prop="endTime">
          <template slot-scope="scope">
            {{timeFormatter(scope.row.endTime)}}
          </template>
        </el-table-column>
        <el-table-column width="150" label="备注信息" align="center" prop="remarks"></el-table-column>
        <!-- 新增下发状态 -->
        <el-table-column width="150" label="错误状态" align="center" prop="errorMsg"></el-table-column>
      </el-table>
    <el-pagination
    :page-size="this.listQuery.limit"
    @current-change="handleCurrentChange" :current-page="listQuery.offset "  :total="total"
    style="margin-top:50px"
  background
  layout="prev, pager, next">
</el-pagination>
</el-card>
    <!-- <el-pagination
  background
  layout="prev, pager, next"
  :total="1000">
</el-pagination> -->
  </div>
</template>
<script>
import { isShowColumnFormatter, relationshipFormatter, checkStatusFormatter, personFormatter, timeFormatter } from '@/utils/formatter.js'
import { getErrorPage } from '@/api/url'
import { httpGet } from '@/utils/restful' //
export default {
  name: '',
  created () {
    this.getData()
  },
  data () {
    return {
      relationshipFormatter: relationshipFormatter,
      isShowColumnFormatter: isShowColumnFormatter,
      checkStatusFormatter: checkStatusFormatter,
      personFormatter: personFormatter,
      timeFormatter: timeFormatter,
      listLoading: true,
      listQuery: {
        limit: 10,
        offset: 1,
        departmentId: this.$store.getters.departmentId
      },
      tableData: [],
      total: 0,
      jsonData: [
        {
          title: '姓名',
          key: 'userName',
          type: 'text'
        },
        {
          title: '手机号',
          key: 'phone',
          type: 'text'
        },
        {
          title: 'IC卡号',
          key: 'accessCardId',
          type: 'text'
        },
        {
          title: '韦根卡号',
          key: 'wiegandCard',
          type: 'text'
        },
        {
          title: '房号地址',
          key: 'addr',
          type: 'text'
        },
        {
          title: '类型',
          key: 'type',
          type: 'text'
        },
        {
          title: '审核状态',
          key: 'isCheck',
          type: 'text'
        },
        {
          title: '同步信息',
          key: 'aiPower',
          type: 'text'
        },
        {
          title: '有效日期',
          key: 'endTime',
          type: 'text'
        },
        {
          title: '备注信息',
          key: 'remarks',
          type: 'text'
        },
        {
          title: '错误状态',
          key: 'errorMsg',
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
  methods: {
    handleh () {
      let obj = JSON.parse(JSON.stringify(this.tableData))
      obj.forEach((item, index) => {
        item.phone = this.isShowColumnFormatter(['隐藏手机号']) ? this.func(item.phone) : item.phone
        item.addr = item.addr !== null ? item.addr : ((item.floorNum !== null && item.floorNum !== '') ? (item.floorNum + item.roomNum) : '')
        item.type = parseInt(item.type) === 0 ? '非访客' : ((parseInt(item.type) === 1) ? '访客' : '黑名单')
        item.isCheck = this.checkStatusFormatter(item.isCheck)
        item.endTime = this.timeFormatter(item.endTime)
      })
      this.table2excel(this.jsonData, obj, 'excel.xlsx')
    },
    getData () {
      httpGet(getErrorPage, this.listQuery)
        .then(res => {
          if (res.data === null || res.data.rows === null) {
            this.tableData = []
            this.total = 0
          } else {
            this.tableData = res.data.rows
            this.total = res.data.total
          }
          this.listLoading = false
        }).catch(() => {
        })
    },
    handleCurrentChange (val) {
      this.listQuery.offset = val
      this.getData()
    },
    func (value) {
      if (value) {
        return value.replace(/^(\d{3})\d{4}(\d{4})$/, '$1****$2')
      } else {
        return ''
      }
    }
  }
}
</script>
<style lang='scss' scoped>
.noState{
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    width: 100%;
}
</style>

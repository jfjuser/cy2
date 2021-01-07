<template>
  <div class="app-container">
    <div class="table-main">
      <div class="filter-container">
        <el-button class="filter-item" type="primary" @click="handleRefresh"  icon="el-icon-refresh">刷新</el-button>
        <el-button class="filter-item" type="primary" @click="handleh"  icon="el-icon-download" v-has="['导出']" >导出</el-button>
      </div>
      <el-table stripe :header-cell-style="{background:'#f3f4f6'}" style="width: 100%" max-height="600" :data="tableData" v-loading.body="listLoading"  element-loading-text="加载中..." border fit highlight-current-row>
        <el-table-column type="selection" width="40" fixed="left" v-if = "isShowColumnFormatter(['删除'])" ></el-table-column>
         <el-table-column fixed="left" label="姓名" align="center" prop="userName"></el-table-column>
        <el-table-column label="日期" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.workDay">{{timeFormatterSort(scope.row.workDay)}}</span>
             <span v-else>--</span>
          </template>
        </el-table-column>
         <el-table-column fixed="right"   label="操作" align="center" class-name="small-padding fixed-width" width="300">
          <template slot-scope="scope">
            <el-button  type="primary" @click="auditing(scope.row)" size="mini">审核</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination background  :page-sizes="[10,20,30, 50]" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.offset " :page-size="listQuery.limit" :total="total" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
      </div>
      <!-- 添加修改 -->
      <el-dialog title="审核" :visible.sync="ScheduleVisibles" width="30%">
        <el-radio-group v-model="radiossss">
          <el-radio :label="1">审核通过</el-radio>
          <el-radio :label="0">审核不通过</el-radio>
         </el-radio-group>
         <div slot="footer" class="dialog-footer">
            <el-button  @click="ScheduleVisibles = false;radiossss=-1;rowId=''">取消</el-button>
            <el-button  type="primary" @click="createCycles">确定</el-button>
          </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { isShowColumnFormatter, attendTypeFormatter, timeFormatterSort } from '@/utils/formatter.js'
import { httpGet, httpDelete } from '@/utils/restful'
import { applyOverTime, applyOverTimet, AIAttendGroup } from '@/api/url'
import Schedule from './components/Schedule'
export default {
  components: {
    Schedule
  },
  data () {
    return {
      radiossss: -1,
      isShowColumnFormatter: isShowColumnFormatter,
      attendTypeFormatter: attendTypeFormatter,
      timeFormatterSort: timeFormatterSort,
      list: null,
      listLoading: true,
      listQuery: {
        offset: 1,
        limit: 10
      },
      tableData: [],
      total: null,
      ScheduleVisibles: false,
      jsonData: [
        {
          title: '姓名',
          key: 'userName',
          type: 'text'
        },
        {
          title: '日期',
          key: 'workDay',
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
        item.workDay = this.timeFormatterSort(item.workDay)
      })
      this.table2excel(this.jsonData, obj, 'excel.xlsx')
    },
    // 显示弹窗保存id
    auditing (row) {
      this.rowId = row.id
      this.ScheduleVisibles = true
    },
    // 获取加班申请列表
    fetchData () {
      this.listQuery.departmentId = this.$store.getters.departmentId
      httpGet(applyOverTime, this.listQuery).then(res => {
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
          httpDelete(AIAttendGroup, {ids: this.selectArrayId}).then(res => {
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
    // 刷新
    handleRefresh () {
      this.listQuery = {
        limit: 10,
        offset: 1
      }
      this.fetchData()
    },
    // 加班审核
    createCycles () {
      httpGet(applyOverTimet + '/' + this.rowId + '/' + this.radiossss).then(res => {
        if (res.message) {
          this.$message({
            message: res.message,
            type: 'success',
            duration: 4 * 1000
          })
          this.fetchData()
        } else {
          this.$message({
            message: '审核失败',
            type: 'warning',
            duration: 4 * 1000
          })
        }
        this.ScheduleVisibles = false
        this.radiossss = -1
        this.rowId = ''
      }).catch(() => {
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  .work-day{
    display: flex;
  }
</style>

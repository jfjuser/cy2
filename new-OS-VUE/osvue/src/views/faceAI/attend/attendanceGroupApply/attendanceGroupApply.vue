<template>
  <div class="attendanceGroupApply">
    <div style="width:100%;padding:20px 20px 0;box-sizing:border-box">
    <el-button class="filter-item" type="primary" @click="handleh"  icon="el-icon-download" v-has="['导出']" >导出</el-button>
    </div>
    <el-card class="box-card">
      <el-table stripe   v-loading="loading" :data="listData" border style="width: 100%" :header-cell-style="{background:'#f3f4f6'}">
        <el-table-column align="center" prop="userName" label="申请人" ></el-table-column>
        <el-table-column align="center" prop="name" label="考勤组" ></el-table-column>
        <el-table-column align="center" label="申请理由" >
           <template slot-scope="scope">
             <span>{{scope.row.remarks?scope.row.remarks:'无'}}</span>
           </template>
        </el-table-column>
        <el-table-column align="center" fixed="right" label="审核" >
           <template slot-scope="scope">
             <el-button @click="handleClick(scope.row, 1)" type="text" size="small">同意</el-button>
             <el-button @click="handleClick(scope.row, 2)" type="text" size="small">拒绝</el-button>
           </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- <el-dialog
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose">
      <span>这是一段信息</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog> -->
  </div>
</template>
<script>
import { httpGet, httpPost } from '@/utils/restful'
import { listWorkCheckGroupForAll, checkEmployeeAndAddToGroup } from '@/api/url'
export default {
  name: '',
  data () {
    return {
      listData: [],
      loading: true,
      jsonData: [
        {
          title: '申请人',
          key: 'userName',
          type: 'text'
        },
        {
          title: '考勤组',
          key: 'name',
          type: 'text'
        },
        {
          title: '申请理由',
          key: 'remarks',
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
    this.getData()
  },
  methods: {
    handleh () {
      let obj = JSON.parse(JSON.stringify(this.listData))
      obj.forEach((item, index) => {
        item.remarks = item.remarks ? item.remarks : '无'
      })
      this.table2excel(this.jsonData, obj, 'excel.xlsx')
    },
    // 获取考勤组申请列表
    getData () {
      httpGet(listWorkCheckGroupForAll)
        .then(res => {
          this.listData = res.data
          this.loading = false
        })
    },
    // 同意或拒绝审核
    handleClick (item, condition) {
      const h = this.$createElement
      this.$msgbox({
        title: '提示',
        message: h('p', null, [
          h('span', null, condition === 1 ? '确定同意' : '确定拒绝'),
          h('i', { style: 'color: teal' }, item.userName),
          h('span', null, '加入考勤组?')
        ]),
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        this.loading = true
        return httpPost(checkEmployeeAndAddToGroup, {
          id: item.id,
          userId: item.userId,
          isChekc: condition
        })
      }).then(() => {
        this.getData()
      }).catch(() => {
      })
    }
  }
}
</script>
<style lang='scss' scoped>
.attendanceGroupApply{
  display: flex;
  justify-content: center;
  flex-wrap:wrap;
  width: 100%;
}
.box-card{
  margin: 20px;
  width:100%;
}
</style>

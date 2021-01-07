<template>
  <div>
    <topRightBtn @click.native="fetchData">刷新</topRightBtn>
    <main>
      <div class="text-c" style="color: #909399;padding-top:.5rem" v-if="tableData.length===0" >暂无数据</div>
      <list-card v-for="(item, index) in tableData" :key="index">
          <van-cell-group :border="false">
              <van-cell title="交接人" :value="item.userName" />
              <van-cell title="收费金额" :value="moneyFormatter(item.fee)" />
              <van-cell title="交接时间" :value="timeFormatter(item.transferTime)" />
              <van-cell title="状态">
                <span style="color:#67c23a" v-if="item.status === 1">通过审核</span>
                <span style="color:#f56c6c" v-if="item.status === 0">未审核</span>
              </van-cell>
              <van-cell title="备注信息" :value="item.remarks" />
          </van-cell-group>
      </list-card>
     <van-pagination
        v-if="tableData.length!==0"
        v-model="listQuery.offset"
        :page-count="Math.ceil(total/listQuery.limit)"
        :items-per-page="listQuery.limit"
        mode="simple"
        @change="changePage"/>
    </main>
  </div>
</template>

<script>
import topRightBtn from '@/components/topRightBtn'
import listCard from '@/components/listCard'
import { Pagination, Cell, CellGroup } from 'vant'
import { moneyFormatter, timeFormatter } from '@/utils/formatter'
import { httpGet } from '@/utils/restful'
import { getTransfer } from '@/api/url'
export default {
  data () {
    return {
      tableData: [],
      moneyFormatter: moneyFormatter,
      timeFormatter: timeFormatter,
      listQuery: {
        offset: 1,
        limit: 10
      },
      total: 0
    }
  },
  components: {
    topRightBtn,
    listCard,
    [Pagination.name]: Pagination,
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup
  },
  methods: {
    changePage (val) {
      this.listQuery.offset = val
      this.fetchData()
      document.body.scrollTop = 0
    },
    fetchData () {
      const ToastLoading = this.$toast.loading({ message: '加载中...', position: 'middle', duration: 0 })
      this.listQuery = Object.assign(this.listQuery, {departmentId: this.$store.getters.departmentId})
      httpGet(getTransfer, this.listQuery).then(res => {
        if (res.data === null || res.data.rows === null) {
          this.tableData = []
          this.total = 0
        } else {
          this.tableData = res.data.rows
          this.total = res.data.total
        }
        ToastLoading.clear()
      }).catch(() => {
        ToastLoading.clear()
      })
    }
  },
  created () {
    this.fetchData()
  }
}
</script>

<style>

</style>

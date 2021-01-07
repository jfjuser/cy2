<template>
   <div>
    <topRightBtn @click.native="refresh">刷新</topRightBtn>
    <main>
      <div class="text-c" style="color: #909399;" v-if="tableData.length===0" >暂无数据</div>
      <list-card v-for="(item, index) in tableData" :key="index">
          <van-cell-group :border="false" style="margin-top:0.35rem">
              <van-cell title="操作员编号" :label="item.operatorId" label-class="text-r" />
              <van-cell title="操作员名称" value-class="col-right" :value="item.operatorName" />
              <van-cell title="通道名称" value-class="col-right" :value="item.localName" />
              <van-cell title="开闸原因" :value="item.remark" label-class="text-r" />
              <van-cell title="开闸时间" :value="timeFormatter(item.createTime)" label-class="text-r" />
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
import { timeFormatter } from '@/utils/formatter'
import { Cell, Search, CellGroup, Field, Pagination, Button } from 'vant'
import { httpGet } from '@/utils/restful'
import { getBoxOpenRecord } from '@/api/url'
export default {
  data () {
    return {
      tableData: [],
      timeFormatter: timeFormatter,
      listQuery: {
        offset: 1,
        limit: 10
      },
      total: 0
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    refresh () {
      this.listQuery = {
        offset: 1,
        limit: 10
      }
      this.fetchData()
    },
    fetchData () {
      const ToastLoading = this.$toast.loading({ message: '加载中...', position: 'middle', duration: 0 })
      httpGet(getBoxOpenRecord + this.$store.getters.departmentId).then(res => {
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
    },
    changePage () {
      this.listQuery.offset = 1
      this.fetchData()
      document.body.scrollTop = 0
    }
  },
  components: {
    topRightBtn,
    listCard,
    [Search.name]: Search,
    [Field.name]: Field,
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup,
    [Pagination.name]: Pagination,
    [Button.name]: Button
  }
}
</script>

<style lang="scss" scoped>
  .btn{
    margin-top:1rem;
    width:60vw;
    margin-left: 20vw;
    border-radius:0.35rem
  }
  .col-right{
    color:rgb(11, 240, 240)
  }
</style>

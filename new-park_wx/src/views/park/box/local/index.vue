<template>
   <div>
    <topRightBtn @click.native="refresh">刷新</topRightBtn>
    <main>
      <div class="text-c" style="color: #909399;padding-top:0.5rem" v-if="tableData.length===0" >暂无数据</div>
      <list-card v-for="(item, index) in tableData" :key="index">
          <van-cell-group :border="false" style="margin-top:0.35rem">
              <van-cell title="通道编号" :label="item.localId" label-class="text-r" />
              <van-cell title="通道名称" value-class="col-right" :value="item.localName" />
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
import { moneyFormatter, timeFormatter, timeFormatterSort } from '@/utils/formatter'
import { Cell, Search, CellGroup, Popup, Field, Pagination, Button, DatetimePicker } from 'vant'
import { httpGet } from '@/utils/restful'
import { getBoxLocal } from '@/api/url'
export default {
  data () {
    return {
      tableData: [],
      isExport: false,
      maxDate: new Date(),
      currentDate1: new Date(),
      currentDate2: new Date(),
      showbeginTime: false,
      showendTime: false,
      isSearch: false,
      moneyFormatter: moneyFormatter,
      timeFormatterSort: timeFormatterSort,
      timeFormatter: timeFormatter,
      listQuery: {
        offset: 1,
        limit: 10,
        userName: undefined,
        beginTime: undefined,
        endTime: undefined
      },
      total: 0,
      showPopup: false
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    refresh () {
      this.listQuery = {
        offset: 1,
        limit: 10,
        userName: undefined,
        beginTime: undefined,
        endTime: undefined
      }
      this.fetchData()
    },
    onSearch () {
      this.listQuery.offset = 1
      this.fetchData()
      this.showPopup = false
    },
    fetchData () {
      const ToastLoading = this.$toast.loading({ message: '加载中...', position: 'middle', duration: 0 })
      this.listQuery = Object.assign(this.listQuery, {departmentId: this.$store.getters.departmentId})
      httpGet(getBoxLocal + '/' + this.$store.getters.departmentId, this.listQuery).then(res => {
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
    },
    handleBeginTime (val) {
      this.listQuery.beginTime = timeFormatterSort(val) + ' 00:00:00'
      this.showbeginTime = false
    },
    handleEndTime (val) {
      this.listQuery.endTime = timeFormatterSort(val) + ' 23:59:59'
      this.showendTime = false
    }
  },
  components: {
    topRightBtn,
    listCard,
    [Search.name]: Search,
    [Field.name]: Field,
    [Cell.name]: Cell,
    [Popup.name]: Popup,
    [CellGroup.name]: CellGroup,
    [Pagination.name]: Pagination,
    [Button.name]: Button,
    [DatetimePicker.name]: DatetimePicker
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

<template>
   <div>
    <topRightBtn @click.native="refresh">刷新</topRightBtn>
    <van-cell @click="isSearch = true" title="选择时间" is-link/>
    <van-search placeholder="车主姓名" show-action v-model.trim="listQuery.userName" class="mar-b-15" >
      <div @click="onSearch" slot="action">搜索</div>
    </van-search>
    <van-popup v-model="isSearch" position="right" style="width:85%;min-height:100vh">
        <van-cell title="开始日期" is-link :label="listQuery.beginTime" @click="showbeginTime=true" />
        <van-cell title="结束日期" is-link :label="listQuery.endTime" @click="showendTime=true" />
        <div class="text-c">
          <van-button class="btn" @click="isSearch = false" round>取消</van-button>
          <van-button class="btn" type="info" @click="onSearch" round>搜索</van-button>
        </div>
    </van-popup>
    <van-popup v-model="showbeginTime" position="bottom" :close-on-click-overlay="false" safe-area-inset-bottom>
      <van-datetime-picker
        v-model="currentDate1"
        type="date"
        :max-date="maxDate"
        show-toolbar
        @cancel="showbeginTime=false"
        @confirm="handleBeginTime"
        />
    </van-popup>
    <van-popup v-model="showendTime" position="bottom" :close-on-click-overlay="false" safe-area-inset-bottom>
        <van-datetime-picker
        v-model="currentDate2"
        type="date"
        :max-date="maxDate"
        show-toolbar
        @cancel="showendTime=false"
        @confirm="handleEndTime"
        />
    </van-popup>

    <main>
      <div class="text-c" style="color: #909399;" v-if="tableData.length===0" >暂无数据</div>
      <list-card v-for="(item, index) in tableData" :key="index">
          <van-cell-group :border="false">
              <van-cell title="订单编号" :label="item.payNo" label-class="text-r" />
              <van-cell title="车主姓名" :value="item.userName" />
              <van-cell title="车位数" :value="item.carTal" />
              <van-cell title="包月个数" :value="item.monthNumber" />
              <van-cell title="总金额" :value="moneyFormatter(item.monthPrice)" />
              <van-cell title="充值时间" :value="timeFormatter(item.createAt)" />
              <van-cell title="备注信息" :value="item.remark" />
              <van-cell title="操作人" :value="item.creatorName" />
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
import { getTomWhiteChargeRecord } from '@/api/url'
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
      httpGet(getTomWhiteChargeRecord, this.listQuery).then(res => {
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
    display: inline-block;
  }
</style>

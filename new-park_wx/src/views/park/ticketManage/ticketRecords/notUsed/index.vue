<template>
    <div>
        <van-button icon="search" block type="info" @click="showPopup=true" class="mar-b-15">搜索</van-button>
        <van-popup v-model="showPopup" position="right" closeable style="width: 85%;height: 100%;" >
            <van-cell title="筛选" />
            <van-cell-group>
              <van-field v-model.trim="listQuery.ticketCode" label="订单号" placeholder="请输入"/>
              <van-field v-model.trim="listQuery.plate" label="车牌号" placeholder="请输入"/>
              <van-cell title="开始日期" is-link :label="listQuery.beginTime" @click="showbeginTime=true" />
              <van-cell title="结束日期" is-link :label="listQuery.endTime" @click="showendTime=true" />
            </van-cell-group>
            <van-button type="info" block @click="handleFilter" >搜索</van-button>
        </van-popup>

        <main>
            <div class="text-c" style="color: #909399;" v-if="tableData.length===0" >暂无数据</div>
            <list-card v-for="(item, index) in tableData" :key="index" >
                <van-cell-group :border="false">
                    <van-cell title="优惠券编号" :value="item.ticketCode" />
                    <van-cell title="优惠券名称" :value="item.ruleName" />
                    <van-cell title="车牌号码" :value="item.plate" />
                    <van-cell title="有效日期" :value="timeFormatter(item.validateAt)" />
                    <van-cell title="绑定时间" :value="timeFormatter(item.bingdingAt)" />
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
    </div>
</template>

<script>
import { Cell, CellGroup, Pagination, Button, Popup, Field, DatetimePicker } from 'vant'
import listCard from '@/components/listCard'
import { getShopNotUsedTicket } from '@/api/url'
import { httpGet } from '@/utils/restful'
import { timeFormatterSort, timeFormatter } from '@/utils/formatter.js'
export default {
  name: 'is-used',
  components: {
    [Pagination.name]: Pagination,
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup,
    [Button.name]: Button,
    [Popup.name]: Popup,
    [Field.name]: Field,
    [DatetimePicker.name]: DatetimePicker,
    listCard
  },
  data () {
    return {
      timeFormatter: timeFormatter,
      listQuery: {
        offset: 1,
        limit: 10,
        plate: undefined,
        ticketCode: undefined,
        beginTime: undefined,
        endTime: undefined
      },
      tableData: [],
      total: 0,
      showPopup: false,
      showbeginTime: false,
      showendTime: false,
      maxDate: new Date(),
      currentDate1: new Date(),
      currentDate2: new Date()
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    handleBeginTime (val) {
      this.listQuery.beginTime = timeFormatterSort(val) + ' 00:00:00'
      this.showbeginTime = false
    },
    handleEndTime (val) {
      this.listQuery.endTime = timeFormatterSort(val) + ' 23:59:59'
      this.showendTime = false
    },
    fetchData () {
      const ToastLoading = this.$toast.loading({ message: '加载中...', position: 'middle', duration: 0 })
      this.listQuery = Object.assign(this.listQuery, {shopId: this.$store.getters.departmentId})
      httpGet(getShopNotUsedTicket, this.listQuery).then(res => {
        if (res.data === null || res.data.rows === []) {
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
    // 分页
    changePage (val) {
      this.listQuery.offset = val
      this.fetchData()
      document.body.scrollTop = 0
    },
    // 搜索
    handleFilter () {
      const beginTime = this.listQuery.beginTime
      const endTime = this.listQuery.endTime
      if (new Date(beginTime).getFullYear() === new Date(endTime).getFullYear() && new Date(beginTime).getMonth() === new Date(endTime).getMonth()) {
        this.listQuery.offset = 1
        this.fetchData()
        this.showPopup = false
      } else {
        this.$notify({message: '请填写一个月内的时间段进行搜索', type: 'warning'})
      }
    }
  }
}
</script>

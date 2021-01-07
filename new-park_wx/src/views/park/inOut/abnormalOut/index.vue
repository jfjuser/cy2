<template>
  <div>
    <van-notice-bar>
        备注：异常出场是指车主扫出口直付码支付完后未开闸的情况
    </van-notice-bar>
    <van-button icon="search" block type="info" @click="showPopup=true" class="mar-b-15">搜索</van-button>
    <van-popup v-model="showPopup" position="right" closeable style="width: 85%;height: 100%;" >
        <van-cell title="筛选" />
        <van-cell-group>
          <van-field v-model.trim="listQuery.localId" label="订单号" placeholder="请输入"/>
          <van-field v-model.trim="listQuery.plate" label="车牌号" placeholder="请输入"/>
          <van-cell title="开始日期" is-link :label="listQuery.beginTime" @click="showbeginTime=true" />
          <van-cell title="结束日期" is-link :label="listQuery.endTime" @click="showendTime=true" />
        </van-cell-group>
        <van-button type="info" block @click="handleFilter">搜索</van-button>
    </van-popup>

    <main>
        <div class="text-c" style="color: #909399;" v-if="tableData.length===0" >暂无数据</div>
        <list-card v-for="(item, index) in tableData" :key="index" >
            <van-cell-group :border="false">
                <van-cell title="订单号" :value="item.localId" />
                <van-cell title="车牌" :value="item.plate" />
                <van-cell title="直付金额" :value="moneyInOutFormatter(item.electronicPrepay)" />
                <van-cell title="车主优惠" :value="moneyInOutFormatter(item.ticketPay)" />
                <van-cell title="商家优惠" :value="moneyInOutFormatter(item.ticketPayReal)" />
                <van-cell title="停车时长" :value="item.duration" />
                <van-cell title="进场时间" :value="timeFormatter(item.inTime)" />
                <van-cell title="出场时间" :value="timeFormatter(item.outTime)" />
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
import { NoticeBar, Cell, CellGroup, Popup, DatetimePicker, Button, Pagination, Field } from 'vant'
import listCard from '@/components/listCard'
import { moneyInOutFormatter, timeFormatter, timeFormatterSort } from '@/utils/formatter.js'
import { httpGet } from '@/utils/restful'
import { getAbnormalOut } from '@/api/url'
export default {
  components: {
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup,
    [Popup.name]: Popup,
    [DatetimePicker.name]: DatetimePicker,
    [Button.name]: Button,
    [Pagination.name]: Pagination,
    [Field.name]: Field,
    'van-notice-bar': NoticeBar,
    listCard
  },
  data () {
    return {
      moneyInOutFormatter,
      timeFormatter,
      showPopup: false,
      listQuery: {
        offset: 1,
        limit: 10,
        departmentId: this.$store.getters.departmentId,
        beginTime: undefined,
        endTime: undefined,
        localId: undefined,
        plate: undefined
      },
      tableData: [],
      total: null,
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
      httpGet(getAbnormalOut, this.listQuery).then(res => {
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
    // 分页
    changePage (val) {
      this.listQuery.offset = val
      this.fetchData()
      document.body.scrollTop = 0
    },
    // 搜索
    handleFilter () {
      this.listQuery.offset = 1
      this.fetchData()
      this.showPopup = false
    }
  }
}
</script>

<template>
    <div>
        <van-notice-bar color="#1989fa" background="#ecf9ff" left-icon="info-o">
            温馨提示：此处订单在非人为干涉的情况下,会在支付成功自动开闸放行后进行自动结算,视网络状况,直付订单可能会短暂停留,通常只会显示预付订单
        </van-notice-bar>
        <van-notice-bar color="#1989fa" background="#ecf9ff" left-icon="info-o">
            温馨提示2：出场后才付的钱不会自动统计
        </van-notice-bar>
        <van-button icon="search" block type="info" @click="showPopup=true">搜索</van-button>
        <van-popup v-model="showPopup" position="right" closeable style="width: 85%;height: 100%;" >
            <van-cell title="筛选" />
            <van-cell-group>
                <van-cell title="开始日期" is-link :label="dataForm.beginTime" @click="showbeginTime=true" />
                <van-cell title="结束日期" is-link :label="dataForm.endTime" @click="showendTime=true" />
            </van-cell-group>
            <van-button type="info" block @click="handleFilter1">搜索</van-button>
        </van-popup>
        <section>
            <p class="title">总计</p>
            <van-grid class="summary" :column-num="5">
                <van-grid-item>
                    <div class="num mar-b-10">{{countOrder.sumReceiveFee}}</div>
                    <p class="fc-grey">应收金额</p>
                </van-grid-item>
                <van-grid-item>
                    <div class="num mar-b-10">{{countOrder.sumRealFee}}</div>
                    <p class="fc-grey">实收金额</p>
                </van-grid-item>
                <van-grid-item>
                    <div class="num mar-b-10">{{countOrder.sumTicketPay}}</div>
                    <p class="fc-grey">车主优惠</p>
                </van-grid-item>
                <van-grid-item>
                    <div class="num mar-b-10">{{countOrder.sumTicketPayReal}}</div>
                    <p class="fc-grey">商家优惠</p>
                </van-grid-item>
                <van-grid-item>
                    <div class="num mar-b-10">{{countOrder.sumElectronicPrepay}}</div>
                    <p class="fc-grey">电子支付</p>
                </van-grid-item>
            </van-grid>
        </section>

        <main>
            <div class="text-c" style="color: #909399;" v-if="paramsData.length===0" >暂无数据</div>
            <list-card v-for="(item, index) in paramsData" :key="index">
                <van-cell-group>
                    <van-cell title="订单编号" :value="item.localId" />
                    <van-cell title="支付订单号" :label="item.payNo" label-class="text-r" />
                    <van-cell title="车牌号码" :value="item.plate" />
                    <van-cell title="支付时间" :value="timeFormatter(item.payTime)" />
                </van-cell-group>
                <template v-slot:footer>
                    <van-button type="primary" size="small" round @click="handleMore(item)">查看更多</van-button>
                </template>
            </list-card>

            <van-pagination
            v-if="dataForm.length!==0"
            v-model="dataForm.offset"
            :page-count="Math.ceil(total1/dataForm.limit)"
            :items-per-page="dataForm.limit"
            mode="simple"
            @change="changePage"/>
        </main>
        <van-popup v-model="showMore" close-on-popstate round style="width:80%">
            <van-cell-group>
                <van-cell title="应收金额" :value="moneyInOutFormatter(moreData.receiveFee)" />
                <van-cell title="实收金额" :value="moneyInOutFormatter(moreData.realFee)" />
                <van-cell title="车主优惠" :value="moneyInOutFormatter(moreData.ticketPay)" />
                <van-cell title="商家优惠" :value="moneyInOutFormatter(moreData.ticketPayReal)" />
                <van-cell title="电子支付" :value="moneyInOutFormatter(moreData.electronicPrepay)" />
                <van-cell title="支付场景" :value="paySenceFormatter(moreData.paySence)" />
            </van-cell-group>
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
    </div>
</template>

<script>
import { Grid, GridItem, NoticeBar, Cell, CellGroup, Popup, DatetimePicker, Button, Pagination } from 'vant'
import { timeFormatter, moneyInOutFormatter, moneyFormatter, timeFormatterSort, paySenceFormatter } from '@/utils/formatter.js'
import { getPage, getPageCount } from '@/api/url'
import { httpGet } from '@/utils/restful'
import listCard from '@/components/listCard'
export default {
  components: {
    'van-grid': Grid,
    'van-grid-item': GridItem,
    'van-notice-bar': NoticeBar,
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup,
    [Popup.name]: Popup,
    [DatetimePicker.name]: DatetimePicker,
    [Button.name]: Button,
    [Pagination.name]: Pagination,
    listCard
  },
  data () {
    return {
      timeFormatter,
      moneyInOutFormatter,
      paySenceFormatter,
      paramsData: [],
      total1: 0,
      dataForm: {
        offset: 1,
        limit: 10,
        beginTime: undefined,
        endTime: undefined
      },
      countOrder: {
        sumRealFee: '-',
        sumReceiveFee: '-',
        sumTicketPay: '-',
        sumTicketPayReal: '-',
        sumElectronicPrepay: '-'
      },
      showbeginTime: false,
      showendTime: false,
      maxDate: new Date(),
      currentDate1: new Date(new Date().setDate(1)),
      currentDate2: new Date(),
      showPopup: false,
      showMore: false,
      moreData: {}
    }
  },
  created () {
    // 开始时间
    this.dataForm.beginTime = timeFormatterSort(new Date(new Date().setDate(1))) + ' 00:00:00'
    // 结束时间
    this.dataForm.endTime = timeFormatterSort(new Date()) + ' 23:59:59'
  },
  mounted () {
    this.getData()
    this.getInOutCountOrder()
  },
  methods: {
    handleBeginTime (val) {
      this.dataForm.beginTime = timeFormatterSort(val) + ' 00:00:00'
      this.showbeginTime = false
    },
    handleEndTime (val) {
      this.dataForm.endTime = timeFormatterSort(val) + ' 23:59:59'
      this.showendTime = false
    },
    // 获取统计记录 count
    getInOutCountOrder () {
      this.dataForm = Object.assign(this.dataForm, {departmentId: this.$store.getters.departmentId})
      httpGet(getPageCount, this.dataForm)
        .then(res => {
          // console.log(res)
          this.countOrder = {
            sumRealFee: moneyFormatter(res.data.realFee),
            sumReceiveFee: moneyFormatter(res.data.receiveFee),
            sumTicketPay: moneyFormatter(res.data.ticketPay),
            sumTicketPayReal: moneyFormatter(res.data.ticketPayReal),
            sumElectronicPrepay: moneyFormatter(res.data.electronicPrepay)
          }
        }).catch(() => {})
    },
    getData () {
      const ToastLoading = this.$toast.loading({ message: '加载中...', position: 'middle', duration: 0 })
      let self = this
      this.dataForm = Object.assign(this.dataForm, {departmentId: this.$store.getters.departmentId})
      httpGet(getPage, this.dataForm)
        .then((res) => {
          if (res.data === null) {
            self.paramsData = []
            self.total1 = 0
            ToastLoading.clear()
          } else {
            self.paramsData = res.data.rows
            self.total1 = res.data.total
            ToastLoading.clear()
          }
        }).catch(() => {
          ToastLoading.clear()
        })
    },
    // 查看更多
    handleMore (data) {
      this.moreData = data
      this.showMore = true
    },
    // 搜索
    handleFilter1 () {
      const beginTime = this.dataForm.beginTime
      const endTime = this.dataForm.endTime
      if (new Date(beginTime).getFullYear() === new Date(endTime).getFullYear() && new Date(beginTime).getMonth() === new Date(endTime).getMonth()) {
        this.dataForm.offset = 1
        this.getData()
        this.getInOutCountOrder()
        this.showPopup = false
      } else {
        this.$notify({message: '请填写一个月内的时间段进行搜索', type: 'warning'})
      }
    },
    // 分页
    changePage (val) {
      this.dataForm.offset = val
      this.getData()
      document.body.scrollTop = 0
    }
  }
}
</script>

<style lang="scss" scoped>
.mar-b-10 {
    margin-bottom: 10px;
}
.num {
    font-size: 14px;
}
.title {
    padding: 5px 15px;
}
.summary {
    margin-bottom: 15px;
}
</style>

<template>
    <div>
        <van-notice-bar color="#1989fa" background="#ecf9ff" wrapable :scrollable="false" >
            实收 = 现金 + 电子<br>
            优惠 = 车主优惠 + 本地优惠<br>
            应收 ＝ 实收 ＋ 优惠
        </van-notice-bar>
        <van-button icon="search" block type="info" @click="showPopup=true">搜索</van-button>
        <van-popup v-model="showPopup" position="right" closeable style="width: 85%;height: 100%;" >
            <van-cell title="筛选" />
            <van-cell-group>
              <van-field v-model="listQuery.localId" label="订单号" placeholder="请输入"/>
              <van-field v-model="listQuery.roadIdIn" label="入场通道" placeholder="请输入"/>
              <van-field v-model="listQuery.roadIdOut" label="出场通道" placeholder="请输入"/>
              <van-field v-model="listQuery.plate" label="车牌号" placeholder="请输入"/>
              <van-cell title="开始日期" is-link :label="listQuery.beginTime" @click="showbeginTime=true" />
              <van-cell title="结束日期" is-link :label="listQuery.endTime" @click="showendTime=true" />
            </van-cell-group>
            <van-button type="info" block @click="handleFilter">搜索</van-button>
        </van-popup>
        <section>
            <p class="title">总计</p>
            <van-grid class="summary">
                <van-grid-item>
                    <div class="num mar-b-10">{{count.sumReceiveFee}}</div>
                    <p class="fc-grey">应收金额</p>
                </van-grid-item>
                <van-grid-item>
                    <div class="num mar-b-10">{{count.sumRealFee}}</div>
                    <p class="fc-grey">实收金额</p>
                </van-grid-item>
                <van-grid-item>
                    <div class="num mar-b-10">{{count.sumCashPay}}</div>
                    <p class="fc-grey">现金金额</p>
                </van-grid-item>
                <van-grid-item>
                    <div class="num mar-b-10">{{count.sumTicketPay}}</div>
                    <p class="fc-grey">车主优惠</p>
                </van-grid-item>
                <van-grid-item>
                    <div class="num mar-b-10">{{count.sumTicketPayReal}}</div>
                    <p class="fc-grey">商家优惠</p>
                </van-grid-item>
                <van-grid-item>
                    <div class="num mar-b-10">{{count.sumNativeTicket}}</div>
                    <p class="fc-grey">本地优惠</p>
                </van-grid-item>
                <van-grid-item>
                    <div class="num mar-b-10">{{count.sumElectronicPrepay}}</div>
                    <p class="fc-grey">电子支付</p>
                </van-grid-item>
            </van-grid>
        </section>

        <main>
            <div class="text-c" style="color: #909399;" v-if="tableData.length===0" >暂无数据</div>
            <list-card v-for="(item, index) in tableData" :key="index">
                <van-cell-group>
                    <van-cell title="订单编号" :value="item.localId" v-if="!isShowColumnFormatter(['屏蔽金额字段'])" />
                    <van-cell title="车牌号码" :value="item.plateOut" />
                    <van-cell title="入场通道" :value="item.roadIdIn||'-'" />
                    <van-cell title="出场通道" :value="item.roadIdOut||'-'" />
                    <van-cell title="车辆类型" :value="inOutCarFormatter(item.carType)" />
                    <van-cell title="停车时长" :value="item.ioTime" />
                    <van-cell title="进场时间" :value="timeFormatter(item.ioTimeIn)" />
                    <van-cell title="出场时间" :value="timeFormatter(item.ioTimeOut)" />
                </van-cell-group>
                <template v-slot:footer>
                    <van-button type="info" size="small" round v-if="item.picIn" @click="handleImage(item, 0)" >入场图片</van-button>
                    <van-button type="info" size="small" round v-if="item.picOut" @click="handleImage(item, 1)" >出场图片</van-button>
                    <van-button type="primary" size="small" round @click="handleMore(item)">查看更多</van-button>
                </template>
            </list-card>

            <van-pagination
            v-if="tableData.length!==0"
            v-model="listQuery.offset"
            :page-count="Math.ceil(total/listQuery.limit)"
            :items-per-page="listQuery.limit"
            mode="simple"
            @change="changePage"/>
        </main>
        <van-popup v-model="showMore" close-on-popstate round style="width:80%">
            <van-cell-group>
                <van-cell title="车主姓名" :value="moreData.carOwner||'-'" />
                <van-cell title="应收金额" :value="moneyInOutFormatter(moreData.receiveFee)" v-if="!isShowColumnFormatter(['屏蔽金额字段'])" />
                <van-cell title="实收金额" :value="moneyInOutFormatter(moreData.realFee)" v-if="!isShowColumnFormatter(['屏蔽金额字段'])" />
                <van-cell title="现金金额" :value="moneyInOutFormatter(moreData.cashPay)" v-if="!isShowColumnFormatter(['屏蔽金额字段'])" />
                <van-cell title="车主优惠" :value="moneyInOutFormatter(moreData.ticketPay)" v-if="!isShowColumnFormatter(['屏蔽金额字段'])" />
                <van-cell title="商家优惠" :value="moneyInOutFormatter(moreData.ticketPayReal)" v-if="!isShowColumnFormatter(['屏蔽金额字段'])" />
                <van-cell title="本地优惠" :value="moneyInOutFormatter(moreData.nativeTicket)" v-if="!isShowColumnFormatter(['屏蔽金额字段'])" />
                <van-cell title="电子支付" :value="moneyInOutFormatter(moreData.electronicPrepay)" v-if="!isShowColumnFormatter(['屏蔽金额字段'])" />
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
import { Grid, GridItem, NoticeBar, Cell, CellGroup, Popup, DatetimePicker, Button, Pagination, Field, ImagePreview } from 'vant'
import { isShowColumnFormatter, inOutCarFormatter, timeFormatter, moneyInOutFormatter, timeFormatterSort, moneyFormatter } from '@/utils/formatter.js'
import { getInOutCount, getInOut, getImage } from '@/api/url'
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
    [Field.name]: Field,
    listCard
  },
  data () {
    return {
      timeFormatter,
      moneyInOutFormatter,
      isShowColumnFormatter,
      inOutCarFormatter,
      tableData: [],
      total: 0,
      listQuery: {
        offset: 1,
        limit: 10,
        localId: undefined,
        beginTime: undefined,
        endTime: undefined,
        roadIdIn: undefined,
        roadIdOut: undefined
      },
      count: {
        sumReceiveFee: '-',
        sumRealFee: '-',
        sumCashPay: '-',
        sumTicketPay: '-',
        sumTicketPayReal: '-',
        sumNativeTicket: '-',
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
    this.listQuery.beginTime = timeFormatterSort(new Date(new Date().setDate(1))) + ' 00:00:00'
    // 结束时间
    this.listQuery.endTime = timeFormatterSort(new Date()) + ' 23:59:59'
  },
  mounted () {
    this.fetchData()
    this.getInOutCount()
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
    getInOutCount () {
      this.listQuery = Object.assign(this.listQuery, {departmentId: this.$store.getters.departmentId})
      httpGet(getInOutCount, this.listQuery)
        .then(res => {
          // console.log(res)
          this.count = {
            sumReceiveFee: moneyFormatter(res.data.sumReceiveFee),
            sumRealFee: moneyFormatter(res.data.sumRealFee),
            sumElectronicPrepay: moneyFormatter(res.data.sumElectronicPrepay),
            sumCashPay: moneyFormatter(res.data.sumCashPay),
            sumTicketPay: moneyFormatter(res.data.sumTicketPay),
            sumTicketPayReal: moneyFormatter(res.data.sumTicketPayReal),
            sumNativeTicket: moneyFormatter(res.data.sumNativeTicket)
          }
        }).catch(() => {})
    },
    handleImage (row, type) {
      let data = {
        id: row.id,
        type: type,
        partitionAt: timeFormatter(row.partitionAt)
      }
      const ToastLoading = this.$toast.loading({ message: '加载中...', position: 'middle', duration: 0 })
      httpGet(getImage, data).then(res => {
        ToastLoading.clear()
        if (res.data === null) {
          this.$notify('获取失败')
        } else {
          let picUrl = 'data:image/jpeg;base64,' + res.data
          ImagePreview({
            images: [picUrl],
            showIndex: false,
            closeOnPopstate: true
          })
        }
      }).catch(() => {
        ToastLoading.clear()
      })
    },
    // 获取数据
    fetchData () {
      let self = this
      const ToastLoading = this.$toast.loading({ message: '加载中...', position: 'middle', duration: 0 })
      this.listQuery = Object.assign(this.listQuery, {departmentId: this.$store.getters.departmentId})
      for (const v in this.listQuery) {
        if (this.listQuery[v] === '') this.listQuery[v] = undefined
      }
      httpGet(getInOut, this.listQuery).then(res => {
        if (res.data === null) {
          self.tableData = []
          self.total = 0
          ToastLoading.clear()
        } else {
          self.tableData = res.data.rows
          self.total = res.data.total
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
    handleFilter () {
      const beginTime = this.listQuery.beginTime
      const endTime = this.listQuery.endTime
      if (new Date(beginTime).getFullYear() === new Date(endTime).getFullYear() && new Date(beginTime).getMonth() === new Date(endTime).getMonth()) {
        this.listQuery.offset = 1
        this.fetchData()
        this.getInOutCount()
        this.showPopup = false
      } else {
        this.$notify({message: '请填写一个月内的时间段进行搜索', type: 'warning'})
      }
    },
    // 分页
    changePage (val) {
      this.listQuery.offset = val
      this.fetchData()
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

<template>
    <div>
      <div class="text-c" style="color: #909399;padding-top:.5rem" v-if="tableData.length===0" >暂无数据</div>

      <list-card v-for="(item, index) in tableData" :key="index">
          <van-cell-group :border="false">
              <van-cell title="通道" :value="item.channelName" />
              <van-cell title="分段时间">
                {{time != undefined && time.length == 2 && (new Date(time[1]).getTime() - new Date(time[0]).getTime()) > 86400000 ? timeFormatterSort(item.date) : timeFormatter(item.date)}}
              </van-cell>
              <van-cell title="出场数" :value="item.outNums" />
              <van-cell title="现金支付" :value="moneyFormatter(item.cashFee)" />
              <van-cell title="余额(电子)" :value="moneyFormatter(item.epayWallet)" />
              <van-cell title="付款码(电子)" :value="moneyFormatter(item.epaySweep)" />
              <van-cell title="出场扫码(电子)" :value="moneyFormatter(item.epayScan)" />
              <van-cell title="其他电子支付" :value="moneyFormatter(item.epayOther)" />
              <van-cell title="电子支付总和" :value="moneyFormatter(item.epayFee)" />
              <van-cell title="总和" :value="moneyFormatter((item.epayFee + item.cashFee).toFixed(2))" />
          </van-cell-group>
      </list-card>
    </div>
</template>

<script>
import listCard from '@/components/listCard'
import { Cell, CellGroup } from 'vant'
import { timeFormatterSort, timeFormatter, moneyFormatter } from '@/utils/formatter.js'
export default {
  components: {
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup,
    listCard
  },
  data () {
    return {
      tableData: [],
      timeFormatterSort,
      timeFormatter,
      moneyFormatter,
      time: JSON.parse(this.$route.query.time)
    }
  },
  mounted () {
    const data = window.sessionStorage.getItem('textStatistics')
    if (data) this.tableData = JSON.parse(data).reverse()
  }
}
</script>

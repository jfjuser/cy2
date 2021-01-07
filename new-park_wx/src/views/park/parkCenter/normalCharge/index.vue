<template>
   <div>
    <topRightBtn @click.native="refresh">刷新</topRightBtn>
    <van-button icon="search" block type="info" @click="showPopup=true" class="mar-b-15">搜索</van-button>
    <van-popup v-model="showPopup" position="right" closeable style="width: 85%;height: 100%;" >
        <van-cell title="筛选" />
        <van-cell-group>
          <van-field v-model.trim="listQuery.payNo" label="订单编号" placeholder="请输入订单编号"/>
          <van-field v-model.trim="listQuery.plate" label="车牌号" placeholder="请输入车牌号" @click="checkPlate" />
          <van-cell title="开始日期" is-link :label="listQuery.beginTime" @click="showbeginTime=true" />
          <van-cell title="结束日期" is-link :label="listQuery.endTime" @click="showendTime=true" />
        </van-cell-group>
        <van-button type="info" block @click="onSearch">搜索</van-button>
    </van-popup>
    <van-popup v-model="isIS">
      <van-button v-for="(item, index) in plateType" @click="clickItem(item)" :key=index>{{item.value}}</van-button>
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
              <van-cell title="车牌" :value="item.plate" />
              <van-cell title="开通月数" :value="item.monthNumber" />
              <van-cell title="应收（充值规则）" :value="moneyFormatter(item.totalFee)" />
              <van-cell title="实收" :value="moneyFormatter(item.totalFee)" />
              <van-cell title="每月金额" :value="moneyFormatter(item.monthPrice)" />
              <van-cell title="充值时间" :value="timeFormatter(item.createAt)"/>
              <van-cell title="备注信息" :value="item.remark" />
              <van-cell title="操作人" :value="item.creatorName" />
          </van-cell-group>
          <!-- <template v-slot:footer>
            <van-button size="small" round type="info" plain @click="handleExport">导出</van-button>
          </template> -->
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
import { plateType } from '@/utils/selectAble'
import { moneyFormatter, timeFormatter, timeFormatterSort } from '@/utils/formatter'
import { Cell, Search, CellGroup, Popup, Field, Pagination, Button, DatetimePicker } from 'vant'
import { httpGet } from '@/utils/restful'
import { normalCharge } from '@/api/url'
export default {
  data () {
    return {
      tableData: [],
      plateType: plateType,
      isIS: false,
      maxDate: new Date(),
      currentDate1: new Date(),
      currentDate2: new Date(),
      showbeginTime: false,
      showendTime: false,
      moneyFormatter: moneyFormatter,
      timeFormatterSort: timeFormatterSort,
      timeFormatter: timeFormatter,
      listQuery: {
        offset: 1,
        limit: 10,
        payNo: undefined,
        plate: undefined,
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
    checkPlate () {
      if (this.listQuery.plate === undefined || this.listQuery.plate === '') {
        this.isIS = true
      }
    },
    clickItem (item) {
      this.listQuery.plate = item.value
      this.isIS = false
    },
    onSearch () {
      this.listQuery.offset = 1
      this.fetchData()
      this.showPopup = false
    },
    fetchData () {
      const ToastLoading = this.$toast.loading({ message: '加载中...', position: 'middle', duration: 0 })
      this.listQuery = Object.assign(this.listQuery, {departmentId: this.$store.getters.departmentId})
      httpGet(normalCharge, this.listQuery).then(res => {
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
</style>

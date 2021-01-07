<template>
    <div>
        <van-dropdown-menu class="mar-b-15">
          <van-dropdown-item :options="shopType" v-model="listQuery.shopId" :title="title" @change="handleFilter" :disabled="filterDisabled"/>
          <van-button icon="search" type="info" style="height:100%;" @click="showPopup=true">更多搜索</van-button>
        </van-dropdown-menu>

        <van-popup v-model="showPopup" position="right" closeable style="width: 85%;height: 100%;" >
            <van-cell title="筛选" />
            <van-cell-group>
              <van-field v-model.trim="listQuery.ticketCode" label="订单号" placeholder="请输入"/>
              <van-field v-model.trim="listQuery.plate" label="车牌号" placeholder="请输入"/>
              <van-cell title="开始日期" is-link :label="listQuery.beginTime" @click="showbeginTime=true" />
              <van-cell title="结束日期" is-link :label="listQuery.endTime" @click="showendTime=true" />
            </van-cell-group>
            <van-button type="info" block @click="handleFilter" :disabled="filterDisabled">搜索</van-button>
        </van-popup>

        <main>
            <div class="text-c" style="color: #909399;" v-if="tableData.length===0" >暂无数据</div>
            <list-card v-for="(item, index) in tableData" :key="index" >
                <van-cell-group :border="false">
                    <van-cell title="优惠券编号" :value="item.ticketCode" />
                    <van-cell title="优惠券名称" :value="item.ruleName" />
                    <van-cell title="订单编号" :value="item.localId" />
                    <van-cell title="车牌号码" :value="item.plate" />
                    <van-cell title="已抵扣金额" :value="moneyFormatter(item.dikouFee)" />
                    <van-cell title="绑定时间" :value="timeFormatter(item.bingdingAt)" />
                    <van-cell title="使用时间" :value="timeFormatter(item.useAt)" />
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
import { DropdownMenu, DropdownItem, Cell, CellGroup, Pagination, Button, Popup, Field, DatetimePicker } from 'vant'
import listCard from '@/components/listCard'
import { getShops, getShopUsedTicket } from '@/api/url'
import { httpGet } from '@/utils/restful'
import { timeFormatterSort, timeFormatter, moneyFormatter } from '@/utils/formatter.js'
export default {
  name: 'is-used',
  components: {
    [DropdownMenu.name]: DropdownMenu,
    [DropdownItem.name]: DropdownItem,
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
      moneyFormatter: moneyFormatter,
      listQuery: {
        offset: 1,
        limit: 10,
        plate: undefined,
        shopId: undefined,
        ticketCode: undefined,
        beginTime: undefined,
        endTime: undefined
      },
      tableData: [],
      total: 0,
      shopType: [],
      filterDisabled: false,
      title: '',
      showPopup: false,
      showbeginTime: false,
      showendTime: false,
      maxDate: new Date(),
      currentDate1: new Date(),
      currentDate2: new Date()
    }
  },
  created () {
    // 开始时间
    this.listQuery.beginTime = timeFormatterSort(new Date(new Date().setDate(1))) + ' 00:00:00'
    // 结束时间
    this.listQuery.endTime = timeFormatterSort(new Date()) + ' 23:59:59'
    this.getAllShops()
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
    // 格式化下拉菜单
    shopTypeFormatter (data) {
      let arr = []
      for (const v of data) {
        v.text = v.shopName
        v.value = v.id
        arr.push(v)
      }
      return arr
    },
    // 获取所有的商户
    getAllShops () {
      const ToastLoading = this.$toast.loading({ message: '加载中...', position: 'middle', duration: 0 })
      httpGet(getShops + this.$store.getters.departmentId)
        .then(res => {
          ToastLoading.clear()
          if (res.data === null || res.data.length === 0) {
            this.$notify('暂无商户，无法进行查看')
            this.filterDisabled = true
            this.title = '暂无商户'
          } else {
            this.shopType = this.shopTypeFormatter(res.data)
            this.listQuery.shopId = this.shopType[0].id
            this.fetchData()
            this.filterDisabled = false
          }
        }).catch(() => { ToastLoading.clear() })
    },
    fetchData () {
      const ToastLoading = this.$toast.loading({ message: '加载中...', position: 'middle', duration: 0 })
      this.listQuery = Object.assign(this.listQuery, {departmentId: this.$store.getters.departmentId})
      httpGet(getShopUsedTicket, this.listQuery).then(res => {
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

<template>
  <div>
    <van-dropdown-menu class="mar-b-15">
      <van-dropdown-item :options="shopType" v-model="listQuery.shopId" :title="title" @change="handleFilter" :disabled="disabled" />
      <van-dropdown-item :options="moneyType" v-model="listQuery.type" title="类型" @change="handleFilter" :disabled="disabled" />
    </van-dropdown-menu>

    <main>
        <div class="text-c" style="color: #909399;" v-if="tableData.length===0" >暂无数据</div>
        <list-card v-for="(item, index) in tableData" :key="index" >
            <van-cell-group :border="false">
                <van-cell title="类型" :value="typeFormatter(item.type)" />
                <van-cell title="加款减款金额" :value="moneyFormatter(item.fee)" />
                <van-cell title="余额" :value="moneyFormatter(item.nowFee)" />
                <van-cell title="充值时间" :value="timeFormatter(item.rechargeAt)" />
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
import { DropdownMenu, DropdownItem, Cell, CellGroup, Pagination } from 'vant'
import listCard from '@/components/listCard'
import { moneyType } from '@/utils/selectAble.js'
import { httpGet } from '@/utils/restful'
import { getShops, getShopsChargeRecords } from '@/api/url'
import { typeFormatter, moneyFormatter, timeFormatter } from '@/utils/formatter.js'

export default {
  components: {
    [DropdownMenu.name]: DropdownMenu,
    [DropdownItem.name]: DropdownItem,
    [Pagination.name]: Pagination,
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup,
    listCard
  },
  data () {
    return {
      listQuery: {
        offset: 1,
        limit: 10,
        type: undefined,
        shopId: undefined
      },
      tableData: [],
      total: 0,
      moneyType: [],
      shopType: [],
      title: '',
      typeFormatter: typeFormatter,
      timeFormatter: timeFormatter,
      moneyFormatter: moneyFormatter,
      disabled: false
    }
  },
  created () {
    this.moneyTypeFormatter()
    this.getAllShops()
  },
  methods: {
    // 格式化下拉菜单
    moneyTypeFormatter () {
      let arr = []
      for (const v of moneyType) {
        let obj = {}
        obj.text = v.valueName
        obj.value = v.valueNo
        arr.push(obj)
      }
      this.moneyType = arr
    },
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
            this.title = '暂无商户'
            this.disabled = true
          } else {
            this.shopType = this.shopTypeFormatter(res.data)
            this.listQuery.shopId = this.shopType[0].id
            this.fetchData()
          }
        }).catch(() => { ToastLoading.clear() })
    },
    fetchData () {
      const ToastLoading = this.$toast.loading({ message: '加载中...', position: 'middle', duration: 0 })
      this.listQuery = Object.assign(this.listQuery, {departmentId: this.$store.getters.departmentId})
      httpGet(getShopsChargeRecords, this.listQuery).then(res => {
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
    }
  }
}
</script>

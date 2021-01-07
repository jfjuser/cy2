<template>
  <div>
    <van-dropdown-menu class="mar-b-15">
      <van-dropdown-item :options="moneyType" v-model="listQuery.type" @change="handleFilter" :title="title" />
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
import { typeFormatter, moneyFormatter, timeFormatter } from '@/utils/formatter.js'
import { httpGet } from '@/utils/restful'
import { getRechargeRecords } from '@/api/url'
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
        type: undefined
      },
      tableData: [],
      total: null,
      moneyType: [],
      title: '类型',
      typeFormatter: typeFormatter,
      moneyFormatter: moneyFormatter,
      timeFormatter: timeFormatter
    }
  },
  created () {
    this.moneyTypeFormatter()
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
    fetchData () {
      const ToastLoading = this.$toast.loading({ message: '加载中...', position: 'middle', duration: 0 })
      this.listQuery = Object.assign(this.listQuery, {shopId: this.$store.getters.departmentId})
      httpGet(getRechargeRecords, this.listQuery).then(res => {
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

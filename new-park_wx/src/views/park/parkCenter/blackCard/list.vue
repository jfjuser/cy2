<template>
   <div>
    <topRightBtn to="add/" v-has2father="['新增']">添加</topRightBtn>
    <van-dropdown-menu>
      <van-dropdown-item title="车类型" :options="option" v-model="listQuery.type"/>
      <van-dropdown-item title="同步状态" :options="option1" v-model="listQuery.isSync"/>
    </van-dropdown-menu>
    <van-search placeholder="请输入车牌号"  show-action v-model.trim="listQuery.plate" class="mar-b-15" @search="handleFilter" >
      <div slot="action" @click="handleFilter">搜索</div>
    </van-search>

    <main>
      <div class="text-c" style="color: #909399;" v-if="tableData === null" >暂无数据</div>
      <list-card v-for="(item, index) in tableData" :key="index">
          <van-cell-group :border="isShowColumn2Father(['编辑','删除'])">
              <van-cell title="部门名称" :value="item.departmentName"/>
              <van-cell title="车牌号码" :value="item.plate"/>
              <van-cell title="车类型" :value="blackCarTypeFormatter(item.type)"/>
              <van-cell title="同步状态" :value="isSyncFormatter(item.isSync)"/>
              <van-cell title="开始时间" :value="timeFormatter(item.startTime)"/>
              <van-cell title="结束时间" :value="timeFormatter(item.endTime)"/>
              <van-cell title="备注信息" :value="item.remarks"/>
          </van-cell-group>
          <template v-slot:footer>
            <van-button v-has2father="['删除']" type="danger" size="small" round @click="handleDelete(item.id)">删除</van-button>
            <van-button v-has2father="['编辑']" type="info" size="small" round @click="handleUpdate(item)">编辑</van-button>
          </template>
      </list-card>

      <van-pagination
        v-if="tableData !== null"
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
import { plateType, blackCarType, isSyncType } from '@/utils/selectAble.js'
import { Cell, DropdownMenu, DropdownItem, CellGroup, Popup, Pagination, Search, Button, Notify, Dialog } from 'vant'
import { httpGet, httpDelete } from '@/utils/restful'
import { timeFormatter, isSyncFormatter, blackCarTypeFormatter, timeFormatterSort, isShowColumn2Father } from '@/utils/formatter'
import { getBlackCard, BlackCard } from '@/api/url'
export default {
  data () {
    return {
      isShowColumn2Father,
      tableData: [],
      option: [
        {text: '挂失车', value: 0},
        {text: '通缉车', value: 1},
        {text: '其它', value: 2}
      ],
      option1: [
        {text: '未同步', value: 0},
        {text: '已同步', value: 1},
        {text: '后台同步中', value: 2},
        {text: '后台删除中', value: 3}
      ],
      type: undefined,
      plateType: plateType,
      blackCarType: blackCarType,
      isSyncType: isSyncType,
      isSyncFormatter: isSyncFormatter,
      blackCarTypeFormatter: blackCarTypeFormatter,
      timeFormatter: timeFormatter,
      timeFormatterSort: timeFormatterSort,
      listQuery: {
        offset: 1,
        limit: 10,
        plate: undefined,
        type: undefined,
        isSync: undefined
      },
      total: 0
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    handleFilter () {
      this.listQuery.offset = 1
      this.fetchData()
    },
    handleDelete (id) {
      Dialog.confirm({
        title: '提示',
        message: '确定删除吗？'
      }).then(() => {
        const ToastLoading = this.$toast.loading({ message: '加载中...', position: 'middle', duration: 0 })
        httpDelete(BlackCard, {
          ids: [id],
          departmentId: this.$store.getters.departmentId
        }).then(res => {
          ToastLoading.clear()
          this.fetchData()
          Notify({
            type: 'success',
            message: res.message,
            duration: 4 * 1000
          })
        }).catch(() => {
          ToastLoading.clear()
        })
      }).catch(() => {})
    },
    fetchData () {
      const ToastLoading = this.$toast.loading({ message: '加载中...', position: 'middle', duration: 0 })
      this.listQuery = Object.assign(this.listQuery, {departmentId: this.$store.getters.departmentId})
      httpGet(getBlackCard, this.listQuery).then(res => {
        ToastLoading.clear()
        this.tableData = res.data.rows
        this.total = res.data.total
      }).catch(() => {
        ToastLoading.clear()
      })
    },
    changePage (val) {
      this.listQuery.offset = val
      this.fetchData()
      document.body.scrollTop = 0
    },
    handleUpdate (item) {
      this.$router.push(`${this.$route.path}editor/?data=${JSON.stringify(item)}`)
    }
  },
  components: {
    topRightBtn,
    listCard,
    [DropdownMenu.name]: DropdownMenu,
    [DropdownItem.name]: DropdownItem,
    [Search.name]: Search,
    [Cell.name]: Cell,
    [Popup.name]: Popup,
    [CellGroup.name]: CellGroup,
    [Pagination.name]: Pagination,
    [Button.name]: Button
  }
}
</script>

<style lang="scss" scoped>
.btn-popup{
  display: block;
  width:60vw;
  margin-left:15vw;
  margin-top: 0.5rem;
  border-radius:0.75rem;
}
</style>

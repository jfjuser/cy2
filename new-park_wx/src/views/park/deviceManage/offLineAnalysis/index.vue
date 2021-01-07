<template>
  <div>
    <topRightBtn @click.native="handleRefresh">刷新</topRightBtn>
    <van-dropdown-menu class="mar-b-15">
      <van-dropdown-item title="通道名称" :options="option" v-model="listQuery.mac" @change="handleFilter"/>
      <van-dropdown-item title="异常原因" :options="option1" v-model="listQuery.type" @change="handleFilter"/>
      <van-button icon="search" type="info" style="height:100%;" @click="showPopup=true">更多搜索</van-button>
    </van-dropdown-menu>

    <van-popup v-model="showPopup" position="right" closeable style="width: 85%;height: 100%;" >
        <van-cell title="筛选" />
        <van-cell-group>
          <van-field type="number" v-model.trim="listQuery.offlineInterval" label="离线时长(秒)" placeholder="请输入"/>
          <van-cell title="开始日期" is-link :label="listQuery.beginTime" @click="showbeginTime=true" />
          <van-cell title="结束日期" is-link :label="listQuery.endTime" @click="showendTime=true" />
        </van-cell-group>
        <van-button type="info" block @click="handleFilter">搜索</van-button>
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
              <van-cell title="通道名称" :value="item.localName" />
              <van-cell title="离线时间" :value="timeFormatter(item.offlineTime)" />
              <van-cell title="登录时间" :value="timeFormatter(item.loginTime)" />
              <van-cell title="离线时长" :value="timeDuration(item.offlineInterval)" />
              <van-cell title="备注信息" :value="cameraOfflineFormatter(item.type)" />
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
import topRightBtn from '@/components/topRightBtn'
import listCard from '@/components/listCard'
import { cameraOfflineType } from '@/utils/selectAble'
import { Pagination, Button, DropdownMenu, DatetimePicker, Search, DropdownItem, Cell, Popup, Field, CellGroup } from 'vant'
import { timeDuration, timeFormatterSort, cameraOfflineFormatter, timeFormatter } from '@/utils/formatter'
import { httpGet } from '@/utils/restful'
import { getCamera, getOffLineAnalysis } from '@/api/url'
export default {
  data () {
    return {
      tableData: [],
      option: [],
      option1: [
        {text: '网络故障,连接中断', value: 1},
        {text: '一分钟无心跳、消息读写', value: 2},
        {text: '异常触发,连接中断', value: 3},
        {text: '未知的离线登录', value: 4}
      ],
      isSearch: false,
      showbeginTime: false,
      showendTime: false,
      currentDate1: new Date(),
      currentDate2: new Date(),
      maxDate: new Date(),
      cameraOfflineType: cameraOfflineType,
      timeFormatterSort: timeFormatterSort,
      timeFormatter: timeFormatter,
      timeDuration: timeDuration,
      cameraOfflineFormatter: cameraOfflineFormatter,
      listQuery: {
        offset: 1,
        limit: 10,
        departmentId: this.$store.getters.departmentId,
        beginTime: undefined,
        endTime: undefined,
        offlineInterval: undefined,
        mac: undefined,
        type: undefined
      },
      total: null,
      showPopup: false
    }
  },
  components: {
    topRightBtn,
    listCard,
    [Search.name]: Search,
    [Field.name]: Field,
    [Popup.name]: Popup,
    [Button.name]: Button,
    [DropdownMenu.name]: DropdownMenu,
    [DropdownItem.name]: DropdownItem,
    [Pagination.name]: Pagination,
    [Cell.name]: Cell,
    [DatetimePicker.name]: DatetimePicker,
    [CellGroup.name]: CellGroup
  },
  methods: {
    changePage (val) {
      this.listQuery.offset = val
      this.fetchData()
      document.body.scrollTop = 0
    },
    handleBeginTime (val) {
      this.listQuery.beginTime = timeFormatterSort(val) + ' 00:00:00'
      this.showbeginTime = false
    },
    handleEndTime (val) {
      this.listQuery.endTime = timeFormatterSort(val) + ' 23:59:59'
      this.showendTime = false
    },
    // 搜索
    handleFilter () {
      this.listQuery.offset = 1
      this.fetchData()
      this.showPopup = false
    },
    handleRefresh () {
      this.listQuery = {
        offset: 1,
        limit: 10,
        departmentId: this.$store.getters.departmentId,
        offlineInterval: undefined,
        beginTime: undefined,
        endTime: undefined,
        mac: undefined,
        type: undefined
      }
      this.time = []
      this.fetchData()
    },
    fetchData () {
      const ToastLoading = this.$toast.loading({ message: '加载中...', position: 'middle', duration: 0 })
      httpGet(getOffLineAnalysis, this.listQuery).then(res => {
        if (res.data === null || res.data.rows === null) {
          this.tableData = []
          this.total = 0
        } else {
          this.tableData = res.data.rows
          this.total = res.data.total
        }
        this.loadAll()
        ToastLoading.clear()
      }).catch(() => {
        ToastLoading.clear()
      })
    },
    loadAll () {
      httpGet(getCamera + this.$store.getters.departmentId).then(res => {
        if (res.data.length === 0) {
          this.option = [{text: '暂无数据'}]
          return
        }
        for (const v of res.data) {
          v.text = v.localName
          v.value = v.mac
        }
        this.option = res.data
      }).catch(() => {})
    }
  },
  created () {
    this.fetchData()
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

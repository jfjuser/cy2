<template>
  <div>
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
        <list-card v-for="(item, index) in tableData" :key="index">
            <van-cell-group>
                <van-cell title="订单编号" :value="item.localId" v-if="!isShowColumnFormatter(['屏蔽金额字段'])" />
                <van-cell title="车牌号码" :value="item.plateIn" />
                <van-cell title="通道" :value="item.roadIdIn||'-'" />
                <van-cell title="操作员" :value="item.uinIn" />
                <!-- <van-cell title="预付金额" :value="item.prepayFee" v-if="!isShowColumnFormatter(['屏蔽金额字段'])" />
                <van-cell title="预付时间" :value="timeFormatter(item.prepayAt)" v-if="!isShowColumnFormatter(['屏蔽金额字段'])" />
                <van-cell title="车辆类型" :value="inOutCarFormatter(item.carType)" />
                <van-cell title="进场时间" :value="timeFormatter(item.ioTimeIn)" /> -->
            </van-cell-group>
            <template v-slot:footer>
                <van-button type="info" size="small" round v-if="item.picIn" @click="handleImage(item, 0)" >入场图片</van-button>
                <van-button type="primary" size="small" round @click="handleMore(item)">查看更多</van-button>
                <van-button v-has="['删除']" type="danger" size="small" round @click="handleDelete(item.id)">删除</van-button>
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
            <van-cell title="预付金额" :value="moreData.prepayFee" v-if="!isShowColumnFormatter(['屏蔽金额字段'])" />
            <van-cell title="预付时间" :value="timeFormatter(moreData.prepayAt)" v-if="!isShowColumnFormatter(['屏蔽金额字段'])" />
            <van-cell title="车辆类型" :value="inOutCarFormatter(moreData.carType)" />
            <van-cell title="进场时间" :value="timeFormatter(moreData.ioTimeIn)" />
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
import { Cell, CellGroup, Popup, DatetimePicker, Button, Pagination, Field, Dialog, ImagePreview } from 'vant'
import listCard from '@/components/listCard'
import { inOutCarFormatter, timeFormatter, isShowColumnFormatter, timeFormatterSort } from '@/utils/formatter.js'
import { httpGet, httpDelete } from '@/utils/restful'
import { getImage, getInTmps, deleteInTmps } from '@/api/url'

export default {
  components: {
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
      inOutCarFormatter,
      timeFormatter,
      isShowColumnFormatter,
      timeFormatterSort,
      listQuery: {
        offset: 1,
        limit: 10,
        beginTime: undefined,
        endTime: undefined,
        localId: undefined
      },
      tableData: [],
      total: null,
      showPopup: false,
      showMore: false,
      moreData: {},
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
    // 删除选中
    handleDelete (id) {
      Dialog.confirm({
        title: '提示',
        message: '确认删除吗？'
      }).then(() => {
        const ToastLoading = this.$toast.loading({ message: '加载中...', position: 'middle', duration: 0 })
        httpDelete(deleteInTmps, { ids: [id], departmentId: this.$store.getters.departmentId }).then(res => {
          ToastLoading.clear()
          this.fetchData()
          this.$notify({
            message: res.message,
            type: 'success',
            duration: 3000
          })
        }).catch(() => {
          ToastLoading.clear()
        })
      }).catch(() => {})
    },
    handleImage (row, type) {
      let data = {
        id: row.id,
        type: type,
        partitionAt: null
      }
      const ToastLoading = this.$toast.loading({ message: '加载中...', position: 'middle', duration: 0 })
      httpGet(getImage, data).then(res => {
        ToastLoading.clear()
        if (res.data === null) {
          this.$notify('暂无图片')
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
    // 查看更多
    handleMore (data) {
      this.moreData = data
      this.showMore = true
    },
    // 获取数据
    fetchData () {
      let self = this
      const ToastLoading = this.$toast.loading({ message: '加载中...', position: 'middle', duration: 0 })
      this.listQuery = Object.assign(this.listQuery, {departmentId: this.$store.getters.departmentId})
      httpGet(getInTmps, this.listQuery).then(res => {
        if (res.data === null) {
          self.tableData = []
          self.total = 0
        } else {
          self.tableData = res.data.rows
          self.total = res.data.total
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

<template>
  <div>
    <div class="conditionQuery">
        <van-search
        v-model="userName"
           shape="round"
           background="#3399FF"
           placeholder="请输入需查询的姓名"
           style="width:65%"
           @search="onSearch"
        />
        <button @click="showCalendar = true" class="dateButton">{{chooseDate?chooseDate:'请选择日期'}}</button>
        <!-- <button class="export" @click="exportData">导出</button> -->
        <van-calendar color="#0099FF" type="range" v-model="showCalendar" @confirm="onConfirmCalendar" :min-date="minDate" :max-date="maxDate" />
        <van-popup  v-model="showPicture"><img :src="imgUrl" alt="" style="width:70vw;height:50vh"></van-popup>
    </div>
      <div v-if="ifData" ><van-empty image="search" description="亲~没有查询到进出记录哦" /></div>
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh" success-text="刷新成功" v-if="!ifData">
        <van-list :immediate-check="false" offset="50"  v-model="loading" @load="onLoadList" :finished="finished" finished-text="没有更多了">
          <div class="list-content">
          <div class="list-li" v-for="item in listData" :key="item.id">
            <div class="flex-vc">
              <span>姓名:{{item.userName}}<van-tag size="medium" mark type="success" style="margin-left:10px">{{inOutStatusFormatter(item.type)}}</van-tag></span>
              <span>通道名称:{{item.localName}}</span>
              <span>部门名称:{{item.leader}}</span>
              <span>进出时间:{{timeFormatter(item.inOutTime)}}</span>
            </div>
            <div><van-button @click="viewPicture(item)" type="info" size="small">查看图片</van-button></div>
          </div>
          </div>
        </van-list>
      </van-pull-refresh>
    </div>
</template>
<script>
import { Search, Button, PullRefresh, List, Cell, Tag, Empty, Calendar, Popup, Toast } from 'vant'
import { timeFormatter, inOutStatusFormatter, timeFormatterSort, getDay } from '@/utils/formatter'
import { page, inOutPhoto, aiInOutRecords } from '@/api/url'
import { getDepInfo } from '@/utils/userInfo.js'
import { httpGet, httpPut } from '@/utils/restful'
import Axios from 'axios'
export default {
  name: 'accessRecords',
  data () {
    return {
      imgUrl: '', // 点击查看图片后弹窗的图片地址
      showPicture: false,
      maxDate: new Date(),
      minDate: new Date(new Date().setMonth(new Date().getMonth() - 1)),
      showCalendar: false,
      userName: '', // 输入的用户名
      ifData: false, // 判断是否有数据
      axios: Axios,
      page: page,
      refreshing: false,
      inOutStatusFormatter: inOutStatusFormatter,
      timeFormatter: timeFormatter,
      loading: false,
      finished: false,
      listQuery: { // 请求的列表
        offset: 1,
        limit: 10,
        userName: '',
        beginTime: '',
        endTime: ''
        // t: 1599183692000
      },
      listData: [], // 请求返回的数据
      total: undefined, // 数据的总条数
      timer: undefined
    }
  },
  computed: {
    chooseDate () {
      // 这一块做正则替换处理是为了兼容IOS, IOS对于new Date() 是不能接收带 '-' 参数的
      let bt = this.listQuery.beginTime
      let et = this.listQuery.endTime
      bt = bt.replace(new RegExp('-', 'g'), '/')
      et = et.replace(new RegExp('-', 'g'), '/')
      let beginTime = new Date(bt)
      let beginTimeMonth = beginTime.getMonth() + 1
      let beginTimeDay = beginTime.getDate()
      let endTime = new Date(et)
      let endTimeMonth = endTime.getMonth() + 1
      let endTimeDay = endTime.getDate()
      return beginTimeMonth + '/' + beginTimeDay + ' - ' + endTimeMonth + '/' + endTimeDay
    }
  },
  components: {
    vanSearch: Search,
    vanButton: Button,
    vanPullRefresh: PullRefresh,
    vanList: List,
    vanCell: Cell,
    vanTag: Tag,
    vanEmpty: Empty,
    vanCalendar: Calendar,
    vanPopup: Popup
  },
  async created () {
    this.listQuery.endTime = timeFormatterSort(new Date()) + ' 23:59:59'
    this.listQuery.beginTime = getDay(-2, '-') + ' 00:00:00'
    await this.getData()
  },
  mounted () {
  },
  methods: {
    // 导出 (这个功能暂时不需要)
    exportData () {
      httpGet(aiInOutRecords, this.listQuery)
        .then(res => {
          console.log(encodeURIComponent(res))
          // let url = 'data:text/csv;charset=utf-8,\ufeff' + encodeURIComponent(str)
          let link = document.createElement('a')
          // link.href = url
          link.download = 'daySheet.csv' // 导出excel的名字
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        })
    },
    // 查看图片
    viewPicture (item) {
      this.showPicture = true
      httpPut(inOutPhoto + item.id + '/' + item.inOutTime)
        .then(res => {
          this.imgUrl = 'data:image/jpeg;base64,' + res.data
          console.log(res)
        }).catch((err) => {
          Toast(err)
        })
    },
    // 确定选择的时间区间
    onConfirmCalendar (date) {
      const [start, end] = date
      this.showCalendar = false
      this.listQuery.beginTime = timeFormatterSort(start) + ' 00:00:00'
      this.listQuery.endTime = timeFormatterSort(end) + ' 23:59:59'
      this.listQuery.offset = 1
      this.listData = []
      this.getData()
    },
    // 输入名字查询调用的事件
    onSearch () {
      this.listData = []
      this.listQuery.offset = 1
      this.listQuery.userName = this.userName
      this.getData()
    },
    getData () {
      let list = Object.assign(this.listQuery, {departmentId: getDepInfo().departmentId, dcCode: getDepInfo().departmentId})
      // let list = Object.assign(this.listQuery, {departmentId: 7235, dcCode: 7235})
      let self = this
      // 线上
      httpGet(page, list)
        .then(res => {
          let data = res.data
          if (data.rows !== null) {
            self.listData = self.listData.concat(data.rows)
          }
          if (data.total === 0 && list.offset === 1) {
            self.ifData = true
          } else {
            self.ifData = false
          }
          self.total = data.total
          self.loading = false
          self.refreshing = false
        })
      // 测试
      // Axios({
      //   method: 'get',
      //   url: 'https://beta.cytingchechang.com/os/v1/ai/aiInOut/tree/page',
      //   params: list,
      //   headers: {'AdminToken': 'eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJDWUtKIiwiZXhwIjoxNTk5Mjg4NDI1LCJ4LXVzZXJJZCI6Mn0.VuVVtGDfkT1alT4vHySFc3TNMbR3Vo94C6oahGePq3k'}
      // }).then(res => {
      //   let data = res.data.data
      //   if (data.rows !== null) {
      //     self.listData = self.listData.concat(data.rows)
      //   }
      //   if (data.total === 0 && list.offset === 1) {
      //     this.ifData = true
      //   }
      //   self.total = data.total
      //   self.loading = false
      //   self.refreshing = false
      //   return data.total
      // })
    },
    // 下拉刷新
    onRefresh () {
      this.loading = true
      this.listQuery.offset = 1
      let self = this
      this.finished = false
      setTimeout(() => {
        self.listData = []
        self.getData()
      }, 1500)
    },
    // 触底时触发加载函数
    onLoadList () {
      this.listQuery.offset++
      let self = this
      setTimeout(async () => {
        await self.getData()
        if (self.listData.length >= this.total) {
          self.finished = true
        }
      }, 1500)
    }
  }
}
</script>
<style lang='scss' scoped>
.flex-vc{
display:flex;
flex-direction:column;
justify-content:center;
}
.dateButton{
  height:100%;
  width:35%;
  border-left:2px solid #C0C0C0;
  border-right:2px solid #C0C0C0;
  background:#3366FF;
  color: antiquewhite;
}
.dateButton:active{
  background: #3333FF;
}
.conditionQuery{
    display: flex;
    height: 2.88rem;
}
.conditionQuery /deep/ .van-button{
    border-radius: none;
}

.list-li{
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 4.8rem;
  padding: 0.72rem 1.2rem;
  font-size: 0.96rem;
  border-bottom: 1px solid #F0F0F0;
  span{
    margin-bottom: 3px;
  }
}
.export{
  width:20%;
  background:#3366FF;
  color: antiquewhite;
  border-left:2px solid antiquewhite
}
</style>

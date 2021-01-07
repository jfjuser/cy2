<template>
  <div class="page">
    <van-nav-bar
  :title="status.boolean[Number(type)] + '详情'"
  left-text="返回"
  left-arrow
  @click-left="onClickLeft"
/>
<van-loading v-if="loading" size="24px" vertical style="margin-top: 50px">加载中...</van-loading>
<van-empty v-if="empty" :description="'暂无' + status.boolean[Number(type)] + '人员'" />
  <div v-else class="container">
    <div  class="card-box" v-for="item in listData" :key="item.id">
      <p style="padding:0 20px">姓名: {{item.userName}}</p>
      <p style="padding:0 20px">日期: {{timeFormatterSort(item.workDay)}}</p>
      <!-- 缺卡 -->
      <div v-if="Number(type) === 1">
        <p v-if="Number(item.firstTime) === -1" style="padding:0 20px">班次一: 缺卡</p>
        <p v-if="Number(item.secondTime) === -1" style="padding:0 20px">班次二: 缺卡</p>
        <p v-if="Number(item.thirdTime) === -1" style="padding:0 20px">班次三: 缺卡</p>
      </div>
      <!-- 迟到 -->
      <div v-if="Number(type) === 2">
        <p v-if="item.firstTime" style="padding:0 20px">班次一: 打卡时间{{timeFormatter(item.firstTime)}}</p>
        <p v-if="item.secondTime" style="padding:0 20px">班次二: 打卡时间{{timeFormatter(item.secondTime)}}</p>
        <p v-if="item.thirdTime" style="padding:0 20px">班次三: 打卡时间{{timeFormatter(item.thirdTime)}}</p>
      </div>
      <!-- 早退 -->
      <div v-if="Number(type) === 3">
        <p v-if="item.firstTime" style="padding:0 20px">班次一: 打卡时间{{timeFormatter(item.firstTime)}}</p>
        <p v-if="item.secondTime" style="padding:0 20px">班次二: 打卡时间{{timeFormatter(item.secondTime)}}</p>
        <p v-if="item.thirdTime" style="padding:0 20px">班次三: 打卡时间{{timeFormatter(item.thirdTime)}}</p>
      </div>
      <!-- 旷工 -->

    </div>
  </div>
  </div>
</template>
<script>
import { updateWorkRecord, Exception } from '@/api/url'
import { NavBar, Empty, Loading } from 'vant'
import { timeFormatterYesterdaySort, timeFormatterSort, timeFormatter } from '@/utils/formatter'
export default {
  name: '',
  components: {
    vanNavBar: NavBar,
    vanEmpty: Empty,
    vanLoading: Loading
  },
  async created () {
    let yesterday = timeFormatterYesterdaySort(new Date())
    let departmentId = this.$store.getters.departmentId
    this.type = this.$route.query.type
    console.log(this.type)
    await this.$http.get(updateWorkRecord, {params: {
      beginTime: yesterday + ' 00:00:00',
      endTime: yesterday + ' 23:59:59',
      departmentId: departmentId,
      type: this.type
    }})
    await this.$http.get(Exception, {params: {
      beginTime: yesterday + ' 00:00:00',
      endTime: yesterday + ' 23:59:59',
      departmentId: departmentId,
      type: this.type
    }}).then(res => {
      let list = []
      this.loading = false
      res.data.rows.forEach(ele => {
        if (ele !== null) {
          list.push(ele)
        }
      })
      if (list.length === 0) {
        this.empty = true
      }
      this.listData = list
    })
  },
  data () {
    return {
      empty: false,
      loading: true,
      timeFormatter,
      type: undefined,
      status: {boolean: {1: '缺卡', 2: '迟到', 3: '早退', 4: '旷工'}},
      listData: [],
      timeFormatterSort
    }
  },
  methods: {
    onClickLeft () {
      this.$router.go(-1)
    }
  }
}
</script>
<style lang='scss' scoped>
.container{
  margin-top: 10px;
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
}
.card-box{
  padding: 10px 0;
  margin-top: 10px;
  width: 95%;
  background: #fff;
  border-radius: 5px;
  display: flex;
  font-size: 15px;
  flex-direction: column;
  justify-content: center;

}
.page{
  background: #F0F0F0;
  height: 100%
}
</style>

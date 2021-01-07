<template>
  <div>
    <button-tab class="search-btns">
      <button-tab-item selected @on-item-click="handleWeek()">本周</button-tab-item>
      <button-tab-item @on-item-click="handleMonth()">本月</button-tab-item>
      <button-tab-item @on-item-click="handleLastMonth()">上月</button-tab-item>
    </button-tab>
    <divider class="line" v-if="list.length==0">感谢使用,没有更多了</divider>
    <RecordBox v-for="item in list" :key="item.id" :info="item"></RecordBox>
  </div>
</template>
<script>
import { httpGet } from '@/utils/restful'
import { getFaceInOut } from '@/api/url.js'
import { getWxInfo, getDepInfo } from '@/utils/userInfo.js'
import RecordBox from './components/record'
import { timeFormatterSort } from '@/utils/formatter.js'
import { ButtonTab, ButtonTabItem, Divider, Flexbox, FlexboxItem } from 'vux'
export default {
  components: {
    ButtonTab,
    ButtonTabItem,
    Divider,
    Flexbox,
    FlexboxItem,
    RecordBox
  },
  data () {
    return {
      defParams: {},
      list: []
    }
  },
  created () {
    this.defParams = {
      departmentId: getDepInfo().departmentId,
      account: getWxInfo().account,
      unicode: getWxInfo().unicode
    }
    this.handleWeek()
  },
  methods: {
    handleFilter () {
      httpGet(getFaceInOut, this.defParams).then(res => {
        this.list = res.data || []
        // this.list = [{"id":21813049,"aiTokenId":21855,"userName":"1102-1","type":2,"localName":"3333","inOutTime":1604383366000,"remarks":null,"phone":null,"addr":null,"floorNum":null,"cameraType":null,"roomNum":null,"tempurature":null,"userId":1142100,"image":null,"leader":"321"},{"id":21647774,"aiTokenId":21855,"userName":"1102-1","type":2,"localName":"3333","inOutTime":1604285626000,"remarks":null,"phone":null,"addr":null,"floorNum":null,"cameraType":null,"roomNum":null,"tempurature":null,"userId":1142100,"image":null,"leader":"321"},{"id":21647770,"aiTokenId":21855,"userName":"1102-1","type":2,"localName":"3333","inOutTime":1604285623000,"remarks":null,"phone":null,"addr":null,"floorNum":null,"cameraType":null,"roomNum":null,"tempurature":null,"userId":1142100,"image":null,"leader":"321"},{"id":21647769,"aiTokenId":21855,"userName":"1102-1","type":2,"localName":"3333","inOutTime":1604285620000,"remarks":null,"phone":null,"addr":null,"floorNum":null,"cameraType":null,"roomNum":null,"tempurature":null,"userId":1142100,"image":null,"leader":"321"},{"id":21647764,"aiTokenId":21855,"userName":"1102-1","type":2,"localName":"3333","inOutTime":1604285615000,"remarks":null,"phone":null,"addr":null,"floorNum":null,"cameraType":null,"roomNum":null,"tempurature":null,"userId":1142100,"image":null,"leader":"321"},{"id":21647760,"aiTokenId":21855,"userName":"1102-1","type":2,"localName":"3333","inOutTime":1604285610000,"remarks":null,"phone":null,"addr":null,"floorNum":null,"cameraType":null,"roomNum":null,"tempurature":null,"userId":1142100,"image":null,"leader":"321"},{"id":21644349,"aiTokenId":21855,"userName":"1102-1","type":2,"localName":"3333","inOutTime":1604281175000,"remarks":null,"phone":null,"addr":null,"floorNum":null,"cameraType":null,"roomNum":null,"tempurature":null,"userId":1142100,"image":null,"leader":"321"},{"id":21644332,"aiTokenId":21855,"userName":"1102-1","type":2,"localName":"3333","inOutTime":1604281164000,"remarks":null,"phone":null,"addr":null,"floorNum":null,"cameraType":null,"roomNum":null,"tempurature":null,"userId":1142100,"image":null,"leader":"321"},{"id":21644103,"aiTokenId":21855,"userName":"1102-1","type":2,"localName":"3333","inOutTime":1604280928000,"remarks":null,"phone":null,"addr":null,"floorNum":null,"cameraType":null,"roomNum":null,"tempurature":null,"userId":1142100,"image":null,"leader":"321"},{"id":21644097,"aiTokenId":21855,"userName":"1102-1","type":2,"localName":"3333","inOutTime":1604280922000,"remarks":null,"phone":null,"addr":null,"floorNum":null,"cameraType":null,"roomNum":null,"tempurature":null,"userId":1142100,"image":null,"leader":"321"}]
      }).catch(() => {
        this.$vux.toast.text('加载失败', 'bottom')
      })
    },
    // 本周
    handleWeek () {
      let date = new Date()
      let weekday = date.getDay() || 7 // 获取星期几,getDay()返回值是 0（周日） 到 6（周六） 之间的一个整数。0||7为7，即weekday的值为1-7
      date.setDate(date.getDate() - weekday + 1) // 往前算（weekday-1）天，年份、月份会自动变化
      this.defParams.startTime = timeFormatterSort(date) + ' 00:00:00'
      this.defParams.endTime = timeFormatterSort(new Date()) + ' 23:59:59'
      this.handleFilter()
    },
    // 本月
    handleMonth () {
      this.defParams.startTime = timeFormatterSort(new Date(new Date().setDate(1))) + ' 00:00:00'
      this.defParams.endTime = timeFormatterSort(new Date()) + ' 23:59:59'
      this.handleFilter()
    },
    // 上月
    handleLastMonth () {
      this.defParams.startTime = timeFormatterSort(new Date(new Date().setMonth(new Date().getMonth() - 1)).setDate(1)) + ' 00:00:00'
      this.defParams.endTime = timeFormatterSort(new Date(new Date().setDate(0))) + ' 23:59:59'
      this.handleFilter()
    }
  }
}
</script>
<style lang='scss' scoped>
.search-btns {
  padding: 2% 10%;
}
.line {
  padding: 2% 5%;
}
.point-ul {
  background-color: #ececec;
  padding: .625rem 1.25rem;
  border-bottom: 1px solid #d4d4d4;
  .point-ul-month {
    font-weight: 600;
  }
  .point-ul-info {
    text-align: center;
    font-size: .875rem;
    span {
      color: rgb(241, 143, 50);
    }
  }
}
.point-li {
  position: relative;
  padding: .9375rem 1.875rem;
  background-color: white;
  border-bottom: 1px solid #d4d4d4;
  .point-li-eventName {
    display: flex;
    font-weight: bold;
    letter-spacing: .125rem
  }
  .point-li-eventAt {
    display: flex;
    color: #7e7e7e;
    margin-top: .3125rem;
    font-size: .75rem;
  }
  .point-li-points {
    position: absolute;
    top: 40%;
    right: 5%;
    font-weight: bold;
    letter-spacing: .0625rem
  }
}
</style>

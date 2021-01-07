<template>
  <div>
    <button-tab class="search-btns">
      <button-tab-item selected @on-item-click="handleWeek()">在校</button-tab-item>
      <button-tab-item @on-item-click="handleMonth()">离校</button-tab-item>
      <button-tab-item @on-item-click="handleLastMonth()">未到校</button-tab-item>
    </button-tab>
    <divider class="line" v-if="list.length==0">感谢使用,没有更多了</divider>
    <!-- <divider class="line" v-if="list.length==0">人数:{{list.length}}</divider> -->
    <!-- v-for="item in list" :key="item.id" -->
    <RecordBox  :list="list" v-else></RecordBox>
  </div>
</template>
<script>
import { httpGet } from '@/utils/restful'
import {Toast} from 'vant'
import { aiInOut, getAiuserMessage } from '@/api/url.js'
import { getWxInfo, getDepInfo, getUserInfo } from '@/utils/userInfo.js'
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
      list: [],
      useInfo: {},
      isout: '在校'
    }
  },
  created () {
    console.log(getUserInfo())
    console.log(9999, !getUserInfo())
    if (!getUserInfo()) {
      Toast('请先登录')
      setTimeout(() => {
        this.$router.push({path: '/faceAI/userModel/bind/zhLogin/', query: {id: 110}})
      }, 3000)
    } else {
      this.handleFilter(1)
    }
  },
  methods: {
    getUserInfo1 () {
      httpGet(getAiuserMessage + getWxInfo().unicode + '/' + getWxInfo().account).then((res) => {
        if (res.data) {
          this.useInfo = res.data[0]
        } else {
          Toast('请先绑定用户信息')
          setTimeout(() => {
            this.$router.replace('/faceAI/userAdmin/')
          }, 3000)
        }
      }).catch(() => {
        Toast('请先绑定用户信息')
        setTimeout(() => {
          this.$router.replace('/faceAI/userAdmin/')
        }, 3000)
      })
    },
    handleFilter (num) {
      this.list = []
      httpGet(aiInOut + getDepInfo().departmentId + '/' + getUserInfo().id).then(res => {
        if (num === 1) {
          this.list = res ? res.data.inList : []
          this.isout = '在校'
        } else if (num === 2) {
          this.list = res ? res.data.outList : []
          this.isout = '离校'
        } else if (num === 3) {
          this.list = res ? res.data.notList : []
          this.isout = '未到校'
        }
      }).catch(() => {
        this.$vux.toast.text('加载失败', 'bottom')
      })
    },
    // 本周
    handleWeek () {
      // let date = new Date()
      // let weekday = date.getDay() || 7 // 获取星期几,getDay()返回值是 0（周日） 到 6（周六） 之间的一个整数。0||7为7，即weekday的值为1-7
      // date.setDate(date.getDate() - weekday + 1) // 往前算（weekday-1）天，年份、月份会自动变化
      // this.defParams.startTime = timeFormatterSort(date) + ' 00:00:00'
      // this.defParams.endTime = timeFormatterSort(new Date()) + ' 23:59:59'
      // this.handleFilter()
      this.handleFilter(1)
    },
    // 本月
    handleMonth () {
      this.handleFilter(2)
      // this.defParams.startTime = timeFormatterSort(new Date(new Date().setDate(1))) + ' 00:00:00'
      // this.defParams.endTime = timeFormatterSort(new Date()) + ' 23:59:59'
      // this.handleFilter()
    },
    // 上月
    handleLastMonth () {
      this.handleFilter(3)
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

/* eslint-disable */
<template>
  <!-- 停车记录 -->
  <div class="main-body">
    <loading :show="showLoading" text="加载中"></loading>
    <div class="box" v-for="(item) in data" :key="item.id">
      <div class="box-title">
        <span class="box-plate">{{item.inOutDetail.plateIn}}</span>
        <span class="box-department">{{item.inOutDetail.departmentName}}</span>
      </div>
      <div class="box-body">
        <flow orientation="vertical" style="height:120px;">
          <flow-state :title="'入场 ' + formatterTime2(item.inOutDetail.ioTimeIn)" is-done></flow-state>
          <flow-line is-done></flow-line>
          <template v-for="(order,index) in item.orderDetailList" v-bind="index">
            <flow-state :title="paySenceFormatter(order.paySence) + '-' + moneyFormatter(order.cashPay, order.electronicPrepay, order.status) " is-done :key="index"></flow-state>
            <!-- <flow-line :tip="tipFormatter(order)" :tip-direction=tipDirectionFormatter(order)></flow-line> -->
            <flow-line is-done :key="index"></flow-line>
          </template>
          <flow-state :title="'出场 ' + formatterTime2(item.inOutDetail.ioTimeOut)" is-done></flow-state>
        </flow>
      </div>
      <span class="box-department">停车:{{item.inOutDetail.ioTime}}</span>
    </div>
    <!-- <div class="question" @click="handleQuestion">常见问题</div> -->
  </div>
</template>
<style lang="scss" scoped>
.main-body {
  padding: 5% 5% 10%;
}
.box {
  margin: 0 0 4%;
  padding: 5%;
  border-radius: 5px;
  font-size: 14px;
  background-color: #ecf5ff;
  border: 1px solid #b3d8ff;
}
.box-title {
  text-align: left;
}
.box-plate {
  font-size: 18px;
}
.box-department {
  margin-left: 5%;
  font-size: 12px;
  color: #636363;
}
.box-body {
  text-align: left;
  padding: 0 2%;
  width: 20%;
}
.box-blue {
  height: 100px;
  padding: 5%;
  border-radius: 5px;
  font-size: 14px;
  color: #409EFF;
  background-color: #ecf5ff;
  border: 1px solid #b3d8ff;
}
.box-green {
  height: 100px;
  padding: 5%;
  border-radius: 5px;
  font-size: 14px;
  color: #67c23a;
  background-color: #f0f9eb;
  border: 1px solid #c2e7b0;
}
.question {
  z-index: 1001;
  position: fixed;
  padding: 3% 0;
  bottom: 0;
  left: 0;
  width: 100%;
  text-align: center;
  color: #409EFF;
}
</style>
<script>
import { getUserInOut, getWxUserInfo } from '@/api/url.js'
import { httpGet } from '@/utils/restful.js'
import { getQueryString, formatterTime2, paySenceFormatter } from '@/utils/formatter.js'
import { Flow, FlowState, FlowLine, Loading } from 'vux'
document.title = '停车记录'
export default {
  components: {
    Flow,
    FlowState,
    FlowLine,
    Loading
  },
  data () {
    return {
      data: [],
      openId: '',
      showLoading: true,
      params: {
        account: undefined,
        source: 5
      },
      getQueryString: getQueryString,
      formatterTime2: formatterTime2,
      paySenceFormatter: paySenceFormatter
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    // 获取列表
    fetchData () {
      // 获取openId
      // 微信用户临时身份号
      let code = this.getQueryString('code')
      this.openId = this.getQueryString('openId')
      this.params.account = this.getQueryString('account')
      if (this.openId) {
        this.getUserInOut()
      } else if (code) {
        let temp = Object.assign(this.params, {unicode: code})
        httpGet(getWxUserInfo, temp).then(res => {
          // 注意是res.openid!!!!
          this.openId = res.data.openid
          this.getUserInOut()
        }).catch(() => {
        })
      } else {
        // 未登录
        this.$vux.toast.text('未授权登录', 'bottom')
        this.showLoading = false
      }
    },
    getUserInOut () {
      let temp = Object.assign(this.params, {unicode: this.openId})
      httpGet(getUserInOut, temp).then(res => {
        this.data = res.data
        this.showLoading = false
      }).catch(() => {
      })
    },
    handleQuestion () {
      // this.$vux.toast.text('', 'bottom')
    },
    moneyFormatter (cashPay, electronicPrepay, status) {
      if (cashPay > 0 && status === 1) {
        return '现金已收' + cashPay + '元'
      } else if (electronicPrepay > 0 && status === 1) {
        return '电子缴费' + electronicPrepay + '元'
      } else if (status === 0) {
        return '下单' + (cashPay + electronicPrepay) + '元,未支付'
      }
      return ''
    },
    tipFormatter (order) {
      if (order.paySence === 0) {
        return '有效期内可直接出场'
      } else if (order.paySence === 1) {
        return '离场中'
      }
      return ''
    },
    // 判定提示方向
    tipDirectionFormatter (order) {
      if (order.paySence === 0) {
        return 'right'
      } else if (order.paySence === 1) {
        return 'left'
      }
      return 'left'
    }
  }
}
</script>

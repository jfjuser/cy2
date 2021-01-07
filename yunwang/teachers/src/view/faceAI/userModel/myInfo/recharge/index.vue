<template>
  <!-- <div>暂无充值套餐</div> -->
  <div>
    <x-header :left-options="{showBack: false}" style="margin-bottom:0.5rem;">充值中心</x-header>
    <!-- <x-input v-model="listQuery.price" type="number" @on-click-clear-icon="listQuery.price = ''" placeholder="请输入充值金额"></x-input> -->
        <checker v-model="monNumber" default-item-class="item" selected-item-class="item-selected" :radio-required="true">
          <!-- <div v-for="(item, index) in btnArr" style="display:inline-flex;justify-content:space-between" :key=index> -->
            <checker-item v-for="(item, index) in btnArr" :value="item" :key=index style="width:100px;height:50px">
              <span style="color:#3399cc;display:block">{{item.price}}元</span>
              <span style="color:#009393">{{item.points}}积分</span>
            </checker-item>
          <!-- </div> -->
          <!-- <checker-item :value="50">50元</checker-item>
          <checker-item :value="100">100元</checker-item>
          <checker-item :value="300">300元</checker-item>
          <checker-item :value="1000">1000元</checker-item>
          <checker-item :value="5000">5000元</checker-item> -->
        </checker>
        <div style="text-align:right;margin-top:3rem">
          <span style="margin-right:10px">到账：<span style="color:#3399ee">{{listQuery.price +  '(元)'}}</span></span>
        </div>
    <group title="暂不支持其他支付方式" style="margin-top:10px;margin-bottom:80px;text-align:left">
      <checker v-model="payStyle" default-item-class="items item-selected" selected-item-class="item-selected" :radio-required="true">
          <!-- <checker-item :value="1" class="warp"><img class="img" src="@/assets/ipay.png" /><span style="margin-right:30px">支付宝</span></checker-item> -->
          <checker-item :value="1" class="warp"><img class="img" src="@/assets/wx.png" /><span style="margin-right:30px">微信</span></checker-item>
          <!-- <checker-item :value="3" class="warp"><img class="img" src="@/assets/card.png" /><span style="margin-right:30px">银行卡</span></checker-item> -->
        </checker>
    </group>
    <div><span style="color:#666666;font-size:0.9rem">点击充值即代表你已同意<span style="font-weight:bold">《充值协议》</span></span></div>
    <div style="margin-top:30px">
      <x-button style="height:3.5rem;background:#3399cc;color:#fff;border-radius:0" @click.native="addCount">去充值</x-button>
    </div>
  </div>
</template>
<script>
import { XInput, XButton, Checklist, Group, Cell, XHeader, Radio, Checker, CheckerItem } from 'vux'
import { pagePointsRules } from '@/api/url'
import { httpGet } from '@/utils/restful'
import { getDepInfo } from '@/utils/userInfo'
export default {
  components: {
    XInput,
    XButton,
    Checklist,
    Group,
    Cell,
    XHeader,
    Radio,
    Checker,
    CheckerItem
  },
  data () {
    return {
      monNumber: {},
      payStyle: '1',
      btnArr: [
        // { points: 3243,
        //   price: 0.01
        // },
        // { points: 125,
        //   price: 0.02
        // },
        // { points: 1225,
        //   price: 0.12
        // }
      ],
      listQuery: {
        offset: 1,
        limit: 10,
        departmentId: getDepInfo().departmentId,
        type: 1,
        price: 0
      }
    }
  },
  watch: {
    monNumber (cur, old) {
      if (cur !== '') {
        this.listQuery.price = cur.price
      }
    }
  },
  mounted () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      httpGet(pagePointsRules, this.listQuery)
        .then((res) => {
          console.log(res.data)
          this.btnArr = res.data
        }).catch(() => {})
    },
    addCount () {
      this.$vux.toast.text('暂不可进行充值！', 'bottom')
    }
  }
}
</script>
<style lang='scss' scoped>
.btn{
  display: inline-block;
  width:30%;
  margin:0 0.2rem;
}
.warp{
  text-align:left;
  display:flex;
  justify-content:space-between;
}
.img{
  width:35px;
  height:35px;
  margin-top:8px;
  margin-left:30px;
}
.items{
  width: 100%;
  height:3rem;
  line-height: 3rem;
  text-align: center;
  border-radius: 3px;
  border: 1px solid #ccc;
  background-color: #fff;
  margin-right: 6px;
  margin-top:8px;
}
.item {
  width: 30%;
  height:3rem;
  line-height: 3rem;
  text-align: center;
  border-radius: 3px;
  border: 1px solid #ccc;
  background-color: #fff;
  margin-right: 6px;
  margin-top:8px;
}
.item-selected {
  // background: #ffffff url(./../../../../assets/icon/icon_select_blue.png) no-repeat right bottom;
  border-color: #b3d8ff;
  background-color: #b3d8ff;
}
</style>

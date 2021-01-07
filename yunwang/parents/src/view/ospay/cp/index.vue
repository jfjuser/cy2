<template>
  <!-- 扫码直付 -->
  <div id="app" :style="bgimg">
    <router-view v-wechat-title='$route.meta.title'></router-view>
    <!-- <div class="box-plate" >{{params.plate}}</div>
    <div class="box">
      <div class="box-title">
        <div class="box-price" :class="errorPrice">{{params.price}}</div>
      </div>
      <div class="box-content">
        <flexbox class="box-content-card">
          <flexbox-item :span="1/3" class="box-content-card-left">停车时长:</flexbox-item>
          <flexbox-item :span="2/3" class="box-content-card-right">{{params.duration}}</flexbox-item>
        </flexbox>
        <flexbox class="box-content-card">
          <flexbox-item :span="1/3" class="box-content-card-left">入场时间:</flexbox-item>
          <flexbox-item :span="2/3" class="box-content-card-right">{{params.inTime}}</flexbox-item>
        </flexbox>
        <flexbox class="box-content-card">
          <flexbox-item :span="1/3" class="box-content-card-left">车场名称:</flexbox-item>
          <flexbox-item :span="2/3" class="box-content-card-right"><span class="bold">{{params.departmentName}}</span></flexbox-item>
        </flexbox>
        <flexbox class="box-content-card">
          <flexbox-item :span="1/3" class="box-content-card-left">减免金额:</flexbox-item>
          <flexbox-item :span="2/3" class="box-content-card-right">{{params.derateMoney}}</flexbox-item>
        </flexbox>
        <flexbox class="box-content-card">
          <flexbox-item :span="1/3" class="box-content-card-left">订单编号:</flexbox-item>
          <flexbox-item :span="2/3" class="box-content-card-right">{{params.orderId}}</flexbox-item>
        </flexbox>
      </div>
    </div>
    <div v-if="isShow" class="pay" :class="isCanIn" :disabled="disabled" @click="goPay">{{btnText}}</div>
    <div class="instruction" v-if="isShow">
    请5分钟内支付{{payType}}
    </div> -->
    <div class="main">
      <div class="card">
        <div class="money" :class="errorPrice">{{params.price}}</div>
        <div class="free">减免:{{params.derateMoney}}</div>
        <div class="info">
          <div class="item">
            <span>车牌号码:</span>
            <span>{{params.plate}}</span>
          </div>
          <div class="item">
            <span>停车时长:</span>
            <span>{{params.duration}}</span>
          </div>
          <div class="item">
            <span>入场时间:</span>
            <span>{{params.inTime}}</span>
          </div>
          <div class="item">
            <span>车场名称:</span>
            <span class="bold">{{params.departmentName}}</span>
          </div>
          <div class="item">
            <span>订单编号:</span>
            <span>{{params.orderId}}</span>
          </div>
        </div>
      </div>
      <div v-if="isShow" class="pay" :class="isCanIn" :disabled="disabled" @click="goPay">{{btnText}}</div>
      <div class="instruction" v-if="isShow">
      请5分钟内支付{{payType}}
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
#app{
  // background-color: white;//#FCFCFC;
  background-color: #fafafa !important;
  min-height: 100vh;
  padding: 1rem;
  box-sizing: border-box;
}
// .box {
//   position: relative;
//   background-color: white;
// }
// .box-plate {
//     font-size: 22px;
//     margin-top: 20px;
//     height: 30px;
//     color: #2E8B57;
//     letter-spacing: 2px;
//     text-align: left;
//     padding: 20px;
// }
// .box-title {
//   margin-top: 10px;
//   color: black;
//   .box-price {
//     margin-top: 10px;
//   }
// }

// .box-content {
//   background-color: white;
//   padding: 20px 20px;
//   font-size: 15px;
//   .box-content-card {
//     line-height: 30px;
//     .box-content-card-left {
//       text-align: left;
//     }
//     .box-content-card-right {
//       text-align: right;
//     }
//   }
// }
.bold{
  color: #2E8B57;
}
.canIn{
  background: rgb(6,188,7);
}
.noCanIn{
  background: rgba(6,188,7,0.3);
}
.errorTips {
  color: red;
  font-size: 20px;
}
.successTips {
  font-size: 30px;
}
.pay{
  // width: 85%;
  height: 30px;
  border-radius: .25rem;
  color: white;
  margin: 1.5rem auto;
  margin-bottom: .5rem;
  text-align: center;
  line-height: 2.25rem;
  height: 2.25rem;
  font-size: 1rem;
  letter-spacing: 5px;
}
.instruction{
  // background-color: white;
  border: none;
  font-size: 1rem;
  color: #13bd15;
  text-align: right;
}
.main {
  position: relative;
  top: 5rem;
  .card {
    border-radius: .4rem;
    padding: .8rem;
    box-shadow: 0 1px .9rem 0 rgba(0,0,0,.1);
    background-color: #fff;
    .money {
      font-weight: bold;
      font-size: 2rem;
      padding-top: 1rem;
    }
    .free {
      font-size: 1rem;
      text-align: right;
      padding-right: 1rem;
      padding-bottom: 1rem;
    }
    .info {
      font-size: 1rem;
      line-height: 1.5rem;
      .item {
        display: flex;
        justify-content: space-between;
      }
    }
  }
}
</style>
<script>
import { Group, Cell, Marquee, MarqueeItem, Flexbox, FlexboxItem } from 'vux'
import { osQueryFee, osPay } from '@/api/url.js'
import { httpPost } from '@/utils/restful.js'
import { formatterTime2, timeDuration, moneyFormatter } from '@/utils/formatter.js'
export default {
  components: {
    Group,
    Cell,
    Marquee,
    MarqueeItem,
    Flexbox,
    FlexboxItem
  },
  data () {
    return {
      code: undefined,
      params: {
        plate: '正在查询..',
        inTime: '正在查询..',
        duration: '正在查询..',
        price: '正在查询..',
        derateMoney: '正在查询..',
        orderId: '正在查询..',
        queryOrderNo: '',
        freeOutTime: '',
        departmentName: '正在查询..'
      },
      isShow: false,
      disabled: false,
      btnText: '立即缴费',
      isNoPlate: false,
      errorPrice: 'successTips',
      payType: '',
      isCanIn: 'noCanIn',
      bgimg: {
        background:
          'url(' + require('@/assets/icon/wx/fun/back-type-3.jpg') + ') no-repeat top',
        backgroundSize: '100% 25%'
      }
    }
  },
  mounted () {
    let self = this
    let queryParams = {
      plate: localStorage.getItem('plate'),
      plateType: this.$route.query.plateType,
      departmentId: this.$route.query.dep,
      payScene: this.$route.query.scene,
      outChannelId: this.$route.query.code
    }
    if (queryParams.plate) {
      const validator = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领]{1}[A-Z0-9]*$/
      if (validator.test(queryParams.plate)) {
        // 有牌车
        self.isNoPlate = false
      } else {
        // 无牌车
        self.isNoPlate = true
      }
    }
    if (self.isNoPlate === true) {
      // 先查无牌车
      queryParams.payScene = '2'
    }
    this.queryFee(queryParams)
  },
  methods: {
    queryFee (queryParams) {
      let self = this
      httpPost(osQueryFee, queryParams).then(res => {
        if (res.state === 0) {
          // 无牌车没有获取到金额则查有牌车
          if (queryParams.payScene === '2') {
            queryParams.payScene = '1'
            self.queryFee(queryParams)
          } else {
            self.params = {
              plate: queryParams.plate,
              inTime: '-',
              duration: '-',
              price: res.errmsg,
              derateMoney: '-',
              orderId: '-',
              departmentName: '-'
            }
            self.errorPrice = 'errorTips'
          }
        } else {
          self.params = {
            plate: res.car_number,
            inTime: formatterTime2(res.in_time * 1000),
            duration: timeDuration(res.duration * 60),
            price: '￥' + moneyFormatter(res.price),
            derateMoney: '￥' + moneyFormatter(res.derate_money),
            orderId: res.order_id,
            queryOrderNo: res.query_order_no,
            freeOutTime: res.free_out_time,
            departmentName: res.department_name
          }
          self.isShow = true
          console.info(queryParams)
          if (queryParams.payScene === '0') {
            self.payType = ''
          } else {
            self.payType = ',开闸后请立即通行'
          }
          self.isCanIn = 'canIn'
        }
      }).catch((err) => {
        // 如果无牌车查询失败，则查询有牌车
        if (queryParams.payScene === '2') {
          queryParams.payScene = '1'
          self.queryFee(queryParams)
        } else {
          self.params = {
            plate: queryParams.plate,
            inTime: '-',
            duration: '-',
            price: err,
            derateMoney: '-',
            orderId: '-',
            queryOrderNo: '-',
            departmentName: '-'
          }
          self.errorPrice = 'errorTips'
          self.isCanIn = 'noCanIn'
        }
      })
    },
    goPay () {
      if (this.isCanIn === 'noCanIn') {
        return
      }
      let payChannel
      // 判断是走微信还是支付宝
      var ua = window.navigator.userAgent.toLowerCase()
      if (ua.indexOf('micromessenger') !== -1) {
        payChannel = 0
      } else {
        payChannel = 1
      }
      let payParams = {
        queryOrderNo: this.params.queryOrderNo,
        payChannel: payChannel,
        plate: localStorage.getItem('plate'),
        plateType: this.$route.query.plateType,
        departmentId: this.$route.query.dep,
        payScene: this.$route.query.scene,
        outChannelId: this.$route.query.code
      }
      this.isCanIn = 'noCanIn'
      httpPost(osPay, payParams).then(res => {
        if (res.data.payUrl) {
          // post请求跳转
          // let URL = res.data.payUrl.split('?')[0]
          // let PARAMS = res.data.payUrl.split('?')[1].split('&')
          // var temp = document.createElement('form')
          // temp.action = URL
          // temp.method = 'post'
          // temp.style.display = 'none'
          // for (let i = 0; i < PARAMS.length; i++) {
          //   var opt = document.createElement('textarea')
          //   opt.name = PARAMS[i].split('=')[0]
          //   opt.value = PARAMS[i].split('=')[1]
          //   temp.appendChild(opt)
          // }
          // document.body.appendChild(temp)
          // temp.submit()
          // return temp
          window.location.href = res.data.payUrl
        } else {
          this.$vux.toast.text('下单失败,请退出重试', 'bottom')
        }
      }).catch((res) => {
        this.isCanIn = 'canIn'
        this.$vux.toast.text(res, 'bottom')
      })
    }
  }
}
</script>

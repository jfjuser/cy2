<template>
  <div class="page">
    <header class="header">
        <icon type="success-circle" style="color:#fff;font-size: 2rem;"></icon>
        <div>支付完成</div>
    </header>
    <div class="info">
      <div class="item">
        <span>订单编号:</span>
        <span>1111111111111111111</span>
      </div>
      <div class="item">
        <span style="letter-spacing: 0.11rem">停车场名称:</span>
        <span>xx停车场</span>
      </div>
      <div class="item">
        <span>车辆类型:</span>
        <span>临时车</span>
      </div>
      <div class="item">
        <span>支付金额:</span>
        <span>1元</span>
      </div>
      <div class="item">
        <span>支付状态:</span>
        <span>完成</span>
      </div>
      <div class="item">
        <span>支付时间:</span>
        <span>2019-01-01</span>
      </div>
    </div>
    <section style="margin-top:2rem">
        <img src="@/assets/icon/wx_follow.jpg" class="img">
        <p style="font-size: 0.6rem">长按关注公众号</p>
    </section>
    <section class="swiperbox">
        <swiper :list="list" height="9rem"></swiper>
    </section>
  </div>
</template>

<script>
import { Swiper, Icon } from 'vux'
export default {
  components: {
    Swiper,
    Icon
  },
  data () {
    return {
      list: [{}, {}]
    }
  }
}
</script>

<style lang="scss" scoped>
.header {
    background-color: #46c01b;
    overflow: hidden;
    height: 6rem;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    border-bottom-left-radius: 50% 50%;
    border-bottom-right-radius: 50% 50%;
    width: 120vw;
    position: relative;
    left: -10vw;
}
.info {
    padding: 0 1rem;
    margin-top: 1.5rem;
  .item {
    text-align: left;
    margin-left:0.8rem;
    margin-bottom: .5rem;
    span:nth-of-type(1) {
        letter-spacing: .3rem;
    }
  }
}
.img {
    width: 8rem;
    height: 8rem;
    background-color: #ccc;
}
.swiperbox {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    background-color: #ccc;
}
</style>

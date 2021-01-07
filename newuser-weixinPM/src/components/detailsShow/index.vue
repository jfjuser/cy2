<template>
  <div style="height:100vh;">
    <Tag mark style="margin:1rem 0 0 1rem" size="large" @click.native="toIndex" type="success">返回首页</Tag>
    <div style="text-align:center;">
      <div style="color:#1989fa">操作流程指引图</div>
      <div style="font-size:14px;color:#585858">(可左右滑动)</div>
    </div>
    <div style="width:100%;overflow:hidden;">
      <Swipe style="width:80vw;margin-left:10vw;margin-top:2vh;height:85vh" :autoplay="4000" indicator-color="#1E90FF">
        <SwipeItem><img src="@/assets/dt/yi.jpg" class="img"></SwipeItem>
        <SwipeItem><img src="@/assets/dt/yip.jpg" class="img"></SwipeItem>
        <SwipeItem><img src="@/assets/dt/er.png" class="img"></SwipeItem>
        <SwipeItem><img src="@/assets/dt/san.jpg" class="img"></SwipeItem>
        <SwipeItem><img src="@/assets/dt/si.jpg" class="img"></SwipeItem>
        <SwipeItem><img src="@/assets/dt/wu.jpg" class="img"></SwipeItem>
        <SwipeItem><img src="@/assets/dt/six.jpg" class="img"></SwipeItem>
      </Swipe>
    </div>
  </div>
</template>
<script>
import { Swipe, SwipeItem, Tag } from 'vant'
export default {
  name: 'detailsShow',
  data () {
    return {
    }
  },
  methods: {
    toIndex () {
      this.$router.replace('/addInfo/')
    }
  },
  components: {
    Swipe,
    SwipeItem,
    Tag
  }
}
</script>
<style lang='scss' scoped>
.img{
  width:80vw;
  display: block;
  overflow: hidden;
  // max-width:100%;
  // max-height:100%;
}
</style>

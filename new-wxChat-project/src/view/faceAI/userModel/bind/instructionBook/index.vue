<template>
  <div>
    <divider>操作说明</divider>
    <group-title style="margin-bottom:15px">手指左右滑动可查看步骤操作</group-title>
    <swiper auto height="500px" dots-position="center">
      <swiper-item>
        <img style="max-height:500px;max-width:400px" src="@/assets/icon/wx/instruction/1.jpg"/>
      </swiper-item>
      <swiper-item>
        <img style="max-height:500px;max-width:400px" src="@/assets/icon/wx/instruction/2.jpg"/>
      </swiper-item>
      <swiper-item>
        <img style="max-height:500px;max-width:400px" src="@/assets/icon/wx/instruction/4.jpg"/>
      </swiper-item>
      <swiper-item>
        <img style="max-height:500px;max-width:400px" src="@/assets/icon/wx/instruction/5.jpg"/>
      </swiper-item>
      <swiper-item>
        <img style="max-height:500px;max-width:400px" src="@/assets/icon/wx/instruction/6.jpg"/>
      </swiper-item>
            <swiper-item>
        <img style="max-height:500px;max-width:400px" src="@/assets/icon/wx/instruction/7.jpg"/>
      </swiper-item>
            <swiper-item>
        <img style="max-height:500px;max-width:400px" src="@/assets/icon/wx/instruction/8.jpg"/>
      </swiper-item>
      <swiper-item>
        <img style="max-height:500px;max-width:400px" src="@/assets/icon/wx/instruction/9.jpg"/>
      </swiper-item>
    </swiper>
  </div>
</template>

<script>
import { Swiper, Divider, GroupTitle, SwiperItem } from 'vux'
export default {
  name: '',
  components: {
    Swiper,
    Divider,
    GroupTitle,
    SwiperItem
  }
}
</script>

<style lang="scss" scoped>
@-webkit-keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translate3d(0, 100%, 0);
  }
  100% {
    opacity: 1;
    transform: none;
  }
}
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translate3d(0, 100%, 0);
  }
  100% {
    opacity: 1;
    transform: none;
  }
}
.fadeInUp {
  animation-name: fadeInUp;
}
.black {
  background-color: #000;
}
.title{
  line-height: 100px;
  text-align: center;
  color: #fff;
}
.animated {
  animation-duration: 1s;
  animation-fill-mode: both;
}
</style>

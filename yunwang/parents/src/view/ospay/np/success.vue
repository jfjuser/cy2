<template>
  <!-- 无牌车入场成功提示 -->
  <div class="box" id='app'>
    <router-view v-wechat-title='$route.meta.title'></router-view>
    <div class="success">
      <img class='image' src="@/assets/success.png" alt="成功">
    </div>
    <span class="tip">入场成功</span>
    <div class="box-close" @click="handleSuccess"><span>完成</span></div>
  </div>
</template>
<style lang="scss" scoped>
.box{
  height: 100%;
  min-height: 100%;
}
.success{
  margin-top: 30px;
}
.tip {
  width: 40%;
  color: black;
  font-size: 20px;
  text-align: center;
}
.box-close {
  width: 90%;
  height: 30px;
  line-height: 30px;
  background:  rgb(32,175,137);
  font-size: 18px;
  text-align: center;
  color: white;
  margin: 20px auto;
  border-radius: 5px;
  padding: 6px 0;
  letter-spacing: 5px;
}
</style>
<script>
import { closeWindow } from '@/utils/window.js'
export default {
  data () {
    return {
    }
  },
  created () {
  },
  methods: {
    handleSuccess () {
      closeWindow(window)
    }
  }
}
</script>

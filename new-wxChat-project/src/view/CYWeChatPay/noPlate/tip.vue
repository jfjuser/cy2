<template>
  <!-- 无牌车入场成功提示 -->
  <div class="box">
    <div class='nav'></div>
    <div class='nav-bottom'></div>
    <span class="tip">入场成功</span>
    <div class='main'>
      <img class='image' src="@/assets/noPlateSuccess.png" alt="成功">
      <span></span>
    </div>
    <div class="box-close" @click="handleSuccess"><span>完成</span></div>
  </div>
</template>
<style lang="scss" scoped>
.box{
  height: 100%;
  min-height: 100%;
}
.nav{
  height: 200px;
  width: 100%;
  background-color: #5990F4;
  display: flex;
  justify-content: center;
  align-items: center;
}
.nav-bottom{
  height: 0;
  width: 0;
  border-top: 200px solid #5990F4;
  border-right: 750px solid transparent;
}
.main{
    width: 80%;
    height: 60%;
    position: absolute;
    top: 20%;
    background: white;
    border-radius: 30px;
    left: 10%;
    box-shadow: 0px 15px 48px 11px rgba(193, 193, 193, 0.43);
    text-align: center;
}
.image{
    width: 80%;
    margin-top: 100px;
}
.tip {
  position: absolute;
  top: 5%;
  left: 30%;
  width: 40%;
  color: white;
  font-size: 24px;
  text-align: center;
}
.box-close {
  position: absolute;
  bottom: 5%;
  left: 30%;
  width: 40%;
  border: 2px solid #5990F4;
  border-radius: 5px;
  padding: 5px 0;
  span {
    color: #5990F4;
  }
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

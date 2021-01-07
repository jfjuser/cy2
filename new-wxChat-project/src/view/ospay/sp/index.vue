<template>
  <div class="app">
    <div v-if="isSuccess">
      <div class="successImg"><img src="@/assets/successPay.png" alt=""></div>
      <span>支付成功</span>
    </div>
    <div v-else>
      <div class="successImg"><img src="@/assets/err.png" alt=""></div>
      <span>支付失败</span>
    </div>
  </div>
</template>
<script>
export default {
  name: '',
  data () {
    return {
      isSuccess: null
    }
  },
  created () {
    if (window.location.href.indexOf('result=ok') > -1) {
      this.isSuccess = true
    } else {
      if (window.location.href.indexOf('result=') > -1) {
        this.isSuccess = false
      } else {
        this.isSuccess = true
      }
    }
  }
}
</script>
<style>
.successImg{
  margin-top: 10%;
}
.successImg img{
  width: 64px;
  height: 64px;
}
.app{
  display:flex;
  align-items:center;
  flex-direction:column;
  justify-content:center;
}
</style>

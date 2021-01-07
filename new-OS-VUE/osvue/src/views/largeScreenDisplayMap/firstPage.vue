<template>
<div class="bgImage">
  <dv-loading style="color:	#C0C0C0" v-if="loading" >请稍等，数据加载中···</dv-loading>
  <dv-border-box-1 v-else class="bg"></dv-border-box-1>
</div>
</template>
<script>
export default {
  name: '',
  data () {
    return {
      loading: true
    }
  },
  mounted () {
    setTimeout(() => {
      this.loading = false
    }, 5000)
  }
}
</script>
<style scoped>
  .bg {
    min-width: 1024px;
    max-width: 1920px;
    min-height: 1080px;
  }
  .bgImage {
    background-image: url("../../assets/images/pageBg.png");
    background-size: cover;
    background-position: center center;
    min-width: 1024px;
    max-width: 1920px;
    min-height: 1080px;
    display:flex;
    justify-content: center;
    align-items: center;
  }
</style>

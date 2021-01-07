<template>
    <div>
        <h2 class="text-c title">404 not fount</h2>
        <div class="imgbox"><img :src="img404" alt="404"></div>
    </div>
</template>

<script>
import img404 from '@/assets/img/404.png'
export default {
  data () {
    return {
      img404
    }
  }
}
</script>

<style scoped>
.title {
    padding: 20px 0;
}
.imgbox {
    padding: 15px;
}
.imgbox img {
    width: 100%;
    position: relative;
    right: -25px;
}
</style>

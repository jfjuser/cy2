<template>
  <div class="wg-card">
    <div class="card-box" @click="onOpenCard">
      <img :src="cardIcon" alt="wg卡管理" />
      <span>WG卡</span>
    </div>
  </div>
</template>
<script>
import cardIcon from '@/assets/icon/home/icon/card.png'
export default {
  name: 'WgCard',
  data () {
    return {
      cardIcon // wg 卡图
    }
  },
  methods: {
    onOpenCard () {
      this.$router.push({ path: '/wgcard/' })
    }
  }
}
</script>
<style lang="scss" scoped>
.wg-card {
  width: 100%;
  height: 100%;
  padding: 0 0.1rem;
  .card-box {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    img {
      width: 0.5rem;
      height: 0.5rem;
      display: block;
    }
    span {
      letter-spacing: 1px;
      margin-left: 0.1rem;
    }
  }
}
</style>

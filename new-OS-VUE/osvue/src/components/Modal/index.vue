<template>
  <div  v-show="isShow" class="modal-black" @click="toggleClick"></div>
</template>
<script>
export default {
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    toggleClick: {
      type: Function,
      default: null
    }
  }
}
</script>
<style lang="scss" scoped>
// 遮罩层
  .modal-black{
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: black;
    opacity: 0.1;
    z-index: 9999999;
  }
</style>

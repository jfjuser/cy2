<template>
    <router-link :to="to" :append="append"><van-button class="add-btn"><slot></slot></van-button></router-link>
</template>

<script>
import { Button } from 'vant'
export default {
  name: 'topRightBtn',
  components: {
    [Button.name]: Button
  },
  props: {
    to: {
      type: String,
      default: ''
    },
    append: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {

    }
  }
}
</script>

<style lang="scss" scoped>
.add-btn {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 2;
  color: #1989fa;
  border: 0;
}
</style>

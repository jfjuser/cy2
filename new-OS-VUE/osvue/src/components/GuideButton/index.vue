<template>
  <div class="btn" @click.prevent.stop="guide">
    <slot></slot>
  </div>
</template>

<script>
import Driver from 'driver.js'
import 'driver.js/dist/driver.min.css'
import newMenuSteps from './newMenuSteps'

export default {
  name: 'GuideButton',
  data () {
    return {
      driver: null
    }
  },
  mounted () {
    this.driver = new Driver({
      allowClose: false,
      doneBtnText: '知道了',
      closeBtnText: '跳过',
      prevBtnText: '上一个',
      nextBtnText: '下一个'
    })
  },
  methods: {
    guide () {
      this.driver.defineSteps(newMenuSteps)
      this.driver.start()
    }
  }
}
</script>

<style lang="scss" scoped>
.btn {
    display: inline-block;
}
</style>

<template>
  <div class="btn" @click.prevent.stop="guide">
    <slot></slot>
  </div>
</template>

<script>
import Driver from 'driver.js'
import 'driver.js/dist/driver.min.css'
// import newMenuSteps from './newMenuSteps'
import {
  checkSteps,
  steps,
  steps1,
  steps2,
  steps3,
  steps4,
  steps5,
  steps6,
  steps7
} from './route'
export default {
  name: 'GuideButton',
  data () {
    return {
      driver: null,
      checkSteps: checkSteps,
      steps: steps,
      steps1: steps1,
      steps2: steps2,
      steps3: steps3,
      steps4: steps4,
      steps5: steps5,
      steps6: steps6,
      steps7: steps7
    }
  },
  mounted () {
    // console.log(this.checkSteps(this.$route.path))
    this.driver = new Driver({
      allowClose: false,
      doneBtnText: '知道了',
      closeBtnText: '跳过',
      prevBtnText: '上一个',
      nextBtnText: '下一个',
      onNext: (Element) => {
        console.log(Element.options.popover)
      },
      onPrevious: (Element) => {
        console.log(Element.options.popover)
      }
    })
  },
  methods: {
    guide () {
      if (this.checkSteps(this.$route.path)) {
        this.create(this.checkSteps(this.$route.path))
        this.driver.start()
      }
      this.$emit('isChange', this.checkSteps(this.$route.path))
    },
    create (step) {
      switch (step) {
        case 1010:
          this.driver.defineSteps(this.steps)
          break
        case 1:
          this.driver.defineSteps(this.steps1)
          break
        case 2:
          this.driver.defineSteps(this.steps2)
          break
        case 3:
          this.driver.defineSteps(this.steps3)
          break
        case 4:
          this.driver.defineSteps(this.steps4)
          break
        case 5:
          this.driver.defineSteps(this.steps5)
          break
        case 6:
          this.driver.defineSteps(this.steps6)
          break
        case 7:
          this.driver.defineSteps(this.steps7)
          break
        default:
          break
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.btn {
    display: inline-block;
}
</style>

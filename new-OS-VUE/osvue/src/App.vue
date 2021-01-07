<template>
  <div id="app">
    <router-view  />
  </div>
</template>

<script>
import steps from '@/utils/step.js'
import intro from '@/utils/intro.js'
export default {
  name: 'App',
  data () {
    return {
      driver: null,
      steps: steps,
      intro: intro
    }
  },
  created () {
    console.log(process.env.NODE_ENV, '环境')
  },
  mounted () {
  },
  updated () {
    // this.setDriver()
  },
  methods: {
    setDriver () {
      let step = []
      this.steps.forEach((item, index) => {
        console.log(item.popover.path, this.$route.path)
        if (item.popover.path === this.$route.path) {
          step.push(item)
        }
      })
      console.log(step)
      this.$nextTick(() => {
        if (step.length > 0) {
          setTimeout(() => {
            console.log(step)
            this.intro.defineSteps(step)
            this.intro.start()
          }, 500)
        }
      })
    }
  }
}
</script>

<style lang='scss'>
$background : #cccccc;
html,body,#app{
   min-width: 987px;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>

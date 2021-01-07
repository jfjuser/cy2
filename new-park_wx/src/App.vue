<template>
  <div id="app">
    <router-view style="min-height: 100%;background-color: #f6f6f6;"/>
  </div>
</template>

<script>
// import VConsole from 'vconsole/dist/vconsole.min.js'
export default {
  name: 'App',
  data () {
    return {

    }
  },
  computed: {
    sysName () {
      return this.$store.getters.sysName
    }
  },
  created () {
    console.log(process.env.NODE_ENV, '环境')
    if (this.sysName) {
      document.title = this.sysName
    } else {
      document.title = '物联云平台'
    }
    /* eslint-disable-next-line */
    // let vConsole = new VConsole()
  }
}
</script>

<style>
#app {
  height: 100%;
}
.bgc {
  background-color: #fff;
}
.bgc-grey{
  background-color: #f6f6f6;
}
.fc-grey{
  color: #909399;
}
.fc-red {
  color: red;
}
.text-c {
  text-align: center;
}
.text-r {
  text-align: right;
}
.padding-10 {
  padding: 10px;
}
.mar-b-15 {
  margin-bottom: 15px;
}
.flex-jc-around {
  display: flex;
  justify-content: space-around;
}
</style>

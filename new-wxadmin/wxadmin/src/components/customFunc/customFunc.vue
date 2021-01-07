<template>
  <div>
    <NavBar
      title="应用编辑"
      left-text="返回"
      left-arrow
      @click-left="onClickLeft"
    />
    <span>我的应用</span>
    <div></div>
  </div>  
</template>
<script>
import { NavBar } from 'vant'
export default {
  name: 'customFunc',
  data () {
    return {

    }
  },
  methods: {
    onClickLeft () {
      this.$router.go(-1)
    }
  },
  components: {

  }
}
</script>
<style lang="scss" scoped>

</style>

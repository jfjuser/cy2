<template>
  <div>
    <el-button type="text"   style="color:#909399;font-size: 16px;" @click="clickScreen">
      <i  class=" fa fa-arrows-alt"></i>
    </el-button>
  </div>
</template>
<script>
import screenfull from 'screenfull'
export default {
  name: 'screenfull',
  data () {
    return {
      isFullscreen: false
    }
  },
  methods: {
    clickScreen () {
      // console.log(screenfull)
      // 判断是否支持全屏
      if (!screenfull.enabled) {
        this.$message({
          message: '您的浏览器暂不支持全屏',
          type: 'warning'
        })
        return false
      }
      screenfull.toggle()
    }
  }
}
</script>
<style lang="scss" scoped>
.screenfull {
  display: inline-block;
  cursor: pointer;
  fill: #5a5e66;;
  vertical-align: 10px;
}
</style>

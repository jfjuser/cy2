<template>
  <div style=" position:relative;">
    <img style="width:300px;height:540px;" :src="picSrc" alt="图片">
    <canvas v-show="picSrc" ref="canvas" id="canvas" style="position:absolute;left:0;"
      @mousedown="clickPoint($event)" @mousemove="dragCircle($event)" @mouseup="stopDragging($event)">
      您的浏览器不支持canvas，请更换浏览器！
    </canvas>
    <div>
      <el-button  type="primary">保存</el-button>
    </div>
  </div>
</template>
<script>
export default {
  name: 'coil-debugger',
  props: {
    picSrc: {
      required: true,
      type: String
    },
    id: {
      required: true,
      type: Number
    }
  },
  watch: {
    id () {
      this.init()
    }
  },
  mounted () {
    this.init()
  },
  data () {
    return {
      rect: {
        x: 10,
        y: 10,
        width: 280,
        height: 520
      },
      isDragging: false
    }
  },
  methods: {
    init () {
      let canvas = this.$refs.canvas
      canvas.width = 300
      canvas.height = 540
      let ctx = canvas.getContext('2d')
      ctx.strokeStyle = 'green'
      ctx.rect(this.rect.x, this.rect.y, this.rect.width, this.rect.height)
      ctx.stroke()
    },
    clickPoint (ev) {
      // console.log(ev)
      // console.log(ev.offsetX, ev.offsetY)
      let event = window.event || ev
      if (event.length > 0) event = event[0]
      const clickX = event.offsetX
      const clickY = event.offsetY
      if ((clickX < this.rect.x) || (clickY < this.rect.y) || (clickX > this.rect.x + this.rect.width) || (clickY > this.rect.y + this.rect.height)) {
        document.getElementById('canvas').style.cursor = 'auto'
        this.$message.error('请选择坐标点或者边线进行拖动')
        // 如果点击点在中间
      } else if ((clickX > this.rect.x) && (clickX < this.rect.x + this.rect.width) && (clickY > this.rect.y) && (clickY < this.rect.y + this.rect.height)) {
        // console.log('点击点在中间')
        document.getElementById('canvas').style.cursor = 'move'
        // 判断是否在边上
      } else if (clickX === this.rect.x || clickX === this.rect.x + this.rect.width) {
        document.getElementById('canvas').style.cursor = 'e-resize'
      } else if (clickY === this.rect.y || clickY === this.rect.y + this.rect.height) {
        document.getElementById('canvas').style.cursor = 'n-resize'
      }
    },
    dragCircle (ev) {
      // console.log(ev)
      let event = window.event || ev
      if (event.length > 0) event = event[0]
      const clickX = event.offsetX
      const clickY = event.offsetY
      if ((clickX < this.rect.x) || (clickY < this.rect.y) || (clickX > this.rect.x + this.rect.width) || (clickY > this.rect.y + this.rect.height)) {
        document.getElementById('canvas').style.cursor = 'auto'
        // 如果点击点在中间
      } else if ((clickX > this.rect.x) && (clickX < this.rect.x + this.rect.width) && (clickY > this.rect.y) && (clickY < this.rect.y + this.rect.height)) {
        // console.log('点击点在中间')
        document.getElementById('canvas').style.cursor = 'move'
        // 判断是否在边上
      } else if (clickX === this.rect.x || clickX === this.rect.x + this.rect.width) {
        document.getElementById('canvas').style.cursor = 'e-resize'
      } else if (clickY === this.rect.y || clickY === this.rect.y + this.rect.height) {
        document.getElementById('canvas').style.cursor = 'n-resize'
      }
    },
    stopDragging (ev) {
      // console.log(ev.offsetX, ev.offsetY)
      // console.log('停止拖动')
    }
  }
}
</script>
<style lang='scss' scoped>
</style>

<template>
  <div>
    <div  style="height:400px;background-size:100% 100%;display: flex;justify-content: center;align-items: center;" :style= "{backgroundImage: 'url(' + picUrl + ')'}">
      <canvas  id="line" @mousedown="clickPoint($event)" @mousemove="dragCircle($event)" @mouseup="stopDragging()"></canvas>
    </div>
    <p style="color:red">备注: 红色线圈表示触发区域，绿色线圈表示识别区域</p>
    <div slot="footer" class="dialog-footer">
      <el-button :loading="updateLoopLoading" type="primary" @click="updateLoopData">保存</el-button>
    </div>
  </div>
</template>
<script>
import { httpGet, httpPost } from '@/utils/restful'
import { getSnapshotById, getRacoById, getVirloopById, setRaco, setVirloop } from '@/api/url'
export default {
  name: 'QYCamera',
  props: {
    cameraId: {
      required: true,
      type: Number
    }
  },
  watch: {
    cameraId () {
      this.getVirloop(this.cameraId)
    }
  },
  data () {
    return {
      points: {
        rect1: [
          { x: 0, y: 0, isSelected: false },
          { x: 0, y: 0, isSelected: false },
          { x: 0, y: 0, isSelected: false },
          { x: 0, y: 0, isSelected: false }
        ],
        rect2: [
          { x: 0, y: 0, isSelected: false },
          { x: 0, y: 0, isSelected: false },
          { x: 0, y: 0, isSelected: false },
          { x: 0, y: 0, isSelected: false }
        ]
      },
      updateLoopLoading: false,
      fullLoading: undefined,
      isDragging: false,
      selectObject: {},
      picUrl: ''
    }
  },
  mounted () {
    this.getVirloop(this.cameraId)
  },
  methods: {
    // 加载虚拟线圈
    getVirloop (id) {
      this.fullLoading = this.$loading({
        lock: true,
        text: '加载中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      httpGet(getVirloopById + id).then(res => {
        let data = []
        for (let i = 0; i < res.data.length; i++) {
          const element = res.data[i]
          data.push({
            x: 760 * element.x / 1920,
            y: 400 * element.y / 1080
          })
        }
        this.points.rect1 = data
        this.getRaco(id)
      }).catch(() => {
        setTimeout(() => {
          this.$emit('closeLoopVisible')
        }, 2000)
        this.fullLoading.close()
      })
    },
    // 获取真实线圈
    getRaco (id) {
      httpGet(getRacoById + id).then(res => {
        let data = []
        for (let i = 0; i < res.data.length; i++) {
          const element = res.data[i]
          data.push({
            x: 760 * element.x / 1920,
            y: 400 * element.y / 1080
          })
        }
        this.points.rect2 = data
        this.getPic(id)
      }).catch(() => {
        setTimeout(() => {
          this.$emit('closeLoopVisible')
        }, 2000)
        this.fullLoading.close()
      })
    },
    // 获取图片
    getPic (id) {
      httpGet(getSnapshotById + id).then(res => {
        this.picUrl = 'data:image/jpeg;base64,' + res.data
        this.$nextTick(() => {
          this.canvas = document.getElementById('line')
          this.context = this.canvas.getContext('2d')
          this.canvas.width = 760
          this.canvas.height = 400
          this.drawRects()
        })
        this.fullLoading.close()
      }).catch(() => {
        setTimeout(() => {
          this.$emit('closeLoopVisible')
        }, 2000)
        this.fullLoading.close()
      })
    },
    // 开始画图
    drawRects () {
      this.context.clearRect(0, 0, 760, 400)
      this.drawRect(this.points.rect1)
      this.drawRect(this.points.rect2)
    },
    // 画四边形
    drawRect (array) {
      this.context.lineJoin = 'round'
      this.context.beginPath()
      for (let i = 0; i < array.length; i++) {
        const element = array[i]
        if (i === 0) {
          this.context.moveTo(element.x, element.y)
        } else {
          this.context.lineTo(element.x, element.y)
        }
      }
      this.context.lineWidth = 2
      // 判断是哪一个四边形
      if (array === this.points.rect1) {
        this.context.strokeStyle = 'red'
      } else {
        this.context.strokeStyle = 'green'
      }
      this.context.closePath()
      this.context.stroke()
    },
    // 获取点击点
    clickPoint (ev) {
      let event = window.event || ev
      if (event.length > 0) event = event[0]
      // 判断屏幕,减去屏幕的偏移量
      let clientX = event.offsetX
      let clientY = event.offsetY
      this.circle(this.points.rect1, clientX, clientY)
      this.circle(this.points.rect2, clientX, clientY)
    },
    // 遍历在某一个点上
    circle (Array, clientX, clientY) {
      for (let i = 0; i < Array.length; i++) {
        const ele = Array[i]
        let line = Math.abs(Math.sqrt(Math.pow((ele.x - clientX), 2) + Math.pow((ele.y - clientY), 2)))
        // 判断点击的位置在哪一个圆里面
        if (line - 25 < 0) {
          ele.isSelected = true
          this.isDragging = true
          this.selectObject = Array[i]
        } else {
          ele.isSelected = false
        }
      }
    },
    // 屏幕可视区域window.screen.availWidth window.screen.availHeight
    // 移动
    dragCircle (ev) {
      if (this.isDragging) {
        let event = window.event || ev
        if (event.length > 0) event = event[0]
        let clientX = event.offsetX
        let clientY = event.offsetY
        this.selectObject.x = clientX
        this.selectObject.y = clientY
        this.drawRects()
      } else {
        return false
      }
    },
    // 停止拖动
    stopDragging () {
      this.isDragging = false
    },
    // 遍历屏幕转图像
    loopPoint (realSet, array) {
      for (let i = 0; i < array.length; i++) {
        const element = array[i]
        realSet.push({
          x: parseInt(element.x * 1920 / 760),
          y: parseInt(element.y * 1080 / 400)
        })
      }
    },
    // 保存触发区线圈
    updateLoopData () {
      this.$confirm('是否已经更新完线圈并提交？', '提示', {})
        .then(() => {
          let setRect1 = []
          this.loopPoint(setRect1, this.points.rect1)
          let params = Object.assign({
            x1: setRect1[0].x,
            x2: setRect1[1].x,
            x3: setRect1[2].x,
            x4: setRect1[3].x,
            y1: setRect1[0].y,
            y2: setRect1[1].y,
            y3: setRect1[2].y,
            y4: setRect1[3].y
          }, {camaraId: this.cameraId})
          // 保存真实线圈
          httpPost(setRaco, params).then(res => {
            this.setVir()
          }).catch(() => {})
        }).catch(() => {})
    },
    // 保存识别区域线圈
    setVir () {
      let setRect2 = []
      this.loopPoint(setRect2, this.points.rect2)
      let params = Object.assign({
        x1: setRect2[0].x,
        x2: setRect2[1].x,
        y1: setRect2[0].y,
        y2: setRect2[1].y
      }, {camaraId: this.cameraId})
      httpPost(setVirloop, params).then(res => {
        this.updateLoopLoading = false
        this.$emit('closeLoopVisible')
        this.$message({
          type: 'success',
          message: '线圈保存成功',
          duration: 4 * 1000
        })
      }).catch(() => {})
    }
  }
}
</script>

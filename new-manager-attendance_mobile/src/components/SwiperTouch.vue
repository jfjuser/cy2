<template>
  <div class="swiper-touch">
  </div>
</template>
<script>
export default {
  name: 'SwiperTouch',
  data () {
    return {
      defaultRoute: ['/home/', '/me/', '/'], // 基础路由数据
      clientWidth: '', // 设备浏览器总宽度
      Ostart: '', // 监听启动时的大小
      clientX: '', // 需要操作的dom
      swipeleftX: '', // 需要滑动的大小
      timeout: 500, // 超时时间
      setTimer: null, // 定时器
      isOpens: true, // 启动开启
      isFlagFulfill: false, // 滑动成功标识
      flag: true, // 启动定时器标识
      p: 4, // 百分比
      isBackShow: false,
      touchType: null // 记录滑动的方向
    }
  },
  mounted () {
    this.clientWidth = window.document.body.clientWidth // 获取浏览器最大宽度
    this.swipeleftX = this.clientWidth / this.p// 设置滑动大小
    this.clientX = document.querySelector('body')// 获取需要操作的dom
    this.clientX.addEventListener('touchstart', this.handlerTouchStart, false)

    console.log('执行手指滑动。。。')
  },
  methods: {
    /** ********  【 触发了返回函数 】  **********/
    openBackTouch () {
      // console.log('用户点了我N次！ 我待用户如初恋...')
      this.$router.go(this.touchType)
      // console.log('开始滑动，方向是：', this.touchType)
    },
    // 监听手指按下事件
    handlerTouchStart (event) {
      this.Ostart = event.touches[0].clientX// 获取开始时的位置数据
      this.isOpens = true // 是否启动监听
      this.flag = true

      clearTimeout(this.setTimer)// 首次触发清楚定时器
      this.clientX.addEventListener('touchmove', this.handlerTouchMove, false)// 监听手指滑动事件
    },
    // 监听手指滑动事件
    handlerTouchMove (event) {
      if (this.isOpens) {
        if ((event.touches[0].clientX - this.Ostart) > 0) { // 判断是否是向左滑动
          if (this.flag) { this.setTimeout() } // 开始执行定时器
          if (Math.abs(event.touches[0].clientX - this.Ostart) > this.swipeleftX) { // 检测是否大于配置的参数
            // console.log('到站了。。。')
            this.isFlagFulfill = true // 滑动成功
            this.touchType = -1
          }
        } else if ((event.touches[0].clientX - this.Ostart) < 0) { // 判断是否是向右滑动
          if (this.flag) { this.setTimeout() } // 开始执行定时器
          if (Math.abs(event.touches[0].clientX - this.Ostart) > this.swipeleftX) { // 检测是否大于配置的参数
            // console.log('到站了。。。')
            this.isFlagFulfill = true // 滑动成功
            this.touchType = 1
          }
        }
      }
      this.clientX.addEventListener('touchend', this.handlerTouchEnd, false) // 开始监听事件结束
    },
    // 开始监听事件结束
    handlerTouchEnd (event) {
      if (this.isFlagFulfill) {
        // console.log('开启更新。。。')
        this.isFlagFulfill = false
        clearTimeout(this.setTimer)
        this.openBackTouch() // 启动返回函数
      }
    },
    // 超时函数
    setTimeout () {
      this.flag = false
      this.setTimer = setTimeout(() => {
        // 清楚事件
        this.clientX.removeEventListener('touchmove', this.handlerTouchMove, false)
        this.clientX.removeEventListener('touchend', this.handlerTouchEnd, false)
        this.isOpens = false
        this.isFlagFulfill = false
        console.log('超时...')
      }, this.timeout)
    }
  }
}
</script>
<style lang="scss" scoped>
.back-nav-bar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.back-swipeleft {
  width: 100%;
  height: 100%;
  position: relative;
  z-index: 11111111111;
  .swipe {
    height: 100%;
    opacity: 0;
  }
}
.back-button {
  position: fixed;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  padding: 0.2rem 0;
  padding-right: 0.2rem;
  border: 1px solid rgb(1, 250, 229);
  border-radius: 0 50px 50px 0;
  border-left: 0;
  background: rgb(102, 102, 102);
  opacity: 0.5;
  z-index: 9999;
}
</style>

<template>
  <div class="SwipeLeft">
    <van-icon
      name="arrow-left"
      v-show="isBackShow"
      @click="openBackLeft"
      class="back-button"
      color="white"
    />
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'SwipeLeft',
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
      isBackShow: false
    }
  },
  mounted () {
    this.clientWidth = window.document.body.clientWidth // 获取浏览器最大宽度
    this.swipeleftX = this.clientWidth / this.p// 设置滑动大小
    this.clientX = document.querySelector('body')// 获取需要操作的dom
    this.clientX.addEventListener('touchstart', this.handlerTouchStart, false)

    // console.log(clientX)
  },
  computed: {
    ...mapGetters('app', ['navTitle', 'backRouterData']),
    setRouterNav: {
      get () {
        return this.$store.getters['app/backRouterData']
      },
      set (route) {
        // console.log('yes...', route)
        this.SaveRouterData(route)
      }
    }
  },
  methods: {
    ...mapActions('app', ['SaveRouterData']),
    /** ********  【 触发了返回函数 】  **********/
    openBackLeft () {
      // console.log('用户点了我N次！ 我待用户如初恋...', this.setRouterNav)
      if (!this.defaultRoute.includes(this.$route.path)) {
        let len = this.setRouterNav.length
        if (len >= 1) {
          this.$router.push(this.setRouterNav[len - 1])
        } else {
          this.$router.push('/')
        }
      }
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
        this.openBackLeft() // 启动返回函数
      }
    },
    // 超时函数
    setTimeout () {
      this.flag = false
      this.setTimer = setTimeout(() => {
        this.isOpens = false
        // console.log('超时...')
        // 清楚事件
        this.clientX.removeEventListener('touchmove', this.handlerTouchMove, false)
        this.clientX.removeEventListener('touchend', this.handlerTouchEnd, false)
      }, this.timeout)
    }
  },
  watch: {
    /** ********  【 路由监听， 自定义返回功能 】  **********/
    '$route.path': {
      handler (newVal, oldVal) {
        // console.log(newVal, oldVal)
        if (this.defaultRoute.includes(newVal)) {
          // 判断是否是基础路由， 是则情况数组
          // console.log('是首页。。。')
          this.setRouterNav = []
          this.isBackShow = false // 取消按钮
        } else {
          this.isBackShow = true // 显示按钮
        }
        // 检测 新旧路由是否是基础路由
        if (
          !this.defaultRoute.includes(newVal) &&
          !this.defaultRoute.includes(oldVal)
        ) {
          let mergeData = [...new Set(this.setRouterNav)] // 使用Es6 Set() 语法 保证当前数据是为一性的
          if (mergeData.indexOf(oldVal) === -1) {
            // 检测当前数据是否存在 旧路由
            let len = mergeData.length // 获取当前数据 length
            if (len >= 1) {
              // 检测当前是否含有数据
              if (newVal === mergeData[len - 1]) {
                // 检测新路由是否===数据流里的最后以为
                mergeData.splice(len - 1, 1) // 是最后以为旧截取删除
              } else {
                // 新路由不等于数据流里最后一项，直接push、
                // console.log('没有...')
                mergeData.push(oldVal)
                mergeData = [...new Set(mergeData)] // 为了保证最后数据流是单一， 使用 Set
              }
            } else {
              // 当前数据流为空直接push
              mergeData.push(oldVal)
              mergeData = [...new Set(mergeData)]
            }
          }
          this.setRouterNav = mergeData // 存储最后数据
        }
        // console.log('不是基础路由： ', this.setRouterNav)
      },
      deep: true,
      immediate: true
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

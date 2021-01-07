<template>
    <transition name="van-fade">
      <div class="backtop" @click="toTop" v-show="showBackTop">
          <i class="fa fa-caret-up"></i>
      </div>
    </transition>
</template>

<script>
export default {
  name: 'backtop',
  data () {
    return {
      showBackTop: false
    }
  },
  mounted () {
    this.$nextTick(() => {
      window.addEventListener('scroll', this.scrollToTop, true)
    })
  },
  methods: {
    toTop () {
      document.body.scrollTop = 0
    },
    scrollToTop () {
      let scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop
      let browserHeight = window.outerHeight
      if (scrollTop > browserHeight) {
        this.showBackTop = true
      } else {
        this.showBackTop = false
      }
    }
  },
  destroyed () {
    window.removeEventListener('scroll', this.scrollToTop)
  }
}
</script>

<style lang="scss" scoped>
.backtop {
    position: fixed;
    right: 15px;
    bottom: 40px;
    background-color: #fff;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    color: #409eff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    box-shadow: 0 0 6px rgba(0,0,0,.12);
    cursor: pointer;
    z-index: 2;
}
</style>

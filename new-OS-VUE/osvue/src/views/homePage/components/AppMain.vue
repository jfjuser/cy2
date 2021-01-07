<template>
  <section class="app-main">
    <!-- 广告 -->
    <img style="width: 100%; height: 50px;" v-if="flag === 2" :src="src" alt="广告图片">
    <div class="adv" v-if="flag === 1">
      <div class="adv-inner">
        <span class="first" v-text="text"></span>
        <span class="second" v-text="text"></span>
      </div>
    </div>
    <transition name="fade" mode="out-in">
      <router-view></router-view>
    </transition>
  </section>
</template>

<script>
import { httpGet } from '@/utils/restful'
import { getAdv } from '@/api/url'
export default {
  name: 'AppMain',
  data () {
    return {
      flag: 0,
      src: '',
      text: ''
    }
  },
  mounted () {
    // this.getAdv()
  },
  methods: {
    getAdv () {
      const form = {
        type: 2,
        departmentId: this.$store.getters.departmentId
      }
      httpGet(getAdv, form)
        .then(res => {
          // 显示文字
          if (res.data[0].contentType === 2) {
            this.text = res.data[0].text
            this.flag = 1
          } else if (res.data[0].contentType === 1 || res.data[0].type === 1) {
            // 显示图片
            this.flag = 2
            this.src = 'data:image/jpg;base64,' + res.data[0].img
          }
        }).catch(() => {})
    }
  }
}
</script>
<style lang="scss" scoped>
.adv{
  overflow: hidden;
  width: 100%;
  .adv-inner{
    background: white;
    height: 50px;
    font-size: 16px;
    color: red;
    letter-spacing: 4px;
    line-height: 50px;
    margin: 0 auto;
    white-space: nowrap;
    position: relative;
    span {
      position: absolute;
      top: 0;
      left: 100%;
      height: 100%;
    }
    .first{
      -webkit-animation: 50s first-marquee linear infinite normal;
      animation: 50s first-marquee linear infinite normal;
      padding-right: 80%;
    }
    @keyframes first-marquee {
      0% {
        -webkit-transform: translate3d(0, 0, 0);
        transform: translate3d(0, 0, 0);
      }
      /* 向左移动 */
      100% {
        -webkit-transform: translate3d(-200%, 0, 0);
        transform: translate3d(-200%, 0, 0);
        display: none;
      }
    }
    .second {
      -webkit-animation: 50s second-marquee linear 20s infinite normal;
      animation: 50s second-marquee linear  20s infinite normal;
      padding-right: 80%;
    }
    @keyframes second-marquee {
      0% {
        -webkit-transform: translate3d(0%, 0, 0);
        transform: translate3d(0%, 0, 0);
      }
      100% {
        -webkit-transform: translate3d(-200%, 0, 0);
        transform: translate3d(-200%, 0, 0);
        display: none;
      }
    }
  }
}
</style>

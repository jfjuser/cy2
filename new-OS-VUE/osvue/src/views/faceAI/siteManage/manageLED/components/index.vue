<template>
  <div class="box-main" :style="screenSize">
    <div style="color:red;position:relative;overflow:hidden;margin:0;padding:0" v-for="(item, index) in data" :key="index">
      <div class="spanDiv" :style="{width: item.ledWidth * 300 / y + 'px', fontSize: item.fontSize * 250 / y + 'px', left: item.ledXSize * 300 / y + 'px', top: item.ledYSize * 300 / y + 'px', height: item.ledHeight * 300 / y + 'px'}"
      >
      <div :style="moveTop" :class="item.moveType === '3' ? 'left-scroll' : (item.moveType === '37' ? 'right-scroll' : (item.moveType === '39'? 'bottom-scroll' : (item.moveType === '5' ?'top-scroll' : '')))">
        <span v-show="item.showContent !== ''" v-for="(its, index) in item.showContent" :key=index>
          {{showTypeParams(its)}}</span>{{item.showText}}
        </div>
        </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.box-main {
  background-image: url('./../../../../../assets/face/site/ledScreen.png');
  margin: 0 auto;
  overflow: hidden;
  width: var(--width-screen);
  height: var(--height-screen);
}
.spanDiv{
  position: relative;
  overflow: hidden;
  // overflow: scroll
  height: auto;
}
.left-scroll{
  position:relative;
  animation:mymove var(--showSpeed) infinite;
  -webkit-animation:mymove var(--showSpeed) infinite; /*Safari and Chrome*/
}
.right-scroll{
  position:relative;
  animation:mymove1 var(--showSpeed) infinite;
  -webkit-animation:mymove1 var(--showSpeed) infinite; /*Safari and Chrome*/
}
.bottom-scroll{
  position:relative;
  animation:moveBottom var(--showSpeed) infinite;
  -webkit-animation:moveBottom var(--showSpeed) infinite; /*Safari and Chrome*/
}
.top-scroll{
  position:relative;
  animation:moveTop var(--showSpeed) infinite;
  -webkit-animation:moveTop var(--showSpeed) infinite;
}
 @keyframes moveTop {
  from {top:var(--height)}
  to {top:0}
}
@-webkit-keyframes moveBottom {
  from {top:0}
  to {top:var(--height)}
}
@keyframes mymove1
{
  from {left:0;}
  // 25% {left:75%;}
  // 50% {left:50%;}
  // 75% {left:25%;}
  to {left:100%;}
}
@keyframes mymove
{
  from {left:100%;}
  // 25% {left:75%;}
  // 50% {left:50%;}
  // 75% {left:25%;}
  to {left:0;}
}

// @-webkit-keyframes mymove /*Safari and Chrome*/
// {
// from {left:100%;}
// to {left:0px;}
// }
</style>
<script>
import { showTypeParams } from '@/utils/formatter'
export default {
  name: 'LEDScreen',
  props: {
    data: Array,
    x: Number,
    y: Number
  },
  // created () {
  //   this.moveTop = {
  //     '--height': this.y + 'px',
  //     '--showSpeed': this.data[0].showSpeed + 's'
  //   }
  //   console.log(this.moveTop['--showSpeed'])
  // },
  computed: {
    moveTop () {
      return {
        '--height': this.y + 'px',
        '--showSpeed': this.data[0].showSpeed + 's'
      }
    },
    screenSize () {
      return {
        '--height-screen': this.y <= 300 ? 300 + 'px' : this.y + 'px',
        '--width-screen': this.y <= 300 ? this.x * 300 / this.y + 'px' : this.x + 'px'
      }
    }
  },
  data () {
    return {
      list: [],
      heig: undefined,
      widt: undefined,
      showTypeParams: showTypeParams
    }
  },
  watch: {
    y (curHeight, oldHeight) {
      if (curHeight < 300) {
        this.heig = 300
      } else {
        this.heig = curHeight
      }
      return this.heig
    },
    x (curWidth, oldWidth) {
      if (this.heig > 300) {
        this.widt = curWidth
      } else {
        this.widt = curWidth * 2
      }
      return this.widt
    },
    data (curVal, oldVal) {
      this.list = curVal
      console.log(this.list)
    }
  }
}
</script>

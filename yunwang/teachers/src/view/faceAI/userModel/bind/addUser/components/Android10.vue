<!--
 * @Author: your name
 * @Date: 2020-05-21 00:54:46
 * @LastEditTime: 2020-05-21 11:24:19
 * @LastEditors: sueRimn
 * @Description: In User Settings Edit https://www.jianshu.com/p/f46195810c3b
 * @FilePath: \weChat-project\src\view\faceAI\userModel\bind\addUser\components\Android10.vue
 -->
 <template>
  <div class="camera-content">
    <!-- v-show="isOpenVideo" -->
    <div class="vide-box" v-show="isOpenVideo">
      <!--video用于显示媒体设备的视频流，自动播放-->
      <span id="user-permission">确定</span>
      <div class="video-wrap">
        <!-- <video id="video" autoplay ref="video"></video> -->
        <video id="video" ref="video" autoplay  x5-video-player-type="h5" x5-video-player-fullscreen="true" x5-video-orientation="landscape" ></video>
      </div>
      <div class="footers">
        <div class="box">
          <!-- 关闭 video -->
          <span class="close" @click.stop="userClose">取消</span>
          <!--拍照按钮-->
          <button id="capture" ref="capture" @click.stop="mediaVideo"></button>
          <!-- 前置 或者 后置 摄像头 -->
          <span class="transform" ref="transform" @click.stop="front = !front"></span>
        </div>
      </div>
      <!--描绘video截图-->
      <canvas id="canvas" ref="canvas" width="480" height="320"></canvas>
    </div>
  <!-- getUserPermission 打开照相机 -->
    <!-- <button id="open-video" @click.stop="getUserPermission"></button>  -->
  </div>
</template>

<script>
const reg = /Android ?(6|8|10)/gim
export default {
  props: {
    isOpenVideo: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      isAndroid10: false,
      // isOpenVideo: false,
      constrains: {},
      front: false,
      video: '',
      canvas: false,
      context: null,
      captures: null
    }
  },
  mounted () {
    let { canvas, captures, video } = this.$refs
    var context = canvas.getContext('2d')
    this.video = video
    this.canvas = canvas
    this.context = context
    this.captures = captures
    let Cwidth = document.body.clientWidth
    let Cheight = document.body.clientHeight
    console.log('当前设备 宽高: ', Cwidth, Cheight)
    /** ********  【 配置canvas宽高 】  **********/
    this.canvas.width = Cwidth
    this.canvas.height = Cheight
    /** ********  【 设置 canvas 绘制图片大小 】  **********/
    // video:{ 'facingMode': "user" }//调用前置摄像头
    // video: { facingMode: { exact: "environment" } }//后置
    this.constrains = {
      video: {
        width: Cwidth,
        height: Cheight,
        facingMode: 'user'
      }
    }
    if (navigator.userAgent.match(reg)) {
      // file.setAttribute('capture', 'camera')
      // console.log('当前是在 安卓端....', file.getAttribute('capture'))
      console.log('在安卓端调用用户权限...', navigator.userAgent.match(/Android ?(6|8|10)/gim))
      // 在安卓端调用用户权限....
      // this.getUserPermission()
    }
  },
  methods: {
    userClose () {
      this.$emit('userClose')
    },
    // 获取用户权限
    getUserPermission () {
      var _this = this
      _this.isOpenVideo = true

      // 老的浏览器可能根本没有实现 mediaDevices，所以我们可以先设置一个空的对象
      if (navigator.mediaDevices === undefined) {
        navigator.mediaDevices = {}
      }

      // 一些浏览器部分支持 mediaDevices。我们不能直接给对象设置 getUserMedia
      // 因为这样可能会覆盖已有的属性。这里我们只会在没有getUserMedia属性的时候添加它。
      if (navigator.mediaDevices.getUserMedia === undefined) {
        navigator.mediaDevices.getUserMedia = function (constraints) {
          // 首先，如果有getUserMedia的话，就获得它
          var getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia

          // 一些浏览器根本没实现它 - 那么就返回一个error到promise的reject来保持一个统一的接口
          if (!getUserMedia) {
            return Promise.reject(new Error('getUserMedia is not implemented in this browser'))
          }

          // 否则，为老的navigator.getUserMedia方法包裹一个Promise
          return new Promise(function (resolve, reject) {
            getUserMedia.call(navigator, constraints, resolve, reject)
          })
        }
      }

      _this.getNavigators(navigator)
    },
    // 访问用户媒体设备的兼容方法
    getNavigators (navigator) {
      var _this = this

      navigator.mediaDevices.getUserMedia(_this.constrains)
        .then(function (stream) {
          // var video = document.querySelector('#video')
          _this.isOpenVideo = true
          // 旧的浏览器可能没有srcObject
          if ('srcObject' in _this.video) {
            // _this.elementVideo.srcObject = stream
            _this.video.srcObject = stream
          } else {
            // 兼容webkit内核浏览器
            var CompatibleURL = window.URL || window.webkitURL
            // 防止在新的浏览器里使用它，应为它已经不再支持了
            // _this.video.src = window.URL.createObjectURL(stream)
            // 将视频流设置为video元素的源
            _this.video.src = CompatibleURL.createObjectURL(stream)
          }
          _this.video.onloadedmetadata = function (e) {
            // 播放视频
            _this.video.play()
          }
        })
        .catch(function (err) {
          console.log(err.name + ': ' + err.message, '当前请求设备没有找到...')
          // _this.isOpenVideo = false
        })
    },
    // 截取video 图像 == > 绘制画面
    async mediaVideo () {
      if (!this.video.paused) { // 未暂停则暂停
        this.video.pause()
        let canvasImg = this.context.drawImage(this.video, 0, 0, 480, 320) //  暂停后 绘制 canvas
        console.log('canvas绘制出来的 图片: ', canvasImg)
        this.$emit('mediaVideo', canvasImg)
      } else { // 已 暂停则 播放
        this.video.play()
      }
    },
    test () {
      let videoUrl = 'https://vdept.bdstatic.com/7652555a4b4b7531736550594573526c/353254396862664a/44770ae9e8ad1956c31680da80f6151a3eee546f8ab0df2b7f26f483e29ea0ab00131609ed54ae8798c11ac05d418080.mp4?auth_key=1590119902-0-0-2f6a1c3bfbdd8650f1c04d50bdcb334e'
      this.video.src = videoUrl
    }
  },
  watch: {
    // 是否打开照相机
    isOpenVideo (state) {
      if (state) {
        // this.getUserPermission()
        this.test()
      }
    },
    front (state) {
      if (state) { // 前置
        console.log('前置摄像头。。。')
        this.constrains.video.facingMode = 'user'
      } else { // 后置
        console.log('后置摄像头。。。')
        this.constrains.video.facingMode = { exact: 'environment' }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
 .vide-box{
  position: fixed;
  top: 0;
  left: 0;
  z-index: 111;
  width: 100%;
  height: 100%;
  color: #fff;
  background: #000;
  transition: 0.35s all;
  overflow: hidden;
  .footers{
     position: fixed;
     width: 100%;
     height: 80px;
     bottom: 0;
     left: 0;
     background: #333;
     z-index: 11119;
     color: #ccc;
     .box{
       width: 100%;
       height: 100%;
       position: relative;
       #capture,.close,.transform{
          position: absolute;
        }
        .close{
          width: 3rem;
          height: 2rem;
          line-height: 2rem;
          top: 50%;
          left: 40px;
          transform: translate(-50%,-50%);
        }
        #capture{
          top: 50%;
          left: 50%;
          transform: translate(-50%,-50%);
          width: 2.5rem;
          height: 2.5rem;
          background: url('~@/assets/onCamera.png') no-repeat center;
          border: none;
          background-size: 100% 100%;
          border-radius: 50%;
          outline: 0;
          cursor: pointer;
        }
        .transform{
          top: 50%;
          right: 10px;
          transform: translate(-50%,-50%);
          width: 2rem;
          height: 2rem;
          background: url('~@/assets/transform.png') no-repeat center;
          background-size: 100% 100%;
          border-radius: 50%;
          cursor: pointer;
        }
     }

  }
  #canvas{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    display: none;
  }

}
#open-video{
  position: absolute;
  z-index: 1111111;
}
#open-video{
  width: 2.3rem;
  height: 2.3rem;
  background: url('~@/assets/camera.png') no-repeat center;
  border: none;
  background-size: 100% 100%;
  border-radius: 50%;
  outline: 0;
  cursor: pointer;
}
#user-permission{
  position: absolute;
  top: 1rem;
  left: 1rem;
  font-weight: bolder;
}
.video-wrap{
  position: relative;
  width: 100%;
  height: calc(100% - 80px);
  // padding-bottom: 100%;
}
#video{
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  transform: rotateY(180deg);
  // object-fit: cover;
  // transform: scale(.5);
  // transform: rotate(90deg);
}
</style>

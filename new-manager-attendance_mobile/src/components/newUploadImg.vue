
 <!--  -->
 <template>
  <div id>
    <van-uploader
      v-model.trim="item.fileList"
      :after-read="uploadImgs"
      :before-read="beforeRead"
      accept="image/*"
    ></van-uploader>
  </div>
</template>

<script>
export default {
  data () {
    return {}
  },
  methods: {
    uploadImgs (file) {
      // 大于2.5MB的jpeg和png图片都缩小像素上传
      if (/\/(?:jpeg|png)/i.test(file.file.type) && file.file.size > 2500000) {
        // 创建Canvas对象(画布)
        let canvas = document.createElement('canvas')
        // 获取对应的CanvasRenderingContext2D对象(画笔)
        let context = canvas.getContext('2d')
        // 创建新的图片对象
        let img = new Image()
        // 指定图片的DataURL(图片的base64编码数据)
        img.src = file.content
        // 监听浏览器加载图片完成，然后进行进行绘制
        img.onload = () => {
          // 指定canvas画布大小，该大小为最后生成图片的大小
          canvas.width = 360
          canvas.height = 640
          /* drawImage画布绘制的方法。(0,0)表示以Canvas画布左上角为起点，400，300是将图片按给定的像素进行缩小。
        如果不指定缩小的像素图片将以图片原始大小进行绘制，图片像素如果大于画布将会从左上角开始按画布大小部分绘制图片，最后的图片就是张局部图。 */

          context.drawImage(img, 0, 0, 360, 640)
          // 将绘制完成的图片重新转化为base64编码，file.file.type为图片类型，0.92为默认压缩质量
          file.content = canvas.toDataURL(file.file.type, 0.92)
          // 最后将base64编码的图片保存到数组中，留待上传。
        }
      }
    }
  }
}
</script>
 <style scoped>
</style>

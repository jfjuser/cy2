 <template>
  <div style="paddding:10px;">
    <iframe :src="urlPath" class="iframe" ref="iframe"></iframe>
  </div>
</template>
<script>
export default {
  data () {
    return {
      urlPath: this.getUrlPath()
    }
  },
  mounted () {
    this.resize()
    this.load()
  },
  watch: {
    $route () {
      this.load()
    }
  },
  methods: {
    getUrlPath () {
      return this.$route.meta.url
    },
    load () {
      this.urlPath = this.$route.meta.url
      this.iframeInit()
    },
    // 加载浏览器窗口变化自适应
    resize () {
      window.onresize = () => {
        this.iframeInit()
      }
    },
    // iframe窗口初始化
    iframeInit () {
      const iframe = this.$refs.iframe
      const clientHeight = document.documentElement.clientHeight - 150
      iframe.style.height = `${clientHeight}px`
    }
  }
}
</script>
<style lang='scss' scoped>
.iframe{
  width: 100%;
  height: 100%;
  border: 0;
  overflow: hidden;
  box-sizing: border-box;
}
</style>

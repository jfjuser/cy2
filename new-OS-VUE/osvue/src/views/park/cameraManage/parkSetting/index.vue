<template>
    <div class="app-container">
        <template>
            <el-tabs type="border-card" v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="设置相机参数" name="first">
                  <camera-params v-on:childmac='childmac'></camera-params>
                </el-tab-pane>
                <el-tab-pane label="显示屏设置" name="second">
                  <led-setting></led-setting>
                </el-tab-pane>
                <el-tab-pane label="设置系统参数" name="third">
                  <system-setting :bindStatus='status'></system-setting>
                </el-tab-pane>
                <el-tab-pane label="下载重启生效" name="fourth" v-if="((status === false && idType === 6) ? true : status)">
                  <el-card class="box-card">
                    <div slot="header" class="clearfix">
                      <span>下载之前请确认前面步骤已经设置好并且已经保存，确认后下载配置即可生效！</span>
                    </div>
                    <el-form>
                        <el-form-item label="通道名称">
                          <el-select v-model="webform.macs" multiple>
                            <el-option v-for="item in localList" clearable :key="item.mac" :label="item.localName" :value="item.mac"></el-option>
                          </el-select>
                          <el-button type="primary" @click="onSubmitAll">下载所有参数</el-button>
                        </el-form-item>
                      </el-form>
                      <el-input
                        type="textarea"
                        :autosize="{ minRows: 2, maxRows: 20}"
                        placeholder=""
                        v-model="websocketmsg">
                      </el-input>
                  </el-card>
                </el-tab-pane>
            </el-tabs>
        </template>
    </div>
</template>
<script>
import { parkSettingWebSocket } from '@/api/websocket.js'
import { httpGet, httpPost } from '@/utils/restful'
import { getCamera, settingAll } from '@/api/url'
import cameraParams from './components/cameraParams'
import ledSetting from './components/ledSetting'
import systemSetting from './components/systemSetting'
export default {
  components: {
    cameraParams,
    ledSetting,
    systemSetting
  },
  data () {
    return {
      activeIndex: 0,
      idType: undefined,
      status: true,
      isShow: true,
      statusCat: true,
      activeName: 'first',
      localList: [],
      listRoad: [],
      webform: {
        departmentId: this.$store.getters.departmentId,
        macs: undefined,
        downType: 0
      },
      ws: null,
      websocketmsg: ''
    }
  },
  created () {
    this.loadLocals()
    this.idType = JSON.parse(localStorage.getItem('idType'))
  },
  methods: {
    // 切换tab
    handleClick (tab) {
      if (tab.name === 'fourth') {
        this.websocket({id: this.$store.getters.departmentId})
      }
    },
    childmac (childmac) {
      this.status = childmac
    },
    // 获取相机
    loadLocals () {
      httpGet(getCamera + this.$store.getters.departmentId).then(res => {
        if (res.data === null || res.data.length === 0) {
          this.$message.error('暂无相机，请先绑定相机')
        } else {
          this.localList = res.data
          // this.getLocalParams(res.data[0].id)
        }
      }).catch((err) => {
        console.log('获取相机失败： ', err)
      })
    },
    // -------------------------websocket -------------------------- \\
    websocket (data) {
      // 检查浏var ws;览器是否支持WebSocket
      // console.log('测试测试', parkSettingWebSocket)
      if (window.WebSocket) {
        if (this.ws !== null) {
          this.ws.close()
        }

        this.ws = new WebSocket(parkSettingWebSocket + data.id)
        // 连接websocket
        this.ws.onopen = this.initWebSocket
        this.ws.onmessage = this.onmessageWebSocket
        // 链接失败
        this.ws.onerror = this.onerrorWebSocket
        this.ws.close = this.closeWebsocket
      } else {
        this.$message({
          message: '您的浏览器暂时不支持实时下载结果展示，可尝试换浏览器!',
          type: 'error',
          duration: 4 * 1000
        })
      }
    },
    closeWebsocket (isClose) {
      // console.log('wesocket关闭监听', isClose)
    },
    initWebSocket () {
      // console.log('开始发送数据 ')
      // this.ws.send('client open!')
    },
    // 接收消息
    onmessageWebSocket (evt) {
      // console.log('接收websocket信息', evt)

      let msg = ''
      if (this.websocketmsg) {
        msg = this.websocketmsg
      }
      msg += evt.data + '\n'
      this.websocketmsg = msg
    },
    // 链接失败
    onerrorWebSocket () {
      this.$message({
        message: '无法实时显示下载信息！',
        type: 'error',
        duration: 4 * 1000
      })
    },
    onCloseWebsocket () {
      this.ws.onclose()
    },
    onSubmitAll () {
      // console.log('开始下载所有参数。。。')

      if (this.webform.macs.length > 0) {
        this.createloading = true
        let tempDate = Object.assign({}, this.webform)
        // console.log('请求接口： ', settingAll, tempDate)

        httpPost(settingAll, tempDate).then(res => {
          // console.log('接收数据：', res)

          this.createloading = false
          this.$message({
            message: res.message,
            type: 'success',
            duration: 4 * 1000
          })
        }).catch(() => {
          this.createloading = false
        })
      } else {
        this.$message.error('请先添加相机')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .el-tabs--border-card>.el-tabs__content{
    padding: 20px;
  }
</style>

<template>
  <div class="app-container">
    <div class="table-main">
      <div class="filter-container" v-if = "isShowColumnFormatter(['加载识别图片'])">
        是否开启自动获取图片(体验,PS:极耗流量  300kb * (进场数 + 出场数))
        <el-switch v-model="autoImg" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
      </div>
      <el-row :gutter="20">
          <el-col v-for="item in deviceList" :key="item.id" class="box" :span="6">
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span>{{item.localName}}</span>
                </div>
                <div class="box-main">
                    <div class="box-body box-plate">{{item.plate}}</div>
                    <img class="box-body box-image" :src="item.imgUrl!=null ? item.imgUrl : noPic">
                    <div class="box-body box-money" v-if="item.money!=null && item.money>0">收费:{{item.money}}</div>
                    <div class="box-body box-time">{{timeFormatter(item.time)}}</div>
                    <el-button class="box-body box-btn filter-item" @click="switchEd(item.id)">手动开闸</el-button>

                    <div class="box-body box-tip" v-if="item.tip && item.tip.show == true">
                      <p>{{item.tip.type}}</p>
                      <p>{{item.tip.msg}}</p>
                      <p>{{item.tip.time}}</p>
                    </div>
                </div>
            </el-card>
          </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import { isShowColumnFormatter, timeFormatter } from '@/utils/formatter.js'
import { inOutListenWebSocket } from '@/api/websocket.js'
import noPic from '@/assets/noPic.gif'
import { httpGet, httpPost } from '@/utils/restful'
import { getDeviceStatus, switchById, getSnapshotById } from '@/api/url'
export default {
  data () {
    return {
      deviceList: [],
      noPic: noPic,
      listQuery: {
        offset: 1,
        limit: 10
      },
      ws: null,
      isShowColumnFormatter: isShowColumnFormatter,
      timeFormatter: timeFormatter,
      autoImg: false
    }
  },
  created () {
    this.fetchData()
    this.websocket({id: this.$store.getters.departmentId})
  },
  methods: {
    fetchData () {
      httpGet(getDeviceStatus + this.$store.getters.departmentId, this.listQuery).then(res => {
        if (res.data !== null) {
          this.deviceList = res.data.rows
        }
      }).catch(() => {
      })
    },
    websocket (data) {
      // 检查浏var ws;览器是否支持WebSocket
      if (window.WebSocket) {
        if (this.ws !== null) {
          this.ws.close()
        }
        this.ws = new WebSocket(inOutListenWebSocket + data.id)
        // 连接websocket
        this.ws.onopen = this.initWebSocket
        this.ws.onmessage = this.onmessageWebSocket
        // 链接失败
        this.ws.onerror = this.onerrorWebSocket
      } else {
        this.$message({
          message: '您的浏览器暂时不支持实时监控结果展示，可尝试换浏览器!',
          type: 'error',
          duration: 4 * 1000
        })
      }
    },
    initWebSocket () {},
    // 接收消息
    onmessageWebSocket (evt) {
      const res = JSON.parse(evt.data)
      for (let i = 0; i < this.deviceList.length; i++) {
        let item = this.deviceList[i]
        if (item.id === res.id) {
          if (res.eventName === 'IN_PUSH' || res.eventName === 'OUT_PUSH') {
            item.plate = ''
            item.money = null
            item.time = ''
            item.tip = {}
            // 弹出提示框显示已经进场或者出场
            if (res.eventName === 'OUT_PUSH') {
              this.$notify({
                type: 'success',
                title: '出场',
                offset: 60,
                message: res.carType + ' - ' + res.plate + ' 收费:' + res.money + '元'
              })
              item.tip.type = '出场'
              item.tip.msg = res.carType + ' - ' + res.plate + ' 收费:' + res.money + '元'
            } else {
              this.$notify({
                type: 'success',
                title: '入场',
                offset: 60,
                message: res.carType + ' - ' + res.plate
              })
              item.tip.type = '入场'
              item.tip.msg = res.carType + ' - ' + res.plate
            }
            item.tip.time = this.timeFormatter(new Date())
            item.tip.plate = res.plate
            item.tip.show = true
            let plate = res.plate
            setTimeout(() => {
              if (plate === item.tip.plate) {
                item.tip.show = false
              }
            }, 5000)
          } else if (res.eventName === 'CAP_IN_PLATE_TASK' || res.eventName === 'CAP_OUT_PLATE_TASK') {
            let plate = res.plate
            // 去重复
            if (this.autoImg && item.plate !== plate) {
              this.getPic(this.deviceList[i].id)
            }
            let temp = this.deviceList
            Object.assign(temp[i], res)
            this.deviceList = temp
            setTimeout(() => {
              if (plate === item.plate) {
                item.plate = ''
                item.money = null
                item.time = ''
                this.$forceUpdate()
              }
            }, 5000)
          }
          this.$forceUpdate()
          break
        }
      }
    },
    // 链接失败
    onerrorWebSocket () {
      this.$message({
        message: '无法实时显示信息！',
        type: 'error',
        duration: 4 * 1000
      })
    },
    onCloseWebsocket () {
      this.ws.onclose()
    },
    // 开闸
    switchEd (id) {
      this.$confirm('确认开闸吗？', '提示', {})
        .then(() => {
          httpPost(switchById + id).then(res => {
            this.$message({
              message: res.message,
              type: 'success',
              duration: 4 * 1000
            })
          }).catch(() => {})
        }).catch(() => {})
    },
    // 获取图片(抓取屏幕)
    getPic (id) {
      httpGet(getSnapshotById + id).then(res => {
        for (let i = 0; i < this.deviceList.length; i++) {
          if (this.deviceList[i].id === id) {
            this.deviceList[i].imgUrl = 'data:image/jpeg;base64,' + res.data
            this.$forceUpdate()
            let tempUrl = 'data:image/jpeg;base64,' + res.data
            // 60秒后过期
            setTimeout(() => {
              // 判断是不是60秒内没和之前的改变过
              if (tempUrl === this.deviceList[i].imgUrl) {
                this.deviceList[i].imgUrl = undefined
                this.$forceUpdate()
              }
            }, 60000)
            break
          }
        }
      }).catch(() => {
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.box-card {
  margin-top: 5px;
}
.box-main {
    position: relative;
    height: 230px;
    color: #0074e7;
}
.box-body {
    z-index: 101;
    position: absolute;
}
.box-plate {
    top: 6%;
    left: 5%;
    font-size: 20px;
}
.box-money {
    bottom: 4%;
    left: 5%;
}
.box-time {
    bottom: 4%;
    left: 35%;
}
.box-btn {
    right: 0;
    bottom: 0;
    width: 30%;
    height: 40px;
    border-radius: 20px;
}
.box-image {
    position: absolute;
    top: 0;
    left: 0;
    height: 230px;
    width: 100%;
    border-radius: 20px;
    z-index: 100;
}
.box-tip {
  position: relative;
  left: 15%;
  top: 15%;
  width: 70%;
  height: 65%;
  border: 1px solid #0074e7;
  background-color: rgba(64,158,255,.7);
  color: #f0f0f0;
  border-radius: 20px;
  font-size: 16px;
  text-align: center;
  padding: 3%;
}
</style>

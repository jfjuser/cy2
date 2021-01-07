<template>
  <div class="app-container">
    <div class="table-main">
      <el-form ref="dataform" :model="form" autoCompete = "on" label-position="right" label-width="150px">
        <el-form-item label="二维码类型">
          <el-select v-model="form.type" placeholder="请选择" @change="typeChange">
            <el-option
            v-for="item in bluetoothCodeType"
            :key="item.valueNo"
            :label="item.valueName"
            :value="item.valueNo">
            </el-option>
          </el-select>
        </el-form-item>
        <div v-show="showLocal">
          <el-form-item label="通道名称">
            <el-select v-model="form.channelId" placeholder="请选择"  @change="channelIdChange">
              <el-option
              v-for="item in cameraList"
              :key="item.localId"
              :label="item.localName"
              :value="item.localId">
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <div v-show="showQrCode">
          <el-form-item label="二维码地址" >
            <el-input v-model="codeUrl" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="二维码" >
            <div id="qrcode" ref = "qrcode" style="display: none;"></div>
            <canvas id="canvas"></canvas>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="downLoad">下载二维码</el-button>
          </el-form-item>
        </div>
        <div v-show="showLocal">
          <el-form-item>
            <el-button v-show="!showQrCode"  :loading="loading" type="primary" @click="getQrCodeUrl">生成二维码</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
  </div>
</template>
<script>
import QRcode from 'qrcodejs2'
import { bluetoothCodeType } from '@/utils/selectAble.js'
import { httpGet } from '@/utils/restful'
import { bluetoothCode, getOutCamera, getInCamera } from '@/api/url'
export default {
  data () {
    return {
      loading: false,
      bluetoothCodeType: bluetoothCodeType,
      form: {
        type: undefined,
        change: 0,
        channelId: undefined
      },
      codeUrl: '',
      cameraList: [],
      createCode: '',
      showQrCode: false,
      showLocal: false
    }
  },
  mounted () {
    this.createQrCode()
  },
  methods: {
    channelIdChange (value) {
      this.showQrCode = false
      this.showLocal = true
    },
    // 监听type
    typeChange (value) {
      this.showQrCode = false
      this.showLocal = false
      if (value === 5) {
        this.resetForm()
        this.getAllOutCamera()
      } else {
        this.resetForm()
        this.getAllInCamera()
      }
      this.form.type = value
    },
    // 充值form
    resetForm () {
      this.form = {
        type: undefined,
        change: 0,
        channelId: undefined,
        localId: undefined
      }
    },
    // 获取入口相机
    getAllInCamera () {
      httpGet(getInCamera + '/' + this.$store.getters.departmentId)
        .then(res => {
          if (res.data === null || res.data.length === 0) {
            this.$message({
              type: 'warning',
              message: '暂无相机配置，请先绑定入口相机'
            })
          } else {
            this.cameraList = res.data
            this.showLocal = true
          }
        }).catch(() => {})
    },
    // 获取出口相机
    getAllOutCamera () {
      httpGet(getOutCamera + '/' + this.$store.getters.departmentId)
        .then(res => {
          if (res.data === null || res.data.length === 0) {
            this.$message({
              type: 'warning',
              message: '暂无相机配置，请先绑定出口相机'
            })
          } else {
            this.cameraList = res.data
            this.showLocal = true
          }
        }).catch(() => {})
    },
    // 获取二维码链接地址
    getQrCodeUrl () {
      this.form = Object.assign(this.form, {departmentId: this.$store.getters.departmentId})
      httpGet(bluetoothCode, this.form)
        .then(res => {
          if (res.data === null) {
            this.$message({
              type: 'warning',
              message: '暂无二维码地址',
              duration: 4 * 1000
            })
          } else {
            this.showQrCode = true
            this.codeUrl = res.data
            this.createCode.makeCode(this.codeUrl)
            this.imgAddWord()
          }
        }).catch(() => {})
    },
    // 生成二维码
    createQrCode () {
      this.createCode = new QRcode('qrcode', {
        text: this.codeUrl,
        width: 300,
        height: 300
      })
    },
    // 图像加文字显示
    imgAddWord () {
      let Img = document.getElementById('qrcode').getElementsByTagName('img')[0]
      setTimeout(() => {
        let canvas = document.getElementById('canvas')
        canvas.width = Img.width
        canvas.height = Img.height + 70
        let cxt = canvas.getContext('2d')
        let newImage = new Image()
        newImage.src = Img.src
        newImage.onload = () => {
          cxt.drawImage(newImage, 0, 0)
        }
        cxt.font = '20px Arial'
        if (this.form.type === 5) {
          let obj = {}
          obj = this.cameraList.find((item) => {
            return item.localId === this.form.channelId
          })
          cxt.fillText('蓝牙开闸出场码', 0, 330)
          cxt.fillText(`出口通道 ${obj.localName}`, 0, 360)
        } else {
          let obj = {}
          obj = this.cameraList.find((item) => {
            return item.localId === this.form.channelId
          })
          cxt.fillText('蓝牙开闸入场码', 0, 330)
          cxt.fillText(`入口通道 ${obj.localName}`, 0, 360)
        }
        cxt.stroke()
      })
    },
    downLoad () {
      let title = ''
      if (this.form.type === 5) {
        title = '蓝牙开闸出场码'
      } else {
        title = '蓝牙开闸入场码'
      }
      let canvas = document.getElementById('canvas')
      let url = canvas.toDataURL('image/png')
      let triggerDownLoad = document.createElement('a')
      triggerDownLoad.setAttribute('href', url)
      triggerDownLoad.setAttribute('downLoad', title)
      triggerDownLoad.click()
    }
  }
}
</script>

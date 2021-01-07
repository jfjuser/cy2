<template>
    <div>
        <van-cell title="二维码类型" :value="typeVal" is-link @click="showPicker = true" class="mar-b-15"></van-cell>

        <section v-show="showLocal">
            <van-cell title="通道名称" :value="nameVal" is-link @click="showNamePicker = true"></van-cell>
        </section>
        <section v-show="showQrCode">
            <van-cell title="二维码地址" :label="codeUrl"></van-cell>
            <div class="code-box bgc">
                <div id="qrcode" ref="qrcode" style="display: none;"></div>
                <canvas id="canvas"></canvas>
            </div>
        </section>
        <section v-show="showLocal" class="btn-box">
            <van-button v-show="!showQrCode" @click="getQrCodeUrl" type="info" :loading="loading" block round>生成二维码</van-button>
        </section>

        <van-popup v-model="showPicker" position="bottom" safe-area-inset-bottom>
          <van-picker
            show-toolbar
            :columns="bluetoothCodeType"
            value-key="valueName"
            @cancel="showPicker = false"
            @confirm="onConfirm"
          />
        </van-popup>
        <van-popup v-model="showNamePicker" position="bottom" safe-area-inset-bottom>
          <van-picker
            show-toolbar
            :columns="cameraList"
            value-key="localName"
            @cancel="showNamePicker = false"
            @confirm="onNameConfirm"
          />
        </van-popup>
    </div>
</template>

<script>
import QRcode from 'qrcodejs2'
import { Field, Button, Picker, Popup, Cell } from 'vant'
import { bluetoothCodeType } from '@/utils/selectAble.js'
import { httpGet } from '@/utils/restful'
import { bluetoothCode, getOutCamera, getInCamera } from '@/api/url'
export default {
  components: {
    [Button.name]: Button,
    [Field.name]: Field,
    [Picker.name]: Picker,
    [Popup.name]: Popup,
    [Cell.name]: Cell
  },
  data () {
    return {
      bluetoothCodeType: bluetoothCodeType,
      form: {
        type: undefined,
        change: 0,
        channelId: undefined
      },
      loading: false,
      codeUrl: '',
      cameraList: [],
      createCode: '',
      showQrCode: false,
      showLocal: false,
      typeVal: '请选择',
      showPicker: false,
      nameVal: '请选择',
      showNamePicker: false
    }
  },
  created () {
    this.createQrCode()
  },
  methods: {
    onNameConfirm (value, index) {
      // console.log(value)
      this.form.channelId = value.localId
      this.nameVal = value.localName
      this.showNamePicker = false
    },
    onConfirm (value, index) {
      // console.log(value)
      this.form.type = value.valueNo
      this.typeVal = value.valueName
      this.showPicker = false
      this.typeChange(value.valueNo)
    },
    channelIdChange (value) {
      this.showQrCode = false
      this.showLocal = true
    },
    // 监听type
    typeChange (value) {
    //   console.log(value)
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
    // 清除form
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
      const ToastLoading = this.$toast.loading({ message: '加载中...', position: 'middle' })
      httpGet(getInCamera + '/' + this.$store.getters.departmentId)
        .then(res => {
          if (res.data === null || res.data.length === 0) {
            this.$notify({
              type: 'warning',
              message: '暂无相机配置，请先绑定入口相机'
            })
          } else {
            this.cameraList = res.data
            this.showLocal = true
          }
          ToastLoading.clear()
        }).catch(() => { ToastLoading.clear() })
    },
    // 获取出口相机
    getAllOutCamera () {
      const ToastLoading = this.$toast.loading({ message: '加载中...', position: 'middle' })
      httpGet(getOutCamera + '/' + this.$store.getters.departmentId)
        .then(res => {
          if (res.data === null || res.data.length === 0) {
            this.$notify({
              type: 'warning',
              message: '暂无相机配置，请先绑定出口相机'
            })
          } else {
            this.cameraList = res.data
            this.showLocal = true
          }
          ToastLoading.clear()
        }).catch(() => { ToastLoading.clear() })
    },
    // 生成二维码
    createQrCode () {
      this.$nextTick(() => {
        this.createCode = new QRcode('qrcode', {
          text: this.codeUrl,
          width: 300,
          height: 300
        })
      })
    },
    // 获取二维码链接地址
    getQrCodeUrl () {
      const ToastLoading = this.$toast.loading({ message: '加载中...', position: 'middle', duration: 0 })
      this.form = Object.assign(this.form, {departmentId: this.$store.getters.departmentId})
      httpGet(bluetoothCode, this.form)
        .then(res => {
          if (res.data === null) {
            this.$notify({
              type: 'warning',
              message: '暂无二维码地址'
            })
          } else {
            this.showQrCode = true
            this.codeUrl = res.data
            this.createCode.makeCode(this.codeUrl)
            this.imgAddWord()
          }
          ToastLoading.clear()
        }).catch(() => { ToastLoading.clear() })
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
    }
  }
}
</script>

<style lang="scss" scoped>
.btn-box {
    padding: 20px;
}
.code-box {
    padding-left: 15px;
}
</style>

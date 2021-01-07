<template>
    <div>
        <van-cell title="二维码类型" :value="typeVal" is-link @click="showPicker = true" class="mar-b-15"></van-cell>

        <section v-show="showLocal">
            <van-field
            v-model="form.channelId"
            label="通道名称"
            placeholder="请输入通道名称"
            @blur="channelIdChange"
            />
        </section>
        <section v-show="showQrCode">
            <van-cell title="二维码地址" :label="codeUrl"></van-cell>
            <div class="code-box bgc">
                <div id="qrcode" ref="qrcode" style="display: none;"></div>
                <canvas id="canvas"></canvas>
            </div>
        </section>
        <section v-show="showLocal" class="btn-box">
            <van-button v-show="becomeQrCode" @click="getQrCodeUrl" type="info" :loading="loading" block round>生成二维码</van-button>
        </section>

        <van-popup v-model="showPicker" position="bottom" safe-area-inset-bottom>
          <van-picker
            show-toolbar
            :columns="qrCodeType"
            value-key="valueName"
            @cancel="showPicker = false"
            @confirm="onConfirm"
          />
        </van-popup>
    </div>
</template>

<script>
import QRcode from 'qrcodejs2'
import { Field, Button, Picker, Popup, Cell } from 'vant'
import { qrCodeType } from '@/utils/selectAble.js'
import { httpGet } from '@/utils/restful'
import { QRCode } from '@/api/url'
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
      qrCodeType: qrCodeType,
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
      becomeQrCode: true,
      typeVal: '请选择',
      showPicker: false
    }
  },
  created () {
    if (this.$store.getters.departmentTypeId === 100052) {
      this.qrCodeType.splice(2, 1)
    }
    this.createQrCode()
  },
  methods: {
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
      this.becomeQrCode = true
    },
    // 监听type
    typeChange (value) {
    //   console.log(value)
      this.showQrCode = false
      this.showLocal = false
      this.becomeQrCode = false
      if (value === 1) {
        this.resetForm()
        this.form.type = 1
        this.getQrCodeUrl()
      } else if (value === 2) {
        this.resetForm()
        this.form.type = 2
        this.showLocal = true
        this.becomeQrCode = true
      } else {
        this.resetForm()
        this.form.type = 3
        this.showLocal = true
        this.becomeQrCode = true
      }
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
      httpGet(QRCode, this.form)
        .then(res => {
          if (res.data === null) {
            this.$notify({
              type: 'warning',
              message: '暂无二维码地址'
            })
          } else {
            this.codeUrl = res.data
            this.createCode.makeCode(this.codeUrl)
            this.becomeQrCode = false
            this.showQrCode = true
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
        if (this.form.type === 1) cxt.fillText('场内预付码', 0, 330)
        if (this.form.type === 2) {
          cxt.fillText('出口直付码', 0, 330)
          cxt.fillText(`出口通道 ${this.form.channelId}`, 0, 360)
        }
        if (this.form.type === 3) {
          cxt.fillText('无牌车入场码', 0, 330)
          cxt.fillText(`入口通道 ${this.form.channelId}`, 0, 360)
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

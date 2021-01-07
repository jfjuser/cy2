<template>
  <div class="table-main">
    <el-form ref="dataform" :model="form" autoCompete = "on" label-position="right" label-width="150px">
      <el-form-item label="二维码类型">
        <el-select v-model="form.type" placeholder="请选择" @change="typeChange">
          <el-option
          v-for="item in qrCodeType"
          :key="item.valueNo"
          :label="item.valueName"
          :value="item.valueNo">
          </el-option>
        </el-select>
      </el-form-item>
      <div v-show="showLocal">
        <el-form-item label="通道名称">
          <el-input v-model="form.channelId" @blur="channelIdChange"></el-input>
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
          <el-button v-show="becomeQrCode" :loading="loading" type="primary" @click="getQrCodeUrl">生成二维码</el-button>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>
<script>
import QRcode from 'qrcodejs2'
import { qrCodeType } from '@/utils/selectAble.js'
import { httpGet } from '@/utils/restful'
import { QRCode } from '@/api/url'
export default {
  data () {
    return {
      loading: false,
      qrCodeType: qrCodeType,
      form: {
        type: undefined,
        change: 0,
        channelId: undefined
      },
      codeUrl: '',
      cameraList: [],
      createCode: '',
      showQrCode: false,
      showLocal: false,
      becomeQrCode: true
    }
  },
  created () {
    // console.log('部门ID-1', this.$store.getters.departmentId, '数据列表：', this.qrCodeType)

    if (this.$store.getters.departmentTypeId === 100052) {
      // 原始配置
      // this.qrCodeType.splice(2, 1)
    }
    /** ********  【 测试测试 】  **********/
    // if (this.$store.getters.departmentId * 1 !== 4742) {
    //   this.qrCodeType.splice(2, 1)
    // }
    this.createQrCode()
    // console.log('二维码类型查看。。。', this.qrCodeType)
  },
  methods: {
    channelIdChange (value) {
      this.showQrCode = false
      this.showLocal = true
      this.becomeQrCode = true
    },
    // 监听type
    typeChange (value) {
      this.showQrCode = false
      this.showLocal = false
      this.becomeQrCode = false
      if (value === 1) {
        this.resetForm()
        this.form.type = 1
        this.getQrCodeUrl()
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
    // 充值form
    resetForm () {
      this.form = {
        type: undefined,
        change: 0,
        channelId: undefined,
        localId: undefined
      }
    },
    isOldHost (url) {
      return new Promise((resolve, reject) => {
      /** ********  【 检查后端返回接口地址是否是原来的 】  **********/
        let parkHost = /^http[s]?:\/\/www\.cytingchechang\.com/
        // let testHost = /^http[s]?:\/\/beta\.cytingchechang\.com/
        let parkIp = /^http:\/\/112\.74\.50\.105/
        // let CparkHost = 'http://cy2.40mi.com'
        let CparkHost = 'https://www.cytingchechang.com'
        let CtestHost = /^http:\/\/47\.106\.35\.188/
        let CHCparkHost = 'https://beta.cytingchechang.com'
        let getHost = null
        // console.log('检测是否是ip1', parkIp.test(url))

        if (parkHost.test(url)) {
          getHost = url.replace(parkHost, CparkHost)
        } else if (parkIp.test(url)) {
          getHost = url.replace(parkIp, CparkHost)
        } else if (CtestHost.test(url)) {
          getHost = url.replace(CtestHost, CHCparkHost)
        } else {
          getHost = url
        }
        return resolve(getHost)
      })
    },
    // 获取二维码链接地址
    getQrCodeUrl () {
      this.form = Object.assign(this.form, {departmentId: this.$store.getters.departmentId})
      // console.log('发起请求数据：', this.form)

      httpGet(QRCode, this.form)
        .then(res => {
          if (res.data === null) {
            this.$message({
              type: 'warning',
              message: '暂无二维码地址',
              duration: 4 * 1000
            })
          } else {
            // console.log('二维码数据信息2： ', res)
            // 原始
            // this.codeUrl = res.data
            // this.createCode.makeCode(this.codeUrl)
            // this.becomeQrCode = false
            // this.showQrCode = true
            // this.imgAddWord()

            // 新的修改
            this.isOldHost(res.data).then(res => {
              this.codeUrl = res
              // console.log('二维码数据信息2： ', this.codeUrl, '后台返回数据： ', res)
              // console.log('请求的form表单信息2： ', this.form)
              this.createCode.makeCode(this.codeUrl)
              this.becomeQrCode = false
              this.showQrCode = true
              this.imgAddWord()
            })
          }
        }).catch(() => {})
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
    },
    // 下载二维码
    downLoad () {
      let title = ''
      if (this.form.type === 1) {
        title = '场内预付码'
      } else if (this.form.type === 2) {
        title = '出口直付码'
      } else {
        title = '无牌车入场码'
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
<style lang="scss" scoped>
.line{
  text-align: center;
}
.text{
    color: grey;
}
</style>

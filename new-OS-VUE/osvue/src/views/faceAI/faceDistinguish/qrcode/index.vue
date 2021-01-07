<template>
  <div class="app-container">
    <div class="table-main">
        <el-form ref="dataform" autoCompete = "on" label-position="right" label-width="150px">
            <div v-show="showQrCode">
                <el-form-item label="二维码地址" >
                    <el-input v-model="codeUrl" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="二维码" >
                <div id="qrcode" ref = "qrcode" v-loading.body="loading"></div>
                </el-form-item>
            </div>
        </el-form>
    </div>
  </div>
</template>
<script>
import QRcode from 'qrcodejs2'
import { httpGet } from '@/utils/restful'
import { getWxQRcode } from '@/api/url'
export default {
  data () {
    return {
      showQrCode: true,
      createCode: '',
      codeUrl: '',
      loading: false
    }
  },
  mounted () {
    let QrCodeHTML = this.$refs.qrcode
    QrCodeHTML.innerHTML = ' '
    this.createQrCode()
    this.createCode.clear()
    // this.createCode.makeCode('1223')
    this.getWxQRcode()
  },
  methods: {
    // 生成二维码
    createQrCode () {
      this.createCode = new QRcode('qrcode', {
        text: this.codeUrl,
        width: 300,
        height: 300
      })
    },
    getWxQRcode () {
      this.loading = true
      let params = {
        departmentId: this.$store.getters.departmentId
      }
      httpGet(getWxQRcode, params).then(res => {
        this.loading = false
        if (res.data) {
          console.log(1111, res.data)
          this.codeUrl = res.data
          this.createCode.makeCode(this.codeUrl)
        }
      }).catch(() => { this.loading = false })
    }
  }
}
</script>

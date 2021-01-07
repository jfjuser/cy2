<template>
  <div class="app-container">
    <div>
      <el-row :span="20">
        <el-col :span="11" class="table-main" style="margin-right: 20px;">
          <el-form ref="dataform"  :rules="formRules" v-loading.body="listLoading" :model="form" autoCompete = "on" label-position="left" label-width="80px">
            <el-form-item label="姓名">
              <el-input style="width:15.75rem;" v-model="form.name" placeholder="请填写姓名"></el-input>
            </el-form-item>
            <el-form-item label="时间范围" prop="time">
                <el-date-picker
                    class="filter-item"
                    v-model="form.time"
                    :clearable="false"
                    type="datetimerange"
                    style="padding:0 15px;"
                    value-format = "yyyy-MM-dd HH:mm:ss"
                    :default-time="['00:00:00', '23:59:59']"
                    range-separator="至"
                    start-placeholder="开始日期"
                    @change="changeTime"
                    end-placeholder="结束日期">
                </el-date-picker>
            </el-form-item>
            <div v-show="showQrCode">
                <el-form-item label="二维码" >
                    <!-- <div id="qrcode" ref = "qrcode" style="display: none;"></div>
                <canvas id="canvas"></canvas> -->
                <img :src="qrcode" alt="二维码">
                </el-form-item>
                <!-- <el-form-item>
                    <el-button type="primary" @click="downLoad">下载二维码</el-button>
                </el-form-item> -->
            </div>
            <el-form-item>
             <el-button size="large" @click="setUpdate" type="primary">生成二维码</el-button>
           </el-form-item>
           </el-form>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import { timeFormatter } from '@/utils/formatter'
import { createQRcode } from '@/api/url'
import { httpPost } from '@/utils/restful'
// import QRcode from 'qrcodejs2'
// const Qs = require('qs')
export default {
  name: '',
  data () {
    return {
      listLoading: false,
      showQrCode: false,
      timeFormatter: timeFormatter,
      form: {
        name: '',
        time: [],
        remark: ''
      },
      qrcode: '',
      objectParams: {
        name: '',
        startTime: '',
        endTime: '',
        createTime: ''
      },
      formRules: {
        time: [
          {required: true, trigger: 'blur', message: '不可为空'}
        ]
      }
    }
  },
  created () {
    // this.createQrCode()
  },
  methods: {
    // 生成二维码
    changeTime (value) {
      this.objectParams.startTime = value[0]
      this.objectParams.endTime = value[1]
    },
    setUpdate () {
      this.objectParams.createTime = this.timeFormatter(new Date().valueOf())
      this.objectParams.name = this.form.name
      this.objectParams.remark = this.form.remark
      console.log(this.objectParams)
      // this.createCode = new QRcode('qrcode', {
      //   text: JSON.stringify(this.objectParams),
      //   width: 300,
      //   height: 300
      // })
      // let a = Qs.stringify(this.objectParams)
      // console.log(a)
      // this.qrcode = `${process.env.API_HOST}pb/at/work/v1/visitor/bindCamera?${a}`
      // this.qrcode =
      httpPost(createQRcode, this.objectParams).then((res) => {
        console.log(res)
        // return 'data:image/png;base64,' + btoa(
        //   new Uint8Array(res.data)
        //     .reduce((data, byte) => data + String.fromCharCode(byte), '')
        // )
        // var a = btoa(
        //   new Uint8Array(res.data)
        //     .reduce((data, byte) => data + String.fromCharCode(byte), '')
        // )
        this.qrcode = 'data:image/png;base64,' + res
        // this.qrcode = `${process.env.API_HOST}os/${createQRcode}?${Qs.stringify(this.objectParams)}`
        this.showQrCode = true
      }).catch(() => {})
    }
    // downLoad () {
    //   let title = '访客二维码'
    //   let canvas = document.getElementById('canvas')
    //   let url = canvas.toDataURL('image/png')
    //   let triggerDownLoad = document.createElement('a')
    //   triggerDownLoad.setAttribute('href', url)
    //   triggerDownLoad.setAttribute('downLoad', title)
    //   triggerDownLoad.click()
    // }
  }
}
</script>
<style lang='scss' scoped>
</style>

<template>
  <div>
    <el-form label-width="150px" label-position="right">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="公司名称" required>
            <el-input v-model="form.companyName"></el-input>
          </el-form-item>
          <el-form-item label="语音播报" required>
            <el-switch v-model="form.androidVoice" active-color="#13ce66" inactive-color="#ff4949" :active-value="1" :inactive-value="2" active-text="开" inactive-text="关"></el-switch>
          </el-form-item>
          <el-form-item label="名字提示" required>
            <el-switch v-model="form.nameTips" active-color="#13ce66" inactive-color="#ff4949" :active-value="1" :inactive-value="2" active-text="开" inactive-text="关"></el-switch>
          </el-form-item>
          <el-form-item label="图片提示" required>
            <el-switch v-model="form.pictureTips" active-color="#13ce66" inactive-color="#ff4949" :active-value="1" :inactive-value="2" active-text="开" inactive-text="关"></el-switch>
          </el-form-item>
          <el-form-item label="活体检测" required>
            <el-switch v-model="form.isLiving" active-color="#13ce66" inactive-color="#ff4949" :active-value="1" :inactive-value="2" active-text="开" inactive-text="关"></el-switch>
          </el-form-item>
          <el-form-item label="红色亮度" required>
            <el-slider v-model="form.redLevel"></el-slider>
          </el-form-item>
          <el-form-item label="绿色亮度" required>
            <el-slider v-model="form.greenLevel"></el-slider>
          </el-form-item>
          <el-form-item label="白色亮度" required>
            <el-slider v-model="form.whiteLevel"></el-slider>
          </el-form-item>
          <el-form-item label="蓝色亮度" required>
            <el-slider v-model="form.blueLevel"></el-slider>
          </el-form-item>
          <el-form-item label="音量大小" required>
            <el-slider v-model="form.volume"></el-slider>
          </el-form-item>
          <el-form-item label="定时开关机" required>
            <el-switch v-model="form.timerSwitch" active-color="#13ce66" inactive-color="#ff4949" :active-value="1" :inactive-value="2" active-text="开" inactive-text="关"></el-switch>
          </el-form-item>
          <el-form-item label="识别失败提示" required>
            <el-switch v-model="form.errorTips" active-color="#13ce66" inactive-color="#ff4949" :active-value="1" :inactive-value="2" active-text="显示" inactive-text="不显示"></el-switch>
          </el-form-item>
          <el-form-item label="识别失败记录" required>
            <el-switch v-model="form.saveErrorRecord" active-color="#13ce66" inactive-color="#ff4949" :active-value="1" :inactive-value="2" active-text="保存" inactive-text="不保存"></el-switch>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="密码设置" required>
            <el-input type="password" v-model="form.adminPassword" @blur="passwordFormatter"></el-input>
          </el-form-item>
          <el-form-item label="禁止通行颜色" required>
            <el-switch  v-model="form.color" :active-value="1" :inactive-value="2" active-color="#ff4949"  inactive-color="#b7b3b3" active-text="红色" inactive-text="白色"></el-switch>
          </el-form-item>
          <el-form-item label="人脸检测间隔" required>
            <el-slider v-model="form.detectionInterval" :min="0" :max="1" :step="0.1" :format-tooltip="formatInterval" show-stops></el-slider>
          </el-form-item>
          <el-form-item label="人脸对齐阈值" required>
            <el-slider v-model="form.faceAlignmentThreshold" :min="0" :max="1" :step="0.1" show-stops></el-slider>
          </el-form-item>
          <el-form-item label="人脸框评分值" required>
            <el-slider v-model="form.faceFrameScore" :min="0" :max="1" :step="0.1"  show-stops></el-slider>
          </el-form-item>
          <el-form-item label="人脸姿态评分" required>
            <el-slider v-model="form.facePoseScore" :min="0" :max="1" :step="0.1"  show-stops></el-slider>
          </el-form-item>
          <el-form-item label="人脸关键点评分" required>
            <el-slider v-model="form.faceKeyScore" :min="0" :max="1" :step="0.1" show-stops></el-slider>
          </el-form-item>
          <el-form-item label="人脸择优综合" required>
            <el-slider v-model="form.bestFaceScore" :min="0" :max="1" :step="0.1" show-stops></el-slider>
          </el-form-item>
          <el-form-item label="活体检测阈值" required>
            <el-slider v-model="form.livingValue" :min="0" :max="1" :step="0.1" show-stops></el-slider>
          </el-form-item>
          <el-form-item label="人脸综合评分" required>
            <el-slider v-model="form.faceScore" :min="0" :max="1" :step="0.1" show-stops></el-slider>
          </el-form-item>
          <el-form-item v-if="form.timerSwitch === 1" label="开机关机时间" required>
            <el-time-picker
              style="width:18.75rem;"
              is-range
              v-model="time"
              @change="changeTime"
              range-separator="至"
              :default-value ="['00:00', '00:00']"
              value-format = "HH:mm"
              format="HH 点 mm 分"
              start-placeholder="关机时间"
              end-placeholder="开机时间">
            </el-time-picker>
          </el-form-item>
          <el-form-item label="风扇开启温度" required>
            <el-slider v-model="form.fanStartTemperature" :format-tooltip="formatTemp"></el-slider>
          </el-form-item>
          <el-form-item label="风扇关闭温度" required>
            <el-slider v-model="form.fanStopTemperature" :format-tooltip="formatTemp"></el-slider>
          </el-form-item>
          <el-form-item label="补光灯亮度" required>
            <el-slider v-model="form.ledBrightness"></el-slider>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item>
        <el-button :loading="submitLoading" type="primary" @click="onSubmit">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { HHssFormatter } from '@/utils/formatter'
import { httpGet, httpPut } from '@/utils/restful'
import { getAIAndroidParams, setAIAndroidParams } from '@/api/url'
export default {
  name: 'android-ai-camera',
  props: {
    id: {
      required: true,
      type: Number
    }
  },
  // props: ['id', 'showCon'],
  watch: {
    id () {
      this.getAndroidAICameraData(this.id)
    }
  },
  mounted () {
    this.getAndroidAICameraData(this.id)
  },
  data () {
    return {
      submitLoading: false,
      time: [],
      form: {
        aiTokenId: this.id,
        companyName: undefined,
        androidVoice: 1,
        nameTips: 1,
        pictureTips: 1,
        detectionInterval: 0.2,
        isLiving: 1,
        livingValue: 0.8,
        faceScore: 0.6,
        faceReliability: 0.4,
        adminPassword: '111111',
        fanStartTemperature: 40,
        fanStopTemperature: 30,
        ledBrightness: 50,
        color: 1,
        volume: 50,
        blueLevel: 50,
        whiteLevel: 50,
        greenLevel: 50,
        redLevel: 50,
        timerSwitch: 1,
        timedBoot: '05:00',
        timedShutdown: '03:00',
        errorTips: 2,
        saveErrorRecord: 2,
        faceAlignmentThreshold: 0.6,
        faceFrameScore: 0.6,
        facePoseScore: 0.6,
        faceKeyScore: 0.6,
        bestFaceScore: 0.6
      }
    }
  },
  methods: {
    // 监听时段一
    changeTime (value) {
      if (value === null) {
        this.$message.error('时段不可为空')
      } else if (HHssFormatter(value[1]) - HHssFormatter(value[0]) <= 5) {
        this.$message.error('关机时间和开机时间需相差5分钟')
      } else {
        this.form.timedBoot = value[0]
        this.form.timedShutdown = value[1]
      }
    },
    // 验证密码
    passwordFormatter () {
      // console.log(this.form.adminPassword)
    },
    // 格式化人脸间隔
    formatInterval (value) {
      return value + '秒'
    },
    // 格式化温度
    formatTemp (value) {
      return value + '℃'
    },
    // 获取Android数据
    getAndroidAICameraData (id) {
      httpGet(getAIAndroidParams + id)
        .then(res => {
          if (res.data !== null) {
            this.form = res.data
            this.time = [res.data.timedShutdown, res.data.timedBoot]
          }
        }).catch(() => {})
    },
    onSubmit () {
      let Reg = /^\d{6}$/
      if (this.form.companyName === '') {
        this.$message.error('公司名称不可为空')
      } else if (Reg.test(this.form.adminPassword)) {
        this.submitLoading = true
        httpPut(setAIAndroidParams, this.form)
          .then(res => {
            this.submitLoading = false
            this.$message.success(res.message)
          }).catch(() => {
            this.submitLoading = false
          })
      } else {
        this.$message.error('密码为6位数的数字')
      }
    }
  }
}
</script>

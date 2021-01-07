<template>
  <div>
    <el-form label-width="150px" label-position="right">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="公司名称" required>
            <el-input v-model="form.companyName"></el-input>
          </el-form-item>
          <el-form-item label="语音播报" required>
            <el-switch v-model="form.androidVoice" active-color="#13ce66" inactive-color="#ff4949" :active-value="1" :inactive-value="2"></el-switch>
          </el-form-item>
          <el-form-item label="名字提示" required>
            <el-switch v-model="form.nameTips" active-color="#13ce66" inactive-color="#ff4949" :active-value="1" :inactive-value="2"></el-switch>
          </el-form-item>
          <el-form-item label="图片提示" required>
            <el-switch v-model="form.pictureTips" active-color="#13ce66" inactive-color="#ff4949" :active-value="1" :inactive-value="2"></el-switch>
          </el-form-item>
          <el-form-item label="活体检测" required>
            <el-switch v-model="form.isLiving" active-color="#13ce66" inactive-color="#ff4949" :active-value="1" :inactive-value="2"></el-switch>
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
        </el-col>
        <el-col :span="12">
          <el-form-item label="密码设置" required>
            <el-input type="password" v-model="form.adminPassword" ></el-input>
          </el-form-item>
          <el-form-item label="人脸检测间隔" required>
            <el-slider v-model="form.detectionInterval" :min="0" :max="10" :format-tooltip="formatInterval" show-stops></el-slider>
          </el-form-item>
          <el-form-item label="人脸检测信度" required>
            <el-slider v-model="form.faceReliability" :min="0.1" :max="1" :step="0.1"  show-stops></el-slider>
          </el-form-item>
          <el-form-item label="活体检测阈值" required>
            <el-slider v-model="form.livingValue" :min="0.1" :max="1" :step="0.1" show-stops></el-slider>
          </el-form-item>
          <el-form-item label="人脸综合评分" required>
            <el-slider v-model="form.faceScore" :min="0.1" :max="1" :step="0.1" show-stops></el-slider>
          </el-form-item>
          <el-form-item label="最大人眼像素" required>
            <el-slider v-model="form.maxEyeDistance" :min="100" :max="500"></el-slider>
          </el-form-item>
          <el-form-item label="最小人眼像素" required>
            <el-slider v-model="form.minEyeDistance" :min="0" :max="99"></el-slider>
          </el-form-item>
          <el-form-item label="最多人脸数量" required>
            <el-slider v-model="form.maxNumFaces" :min="1" :max="3" :step = "1" show-stops></el-slider>
          </el-form-item>
          <el-form-item label="人脸质量设置" required>
            <el-slider v-model="form.faceQualityScore" :min="0.1" :max="1" :step="0.1" show-stops></el-slider>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item >
        <el-button :loading="submitLoading" type="primary" @click="onSubmit">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { httpGet, httpPut } from '@/utils/restful'
import { AIAndroidKFParams } from '@/api/url'
export default {
  name: 'android-ai-camera',
  props: {
    id: {
      required: true,
      type: Number
    }
  },
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
      form: {
        aiTokenId: this.id,
        companyName: undefined,
        androidVoice: 1,
        nameTips: 1,
        pictureTips: 1,
        detectionInterval: 0.2,
        isLiving: 0.8,
        livingValue: 0.8,
        faceScore: 0.6,
        faceReliability: 0.4,
        adminPassword: '111111',
        blueLevel: 50,
        whiteLevel: 50,
        greenLevel: 50,
        redLevel: 50,
        maxEyeDistance: 240,
        minEyeDistance: 30,
        maxNumFaces: 1,
        faceQualityScore: 0.5
      }
    }
  },
  methods: {
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
      httpGet(AIAndroidKFParams + '/' + id)
        .then(res => {
          if (res.data !== null) {
            this.form = res.data
          }
        }).catch(() => {})
    },
    onSubmit () {
      let Reg = /^\d{6}$/
      if (this.form.companyName === '') {
        this.$message.error('公司名称不可为空')
      } else if (Reg.test(this.form.adminPassword)) {
        this.submitLoading = true
        httpPut(AIAndroidKFParams, this.form)
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

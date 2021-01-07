<template>
  <div>
    <el-form label-width="150px" label-position="right">
      <el-row :gutter="20">
          <el-form-item label="旋转" required>
            <el-radio-group v-model="form.rotate">
              <el-radio :label="0">0</el-radio>
              <el-radio :label="1">90°</el-radio>
              <el-radio :label="2">180°</el-radio>
              <el-radio :label="3">270°</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="镜像" required>
            <el-radio-group v-model="form.mirror">
              <el-radio :label="0">关闭</el-radio>
              <el-radio :label="1">水平翻转</el-radio>
              <el-radio :label="2">垂直翻转</el-radio>
              <el-radio :label="3">水平垂直翻转</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="图像配置" required>
            <el-radio-group v-model="form.imageConfig" @change="configChange">
              <el-radio :label="0">自动模式</el-radio>
              <el-radio :label="1">白天模式</el-radio>
              <el-radio :label="2">夜间模式</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item  required>
            <el-tabs type="border-card"  v-model="activeName" @tab-click="handleClick">
              <el-tab-pane name="first">
                <span slot="label"><i class="fa fa-android"></i> 自动模式</span>
                <el-form label-width="100px" label-position="right">
                  <el-form-item label="日夜模式">
                    <el-radio-group v-model="form.aiImageConfigAutoInfoDto.dnMode">
                      <el-radio :label="0">主动模式</el-radio>
                      <el-radio :label="1">被动模式</el-radio>
                      <el-radio :label="2">定时模式</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <!-- 主动模式 -->
                  <div v-show="form.aiImageConfigAutoInfoDto.dnMode === 0">
                    <el-form-item label="日转夜阈值" required>
                      <el-slider v-model="form.aiImageConfigAutoInfoDto.d2nThreshold"></el-slider>
                    </el-form-item>
                    <el-form-item label="夜转日阈值" required>
                      <el-slider v-model="form.aiImageConfigAutoInfoDto.n2dThreshold"></el-slider>
                    </el-form-item>
                  </div>
                  <div v-show="form.aiImageConfigAutoInfoDto.dnMode !== 2">
                    <el-form-item label="灵敏度" required>
                      <el-slider v-model="form.aiImageConfigAutoInfoDto.sensitivity"></el-slider>
                    </el-form-item>
                  </div>
                  <div v-show="form.aiImageConfigAutoInfoDto.dnMode === 2">
                    <el-form-item label="定时模式" required>
                      <el-time-picker :clearable="false" @change="timeFormatter" is-range v-model="time" value-format="HH:mm" range-separator="-" start-placeholder="进入日模式" end-placeholder="进入夜模式"></el-time-picker>
                    </el-form-item>
                  </div>
                </el-form>
              </el-tab-pane>
              <el-tab-pane name="second">
                <span slot="label"><i class="fa fa-sun-o"></i> 白天模式</span>
                <el-form label-width="100px" label-position="right">
                  <el-form-item label="亮度" required>
                    <el-slider v-model="form.arr[0].brightness"></el-slider>
                  </el-form-item>
                  <el-form-item label="锐度" required>
                    <el-slider v-model="form.arr[0].sharpness"></el-slider>
                  </el-form-item>
                  <el-form-item label="饱和度" required>
                    <el-slider v-model="form.arr[0].saturation"></el-slider>
                  </el-form-item>
                  <el-form-item label="对比度" required>
                    <el-slider v-model="form.arr[0].contrast"></el-slider>
                  </el-form-item>
                  <el-form-item label="快门模式" required>
                    <el-radio-group v-model="form.arr[0].shutterType">
                      <el-radio :label="1">自动</el-radio>
                      <el-radio :label="2">手动</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <div v-show="form.arr[0].shutterType === 1">
                    <el-form-item label="最大快门" required>
                      <el-select v-model="form.arr[0].maximumShutter">
                        <el-option v-for="item in typeFormatter" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="最大增益" required>
                      <el-slider v-model="form.arr[0].contrast"></el-slider>
                    </el-form-item>
                  </div>
                  <div v-show="form.arr[0].shutterType === 2">
                    <el-form-item label="固定快门" required>
                      <el-select v-model="form.arr[0].fixedShutter">
                        <el-option v-for="item in typeFormatter" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="固定增益" required>
                      <el-slider v-model="form.arr[0].fixedGain"></el-slider>
                    </el-form-item>
                  </div>
                  <el-form-item label="光源控制" required>
                    <el-radio-group v-model="form.arr[0].lightControl">
                      <el-radio :label="0">均衡</el-radio>
                      <el-radio :label="1">中央权重</el-radio>
                      <el-radio :label="2">强光抑制</el-radio>
                      <el-radio :label="3">定制</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item label="白平衡" required>
                    <el-radio-group v-model="form.arr[0].whiteBalance">
                      <el-radio :label="1">自动</el-radio>
                      <el-radio :label="3">晴天</el-radio>
                      <el-radio :label="4">阴天</el-radio>
                      <el-radio :label="5">荧光</el-radio>
                      <el-radio :label="6">钨丝</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item label="宽动态" required>
                    <el-radio-group v-model="form.arr[0].wideDynamic">
                      <el-radio :label="0">关闭</el-radio>
                      <el-radio :label="1">低</el-radio>
                      <el-radio :label="2">高</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item label="光圈" required>
                    <el-radio-group v-model="form.arr[0].aperture">
                      <el-radio :label="0">手动</el-radio>
                      <el-radio :label="1">自动</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <div v-show="form.arr[0].aperture === 1">
                    <el-form-item label="光圈速度" required>
                      <el-slider v-model="form.arr[0].irisSpeed"></el-slider>
                    </el-form-item>
                  </div>
                  <el-form-item label="透雾强度" required>
                    <el-slider v-model="form.arr[0].penetrationFogIntensity"></el-slider>
                  </el-form-item>
                  <el-form-item label="颜色" required>
                    <el-radio-group v-model="form.arr[0].color">
                      <el-radio :label="1">彩色</el-radio>
                      <el-radio :label="2">黑白</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-form>
              </el-tab-pane>
              <el-tab-pane name="third">
                <span slot="label"><i class="fa fa-moon-o"></i> 夜间模式</span>
                <el-form label-width="100px" label-position="right">
                  <el-form-item label="亮度" required>
                    <el-slider v-model="form.arr[1].brightness"></el-slider>
                  </el-form-item>
                  <el-form-item label="锐度" required>
                    <el-slider v-model="form.arr[1].sharpness"></el-slider>
                  </el-form-item>
                  <el-form-item label="饱和度" required>
                    <el-slider v-model="form.arr[1].saturation"></el-slider>
                  </el-form-item>
                  <el-form-item label="对比度" required>
                    <el-slider v-model="form.arr[1].contrast"></el-slider>
                  </el-form-item>
                  <el-form-item label="快门模式" required>
                    <el-radio-group v-model="form.arr[1].shutterType">
                      <el-radio :label="1">自动</el-radio>
                      <el-radio :label="2">手动</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <div v-show="form.arr[1].shutterType === 1">
                    <el-form-item label="最大快门" required>
                      <el-select v-model="form.arr[1].maximumShutter">
                        <el-option v-for="item in typeFormatter" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="最大增益" required>
                      <el-slider v-model="form.arr[1].contrast"></el-slider>
                    </el-form-item>
                  </div>
                  <div v-show="form.arr[1].shutterType === 2">
                    <el-form-item label="固定快门" required>
                      <el-select v-model="form.arr[1].fixedShutter">
                        <el-option v-for="item in typeFormatter" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="固定增益" required>
                      <el-slider v-model="form.arr[1].fixedGain"></el-slider>
                    </el-form-item>
                  </div>
                  <el-form-item label="光源控制" required>
                    <el-radio-group v-model="form.arr[1].lightControl">
                      <el-radio :label="0">均衡</el-radio>
                      <el-radio :label="1">中央权重</el-radio>
                      <el-radio :label="2">强光抑制</el-radio>
                      <el-radio :label="3">定制</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item label="白平衡" required>
                    <el-radio-group v-model="form.arr[1].whiteBalance">
                      <el-radio :label="1">自动</el-radio>
                      <el-radio :label="3">晴天</el-radio>
                      <el-radio :label="4">阴天</el-radio>
                      <el-radio :label="5">荧光</el-radio>
                      <el-radio :label="6">钨丝</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item label="宽动态" required>
                    <el-radio-group v-model="form.arr[1].wideDynamic">
                      <el-radio :label="0">关闭</el-radio>
                      <el-radio :label="1">低</el-radio>
                      <el-radio :label="2">高</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item label="光圈" required>
                    <el-radio-group v-model="form.arr[1].aperture">
                      <el-radio :label="0">手动</el-radio>
                      <el-radio :label="1">自动</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <div v-show="form.arr[1].aperture === 1">
                    <el-form-item label="光圈速度" required>
                      <el-slider v-model="form.arr[1].irisSpeed"></el-slider>
                    </el-form-item>
                  </div>
                  <el-form-item label="透雾强度" required>
                    <el-slider v-model="form.arr[1].penetrationFogIntensity"></el-slider>
                  </el-form-item>
                  <el-form-item label="颜色" required>
                    <el-radio-group v-model="form.arr[1].color">
                      <el-radio :label="1">彩色</el-radio>
                      <el-radio :label="2">黑白</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-form>
              </el-tab-pane>
            </el-tabs>
          </el-form-item>
      </el-row>
      <el-form-item >
        <el-button :loading="submitLoading" type="primary" @click="onSubmit">保存</el-button>
        <el-button type="warning" @click="initValue">初始化</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { httpGet, httpPut } from '@/utils/restful'
import { getAILinuxParams, setAILinuxParams } from '@/api/url'
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
      this.setLinuxAICameraData(this.id)
    }
  },
  mounted () {
    this.data = this.form
    this.setLinuxAICameraData(this.id)
  },
  data () {
    return {
      submitLoading: false,
      activeName: 'first',
      typeFormatter: [
        {value: 1, label: '1/5'},
        {value: 2, label: '1/10'},
        {value: 3, label: '1/13'},
        {value: 4, label: '1/15'},
        {value: 5, label: '1/20'},
        {value: 6, label: '1/25(50HZ):1/30(60HZ)'},
        {value: 7, label: '1/50(50HZ):1/60(60HZ)'},
        {value: 8, label: '1/100(50HZ):1/120(60HZ)'},
        {value: 9, label: '1/125'},
        {value: 10, label: '1/200'},
        {value: 11, label: '1/250'},
        {value: 12, label: '1/500'},
        {value: 13, label: '1/1000'},
        {value: 14, label: '1/2000'},
        {value: 15, label: '1/5000'},
        {value: 16, label: '1/10000'},
        {value: 17, label: '1/20000'},
        {value: 18, label: '1/50000'}
      ],
      form: {
        rotate: 1,
        mirror: 2,
        imageConfig: 0,
        aiImageConfigAutoInfoDto: {
          imageConfig: 0,
          dnMode: 0,
          d2nThreshold: 75,
          n2dThreshold: 25,
          sensitivity: 30,
          d2nSec: 23400,
          n2dSec: 66600
        },
        arr: [
          {
            imageConfig: 1,
            brightness: 55,
            sharpness: 40,
            saturation: 50,
            contrast: 50,
            shutterType: 1,
            maximumShutter: 5,
            maximumGain: 45,
            lightControl: 0,
            fixedShutter: 6,
            fixedGain: 10,
            whiteBalance: 1,
            wideDynamic: 0,
            aperture: 0,
            irisSpeed: 30,
            penetrationFogIntensity: 0,
            color: 1
          },
          {
            imageConfig: 2,
            brightness: 48,
            sharpness: 50,
            saturation: 40,
            contrast: 50,
            shutterType: 1,
            maximumShutter: 2,
            maximumGain: 45,
            lightControl: 0,
            fixedShutter: 6,
            fixedGain: 20,
            whiteBalance: 1,
            wideDynamic: 0,
            aperture: 0,
            irisSpeed: 30,
            penetrationFogIntensity: 0,
            color: 2
          }
        ]
      },
      data: {},
      time: ['06:30', '08:30']
    }
  },
  methods: {
    handleClick (tab) {
      if (tab.name === 'first') this.form.imageConfig = 0
      if (tab.name === 'second') this.form.imageConfig = 1
      if (tab.name === 'third') this.form.imageConfig = 2
    },
    configChange (value) {
      if (value === 0) this.activeName = 'first'
      if (value === 1) this.activeName = 'second'
      if (value === 2) this.activeName = 'third'
    },
    timeFormatter (value) {
      if (value !== null) {
        let start = value[0]
        let end = value[1]
        this.form.aiImageConfigAutoInfoDto.d2nSec = Number(start.split(':')[0]) * 3600 + Number(start.split(':')[1]) * 60
        this.form.aiImageConfigAutoInfoDto.n2dSec = Number(end.split(':')[0]) * 3600 + Number(end.split(':')[1]) * 60
      } else {
        this.$message.error('时间不可为空')
      }
    },
    formatTime (value) {
      let hour = parseInt(value / 3600)
      hour = hour < 9 ? '0' + hour : hour
      let min = parseInt((value % 3600) / 60)
      min = min < 9 ? '0' + min : min
      return (hour + ':' + min)
    },
    // 获取Android数据
    setLinuxAICameraData (id) {
      httpGet(getAILinuxParams + id)
        .then(res => {
          if (res.data !== null) {
            this.form = res.data
            let arr = this.form.list
            delete this.form.list
            this.form = Object.assign(this.form, {arr: arr})
            let start = this.form.aiImageConfigAutoInfoDto.d2nSec
            let end = this.form.aiImageConfigAutoInfoDto.n2dSec
            this.time = [this.formatTime(start), this.formatTime(end)]
            if (this.form.configChange === 0) this.activeName = 'first'
            if (this.form.configChange === 1) this.activeName = 'second'
            if (this.form.configChange === 2) this.activeName = 'third'
          }
        }).catch(() => {})
    },
    onSubmit () {
      this.submitLoading = true
      let data = Object.assign(this.form, {aiTokenId: this.id})
      httpPut(setAILinuxParams, data)
        .then(res => {
          this.submitLoading = false
          this.$message.success(res.message)
        }).catch(() => {
          this.submitLoading = false
        })
    },
    initValue () {
      this.$confirm('确认初始化当前的设定吗？', '提示', {})
        .then(() => {
          this.form = this.data
        }).catch(() => {})
    }
  }
}
</script>

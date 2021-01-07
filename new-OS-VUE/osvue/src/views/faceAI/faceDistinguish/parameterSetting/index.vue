<template>
<div v-if="ifShow">
  <!-- 普通用户显示简单设置模块 -->
  <div v-if="!ifAdministrator">
    <div class="app-container">
      <div class="table-main">
        <h3 style="margin:0px" >人脸参数校验系数设置</h3>
          <div class="module">
            <span class="demonstration">校验程度设置</span>
              <el-select v-model="series" placeholder="请选择">
                <el-option
                  v-for="item in seriesMarks"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
          </div>
      </div>
    </div>
  </div>
  <!-- 管理员显示复杂设置米快 -->
  <div v-if="ifAdministrator">
    <!-- 遮挡范围模块 -->
    <div class="app-container">
      <div class="table-main">
        <h3 style="margin:0px" @click="ifSilder = !ifSilder">遮挡范围设置</h3>
        <el-collapse-transition>
        <div v-show="ifSilder" class="silderDiv">
          <div class="module">
            <span class="demonstration">左眼被遮挡的阈值: 参数越大表示被遮挡的范围越大，100表示完全遮挡</span>
            <el-slider v-model="left_eye" :marks="occlusionMarks"></el-slider>
          </div>
          <div class="module">
            <span class="demonstration">右眼被遮挡的阈值:</span>
            <el-slider v-model="right_eye" :marks="occlusionMarks"></el-slider>
          </div>
          <div class="module">
            <span class="demonstration">鼻子被遮挡的阈值:</span>
            <el-slider v-model="nose" :marks="occlusionMarks"></el-slider>
          </div>
          <div class="module">
            <span class="demonstration">嘴巴被遮挡的阈值:</span>
            <el-slider v-model="mouth" :marks="occlusionMarks"></el-slider>
          </div>
          <div class="module">
            <span class="demonstration">左脸被遮挡的阈值:</span>
            <el-slider v-model="left_cheek" :marks="occlusionMarks"></el-slider>
          </div>
          <div class="module">
            <span class="demonstration">右脸被遮挡的阈值:</span>
            <el-slider v-model="right_cheek" :marks="occlusionMarks"></el-slider>
          </div>
          <div class="module">
            <span class="demonstration">下巴被遮挡的阈值:</span>
            <el-slider v-model="chin_contour" :marks="occlusionMarks"></el-slider>
          </div>
        </div>
        </el-collapse-transition>
      </div>
    </div>
    <!-- 人脸参数模块 -->
    <div class="app-container">
      <div class="table-main">
        <h3 style="margin:0px" @click="ifAmbiguity = !ifAmbiguity">人脸参数设置</h3>
        <el-collapse-transition>
        <div v-show="ifAmbiguity" class="silderDiv">
          <div class="module">
            <span class="demonstration">人脸区域的宽度: 宽度像素小于该值检验不通过</span>
            <el-slider :marks="widthMarks" :min="60" :max="200" v-model="width"></el-slider>
          </div>
          <div class="module">
            <span class="demonstration">人脸区域的高度: 人脸大小不能小于宽度*高度</span>
            <el-slider :marks="heightMarks" :min="0" :max="200" v-model="height"></el-slider>
          </div>
          <div class="module">
            <span class="demonstration">人脸区域离上边界距离占图片高度比值:</span>
            <el-slider :marks="occlusionMarks" v-model="top"></el-slider>
          </div>
          <div class="module">
            <span class="demonstration">人脸区域离左边界距离占图片宽度比值:</span>
            <el-slider :marks="occlusionMarks" v-model="left"></el-slider>
          </div>
          <div class="module">
            <span class="demonstration">人脸模糊程度: 0表示清晰，100表示模糊</span>
            <el-slider :marks="occlusionMarks" v-model="blur"></el-slider>
          </div>
          <div class="module">
            <span class="demonstration">左眼状态: 越接近0闭合的可能性越大</span>
            <el-slider :marks="occlusionMarks" v-model="leftEyeStatus"></el-slider>
          </div>
          <div class="module">
            <span class="demonstration">右眼状态: 越接近0闭合的可能性越大</span>
            <el-slider :marks="occlusionMarks" v-model="rightEyeStatus"></el-slider>
          </div>
          <div class="module">
            <span class="demonstration">情绪:</span>
            <el-select v-model="emotionType" multiple placeholder="请选择">
              <el-option
                v-for="item in emotionTypeList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="module">
            <span class="demonstration">表情:</span>
            <el-select  multiple v-model="expressionType" placeholder="请选择">
              <el-option
                v-for="item in expressionTypeList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="module">
            <span class="demonstration">是否带墨镜:</span>
            <el-select v-model="glassesType" placeholder="请选择">
              <el-option
                v-for="item in glassesTypeList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
        </div>
        </el-collapse-transition>
      </div>
    </div>
    <!-- 其他模块 -->
    <div class="app-container">
      <div class="table-main">
        <h3 style="margin:0px" @click="ifFaceRegion = !ifFaceRegion">其他设置</h3>
        <el-collapse-transition>
        <div v-show="ifFaceRegion" class="silderDiv">
          <div class="module">
            <span class="demonstration">人脸置信度: 代表这是一张人脸的概率，0最小、100最大。</span>
            <el-slider :marks="occlusionMarks" v-model="faceProbability"></el-slider>
          </div>
          <div class="module">
            <span class="demonstration">表情置信度: </span>
            <el-slider :marks="occlusionMarks" v-model="expressionProbability"></el-slider>
          </div>
          <div class="module">
            <span class="demonstration">眼镜置信度: </span>
            <el-slider :marks="occlusionMarks" v-model="glassesProbability"></el-slider>
          </div>
          <div class="module">
            <span class="demonstration">情绪置信度: </span>
            <el-slider :marks="occlusionMarks" v-model="emotionProbability"></el-slider>
          </div>
          <div class="module">
            <span class="demonstration">最小光照程度: 表示脸部区域的光照程度 越大表示光照越好</span>
            <el-slider :marks="marksIlluminationMin" :min="0" :max="150" v-model="illuminationMin"></el-slider>
          </div>
          <div class="module">
            <span class="demonstration">最大光照程度: 表示脸部区域的光照程度 越大表示光照越好</span>
            <el-slider :marks="marksIlluminationMax" :min="150" :max="255" v-model="illuminationMax"></el-slider>
          </div>
          <div class="module">
            <span class="demonstration">人脸框相对于竖直方向的顺时针旋转角: 大于该设定值检验不通过</span>
            <el-slider :marks="marks180" :min="0" :max="180" v-model="rotation"></el-slider>
          </div>
          <div class="module">
            <span class="demonstration">三维旋转之左右旋转角: 大于该设定值检验不通过</span>
            <el-slider :marks="marks90" :min="0" :max="90" v-model="yaw"></el-slider>
          </div>
          <div class="module">
            <span class="demonstration">三维旋转之俯仰角度: 大于该设定值检验不通过</span>
            <el-slider :marks="marks90" :min="0" :max="90" v-model="pitch"></el-slider>
          </div>
          <div class="module">
            <span class="demonstration">平面内旋转角: 大于该设定值检验不通过</span>
            <el-slider :marks="marks180" :min="0" :max="180" v-model="roll"></el-slider>
          </div>
          <div class="module">
            <span class="demonstration">是否过度美颜: spoofing值高于此值判断为合成图  </span>
            <el-select v-model="spoofing" placeholder="请选择">
              <el-option
                v-for="item in spoofingList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
        </div>
        </el-collapse-transition>
      </div>
    </div>
  </div>
  <div class="preservation">
    <el-button type="primary" @click="primary">保存</el-button>
    <el-button @click="restoreDefault">恢复默认</el-button>
    </div>
</div>
</template>
<script>
import { toFloat, toPercent } from '@/utils/formatter.js'
import { preservationParam, getDefaultParam, getParamByDepartmentId, isAdmin } from '@/api/url.js'
import { httpGet, httpPost } from '@/utils/restful'
import calibrationSeries from '@/utils/calibrationSeries.js'

export default {
  name: '',
  data () {
    return {
      ifShow: false,
      seriesMarks: [{
        value: 0,
        label: '宽松'
      }, {
        value: 1,
        label: '较为宽松'
      }, {
        value: 2,
        label: '正常'
      }, {
        value: 3,
        label: '较为严格'
      }, {
        value: 4,
        label: '严格'
      }],
      series: 2,
      ifAdministrator: true, // 是否是管理员
      // 遮挡范围区域
      ifSilder: true, // 遮挡范围卡片是否显示
      left_eye: 0, // 左眼阈值
      right_eye: 0, // 右眼阈值
      nose: 0, // 鼻子阈值
      mouth: 0, // 嘴巴阈值
      left_cheek: 0, // 左脸阈值
      right_cheek: 0, // 右脸阈值
      chin_contour: 0, // 下巴阈值

      // 人脸参数设置
      ifAmbiguity: true, // 模糊度卡片是否显示
      top: 0, // 人脸区域离上边界的距离
      left: 0, // 人脸区域离左边界的距离
      width: 80, // 人脸区域的宽度限制
      height: 0, // 人脸区域的高度限制
      expressionTypeList: [
        {value: 'smile', label: '微笑'}, {value: 'laugh', label: '大笑'}
      ], // 表情数组
      expressionType: [], // 选中的表情数组
      glassesTypeList: [ // 眼镜参数数组
        {value: 'sun', label: '是'}, {value: null, label: '否'} // 眼镜数组
      ],
      glassesType: undefined, // 选择的眼镜参数
      blur: 0, // 人脸模糊程度
      leftEyeStatus: 0, // 左眼状态
      rightEyeStatus: 0, // 右眼状态
      emotionTypeList: [
        {value: 'grimace', label: '鬼脸'},
        {value: 'pouty', label: '撅嘴'},
        {value: 'angry', label: '愤怒'},
        {value: 'disgust', label: '厌恶'},
        {value: 'fear', label: '恐惧'},
        {value: 'happy', label: '高兴'},
        {value: 'sad', label: '伤心'},
        {value: 'surprise', label: '惊讶'}
      ], // 表情选择数组
      emotionType: null, // 选中的表情

      // 其他参数设置
      spoofing: undefined, // 是否为合成图
      expressionProbability: 0, // 表情置信度
      spoofingList: [
        {value: 0.002, label: '0.002'},
        {value: 0.006, label: '0.006'},
        {value: 0.01, label: '0.01'},
        {value: 0.013, label: '0.013'},
        {value: 0.02, label: '0.02'}
      ],
      glassesProbability: 0, // 眼镜置信度
      emotionProbability: 0, // 情绪置信度
      faceProbability: 0, // 人脸置信度
      ifFaceRegion: true, // 人脸区域边界模块是否显示
      illuminationMin: 0, // 最小光照程度
      illuminationMax: 200, // 最大光照程度
      rotation: 0,
      yaw: 0,
      pitch: 0,
      roll: 0,
      occlusionMarks: {
        0: '0',
        25: '25',
        50: '50',
        75: '75',
        100: '100'
      },
      marks90: {
        '0': '0°',
        '90': '90°'
      },
      marks180: {
        '0': '0°',
        '180': '180°'
      },
      marksIlluminationMax: {
        '150': '150',
        '255': '255'
      },
      marksIlluminationMin: {
        '0': '0',
        '50': '50',
        '150': '150'
      },
      heightMarks: {
        '0': '0',
        '100': '100',
        '200': '200'
      },
      widthMarks: {
        '60': '60',
        '130': '130',
        '200': '200'
      }
    }
  },
  created () {
    this.requestIfAdministrator()
  },
  methods: {
    requestIfAdministrator () {
      let self = this
      httpGet(isAdmin).then(res => {
        if (res.message === '1') {
          self.ifAdministrator = true
          self.ifShow = true
          self.getData()
        } else {
          self.ifAdministrator = false
          self.ifShow = true
          httpGet(getParamByDepartmentId + self.$store.getters.departmentId).then(res => {
            let data = res.data
            for (let i = 0; i < calibrationSeries.length; i++) {
              if (data.left === calibrationSeries[i].left) {
                self.series = i
                break
              }
            }
          })
        }
      })
    },
    // 点击保存按钮
    primary () {
      let self = this
      if (this.ifAdministrator) {
        let config = {
          departmentId: this.$store.getters.departmentId,
          left: toFloat(this.top),
          top: toFloat(this.top),
          width: this.width,
          height: this.height,
          rotation: this.rotation,
          faceProbability: toFloat(this.faceProbability),
          yaw: this.yaw,
          pitch: this.pitch,
          roll: this.roll,
          expressionType: this.expressionType.join(','),
          glassesType: this.glassesType,
          leftEye: toFloat(this.left_eye),
          rightEye: toFloat(this.right_eye),
          nose: toFloat(this.nose),
          mouth: toFloat(this.mouth),
          leftCheek: toFloat(this.left_cheek),
          rightCheek: toFloat(this.right_cheek),
          chinContour: toFloat(this.chin_contour),
          blur: toFloat(this.blur),
          illuminationMin: this.illuminationMin,
          illuminationMax: this.illuminationMax,
          leftEyeStatus: toFloat(this.leftEyeStatus),
          rightEyeStatus: toFloat(this.rightEyeStatus),
          expressionProbability: toFloat(this.expressionProbability),
          glassesProbability: toFloat(this.glassesProbability),
          emotionProbability: toFloat(this.emotionProbability),
          emotionType: this.emotionType.join(','),
          spoofing: this.spoofing,
          isDefault: 0
        }
        httpPost(preservationParam, config).then(
          res => {
            if (res.code && res.code === 1) {
              this.$message({
                message: '保存成功',
                type: 'success'
              })
            } else {
              this.$message.error('保存失败')
            }
          }
        ).catch(() => {
          this.$message.error('保存失败')
        })
      } else {
        httpPost(preservationParam, {...calibrationSeries[self.series], departmentId: this.$store.getters.departmentId}).then(
          res => {
            if (res.code && res.code === 1) {
              this.$message({
                message: '保存成功',
                type: 'success'
              })
            } else {
              this.$message.error('保存失败')
            }
          }
        ).catch(() => {
          this.$message.error('保存失败')
        })
      }
    },
    // 恢复默认
    restoreDefault () {
      if (this.ifAdministrator) {
        httpGet(getDefaultParam).then(res => {
          let data = res.data
          this.width = data.width
          this.height = data.height
          this.rotation = data.rotation
          this.faceProbability = toPercent(data.faceProbability)
          this.yaw = data.yaw
          this.pitch = data.pitch
          this.roll = data.roll
          this.expressionType = data.expressionType.split(',')
          this.glassesType = data.glassesType
          this.left_eye = toPercent(data.leftEye)
          this.right_eye = toPercent(data.rightEye)
          this.nose = toPercent(data.nose)
          this.mouth = toPercent(data.mouth)
          this.left_cheek = toPercent(data.leftCheek)
          this.right_cheek = toPercent(data.rightCheek)
          this.chin_contour = toPercent(data.chinContour)
          this.blur = toPercent(data.blur)
          this.top = toPercent(data.top)
          this.illuminationMin = data.illuminationMin
          this.illuminationMax = data.illuminationMax
          this.leftEyeStatus = toPercent(data.leftEyeStatus)
          this.rightEyeStatus = toPercent(data.rightEyeStatus)
          this.left = toPercent(data.left)
          this.expressionProbability = toPercent(data.rightEyeStatus)
          this.glassesProbability = toPercent(data.glassesProbability)
          this.emotionProbability = toPercent(data.emotionProbability)
          this.emotionType = data.emotionType.split(',')
          this.spoofing = data.spoofing
        })
      } else {
        this.series = 2
      }
    },
    // 进入页面时获取参数设置
    getData () {
      httpGet(getParamByDepartmentId + this.$store.getters.departmentId).then(
        res => {
          let data = res.data
          this.width = data.width
          this.height = data.height
          this.rotation = data.rotation
          this.faceProbability = toPercent(data.faceProbability)
          this.yaw = data.yaw
          this.pitch = data.pitch
          this.roll = data.roll
          this.expressionType = data.expressionType.split(',')
          this.glassesType = data.glassesType
          this.left_eye = toPercent(data.leftEye)
          this.right_eye = toPercent(data.rightEye)
          this.nose = toPercent(data.nose)
          this.mouth = toPercent(data.mouth)
          this.top = toPercent(data.top)
          this.left = toPercent(data.left)
          this.left_cheek = toPercent(data.leftCheek)
          this.right_cheek = toPercent(data.rightCheek)
          this.chin_contour = toPercent(data.chinContour)
          this.blur = toPercent(data.blur)
          this.illuminationMin = data.illuminationMin
          this.illuminationMax = data.illuminationMax
          this.leftEyeStatus = toPercent(data.leftEyeStatus)
          this.rightEyeStatus = toPercent(data.rightEyeStatus)
          this.emotionType = data.emotionType.split(',')
          this.expressionProbability = toPercent(data.rightEyeStatus)
          this.glassesProbability = toPercent(data.glassesProbability)
          this.emotionProbability = toPercent(data.emotionProbability)
          this.spoofing = data.spoofing
        }
      )
    }
  }
}
</script>
<style lang='scss' scoped>
.module{
  width: 30%;
  padding-top: 15px;;
}
.flex{
  display: flex;
}
.router-slid-enter-active, .router-slid-leave-active {
  transition: all .4s;
}
.router-slid-enter, .router-slid-leave-active {
  transform: translate3d(0, 3rem, 0);
  opacity: 0;
}
.silderDiv{
  padding-left: 25px;;
  margin-bottom: 25px;
}
.preservation{
  width: 100%;
  display: flex;
  justify-content: center;
  padding-bottom: 30px;
}
</style>

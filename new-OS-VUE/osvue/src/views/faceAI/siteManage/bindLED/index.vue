<template>
  <div class="app-container">
    <div class="table-main">
      <el-form ref="form" :rules="formRules" :model="form" label-width="120px">
        <el-form-item label="模式" prop="ledType">
          <el-select v-model="form.ledType" @change="restForm">
              <el-option v-for="item in protocolData"  :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="相机选择" prop="aiTokenIdArr">
          <!-- <el-radio-group v-model="form.aiTokenIdArr">
            <el-radio v-for="item in cameraList" :label="item" :key="item.id" :value="item.id">{{item.name}}</el-radio>
          </el-radio-group> -->
          <el-checkbox-group v-model="form.aiTokenIdArr">
            <el-checkbox  v-for="item in cameraList" :label="item.id" :key="item.id">{{item.localName}}</el-checkbox>
            <el-checkbox v-show="cameraList.length === 0" disabled>部门下暂无相机可选择</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item :label="`${form.ledType == 0 ? '唯一标识' : 'Mac'}`" prop="mac">
            <el-input class="filter-item" v-if="form.ledType == 0" @input="macFn" @blur="checkOneMac" v-model="form.mac" placeholder="请输入唯一标识符"></el-input>
            <!-- <el-button v-if="form.ledType == 0" type="primary" @click="gainMac">获取Mac</el-button> -->
            <el-input class="filter-item" v-if="form.ledType == 1" @input="macChange" v-model="form.mac" @blur="checkMac" placeholder="请输入Mac"></el-input>
        </el-form-item>
        <el-form-item label="通道名称"  prop="localName">
          <el-input  class="filter-item" placeholder="请输入通道名称" v-model="form.localName"></el-input>
        </el-form-item>
        <el-form-item label="LED屏宽度" v-if="form.ledType == 0"  prop="ledWidth">
          <el-input  class="filter-item" placeholder="请输入LED屏宽度" type="number" v-model="form.ledWidth"></el-input>
        </el-form-item>
        <el-form-item label="LED屏高度" v-if="form.ledType == 0"  prop="ledHeight">
          <el-input  class="filter-item" placeholder="请输入LED屏高度" type="number" v-model="form.ledHeight"></el-input>
        </el-form-item>
        <el-form-item label="LED屏亮度" v-if="form.ledType == 0" prop="ledBrightness">
          <el-slider v-model="form.ledBrightness" :min="1" :max="16" style="width:200px"></el-slider>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="savaInfo">保存</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { checkAICamera, bindApp, validtorMac, getMac } from '@/api/url'
import { httpGet, httpPost } from '@/utils/restful'
// import { checkMac } from '@/utils/validator'
export default {
  data () {
    return {
      form: {
        ledType: 0,
        mac: undefined,
        localName: undefined,
        ledHeight: undefined,
        ledWidth: undefined,
        ledBrightness: 6,
        aiTokenIdArr: []
      },
      cameraList: [],
      protocolData: [
        {
          id: 0,
          name: 'bx-5e1'
        },
        {
          id: 1,
          name: '安卓系统'
        }
      ],
      formRules: {
        ledType: [
          {required: true, trigger: 'change', message: '请选择模式'}
        ],
        // mac1: [
        //   {required: true, trigger: 'blur', message: '请填写MAC地址'},
        //   {validator: checkMac, trigger: 'blur'},
        //   {minlength: 17, maxlength: 17, trigger: 'blue', message: '请输入正确的MAC地址'}
        // ],
        mac: [
          {required: true, trigger: 'blur', message: '请填写正确的Mac地址'}
        ],
        // aiTokenIdArr: [
        //   {required: true, trigger: 'blur', message: '请选择相机'}
        // ],
        localName: [
          {required: true, trigger: 'blur', message: '请输入通道名称'}
        ],
        ledHeight: [
          {required: true, trigger: 'blur', message: '请输入LED屏高度'}
        ],
        ledWidth: [
          {required: true, trigger: 'blur', message: '请输入LED屏宽度'}
        ]
      }
    }
  },
  created () {
    this.selectCamera()
  },
  methods: {
    selectCamera () {
      httpGet(checkAICamera + this.$store.getters.departmentId) // this.$store.getters.departmentId
        .then((res) => {
          console.log(res)
          if (res.data !== null) {
            this.cameraList = res.data
          }
        })
    },
    macFn (value) {
      if (value.length > 12) {
        this.$nextTick(() => {
          this.form.mac = this.form.mac.substring(0, 12)
        })
        this.$message.error('请输入正确的标识符')
      }
    },
    checkOneMac () {
      var reg = /^[0-9]{12}$/
      if (reg.test(this.form.mac)) {
        httpGet(validtorMac + '/' + this.form.mac)
          .then((res) => {
            this.$message({
              message: res.message,
              type: 'warning',
              duration: 4000
            })
          }).catch(() => {
          })
      } else {
        this.form.mac = ''
      }
    },
    restForm (val) {
      console.log(val)
      this.form = {
        ledType: val,
        mac: undefined,
        localName: undefined,
        ledHeight: undefined,
        ledWidth: undefined,
        ledBrightness: 6,
        aiTokenIdArr: []
      }
    },
    macChange (value) {
      if (value.length === 2) this.form.mac = this.form.mac + ':'
      if (value.length === 5) this.form.mac = this.form.mac + ':'
      if (value.length === 8) this.form.mac = this.form.mac + ':'
      if (value.length === 11) this.form.mac = this.form.mac + ':'
      if (value.length === 14) this.form.mac = this.form.mac + ':'
      if (value.length > 17) {
        this.$nextTick(() => {
          this.form.mac = this.form.mac.substring(0, 17)
        })
        // this.$message.error('请输入正确的MAC地址')
      }
    },
    savaInfo () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.form.ledHeight = Number(this.form.ledHeight)
          this.form.ledWidth = Number(this.form.ledWidth)
          let ledAppBindDto = Object.assign(this.form, {departmentId: this.$store.getters.departmentId})
          httpPost(bindApp, ledAppBindDto)
            .then((res) => {
              this.$message({
                message: res.message,
                type: 'success',
                duration: 4000
              })
              this.form = {
                ledType: 0,
                mac: undefined,
                localName: undefined,
                ledHeight: undefined,
                ledWidth: undefined,
                ledBrightness: 6,
                aiTokenIdArr: []
              }
              // location.reload() // 刷新，避免BUG
            }).catch(() => {})
        }
      })
    },
    checkMac () {
      if (this.form.ledType === 1) {
        const regMac = /^([A-Fa-f0-9]{2}:){5}[A-Fa-f0-9]{2}$/
        if (regMac.test(this.form.mac)) {
          httpGet(validtorMac + '/' + this.form.mac)
            .then((res) => {
              this.$message({
                message: res.message,
                type: 'warning',
                duration: 4000
              })
            }).catch(() => {
            })
        } else {
          this.$message.error('请输入正确的mac地址')
          this.form.mac = ''
        }
      }
    },
    gainMac () {
      if (this.form.mac === undefined) {
        httpPost(getMac)
          .then((res) => {
            this.form.mac = res.data
          })
      } else {
        this.$message({
          message: '已有Mac，将不在获取',
          type: 'warning',
          duration: 4000
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.el-input{
    width: auto;
}
</style>

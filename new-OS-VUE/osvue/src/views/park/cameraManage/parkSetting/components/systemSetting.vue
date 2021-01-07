<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>设置系统参数</span>
    </div>
    <el-form label-position="right" label-width="180px">
      <el-form-item label="对比车牌位数(3-10)" v-show="bindStatus">
        <el-input-number v-model="formSystem.basePlate" :min="3" :max="10" controls-position="right"></el-input-number>
      </el-form-item>
      <el-form-item label="固定车剩余天数开始播报" >
        <el-input-number v-model="formSystem.parMonthcarDate" :min="0" :max="10000" controls-position="right"></el-input-number>
      </el-form-item>
      <el-form-item label="预付后离场时间(分)" >
        <el-input-number v-model="formSystem.payOuttime" :min="0" :max="10000" controls-position="right"></el-input-number>
      </el-form-item>
      <el-form-item label="固定车过期可进入" v-show="((bindStatus  === false && idType === 6) ? true : bindStatus)">
        <el-select v-model="formSystem.mothcarOuttimePass" placeholder="请选择"> <el-option v-for="item in optionMonthOutCanPass" :key="item.value" :label="item.label" :value="item.value"> </el-option> </el-select>
      </el-form-item>
      <el-form-item label="临时车入场车位已满" v-show="bindStatus">
        <el-select v-model="formSystem.flagAll6" placeholder="请选择"> <el-option v-for="item in optionFlagAll" :key="item.value" :label="item.label" :value="item.value"> </el-option> </el-select>
      </el-form-item>
      <el-form-item label="固定车入场车位已满" v-show="bindStatus">
        <el-select v-model="formSystem.flagAll7" placeholder="请选择"> <el-option v-for="item in optionFlagAll" :key="item.value" :label="item.label" :value="item.value"> </el-option> </el-select>
      </el-form-item>
      <el-form-item label="无入场记录出口允许开闸">
        <el-select v-model="formSystem.voidRecPass" placeholder="请选择"> <el-option v-for="item in optionCan" :key="item.value" :label="item.label" :value="item.value"> </el-option> </el-select>
      </el-form-item>
      <el-form-item label="识别记录保存" v-show="bindStatus">
        <el-select v-model="formSystem.recordMakeMode" placeholder="请选择"> <el-option v-for="item in optionRecordMake" :key="item.value" :label="item.label" :value="item.value"> </el-option> </el-select>
      </el-form-item>
      <el-form-item label="是否启用一位多车" v-show="bindStatus">
        <el-select v-model="formSystem.enUsercars" placeholder="请选择" @change="changeEnUsercars"> <el-option v-for="item in optionUse" :key="item.value" :label="item.label" :value="item.value"> </el-option> </el-select>
      </el-form-item>
      <div v-show="disabled">
        <el-form-item label="高级白名单">
          <el-select v-model="formSystem.enCyWhiteList" placeholder="请选择"> <el-option v-for="item in optionUse" :key="item.value" :label="item.label" :value="item.value"> </el-option> </el-select>
        </el-form-item>
      </div>
      <div v-show="!disabled">
        <el-form-item label="一位多车模式" v-show="bindStatus">
          <el-select v-model="formSystem.enUsercarsMode" placeholder="请选择">
            <el-option v-for="item in enUsercarsModeType" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
      </div>
      <div v-if="isShowColumnFormatter(['单日单车限额'])">
        <el-form-item label="是否启用单日单车最大限额">
          <el-select v-model="formSystem.enOnePlateAndOneDayMaxMoney" placeholder="请选择" @change="changeEnOnePlateAndOneDay">
            <el-option v-for="item in optionUse" :key="item.value" :label="item.label" :value="item.value"> </el-option>
          </el-select>
          <el-input-number v-show="disabledOnePlateAndOneDaySet" v-model="formSystem.onePlateAndOneDayMaxMoney" :min="0" :max="10000" controls-position="right"></el-input-number>
        </el-form-item>
      </div>
      <el-form-item>
        <el-button type="primary" :loading="createLoading" @click="onSubmitSystem">保存设置</el-button>
      </el-form-item>

      <!-- 调试级别的设置 -->
      <el-card class="box-card debug-box" v-if="idType !== 6">
        <div slot="header" class="clearfix">
        <span>调试设置(正常情况下不建议开启)</span>
      </div>
        <el-form-item label="是否开启相机日志" >
          <el-select v-model="formSystem.debugLevel" placeholder="请选择">
            <el-option v-for="item in openLogType" :key="item.valueNo" :label="item.valueName" :value="item.valueNo"></el-option>
          </el-select>
        </el-form-item>
      </el-card>
    </el-form>
  </el-card>
</template>
<style lang="scss" scoped>
.box-card {
  position: relative;
  .debug-box {
    position: absolute;
    top: 50%;
    left: 65%;
    width: 30%;
  }
}
</style>

<script>
import { SystemSetting } from '@/api/url'
import { isShowColumnFormatter } from '@/utils/formatter.js'
import { openLogType } from '@/utils/selectAble.js'
import { httpGet, httpPut, httpPost } from '@/utils/restful'
export default {
  name: 'systemSetting',
  data () {
    return {
      disabled: true,
      idType: undefined,
      isShowColumnFormatter: isShowColumnFormatter,
      disabledOnePlateAndOneDaySet: false,
      createLoading: false,
      openLogType: openLogType,
      enUsercarsModeType: [
        {
          value: 1,
          label: '后进场的车付款'
        },
        {
          value: 2,
          label: '先出场的车付款'
        },
        {
          value: 3,
          label: '车位满不让进场'
        }
      ],
      optionMonthOutCanPass: [{
        value: 0,
        label: '不可进入'
      }, {
        value: 1,
        label: '可进入'
      }],
      optionFlagAll: [{
        value: 0,
        label: '提示车位已满'
      }, {
        value: 1,
        label: '可通行'
      }],
      optionCan: [{
        value: 0,
        label: '不允许'
      }, {
        value: 1,
        label: '允许'
      }],
      optionRecordMake: [{
        value: 0,
        label: '识别后直接保存'
      }, {
        value: 1,
        label: '开闸后才保存'
      }],
      optionUse: [{
        value: 0,
        label: '不启用'
      }, {
        value: 1,
        label: '启用'
      }],
      formSystem: {
        id: undefined,
        basePlate: 8,
        parMonthcarDate: 7,
        payOuttime: 15,
        departmentId: this.$store.getters.departmentId,
        mothcarOuttimePass: 1,
        flagAll6: 1,
        flagAll7: 1,
        voidRecPass: 1,
        recordMakeMode: 1,
        enUsercars: 0,
        enCyWhiteList: 1,
        enOnePlateAndOneDayMaxMoney: 0,
        onePlateAndOneDayMaxMoney: 0.01,
        debugLevel: 6
      },
      createloading: false
    }
  },
  created () {
    this.idType = JSON.parse(localStorage.getItem('idType'))
  },
  mounted () {
    this.getSystemSettingInfo()
  },
  props: ['bindStatus'],
  methods: {
    changeEnUsercars (value) {
      if (value === 0) {
        this.disabled = true
      } else {
        this.formSystem.enCyWhiteList = 1
        this.disabled = false
      }
    },
    changeEnOnePlateAndOneDay (value) {
      if (value === 1) {
        this.formSystem.onePlateAndOneDayMaxMoney = 0.01
        this.disabledOnePlateAndOneDaySet = true
      } else {
        this.disabledOnePlateAndOneDaySet = false
      }
    },
    getSystemSettingInfo () {
      httpGet(SystemSetting + '/' + this.$store.getters.departmentId).then(res => {
        if (res.data !== null) {
          this.formSystem = Object.assign({}, res.data)
          if (this.formSystem.onePlateAndOneDayMaxMoney > 0) {
            this.formSystem.enOnePlateAndOneDayMaxMoney = 1
            this.disabledOnePlateAndOneDaySet = true
          } else {
            this.formSystem.enOnePlateAndOneDayMaxMoney = 0
            this.disabledOnePlateAndOneDaySet = false
          }
          if (this.formSystem.enUsercars === 0) {
            this.disabled = true
          } else {
            this.disabled = false
          }
        }
      }).catch(() => {})
    },
    onSubmitSystem () {
      let self = this
      this.createloading = true
      let HTTP
      if (this.formSystem.id) {
        HTTP = httpPut
      } else {
        HTTP = httpPost
      }
      let params = this.formSystem
      if (this.formSystem.enOnePlateAndOneDayMaxMoney === 0) {
        params = Object.assign(params, {onePlateAndOneDayMaxMoney: -1})
      }
      HTTP(SystemSetting, params).then(res => {
        this.createloading = false
        if (!this.formSystem.id) {
          // 新增操作要重新加载id,避免重复提交
          self.getSystemSettingInfo()
        }
        this.$message({
          message: res.message,
          type: 'success',
          duration: 4 * 1000
        })
      }).catch(() => {
        this.createloading = false
      })
    }
  }
}
</script>

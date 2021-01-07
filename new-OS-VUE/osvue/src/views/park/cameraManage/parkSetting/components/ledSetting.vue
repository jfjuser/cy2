<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>LED设置</span>
    </div>
    <el-form label-position="right" label-width="130px">
      <el-form-item label="LED行数"  >
        <el-select v-model="formLed.count" placeholder="请选择"> <el-option v-for="item in optionLedCount" :key="item.value" :label="item.label" :value="item.value"> </el-option> </el-select>
      </el-form-item>
      <el-form-item label="广告语"  >
        <el-input  v-model="formLed.ledAdv"></el-input>
      </el-form-item>
      <el-form-item v-if="formLed.count >= 2" label="广告语2"  >
        <el-input  v-model="formLed.ledAdv2"></el-input>
      </el-form-item>
      <el-form-item v-if="formLed.count >= 3" label="广告语3"  >
        <el-input  v-model="formLed.ledAdv3"></el-input>
      </el-form-item>
      <el-form-item v-if="formLed.count >= 4" label="广告语4"  >
        <el-input  v-model="formLed.ledAdv4"></el-input>
      </el-form-item>
      <el-form-item label="入口显示余位" >
        <el-select v-model="formLed.ledInRest" placeholder="请选择"> <el-option v-for="item in optionInRest" :key="item.value" :label="item.label" :value="item.value"> </el-option> </el-select>
      </el-form-item>
      <el-form-item label="显示屏类型"  >
        <el-select v-model="formLed.displayType" placeholder="请选择" @change="changeDisplayType">
          <el-option v-for="item in optionDisplayType" :key="item.value" :label="item.label" :value="item.value"> </el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-show="disabledAdv" label="LED颜色选择">
        <el-select v-model="formLed.parLedColor"  @change="parLedColor" placeholder="请选择">
          <el-option v-for="item in optionLedColor" :key="item.value" :label="item.label" :value="item.value"> </el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-show="disabledAdv" label="广告语颜色">
        <el-select v-model="formLed.ledAdvColor"  :disabled ="disabled"  placeholder="请选择"> <el-option v-for="item in optionAdvColor" :key="item.value" :label="item.label" :value="item.value"> </el-option> </el-select>
      </el-form-item>
      <el-form-item>
        <el-button :loading="createloading" type="primary" @click="onSubmitLed">保存设置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>
<script>
import { Led } from '@/api/url'
import { httpGet, httpPut, httpPost } from '@/utils/restful'
export default {
  name: 'ledSetting',
  data () {
    return {
      disabled: false,
      disabledAdv: true,
      createloading: false,
      optionLedCount: [{
        value: 1,
        label: '一行'
      }, {
        value: 2,
        label: '两行'
      }, {
        value: 3,
        label: '三行'
      }, {
        value: 4,
        label: '四行'
      }],
      optionInRest: [{
        value: 0,
        label: '不显示'
      }, {
        value: 1,
        label: '显示'
      }],
      optionDisplayType: [{
        value: 1,
        label: '3.7显示屏'
      }, {
        value: 2,
        label: '显卡显示屏'
      }, {
        value: 3,
        label: '全彩屏'
      }],
      optionLedColor: [{
        value: 0,
        label: '单色屏'
      }, {
        value: 1,
        label: '双色屏'
      }],
      optionAdvColor: [{
        value: 0,
        label: '红色'
      }, {
        value: 1,
        label: '绿色'
      }],
      formLed: {
        id: undefined,
        isSetting: 0,
        departmentId: this.$store.getters.departmentId,
        count: 4,
        ledAdv: '一车一杆,减速慢行',
        ledAdv2: '',
        ledAdv3: '',
        ledAdv4: '',
        ledInRest: 1,
        displayType: 2,
        parLedColor: 0,
        ledAdvColor: 0
      }
    }
  },
  mounted () {
    this.getLedSettingInfo()
  },
  methods: {
    parLedColor (value) {
      if (value === 0) {
        this.formLed.ledAdvColor = 0
        this.disabled = true
      } else {
        this.disabled = false
      }
    },
    getLedSettingInfo () {
      httpGet(Led + '/' + this.$store.getters.departmentId).then(res => {
        if (res.data) {
          this.formLed = res.data
          if (this.formLed.ledAdvColor === 0) this.disabled = true
          if (this.formLed.displayType === 3) this.disabledAdv = false
        }
      }).catch(() => {})
    },
    changeDisplayType (value) {
      if (value !== 3) {
        this.disabledAdv = true
      } else {
        this.disabledAdv = false
      }
    },
    onSubmitLed () {
      let self = this
      this.createloading = true
      let HTTP
      if (this.formLed.id) {
        HTTP = httpPut
      } else {
        HTTP = httpPost
      }
      this.formLed.isSetting = 0
      HTTP(Led, this.formLed).then(res => {
        console.log(this.formLed)
        this.createloading = false
        if (!this.formLed.id) {
          // 新增操作要重新加载id,避免重复提交
          self.getLedSettingInfo()
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

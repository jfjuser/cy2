<template>
  <div class="app-container">
    <div class="table-main">
      <el-form ref="form" :rules="formRules" :model="form" label-width="120px">
        <el-form-item label="MAC地址" prop="mac">
          <el-input class="filter-item" v-model="form.mac" @input="macChange"></el-input>
        </el-form-item>
        <el-form-item label="出入口状态" prop="type">
          <el-select class="filter-item" v-model="form.type">
            <el-option v-for="item in inOutType" :key="item.valueNo" :label="item.valueName" :value="item.valueNo"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="通道名称"  prop="localName">
          <el-input  class="filter-item" v-model="form.localName"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">保存</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { inOutType } from '@/utils/selectAble.js'
import { checkMac } from '@/utils/validator.js'
import { httpPut } from '@/utils/restful'
import { AIBindCamera } from '@/api/url'

export default {
  data () {
    return {
      form: {
        mac: undefined,
        type: undefined,
        localName: undefined
      },
      formRules: {
        mac: [
          {required: true, trigger: 'blur', message: '请填写MAC地址'},
          {validator: checkMac, trigger: 'blur'},
          {minlength: 17, maxlength: 17, trigger: 'blue', message: '请输入正确的MAC地址'}
        ],
        type: [
          {required: true, trigger: 'change', message: '请选择出入口'}
        ],
        localName: [
          {required: true, trigger: 'blur', message: '请输入通道名称'}
        ]
      },
      inOutType: inOutType
    }
  },
  methods: {
    // 判断mac
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
        this.$message.error('请输入正确的MAC地址')
      }
    },
    // 重置表单
    resetForm () {
      this.form = {
        mac: undefined,
        type: undefined,
        localName: undefined
      }
    },
    // 绑定MAC地址
    onSubmit () {
      this.$refs.form.validate(valid => {
        if (valid) {
          let loading = this.$loading({
            lock: true,
            text: '绑定中...',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          })
          this.form = Object.assign(this.form, {departmentId: this.$store.getters.departmentId})
          httpPut(AIBindCamera, this.form).then((res) => {
            this.resetForm()
            this.$nextTick(() => {
              this.$refs['form'].clearValidate()
            })
            loading.close()
            this.$message({
              type: 'success',
              message: res.message,
              duration: 4 * 1000
            })
          }).catch(() => {
            loading.close()
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.el-input{
    width: auto;
}
</style>

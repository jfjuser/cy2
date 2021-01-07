<template>
  <div class="app-container">
    <div class="table-main">
      <el-form ref="form" :rules="formRules" :model="form" label-width="120px">
        <el-form-item label="MAC类型" prop="macType">
          <el-select class="filter-item" v-model="form.macType" @change="fn">
            <el-option v-for="item in selectType" :key="item.valueNo" :label="item.valueName" :value="item.valueNo"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="MAC地址" v-if="form.macType === 1 || form.macType === 2">
          <el-input class="filter-item" ref="mac" v-model="form.mac" @input="macChange1" @blur="checkacm" clearable></el-input>
        </el-form-item>
         <el-form-item label="MAC地址" prop="mac1" v-if="form.macType !== 1 && form.macType !== 2">
          <el-input class="filter-item" ref='mac1' v-model="form.mac" @input="macChange" @blur="checkShow" clearable></el-input>
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
import { selectType } from '@/utils/selectAble.js'
// import { checkMac } from '@/utils/validator.js'
import { bindCamera } from '@/api/url'
import { httpPost } from '@/utils/restful'

export default {
  data () {
    return {
      form: {
        macType: undefined,
        mac: undefined,
        // mac1: undefined,
        type: undefined,
        localName: undefined
      },
      formRules: {
        macType: [
          {required: true, trigger: 'change', message: '请选择类型'}
        ],
        mac: [
          {required: true, trigger: 'blur', message: '请填写MAC地址'},
          {trigger: 'blur', message: '请输入正确的MAC地址'}
        ],
        type: [
          {required: true, trigger: 'change', message: '请选择出入口'}
        ],
        localName: [
          {required: true, trigger: 'blur', message: '请输入参数值'}
        ]
      },
      inOutType: [
        {'valueName': '入口', 'valueNo': 0},
        {'valueName': '出口', 'valueNo': 1}
      ],
      selectType: selectType
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
    checkacm () {
      const regMac = /[0-9]{1,20}/
      if (!(regMac.test(this.form.mac))) {
        this.$message.error('请输入正确的MAC地址')
        this.form.mac = ''
      }
    },
    checkShow () {
      const regMac = /([A-Fa-f0-9]{2}:){5}[A-Fa-f0-9]{2}/
      if (this.form.mac !== (undefined || '')) {
        if (!(regMac.test(this.form.mac))) {
          this.$message.error('请输入正确的MAC地址')
          this.form.mac = ''
        }
      }
    },
    fn () {
      this.form.mac = undefined
    },
    macChange1 (value) {
      if (value.length > 12) {
        // this.$nextTick(() => {
        //   this.form.mac = this.form.mac.substring(0, 12)
        // })
        // this.$message.error('请输入正确的MAC地址')
      }
    },
    // 重置表单
    resetForm () {
      this.form = {
        macType: undefined,
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
          httpPost(bindCamera, this.form).then((res) => {
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

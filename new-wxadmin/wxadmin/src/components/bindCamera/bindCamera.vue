<template>
    <div class="container">
      <NavBar
        title="绑定相机"
        left-text="返回"
        left-arrow
        @click-left="onClickLeft"
      />
      <div class="groupDiv">
      <CellGroup :model='form'>
        <Field
          v-model="form.mac"
          required
          prop="mac"
          clearable
          style="line-height:2rem;font-size:0.9rem"
          label="Mac地址"
          @blur="mac"
          placeholder="请输入mac地址"
          :error-message="err.message"
          @input="macChange"
        />
        <label style="line-height:1rem;font-size:0.9rem;margin:0.7rem 0 0 0.7rem">出入口状态</label>
        <RadioGroup v-model="form.type" style="line-height:2rem;font-size:0.9rem;margin:0rem 0 0 10%">
            <Radio name='0'>入口</Radio>
            <Radio name='1'>出口</Radio>
            <Radio name='2'>不分出入口</Radio>
        </RadioGroup>
        <Field
          v-model="form.localName"
          label="通道名称"
          placeholder="请输入通道名称"
          required
          prop="localName"
          clearable
          style="line-height:3rem;font-size:0.9rem"
          />
        </CellGroup>
        <Button size='large' type="info" class="saveBtn" @click="save">保存</Button>
      </div>
    </div>
</template>
<script>
import { Field, Toast, Cell, CellGroup, Button, NavBar, RadioGroup, Radio } from 'vant'
import { inOutType } from '@/utils/selectAble.js'
// import { checkMac } from '@/utils/validator.js'
import { httpPut } from '@/utils/restful'
import { AIBindCamera } from '@/api/url'
export default {
  name: 'bindCamera',
  data () {
    return {
      err: {
        message: ''
      },
      form: {
        mac: undefined,
        type: undefined,
        localName: undefined
      },
      // formRules: {
      //   mac: [
      //     {required: true, trigger: 'blur', message: '请填写MAC地址'},
      //     {validator: checkMac, trigger: 'blur'},
      //     {minlength: 17, maxlength: 17, trigger: 'blue', message: '请输入正确的MAC地址'}
      //   ],
      //   type: [
      //     {required: true, trigger: 'change', message: '请选择出入口'}
      //   ],
      //   localName: [
      //     {required: true, trigger: 'blur', message: '请输入通道名称'}
      //   ]
      // },
      inOutType: inOutType
    }
  },
  components: {
    Field,
    Toast,
    Cell,
    CellGroup,
    Button,
    NavBar,
    RadioGroup,
    Radio
  },
  methods: {
    onClickLeft () {
      this.$router.push('/cameraManage/')
    },
    macChange (value) {
      if (value.length === 2) this.form.mac = this.form.mac + ':'
      if (value.length === 5) this.form.mac = this.form.mac + ':'
      if (value.length === 8) this.form.mac = this.form.mac + ':'
      if (value.length === 11) this.form.mac = this.form.mac + ':'
      if (value.length === 14) this.form.mac = this.form.mac + ':'
      if (value.length > 17) {
        this.form.mac = this.form.mac.substring(0, 17)
      }
    },
    mac () {
      const regMac = /^([A-Fa-f0-9]{2}:){5}[A-Fa-f0-9]{2}$/
      if (!(regMac.test(this.form.mac))) {
        this.err.message = '请输入正确的MAC地址'
      } else {
        this.err.message = ''
      }
      window.scroll(0, 0)
    },
    resetForm () {
      this.form = {
        mac: undefined,
        type: undefined,
        localName: undefined
      }
    },
    save () {
      // console.log(this.form)
      if (!this.form.mac) {
        Toast({
          type: 'fail',
          message: '请输入mac地址',
          duration: 4 * 1000
        })
        return
      }
      if (!this.form.type) {
        Toast({
          type: 'fail',
          message: '请选择出入口',
          duration: 4 * 1000
        })
        return
      }
      if (!this.form.localName) {
        Toast({
          type: 'fail',
          message: '请输入通道名称',
          duration: 4 * 1000
        })
        return
      }
      this.form = Object.assign(this.form, {departmentId: this.$store.getters.departmentId})
      httpPut(AIBindCamera, this.form).then((res) => {
        // this.resetForm()
        Toast({
          type: 'success',
          message: res.message,
          duration: 4 * 1000
        })
      }).catch((err) => {
        console.log(err)
        Toast.fail(err)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.container{
  background: url(../../assets/bind-back.jpg);
  background-size: 100%;
  min-height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
}
  .groupDiv{
    opacity: 0.7;
    margin-top: 8rem;
    width: 96vw;
    margin-left: 2vw;
    line-height: 2.5rem;
    }
  .saveBtn{
      margin-top: 25%;
      width: 80%;
      margin-left: 10%;
      border-radius:0.5rem;
      }
</style>

<template>
  <div class="container">
    <div>
      <NavBar
        title="工地管理"
        left-text="返回"
        left-arrow
        @click-left="onClickLeft"
      />
    </div>
    <div style="margin-top:0.5rem;border-radius:7px;width:100vw;">
      <Field label="模式" :border=false style="background-color:rgb(134,163,195);line-height:1rem;" required disabled/>
        <RadioGroup v-model="form.ledType" @change="restForm" style="line-height:2rem;font-size:0.9rem;margin:-0.5rem 0 0.5rem 10%">
            <Radio name='0'>bx-5e1</Radio>
            <Radio name='1'>安卓电视机</Radio>
        </RadioGroup>
        <Field label="相机选择" :border=false style="background-color:rgb(134,163,195);line-height:1rem;" required disabled/>
          <CheckboxGroup v-model="form.aiTokenIdArr">
            <Checkbox style="display:inline-block;margin-left:2rem;line-height:1.8rem" v-for="item in cameraList" :name="item.id" :key="item.id">{{item.localName}}</Checkbox>
            <Checkbox style="margin-left:2rem;line-height:1.8rem;margin-bottom:1.5rem;" v-show="cameraList.length === 0" disabled>部门下暂无相机可选择</Checkbox>
          </CheckboxGroup>
          <Field required label="唯一标识" v-if="form.ledType == 0" @input="macFn" @blur="checkOneMac"  placeholder="请输入唯一标识" class="inputStyle" v-model="form.mac">
          </Field>
          <Field required label="Mac" clearable v-if="form.ledType == 1" class="inputStyle"
          v-model="form.mac" :error-message="err.mac" @input="macChange" @blur="checkMac" placeholder="请输入Mac"/>
          <Field required label="通道名称" placeholder="请输入通道名称" :error-message="err.local" @blur="checkLocalName" class="inputStyle" v-model="form.localName"/>
          <Field type="number" v-if="form.ledType == 0" required label="LED屏宽度" placeholder="请输入LED屏宽度" :error-message="err.ledWidth" @blur="checkledWidth"
          class="inputStyle" v-model="form.ledWidth"/>
          <Field type="number" v-if="form.ledType == 0" required label="LED屏高度" placeholder="请输入LED屏高度" :error-message="err.ledHeight" @blur="checkledHeight"
          class="inputStyle" v-model="form.ledHeight"/>
          <Field type="number" v-if="form.ledType == 0" required label="LED屏亮度" placeholder="请输入LED屏亮度" :error-message="err.ledBrightness"
          class="inputStyle" v-model="form.ledBrightness"/>
          <br>
          <div style="margin-top:2rem">
            <Button type="info" size=large style="border-radius:8px;width:80vw;margin-left:10vw" @click="savaInfo">保存</Button>
          </div>
    </div>
  </div>
</template>
<script>
import { checkAICamera, bindApp, validtorMac, getMac } from '@/api/url'
import { httpGet, httpPost } from '@/utils/restful'
import { Button, CheckboxGroup, Field, Checkbox, RadioGroup, Radio, NavBar, Toast } from 'vant'
export default {
  name: 'bindLED',
  components: {
    Button, CheckboxGroup, Field, Checkbox, RadioGroup, Radio, NavBar
  },
  data () {
    return {
      form: {
        ledType: '0',
        mac: '',
        localName: '',
        ledWidth: '',
        ledHeight: '',
        ledBrightness: 6,
        aiTokenIdArr: []
      },
      err: {
        local: '',
        mac: '',
        ledWidth: '',
        ledHeight: ''
      },
      cameraList: []
    }
  },
  created () {
    this.selectCamera()
  },
  methods: {
    onClickLeft () {
      this.$router.push('/siteManage/')
    },
    macFn (value) {
      if (value.length > 12) {
        this.$nextTick(() => {
          this.form.mac = this.form.mac.substring(0, 12)
        })
        Toast.fail('请输入正确的标识符')
      }
    },
    checkOneMac () {
      var reg = /^[0-9]{12}$/
      if (!reg.test(this.form.mac)) {
        // this.$message.error('输入的mac格式不正确，请重新输入')
        this.form.mac = ''
      }
      if (this.form.mac === '') {
        this.err.mac = '请输入正确的标识符'
      } else {
        this.err.mac = ''
      }
    },
    checkledWidth () {
      if (this.form.ledWidth === '') {
        this.err.ledWidth = 'LED屏宽度不可为空'
      } else {
        this.err.ledWidth = ''
      }
    },
    checkledHeight () {
      if (this.form.ledHeight === '') {
        this.err.ledHeight = 'LED屏宽度不可为空'
      } else {
        this.err.ledHeight = ''
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
        this.err.mac = ''
      }
    },
    selectCamera () {
      httpGet(checkAICamera + this.$store.getters.departmentId) // this.$store.getters.departmentId
        .then((res) => {
          console.log(res)
          if (res.data !== null) {
            this.cameraList = res.data
          }
        })
    },
    restForm (val) {
      console.log(val)
      this.form = {
        ledType: val,
        mac: '',
        localName: '',
        aiTokenIdArr: []
      }
    },
    savaInfo () {
      if (this.form.mac !== '' && this.form.localName !== '') {
        let ledAppBindDto = Object.assign(this.form, {departmentId: this.$store.getters.departmentId})
        httpPost(bindApp, ledAppBindDto)
          .then((res) => {
            Toast({
              message: res.message,
              type: 'success',
              duration: 4000
            })
            this.$router.push('/siteManage/')
          }).catch(() => {})
      } else {
        Toast('请填写完整的信息再保存')
      }
    },
    checkLocalName () {
      if (this.form.localName === '') {
        this.err.local = '通道名称不可为空'
      } else {
        this.err.local = ''
      }
    },
    checkMac () {
      if (this.form.ledType === '1') {
        const regMac = /([A-Fa-f0-9]{2}:){5}[A-Fa-f0-9]{2}/
        if (!regMac.test(this.form.mac)) {
          this.err.mac = '请输入正确的mac地址'
          this.form.mac = ''
        } else {
          httpGet(validtorMac + '/' + this.form.mac)
            .then((res) => {
              Toast({
                message: res.message,
                type: 'fail',
                duration: 4000
              })
            }).catch(() => {
            })
        }
      }
    },
    gainMac () {
      if (this.form.mac === '') {
        httpPost(getMac + '/' + this.$store.getters.departmentId)
          .then((res) => {
            this.form.mac = res.data
          })
      } else {
        Toast({
          message: '已有Mac，将不在获取',
          type: 'fail',
          duration: 4000
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.container{
  background-color: rgb(134,163,195);
  min-height:100vh;
}
.inputStyle{
  opacity:0.5;
  width:90vw;
  border-radius:6px;
  margin-top:0.75rem;
  margin-left:5vw
}
</style>

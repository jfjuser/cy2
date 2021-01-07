<template>
    <div>
      <NavBar title="时段设置" left-text="返回" left-arrow @click-left="onClickLeft" />
      <div>
        <Field label="名称" required clearable v-model="form.name" @blur="checkName" :error-message="toast.mes" placeholder="请输入名称"/>
        <Field label="开始时间" required clearable v-model="form.beginTime" placeholder="请选择" @focus="startDate = true" visible-item-count="count" readonly/>
        <Field label="结束时间" required clearable v-model="form.endTime" placeholder="请选择" @focus="endDate = true" readonly/>
        <Field required clearable label="星期一" :border="false" class="fi" disabled/>
      <div>
        <RadioGroup v-model="form.monday">
          <Radio :name="0" class="select">关闭</Radio>
          <Radio :name="1" class="select">开启</Radio>
        </RadioGroup>
      </div>
      <Field required clearable label="星期二" :border="false" class="fi" disabled/>
      <div>
        <RadioGroup v-model="form.tuesday">
          <Radio :name="0" class="select">关闭</Radio>
          <Radio :name="1" class="select">开启</Radio>
        </RadioGroup>
      </div>
      <Field required clearable label="星期三" :border="false" class="fi" disabled/>
      <div>
        <RadioGroup v-model="form.wednesday">
          <Radio :name="0" class="select">关闭</Radio>
          <Radio :name="1" class="select">开启</Radio>
        </RadioGroup>
      </div>
      <Field required clearable label="星期四" :border="false" class="fi" disabled/>
      <div>
        <RadioGroup v-model="form.thursday">
          <Radio :name="0" class="select">关闭</Radio>
          <Radio :name="1" class="select">开启</Radio>
        </RadioGroup>
      </div>
      <Field required clearable label="星期五" :border="false" class="fi" disabled/>
      <div>
        <RadioGroup v-model="form.friday">
          <Radio :name="0" class="select">关闭</Radio>
          <Radio :name="1" class="select">开启</Radio>
        </RadioGroup>
      </div>
      <Field required clearable label="星期六" :border="false" class="fi" disabled/>
      <div>
        <RadioGroup v-model="form.saturday">
          <Radio :name="0" class="select">关闭</Radio>
          <Radio :name="1" class="select">开启</Radio>
        </RadioGroup>
      </div>
      <Field required clearable label="星期天" :border="false" class="fi" disabled/>
      <div>
        <RadioGroup v-model="form.sunday">
          <Radio :name="0" class="select">关闭</Radio>
          <Radio :name="1" class="select">开启</Radio>
        </RadioGroup>
      </div>
      <Popup v-model="startDate" style="width:80vw;height:45vh">
        <DatetimePicker
          v-model="currentDate"
          type="time"
          :formatter=formatter
          @confirm="saveValue"
          @cancel="startDate = false"
          style="dateTable"
        />
      </Popup>
      <Popup v-model="endDate" style="width:80vw;height:45vh">
        <DatetimePicker
          v-model="currentDate1"
          type="time"
          :formatter=formatter
          @confirm="getValue"
          @cancel="endDate = false"
        />
      </Popup>
      <div>
        <Button type="info" v-if="abc === 0" :loading="createLoading" size=large class="btn" @click="createData">保存</Button>
        <Button type="info" v-if="abc === 1" :loading = "updateLoading" size=large  @click="updateData" class="btn">修改</Button>
      </div>
      </div>
    </div>
</template>
<script>
import { NavBar, Field, Popup, DatetimePicker, RadioGroup, Radio, Button, Toast } from 'vant'
import { AIInOutTime } from '@/api/url'
import { httpPost, httpPut } from '@/utils/restful'
export default {
  name: 'addTimeList',
  data () {
    return {
      startDate: false,
      endDate: false,
      currentDate: '00:01',
      currentDate1: '23:59',
      createLoading: false,
      updateLoading: false,
      toast: {
        mes: ''
      },
      abc: 0,
      form: {
        id: undefined,
        name: undefined,
        beginTime: '00:01',
        endTime: '23:59',
        monday: 0,
        tuesday: 0,
        wednesday: 0,
        thursday: 0,
        friday: 0,
        saturday: 0,
        sunday: 0
      }
    }
  },
  components: { NavBar, Field, Popup, DatetimePicker, RadioGroup, Radio, Button },
  methods: {
    onClickLeft () {
      this.$router.push('/setting/')
    },
    formatter (type, value) {
      if (type === 'hour') {
        return value + '点'
      } else if (type === 'minute') {
        return value + '分'
      }
      return value
    },
    // 确定选择时间
    saveValue (value) {
      this.form.beginTime = value
      this.form.time = value
      this.startDate = false
    },
    getValue (value) {
      this.form.endTime = value
      this.endDate = false
    },
    tanslate () {
    },
    checkName () {
      if (this.form.name === '') {
        this.toast.mes = '名称不可为空'
      } else {
        this.toast.mes = ''
      }
    },
    // 修改
    updateData () {
      this.updateLoading = true
      const updateFormData = Object.assign(this.form, {departmentId: this.$store.getters.departmentId})
      httpPut(AIInOutTime, updateFormData).then(res => {
        Toast(res.message)
        this.updateLoading = false
        this.$router.push('/setting/')
      }).catch(() => {
        this.updateLoading = false
      })
    },
    // 新增
    createData () {
      this.createLoading = true
      this.form = Object.assign(this.form, {departmentId: this.$store.getters.departmentId})
      httpPost(AIInOutTime, this.form).then((res) => {
        Toast(res.message)
        this.createLoading = false
        this.$router.push('/setting/')
      }).catch(() => {
        this.createLoading = false
      })
    }
  },
  created () {
    if (this.$route.params.row) {
      this.form = this.$route.params.row
      this.abc = 1
    }
  }
}
</script>
<style lang="scss" scoped>
.select{
  line-height:1.5rem;
  display: inline-block;
  margin-left: 5rem;
}
.btn{
  width:80vw;
  margin-left:10vw;
  border-radius:9px;
  margin-top: 3rem;
  margin-bottom: 2rem;
}
</style>

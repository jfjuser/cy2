<template>
    <div>
        <ValidationObserver slim ref="form">
          <van-cell-group>
            <ValidationProvider name="车牌号" rules="required" v-slot="{ errors }" slim>
              <van-field
                v-model.trim="form.plate"
                label="车牌号"
                placeholder="请输入车牌号"
                required
                @click="choosePlate"
                :error-message="errors[0]"
              />
            </ValidationProvider>
            <ValidationProvider name="车类型" rules="required" v-slot="{ errors }" slim :customMessages="{'required':'请选择{_field_}'}">
              <van-cell title="车类型" required >
                <van-radio-group v-model="form.type">
                  <van-radio :name="item.valueNo" v-for="item in blackCarType" :key="item.valueNo" class="mar-b-15">{{item.valueName}}</van-radio>
                </van-radio-group>
                <p class="fc-red text-c">{{errors[0]}}</p>
              </van-cell>
            </ValidationProvider>
            <van-field
              required
              :value="timeFormatter(form.startTime)"
              label="开始时间"
              placeholder="请选择"
              readonly
              @click="showbeginTime=true"
              :error-message="err.startTime"
            />
            <van-field
              required
              :value="timeFormatter(form.endTime)"
              label="结束时间"
              placeholder="请选择"
              readonly
              @click="showendTime=true"
              :error-message="err.endTime"
            />
            <van-field
              v-model="form.remarks"
              label="备注信息"
              placeholder="请输入备注信息"
            />
          </van-cell-group>
        </ValidationObserver>

        <div class="btn-box">
            <van-button v-if="!queryData" type="info" :loading="createLoading" @click="createData" block round>保存</van-button>
            <van-button v-if="queryData" type="info" :loading="updataLoading" @click="updateData" block round>修改</van-button>
        </div>

        <van-popup v-model="showbeginTime" position="bottom" :close-on-click-overlay="false" safe-area-inset-bottom>
          <van-datetime-picker
          v-model="currentDate1"
          type="datetime"
          show-toolbar
          @cancel="showbeginTime=false"
          @confirm="handleBeginTime"
          />
        </van-popup>
        <van-popup v-model="showendTime" position="bottom" :close-on-click-overlay="false" safe-area-inset-bottom>
            <van-datetime-picker
            v-model="currentDate2"
            type="datetime"
            show-toolbar
            @cancel="showendTime=false"
            @confirm="handleEndTime"
            />
        </van-popup>
        <van-popup v-model="isPlate">
          <van-button v-for="(item, index) in plateType" @click="seleceItem(item)" :key=index>{{item.value}}</van-button>
        </van-popup>
    </div>
</template>

<script>
import { Cell, CellGroup, Field, Button, RadioGroup, Radio, DatetimePicker, Popup } from 'vant'
import { plateType, blackCarType } from '@/utils/selectAble.js'
import { timeFormatter } from '@/utils/formatter.js'
import { httpPost, httpPut } from '@/utils/restful'
import { BlackCard } from '@/api/url'
import { checkPlate } from '@/utils/validator.js'
export default {
  components: {
    [Button.name]: Button,
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup,
    [Field.name]: Field,
    [RadioGroup.name]: RadioGroup,
    [Radio.name]: Radio,
    [DatetimePicker.name]: DatetimePicker,
    [Popup.name]: Popup
  },
  data () {
    return {
      form: {
        id: undefined,
        plate: '',
        type: '',
        startTime: '',
        endTime: '',
        remarks: ''
      },
      err: {
        startTime: '',
        endTime: '',
        plate: ''
      },
      blackCarType,
      plateType,
      timeFormatter,
      createLoading: false,
      updataLoading: false,
      showbeginTime: false,
      showendTime: false,
      currentDate1: new Date(),
      currentDate2: new Date(),
      isPlate: false
    }
  },
  computed: {
    queryData () {
      return this.$route.query.data
    }
  },
  created () {
    if (this.$route.query.data) {
      this.form = Object.assign({}, JSON.parse(this.$route.query.data))
      this.currentDate1 = new Date(this.form.startTime)
      this.currentDate2 = new Date(this.form.endTime)
    }
  },
  methods: {
    choosePlate () {
      if (this.form.plate === '' || this.form.plate === undefined) {
        this.isPlate = true
      }
    },
    seleceItem (item) {
      this.isPlate = false
      this.form.plate = item.value
    },
    handleBeginTime (val) {
      this.form.startTime = val
      this.showbeginTime = false
    },
    handleEndTime (val) {
      this.form.endTime = val
      this.showendTime = false
    },
    // 新增
    createData () {
      this.$refs.form.validate().then(success => {
        if (!success) return
        if (this.form.startTime === '') this.err.startTime = '请选择开始时间'
        if (this.form.endTime === '') this.err.endTime = '请选择结束时间'
        if (checkPlate(this.form.plate)) this.$notify('请输入正确的车牌号码')
        if (this.form.startTime === '' || this.form.endTime === '' || checkPlate(this.form.plate)) return

        this.createLoading = true
        this.form = Object.assign(this.form, {shopId: this.$store.getters.departmentId})
        httpPost(BlackCard, this.form).then((res) => {
          setTimeout(() => { this.createLoading = false }, 300)
          this.$notify({
            message: res.message,
            type: 'success',
            duration: 4 * 1000
          })
          history.go(-1)
        }).catch(() => {
          this.createLoading = false
        })

        this.$nextTick(() => {
          this.$refs.form.reset()
        })
      })
    },
    // 修改
    updateData () {
      this.$refs.form.validate().then(success => {
        if (!success) return
        if (this.form.startTime === '') this.err.startTime = '请选择开始时间'
        if (this.form.endTime === '') this.err.endTime = '请选择结束时间'
        if (checkPlate(this.form.plate)) this.$notify('请输入正确的车牌号码')
        if (this.form.startTime === '' || this.form.endTime === '' || checkPlate(this.form.plate)) return

        this.updataLoading = true
        const updateFormData = Object.assign({}, this.form)
        httpPut(BlackCard, updateFormData).then(res => {
          setTimeout(() => { this.updataLoading = false }, 300)
          this.$notify({
            message: res.message,
            type: 'success',
            duration: 4 * 1000
          })
          history.go(-1)
        }).catch(() => {
          this.updataLoading = false
        })

        this.$nextTick(() => {
          this.$refs.form.reset()
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.btn-box {
    padding: 20px;
}
</style>

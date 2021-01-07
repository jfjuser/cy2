<template>
  <div>
    <ValidationObserver slim ref="form">
      <van-cell-group>
        <ValidationProvider name="优惠券名称" rules="required" v-slot="{ errors }" slim>
          <van-field
            required
            v-model.trim="form.name"
            label="优惠券名称"
            placeholder="请输入优惠券名称"
            :error-message="errors[0]"
          />
        </ValidationProvider>
        <ValidationProvider name="优惠券数量" rules="required" v-slot="{ errors }" slim>
          <van-cell required title="优惠券数量" label="备注：9999表示不限量" label-class="label-class" >
            <van-stepper v-model.trim="form.number" />
            <p class="fc-red">{{errors[0]}}</p>
          </van-cell>
        </ValidationProvider>
        <template v-if="!queryData">
          <ValidationProvider name="优惠券类型" rules="required" v-slot="{ errors }" slim :customMessages="{'required':'请选择{_field_}'}">
            <van-cell required title="优惠券类型" >
              <template slot=label>
                <van-radio-group v-model="form.type" class="radio-box">
                    <van-radio :name="item.valueNo" v-for="item in ticketType" :key="item.valueNo" class="radio-item">{{item.valueName}}</van-radio>
                </van-radio-group>
                <p class="fc-red">{{errors[0]}}</p>
              </template>
            </van-cell>
          </ValidationProvider>
          <ValidationProvider name="减免金额" rules="required|min_value:0|tofixed:2" v-slot="{ errors }" slim v-if="form.type === 0">
            <van-field
              type="number"
              required
              v-model.trim="form.subFee"
              label="减免金额(元)"
              placeholder="请输入减免金额(元)"
              :error-message="errors[0]"
            />
          </ValidationProvider>
          <ValidationProvider name="减免时间" rules="required|min_value:0|integer" v-slot="{ errors }" slim v-if="form.type === 1">
            <van-field
              type="number"
              required
              v-model.trim="form.subTime"
              label="减免时间(分)"
              placeholder="请输入减免时间(分)"
              :error-message="errors[0]"
            />
          </ValidationProvider>
          <ValidationProvider name="折扣率" rules="required|discount|tofixed:2" v-slot="{ errors }" slim v-if="form.type === 3">
            <van-field
              required
              v-model.trim="form.discount"
              label="折扣率"
              placeholder="请输入折扣率"
              :error-message="errors[0]"
            />
          </ValidationProvider>
          <ValidationProvider name="时间类型" rules="required" v-slot="{ errors }" slim :customMessages="{'required':'请选择{_field_}'}">
            <van-cell title="时间类型" required >
              <template slot=label>
                <van-radio-group v-model="form.timeType" class="radio-box">
                    <van-radio :name="item.valueNo" v-for="item in timeType" :key="item.valueNo" class="radio-item">{{item.valueName}}</van-radio>
                </van-radio-group>
                <p class="fc-red">{{errors[0]}}</p>
              </template>
            </van-cell>
          </ValidationProvider>
          <template v-if="form.timeType === 1">
            <van-notice-bar left-icon="info-o" text="优惠券截至时间"/>
            <van-field
              required
              :value="timeFormatter(form.validateAt)"
              label="有效时间"
              placeholder="请选择"
              readonly
              @click="showbeginTime=true"
              :error-message="err.validateAt"
            />
          </template>
          <template v-if="form.timeType === 0">
            <van-notice-bar left-icon="info-o" text="从领券的时间开始计算持续时间内有效"/>
            <ValidationProvider name="持续时间" rules="required|min_value:0|integer" v-slot="{ errors }" slim>
              <van-field
                type="number"
                required
                v-model.trim="form.durationMinute"
                label="持续时间(分)"
                placeholder="请输入持续时间(分)"
                :error-message="errors[0]"
              />
            </ValidationProvider>
          </template>
          <template v-if="form.timeType === -2">
            <van-notice-bar left-icon="info-o" text="从车主领券之日开始计算(领券当日也算1日)"/>
            <ValidationProvider name="持续天数" rules="required|min_value:0|integer" v-slot="{ errors }" slim>
              <van-field
                type="number"
                required
                v-model.trim="form.durationDay"
                label="持续天数"
                placeholder="请输入持续天数"
                :error-message="errors[0]"
              />
            </ValidationProvider>
          </template>
        </template>
        <van-field
          v-model.trim="form.consume"
          label="备注信息"
          placeholder="请输入备注信息"
          type="textarea"
          autosize rows="1"
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
        :min-date="minDate"
        @cancel="showbeginTime=false"
        @confirm="handleBeginTime"
        />
    </van-popup>
  </div>
</template>

<script>
import { Cell, CellGroup, Field, Button, Stepper, RadioGroup, Radio, DatetimePicker, Popup, NoticeBar } from 'vant'
import { ticketType, timeType } from '@/utils/selectAble.js'
import { httpPost, httpPut } from '@/utils/restful'
import { TicketRules } from '@/api/url'
import { timeFormatter } from '@/utils/formatter.js'
import { extend } from 'vee-validate'
extend('discount', {
  validate (value) {
    return !(value <= 0 || value >= 1)
  },
  message: '请输入大于0小于1的数字'
})
export default {
  components: {
    [Button.name]: Button,
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup,
    [Field.name]: Field,
    [Stepper.name]: Stepper,
    [RadioGroup.name]: RadioGroup,
    [Radio.name]: Radio,
    [DatetimePicker.name]: DatetimePicker,
    [Popup.name]: Popup,
    [NoticeBar.name]: NoticeBar
  },
  data () {
    return {
      createLoading: false,
      updataLoading: false,
      form: {
        id: undefined,
        name: undefined,
        number: undefined,
        type: undefined,
        discount: undefined,
        subFee: undefined,
        subTime: undefined,
        timeType: undefined,
        durationMinute: undefined,
        validateAt: undefined,
        durationDay: undefined,
        consume: undefined
        // maxDiscountMoney: undefined
      },
      err: {
        validateAt: ''
      },
      formNumber: {
        number: undefined,
        restNumber: undefined
      },
      ticketType: ticketType,
      timeType: timeType,
      showbeginTime: false,
      minDate: new Date(),
      currentDate1: new Date(),
      timeFormatter
    }
  },
  computed: {
    queryData () {
      return this.$route.query.data
    }
  },
  created () {
    if (this.$route.query.data) {
      let row = Object.assign({}, JSON.parse(this.$route.query.data))
      this.form = {
        id: row.id,
        name: row.name,
        consume: row.consume,
        number: row.number
      }
      this.formNumber = {
        number: row.number,
        restNumber: row.restNumber
      }
    }
  },
  methods: {
    handleBeginTime (val) {
      // console.log(val)
      this.form.validateAt = val
      this.showbeginTime = false
    },
    // 新增
    createData () {
      this.$refs.form.validate().then(success => {
        if (!success) return
        if (this.form.timeType === 1 && this.form.validateAt === undefined) {
          this.err.validateAt = '请选择有效时间'
          return
        }
        this.createLoading = true
        this.form = Object.assign(this.form, {shopId: this.$store.getters.departmentId})
        httpPost(TicketRules, this.form).then((res) => {
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
      if (this.form.number < this.formNumber.number - this.formNumber.restNumber) {
        this.$notify('优惠券数量必大于当前数量减去剩余数量的差值')
      } else {
        this.$refs.form.validate().then(success => {
          if (!success) return

          this.updataLoading = true
          const updateFormData = Object.assign({}, this.form)
          httpPut(TicketRules, updateFormData).then(res => {
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
}
</script>

<style lang="scss" scoped>
.btn-box {
    padding: 20px;
}
.label-class {
  color: red;
}
.radio-box {
  display: flex;
  flex-wrap: wrap;
  .radio-item {
    flex: 50%;
    padding: 8px 0;
  }
}
</style>

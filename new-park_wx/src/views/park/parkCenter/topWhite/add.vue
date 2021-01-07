<template>
    <div>
        <ValidationObserver slim ref="form">
          <van-cell-group>
            <van-notice-bar left-icon="info-o" text="提示：不可填写含有中文符号的姓名"/>
            <ValidationProvider name="车主姓名" rules="required" v-slot="{ errors }" slim>
              <van-field
                v-model.trim="form.userName"
                label="车主姓名"
                placeholder="请输入车主姓名"
                required
                :error-message="errors[0]"
              />
            </ValidationProvider>
            <van-cell title="通道名称" required>
                <template slot="label">
                    <ValidationProvider name="通道名称" rules="required" v-slot="{ errors }">
                        <el-select v-model="form.localIdArr" multiple collapse-tags>
                            <el-option v-for="item in localList" clearable :key="item.localId" :label="item.localName" :value="item.localId"></el-option>
                        </el-select>
                        <p class="fc-red">{{errors[0]}}</p>
                    </ValidationProvider>
                </template>
            </van-cell>
            <ValidationProvider name="车牌号码" rules="required" v-slot="{ errors }" slim>
              <van-field
                v-model.trim="form.plate"
                label="车牌号码"
                placeholder="请输入车牌号码"
                required
                @click="choosePlate"
                :error-message="errors[0]"
              />
            </ValidationProvider>
            <ValidationProvider name="总车位数" rules="required|min_value:0|integer" v-slot="{ errors }" slim>
              <van-field type="number" label="总车位数" v-model.trim="form.carTal" required placeholder="请输入总车位数(购买车位数)" :error-message="errors[0]"/>
            </ValidationProvider>
            <van-notice-bar left-icon="info-o" text="注意：为防止车场存在同名车主，同一个车主联系方式应该一致"/>
            <ValidationProvider name="联系方式" rules="required|phone" v-slot="{ errors }" slim>
                <van-field
                type="number"
                required
                v-model.trim="form.userPhone"
                label="联系方式"
                placeholder="请输入联系方式"
                :error-message="errors[0]"
                />
            </ValidationProvider>
            <van-cell title="时段一" required>
                <template slot="label">
                    <ValidationProvider name="开始时间" rules="required" v-slot="{ errors }" slim>
                        <van-field v-model="form.time1" label="开始时间" readonly @click="showTime1=true" :error-message="errors[0]"/>
                    </ValidationProvider>
                    <ValidationProvider name="开始时间" rules="required" v-slot="{ errors }" slim>
                        <van-field v-model="form.time2" label="结束时间" readonly @click="showTime2=true" :error-message="errors[0]"/>
                    </ValidationProvider>
                </template>
            </van-cell>
            <van-cell title="时段二" required>
                <template slot="label">
                    <ValidationProvider name="开始时间" rules="required" v-slot="{ errors }" slim>
                        <van-field v-model="form.time3" label="开始时间" readonly @click="showTime3=true" :error-message="errors[0]"/>
                    </ValidationProvider>
                    <ValidationProvider name="开始时间" rules="required" v-slot="{ errors }" slim>
                        <van-field v-model="form.time4" label="结束时间" readonly @click="showTime4=true" :error-message="errors[0]"/>
                    </ValidationProvider>
                </template>
            </van-cell>
            <van-cell title="充值规则" required>
                <template slot="label">
                    <ValidationProvider name="充值规则" rules="required" v-slot="{ errors }">
                        <el-select v-model="form.ruleId" placeholder="请选择" @change="ruleChange">
                            <el-option v-for="item in ruleList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                        <p class="fc-red">{{errors[0]}}</p>
                    </ValidationProvider>
                </template>
            </van-cell>
            <van-field
              required
              :value="startTime"
              label="开始时间"
              placeholder="请选择"
              readonly
              @click="showbeginTime=true"
              :error-message="err.startTime"
            />
            <van-field
              required
              :value="endTime"
              label="结束时间"
              placeholder="请选择"
              readonly
              @click="showendTime=true"
              :error-message="err.endTime"
            />
            <van-field
              v-model.trim="form.reason"
              label="备注信息"
              placeholder="请输入备注信息"
            />
          </van-cell-group>
        </ValidationObserver>

        <div class="btn-box">
            <van-button type="info" :loading="createLoading" @click="createData" block round>保存</van-button>
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
        <!-- 时段一 -->
        <van-popup v-model="showTime1" position="bottom" safe-area-inset-bottom>
          <van-datetime-picker
          v-model="form.time1"
          type="time"
          :show-toolbar="false"
          />
        </van-popup>
        <van-popup v-model="showTime2" position="bottom" safe-area-inset-bottom>
          <van-datetime-picker
          v-model="form.time2"
          type="time"
          :show-toolbar="false"
          />
        </van-popup>
        <!-- 时段二 -->
        <van-popup v-model="showTime3" position="bottom" safe-area-inset-bottom>
          <van-datetime-picker
          v-model="form.time3"
          type="time"
          :show-toolbar="false"
          />
        </van-popup>
        <van-popup v-model="showTime4" position="bottom" safe-area-inset-bottom>
          <van-datetime-picker
          v-model="form.time4"
          type="time"
          :show-toolbar="false"
          />
        </van-popup>
        <van-popup v-model="isPlate">
          <van-button v-for="(item, index) in plateType" @click="seleceItem(item)" :key=index>{{item.value}}</van-button>
        </van-popup>
    </div>
</template>

<script>
import { Cell, CellGroup, Field, Button, DatetimePicker, Popup, NoticeBar } from 'vant'
import { Select, Option } from 'element-ui'
import { plateType } from '@/utils/selectAble.js'
import { timeFormatter, timeFormatterSort, timeFormatterDayEnd } from '@/utils/formatter.js'
import { httpPost, httpGet } from '@/utils/restful'
import { TopWhite, getCamera, getChargeRules } from '@/api/url'
import { checkPlate } from '@/utils/validator.js'
export default {
  components: {
    [Button.name]: Button,
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup,
    [Field.name]: Field,
    [DatetimePicker.name]: DatetimePicker,
    [Popup.name]: Popup,
    [Select.name]: Select,
    [Option.name]: Option,
    [NoticeBar.name]: NoticeBar
  },
  data () {
    return {
      form: {
        id: undefined,
        localIdArr: [],
        userName: undefined,
        plate: undefined,
        userPhone: undefined,
        carTal: undefined,
        time1: '00:00',
        time2: '00:00',
        time3: '00:00',
        time4: '00:00',
        index: 1,
        ruleId: undefined,
        startTime: '',
        endTime: timeFormatterDayEnd(new Date()),
        reason: undefined
      },
      err: {
        startTime: '',
        endTime: ''
      },
      ruleList: [],
      localList: [],
      plateType,
      timeFormatter,
      createLoading: false,
      updataLoading: false,
      showbeginTime: false,
      showendTime: false,
      currentDate1: new Date(),
      currentDate2: new Date(),
      isPlate: false,
      showTime1: false,
      showTime2: false,
      showTime3: false,
      showTime4: false
    }
  },
  computed: {
    startTime () {
      return this.form.startTime === '' ? '' : timeFormatter(this.form.startTime)
    },
    endTime () {
      return this.form.endTime === '' ? '' : timeFormatter(this.form.endTime)
    }
  },
  created () {
    // 加载充值规则
    this.loadRules()
    // 加载通道信息
    this.loadLocals()
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
        this.form = Object.assign(this.form, {departmentId: this.$store.getters.departmentId})
        httpPost(TopWhite, this.form).then((res) => {
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
    loadRules () {
      httpGet(getChargeRules + '/' + this.$store.getters.departmentId).then(res => {
        this.ruleList = res.data
      }).catch(() => {})
    },
    loadLocals () {
      const ToastLoading = this.$toast.loading({ message: '加载中...', position: 'middle' })
      httpGet(getCamera + this.$store.getters.departmentId).then(res => {
        this.localList = res.data
        ToastLoading.clear()
      }).catch(() => { ToastLoading.clear() })
    },
    // 添加时间格式化
    ruleChange () {
      let obj = {}
      this.ruleList.forEach(item => {
        if (Number(this.form.ruleId) === item.value) {
          obj = item
        }
      })
      this.form.startTime = new Date().getTime()
      let year = timeFormatterSort(this.form.startTime).split('-')[0]
      let day = timeFormatterSort(this.form.startTime).split('-')[2]
      let month = Number(timeFormatterSort(this.form.startTime).split('-')[1]) + obj.monthNumber * (this.form.index ? this.form.index : 1)
      if (month > 12) {
        let num = parseInt(month / 12)
        year = Number(year) + num
        month = month % 12
      }
      this.form.endTime = new Date(year + '-' + month + '-' + day + ' 23:59:59').getTime()
    }
  }
}
</script>

<style lang="scss" scoped>
.btn-box {
    padding: 20px;
}
.el-select {
    width: 100%;
}
</style>

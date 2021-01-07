<template>
    <div>
        <ValidationObserver slim ref="form">
          <van-cell-group>
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
                        <el-select v-model="form.macArr" multiple collapse-tags>
                            <el-option v-for="item in localList" clearable :key="item.mac" :label="item.localName" :value="item.mac"></el-option>
                        </el-select>
                        <p class="fc-red">{{errors[0]}}</p>
                    </ValidationProvider>
                </template>
            </van-cell>
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
            <van-field
            type="number"
            v-model.trim="form.userPhone"
            label="联系方式"
            placeholder="请输入联系方式"
            />
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
              :value="enableTime"
              label="开始时间"
              placeholder="请选择"
              readonly
              @click="showbeginTime=true"
              :error-message="err.startTime"
            />
            <van-field
              required
              :value="overdueTime"
              label="结束时间"
              placeholder="请选择"
              readonly
              @click="showendTime=true"
              :error-message="err.endTime"
            />
            <van-field
              v-model.trim="form.remarks"
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
        <van-popup v-model="isPlate">
          <van-button v-for="(item, index) in plateType" @click="seleceItem(item)" :key=index>{{item.value}}</van-button>
        </van-popup>
    </div>
</template>

<script>
import { Cell, CellGroup, Field, Button, DatetimePicker, Popup } from 'vant'
import { Select, Option } from 'element-ui'
import { plateType } from '@/utils/selectAble.js'
import { timeFormatter, timeFormatterSort } from '@/utils/formatter.js'
import { httpPost, httpGet } from '@/utils/restful'
import { NormalWhite, getCamera, getChargeRules } from '@/api/url'
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
    [Option.name]: Option
  },
  data () {
    return {
      form: {
        id: undefined,
        mac: [],
        userName: undefined,
        plate: undefined,
        userPhone: undefined,
        ruleId: undefined,
        enableTime: '',
        overdueTime: '',
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
      isPlate: false
    }
  },
  computed: {
    enableTime () {
      return this.form.enableTime === '' ? '' : timeFormatter(this.form.enableTime)
    },
    overdueTime () {
      return this.form.overdueTime === '' ? '' : timeFormatter(this.form.overdueTime)
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
      this.form.enableTime = val
      this.showbeginTime = false
    },
    handleEndTime (val) {
      this.form.overdueTime = val
      this.showendTime = false
    },
    // 新增
    createData () {
      this.$refs.form.validate().then(success => {
        if (!success) return
        if (this.form.enableTime === '') this.err.startTime = '请选择开始时间'
        if (this.form.overdueTime === '') this.err.endTime = '请选择结束时间'
        if (checkPlate(this.form.plate)) this.$notify('请输入正确的车牌号码')
        if (this.form.startTime === '' || this.form.endTime === '' || checkPlate(this.form.plate)) return

        this.createLoading = true
        this.form = Object.assign(this.form, {departmentId: this.$store.getters.departmentId})
        httpPost(NormalWhite, this.form).then((res) => {
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
    ruleChange (value) {
      let obj = {}
      this.ruleList.forEach(item => {
        if (value === item.value) {
          obj = item
        }
      })
      this.form.enableTime = new Date().getTime()
      let year = timeFormatterSort(this.form.enableTime).split('-')[0]
      let day = timeFormatterSort(this.form.enableTime).split('-')[2]
      let month = Number(timeFormatterSort(this.form.enableTime).split('-')[1]) + obj.monthNumber
      if (month > 12) {
        let num = parseInt(month / 12)
        year = Number(year) + num
        month = month % 12
      }
      this.form.overdueTime = new Date(year + '-' + month + '-' + day + ' 23:59:59').getTime()
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

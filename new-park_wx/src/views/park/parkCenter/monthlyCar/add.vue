<template>
    <div>
        <ValidationObserver slim ref="form">
          <van-cell-group>
            <ValidationProvider name="车主姓名" rules="required" v-slot="{ errors }" slim>
              <van-field
                v-model.trim="form.carName"
                label="车主姓名"
                placeholder="请输入车主姓名"
                required
                :error-message="errors[0]"
              />
            </ValidationProvider>
            <ValidationProvider name="联系方式" rules="required|phone" v-slot="{ errors }" slim>
              <van-field
                type="number"
                v-model.trim="form.carPhone"
                label="联系方式"
                placeholder="请输入联系方式"
                required
                :error-message="errors[0]"
              />
            </ValidationProvider>
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
              required
              :value="validateAtVule"
              label="有效日期"
              placeholder="请选择"
              readonly
              @click="showbeginTime=true"
              :error-message="err.startTime"
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
          type="date"
          show-toolbar
          @cancel="showbeginTime=false"
          @confirm="handleBeginTime"
          />
        </van-popup>
        <van-popup v-model="isPlate">
          <van-button v-for="(item, index) in plateType" @click="seleceItem(item)" :key=index>{{item.value}}</van-button>
        </van-popup>
    </div>
</template>

<script>
import { Cell, CellGroup, Field, Button, DatetimePicker, Popup } from 'vant'
import { plateType } from '@/utils/selectAble.js'
import { timeFormatterSort } from '@/utils/formatter.js'
import { httpPost } from '@/utils/restful'
import { ToolWhite } from '@/api/url'
export default {
  components: {
    [Button.name]: Button,
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup,
    [Field.name]: Field,
    [DatetimePicker.name]: DatetimePicker,
    [Popup.name]: Popup
  },
  data () {
    return {
      form: {
        id: undefined,
        carName: '',
        plate: '',
        carPhone: '',
        validateAt: '',
        remarks: ''
      },
      err: {
        startTime: ''
      },
      plateType,
      timeFormatterSort,
      createLoading: false,
      updataLoading: false,
      showbeginTime: false,
      currentDate1: new Date(),
      isPlate: false
    }
  },
  computed: {
    validateAtVule () {
      return this.form.validateAt === '' ? '' : timeFormatterSort(this.form.validateAt)
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
      this.form.validateAt = val
      this.showbeginTime = false
    },
    // 新增
    createData () {
      this.$refs.form.validate().then(success => {
        if (!success) return
        if (this.form.startTime === '') {
          this.err.startTime = '请选择有效时间'
          return
        }
        this.createLoading = true
        this.form = Object.assign(this.form, {departmentId: this.$store.getters.departmentId})
        httpPost(ToolWhite, this.form).then((res) => {
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
    }
  }
}
</script>

<style lang="scss" scoped>
.btn-box {
    padding: 20px;
}
</style>

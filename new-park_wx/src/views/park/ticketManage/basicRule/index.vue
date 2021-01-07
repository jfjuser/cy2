<template>
  <div>
    <van-cell-group>
      <van-cell title="允许领取多张优惠券" >
        <van-radio-group v-model="form.isMore">
          <template v-for="item in isMoreType">
            <van-radio :name="item.valueNo" class="mar-b-15" :key="item.valueNo">{{item.valueName}}</van-radio>
          </template>
        </van-radio-group>
      </van-cell>
      <van-cell title="允许领取多张全免券" >
        <van-radio-group v-model="form.isMoreQm">
          <template v-for="item in isMoreQmType">
            <van-radio :name="item.valueNo" class="mar-b-15" :key="item.valueNo">{{item.valueName}}</van-radio>
          </template>
        </van-radio-group>
      </van-cell>
      <van-cell title="一次叠加所有优惠券" label="*注：叠加仅在允许领取多张优惠券时有效" >
        <van-radio-group v-model="form.isAdd">
          <template v-for="item in isAddType">
            <van-radio :name="item.valueNo" class="mar-b-15" :key="item.valueNo">{{item.valueName}}</van-radio>
          </template>
        </van-radio-group>
      </van-cell>
      <van-cell title="不叠加时剩余优惠券" >
        <van-radio-group v-model="form.restOpp">
          <template v-for="item in restAppType">
            <van-radio :name="item.valueNo" class="mar-b-15" :key="item.valueNo">{{item.valueName}}</van-radio>
          </template>
        </van-radio-group>
      </van-cell>
      <van-field
        v-model.trim="form.timeToMoney"
        label="时间-金额换算（元/分钟）:"
        step="0.01"
        @blur="checkMoney"
        :error-message="err.money"
        center
      />
      <van-cell title="车辆不在场是否可以领券" >
        <van-radio-group v-model="form.isGetTicketForOut">
          <template v-for="item in isGetTicketForOutType">
            <van-radio :name="item.valueNo" class="mar-b-15" :key="item.valueNo">{{item.valueName}}</van-radio>
          </template>
        </van-radio-group>
      </van-cell>
      <van-cell title="结算方式" >
        <van-radio-group v-model="form.ticketDeductibleType">
          <template v-for="item in ticketDeductibleTypeFor">
            <van-radio :name="item.valueNo" class="mar-b-15" :key="item.valueNo">{{item.valueName}}</van-radio>
          </template>
        </van-radio-group>
      </van-cell>
      <van-cell title="减免到0元是否自动开闸" >
        <van-radio-group v-model="form.openForOut">
          <template v-for="item in isGetTicketForOutType">
            <van-radio :name="item.valueNo" class="mar-b-15" :key="item.valueNo">{{item.valueName}}</van-radio>
          </template>
        </van-radio-group>
      </van-cell>
    </van-cell-group>

    <div class="btn-box">
        <van-button type="info" :loading="submitLoading" @click="onSubmit" block round>设置</van-button>
    </div>
    <!-- 说明 -->
    <section class="describe">
      <p>说明1：开启一次叠加所有优惠券之后</p>
      <p class="indent">a、全减免券减去的金额=本次停车费</p>
      <p class="indent">b、打折券减去的金额=本次停车费*折扣率</p>
      <p class="indent">c、减时间券减去的停车费=减去的时间*每分钟抵扣的金额</p>
      <p class="indent">d、减金额券则减去相应的金额</p>
      <p>说明2：若允许用户领取多张券而又不叠加，则系统自动使用其中一张优惠金额最大的优惠券</p>
      <p>说明3：关于优惠券抵扣商家：车主在优惠券有效期内使用的优惠券都会减去商家相应的余额</p>
      <p>说明4：关于优惠券结算方式，例如：优惠券可减免金额10元，优惠之前停车费5元，若以优惠券金额结算，将扣除商家10元；若以停车费金额结算，将扣除商家5元</p>
    </section>
  </div>
</template>

<script>
import { Cell, CellGroup, Field, Button, RadioGroup, Radio } from 'vant'
import { checkTimeToMoney } from '@/utils/validator.js'
import { isMoreType, isMoreQmType, isAddType, restAppType, ticketDeductibleTypeFor, isGetTicketForOutType } from '@/utils/selectAble.js'
import { httpGet, httpPost } from '@/utils/restful'
import { ticketParkSetting } from '@/api/url'
export default {
  components: {
    [Button.name]: Button,
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup,
    [Field.name]: Field,
    [RadioGroup.name]: RadioGroup,
    [Radio.name]: Radio
  },
  data () {
    return {
      submitLoading: false,
      form: {
        isMore: 1,
        isMoreQm: 0,
        isAdd: 1,
        restOpp: 0,
        timeToMoney: 0.01,
        ticketDeductibleType: 0,
        isGetTicketForOut: 0,
        openForOut: 1
        // smsPromptMoney: undefined
      },
      isMoreType: isMoreType,
      isMoreQmType: isMoreQmType,
      isAddType: isAddType,
      restAppType: restAppType,
      isGetTicketForOutType: isGetTicketForOutType,
      ticketDeductibleTypeFor: ticketDeductibleTypeFor,
      err: {
        money: ''
      }
    }
  },
  mounted () {
    this.getRules()
  },
  methods: {
    getRules () {
      const ToastLoading = this.$toast.loading({ message: '加载中...', position: 'middle', duration: 0 })
      httpGet(ticketParkSetting + '/' + this.$store.getters.departmentId)
        .then(res => {
          ToastLoading.clear()
          if (res.data !== null) {
            this.form = res.data
          }
        }).catch(() => { ToastLoading.clear() })
    },
    onSubmit () {
      if (this.form.timeToMoney === '') {
        return
      }
      if (checkTimeToMoney(this.form.timeToMoney) !== '') {
        return
      }
      this.submitLoading = true
      this.form = Object.assign(this.form, {departmentId: this.$store.getters.departmentId})
      httpPost(ticketParkSetting, this.form).then((res) => {
        this.submitLoading = false
        this.$notify({
          message: res.message,
          type: 'success'
        })
      }).catch(() => {
        this.submitLoading = false
      })
    },
    checkMoney () {
      if (this.form.timeToMoney === '') {
        this.err.money = '不可为空'
        return
      }
      this.err.money = checkTimeToMoney(this.form.timeToMoney)
    }
  }
}
</script>

<style lang="scss" scoped>
.btn-box {
    padding: 20px;
}
.describe {
  color: red;
  padding: 10px;
  .indent {
    text-indent: 45px
  }
  p {
    line-height: 20px;
    margin-bottom: 8px;
  }
}
</style>

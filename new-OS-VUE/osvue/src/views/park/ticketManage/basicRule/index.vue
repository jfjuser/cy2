<template>
  <div class="app-container">
    <div class="table-main">
      <el-form ref="form" :rules="formRules" :model="form" label-width="300px">
        <el-form-item label="允许领取多张优惠券" prop="isMore">
          <el-select  v-model="form.isMore"  class="filter-item" placeholder="请选择">
            <el-option v-for="item in isMoreType" :key="item.valueNo" :label="item.valueName" :value="item.valueNo"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="允许领取多张全免券" prop="isMoreQm">
          <el-select  v-model="form.isMoreQm"  class="filter-item" placeholder="请选择">
            <el-option v-for="item in isMoreQmType" :key="item.valueNo" :label="item.valueName" :value="item.valueNo"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="一次叠加所有优惠券" prop="isAdd">
          <el-select  v-model="form.isAdd" placeholder="请选择" class="filter-item">
            <el-option v-for="item in isAddType" :key="item.valueNo" :label="item.valueName" :value="item.valueNo"></el-option>
          </el-select>
          <span class="text">
              *注：叠加仅在允许领取多张优惠券时有效
          </span>
        </el-form-item>
        <el-form-item label="不叠加时剩余优惠券"  prop="restOpp">
          <el-select   v-model="form.restOpp" placeholder="请选择" class="filter-item">
            <el-option v-for="item in restAppType" :key="item.valueNo" :label="item.valueName" :value="item.valueNo"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="时间-金额换算（元/分钟）" prop="timeToMoney">
          <el-input  v-model="form.timeToMoney" step= "0.01" class="filter-item"></el-input>
        </el-form-item>
        <el-form-item label="车辆不在场是否可以领券" prop="isGetTicketForOut">
          <el-select  v-model="form.isGetTicketForOut" placeholder="请选择" class="filter-item">
            <el-option v-for="item in isGetTicketForOutType" :key="item.valueNo" :label="item.valueName" :value="item.valueNo"></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="金额监控(元)">
          <el-input  v-model="form.smsPromptMoney"   step= "0.01" class="filter-item"></el-input>
          <span class="text">
            *注：当商家金额小于当前金额时，将发送短信提醒给商家
          </span>
        </el-form-item> -->
        <el-form-item label="结算方式" prop="ticketDeductibleType">
          <el-select   v-model="form.ticketDeductibleType" placeholder="请选择" class="filter-item">
            <el-option v-for="item in ticketDeductibleTypeFor" :key="item.valueNo" :label="item.valueName" :value="item.valueNo"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="同一车同一商家是否只能领取一张优惠券">
          <el-select  v-model="form.disCount" placeholder="请选择" class="filter-item" >
            <el-option v-for="item in disCountList" :key="item.valueNo" :label="item.valueName" :value="item.valueNo"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="减免到0元是否自动开闸">
          <el-select  v-model="form.openForOut" placeholder="请选择" class="filter-item">
            <el-option v-for="item in isGetTicketForOutType" :key="item.valueNo" :label="item.valueName" :value="item.valueNo"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button :loading = "submitLoading" type="primary" @click="onSubmit">设置</el-button>
        </el-form-item>
      </el-form>
        <!-- 说明 -->
      <div style="color:red;font-size:14px;">
          <p>说明1：开启一次叠加所有优惠券之后</p>
          <p style="text-indent: 48px">a、全减免券减去的金额=本次停车费</p>
          <p style="text-indent: 48px">b、打折券减去的金额=本次停车费*折扣率</p>
          <p style="text-indent: 48px">c、减时间券减去的停车费=减去的时间*每分钟抵扣的金额</p>
          <p style="text-indent: 48px">d、减金额券则减去相应的金额</p>
          <p>说明2：若允许用户领取多张券而又不叠加，则系统自动使用其中一张优惠金额最大的优惠券</p>
          <p>说明3：关于优惠券抵扣商家：车主在优惠券有效期内使用的优惠券都会减去商家相应的余额</p>
          <p>说明4：关于优惠券结算方式，例如：优惠券可减免金额10元，优惠之前停车费5元，若以优惠券金额结算，将扣除商家10元；若以停车费金额结算，将扣除商家5元</p>
      </div>
    </div>
  </div>
</template>

<script>
import { checkTimeToMoney } from '@/utils/validator.js'
import { isMoreType, isMoreQmType, isAddType, restAppType, ticketDeductibleTypeFor, isGetTicketForOutType, disCountData } from '@/utils/selectAble.js'
import { httpGet, httpPost } from '@/utils/restful'
import { ticketParkSetting } from '@/api/url'
export default {
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
        disCount: 0,
        openForOut: 1
        // smsPromptMoney: undefined
      },
      disCountList: disCountData,
      isMoreType: isMoreType,
      isMoreQmType: isMoreQmType,
      isAddType: isAddType,
      restAppType: restAppType,
      isGetTicketForOutType: isGetTicketForOutType,
      ticketDeductibleTypeFor: ticketDeductibleTypeFor,
      formRules: {
        isMore: [
          {required: true, trigger: 'blur', message: '不可为空'}
        ],
        isMoreQm: [
          {required: true, trigger: 'blur', message: '不可为空'}
        ],
        restOpp: [
          {required: true, trigger: 'blur', message: '不可为空'}
        ],
        isAdd: [
          {required: true, trigger: 'blur', message: '不可为空'}
        ],
        timeToMoney: [
          {required: true, trigger: 'blur', message: '不可为空'},
          {validator: checkTimeToMoney, trigger: 'blur'}
        ],
        ticketDeductibleType: [
          {required: true, trigger: 'change', message: '不可为空'}
        ],
        isGetTicketForOut: [
          {required: true, trigger: 'change', message: '不可为空'}
        ],
        isOpenForOut: [
          {required: true, trigger: 'change', message: '不可为空'}
        ],
        isDisCount: [
          {required: true, trigger: 'change', message: '不可为空'}
        ]
      }
    }
  },
  mounted () {
    this.getRules()
  },
  methods: {
    getRules () {
      httpGet(ticketParkSetting + '/' + this.$store.getters.departmentId)
        .then(res => {
          if (res.data !== null) {
            this.form = res.data
          }
        }).catch(() => {})
    },
    onSubmit () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.submitLoading = true
          this.form = Object.assign(this.form, {departmentId: this.$store.getters.departmentId})
          httpPost(ticketParkSetting, this.form).then((res) => {
            this.submitLoading = false
            this.$message({
              message: res.message,
              type: 'success',
              duration: 4 * 1000
            })
          }).catch(() => {
            this.submitLoading = false
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.line{
  text-align: center;
}
.el-input{
    width: auto;
}
.text{
    color: #E6A23C;
}
</style>

<template>
  <div>
    <topRightBtn @click.native="clickA" v-has="['新增']">添加</topRightBtn>
    <main>
      <div class="text-c" style="color: #909399;padding-top:.5rem" v-if="tableData.length===0" >暂无数据</div>
      <list-card v-for="(item, index) in tableData" :key="index">
          <van-cell-group :border="isShowColumnFormatter(['编辑','删除'])">
              <van-cell title="包月个数" :value="item.monthNumber" />
              <van-cell title="包月金额" :value="moneyFormatter(item.monthPrice)" />
              <van-cell title="模式" :value="modeFormatter(item.modes)" />
              <van-cell title="备注信息" :value="item.remarks" />
          </van-cell-group>
          <template v-slot:footer>
            <van-button size="small" type="danger" @click="delRule(item)" plain round v-has="['删除']">删除</van-button>
            <van-button size="small" round @click="handleFun(item)" v-has="['编辑']">编辑</van-button>
          </template>
      </list-card>
      <van-popup v-model="isShow" position="right" style="width:100vw;min-height:100vh">
        <van-divider content-position="left" :style="{ color: '#1989fa', borderColor: '#1989fa', padding: '0 16px' }">
          充值规则
        </van-divider>
        <div style="display:flex;justify-content:center">
            <van-cell required style="width:65vw" title="包月个数" :border="false"/>
            <van-stepper style="margin:0.25rem 0" input-width="50px" min="1" v-model="form.monthNumber"/>
        </div>
        <div style="display:flex;justify-content:center">
            <van-cell style="width:65vw" required title="总收费(元)" :border="false"/>
            <van-stepper style="margin:0.25rem 0" input-width="50px" step="0.01" min="0" v-model="form.monthPrice"/>
        </div>
        <van-cell style="margin-left:0.35rem;width:60vw" required title="模式" :border="false"/>
        <van-radio-group style="margin-left:1.2rem;" v-model="form.modes">
          <van-radio style="margin-top:0.35rem" name="1">默认(区分特殊缴费金额)</van-radio>
          <van-radio style="margin:0.45rem 0" name="2">通用(车主可选通用模式的任意规则进行自助充值!)</van-radio>
        </van-radio-group>
        <van-field v-model="form.remarks" placeholder="请输入备注信息" style="margin-left:0.35rem;width:85vw" required label="备注" type="textarea" :border="false"/>
        <div class="text-r padding-10 flex-jc-around">
          <van-button style="width:2.666rem" @click="isShow = false" round>取消</van-button>
          <van-button type="info" v-if="status === 'create'" @click="addRule" :loading="createLoading" style="width:2.666rem" round>确定</van-button>
          <van-button type="info" v-if="status === 'adapt'"  @click="adaptRule" :loading="updataLoading" style="width:2.666rem" round>修改</van-button>
        </div>
        <!-- <van-divider content-position="right" :style="{ color: '#1989fa', borderColor: '#1989fa', padding: '0 16px' }">
          友情提示
        </van-divider> -->
        <!-- 说明 -->
        <div class="describe">
            <p class="fc-grey">模式说明</p>
            <p style="text-indent: 24px">a.默认 -> 车主自助充值时只能选择最近一次充值所用充值规则</p>
            <p style="text-indent: 24px">如: 区分大小车、业主/外部车辆、地上/地下停车等同一月数有部分车辆收费不同</p>
            <p style="text-indent: 24px">b.通用 -> 车主自助充值时都可以选择该规则，不区分车类型</p>
            <p style="text-indent: 24px">0元(免费)及需要特殊判断区分缴费金额请使用默认模式</p>
            <p style="text-indent: 24px">c.充值功能仅限已开通固定车的车牌使用</p>
        </div>
      </van-popup>
      <van-pagination
          v-if="tableData.length!==0"
          v-model="listQuery.offset"
          :page-count="Math.ceil(total/listQuery.limit)"
          :items-per-page="listQuery.limit"
          mode="simple"
          @change="changePage"/>
      </main>
  </div>
</template>

<script>
import topRightBtn from '@/components/topRightBtn.vue'
import listCard from '@/components/listCard.vue'
import { moneyFormatter, modeFormatter, isShowColumnFormatter } from '@/utils/formatter'
import { httpGet, httpPost, httpPut, httpDelete } from '@/utils/restful'
import { getChargeRulesPage, ChargeRules } from '@/api/url'
import { Cell, CellGroup, Button, Divider, Radio, RadioGroup, Popup, Field, Pagination, Stepper, Notify, Dialog } from 'vant'
export default {
  data () {
    return {
      tableData: [],
      isShow: false,
      createLoading: false,
      updataLoading: false,
      status: '',
      listQuery: {
        offset: 1,
        limit: 10
      },
      form: {
        id: undefined,
        monthNumber: 0,
        monthPrice: 0.01,
        modes: '1',
        remarks: undefined
      },
      moneyFormatter: moneyFormatter,
      modeFormatter: modeFormatter,
      isShowColumnFormatter,
      total: 0
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    // 切换查询页
    changePage (val) {
      this.listQuery.offset = val
      this.fetchData()
      document.body.scrollTop = 0
    },
    // 删除规则
    delRule (item) {
      Dialog.confirm({
        title: '提示',
        message: '确定要删除该条充值规则吗？'
      }).then(() => {
        const ToastLoading = this.$toast.loading({ message: '加载中...', position: 'middle', duration: 0 })
        httpDelete(ChargeRules, {ids: [item.id]}).then(res => {
          ToastLoading.clear()
          this.fetchData()
          Notify({
            type: 'success',
            message: res.message,
            duration: 4 * 1000
          })
        }).catch(() => {
          ToastLoading.clear()
        })
      }).catch(() => {})
    },
    clickA () {
      this.isShow = true
      this.status = 'create'
      this.form = {
        id: undefined,
        monthNumber: 0,
        monthPrice: 0.01,
        modes: '1',
        remarks: undefined
      }
    },
    // 添加充值规则
    addRule () {
      if (this.form.remarks === undefined) {
        Notify({
          message: '任何一项都不可为空',
          duration: 3000,
          type: 'warning'
        })
      } else {
        if (this.form.modes !== '2' || this.form.monthPrice > 0) {
          this.createLoading = true
          this.form = Object.assign(this.form, {departmentId: this.$store.getters.departmentId})
          httpPost(ChargeRules, this.form).then((res) => {
            this.fetchData()
            this.isShow = false
            setTimeout(() => { this.createLoading = false }, 300)
            Notify({
              message: res.message,
              type: 'success',
              duration: 4 * 1000
            })
          }).catch(() => {
            this.createLoading = false
          })
        } else {
          Notify({
            message: '通用模式不可以设置为免费',
            type: 'warning',
            duration: 3000
          })
        }
      }
    },
    // 修改规则
    adaptRule () {
      if (this.form.remarks === undefined || this.form.remarks === '') {
        Notify({
          message: '任何一项都不可为空',
          duration: 3000,
          type: 'warning'
        })
      } else {
        this.updataLoading = true
        this.form = Object.assign(this.form, {departmentId: this.$store.getters.departmentId})
        httpPut(ChargeRules, this.form).then(res => {
          this.fetchData()
          this.isShow = false
          setTimeout(() => { this.updataLoading = false }, 300)
          Notify({
            message: res.message,
            type: 'success',
            duration: 4 * 1000
          })
        }).catch(() => {
          this.updataLoading = false
        })
      }
    },
    handleFun (item) {
      // 编辑
      console.log(item)
      this.isShow = true
      this.status = 'adapt'
      this.form = JSON.parse(JSON.stringify(item))
    },
    fetchData () {
      const ToastLoading = this.$toast.loading({ message: '加载中...', position: 'middle', duration: 0 })
      httpGet(getChargeRulesPage + this.$store.getters.departmentId, this.listQuery).then(res => {
        if (res.data === null || res.data.rows === null) {
          this.tableData = []
          this.total = 0
        } else {
          this.tableData = res.data.rows
          this.total = res.data.total
        }
        ToastLoading.clear()
      }).catch(() => { ToastLoading.clear() })
    }
  },
  components: {
    topRightBtn,
    listCard,
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup,
    [Button.name]: Button,
    [Pagination.name]: Pagination,
    [Popup.name]: Popup,
    [Stepper.name]: Stepper,
    [Field.name]: Field,
    [Radio.name]: Radio,
    [RadioGroup.name]: RadioGroup,
    [Divider.name]: Divider
  }
}
</script>

<style lang="scss" scoped>
.describe {
  color:red;
  font-size:14px;
  padding: 0 10px;
  p {
    line-height: 20px;
    margin-bottom: 8px;
  }
}
</style>

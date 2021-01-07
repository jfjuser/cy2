<template>
   <div>
    <topRightBtn to="add/" v-has2father="['新增']">添加</topRightBtn>
    <div>
      <van-dropdown-menu class="mar-b-15">
        <van-dropdown-item title="同步状态" :options="option1" v-model="listQuery.isSync" @change="handleFilter"/>
        <van-dropdown-item title="是否过期" :options="option" v-model="listQuery.isOverDue" @change="handleFilter"/>
        <van-dropdown-item title="通道名称" :options="option2" v-model="listQuery.mac" @change="handleFilter"/>
        <van-dropdown-item title="更多搜索" ref="moreFilter">
          <van-field label="车主姓名" v-model.trim="listQuery.userName" placeholder="请输入车主姓名"/>
          <van-field label="车牌号" v-model.trim="listQuery.plate" placeholder="请输入车牌号" @click="querySearch"/>
          <van-button block type="info" @click="onSearch">搜索</van-button>
          <van-popup v-model="isIS">
            <van-button v-for="(item, index) in plateType" @click="clickItem(item)" :key=index>{{item.value}}</van-button>
          </van-popup>
        </van-dropdown-item>
      </van-dropdown-menu>
    </div>
    <van-popup v-model="isCharge" position="right" style="width:100vw;height:100vh">
      <div>
      <van-popup v-model="isOnePlate">
        <van-button v-for="(item, index) in plateType" @click="carOne(item)" :key=index>{{item.value}}</van-button>
      </van-popup>
        <van-field label="车牌号码" :border="false" @click="takePlate" placeholder="请输入车牌号" required v-model="monForm.plate"/>
        <van-field label="充值规则" @click="isRule = true" placeholder="请选择" required v-model="ruleId" readonly/>
        <van-popup v-model="isRule" style="width:80vw">
        <van-picker
          show-toolbar
          title="规则"
          value-key="label"
          :columns="ruleList"
          @cancel="isRule = false"
          @confirm="onConfirm"
        />
        </van-popup>
        <van-field label="包月次数" type="number" placeholder="请输入包月次数" required v-model="monForm.index"/>
        <p style="color:red" class="padding-10">结束时间=规则定义月数*次数（可在下方手动修改）</p>
        <van-field label="结束时间" required disabled placeholder="请设置时间" v-model="monForm.overdueTime" @click="showTime1=true" />
        <van-popup v-model="showTime1" position="bottom" :close-on-click-overlay="false" safe-area-inset-bottom>
          <van-datetime-picker
            v-model="currentDate"
            type="date"
            :min-date="maxDate"
            show-toolbar
            @cancel="showTime1=false"
            @confirm="handleEndTime"
          />
        </van-popup>
          <van-field label="充值金额" type="number" placeholder="请输入包月金额" required v-model="monForm.totalFee"/>
          <p style="color:red" class="padding-10">注：输入车牌和选择好规则后，结束时间和充值金额会自动计算</p>
      </div>
        <div style="text-align:center;margin-top:1rem">
          <van-button style="margin:0.5rem;width:2.666rem" @click="isCharge = false" round>取消</van-button>
          <van-button type="info"  @click="chargeWan" :loading="isPay" style="margin:0.5rem;width:2.666rem" round>保存</van-button>
        </div>
    </van-popup>
    <main>
      <div class="text-c" style="color: #909399;" v-if="total === 0">暂无数据</div>
      <list-card v-for="(item, index) in tableData" :key="index">
          <van-cell-group :border="isShowColumn2Father(['删除', '编辑', '充值'])">
              <van-cell title="车主姓名" :value="item.userName"/>
              <van-cell title="通道名称" :value="item.deviceName"/>
              <van-cell title="车牌号码" :value="item.plate"/>
              <van-cell title="联系方式" >
                <template v-if="isShowColumn2Father(['隐藏手机号'])">{{item.userPhone | hiddenPhone}}</template>
                <template v-else>{{item.userPhone}}</template>
              </van-cell>
              <van-cell title="同步状态">
                  <van-tag type="danger" v-if="item.isSync === 0">{{ isSyncFormatter(item.isSync) }}</van-tag>
                  <van-tag type="primary" v-if="item.isSync === 1">{{ isSyncFormatter(item.isSync) }}</van-tag>
                  <van-tag v-if="item.isSync === 2 || item.isSync === 3">{{ isSyncFormatter(item.isSync) }}</van-tag>
              </van-cell>
              <van-cell title="开始时间" :value="timeFormatter(item.enableTime)"/>
              <van-cell title="有效期至" :value="timeFormatter(item.overdueTime)"/>
              <van-cell title="备注信息" :value="item.reason"/>
          </van-cell-group>
          <template v-slot:footer>
            <van-button v-has2father="['删除']" type="danger" size="small" round @click="handleDelete(item.id)">删除</van-button>
            <van-button v-has2father="['编辑']" type="info" size="small" round @click="editItem(item)">编辑</van-button>
             <van-button type="info" v-has2father="['充值']" size="small" round @click.native="reCharge(item)">充值</van-button>
          </template>
      </list-card>
    <van-popup v-model="isPlate">
      <van-button v-for="(item, index) in plateType" @click="seleceItem(item)" :key=index>{{item.value}}</van-button>
    </van-popup>
      <van-popup v-model="isAdapt" style="width:90vw" round>
        <van-cell-group>
          <van-field label="车主姓名" v-model.trim="form.userName" required placeholder="请输入姓名" :error-message="err.userName"/>
          <van-field label="联系方式" @click="checkPhone" placeholder="请输入电话号" v-model.trim="form.userPhone"/>
          <p style="color:red;" class="padding-10">注意：为防止车场存在同名车主，同一个车主联系方式应该一致</p>
        </van-cell-group>
        <div class="bottom text-r padding-10 flex-jc-around">
          <van-button round style="width:2.666rem" @click="isAdapt = false">取消</van-button>
          <van-button type="info" round  @click="adaptSome" :loading="updataLoading" style="width:2.666rem">修改</van-button>
        </div>
      </van-popup>
      <van-pagination
        v-if="total !== 0"
        v-model="listQuery.offset"
        :page-count="Math.ceil(total/listQuery.limit)"
        :items-per-page="listQuery.limit"
        mode="simple"
        @change="changePage"/>
      </main>
  </div>
</template>

<script>
import topRightBtn from '@/components/topRightBtn'
import listCard from '@/components/listCard'
import { plateType, blackCarType, isSyncType } from '@/utils/selectAble.js'
import { Cell, DropdownMenu, DropdownItem, CellGroup, Popup, Field, Pagination, Search, Button, DatetimePicker, Picker, Notify, Dialog, Tag } from 'vant'
import { httpGet, httpPost, httpPut, httpDelete } from '@/utils/restful'
import { timeFormatter, timeFormatterDayEnd, isShowColumn2Father, isSyncFormatter, blackCarTypeFormatter, timeFormatterSort } from '@/utils/formatter'
import { getNormalWhite, NormalWhiteCharge, getChargeRules, NormalWhite, getCamera } from '@/api/url'
export default {
  data () {
    return {
      tableData: [],
      option2: [],
      ruleList: [],
      isPay: false,
      isOnePlate: false,
      ruleId: undefined,
      option: [
        {text: '已过期', value: 1},
        {text: '未过期', value: 0}
      ],
      option1: [
        {text: '未同步', value: 0},
        {text: '已同步', value: 1},
        {text: '后台同步中', value: 2},
        {text: '后台删除中', value: 3}
      ],
      isRule: false,
      type: undefined,
      monForm: {
        plate: undefined,
        ruleId: undefined,
        index: 1,
        overdueTime: timeFormatterDayEnd(new Date()),
        totalFee: undefined,
        remark: undefined
      },
      currentDate: new Date(),
      maxDate: new Date(),
      isPlate: false,
      createLoading: false,
      updataLoading: false,
      plateType: plateType,
      blackCarType: blackCarType,
      isSyncType: isSyncType,
      timeFormatterDayEnd: timeFormatterDayEnd,
      isSyncFormatter: isSyncFormatter,
      isShowColumn2Father: isShowColumn2Father,
      blackCarTypeFormatter: blackCarTypeFormatter,
      timeFormatter: timeFormatter,
      timeFormatterSort: timeFormatterSort,
      isCharge: false,
      showTime: false,
      showTime1: false,
      enableTime: null,
      overdueTime: null,
      localName: null,
      listQuery: {
        offset: 1,
        limit: 10,
        userName: undefined,
        plate: undefined,
        isSync: undefined,
        isOverDue: undefined,
        mac: undefined
      },
      total: 0,
      isIS: false,
      isAdapt: false,
      form: {
        id: undefined,
        mac: [],
        userName: undefined,
        plate: undefined,
        userPhone: undefined,
        ruleId: undefined,
        enableTime: undefined,
        overdueTime: undefined,
        reason: undefined
      },
      err: {
        userName: ''
      }
    }
  },
  created () {
    this.fetchData()
    this.loadLocals()
  },
  methods: {
    loadLocals () {
      httpGet(getCamera + this.$store.getters.departmentId).then(res => {
        for (const v of res.data) {
          v.text = v.localName
          v.value = v.mac
        }
        this.option2 = res.data
      }).catch(() => { })
    },
    editItem (item) {
      this.form = JSON.parse(JSON.stringify(item))
      console.log(this.form)
      this.err = {
        userName: ''
      }
      this.isAdapt = true
    },
    takePlate () {
      if (this.monForm.plate === '' || this.monForm.plate === undefined) {
        this.isOnePlate = true
      }
    },
    chargeWan () {
      console.log(this.monForm)
      const changeformData = Object.assign(this.monForm, {departmentId: this.$store.getters.departmentId})
      changeformData.overdueTime = new Date(changeformData.overdueTime).getTime()
      httpPost(NormalWhiteCharge, changeformData).then((res) => {
        this.isCharge = false
        setTimeout(() => { this.isPay = false }, 300)
        this.fetchData()
        Notify({
          message: res.message,
          type: 'success',
          duration: 4 * 1000
        })
      }).catch(() => {
        this.isPay = false
      })
    },
    reCharge (it) {
      this.isCharge = true
      console.log(it)
      this.monForm = Object.assign(this.monForm, it)
      this.monForm.overdueTime = this.timeFormatter(this.monForm.overdueTime)
      this.loadRules()
    },
    onConfirm (item, index) {
      console.log(item)
      this.form.ruleId = item.value
      this.monForm.ruleId = item.value
      this.ruleId = item.label
      this.isRule = false
    },
    loadRules () {
      httpGet(getChargeRules + '/' + this.$store.getters.departmentId).then(res => {
        this.ruleList = res.data
      }).catch(() => {})
    },
    checkPhone () {
    },
    seleceItem (item) {
      this.isPlate = false
      this.form.plate = item.value
    },
    carOne (item) {
      this.isOnePlate = false
      this.monForm.plate = item.value
    },
    handleFilter () {
      this.listQuery.offset = 1
      this.fetchData()
    },
    onSearch () {
      this.handleFilter()
      this.$refs.moreFilter.toggle()
    },
    // 车牌
    querySearch () {
      if (this.listQuery.plate === '' || this.listQuery.plate === undefined) {
        this.isIS = true
      }
    },
    clickItem (item) {
      this.listQuery.plate = item.value
      this.isIS = false
    },
    handleBeginTime (val) {
      this.enableTime = this.timeFormatterSort(val) + ' 00:00:00'
      this.form.enableTime = new Date(val).getTime()
      this.showTime = false
    },
    handleEndTime (val) {
      this.overdueTime = this.timeFormatterSort(val) + ' 23:59:59'
      console.log(val)
      this.form.overdueTime = new Date(val).getTime()
      this.showTime1 = false
    },
    handleDelete (id) {
      Dialog.confirm({
        title: '提示',
        message: '确定删除吗？'
      }).then(() => {
        const ToastLoading = this.$toast.loading({ message: '加载中...', position: 'middle', duration: 0 })
        httpDelete(NormalWhite, {ids: [id]}).then(res => {
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
    adaptSome () {
      if (this.userName !== '') {
        this.updataLoading = true
        const updateFormData = Object.assign({}, this.form)
        httpPut(NormalWhite, updateFormData).then(res => {
          this.fetchData()
          this.isAdapt = false
          setTimeout(() => { this.updataLoading = false }, 300)
          Notify({
            message: res.message,
            type: 'success',
            duration: 4 * 1000
          })
        }).catch(() => {
          this.updataLoading = false
        })
      } else {
        if (this.form.userName === '' || this.userName === undefined) {
          this.err.userName = '请输入车主姓名'
        } else { this.err.userName = '' }
      }
    },
    fetchData () {
      const ToastLoading = this.$toast.loading({ message: '加载中...', position: 'middle', duration: 0 })
      this.listQuery = Object.assign(this.listQuery, {departmentId: this.$store.getters.departmentId})
      httpGet(getNormalWhite, this.listQuery).then(res => {
        if (res.data === null || res.data.rows === null) {
          this.tableData = []
          this.total = 0
        } else {
          this.tableData = res.data.rows
          this.total = res.data.total
        }
        ToastLoading.clear()
      }).catch(() => {
        ToastLoading.clear()
      })
    },
    refresh () {
      this.listQuery = {
        offset: 1,
        limit: 10,
        plate: undefined,
        isSync: undefined,
        userName: undefined,
        isOverDue: undefined,
        mac: undefined
      }
      this.fetchData()
    },
    changePage (val) {
      this.listQuery.offset = val
      this.fetchData()
      document.body.scrollTop = 0
    }
  },
  components: {
    topRightBtn,
    listCard,
    [DropdownMenu.name]: DropdownMenu,
    [DropdownItem.name]: DropdownItem,
    [Search.name]: Search,
    [Field.name]: Field,
    [Cell.name]: Cell,
    [Popup.name]: Popup,
    [CellGroup.name]: CellGroup,
    [Pagination.name]: Pagination,
    [Button.name]: Button,
    [DatetimePicker.name]: DatetimePicker,
    [Picker.name]: Picker,
    [Tag.name]: Tag
  }
}
</script>

<style lang="scss" scoped>
.btn-popup{
  display: block;
  width:60vw;
  margin-left:15vw;
  margin-top: 0.5rem;
  border-radius:0.75rem;
}
</style>

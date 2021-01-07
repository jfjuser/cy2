<template>
   <div>
    <topRightBtn to="add/" v-has2father="['添加']">添加</topRightBtn>
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

    <main>
      <div class="text-c" style="color: #909399;" v-if="total === 0">暂无数据</div>
      <list-card v-for="(item, index) in tableData" :key="index">
          <van-cell-group>
              <van-cell title="车主姓名" :value="item.userName"/>
              <van-cell title="通道名称" :value="item.localName"/>
              <van-cell title="车牌号码" :value="item.plate"/>
              <van-cell title="车位数" :value="item.carTal"/>
              <van-cell title="联系方式" >
                <template v-if="isShowColumn2Father(['隐藏手机号'])">{{item.userPhone | hiddenPhone}}</template>
                <template v-else>{{item.userPhone}}</template>
              </van-cell>
              <van-cell title="同步状态">
                  <van-tag type="danger" v-if="item.isSync === 0">{{ isSyncFormatter(item.isSync) }}</van-tag>
                  <van-tag type="primary" v-if="item.isSync === 1">{{ isSyncFormatter(item.isSync) }}</van-tag>
                  <van-tag v-if="item.isSync === 2 || item.isSync === 3">{{ isSyncFormatter(item.isSync) }}</van-tag>
              </van-cell>
              <!-- <van-cell title="时段一" :value="item.time1 + '-' + item.time2"/>
              <van-cell title="时段二" :value="item.time3 + '-' + item.time4"/>
              <van-cell title="开始时间" :value="timeFormatter(item.startTime)"/>
              <van-cell title="有效期至" :value="timeFormatter(item.endTime)"/>
              <van-cell title="备注信息" :value="item.reason"/> -->
          </van-cell-group>
          <template v-slot:footer>
            <van-button v-has2father="['删除']" type="danger" size="small" round @click="handleDelete(item.id)">删除</van-button>
            <van-button v-has2father="['编辑']" type="info" size="small" round @click="editItem(item)">修改</van-button>
            <van-button v-has2father="['编辑']" @click="editCar(item)" type="info" size="small" round >编辑车辆</van-button>
            <van-button v-has2father="['充值']" type="info" size="small" @click="chargeDiv(item)" round >充值</van-button>
            <van-button type="primary" size="small" round @click="handleMore(item)">查看更多</van-button>
          </template>
      </list-card>
      <van-pagination
        v-if="total !== 0"
        v-model="listQuery.offset"
        :page-count="Math.ceil(total/listQuery.limit)"
        :items-per-page="listQuery.limit"
        mode="simple"
        @change="changePage"/>
    </main>
    <!-- 查看更多 -->
    <van-popup v-model="showMore" close-on-popstate round style="width:80%">
      <van-cell-group>
          <van-cell title="时段一" :value="moreData.time1 + '-' + moreData.time2"/>
          <van-cell title="时段二" :value="moreData.time3 + '-' + moreData.time4"/>
          <van-cell title="开始时间" :value="timeFormatter(moreData.startTime)"/>
          <van-cell title="有效期至" :value="timeFormatter(moreData.endTime)"/>
          <van-cell title="备注信息" :value="moreData.reason"/>
      </van-cell-group>
    </van-popup>
      <!-- 充值 -->
      <van-popup v-model="isRule" position="bottom">
        <van-picker
          show-toolbar
          title="规则"
          :columns="ruleList"
          value-key="label"
          @cancel="isRule = false"
          @confirm="onConfirm1"
        />
      </van-popup>
      <van-popup v-model="showTime" position="bottom" :close-on-click-overlay="false" safe-area-inset-bottom>
        <van-datetime-picker
          v-model="currentDate"
          type="date"
          :min-date="maxDate"
          show-toolbar
          @cancel="showTime=false"
          @confirm="handleEndTime"
        />
      </van-popup>
      <van-popup v-model="isCharge" style="width:90vw" round>
        <van-cell-group>
            <van-field label="车主姓名" v-model.trim="form.userName" placeholder="请输入车主姓名"/>
            <van-field label="联系方式" type="number" v-model.trim="form.userPhone" placeholder="请输入车主手机号"/>
            <van-field label="包月次数" type="number" v-model.trim="form.index" placeholder="请输入包月次数"/>
            <van-field label="总车位数" disabled v-model.trim="form.carTal" placeholder="请输入总车位数"/>
            <van-field label="充值规则" readonly @click="isRule = true" placeholder="请选择" v-model="ruleId"/>
            <van-field label="结束时间" readonly placeholder="请设置时间" v-model="endTime" @click="showTime=true" />
            <p style="color:red;" class="padding-10">结束时间 = 规则定义月数 * 次数 (可在下方手动修改)</p>
            <p style="color:red;padding-top:0" class="padding-10">注意：为防止车场存在同名车主，同一个车主联系方式应该一致</p>
        </van-cell-group>
        <div class="bottom text-r padding-10 flex-jc-around">
          <van-button round style="width:2.666rem" @click="isCharge = false">取消</van-button>
          <van-button round type="info" @click="createChange" style="width:2.666rem" :loading="isTop">确定</van-button>
        </div>
      </van-popup>
    <van-popup v-model="isOs">
      <van-button v-for="(item, index) in plateType" @click="clickWo(item)" :key=index>{{item.value}}</van-button>
    </van-popup>
    <!-- 编辑车辆 -->
    <van-popup v-model="isEditCar" style="width:90vw" round>
      <van-cell-group>
        <van-field required v-model.trim="form.plate" @click="plateIn" label="车牌号码" placeholder="请输入车牌号码"/>
        <van-cell title="时段一" required>
            <template slot="label">
                <van-field v-model="form.time1" label="开始时间" readonly @click="showTime1=true"/>
                <van-field v-model="form.time2" label="结束时间" readonly @click="showTime2=true"/>
            </template>
        </van-cell>
        <van-cell title="时段二" required>
            <template slot="label">
                <van-field v-model="form.time3" label="开始时间" readonly @click="showTime3=true"/>
                <van-field v-model="form.time4" label="结束时间" readonly @click="showTime4=true"/>
            </template>
        </van-cell>
      </van-cell-group>
      <div class="bottom text-r padding-10 flex-jc-around">
        <van-button round style="width:2.666rem" @click="isEditCar = false">取消</van-button>
        <van-button round type="info" @click="editQue" style="width:2.666rem" :loading="updataLoading">确定</van-button>
      </div>
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
    <!-- 修改 -->
    <van-popup v-model="isCar" style="width:90vw">
      <van-button size="large" v-for="(item, index) in option" @click="queItem(item)" :key=index>{{item.text}}</van-button>
    </van-popup>
    <van-popup v-model="isAdapt" style="width:90vw" round>
      <ValidationObserver ref="form">
        <van-cell-group>
          <ValidationProvider name="车主姓名" rules="required" v-slot="{ errors }" slim>
            <van-field label="车主姓名" v-model.trim="form.userName" required placeholder="请输入姓名" :error-message="errors[0]"/>
          </ValidationProvider>
          <ValidationProvider name="总车位数" rules="required|min_value:0|integer" v-slot="{ errors }" slim>
            <van-field type="number" label="总车位数" v-model.trim="form.carTal" required placeholder="请输入总车位数" :error-message="errors[0]"/>
          </ValidationProvider>
          <ValidationProvider name="联系方式" rules="required|phone" v-slot="{ errors }" slim>
            <van-field type="number" label="联系方式" v-model.trim="form.userPhone" required placeholder="请输入联系方式" :error-message="errors[0]"/>
          </ValidationProvider>
          <p style="color:red;" class="padding-10">注意：车主姓名中不可含有中文符号</p>
          <p style="color:red;padding-top:0" class="padding-10">注意：为防止车场存在同名车主，同一个车主联系方式应该一致</p>
        </van-cell-group>
      </ValidationObserver>
      <div class="bottom text-r padding-10 flex-jc-around">
        <van-button round style="width:2.666rem" @click="isAdapt = false">取消</van-button>
        <van-button type="info" round  @click="updateForm" :loading="upLoading" style="width:2.666rem">修改</van-button>
      </div>
    </van-popup>
  </div>
</template>

<script>
import topRightBtn from '@/components/topRightBtn'
import listCard from '@/components/listCard'
import { plateType } from '@/utils/selectAble.js'
import { Cell, DropdownMenu, DropdownItem, CellGroup, Popup, Field, Pagination, Search, Button, DatetimePicker, Picker, Notify, Dialog, Tag } from 'vant'
import { httpGet, httpPost, httpPut, httpDelete } from '@/utils/restful'
import { timeFormatter, timeFormatterDayEnd, isShowColumn2Father, isSyncFormatter, timeFormatterSort } from '@/utils/formatter'
import { getTopWhite, TopWhite, recharge, updateTopWhiteUser, deleteTopWhite, getChargeRules, getCamera } from '@/api/url'
import { checkPlate } from '@/utils/validator.js'
export default {
  data () {
    return {
      showMore: false,
      moreData: {},
      tableData: [],
      isOs: false,
      isTop: false,
      localList: [],
      option2: [],
      ruleList: [],
      ruleId: undefined,
      upLoading: false,
      isEditCar: false,
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
      isLocal: false,
      currentDate: new Date(),
      currentDate1: '00:00',
      maxDate: new Date(),
      isPlate: false,
      createLoading: false,
      updataLoading: false,
      deleteLoading: false,
      isTols: false,
      isCar: false,
      plateType: plateType,
      isSyncFormatter: isSyncFormatter,
      timeFormatterDayEnd: timeFormatterDayEnd,
      isShowColumn2Father: isShowColumn2Father,
      timeFormatter: timeFormatter,
      timeFormatterSort: timeFormatterSort,
      isAdd: false,
      isTol: false,
      showTime: false,
      isCharge: false,
      startTime: null,
      endTime: null,
      localName: null,
      listQuery: {
        offset: 1,
        limit: 10,
        userName: undefined,
        plate: undefined,
        isSync: undefined,
        time: undefined,
        isOverDue: undefined,
        localId: undefined
      },
      total: 0,
      isIS: false,
      isAdapt: false,
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
        startTime: undefined,
        endTime: timeFormatterDayEnd(new Date()),
        reason: undefined
      },
      showTime1: false,
      showTime2: false,
      showTime3: false,
      showTime4: false
    }
  },
  created () {
    this.fetchData()
    this.loadLocals()
  },
  methods: {
    // 查看更多
    handleMore (data) {
      this.moreData = data
      this.showMore = true
    },
    plateIn () {
      if (this.form.plate === '') {
        this.isOs = true
      }
    },
    createChange () {
      this.isTop = true
      const changeformData = Object.assign(this.form, {departmentId: this.$store.getters.departmentId})
      httpPost(recharge, changeformData).then((res) => {
        this.isCharge = false
        setTimeout(() => { this.isTop = false }, 300)
        this.fetchData()
        Notify({
          message: res.message,
          type: 'success',
          duration: 4 * 1000
        })
      }).catch(() => {
        this.isTop = false
      })
    },
    chargeDiv (item) {
      console.log(item)
      this.loadRules()
      this.form = JSON.parse(JSON.stringify(item))
      this.isCharge = true
    },
    editItem (item) {
      this.form = JSON.parse(JSON.stringify(item))
      console.log(this.form)
      this.isAdapt = true
      this.$nextTick(() => {
        this.$refs.form.reset()
      })
    },
    loadLocals () {
      httpGet(getCamera + this.$store.getters.departmentId).then(res => {
        if (res.data.length === 0) {
          this.option2 = [{text: '暂无数据'}]
          return
        }
        this.localList = res.data
        console.log(this.localList)
        this.localList.map((item) => {
          this.option2.push({text: item.localName, value: item.localId})
        })
      }).catch(() => {})
    },
    editCar (item) {
      this.form = Object.assign({}, item)
      this.isEditCar = true
    },
    onConfirm1 (item, index) {
      this.form.ruleId = item.value
      this.ruleId = item.label
      this.isRule = false
    },
    // 编辑车辆
    editQue () {
      if (checkPlate(this.form.plate)) {
        this.$notify('请输入正确的车牌号码')
        return
      }
      this.updataLoading = true
      const updateFormData = Object.assign({}, this.form)
      httpPut(TopWhite, updateFormData).then(res => {
        this.fetchData()
        this.isEditCar = false
        setTimeout(() => { this.updataLoading = false }, 300)
        Notify({
          message: res.message,
          type: 'success',
          duration: 4 * 1000
        })
      }).catch(() => {
        this.updataLoading = false
      })
    },
    loadRules () {
      httpGet(getChargeRules + '/' + this.$store.getters.departmentId).then(res => {
        this.ruleList = res.data
      }).catch(() => {})
    },
    queItem (item) {
      this.form.type = item.value
      this.type = item.text
      this.isCar = false
    },
    clickCar () {
      this.isCar = true
    },
    seleceItem (item) {
      this.isPlate = false
      this.form.plate = item.value
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
    checkPlate () {
      if (this.form.plate === '' || this.form.plate === undefined) {
        this.isPlate = true
      }
    },
    clickItem (item) {
      this.listQuery.plate = item.value
      this.isIS = false
    },
    clickWo (item) {
      this.form.plate = item.value
      this.isOs = false
    },
    handleEndTime (val) {
      this.endTime = this.timeFormatterSort(val) + ' 23:59:59'
      this.form.endTime = val
      this.showTime1 = false
    },
    handleDelete (id) {
      Dialog.confirm({
        title: '提示',
        message: '确定删除吗？'
      }).then(() => {
        const ToastLoading = this.$toast.loading({ message: '加载中...', position: 'middle', duration: 0 })
        httpDelete(deleteTopWhite, {ids: [id]}).then(res => {
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
    updateForm () {
      this.$refs.form.validate().then(success => {
        if (!success) return
        this.upLoading = true
        const updateFormData = Object.assign({}, this.form)
        httpPut(updateTopWhiteUser, updateFormData).then(res => {
          this.fetchData()
          this.upLoading = false
          setTimeout(() => { this.upLoading = false }, 300)
          Notify({
            message: res.message,
            type: 'success',
            duration: 4 * 1000
          })
          this.isAdapt = false
        }).catch(() => {
          this.upLoading = false
        })

        this.$nextTick(() => {
          this.$refs.form.reset()
        })
      })
    },
    fetchData () {
      const ToastLoading = this.$toast.loading({ message: '加载中...', position: 'middle', duration: 0 })
      this.listQuery = Object.assign(this.listQuery, {departmentId: this.$store.getters.departmentId})
      httpGet(getTopWhite, this.listQuery).then(res => {
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

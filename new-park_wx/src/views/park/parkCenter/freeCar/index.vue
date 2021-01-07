<template>
   <div>
    <topRightBtn @click.native="add" v-has="['新增']">添加</topRightBtn>
    <van-search placeholder="请输入车牌号"  show-action v-model.trim="listQuery.plate" @click="querySearch" class="mar-b-15" @search="handleFilter" >
      <div slot="action" @click="handleFilter">搜索</div>
    </van-search>
    <van-popup v-model="isIS">
      <van-button v-for="(item, index) in plateType" @click="clickItem(item)" :key=index>{{item.value}}</van-button>
    </van-popup>
    <main>
      <div class="text-c" style="color: #909399;" v-if="tableData === null" >暂无数据</div>
      <list-card v-for="(item, index) in tableData" :key="index">
          <van-cell-group :border="isShowColumnFormatter(['编辑','删除'])">
              <van-cell title="所属车场" :value="item.departmentName"/>
              <van-cell title="车牌号码" :value="item.plate"/>
              <van-cell title="开始时间" :value="timeFormatter(item.startTime)"/>
              <van-cell title="结束时间" :value="timeFormatter(item.endTime)"/>
              <van-cell title="备注信息" :value="item.remarks"/>
          </van-cell-group>
          <template v-slot:footer>
            <van-button v-has="['删除']" type="danger" size="small" round @click="handleDelete(item.id)">删除</van-button>
            <van-button v-has="['编辑']" type="info" size="small" round @click="editItem(item)">编辑</van-button>
          </template>
      </list-card>
      <van-popup v-model="isPlate">
        <van-button v-for="(item, index) in plateType" @click="seleceItem(item)" :key=index>{{item.value}}</van-button>
      </van-popup>
      <van-popup v-model="isAdd" style="width:90vw;" round close-on-popstate>
        <div class="title padding-10">{{textMap[status]}}</div>
        <van-cell-group>
          <van-field label="车牌号码" placeholder="请输入车牌号码" @click="checkPlate" required v-model.trim="form.plate" :error-message="err.plate"/>
          <van-field label="开始时间" readonly v-model="startTime" @click="showTime=true" />
          <van-field label="结束时间" readonly v-model="endTime" @click="showTime1=true" />
          <van-field label="备注信息" type="textarea" v-model.trim="form.remarks" autosize rows="1"/>
        </van-cell-group>
        <div class="text-r padding-10 flex-jc-around">
          <van-button style="width:2.666rem" round @click="isAdd = false">取消</van-button>
          <van-button type="info" round v-if="status === 'create'" @click="addSome" :loading="createLoading" style="width:2.666rem">确定</van-button>
          <van-button type="info" round v-if="status === 'adapt'"  @click="adaptSome" :loading="updataLoading" style="width:2.666rem">修改</van-button>
        </div>
      </van-popup>
      <van-popup v-model="showTime" position="bottom" :close-on-click-overlay="false" safe-area-inset-bottom>
        <van-datetime-picker
          v-model="currentDate"
          type="date"
          :min-date="maxDate"
          show-toolbar
          @cancel="showTime=false"
          @confirm="handleBeginTime"
          />
      </van-popup>
      <van-popup v-model="showTime1" position="bottom" :close-on-click-overlay="false" safe-area-inset-bottom>
        <van-datetime-picker
          v-model="currentDate"
          type="date"
          show-toolbar
          :min-date="maxDate"
          @cancel="showTime1=false"
          @confirm="handleEndTime"
          />
      </van-popup>

      <van-pagination
        v-if="tableData !== null"
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
import { plateType } from '@/utils/selectAble.js'
import { checkPlate } from '@/utils/validator.js'
import { Cell, CellGroup, Popup, Field, Pagination, Search, Button, DatetimePicker, Notify, Dialog } from 'vant'
import { httpGet, httpPost, httpPut, httpDelete } from '@/utils/restful'
import { timeFormatter, timeFormatterSort, isShowColumnFormatter } from '@/utils/formatter'
import { getFreeCar, FreeCar } from '@/api/url'
export default {
  data () {
    return {
      isShowColumnFormatter,
      tableData: [],
      currentDate: new Date(),
      maxDate: new Date(),
      isPlate: false,
      createLoading: false,
      updataLoading: false,
      deleteLoading: false,
      plateType: plateType,
      timeFormatter: timeFormatter,
      timeFormatterSort: timeFormatterSort,
      isAdd: false,
      showTime: false,
      showTime1: false,
      startTime: null,
      endTime: null,
      listQuery: {
        offset: 1,
        limit: 10,
        plate: undefined
      },
      status: '',
      textMap: {
        adapt: '编辑',
        create: '添加'
      },
      total: 0,
      isIS: false,
      form: {
        id: undefined,
        plate: undefined,
        startTime: null,
        endTime: null,
        remarks: ''
      },
      err: {
        plate: ''
      }
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    editItem (item) {
      this.err.plate = ''
      this.form = JSON.parse(JSON.stringify(item))
      this.startTime = this.timeFormatter(this.form.startTime)
      this.endTime = this.timeFormatter(this.form.endTime)
      this.isAdd = true
      this.status = 'adapt'
    },
    seleceItem (item) {
      this.isPlate = false
      this.form.plate = item.value
    },
    handleFilter () {
      this.listQuery.offset = 1
      this.fetchData()
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
    handleBeginTime (val) {
      this.startTime = this.timeFormatterSort(val) + ' 00:00:00'
      this.form.startTime = val
      this.showTime = false
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
        httpDelete(FreeCar, {ids: [id]}).then(res => {
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
      if (this.form.plate !== '' && this.form.plate !== undefined) {
        this.updataLoading = true
        const updateFormData = Object.assign({}, this.form)
        httpPut(FreeCar, updateFormData).then(res => {
          this.fetchData()
          this.isAdd = false
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
        this.err.plate = '车牌号不可为空'
      }
    },
    addSome () {
      if (this.form.plate !== '' && this.form.plate !== undefined) {
        if (checkPlate(this.form.plate)) {
          this.err.plate = '请输入正确的车牌号码'
          return
        }
        this.createLoading = true
        this.form = Object.assign(this.form, {departmentId: this.$store.getters.departmentId})
        httpPost(FreeCar, this.form).then((res) => {
          this.fetchData()
          this.isAdd = false
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
        this.err.plate = '车牌号不可为空'
      }
    },
    add () {
      this.err.plate = ''
      this.isAdd = true
      this.form = {
        id: undefined,
        sign: '',
        position: undefined,
        remark: ''
      }
      this.startTime = null
      this.endTime = null
      this.status = 'create'
    },
    searchInfo () {
      this.listQuery.offset = 1
      this.fetchData()
    },
    fetchData () {
      const ToastLoading = this.$toast.loading({ message: '加载中...', position: 'middle', duration: 0 })
      this.listQuery = Object.assign(this.listQuery, {departmentId: this.$store.getters.departmentId})
      httpGet(getFreeCar, this.listQuery).then(res => {
        ToastLoading.clear()
        this.tableData = res.data.rows
        this.total = res.data.total
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
    [Search.name]: Search,
    [Field.name]: Field,
    [Cell.name]: Cell,
    [Popup.name]: Popup,
    [CellGroup.name]: CellGroup,
    [Pagination.name]: Pagination,
    [Button.name]: Button,
    [DatetimePicker.name]: DatetimePicker
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
.title {
  font-size: 15px;
}
</style>

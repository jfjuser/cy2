<template>
   <div>
    <topRightBtn @click.native="add" v-has="['新增']">添加</topRightBtn>
    <main>
      <div class="text-c" style="color: #909399;padding-top:.5rem" v-if="tableData.length===0" >暂无数据</div>
      <list-card v-for="(item, index) in tableData" :key="index">
          <van-cell-group :border="isShowColumnFormatter(['编辑', '删除'])">
              <van-cell title="本地编号" :value="item.localId" />
              <van-cell title="所属车场" :value="item.departmentName" />
              <van-cell title="操作员编号" :value="item.uin" />
              <van-cell title="通道名称" :value="item.localId" />
              <van-cell title="图片" :value="item.imgPath" />
              <van-cell title="原因" :value="item.reason" />
          </van-cell-group>
          <template v-slot:footer>
            <van-button type="danger" round size="small" @click="deleteItem(item.id)" v-has="['删除']">删除</van-button>
            <van-button type="info" round @click="editItem(item)" size="small" v-has="['编辑']">编辑</van-button>
            <!-- <van-button size="small" round type="info" plain @click="handleExport">导出</van-button> -->
          </template>
      </list-card>
      <van-popup v-model="isAdd" style="width:90vw;" round>
        <div class="title padding-10">{{textMap[dialogStatus]}}</div>
        <van-cell title="开闸时间" required :value="form.date" @click="showTime=true" />
        <van-cell title="通道名称" required @click="isTol=true" />
        <van-field label="开闸原因" v-model="form.reason" required placeholder="请输入开闸原因"/>
        <div class="text-r padding-10 flex-jc-around">
            <van-button @click="isAdd = false" style="width:2.666rem" round >取消</van-button>
            <van-button v-if="dialogStatus === 'create'" style="width:2.666rem" round @click="saveSome" :loading="createLoading" type="info">确定</van-button>
             <van-button v-if="dialogStatus === 'update'" style="width:2.666rem" round @click="adaptOne" :loading="updataLoading" type="info">修改</van-button>
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

      <van-popup v-model="showTime" position="bottom" :close-on-click-overlay="false" safe-area-inset-bottom>
        <van-datetime-picker
          v-model="currentDate"
          type="date"
          :max-date="maxDate"
          show-toolbar
          @cancel="showTime=false"
          @confirm="handleBeginTime"
          />
      </van-popup>
      <van-popup v-model="isTol" position="bottom" :close-on-click-overlay="false" safe-area-inset-bottom>
        <van-picker
          show-toolbar
          title="通道"
          :columns="columns"
          @cancel="isTol = false"
          @confirm="onConfirm"
        />
      </van-popup>
  </div>
</template>

<script>
import topRightBtn from '@/components/topRightBtn'
import listCard from '@/components/listCard'
import { timeFormatterSort, isShowColumnFormatter, timeFormatter } from '@/utils/formatter'
import { Cell, CellGroup, Divider, Popup, Field, Pagination, Button, DatetimePicker, Picker, Notify, Dialog } from 'vant'
import { httpGet, httpDelete, httpPut, httpPost } from '@/utils/restful'
import { getOpenRecord, OpenRecord } from '@/api/url'
export default {
  data () {
    return {
      tableData: [],
      createLoading: false,
      updataLoading: false,
      deleteLoading: false,
      timeFormatter: timeFormatter,
      timeFormatterSort: timeFormatterSort,
      isShowColumnFormatter: isShowColumnFormatter,
      isAdd: false,
      isTol: false,
      showTime: false,
      maxDate: new Date(),
      currentDate: new Date(),
      columns: [],
      listQuery: {
        offset: 1,
        limit: 10
      },
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '添加'
      },
      total: 0,
      form: {
        id: undefined,
        date: '',
        localId: undefined,
        reason: ''
      }
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    handleBeginTime (val) {
      this.form.date = this.timeFormatterSort(val) + ' 00:00:00'
      this.showTime = false
    },
    deleteItem (id) {
      Dialog.confirm({
        title: '提示',
        message: '确认要删除吗？'
      }).then(() => {
        const ToastLoading = this.$toast.loading({ message: '加载中...', position: 'middle', duration: 0 })
        httpDelete(OpenRecord, {ids: [id]}).then(res => {
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
    onConfirm (val, index) {
      console.log(val)
      console.log(index)
    },
    editItem (item) {
      this.form = JSON.parse(JSON.stringify(item))
      this.form.date = this.timeFormatter(this.form.date)
      this.isAdd = true
      this.dialogStatus = 'update'
    },
    saveSome () {
      if (this.form.date === '' || this.form.localId === undefined || this.form.reason === '') {
        Notify({
          message: '请填写完整信息',
          duration: 3000,
          type: 'warning'
        })
      } else {
        this.createLoading = true
        this.form = Object.assign(this.form, {departmentId: this.$store.gettters.departmentId})
        httpPost(OpenRecord, this.form).then((res) => {
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
      }
    },
    adaptOne () {
      if (this.form.date === '' || this.form.localId === undefined || this.form.reason === '') {
        Notify({
          message: '请填写完整信息',
          duration: 3000,
          type: 'warning'
        })
      } else {
        this.updataLoading = true
        const updateFormData = Object.assign({}, this.form)
        httpPut(OpenRecord, updateFormData).then(res => {
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
      }
    },
    fetchData () {
      const ToastLoading = this.$toast.loading({ message: '加载中...', position: 'middle', duration: 0 })
      this.listQuery = Object.assign(this.listQuery, {departmentId: this.$store.getters.departmentId})
      httpGet(getOpenRecord, this.listQuery).then(res => {
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
    },
    add () {
      this.isAdd = true
      this.dialogStatus = 'create'
      this.form = {
        id: undefined,
        date: '',
        localId: undefined,
        reason: ''
      }
    }
  },
  components: {
    topRightBtn,
    listCard,
    [Divider.name]: Divider,
    [Field.name]: Field,
    [Cell.name]: Cell,
    [Popup.name]: Popup,
    [CellGroup.name]: CellGroup,
    [Pagination.name]: Pagination,
    [Button.name]: Button,
    [DatetimePicker.name]: DatetimePicker,
    [Picker.name]: Picker
  }
}
</script>

<style lang="scss" scoped>
.title {
  font-size: 15px;
}
</style>

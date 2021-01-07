<template>
   <div>
    <topRightBtn to="add/" v-has2father="['添加']">添加</topRightBtn>
    <van-dropdown-menu class="mar-b-15">
      <van-dropdown-item title="同步状态" :options="option1" v-model="listQuery.isSync" @change="handleFilter"/>
      <van-dropdown-item title="是否过期" :options="option" v-model="listQuery.isOverDue" @change="handleFilter"/>
      <van-dropdown-item title="更多搜索" ref="moreFilter">
        <van-field label="车主姓名" v-model.trim="listQuery.carName" placeholder="请输入车主姓名"/>
        <van-field label="车牌号" v-model.trim="listQuery.plate" placeholder="请输入车牌号" @click="querySearch"/>
        <van-button block type="info" @click="onSearch">搜索</van-button>
        <van-popup v-model="isIS">
          <van-button v-for="(item, index) in plateType" @click="clickItem(item)" :key=index>{{item.value}}</van-button>
        </van-popup>
      </van-dropdown-item>
    </van-dropdown-menu>

    <main>
      <div class="text-c" style="color: #909399;" v-if="total === 0" >暂无数据</div>
      <list-card v-for="(item, index) in tableData" :key="index">
          <van-cell-group :border="isShowColumn2Father(['删除', '编辑'])">
              <van-cell title="车场名称" :value="item.departmentName"/>
              <van-cell title="本地编号" :value="item.localId"/>
              <van-cell title="车主姓名" :value="item.carName"/>
              <van-cell title="车牌号码" :value="item.plate"/>
              <van-cell title="联系方式" >
                <template v-if="isShowColumn2Father(['隐藏手机号'])">{{item.carPhone | hiddenPhone}}</template>
                <template v-else>{{item.carPhone}}</template>
              </van-cell>
              <van-cell title="同步状态" :value="isSyncFormatter(item.isSync)"/>
              <van-cell title="开始时间" :value="timeFormatter(item.startTime)"/>
              <van-cell title="有效期至" :value="timeFormatter(item.validateAt)"/>
              <van-cell title="备注信息" :value="item.remarks"/>
          </van-cell-group>
          <template v-slot:footer>
            <van-button v-has2father="['删除']" type="danger" size="small" round @click="handleDelete(item.id)">删除</van-button>
            <van-button v-has2father="['编辑']" type="info" size="small" round @click="editItem(item)">编辑</van-button>
          </template>
      </list-card>

      <van-popup v-model="isEdit" style="width:90vw;" round>
        <van-cell-group>
          <van-field label="车主姓名" v-model.trim="form.carName" required placeholder="请输入姓名" :error-message="err.carName"/>
          <van-field label="联系方式" placeholder="请输入联系方式" required v-model.trim="form.carPhone" :error-message="err.carPhone"/>
          <van-field label="备注信息" placeholder="请填写备注信息" v-model.trim="form.remarks" />
        </van-cell-group>
        <div class="bottom text-r padding-10 flex-jc-around">
          <van-button round style="width:2.666rem" @click="isEdit = false">取消</van-button>
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
import { plateType } from '@/utils/selectAble.js'
import { Cell, DropdownMenu, DropdownItem, CellGroup, Popup, Field, Pagination, Search, Button, Notify, Dialog } from 'vant'
import { httpGet, httpDelete, httpPut } from '@/utils/restful'
import { timeFormatter, isShowColumn2Father, isSyncFormatter } from '@/utils/formatter'
import { getToolWhite, ToolWhite } from '@/api/url'
import { checkPhone } from '@/utils/validator.js'
export default {
  data () {
    return {
      tableData: [],
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
      type: undefined,
      updataLoading: false,
      plateType: plateType,
      isSyncFormatter: isSyncFormatter,
      isShowColumn2Father: isShowColumn2Father,
      timeFormatter: timeFormatter,
      listQuery: {
        offset: 1,
        limit: 10,
        carName: undefined,
        plate: undefined,
        isSync: undefined,
        startTime: undefined,
        validateAt: undefined,
        isOverDue: undefined
      },
      total: 0,
      isIS: false,
      form: {
        id: undefined,
        carName: '',
        plate: '',
        carPhone: '',
        validateAt: '',
        remarks: ''
      },
      err: {
        carName: '',
        carPhone: ''
      },
      isEdit: false
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    editItem (item) {
      this.form = JSON.parse(JSON.stringify(item))
      this.err = {
        carName: '',
        carPhone: ''
      }
      this.isEdit = true
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
    handleDelete (id) {
      Dialog.confirm({
        title: '提示',
        message: '确定删除吗？'
      }).then(() => {
        const ToastLoading = this.$toast.loading({ message: '加载中...', position: 'middle', duration: 0 })
        httpDelete(ToolWhite, {ids: [id]}).then(res => {
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
      if (this.form.carName !== '' && this.form.carPhone !== '') {
        this.updataLoading = true
        const updateFormData = Object.assign({}, this.form)
        httpPut(ToolWhite, updateFormData).then(res => {
          this.fetchData()
          this.isEdit = false
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
        if (this.form.carName === '') {
          this.err.carName = '请输入车主姓名'
        } else { this.err.carName = '' }
        if (checkPhone(this.carPhone)) {
          this.err.carPhone = '请输入正确的手机号'
        } else { this.err.carPhone = '' }
      }
    },
    fetchData () {
      const ToastLoading = this.$toast.loading({ message: '加载中...', position: 'middle', duration: 0 })
      this.listQuery = Object.assign(this.listQuery, {departmentId: this.$store.getters.departmentId})
      httpGet(getToolWhite, this.listQuery).then(res => {
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
    [Button.name]: Button
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

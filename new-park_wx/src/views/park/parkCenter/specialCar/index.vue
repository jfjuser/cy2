<template>
   <div>
    <topRightBtn @click.native="add" v-has="['新增']">添加</topRightBtn>
    <van-dropdown-menu class="mar-b-15">
        <van-dropdown-item :options="positionType" v-model="listQuery.position" title="位置信息" @change="searchInfo" />
        <van-search placeholder="标识符" v-model.trim="listQuery.sign" show-action left-icon="" @search="searchInfo" >
            <div slot="action" @click="searchInfo">搜索</div>
        </van-search>
    </van-dropdown-menu>

    <main>
      <div class="text-c" style="color: #909399;" v-if="tableData.length===0" >暂无数据</div>
      <list-card v-for="(item, index) in tableData" :key="index">
          <van-cell-group :border="isShowColumnFormatter(['编辑','删除'])">
              <van-cell title="标识符" :value="item.sign"/>
              <van-cell title="所处位置" :value="positionFormatter(item.position)"/>
              <van-cell title="备注信息" :value="item.remark"/>
          </van-cell-group>
          <template v-slot:footer>
            <van-button v-has="['删除']" type="danger" size="small" round @click="handleDelete(item.id)">删除</van-button>
            <van-button v-has="['编辑']" type="info" size="small" round @click="editItem(item)">编辑</van-button>
          </template>
      </list-card>
      <van-pagination
        v-if="tableData.length!==0"
        v-model="listQuery.offset"
        :page-count="Math.ceil(total/listQuery.limit)"
        :items-per-page="listQuery.limit"
        mode="simple"
        @change="changePage"/>
    </main>
    <van-popup v-model="isAdd" style="width:90vw;" round close-on-popstate>
      <ValidationObserver slim ref="form">
        <van-cell-group>
          <ValidationProvider name="标识符" rules="required" v-slot="{ errors }" slim>
            <van-field label="标识符" required v-model.trim="form.sign" placeholder="请输入标识符" :error-message="errors[0]"/>
          </ValidationProvider>
          <ValidationProvider name="位置信息" rules="required" v-slot="{ errors }" slim :customMessages="{'required':'请选择{_field_}'}">
            <van-cell title="位置信息" required >
              <van-radio-group v-model="form.position" slot="label">
                  <van-radio :name="item.valueNo" v-for="item in positionType" :key="item.valueNo" class="mar-b-15">{{item.valueName}}</van-radio>
              </van-radio-group>
              <p class="fc-red text-c">{{errors[0]}}</p>
            </van-cell>
          </ValidationProvider>
          <van-field label="备注信息" type="textarea" v-model.trim="form.remark" autosize rows="1"/>
        </van-cell-group>
      </ValidationObserver>
      <div class="text-r padding-10 flex-jc-around">
        <van-button round style="width:2.666rem" @click="isAdd = false">取消</van-button>
        <van-button type="info" round v-if="status === 'create'" @click="addSome" :loading="createLoading" style="width:2.666rem">确定</van-button>
        <van-button type="info" round v-if="status === 'adapt'"  @click="adaptSome" :loading="updataLoading" style="width:2.666rem">修改</van-button>
      </div>
    </van-popup>
  </div>
</template>

<script>
import topRightBtn from '@/components/topRightBtn'
import listCard from '@/components/listCard'
import { Cell, CellGroup, Popup, Field, Pagination, Button, DatetimePicker, Notify, Dialog, DropdownMenu, DropdownItem, Search, RadioGroup, Radio } from 'vant'
import { httpGet, httpPost, httpPut, httpDelete } from '@/utils/restful'
import { positionFormatter, isShowColumnFormatter } from '@/utils/formatter'
import { getSpecialCar, SpecialCar } from '@/api/url'
import { positionType } from '@/utils/selectAble.js'
export default {
  data () {
    return {
      tableData: [],
      createLoading: false,
      updataLoading: false,
      deleteLoading: false,
      positionFormatter: positionFormatter,
      isShowColumnFormatter,
      isAdd: false,
      showTime: false,
      positionType: [],
      listQuery: {
        offset: 1,
        limit: 10,
        sign: undefined,
        position: undefined
      },
      status: '',
      total: 0,
      form: {
        id: undefined,
        sign: '',
        position: undefined,
        remark: ''
      }
    }
  },
  created () {
    this.typeFormatter()
    this.fetchData()
  },
  methods: {
    // 格式化下拉菜单
    typeFormatter () {
      for (const v of positionType) {
        v.text = v.valueName
        v.value = v.valueNo
      }
      this.positionType = positionType
    },
    editItem (item) {
      this.form = JSON.parse(JSON.stringify(item))
      this.isAdd = true
      this.$nextTick(() => {
        this.$refs.form.reset()
      })
      this.status = 'adapt'
    },
    handleDelete (id) {
      Dialog.confirm({
        title: '提示',
        message: '确定删除吗？'
      }).then(() => {
        const ToastLoading = this.$toast.loading({ message: '加载中...', position: 'middle', duration: 0 })
        httpDelete(SpecialCar, {ids: [id]}).then(res => {
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
      this.$refs.form.validate().then(success => {
        if (!success) return
        this.updataLoading = true
        const updateFormData = Object.assign({}, this.form)
        httpPut(SpecialCar, updateFormData).then(res => {
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

        this.$nextTick(() => {
          this.$refs.form.reset()
        })
      })
    },
    addSome () {
      this.$refs.form.validate().then(success => {
        if (!success) return
        this.createLoading = true
        this.form = Object.assign(this.form, {departmentId: this.$store.getters.departmentId})
        httpPost(SpecialCar, this.form).then((res) => {
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

        this.$nextTick(() => {
          this.$refs.form.reset()
        })
      })
    },
    add () {
      this.isAdd = true
      this.$nextTick(() => {
        this.$refs.form.reset()
      })
      this.form = {
        id: undefined,
        sign: '',
        position: undefined,
        remark: ''
      }
      this.status = 'create'
    },
    searchInfo () {
      this.listQuery.offset = 1
      this.fetchData()
    },
    fetchData () {
      const ToastLoading = this.$toast.loading({ message: '加载中...', position: 'middle', duration: 0 })
      this.listQuery = Object.assign(this.listQuery, {departmentId: this.$store.getters.departmentId})
      httpGet(getSpecialCar, this.listQuery).then(res => {
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
    [Field.name]: Field,
    [Cell.name]: Cell,
    [Popup.name]: Popup,
    [CellGroup.name]: CellGroup,
    [Pagination.name]: Pagination,
    [Button.name]: Button,
    [DatetimePicker.name]: DatetimePicker,
    [DropdownMenu.name]: DropdownMenu,
    [DropdownItem.name]: DropdownItem,
    [Search.name]: Search,
    [RadioGroup.name]: RadioGroup,
    [Radio.name]: Radio
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

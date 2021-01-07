<template>
  <div>
    <top-right-btn v-has2father="['新增']" :to="`add/`">添加</top-right-btn>
    <van-search placeholder="请输入商家名称" show-action v-model.trim="listQuery.shopName" class="mar-b-15" @search="handleFilter" >
      <div slot="action" @click="handleFilter">搜索</div>
    </van-search>

    <main>
        <div class="text-c" style="color: #909399;" v-if="tableData.length===0" >暂无数据</div>
        <list-card v-for="(item, index) in tableData" :key="index" >
            <van-cell-group :border="isShowColumn2Father(['编辑', '加减款', '管理员', '修改密码', '二维码管理', '删除'])">
                <van-cell title="商家名称" :value="item.shopName" />
                <van-cell title="系统名称" :value="item.sysName" />
                <van-cell title="手机号" >
                  <template v-if="isShowColumn2Father(['隐藏手机号'])">{{item.phone | hiddenPhone}}</template>
                  <template v-else>{{item.phone}}</template>
                </van-cell>
                <van-cell title="总金额" :value="moneyFormatter(item.totalFee)" />
                <van-cell title="余额" :value="moneyFormatter(item.nowFee)" />
                <van-cell title="商家地址" :value="item.address" />
                <van-cell title="创建时间" :value="timeFormatter(item.createAt)" />
            </van-cell-group>
            <template v-slot:footer>
                <van-button size="small" round @click="handleFun(item)" v-has2father="['编辑', '加减款', '管理员', '修改密码', '二维码管理', '删除']" >操作</van-button>
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

    <van-popup v-model="showFun" position="bottom" safe-area-inset-bottom>
      <van-button block v-has2father="['编辑']" @click="handleUpdate">编辑</van-button>
      <van-button block v-has2father="['加减款']" @click="handleAddSub(funData)" >加减款</van-button>
      <van-button block v-has2father="['管理员']" @click="handleAdmin(funData)">管理员</van-button>
      <van-button block v-has2father="['修改密码']" @click="isNewPsw=true" >修改密码</van-button>
      <van-button block @click="handleQrCode(funData)">二维码权限</van-button>
      <van-button block v-has2father="['删除']" @click="handleDelete(funData.id)">删除</van-button>
      <div style="height:0.3rem;" class="bgc-grey"></div>
      <van-button block class="mar-t-15" @click="showFun=false">取消</van-button>
    </van-popup>

    <van-popup v-model="dialogAddSubVisible" round close-on-popstate class="popup" style="width:80%;padding-top:.5rem">
      <van-cell-group>
        <van-cell title="当前余额(元)" :value="fee" />
        <van-cell title="类型" required >
          <van-radio-group v-model="formAdd.type">
              <van-radio :name="item.valueNo" class="mar-b-15" v-for="item in moneyType" :key="item.valueNo">{{item.valueName}}</van-radio>
          </van-radio-group>
        </van-cell>
        <van-field required type="number" v-model.trim="formAdd.fee" label="金额(元)" placeholder="请输入金额" step=0.01 />
      </van-cell-group>
      <div class="bottom text-r padding-10 flex-jc-around">
        <van-button round @click="dialogAddSubVisible = false" style="width:2.666rem">取消</van-button>
        <van-button round type="info" @click="createAddData" :loading="createAddLoading" style="width:2.666rem">保存</van-button>
      </div>
    </van-popup>
    <van-popup v-model="isNewPsw" round close-on-popstate class="popup" style="width:80%;padding-top:.5rem">
      <van-field :border="false" v-model.trim="userPassword" label="密码修改" placeholder="请输入新密码" type="password" />
      <div class="bottom text-r padding-10 flex-jc-around">
        <van-button round @click="isNewPsw = false" style="width:2.666rem">取消</van-button>
        <van-button round type="info" @click="handlePassword" :loading="updataLoading" style="width:2.666rem">修改</van-button>
      </div>
    </van-popup>
    <van-popup v-model="dialogPermissionVisible" round close-on-popstate class="popup" style="width:80%;padding-top:.5rem">
      <van-checkbox-group v-model="checked">
        <template v-for="item in qrCodeList">
          <van-checkbox shape="square" :name="item.id" style="line-height:20px;margin:0.5rem;" :key="item.id">{{item.name}}</van-checkbox>
        </template>
      </van-checkbox-group>
      <div class="bottom text-r padding-10 flex-jc-around">
        <van-button round @click="dialogPermissionVisible = false" style="width:2.666rem">取消</van-button>
        <van-button round type="info" @click="permData" :loading="codeLoading" style="width:2.666rem">保存</van-button>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { Pagination, Field, Button, Search, Popup, Cell, CellGroup, Dialog, RadioGroup, Radio, Checkbox, CheckboxGroup } from 'vant'
import topRightBtn from '@/components/topRightBtn'
import listCard from '@/components/listCard'
import { checkPsd } from '@/utils/validator'
import { moneyType } from '@/utils/selectAble.js'
import { httpGet, httpPost, httpDelete } from '@/utils/restful'
import { getBuinessInfo, BuinessInfo, getBuinessPer, setBuinessPer, addSubMoney, updatePassword } from '@/api/url'
import { moneyFormatter, timeFormatter, isShowColumn2Father } from '@/utils/formatter.js'

export default {
  components: {
    [Pagination.name]: Pagination,
    [Button.name]: Button,
    [Search.name]: Search,
    [Popup.name]: Popup,
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup,
    [Field.name]: Field,
    [RadioGroup.name]: RadioGroup,
    [Radio.name]: Radio,
    [Checkbox.name]: Checkbox,
    [CheckboxGroup.name]: CheckboxGroup,
    topRightBtn,
    listCard
  },
  data () {
    return {
      isShowColumn2Father,
      timeFormatter,
      moneyFormatter,
      listQuery: {
        offset: 1,
        limit: 10,
        shopName: undefined
      },
      tableData: [],
      total: 0,
      showFun: false,
      funData: {},
      dialogPermissionVisible: false,
      checked: [],
      qrCodeList: [],
      codeLoading: false,
      isNewPsw: false,
      userPassword: '',
      updataLoading: false,
      moneyType: moneyType,
      createAddLoading: false,
      dialogAddSubVisible: false,
      formAdd: {
        shopId: undefined,
        type: undefined,
        fee: 0
      },
      fee: 0
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    handleFun (data) {
      this.funData = data
      this.showFun = true
    },
    resetFormAdd () {
      this.formAdd = {
        id: undefined,
        type: undefined,
        fee: 0
      }
    },
    // 加减款
    handleAddSub (row) {
      this.resetFormAdd()
      this.fee = row.nowFee
      this.formAdd.shopId = row.id
      this.dialogAddSubVisible = true
    },
    // 加减款提交
    createAddData () {
      if (this.formAdd.type === undefined) {
        this.$notify('请选择类型')
        return
      }
      if (this.formAdd.fee === '') {
        this.$notify('金额不可为空')
        return
      }
      if (this.checkFee(this.formAdd.fee) !== '') {
        this.$notify(this.checkFee(this.formAdd.fee))
        return
      }
      this.createAddLoading = true
      this.formAdd.fee = Number(this.formAdd.fee)
      httpPost(addSubMoney, this.formAdd).then((res) => {
        this.$notify({
          message: res.message,
          type: 'success',
          duration: 4 * 1000
        })
        this.fetchData()
        this.dialogAddSubVisible = false
        this.showFun = false
        setTimeout(() => { this.createAddLoading = false }, 300)
      }).catch(() => {
        this.createAddLoading = false
      })
    },
    checkFee (value) {
      if (value < 0) {
        return '请输入大于0的数字'
        // 判断是不是浮点数
      } else if (value % 1 !== 0 && value.toString().split('.')[1].length > 2) {
        return '最多包含两位小数'
      } else if (this.formAdd.type === 1 && value > this.fee) {
        return '减款金额需要小于当前余额'
      } else {
        return ''
      }
    },
    // 删除选中
    handleDelete (id) {
      Dialog.confirm({
        title: '提示',
        message: '确认删除吗？'
      }).then(() => {
        const ToastLoading = this.$toast.loading({ message: '加载中...', position: 'middle', duration: 0 })
        httpDelete(BuinessInfo, {ids: [id]}).then(res => {
          ToastLoading.clear()
          this.fetchData()
          this.$notify({
            message: res.message,
            type: 'success'
          })
          this.showFun = false
        }).catch(() => {
          ToastLoading.clear()
        })
      }).catch(() => {})
    },
    fetchData () {
      const ToastLoading = this.$toast.loading({ message: '加载中...', position: 'middle', duration: 0 })
      this.listQuery = Object.assign(this.listQuery, {departmentId: this.$store.getters.departmentId})
      httpGet(getBuinessInfo, this.listQuery).then(res => {
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
    // 分页
    changePage (val) {
      this.listQuery.offset = val
      this.fetchData()
      document.body.scrollTop = 0
    },
    handleFilter () {
      this.listQuery.offset = 1
      this.fetchData()
    },
    handleUpdate () {
      this.$router.push(`${this.$route.path}editor/?data=${JSON.stringify(this.funData)}`)
    },
    handleAdmin () {
      this.$router.push(`${this.$route.path}addAdmin/?data=${JSON.stringify(this.funData)}`)
    },
    // 修改密码
    handlePassword () {
      let value = this.userPassword
      if (checkPsd(value)) {
        this.$notify('密码为6-12位字母、数字或者下划线')
        return
      }
      const data = {
        departmentId: this.funData.id,
        userPassword: value
      }
      this.updataLoading = true
      httpPost(updatePassword, data)
        .then(res => {
          this.isNewPsw = false
          this.$notify({
            message: res.message,
            type: 'success'
          })
          this.showFun = false
          this.updataLoading = false
        }).catch(() => { this.updataLoading = false })
    },
    // 二维码权限
    handleQrCode (row) {
      this.checked = []
      const ToastLoading = this.$toast.loading({ message: '加载中...', position: 'middle', duration: 0 })
      httpGet(getBuinessPer + row.id)
        .then(res => {
          ToastLoading.clear()
          this.qrCodeList = res.data.info
          this.checked = res.data.ids
          this.dialogPermissionVisible = true
        }).catch(() => { ToastLoading.clear() })
    },
    permData () {
      // console.log(this.checked)
      let data = {
        ids: this.checked,
        shopDepartmentId: this.funData.id
      }
      this.codeLoading = true
      httpPost(setBuinessPer, data)
        .then(res => {
          this.dialogPermissionVisible = false
          this.$notify({
            message: res.message,
            type: 'success'
          })
          this.showFun = false
          this.codeLoading = false
        }).catch(() => { this.codeLoading = false })
    }
  }
}
</script>

<template>
  <div>
    <top-right-btn v-has2father="['新增']" :to="`add/`">添加</top-right-btn>
    <van-search placeholder="请输入账号" show-action v-model.trim="listQuery.userName" class="mar-b-15" @search="handleFilter" >
      <div slot="action" @click="handleFilter">搜索</div>
    </van-search>

    <main>
        <div class="text-c" style="color: #909399;" v-if="tableData.length===0" >暂无数据</div>

        <list-card v-for="(item, index) in tableData" :key="index">
            <van-cell-group :border="isShowColumn2Father(['编辑', '分配角色', '修改密码', '分配超管', '删除'])">
                <van-cell title="账号" :value="item.userName" />
                <van-cell title="昵称" :value="item.nickName" />
                <van-cell title="手机号" >
                  <template v-if="isShowColumn2Father(['隐藏手机号'])">{{item.phone | hiddenPhone}}</template>
                  <template v-else>{{item.phone}}</template>
                </van-cell>
                <van-cell title="邮箱" :value="item.email" />
                <van-cell title="是否超管">
                  <span v-if="item.isAdmin === null || item.isAdmin === 0">否</span>
                  <span v-if="item.isAdmin === 1">是</span>
                </van-cell>
                <van-cell title="性别" >
                  <span v-if="item.sex == 0">男</span>
                  <span v-if="item.sex == 1">女</span>
                </van-cell>
                <van-cell title="备注信息" :value="item.resume" />
            </van-cell-group>
            <template v-slot:footer>
                <van-button size="small" round @click="handleFun(item)" v-has2father="['编辑', '分配角色', '修改密码', '分配超管', '删除']" >操作</van-button>
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

    <van-popup v-model="isRole" round close-on-popstate class="popup" style="width:80%;padding-top:.5rem">
      <van-radio-group v-model="checked" >
        <van-radio v-for="item in roleList"  style="line-height:20px;margin:0.5rem;" :name="item.id" :key="item.id">{{item.name}}</van-radio>
      </van-radio-group>
      <div class="bottom text-r padding-10 flex-jc-around">
        <van-button round @click="isRole = false" style="width:2.666rem">取消</van-button>
        <van-button round type="info" @click="queRole" :loading="roleLoading" style="width:2.666rem">确定</van-button>
      </div>
    </van-popup>
    <van-popup v-model="isNewPsw" round close-on-popstate class="popup" style="width:80%;padding-top:.5rem">
      <van-field v-model.trim="newPsw" label="新密码" placeholder="请输入新密码" type="password" :border="false" />
      <div class="bottom text-r padding-10 flex-jc-around">
        <van-button round @click="isNewPsw = false" style="width:2.666rem">取消</van-button>
        <van-button round type="info" @click="quePsw" :loading="updateLoading" style="width:2.666rem">修改</van-button>
      </div>
    </van-popup>
    <van-popup v-model="isSuper" round close-on-popstate class="popup" style="width:80%;padding-top:.5rem">
      <van-radio-group v-model="isAdmin" >
        <van-radio style="line-height:20px;" :name="0">非超管</van-radio>
        <van-radio style="line-height:20px;" :name="1">超管</van-radio>
      </van-radio-group>
      <div class="bottom text-r padding-10 flex-jc-around">
        <van-button round @click="isSuper = false" style="width:2.666rem">取消</van-button>
        <van-button round type="info" @click="queSuper" :loading="updateLoading" style="width:2.666rem">修改</van-button>
      </div>
    </van-popup>
    <van-popup v-model="showFun" position="bottom" safe-area-inset-bottom>
      <van-button block v-has2father="['编辑']" @click="handleUpdate">编辑</van-button>
      <van-button block v-has2father="['修改密码']" @click="updataPsw">修改密码</van-button>
      <van-button block v-has2father="['分配角色']" @click="getRole" v-if="funData.isAdmin === 0">分配角色</van-button>
      <van-button block v-has2father="['分配超管']" @click="isSuper = true">分配超管</van-button>
      <van-button block v-has2father="['删除']" @click="delInfo">删除</van-button>
      <div style="height:0.3rem;" class="bgc-grey"></div>
      <van-button block class="mar-t-15" @click="showFun=false">取消</van-button>
    </van-popup>
  </div>
</template>

<script>
import { Pagination, RadioGroup, Radio, Field, Button, Search, Popup, Cell, CellGroup, Dialog } from 'vant'
import topRightBtn from '@/components/topRightBtn'
import listCard from '@/components/listCard'
import { isShowColumn2Father } from '@/utils/formatter.js'
import { httpGet, httpPost, httpDelete } from '@/utils/restful'
import { getUsers, UserRole, givePermissionEr, User, updatePassword } from '@/api/url'
import { checkPsd } from '@/utils/validator.js'
export default {
  components: {
    [Pagination.name]: Pagination,
    [Button.name]: Button,
    [Search.name]: Search,
    [Popup.name]: Popup,
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup,
    [Field.name]: Field,
    topRightBtn,
    [RadioGroup.name]: RadioGroup,
    [Radio.name]: Radio,
    listCard
  },
  data () {
    return {
      newPsw: '',
      isRole: false,
      isSuper: false,
      roleList: [],
      checked: undefined,
      isShowColumn2Father,
      roleLoading: false,
      listQuery: {
        offset: 1,
        limit: 10,
        userName: undefined,
        sex: undefined,
        phone: undefined
      },
      tableData: [],
      total: 0,
      showFun: false,
      isAdmin: undefined,
      isNewPsw: false,
      userId: undefined,
      funData: {},
      updateLoading: false
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    handleFun (data) {
      this.funData = data
      this.rowId = data.id
      this.isAdmin = data.isAdmin
      this.showFun = true
    },
    updataPsw () {
      this.isNewPsw = true
    },
    // 获取角色
    getRole () {
      this.userId = this.funData.id
      let rowId = this.funData.id
      const ToastLoading = this.$toast.loading({ message: '加载中...', position: 'middle', duration: 0 })
      httpGet(UserRole + '/' + rowId).then((res) => {
        ToastLoading.clear()
        if (res.data.roleInfo.length === 0) {
          this.$notify({
            type: 'warning',
            message: '暂无角色，请先添加角色',
            duration: 4 * 1000
          })
        } else {
          this.checked = res.data.roleId
          this.roleList = res.data.roleInfo
          this.isRole = true
        }
      }).catch(() => { ToastLoading.clear() })
    },
    // 确定分配给超管与否
    queSuper () {
      let data = {
        id: this.rowId,
        isAdmin: this.isAdmin
      }
      this.updateLoading = true
      httpPost(givePermissionEr, data).then((res) => {
        this.updateLoading = false
        this.$notify({
          message: res.message,
          type: 'success',
          duration: 3000
        })
        this.fetchData()
        this.isSuper = false
        this.showFun = false
      }).catch(() => { this.updateLoading = false })
    },
    // 确定角色
    queRole () {
      if (this.checked === undefined) {
        this.$notify({
          message: '请先选择角色在进行提交！',
          type: 'warning',
          duration: 3000
        })
      } else {
        this.roleLoading = true
        let data = {
          roleId: this.checked,
          userId: this.userId
        }
        httpPost(UserRole, data).then(res => {
          this.roleLoading = false
          this.isRole = false
          this.showFun = false
          this.$notify({
            type: 'success',
            message: res.message,
            duration: 4 * 1000
          })
        }).catch(() => {
          this.roleLoading = false
        })
      }
    },
    // 删除
    delInfo () {
      Dialog.confirm({
        title: '提示',
        message: '确定删除该用户吗'
      }).then(() => {
        const ToastLoading = this.$toast.loading({ message: '加载中...', position: 'middle', duration: 0 })
        httpDelete(User, {ids: [this.funData.id]}).then(res => {
          ToastLoading.clear()
          this.fetchData()
          this.$notify({
            type: 'success',
            message: res.message,
            duration: 4 * 1000
          })
          this.showFun = false
        }).catch(() => {
          ToastLoading.clear()
        })
      }).catch(() => {})
    },
    // 确定修改密码
    quePsw () {
      let row = this.funData
      if (checkPsd(this.newPsw)) {
        this.$notify({
          type: 'danger',
          duration: 3000,
          message: '密码为6-12位数字，字母或下划线组成'
        })
        this.newPsw = ''
      } else {
        const data = {
          id: row.id,
          userPassword: this.newPsw
        }
        this.updateLoading = true
        httpPost(updatePassword, data)
          .then(res => {
            this.updateLoading = false
            this.$notify({
              message: res.message,
              type: 'success',
              duration: 3000
            })
            this.isNewPsw = false
            this.showFun = false
          }).catch(() => { this.updateLoading = false })
      }
    },
    fetchData () {
      const ToastLoading = this.$toast.loading({ message: '加载中...', position: 'middle', duration: 0 })
      this.listQuery = Object.assign(this.listQuery, {departmentId: this.$store.getters.departmentId})
      httpGet(getUsers, this.listQuery).then(res => {
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
    // 搜索
    handleFilter () {
      this.listQuery.offset = 1
      this.fetchData()
    },
    handleUpdate () {
      this.$router.push(`${this.$route.path}editor/?data=${JSON.stringify(this.funData)}`)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>

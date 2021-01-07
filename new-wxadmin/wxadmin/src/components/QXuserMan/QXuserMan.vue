<template>
    <div class="bigDiv">
      <NavBar
        title="权限管理"
        left-text="返回"
        right-text="添加"
        left-arrow
        @click-left="onClickLeft"
        @click-right="onClickRight"
      />
      <van-tabs v-model="active" @click="clickTab">
        <van-tab title="角色管理"></van-tab>
        <van-tab title="账号管理"></van-tab>
      </van-tabs>
      <Search
        v-model="listQuery.userName"
        placeholder="账号"
        show-action
        shape="round"
        style="margin-top:0.5rem"
        background="rgb(14,105,254)"
        @search="onSearch"
          >
        <div slot="action" @click="onSearch">搜索</div>
      </Search>
        <!-- <Collapse v-model="activeName">
          <CollapseItem title="权限/用户管理" name="0">
            <span class="titleCss" style="color:#1E90FF">用户管理</span>
          </CollapseItem>
          <CollapseItem title="权限/角色管理" name="1">
            <span class="titleCss" @click="goPlay">查看角色管理</span>
          </CollapseItem>
        </Collapse> -->
        <!-- 用户列表 -->
        <PullRefresh v-model="isLoading" @refresh="onRefresh">
          <div style="width:100vw;min-height:60vh">
            <CellGroup style="margin-bottom:1rem;" v-for="(item, index) in userData" :key=index>
                <Cell title="账号" :value="item.userName"/>
                <Cell title="手机号" :value="item.phone"/>
                <Cell title="邮箱" :value="item.email"/>
                <Cell title="昵称" :value="item.nickName"/>
                <Cell title="性别" :value="sexFormatter(item.sex)"/>
                <Cell title="备注信息" :value="item.resume"/>
                <!-- <Cell title="操作" is-link @click="edit(item)" style="font-size:1rem;font-weight:bold;color:#B22222"/> -->
                <span style="display:block;line-height:2.5rem;color:rgb(14,105,254);margin-left:86%;" @click="edit(item)">操作</span>
            </CellGroup>
          </div>
          <div style="height:60vh" v-if="total === 0">
            <img src='@/assets/no-data.png' style="max-width: 100vw;max-height: auto;"/>
          </div>
        </PullRefresh>
        <div style="margin:1.5rem 0 0rem 0;" id="p">
          <Pagination
            v-if="total > 3"
            v-model="listQuery.offset"
            :page-count="Math.ceil(total/10)"
            :total-items = 'total'
            mode="simple"
            @change="seePage"
          >
          </Pagination>
        </div>
        <!-- 编辑 -->
        <Popup v-model="isEdit" position="bottom">
          <Button size="large" v-if="share.includes('删除')" @click="delUser">删除</Button>
          <Button size="large" v-if="share.includes('编辑')" @click="compile">编辑</Button>
          <Button size="large" v-if="share.includes('修改密码')" @click="changePsw">修改密码</Button>
          <Button size="large" v-if="share.includes('分配角色')" @click="assignRole">分配角色</Button>
          <Button size="large" @click="closeWindows">取消</Button>
        </Popup>
        <!-- 编辑修改资料 -->
        <Popup v-model="show" style="width:94vw;" position=top>
          <Cell title="编辑">
            <Icon name="cross" style="font-size:1rem" @click="cancelEdit"></Icon>
          </Cell>
          <Field
            v-model="userEdit.nickName"
            label="昵称"
            placeholder="请输入昵称"
            required
            :error-message= 'err.nickName'
            @blur="checknickName"
          />
          <Field
            v-model="userEdit.phone"
            label="手机号"
            placeholder="请输入手机号"
            required
            :error-message= 'err.phone'
            @blur="checkPhone"
          />
          <Field
            v-model="userEdit.email"
            label="邮箱"
            placeholder="请输入邮箱"
            required
            @blur="checkEmail"
            :error-message= 'err.email'
          />
          <Field
            label="性别"
            disabled
            required
            :border="false"
            />
          <!-- <RadioGroup v-model="radio" :v-model="sexFormatter(userEdit.sex = radio === '0' ? '0' : '1' )" style="margin-left:2.5rem">
            <CellGroup>
              <Cell title="男" clickable @click="radio = '0'">
                <Radio name="0"/>
              </Cell>
              <Cell title="女" clickable @click="radio = '1'">
                <Radio name="1"/>
              </Cell>
            </CellGroup>
          </RadioGroup> -->
          <RadioGroup v-model="radio" :v-model="sexFormatter(userEdit.sex = radio === '0' ? '0' : '1' )" style="margin-left:1rem;line-height:2rem;border-bottom:1px solid #ebedf0;">
            <Radio name="0" style="margin-left:2rem;display:inline-block;">男</Radio>
            <Radio name="1" style="margin-left:4rem;display:inline-block;">女</Radio>
          </RadioGroup>
          <Field
            v-model="userEdit.resume"
            label="备注"
          />
          <Button size=large class="btn" @click="cancelEdit">取消</Button>
          <Button size=large class="btn" style="margin-bottom:1.5rem" type="info" @click="alter" :isLoading="updateLoading">保存</Button>
        </Popup>
        <!-- 分配角色 -->
        <Popup v-model="dialogRoleVisible" style="width:88vw;height:auto" >
          <Field
            label="分配角色"
            right-icon="cross"
            disabled
            @click-right-icon="cancelAssign"
          />
           <RadioGroup v-model="checked" style="margin:1rem">
            <Radio v-for="item in roleList"  :name="item.id" :key="item.id" style="margin-left:2rem;line-height:2rem;display:inline-block">{{item.name}}</Radio>
          </RadioGroup>
          <!-- <Button class="btnAssign" @click="cancelAssign">取消</Button> -->
          <Button class="btnAssign" type="info" @click="submitRole" :isLoading="roleLoading">确定</Button>
        </Popup>
        <!-- 修改密码 -->
        <Popup v-model="isChange" style="width:86vw;height:14rem">
          <div style="width:80vw">
            <div style="text-align:right"><Icon name="cross" @click="cancelChange" style="margin-top:0.5rem;font-size:1.2rem"></Icon></div>
          <p style="font-size:1rem;margin-left:0.9rem;display:block">密码修改</p>
          <Field
            v-model="psd"
            type="password"
            label="新密码"
            placeholder="请输入密码"
            style="font-size:0.85rem;line-height:1.4rem"
          />
          <!-- <Button style="margin:1rem 2rem 1rem 24%" size="small" @click="cancelChange">取消</Button> -->
          <Button type="info" class="btnAssign" @click="confirmPsw">确定</Button>
          </div>
        </Popup>
    </div>
</template>
<script>
import { httpGet, httpDelete, httpPost, httpPut } from '@/utils/restful'
import { getUsers, User, updatePassword, UserRole } from '@/api/url'
import { sexFormatter } from '@/utils/formatter'
import { NavBar, RadioGroup, Pagination, Radio, Search, Toast, Collapse, Dialog, Icon, Button, Field, Popup, PullRefresh, CollapseItem, Cell, CellGroup, Tab, Tabs } from 'vant'
export default {
  name: 'QXuserMan',
  data () {
    return {
      value: '',
      radio: '0',
      share: [],
      total: undefined,
      userId: 0,
      dialogRoleVisible: false,
      isShow: false,
      isEdit: false,
      roleLoading: false,
      roleList: [],
      roleId: 0,
      userEdit: {
        id: undefined,
        userName: '',
        userPassword: '',
        phone: '',
        email: '',
        resume: '',
        nickName: '',
        sex: ''
      },
      err: {
        psd: '',
        phone: '',
        email: '',
        nickName: ''
      },
      show: false,
      isLoading: false,
      isChange: false,
      checked: undefined,
      updateLoading: false,
      sexFormatter: sexFormatter,
      activeName: ['0'],
      userData: [],
      psd: '',
      changeId: undefined,
      selectArrayId: [],
      listQuery: {
        offset: 1,
        limit: 10,
        userName: undefined,
        sex: undefined
      },
      active: 1
    }
  },
  components: {
    NavBar,
    Search,
    Button,
    Icon,
    Cell,
    Collapse,
    CollapseItem,
    CellGroup,
    RadioGroup,
    Radio,
    PullRefresh,
    Popup,
    Field,
    Pagination,
    'van-tabs': Tabs,
    'van-tab': Tab
  },
  methods: {
    filterArr () {
      // this.$store.getters.permissionFun
      console.log(JSON.parse(window.sessionStorage.getItem('list')))
      JSON.parse(window.sessionStorage.getItem('list')).map(item => {
        if (item.name === '权限管理') {
          item.children.map(it => {
            if (it.name === '账号管理') {
              this.share = it.roles
              console.log(this.share)
            }
          })
        }
      })
    },
    // 编辑
    compile () {
      this.show = true
    },
    cancelAssign () {
      this.dialogRoleVisible = false
      this.isEdit = false
    },
    cancelEdit () {
      this.show = false
      this.isEdit = false
    },
    onClickLeft () {
      this.$router.push('/indexPage/')
    },
    onClickRight () {
      this.$router.push('/addUserMan/')
    },
    onSearch () {
      this.listQuery.offset = 1
      this.fetchData()
    },
    closeWindows () {
      this.isEdit = false
    },
    // 修改
    alter () {
      this.updateLoading = true
      const updateFormData = Object.assign({}, this.userEdit)
      httpPut(User, updateFormData).then(res => {
        this.updateLoading = false
        this.fetchData()
        this.show = false
        this.isEdit = false
        Toast({
          message: res.message,
          type: 'success',
          duration: 4 * 1000
        })
      }).catch(() => {
        this.updateLoading = false
      })
    },
    checknickName () {
      if (this.userEdit.nickName === '') {
        this.err.nickName = '请输入昵称'
      } else {
        this.err.nickName = ''
      }
    },
    // 验证
    checkPhone () {
      if (!(/^1[123456789]\d{9}$/.test(this.userEdit.phone))) {
        this.err.phone = '请输入正确的手机号码'
      } else {
        this.err.phone = ''
      }
    },
    checkEmail () {
      if (!(/^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/.test(this.userEdit.email))) {
        this.err.email = '请输入正确的邮箱地址'
      } else {
        this.err.email = ''
      }
    },
    seePage (val) {
      this.listQuery.offset = val
      this.fetchData()
    },
    // 分配角色
    assignRole () {
      this.dialogRoleVisible = true
      httpGet(UserRole + '/' + this.changeId).then((res) => {
        if (res.data.roleInfo.length === 0) {
          Toast({
            type: 'warning',
            message: '暂无角色，请先添加角色',
            duration: 4 * 1000
          })
        } else {
          this.checked = res.data.roleId
          this.roleList = res.data.roleInfo
          this.dialogRoleVisible = true
        }
      }).catch(() => {})
    },
    // 分配完成
    submitRole () {
      if (this.checked === undefined) {
        Toast('请先选择角色在进行提交！')
      } else {
        this.roleLoading = true
        let data = {
          roleId: this.checked,
          userId: this.changeId
        }
        httpPost(UserRole, data).then(res => {
          this.roleLoading = false
          this.dialogRoleVisible = false
          this.isEdit = false
          Toast({
            type: 'success',
            message: res.message,
            duration: 4 * 1000
          })
        }).catch(() => {
          this.roleLoading = false
        })
      }
    },
    // 修改密码
    changePsw () {
      this.isChange = true
    },
    // 确认修改密码
    confirmPsw () {
      if (/^(\w){6,12}$/.test(this.psd)) {
        Dialog.confirm({message: '确认修改密码吗？', title: '提示'})
          .then(() => {
            const data = {
              id: this.changeId,
              userPassword: this.psd
            }
            httpPost(updatePassword, data)
              .then(res => {
                Toast.success(res.message)
                this.isChange = false
                this.isEdit = false
                this.psd = ''
              }).catch(() => {})
          }).catch(() => {})
      } else {
        Toast('密码为6-12位字母，数字或者下划线')
      }
    },
    cancelChange () {
      this.isChange = false
      this.isEdit = false
    },
    // 编辑操作
    edit (item) {
      this.isEdit = true
      this.selectArrayId.push(item.id)
      this.changeId = item.id
      this.userEdit = item
    },
    goPlay () {
      this.$router.push('/permissionSet/')
    },
    // 下拉刷新
    onRefresh () {
      setTimeout(() => {
        this.fetchData()
        this.$toast('刷新成功')
        this.isLoading = false
      }, 500)
    },
    // 删除
    delUser () {
      Dialog.confirm({message: '确认删除吗？', title: '提示'})
        .then(() => {
          httpDelete(User, {ids: this.selectArrayId}).then(res => {
            Toast({
              type: 'success',
              message: res.message,
              duration: 4 * 1000
            })
            this.isEdit = false
            this.fetchData()
          }).catch(() => {
          })
        }).catch(() => {})
    },
    // 获取数据
    fetchData () {
      this.listQuery = Object.assign(this.listQuery, {departmentId: this.$store.getters.departmentId})
      httpGet(getUsers, this.listQuery).then(res => {
        console.log(res)
        if (res.data === null || res.data.rows === null) {
          this.userData = []
          this.total = 0
        } else {
          this.userData = res.data.rows
          this.total = res.data.total
        }
      }).catch(() => {})
    },
    clickTab (index, title) {
      if (index === 0) {
        this.goPlay()
      }
    }
  },
  created () {
    this.fetchData()
    this.filterArr()
  }
}
</script>
<style lang="scss" scoped>
.titleCss{
   display: block;
    width: 100vw;
    line-height: 1.2rem;
    font-size: 0.85rem;
    margin-left:0.3rem
}
.btnAssign{
  width: 44vw;
  margin-left: 22vw;
  border-radius: 8px;
  line-height: 1rem;
  margin:2rem 0 1.5rem 22vw;
}
.btn{
  width:60vw;
  margin-left: 16vw;
  height:7vh;
  line-height: 7vh;
  margin-top:1.5rem;
  border-radius: 0.6rem
}
</style>

<style scoped>
.bigDiv >>> .van-tabs__line {
  background-color: #1989fa
}
.bigDiv{
  background-color: rgb(238,238,238);
  min-height:100vh;
}
#p >>> .van-pagination__item--disabled, .van-pagination__item--disabled:active {
  color:rgb(14,105,254);
}
</style>

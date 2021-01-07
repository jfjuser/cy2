<template>
  <div class="container1">
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
        v-model="listQuery.name"
        placeholder="角色名"
        show-action
        style="margin-top:0.5rem"
        shape="round"
        background="rgb(14,105,254)"
        @search="onSearch"
          >
        <div slot="action" @click="onSearch">搜索</div>
      </Search>
          <!-- <Collapse v-model="activeName">
              <CollapseItem title="权限/角色管理" name="0">
                <span class="titleCss" style="color:#1E90FF">角色管理</span>
              </CollapseItem>
               <CollapseItem title="权限/用户管理" name="1">
                <span class="titleCss" @click="manager">查看用户管理</span>
              </CollapseItem>
          </Collapse> -->
          <van-row style="border:1px solid #ccc;">
            <van-col span="8" class="spanTitle">角色名</van-col>
            <van-col span="8" class="spanTitle">备注信息</van-col>
            <van-col span="8" class="spanTitle">操作</van-col>
          </van-row>
          <!-- 主要内容 -->
          <PullRefresh v-model="isLoading" @refresh="onRefresh">
            <div style="min-height:50vh">
           <van-row style="border:1px solid #ccc" v-for="(item,index) in userData" :key=index :total="total">
            <van-col span="8" class="spanTitle">{{item.name}}</van-col>
            <van-col span="8" class="spanTitle">{{item.resume}}</van-col>
            <van-col span="8" class="spanTitle"><Button type="info" size="small" @click="swiper(item)">操作</Button></van-col>
          </van-row>
          </div>
          <div style="width:100%;height:22rem;text-align:center" v-show="total == ''">
          <img src='@/assets/noData.png' style="max-width: 300px;max-height: 300px;"/>
          </div>
          </PullRefresh>
           <div style="margin:1.5rem 0 1rem 0" id="asd" v-show="total > 5">
            <Pagination
              v-model="listQuery.offset"
              :page-count="Math.ceil(total/10)"
              :total-items = 'total'
              mode="simple"
              @change="seePage"
            >
            </Pagination>
         </div>
          <!-- <PullRefresh v-model="isLoading" @refresh="onRefresh">
            <div style="width:90vw;margin:0.5rem 0 0 5vw;">
              <div v-for="(item, index) in userData" :key="index">
                <CellGroup style="border:1px solid #ccc;margin-top: 1.5rem;">
                  <Cell title="角色名" :value="item.name"/>
                  <Cell title="备注信息" :value="item.resume"/>
                  <span style="display:block;line-height:2.5rem;color:#1E90FF;margin-left:86%;" @click="swiper(item)">操作</span>
                </CellGroup>
              </div>
            </div>
            <div style="width:100%;height:22rem;text-align:center" v-show="total == ''">
              <img src='@/assets/noData.png' style="max-width: 300px;max-height: 300px;"/>
            </div>
          </PullRefresh>
          <div style="margin:0.5rem 0 1rem 0">
            <Pagination
              v-model="listQuery.offset"
              :page-count="Math.ceil(total/10)"
              :total-items = 'total'
              mode="simple"
              @change="seePage"
            >
            </Pagination>
          </div> -->
          <!-- 功能栏 -->
          <Popup v-model="show" position="bottom">
            <Button size="large" v-if="share.includes('删除')" @click="delInfo">删除</Button>
            <template v-if="isDefault === 0"><Button size="large" v-if="share.includes('编辑')" @click="editInfo">编辑</Button></template>
            <template v-if="isDefault === 0"><Button size="large" v-if="share.includes('权限')" @click="handleRole">分配权限</Button></template>
            <template v-if="isDefault === 1"><Button size="large" v-if="share.includes('权限')" @click="handleLookRole">查看权限</Button></template>
            <Button size="large" @click="closeDiv">取消</Button>
          </Popup>
          <!-- 编辑视图 -->
          <Popup v-model="isEdit" style="width:88vw;" position=top>
            <Cell title="编辑" style="font-size:0.9rem">
              <Icon name="cross" right-icon @click="cancel"/>
            </Cell>
            <CellGroup>
              <Field
                v-model="form.name"
                required
                clearable
                label="角色名"
                style="line-height:2rem;font-size:0.9rem"
              />
              <Field
                v-model="form.resume"
                label="描述信息"
                style="line-height:2rem;font-size:0.9rem"
              />
            </CellGroup>
            <div style="margin-top:5%;padding-bottom:5%;text-align:center">
              <Button size="small" style="margin-right:2rem;" @click="cancel">取消</Button>
              <Button size="small" type="info" style="margin-left:2rem;" @click="finshedAmend" :loading = "updateLoading">修改</Button>
            </div>
          </Popup>
          <!-- 添加视图 -->
          <Popup v-model="isAdd" style="width:88vw;padding-bottom:5%;" position=top>
            <Cell title="添加" style="font-size:1rem">
              <Icon name="cross" right-icon @click="cancelAdd"/>
            </Cell>
            <CellGroup>
              <Field
                v-model="addUser.name"
                required
                clearable
                label="角色名"
                style="line-height:1.8rem;font-size:0.85rem"
                placeholder="请输入角色名字"
              />
              <Field
                v-model="addUser.resume"
                label="描述信息"
                style="line-height:1.8rem;font-size:0.85rem"
                placeholder="请输入描述信息"
              />
            </CellGroup>
            <div style="margin-top:10%;text-align:center">
              <Button size="small" style="margin-right:2rem" @click="cancelAdd">取消</Button>
              <Button size="small" type="info" style="margin-left:2rem" @click="saveUser" :loading = "updateLoading">保存</Button>
            </div>
          </Popup>
          <!-- 分配权限 -->
          <Popup v-model="isPermiss" style="width:88vw;height:90vh">
            <Cell title="分配权限" style="font-size:1rem">
              <Icon name="cross" right-icon @click="isPermiss = false"/>
            </Cell>
           <el-tree
            :data="treeData"
            show-checkbox
            node-key="id"
            accordion
            ref="tree"
            highlight-current
            :default-checked-keys="defaultCheckedKeys"
            :props="defaultProps">
          </el-tree>
            <!-- <div style="margin-top:1rem">
              <div v-for="item in treeData" :key="item.id" class="li" @click="seeChild(item)">{{item.name}}</div>
                <div style="margin-top:0.5rem">
                <div v-for="item in childData" :key="item.id" class="li1" @click="seeChild1(item)">{{item.name}}</div>
                  <div style="margin-top:0.5rem">
                  <div v-for="item in childData1" :key="item.id" class="li2" @click="seeChild2(item)">{{item.name}}</div>
                    <div style="margin-top:0.5rem">
                      <div v-for="item in childData2" :key="item.id" class="li3">{{item.name}}</div>
                    </div>
                  </div>
                </div>
            </div> -->
             <div style="margin-top:15%;text-align:center" v-if="isDefault === 0">
              <Button style="margin-right:2rem;padding-bottom:1rem;" @click="isPermiss = false">取消</Button>
              <Button type="info" :loading = "roleLoading"  @click="submitRoles" style="margin-left:2rem;padding-bottom:1rem;">确定</Button>
            </div>
          </Popup>
  </div>
</template>
<script>
//  httpPost, httpDelete
//  createRoles, RolesPermisson
import { httpGet, httpPut, httpDelete, httpPost } from '@/utils/restful'
import { getRoles, RolesPermisson, Roles, createRoles, lookRolesPermisson } from '@/api/url'
import { Button, TreeSelect, Toast, Pagination, NavBar, Cell, Dialog, CellGroup, Field, Search, Icon, Collapse, CollapseItem, Row, Col, PullRefresh, Popup, Tab, Tabs } from 'vant'
export default {
  name: 'permissionSet',
  data () {
    return {
      defaultProps: {
        children: 'childrens',
        label: 'name'
      },
      value: '',
      roleLoading: false,
      activeId: undefined,
      mainActiveIndex: 0,
      isImg: false,
      show: false,
      isPermiss: false,
      isLoading: false,
      updateLoading: false,
      createLoading: false,
      isEdit: false,
      addUser: {
        name: undefined,
        resume: undefined
      },
      isAdd: false,
      total: null,
      form: {
        id: undefined,
        name: '',
        resume: ''
      },
      activeName: ['0'],
      active: 0,
      userData: [],
      treeData: [],
      childData: [],
      childData1: [],
      childData2: [],
      defaultCheckedKeys: [],
      selectArrayId: [],
      share: [],
      listQuery: {
        offset: 1,
        limit: 10,
        name: undefined
      },
      isDefault: -1
    }
  },
  methods: {
    filterArr () {
      // this.$store.getters.permissionFun
      JSON.parse(window.sessionStorage.getItem('list')).map(item => {
        if (item.name === '权限管理') {
          item.children.map(it => {
            if (it.name === '角色管理') {
              this.share = it.roles
            }
          })
        }
      })
    },
    onClickLeft () {
      this.$router.push('/indexPage/')
    },
    onNavClick (index) {
      this.mainActiveIndex = index
    },
    onItemClick (data) {
      this.activeId = data.id
    },
    onClickRight () {
      this.isAdd = true
    },
    seeChild (item) {
      this.childData = item.childrens
    },
    seeChild1 (item) {
      this.childData1 = item.childrens
    },
    seeChild2 (item) {
      this.childData2 = item.childrens
    },
    // 下拉刷新
    onRefresh () {
      setTimeout(() => {
        this.fetchData()
        this.$toast('刷新成功')
        this.isLoading = false
      }, 500)
    },
    seePage (val) {
      this.listQuery.offset = val
      this.fetchData()
    },
    // 分配权限
    handleRole () {
      // Toast('手机端暂不支持该功能')
      // this.show = false
      console.log(this.form.id)
      this.isPermiss = true
      this.show = false
      httpGet(RolesPermisson + '/' + this.form.id).then(res => {
        this.treeData = res.data.info
        this.defaultCheckedKeys = res.data.ids
        // console.log(res)
      }).catch(() => {})
    },
    // 获取权限
    handleLookRole () {
      this.isPermiss = true
      this.show = false
      httpGet(lookRolesPermisson + '/' + this.form.id).then(res => {
        this.treeData = res.data.info
        this.defaultCheckedKeys = res.data.ids
      }).catch(() => {})
    },
    cancelAdd () {
      this.isAdd = false
    },
    onSearch () {
      this.listQuery.offset = 1
      this.fetchData()
    },
    // 提交权限
    submitRoles () {
      this.roleLoading = true
      let data = {id: this.form.id, ids: [...this.$refs.tree.getCheckedKeys(), ...this.$refs.tree.getHalfCheckedKeys()]}
      httpPost(RolesPermisson, data).then(res => {
        this.roleLoading = false
        this.isPermiss = false
        Toast({
          message: res.message,
          type: 'success',
          duration: 4 * 1000
        })
      }).catch(() => {
        this.roleLoading = false
      })
    },
    // 添加新用户保存
    saveUser () {
      this.createLoading = true
      this.form = Object.assign(this.addUser, {connId: this.$store.getters.departmentId})
      httpPost(createRoles, this.form).then(res => {
        this.createLoading = false
        this.isAdd = false
        Toast({
          message: res.message,
          type: 'success',
          duration: 4 * 1000
        })
        this.fetchData()
      }).catch((err) => {
        Toast({
          message: err,
          type: 'fail',
          duration: 4 * 1000
        })
        this.createLoading = false
      })
      this.addUser = {
        name: undefined,
        resume: undefined
      }
    },
    // 操作
    swiper (item) {
      this.show = true
      this.form.name = item.name
      this.form.resume = item.resume
      this.form.id = item.id
      this.isDefault = item.isDefault
    },
    // 删除
    delInfo () {
      this.selectArrayId.push(this.form.id)
      Dialog.confirm({message: '确认删除吗？', title: '提示'})
        .then(() => {
          httpDelete(Roles, {ids: this.selectArrayId}).then(res => {
            Toast({
              type: 'success',
              message: res.message,
              duration: 4 * 1000
            })
            this.show = false
            this.fetchData()
          }).catch(() => {
          })
        }).catch(() => {})
    },
    cancel () {
      this.isEdit = false
      this.show = false
    },
    editInfo () {
      this.isEdit = true
      this.show = false
    },
    manager () {
      this.$router.push('/QXuserMan/')
    },
    closeDiv () {
      this.show = false
    },
    // 完成修改提交
    finshedAmend () {
      this.updateLoading = true
      const updateData = Object.assign({}, this.form)
      httpPut(Roles, updateData).then(res => {
        this.updateLoading = false
        this.fetchData()
        this.isEdit = false
        this.show = false
        Toast({
          message: res.message,
          type: 'success',
          duration: 4 * 1000
        })
      }).catch(() => {
        this.updateLoading = false
      })
    },
    // 获取数据
    fetchData () {
      this.listQuery = Object.assign(this.listQuery, { departmentId: this.$store.getters.departmentId })
      httpGet(getRoles, this.listQuery).then(res => {
        if (res.data === null || res.data.rows === null) {
          this.userData = []
          this.isImg = true
          this.total = 0
        } else {
          this.userData = res.data.rows
          this.total = res.data.total
        }
      }).catch(() => {})
    },
    clickTab (index, title) {
      if (index === 1) {
        this.manager()
      }
    }
  },
  mounted () {
    this.fetchData()
    this.filterArr()
  },
  components: {
    Button,
    NavBar,
    Search,
    Field,
    Icon,
    CellGroup,
    Collapse,
    TreeSelect,
    CollapseItem,
    'van-row': Row,
    'van-col': Col,
    PullRefresh,
    Popup,
    Pagination,
    Cell,
    'van-tabs': Tabs,
    'van-tab': Tab
  }
}
</script>
<style lang="scss" scoped>
.container1{
  .titleCss{
    display: block;
    width: 100vw;
    line-height: 1.2rem;
    font-size: 1rem;
    margin-left:0.3rem;
  }
  .spanTitle{
    display: table-cell;
    vertical-align: middle;
    text-align:center;
    line-height:3rem;
    font-size: 0.85rem;
    height: 3rem;
    overflow: hidden;
  }
  .li{
    line-height: 2.5rem;
    margin-left: 1rem;
    color:#3399ff;
  }
  .li1{
    line-height: 2.5rem;
    margin-left: 2rem;
  }
  .li2{
    line-height: 2.5rem;
    margin-left: 3rem;
  }
}
</style>

<style scoped>
.container1 >>> .van-tabs__line {
  background-color: #1989fa
}
#asd >>> .van-pagination__item--disabled, .van-pagination__item--disabled:active {
  color:rgb(14,105,254)
}
</style>

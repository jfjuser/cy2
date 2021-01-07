<template>
    <div class="page full-height bgc-grey">
        <!-- 编辑 -->
        <div class="editor" v-if="iseditor">
            <van-cell-group>
                <van-field label="部门名称" placeholder="请输入部门名称" v-model.trim="form.leader" />
            </van-cell-group>
            <div class="btnbox">
                <van-button type="info" block class="btn mar-b-10" @click="editorSubmit" :loading="updataLoading">完成</van-button>
                <van-button plain block class="btn" @click="iseditor=false">返回</van-button>
            </div>
        </div>
        <!-- 修改通道 -->
        <div class="editor" v-else-if="ismodify">
            <van-cell-group>
                <van-cell title="通道名称" is-link @click="dialogVisible = true" />
            </van-cell-group>
            <div class="btnbox">
                <van-button type="info" block class="btn mar-b-10" @click="modifySubmit" :loading="modifyLoading">完成</van-button>
                <van-button plain block class="btn" @click="ismodify=false">返回</van-button>
            </div>
        </div>
        <!-- 主内容 -->
        <template v-else>
            <div class="header text-c bgc">
                <van-icon name="edit" class="icon" @click="showMenu = true" />
                <h2>{{data.leader}}</h2>
                <div>
                  通道名称:
                  <template v-if="data.localNames && data.localNames.length != 0">
                    <van-tag type="primary" v-for="(item, index) in data.localNames" :key="index" class="tag">{{item.localName}}</van-tag>
                  </template>
                  <span v-else>无</span>
                </div>
            </div>
            <div class="bgc user">
              <van-divider class="line">成员({{totals}}人)</van-divider>
              <van-grid clickable :border="false" :column-num="5">
                  <van-grid-item v-for="(item, index) in userData" :key="index" @click="showUserInfo(item, index)">
                      <van-image class="full-img head" width="40" height="40" round :src="'data:image/jpeg;base64,' + item.file">
                          <!-- <template v-slot:loading>{{item.userName?item.userName.slice(-1):''}}</template> -->
                      </van-image>
                      <p class="fc-grey van-ellipsis fixed-width text-c">{{item.userName}}</p>
                  </van-grid-item>
                  <van-grid-item icon="add-o" class="fc-blue add-icon" @click="showAddUser" />
                  <van-grid-item icon="close" class="fc-red add-icon" @click="showDelUsers=true" v-if="userData.length!=0"/>
              </van-grid>
            </div>
            <div class="btnbox"><van-button type="danger" block class="btn" @click="delDepa">删除部门</van-button></div>
            <!-- 移除 -->
            <van-popup v-model="showUser" class="userinfo">
                <div class="userbox">
                    <van-cell-group>
                        <van-cell title="姓名" :value="userinfo.userName" />
                        <van-cell title="手机号" :value="userinfo.phone" />
                    </van-cell-group>
                    <van-button type="danger" block style="border-radius: 0" @click="delUser">移除</van-button>
                </div>
            </van-popup>
            <!-- 添加 -->
            <van-popup v-model="showAddUsers" position="right" closeable close-icon-position="top-right" safe-area-inset-bottom>
                <div class="usersbox position">
                    <p class="title text-c">请选择</p>
                    <van-divider :style="{ padding: '16px', margin: '0', borderColor: '#ccc' }" v-if="isData">暂无可添加成员</van-divider>
                      <van-list
                      v-model="listLoading"
                      :finished="finished"
                      :error.sync="error"
                      error-text="请求失败，点击重新加载"
                      @load="fetchUser"
                      >
                        <van-cell-group>
                            <van-cell :title="item.userName||''" v-for="(item, index) in userlistData" :key="index" @click="chooseAddUser(item.id)" ></van-cell>
                        </van-cell-group>
                      </van-list>
                </div>
            </van-popup>
            <!-- 批量删除 -->
            <van-popup v-model="showDelUsers" position="right" safe-area-inset-bottom>
                <div class="usersbox position">
                    <div class="title flex-jc-around">
                      <span class="fc-grey" @click="closeDelUsers">取消</span>
                      <span>请选择</span>
                      <span class="fc-dark" v-if="checkboxDel.length==0">批量移除</span>
                      <span class="fc-red" @click="handleBatchDel" v-else>批量移除</span>
                    </div>
                    <van-checkbox-group v-model="checkboxDel">
                        <van-cell-group>
                            <van-cell :title="item.userName||''" v-for="(item, index) in userData" :key="index" @click="toggle(index)">
                              <van-checkbox ref="checkboxes" slot="right-icon" :name="item.id" shape="square" />
                            </van-cell>
                        </van-cell-group>
                    </van-checkbox-group>
                </div>
            </van-popup>
        </template>

        <van-action-sheet v-model="showMenu" :actions="actions" @select="onSelect" :round="false" close-on-click-action cancel-text="取消" @cancel="showMenu=false" />
        <van-dialog v-model="dialogVisible" title="选择通道" close-on-popstate >
          <div class="text-c fc-grey nulldata" v-if="localList.length == 0">暂无通道</div>
            <van-checkbox-group v-model="localform.aiTokenIds" class="radio-group" >
              <template v-for="(item, index) in localList">
                <van-checkbox :name="item.localId" class="mar-b-10" :key="index">{{item.localName}}</van-checkbox>
              </template>
            </van-checkbox-group>
        </van-dialog>
    </div>
</template>

<script>
import { CheckboxGroup, Tag, ActionSheet, Checkbox, Grid, GridItem, Divider } from 'vant'
import { workForaiDuyCompany, AIpermission, lookMember, addUser, getUser, delUser } from '@/api/url'
import { checkDataArr, toNull } from '@/utils/formatter'
export default {
  components: {
    'van-checkbox-group': CheckboxGroup,
    'van-checkbox': Checkbox,
    'van-tag': Tag,
    'van-action-sheet': ActionSheet,
    'van-grid': Grid,
    'van-grid-item': GridItem,
    [Divider.name]: Divider
  },
  data () {
    return {
      data: JSON.parse(decodeURI(this.$route.query.data)) || {},
      showUser: false,
      showAddUsers: false,
      iseditor: false,
      ismodify: false,
      localList: [],
      dialogVisible: false,
      localName: '',
      updataLoading: false,
      form: {
        leader: JSON.parse(decodeURI(this.$route.query.data)) ? JSON.parse(decodeURI(this.$route.query.data)).leader : ''
      },
      form1: {
        aiDutyCompanyId: JSON.parse(decodeURI(this.$route.query.data))['id'],
        departmentId: this.$store.getters.departmentId,
        sign: 1,
        userName: null,
        offset: 1,
        limit: 10
      },
      modifyLoading: false,
      localform: {
        aiTokenIds: []
      },
      userData: [],
      totals: 0,
      userinfo: {},
      // 获取所有用户
      userlistData: [],
      listQuery: {
        userName: '',
        offset: 1,
        limit: 20,
        departmentId: this.$store.getters.departmentId,
        sign: 1
      },
      finished: false,
      listLoading: false,
      error: false,
      showMenu: false,
      actions: [
        { name: '编辑' },
        { name: '修改通道' }
      ],
      checkboxDel: [],
      showDelUsers: false
    }
  },
  computed: {
    isData () {
      return checkDataArr(this.userlistData)
    }
  },
  mounted () {
    this.getUser()
    this.getLocalPermission()
  },
  methods: {
    onSelect (item, index) {
      // console.log(item.name, index)
      if (index === 0) {
        this.iseditor = true
      }
      if (index === 1) {
        this.ismodify = true
      }
    },
    toggle (index) {
      this.$refs.checkboxes[index].toggle()
    },
    closeDelUsers () {
      this.checkboxDel = []
      this.showDelUsers = false
    },
    showUserInfo (data, index) {
      data.index = index
      this.userinfo = data
      this.showUser = true
    },
    showAddUser () {
      this.showAddUsers = true
    },
    // 获取部门成员
    getUser () {
      const ToastLoading = this.$toast.loading({ message: '加载中...', position: 'middle', duration: 0 })
      // console.log(this.form1)
      let str = '?departmentId=' + this.form1.departmentId + '&sign=' + this.form1.sign + '&userName=' + this.form1.userName + '&offset=' + this.form1.offset + '&limit=' + this.form1.limit
      let obj = {aiDutyCompanyId: this.form1.aiDutyCompanyId}
      this.$http.post(getUser + str, obj).then(res => {
        ToastLoading.clear()
        if (res.data && res.data.rows) {
          if (this.form1.offset / 1 === 1) {
            this.userData = res.data.rows
          } else {
            this.userData = this.userData.concat(res.data.rows)
          }
          this.totals = res.data.total
          // console.log(this.form1.offset, this.form1.limit)
          if (this.form1.offset * this.form1.limit < res.data.total / 1) {
            this.form1.offset = this.form1.offset / 1 + 1
            this.getUser()
          }
        }
        this.filterUser()
      }).catch(() => { ToastLoading.clear() })
    },
    // 单选添加用户
    chooseAddUser (id) {
      const formData = {
        departmentId: this.$store.getters.departmentId,
        dutyCompanyId: this.data.id,
        aiUserId: id
      }
      const ToastLoading = this.$toast.loading({ forbidClick: true, message: '加载中...', position: 'middle', duration: 0 })
      this.$http.post(addUser, formData).then(res => {
        ToastLoading.clear()
        this.getUser()
        this.showAddUsers = false
        this.$toast('添加成功')
      }).catch(() => { ToastLoading.clear() })
    },
    delUser () {
      const formData = {
        aiUserId: [this.userinfo.id]
      }
      const ToastLoading = this.$toast.loading({ forbidClick: true, message: '加载中...', position: 'middle', duration: 0 })
      this.$http.delete(delUser, {data: formData}).then(res => {
        ToastLoading.clear()
        this.userData.splice(this.data.index, 1)
        this.showUser = false
        this.$toast('移除成功')
      }).catch(() => {
        ToastLoading.clear()
      })
    },
    // 批量移除
    handleBatchDel () {
      const formData = {
        aiUserId: this.checkboxDel
      }
      const ToastLoading = this.$toast.loading({ forbidClick: true, message: '加载中...', position: 'middle', duration: 0 })
      this.$http.delete(delUser, {data: formData}).then(res => {
        ToastLoading.clear()
        this.getUser()
        this.$toast('移除成功')
        this.showDelUsers = false
        this.checkboxDel = []
      }).catch(() => {
        ToastLoading.clear()
      })
    },
    delDepa () {
      this.$dialog.confirm({
        closeOnPopstate: true,
        message: '确定删除该部门吗？'
      }).then(() => {
        const formData = {
          departmentId: this.$store.getters.departmentId,
          ids: [this.data.id]
        }
        const ToastLoading = this.$toast.loading({ forbidClick: true, message: '加载中...', position: 'middle', duration: 0 })
        this.$http.delete(workForaiDuyCompany, {data: formData}).then(res => {
          ToastLoading.clear()
          this.$dialog({ closeOnPopstate: true, message: '删除成功' }).then(() => {
            // this.$router.go(-1)
            history.go(-1)
          })
        }).catch(() => {
          ToastLoading.clear()
        })
      }).catch(() => {})
    },
    editorSubmit () {
      const localName = this.form.leader
      if (localName === '') {
        return
      }
      this.form.id = this.data.id
      this.updataLoading = true
      this.$http.put(workForaiDuyCompany, this.form)
        .then(res => {
          this.updataLoading = false
          this.data.leader = localName
          this.$dialog({ closeOnPopstate: true, message: res.message }).then(() => {
            this.iseditor = false
          })
        }).catch(() => {
          this.updataLoading = false
        })
    },
    // 获取通道
    getLocalPermission () {
      const query = {
        departmentId: this.$store.getters.departmentId,
        aiDutyCompanyId: this.data.id
      }
      this.$http.get(AIpermission, {params: query}).then(res => {
        this.data.localNames = []
        for (const v of res.data.local) {
          for (const v2 of res.data.checked) {
            if (v.localId === v2) {
              this.data.localNames.push(v)
            }
          }
        }
        this.localform.aiTokenIds = res.data.checked
        this.localList = res.data.local
      }).catch(() => { })
    },
    // 改通道
    modifySubmit () {
      if (this.localform.aiTokenIds.length === 0) {
        return
      }
      this.modifyLoading = true
      this.localform.aiDutyCompanyId = this.data.id
      this.$http.put(AIpermission, this.localform)
        .then(res => {
          this.getLocalPermission()
          this.modifyLoading = false
          this.$dialog({ closeOnPopstate: true, message: res.message }).then(() => {
            this.ismodify = false
          })
        }).catch(() => {
          this.modifyLoading = false
        })
    },
    fetchUser () {
      this.listQuery.userName = toNull(this.listQuery.userName)
      this.$http.post(`${lookMember}?offset=${this.listQuery.offset}&limit=${this.listQuery.limit}`, this.listQuery).then(res => {
        this.listQuery.offset = this.listQuery.offset + 1
        this.error = false
        if (res.data && res.data.rows) {
          this.userlistData = this.userlistData.concat(res.data.rows)

          this.listLoading = false
          if (res.data.rows.length < this.listQuery.limit) {
            this.finished = true
          }
        } else {
          this.listLoading = false
          this.finished = true
        }
        this.filterUser()
      }).catch(() => {
        this.listLoading = false
        this.error = true
      })
    },
    // 过滤已添加的成员
    filterUser () {
      if (this.userData && this.userData.length === 0) return
      if (this.userlistData && this.userlistData.length === 0) return
      for (let [i, v] of this.userlistData.entries()) {
        for (const v2 of this.userData) {
          if (v.id === v2.id) {
            this.userlistData.splice(i, 1)
          }
        }
      }
    }
  },
  beforeRouteLeave (to, from, next) {
    if (this.iseditor || this.showAddUsers || this.ismodify || this.showDelUsers) {
      this.iseditor = false
      this.showAddUsers = false
      this.ismodify = false
      this.showDelUsers = false
      next(false)
    } else {
      next()
    }
  }
}
</script>

<style lang="scss" scoped>
.page {
  .header {
      padding: 30px 15px 15px;
      margin-bottom: 15px;
      position: relative;
      .icon {
          position: absolute;
          top: 15px;
          right: 15px;
          font-size: 18px;
      }
      h2 {
          margin-bottom: 5px;
      }
      .tag {
        margin-left: 5px;
      }
  }
  .user {
      .line {
          padding: 0 80px;
          padding-top: 10px;
          margin: 0;
      }
      .head {
          margin-bottom: 5px;
      }
      .fixed-width {
        width: 50px;
      }
      .add-icon {
          /deep/ .van-grid-item__icon {
              font-size: 35px;
          }
      }
  }
  /deep/ .userinfo.van-popup {
      border-radius: 5px;
  }
  .userinfo {
    width: 300px;
  }
  .usersbox {
      width: 100vw;
      min-height: 100vh;
      .title {
          padding: 15px 0;
      }
      .add-btn {
        position: absolute;
        right: 10px;
        top: 8px;
      }
  }
  .btnbox {
      padding: 15px;
      .btn {
        border-radius: 5px;
        overflow: hidden;
      }
  }
  .radio-group {
    padding-left: 15px;
  }
}
.nulldata {
  padding: 10px;
}
</style>

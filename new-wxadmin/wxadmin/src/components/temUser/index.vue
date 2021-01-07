<template>
    <div class="con">
      <NavBar
        title="体温相机"
        left-text="返回"
        right-text="菜单"
        left-arrow
        @click-left="onClickLeft"
        @click-right="showMenu = true"
      />
    <Popup v-model="showMenu" position="left" style="width:62vw;">
      <div style="height:100vh">
        <Cell title="菜单">
          <van-icon name="cross" @click="showMenu = false" />
        </Cell>
        <Collapse v-model="activeNames">
            <CollapseItem title="测温用户" name="1">
            <span class="titleCss" style="color:#1E90FF">测温用户</span>
            </CollapseItem>
            <CollapseItem title="绑定相机" name="2">
              <span class="titleCss" @click="manager">绑定相机</span>
            </CollapseItem>
            <CollapseItem title="比对上传记录" name="3">
              <span class="titleCss" @click="checkSet">比对上传记录</span>
            </CollapseItem>
        </Collapse>
      </div>
    </Popup>
    <Search
      v-model="listQuery.name"
      placeholder="请输入姓名"
      show-action
      background="#6495ED"
      @search="onSearch"
      >
        <div slot="action" style="color:#fff;text-align:center;border-radius:15%;width:3rem;background-color:rgb(14, 105, 254)" @click="onSearch">搜索</div>
      </Search>
    <div>
      <!-- <Button style="position:absolute" @click="delAll" size=small :isLoading="deleteAllLoading">删除全部</Button> -->
      <Cell v-if="share.includes('添加')" title="添加" style="color:green;"  @click="giver">
        <Icon name="add-o"  right-icon></Icon>
      </Cell>
      <Cell v-if="share.includes('删除所有')" title="删除所有" style="color:red;"  @click="delAll">
        <Icon name="delete"  right-icon></Icon>
      </Cell>
      <PullRefresh v-model="isLoading" @refresh="onRefresh">
        <div style="">
        <div v-for="(item, index) in userData" :key=index>
          <CellGroup class="groupdiv">
            <Cell title="姓名" :value="item.name"/>
            <Cell title="性别" :value="sexFormatter1(item.sex)" />
             <Cell title="年龄" :value="item.age" />
            <Cell title="同步信息" :value="item.aiPower" />
            <span style="display:block;line-height:2.5rem;color:rgb(14,105,254);margin-left:86%;" @click="showin(item,index)">操作</span>
          </CellGroup>
        </div>
        </div>
          <div style="width:100%;height:22rem;text-align:center" v-show="imgShow">
             <img src="@/assets/noData (2).png" style="max-width:300px;max-height:300px"/>
          </div>
           <Popup v-model="show" position="bottom">
          <!-- <span style="margin-left:90%;display:inline-block;line-height:1rem;" @click="closeDiv"><van-icon name="cross" size="1.5rem" style="margin-top:0.5rem"/></span> -->
          <Button size="large" v-if="share.includes('删除')" @click="delUser">删除</Button>
          <Button size="large" v-if="share.includes('编辑')" @click="editDialog">编辑</Button>
          <Button size="large" @click="show = false">取消</Button>
      </Popup>
      </PullRefresh>
      <div style="margin:2rem 0 0rem 0;" v-show="!imgShow" id="asd">
          <Pagination
            v-model="listQuery.offset"
            :page-count="Math.ceil(total/10)"
            :total-items = 'total'
            mode="simple"
            @change="seePage"
          >
          </Pagination>
      </div>
      <Popup v-model="isAdd" position="right" style="width:100vw;height:100vh">
        <NavBar
         title="体温用户"
         left-text="返回"
         left-arrow
         @click-left="setUp"
      />
        <CellGroup style="padding-left:0.5rem;">
        <Field
          v-model="form.name"
          label="姓名"
          required
          clearable
          class="fi"
          placeholder="请输入姓名"
          :error-message="err.name"
          @blur="checkName"
        />
           <Field
          v-model="form.age"
          label="年龄"
          required
          clearable
          type="number"
          class="fi"
          placeholder="请输入年龄大小"
          :error-message="err.age"
          @blur="checkAge"
        />
         <Field
          required
          clearable
          label="性别"
          class="fi"
          disabled
          :border="false"
        />
        <RadioGroup v-model="form.sex" style="margin-left:1rem;line-height:2rem;">
          <Radio :name="1" style="font-size:0.85rem;margin-left:2rem;line-height:2rem;display:inline-block;">男</Radio>
          <Radio :name="2" style="font-size:0.85rem;margin-left:4rem;line-height:2rem;display:inline-block;">女</Radio>
        </RadioGroup>
          <Field required clearable label="通道名称" class="fi" disabled :border="false"/>
        <div>
          <CheckboxGroup v-if="status === 'add'" v-model="form.aiTokenIds">
            <Checkbox v-for="(item, index) in cameraList" :key=index :name="item.id" style="margin-left:2.5rem;line-height:2.5rem;display:inline-block;font-size:0.75rem">{{item.localName}}</Checkbox>
          </CheckboxGroup>
          <CheckboxGroup v-if="status === 'create'" v-model="checked">
            <Checkbox v-for="(item, index) in cameraList" :key=index :name="item.id" style="margin-left:2.5rem;line-height:2.5rem;display:inline-block;font-size:0.75rem">{{item.localName}}</Checkbox>
          </CheckboxGroup>
          <Radio disabled v-if="total == 0" style="line-height:2rem;margin-left:1rem">暂无相机可选择</Radio>
        </div>
        <van-uploader :after-read="onRead" style="width:100%" accept="image/*" multiple>
          <Field label="照片" required placeholder="请选择照片" readonly v-model="imgName"/>
        </van-uploader>
        </CellGroup>
        <div style="text-align:center">
          <Button type="info" style="width:50vw;margin-top:2rem;border-radius:8px" :loading="addLoading" @click="queAddUser">保存</Button>
         </div>
      </Popup>
    </div>
    </div>
</template>

<script>
import { NavBar, Icon, Pagination, CheckboxGroup, Uploader, Toast, Button, DatetimePicker, PullRefresh, RadioGroup, Radio, Checkbox, Cell, CellGroup, Row, Col, Popup, Field, Search, Collapse, CollapseItem, Dialog } from 'vant'
import { httpGet, httpDelete, httpPost, httpPut } from '@/utils/restful.js'
import { sexFormatter1 } from '@/utils/formatter'
import { seekAllUser, seekBackShow, seekAllCamera, doFaceUser, checkAIMemberPhoto, AIpermission } from '@/api/url.js'
import { checkFormatter } from '@/utils/formatter.js'
export default {
  name: 'temUser',
  data () {
    return {
      checked: [],
      isAdd: false,
      addLoading: false,
      err: {
        name: '',
        age: ''
      },
      cameraList: [],
      share: [],
      showMenu: true,
      radio: '0',
      isGive: false,
      state: false,
      localList: [],
      timeList: [],
      imgName: '',
      themeType: undefined,
      form: {
        name: '',
        sex: undefined,
        age: undefined,
        image: '',
        photo: '',
        status: 0,
        aiTokenIds: []
      },
      sexFormatter1: sexFormatter1,
      isShow: false,
      total: null,
      isEnd: false,
      startTime: undefined,
      endTime: undefined,
      currentDate: new Date(),
      isDate: false,
      imgShow: false,
      isPop: false,
      date: [],
      codeVisible: false,
      isCode: false,
      psw: undefined,
      notSight: false,
      password: '',
      activeNames: ['1'],
      active: 0,
      isWactch: false,
      deleteAllLoading: false,
      willLoading: false,
      passwordFrame: false,
      userItem: [],
      itemIndex: undefined,
      show: false,
      value: '',
      selectArrayId: [],
      codeUrl: '',
      createCode: '',
      checkFormatter,
      status: '',
      memberId: undefined,
      isLoading: false,
      userData: [],
      rowId: undefined,
      listQuery: {
        offset: 1,
        limit: 10,
        name: undefined,
        sex: undefined,
        departmentId: this.$store.getters.departmentId
      }
    }
  },
  components: {
    NavBar,
    Toast,
    'van-uploader': Uploader,
    CheckboxGroup,
    Pagination,
    DatetimePicker,
    Button,
    Cell,
    Icon,
    Popup,
    RadioGroup,
    Radio,
    Collapse,
    CollapseItem,
    Checkbox,
    'van-icon': Icon,
    CellGroup,
    'van-row': Row,
    'van-col': Col,
    Search,
    Field,
    PullRefresh
  },
  methods: {
    checkName () {
      if (this.form.name === '') {
        this.err.name = '请填写姓名'
      } else {
        this.err.name = ''
      }
    },
    setUp () {
      this.isAdd = false
      this.show = false
    },
    checkAge () {
      if (this.form.age === '' || this.form.age < 0 || this.form.age > 120) {
        this.err.age = '请输入正确的年龄数字'
      } else {
        this.err.age = ''
      }
    },
    queAddUser () {
      this.addLoading = true
      this.form.image = this.form.photo
      let obj = Object.assign(this.form, {departmentId: this.$store.getters.departmentId})
      console.log(obj)
      httpPost(doFaceUser, obj).then((res) => {
        this.fetchData()
        this.isAdd = false
        setTimeout(() => { this.addLoading = false }, 300)
        Toast.success(res.message)
      }).catch((err) => {
        Toast.warning(err)
        this.addLoading = false
      })
    },
    onRead (res) {
      console.log(res)
      let file = res.file
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/jpg'
      const isLt10M = file.size / 1024 / 1024 < 10 && file.size / 1024 / 1024 > 0.5
      const isLT20M = file.size / 1024 / 1024 > 5
      if (!isJPG) {
        Toast.fail('上传头像图片只能是 JPG/JPEG 格式!')
      }
      if (isLT20M) Toast.fail('图片不能超过5M!')
      if (isLt10M) {
        // eslint-disable-next-line
        lrz(file, { quality: 0.2, width: 1000 })
          .then(result => {
            const formData = new window.FormData()
            formData.append('photo', this.form.photo)
            formData.append('file', result.file, this.getFileName(result.origin.name))
            httpPost(checkAIMemberPhoto, formData).then(res => {
              this.form.photo = res.data
              this.form = Object.assign(this.form, res.data)
              // self.$refs.uploadPhoto.clearFiles()
              this.imgName = file.name
              Toast.success('图片校验成功')
            }).catch(() => {
              Toast.fail('图片检验失败，请重新上传')
            })
          })
      } else {
        let formData = new window.FormData()
        formData.append('file', file, this.getFileName(file.name))
        formData.append('photo', this.form.photo)
        httpPost(checkAIMemberPhoto, formData)
          .then(res => {
            this.form.photo = res.data
            this.form = Object.assign(this.form, res.data)
            this.imgName = file.name
            Toast.success('图片校检成功')
          }).catch(() => {
            Toast.fail('图片校检失败，请重新上传！')
          })
      }
    },
    getFileName (fileName, length = 10) {
      return Number(Math.random().toString().substr(3, length) + Date.now()).toString(36) + '.' + fileName.split('.').pop()
    },
    filterArr () {
      // this.$store.getters.permissionFun
      JSON.parse(window.sessionStorage.getItem('list')).map(item => {
        if (item.name === '体温相机') {
          item.children.map(it => {
            if (it.name === '测温用户') {
              this.share = it.roles
            }
          })
        }
      })
    },
    onClickLeft () {
      this.$router.push('/indexPage/')
    },
    checkSet () {
      this.$router.push('/setting/')
    },
    pushPath () {
      this.$router.push('/blackList/')
    },
    goAreaManage () {
      this.$router.push('/areaManage/')
    },
    giver () {
      this.status = 'add'
      this.isAdd = true
      this.getCameraList()
    },
    getChannel (row) {
      httpGet(seekBackShow, {userId: row.id, departmentId: this.$store.getters.departmentId}).then((res) => {
        this.cameraList = res.data.local
        this.checked = res.data.checked
        // console.log(this.form.aiTokenIds)
        // console.log(this.form.aiTokenIds)
      }).catch(() => {})
    },
    // 获取所有的通道列表
    getCameraList () {
      httpGet(seekAllCamera + '/' + this.$store.getters.departmentId).then(res => {
        if (res.data.length === 0) {
          Toast({
            message: '请先配置通道',
            type: 'fail',
            duration: 4 * 1000
          })
        } else {
          this.cameraList = res.data
        }
      }).catch(() => {})
    },
    showDate () {
      if (this.isEnd === true) {
        this.isEnd = false
        this.isDate = true
      } else {
        this.isDate = true
      }
    },
    seePage (val) {
      this.listQuery.offset = val
      this.fetchData()
    },
    pushEnd () {
      if (this.isDate === true) {
        this.isDate = false
        this.isEnd = true
      } else {
        this.isEnd = true
      }
    },
    // 取消
    bye () {
      this.isDate = false
    },
    // 确定选择时间
    saveValue (value) {
      this.startTime = this.tanslate(value)
      this.isDate = false
    },
    getValue (value) {
      this.endTime = this.tanslate(value)
      this.isEnd = false
    },
    beforeClose (action, done) {
      if (action === 'confirm') {
        setTimeout(done, 1000)
      } else {
        done()
      }
    },
    // 操作
    showin (item, index) {
      this.show = !this.show
      this.userItem = item
      this.itemIndex = index
      console.log(this.userItem)
    },
    onSearch () {
      this.listQuery.offset = 1
      this.fetchData()
    },
    // 下拉刷新，取数据
    onRefresh () {
      setTimeout(() => {
        this.fetchData()
        Toast('刷新成功')
        this.isLoading = false
      }, 500)
    },
    closeDiv () {
      this.show = false
    },
    // 获取数据
    fetchData () {
      this.listQuery = Object.assign(this.listQuery, {departmentId: this.$store.getters.departmentId})
      httpGet(seekAllUser, this.listQuery).then(res => {
        if (res.data.rows.length === 0) {
          this.imgShow = true
        }
        if (res.data === null || res.data.rows === null) {
          this.userData = []
          this.total = 0
        } else {
          this.userData = res.data.rows
          this.total = res.data.total
        }
      }).catch(() => {
      })
    },
    // 编辑
    editDialog () {
      console.log(this.userItem)
      this.form = Object.assign({}, this.userItem)
      this.form.aiTokenIds = []
      this.isAdd = true
      this.form.status = 0
      this.status = 'create'
      this.getChannel(this.userItem)
    },
    // 删除所有
    delAll () {
      Dialog.confirm({
        message: '确认要删除所有的账户吗？',
        title: '提示'
      })
        .then(() => {
          this.deleteAllLoading = true
          this.memberId = this.$store.getters.departmentId
          httpDelete(doFaceUser + '/' + this.memberId).then(res => {
            this.deleteAllLoading = false
            this.fetchData()
            Toast({
              type: 'success',
              message: res.message,
              duration: 4 * 1000
            })
          }).catch(() => {
            this.deleteAllLoading = false
          })
        }).catch(() => {})
    },
    // 取消设定新密码
    closeNew () {
      this.passwordFrame = false
      this.show = false
    },
    // 删除所选
    delUser () {
      // console.log(this.userItem)
      // console.log(this.itemIndex)
      this.selectArrayId[this.itemIndex] = this.userItem.id
      httpDelete(doFaceUser, {ids: this.selectArrayId}).then(res => {
        this.fetchData()
        Toast({
          type: 'success',
          message: res.message,
          duration: 4 * 1000
        })
      }).catch(() => {
      })
      this.show = false
    },
    manager () {
      this.$router.push('/userManage/')
    },
    // 用户管理
    userManage () {
      // Toast('暂无用户')
      this.$router.push({name: 'manageUser', params: {rowId: this.userItem.id, addrPar: this.userItem.addr}})
      this.show = false
    },
    // 通道权限
    accessChannel () {
      let data = {
        departmentId: this.$store.getters.departmentId,
        aiDutyCompanyId: this.userItem.id
      }
      this.rowId = this.userItem.id
      httpGet(AIpermission, data).then(res => {
        if (res.data.local.length === 0) {
          Toast.fail('暂未配置通道，请先配置通道')
        } else {
          console.log(res)
          this.localList = res.data.local
          this.checked = res.data.checked
          this.isPop = true
        }
      }).catch(() => {})
    },
    // 点击取消关闭弹窗
    closePop () {
      this.isPop = false
      this.show = false
    },
    // 通道权限，保存
    saveChannel () {
      if (this.checked.length === 0) {
        this.$notify('请选择通道')
      } else {
        let data = {
          aiDutyCompanyId: this.rowId,
          aiTokenIds: this.checked
        }
        httpPut(AIpermission, data).then(res => {
          this.isPop = false
          this.show = false
          Toast({
            message: res.message,
            type: 'success',
            duration: 4 * 1000
          })
        }).catch(() => {})
      }
    }
  },
  created () {
    this.fetchData()
    this.userItem[this.userItem] = this.$route.params.editData
    this.themeType = parseInt(localStorage.getItem('themeType'))
    this.filterArr()
  }
}
</script>
<style lang="scss" scoped>
.searchInput{
  margin-left:2px;
  width:32vw;
  display:inline-block
}
 label{
  float: left;
   width: 4rem;
   margin-right: 1rem;
   text-align: right;
   line-height: 3rem;
   margin-top: 0.4rem;
  }
  input{
    border:1px solid #ccc;
    line-height: 2rem;
    background-color: #fff;
    text-indent: 1em;
    margin-top: 1rem
  }
.con{
  position: relative;
  min-height:100vh;
  background-color: rgb(238,238,238);
}
.groupdiv{
    // border:1px solid #ccc;
    margin-top: 1rem
}
Button{
    line-height: 1.7rem;
    font-size: 1rem;
    word-spacing: 0.1rem;
}
.btn-col{
    text-align: center;
}
.fi {
  line-height: 1.5rem;
  font-size: 0.85rem;
}
.titleCss{
  font-size: 0.9rem;
  margin-left: 0.5rem;
  display: inline-block;
  width: 100%;
}
.btnDel{
  position: absolute;
  right:0;
  top:2rem;
}
.imgStyle{
  max-width: 100vw;
  max-height: auto;
}
.box-code-body {
  height: 245px;
}
.box-code-left {
  float: left;
}
.box-code-right {
  float: right;
  width:15rem;
  white-space:normal;
  word-break:break-all;
  overflow:hidden;
}
.box-code-body-btn {
  margin-top: 1rem;
  text-align: center;
  .box-code-body-btn-style {
    width: 12rem;
  }
}
.btn{
  width: 70vw;
  margin-left: 15vw;
  border-radius: 0.6rem
}
</style>
<style scoped>
#asd >>> .van-pagination__item--disabled, .van-pagination__item--disabled:active {
  color:red;
}
</style>

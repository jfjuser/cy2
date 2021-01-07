<template>
    <div class="con">
      <NavBar
        title="账号管理"
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
            <CollapseItem title="账户管理" name="1">
            <span class="titleCss" style="color:#1E90FF">账户列表</span>
            </CollapseItem>
            <CollapseItem title="用户管理" name="2">
              <span class="titleCss" @click="manager">查看用户列表</span>
            </CollapseItem>
            <CollapseItem title="审核设置" name="3">
              <span class="titleCss" @click="checkSet">审核设置</span>
            </CollapseItem>
            <CollapseItem title="黑名单" name="4">
              <span class="titleCss" @click="pushPath">黑名单</span>
            </CollapseItem>
            <CollapseItem title="楼栋/单元管理" name="5">
              <span class="titleCss" @click="goAreaManage">楼栋/单元管理</span>
            </CollapseItem>
        </Collapse>
      </div>
    </Popup>
    <Field class="searchInput" v-model="listQuery.floorNum" placeholder="单元"/>
    <Field class="searchInput" v-model="listQuery.roomNum" placeholder="房号"/>
    <Field class="searchInput" v-model="listQuery.localName" placeholder="通道名称"/>
    <Field class="searchInput" v-model="listQuery.phone" placeholder="手机号"/>
    <Search
      v-model="listQuery.leader"
      placeholder="业主姓名"
      show-action
      background="#6495ED"
      @search="onSearch"
      >
        <div slot="action" style="color:#fff;text-align:center;border-radius:15%;width:3rem;background-color:rgb(14, 105, 254)" @click="onSearch">搜索</div>
      </Search>
    <div>
      <!-- <Button style="position:absolute" @click="delAll" size=small :isLoading="deleteAllLoading">删除全部</Button> -->
      <Cell v-if="share.includes('添加')" title="添加" style="color:green;"  @click="onClickRight">
        <Icon name="add-o"  right-icon></Icon>
      </Cell>
      <Cell v-if="share.includes('删除所有')" title="删除所有" style="color:red;"  @click="delAll">
        <Icon name="delete"  right-icon></Icon>
      </Cell>
      <PullRefresh v-model="isLoading" @refresh="onRefresh">
        <div style="">
        <div v-for="(item, index) in userData" :key=index>
          <CellGroup class="groupdiv">
            <Cell title="登录名" :value="item.loginName"/>
            <Cell :title="themeType === 1 ? '业主姓名': (themeType === 2 ? '部门名称' :
            (themeType === 3 ? '班级名称' : (themeType === 4 ? '账户名称' : '带班名称')))" :value="item.leader" />
            <Cell v-show="themeType === 5" title="班组名称" :value="item.teamName"/>
            <Cell title="性别" :value="sexFormatter1(item.sex)" />
            <Cell title="手机号" :value="item.phone" />
            <Cell :title="themeType === 1 ? '房号' : '地址'" :value="item.addr" />
            <Cell title="审核方式" :value="checkFormatter(item.isCheck)" />
            <Cell :title="themeType === 5 ? '非访客人数' : '家庭人数'" :value="item.userNum" />
            <!-- <Cell title="访客人数" :value="item.visitorNum" /> -->
            <span style="display:block;line-height:2.5rem;color:rgb(14,105,254);margin-left:86%;" @click="showin(item,index)">操作</span>
          </CellGroup>
        </div>
        </div>
          <div style="width:100%;height:22rem;text-align:center" v-show="imgShow">
             <img src="@/assets/noData (2).png" style="max-width:300px;max-height:300px"/>
          </div>
      </PullRefresh>
      <div style="margin:2rem 0 0rem 0;" v-show="!imgShow" id="asd">
          <Pagination
            v-model="listQuery.offset"
            :page-count="Math.ceil(total/5)"
            :total-items = 'total'
            mode="simple"
            @change="seePage"
          >
          </Pagination>
      </div>
      <Popup v-model="show" position="bottom">
          <!-- <span style="margin-left:90%;display:inline-block;line-height:1rem;" @click="closeDiv"><van-icon name="cross" size="1.5rem" style="margin-top:0.5rem"/></span> -->
          <Button size="large" v-if="share.includes('删除')" @click="delUser">删除</Button>
          <Button size="large" v-if="share.includes('编辑')" @click="editDialog">编辑</Button>
          <!-- <Button size="large" @click="QRcode">二维码</Button> -->
          <Button size="large" v-if="share.includes('修改密码')" @click="changePassword">修改密码</Button>
          <Button size="large" v-if="share.includes('通道权限')" @click="accessChannel">通道权限</Button>
          <Button size="large" v-if="share.includes('授权审核') && userItem.isLogin === 0" @click="giver">授权审核</Button>
          <Button size="large" @click="userManage">用户管理</Button>
          <Button size="large" @click="closeWindows">取消</Button>
      </Popup>
      <Popup v-model="isGive" position=top style="width:94vw">
          <Field required clearable label="通道名称" class="fi" disabled/>
        <div>
          <CheckboxGroup v-model="form.aiTokenIds">
            <Checkbox v-for="(item, index) in localList" :key=index :name="item.id" style="margin-left:2.5rem;line-height:2.5rem;display:inline-block;font-size:0.75rem">{{item.localName}}</Checkbox>
          </CheckboxGroup>
        </div>
        <Field v-show="state" required clearable label="时段设置" class="fi" disabled/>
        <div>
          <CheckboxGroup v-model="form.timeLimits">
            <Checkbox v-for="(item, index) in timeList" :key=index :name="item.num" style="margin-left:2.5rem;line-height:2.5rem;display:inline-block;font-size:0.75rem">{{item.name}}</Checkbox>
          </CheckboxGroup>
        </div>
         <Field
          required
          clearable
          label="审核结果"
          placeholder="请选择"
          class="fi"
          disabled
          :border="false"
        />
        <RadioGroup v-model="form.isLogin" style="margin-left:1rem;line-height:2rem">
          <Radio name="0" style="font-size:0.85rem;margin-left:1rem;">审核失败</Radio>
          <Radio name="1" style="font-size:0.85rem;margin-left:1rem;">审核成功</Radio>
        </RadioGroup>
         <Field
            v-show="form.isLogin === '0'"
            required
            clearable
            label="失败原因"
            placeholder="请填写失败原因"
            v-model="form.cause"
            class="fi"
        />
        <div style="text-align:center;line-height:4rem">
          <Button style="margin-right:4rem" @click="isGive = false">取消</Button>
          <Button type="info" @click="checkFinshed">确定</Button>
        </div>
      </Popup>
      <Popup v-model="notSight" position="bottom" @click-overlay="swiper">
          <Cell title="生成授权码" style="font-size:1rem">
            <Icon slot="right-icon" name="cross" class="custom-icon" @click="closeThis"/>
          </Cell>
        <div v-show="isCode" :model="codeForm" ref="createCode">
          <RadioGroup v-model="radio" style="line-height:2rem;margin:2rem 0 0 2.5rem">
          <img src="@/assets/icon/icon_people_1.png" /><Radio style="display:inline-block;margin-left:0.5rem" v-model="radio" name="0">授权给员工</Radio><br>
          <img src="@/assets/icon/icon_people_2.png"/><Radio style="display:inline-block;margin-left:0.5rem" v-model="radio" name="1">授权给访客</Radio>
          </RadioGroup>
          <label>部门</label>
          <input placeholder="研发开发测试" disabled/><br>
           <label for="" style="margin-left:-5rem">授权组</label>
          <input v-model="codeForm.authGroup" /><br>
          <div v-if="radio === '1'" style="width:100vw;display:inline-block;">
            <Field
              label="开始时间"
              v-model="startTime"
              placeholder="请选择"
              @focus="showDate"
            />
          <Field
            label="结束时间"
            v-model="endTime"
            placeholder="请选择"
            @focus="pushEnd"
          />
          <DatetimePicker
            v-model="currentDate"
            type="date"
            :formatter=formatter
            @confirm="saveValue"
            @cancel="bye"
            v-show="isDate"
          />
          <DatetimePicker
            v-model="currentDate"
            type="date"
            :formatter=formatter
            @confirm="getValue"
            @cancel="bye"
            v-show="isEnd"
          />
        </div>
        <div style="line-height:4rem">
          <Button @click="createQR" type="info" class="btn" style="margin-top:1.5rem">生成二维码</Button>
          <Button @click="backOrigin" class="btn" style="margin-top:0.5rem;margin-bottom:1rem">取消</Button>
          </div>
        </div>
        <div v-if="codeVisible" class="box-code-body">
          <div class="box-code-left">
            <div style="margin-top: 4rem;margin-left:1rem" id="qrcode" ref="qrcode"></div>
          </div>
          <div class="box-code-right">
            <div style="font-size:0.95rem">
              <p>{{codeForm.authGroup !== '' ? codeForm.authGroup : '默认授权组'}}</p>
              <p>{{authGroupTypeFormatter(radio)}}可通过扫描此二维码,在手机端进行自助申请入库</p>
            </div>
            <div class="box-code-body-btn">
              <p><Button class="box-code-body-btn-style" type="primary" @click="downCode" size="small">下载二维码</Button></p>
              <p><Button class="box-code-body-btn-style copyCodebtn" size="small" :data-clipboard-text="codeUrl" @click="copyCode">复制链接</Button></p>
            </div>
        </div>
      </div>
      </Popup>
      <Popup v-model="passwordFrame" style="width:94vw;height:13rem" position=top>
        <Cell title="修改" style="line-height:2rem;font-size:1.1rem">
          <Icon slot="right-icon" name="cross" class="custom-icon" @click="closeNew"/>
        </Cell>
        <Field
          v-model="psw"
          label="新密码"
          type="password"
          placeholder="请输入"
          required
          style="line-height:2rem;font-size:1rem;"
        />
        <div style="margin-top:2rem">
        <Button @click="closeNew" style="margin-left:20vw;">取消</Button>
        <Button type="info" style="margin-top:3%;margin-left:20vw;" @click="confirmPsw">确定</Button>
        </div>
      </Popup>
      <Popup v-model="isPop" position="top" style="width:94vw">
        <span style="margin-left:1rem;line-height:3rem;font-size:1.1rem">通道权限</span>
        <CheckboxGroup v-model="checked">
          <Checkbox :name="item.localId" v-for="(item, index) in localList" :key=index style="margin-left:1.5rem;display:inline-block;line-height:4rem">{{item.localName}}</Checkbox>
        </CheckboxGroup>
        <div style="line-height:3rem;margin-bottom:1rem">
          <Button style="margin-left:52%;margin-bottom:0.5rem;height:2rem;" @click="closePop">取消</Button>
          <Button type="info" style="margin-left:5%;margin-bottom:0.5rem;height:2rem" @click="saveChannel" :loading="willLoading">保存</Button>
        </div>
      </Popup>
    </div>
    </div>
</template>

<script>
import { NavBar, Icon, Pagination, CheckboxGroup, Toast, Button, DatetimePicker, PullRefresh, RadioGroup, Radio, Checkbox, Cell, CellGroup, Row, Col, Popup, Field, Search, Collapse, CollapseItem, Dialog } from 'vant'
import { httpGet, httpDelete, httpPut } from '@/utils/restful.js'
import { sexFormatter1 } from '@/utils/formatter'
import { getAiDuyCompany, checkAllow, AIInOutTime, checkAICamera, AiDuyCompany, AIpermission, updateAIPassword } from '@/api/url.js'
import { checkFormatter, authGroupTypeFormatter, timeFormatter } from '@/utils/formatter.js'
import QRcode from 'qrcodejs2'
import Clipboard from 'clipboard'
export default {
  name: 'staffManage',
  data () {
    return {
      share: [],
      showMenu: true,
      radio: '0',
      isGive: false,
      state: false,
      localList: [],
      timeList: [],
      themeType: undefined,
      form: {
        aiTokenIds: [],
        timeLimits: [],
        cause: '',
        isCheck: 0,
        isLogin: undefined
      },
      sexFormatter1: sexFormatter1,
      isShow: false,
      total: null,
      isEnd: false,
      startTime: undefined,
      endTime: undefined,
      currentDate: new Date(),
      isDate: false,
      authGroupTypeFormatter: authGroupTypeFormatter,
      codeForm: {
        type: '1',
        departmentId: this.$store.getters.departmentId,
        departmentName: this.$store.getters.depName,
        authGroup: '默认授权组',
        enableTime: undefined,
        overdueTime: undefined
      },
      imgShow: false,
      isPop: false,
      date: [],
      codeVisible: false,
      isCode: false,
      psw: undefined,
      notSight: false,
      password: '',
      checked: [],
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
      memberId: undefined,
      isLoading: false,
      userData: [],
      rowId: undefined,
      listQuery: {
        offset: 1,
        limit: 5,
        localName: undefined,
        leader: undefined,
        floorNum: undefined,
        roomNum: undefined,
        phone: undefined
      }
    }
  },
  components: {
    NavBar,
    Toast,
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
    filterArr () {
      // this.$store.getters.permissionFun
      JSON.parse(window.sessionStorage.getItem('list')).map(item => {
        if (item.name === '人脸识别') {
          item.children.map(it => {
            if (it.name === '账户管理') {
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
      this.isGive = true
      this.getCameraList()
      this.getTimeData()
    },
    // 授权审核完成
    checkFinshed () {
      httpPut(checkAllow, Object.assign(this.form, {id: this.userItem.id}))
        .then((res) => {
          Toast({
            message: res.message,
            type: 'success',
            duration: 3000
          })
          this.isGive = false
          this.show = false
          this.fetchData()
        }).catch(() => {
        })
    },
    // 获取所有的通道列表
    getCameraList () {
      httpGet(checkAICamera + this.$store.getters.departmentId).then(res => {
        if (res.data.length === 0) {
          Toast({
            message: '请先配置通道',
            type: 'fail',
            duration: 4 * 1000
          })
        } else {
          this.localList = res.data
        }
      }).catch(() => {})
    },
    // 获取时段
    getTimeData () {
      httpGet(AIInOutTime + '/list/' + this.$store.getters.departmentId)
        .then(res => {
          this.canType = res.data.addrType
          if (res.data.openWigan === 0) {
            this.weiShow = false
          } else {
            this.weiShow = true
          }
          if (res.data.addrType === 0) {
            this.addrInput = true
          } else {
            this.addrInput = false
          }
          if (res.data.state === 1) {
            this.state = true
            this.timeList = res.data.data
          } else {
            this.state = false
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
    tanslate (d) {
      const newDate = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + (d.getHours() < 10 ? '0' + d.getHours() : d.getHours()) + ':' + (d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes()) + ':' + (d.getSeconds() < 10 ? '0' + d.getSeconds() : d.getSeconds())
      return newDate
    },
    formatter (type, value) {
      if (type === 'year') {
        return value + '年'
      } else if (type === 'month') {
        return value + '月'
      }
      return value
    },
    beforeClose (action, done) {
      if (action === 'confirm') {
        setTimeout(done, 1000)
      } else {
        done()
      }
    },
    onClickRight () {
      this.$router.push('/addUser/')
    },
    // 关闭
    closeThis () {
      this.notSight = false
      this.show = false
      this.codeVisible = false
    },
    swiper () {
      this.codeVisible = false
    },
    // 点击二维码
    QRcode () {
      this.notSight = true
      this.isCode = true
      this.rowId = this.userItem.id
    },
    closeWindows () {
      this.show = false
    },
    // 生成二维码
    createQR () {
      this.codeVisible = true
      this.isCode = false
      this.$nextTick(() => {
        let QrCodeHTML = this.$refs.qrcode
        QrCodeHTML.innerHTML = ''
        this.createQrCode()
        this.codeUrl = process.env.API_HOST + 'view/faceAI/userManage/?id=' + this.rowId + '&depId=' + this.$store.getters.departmentId + '&type=' + this.radio
        if (this.radio === '1') {
          this.codeUrl += '&et=' + timeFormatter(this.codeForm.enableTime) + '&ot=' + timeFormatter(this.codeForm.overdueTime)
        }
        this.createCode.clear()
        this.createCode.makeCode(this.codeUrl)
        console.log(this.radio)
      })
    },
    // 生成二维码
    createQrCode () {
      this.createCode = new QRcode('qrcode', {
        text: this.codeUrl,
        width: 100,
        height: 100
      })
    },
    // 下载二维码
    downCode () {
      let img = document.getElementById('qrcode').getElementsByTagName('img')[0]
      let triggerDownLoad = document.createElement('a')
      triggerDownLoad.setAttribute('href', img.src)
      triggerDownLoad.setAttribute('downLoad', '授权码.png')
      triggerDownLoad.click()
      Toast.success('下载完成')
    },
    // 复制链接
    copyCode () {
      let clipboard = new Clipboard('.copyCodebtn')
      clipboard.on('success', e => {
        Toast.success('复制成功')
        clipboard.destroy() // 使用destroy可以清楚缓存
      })
    },
    //  监听日期
    changeDate (value) {
      if (value === null) {
        Toast('日期不可为空')
      } else {
        this.codeForm.enableTime = value[0]
        this.codeForm.overdueTime = value[1]
      }
    },
    backOrigin () {
      this.notSight = false
      this.show = false
    },
    // 操作
    showin (item, index) {
      this.show = !this.show
      this.userItem = item
      this.itemIndex = index
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
    // 设定新密码
    confirmPsw () {
      httpPut(updateAIPassword, {id: this.userItem.id, psw: this.psw})
        .then(res => {
          Toast.success(res.message)
          console.log(res)
          this.passwordFrame = false
          this.show = false
        }).catch((err) => {
          console.log(err)
        })
    },
    // 获取数据
    fetchData () {
      this.listQuery = Object.assign(this.listQuery, {departmentId: this.$store.getters.departmentId})
      httpGet(getAiDuyCompany, this.listQuery).then(res => {
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
      this.$router.push({
        name: 'editUser',
        params: {
          info: this.userItem,
          index: this.itemIndex
        }
      })
      // this.$router.push({
      //   path: '/editUser/',
      //   query: {
      //     info: this.userItem,
      //     index: this.itemIndex
      //   }
      // })
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
          httpDelete(AiDuyCompany + '/' + this.memberId).then(res => {
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
      httpDelete(AiDuyCompany, {ids: this.selectArrayId}).then(res => {
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
    // 修改密码
    changePassword () {
      this.passwordFrame = true
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
  margin-left:1vw;
  width:23vw;
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

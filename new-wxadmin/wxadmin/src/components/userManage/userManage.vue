<template>
    <div class="containe changeinner" ref="fax">
      <NavBar
        title="用户管理"
        left-text="返回"
        right-text="全删"
        left-arrow
        @click-left="onClickLeft"
        @click-right="onClickRight"
      />
      <Button @click="toOpenGateRecord" type="info" class="openGateRecord" >查看同步状态</Button>
      <van-row align="center" type="flex" justify="space-between">
        <van-col span="8" >
          <el-select placeholder="类型" v-model='listQuery.type' >
            <el-option v-for="item in option1" :key="item.value" :label="item.text" :value="item.value" ></el-option>
          </el-select>
        </van-col>
        <van-col span="8">
          <el-select placeholder="审核状态" v-model='listQuery.isCheck' >
            <el-option v-for="item in option2" :key="item.value" :label="item.text" :value="item.value"></el-option>
          </el-select>
        </van-col>
        <van-col span="8">
          <el-select placeholder="选择" v-model='listQuery.isDistribution' >
            <el-option v-for="item in option3" :key="item.value" :label="item.text" :value="item.value"></el-option>
          </el-select>
        </van-col>
      </van-row>

      <van-row align="center" type="flex" justify="space-between">
        <van-col span="8">
          <el-select placeholder="同步状态" v-model='listQuery.isSync' >
            <el-option v-for="item in option4" :key="item.value" :label="item.text" :value="item.value"></el-option>
          </el-select>
        </van-col>
        <van-col span="8">
          <Field class="searchInput" v-model="listQuery.mac" placeholder="Mac"/>
        </van-col>
        <van-col span="8">
          <Field class="searchInput" v-model="listQuery.phone" placeholder="手机号"/>
        </van-col>
      </van-row>
      <!-- <input type="text" autocomplete="off" placeholder="Mac" class="ele"> -->
      <Search
        v-model="listQuery.userName"
        placeholder="请输入姓名"
        show-action
        shape="round"
        background="rgb(238, 238, 238)"
        @search="onSearch"
      >
        <div slot="action" @click="onSearch" style="color:#fff;text-align:center;border-radius:15%;width:3rem;background-color:rgb(14, 105, 254)">搜索</div>
      </Search>
      <!-- <Field
        v-model="listQuery.userName"
        placeholder="请输入姓名"
        style="display:inline-block;width:40vw;margin:1rem 0 -0.8rem 1rem;border:1px solid #ccc;line-height:1rem;"
      />
      <Button style="width:6rem;margin-left:6rem;height:2.2rem;line-height:1rem" type="info" @click="search"><Icon name="search"/>搜索</Button>
      <br> -->
        <!-- <span style="margin-left:0.75rem;font-size:1.1rem;line-height:3rem">用户列表</span> -->
        <PullRefresh v-model="isLoading" @refresh="onRefresh">
          <div style="">
            <div v-for="(item, index) in userData" :key=index>
              <CellGroup class="groupdiv">
                <Cell title="姓名" :value="item.userName" />
                <Cell title="审核状态" :value="checkStatusFormatter(item.isCheck)" />
                <Cell title="手机号" :value="item.phone" />
                <Cell title="韦根卡号" :value="item.wiegandCard"/>
                <!-- <Cell title="详细地址" :value="item.addr" /> -->
                <Cell title="类型" :value="personFormatter(item.type)" />
                <Cell title="同步信息" :value="item.aiPower" />
                <Cell title="有效日期" :value="timeFormatter(item.endTime)" />
                <Cell title="备注消息" :value="item.remarks" />
              <!-- <Button style="margin-left:80%;border:none" @click="edit(item)">操作</Button> -->
                <!-- <Cell title="操作" @click="edit(item)" is-link style="font-weight:bold;font-size:1rem;color:#ff0000"/> -->
                <span style="display:block;line-height:2.5rem;color:rgb(14, 105, 254);margin-left:86%;" @click="edit(item)">操作</span>
              </CellGroup>
          </div>
          </div>
          <div style="width:100%;height:22rem;text-align:center" v-show="noSee">
            <img src="@/assets/noData (2).png" style="max-width:300px;max-height:300px"/>
          </div>
        </PullRefresh>
        <div v-show="!noSee" id="asd" style="margin:0.5rem 0 0rem 0;">
          <Pagination
            v-model="listQuery.offset"
            :page-count="Math.ceil(total/10)"
            :total-items = 'total'
            mode="simple"
            @change="seePage"
          >
          </Pagination>
        </div>
        <Popup v-model="show" position="bottom">
          <Button size="large" v-if="share.includes('删除所选')" @click="delCardInfo">删除</Button>
          <Button size="large" v-if="share.includes('编辑')" @click="editContent">编辑</Button>
          <Button size="large" v-if="share.includes('查看图片')" @click="searchPic">查看图片</Button>
          <Button size="large" v-if="row && row.type === 2" @click="toBeWhite" >转为白名单</Button>
          <Button size="large" v-if="row && row.type !== 2" @click="toBeBlack" >转为黑名单</Button>
          <Button size="large" v-if="row && row.type === 1" @click="tobeAdmin">转为非访客</Button>
          <Button size="large" v-if="share.includes('审核') && (mark === '审核中')" @click="checkType">审核</Button>
          <Button size=large @click="closeWindows">取消</Button>
        </Popup>
        <Popup v-model="isCheckType" position=top style="width:93vw;">
          <Cell title="成员审核" style="font-size:0.95rem">
            <Icon slot="right-icon" name="cross" class="custom-icon" @click="defeat"/>
          </Cell>
          <div style="background-color: #fffbe8;color:#ed6a0c;font-size: 14px;padding:10px;" v-if="row && row.type === 0">选择‘其他’可自定义时长，但必须填写数字，且以月为单位计算</div>
          <Cell required title="授权时长" v-if="row && row.type === 0" :value="timelimit.valueName" @click="showtime = true"/>
          <Field required placeholder="请输入自定义时长" type="number" v-model="customTime" v-if="timelimit.valueNo && timelimit.valueNo==5"><div slot="button">个月</div></Field>
          <Field
            label="审核状态"
            required
            disabled
            :border="false"
          />
          <RadioGroup v-model="radios">
            <CellGroup>
              <Cell title="审核失败" clickable @click="radios = '0'" :border="false">
                <Radio name="0" />
              </Cell>
              <Cell title="审核成功" clickable @click="radios = '1'">
                <Radio name="1" />
              </Cell>
            </CellGroup>
          </RadioGroup>
          <Cell title="分配通道" v-if="row && row.type === 1 && radios=='1'" :value="localVal==''?'请选择':localVal" @click="showlocal = true" />
          <div style="display:flex;justify-content:space-around;margin:1rem">
            <Button @click="defeat">取消</Button>
            <Button type="info" @click="saveType">保存</Button>
          </div>
        </Popup>
        <Popup v-model="dialogPhotoVisible" position="top" style="width:90vw;height:60vh">
          <div style="text-align:center">
            <img :src="imgUrl" style="max-height: 400px;max-width: 300px"/>
          </div>
        </Popup>
        <Popup v-model="isSwiper" style="width:88vw;height:28rem" position=top>
          <Cell title="编辑成员" style="font-size:0.95rem">
            <Icon slot="right-icon" name="cross" class="custom-icon" @click="cannel"/>
          </Cell>
          <Field
            v-model="doot.userName"
            label="姓名"
            required
          />
          <Field
            v-model="doot.phone"
            label="手机号"
            required
            ref="inphone"
            @blur="checkPsd"
            placeholder="请输入手机号"
          />
          <Field
            v-model="doot.wiegandCard"
            label="韦根卡号"
            required
            autofocus
            placeholder="请输入韦根卡号"
          />
          <Field
            v-model="doot.idCard"
            label="校检码"
            disabled
          />
          <!-- <Field
              v-model="doot.addr"
              label="房号"
              required
              placeholder="请输入房号"
              @blur="checkAdd"
              ref="addr"
          /> -->
           <Field
              v-model="doot.remarks"
              label="备注信息"
              placeholder="请输入备注信息"
          />
          <Button class="btnEdit" style="margin-top:8%" @click="cannel">取消</Button>
          <Button class="btnEdit" style="margin-top:8%" :isLoading = "updateLoading" type="info" @click="update">保存</Button>
         </Popup>
         <Popup v-model="showtime" position="bottom" :close-on-click-overlay="false">
          <Picker
            :columns="timekinds"
            show-toolbar
            value-key="valueName"
            @cancel="showtime = false"
            @confirm="onConfirmtime"
          />
        </Popup>
        <!-- 转为非访客 -->
        <Popup v-model="isNotVisible" position=top style="width:93vw;">
          <Cell title="非访客" style="font-size:0.95rem">
            <Icon slot="right-icon" name="cross" class="custom-icon" @click="isNotVisible=false, show=false"/>
          </Cell>
          <Cell required title="账户" :value="tobeFangVal==''?'请选择':tobeFangVal" @click="showPicker = true"/>
          <div style="display:flex;justify-content:space-around;margin:1rem">
            <Button @click="isNotVisible=false, show=false">取消</Button>
            <Button type="info" @click="tobeFang">保存</Button>
          </div>
        </Popup>
        <Popup v-model="showPicker" position="bottom" :close-on-click-overlay="false">
          <Picker
            :columns="userArr"
            show-toolbar
            value-key="leader"
            @cancel="showPicker = false"
            @confirm="onConfirmFang"
          />
        </Popup>
        <!-- 转为白名单 -->
        <Popup v-model="dialogWhiteVisible" position=top style="width:93vw;">
          <Cell title="白名单" style="font-size:0.95rem">
            <Icon slot="right-icon" name="cross" class="custom-icon" @click="dialogWhiteVisible=false, show=false"/>
          </Cell>
          <Cell required title="账户" :value="tobeFangVal==''?'请选择':tobeFangVal" @click="showPicker = true"/>
          <Cell required title="类型"/>
          <RadioGroup v-model="lists.type">
            <CellGroup>
              <Cell title="非访客" clickable @click="lists.type = 0" :border="false">
                <Radio :name="0" />
              </Cell>
              <Cell title="访客" clickable @click="lists.type = 1">
                <Radio :name="1" />
              </Cell>
            </CellGroup>
          </RadioGroup>
          <template v-if="lists.type === 1">
            <Field label="开始时间" required :value="lists.beginTime?timeFormatter(lists.beginTime):timeFormatter(currentDate)" placeholder="请选择" @focus="startDate = true" readonly/>
            <Field label="结束时间" required :value="lists.endTime?timeFormatter(lists.endTime):timeFormatter(currentDate1)" placeholder="请选择" @focus="endDate = true" readonly/>
          </template>
          <div style="display:flex;justify-content:space-around;margin:1rem">
            <Button @click="dialogWhiteVisible=false, show=false">取消</Button>
            <Button type="info" @click="blackToWhite">保存</Button>
          </div>
        </Popup>
        <Popup v-model="startDate" style="width:80vw;height:45vh">
        <DatetimePicker
          v-model="currentDate"
          type="datetime"
          @confirm="saveValue"
          @cancel="startDate = false"
        />
      </Popup>
      <Popup v-model="endDate" style="width:80vw;height:45vh">
        <DatetimePicker
          v-model="currentDate1"
          type="datetime"
          @confirm="getValue"
          @cancel="endDate = false"
        />
      </Popup>
      <!-- 通道 -->
      <Popup v-model="showlocal" position="bottom" :close-on-click-overlay="false">
          <Picker
            :columns="channelArr"
            show-toolbar
            value-key="localName"
            @cancel="showlocal = false"
            @confirm="onConfirmlocal"
          />
        </Popup>
    </div>
</template>
<script>
import { NavBar, Search, Toast, Pagination, Icon, Button, Field, PullRefresh, Dialog, Cell, CellGroup, RadioGroup, Radio, Row, Col, Popup, Picker, DatetimePicker } from 'vant'
import { checkStatusFormatter, personFormatter, timeFormatter } from '@/utils/formatter.js'
import { personType } from '@/utils/selectAble.js'
import { usersAIManage, seeAIMemberPhoto, AIMember, AiDuyCompany, checkAIMemeber, getAiDuyCompany, changeVisitor, whiteBlackList, getAccountCamera } from '@/api/url'
import { httpGet, httpPost, httpPut, httpDelete } from '@/utils/restful'
export default {
  name: 'userManage',
  data () {
    return {
      share: [],
      radio: '1',
      imgUrl: '',
      fileData: {
        photo: ''
      },
      option1: [
        { text: '非访客', value: 0 },
        { text: '访客', value: 1 }
      ],
      option2: [
        { text: '审核失败', value: 0 },
        { text: '审核成功', value: 1 },
        { text: '审核中', value: 2 }
      ],
      option3: [
        { text: '全部', value: 0 },
        { text: '未分配账户', value: 1 }
      ],
      option4: [
        { text: '未同步', value: 0 },
        { text: '同步成功', value: 1 },
        { text: '下发中', value: 2 },
        { text: '删除中', value: 3 }
      ],
      radios: undefined,
      dialogPhotoVisible: false,
      personFormatter: personFormatter,
      value: '',
      total: null,
      noSee: false,
      row: undefined,
      isSwiper: false,
      isMask: false,
      updateLoading: false,
      isLoading: false,
      show: false,
      isCheckType: false,
      mark: undefined,
      checkStatusFormatter: checkStatusFormatter,
      timeFormatter: timeFormatter,
      personType: personType,
      listQuery: {
        departmentId: this.$store.getters.departmentId,
        offset: 1,
        limit: 10,
        userName: undefined,
        type: undefined,
        isCheck: undefined,
        isDistribution: 0,
        isSync: undefined,
        mac: undefined,
        phone: undefined
      },
      doot: {
        idCard: undefined,
        userName: undefined,
        phone: undefined,
        addr: undefined,
        type: undefined,
        id: undefined,
        photo: '',
        wiegandCard: '',
        beginTime: undefined,
        endTime: undefined
      },
      userData: [],
      timekinds: [
        {
          valueNo: 1,
          valueName: '一个月'
        }, {
          valueNo: 2,
          valueName: '三个月'
        }, {
          valueNo: 3,
          valueName: '六个月'
        }, {
          valueNo: 4,
          valueName: '一年'
        }, {
          valueNo: 5,
          valueName: '其他'
        }
      ],
      showtime: false,
      customTime: '',
      timelimit: {},
      isNotVisible: false,
      lists: {
        type: 0,
        id: undefined,
        dutyCompanyId: undefined,
        beginTime: undefined,
        endTime: undefined
      },
      userArr: [],
      tobeFangVal: '',
      showPicker: false,
      dialogWhiteVisible: false,
      startDate: false,
      endDate: false,
      currentDate: new Date(),
      currentDate1: new Date(),
      showlocal: false,
      localVal: '',
      channelId: undefined,
      channelArr: []
    }
  },
  methods: {
    filterArr () {
      // this.$store.getters.permissionFun
      JSON.parse(window.sessionStorage.getItem('list')).map(item => {
        if (item.name === '人脸识别') {
          item.children.map(it => {
            if (it.name === '用户管理') {
              this.share = it.roles
            }
          })
        }
      })
    },
    // 转为非访客
    tobeAdmin () {
      this.lists.id = this.row.id
      httpGet(getAiDuyCompany, {departmentId: this.$store.getters.departmentId}).then(res => {
        if (res.data === null || res.data.rows === null) {
          this.userArr = []
        } else {
          this.userArr = res.data.rows
        }
      }).catch((err) => {
        Toast.fail(err)
      })
      this.tobeFangVal = ''
      this.isNotVisible = true
    },
    toOpenGateRecord () {
      this.$router.push('/openState/')
    },
    // fangke
    tobeFang () {
      if (this.tobeFangVal === '') {
        Toast.fail('请先选择账户')
        return
      }
      httpPost(changeVisitor, {
        dutyCompanyId: this.lists.dutyCompanyId,
        userId: this.lists.id
      }).then((res) => {
        Toast({
          type: 'success',
          message: res.message,
          duration: 4 * 1000
        })
        this.isNotVisible = false
        this.show = false
        this.onSearch()
      }).catch(() => {})
    },
    // 黑转白
    blackToWhite () {
      if (this.tobeFangVal === '') {
        Toast.fail('请先选择账户')
        return
      }
      httpPut(whiteBlackList, this.lists).then((res) => {
        Toast({
          type: 'success',
          message: res.message,
          duration: 4 * 1000
        })
        this.dialogWhiteVisible = false
        this.show = false
        this.onSearch()
      }).catch(() => {
        this.dialogWhiteVisible = false
      })
    },
    toBeBlack () {
      Dialog.confirm({
        message: '确定将该用户转为黑名单？'
      }).then(() => {
        let obj = {
          id: this.row.id,
          type: 2
        }
        httpPut(whiteBlackList, obj).then((res) => {
          console.log(res)
          Toast({
            type: 'success',
            message: res.message,
            duration: 4 * 1000
          })
          this.show = false
          this.onSearch()
        }).catch(() => {})
      }).catch(() => {})
    },
    // 转为白名单之前获取账户列表
    toBeWhite () {
      this.lists.id = this.row.id
      this.tobeFangVal = ''
      this.dialogWhiteVisible = true
      httpGet(getAiDuyCompany, {departmentId: this.$store.getters.departmentId}).then(res => {
        console.log(res)
        if (res.data === null || res.data.rows === null) {
          this.userArr = []
          Toast.fail('获取不到可转入白名单的账户')
        } else {
          this.userArr = res.data.rows
        }
      }).catch((err) => {
        Toast.fail(err)
      })
    },
    onConfirmFang (value, index) {
      this.lists.dutyCompanyId = value.id
      this.tobeFangVal = value.leader
      this.showPicker = false
    },
    // 确定选择时间
    saveValue (value) {
      this.lists.beginTime = value
      this.startDate = false
    },
    getValue (value) {
      this.lists.endTime = value
      this.endDate = false
    },
    // 查看通道
    watchChannel () {
      httpGet(getAccountCamera + '/' + this.row.dutyCompanyId).then(res => {
        if (res.data.length === 0) {
          Toast.fail('请先配置通道')
        } else {
          this.channelArr = res.data
        }
      }).catch(() => {})
    },
    onConfirmlocal (value, index) {
      this.channelId = value.id
      this.localVal = value.localName
      this.showlocal = false
    },
    onClickLeft () {
      this.$router.push('/indexPage/')
    },
    onSearch () {
      this.listQuery.offset = 1
      this.fetchData()
    },
    defeat () {
      this.isCheckType = false
      this.show = false
    },
    checkType () {
      if (this.row && this.row.type === 1) {
        this.watchChannel()
      }
      this.isCheckType = true
      this.timelimit = this.timekinds[0]
      this.customTime = ''
    },
    closeWindows () {
      this.show = false
    },
    // 保存审核状态
    saveType () {
      // console.log(this.radios)
      if (this.radios === undefined) {
        Toast.fail('请先选择审核的状态')
      } else {
        const data = {
          id: this.row.id,
          isCheck: this.radios,
          departmentId: this.$store.getters.departmentId,
          customTime: this.customTime,
          timelimit: this.timelimit.valueNo ? this.timelimit.valueNo : '',
          channelId: this.channelId
        }
        // console.log(data)
        httpPut(checkAIMemeber, data).then(res => {
          this.fetchData()
          this.isCheckType = false
          this.show = false
          Toast.success(res.message)
        }).catch(() => {
          this.isCheckType = false
          this.show = false
        })
      }
    },
    onClickRight () {
      Dialog.confirm({
        message: '确认删除所有的记录吗？',
        title: '提示'
      })
        .then(() => {
          this.memberId = this.$store.getters.departmentId
          httpDelete(AiDuyCompany + '/' + this.memberId).then(res => {
            this.fetchData()
            Toast({
              type: 'success',
              message: res.message,
              duration: 4 * 1000
            })
          }).catch(() => {
          })
        }).catch(() => {})
    },
    search () {
      this.listQuery.offset = 1
      this.fetchData()
    },
    seePage (val) {
      this.listQuery.offset = val
      this.fetchData()
    },
    // 删除数据
    delCardInfo () {
      Dialog.confirm({
        title: '提示',
        message: '确定要删除？'
      })
        .then((res) => {
          let arr = []
          arr.push(this.row.id)
          httpDelete(AIMember, {ids: arr, departmentId: this.$store.getters.departmentId})
            .then((res) => {
              Toast.success('删除成功')
              this.show = false
              this.fetchData()
            }).catch(() => {})
        }).catch(() => {})
    },
    // 取数据
    fetchData () {
      httpGet(usersAIManage, this.listQuery)
        .then(res => {
          if (res.data.rows === null) {
            this.userData = []
            this.total = 0
            this.noSee = true
          } else {
            this.userData = res.data.rows
            this.total = res.data.total
            this.noSee = false
          }
          console.log(res)
        }).catch(() => {
        })
    },
    // 下拉刷新，取数据
    onRefresh () {
      setTimeout(() => {
        this.fetchData()
        Toast('刷新成功')
        this.isLoading = false
      }, 500)
    },
    // 操作按钮
    edit (item) {
      this.show = true
      this.row = item
      this.mark = checkStatusFormatter(item.isCheck)
    },
    // 触碰蒙层
    disMask () {
      this.isMask = false
      this.isSwiper = false
      this.$refs.fax.style.position = ''
    },
    cannel () {
      this.isMask = false
      this.isSwiper = false
      this.$refs.fax.style.position = ''
    },
    // 用户信息编辑
    editContent () {
      this.isSwiper = true
      this.show = false
      this.isMask = true
      this.$refs.fax.style.position = 'fixed'
      this.doot = JSON.parse(JSON.stringify(this.row))
    },
    // 编辑内容后更新
    update () {
      this.updateLoading = true
      const updateFormData = Object.assign({departmentId: this.$store.getters.departmentId}, this.doot)
      httpPut(AIMember, updateFormData)
        .then(res => {
          this.updateLoading = false
          this.fetchData()
          this.isMask = false
          this.isSwiper = false
          Toast.success(res.message)
        }).catch(() => {
          this.updateLoading = false
        })
      this.$refs.fax.style.position = ''
    },
    // 验证手机号
    checkPsd () {
      const phonePsd = this.doot.phone
      var reg = /^1[123456789]\d{9}$/
      if (phonePsd === '') {
        Toast('手机号码不可为空！')
        this.$refs.inphone.focus()
      } else if (!reg.test(phonePsd)) {
        Toast('手机号码格式不正确')
        this.$refs.inphone.focus()
        // this.doot.phone = ''
      } else {
      }
    },
    // 验证地址
    checkAdd () {
      if (this.$refs.addr.value === '') {
        Toast('地址不可为空！')
      }
    },
    // 查看图片
    searchPic () {
      httpPost(seeAIMemberPhoto + this.row.id)
        .then(res => {
          if (res.data !== null) {
            Toast('获取图片成功')
            this.dialogPhotoVisible = true
            this.$nextTick(() => {
              this.fileData.photo = res.data.photo
              this.imgUrl = 'data:image/jpg;base64,' + res.data.file
            })
          } else {
            this.dialogPhotoVisible = true
            this.fileData.photo = ''
            Toast.fail('图片获取失败')
          }
        }).catch((err) => {
          console.log(err)
        })
    },
    onConfirmtime (value, index) {
      this.timelimit = value
      this.showtime = false
    }
  },
  components: {
    NavBar,
    Toast,
    Button,
    PullRefresh,
    Dialog,
    Cell,
    Field,
    CellGroup,
    'van-row': Row,
    'van-col': Col,
    Icon,
    Popup,
    Search,
    RadioGroup,
    Radio,
    Pagination,
    Picker,
    DatetimePicker
  },
  created () {
    this.fetchData()
    if (this.$route.query.setOne) {
      console.log(this.$route.query.setOne)
      this.listQuery.isCheck = 2
      this.fetchData()
    }
    this.filterArr()
  }
}
</script>
<style lang="scss" scoped>
.searchInput{
  /* margin-left:1vw; */
  /* width:32vw;
  display:inline-block */
}
.containe{
  width: 100vw;
  min-height: 100vh;
  background: rgb(238,238,238);
  .groupdiv{
  // border:1px solid #ccc;
  margin-bottom: 1.2rem;
}
}
select{
  width:6rem;
  height: 2rem;
  display: inline-block;
  outline: none;
  margin-top:0.8rem;
  margin-left: 0.3rem;
}
.btnEdit{
  width: 60vw;
  margin-left: 12.5vw;
  border-radius: 0.6rem
}
.imgStyle{
  max-width: 100vw;
  max-height: auto;
}
.searchInput{
  padding: 8px 15px;
  border-radius: 4px;
  border: 1px solid #DCDFE6;
}
.openGateRecord{
  position: fixed;
  bottom: 50px;
  width: 50vw;
  left: 50%;
  margin-left: -25vw;
  border-radius: 10px;
  z-index: 99
}
</style>
<style scoped>
#asd >>> .van-pagination__item--disabled, .van-pagination__item--disabled:active {
  color:red;
}

</style>

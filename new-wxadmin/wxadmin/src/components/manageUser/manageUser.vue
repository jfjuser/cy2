<template>
  <div class="wzs-div" style="background-color:rgb(238,238,238);min-height:100vh">
    <NavBar
      title="用户列表"
      left-text="返回"
      right-text="添加"
      left-arrow
      @click-right="onAdd"
      @click-left="onClickLeft"
    />
    <PullRefresh v-model="isLoading" @refresh="onRefresh">
      <div style="width:100vw;margin:0rem 0 0 0vw;">
        <div v-for="(item, index) in userData" :key=index>
          <CellGroup class="groupdiv">
            <Cell title="姓名" :value="item.userName" />
            <Cell title="性别" :value="sexFormatter1(item.sex)" />
            <Cell title="账户关系" :value="relationshipFormatter(item.relationship)" />
            <Cell title="校验码" :value="item.idCard"/>
            <Cell title="韦根号" v-if="openType === 1" :value="item.wiegandCard"/>
            <Cell title="手机号" :value="item.phone" />
             <Cell title="IC卡号" :value="item.accessCardId" />
            <!-- <Cell :title="themeType === 1 ? '详细地址' : '地址'" :value="item.addr" /> -->
            <Cell title="工种" v-if="themeType === 5" :value="item.workType" />
            <Cell title="类型" :value="personFormatter(item.type)"/>
            <Cell title="审核状态" :value="checkStatusFormatter(item.isCheck)" />
            <Cell title="同步消息" :value="item.aiPower" />
            <Cell title="有效日期" :value="timeFormatter(item.endTime)" />
            <Cell title="备注消息" :value="item.remarks"/>
            <span style="display:block;line-height:2.5rem;color:#1E90FF;margin-left:86%;" @click="showin(item,index)">操作</span>
          </CellGroup>
        </div>
      </div>
        <div style="width:100%;height:22rem;text-align:center" v-show="imgShow">
            <img src="@/assets/noData (2).png" style="max-width:300px;max-height:300px"/>
        </div>
      </PullRefresh>
      <Popup v-model="dialogPhotoVisible" position=top style="width:90vw;height:60vh">
        <div style="text-align:center">
          <img :src="imgUrl" style="max-height: 400px;max-width: 300px" />
        </div>
      </Popup>
      <Popup v-model="show" position="bottom">
          <!-- <span style="margin-left:90%;display:inline-block;line-height:1rem;" @click="closeDiv"><van-icon name="cross" size="1.5rem" style="margin-top:0.5rem"/></span> -->
          <Button size="large" @click="delInfo">删除</Button>
          <Button size="large" @click="editUser">编辑</Button>
          <Button size="large" @click="seePic">查看图片</Button>
          <Button size="large" @click="ishasCheck" v-show="itemAll.isCheck === 2">审核</Button>
          <Button size="large" @click="show = false">取消</Button>
      </Popup>

      <Popup v-model="hasCheck" position=top style="width:96vw;padding-bottom:5%">
        <label style="width:20vw;margin-left:40vw;line-height:2rem">成员审核</label>
        <div style="background-color: #fffbe8;color:#ed6a0c;font-size: 14px;padding:10px;" v-if="itemAll.type === 0">选择‘其他’可自定义时长，但必须填写数字，且以月为单位计算</div>
        <Cell required title="授权时长" v-if="itemAll.type === 0" :value="timelimit.valueName" @click="showtime = true"/>
        <Field required placeholder="请输入自定义时长" type="number" v-model="customTime" v-if="timelimit.valueNo && timelimit.valueNo==5"><div slot="button">个月</div></Field>
        <Cell title="审核状态" :border="false"/>
        <RadioGroup v-model="handleCheck">
          <Radio :name= 0 style="display:inline-block;margin-left:20%;line-height:40px">审核失败</Radio>
          <Radio :name= 1 style="display:inline-block;margin-left:10%;line-height:40px">审核成功</Radio>
        </RadioGroup>
        <Cell title="分配通道" v-if="itemAll && itemAll.type === 1 && handleCheck=='1'" :value="localVal==''?'请选择':localVal" @click="showlocal = true" :border="false" />
        <div style="margin-top:15px;display: flex;justify-content: space-around;">
          <Button @click="cancelCheck" style="width:20vw;border-radius:8px;">取消</Button>
          <Button @click="finishedCheck" style="width:20vw;border-radius:8px;" type="info">确定</Button>
        </div>
      </Popup>
      <Popup v-model="editDialog" position=top style="height:35rem;width:96vw;">
        <Cell title="编辑成员"/>
        <Field
          v-model="clone.userName"
          required
          clearable
          label="姓名"
          @blur="checkName"
          placeholder="请输入姓名"
          :error-message="validator.name"
        />
        <Field label="性别" required disabled :border="false"/>
          <RadioGroup v-model="clone.sex" style="border-bottom:1px solid #ebedf0;margin-left:1rem;">
            <Radio v-for="(option, index) in sexArr" style="line-height:2.5rem;display:inline-block;margin-left:4rem" :key=index :name="option.id">{{option.name}}</Radio>
          </RadioGroup>
        <Cell @click="showRelation = true">
          <template slot="title">
            <span>账户关系</span>
            <span style="margin-left:10%;">{{relationVal}}</span>
          </template>
        </Cell>
        <Field
          v-model="clone.idCard"
          :label="themeType === 1 ? '校验码' : (themeType === 2? '工号' : (themeType === 3? '学号' : (themeType === 4? '校验码' : '身份证号')))"
          :disabled="themeType === 1 || themeType === 4 ? true: false"
        />
        <Field
          v-model="clone.accessCardId"
          label="IC卡号"
          placeholder="请输入IC卡号（非必填）"
        />
        <Field
          v-model="clone.wiegandCard"
          required
          clearable
          v-if="openType === 1"
          label="韦根卡号"
          @blur="checkCard"
          placeholder="请输入韦根卡号"
          :error-message="validator.card"
        />
        <Field
          v-model="clone.phone"
          required
          clearable
          label="手机号"
          placeholder="请输入手机号"
          @blur="checkPhone"
          :error-message="validator.phone"
        />
        <!-- <Field
          v-model="clone.addr"
          required
          clearable
          :label="themeType === 1 ? '详细地址' : '地址'"
          @blur="checkAddr"
          :error-message="validator.addr"
          placeholder="请输入用户地址"
        /> -->
        <div v-show="themeType === 5">
          <Cell title="工种"/>
            <RadioGroup v-model="clone.workType">
              <Radio v-for="(option, index) in typeList" style="line-height:2rem;display:inline-block;margin-left:4rem" :key=index :name="option.workName">{{option.workName}}</Radio>
            </RadioGroup>
        </div>
        <!-- ----------- -->
        <Field
          v-show="clone.type === 1"
          v-model="clone.beginTime"
          required
          clearable
          @focus="isStart = true"
          label="开始日期"
          placeholder="开始日期不可为空"
        />
        <DatetimePicker
          v-model="currentDate"
          v-show="isStart"
          @cancel="isStart = false"
          @confirm="getValue"
          type="datetime"
        />
        <Field
          v-show="clone.type === 1"
          v-model="clone.endTime"
          @focus="isEnd = true"
          required
          clearable
          label="结束日期"
          placeholder="结束日期不可为空"
        />
        <DatetimePicker
          v-model="currentDate"
          v-show="isEnd"
          @cancel="isEnd = false"
          @confirm="getEndValue"
          type="datetime"
        />
        <!-- -------------- -->
        <Field
          v-model="clone.remarks"
          clearable
          label="备注消息"
          placeholder="请输入备注消息"
        />
          <Button @click="closeDialog" style="width:70vw;margin:25px 0 0 15vw;">取消</Button>
          <Button @click="updateInfo" style="width:70vw;margin:15px 0 0 15vw;" type="info">确定</Button>
      </Popup>
      <div v-show="!imgShow" id="asd" style="margin:1.5rem 0 0rem 0">
          <Pagination
            v-model="listQuery.offset"
            :page-count="Math.ceil(total/10)"
            :total-items = 'total'
            mode="simple"
            @change="seePage"
          >
          </Pagination>
      </div>
      <Popup v-model="showtime" position="bottom" :close-on-click-overlay="false">
        <Picker
          :columns="timekinds"
          show-toolbar
          value-key="valueName"
          @cancel="showtime = false"
          @confirm="onConfirmtime"
        />
      </Popup>
      <Popup v-model="showRelation" position="bottom" :close-on-click-overlay="false">
        <Picker
          :columns="relationshipSelect"
          show-toolbar
          value-key="relationshipName"
          @cancel="showRelation = false"
          @confirm="onConfirmRelation"
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
import { getAIMember, AIInOutTime, addTypeUser, checkAIMemeber, AIMember, seeAIMemberPhoto, getAccountCamera } from '@/api/url'
import { httpGet, httpPut, httpDelete, httpPost } from '@/utils/restful'
import { checkStatusFormatter, timeFormatter, personFormatter, sexFormatter1, relationshipFormatter } from '@/utils/formatter'
import { NavBar, DatetimePicker, Row, Col, Field, CellGroup, Dialog, Cell, PullRefresh, RadioGroup, Radio, Popup, Button, Pagination, Toast, Picker } from 'vant'
export default {
  name: 'manageUser',
  components: {
    NavBar,
    CellGroup,
    Cell,
    PullRefresh,
    Pagination,
    Popup,
    Button,
    Field,
    DatetimePicker,
    Row,
    RadioGroup,
    Radio,
    'van-col': Col,
    Picker
  },
  data () {
    return {
      checkStatusFormatter: checkStatusFormatter,
      sexFormatter1: sexFormatter1,
      timeFormatter: timeFormatter,
      personFormatter: personFormatter,
      dialogPhotoVisible: false,
      userData: [],
      typeList: [],
      themeType: undefined,
      handleCheck: undefined,
      hasCheck: false,
      clone: {
        userName: '',
        accessCardId: undefined,
        phone: undefined,
        photo: '',
        sex: '',
        workType: undefined,
        idCard: undefined,
        addr: '',
        type: '',
        wiegandCard: '',
        beginTime: null,
        endTime: null,
        remarks: undefined,
        relationship: ''
      },
      sexArr: [
        {
          id: 1,
          name: '男'
        },
        {
          id: 2,
          name: '女'
        }
      ],
      total: 0,
      currentDate: new Date(),
      isStart: false,
      isEnd: false,
      editDialog: false,
      openType: undefined,
      itemAll: '',
      imgUrl: '',
      fileData: {
        photo: ''
      },
      validator: {
        card: '',
        name: '',
        addr: '',
        phone: ''
      },
      show: false,
      imgShow: false,
      isLoading: false,
      listQuery: {
        offset: 1,
        limit: 5
      },
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
      relationshipFormatter: relationshipFormatter,
      relationshipSelect: [
        {
          relationshipType: 0,
          relationshipName: '夫妻'
        }, {
          relationshipType: 1,
          relationshipName: '父子'
        }, {
          relationshipType: 2,
          relationshipName: '父女'
        }, {
          relationshipType: 3,
          relationshipName: '叔侄'
        }, {
          relationshipType: 4,
          relationshipName: '其他'
        }
      ],
      showRelation: false,
      showlocal: false,
      localVal: '',
      channelId: undefined,
      channelArr: []
    }
  },
  computed: {
    relationVal () {
      if (this.clone.relationship === null || this.clone.relationship === undefined || this.clone.relationship === '') {
        return '请选择'
      }
      for (const v of this.relationshipSelect) {
        if (v.relationshipType === this.clone.relationship) {
          return v.relationshipName
        }
      }
    }
  },
  created () {
    this.fetchData()
    console.log(this.$route.params.rowId)
    this.addrPar = this.$route.params.addrPar
    if (this.$route.params.rowId !== undefined) {
      this.rowId = this.$route.params.rowId
      localStorage.setItem('rowId', this.rowId)
      this.listQuery = Object.assign(this.listQuery, {dutyCompanyId: this.rowId})
    } else {
      this.rowId = parseInt(localStorage.getItem('rowId'))
      this.listQuery = Object.assign(this.listQuery, {dutyCompanyId: this.rowId})
    }
    this.themeType = parseInt(localStorage.getItem('themeType'))
    this.open()
  },
  methods: {
    // 查看通道
    watchChannel () {
      httpGet(getAccountCamera + '/' + this.itemAll.dutyCompanyId).then(res => {
        if (res.data.length === 0) {
          Toast.fail('请先配置通道')
        } else {
          this.channelArr = res.data
        }
      }).catch(() => {})
    },
    ishasCheck () {
      // itemAll
      if (this.itemAll && this.itemAll.type === 1) {
        this.watchChannel()
      }
      this.hasCheck = true
      this.timelimit = this.timekinds[0]
      this.customTime = ''
    },
    onConfirmlocal (value, index) {
      this.channelId = value.id
      this.localVal = value.localName
      this.showlocal = false
    },
    open () {
      httpGet(AIInOutTime + '/list/' + this.$store.getters.departmentId)
        .then(res => {
          this.openType = res.data.openWigan
          this.addrType = res.data.addrType
          this.state = res.data.state
        }).catch(() => {})
    },
    fetchData () {
      httpGet(getAIMember, this.listQuery)
        .then((res) => {
          if (res.data.rows === null) {
            this.userData = []
            this.imgShow = true
          } else {
            this.total = res.data.total
            this.userData = res.data.rows
          }
        })
    },
    closeDialog () {
      this.editDialog = false
      this.show = false
    },
    cancelCheck () {
      this.hasCheck = false
      this.show = false
    },
    finishedCheck () {
      if (this.handleCheck === undefined) {
        Toast('请先选择审核的状态')
      } else {
        const data = {
          id: this.ids,
          isCheck: this.handleCheck,
          departmentId: this.$store.getters.departmentId,
          customTime: this.customTime,
          timelimit: this.timelimit.valueNo ? this.timelimit.valueNo : '',
          channelId: this.channelId
        }
        httpPut(checkAIMemeber, data).then((res) => {
          Toast({
            duration: 4 * 1000,
            type: 'success',
            message: res.message
          })
          this.fetchData()
        }).catch(() => {
        })
        this.hasCheck = false
        this.show = false
      }
    },
    editUser () {
      let xx = JSON.stringify(this.itemAll)
      this.clone = JSON.parse(xx)
      this.clone.beginTime = timeFormatter(this.clone.beginTime)
      this.clone.endTime = timeFormatter(this.clone.endTime)
      this.editDialog = true
      if (this.themeType === 5) {
        httpGet(addTypeUser + '/' + this.$store.getters.departmentId)
          .then((res) => {
            this.typeList = res.data
          }).catch((err) => {
            console.log(err)
          })
      }
    },
    updateInfo () {
      let yy = JSON.stringify(this.clone)
      let aa = JSON.parse(yy)
      if (aa.type === 1) {
        aa.beginTime = (this.clone.beginTime + '.000Z').replace(' ', 'T')
        aa.endTime = (this.clone.endTime + '.000Z').replace(' ', 'T')
      } else {
        aa.beginTime = null
        aa.endTime = null
      }
      let formTable = Object.assign(aa, {departmentId: this.$store.getters.departmentId})
      httpPut(AIMember, formTable)
        .then((res) => {
          console.log(res)
          Toast({
            type: 'success',
            message: res.message,
            duration: 4 * 1000
          })
          this.fetchData()
          this.editDialog = false
          this.show = false
        })
    },
    getValue (value) {
      this.clone.beginTime = timeFormatter(value)
      this.isStart = false
    },
    getEndValue (value) {
      this.clone.endTime = timeFormatter(value)
      this.isEnd = false
    },
    checkCard () {
      if (this.clone.wiegandCard === '') {
        this.validator.card = '韦根卡号不可为空'
      } else {
        this.validator.card = ''
      }
    },
    checkName () {
      if (this.clone.userName === '') {
        this.validator.name = '姓名不可为空'
      } else {
        this.validator.name = ''
      }
    },
    checkAddr () {
      if (this.clone.addr === '') {
        this.validator.addr = '地址不可为空'
      } else {
        this.validator.addr = ''
      }
    },
    checkPhone () {
      if (!(/^1[123456789]\d{9}$/.test(this.clone.phone))) {
        this.validator.phone = '请输入正确的手机号'
      } else {
        this.validator.phone = ''
      }
    },
    // 操作
    showin (item) {
      // console.log(item)
      this.itemAll = item
      this.show = true
      this.ids = item.id
    },
    seePage (val) {
      this.listQuery.offset = val
      this.fetchData()
    },
    onRefresh () {
      setTimeout(() => {
        this.fetchData()
        Toast('刷新成功')
        this.isLoading = false
      }, 500)
    },
    onClickLeft () {
      this.$router.push('/staffManage/')
    },
    seePic () {
      httpPost(seeAIMemberPhoto + this.ids)
        .then((res) => {
          if (res.data !== null) {
            this.dialogPhotoVisible = true
            // console.log(row)
            // this.rowId = row.id
            this.$nextTick(() => {
              this.fileData.photo = res.data.photo
              this.imgUrl = 'data:image/jpg;base64,' + res.data.file
            })
          } else {
            this.dialogPhotoVisible = true
            // this.rowId = row.id
            this.fileData.photo = ''
            Toast.fail('暂未获取到图片,请重新添加')
          }
        }).catch(() => {})
    },
    delInfo () {
      Dialog.confirm({
        message: '确认删除该用户信息吗？',
        title: '提示'
      })
        .then(() => {
          httpDelete(AIMember, {
            ids: [this.ids],
            departmentId: this.$store.getters.departmentId
          }).then((res) => {
            Toast({
              type: 'success',
              message: res.message,
              duration: 4 * 1000
            })
            this.show = false
            this.fetchData()
          }).catch(() => {})
        }).catch(() => {
          this.show = false
        })
    },
    onAdd () {
      this.$router.push({
        name: 'addFace',
        params: {
          rowId: this.rowId,
          addrPar: this.addrPar,
          openType: this.openType,
          addrType: this.addrType
        }
      })
    },
    onConfirmtime (value, index) {
      this.timelimit = value
      this.showtime = false
    },
    onConfirmRelation (value, index) {
      // this.relationVal = value.relationshipName
      this.clone.relationship = value.relationshipType
      this.showRelation = false
    }
  }
}
</script>
<style lang="scss" scoped>
.groupdiv{
    margin-top: 1rem
}
.imgStyle{
  max-width: 100vw;
  max-height: auto;
}
</style>
<style scoped>
#asd >>> .van-pagination__item--disabled, .van-pagination__item--disabled:active {
  color:rgb(14,105,254)
}
</style>

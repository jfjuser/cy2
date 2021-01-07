<template>
  <div class="container">
    <div style="">
      <NavBar title="添加账户" left-text="返回" left-arrow @click-left="onClickLeft"/>
      <van-cell-group style="padding-left:0.5rem;">
        <van-field
          v-show="themeType === 5"
          v-model="form.teamName"
          label="班组名称"
          required
          clearable
          class="fi"
          placeholder="请输入班组名称"
          :error-message="err.teamName"
          @blur="checkClass"
        />
        <van-field
          v-model="form.leader"
          required
          clearable
          :label="themeType === 1? '业主姓名': (themeType === 2? '部门名称' : (themeType === 3? '班级名称' : (themeType === 4? '账户名称' : '带班名称')))"
          placeholder="请输入名称"
          class="fi"
          :error-message="err.username"
          @blur="checkUser"
        />
        <van-field
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
        <van-field required clearable label="通道名称" class="fi" disabled :border="false"/>
        <div>
          <CheckboxGroup v-model="form.aiTokenIds">
            <Checkbox v-for="(item, index) in cameraList" :key=index :name="item.id" style="margin-left:2.5rem;line-height:2.5rem;display:inline-block;font-size:0.75rem">{{item.localName}}</Checkbox>
          </CheckboxGroup>
          <Radio disabled v-if="total == 0" style="line-height:2rem;margin-left:1rem">暂无相机可选择</Radio>
        </div>
        <van-field required v-show="state !== -1" clearable label="时段设置" class="fi" disabled/>
        <div>
          <CheckboxGroup v-model="form.timeLimits">
            <Checkbox :border='false' v-for="(item, index) in timeList" :key=index :name="item.num" style="margin-left:2.5rem;line-height:2.5rem;display:inline-block;font-size:0.75rem">{{item.name}}</Checkbox>
          </CheckboxGroup>
        </div>
        <van-field
          required
          clearable
          label="审核方式"
          class="fi"
          disabled
          :border="false"
        />
        <RadioGroup v-model="form.isCheck" style="margin-left:1rem;line-height:2rem;">
          <Radio :name="0" style="font-size:0.85rem;margin-left:1.5rem">人工审核</Radio>
          <Radio :name="1" style="font-size:0.85rem;margin-left:1.5rem">自动审核</Radio>
        </RadioGroup>
        <van-field
          required
          clearable
          label="微信推送"
          class="fi"
          disabled
          :border="false"
        />
        <RadioGroup v-model="form.openPush" style="margin-left:1rem;line-height:2rem;">
          <Radio :name="0" style="font-size:0.85rem;margin-left:1.5rem">关闭</Radio>
          <Radio :name="1" style="font-size:0.85rem;margin-left:1.5rem">开启</Radio>
        </RadioGroup>
        <van-field
          v-model="form.phone"
          required
          clearable
          ref="phone"
          label="手机号"
          placeholder="请输入手机号"
          error-message="备注：手机号为人脸智能识别小程序的登录账号！"
          style="font-size:0.75rem;line-height:1.5rem"
          @blur="checkPhone"
        />
        <van-field
          v-model="form.addr"
          v-if="addrType === 0"
          required
          clearable
          label="用户地址"
          placeholder="请输入用户地址"
          :error-message="err.addr"
          ref="addr"
          class="fi"
          @blur="checkAddr"
        />
        <template v-if="addrType === 1">
        <van-field
          v-model="form.floorNum"
          required
          label="地址-单元"
          placeholder="请选择"
          class="fi"
          readonly
          @click="isfloorNum = true"
        />
        <Popup v-model="isfloorNum" position="bottom" :close-on-click-overlay="false">
          <Picker
            show-toolbar
            :columns="unitArr"
            @cancel="isfloorNum = false"
            @confirm="onConfirmFloorNum"
          />
        </Popup>
        <van-field
          v-model="floor"
          required
          label="地址-层"
          placeholder="请选择"
          class="fi"
          readonly
          @click="showfloor"
        />
        <Popup v-model="isfloor" position="bottom" :close-on-click-overlay="false" :loading="floorLoading">
          <Picker
            show-toolbar
            :columns="floorArr"
            @cancel="isfloor = false"
            @confirm="onConfirmFloor"
          />
        </Popup>
         <van-field
          v-model="form.roomNum"
          required
          label="地址-房号"
          placeholder="请选择"
          class="fi"
          readonly
          @click="getRoom"
        />
        <Popup v-model="isroomNum" position="bottom" :close-on-click-overlay="false" :loading="roomLoading">
          <Picker
            show-toolbar
            :columns="roomArr"
            @cancel="isroomNum = false"
            @confirm="onConfirmRoomNum"
          />
        </Popup>
        </template>
        <van-field
          v-model="form.userNum"
          required
          clearable
          :label="themeType === 5? '非访客人数' : '家庭人数'"
          placeholder="请输入成员人数"
          :error-message="err.userNum"
          class="fi"
          @change="checkFa"
        />
        <!-- <van-field
          v-model="form.visitorNum"
          required
          :error-message="err.visitorNum"
          clearable
          label="访客人数"
          placeholder="请输入访客人数"
          class="fi"
          @change="checkVis"
        /> -->
        <Button
          type="info"
          style="width:70vw;margin-left:15vw;border-radius:12px;margin-top:10%;margin-bottom:2rem;"
          @click="addSave"
          :isLoading="loadingIcon"
        >保存</Button>
      </van-cell-group>
    </div>
  </div>
</template>
<script>
import { httpPost, httpGet } from '@/utils/restful.js'
import { AiDuyCompany, checkAICamera, AIInOutTime, showBuilding, showFloor, showRoom } from '@/api/url.js'
import { Field, Button, Toast, Icon, RadioGroup, Radio, Checkbox, CheckboxGroup, NavBar, Cell, CellGroup, Popup, Picker } from 'vant'
export default {
  name: 'addUser',
  data () {
    return {
      radio: '0',
      total: undefined,
      checked: true,
      themeType: undefined,
      loadingIcon: false,
      cameraList: [],
      timeList: [],
      addrType: undefined,
      state: 0,
      err: {
        teamName: '',
        username: '',
        userNum: '',
        visitorNum: ''
      },
      form: {
        id: undefined,
        teamName: undefined,
        leader: undefined,
        aiTokenIds: [],
        isCheck: 0,
        sex: undefined,
        phone: undefined,
        addr: undefined,
        floorNum: undefined,
        roomNum: undefined,
        userNum: undefined,
        openPush: 1,
        // visitorNum: undefined,
        timeLimits: []
      },
      floor: '',
      unitArr: [],
      isfloorNum: false,
      floorArr: [],
      floorLoading: false,
      isfloor: false,
      roomArr: [],
      isroomNum: false,
      roomLoading: false
    }
  },
  created () {
    this.themeType = parseInt(localStorage.getItem('themeType'))
    this.getCameraList()
    this.getTimeList()
  },
  methods: {
    onClickLeft () {
      this.$router.push('/staffManage/')
    },
    // 获取时段
    getTimeList () {
      httpGet(AIInOutTime + '/list/' + this.$store.getters.departmentId)
        .then(res => {
          this.timeList = res.data.data
          this.addrType = res.data.addrType
          this.openType = res.data.openWigan
          if (res.data.addrType === 1) {
            this.getUnit()
          }
        }).catch(() => {})
    },
    getCameraList () {
      httpGet(checkAICamera + this.$store.getters.departmentId)
        .then((res) => {
          if (res.data === null) {
            this.total = 0
            this.cameraList = []
          } else {
            this.cameraList = res.data
            this.total = 1
          }
        }).catch(() => {})
    },
    //  验证
    checkUser () {
      if (this.form.leader === undefined || this.form.leader === '') {
        this.err.username = '用户名不可为空'
      } else {
        this.err.username = ''
      }
    },
    checkClass () {
      if (this.form.teamName === undefined || this.form.teamName === '') {
        this.err.teamName = '班组名称不可为空'
      } else {
        this.err.teamName = ''
      }
    },
    checkAddr () {
      if (this.form.addr === undefined) {
        this.err.addr = '地址不可为空'
      } else {
        this.err.addr = ''
      }
    },
    checkAddr1 () {
      if (!(/^[a-zA-Z0-9]{1,}$/.test(this.form.floorNum))) {
        Toast.fail('请输入数字或字母！')
      }
    },
    checkFa () {
      if (this.form.userNum < 0 || this.form.userNum % 1 !== 0) {
        this.err.userNum = '成员人数填写有误'
      } else {
        this.err.userNum = ''
      }
    },
    checkVis () {
      if (this.form.visitorNum % 1 !== 0 || this.form.userNum < 0) {
        this.err.visitorNum = '访问人数不合法!'
      } else {
        this.err.visitorNum = ''
      }
    },
    checkPhone () {
      var reg = /^1[123456789]\d{9}$/
      if (this.form.phone === undefined) {
        Toast('手机号码不可为空!')
        this.$refs.phone.focus()
      } else if (this.form.phone !== undefined && !reg.test(this.form.phone)) {
        Toast('手机号码格式不正确')
        this.$refs.phone.focus()
        this.form.phone = ''
      }
    },
    // 添加用户
    addSave () {
      this.loadingIcon = true
      this.form = Object.assign(this.form, {
        departmentId: this.$store.getters.departmentId
      })
      httpPost(AiDuyCompany, this.form)
        .then(res => {
          this.loadingIcon = false
          this.$router.push('/staffManage/')
          Toast.success(res.message)
        })
        .catch(() => {
          this.loadingIcon = false
        })
    },
    compact (arr) {
      return arr.filter(Boolean)
    },
    getUnit () {
      if (this.addrType === 1) {
        httpGet(showBuilding + '/' + this.$store.getters.departmentId).then((res) => {
          if (res.data.length > 0) {
            this.unitArr = this.compact(res.data)
          } else {
            this.unitArr = []
          }
        }).catch(() => { this.unitArr = [] })
      }
    },
    // 根据单元生成楼层
    showfloor () {
      this.isfloor = true
      this.floorLoading = true
      httpGet(showFloor, {
        buildingName: this.form.floorNum,
        departmentId: this.$store.getters.departmentId
      }).then((res) => {
        if (res.data.length > 0) {
          this.floorArr = res.data
        } else {
          this.floorArr = []
        }
        this.floorLoading = false
      }).catch(() => {
        this.floorArr = []
        this.floorLoading = false
      })
    },
    // 根据楼层获取房间号
    getRoom () {
      this.isroomNum = true
      this.roomLoading = true
      httpGet(showRoom, {
        buildingName: this.form.floorNum,
        departmentId: this.$store.getters.departmentId,
        floorNumber: this.floor
      }).then((res) => {
        if (res.data.length > 0) {
          this.roomArr = res.data
        } else {
          this.roomArr = []
        }
        this.roomLoading = false
      }).catch(() => {
        this.roomArr = []
        this.roomLoading = false
      })
    },
    onConfirmFloorNum (value, index) {
      if (this.unitArr.length === 0) return
      if (this.form.floorNum === value) {
        this.form.floorNum = value
        this.floor = ''
      }
      this.form.floorNum = value
      this.isfloorNum = false
    },
    onConfirmFloor (value, index) {
      if (this.floorArr.length === 0) return
      if (this.floor !== value) {
        this.floor = value
        this.form.roomNum = ''
      }
      this.isfloor = false
    },
    onConfirmRoomNum (value, index) {
      if (this.roomArr.length === 0) return
      this.form.roomNum = value
      this.isroomNum = false
    }
  },
  components: {
    'van-field': Field,
    Button,
    'van-icon': Icon,
    Cell,
    'van-cell-group': CellGroup,
    NavBar,
    Toast,
    RadioGroup,
    Radio,
    Checkbox,
    CheckboxGroup,
    Popup,
    Picker
  }
}
</script>
<style lang="scss" scoped>
.container {
  background: url(../../assets/bind-back.jpg);
  background-size: cover;
  height: auto;
  // overflow: hidden;
}
.fi {
  line-height: 1.5rem;
  font-size: 0.85rem;
}
</style>

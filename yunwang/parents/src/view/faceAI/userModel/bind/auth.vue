<template>
  <div>
    <group title="申请信息">
      <x-input style="font-size:.875rem;" title="姓名" :max="20" required placeholder-align="right"  text-align="right" v-model="form.leader" placeholder="请输入姓名" :show-clear="false"></x-input>
      <cell>
        <checker v-model="form.sex" default-item-class="item" selected-item-class="item-selected" :radio-required="true">
          <checker-item value="1">男</checker-item>
          <checker-item value="2">女</checker-item>
        </checker>
      </cell>
      <template v-if="addrType == 0">
        <x-input style="font-size:.875rem;" title="楼栋号或房号" :max="64" required placeholder-align="right"  text-align="right" v-model="form.addr" placeholder="请输入楼栋号/房号" :show-clear="false"></x-input>
      </template>
      <template v-if="addrType == 1">
        <!-- <x-input style="font-size:.875rem;" title="楼层" :max="10" required placeholder-align="right"  text-align="right" v-model="form.floorNum" placeholder="请输入楼层" :show-clear="false"></x-input>
        <x-input style="font-size:.875rem;" title="房间号" :max="10" required placeholder-align="right"  text-align="right" v-model="form.roomNum" placeholder="请输入房间号" :show-clear="false"></x-input> -->
        <popup-picker style="font-size:.875rem;" :data="unitArr" title="单元" v-model="floorNum" @on-change="onConfirmFloorNum" placeholder="请选择" :popup-style="{'min-height':'10rem'}"></popup-picker>
        <popup-picker style="font-size:.875rem;" :data="floorArr" title="楼层" v-model="floor" @on-change="onConfirmFloor" placeholder="请选择" :popup-style="{'min-height':'10rem'}"></popup-picker>
        <popup-picker style="font-size:.875rem;" :data="roomArr" title="房间号" v-model="roomNum" @on-change="onConfirmRoomNum" placeholder="请选择" :popup-style="{'min-height':'10rem'}"></popup-picker>
      </template>
      <cell>
        <checker v-model="form.tenant" default-item-class="item" selected-item-class="item-selected" :radio-required="true">
          <checker-item value="0">业主</checker-item>
          <checker-item value="1">租户</checker-item>
        </checker>
      </cell>
      <x-number style="font-size:.875rem;" :min="1" :max="999" :fillable="true" title="家庭人数" required placeholder-align="right"  text-align="right" v-model="form.userNum" placeholder="请输入家庭人数"></x-number>
    </group>
    <group title="账号设置" style="padding-top: 50px">
      <x-input style="font-size:.875rem;" title="手机号" name="phone" type='tel' is-type="china-mobile" mask="99999999999" :max="11" required placeholder-align="right"  text-align="right" v-model="form.phone" placeholder="请输入手机号" :show-clear="false"></x-input>
      <x-input style="font-size:.875rem;" title="登录密码" type='password' :min="6" :max="12" required placeholder-align="right"  text-align="right" v-model="form.psw" placeholder="请输入登录密码" :show-clear="false"></x-input>
    </group>
    <div class="box-tip">该账号用于人脸资料上传登录时使用</div>
    <x-button class="box-submit" @click.native.prevent="handleSubmit()" type="primary" :show-loading="createLoading">提交</x-button>
  </div>
</template>
<script>
import { registerAccount, faceAICheckType, showBuilding, showFloor, showRoom } from '@/api/url.js'
import { httpGet, httpPost } from '@/utils/restful.js'
import { XInput, XNumber, Group, Checker, CheckerItem, Cell, XButton, PopupPicker } from 'vux'
import { getWxInfo, getDepInfo } from '@/utils/userInfo.js'
import { formatterTime2 } from '@/utils/formatter.js'
export default {
  components: {
    XInput,
    XNumber,
    Group,
    Checker,
    CheckerItem,
    Cell,
    XButton,
    PopupPicker
  },
  data () {
    return {
      createLoading: false,
      formatterTime2: formatterTime2,
      form: {
        departmentId: getDepInfo().departmentId,
        leader: '',
        sex: '1',
        phone: '',
        addr: '',
        floorNum: '',
        roomNum: '',
        tenant: '0',
        loginName: '',
        psw: '',
        userNum: 1,
        account: getWxInfo().account,
        openId: getWxInfo().unicode
      },
      addrType: 0,
      floorNum: [],
      floor: [],
      roomNum: [],
      unitArr: [],
      floorArr: [],
      roomArr: []
    }
  },
  mounted () {
    this.loadCheckType()
  },
  methods: {
    compact (arr) {
      return arr.filter(Boolean)
    },
    // 获取单元
    getUnit () {
      httpGet(showBuilding + '/' + getDepInfo().departmentId).then((res) => {
        if (res.data.length > 0) {
          this.unitArr = [this.compact(res.data)]
        } else {
          this.unitArr = []
        }
      }).catch(() => { this.unitArr = [] })
    },
    // 根据单元生成楼层
    showfloor () {
      httpGet(showFloor, {
        buildingName: this.form.floorNum,
        departmentId: getDepInfo().departmentId
      }).then((res) => {
        if (res.data.length > 0) {
          this.floorArr = [res.data]
        } else {
          this.floorArr = []
        }
      }).catch(() => { this.floorArr = [] })
    },
    // 根据楼层获取房间号
    getRoom () {
      httpGet(showRoom, {
        buildingName: this.form.floorNum,
        departmentId: getDepInfo().departmentId,
        floorNumber: this.floor[0]
      }).then((res) => {
        if (res.data.length > 0) {
          this.roomArr = [res.data]
        } else {
          this.roomArr = []
        }
      }).catch(() => { this.roomArr = [] })
    },
    onConfirmFloorNum (val) {
      if (val.length === 0) return
      // console.log('onConfirmFloorNum', val)
      if (this.form.floorNum !== val[0]) {
        this.floor = []
        this.form.roomNum = ''
        this.roomNum = []
      }
      this.form.floorNum = val[0]
      this.showfloor()
    },
    onConfirmFloor (val) {
      if (val.length === 0) return
      // console.log('onConfirmFloor', val)
      if (this.form.roomNum !== val[0]) {
        this.form.roomNum = ''
        this.roomNum = []
      }
      this.getRoom()
    },
    onConfirmRoomNum (val) {
      if (val.length === 0) return
      // console.log('onConfirmRoomNum', val)
      this.form.roomNum = val[0]
    },
    loadCheckType () {
      httpGet(faceAICheckType + getDepInfo().departmentId).then(res => {
        this.addrType = res.data.addrType
        if (Number(res.data.addrType) === 1) {
          this.getUnit()
        }
      }).catch(() => {})
    },
    handleSubmit () {
      if (!this.createLoading) {
        console.log(this.formatterTime2(new Date().valueOf()))
        if (Number(this.addrType) === 1) {
          if (this.form.floorNum === '') {
            this.$vux.toast.text('请选择单元', 'bottom')
            return
          }
          if (this.form.roomNum === '') {
            this.$vux.toast.text('请选择房间号', 'bottom')
            return
          }
        }

        if (this.form.leader === '') {
          this.$vux.toast.text('姓名不可为空', 'bottom')
        } else if (this.form.phone === '') {
          this.$vux.toast.text('手机号不可为空', 'bottom')
        } else if (this.form.psw === '') {
          this.$vux.toast.text('密码不可为空', 'bottom')
        } else {
          this.createLoading = true
          let params = Object.assign({}, this.form)
          params.sex = Number(params.sex)
          params.tenant = Number(params.tenant)
          params.loginName = params.phone
          console.log(this.formatterTime2(new Date().valueOf()))
          httpPost(registerAccount, params).then(res => {
            this.$vux.toast.text('提交成功，等待后台审核', 'bottom')
            this.$router.push({path: '/faceAI/userModel/'})
          }).catch(err => {
            let self = this
            setTimeout(function () {
              self.createLoading = false
            }, 300)
            console.log(this.formatterTime2(new Date().valueOf()))
            this.$vux.toast.text(err, 'bottom')
          })
        }
      }
    }
  }
}
</script>
<style lang='scss' scoped>
.item {
  width: 100px;
  height: 26px;
  line-height: 26px;
  text-align: center;
  border-radius: 3px;
  border: 1px solid #ccc;
  background-color: #fff;
  margin-right: 6px;
}
.item-selected {
  background: #ffffff url(./../../../../assets/icon/icon_select_blue.png) no-repeat right bottom;
  border-color: #b3d8ff;
}
.box-submit {
  width: 80%;
}
.box-tip {
  font-size: .875rem;
  color: rgb(85, 85, 85);
  margin-bottom: 2rem;
}
</style>

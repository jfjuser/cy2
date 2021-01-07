<template>
  <div>
    <div class="box text-c" v-if="isscan">
      <van-button round type="info" icon="scan" class="scan" @click="scaning"></van-button>
      <div class="fc-grey describe">
        <p>扫一扫设备上的二维码进行绑定</p>
      </div>
    </div>
    <template v-else>
      <van-steps :active="active" v-if="type !== 'add'">
        <van-step>注册账号</van-step>
        <van-step>绑定设备</van-step>
        <van-step>填写信息</van-step>
      </van-steps>
      <div class="info">
        <div class="title">请填写设备信息</div>
        <van-cell-group>
          <van-field label="MAC地址" v-model.trim="form.mac" @blur.prevent="onblurForWX" disabled />
          <van-field
            placeholder="请输入通道名称"
            label="通道名称"
            v-model.trim="form.localName"
            @blur.prevent="onblurForWX"
          />
          <van-cell title="出入口状态" is-link :value="typeval" @click="showPicker = true" />
        </van-cell-group>
      </div>
      <div class="btnbox">
        <van-button block class="btn mar-b-15" @click="isscan = true">重新扫一扫</van-button>
        <van-button
          type="info"
          block
          class="btn"
          v-if="type === 'add'"
          @click="openPopup"
          :loading="addloading"
        >添加</van-button>
        <van-button type="info" block class="btn" @click="next" v-else>下一步</van-button>
      </div>
    </template>
    <van-popup v-model="showPicker" position="bottom" safe-area-inset-bottom>
      <van-picker
        show-toolbar
        :columns="columns"
        value-key="value"
        @cancel="showPicker = false"
        @confirm="onConfirm"
      />
    </van-popup>
    <van-popup v-model="showPopup">
      <div class="chooseDepartment">请选择部门进行通道授权</div>
      <van-checkbox-group v-model="departmentChooseList">
  <van-cell-group>
    <van-cell
      v-for="(item, index) in departmentList"
      clickable
      style="width:80vw"
      :key="item.id"
      :title="`${item.leader}`"
      @click="toggle(index)"
    ><template #right-icon>
        <van-checkbox :name="item" ref="checkboxes" />
      </template>
    </van-cell>
  </van-cell-group>
</van-checkbox-group>
<div class="addSubmit">
<van-button type="default" @click="showPopup = false">取消</van-button>
<van-button type="info" @click="addSubmit">确认</van-button>
</div>
</van-popup>
  </div>
</template>

<script>
import wx from 'weixin-js-sdk'
import { Picker, Step, Steps, Popup, Cell, CellGroup, Checkbox, CheckboxGroup } from 'vant'
import { getParam } from '@/utils/formatter'
import { AIBindCamera, sweep, determineTheCamera } from '@/api/url'
import isOS from '@/utils/isOS'
import onblurMixin from '@/mixin/onblurMixin'
export default {
  mixins: [onblurMixin],
  components: {
    [Picker.name]: Picker,
    [Step.name]: Step,
    [Steps.name]: Steps,
    vanPopup: Popup,
    vanCell: Cell,
    vanCellGroup: CellGroup,
    vanCheckbox: Checkbox,
    vanCheckboxGroup: CheckboxGroup
  },
  data () {
    return {
      departmentList: [],
      departmentChooseList: [],
      showPopup: false,
      type: this.$route.params.type,
      isscan: true,
      form: {
        localName: '通道1',
        type: undefined,
        mac: ''
      },
      showPicker: false,
      columns: [
        { id: 0, value: '入口' },
        { id: 1, value: '出口' }
      ],
      typeval: '',
      addloading: false,
      isSignature: true,
      active: 1
    }
  },
  created () {
    // if (isOS() === 'iOS') {
    //   if (location.href.indexOf('#reloaded') === -1) {
    //     location.href = location.href + '#reloaded'
    //     location.reload()
    //     return
    //   }
    // }
    // this.$toast.success('扫码成功！')
    // 开始获取wx配置信息
    this.getWXConfig()
    this.$http.get('/work/v1/manager/company/page', {params: {departmentId: this.$store.getters.departmentId}}).then(res => {
      this.departmentList = res.data.rows
    })
  },
  mounted () {
    this.onConfirm(this.columns[0])
  },
  methods: {
    toggle (index) {
      this.$refs.checkboxes[index].toggle()
    },
    getWXConfig () {
      const ToastLoading = this.$toast.loading({ mask: true, message: '加载中...', position: 'middle', duration: 0 })
      let url = window.location.href.split('#')[0]
      if (isOS() === 'iOS') {
        url = this.$store.state.url.split('#')[0]
      }
      console.log(url)
      this.$http.post(sweep, {
        appId: this.$store.getters.appId,
        url: url
      }).then((res) => {
        wx.config({
          debug: false,
          appId: res.data.appId,
          timestamp: res.data.timestamp,
          nonceStr: res.data.nonceStr,
          signature: res.data.signature,
          jsApiList: ['scanQRCode']
        })
        wx.ready(() => {
          ToastLoading.clear()
          console.log('js-sdk 配置成功')
        })
        wx.error(() => {
          ToastLoading.clear()
          console.log('js-sdk 配置失败')
        })
      }).catch(() => {
        ToastLoading.clear()
        this.$toast('微信签名失败')
        this.isSignature = false
      })
    },
    scaning () {
      const _this = this
      wx.ready(() => {
        wx.scanQRCode({
          needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果
          scanType: ['qrCode', 'barCode'], // 可以指定是二维码还是一维码
          success (res) {
            // alert('扫描结果：' + res.resultStr)
            console.log('扫描结果：', res.resultStr)
            const mac = getParam('m', res.resultStr)
            if (mac) {
              _this.form.mac = _this.headleMac(mac.toLocaleUpperCase())
              console.log('form-mac 数据', _this.form.mac)
              _this.$toast({
                type: 'success',
                message: '扫码成功！'
              })
              _this.isscan = false // 关闭扫扫
            } else {
              // _this.$toast.fail('未能获取到MAC地址')
              _this.$dialog.confirm({
                closeOnPopstate: true,
                title: '扫码失败',
                message: '原因：未能获取到MAC地址, 请重新扫描'
              }).then(() => {
                _this.isscan = true
              })
            }
          }
        })
      })
      if (this.isSignature) {
        // this.isscan = false
      } else {
        this.$toast('扫一扫调用失败')
      }
    },
    // 处理mac加冒号
    headleMac (value, length = 2) {
      let str = value
      let i = 0
      let arr = []
      for (let index = 0; index < str.length; index++) {
        let n = str.slice(i, i + length)
        i = i + length
        if (!n) break
        arr.push(n)
      }
      return arr.join(':')
    },
    onConfirm (value, index) {
      this.form.type = value.id
      this.typeval = value.value
      this.showPicker = false
    },
    openPopup () {
      this.showPopup = true
    },
    addSubmit () {
      const localName = this.form.localName
      const type = this.form.type
      const mac = this.form.mac
      if (this.departmentChooseList.length < 1) {
        this.$toast.fail('请选择部门')
        return
      }
      if (mac === '') {
        this.$toast.fail('MAC地址不能为空')
        return
      }
      if (localName === '') {
        this.$toast.fail('通道名称不能为空')
        return
      }
      if (type === undefined) {
        this.$toast.fail('请选择出入口状态')
        return
      }
      let chooseList = []
      this.departmentChooseList.forEach(ele => {
        chooseList.push(ele.id)
      })
      this.form.departmentId = this.$store.getters.departmentId
      this.addloading = true
      this.$http.put(AIBindCamera, this.form).then(res => {
        // console.log(res)
        this.$dialog({ closeOnPopstate: true, message: res.message }).then(() => {
          this.$http.put('/work/v1/manager/updateByDepartment', {aiDutyCompanyId: chooseList, mac: mac}).then(() => {
            history.go(-1)
          })
        })
        this.addloading = false
      }).catch(() => { this.addloading = false })
    },
    next () {
      const localName = this.form.localName
      const type = this.form.type
      const mac = this.form.mac
      if (mac === '') {
        this.$toast.fail('MAC地址不能为空')
        return
      }
      if (localName === '') {
        this.$toast.fail('通道名称不能为空')
        return
      }
      if (type === undefined) {
        this.$toast.fail('请选择出入口状态')
        return
      }
      const config = {
        baseURL: process.env.API_HOST + 'pb/at'
      }
      const ToastLoading = this.$toast.loading({ mask: true, message: '加载中...', position: 'middle', duration: 0 })
      this.$http.post(determineTheCamera, {
        localName,
        type,
        mac
      }, config).then(() => {
        ToastLoading.clear()
        this.$store.dispatch('setEquipmentR', { localName, type, mac })
        // this.$router.push('/createInfo/')
        this.getCode()
      }).catch(() => { ToastLoading.clear() })
    },
    getCode () {
      const url = location.origin + '/attendance/manager/createInfo/'
      window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + this.$store.getters.appId + '&redirect_uri=' + encodeURIComponent(url) + '&response_type=code&scope=snsapi_userinfo#wechat_redirect'
    }
  }
}
</script>

<style lang="scss" scoped>
.addSubmit{
  display: flex;
  width: 100%;
  justify-content: space-between;
}
.chooseDepartment{
  display: flex;
  justify-content: center;
  align-items: center;
  height: 1rem;
  font-size: 0.5rem;
}
.box {
  padding-top: 100px;
}
.scan {
  height: 150px;
  line-height: 150px;
  width: 150px;
  border-radius: 50%;
  border: none;
  overflow: hidden;
  box-shadow: 0 4px 15px 0 rgba(64, 158, 255, 0.6);
  font-size: 45px;
}
.describe {
  margin-top: 30px;
  font-size: 16px;
}
.info {
  padding: 20px 15px;
  .mac {
    height: 30px;
    line-height: 30px;
    font-size: 16px;
  }
  .title {
    padding: 15px;
    font-size: 16px;
  }
}
.btnbox {
  padding: 0 20px;
  position: absolute;
  bottom: 10px;
  width: 100%;
  box-sizing: border-box;
  .btn {
    border-radius: 5px;
    overflow: hidden;
  }
}
</style>

<template>
    <div>
        <van-cell-group>
            <van-cell required title="选择通道" is-link @click="dialogVisible = true"/>
            <van-cell v-show="registerVal !== '填写个人信息登记'" title="严格模式" center label="开启后访客需填写个人信息">
                <van-switch v-model="isStrict" size="20px" />
            </van-cell>
             <van-cell required title="选择登记方式" :value="registerVal" is-link @click="showRegisterPicker = true"/>
            <van-cell required title="选择限制方式" label="选择哪种方式限制访客的使用" :value="typeVal" is-link @click="showPicker = true"/>
            <template v-if="form.type === 1">
              <van-field required v-model="form.time" label="限制次数：" type="number" placeholder="请输入" @blur.prevent="onblurForWX"/>
            </template>
            <template v-if="form.type === 2">
              <van-cell title="来访有效时间：" label="默认为一个小时" />
              <van-cell required title="选择开始时间" is-link :value="beginTime" @click="showBeginTime = true" />
              <van-cell required title="选择结束时间" is-link :value="endTime" @click="showEndTime = true" />
            </template>
            <van-field v-model="form.remark" rows="1" maxlength="10" label="备注：" type="textarea" placeholder="请输入" @blur.prevent="onblurForWX"/>
        </van-cell-group>
        <div class="btnbox">
            <van-button type="info" block class="btn mar-b-10" :loading="Loading" @click="submit">提交</van-button>
        </div>
        <p class="fc-grey tip">说明：<br>按时间段，访客在有效的时间内可以多次扫码开闸通行，过期无效。<br>按次数，访客扫码开闸通行达到限定次数后则无效。</p>

        <van-dialog v-model="dialogVisible" title="选择通道" close-on-popstate >
          <div class="text-c fc-grey nulldata" v-if="columns.length == 0">暂无通道</div>
            <van-checkbox-group v-model="form.tokenId" class="radio-group" >
              <template v-for="(item, index) in columns">
                <van-checkbox :name="item.id" class="mar-b-10" :key="index">{{item.localName}}</van-checkbox>
              </template>
            </van-checkbox-group>
        </van-dialog>
        <van-popup v-model="showBeginTime" position="bottom" :close-on-click-overlay="false" safe-area-inset-bottom>
            <van-datetime-picker
            v-model="currentDate1"
            type="datetime"
            show-toolbar
            @cancel="showBeginTime=false"
            @confirm="onConfirmStart"
            />
        </van-popup>
        <van-popup v-model="showEndTime" position="bottom" :close-on-click-overlay="false" safe-area-inset-bottom>
            <van-datetime-picker
            v-model="currentDate2"
            type="datetime"
            show-toolbar
            @cancel="showEndTime=false"
            @confirm="onConfirmEnd"
            />
        </van-popup>
        <van-popup v-model="showPicker" position="bottom" safe-area-inset-bottom>
          <van-picker
            show-toolbar
            :columns="typeColumns"
            value-key="label"
            @cancel="showPicker = false"
            @confirm="onConfirm"
          />
        </van-popup>
          <van-popup v-model="showRegisterPicker" position="bottom" safe-area-inset-bottom>
          <van-picker
            show-toolbar
            :columns="registerColumns"
            value-key="label"
            @cancel="showRegisterPicker = false"
            @confirm="onConfirmRegisterVal"
          />
        </van-popup>

        <van-overlay :show="showShare" @click="showShare=false"/>
        <div class="share" v-show="showShare" @click="showShare=false">
          <div class="text-r icon">
            <span class="text">请猛戳右上角分享！</span>
            <img src="@/assets/share-arrow.png" class="img" >
          </div>
        </div>
    </div>
</template>

<script>
import { Picker, DatetimePicker, Overlay, CheckboxGroup, Checkbox, Switch } from 'vant'
import { getMac, sweep, submitVisitor } from '@/api/url'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import wx from 'weixin-js-sdk'
import isOS from '@/utils/isOS'
import { Storage } from '@/utils/storage'
import onblurMixin from '@/mixin/onblurMixin'
export default {
  mixins: [ onblurMixin ],
  components: {
    [Picker.name]: Picker,
    [DatetimePicker.name]: DatetimePicker,
    'van-overlay': Overlay,
    'van-checkbox-group': CheckboxGroup,
    'van-checkbox': Checkbox,
    [Switch.name]: Switch
  },
  data () {
    return {
      registerVal: '',
      showRegisterPicker: false,
      Loading: false,
      listQuery: {
        offset: 1,
        limit: 1000,
        departmentId: this.$store.getters.departmentId
      },
      columns: [],
      form: {
        openId: this.$store.getters.openId,
        appId: this.$store.getters.appId,
        // openId: 'o5bzNv77SNURxaVQVi_cogLc4k_8123',
        // appId: 'wx915008be9bda881b',
        departmentId: this.$store.getters.departmentId,
        beginTime: this.$dayjs().format('YYYY-MM-DD HH:mm') + ':00',
        endTime: this.$dayjs().add(1, 'h').format('YYYY-MM-DD HH:mm') + ':00',
        remark: '',
        registerType: undefined,
        type: undefined,
        time: 1, // 次数
        tokenId: []
      },
      dialogVisible: false,
      beginTime: this.$dayjs().format('YYYY-MM-DD HH:mm'),
      showBeginTime: false,
      currentDate1: new Date(),
      endTime: this.$dayjs().add(1, 'h').format('YYYY-MM-DD HH:mm'),
      showEndTime: false,
      currentDate2: new Date(this.$dayjs().add(1, 'h')),
      showShare: false,
      showPicker: false,
      registerColumns: [
        { id: 1, label: '扫闸机码登记' },
        { id: 2, label: '填写个人信息登记' }
      ],
      typeColumns: [
        { id: 1, label: '按次数' },
        { id: 2, label: '按时间段' }
      ],
      typeVal: '',
      isStrict: true
    }
  },
  created () {
    this.fetchData()
    this.getWXConfig()
  },
  mounted () {
    this.$dayjs.extend(isSameOrBefore)
    if (!Storage.get('visitorShowHelp')) {
      this.$nextTick(() => {
        this.$dialog.alert({
          closeOnPopstate: true,
          messageAlign: 'left',
          message: '1. 填写完信息，点击【提交】\n2. 提交成功点击【分享】发送给访客\n3. 访客点开链接并扫设备屏幕下方二维码\n4. 开闸通行',
          confirmButtonText: '知道了，不再提醒'
        }).then(() => {
          Storage.set('visitorShowHelp', 1)
        })
      })
    }
    this.onConfirm(this.typeColumns[0])
    this.onConfirmRegisterVal(this.registerColumns[0])
  },
  methods: {
    onConfirmRegisterVal (value) {
      this.registerVal = value.label
      this.form.registerType = value.id
      this.showRegisterPicker = false
    },
    onConfirm (value, index) {
      this.typeVal = value.label
      this.form.type = value.id
      this.showPicker = false
    },
    getWXConfig () {
    //   const ToastLoading = this.$toast.loading({ mask: true, message: '加载中...', position: 'middle', duration: 0 })
      let url = window.location.href.split('#')[0]
      if (isOS() === 'iOS') {
        url = this.$store.state.url.split('#')[0]
      }
      this.$http.post(sweep, {
        appId: this.$store.getters.appId,
        url: url
      }).then((res) => {
        wx.config({
          debug: false, // 调试模式
          appId: res.data.appId, // 必填，公众号唯一标识符
          timestamp: res.data.timestamp, // 必填，生成签名的时间戳
          nonceStr: res.data.nonceStr, // 必填，生成签名的随机串
          signature: res.data.signature, // 必填，签名
          jsApiList: [
            'updateAppMessageShareData',
            'onMenuShareAppMessage'
          ] // 必填，需要使用的JS接口列表
        })
        wx.ready(() => {
        //   ToastLoading.clear()
          console.log('js-sdk 配置成功')
        })
        wx.error((err) => {
        //   ToastLoading.clear()
          console.log('js-sdk 配置失败' + err)
        })
      }).catch(() => {
        /* ToastLoading.clear() */
        this.$toast('微信签名失败')
      })
    },
    // 获取通道
    fetchData () {
      const ToastLoading = this.$toast.loading({ message: '加载中...', position: 'middle', duration: 0 })
      this.$http.post(getMac, {departmentId: this.$store.getters.departmentId}).then(res => {
        ToastLoading.clear()
        if (res.data) {
          this.columns = res.data
        }
      }).catch(() => {
        ToastLoading.clear()
      })
    },
    onConfirmStart (val) {
      this.beginTime = this.$dayjs(val).format('YYYY-MM-DD HH:mm')
      this.form.beginTime = this.$dayjs(val).format('YYYY-MM-DD HH:mm') + ':00'
      this.showBeginTime = false
    },
    onConfirmEnd (val) {
      this.endTime = this.$dayjs(val).format('YYYY-MM-DD HH:mm')
      this.form.endTime = this.$dayjs(val).format('YYYY-MM-DD HH:mm') + ':00'
      this.showEndTime = false
    },
    // 提交
    submit () {
      console.log(this.form)
      let type = this.form.type
      if (type === undefined) {
        this.$toast.fail('请选择限制方式')
        return
      }
      if (this.form.tokenId.length === 0) {
        this.$toast.fail('请选择通道')
        return
      }
      if (this.$dayjs(this.endTime).isSameOrBefore(this.beginTime) && type === 2) {
        this.$toast.fail('结束时间应大于开始时间！')
        return
      }
      if (this.form.time === '' && type === 1) {
        this.$toast.fail('请输入限制次数！')
        return
      }
      this.$http.post(submitVisitor, this.form).then(res => {
        this.Loading = false
        if (res.data && this.form.registerType === 1) {
          this.handleShare(res.data)
          this.$dialog.alert({
            closeOnPopstate: true,
            message: '提交成功，请通过分享发送给临时访客进行扫码通行',
            confirmButtonText: '分享'
          }).then(() => {
            this.showShare = true
            // this.$router.push(`/shareVisitor/?data=${encodeURI(JSON.stringify(res.data))}&isStrict=${this.isStrict ? '1' : '0'}`) // 测试用
          })
        } else {
          this.handleregisterShare(res.data)
          this.$dialog.alert({
            closeOnPopstate: true,
            message: '提交成功，请通过分享发送给临时访客进行扫码通行',
            confirmButtonText: '分享'
          }).then(() => {
            this.showShare = true
            // this.$router.push(`/shareVisitor/?data=${encodeURI(JSON.stringify(res.data))}&isStrict=${this.isStrict ? '1' : '0'}`) // 测试用
          })
        }
      }).catch(() => {
        this.Loading = false
      })
    },
    handleregisterShare (data) {
      let url = `${location.origin}/attendance/manager/registerVisitor/?data=${encodeURI(JSON.stringify(data))}&departmentId=${this.$store.getters.departmentId}`
      let shareData = {
        title: '临时访客',
        desc: '请访客点开链接并填写个人信息，用于开闸通行。',
        link: url,
        success: function () {
        }
      }
      wx.ready(() => {
        wx.onMenuShareAppMessage(shareData)
      })
    },
    //
    handleShare (data) {
      let url = `${location.origin}/attendance/manager/shareVisitor/?data=${encodeURI(JSON.stringify(data))}&isStrict=${this.isStrict ? '1' : '0'}`
      // let desc = ''
      // if (this.from.type === 2) {
      //   desc = `有效时间:${this.form.beginTime}~${this.form.endTime}`
      // }
      // if (this.from.type === 1) {
      //   desc = `限制次数:${this.form.time}`
      // }
      let shareData = {
        title: '临时访客',
        desc: '请访客点开链接并扫设备屏幕下方二维码，用于开闸通行。',
        link: url,
        success: function () {
        }
      }
      wx.ready(() => {
        wx.onMenuShareAppMessage(shareData)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
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
.nulldata {
  padding: 10px;
}
.share {
  color: #fff;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
  .text {
    font-size: 14px;
    letter-spacing: 2px;
  }
  .icon {
    padding-top: 50px;
    padding-right: 40px;
    .img {
      object-fit: contain;
      height: 100px;
    }
  }
}
.tip {
  padding: 0 15px;
}
</style>

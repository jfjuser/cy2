<template>
  <div class="bgc-grey full-height">
    <van-notice-bar left-icon="info-o">
      不正确的参数，有可能会导致设备断网，请谨慎操作。
    </van-notice-bar>
    <van-cell-group class="asd">
      <van-field required label-width="50px"  label="名称" v-model.trim="form.name" placeholder="请输入wifi名称" @blur.prevent="onblurForWX"/>
      <van-field :right-icon="ispw == 'password'?'closed-eye':'eye-o'" :type="ispw" @click-right-icon="showPwd" required label-width="50px" label="密码" v-model.trim="form.password" placeholder="请输入wifi密码" @blur.prevent="onblurForWX"/>
      <van-field required label-width="50px" style="color:#000" label="安全性" disabled @click="selectType" v-model.trim="form.safety" placeholder="请选择wifi类型" @blur.prevent="onblurForWX"/>
    </van-cell-group>
    <div class="tip fc-grey">
      <span style="display:block">请设置wifi信息，以便设备联网使用</span>
      <span style="display:block">非特殊wifi请使用默认安全性</span>
    </div>
    <van-popup v-model="isShow" position="bottom">
      <van-picker
        show-toolbar
        title="安全性"
        :columns="typeArr"
        @cancel="isShow = false"
        @confirm="clickIt"
      />
      <van-button type="info" @click.native="addWifiType">新增安全类型</van-button>
      <!-- <van-radio-group v-model="radio">
        <van-cell-group>
          <van-cell v-for="item in typeArr" :key=item :title="item" clickable @click="clickIt(item)">
            <van-radio slot="right-icon" :name="item" />
          </van-cell>
        </van-cell-group>
      </van-radio-group> -->
    </van-popup>
    <van-dialog @confirm="ensure" v-model="isReal" title="安全性" show-cancel-button>
      <van-cell-group class="asd">
        <van-field error-message="字母大写，空格或斜杠都按严格模式输入" required label-width="50px"  label="类型" v-model.trim="newName" placeholder="请输入类型"/>
      </van-cell-group>
    </van-dialog>
    <div class="btnboxQueConfirm">
        <van-button type="info" block class="btn" @click="newQueConfirm" :loading="loading" size="normal">新生成二维码</van-button>
        <van-button style="width:30%;margin-left:5px" type="primary" block class="btn" @click="oldQueConfirm" :loading="loading" size="normal">旧版</van-button>

    </div>
    <div class="text-c qrcode-box">
      <img :src="imgUrl" class="code" v-show="imgUrl !== ''"/>
      <p class="fc-blue" v-if="imgUrl !== ''">请将该二维码出示给设备扫描</p>
    </div>
    <div class="next" v-if="from && from === 'register'">
      <p class="tip fc-grey">若设备已扫描二维码且wifi已绑定，请点击下一步</p>
      <div class="btnbox">
        <van-button type="info" block class="btn" @click="toScan">下一步</van-button>
      </div>
      <div class="tip text-c fc-grey">若已设置，请点击<span style="text-decoration:underline;" @click="toScan">跳过</span></div>
    </div>
  </div>
</template>
<script>
import { RadioGroup, Radio, NoticeBar, Picker, Notify } from 'vant'
import { createQR, backShowType, setType } from '@/api/url'
import onblurMixin from '@/mixin/onblurMixin'
import { Storage } from '@/utils/storage'
import { httpPost } from '@/utils/restful'
// import Axios from 'axios'
export default {
  mixins: [ onblurMixin ],
  components: {
    'van-radio-group': RadioGroup,
    'van-radio': Radio,
    'van-picker': Picker,
    [NoticeBar.name]: NoticeBar
  },
  data () {
    return {
      ispw: 'password',
      isShow: false,
      isReal: false,
      takeat: 0,
      newName: '',
      imgUrl: '',
      radio: '',
      typeArr: [
        '无',
        'WEP',
        'WPA-PSK',
        'WPA2 PSK',
        'WPA/WPA2 PSK',
        '802.1x EAP',
        'WAPI PSK',
        'WAPI CERT',
        'WPA',
        'WPA2',
        'WPA2/WPA3',
        'WPA企业级',
        'WPA2企业级',
        'WPA3企业级'
      ],
      form: {
        name: '',
        appId: this.$store.getters.appId,
        // appId: 'wx915008be9bda881b',
        openId: this.$store.getters.openId,
        // openId: 'o5bzNv7YZbbuGSnzKYu-KxhpQLdw',
        password: '',
        safety: 'WPA-PSK'
      },
      loading: false
    }
  },
  computed: {
    from () {
      return this.$route.query.from || undefined
    }
  },
  created () {
    const wifiParams = Storage.get('wifiParams')
    if (wifiParams) {
      // this.imgUrl = wifiParams.imgUrl
      this.form = wifiParams.form
      this.form.appId = this.$store.getters.appId
      this.form.openId = this.$store.getters.openId
    }
  },
  methods: {
    // 是否显示密码
    showPwd () {
      if (this.ispw === 'password') {
        this.ispw = 'text'
      } else {
        this.ispw = 'password'
      }
    },
    selectType () {
      // 请求后端 获取wifi类型回显
      const config = {
        baseURL: process.env.API_HOST + 'pb/at'
      }
      let userId = this.$store.getters.userId
      this.$http.get(backShowType + '/' + userId, config).then((res) => {
        if (res.data !== null) {
          let index = res.data.indexOf('WPA-PSK')
          if (index > -1) {
            let temp = res.data[index]
            res.data[index] = res.data[0]
            res.data[0] = temp
            this.typeArr = res.data
          } else {
            res.data.unshift('WPA-PSK')
            this.typeArr = res.data
          }
        }
        this.isShow = true
      }).catch(() => {
        this.isShow = true
      })
    },
    addWifiType () {
      this.newName = ''
      this.isReal = true
    },
    confirmCon () {
      console.log(this.newName)
    },
    clickIt (val) {
      // this.newName = val
      this.isShow = false
      this.form.safety = val
    },
    ensure () {
      console.log(this.newName)
      let setCameraTypeDto = {
        type: [this.newName],
        userId: this.$store.getters.userId
      }
      const config = {
        baseURL: process.env.API_HOST + 'pb/at'
      }
      this.$http.post(setType, setCameraTypeDto, config).then((res) => {
        console.log(res)
        Notify({
          type: 'success',
          message: res.message,
          duration: 3000
        })
        this.isShow = false
      }).catch(() => {})
    },
    toScan () {
      if (this.takeat === 1) {
        this.$router.push('/scan/')
      } else {
        this.$toast.fail('请生成二维码以供设备扫描绑定')
      }
    },
    newQueConfirm () {
      if (this.form.name === '') {
        this.$toast.fail('请输入wifi名称')
        return
      }
      if (this.form.password === '') {
        this.$toast.fail('请输入wifi密码')
        return
      }
      this.loading = true
      this.imgUrl = ''
      //  + '&password=' + this.form.password
      //  + '?name=' + this.form.name + '&safety=' + this.form.safety + '&appId=' + this.form.appId + '&openId=' + this.form.openId
      // let obj = {password: this.form.password, name: this.form.name,}
      // httpGet(`http://cy.40mi.com/pb/at/work/v1/visitor/getWifiPNew?password=${this.form.password}&name=${this.form.name}&safety=${this.form.safety}&appId=${this.form.appId}&openId=${this.form.openId}`).then(res => { // https://beta.cytingchechang.com/pb/at/work/v1/visitor/getWifiP
      httpPost('http://cy.40mi.com/pb/at/work/v1/visitor/getWifiPNew', this.form).then(res => {
        // let blob = new Blob([res], {type: 'image/jpeg'})
        // let url = window.URL.createObjectURL(blob)
        this.imgUrl = 'http://cy.40mi.com/pb/at/work/v1/visitor/getWifiPNew1?' + res.data + '&safety=' + this.form.safety + '&appId=' + 'wx915008be9bda881b' + '&openId=' + this.form.openId
        // 试试
        // this.imgUrl = 'http://192.168.0.227:9000/pb/at/work/v1/visitor/getWifiPNew1' + '?name=' + this.form.name + '&password=' + this.form.password + '&safety=' + this.form.safety + '&appId=' + 'wx915008be9bda881b' + '&openId=' + this.form.openId
        // const myBlob = new window.Blob([res], {type: 'image/jpeg'})
        // console.log(myBlob)
        // const qrUrl = window.URL.createObjectURL(myBlob)
        // console.log(qrUrl)
        // this.imgUrl = qrUrl
        // this.imgUrl = 'https://beta.cytingchechang.com/pb/at/work/v1/visitor/getWifiPNew' + '?name=' + this.form.name + '&password=' + this.form.password.toString() + '&safety=' + this.form.safety + '&appId=' + 'wx915008be9bda881b' + '&openId=' + this.form.openId
        this.loading = false
        this.takeat = 1
        let obj = {
          form: this.form,
          imgUrl: this.imgUrl
        }
        Storage.set('wifiParams', obj)
      }).catch(() => { this.loading = false })
    },
    oldQueConfirm () {
      if (this.form.name === '') {
        this.$toast.fail('请输入wifi名称')
        return
      }
      if (this.form.password === '') {
        this.$toast.fail('请输入wifi密码')
        return
      }
      this.loading = true
      this.$http.get(createQR + '?name=' + this.form.name + '&password=' + this.form.password + '&safety=' + this.form.safety + '&appId=' + this.form.appId + '&openId=' + this.form.openId).then(() => { // https://beta.cytingchechang.com/pb/at/work/v1/visitor/getWifiP
        this.imgUrl = 'https://beta.cytingchechang.com/pb/at/work/v1/visitor/getWifiP' + '?name=' + this.form.name + '&password=' + this.form.password + '&safety=' + this.form.safety + '&appId=' + 'wx915008be9bda881b' + '&openId=' + this.form.openId
        console.log(this.imgUrl)
        this.loading = false
        this.takeat = 1
        let obj = {
          form: this.form,
          imgUrl: this.imgUrl
        }
        Storage.set('wifiParams', obj)
      }).catch(() => { this.loading = false })
    }
  }
}
</script>

<style lang="scss" scoped>
.btnboxQueConfirm{
  padding: 0px 10px;
  display: flex;
}
.btnbox {
    padding: 0 20px;
}
.btn {
  margin-top: 10px;
    border-radius: 5px;
    overflow: hidden;
}
.tip {
  padding: 10px;
}
.qrcode-box {
  padding-top: 10px;
  .code {
    width: 300px;
    height: 270px;
  }
}
.next {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
}
</style>

<style scoped>
  .asd >>> .van-field__control:disabled {
    color:#000;
    -webkit-text-fill-color:#000
  }
</style>

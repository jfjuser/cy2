<template>
    <div class="bgc-grey full-height page">
      <div class="show" v-if="showName">
        <div v-for="(tab, index) in list" :key="index">
          <template v-for="item in tab">
            <!-- 输入框 -->
            <template v-if="item.type === 1">
              <!-- 数字类型 -->
              <van-field v-if="item.inputType === 1" type="number" class="flex-rows" v-model="item.value" :label="item.chineseName" :placeholder="item.remarks" @blur.prevent="onblurForWX" :key="item.name"/>
              <!-- 字符串类型 -->
              <van-field v-if="item.inputType === 2" class="flex-rows-toStr" v-model="item.value" :label="item.chineseName" :placeholder="item.remarks" @blur.prevent="onblurForWX" :key="item.name"/>
              <van-button round block type="info" :key="item.name" @click="create(item)" class="mar-b-10">生成二维码</van-button>
               </template>
            <!-- 选择框 -->
            <template v-if="item.type === 2">
              <van-cell :title="item.chineseName" center :label="item.remarks" :key="item.name">
                <el-select  v-model="item.value" :multiple="item.selectType === 2" collapse-tags>
                  <el-option v-for="(option, index) in item.options" :key="index" :label="option.label" :value="option.value"></el-option>
                </el-select>
              </van-cell>
              <van-button round block type="info" :key="item.name" @click="create(item)" class="mar-b-10">生成二维码</van-button>
              </template>
            <!-- 滑块 -->
            <template v-if="item.type === 3">
              <van-cell :title="item.chineseName" label-class="label-cell" :key="item.name">
                <template slot="title">
                  <p>{{item.chineseName}}</p>
                  <span class="fc-grey fsz-12">{{item.remarks}}</span>
                </template>
                <van-slider v-model="item.value" :min="item.min" :max="item.max" slot="label">
                  <van-tag type="primary" round slot="button">{{ item.value }}</van-tag>
                </van-slider>
              </van-cell>
              <van-button round block type="info" :key="item.name" @click="create(item)" class="mar-b-10">生成二维码</van-button>
              </template>
            <!-- 单选框 -->
            <template v-if="item.type === 4">
              <van-cell :title="item.chineseName" class="flex-rows" :key="item.name" :label="item.remarks">
                <van-radio-group v-model="item.value">
                  <van-radio :name="option.value" class="mar-b-10" v-for="(option, index) in item.options" :key="index">{{option.label}}</van-radio>
                </van-radio-group>
              </van-cell>
              <van-button round block type="info" :key="item.name" @click="create(item)" class="mar-b-10">生成二维码</van-button>
              </template>
          </template>
        </div>
      </div>
        <van-tabs v-model="active" animated v-else>
          <van-tab :title="tab[0].classify" v-for="(tab, index) in list" :key="index">
            <template v-for="item in tab">
              <!-- 输入框 -->
              <template v-if="item.type === 1">
                <!-- 数字类型 -->
                <van-field v-if="item.inputType === 1" type="number" class="flex-rows" v-model="item.value" :label="`${item.classify}:`+item.chineseName" :placeholder="item.remarks" @blur.prevent="onblurForWX" :key="item.name"/>
                <!-- 字符串类型 -->
                <van-field v-if="item.inputType === 2" class="flex-rows-toStr" v-model="item.value" :label="`${item.classify}:`+item.chineseName" :placeholder="item.remarks" @blur.prevent="onblurForWX" :key="item.name"/>
                <van-button type="primary" block size="small" :key="item.name" @click="create(item)" class="mar-b-10">生成二维码</van-button>
                <van-button type="primary" block size="small" v-if="!showName" :key="item.name" @click="sentDown(item)" class="mar-b-10">下发</van-button>
              </template>
              <!-- 选择框 -->
              <template v-if="item.type === 2">
                <van-cell :title="`${item.classify}:`+item.chineseName" center :label="item.remarks" :key="item.name">
                  <el-select  v-model="item.value" :multiple="item.selectType === 2" collapse-tags>
                    <el-option v-for="(option, index) in item.options" :key="index" :label="option.label" :value="option.value"></el-option>
                  </el-select>
                </van-cell>
                <van-button type="primary" block size="small" :key="item.name" @click="create(item)" class="mar-b-10">生成二维码</van-button>
                <van-button type="primary" block size="small" v-if="!showName" :key="item.name" @click="sentDown(item)" class="mar-b-10">下发</van-button>
              </template>
              <!-- 滑块 -->
              <template v-if="item.type === 3">
                <van-cell :title="`${item.classify}:`+item.chineseName" label-class="label-cell" :key="item.name">
                  <template slot="title">
                    <p>{{`${item.classify}:`+item.chineseName}}</p>
                    <span class="fc-grey fsz-12">{{item.remarks}}</span>
                  </template>
                  <van-slider v-model="item.value" :min="item.min" :max="item.max" slot="label">
                    <van-tag type="primary" round slot="button">{{ item.value }}</van-tag>
                  </van-slider>
                </van-cell>
                <van-button type="primary" block size="small" :key="item.name" @click="create(item)" class="mar-b-10">生成二维码</van-button>
                <van-button type="primary" block size="small" v-if="!showName" :key="item.name" @click="sentDown(item)" class="mar-b-10">下发</van-button>
              </template>
              <!-- 单选框 -->
              <template v-if="item.type === 4">
                <van-cell :title="`${item.classify}:`+item.chineseName" class="flex-rows" :key="item.name" :label="item.remarks">
                  <van-radio-group v-model="item.value">
                    <van-radio :name="option.value" class="mar-b-10" v-for="(option, index) in item.options" :key="index">{{option.label}}</van-radio>
                  </van-radio-group>
                </van-cell>
                <van-button type="primary" block size="small" :key="item.name" @click="create(item)" class="mar-b-10">生成二维码</van-button>
                <van-button type="primary" v-if="!showName" block size="small" :key="item.name" @click="sentDown(item)" class="mar-b-10">下发</van-button>
              </template>
              <!-- 复选 -->
              <!-- <template v-if="item.type === 5">
                <van-cell :title="`${item.classify}:`+item.chineseName" :key="item.name" :label="item.remarks">
                  <van-checkbox-group class="radio-group" v-model="item.value">
                    <template v-for="(option, index) in item.options">
                      <van-checkbox shape="square" :name="option.value" class="mar-b-10" :key="index">{{option.label}}</van-checkbox>
                    </template>
                  </van-checkbox-group>
                </van-cell>
                <van-button type="primary" block size="small" :key="item.name" @click="create(item)" class="mar-b-10">生成二维码</van-button>
              </template> -->
            </template>
          </van-tab>
        </van-tabs>
        <van-dialog
          v-model="showChannel"
          close-on-popstate
          class="text-c"
          @confirm="downFa"
          show-cancel-button
          title="选择通道"
        >
        <van-radio-group v-model="mac">
          <van-radio style="height:1rem;margin-left:0.7rem" v-for="(item, id) in channelArr" :key=id :name="item.mac" shape="square">{{item.localName}}</van-radio>
        </van-radio-group>
        </van-dialog>
        <van-dialog
          v-model="showQRcode"
          close-on-popstate
          class="text-c"
          @confirm="IsOverdue = false"
        >
        <div class="F-QRcode">
          <div v-if="IsOverdue" class="C-QRcode">二维码已过期 请重新生成</div>
          <div class="C-QRcodeImg"><img :src="qrcode" alt="二维码"></div>
        </div>
        </van-dialog>
    </div>
</template>

<script>
import { Slider, Notify, Tag, CheckboxGroup, Checkbox, RadioGroup, Radio, DropdownMenu, DropdownItem, Tab, Tabs } from 'vant'
import { Select, Option } from 'element-ui'
import onblurMixin from '@/mixin/onblurMixin'
import md5 from 'js-md5'
import { setCameraParams, setCameraParams1, getMac, setAllParams, cameraAIParams, password, getNewTime } from '@/api/url'
const Qs = require('qs')
// const paramsData = require('./params.json')
export default {
  mixins: [ onblurMixin ],
  components: {
    [Slider.name]: Slider,
    [Tag.name]: Tag,
    'van-checkbox-group': CheckboxGroup,
    'van-checkbox': Checkbox,
    'van-radio-group': RadioGroup,
    'van-radio': Radio,
    [DropdownMenu.name]: DropdownMenu,
    [DropdownItem.name]: DropdownItem,
    [Tab.name]: Tab,
    [Tabs.name]: Tabs,
    [Select.name]: Select,
    [Option.name]: Option
  },
  data () {
    return {
      IsOverdue: false,
      showName: this.$route.query.showName ? this.$route.query.showName : '',
      passWord: undefined,
      Loading: false,
      channelArr: [],
      showChannel: false,
      mac: undefined,
      qrcode: '',
      obj: {},
      showQRcode: false,
      array: [],
      active: 0,
      list: []
      // paramsDataJson: JSON.stringify(paramsData)
      // form: {
      //   fileName: 'AppConfig.ini',
      //   chineseName: undefined, // 中文名
      //   name: undefined, // 字段名
      //   value: undefined, // 字段值
      //   type: undefined, // 类型 1.输入框 2.选择框 3.slider滑块 4. 单选框 5.多选框
      //   // 输入框
      //   inputType: undefined, // 输入框类型 1.数字 2.字符串
      //   min: undefined, // 最小值
      //   max: undefined, // 最大值
      //   remarks: undefined, // 备注信息
      //   // 选择
      //   selectType: undefined, // 选择框类型 1 单选 2 多选
      //   options: [ // 选择框、单选框或者多选框的option
      //     {
      //       value: undefined,
      //       label: undefined
      //     }
      //   ]
      // }
    }
  },
  created () {
    if (this.$route.query.id) {
      this.get()
      this.$http.get(password + this.$route.query.id).then(res => {
        this.passWord = res.data.password
      })
    } else {
      this.get()
    }
  },
  methods: {
    // 设置二维码过期
    CountDownIsOverdue () {
      let _this = this
      setTimeout(() => {
        _this.IsOverdue = true
      }, 300000)
    },
    get () {
      const ToastLoading = this.$toast.loading({ message: '加载中...', position: 'middle' })
      let cameraTypes = 134
      // 默认值： 134
      this.$http.get(cameraAIParams + `?${Qs.stringify({ cameraType: cameraTypes })}`)
        .then(res => {
          // console.log('请求回来的数据信息！', res)
          ToastLoading.clear()
          let data = JSON.parse(res.data)
          if (data !== null) {
            this.array = data
            this.seeData()
          } else {
            this.array = []
            this.$dialog.confirm({
              title: '数据信息',
              message: '当前数据信息为空,\n请联系管理人添加信息...',
              showCancelButton: false
            }).then(() => {
              this.$router.go(-1)
            })
          }
        }).catch(() => { ToastLoading.clear() })
    },
    seeData () {
      let names = []
      this.array.forEach(item => {
        if (this.showName) {
          if (item.name === this.showName) {
            names.push(item.classify)
          }
        } else {
          names.push(item.classify)
        }
      })
      let name = Array.from(new Set(names))

      let data = []
      for (let i = 0; i < name.length; i++) {
        let arr = []
        for (let j = 0; j < this.array.length; j++) {
          if (this.showName) {
            if (name[i] === this.array[j].classify && this.array[j].name === this.showName) {
              arr.push(this.array[j])
            }
          } else {
            if (name[i] === this.array[j].classify) {
              arr.push(this.array[j])
            }
          }
        }
        data.push(arr)
      }
      this.list = data
      // console.log('数据表： ', this.list)
    },
    isNew (tcp) {
      if (tcp.indexOf('12-14') > -1) {
        return true
      } else {
        return false
      }
    },
    async create (data) {
      let res = await this.$http.get(getNewTime)
      let timestamp = parseInt(res.data.toString().slice(0, 10))
      // console.log(this.$route.query.tcpVersion && this.$route.query.tcpVersion.indexOf('12-14') > -1)
      if (this.$route.query.VersionFlag / 1 === 1) {
        var str = `CNF,${data.fileName},${data.name},${data.value},${timestamp},${this.passWord}`
      } else {
        var str = `cnf,${data.fileName},${data.name},${data.value},${timestamp},${this.passWord}`
      }
      let passWord = md5(str).slice(0, 16).toUpperCase()
      // console.log('加密前模板 ===》 ' + str)
      // console.log('密码 ===》 ' + this.passWord)
      // console.log('加密后前十六位 ===》 ' + passWord, md5(str))
      let obj = {}
      if (this.$route.query.VersionFlag / 1 === 1) {
        obj = {
          fileName: data.fileName,
          key: data.name,
          value: data.value,
          utc: timestamp,
          passWord: passWord
        }
      } else {
        obj = {
          fileName: data.fileName,
          key: data.name,
          value: data.value
        }
      }
      const params = Qs.stringify(obj)
      if (this.$route.query.VersionFlag / 1 === 1) {
        this.qrcode = `${process.env.API_HOST}pb/at/${setCameraParams1}?${params}`
      } else {
        this.qrcode = `${process.env.API_HOST}pb/at/${setCameraParams}?${params}`
      }
      this.showQRcode = true
      this.CountDownIsOverdue()
    },
    sentDown (data) {
      this.obj = {
        filename: data.fileName,
        key: data.name,
        val: data.value
      }
      // console.log(this.obj)
      // console.log(this.$store.getters.departmentId)
      // 获取mac
      this.$http.post(getMac, {departmentId: this.$store.getters.departmentId}).then((res) => {
        // console.log('getMacSuccess', res)
        this.channelArr = res.data
        if (res.data.length === 0) {
          Notify({
            type: 'warning',
            message: '请先配置通道',
            duration: 3000
          })
        } else {
          this.showChannel = true
        }
      }).catch((err) => {
        // console.log('getMacErr', err)
      })
      // let obj = data
      // this.$http.get(setAllParams, obj).then((res) => {
      //   console.log(res)
      // }).catch(() => {})
    },
    downFa () {
      this.obj = Object.assign(this.obj, {
        departmentId: this.$store.getters.departmentId,
        mac: this.mac
      })
      this.$http.get(setAllParams, {params: this.obj}).then((res) => {
        // console.log(res)
        Notify({
          type: 'success',
          message: res.message,
          duration: 3000
        })
      }).catch(() => {})
    }
  }
}
</script>

<style lang="scss" scoped>
.F-QRcode{
  width: 250px;
  height:300px;
  position: relative;
  display: inline-block;
  .C-QRcode{
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1rem;
    width: 250px;
    height:300px;
    position: absolute;
    background:rgba(255,255,255,0.8);
    z-index: 99;
  }
  .C-QRcodeImg{
    width: 250px;
    height:300px;
    position: absolute;
    z-index: 98;
    img {
     width: 100%;
     height:100%;
    }
  }
}
.page {
  /deep/ .van-tab__pane {
    padding: 10px;
  }
}

.label-cell {
  padding: 10px 0;
}
.flex-rows >>> {
  display: flex;
  justify-content: space-between;
  align-content: center;
    .van-cell__title{
      justify-content: flex-start;
      align-items: center;
      flex: 6;
    }
    .van-cell__value{
      flex: 4;
      display: flex;
      justify-content: flex-end !important;
    }

}
.flex-rows-toStr >>> {
  display: flex;
  flex-direction: column;
  width: 100% ;
  .van-cell__title {
    width: 100%;
    justify-self: flex-start !important;
  }
  .van-cell__value {
     width: 100%;
    justify-self: flex-end !important;
    .van-field__body{
      .van-field__control{
        text-align: right;
      }
    }
  }
}

</style>

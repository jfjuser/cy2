<template>
  <!-- 预付 -->
  <div id="app" v-cloak>
    <router-view v-wechat-title='$route.meta.title'></router-view>
    <!-- 车牌选择 -->
    <header>
      <div class="gasCar" :class="{active:isActive}"  @click="gasCar">汽油车</div>
      <div class="energyCar" :class="{active:!isActive}"  @click="energyCar">新能源</div>
    </header>
    <!-- v-show="!showChar&&!showLetters" -->
    <div>
      <van-swipe v-if="images.length > 0" @change="onChange" :style="{ 'height': clientWidth}"   class="my-swipe" :autoplay="3000" indicator-color="white">
        <van-swipe-item @click="clickAdvertisement(index)" v-for="(item, index) in images" :key="item"><img :style="{ 'height': clientWidth, 'width': '100%'}" :src="item" alt=""></van-swipe-item>
        <template #indicator>
          <div v-if="!(images.length < 2)" class="custom-indicator">
            {{ current + 1 }}/{{images.length}}
          </div>
        </template>
      </van-swipe>
    </div>
    <div class="box-plate-type" v-show="payType && Number(payType) === 3">
      <checker v-model="plateType" default-item-class="item" selected-item-class="item-selected" :radio-required="true">
        <span class="check-tip">车类型</span><checker-item value="1">大车</checker-item>
        <checker-item value="2">小车</checker-item>
      </checker>
      <span class="box-plate-tip">注意:大型车辆只能进入大车通道, 请谨慎选择</span>
    </div>
    <div class="box-from">
      <main @click="showKeyBroad">
        <div>车牌号</div>
        <div>{{plate}}</div>
      </main>
      <!-- <div v-show="payType && Number(payType) === 3" class="btn-np" @click="handleClickNP"><x-button mini plain>无牌车</x-button></div> -->
    </div>
    <div style="margin-top:18px" align="center">
        <div class="btnQuery" @click="confirm" >查询费用</div>
    </div>
    <footer>
      <div class="keyboard"  v-show="showChar">
        <div style="width:100%; text-align:center;color: white;" @click="hideKeyBoard">
          <img src="@/assets/down.png" alt="">
        </div>
        <div>
            <div style="text-align: center">
              <button class="keyButton" v-for="(item, index) in chars1" :key="index" @click="handClick(item.name)">{{item.name}}</button>
            </div>
            <div style="height:5px"></div>
            <div style="text-align: center">
              <button class="keyButton" v-for="(item, index) in chars2" :key="index" @click="handClick(item.name)">{{item.name}}</button>
            </div>
            <div style="height:5px"></div>
            <div style="text-align: center">
              <button class="keyButton" v-for="(item, index) in chars3" :key="index" @click="handClick(item.name)">{{item.name}}</button>
            </div>
            <div style="height:5px"></div>
            <div style="text-align: center">
              <button class="keyButton" v-for="(item, index) in chars4" :key="index" @click="handClick(item.name)">{{item.name}}</button>
            </div>
            <div style="height:2px"></div>
          </div>
      </div>
      <div class="keyboard" v-show="showLetters">
        <div style="width:100%; text-align:center;color: white;" @click="hideKeyBoard">
          <img src="@/assets/down.png" alt="">
        </div>
        <div>
            <div style="text-align: center">
                <button class="keyButton" v-for="(item, index) in numbers" :key="index" @click="handClick(item.name)">{{item.name}}</button>
            </div>
            <div style="height:5px"></div>
            <div style="text-align: center">
                <button class="keyButton" v-for="(item, index) in letters1" :key="index" @click="handClick(item.name)">{{item.name}}</button>
            </div>
            <div style="height:5px"></div>
            <div style="text-align: center">
                <button class="keyButton" v-for="(item, index) in letters2" :key="index" @click="handClick(item.name)">{{item.name}}</button>
            </div>
            <div style="height:5px"></div>
            <div style="text-align: center">
                <button class="keyButton" v-for="(item, index) in letters3" :key="index" @click="handClick(item.name)" >
                    <span v-if="item.name != 'DEL'"> {{item.name}}</span>
                    <span v-else><img style="width:20px; height: 20px; top: 4px; position: relative;" src="@/assets/icon/icon_left.png"/></span>
                </button>
            </div>
            <div style="height:2px"></div>
        </div>
      </div>
    </footer>
  </div>
</template>
<style lang="scss" scoped>
  .custom-indicator {
    position: absolute;
    right: 5px;
    bottom: 5px;
    padding: 2px 5px;
    font-size: 12px;
    background: rgba(0, 0, 0, 0.1);
  }
.my-swipe .van-swipe-item {
    color: #fff;
    font-size: 20px;
    line-height: 150px;
    text-align: center;
    background-color: #39a9ed;
  }
[v-cloak] {
  display: none;
}
  body {
  padding: 0;
  margin: 0;
  background-color: #eeeeee;
  height: 100%;
}

header {
  display: flex;
  justify-content: space-around;
  align-items: center;
  font-size: 17px;
  background: white;
}

header div {
  width: 50%;
  text-align: center;
  padding: 15px;
}

.active {
  color: green;
  border-bottom: 2px solid green;
}

/* 车牌输入 */

main {
  text-align: center;
  padding: 10px;
  background: white;
}

main div {
  text-align: center;
  height: 30px;
  line-height: 30px;
  margin-left: 3px;
  vertical-align: middle;
  text-decoration: none;
  display: inline-block;
  width: 150px;
  border: 1px dotted #7c7c7a;
  border-radius: 5px;
}

main div:nth-child(1) {
  width: 60px;
  border: none;
}
.btnQuery{
  height: 3.25rem;
  width: 90%;
  background: rgb(6,188,7);
  margin: auto;
  line-height: 3.25rem;
  text-align: center;
  color: white;
  font-size: 1.25rem;
  border-radius: .25rem;
  letter-spacing: 5px;
}
/* 键盘 */
.keyboard {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: .5rem .125rem .5rem;
  background-color: #bbbaba;
  font-size: 15px;
}
.banneContainer{
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
}

.keyButton {
  width: 9.5%;
  padding: 0;
  display: inline-block;
  font-size: 18px;
  font-weight: bold;
  margin: 0 0.5px !important;
  line-height: 30px;
  box-shadow: 1px 1px 1px #8e9393;
  border-radius: 5px;
  background: #ffffff;
}

/* 修改elementUi的样式 */

.el-message {
  min-width: 80% !important;
}
p{
  margin: 10px 0;
}
.info{
  color: rgb(139, 74, 13)
}
.box-plate-type {
  margin-top: 1rem;
}
.box-plate-tip {
  font-size: 12px;
}
.box-from {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
}
.btn-np {
}
.check-tip {
  margin-right: .75rem;
}
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
  background: #ffffff url(./../../../assets/icon/icon_select_blue.png) no-repeat right bottom;
  border-color: #b3d8ff;
}
</style>
<script>
import Axios from 'axios'
import { Swipe, SwipeItem } from 'vant'
import { osGetNoPlate, addAdvClickTimes, selectCurrentAdv, advSearchMsg } from '@/api/url.js'
import { httpPost, httpGet } from '@/utils/restful.js'
import { getQueryString } from '@/utils/formatter.js'
import { XButton, Checker, CheckerItem } from 'vux'
export default {
  components: {
    XButton,
    Checker,
    CheckerItem,
    vanSwipe: Swipe,
    vanSwipeItem: SwipeItem

  },
  data () {
    return {
      ads: [],
      current: 0,
      clientWidth: 0,
      images: [],
      isActive: true,
      departmentId: '',
      payScene: '',
      authCode: '',
      payType: undefined,
      plate: '',
      plateLength: 7,
      showChar: false,
      showLetters: false,
      message: '',
      busyInfo: {
        // 类型
        subType: '',
        shopName: '',
        // 有效期至
        validateAt: ''
      },
      chars1: [
        { id: '1', name: '京' },
        { id: '2', name: '沪' },
        { id: '3', name: '浙' },
        { id: '4', name: '粤' },
        { id: '5', name: '苏' },
        { id: '6', name: '鲁' },
        { id: '7', name: '晋' },
        { id: '34', name: '吉' },
        { id: '8', name: '冀' },
        { id: '9', name: '豫' }
      ],
      chars2: [
        { id: '10', name: '川' },
        { id: '11', name: '渝' },
        { id: '12', name: '辽' },
        { id: '13', name: '黑' },
        { id: '14', name: '皖' },
        { id: '15', name: '鄂' },
        { id: '16', name: '湘' },
        { id: '17', name: '赣' },
        { id: '18', name: '闽' }
      ],
      chars3: [
        { id: '19', name: '陕' },
        { id: '20', name: '甘' },
        { id: '21', name: '宁' },
        { id: '22', name: '蒙' },
        { id: '23', name: '津' },
        { id: '26', name: '桂' },
        { id: '25', name: '云' },
        { id: '24', name: '贵' }
      ],
      chars4: [
        { id: '27', name: '琼' },
        { id: '28', name: '青' },
        { id: '29', name: '新' },
        { id: '30', name: '藏' },
        { id: '31', name: '使' }
      ],
      numbers: [
        { id: '100', name: '0' },
        { id: '101', name: '1' },
        { id: '102', name: '2' },
        { id: '103', name: '3' },
        { id: '104', name: '4' },
        { id: '105', name: '5' },
        { id: '106', name: '6' },
        { id: '107', name: '7' },
        { id: '108', name: '8' },
        { id: '109', name: '9' }
      ],
      letters1: [
        { id: '50', name: 'A' },
        { id: '51', name: 'B' },
        { id: '52', name: 'C' },
        { id: '53', name: 'D' },
        { id: '54', name: 'E' },
        { id: '55', name: 'F' },
        { id: '56', name: 'G' },
        { id: '57', name: 'H' },
        { id: '58', name: 'J' },
        { id: '59', name: 'K' }
      ],
      letters2: [
        { id: '60', name: 'L' },
        { id: '61', name: 'M' },
        { id: '62', name: 'N' },
        { id: '63', name: 'P' },
        { id: '64', name: 'Q' },
        { id: '65', name: 'R' },
        { id: '66', name: 'S' },
        { id: '67', name: 'T' },
        { id: '68', name: 'U' },
        { id: '69', name: 'V' }
      ],
      letters3: [
        { id: '74', name: '港' },
        { id: '75', name: '澳' },
        { id: '70', name: 'W' },
        { id: '71', name: 'X' },
        { id: '72', name: 'Y' },
        { id: '73', name: 'Z' },
        { id: '76', name: '学' },
        { id: '77', name: '领' },
        { id: '99', name: 'DEL' }
      ],
      isNotPlate: false,
      plateType: '1',
      departmentName: undefined
    }
  },
  async created () {
    let self = this
    let adid = 1738536
    this.getInfo()
    // 通过接口请求部门ID对应的部门名称
    Axios.get('https://www.cytingchechang.com/v1/department/' + this.departmentId).then(res => {
      self.departmentName = res.data.data.departmentName
    })
    // 格美特广告接口请求广告内容
    Axios.get('https://ad.gateares.com/ad/adsense/getAd.do', {params: {
      app_key: 'e4426a2764a747739c0917a2c8ad81cy',
      adid: adid,
      goods_name: '粤B12345',
      poi_name: self.departmentId + '_' + self.departmentName, // getQueryString('dep') + '_' + getQueryString('dep'),
      third_merchant_id: 42,
      ip: localStorage.getItem('Ip'),
      ua: navigator.userAgent
    }}).then(async res => {
      let id = res.data.ads[0].ad_creative_id
      // 判断广告是否过期
      let re = await httpPost(selectCurrentAdv, {advId: id, type: '公众号', disLocation: '顶部', departmentId: 1})
      if (re.code === 1) {
        self.ads = res.data.ads
        res.data.ads.map(ele => {
          self.images.push(ele.creative_img.creative_url)
          if (ele.impression_url && ele.impression_url.length > 0) {
            ele.impression_url.map(async ele => {
              await Axios.get(ele)
            })
          }
        })
        let advSearchMsgConfig = {
          type: '公众号',
          disLocation: '顶部',
          disStyle: 0,
          happenEvent: 0,
          advType: '车场设备广告',
          advId: id,
          landingPage: self.ads[0].landing_page,
          advTitle: '',
          advSimpleInfo: '',
          departmentId: 1}
        // 传送广告信息给内部
        httpPost(advSearchMsg, advSearchMsgConfig)
      }
    })

    this.clientWidth = document.body.clientWidth / 750 * 250 + 'px'
    let plate = localStorage.getItem('plate')
    if (plate) {
      const normalPlate = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳]{1}$/
      const newPlate = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}(([0-9]{5}[DF]$)|([DF][A-HJ-NP-Z0-9][0-9]{4}$))/
      if (!(normalPlate.test(plate) || newPlate.test(plate))) {
        this.isNotPlate = true
      }
      this.plate = plate
    }
  },
  methods: {
    async clickAdvertisement (index) {
      let item = this.ads[index]
      if (item.click_url && item.click_url.length > 0) {
        item.click_url.map(async ele => {
          await Axios.get(ele)
        })
      }
      await httpGet(addAdvClickTimes + item.ad_creative_id + '/1/1')
      window.location.href = this.ads[index].landing_page
    },
    onChange (index) {
      this.current = index
    },
    showKeyBroad () {
      let self = this
      if (this.isNotPlate) {
        this.$vux.confirm.show({
          // 组件除show外的属性
          title: '是否切换到有牌车输入?',
          content: '在通道前可自动识别车牌,无需再次扫码',
          onCancel () {
          },
          onConfirm () {
            self.isNotPlate = false
            self.plate = ''
            if (self.plate.length > 0) {
              self.showLetters = true
              self.showChar = false
            } else {
              self.showLetters = false
              self.showChar = true
            }
          }
        })
      } else {
        if (this.plate.length > 0) {
          this.showLetters = true
          this.showChar = false
        } else {
          this.showLetters = false
          this.showChar = true
        }
      }
    },
    hideKeyBoard () {
      this.showChar = false
      this.showLetters = false
    },
    getInfo () {
      var href = window.location.href
      if (href.indexOf('?') > -1) {
        this.departmentId = getQueryString('dep')
        this.payScene = getQueryString('scene')
        this.authCode = getQueryString('code')
        this.payType = getQueryString('pay')
      } else {
        this.$vux.toast.text('连接获取失败!', 'bottom')
      }
    },
    // 汽油车
    gasCar () {
      this.isActive = true
      this.plateLength = 7
    },
    // 新能源
    energyCar () {
      this.isActive = false
      this.plateLength = 8
    },
    handClick (name) {
      let self = this
      if (name === 'DEL') {
        // 刪除判斷
        self.plate = self.plate.substr(0, self.plate.length - 1)
        if (self.plate.length === 0) {
          self.showChar = true
          self.showLetters = false
        }
      } else if (self.plate.length >= self.plateLength) {
        // 車牌長度判斷
        if (self.isActive) {
          // 汽油車
          this.$vux.toast.text('汽油车车牌号码为7位', 'bottom')
        } else {
          this.$vux.toast.text('新能源车牌号码为8位', 'bottom')
        }
      } else if (self.plate === '') {
        // 当选择省份之后切换
        self.plate = name
        self.showChar = false
        self.showLetters = true
      } else {
        self.plate += name
      }
    },
    // 提交验证车牌
    confirm () {
      const normalPlate = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳]{1}$/
      const newPlate = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}(([0-9]{5}[DF]$)|([DF][A-HJ-NP-Z0-9][0-9]{4}$))/
      if (!this.isNotPlate && !(normalPlate.test(this.plate) || newPlate.test(this.plate))) {
        this.$vux.toast.text('请输入正确的车牌号', 'bottom')
      } else {
        localStorage.setItem('plate', this.plate)
        this.$router.push({path: '/ospay/dp/', query: {dep: this.departmentId, scene: this.payScene, code: this.$route.query.code, plateType: this.plateType}})
      }
    },
    handleClickNP () {
      let self = this
      let depId = this.departmentId
      this.$vux.confirm.show({
        // 组件除show外的属性
        title: '确认使用?',
        content: '无牌车预付需要在通道再扫次码确认才能通行',
        onCancel () {
        },
        onConfirm () {
          // 获取无牌车车牌号
          httpPost(osGetNoPlate + '/' + depId).then(res => {
            self.plate = res.data.plate
            self.isNotPlate = true
          }).catch((res) => {
          })
        }
      })
    }
  }
}
</script>

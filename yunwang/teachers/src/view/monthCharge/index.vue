<template>
  <!-- 固定车充值页 -->
  <div id='app' v-cloak>
    <div v-show='loading=== true' style='position: absolute; top: 40%;width:100%;text-align:center;'>
      <img style='width:100px;' src='@/assets/icon/loading.gif' alt='加载动画'>
      <div>加载中....</div>
    </div>
    <div v-show='loading === false'>
      <!-- <step :v-model='active' background-color='#fbf9fe' gutter="20px">
        <step-item title='车牌绑定'></step-item>
        <step-item title='规则选择'></step-item>
      </step> -->
      <!-- 车牌输入 -->
      <div v-show='active == 0'>
        <!-- 车牌 -->
        <header class='plateType'>
          <div class='gasCar' :class='{active:isActive}' @click='gasCar'>汽油车</div>
          <div class='energyCar' :class='{active:!isActive}' @click='energyCar'>新能源</div>
        </header>
        <div class='plate' @click.native='showKeyBroad'>
          <div>车牌号</div>
          <div>{{plate}}</div>
        </div>
      </div>
      <div v-show='active == 1' class='typeOne'>
        <div class='departmentName'>
          <selector title="车场名称" v-model='departmentId' @on-change='handleChange' :options="items" placeholder='请选择'/>
        </div>
        <div class='chargeRules'>
          <div style='padding: 5px'>请选择需要办理的套餐</div>
          <flexbox class='colLine' :gutter='0' wrap="wrap">
            <flexbox-item :span='1/3' :v-if='ruleList != null && ruleList.length > 0'  v-for='(item,index) in ruleList' :key='item.ruleId'  @click.native='handleRuleChange(item,index)'>
              <div v-bind:class="item.flag == 1?(activeIndex == index?'colBox colBoxGreenClick':'colBox colBoxGreen'):(activeIndex == index?'colBox colBoxBlueClick':'colBox colBoxBlue')">
                <p>{{item.monthNumber}}个月</p>
                <p>{{item.monthPrice}}元</p>
              </div>
            </flexbox-item>
            <div v-if='ruleList == null || (ruleList!=null && ruleList.length == 0)' class='colBox colBoxNull'>
              <p>暂无可选套餐</p>
              <p>请至管理处缴费</p>
            </div>
          </flexbox>
        </div>
        <div class='item' v-if='ruleList.length > 0'>
          <x-number title="次数选择" v-model='index' :min='1' @on-change='handleIndexChange' :step='1'></x-number>
        </div>
        <div class='item'>
          <div style='padding: 5px'><span>车位数</span> <span>{{lotNumber}}位</span></div>
        </div>
        <div class='item'>
          <div style='padding: 5px'><span>金额</span> <span class='moneyRmb'>{{money}}元</span></div>
        </div>
        <div class='item'>
          <div style='padding: 5px'><span>到期时间</span> <span class='endTime'>{{date}}</span></div>
        </div>
      </div>
      <div class='buttonGroup'>
        <XButton  type='warning' v-show='active !== 0' @click.native='pre'>上一步</XButton>
        <XButton type="primary" :loading='false' :class='{Width:isWidth}' @click.native='next'>保存</XButton>
      </div>
      <!-- 鍵盤 -->
      <div v-show='active == 0'>
        <div class='keyboard' v-show='showChar'>
          <div style='width:100%; text-align:center;color: white;' @click.native='hideKeyBoard'>
            <i class='el-icon-arrow-down'></i>
          </div>
          <div>
            <div style='text-align: center'>
              <XButton class='keyButton' v-for='(item, index) in chars1' :key='index' @click.native='handClick(item.name)'>{{item.name}}</XButton>
            </div>
            <div style='height:5px'></div>
            <div style='text-align: center'>
              <XButton class='keyButton' v-for='(item, index) in chars2' :key='index' @click.native='handClick(item.name)'>{{item.name}}</XButton>
            </div>
            <div style='height:5px'></div>
            <div style='text-align: center'>
              <XButton class='keyButton' v-for='(item, index) in chars3' :key='index' @click.native='handClick(item.name)'>{{item.name}}</XButton>
            </div>
            <div style='height:5px'></div>
            <div style='text-align: center'>
              <XButton class='keyButton' v-for='(item, index) in chars4' :key='index' @click.native='handClick(item.name)'>{{item.name}}</XButton>
            </div>
            <div style='height:2px'></div>
          </div>
        </div>

        <div class='keyboard' v-show='showLetters'>
          <div style='width:100%; text-align:center;color: white;' @click.native='hideKeyBoard'>
            <i class='el-icon-arrow-down'></i>
          </div>
          <div>
            <div style='text-align: center'>
              <XButton class='keyButton' v-for='(item, index) in numbers' :key='index' @click.native='handClick(item.name)'>{{item.name}}</XButton>
            </div>
            <div style='height:5px'></div>
            <div style='text-align: center'>
              <XButton class='keyButton' v-for='(item, index) in letters1' :key='index' @click.native='handClick(item.name)'>{{item.name}}</XButton>
            </div>
            <div style='height:5px'></div>
            <div style='text-align: center'>
              <XButton class='keyButton' v-for='(item, index) in letters2' :key='index' @click.native='handClick(item.name)'>{{item.name}}</XButton>
            </div>
            <div style='height:5px'></div>
            <div style='text-align: center'>
              <XButton class="keyButton" v-for="(item, index) in letters3" :key="index" @click.native="handClick(item.name)" >
                <span v-if="item.name != 'DEL'"> {{item.name}}</span>
                <span v-else><img style="width:20px; height: 20px; top: 4px; position: relative;" src="@/assets/icon/icon_left.png"/></span>
              </XButton>
            </div>
            <div style='height:2px'></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang='scss' scoped>
[v-cloak] {
  display: none;
}
.colLine {
  margin-bottom: 20px;
}
.colBox {
  margin: 5px;
  padding: 10px 5px;
  border-radius: 15px;
  text-align: center;
  cursor: pointer;
  p {
    padding: 0;
  }
}
.colBoxNull {
  background-color: hsla(220,4%,58%,.1);
  border: 1px solid #909399;
  color: #909399;
}
.colBoxBlue {
  background-color: rgba(64,158,255,.1);
  border: 1px solid #409eff;
  color: #409eff;
}
.colBoxBlueClick {
  background-color: #409eff;
  border: 1px solid #409eff;
  color: white;
}
.colBoxYellow {
  background-color: rgba(230,162,60,.1);
  border: 1px solid #e6a23c;
  color: #e6a23c;
}
.colBoxYellowClick {
  background-color: #e6a23c;
  border: 1px solid #e6a23c;
  color: white;
}
.colBoxGreen {
  background-color: rgba(103,194,58,.1);
  border: 1px solid #67c23a;
  color: #67c23a;
}
.colBoxGreenClick {
  background-color: #7fc05f;
  border: 1px solid #7fc05f;
  color: white;
}
body {
  padding: 0;
  margin: 0;
  background-color: #eeeeee;
  height: 100%;
}

/* 进度条 */

.el-steps {
  display: none;
  padding: 10px;
}

/* 车牌选择 */

.plateType {
  display: flex;
  justify-content: space-around;
  align-items: center;
  font-size: 17px;
  background: white;
}

.plateType div {
  width: 50%;
  text-align: center;
  padding: 15px;
}

.active {
  color: green;
  background-color: #ebf5e6;
  border-bottom: 2px solid green;
}

/* 车牌输入 */

.plate {
  text-align: center;
  padding: 10px;
  background: white;
  margin-top: 10px;
}

.plate div {
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

.plate div:nth-child(1) {
  width: 60px;
  border: none;
}

/* 按鈕組 */

.buttonGroup {
  text-align: center;
  margin-top: .625rem;
  background-color: #ffffff;
  padding: .625rem;
}

.Width {
  width: 80%;
}

/* 鍵盤 */

.keyboard {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: .5rem .125rem .5rem;
  background-color: #bbbaba;
  font-size: 15px;
}

.keyButton {
  width: 9.5%;
  padding: 0;
  display: inline-block;
  font-size: 14px;
  margin: 0 0.5px !important;
  line-height: 30px;
  box-shadow: 1px 1px 1px #8e9393;
  border-radius: 5px;
  background: #ffffff;
}

/* 提示框 */

.el-message {
  min-width: 100% !important;
}

.el-select {
  width: 100% !important;
}

.el-input-number {
  width: 100%;
}

/* 第二步 */
.typeOne {
  background: #ffffff;
  padding: .625rem;
}

.item div {
  padding: 6px 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.moneyRmb {
  color: red;
  font-size: 25px;
}

.endTime {
  color: #e6a23c;
  font-size: 14px !important;
}

.departmentName {
  height: 8.75rem;
  background-image: url('./../../assets/icon/monthly/back-home.jpg');
  background-size: 100% 100% !important;
  .vux-selector {
    width: 65%;
    margin-left: 30%;
  }
}
</style>
<script>
import { XButton, Step, StepItem, Selector, Flexbox, FlexboxItem, XNumber } from 'vux'
import { getMonthInfo, monthPay, getWxUserInfo } from '@/api/url.js'
import { httpGet, httpPost } from '@/utils/restful.js'
export default {
  components: {
    XButton,
    Step,
    StepItem,
    Selector,
    Flexbox,
    FlexboxItem,
    XNumber
  },
  data () {
    return {
      loading: true,
      active: 0,
      selected: 1, // 车牌选择
      isActive: true,
      openId: '',
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
      isWidth: true,
      showChar: true,
      showLetters: false,
      plate: '', // 車牌
      plateLength: 7, // 車牌長度
      items: [],
      departmentId: '',
      lotNumber: 1,
      ruleId: '',
      ruleList: [],
      index: 1,
      money: '0.00',
      selectPrice: '',
      date: '',
      monthNumber: 0,
      dateNumber: '',
      isOtm: '',
      timeDate: '',
      payType: 0,
      activeIndex: 0
    }
  },
  created () {
    // 测试
    // this.plate = '粤B22222'
    // this.next()
    var ua = window.navigator.userAgent.toLowerCase()
    if (ua.indexOf('micromessenger') !== -1) {
      this.payType = 0
    } else {
      this.payType = 1
    }
    // 判断是不是有没那微信code
    let code = this.$route.query.code
    if (code) {
      let account = this.$route.query.account
      if (!account) {
        account = 'wx915008be9bda881b'
      }
      let params = {
        account: account,
        source: 5,
        unicode: code
      }
      httpGet(getWxUserInfo, params).then(res => {
        this.openId = res.data.openid
      }).catch(() => {
      })
    }
  },
  mounted () {
    this.loading = false
  },
  methods: {
    // 下一步
    next () {
      var self = this
      if (self.active === 0) {
        if (this.plate.length === 0) {
          this.$vux.toast.text('车牌输入不可为空', 'bottom')
        } else {
          var Eng = this.plate.slice(1, 2)
          if (!Eng.match(/^[A-Z0]{1}$/)) {
            this.$vux.toast.text('车牌第二位应为英文字母或者为0', 'bottom')
          } else {
            this.isWidth = false
            // 提交车牌号码
            httpGet(getMonthInfo, {plate: self.plate}).then(res => {
              var result = res
              if (result.code === 1) {
                if (result.data.length > 0) {
                  if (self.active++ > 1) self.active = 2
                  self.items = result.data
                  self.ruleList = self.items[0].ruleList
                  self.departmentId = self.items[0].id
                  for (let i = 0; i < self.items.length; i++) {
                    self.items[i].key = self.items[i].id
                    self.items[i].value = self.items[i].departmentName
                  }
                  // self.ruleIdArray = result.data
                  // self.monthNumber = self.items[0].monthNumber
                  // self.ruleId = self.ruleIdArray[0].ruleId
                  // self.ruleLabel = '包' + self.ruleIdArray[0].monthNumber + '个月，收费' + self.ruleIdArray[0].monthPrice + '元'
                  self.ruleId = self.ruleList[0] != null ? self.ruleList[0].ruleId : 0
                  self.selectPrice = self.ruleList[0] != null ? self.ruleList[0].monthPrice : 0
                  self.date = self.formattertTime(self.items[0].endTime)
                  self.dateNumber = self.formattertTime(self.items[0].endTime)
                  self.isOtm = self.items[0].isOtm
                  // 判断是0 4G车场还是 1 一位多车 2 盒子模式
                  if (self.items[0].isOtm === 0) {
                    self.lotNumber = 1
                  } else {
                    self.lotNumber = self.items[0].carTal
                  }
                  self.money = (self.index * self.selectPrice * self.lotNumber).toFixed(2)
                } else {
                  this.$vux.toast.text('暂无记录，请退出', 'bottom')
                }
              } else {
                this.$vux.toast.text(result.message, 'bottom')
              }
            }).catch((message) => {
              this.$vux.toast.text(message, 'bottom')
            })
          }
        }
      } else if (self.active === 1) {
        // 判断微信还是支付宝
        let data = {
          plate: self.plate,
          ruleId: self.ruleId,
          index: self.index,
          isOtm: self.isOtm,
          departmentId: self.departmentId,
          payType: self.payType,
          openId: this.openId
        }
        httpPost(monthPay, data).then(res => {
          var result = res
          if (result.code === 1) {
            window.location.href = result.data
          } else {
            this.$vux.toast.text(result.message, 'bottom')
          }
        }).catch((message) => {
          this.$vux.toast.text(message, 'bottom')
        })
      }
    },
    // 上一步
    pre () {
      if (this.active-- === 0) this.active = 0
      if (this.active === 0) this.isWidth = true
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
          // self.$message.error({
          //   message: '汽油车车牌号码为7位',
          //   showClose: true,
          // })
          this.$vux.toast.text('汽油车车牌号码为7位', 'bottom')
        } else {
          // self.$message.error({
          //   message: '新能源车牌号码为8位',
          //   showClose: true,
          // })
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
    // 次数选择
    handleIndexChange () {
      var self = this
      // console.log(self.ruleList)
      if (self.timeDate === '') {
        self.timeDate = self.date
      }
      if (self.ruleId === '') {
        // self.$message.error({
        //   message: '收费规则不可为空',
        //   showClose: true,
        // })
        this.$vux.toast.text('请选择一种套餐', 'bottom')
      } else {
        self.money = (self.index * self.selectPrice * self.lotNumber).toFixed(2)
        let year = self.formattertTime(self.timeDate).split('-')[0]
        let month = Number(self.formattertTime(self.timeDate).split('-')[1]) + self.index * (self.selectNumber === undefined ? self.ruleList[0].monthNumber : self.selectNumber)
        console.log(month)
        if (month > 12) {
          let num = parseInt(month / 12)
          year = Number(year) + (num = month % 12 === 0 ? num - 1 : num)
          month = month % 12 === 0 ? 12 : month % 12
        }
        if (month < 10) {
          month = '0' + month
        }
        self.date = year + '-' + month + '-' + self.formattertTime(self.timeDate).split('-')[2]
      }
    },
    handleChange () {
      var self = this
      for (var i = 0; i < self.items.length; i++) {
        if (self.departmentId === self.items[i].id) {
          self.activeIndex = 0
          self.ruleList = self.items[i].ruleList
          self.ruleId = self.ruleList[i] != null ? self.ruleList[i].ruleId : 0
          // self.ruleLabel = '包' + self.items[i].monthNumber + '个月，收费' + self.items[i].monthPrice + '元'
          self.selectPrice = self.items[i].monthPrice
          self.date = self.formattertTime(self.items[i].endTime)
          self.dateNumber = self.formattertTime(self.items[i].endTime)
          // self.monthNumber = self.items[i].monthNumber
          self.lotNumber = self.items[i].carTal
          // self.ruleId = self.items[i].ruleId
          self.isOtm = self.items[i].isOtm
          if (self.items[i].isOtm === 0) {
            self.lotNumber = 1
          } else {
            self.lotNumber = self.items[i].carTal
          }
          self.selectPrice = self.ruleList[0] != null ? self.ruleList[0].monthPrice : 0
          self.money = (self.index * self.selectPrice * self.lotNumber).toFixed(2)
          self.timeDate = self.items[i].endTime
          let year = self.formattertTime(self.timeDate).split('-')[0]
          let month = Number(self.formattertTime(self.timeDate).split('-')[1]) + self.index * (self.ruleList[0] != null ? self.ruleList[0].monthNumber : 0)
          if (month > 12) {
            let num = parseInt(month / 12)
            year = Number(year) + (num = month % 12 === 0 ? num - 1 : num)
            month = month % 12 === 0 ? 12 : month % 12
          }
          if (month < 10) {
            month = '0' + month
          }
          self.date = year + '-' + month + '-' + self.formattertTime(self.timeDate).split('-')[2]
          break
        }
      }
    },
    handleRuleChange (item, index) {
      console.info(item)
      var self = this
      self.activeIndex = index
      self.ruleId = item.ruleId
      if (self.timeDate === '') {
        self.timeDate = self.date
      }
      for (var i = 0; i < self.ruleList.length; i++) {
        if (self.ruleId === self.ruleList[i].ruleId) {
          self.selectPrice = self.ruleList[i].monthPrice
          self.selectNumber = self.ruleList[i].monthNumber
          break
        }
      }
      self.money = (self.index * self.selectPrice * self.lotNumber).toFixed(2)
      let year = self.formattertTime(self.timeDate).split('-')[0]
      let month = Number(self.formattertTime(self.timeDate).split('-')[1]) + self.index * self.selectNumber
      if (month > 12) {
        let num = parseInt(month / 12)
        year = Number(year) + (num = month % 12 === 0 ? num - 1 : num)
        month = month % 12 === 0 ? 12 : month % 12
      }
      if (month < 10) {
        month = '0' + month
      }
      self.date = year + '-' + month + '-' + self.formattertTime(self.timeDate).split('-')[2]
    },
    // 格式化日期
    formattertTime (data) {
      var self = this
      var time = new Date(data)
      var y = time.getFullYear()
      var m = time.getMonth() + 1
      var d = time.getDate()
      var hh = time.getHours()
      var mm = time.getMinutes()
      var ss = time.getSeconds()
      return y + '-' + self.add0(m) + '-' + self.add0(d) + ' ' + self.add0(hh) + ':' + self.add0(mm) + ':' + self.add0(ss)
    },
    add0 (m) {
      return m < 10 ? '0' + m : m
    },
    hideKeyBoard () {
      this.showChar = false
      this.showLetters = false
    },
    showKeyBroad () {
      if (this.plate.length > 0) {
        this.showLetters = true
        this.showChar = false
      } else {
        this.showLetters = false
        this.showChar = true
      }
    }
  }
}
</script>

<template>
  <!-- 预付 -->
  <div id="app" v-cloak>
    <!-- 车牌选择 -->
    <header>
      <div class="gasCar" :class="{active:isActive}"  @click="gasCar">汽油车</div>
      <div class="energyCar" :class="{active:!isActive}"  @click="energyCar">新能源</div>
    </header>
    <main @click="showKeyBroad">
      <div>车牌号</div>
      <div>{{plate}}</div>
    </main>
    <div v-if="message">
      <el-alert type="success" title="提示" :description="message" show-icon>
      </el-alert>
    </div>
    <div style="margin-top:18px" align="center">
        <button style="width:95%;margin:0px;height:40px;line-height: 40px;border-radius: 10px; background: #67c23a;color:white" @click="confirm">
          查看订单
        </button>
    </div>
    <footer>
      <div class="keyboard" v-show="showChar">
        <div style="width:100%; text-align:center;color: white;" @click="hideKeyBoard">
          <i class="el-icon-arrow-down"></i>
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
          <i class="el-icon-arrow-down"></i>
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
  margin-top: 10px;
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
</style>
<script>
export default {
  data () {
    return {
      isActive: true,
      departmentId: '',
      payScene: '',
      authCode: '',
      payType: 5,
      plate: '',
      plateLength: 7,
      showChar: true,
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
      ]
    }
  },
  created () {
    this.getInfo()
  },
  methods: {
    showKeyBroad () {
      if (this.plate.length > 0) {
        this.showLetters = true
        this.showChar = false
      } else {
        this.showLetters = false
        this.showChar = true
      }
    },
    hideKeyBoard () {
      this.showChar = false
      this.showLetters = false
    },
    getInfo () {
      var href = window.location.href
      if (href.indexOf('?') > -1) {
        this.departmentId = href.split('?')[1].split('&')[0].split('=')[1]
        this.payScene = href.split('?')[1].split('&')[2].split('=')[1]
        this.authCode = href.split('&')[3].split('=')[1]
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
      if (!(normalPlate.test(this.plate) || newPlate.test(this.plate))) {
        this.$vux.toast.text('请输入正确的车牌号', 'bottom')
      } else {
        this.$router.push({path: '/CYWeChatPay/directPay/index/', query: {d: this.departmentId, s: this.payScene, p: this.plate, code: this.authCode}})
      }
    }
  }
}
</script>

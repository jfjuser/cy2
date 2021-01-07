var vm = new Vue({
  el: "#app",
  data() {
    return {
      // host: 'https://beta.cytingchechang.com/',
      host: 'https://www.cytingchechang.com/',
      isActive: true,
      code: "",
      type: "",
      plate: "",
      plateLength: 7,
      showChar: true,
      showLetters: false,
      message: '',
      busyInfo: {
        // 类型
        subType: "",
        shopName: "",
        // 有效期至
        validateAt: ""
      },
      chars1: [
        { id: "1", name: "京" },
        { id: "2", name: "沪" },
        { id: "3", name: "浙" },
        { id: "4", name: "粤" },
        { id: "5", name: "苏" },
        { id: "6", name: "鲁" },
        { id: "7", name: "晋" },
        { id: "34", name: "吉" },
        { id: "8", name: "冀" },
        { id: "9", name: "豫" }
      ],
      chars2: [
        { id: "10", name: "川" },
        { id: "11", name: "渝" },
        { id: "12", name: "辽" },
        { id: "13", name: "黑" },
        { id: "14", name: "皖" },
        { id: "15", name: "鄂" },
        { id: "16", name: "湘" },
        { id: "17", name: "赣" },
        { id: "18", name: "闽" }
      ],
      chars3: [
        { id: "19", name: "陕" },
        { id: "20", name: "甘" },
        { id: "21", name: "宁" },
        { id: "22", name: "蒙" },
        { id: "23", name: "津" },
        { id: "26", name: "桂" },
        { id: "25", name: "云" },
        { id: "24", name: "贵" }
      ],
      chars4: [
        { id: "27", name: "琼" },
        { id: "28", name: "青" },
        { id: "29", name: "新" },
        { id: "30", name: "藏" },
        { id: "31", name: "使" }
      ],
      numbers: [
        { id: "100", name: "0" },
        { id: "101", name: "1" },
        { id: "102", name: "2" },
        { id: "103", name: "3" },
        { id: "104", name: "4" },
        { id: "105", name: "5" },
        { id: "106", name: "6" },
        { id: "107", name: "7" },
        { id: "108", name: "8" },
        { id: "109", name: "9" }
      ],
      letters1: [
        { id: "50", name: "A" },
        { id: "51", name: "B" },
        { id: "52", name: "C" },
        { id: "53", name: "D" },
        { id: "54", name: "E" },
        { id: "55", name: "F" },
        { id: "56", name: "G" },
        { id: "57", name: "H" },
        { id: "58", name: "J" },
        { id: "59", name: "K" }
      ],
      letters2: [
        { id: "60", name: "L" },
        { id: "61", name: "M" },
        { id: "62", name: "N" },
        { id: "63", name: "P" },
        { id: "64", name: "Q" },
        { id: "65", name: "R" },
        { id: "66", name: "S" },
        { id: "67", name: "T" },
        { id: "68", name: "U" },
        { id: "69", name: "V" }
      ],
      letters3: [
        { id: "74", name: "港" },
        { id: "75", name: "澳" },
        { id: "70", name: "W" },
        { id: "71", name: "X" },
        { id: "72", name: "Y" },
        { id: "73", name: "Z" },
        { id: "76", name: "学" },
        { id: "77", name: "领" },
        { id: "99", name: "DEL" }
      ]
    };
  },
  created() {
    this.getUserInfo()
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
    getUserInfo () {
      var href = window.location.href
      if(href.indexOf('?')>-1){
        this.code = href.split("?")[1].split("&")[0].split("=")[1];
        this.type = href.split("?")[1].split("&")[1].split("=")[1];
        this.getInfo()
      } else {
        this.$message.error('连接获取失败！')
      }
    },
    // 格式化时间戳
    timeFormatter(time) {
      let result = "-";
      if (time && time !== null) {
        let date = new Date(time);
        let year = date.getFullYear();
        let month =
          date.getMonth() + 1 < 10
            ? "0" + (date.getMonth() + 1)
            : date.getMonth() + 1;
        let day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
        let hour =
          date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
        let minutes =
          date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
        let seconds =
          date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
        result = year +  "-" + month + "-" + day + " " + hour + ":" + minutes + ":" + seconds;
      }
      return result;
    },
    // 获取车场信息
    getInfo() {
      axios({
          url: this.host + "pb/pv/v1/ticket/bingding/info",
          method: "GET",
          params: {
            code: this.code,
            type: this.type
          }
        })
        .then(res => {
          if (res.status === 200 && res.data.code === 1) {
            this.busyInfo = Object.assign({}, res.data.data);
          } else if (res.status === 200 && res.data.code === -1) {
            this.$message.error(res.data.message);
          } else {
            this.$message.error("获取失败");
          }
        })
        .catch((err) => {
          this.$message.error('服务器异常，请稍后再试')
        });
    },
    // 汽油车
    gasCar() {
      this.isActive = true;
      this.plateLength = 7;
    },
    // 新能源
    energyCar() {
      this.isActive = false;
      this.plateLength = 8;
    },
    handClick(name) {
      let self = this;
      if (name == "DEL") {
        // 刪除判斷
        self.plate = self.plate.substr(0, self.plate.length - 1);
        if (self.plate.length == 0) {
          self.showChar = true;
          self.showLetters = false;
        }
      } else if (self.plate.length >= self.plateLength) {
        // 車牌長度判斷
        if (self.isActive) {
          // 汽油車
          self.$message.error({
            message: "汽油车车牌号码为7位",
            showClose: true
          });
        } else {
          self.$message.error({
            message: "新能源车牌号码为8位",
            showClose: true
          });
        }
      } else if (self.plate == "") {
        // 当选择省份之后切换
        self.plate = name;
        self.showChar = false;
        self.showLetters = true;
      } else {
        self.plate += name;
      }
    },
    // 提交验证车牌
    confirm () {
      const normalPlate = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳]{1}$/
      const newPlate = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}(([0-9]{5}[DF]$)|([DF][A-HJ-NP-Z0-9][0-9]{4}$))/
      if (!(normalPlate.test(this.plate) || newPlate.test(this.plate))) {
        this.$message.warning("请输入正确的车牌号");
      } else {
        axios({
          method: "POST",
          url: this.host + "pv/v1/ticket/bingding",
          data: {
            code: this.code,
            type: this.type,
            plate: this.plate
          }
        })
          .then(res => {
            if (res.status === 200 && res.data.code === 1) {
              // if (WeixinJSBridge) WeixinJSBridge.invoke('closeWindow', {}, function (res) {})
              location.href = './tip.html'
              // this.$message.success(res.data.message);
            } else if (res.status === 200 && res.data.code === -1) {
              this.$message.error(res.data.message);
            } else {
              this.$message.error("获取失败");
            }
          })
          .catch(error => {
            this.$message.error("服务器异常，请稍后再试");
          });
      }
    }
  }
});
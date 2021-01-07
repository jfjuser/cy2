new Vue({
  el: '#app',
  data() {
    return {
      // host: 'https://beta.cytingchechang.com/',
      host: 'https://www.cytingchechang.com/',
      code: undefined,
      params: {
        departmentName: '正在查询..',
        plate: '正在查询..',
        inTime: '正在查询..',
        queryTime: '正在查询..',
        duration: '正在查询..',
        price: '正在查询..'
      },
      flag: false,
      loading: false,
      disabled: false,
      btnText: '支付'
    }
  },
  mounted () {
    this.getOrder()
  },
  methods: {
    //获取订单
    getOrder() {
      let query = window.location.href.split('?')[1]
      query = decodeURIComponent(query)
      var objData = query.split('=')[1]
      objData = objData.replace(/%3A/g, ':');
      this.params = JSON.parse(objData)
      if (this.params.price == 0 || this.params.plate.length <= 6) {
        var confirm = window.confirm('当前应付金额为0，请退出！')
        if (confirm ) {
          this.flag = false
          window.history.go(-1);
        } else {
          this.flag = false
          window.history.go(-1);
        }
      } else {
        this.flag = true
        axios({
          method: 'GET',
          url: this.host + 'pb/pv/v1/yunPay/getUserCode',
          params: this.params
        }).then(res => {
          if (res.data.code === 1) {
            this.params.authCode = res.data.data
          } else {
            alert(res.data.message)
          }
        }).catch(() => {
          this.params.price = 0
          alert('服务器连接失败')
        })
      }
    },
    // 微信支付
    weixinPay: function () {
      var vm = this;
      if (!vm.disabled) {
        vm.btnText = '请求中...'
        vm.disabled = true
        axios({
          method: 'POST',
          url: this.host + 'pv/v1/yunPay/scenePay',
          data: this.params
        }).then(res => {
          if (res.data.code === 1) {
            vm.btnText = '支付中...'
            vm.disabled = true
            let data = res.data.data
            if (typeof WeixinJSBridge == "undefined") {
              if (document.addEventListener) {
                document.addEventListener('WeixinJSBridgeReady', vm.onBridgeReady(data), false);
              } else if (document.attachEvent) {
                document.attachEvent('WeixinJSBridgeReady', vm.onBridgeReady(data));
                document.attachEvent('onWeixinJSBridgeReady', vm.onBridgeReady(data));
              }
              // vm.disabled = false
            } else {
              vm.onBridgeReady(data)
            }
          } else {
            alert(res.data.message)
            vm.disabled = false
          }
        }).catch(() => {
          alert('服务器错误，请稍后再试！')
          vm.disabled = false
        })
      }
    },

    onBridgeReady: function (data) {
      var vm = this;
      let timeStamp = "" + data.timeStamp + ""
      WeixinJSBridge.invoke(
        'getBrandWCPayRequest', {
          "appId": data.appId,
          "timeStamp": timeStamp,
          "nonceStr": data.nonceStr,
          "package": data.pack,
          "signType": data.signType,
          "paySign": data.paySign,
        },
        function (res) {
          if (res.err_msg == "get_brand_wcpay_request:ok") {
            let paramsJson = encodeURIComponent(JSON.stringify(Object.assign(vm.params, {payTime: vm.formatterTime()})))
            window.location.href = `./tip.html?paramas = ${paramsJson}`
          } else {
            vm.btnText = '支付已取消,点击重试'
            vm.disabled = false
          }
        }
      );
    },
    formatterTime() {
      let date = new Date()
      let year = date.getFullYear()
      let month = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)
      let day = (date.getDate()) < 10 ? '0' + (date.getDate()) : (date.getDate())
      let hour = (date.getHours()) < 10 ? '0' + (date.getHours()) : (date.getHours())
      let minutes = (date.getMinutes()) < 10 ? '0' + (date.getMinutes()) : (date.getMinutes())
      let result = year + '-' + month + '-' + day + ' ' + hour + ':' + minutes
      return result
    }
  }
})
new Vue({
  el: '#app',
  data () {
    return{
      host: 'https://www.cytingchechang.com/',
      // host: 'https://beta.cytingchechang.com/',
      code: undefined,
      params: {
        departmentName: '正在查询..',
        plate: '正在查询..',
        inTime: '正在查询..',
        queryTime: '正在查询..',
        duration: '正在查询..',
        price: '正在查询..'
      },
      isShow: false,
      disabled: false,
      btnText: '支付'
    }
  },
  mounted () {
    this.getAppId()
  },
  methods: {
    getAppId(){
      let url = window.location.href
      if (url.indexOf('?') > -1) {
        var a = url.split('?')[1]
        let data = {
          authCode: a.split('&')[3].split('=')[1],
          payType: 5
        }
        axios({
          method: 'GET',
          url: this.host + 'pb/pv/v1/yunPay/getUserCode',
          params: data
        }).then(res => {
          if (res.data.code === 1) {
            this.params.authCode = res.data.data
            this.getOrder()
          } else {
            alert(res.data.message)
          }
        }).catch(() => {
          alert('服务器连接失败')
        })
      }
    },
    //获取订单
    getOrder(){
      let url = window.location.href
      if(url.indexOf('?') > -1) {
        var a = url.split('?')[1]
        let data = {
          departmentId: Number(a.split('&')[0].split('=')[1]),
          outChannelId: a.split('&')[1].split('=')[1],
          payScene: Number(a.split('&')[2].split('=')[1]),
          payType: 5,
          authCode: this.params.authCode
        }
        axios({
          method: 'POST',
          url: this.host + 'pb/pv/v1/yunPay/queryFee',
          data
        }).then(res => {
          if(res.data.code === 1) {
            this.params = Object.assign(data, res.data.data)
            if (this.params.price == 0 || this.params.plate.length <= 6) {
              var confirm = window.confirm('当前应付金额为0元，请退出！')
              if (confirm) {
                if (WeixinJSBridge) WeixinJSBridge.invoke('closeWindow', {}, function (res) {})
              } else {
                if (WeixinJSBridge) WeixinJSBridge.invoke('closeWindow', {}, function (res) {})
              }
            } else {
              this.isShow = true
            }
          } else {
            this.isShow = false
            alert(res.data.message)
          }
        }).catch(err => {
          this.isShow = false
          alert('服务器连接失败')
        })
      } else {
        this.isShow = false
        alert('链接返回错误!')
        if (WeixinJSBridge) WeixinJSBridge.invoke('closeWindow', {}, function (res) {})
      }
    },
    // 微信支付
    weixinPay: function(){
      var vm= this;
      if (!vm.disabled) {
        vm.btnText = '请求中...'
        vm.disabled = true
        axios({
          method: 'POST',
          url: this.host + 'pv/v1/yunPay/scenePay',
          data: this.params
        }).then(res => {
          if(res.data.code === 1) {
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
              vm.onBridgeReady(data);
            }
          } else {
            alert(res.data.message)
            vm.btnText = '失败重试'
            vm.disabled = false
          }
        }).catch(() => {
          alert('服务器错误，请稍后再试！')
          vm.btnText = '支付'
          vm.disabled = false
        })
      }
    },
    // timeFormatter (time) {
    //   let result = '-'
    //   if (time && time !== null) {
    //     let date = new Date(time)
    //     let year = date.getFullYear()
    //     let month = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)
    //     let day = (date.getDate()) < 10 ? '0' + (date.getDate()) : (date.getDate())
    //     let hour = (date.getHours()) < 10 ? '0' + (date.getHours()) : (date.getHours())
    //     let minutes = (date.getMinutes()) < 10 ? '0' + (date.getMinutes()) : (date.getMinutes())
    //     let seconds = (date.getSeconds()) < 10 ? '0' + (date.getSeconds()) : (date.getSeconds())
    //     result = year + '-' + month + '-' + day + ' ' + hour + ':' + minutes + ':' + seconds
    //   }
    //   return result
    // },
    onBridgeReady:function(data){
      var vm = this;
      let timeStamp = "" + data.timeStamp + ""
      WeixinJSBridge.invoke(
        'getBrandWCPayRequest',{
          "appId":data.appId,
          "timeStamp": timeStamp,
          "nonceStr":data.nonceStr,
          "package":data.pack,
          "signType":data.signType,
          "paySign":data.paySign,
        },
        function(res){
          if (res.err_msg == "get_brand_wcpay_request:ok" ){
            vm.btnText = '支付成功'
            let paramsJson = encodeURIComponent(JSON.stringify(Object.assign(vm.params, {payTime: vm.formatterTime()})))
            window.location.href = `./tip.html?paramas = ${paramsJson}`
          } else {
            vm.btnText = '支付已取消,点击重试'
            vm.disabled = false
          }
        }
      );
    },
    formatterTime () {
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
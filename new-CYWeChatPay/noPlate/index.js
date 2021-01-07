new Vue({
  el: '#app',
  data () {
    return{
      host: 'https://www.cytingchechang.com',
      // host: 'https://beta.cytingchechang.com',
      appid: ''
    }
  },
  created () {
    // 获取openId
    this.getAppId()
  },
  methods: {
    getAppId() {
      let url = window.location.href
      if (url.indexOf('?') > -1) {
        var a = url.split('?')[1]
        let data = {
          authCode: a.split('&')[3].split('=')[1],
          payType: 5
        }
        axios({
          method: 'GET',
          url: this.host + '/pb/pv/v1/yunPay/getUserCode',
          params: data
        }).then(res => {
          if (res.data.code === 1) {
            this.appid = res.data.data
          } else {
            alert(res.data.message)
          }
        }).catch(() => {
          alert('服务器连接失败')
        })
      }
    },
    init () {
      let url = window.location.href
      if (url.indexOf('?') !== -1) {
        var a = url.split('?')[1]
        let data = {
          departmentId: Number(a.split('&')[0].split('=')[1]),
          channelId: a.split('&')[1].split('=')[1],
          authCode: this.appid,
          payType: 5
        }
        axios({
          method: 'POST',
          url: this.host + '/pb/pv/v1/yunPay/noPlateIn',
          data
        }).then(res => {
          if(res.data.code === 1) {
            location.href = './tip.html'
          } else {
            alert(res.data.message)
          }
        }).catch(() => {
          alert('获取订单失败')
        })
      }
    }
  }
})
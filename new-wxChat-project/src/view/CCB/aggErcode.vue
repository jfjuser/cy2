<template>
<!-- 聚合支付-扫码支付 -->
<div>
  <!-- 扫码直付 -->
  <div id="content">
    <div id="head">
      <div>
        <img class="img-logo" src="@/assets/ccb/jianshe.png" alt="支付" height="60px" width="50px">
        <img class="img-logo" style="width: 256px" src="@/assets/ccb/jianshe1.png" alt="中国建设银行" height="50px" width="60px">
      </div>
      <div id="head_tip">聚合-扫码支付</div>
    </div>

    <div id="ercode" style="z-index: 10000;">
      <div id="erCodeImg" style="text-align: center;padding: 10px;background: white"></div>
    </div>
    <div id="detail" style="text-align: center">
      <p id="plate"></p>
      <p id="price"></p>
      <p id="tips"></p>
    </div>
    <div class="icon-center">
      <div class="icon">
        <div style="text-align: center">
          <img class="img-logo" src="@/assets/ccb/jianshe.png" alt="支付" height="48px" width="48px">
        </div>
        <p class="icon-title">龙支付</p>
      </div>
      <div class="icon">
        <div style="text-align: center">
          <img class="img-logo" src="@/assets/ccb/cash.png" alt="银联支付" height="48px" width="48px">
        </div>
        <p class="icon-title">银联支付</p>
      </div>
      <div class="icon">
        <div style="text-align: center">
          <img class="img-logo" src="@/assets/ccb/wechat.png" alt="微信支付" height="48px" width="48px">
        </div>
        <p class="icon-title">微信支付</p>
      </div>
      <div class="icon">
        <div style="text-align: center">
          <img class="img-logo" src="@/assets/ccb/epay.png" alt="支付宝支付" height="48px" width="48px">
        </div>
        <p class="icon-title">支付宝支付</p>
      </div>
    </div>
  </div>

  <div id="modal-select" class="modal fade" data-backdrop="static" data-keyboard="false" aria-hidden="true" aria-labelledby="myModalLabel">
    <div class="modal-dialog modal-sm">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title" id="myModalLabel" style="text-align: center;">选择通道</h4>
        </div>
        <div class="modal-body form-horizontal">
          <form>
            <div class="form-group">
              <label class="control-label col-md-3">通道</label>
              <div class="col-md-8">
                <select name="local_id" id="Local_id" class="form-control">
                </select>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" onclick="formSubmit()" class="btn btn-success">确定</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</div>
</template>
<style lang="scss" scoped>
html {
  height: 100%;
}
body {
  height: 100%;
  width: 100%;
  background-color: #0d0d0d;
  background-size: 100% 100%;
}
p {
  margin: 0;
  margin-top: 5px;
  padding: 0;
}
#content {
  width: 100%;
  height: 100%;
  background-image: url(./../../assets/ccb/bg-agg.png) !important;
  background-size: cover;
}
#ercode {
  margin: 10px auto;
}
#erCodeImg {
  width: 420px;
  height: 420px;
  margin: auto;
}
#erCodeImg img {
  margin: 0 auto !important;
}
#head_tip {
  font-weight: bold;
  color: darkgreen;
  font-size: 22px;
}
#detail {
  margin: 0 auto;
  width: 400px;
  font-size: 20px;
  color: black;
}
#plate {
  color: black;
  font-weight: bold;
  font-size: 30px;
}
#head {
  font-size: 20px;
  color: black;
  padding: 10px;
  text-align: right;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
#tips {
  color: darkslategray;
  font-size: 15px;
  font-weight: bold;
}
#price {
  color: green;
  font-weight: bold;
  font-size: 30px;
}
.icon-center {
  display: flex;
  justify-content: space-between;
  width: 50%;
  margin: 10px auto 0;
}
.icon-title {
  text-align: center;
  font-weight: bold;
  font-size: 15px;
}
</style>
<script>
// import QRcode from 'qrcodejs2'
// import { ccbLogin } from '@/api/url.js'
// import { httpGet } from '@/utils/restful.js'
export default {
  // data () {
  //   return {
  //     // 屏幕适应
  //     clientWidth: document.body.clientWidth,
  //     clientHeight: document.body.clientHeight,
  //     cookie: undefined,
  //     departmentId: undefined,
  //     localId: undefined,
  //     websocket: 'wss://www.cytingchechang.com/ws/CCBAGGERCODE',
  //     wsSuccess: true,
  //     url: location.href,
  //     qrCode: undefined,
  //     ws: undefined
  //   }
  // },
  // created () {
  //   $("#erCodeImg").hide()
  //   let url = location.href
  //   if (url.indexOf('?') > -1) {
  //     departmentId = url.split('?')[1].split('&')[0].split('=')[1]
  //     cookie = url.split('?')[1].split('&')[1].split('=')[1]
  //     getLocal(departmentId, cookie)
  //     bodyScale();
  //   } else {
  //     alert('地址无效，请重新登录！')
  //   }
  //   window.setInterval(function () {
  //       if(wsSuccess == false){
  //         console.log("断线重连中...");
  //         ws = connectServer(localId);
  //       }
  //   }, 5000)
  // },
  // mounted () {
  //   window.onresize = () => {
  //     return (() => {
  //       bodyScale()
  //     })()
  //   }
  // },
  // methods: {
  //   bodyScale () {
  //     var devicewidth = document.body.clientWidth;
  //     var scale = devicewidth / 640;
  //     if (devicewidth > 1024) {
  //       scale = devicewidth / 1366;
  //     }
  //     document.body.style.zoom = scale;
  //   },
  //   getLocal (departmentId, cookie) {
  //     // beforeSend: function (request) {
  //     //     request.setRequestHeader('AdminToken', cookie)
  //     //   },
  //     httpGet(getTcpTokenList + '/' + departmentId).then(res => {
  //       if (res.code === 1) {
  //           if (res.data === null || res.data.length < 1) {
  //             alert('暂无通道，请先配置通道!')
  //           } else {
  //             var html = ''
  //             for (var i = 0; i < res.data.length; i++) {
  //               html += '<option value="' + res.data[i].localId + '">' + res.data[i].localName + '</option>'
  //             }
  //             $('#Local_id').html(html)
  //             $('#modal-select').modal('show')
  //           }
  //         }
  //     }).catch(() => {})
  //   },
  //   formSubmit() {
  //     var data = $('#Local_id').val()
  //     console.log(data)
  //     if (data === '' || data === null || data === 'undefined') {
  //       alert('请先选择通道')
  //     } else {
  //       localId = data
  //       this.connectWebsocket(data)
  //     }
  //   },
  //   // 生成二维码
  //   createQrCode () {
  //     qrCode = new QRCode('erCodeImg', {
  //       text: '',
  //       width: 400, //生成的二维码的宽度
  //       height: 400, //生成的二维码的高度
  //       colorDark: "#000000", // 生成的二维码的深色部分
  //       colorLight: "#fff", //生成二维码的浅色部分
  //       correctLevel: QRCode.CorrectLevel.H
  //     })
  //   },
  //   connectWebsocket (data) {
  //     if (window.WebSocket) {
  //       ws = connectServer(data);
  //       $('#modal-select').modal('hide')
  //     } else {
  //       alert('您的浏览器暂时不支持动态二维码展示，可尝试换谷歌浏览器!')
  //     }
  //   },
  //   // 创建websocket链接
  //   connectServer (localId) {
  //     if (this.ws != null) {
  //       this.ws.close()
  //     }
  //     this.ws = new WebSocket(websocket + departmentId + localId);
  //     this.ws.onopen = function () {
  //       wsSuccess = true;
  //       $("#tips").text("当前正在监听车辆出场...")
  //     };
  //     this.ws.onmessage = function (res) {
  //       var result = JSON.parse(res.data)
  //       var data = result.data
  //       if (data != null) {
  //         if (data.type == 1) {
  //           //支付信息
  //           $("#plate").text("===" + data.plate + "===")
  //           $("#price").text("收费【" + data.price + "】元")
  //           currentPlate = data.plate
  //           if (result.code === 1) {
  //             $("#erCodeImg").show()
  //             qrCode.makeCode(data.pay_url)
  //             $("#tips").text("温馨提示：请认准车牌后再扫码支付！")
  //           } else {
  //             //失败
  //             $("#erCodeImg").hide();
  //             $("#tips").text(result.message)
  //           }
  //         } else {
  //           //出场信息
  //           if (currentPlate == data.plate) {
  //             $("#erCodeImg").hide()
  //             $("#price").text("【缴费成功】")
  //             $("#tips").text("当前正在监听车辆出场...")
  //           }
  //         }
  //         $.ajax({
  //           url: host + '/v1/ccb/push',
  //           dataType: 'JSON',
  //           data: {
  //             successKey: 'CCBAGGKEY' + departmentId + localId + data.plate + data.type
  //           },
  //           method: 'GET',
  //           beforeSend: function (request) {
  //             request.setRequestHeader('AdminToken', cookie)
  //           },
  //           complete: function (){}
  //         })
  //       }
  //     };
  //     // 链接失败
  //     this.ws.onerror = function (err) {
  //       this.wsSuccess = false
  //     }
  //     this.ws.onclose = function () {
  //       this.wsSuccess = false
  //     }
  //   }
  // }
}
</script>

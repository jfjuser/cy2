<template>
  <!-- 支付成功提示页 -->
  <div id="app" >
    <div class="header" style="display: flex;align-items: center;padding: 10px;">
      <img style="width:30px;" src="@/assets/icon/success.png" alt="成功">
      <span style="color:green;text-indent:0.5rem;font-weight:900">支付成功</span>
    </div>
    <div class="main">
      <div class="main-header" style="margin: 0 auto;text-align:center; background:white;padding:10px;">
        <div>{{params.departmentName}}</div>
        <h2 style="margin:10px;color:red">￥{{params.price}}</h2>
        <div style="font-size: 14px;color:#ff7300" class="tips"><div :v-if="time != null && time != undefined">通知：剩余出场时间为<span>{{time}}</span>超出后需补缴停车费</div></div>
      </div>
      <div class="main-body" style="margin-top: 5px;background:white;padding:10px;">
        <div><span style="color: black;">停车时长</span><span>{{params.duration}}</span></div>
        <div><span style="color: black;">车牌号码</span><span>{{params.plate}}</span></div>
        <div><span style="color: black;">支付时间</span><span>{{params.payTime}}</span></div>
      </div>
    </div>
    <div class="box-close" @click="handleSuccess"><span>完成</span></div>
  </div>
</template>
<style lang="scss" scoped>
.main-body div{
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 30px;
  color: grey;
  font-size: 14px;
}
.box-close {
  position: absolute;
  bottom: 5%;
  left: 30%;
  width: 40%;
  border: 2px solid #5990F4;
  border-radius: 5px;
  padding: 5px 0;
  span {
    color: #5990F4;
  }
}
</style>
<script>
import { closeWindow } from '@/utils/window.js'
export default {
  data () {
    return {
      params: {
        departmentName: '加载中..',
        price: '加载中..',
        plate: '加载中..',
        duration: '加载中..',
        payTime: '加载中..',
        time: '加载中..'
      }
    }
  },
  mounted () {
    // 获取数据
    let query = window.location.href.split('?')[1]
    query = decodeURIComponent(query)
    var objData = query.split('=')[1]
    objData = objData.replace(/%3A/g, ':')
    this.params = JSON.parse(objData)
    // 倒计时
    let minute = this.freeOutTime - 1
    let second = '59'
    let flag = false
    setInterval(() => {
      if (minute === 0 && second === 1) {
        flag = true
      } else {
        second--
        if (second === 0) {
          second = 59
          minute--
          if (minute < 10) minute = '0' + minute
        }
        if (second < 10) second = '0' + second
      }
      if (flag) {
        this.params.time = '00' + '分钟' + '00' + '秒'
      } else {
        this.params.time = minute + '分钟' + second + '秒'
      }
    }, 1000)
  },
  methods: {
    handleSuccess () {
      closeWindow(window)
    }
  }
}
</script>

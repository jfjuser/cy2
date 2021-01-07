<template>
  <div id="app" class="container">
    <router-view v-wechat-title='$route.meta.title'></router-view>
    <div class="park-name" :class="tips">{{params.departmentName}}</div>
    <div class='error'>{{params.errInfo}}</div>
    <div class="btnIn" :class="isCanIn"  @click="init" >请求入场</div>
    <div class="instruction">
      <p>使用同一手机APP在出口处扫码即可缴费出场</p>
    </div>
  </div>
</template>
<style lang="scss" scoped>
body, html{
  margin: 0;
  padding: 0;
}

.container{
  padding: .625rem
}

.instruction{
  text-align: center
}
.park-name{
  text-align: center;
  height: 8.375rem;
  line-height: 8.375rem;
  font-size: 1.50rem;
  color: black;
}
.tips{
  color: #EE3B3B;
  font-size: 1.25rem
}
.btnIn{
  height: 3.00rem;
  width: 90%;
  background: rgb(6,188,7);
  margin: auto;
  line-height: 3.00rem;
  text-align: center;
  color: white;
  font-size: 1.25rem;
  border-radius: .25rem;
}
.canIn{
  background: rgb(6,188,7);
}
.noCanIn{
  background: rgba(6,188,7,0.3);
}
.error{
  color: red;
  margin: .35rem auto;
  font-size: 1.25rem;
}
p{
  font-size: .975rem;
  margin-top: .55rem;
  color: rgb(37, 160, 12);
  text-align: center;
}
</style>
<script>
import { osGetNoPlate, osNoPlateIn } from '@/api/url.js'
import { httpPost } from '@/utils/restful.js'
import { getQueryString } from '@/utils/formatter.js'
export default {
  data () {
    return {
      params: {
        departmentId: undefined,
        departmentName: '请稍后...',
        errInfo: undefined,
        channelId: undefined,
        plate: undefined,
        payType: 8
      },
      isCanIn: 'noCanIn',
      tips: ''
    }
  },
  created () {
    this.params.departmentId = getQueryString('dep')
    this.params.channelId = getQueryString('code')
    if (this.params.departmentId) {
      this.fetchData()
    } else {
      this.$vux.toast.text('二维码已经失效', 'bottom')
    }
  },
  methods: {
    fetchData () {
      let self = this
      let plate = localStorage.getItem('plate')
      const normalPlate = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳]{1}$/
      const newPlate = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}(([0-9]{5}[DF]$)|([DF][A-HJ-NP-Z0-9][0-9]{4}$))/
      httpPost(osGetNoPlate + '/' + self.params.departmentId).then(res => {
        if (!(normalPlate.test(this.plate) || newPlate.test(this.plate))) {
          self.params.plate = res.data.plate
        } else {
          self.params.plate = plate
        }
        self.params.departmentName = res.data.departmentName
        self.isCanIn = 'canIn'
        self.tips = ''
      }).catch((res) => {
        self.isCanIn = 'noCanIn'
        self.tips = 'tips'
        self.params.departmentName = res
      })
    },
    init () {
      let self = this
      if (self.isCanIn === 'noCanIn') {
        return
      }
      if (this.params.plate) {
        self.isCanIn = 'noCanIn'
        self.params.departmentName = '正在请求入场...'
        self.tips = ''
        httpPost(osNoPlateIn, this.params).then(res => {
          if (res.state === 0) {
            self.params.departmentName = res.errmsg
            self.tips = 'tips'
            self.isCanIn = 'canIn'
          } else if (res.state === 2) {
            // 要收费
            localStorage.setItem('plate', this.params.plate)
            this.$router.push({path: '/ospay/pp/', query: {dep: this.departmentId, scene: this.payScene, code: this.$route.query.code}})
          } else {
            localStorage.setItem('plate', this.params.plate)
            this.$router.push({path: '/ospay/np/success/'})
          }
        }).catch((res) => {
          this.$vux.toast.text(res, 'bottom')
          self.isCanIn = 'canIn'
        })
      }
    }
  }
}
</script>

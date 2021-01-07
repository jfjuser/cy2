<template>
  <!-- 畅盈广告 -->
  <div class="box" @click="goAdv">
     <div class="advTitle">
       {{advInfo.advTitle}}
     </div>
     <div class="advSimpleInfo">
       {{advInfo.advSimpleInfo}}
     </div>
     <div class="advResume">
       {{advInfo.advResume}}
     </div>
  </div>
</template>
<style lang="scss" scoped>
</style>
<script>
import { adv } from '@/api/url.js'
import { httpPost, httpGet } from '@/utils/restful.js'
export default {
  data () {
    return {
      advInfo: {}
    }
  },
  props: ['param'],
  created () {
    let param = {
      type: '公众号',
      disLocation: '顶部',
      disStyle: 2,
      happenEvent: 3,
      advType: '车场设备广告'
    }
    this.getAdv(param)
  },
  methods: {
    goAdv () {
      console.log(this.advInfo.advRealUrl, window)
      window.open(this.advInfo.advRealUrl)
    },
    getAdv (param) {
      this.advInfo = {
        'id': 37,
        'modelId': 174,
        'level': null,
        'advCloudUrl': null,
        'advRealUrl': 'http://www.baidu.com',
        'advTitle': '格美特',
        'advSimpleInfo': '我是简要信息',
        'advResume': '我是备注',
        'departmentId': 600,
        'pushBegin': 1577808000000,
        'pushEnd': 1609603199000,
        'adPlanId': 3480
      }
      // httpPost(adv, param).then((res) => {
      //   console.log(res)
      //   if (res.code / 1 === 1) {
      //     this.advInfo = res.data
      //   }
      // })
    }
  }
}
</script>

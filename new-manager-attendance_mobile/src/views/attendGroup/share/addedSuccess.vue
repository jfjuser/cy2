<template>
  <div class="text-c">
    <div class="icon">
      <Icon size='100px' name="checked" color="#04BE02"/>
    </div>
    <div class="text-c text">加入考勤组成功！</div>
    <div class="tagbox">
      <div class="mar-b-10">具体考勤信息可进入<span class="fc-blue">人脸考勤</span>公众号查看</div>
      <van-image
        width="120"
        height="120"
        :src="qrcode"
      />
    </div>
  </div>
</template>

<script>
import { Icon } from 'vant'
import qrcode from '@/assets/qrcode.png'
export default {
  components: {
    Icon
  },
  data () {
    return {
      qrcode
    }
  }
}
</script>

<style scoped>
.icon {
  padding-top: 100px;
}
.text {
  font-size: 20px;
  padding-top: 20px;
}
.tagbox {
  padding-top: 100px;
}
</style>

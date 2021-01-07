<template>
  <div class='amap-page-container'>
    <el-amap
      vid='amapDemo'
      :center='center'
      :zoom='zoom'
      class='amap-demo'>
      <el-amap-marker v-for="(marker, index) in markers" :key="index" :position="marker.position" :events="marker.events" ></el-amap-marker>
    </el-amap>
  </div>
</template>

<style lang="scss" scoped>
  .amap-demo {
    height: 100%;
    width: 100%;
  }
  .amap-logo{
    display: none !important;
    opacity: 0;
  }
  .amap-copyright{
    margin-bottom: -100px !important;
    opacity: 0;
  }
  .el-message__icon{
    display: none !important;
  }
  .el-message .el-icon-success{
    display: none !important;
  }
  .el-icon-success:before{
    content: '' !important;
  }
</style>

<script>
module.exports = {
  props: {
    data: {
      type: Array,
      required: true
    }
  },
  watch: {
    data (curVal, oldValue) {
      this.markersShow(curVal)
    }
  },
  data () {
    return {
      zoom: 4,
      center: [105.167744, 34.087511],
      address: '',
      markers: [],
      detail: []
    }
  },
  mounted () {
    this.markersShow(this.data)
  },
  methods: {
    markersShow (array) {
      this.markers = []
      for (let i = 0; i < array.length; i++) {
        const element = array[i]
        if (!(element.longitude === null || element.latitude === null)) {
          let obj = {
            position: [element.longitude, element.latitude],
            info: element,
            events: {
              click: () => {
                this.markers.forEach(item => {
                  if (obj.position[1] === item.position[1] && obj.position[0] === item.position[0]) {
                    this.$toast({
                      message: `车场名称：${item.info.departmentName}\n现金支付：${item.info.cashFee}\n电子支付：${item.info.epayFee}\n优惠券叠加：${item.info.ticketAddPay}\n固定车充值：${item.info.gdRealFee}`,
                      closeOnClick: true,
                      duration: 5000,
                      position: 'top'
                    })
                  }
                })
              }
            }
          }
          this.markers.push(obj)
        }
      }
    }
  }
}
</script>

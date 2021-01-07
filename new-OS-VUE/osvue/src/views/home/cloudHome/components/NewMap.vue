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
      zoom: 5,
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
                    this.$message({
                      type: 'info',
                      dangerouslyUseHTMLString: true,
                      message: `<p style="margin: 10px;">车场名称: <span style="color:#FF999A;font-size: 16px">${item.info.departmentName}</span></p>
                                <p style="margin: 10px;">现金支付: <span style="color:#FF999A;font-size: 16px">${item.info.cashFee}元</span></p>
                                <p style="margin: 10px;">电子支付: <span style="color:#FF999A;font-size: 16px">${item.info.epayFee}元</span></p>
                                <p style="margin: 10px;">优惠券叠加: <span style="color:#FF999A;font-size: 16px">${item.info.ticketAddPay}元</span></p>
                                <p style="margin: 10px;">固定车充值: <span style="color:#FF999A;font-size: 16px">${item.info.gdRealFee}元</span></p>
                                `
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

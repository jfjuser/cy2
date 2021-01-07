<template>
  <!-- 点击广告跳转页 -->
  <div class="html" >
  </div>
</template>
<script>
import Axios from 'axios'
import qs from 'qs'
export default {
  data () {
    return {
      url: 'https://up.chinanums.com/openpayapi/v1.0/cashier/JsPay',
      openNativePayRequest: this.$route.query.openNativePayRequest
    }
  },
  components: {
  },
  created () {
    let that = this
    Object.keys(that.openNativePayRequest).forEach((key) => {
      if (!that.openNativePayRequest[key]) {
        delete that.openNativePayRequest[key]
      }
    })
    Axios.post(that.url, qs.stringify(that.openNativePayRequest)).then((res) => {
      res.data = res.data.split('/openpayapi/').join('https://up.chinanums.com/openpayapi/')
      document.write(res.data)
    })
  },
  methods: {
  }
}
</script>
<style lang="scss" scoped>
  .out{
    font-size: 14px;
    .in{
      color: red;
    }
  }
  .html{
    width:100%;
    height:100%;
    padding-top:35px;
    box-sizing:border-box;
  }
  .html iframe{
    width:100%;
    height:100%;
    border:none;
    outline:none
  }
  .html .iframe{
    width:100%;
    height:100%;
    border:none;
    outline:none
  }
  .gou{
    margin:25px auto;
  }
  .title,.message{
    margin-bottom:10px;
    font-size:14px;
    color:#000;
  }
  .submit{
    width:90%;
    height:35px;
    margin-top:20px;
    border-radius:5px;
    background:#0089ff;
    margin-bottom:10px;
    line-height:35px;
    text-align:center;
    color:#fff;
  }
  .bottom{
    margin:5px auto 10px;
  }
  .bottom img,.bottom span{
    display:inline-block;
    font-size:14px;
    vertical-align: top;
  }
  .header{
    position:fixed;
    width:100%;
    left:0;
    top:0;
    z-index:111;
  }
</style>

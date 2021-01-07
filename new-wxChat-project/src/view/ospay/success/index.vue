<template>
  <!-- 点击广告跳转页 -->
  <div class="html" >
    <div class="header">
    <p class="bottom" @click="isshow">
           <span>支付成功</span>
           <img src="@/assets/bottom.png" style="width:20px"  />
        </p>
    </div>
    <iframe :src="url"></iframe>
    <div class="content">
      <Popup v-model="showPopup" position="top" :show-mask="true" :hide-on-blur="false">
           <img src="@/assets/gou.png" style="width:100px" class="gou" />
           <p class="title">{{content.title}}</p>
           <p class="message">{{content.message}}</p>
            <p class="submit" @click="submit">确定</p>
           <img src="@/assets/top.png" style="width:30px" @click="submit" />
      </Popup>
      <!-- <Popup v-model="showPopup" position="top" :show-mask="true" :hide-on-blur="false" @on-first-show="ll">
           <img src="@/assets/gou.png" style="width:100px" class="gou" />
           <p class="title">{{content.title}}</p>
           <p class="message">{{content.message}}</p>
            <p class="submit" @click="submit">确定</p>
           <img src="@/assets/top.png" style="width:30px" @click="submit" />
      </Popup> -->
    </div>
  </div>
</template>
<script>
// import { addAdvClick } from '@/api/url.js'
// import { httpGet } from '@/utils/restful.js'
import { Popup } from 'vux'
export default {
  data () {
    return {
      showPopup: true,
      content: {
        icon: '@/assets/gou.png',
        top: '@/assets/top.png',
        bottom: '@/assets/bottom.png',
        title: '支付成功',
        message: '祝您一路顺风 !'
      },
      url: 'https://ac.yunzongnet.com/api/ac/482583821477269504'
    }
  },
  components: {
    Popup
  },
  created () {
    let that = this
    // httpGet(this.url, {}).then(res => {
    //   console.log(res)
    // })
    setTimeout(() => {
      that.showPopup = false
    }, 3500)
  },
  methods: {
    submit () {
      this.showPopup = false
    },
    isshow () {
      this.showPopup = true
    }
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

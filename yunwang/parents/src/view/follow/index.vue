<template>
  <div class="main_body">
    <div class="fun">
      <p class="fun_title">欢迎使用! 长按关注</p>
      <!-- 带图标的关注二维码 -->
      <img v-if="info.appId === 'wx915008be9bda881b'" class="fun_follow" :src="wxFollow">
      <!-- 其他的公众号(不带图标) -->
      <qrcode class="fun-follow-other" v-if="info.appId !== 'wx915008be9bda881b'" size="150" :value="info.followUrl" type="img"></qrcode>
      <!-- <p>推荐关注 - Because! You Can</p> -->
      <ul class="fun_list">
        <li>预付停车费</li>
        <li>月卡续费</li>
        <li>领取优惠券</li>
        <li>获取停车记录</li>
        <li>更多</li>
      </ul>
    </div>
    <div style="clear: both"/>
    <div class="tip-plate">--&#x3000;{{info.plate}}&#x3000;--</div>
    <div class="btn" @click="goPay">去支付</div>
    <div class="btn_tip" @click="tipSetting">
      <div class="btn_tip_img">
        <img :src="tipImg"/>
      </div>
      <div>
        <span class="btn_tip_text">7天内不再提醒</span>
      </div>
    </div>
  </div>
</template>
<script>
import { Qrcode } from 'vux'
import wxFollow from '@/assets/icon/wx_follow.jpg'
import iconNot from '@/assets/icon/icon_not.png'
import iconYes from '@/assets/icon/icon_yes.png'
import { closeFollowTip } from '@/api/url.js'
import { httpPost } from '@/utils/restful.js'
document.title = '关注'
export default {
  components: {
    Qrcode
  },
  data () {
    return {
      wxFollow,
      iconNot,
      iconYes,
      info: {
        appId: '',
        followUrl: '',
        openId: '',
        plate: '',
        isFollow: false,
        payUrl: ''
      },
      createCode: '',
      isNotTip: false,
      tipImg: iconNot
    }
  },
  mounted () {
    // 临时绑定成功,待关注提交
    this.info = this.$route.query.info
  },
  methods: {
    goPay () {
      if (this.info && this.info.payUrl && this.info.payUrl !== '') {
        if (this.isNotTip) {
          // 关闭提醒
          httpPost(closeFollowTip, this.info).then(res => {
            window.location.href = this.info.payUrl
          }).catch(() => {
            window.location.href = this.info.payUrl
          })
        } else {
          window.location.href = this.info.payUrl
        }
      } else {
        this.$vux.toast.text('识别失败，请退出重试', 'bottom')
      }
    },
    goFollow () {
      if (this.info && this.info.followUrl && this.info.followUrl !== '') {
        window.location.href = this.info.followUrl
        // window.location.href = 'https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=MzIxNzkzMTQ5Mw==&scene=126&bizpsid=0#wechat_redirect='
      } else {
        this.$vux.toast.text('识别失败，请退出重试', 'bottom')
      }
    },
    tipSetting () {
      this.isNotTip = !this.isNotTip
      if (this.isNotTip) {
        this.tipImg = this.iconYes
      } else {
        this.tipImg = this.iconNot
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  .main_body {
    position: absolute;
    width: 100%;
    height: 100%;
    background-image: url("../../assets/icon/wx_follow_backgroup.jpg") !important;
    background-repeat:no-repeat;
    background-size:100% 100%;
    -moz-background-size:100% 100%;
  }
  p {
    color: #26a2ff;
  }
  .fun {
    width: 100%;
    margin: 15px auto 0;
    display: block;
  }
  .fun_title {
    font-size: 16px;
    letter-spacing: 3px;
    margin-top: 15%;
    color: #fff;
  }
  .fun_follow {
    margin: 0 auto;
    width: 150px;
    height: 150px;
    border-radius: 10px;
  }
  .fun-follow-other {
    padding: 10px;
    border-radius: 10px;
    background-color: #fff;
    width: 150px;
    margin: 0 auto;
  }
  .tip-plate {
    width: 100%;
    margin: 15px auto 0;
    display: block;
    text-align: center;
    color: #E6A23C;
    font-weight: bold;
  }
  .btn {
    width: 50%;
    margin: 20px auto 0;
    height: 50px;
    line-height: 50px;
    background-color: #02ecf9cc;
    white-space: nowrap;
    color: #f0f0f0;
    border-radius: 20em;
    border: 1px solid #078bbe;
    cursor: pointer;
  }
  .btn:hover {
  }
  .btn:focus {}
  .btn_follow {
    color: #e6a23c;
    border-color: rgba(230,162,60,.4);
    background-color: rgba(230,162,60,.2);
  }
  .btn_tip {
    margin: 10px auto 0;
    height: 26px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .btn_tip_img {
    width: 16px;
    height: 16px;
    margin-right: 5px;
    line-height: 20px;
    img {
      width: 16px;
      height: 16px;
    }
  }
  .btn_tip_text {
    color: #f0f0f0;
    font-size: 14px;
    line-height: 26px;
    height: 26px;
    margin-bottom: 4px;
  }
  ul li {
    margin-top: 5px;
    margin-left: 12%;
    width: 33%;
    float: left;
    text-align: left;
    font-size: 16px;
    color: #f0f0f0;
    letter-spacing: 1px;
  }
</style>

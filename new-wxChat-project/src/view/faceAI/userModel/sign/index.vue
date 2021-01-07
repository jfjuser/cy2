<template>
  <div class="sign-theme">
    <div class="box-main">
      <div class="box-point">
        <flexbox>
          <flexbox-item v-for="(item, i) in 7" :key="i" :span="1/7">+{{rule['s' + (i + 1)]}}</flexbox-item>
        </flexbox>
      </div>
      <div class="box-index">
        <div class="box-line"><div class="box-line-back"><div :class="lineStyleFormatter()"></div></div></div>
        <div class="box-index-s">
          <flexbox>
            <flexbox-item :class="indexStyleFormatter(i)" v-for="(item, i) in 7" :key="i" :span="1/7">{{i + 1}}</flexbox-item>
          </flexbox>
        </div>
      </div>
      <div class="box-btn" @click="handleClick()">签到</div>
    </div>
    <div class="box-tip">
      <divider class="line">签到说明</divider>
      <p>-&#x3000;每日可签到一次</p>
      <p>-&#x3000;连续签到获得更多积分</p>
      <p>-&#x3000;每七天轮回一个周期</p>
      <p>-&#x3000;积分可用于兑换增值功能</p>
    </div>
    <!-- 弹出层 -->
    <div v-transfer-dom>
      <x-dialog :show.sync="signLoading" :hide-on-blur="true" :dialog-style="{'background-color': 'transparent'}">
        <div class="box-dialog">
          <div class="box-dialog-body">
            <p class="box-dialog-p">已连续签到<span class="box-dialog-span">{{index}}</span>天</p>
            <div class="box-dialog-p box-dialog-flex" v-show="!flag">
              <img src="@/assets/icon/wx/sign/icon-poi.png"/>
              <div class="box-dialog-span">+{{rule.type === 1 ? rule['s' + (index % 7)] : (index >= 7 ? rule.s7 : rule['s' + (index % 7)])}}</div>
            </div>
            <div class="box-dialog-p box-dialog-flex" v-show="flag">
              今天已签到
            </div>
            <div class="box-dialog-p box-dialog-btn" @click="signLoading = false">明天签到可获得{{rule.type === 1 ? rule['s' + ((index + 1) % 7)] : ((index + 1) >= 7 ? rule.s7 : rule['s' + ((index + 1) % 7)])}}积分</div>
          </div>
        </div>
        <div class="box-dialog-btn-close" @click="signLoading = false"><img src="@/assets/icon/wx/sign/dialog-close.png"/></div>
      </x-dialog>
    </div>
  </div>
</template>
<script>
import { httpGet, httpPost } from '@/utils/restful'
import { getSignRule, getSignRecord, signIn } from '@/api/url.js'
import { getWxInfo } from '@/utils/userInfo.js'
import { Flexbox, FlexboxItem, Divider, XDialog, TransferDomDirective as TransferDom } from 'vux'
export default {
  directives: {
    TransferDom
  },
  components: {
    Flexbox,
    FlexboxItem,
    Divider,
    XDialog
  },
  data () {
    return {
      signLoading: false,
      wxInfo: undefined,
      rule: {},
      index: 0,
      // 判断有没签到过
      flag: false
    }
  },
  created () {
    this.loadRule()
    this.wxInfo = getWxInfo()
    console.log(this.wxInfo)
    if (this.wxInfo) {
      this.loadRecords()
    } else {
      this.$vux.toast.text('未授权访问, 请关闭后重进', 'bottom')
    }
  },
  methods: {
    loadRule () {
      httpGet(getSignRule).then(res => {
        this.rule = res.data
        console.log(this.rule)
      }).catch((res) => {})
    },
    loadRecords () {
      let params = {
        account: this.wxInfo.account,
        unicode: this.wxInfo.unicode
      }
      httpGet(getSignRecord, params).then(res => {
        this.index = res.data.index
      }).catch((res) => {})
    },
    lineStyleFormatter () {
      return 'box-line-bule box-line-bule' + (this.index % 7)
    },
    indexStyleFormatter (i) {
      if (i >= (this.index % 7)) {
        return 'box-index-s0 box-index-s1'
      } else {
        return 'box-index-s0 box-index-s2'
      }
    },
    handleClick () {
      let params = {
        account: this.wxInfo.account,
        unicode: this.wxInfo.unicode
      }
      httpPost(signIn, params).then(res => {
        if (res.message.indexOf('签到过了') > -1) {
          this.flag = true
        } else {
          this.index++
          this.flag = false
        }
        this.signLoading = true
      }).catch((res) => {
        // console.log(res)
      })
    }
  }
}
</script>
<style lang='scss' scoped>
.sign-theme {
  height: 100%;
  background-image: url('./../../../../assets/icon/wx/sign/back.jpg');
  background-size: 100% auto !important;
  background-repeat: repeat-x;
  position: relative !important;
}
.box-main {
  .box-point {
    position: absolute;
    top: 24%;
    left: 10%;
    width: 60%;
    padding: .9375rem 14% .9375rem 6%;
    color: rgb(163, 168, 179);
  }
  .box-index {
    position: absolute;
    top: 30%;
    left: 3%;
    width: 94%;
    .box-index-s {
      width: 65%;
      padding: 0 11%;
      .box-index-s0 {
        width: 30px;
        height: 30px;
        line-height: 1.875rem;
        text-align: center;
        border-radius: 50%;
        z-index: 999;
      }
      .box-index-s1 {
        background-color: rgb(201, 223, 250);
        color: #1571FF;
      }
      .box-index-s2 {
        background-color: #1571FF;
        color: white;
      }
    }
    .box-line {
      position: relative;
      .box-line-back {
        position: absolute;
        top: 12px;
        height: 3px;
        background-color: rgb(201, 223, 250);
        width: 100%;
        height: .4375rem;
        .box-line-bule {
          height: 100%;
          background-color: #1571FF;
        }
        .box-line-bule0 {
          width: 0;
        }
        .box-line-bule1 {
          width: 16%;
        }
        .box-line-bule2 {
          width: 28%;
        }
        .box-line-bule3 {
          width: 40%;
        }
        .box-line-bule4 {
          width: 52%;
        }
        .box-line-bule5 {
          width: 64%;
        }
        .box-line-bule6 {
          width: 76%;
        }
        .box-line-bule7 {
          width: 100%;
        }
      }
    }
  }
}
.box-btn {
  position: absolute;
  top: 39%;
  left: 20%;
  color: white;
  letter-spacing: .1875rem;
  padding: .4375rem .9375rem;
  background-color: #0068FF;
  width: 50%;
  border-radius: .625rem;
  cursor: pointer;
}
.box-tip {
  position: absolute;
  top: 56%;
  font-size: .875rem;
  text-align: left;
  p {
    padding: 1% 14%;
  }
  .line {
    padding: 2% 10%;
  }
}
.box-dialog {
  width: 306px;
  height: 330px;
  margin: 0 auto;
  background-image: url('./../../../../assets/icon/wx/sign/dialog-back.png');
  background-size: 100% 100% !important;
  z-index: 1001;
  position: relative;
  .box-dialog-body {
    position: absolute;
    width: 100%;
    height: 150px;
    top: 180px;
    .box-dialog-span {
      color: #1571FF;
      font-size: 18px;
      padding: 0 .1875rem;
    }
    .box-dialog-p {
      margin: 10px auto;
    }
    .box-dialog-flex {
      display: flex;
      justify-content: center;
      img {
        width: 20px;
        height: 20px;
      }
      .box-dialog-span {
        font-size: 16px;
      }
    }
    .box-dialog-btn {
      padding: .625rem 1rem;
      color: white;
      border-radius: 1.25rem;
      background-color: #1571FF;
      width: 60%;
      margin: 0 auto;
      font-size: 14px;
    }
  }
}
.box-dialog-btn-close {
  z-index: 1001;
  padding-top: 35px;
  img {
    width: 35px;
    height: 35px;
  }
}
</style>

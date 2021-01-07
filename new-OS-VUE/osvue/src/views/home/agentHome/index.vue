<template>
  <div class="box-container">
    <div class="box-header">
      <el-row class="box-header-row" :gutter="40">
        <el-col class="box-header-fun" :span="6" v-for="(item, index) in funHeader" :key="index" @click.native="getEventRules('FACE_VIP', function(){dialogOpenVip=true})">
          <div class="box-header-fun-title">{{item.title}}</div>
          <div class="box-header-fun-remark">{{item.remark}}</div>
          <div class="box-header-fun-img"><img :src="item.img"/></div>
        </el-col>
      </el-row>
    </div>
    <div class="box-body">
      <div class="box-main">
        <p class="box-title"><img src="@/assets/face/vip/icon-left.png"/>更多计费特权<img src="@/assets/face/vip/icon-right.png"/></p>
        <el-row class="box-row" :gutter="40">
          <el-col class="box-fun" :span="6" v-for="(item, index) in fun" :key="index" @click.native="handleLoadRules(item)">
            <div class="box-header-fun-title">{{item.title}}</div>
            <div class="box-header-fun-remark">{{item.remark}}</div>
            <div class="box-header-fun-img"><img :src="item.img"/></div>
          </el-col>
        </el-row>
        <p class="box-title"><img src="@/assets/face/vip/icon-left.png"/>相机状态<img src="@/assets/face/vip/icon-right.png"/></p>
        <el-table
          stripe
          style="width: 100%"
          max-height="600"
          :data="aiTokens"
          v-loading.body="listLoading"
          element-loading-text="加载中..."
          :default-sort = "{prop: 'channelName', order: 'descending'}"
          border fit highlight-current-row>
          <el-table-column label="通道名" sortable align="center" prop="localName"></el-table-column>
          <el-table-column label="物理地址" sortable align="center" prop="mac"></el-table-column>
          <el-table-column label="登录时长" sortable align="center" prop="loginAt">
            <template slot-scope="scope">
              {{timeDuration(scope.row.status === 1?(new Date().getTime() - scope.row.loginAt)/1000 : 0)}}
            </template>
          </el-table-column>
          <el-table-column label="状态" sortable align="center" prop="status">
            <template slot-scope="scope">
              {{statusFormatter(scope.row.status)}}
            </template>
          </el-table-column>
          <el-table-column label="会员有效期" sortable align="center" prop="effTime">
            <template slot-scope="scope">
              {{timeFormatter(scope.row.effTime)}}
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="box-info">
        <el-button  @click="getEventRules('FACE_VIP', function(){dialogOpenVip=true})" class="btn-open" type="warning" round>立即开通会员</el-button>
        <div class="box-info-card">
          <div class="box-info-depName">{{form.departmentName}}</div>
          <div style="padding: 10px">
            <el-row align="center">
              <el-col :span="12" class="box-info-a a1">
                <img class="box-image" src="@/assets/face/vip/icon-info1.png"/>
                <div>剩余积分</div>
                <div>{{eventOpenInfo.point}}</div>
              </el-col>
              <el-col :span="12" class="box-info-a a2" @click.native.prevent="handlePointPay()">
                <img class="box-image" src="@/assets/face/vip/icon-info2.png"/>
                <div style="height: 40px; line-height: 40px">充值积分</div>
              </el-col>
            </el-row>
            <el-row align="center">
              <el-col :span="12" class="box-info-a a3">
                <img class="box-image" src="@/assets/face/vip/icon-info3.png"/>
                <div>有效相机数</div>
                <div>{{effDevice ? effDevice : 0}}</div>
              </el-col>
              <el-col :span="12" class="box-info-a a4" @click.native.prevent="getEventRules('FACE_VIP', function(){dialogOpenVip=true})">
                <img class="box-image" src="@/assets/face/vip/icon-info4.png"/>
                <div style="height: 40px; line-height: 40px">{{effTip}}</div>
              </el-col>
            </el-row>
          </div>
        </div>
        <div class="box-info-card2">
          <p class="title orange">特权</p>
          <p>
            <span>登录云</span>
            <el-button type="success" icon="el-icon-check" size="mini" circle></el-button>
          </p>
          <p class="orange">
            <span>人脸管理</span>
            <el-button type="success" icon="el-icon-check" size="mini" circle></el-button>
          </p>
          <p>
            <span>进出记录</span>
            <el-button type="success" icon="el-icon-check" size="mini" circle></el-button>
          </p>
          <p class="orange">
            <span>云存储图片</span>
            <el-button type="success" v-if="isOpen.o1" icon="el-icon-check" size="mini" circle></el-button>
            <el-button type="danger" v-if="!isOpen.o1" icon="el-icon-close" size="mini" circle></el-button>
          </p>
          <p>
            <span>云下发用户</span>
            <el-button type="success" v-if="isOpen.o2" icon="el-icon-check" size="mini" circle></el-button>
            <el-button type="danger" v-if="!isOpen.o2" icon="el-icon-close" size="mini" circle></el-button>
          </p>
          <p class="orange">
            <span>云回收站</span>
            <el-button type="success" v-if="isOpen.o3" icon="el-icon-check" size="mini" circle></el-button>
            <el-button type="danger" v-if="!isOpen.o3" icon="el-icon-close" size="mini" circle></el-button>
          </p>
          <p>
            <span>考勤管理</span>
            <el-button type="success" v-if="effTip !=='非会员'" icon="el-icon-check" size="mini" circle></el-button>
            <el-button type="danger" v-if="effTip === '非会员'" icon="el-icon-close" size="mini" circle></el-button>
          </p>
        </div>
      </div>
    </div>
    <el-dialog title="开通会员" :visible.sync="dialogOpenVip" width="700px">
      <el-tag type="success">活动：每开通一台相机增送1000积分 </el-tag>
      <div class="dialog-fee">
        <div class="dialog-left">
          <div class="box-fee-list">
            <p><span class="fee-title">请选择相机</span></p>
            <el-checkbox-group v-model="payForm.mac" size="small">
              <el-checkbox border v-for="item in aiTokens" :key="item.id" :label="item.mac" checked style="margin-bottom: 5px; margin-left: 20px">{{item.localName}}</el-checkbox>
            </el-checkbox-group>
            <p><span class="fee-title">开通时长</span></p>
            <div class="box-fee">
              <div class="box-fee-left">一年</div>
              <div class="box-fee-right">
                <p>¥<span class="fee-new-price">{{(payForm.mac.length * (rules.points / 1000) * 12).toFixed(2)}}</span><span class="fee-old-price">¥{{(payForm.mac.length * (rules.points / 1000 / rules.discount) * 12).toFixed(2)}}</span></p>
                <p><span class="fee-sub-price">立省{{((payForm.mac.length * (rules.points / 1000 / rules.discount) * 12) - (payForm.mac.length * (rules.points / 1000) * 12)).toFixed(2)}}元</span></p>
              </div>
            </div>
          </div>
          <div class="box-fee-list">
            <p><span class="fee-title">预存积分</span></p>
            <el-button type="warning" plain @click="handlePointPay()">
              {{changePointRules.id ? changePointRules.points + '积分(' + changePointRules.price + '元)' : '请选择'}}
            </el-button>
          </div>
          <div class="box-fee-list">
            <p><span class="fee-title">支付方式</span></p>
            <el-button type="success" plain @click="handlePay()">微信支付</el-button>
            <!-- <el-button type="info" plain @click="handlePoint()">代理商积分抵扣</el-button> -->
          </div>
        </div>
        <div class="dialog-right">
          <el-row align="center" class="rules-row-title">
            <el-col class="col">计算规则</el-col>
          </el-row>
          <el-row align="center" class="rules-row">
            <el-col :span="12" class="rules-col col">充值相机数</el-col>
            <el-col :span="12" class="col">{{payForm.mac.length}}</el-col>
          </el-row>
          <el-row align="center" class="rules-row">
            <el-col :span="12" class="rules-col col">每台相机月费用</el-col>
            <el-col :span="12" class="col">x {{(rules.points / 1000 / rules.discount).toFixed(3)}}</el-col>
          </el-row>
          <el-row align="center" class="rules-row">
            <el-col :span="12" class="rules-col col">折扣  <el-tag type="success">折后{{(rules.points / 1000).toFixed(3)}}/月</el-tag></el-col>
            <el-col :span="12" class="col">x {{rules.discount}}</el-col>
          </el-row>
          <el-row align="center" class="rules-row">
            <el-col :span="12" class="rules-col col">开通时长</el-col>
            <el-col :span="12" class="col">x 12</el-col>
          </el-row>
          <el-row align="center" class="rules-row" v-if="changePointRules.id">
            <el-col :span="12" class="rules-col col">预存积分</el-col>
            <el-col :span="12" class="col">+ {{changePointRules.price}}</el-col>
          </el-row>
          <el-row align="center" class="rules-row">
            <el-col :span="12" class="rules-col col">应付  <el-tag type="success" size="mini">取整</el-tag></el-col>
            <el-col :span="12" class="col">¥ {{(payForm.mac.length * ((rules.points / 1000) * 12) + (changePointRules.price ? changePointRules.price : 0)).toFixed(2)}}</el-col>
          </el-row>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogOpenVip = false">返回</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="item.title" :visible.sync="dialogRulesVisible" width="600px">
      <div class="dialog-fee">
        <div class="dialog-left" style="width: 350px">
          <p>{{rules.eventName}}</p>
          <el-row align="center" class="rules-row-title">
            <el-col :span="8" class="rules-col col">会员类型</el-col>
            <el-col :span="16" class="col">计费规则</el-col>
          </el-row>
          <el-row align="center" class="rules-row">
            <el-col :span="8" class="rules-col col">超级会员</el-col>
            <el-col :span="16" class="col">暂不支持</el-col>
          </el-row>
          <el-row align="center" class="rules-row">
            <el-col :span="8" class="rules-col col">会员</el-col>
            <el-col :span="16" class="col">{{item.tip}}</el-col>
          </el-row>
          <el-row align="center" class="rules-row">
            <el-col :span="8" class="rules-col col">非会员</el-col>
            <el-col :span="16" class="col">-</el-col>
          </el-row>
          <p>注: 1元 ≈ 1000积分, 充值满足条件自动开通</p>
          <p style="margin-left:150px" v-if="rules.openPoint >= 100000000">(暂不支持)</p>
          <p style="margin-left:150px" v-if="rules.openPoint > 0 && rules.openPoint < 100000000">(预存{{rules.openPoint}}积分)</p>
        </div>
        <div style="float: right; margin-right: 20px; width: 172px;">
          <p style="text-align: center">人脸助理移动版</p>
          <img src="@/assets/face/faceWx.jpg" style="width: 172px; height: 172px;"/>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogRulesVisible = false">返回</el-button>
      </div>
    </el-dialog>
    <el-dialog title="预存积分" :visible.sync="dialogPointVisible" width="700px">
      <el-row :gatter="20">
        <el-col v-for="item in pointList" :key="item.id" :span="12" class="box-point-body">
          <div class="icard">
            <div class="icard-main">
              <div>{{item.name}}</div>
              <div><count-to class="card-panel-num" name="a1" :decimals="2" :suffix="item.points > 10000 ? (item.points > 100000000 ? '亿' : '万') : ' '" :startVal="0" :endVal="item.points > 10000 ? (item.points > 100000000 ? item.points / 100000000 : item.points / 10000) : item.points" :duration="1500"></count-to>积分</div>
              <div><count-to class="card-panel-num" name="b1" :decimals="2" :suffix="item.price > 10000 ? (item.price > 100000000 ? '亿' : '万') : ' '" :startVal="0" :endVal="item.price > 10000 ? (item.price > 100000000 ? item.price / 100000000 : item.price / 10000) : item.price" :duration="1500"></count-to>元</div>
            </div>
            <div class="icard-bottom text-center" @click="selectPointRules(item)">选择</div>
          </div>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogPointVisible = false">返回</el-button>
      </div>
    </el-dialog>
    <el-dialog title="扫一扫支付,10分钟内有效" :visible.sync="dialogWxPayVisible" width="500px" @close="onCloseWebsocket">
      <div class="box-code">
        <div class="box-qrcode"><div id="qrcode" ref="qrcode"></div></div>
        <img class="img-weixin" src="@/assets/img_weixin_pay.png"/>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogWxPayVisible = false">返回</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<style lang="scss" scoped>
.box-container {
  background-color: #ffffff;
  height: 100%;
  width: 100%;
}
.box-header {
  margin: 0 auto;
  height: 350px;
  display: flex;
  align-items: flex-end;
  align-content: flex-end;
  flex-direction: row;
  justify-content: center;
  background-image: url('./../../../assets/pg2.png');
  background-size: 100% 100% !important;
  .box-header-row {
    width: 70%;
    min-width: 800px;
    max-width: 1000px;
    .box-header-fun {
      background-color: rgb(253, 253, 253);
      height: 200px;
      width: 21%;
      padding: 30px 0 !important;
      margin: 0 2%;
      text-align: center;
      border-top-right-radius: 10px;
      border-top-left-radius: 10px;
      box-shadow: 0 0 2px 0 rgba(0, 0, 0, .1);
      cursor: pointer;
      .box-header-fun-title {
        font-size: 20px;
        margin: 5px 0;
      }
      .box-header-fun-remark {
        font-size: 12px;
        color: rgb(153, 153, 153);
        margin: 5px 0;
      }
      .box-header-fun-img img {
        margin: 10px 0;
        height: 64px;
      }
    }
    .box-header-fun:hover {
      animation: forwards;
      animation-name: fadeIn;
      animation-duration: 0.5s;
      animation-iteration-count: 1;
      animation-delay: 0s;
    }
    @keyframes fadeIn {
      0% {
        padding: 30px 0;
      }
      100% {
        padding: 38px 0;
      }
    }
  }
}
.box-body {
  display: flex;
  border-top: 1px solid rgb(245, 245, 245);
}
.box-main {
  height: 100%;
  padding: 20px;
  width: 80%;
  .box-title {
    font-size: 24px;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    img {
      width: 24px;
      margin: 0 15px;
    }
  }
  .box-row {
    width: 70%;
    margin-left: 15% !important;
  }
  .box-fun {
    padding: 30px 0 !important;
    text-align: center;
    border: 1px solid #fff;
    cursor: pointer;
    .box-header-fun-title {
      font-size: 20px;
      margin: 5px 0;
    }
    .box-header-fun-remark {
      font-size: 12px;
      color: rgb(153, 153, 153);
      margin: 5px 0;
    }
    .box-header-fun-img img {
      margin: 10px 0;
      height: 64px;
    }
  }
  .box-fun:hover {
    border: 1px solid #cccccc;
    box-shadow: 0 0 2px 0 rgba(0, 0, 0, .1);
  }
}
.box-info {
  width: 20%;
  padding: 30px 40px 30px 10px;
  .btn-open {
    margin: 0 auto 20px;
    width: 100%;
    font-size: 16px;
    letter-spacing: 5px;
    color: #67c23a;
    background-color: #f0f9eb;
    border: 1px solid #c2e7b0 !important;
    box-shadow: 0 0 1.25rem #ddf8d0 !important;
  }
  .box-info-card {
    border: 1px solid #b3d8ff !important;
    box-shadow: 0 0 1.25rem #bee7e9 !important;
    color: #62a1e4;
    text-align: center;
    .box-info-depName {
      font-size: 20px;
      border-bottom: 1px solid #b3d8ff !important;
      padding: 15px 0;
    }
    .box-image {
      width: 48px;
      height: 48px;
    }
    .box-info-a {
      padding: 2px 10px;
      height: 100px;
      font-size:0.8rem;
      cursor: pointer;
    }
    .a1 {
      border-right: 1px solid #b3d8ff !important;
      border-bottom: 1px solid #b3d8ff !important;
    }
    .a2 {
      border-bottom: 1px solid #b3d8ff !important;
    }
    .a3 {
      border-right: 1px solid #b3d8ff !important;
    }
  }
  .box-info-card2 {
    color: #eb9f2d;
    background: #fdf6ec;
    border: 1px solid #ebc893 !important;
    box-shadow: 0 0 1.25rem #f3d9b3 !important;
    margin-top: 30px;
    p {
      padding: 15px 10px;
      margin: 0 !important;
      clear: both;
    }
    button {
      float: right;
      margin-right: 20px;
    }
    .title {
      font-size: 20px;
      text-align: center;
      color: #eb9f2d;
    }
    .orange {
      background: #ffe7c5;
    }
  }
}
.dialog-fee {
  display: flex;
  min-height: 290px;
}
.dialog-left {
  width: 50%;
}
.dialog-right {
  width: 45%;
  margin-top: 25px;
}
.fee-title {
  font-size: 16px;
  width: 100px !important;
  padding-left: 10px;
}
.box-fee-list {
  .box-fee {
    background-color: #ecf5ff;
    border: 1px solid #b3d8ff !important;
    box-shadow: 0 0 1.25rem #bee7e9 !important;
    border-radius: 10px;
    width: 240px;
    height: 90px;
    .box-fee-left {
      float: left;
      width: 60px;
      text-align: center;
      line-height: 88px;
      letter-spacing: 5px;
      background-color: #ddedff;
      border-right: 1px solid #b3d8ff;
      border-top-left-radius: 10px;
      border-bottom-left-radius: 10px;
    }
    .box-fee-right {
      float: right;
      width: 160px;
      line-height: 20px;
      color: rgb(226, 24, 24);
      font-size: 14px;
      padding: 0 5px;
      .fee-new-price {
        color: rgb(226, 24, 24);
        font-size: 20px;
        margin-left: 2px;
      }
      .fee-old-price {
        text-decoration: line-through #a3a3a3;
        color: #a3a3a3;
        margin-left: 15px;
        font-size: 14px;
      }
    }
  }
}
.rules-row-title {
  color: rgb(248, 183, 32);
  border: 1px solid #F9D681;
  text-align: center;
  background-color: #FFE8B1;
  .rules-col {
    border-right: 1px solid #F9D681;
  }
}
.rules-row {
  border-bottom: 1px solid #F9D681;
  border-left: 1px solid #F9D681;
  border-right: 1px solid #F9D681;
  background-color: #fff;
  text-align: center;
  .rules-col {
    border-right: 1px solid #F9D681;
  }
}
.col {
  height: 40px;
  line-height: 40px;
}
.box-code {
  background: url('./../../../assets/img_weixin_pay_back.png') no-repeat 5px 5px;
  background-size: 100% 100%;
  width: 440px;
  height: 480px;
  position: relative;
}
.box-qrcode {
  position: absolute;
  left: 90px;
  top: 65px;
}
.img-weixin {
  position: absolute;
  left: 120px;
  top: 370px;
  width: 220px;
}
.box-point-body {
  padding: 20px;
  .icard {
    border: 1px solid #ddd;
    height: 200px;
    border-radius: 15px;
    display: flex;
    flex-direction: column;
    // overflow: hidden;
    .icard-main {
      flex: 1;
      overflow: hidden;
      background-color: #6dbdf2;
      border-top-left-radius: 15px;
      border-top-right-radius: 15px;
      color: #fff;
      padding: 20px;
      font-size: 18px;
      div + div {
        margin-top: 10px;
      }
    }
    .icard-bottom {
      line-height: 50px;
      letter-spacing: 10px;
      font-size: 18px;
      position: relative;
      &:hover {
        cursor: pointer;
      }
      &::before, &::after {
        content: ' ';
        display: inline-block;
        width: 20px;
        height: 20px;
        background-color: #fff;
        border-radius: 50%;
      }
      &::before {
        position: absolute;
        top: -10px;
        left: -10px;
        box-shadow: -1px 0px 0px 0 rgba(0, 0, 0, 0.3) inset;
      }
      &::after {
        position: absolute;
        top: -10px;
        right: -10px;
        box-shadow: 1px 0px 0px 0 rgba(0, 0, 0, 0.3) inset;
      }
    }
  }
}
</style>
<script>
import QRCode from 'qrcodejs2'
import CountTo from 'vue-count-to'
import { faceFeeWebSocket } from '@/api/websocket.js'
import funHeaderImg1 from '@/assets/face/vip/icon-funHeader1.png'
import funHeaderImg2 from '@/assets/face/vip/icon-funHeader2.png'
import funHeaderImg3 from '@/assets/face/vip/icon-funHeader3.png'
import funHeaderImg4 from '@/assets/face/vip/icon-funHeader4.png'
import funImg1 from '@/assets/face/vip/icon-fun1.png'
import funImg2 from '@/assets/face/vip/icon-fun2.png'
import funImg3 from '@/assets/face/vip/icon-fun3.png'
import funImg4 from '@/assets/face/vip/icon-fun4.png'
import { department, faceMonthlyFeeWxPay, facePointFeeWxPay, feeEvent, getAICamera, pointsRules, getEventOpen, reflushLoginType } from '@/api/url'
import { httpGet, httpPost } from '@/utils/restful'
import { timeDuration, statusFormatter, timeFormatter } from '@/utils/formatter'
import { setLoginType, getLoginType, getLoginDepId } from '@/utils/cookie'
export default {
  name: 'agent-home',
  components: {
    CountTo
  },
  data () {
    return {
      form: {
        id: undefined,
        departmentName: undefined,
        departmentTypeId: undefined,
        phone: undefined,
        email: undefined,
        resume: undefined,
        createAt: undefined
      },
      rules: {}, // 收费规则
      changePointRules: {}, // 充值积分规则
      aiTokens: [],
      payForm: {
        mac: []
      },
      item: {},
      eventOpenInfo: {},
      pointList: [],
      effDevice: 0,
      effTip: '体验期',
      dialogOpenVip: false,
      dialogWxPayVisible: false,
      dialogRulesVisible: false,
      dialogPointVisible: false,
      dialogRulesTitle: '规则',
      listLoading: false,
      timeDuration: timeDuration,
      statusFormatter: statusFormatter,
      timeFormatter: timeFormatter,
      depType: [],
      funHeader: [
        {id: 1, title: '全球首发', remark: '助力管理人脸, 操作更便捷', img: funHeaderImg1},
        {id: 2, title: '双同步', remark: '硬件自动直连, 配置更快', img: funHeaderImg2},
        {id: 3, title: '人脸管理', remark: '异地掌控, 随设随下', img: funHeaderImg3},
        {id: 4, title: '进出记录', remark: '人员进出记录', img: funHeaderImg4}
      ],
      fun: [
        {id: 5, title: '云备份图片', value: 'IMG_SAVE_FEE', tip: '积分/Gb/月(至少开启一个月)', remark: '大容量图片存储服务', img: funImg1},
        {id: 6, title: '云下发用户', value: 'SEND_FEE', tip: '积分/条*人脸机数目', remark: '下发用户数据', img: funImg2},
        {id: 7, title: '云回收站', value: 'RECOVERY_FEE', tip: '积分/条', remark: '随时恢复误删除数据', img: funImg3},
        {id: 8, title: '考勤管理', remark: '人脸打卡,考勤统计', img: funImg4}
      ],
      isOpen: {
        o1: false,
        o2: false,
        o3: false,
        o4: false
      },
      ws: null
    }
  },
  methods: {
    isMain () {
      // 有没欠费
      let loginType = getLoginType()
      // 登录的部门
      let loginDepId = getLoginDepId()
      // 当前部门
      let depId = this.$store.getters.departmentId
      // console.log(loginType + '-' + loginDepId + '-' + depId)
      if (loginType) {
        let text
        if (Number(loginType) === 99) {
          // 完全欠费且和登录的部门id是一样的
          if (Number(loginDepId) === Number(depId)) {
            text = ['会员有效期已过', '收费使用的功能将全部停用', '请尽快充值']
          } else {
            text = ['会员有效期已过', '收费使用的功能将全部停用', '请提醒客户尽快充值']
          }
        } else if (Number(loginType) === 98) {
          if (Number(loginDepId) === Number(depId)) {
            text = ['部分相机会员有效期已过', '为避免影响使用', '请尽快充值']
          } else {
            text = ['部分相机会员有效期已过', '为避免影响使用', '请提醒客户尽快充值']
          }
        }
        if (text) {
          const newDatas = []
          const h = this.$createElement
          for (const i in text) {
            newDatas.push(h('p', null, text[i]))
          }
          this.$confirm(h('div', null, newDatas), '提示', {
            confirmButtonText: '确定',
            type: 'warning',
            center: true,
            showCancelButton: false,
            closeOnClickModal: false
          }).then(() => {
          }).catch(() => {
          })
        }
      }
    },
    // 获取部门详情
    getDepInfo () {
      httpGet(department + '/' + this.$store.getters.departmentId).then(res => {
        this.form = Object.assign({}, res.data)
      }).catch(() => {})
    },
    getEventOpen () {
      let params = {
        departmentId: this.$store.getters.departmentId,
        type: 0
      }
      httpGet(getEventOpen, params).then(res => {
        this.eventOpenInfo = res.data
        for (let i = 0; i < this.eventOpenInfo.openList.length; i++) {
          if (this.eventOpenInfo.openList[i].eventUnicode === 'IMG_SAVE_FEE') {
            this.isOpen.o1 = true
          } else if (this.eventOpenInfo.openList[i].eventUnicode === 'SEND_FEE') {
            this.isOpen.o2 = true
          } else if (this.eventOpenInfo.openList[i].eventUnicode === 'RECOVERY_FEE') {
            this.isOpen.o3 = true
          }
        }
      }).catch(() => {})
    },
    getEventRules (str, fun) {
      httpGet(feeEvent + '/' + str).then(res => {
        if (res.data === null) {
          // 默认值
          this.rules = {
            points: 0,
            discount: 1,
            eventName: ''
          }
        } else {
          this.rules = res.data
        }
        fun()
      }).catch(() => {
        // 默认值
        this.rules = {
          points: 0,
          discount: 1,
          eventName: ''
        }
        fun()
      })
    },
    fetchData () {
      // 查所有
      let params = {
        offset: 1,
        limit: 100,
        departmentId: this.$store.getters.departmentId
      }
      this.listLoading = true
      httpGet(getAICamera, params).then(res => {
        if (res.data === null) {
          this.aiTokens = []
          this.effDevice = 0
        } else {
          this.aiTokens = res.data.rows
          let date = new Date()
          this.effDevice = 0
          let titleTemp
          let messageTemp
          for (let i = 0; i < this.aiTokens.length; i++) {
            // console.log(i * 2000)
            if (this.aiTokens[i].effTime < date.getTime()) {
              // 提示过期
              titleTemp = '会员过期'
              messageTemp = '相机: <strong>' + this.aiTokens[i].localName + '</strong> (' + this.aiTokens[i].mac + ')'
              setTimeout(this.notifyTip, i * 1000, titleTemp, messageTemp)
            } else {
              this.effDevice += 1
              let bettTime = this.aiTokens[i].effTime - date.getTime()
              if (bettTime < 30 * 24 * 60 * 60 * 1000) {
                // 提示即将过期
                titleTemp = '会员即将过期'
                messageTemp = '<p>相机: <strong>' + this.aiTokens[i].localName + '</strong> (' + this.aiTokens[i].mac + ')' + '</p><p>剩余时间: ' + this.timeDuration(bettTime / 1000) + '</p>'
                setTimeout(this.notifyTip, i * 1000, titleTemp, messageTemp)
              }
            }
          }
          // 判断是体验期还是部分会员还是会员
          if (this.aiTokens.length === this.effDevice) {
            this.effTip = '普通会员'
          } else if (this.effDevice > 0) {
            this.effTip = '部分相机有效'
          } else {
            this.effTip = '非会员'
          }
        }
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    notifyTip (title, message) {
      // console.log(title + '-' + message)
      // 提示过期
      this.$notify({
        type: 'warning',
        title: title,
        offset: 60,
        duration: 15000,
        dangerouslyUseHTMLString: true,
        message: message
      })
    },
    handleLoadRules (item) {
      let self = this
      if (item.value) {
        this.getEventRules(item.value, function () {
          self.item.tip = self.rules.points + item.tip
          self.item.title = item.title
          self.dialogRulesVisible = true
        })
      } else {
        self.rules.eventName = item.remark
        self.item.title = item.title
        self.item.tip = '免费体验'
        self.rules.openPoint = 0
        self.dialogRulesVisible = true
      }
    },
    handlePointPay () {
      httpGet('pv/' + pointsRules, {type: 0, price: 20000}).then(res => {
        this.pointList = res.data
        // console.log(this.pointList)
        this.dialogPointVisible = true
      }).catch(() => {
        this.$message.error('加载失败')
        this.dialogPointVisible = false
      })
    },
    selectPointRules (item) {
      this.changePointRules = item
      if (!this.dialogOpenVip) {
        this.handlePoint()
      } else {
        this.dialogPointVisible = false
      }
    },
    handlePay () {
      if (this.aiTokens == null || this.aiTokens.length === 0) {
        this.$message.error('请先绑定相机后再进行充值')
        return
      }
      if (this.payForm.mac.length === 0) {
        this.$message.error('请选择需充值的相机')
        return
      }
      if (this.rules.points === 0) {
        this.$message.success('免费体验期中')
        return
      }
      // 生成微信支付二维码
      this.dialogWxPayVisible = true
      // 开启websocket
      this.websocket()
      // 延迟调用
      this.$nextTick(() => {
        let params = Object.assign(this.payForm, {departmentId: this.$store.getters.departmentId, pointId: this.changePointRules.id})
        httpPost(faceMonthlyFeeWxPay, params).then(res => {
          let QrCodeHTML = this.$refs.qrcode
          QrCodeHTML.innerHTML = ' '
          this.createQrCode()
          this.codeUrl = res.data
          this.createCode.clear()
          this.createCode.makeCode(this.codeUrl)
        }).catch(() => {})
      })
    },
    handlePoint () {
      // 生成微信支付二维码
      this.dialogWxPayVisible = true
      // 开启websocket
      this.websocket()
      // 延迟调用
      this.$nextTick(() => {
        let params = {departmentId: this.$store.getters.departmentId, pointId: this.changePointRules.id}
        httpPost(facePointFeeWxPay, params).then(res => {
          let QrCodeHTML = this.$refs.qrcode
          QrCodeHTML.innerHTML = ' '
          this.createQrCode()
          this.codeUrl = res.data
          this.createCode.clear()
          this.createCode.makeCode(this.codeUrl)
        }).catch(() => {})
      })
    },
    // 生成二维码
    createQrCode () {
      this.createCode = new QRCode('qrcode', {
        text: this.codeUrl,
        width: 260,
        height: 260
      })
    },
    // -------------------------websocket -------------------------- \\
    websocket () {
      // 检查浏var ws;览器是否支持WebSocket
      if (window.WebSocket) {
        if (this.ws !== null) {
          this.ws.close()
        }
        this.ws = new WebSocket(faceFeeWebSocket + this.$store.getters.departmentId)
        // 连接websocket
        this.ws.onopen = this.initWebSocket
        this.ws.onmessage = this.onmessageWebSocket
        // 链接失败
        this.ws.onerror = this.onerrorWebSocket
      } else {
        this.$message({
          message: '您的浏览器暂时不支持支付结果展示，可尝试换浏览器!',
          type: 'error',
          duration: 4 * 1000
        })
      }
    },
    initWebSocket () {},
    // 接收消息
    onmessageWebSocket (evt) {
      this.$notify({
        type: 'success',
        title: evt.data,
        offset: 60,
        message: '订单已成功支付, 3秒后为您刷新页面'
      })
      setTimeout(() => {
        let loginType = getLoginType()
        if (this.dialogOpenVip && Number(loginType) === 99) {
          httpGet(reflushLoginType + '/' + this.$store.getters.departmentId).then(res => {
            if (res.data > 0 && res.data !== 99) {
              // 充值导致状态改变了
              setLoginType(res.data)
              this.$router.push({ path: '/login' })
            } else {
              window.location.reload()
            }
          }).catch(() => {})
        } else {
          window.location.reload()
        }
      }, 3000)
    },
    // 链接失败
    onerrorWebSocket () {
      this.$message({
        message: '无法实时显示支付状态信息！',
        type: 'error',
        duration: 4 * 1000
      })
    },
    onCloseWebsocket () {
      this.ws.close()
    }
  },
  mounted () {
    this.isMain()
    this.getDepInfo()
    this.fetchData()
    this.getEventOpen()
  }
}
</script>

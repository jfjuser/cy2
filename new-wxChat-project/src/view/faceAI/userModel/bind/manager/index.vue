<template>
  <div class="theme">
    <div class="box-body">
      <div class="title">{{getDepInfo().departmentName}}</div>
      <div class="box-type">
        <div class="box-content box-shadow1" v-for="(item, index) in dutyList" :key="index">
          <div class="box-title">账户:</div>
          <div class="box-div">业主:<span>{{item.leader}}</span></div>
          <div class="box-div">地址:<span>{{item.addr}}</span></div>
          <div class="box-div">手机:<span>{{item.phone}}</span></div>
          <div class="box-div">已录:<span>{{item.count}}人</span></div>
          <div class="box-btn" @click="unBind(item.id)">解绑</div>
        </div>
      </div>
      <div class="box-type">
        <div class="box-content box-shadow1" v-for="(item, index) in userList" :key="index">
          <div class="box-div">姓名:<span>{{item.userName}}</span></div>
          <div class="box-div">手机:<span>{{item.phone}}</span></div>
          <div class="box-div">有效期:<span>{{formatterTime2(item.beginTime)}}-{{formatterTime2(item.endTime)}}</span></div>
          <div class="box-btn" @click="unBind(item.id)">解绑</div>
        </div>
      </div>
    </div>
    <div class="box-wave">
      <div class="wave"></div>
    </div>
  </div>
</template>
<script>
import { httpGet, httpPost } from '@/utils/restful'
import { listBindFaceInfo, unBindFace } from '@/api/url.js'
import { getDepInfo, getWxInfo } from '@/utils/userInfo.js'
import { formatterTime2 } from '@/utils/formatter.js'
export default {
  components: {
  },
  data () {
    return {
      getDepInfo: getDepInfo,
      formatterTime2: formatterTime2,
      form: {
        departmentId: getDepInfo().departmentId,
        account: getWxInfo().account,
        unicode: getWxInfo().unicode
      },
      dutyList: [],
      userList: []
    }
  },
  created () {
    this.getList()
  },
  methods: {
    getList () {
      httpGet(listBindFaceInfo, this.form).then(res => {
        if (res.data) {
          if (res.data.dutyList) {
            this.dutyList = res.data.dutyList
          }
          if (res.data.userList) {
            this.userList = res.data.userList
          }
        }
      }).catch((err) => {
        this.$vux.toast.text(err, 'bottom')
      })
    },
    unBind (id) {
      let params = Object.assign(this.form, {id: id})
      httpPost(unBindFace, params).then(res => {
        this.getList()
        this.$vux.toast.text(res.message, 'bottom')
      }).catch((err) => {
        this.$vux.toast.text(err, 'bottom')
      })
    }
  }
}
</script>
<style lang='scss' scoped>
.box-body {
  display: flex;
  flex-direction: column;
  .title {
    font-size: 18px;
    padding: .5rem 0;
    color: rgb(5, 179, 223);
    letter-spacing: .375rem;
    background-color: rgb(170, 232, 255);
    border-bottom: 1px solid rgb(33, 209, 253);
    border-bottom-left-radius: 1.5rem;
    border-bottom-right-radius: 1.5rem;
  }
  .box-type {
    width: 100%;
    margin-top: 1.25rem;
    z-index: 10000 !important;
  }
  .box-content {
    position: relative;
    text-align: center;
    height: 8rem;
    width: 70%;
    margin: 0 auto;
    padding: 1rem;
    /*一定要设置背景颜色，否则为透明的话 折叠的效果会看不出来！*/
    background-color: white;
  }
  .box-title {
    text-align: left;
  }
  .box-div {
    text-align: left;
    margin-left: 2.5rem;
  }
  .box-div span {
    margin-left: .625rem;
  }
  .box-btn {
    position: absolute;
    bottom: 1rem;
    right: 1.5rem;
    border: 1px solid rgb(117, 117, 117);
    border-radius: .3125rem;
    padding: .1875rem .625rem;
    cursor: pointer;
  }
}
.box-shadow1{
  position:relative;
  // box-shadow: 0 1px 4px rgba(0,0,0,0.3),0 0 40px rgba(0,0,0,0.1) inset;
  box-shadow: 0 1px 4px rgba(0,0,0,0.3)
}
.box-shadow1:after{
  content: "";
  position:absolute;
  background:transparent;
  top:50%; // 设置宽高仅仅设置上下左右边距是为了让系统自动定位。
  bottom: 1px;
  left: 10px;
  right: 10px;
  z-index: -1; //将副阴影置于主阴影下
  box-shadow: 0 0 20px rgba(0,0,0,0.7);
  border-radius: 100px/10px;
}
.wave {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 30%;
  background-color: rgb(118, 218, 255);
  &::before,&::after{
    content: "";
    position: absolute;
    width: 440px;
    height: 400px;
    top: 0;
    left: 50%;
    background-color: rgba(255, 255, 255, .4);
    border-radius: 45%;
    transform: translate(-50%, -70%) rotate(0);
    animation: rotate 6s linear infinite;
    z-index: 10;
  }
  &::after {
    border-radius: 47%;
    background-color: rgba(255, 255, 255, .9);
    transform: translate(-50%, -70%) rotate(0);
    animation: rotate 10s linear -5s infinite;
    z-index: 1;
  }
}
@keyframes rotate {
  50% {
    transform: translate(-50%, -73%) rotate(180deg);
  } 100% {
    transform: translate(-50%, -70%) rotate(360deg);
  }
}
</style>
